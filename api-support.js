/* 小栗子虚拟机 · API 兼容情况面板
 * 数据来源：api-support.data.js（由 tools/api_editor.py 导出）
 */
(function () {
  "use strict";

  var DATA = window.XLZ_API_SUPPORT;
  var root = document.getElementById("apiList");
  if (!root) return;

  var overviewEl = document.getElementById("apiOverview");
  var tabsEl = document.getElementById("apiFrameworkTabs");
  var legendEl = document.getElementById("apiLegend");
  var metaEl = document.getElementById("apiMeta");
  var searchEl = document.getElementById("apiSearch");
  var statusFilterEl = document.getElementById("apiStatusFilter");
  var toggleAllEl = document.getElementById("apiToggleAll");

  // ── 数据缺失兜底 ────────────────────────────────────────────────
  if (!DATA || !DATA.apis || !DATA.apis.length) {
    root.innerHTML =
      '<div class="api-empty">API 兼容数据暂未加载（缺少 api-support.data.js）。' +
      "请使用 tools/api_editor.py 导出数据后重试。</div>";
    if (overviewEl) overviewEl.innerHTML = "";
    return;
  }

  var APIS = DATA.apis.slice().sort(function (a, b) {
    return (a.type || 0) - (b.type || 0);
  });
  var FRAMEWORKS = DATA.frameworks || [];
  var STATUS_TYPES = DATA.statusTypes || [];
  var CATEGORIES = DATA.categories && DATA.categories.length
    ? DATA.categories
    : unique(APIS.map(function (a) { return a.category || "其他"; }));

  var statusById = {};
  STATUS_TYPES.forEach(function (s) { statusById[s.id] = s; });
  var fwById = {};
  FRAMEWORKS.forEach(function (f) { fwById[f.id] = f; });
  var fwIds = FRAMEWORKS.map(function (f) { return f.id; });

  function unique(arr) {
    var out = [];
    arr.forEach(function (v) { if (out.indexOf(v) === -1) out.push(v); });
    return out;
  }

  function statusOf(api, fwId) {
    var v = (api.support || {})[fwId];
    return statusById[v] ? v : "unknown";
  }
  function statusInfo(id) {
    return statusById[id] || { id: id, name: id, color: "#94a3b8", level: 0 };
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  // ── 状态 ────────────────────────────────────────────────────────
  var state = {
    framework: "all",
    status: "all",
    query: "",
    open: {},          // apiId -> true
    collapsed: false,  // 分类是否全部折叠
  };

  // ── 概览 ────────────────────────────────────────────────────────
  function renderOverview() {
    if (!overviewEl) return;
    var total = APIS.length;
    var html = FRAMEWORKS.map(function (fw) {
      var counts = { full: 0, partial: 0, none: 0, unknown: 0 };
      APIS.forEach(function (a) {
        var s = statusOf(a, fw.id);
        counts[s] = (counts[s] || 0) + 1;
      });
      var pct = total ? Math.round((counts.full / total) * 1000) / 10 : 0;
      var detail = ["partial", "none", "unknown"]
        .filter(function (k) { return counts[k] > 0; })
        .map(function (k) {
          var st = statusInfo(k);
          return (
            '<span class="api-mini" style="--c:' + st.color + '">' +
            esc(st.name) + " " + counts[k] +
            "</span>"
          );
        })
        .join("");
      return (
        '<div class="api-fwcard" style="--fw:' + (fw.color || "#7c5cff") + '">' +
          '<div class="api-fwcard__top">' +
            '<span class="api-fwcard__dot"></span>' +
            '<span class="api-fwcard__name">' + esc(fw.name || fw.id) + "</span>" +
            '<span class="api-fwcard__pct">' + pct + "%</span>" +
          "</div>" +
          '<div class="api-bar"><i style="width:' + Math.max(pct, 0) + '%"></i></div>' +
          '<div class="api-fwcard__bottom">' +
            '<span class="api-fwcard__count">完全支持 <b>' + counts.full + "</b>/" + total + "</span>" +
            (detail ? '<span class="api-fwcard__detail">' + detail + "</span>" : "") +
          "</div>" +
        "</div>"
      );
    }).join("");
    overviewEl.innerHTML = html;
  }

  // ── 框架筛选 tab ────────────────────────────────────────────────
  function renderTabs() {
    if (!tabsEl) return;
    var items = [{ id: "all", name: "全部框架", color: "#7c5cff", short: "全部" }].concat(FRAMEWORKS);
    tabsEl.innerHTML = items
      .map(function (fw) {
        var on = state.framework === fw.id;
        return (
          '<button type="button" role="tab" aria-selected="' + (on ? "true" : "false") +
          '" class="api-tab' + (on ? " is-active" : "") + '" data-fw="' + esc(fw.id) +
          '" style="--fw:' + (fw.color || "#7c5cff") + '">' + esc(fw.name || fw.id) + "</button>"
        );
      })
      .join("");
  }

  function renderLegend() {
    if (!legendEl) return;
    legendEl.innerHTML =
      '<span class="api-legend__label">图例</span>' +
      STATUS_TYPES.map(function (s) {
        return (
          '<span class="api-pill api-pill--legend" style="--pill:' + s.color + '">' +
          '<i class="api-pill__dot"></i>' + esc(s.name) + "</span>"
        );
      }).join("");
  }

  function renderStatusFilter() {
    if (!statusFilterEl) return;
    statusFilterEl.innerHTML =
      '<option value="all">全部</option>' +
      STATUS_TYPES.map(function (s) {
        return '<option value="' + esc(s.id) + '">' + esc(s.name) + "</option>";
      }).join("");
    statusFilterEl.value = state.status;
  }

  // ── 过滤 ────────────────────────────────────────────────────────
  function matchQuery(api, q) {
    if (!q) return true;
    var hay = [api.name, api.type, api.category, api.description, api.note, api.paramsText]
      .join(" ")
      .toLowerCase();
    return hay.indexOf(q) !== -1;
  }

  function visibleFwIds() {
    return state.framework === "all" ? fwIds : [state.framework];
  }

  function matchStatus(api) {
    if (state.status === "all") return true;
    return visibleFwIds().some(function (id) {
      return statusOf(api, id) === state.status;
    });
  }

  function filtered() {
    var q = state.query.trim().toLowerCase();
    return APIS.filter(function (a) {
      return matchQuery(a, q) && matchStatus(a);
    });
  }

  // ── 列表 ────────────────────────────────────────────────────────
  function pillsHTML(api) {
    var focus = state.framework;
    return FRAMEWORKS.map(function (fw) {
      var sid = statusOf(api, fw.id);
      var st = statusInfo(sid);
      var dim = focus !== "all" && focus !== fw.id;
      return (
        '<span class="api-pill' + (dim ? " is-dim" : "") + '" style="--pill:' + st.color + '"' +
        ' title="' + esc(fw.name) + " · " + esc(st.name) + '">' +
        '<i class="api-pill__dot"></i>' + esc(fw.short || fw.name) + "</span>"
      );
    }).join("");
  }

  function paramsTableHTML(api) {
    var ps = api.params || [];
    if (!ps.length) return '<p class="api-note">该接口没有参数。</p>';
    var rows = ps
      .map(function (p) {
        return (
          "<tr>" +
          '<td><code class="api-param">' + esc(p.name) + "</code>" +
          (p.common ? '<span class="api-tag api-tag--common">公共</span>' : "") + "</td>" +
          "<td><span class=\"api-type\">" + esc(p.type || "string") + "</span></td>" +
          '<td>' + (p.required ? '<span class="api-req">必填</span>' : '<span class="api-opt">可选</span>') + "</td>" +
          "<td>" + (p.description ? esc(p.description) : '<span class="api-dim">—</span>') + "</td>" +
          '<td><code class="api-eg">' + esc(JSON.stringify(p.example)) + "</code></td>" +
          "</tr>"
        );
      })
      .join("");
    return (
      '<div class="api-tablewrap"><table class="api-table">' +
      "<thead><tr><th>参数</th><th>类型</th><th>必填</th><th>说明</th><th>示例</th></tr></thead>" +
      "<tbody>" + rows + "</tbody></table></div>"
    );
  }

  function supportDetailHTML(api) {
    var rows = FRAMEWORKS.map(function (fw) {
      var sid = statusOf(api, fw.id);
      var st = statusInfo(sid);
      return (
        '<div class="api-sup' + (state.framework === fw.id ? " is-focus" : "") + '" style="--fw:' +
        (fw.color || "#7c5cff") + ";--pill:" + st.color + '">' +
          '<span class="api-sup__fw">' + esc(fw.name) + "</span>" +
          '<span class="api-pill" style="--pill:' + st.color + '"><i class="api-pill__dot"></i>' +
          esc(st.name) + "</span>" +
          '<span class="api-sup__note">' + esc(fw.note || "") + "</span>" +
        "</div>"
      );
    }).join("");
    return '<div class="api-sup__grid">' + rows + "</div>";
  }

  function bodyHTML(api) {
    var lines = [];
    lines.push('<div class="api-block">');
    lines.push('<div class="api-block__title">请求格式</div>');
    lines.push(
      '<div class="api-code">' +
        '<div class="api-code__bar">' +
          '<span class="api-code__method">' + esc(api.method || "POST") + "</span>" +
          '<span class="api-code__url">' + esc(api.url || "") + "</span>" +
          '<button type="button" class="api-copy" data-copy-target="body">复制 Body</button>' +
        "</div>" +
        '<pre class="api-code__pre"><span class="api-code__h">Content-Type: ' +
        esc(api.contentType || "application/json") + "</span>\n" +
        esc(api.bodyText || "{}") + "</pre>" +
      "</div>"
    );
    lines.push('<div class="api-conv-inline">接口类型 <code class="api-type-id">type = ' +
      esc(api.type) + "</code></div>");
    lines.push("</div>");

    lines.push('<div class="api-block">');
    lines.push('<div class="api-block__title">请求参数</div>');
    lines.push(paramsTableHTML(api));
    lines.push("</div>");

    if (api.responseExample) {
      lines.push('<div class="api-block">');
      lines.push('<div class="api-block__title">返回示例</div>');
      lines.push(
        '<div class="api-code">' +
          '<div class="api-code__bar"><span class="api-code__url">' +
          esc(DATA.source || "Apifox") + "</span>" +
          '<button type="button" class="api-copy" data-copy-target="resp">复制返回</button></div>' +
          '<pre class="api-code__pre">' + esc(api.responseExample) + "</pre>" +
        "</div>"
      );
      lines.push("</div>");
    }

    lines.push('<div class="api-block">');
    lines.push('<div class="api-block__title">各框架支持情况</div>');
    lines.push(supportDetailHTML(api));
    lines.push("</div>");

    return lines.join("");
  }

  function renderList() {
    var list = filtered();
    if (!list.length) {
      root.innerHTML = '<div class="api-empty">没有匹配的接口，试试调整筛选或搜索关键词。</div>';
      renderMeta(0, APIS.length);
      return;
    }

    var byCat = {};
    list.forEach(function (a) {
      var c = a.category || "其他";
      (byCat[c] = byCat[c] || []).push(a);
    });
    var order = CATEGORIES.filter(function (c) { return byCat[c]; });

    var html = order
      .map(function (cat) {
        var group = byCat[cat];
        var body = group
          .map(function (a) {
            var open = !!state.open[a.id] && !state.collapsed;
            var fullCount = fwIds.filter(function (id) {
              return statusOf(a, id) === "full";
            }).length;
            var sub = [];
            if (a.description) sub.push('<p class="api-item__desc">' + esc(a.description) + "</p>");
            if (a.note) sub.push('<p class="api-item__note">备注：' + esc(a.note) + "</p>");
            sub.push(bodyHTML(a));

            return (
              '<article class="api-item' + (open ? " is-open" : "") +
              '" data-id="' + esc(a.id) + '" data-type="' + esc(a.type) + '">' +
                '<button type="button" class="api-item__head" aria-expanded="' + (open ? "true" : "false") + '">' +
                  '<span class="api-item__no">#' + String(a.type).padStart(2, "0") + "</span>" +
                  '<span class="api-item__name">' + esc(a.name) +
                    (a.deprecated ? '<span class="api-tag api-tag--dep">已废弃</span>' : "") +
                  "</span>" +
                  '<span class="api-item__pills">' + pillsHTML(a) + "</span>" +
                  '<span class="api-item__sum" title="完全支持的框架数">' +
                    '<b>' + fullCount + "</b>/" + fwIds.length +
                  "</span>" +
                  '<span class="api-item__chev" aria-hidden="true">' +
                    '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
                    'stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">' +
                    '<polyline points="6 9 12 15 18 9"/></svg>' +
                  "</span>" +
                "</button>" +
                '<div class="api-item__body"' + (open ? "" : " hidden") + ">" + sub.join("") + "</div>" +
              "</article>"
            );
          })
          .join("");
        return (
          '<section class="api-cat">' +
            '<h3 class="api-cat__title">' + esc(cat) +
              '<span class="api-cat__count">' + byCat[cat].length + " 个接口</span>" +
            "</h3>" +
            '<div class="api-cat__list">' + body + "</div>" +
          "</section>"
        );
      })
      .join("");

    root.innerHTML = html;
    // 绑定复制按钮
    Array.prototype.forEach.call(root.querySelectorAll(".api-copy"), function (btn) {
      var item = btn.closest(".api-item");
      var api = item ? APIS.filter(function (x) { return x.id === item.dataset.id; })[0] : null;
      var text = api ? (btn.dataset.copyTarget === "resp" ? api.responseExample : api.bodyText) : "";
      btn.dataset.copy = text || "";
    });
    renderMeta(list.length, APIS.length);
  }

  function renderMeta(shown, total) {
    if (!metaEl) return;
    var parts = ["共 " + total + " 个接口"];
    if (shown !== total) parts.push("当前显示 " + shown + " 个");
    if (DATA.updatedAt) parts.push("最后更新 " + DATA.updatedAt);
    if (DATA.source) parts.push("数据来源 " + DATA.source);
    metaEl.textContent = parts.join(" · ");
  }

  function syncToggleAllLabel() {
    if (toggleAllEl) toggleAllEl.textContent = state.collapsed ? "全部展开" : "全部折叠";
  }

  // ── 事件 ────────────────────────────────────────────────────────
  if (tabsEl) {
    tabsEl.addEventListener("click", function (e) {
      var btn = e.target.closest("[data-fw]");
      if (!btn) return;
      state.framework = btn.dataset.fw;
      renderTabs();
      renderList();
    });
  }

  if (searchEl) {
    var timer = null;
    searchEl.addEventListener("input", function () {
      window.clearTimeout(timer);
      timer = window.setTimeout(function () {
        state.query = searchEl.value;
        renderList();
      }, 140);
    });
  }

  if (statusFilterEl) {
    statusFilterEl.addEventListener("change", function () {
      state.status = statusFilterEl.value;
      renderList();
    });
  }

  if (toggleAllEl) {
    toggleAllEl.addEventListener("click", function () {
      state.collapsed = !state.collapsed;
      if (!state.collapsed) state.open = {};
      syncToggleAllLabel();
      renderList();
    });
  }

  root.addEventListener("click", function (e) {
    var head = e.target.closest(".api-item__head");
    if (!head) return;
    var item = head.closest(".api-item");
    if (!item) return;
    var id = item.dataset.id;
    var open = item.classList.contains("is-open");
    if (open) {
      delete state.open[id];
    } else {
      state.open[id] = true;
    }
    item.classList.toggle("is-open", !open);
    head.setAttribute("aria-expanded", String(!open));
    var body = item.querySelector(".api-item__body");
    if (body) body.hidden = open;
  });

  // 主题切换后无需重绘（颜色全部由 CSS 变量驱动）
  renderOverview();
  renderTabs();
  renderLegend();
  renderStatusFilter();
  syncToggleAllLabel();
  renderList();
})();
