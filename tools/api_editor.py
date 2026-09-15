# -*- coding: utf-8 -*-
"""小栗子虚拟机 · API 支持情况编辑器（本地 Web 应用）

只依赖 Python 标准库，无需安装任何第三方包。

用法：
    python tools/api_editor.py            # 启动并自动打开浏览器
    python tools/api_editor.py --port 9000 --no-browser

功能：
    * 矩阵式快捷编辑：每个接口 × 每个框架的支持情况，点一下就改
    * 画笔状态 + 整列/整行批量设置、一键全部兼容
    * 增删改框架（列）、增删改状态类型（颜色/名称）
    * 重新导入接口列表：点「重新导入」会弹出文件选择窗口，自己选 .apifox.json 即可
      （按接口类型 type 保留已填写的兼容情况）
    * 一键导出 api-support.data.js + api-support.json 到网站目录（保存前自动备份 .bak）
"""

import argparse
import datetime
import json
import os
import sys
import threading
import webbrowser
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(HERE)                 # 网站根目录
sys.path.insert(0, HERE)

from apifox_import import (                  # noqa: E402
    build_dataset,
    default_apifox_path,
    dumps_js,
    load_dataset,
    sort_categories,
    write_outputs,
)

DATA_JSON = os.path.join(ROOT, "api-support.json")
UI_HTML = os.path.join(HERE, "editor_ui.html")
APIFOX = default_apifox_path(ROOT)


# ────────────────────────────────────────────────────────────────────────────

def today():
    return datetime.date.today().isoformat()


def load_current():
    """读取当前数据集；缺失或损坏时从 Apifox 现场生成。"""
    note = None
    if os.path.exists(DATA_JSON):
        try:
            return load_dataset(DATA_JSON), None
        except (OSError, ValueError) as exc:
            note = "读取 api-support.json 失败（%s），已改为从 Apifox 重新生成。" % exc
    if not APIFOX:
        if note:
            raise RuntimeError(note)
        raise RuntimeError("未找到 api-support.json，也未在网站目录找到 .apifox.json 文件")
    return build_dataset(APIFOX), note


def paths_info():
    return {
        "root": ROOT,
        "json": os.path.relpath(DATA_JSON, ROOT).replace("\\", "/"),
        "js": "api-support.data.js",
        "apifox": os.path.basename(APIFOX) if APIFOX else "(未找到)",
    }


def sanitize(dataset):
    """对前端提交的数据做最小必要校验，避免写坏数据文件。"""
    if not isinstance(dataset, dict):
        raise ValueError("数据格式错误")
    if not isinstance(dataset.get("frameworks"), list) or not dataset["frameworks"]:
        raise ValueError("框架列表不能为空")
    if not isinstance(dataset.get("apis"), list) or not dataset["apis"]:
        raise ValueError("接口列表不能为空")
    status_types = dataset.get("statusTypes")
    if not isinstance(status_types, list) or not status_types:
        raise ValueError("状态类型不能为空")
    valid = {s.get("id") for s in status_types if isinstance(s, dict)}
    fw_ids = [f.get("id") for f in dataset["frameworks"] if isinstance(f, dict)]
    if not fw_ids or any(not i for i in fw_ids):
        raise ValueError("框架 id 不能为空")
    if len(set(fw_ids)) != len(fw_ids):
        raise ValueError("存在重复的框架 id")

    cleaned = []
    for a in dataset["apis"]:
        if not isinstance(a, dict):
            continue
        support = a.get("support") or {}
        a["support"] = {
            fid: (support.get(fid) if support.get(fid) in valid else "unknown")
            for fid in fw_ids
        }
        cleaned.append(a)
    dataset["apis"] = cleaned

    cats = []
    for a in cleaned:
        c = a.get("category") or "其他"
        if c not in cats:
            cats.append(c)
    dataset["categories"] = sort_categories(cats)
    return dataset


def save_dataset(dataset):
    dataset = sanitize(dataset)
    dataset["updatedAt"] = today()
    written = write_outputs(ROOT, dataset)
    return {"ok": True, "written": written, "dataset": dataset}


# ────────────────────────────────────────────────────────────────────────────

