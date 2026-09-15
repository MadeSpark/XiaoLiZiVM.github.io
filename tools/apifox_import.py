# -*- coding: utf-8 -*-
"""从 Apifox 导出文件解析「小栗子虚拟机」API，并生成网站/编辑器共用的数据。

数据模型（api-support.json）：
{
  "version": "1.0.0",
  "updatedAt": "2026-09-14",
  "source": "小栗子虚拟机.apifox.json",
  "statusTypes": [{"id","name","color","level"}],
  "frameworks":  [{"id","name","short","color","note"}],
  "categories":  ["消息发送", ...],
  "apis": [{
      "id", "type", "name", "category", "method", "url", "contentType",
      "description", "deprecated", "params": [...], "paramsText",
      "bodyExample", "bodyText", "responseExample", "note",
      "support": {"mengchen": "full", ...}
  }]
}

直接运行本文件可（重新）生成网站根目录下的：
  - api-support.json
  - api-support.data.js   （网站实际加载的文件）
"""

import json
import os
import datetime

# ────────────────────────────────────────────────────────────────────────────
# 默认配置（均可在编辑器中修改）
# ────────────────────────────────────────────────────────────────────────────

STATUS_TYPES = [
    {"id": "full", "name": "完全支持", "short": "完全", "color": "#22c55e", "level": 3},
    {"id": "partial", "name": "部分支持", "short": "部分", "color": "#f59e0b", "level": 2},
    {"id": "none", "name": "不支持", "short": "不支持", "color": "#ef4444", "level": 1},
    {"id": "unknown", "name": "未测试", "short": "未测", "color": "#94a3b8", "level": 0},
]

DEFAULT_FRAMEWORKS = [
    {"id": "mengchen", "name": "萌尘", "short": "萌尘", "color": "#7c5cff",
     "note": "萌尘框架（WebSocket 对接）"},
    {"id": "dulu", "name": "Dulu", "short": "Dulu", "color": "#3dd6ff",
     "note": "Dulu 框架（WebSocket 对接）"},
    {"id": "onebot11", "name": "OneBot V11", "short": "OB11", "color": "#22c55e",
     "note": "OneBot V11 标准"},
]

# 接口类型(type) -> 分类
CATEGORY_BY_TYPE = {
    1: "账号与框架", 4: "账号与框架",
    2: "消息发送", 3: "消息发送", 8: "消息发送", 25: "消息发送", 26: "消息发送",
    7: "群管理", 10: "群管理", 11: "群管理", 12: "群管理", 15: "群管理",
    16: "群管理", 19: "群管理", 20: "群管理", 29: "群管理", 31: "群管理",
    14: "好友与资料", 18: "好友与资料", 21: "好友与资料",
    22: "好友与资料", 24: "好友与资料",
    5: "媒体与文件", 6: "媒体与文件", 9: "媒体与文件", 13: "媒体与文件",
    17: "媒体与文件", 23: "媒体与文件", 27: "媒体与文件", 28: "媒体与文件",
    32: "媒体与文件",
    30: "高级能力", 33: "高级能力",
}

CATEGORY_ORDER = ["账号与框架", "消息发送", "群管理", "好友与资料", "媒体与文件", "高级能力"]

# 已废弃的接口类型
DEPRECATED_TYPES = {13}

# 请求中所有接口都需要的公共参数
COMMON_PARAM_NAMES = {"type", "myUin"}

DEFAULT_URL = "http://127.0.0.1:2081/"
CONTENT_TYPE = "application/json"


# ────────────────────────────────────────────────────────────────────────────
# Apifox 解析
# ────────────────────────────────────────────────────────────────────────────

def _as_bool(v):
    if isinstance(v, bool):
        return v
    if isinstance(v, str):
        return v.strip().lower() in ("1", "true", "yes", "y")
    return bool(v)


def _collect_api_items(node, acc):
    """递归收集 apiCollection 中所有 http 接口。"""
    if isinstance(node, list):
        for item in node:
            _collect_api_items(item, acc)
        return
    if not isinstance(node, dict):
        return
    if "api" in node and isinstance(node.get("api"), dict):
        acc.append(node)
    for child in node.get("items", []) or []:
        if isinstance(child, dict) and "api" not in child:
            _collect_api_items(child, acc)
        elif isinstance(child, dict):
            _collect_api_items(child, acc)


