const COOKIE_KEY = "ilaria_cookie_preferences_v1";

const cookieDrawer = document.getElementById("cookie-drawer");
const cookieToggle = document.getElementById("cookie-drawer-toggle");
const cookiePanelWrap = document.querySelector("[data-cookie-panel]");
const cookieClose = document.querySelector("[data-cookie-close]");
const cookiePanel = document.getElementById("cookie-panel");
const analyticsCheckbox = document.getElementById("cookie-analytics");
const cookieActionButtons = Array.from(
  document.querySelectorAll("[data-cookie-action]"),
);

const defaultCookiePrefs = {
  necessary: true,
  analytics: false,
  consentedAt: null,
};

function readCookiePrefs() {
  try {
    const raw = localStorage.getItem(COOKIE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeCookiePrefs(prefs) {
  localStorage.setItem(COOKIE_KEY, JSON.stringify(prefs));
}

function openDrawer() {
  if (!cookieDrawer || !cookiePanelWrap || !cookieToggle) return;
  cookieDrawer.classList.add("is-open");
  cookiePanelWrap.removeAttribute("hidden");
  cookieToggle.setAttribute("aria-expanded", "true");
}

function closeDrawer() {
  if (!cookieDrawer || !cookiePanelWrap || !cookieToggle) return;
  cookieDrawer.classList.remove("is-open");
  cookiePanelWrap.setAttribute("hidden", "");
  cookiePanel?.setAttribute("hidden", "");
  cookieToggle.setAttribute("aria-expanded", "false");
}

function showDrawer() {
  cookieDrawer?.removeAttribute("hidden");
}

function hideDrawer() {
  cookieDrawer?.setAttribute("hidden", "");
}

function openPreferences() {
  cookiePanel?.removeAttribute("hidden");
  openDrawer();
}

function applyCookiePrefs(prefs) {
  document.documentElement.dataset.cookieAnalytics = prefs.analytics
    ? "granted"
    : "denied";
  cookieDrawer?.setAttribute("data-cookie-state", "saved");
}

function saveCookiePrefs(partialPrefs) {
  const prefs = {
    ...defaultCookiePrefs,
    ...partialPrefs,
    consentedAt: new Date().toISOString(),
  };

  writeCookiePrefs(prefs);
  applyCookiePrefs(prefs);
  closeDrawer();
}

function initCookieBanner() {
  if (!cookieDrawer) return;

  const existingPrefs = readCookiePrefs();

  showDrawer();

  if (existingPrefs) {
    applyCookiePrefs(existingPrefs);
  } else {
    cookieDrawer?.setAttribute("data-cookie-state", "pending");
    openDrawer();
  }

  cookieToggle?.addEventListener("click", () => {
    const isOpen = cookieDrawer.classList.contains("is-open");
    if (isOpen) closeDrawer();
    else openDrawer();
  });

  cookieClose?.addEventListener("click", closeDrawer);

  document.addEventListener("click", (event) => {
    if (!cookieDrawer.classList.contains("is-open")) return;
    if (cookieDrawer.contains(event.target)) return;
    closeDrawer();
  });

  cookieActionButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.getAttribute("data-cookie-action");

      if (action === "accept") {
        saveCookiePrefs({ necessary: true, analytics: true });
      }

      if (action === "reject") {
        saveCookiePrefs({ necessary: true, analytics: false });
      }

      if (action === "customize") {
        openPreferences();
      }

      if (action === "save-selected") {
        saveCookiePrefs({
          necessary: true,
          analytics: Boolean(analyticsCheckbox?.checked),
        });
      }
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initCookieBanner);
} else {
  initCookieBanner();
}
