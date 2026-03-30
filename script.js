const toastEl = document.querySelector(".toast");
const toastTextEl = document.getElementById("toastText");
const themeToggleEl = document.getElementById("themeToggle");
const downloadModalEl = document.getElementById("downloadModal");
const downloadProceedEl = document.getElementById("downloadProceed");

let toastTimer = null;
let pendingDownloadUrl = null;

function setTheme(theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem("theme", theme);
  } catch {}
  if (themeToggleEl) {
    const isDark = theme === "dark";
    themeToggleEl.setAttribute("aria-pressed", String(isDark));
    themeToggleEl.textContent = isDark ? "明色" : "暗色";
  }
}

function showToast(text) {
  if (!toastEl || !toastTextEl) return;
  toastTextEl.textContent = text;
  toastEl.hidden = false;
  if (toastTimer) window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toastEl.hidden = true;
  }, 1800);
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return true;
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  const ok = document.execCommand("copy");
  document.body.removeChild(textarea);
  return ok;
}

function openDownloadModal(url) {
  if (!downloadModalEl) return;
  pendingDownloadUrl = url;
  downloadModalEl.hidden = false;
  const panel = downloadModalEl.querySelector(".modal__panel");
  if (panel instanceof HTMLElement) panel.focus();
}

function closeDownloadModal() {
  if (!downloadModalEl) return;
  downloadModalEl.hidden = true;
  pendingDownloadUrl = null;
}

(() => {
  let saved = null;
  try {
    saved = localStorage.getItem("theme");
  } catch {}
  if (saved === "dark") setTheme("dark");
  else setTheme("light");
})();

if (themeToggleEl) {
  themeToggleEl.addEventListener("click", () => {
    const current = document.documentElement.dataset.theme;
    setTheme(current === "dark" ? "light" : "dark");
  });
}

if (downloadProceedEl) {
  downloadProceedEl.addEventListener("click", () => {
    if (!pendingDownloadUrl) return;
    window.open(pendingDownloadUrl, "_blank", "noreferrer");
    closeDownloadModal();
  });
}

document.addEventListener("click", async (e) => {
  const target = e.target;
  if (!(target instanceof HTMLElement)) return;

  if (target.matches("[data-download]")) {
    const url = target.getAttribute("href");
    if (url) {
      e.preventDefault();
      openDownloadModal(url);
    }
    return;
  }

  if (target.matches("[data-modal-close]")) {
    closeDownloadModal();
    return;
  }

  const copyValue = target.getAttribute("data-copy");
  if (!copyValue) return;
  try {
    const ok = await copyText(copyValue);
    showToast(ok ? "密码已复制" : "复制失败");
  } catch {
    showToast("复制失败");
  }
});

document.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (downloadModalEl?.hidden) return;
  closeDownloadModal();
});