class Handler(BaseHTTPRequestHandler):
    server_version = "XLZApiEditor/1.0"
    protocol_version = "HTTP/1.1"

    # ── 工具 ────────────────────────────────────────────────────
    def _send(self, code, body, ctype="application/json; charset=utf-8", extra=None):
        if isinstance(body, str):
            body = body.encode("utf-8")
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.send_header("Connection", "close")
        for k, v in (extra or {}).items():
            self.send_header(k, v)
        self.end_headers()
        # 本地单用户工具，一律短连接，省去 keep-alive 的串包风险
        self.close_connection = True
        try:
            self.wfile.write(body)
        except (BrokenPipeError, ConnectionResetError):
            pass

    def _json(self, code, payload):
        self._send(code, json.dumps(payload, ensure_ascii=False), "application/json; charset=utf-8")

    def _read_body(self):
        """一次性读完请求体（必须读完，否则 keep-alive 连接上会串包）。"""
        length = int(self.headers.get("Content-Length") or 0)
        return self.rfile.read(length) if length > 0 else b""

    def _read_json(self, raw):
        if not raw:
            return {}
        return json.loads(raw.decode("utf-8"))

    def log_message(self, fmt, *args):
        sys.stderr.write("  %s\n" % (fmt % args))

    # ── 路由 ────────────────────────────────────────────────────
    def do_GET(self):
        path = self.path.split("?", 1)[0]

        if path in ("/", "/index.html", "/editor"):
            return self._serve_ui()

        if path == "/api/state":
            try:
                dataset, note = load_current()
            except Exception as exc:                      # noqa: BLE001
                return self._json(500, {"error": str(exc)})
            payload = {"dataset": dataset, "paths": paths_info(), "today": today()}
            if note:
                payload["note"] = note
            return self._json(200, payload)

        if path == "/api/download":
            return self._download()

        if path == "/favicon.ico":
            return self._send(204, b"", "image/x-icon")

        return self._json(404, {"error": "not found"})

    def do_POST(self):
        path = self.path.split("?", 1)[0]
        raw = self._read_body()
        try:
            if path == "/api/save":
                body = self._read_json(raw)
                data = body.get("dataset") if isinstance(body, dict) and "dataset" in body else body
                return self._json(200, save_dataset(data))
            if path == "/api/import":
                return self._import(raw)
            if path == "/api/open-folder":
                try:
                    if os.name == "nt":
                        os.startfile(ROOT)               # noqa: S606
                    elif sys.platform == "darwin":
                        os.system('open "%s"' % ROOT)    # noqa: S605
                    else:
                        os.system('xdg-open "%s"' % ROOT)  # noqa: S605
                except Exception as exc:                 # noqa: BLE001
                    return self._json(200, {"ok": False, "error": str(exc)})
                return self._json(200, {"ok": True})
        except ValueError as exc:
            return self._json(400, {"error": str(exc)})
        except Exception as exc:                          # noqa: BLE001
            return self._json(500, {"error": "%s: %s" % (type(exc).__name__, exc)})
        return self._json(404, {"error": "not found"})

    # ── 具体实现 ────────────────────────────────────────────────
    def _serve_ui(self):
        if not os.path.exists(UI_HTML):
            return self._json(500, {"error": "缺少编辑器界面文件 editor_ui.html"})
        with open(UI_HTML, "rb") as f:
            data = f.read()
        self._send(200, data, "text/html; charset=utf-8")

    def _import(self, raw):
        """重新导入 Apifox 接口列表。

        两种来源：
          * 请求体里带 content —— 用户在页面里自己挑选的文件（内容由浏览器上传）；
          * 请求体为空 —— 退回网站目录下的 .apifox.json 文件（命令行/兜底用）。
        """
        body = self._read_json(raw)
        if not isinstance(body, dict):
            body = {}
        previous = body.get("previous")
        if previous is not None and not isinstance(previous, dict):
            previous = None

        content = body.get("content")
        name = str(body.get("name") or "").strip()

        if content:
            if not isinstance(content, str):
                return self._json(400, {"error": "上传的文件内容格式不正确"})
            try:
                data = json.loads(content)
            except ValueError as exc:
                return self._json(400, {"error": "选择的文件不是合法的 JSON（%s）" % exc})
            dataset = build_dataset(data, previous, source_name=name or None)
            return self._json(200, {
                "dataset": dataset,
                "today": today(),
                "apifox": name or "（上传的文件）",
                "fromUpload": True,
            })

        if not APIFOX:
            return self._json(400, {"error": "未在网站目录找到 .apifox.json 文件"})
        dataset = build_dataset(APIFOX, previous)
        return self._json(200, {
            "dataset": dataset,
            "today": today(),
            "apifox": os.path.basename(APIFOX),
            "fromUpload": False,
        })

    def _download(self):
        fmt = "js"
        if "?" in self.path:
            query = self.path.split("?", 1)[1]
            for part in query.split("&"):
                if part.startswith("format="):
                    fmt = part.split("=", 1)[1]
        try:
            dataset, _ = load_current()
        except Exception as exc:                          # noqa: BLE001
            return self._json(500, {"error": str(exc)})
        dataset["updatedAt"] = today()
        if fmt == "json":
            body = (json.dumps(dataset, ensure_ascii=False, indent=2) + "\n").encode("utf-8")
            name = "api-support.json"
            ctype = "application/json; charset=utf-8"
        else:
            body = dumps_js(dataset).encode("utf-8")
            name = "api-support.data.js"
            ctype = "application/javascript; charset=utf-8"
        self._send(200, body, ctype, {"Content-Disposition": 'attachment; filename="%s"' % name})


# ────────────────────────────────────────────────────────────────────────────

class EditorServer(ThreadingHTTPServer):
    """静默掉浏览器关闭连接造成的正常噪音（ConnectionReset 等）。"""

    daemon_threads = True
    allow_reuse_address = True

    def handle_error(self, request, client_address):
        exc = sys.exc_info()[1]
        if isinstance(exc, (ConnectionResetError, ConnectionAbortedError, BrokenPipeError)):
            return
        super().handle_error(request, client_address)


def main():
    parser = argparse.ArgumentParser(description="小栗子虚拟机 · API 支持情况编辑器")
    parser.add_argument("--port", type=int, default=8765, help="监听端口（默认 8765）")
    parser.add_argument("--host", default="127.0.0.1", help="监听地址（默认仅本机）")
    parser.add_argument("--no-browser", action="store_true", help="不自动打开浏览器")
    args = parser.parse_args()

    print("=" * 62)
    print(" 小栗子虚拟机 · API 支持情况编辑器")
    print(" 网站目录 : %s" % ROOT)
    print(" 数据文件 : %s" % DATA_JSON)
    print(" Apifox   : %s" % (os.path.basename(APIFOX) if APIFOX else "(未找到)"))
    print(" 地址     : http://%s:%d/" % (args.host, args.port))
    print(" 关闭窗口 / Ctrl+C 即可退出")
    print("=" * 62)

    httpd = EditorServer((args.host, args.port), Handler)
    url = "http://%s:%d/" % (args.host, args.port)

    if not args.no_browser:
        threading.Timer(0.6, lambda: webbrowser.open(url)).start()

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n已退出。")
    finally:
        httpd.server_close()


if __name__ == "__main__":
    main()
