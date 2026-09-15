# API 支持情况 · 工具目录

用于维护官网「API 兼容情况」板块的数据。

```
tools/
├── api_editor.py        本地编辑器（Python 标准库，零依赖）
├── editor_ui.html       编辑器界面（由 api_editor.py 提供）
├── apifox_import.py     解析 .apifox.json → 生成网站数据
├── start_editor.bat     Windows 双击启动
└── README.md            本文件
```

## 一、网站数据是怎么来的

```
小栗子虚拟机.apifox.json  ──解析──▶  api-support.json  ──导出──▶  api-support.data.js
        （接口/参数）        apifox_import.py     （可直接编辑）        （网站实际加载）
```

- `api-support.data.js`：**网站真正读取的文件**，位于网站根目录，随网站一起部署。
- `api-support.json`：同内容的 JSON 版，方便脚本处理 / 版本管理。
- 两个文件由编辑器「保存并导出」一键写出，覆盖前会自动备份到 `网站目录/.workbuddy/backups/`（保留最近 20 份）。

> 想改接口参数？改 Apifox 项目 → 重新导出 `.apifox.json` → 编辑器里点「**从 Apifox 重新导入…**」，
> **会弹出系统文件选择窗口，自己挑那个 `.apifox.json` 就行**（放哪儿都行，不必先拷到网站目录）。
> 也可以把文件直接拖到该按钮上。你填写的兼容情况会按 **接口类型 `type`** 自动保留。

### 关于「从 Apifox 重新导入…」

- 点按钮 → **浏览器弹出系统文件选择窗口** → 选 `.apifox.json` → 自动解析并刷新接口列表。
- 文件由浏览器读出来直接发给本地服务（**只走 127.0.0.1，不上传任何服务器**），所以文件放在哪都行。
- 选了别的 JSON 也不用怕：不是 Apifox 导出会明确报错，当前数据**原封不动**。
- 导入只是刷新编辑框里的内容，**要点「保存并导出」才会真正写到网站目录**；反悔可以 `Ctrl+Z`。
- 底部状态栏的「Apifox 来源」会显示这次导入用的是哪个文件。

## 二、启动编辑器

方式 1：双击 `tools/start_editor.bat`（推荐）

方式 2：命令行

```bash
python tools/api_editor.py                 # 自动打开浏览器，默认 http://127.0.0.1:8765/
python tools/api_editor.py --port 9000     # 换端口
python tools/api_editor.py --no-browser    # 不自动开浏览器

# 有 uv 环境也可以
uv run --no-project python tools/api_editor.py
```

只监听 `127.0.0.1`，数据不会离开本机。

### 关于 `start_editor.bat`

它不会盲信 PATH 上的 `python`，而是**逐个候选真的试跑一次**，只有能正常返回的解释器才会被采用，顺序为：

1. `py -3` / `py`（官方启动器）
2. `%USERPROFILE%\.workbuddy\binaries\python\versions\current\python.exe`（本机实际可用的 Python）
3. `%LOCALAPPDATA%\Programs\Python\Python3*`、`%ProgramFiles%\Python3*`、`C:\Python3*`
4. PATH 上的 `python` / `python3`（**跳过 `WindowsApps` 目录**）
5. `uv python find` / `uv run --no-project python`

> 为什么第 4 步要跳过 `WindowsApps`？那是 Microsoft Store 的"应用执行别名"，是个 **0 字节占位符**。
> 直接运行它不会有任何输出、也不会执行脚本 —— 这正是"双击 `start_editor.bat` 没反应 / 一闪而过"的原因。
>
> 启动器里请保持 **纯 ASCII**：cmd.exe 读 .bat 用的是系统 ANSI 代码页，
> 写入中文注释会被解析成乱码并当成命令执行（报 "is not recognized as an internal or external command"）。
> 面向用户的中文提示统一放在 `api_editor.py` 里。
>
> 如果窗口提示 `No usable Python 3 (3.8+) found`，按提示装一个 Python（勾选 Add to PATH），
> 或用 `uv run --no-project python tools\api_editor.py`。

## 三、怎么改支持情况（最快路径）

1. 顶部「**画笔状态**」点一下你要刷的状态（比如「完全支持」）。
2. 在「**兼容矩阵**」里点单元格即可刷成该状态。
3. 批量：
   - 点某一列表头旁的「`XX 整列`」→ 把该框架整列（当前筛选出的接口）刷成画笔状态；
   - 或点详情页的「整行设为画笔状态」；
   - 或点「全部置为「完全支持」」一次性全兼容。
4. 想要精确改一格：**右键单元格**循环切换状态，或在「接口详情」里用下拉框选。
5. `Ctrl+Z` 撤销，`Ctrl+S` 保存并导出。

## 四、编辑器能力一览

| 位置 | 能力 |
| --- | --- |
| 兼容矩阵 | 接口 × 框架 的状态网格，点选即改；分类分组；整列批量 |
| 接口详情 | 各框架状态下拉、分类、请求方式/地址/Content-Type、接口说明、备注、废弃标记 |
| 框架与状态 | 增删框架（列）、调整顺序与颜色、增删状态类型并改名称/简称/颜色 |
| 左侧列表 | 搜索、按分类筛选、只看「有不支持/未测试」或「有部分支持」的接口 |
| 顶部 | 从 Apifox 重新导入（弹出文件选择窗口，选好即导入）、全部置为完全支持、撤销、保存并导出、下载 .js/.json、打开网站目录 |

## 五、数据结构（api-support.json）

```jsonc
{
  "version": "1.0.0",
  "updatedAt": "2026-09-14",          // 保存时自动写入
  "source": "小栗子虚拟机.apifox.json",
  "statusTypes": [                    // 状态字典，可增删改（id 不可改）
    { "id": "full", "name": "完全支持", "short": "完全", "color": "#22c55e", "level": 3 }
  ],
  "frameworks": [                     // 框架 = 网站上的列 / 标签
    { "id": "mengchen", "name": "萌尘", "short": "萌尘", "color": "#7c5cff", "note": "…" }
  ],
  "categories": ["账号与框架", "消息发送", "..."],
  "apis": [
    {
      "id": "api-3", "type": 3,                       // type 就是请求 Body 里的 "type"
      "name": "发送群聊消息", "category": "消息发送",
      "method": "POST", "url": "http://127.0.0.1:2081/",
      "contentType": "application/json",
      "description": "", "note": "", "deprecated": false,
      "params": [ { "name": "hisUin", "type": "string", "required": true, "description": "群号", "example": "936632212" } ],
      "bodyText": "{ ... }",                          // 网站的请求示例（由参数生成）
      "responseExample": "{ ... }",
      "support": { "mengchen": "full", "dulu": "partial", "onebot11": "full" }
    }
  ]
}
```

> `support` 的取值必须是 `statusTypes` 里的某个 `id`；编辑器保存时会自动纠正非法值与缺失的框架。

## 六、重新生成数据（不打开编辑器）

```bash
python tools/apifox_import.py      # 按现有 api-support.json 保留状态，刷新接口/参数
```

## 七、上线流程

1. 编辑器里改完 → **保存并导出**。
2. 确认网站根目录的 `api-support.data.js`（和 `api-support.json`）已更新。
3. 部署网站即可，无需改动 HTML/CSS/JS。

> 页面用 `<script src="./api-support.data.js">` 加载数据，所以直接双击 `index.html`（file:// 方式）也能
> 正常看到数据，不受浏览器跨域限制。