def load_apifox_apis(source):
    """读取 Apifox 导出内容，返回 (原始数据, 原始接口条目列表)。

    source 既可以是文件路径，也可以是已经解析好的 dict —— 编辑器允许用户
    自己挑文件，此时内容由浏览器直接上传，不经过磁盘。
    """
    if isinstance(source, dict):
        data = source
    else:
        with open(source, "r", encoding="utf-8") as f:
            data = json.load(f)
    if not isinstance(data, dict) or "apiCollection" not in data:
        raise ValueError("这似乎不是 Apifox 导出的接口文件（缺少 apiCollection 字段）")
    items = []
    _collect_api_items(data.get("apiCollection", []), items)
    if not items:
        raise ValueError("文件里没有解析到任何接口（apiCollection 为空）")
    return data, items


def _guess_placeholder(ptype):
    if ptype == "integer":
        return 0
    if ptype in ("boolean", "bool"):
        return False
    if ptype in ("number", "float", "double"):
        return 0
    return ""


def _norm_value(p):
    """把 Apifox 的 example 归一化成合适的 JSON 值。"""
    ex = p.get("example")
    ptype = p.get("type") or "string"
    if ex is None or (isinstance(ex, str) and ex.strip() == ""):
        return _guess_placeholder(ptype)
    if ptype == "integer":
        try:
            return int(str(ex).strip())
        except ValueError:
            return ex
    if ptype in ("boolean", "bool"):
        return _as_bool(ex)
    return ex


def parse_apis(source):
    """把 Apifox 接口转换成统一的 API 描述（POST + JSON Body）。"""
    data, items = load_apifox_apis(source)
    apis = []
    for idx, item in enumerate(items, start=1):
        api = item.get("api") or {}
        name = (item.get("name") or api.get("operationId") or ("接口%02d" % idx)).strip()
        query = (api.get("parameters") or {}).get("query") or []

        params = []
        api_type = None
        for p in query:
            pname = p.get("name")
            if not pname:
                continue
            ptype = p.get("type") or "string"
            if pname == "type":
                try:
                    api_type = int(str(p.get("example")).strip())
                except (TypeError, ValueError):
                    api_type = None
            params.append({
                "name": pname,
                "type": "integer" if ptype == "integer" else str(ptype),
                "required": _as_bool(p.get("required")),
                "description": p.get("description") or "",
                "example": _norm_value(p),
                "common": pname in COMMON_PARAM_NAMES,
            })

        if api_type is None:
            api_type = idx

        body = {p["name"]: p["example"] for p in params}
        body_text = json.dumps(body, ensure_ascii=False, indent=2)

        resp_examples = api.get("responseExamples") or []
        resp_text = ""
        if resp_examples:
            raw = resp_examples[0].get("data") or ""
            resp_text = raw.strip()

        if not params:
            params_text = "无参数"
        else:
            params_text = "、".join(p["name"] for p in params)

        apis.append({
            "id": "api-%d" % api_type,
            "type": api_type,
            "name": name,
            "category": CATEGORY_BY_TYPE.get(api_type, "其他"),
            "method": "POST",
            "url": api.get("path") or DEFAULT_URL,
            "contentType": CONTENT_TYPE,
            "description": (api.get("description") or "").strip(),
            "deprecated": api_type in DEPRECATED_TYPES or "废弃" in name,
            "params": params,
            "paramsText": params_text,
            "bodyExample": body,
            "bodyText": body_text,
            "responseExample": resp_text,
            "note": "",
            "support": {},
        })

    apis.sort(key=lambda x: x["type"])
    return apis


# ────────────────────────────────────────────────────────────────────────────
# 数据集构建
# ────────────────────────────────────────────────────────────────────────────

def _default_support(frameworks):
    return {fw["id"]: "full" for fw in frameworks}


def sort_categories(categories):
    """按 CATEGORY_ORDER 排序，未知分类排到最后（按名称）。

    编辑器保存与 Apifox 导入都走这个函数，避免两条路径下的分组顺序来回变。
    """
    return sorted(
        categories,
        key=lambda c: (CATEGORY_ORDER.index(c) if c in CATEGORY_ORDER else 99, c),
    )


