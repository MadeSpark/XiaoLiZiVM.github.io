from __future__ import annotations

import os
import re
import urllib.parse
import urllib.request
from pathlib import Path


def _safe_local_path(out_dir: Path, url: str) -> Path:
    parsed = urllib.parse.urlparse(url)
    path = parsed.path
    if not path or path.endswith("/"):
        path = (path or "/") + "index.html"
    path = path.lstrip("/")
    return out_dir / path


def _download(url: str, timeout: int = 20, referer: str | None = None) -> tuple[bytes, str]:
    headers = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36"
    }
    if referer:
        headers["Referer"] = referer
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        data = resp.read()
        content_type = resp.headers.get("Content-Type") or ""
        return data, content_type


def _decode_bytes(data: bytes, content_type: str) -> str:
    text, _ = _decode_bytes_with_encoding(data, content_type)
    return text


def _normalize_encoding(enc: str) -> str:
    enc = (enc or "").strip().strip('"').strip("'").lower()
    if enc in ("gbk", "gb2312"):
        return "gb18030"
    return enc


def _detect_meta_charset(data: bytes) -> str | None:
    head = data[:8192].decode("latin-1", errors="ignore")
    m = re.search(r"""charset\s*=\s*["']?\s*([a-zA-Z0-9_\-]+)""", head, re.I)
    if not m:
        return None
    return _normalize_encoding(m.group(1))


def _decode_bytes_with_encoding(data: bytes, content_type: str) -> tuple[str, str]:
    m = re.search(r"charset=([a-zA-Z0-9_\-]+)", content_type, re.I)
    if m:
        enc = _normalize_encoding(m.group(1))
        try:
            return data.decode(enc, errors="replace"), enc
        except Exception:
            pass

    meta_enc = _detect_meta_charset(data)
    if meta_enc:
        try:
            return data.decode(meta_enc, errors="replace"), meta_enc
        except Exception:
            pass

    for enc in ("utf-8", "gb18030", "latin-1"):
        try:
            return data.decode(enc, errors="replace"), enc
        except Exception:
            continue
    return data.decode("utf-8", errors="replace"), "utf-8"


def _normalize_raw_url(raw: str) -> str:
    raw = raw.strip()
    if raw.startswith("//"):
        return "https:" + raw
    return raw


def _extract_css_urls(text: str) -> list[str]:
    urls: set[str] = set()
    for m in re.finditer(r"""url\(\s*(['"]?)(.*?)\1\s*\)""", text, re.I):
        u = m.group(2).strip()
        if not u:
            continue
        urls.add(u)
    for m in re.finditer(r"""@import\s+(?:url\(\s*)?(['"])(.*?)\1""", text, re.I):
        u = m.group(2).strip()
        if not u:
            continue
        urls.add(u)
    return [u for u in urls if u and not u.startswith("data:") and not u.startswith("mailto:") and not u.startswith("javascript:")]


def _extract_asset_urls(html: str) -> list[str]:
    urls: set[str] = set()
    for m in re.finditer(r"""<img\b[^>]*?\bsrc\s*=\s*(['"])(.*?)\1""", html, re.I):
        urls.add(m.group(2).strip())
    for m in re.finditer(r"""<img\b[^>]*?\bsrcset\s*=\s*(['"])(.*?)\1""", html, re.I):
        for part in m.group(2).split(","):
            u = part.strip().split(" ", 1)[0].strip()
            if u:
                urls.add(u)
    for m in re.finditer(r"""<script\b[^>]*?\bsrc\s*=\s*(['"])(.*?)\1""", html, re.I):
        urls.add(m.group(2).strip())
    for m in re.finditer(r"""<link\b[^>]*?\bhref\s*=\s*(['"])(.*?)\1""", html, re.I):
        urls.add(m.group(2).strip())
    for m in re.finditer(r"""<[^>]*?\bstyle\s*=\s*(['"])(.*?)\1""", html, re.I):
        for u in _extract_css_urls(m.group(2)):
            urls.add(u)
    return [u for u in urls if u and not u.startswith("data:") and not u.startswith("mailto:") and not u.startswith("javascript:")]


def _is_same_origin(base: str, abs_url: str) -> bool:
    b = urllib.parse.urlparse(base)
    u = urllib.parse.urlparse(abs_url)
    return (u.scheme in ("http", "https")) and (u.netloc == b.netloc)


