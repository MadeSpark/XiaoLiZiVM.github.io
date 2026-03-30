const toastEl = document.querySelector(".toast");
const toastTextEl = document.getElementById("toastText");
const themeToggleEl = document.getElementById("themeToggle");
const downloadModalEl = document.getElementById("downloadModal");
const downloadProceedEl = document.getElementById("downloadProceed");

let toastTimer = null;
let pendingDownloadUrl = null;
let themeAnimating = false;

// Theme switch with circular ripple animation
function setTheme(theme, animate, originX, originY) {
  if (animate === undefined) animate = false;
  if (originX === undefined) originX = 0;
  if (originY === undefined) originY = 0;
  if (themeAnimating && animate) return;

  console.log('[Theme] setTheme called:', theme, '| animate:', animate);

  const apply = function() {
    document.documentElement.dataset.theme = theme;
    console.log('[Theme] applied to html[data-theme]:', document.documentElement.dataset.theme);
    if (themeToggleEl) {
      var isDark = theme === "dark";
      themeToggleEl.setAttribute("aria-pressed", String(isDark));
      themeToggleEl.innerHTML = isDark
        ? '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg> 明色'
        : '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg> 暗色';
    }
  };

  if (!animate || !document.startViewTransition) {
    apply();
    return;
  }

  var maxR = Math.hypot(
    Math.max(originX, window.innerWidth - originX),
    Math.max(originY, window.innerHeight - originY)
  );

  var root = document.documentElement;
  root.style.setProperty("--ripple-x", originX + "px");
  root.style.setProperty("--ripple-y", originY + "px");
  root.style.setProperty("--ripple-r", maxR + "px");

  var isDark = theme === "dark";
  root.classList.add(isDark ? "theme-to-dark" : "theme-to-light");
  themeAnimating = true;

  var transition = document.startViewTransition(function() {
    apply();
  });

  transition.finished.finally(function() {
    root.classList.remove("theme-to-dark", "theme-to-light");
    themeAnimating = false;
  });
}

// Toast
function showToast(text) {
  if (!toastEl || !toastTextEl) return;
  toastTextEl.textContent = text;
  toastEl.hidden = false;
  if (toastTimer) window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(function() { toastEl.hidden = true; }, 1800);
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

// Download modal
function openDownloadModal(url) {
  if (!downloadModalEl) return;
  pendingDownloadUrl = url;
  downloadModalEl.hidden = false;
  var panel = downloadModalEl.querySelector(".modal__panel");
  if (panel instanceof HTMLElement) panel.focus();
}

function closeDownloadModal() {
  if (!downloadModalEl) return;
  downloadModalEl.hidden = true;
  pendingDownloadUrl = null;
}

// Init theme: auto by time only (18:00~7:00 = dark), no localStorage
(function() {
  var hour = new Date().getHours();
  var preferDark = hour >= 18 || hour < 7;
  console.log('[Theme] init | hour:', hour, '| preferDark:', preferDark);
  setTheme(preferDark ? "dark" : "light", false);
})();

// Theme toggle button
if (themeToggleEl) {
  themeToggleEl.addEventListener("click", function(e) {
    var rect = themeToggleEl.getBoundingClientRect();
    var originX = rect.left + rect.width / 2;
    var originY = rect.top + rect.height / 2;
    var current = document.documentElement.dataset.theme;
    setTheme(current === "dark" ? "light" : "dark", true, originX, originY);
  });
}

// Download proceed
if (downloadProceedEl) {
  downloadProceedEl.addEventListener("click", function() {
    if (!pendingDownloadUrl) return;
    window.open(pendingDownloadUrl, "_blank", "noreferrer");
    closeDownloadModal();
  });
}

// Global click delegation
document.addEventListener("click", async function(e) {
  var target = e.target;
  if (!(target instanceof HTMLElement)) return;

  if (target.matches("[data-download]")) {
    var url = target.getAttribute("href");
    if (url) { e.preventDefault(); openDownloadModal(url); }
    return;
  }

  if (target.matches("[data-modal-close]")) {
    closeDownloadModal();
    return;
  }

  var copyValue = target.getAttribute("data-copy");
  if (!copyValue) return;
  try {
    var ok = await copyText(copyValue);
    showToast(ok ? "已复制" : "复制失败");
  } catch(e) {
    showToast("复制失败");
  }
});

document.addEventListener("keydown", function(e) {
  if (e.key !== "Escape") return;
  if (!downloadModalEl || downloadModalEl.hidden) return;
  closeDownloadModal();
});