# 重新导入 Apifox 时，保留用户在编辑器中手工填写/调整过的字段
PRESERVE_FIELDS = ("note", "description", "category", "method", "url", "contentType")

# 状态类型 id -> 默认简称
STATUS_SHORT = {s["id"]: s.get("short") or s["name"] for s in STATUS_TYPES}


def merge_status_types(previous):
    """以默认状态类型为基准，合并用户自定义的名称/简称/颜色/顺序。"""
    if not previous:
        return [dict(s) for s in STATUS_TYPES]
    merged = []
    seen = set()
    for s in previous:
        sid = s.get("id")
        if not sid or sid in seen:
            continue
        seen.add(sid)
        item = dict(s)
        base = next((d for d in STATUS_TYPES if d["id"] == sid), {})
        for k, v in base.items():
            if not item.get(k):
                item[k] = v
        # 兼容早期数据：short 曾被写成与 name 相同，这里纠回默认简称
        d_short = STATUS_SHORT.get(sid)
        if d_short and item.get("short") == item.get("name") and d_short != item.get("name"):
            item["short"] = d_short
        item.setdefault("short", STATUS_SHORT.get(sid, item.get("name", sid)))
        item.setdefault("level", 0)
        merged.append(item)
    for d in STATUS_TYPES:
        if d["id"] not in seen:
            merged.append(dict(d))
    return merged


def source_label(source, source_name=None):
    """数据集里 source 字段的展示名。"""
    if source_name:
        return os.path.basename(source_name)
    if isinstance(source, (str, bytes, os.PathLike)):
        return os.path.basename(source)
    return "（浏览器上传的 Apifox 文件）"


def build_dataset(source, previous=None, source_name=None):
    """从 Apifox 构建完整数据集。

    source: Apifox 导出文件的路径，或已解析好的 dict（编辑器上传的文件）。
    previous: 已有的数据集（dict）。若提供，则保留其框架配置、状态类型、
              接口备注/说明/分类以及各框架的支持情况（按接口类型 type 匹配）。
    source_name: 上传文件时的原始文件名，仅用于记录来源。
    """
    apis = parse_apis(source)

    if previous:
        frameworks = previous.get("frameworks") or DEFAULT_FRAMEWORKS
        status_types = merge_status_types(previous.get("statusTypes"))
        old_apis = {int(a.get("type", -1)): a for a in (previous.get("apis") or [])}
    else:
        frameworks = DEFAULT_FRAMEWORKS
        status_types = merge_status_types(None)
        old_apis = {}

    fw_ids = [fw["id"] for fw in frameworks]
    status_ids = [st["id"] for st in status_types]

    for a in apis:
        old = old_apis.get(a["type"])
        if not old:
            a["support"] = _default_support(frameworks)
            continue
        for field in PRESERVE_FIELDS:
            if field in old and old[field] not in (None, ""):
                a[field] = old[field]
        a["deprecated"] = bool(old.get("deprecated")) or bool(a.get("deprecated"))
        support = old.get("support") or {}
        merged = {}
        for fid in fw_ids:
            v = support.get(fid, "full")
            merged[fid] = v if v in status_ids else "full"
        a["support"] = merged

    categories = []
    for a in apis:
        if a["category"] not in categories:
            categories.append(a["category"])
    categories = sort_categories(categories)

    return {
        "version": "1.0.0",
        "updatedAt": datetime.date.today().isoformat(),
        "source": source_label(source, source_name),
        "statusTypes": status_types,
        "frameworks": frameworks,
        "categories": categories,
        "apis": apis,
    }


# ────────────────────────────────────────────────────────────────────────────
# 导出
# ────────────────────────────────────────────────────────────────────────────

JS_BANNER = (
    "/* 小栗子虚拟机 · API 兼容数据\n"
    " * 该文件由「API 支持情况编辑器」导出，请勿手工修改。\n"
    " * 更新接口支持情况：打开 tools/api_editor.py 编辑后导出即可。\n"
    " * 导出时间：{time}\n"
    " */\n"
)