def _to_posix(path: Path) -> str:
    return "/".join(path.parts)


def mirror(base_url: str, out_dir: Path) -> None:
    out_dir.mkdir(parents=True, exist_ok=True)

    downloaded: dict[str, Path] = {}
    pending_css: list[tuple[Path, str]] = []

    def fetch(raw: str, referer: str, *, record_html_rewrite: bool) -> tuple[str, Path] | None:
        raw_n = _normalize_raw_url(raw)
        abs_url = urllib.parse.urljoin(referer, raw_n)
        if not _is_same_origin(base_url, abs_url):
            return None
        if abs_url in downloaded:
            return abs_url, downloaded[abs_url]

        local_path = _safe_local_path(out_dir, abs_url)
        local_path.parent.mkdir(parents=True, exist_ok=True)
        try:
            data, ct = _download(abs_url, referer=referer)
        except Exception:
            return None
        local_path.write_bytes(data)
        downloaded[abs_url] = local_path

        if local_path.suffix.lower() == ".css":
            pending_css.append((local_path, abs_url))
        return abs_url, local_path

    extra_assets = [
        "/css/modules/laydate/default/laydate.css",
        "/css/modules/layer/default/layer.css",
        "/css/modules/code.css",
    ]
    for raw in extra_assets:
        fetch(raw, base_url, record_html_rewrite=False)

    def process_page(page_url: str) -> None:
        html_bytes, html_ct = _download(page_url)
        html, html_enc = _decode_bytes_with_encoding(html_bytes, html_ct)
        html_local = _safe_local_path(out_dir, page_url)
        html_dir = html_local.parent

        assets = _extract_asset_urls(html)

        replacements: dict[str, str] = {}
        for raw in assets:
            res = fetch(raw, page_url, record_html_rewrite=False)
            if not res:
                continue
            abs_url, local_path = res
            rel = os.path.relpath(local_path, start=html_dir).replace("\\", "/")
            raw_n = _normalize_raw_url(raw)
            replacements[raw] = rel
            replacements[raw_n] = rel
            replacements[abs_url] = rel
            if raw.startswith("/"):
                replacements[raw] = rel
            if raw.startswith("//"):
                replacements[raw] = rel

        updated = html
        for k, v in replacements.items():
            updated = updated.replace(k, v)

        if html_local.name == "index.html" and html_local.parent == out_dir:
            updated = updated.replace('href="http://f.xiaolz.cn"', 'href="https://web.archive.org/web/20230531161557/http://f.xiaolz.cn/"')
            updated = updated.replace('href="https://f.xiaolz.cn"', 'href="https://web.archive.org/web/20230531161557/http://f.xiaolz.cn/"')

        html_local.parent.mkdir(parents=True, exist_ok=True)
        html_local.write_text(updated, encoding=html_enc, errors="replace")

    process_page(base_url)
    process_page(urllib.parse.urljoin(base_url, "/doc/qq_bot_api.html"))

    processed_css: set[str] = set()
    while pending_css:
        css_local, css_abs = pending_css.pop(0)
        if css_abs in processed_css:
            continue
        processed_css.add(css_abs)

        try:
            css_bytes = css_local.read_bytes()
        except Exception:
            continue

        css_text = _decode_bytes(css_bytes, "text/css")
        css_urls = _extract_css_urls(css_text)

        css_dir = css_local.parent
        css_replacements: dict[str, str] = {}

        for raw in css_urls:
            res = fetch(raw, css_abs, record_html_rewrite=False)
            if not res:
                continue
            abs_url, local_path = res
            rel = os.path.relpath(local_path, start=css_dir)
            rel = rel.replace("\\", "/")
            raw_n = _normalize_raw_url(raw)
            css_replacements[abs_url] = rel
            css_replacements[raw] = rel
            css_replacements[raw_n] = rel
            if raw.startswith("/"):
                css_replacements[raw] = rel
            if raw.startswith("//"):
                css_replacements[raw] = rel

        if css_replacements:
            updated = css_text
            for k, v in css_replacements.items():
                updated = updated.replace(k, v)
            css_local.write_text(updated, encoding="utf-8", errors="replace")


def main() -> int:
    base_url = "https://xiaolz.cn/"
    out_dir = Path(__file__).resolve().parent / "xiaolz_clone"

    mirror(base_url, out_dir)
    print(str(out_dir))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

