const toastEl = document.getElementById("copyToast");
const toastTextEl = document.getElementById("toastText");
const themeToggleEl = document.getElementById("themeToggle");

let toastInstance = null;
let themeAnimating = false;

const SUN_ICON =
  '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>';
const MOON_ICON =
  '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

let prefersReducedMotion = false;
if (window.matchMedia) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  prefersReducedMotion = mq.matches;
  const onChange = function (e) {
    prefersReducedMotion = e.matches;
  };
  if (mq.addEventListener) mq.addEventListener("change", onChange);
  else if (mq.addListener) mq.addListener(onChange);
}

/**
 * 计算圆形揭示的圆心与半径（单位 px，配合 clip-path: circle()）。
 *
 * 两个坑位都在这里处理掉：
 * 1. 页面滚动后 sticky 头部可能已经离开视口，此时按钮的 rect.top 是负数。
 *    若把负数直接当圆心，圆弧的中心会跑到屏幕外，圆永远盖不满视口，
 *    动画一结束剩下的区域就会"啪"地整体变色 —— 也就是之前看到的割裂感。
 *    这里把圆心夹到视口范围内，圆心永远落在屏幕上。
 * 2. 半径取"到视口四角的最远距离"，再乘 1.18 的余量。这样圆的覆盖在动画
 *    后段就已经完成（而不是卡在最后一帧刚好贴边），观感更从容、也更稳。
 */
function rippleGeometry(anchor) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  let cx = vw / 2;
  let cy = 0;

  const el = anchor || themeToggleEl;
  if (el && el.getBoundingClientRect) {
    const rect = el.getBoundingClientRect();
    cx = Math.min(Math.max(rect.left + rect.width / 2, 0), vw);
    cy = Math.min(Math.max(rect.top + rect.height / 2, 0), vh);
  }

  const need = Math.max(
    Math.hypot(cx, cy),
    Math.hypot(vw - cx, cy),
    Math.hypot(cx, vh - cy),
    Math.hypot(vw - cx, vh - cy)
  );

  return { x: cx, y: cy, r: need * 1.18 };
}

/** 换完主题后再给按钮图标一个小旋转入场，避免这个动画被写进过渡快照 */
function popIcon() {
  if (!themeToggleEl) return;
  themeToggleEl.classList.remove("theme-icon-pop");
  void themeToggleEl.offsetWidth; // 强制重排，让动画可以重复触发
  themeToggleEl.classList.add("theme-icon-pop");
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  if (!themeToggleEl) return;
  const isDark = theme === "dark";
  themeToggleEl.setAttribute("aria-pressed", String(isDark));
  themeToggleEl.setAttribute("aria-label", isDark ? "切换到明色主题" : "切换到暗色主题");
  themeToggleEl.innerHTML = isDark ? SUN_ICON + " 明色" : MOON_ICON + " 暗色";
}

/** 降级方案（浏览器不支持 View Transitions 时）：整页淡出 → 换肤 → 淡入 */
function swapWithFade(theme) {
  const root = document.documentElement;
  themeAnimating = true;
  root.classList.add("theme-fading");
  window.setTimeout(function () {
    applyTheme(theme);
    popIcon();
    root.classList.remove("theme-fading");
    window.setTimeout(function () {
      themeAnimating = false;
    }, 220);
  }, 170);
}

function setTheme(theme, animate, anchor) {
  if (animate === undefined) animate = false;
  if (themeAnimating && animate) return;

  if (!animate || prefersReducedMotion) {
    applyTheme(theme);
    return;
  }
  if (!document.startViewTransition) {
    swapWithFade(theme);
    return;
  }

  const geo = rippleGeometry(anchor);
  const root = document.documentElement;
  root.style.setProperty("--ripple-x", geo.x + "px");
  root.style.setProperty("--ripple-y", geo.y + "px");
  root.style.setProperty("--ripple-r", geo.r + "px");
  root.classList.add(theme === "dark" ? "theme-to-dark" : "theme-to-light");
  themeAnimating = true;

  const transition = document.startViewTransition(function () {
    applyTheme(theme);
  });
  const done = function () {
    root.classList.remove("theme-to-dark", "theme-to-light");
    themeAnimating = false;
    popIcon();
  };
  transition.finished.then(done, done);
}

// Toast
function showToast(text) {
  if (!toastEl || !toastTextEl) return;
  toastTextEl.textContent = text;
  if (!toastInstance && window.bootstrap && window.bootstrap.Toast) {
    toastInstance = new window.bootstrap.Toast(toastEl);
  }
  if (toastInstance) {
    toastInstance.show();
    return;
  }
  toastEl.hidden = false;
  window.setTimeout(function () {
    toastEl.hidden = true;
  }, 1800);
}

// Copy
async function copyText(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  var textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  var ok = document.execCommand("copy");
  document.body.removeChild(textarea);
  return ok;
}

// Init theme: auto by time only (18:00~7:00 = dark), no localStorage
(function () {
  var hour = new Date().getHours();
  var preferDark = hour >= 18 || hour < 7;
  setTheme(preferDark ? "dark" : "light", false);
})();

// Theme toggle button
if (themeToggleEl) {
  themeToggleEl.addEventListener("click", function () {
    var current = document.documentElement.dataset.theme;
    setTheme(current === "dark" ? "light" : "dark", true, themeToggleEl);
  });
}

// Global click delegation
document.addEventListener("click", async function (e) {
  var target = e.target;
  if (!(target instanceof HTMLElement)) return;

  var copyValue = target.getAttribute("data-copy");
  if (!copyValue) return;
  try {
    var ok = await copyText(copyValue);
    showToast(ok ? "已复制" : "复制失败");
  } catch {
    showToast("复制失败");
  }
});