def dumps_js(dataset):
    """生成 api-support.data.js 的内容。"""
    payload = json.dumps(dataset, ensure_ascii=False, indent=2)
    # 避免 JS 解析陷阱
    for raw, esc in (("\u2028", "\\u2028"), ("\u2029", "\\u2029"), ("</", "<\\/")):
        payload = payload.replace(raw, esc)
    stamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M")
    return JS_BANNER.format(time=stamp) + "window.XLZ_API_SUPPORT = " + payload + ";\n"


BACKUP_DIRNAME = os.path.join(".workbuddy", "backups")
BACKUP_KEEP = 20
LEGACY_SUFFIX = ".bak"


def _drop_legacy_backup(path):
    """早期版本会把 .bak 写在网站根目录，这里顺手清掉，保持部署目录干净。"""
    legacy = path + LEGACY_SUFFIX
    if os.path.exists(legacy):
        try:
            os.remove(legacy)
        except OSError:
            pass


def _backup(root, path):
    """把即将被覆盖的文件备份到 <网站目录>/.workbuddy/backups/，并只保留最近 N 份。"""
    _drop_legacy_backup(path)
    if not os.path.exists(path):
        return None
    folder = os.path.join(root, BACKUP_DIRNAME)
    try:
        os.makedirs(folder, exist_ok=True)
        stamp = datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
        name = "%s.%s.bak" % (os.path.basename(path), stamp)
        dst = os.path.join(folder, name)
        with open(path, "rb") as src, open(dst, "wb") as out:
            out.write(src.read())
    except OSError:
        return None

    try:
        olds = sorted(
            (f for f in os.listdir(folder)
             if f.startswith(os.path.basename(path) + ".") and f.endswith(".bak")),
            reverse=True,
        )
        for stale in olds[BACKUP_KEEP:]:
            os.remove(os.path.join(folder, stale))
    except OSError:
        pass
    return dst


def write_outputs(root, dataset, also_json=True):
    """把数据集写入网站目录，返回写出的文件路径列表。"""
    written = []
    js_path = os.path.join(root, "api-support.data.js")
    _backup(root, js_path)
    with open(js_path, "w", encoding="utf-8", newline="\n") as f:
        f.write(dumps_js(dataset))
    written.append(js_path)

    if also_json:
        json_path = os.path.join(root, "api-support.json")
        _backup(root, json_path)
        with open(json_path, "w", encoding="utf-8", newline="\n") as f:
            f.write(json.dumps(dataset, ensure_ascii=False, indent=2) + "\n")
        written.append(json_path)

    return written


def load_dataset(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def default_apifox_path(root):
    """在网站目录里寻找 .apifox.json 文件。"""
    candidates = []
    try:
        for fn in os.listdir(root):
            if fn.lower().endswith(".apifox.json"):
                candidates.append(os.path.join(root, fn))
    except OSError:
        pass
    candidates.sort(key=lambda p: len(os.path.basename(p)))
    return candidates[0] if candidates else None


# ────────────────────────────────────────────────────────────────────────────

def reset_support(dataset, status_id="full"):
    """把所有接口在所有框架下的支持状态重置为指定值。"""
    for a in dataset.get("apis", []):
        a["support"] = {fw["id"]: status_id for fw in dataset.get("frameworks", [])}
    return dataset


def main():
    import argparse

    ap = argparse.ArgumentParser(description="从 Apifox 导出文件生成 api-support.json / api-support.data.js")
    ap.add_argument("--reset", action="store_true",
                    help="生成后把所有接口的支持状态重置为「完全支持」")
    ap.add_argument("--fresh", action="store_true",
                    help="忽略现有 api-support.json，完全重新生成（会丢失已填写的状态）")
    args = ap.parse_args()

    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    apifox = default_apifox_path(root)
    if not apifox:
        raise SystemExit("未在 %s 找到 .apifox.json 文件" % root)

    prev_path = os.path.join(root, "api-support.json")
    previous = None
    if not args.fresh and os.path.exists(prev_path):
        previous = load_dataset(prev_path)

    ds = build_dataset(apifox, previous)
    if args.reset or previous is None:
        reset_support(ds)

    for p in write_outputs(root, ds):
        print("written:", p)
    print("apis: %d | frameworks: %d" % (len(ds["apis"]), len(ds["frameworks"])))


if __name__ == "__main__":
    main()
