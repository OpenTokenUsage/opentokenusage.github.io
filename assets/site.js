"use strict";

// 1. Copy the winget command. Fallback: select it and ask for Ctrl+C.
const live = document.querySelector("[role=status]");
const say = (text) => { if (live) live.textContent = text; };
for (const btn of document.querySelectorAll("[data-copy]")) {
  const code = btn.parentElement.querySelector("code");
  // The accessible name starts with the visible text, so voice control can say what it sees.
  const show = (text, label) => { btn.textContent = text; btn.setAttribute("aria-label", label); };
  let timer;
  btn.hidden = false; // hidden in the HTML: without JS the button could do nothing
  btn.addEventListener("click", async () => {
    clearTimeout(timer);
    let ok = true;
    try { await navigator.clipboard.writeText(btn.dataset.copy); } catch { ok = false; }
    if (!ok && code) getSelection().selectAllChildren(code);
    track("copy_install_command");
    if (ok) show("Copied", "Copied");
    else show("Press Ctrl+C", "Press Ctrl+C to copy the winget command");
    say(ok ? "Command copied." : "Command selected. Press Ctrl+C to copy it.");
    timer = setTimeout(() => { show("Copy", "Copy the winget command"); say(""); }, ok ? 2000 : 4000);
  });
}

// 2. Latest version and installer from GitHub. Any failure keeps what is in the HTML.
const versions = document.querySelectorAll("[data-version]");
const installers = document.querySelectorAll("[data-installer]");
const DOWNLOADS = "https://github.com/PowerUserZ/OpenTokenUsage/releases/download/";
if ((versions.length || installers.length) && window.fetch && window.AbortSignal && AbortSignal.timeout) {
  fetch("https://api.github.com/repos/PowerUserZ/OpenTokenUsage/releases/latest", {
    headers: { Accept: "application/vnd.github+json" },
    signal: AbortSignal.timeout(4000),
  })
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => {
      if (!d) return;
      const m = /^v?(\d+\.\d+\.\d+)$/.exec(typeof d.tag_name === "string" ? d.tag_name : "");
      if (m) for (const el of versions) el.textContent = m[1];
      // Point "Download the installer" at the setup .exe instead of a page of .msi, .sig and .json files.
      const exe = Array.isArray(d.assets) && d.assets.find((a) => a && typeof a.name === "string"
        && /_x64-setup\.exe$/.test(a.name) && typeof a.browser_download_url === "string"
        && a.browser_download_url.startsWith(DOWNLOADS));
      if (exe) for (const a of installers) a.href = exe.browser_download_url;
    })
    .catch(() => {});
}

// 3. Clock in the example taskbar.
const [clockTime, clockDate] = document.querySelectorAll(".clock time");
if (clockTime && clockDate) {
  const tf = new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" });
  const df = new Intl.DateTimeFormat(undefined, { dateStyle: "short" });
  const tick = () => {
    const now = new Date();
    clockTime.textContent = tf.format(now);
    clockDate.textContent = df.format(now);
    clockTime.dateTime = clockDate.dateTime = now.toISOString();
  };
  tick();
  setInterval(tick, 30000);
}

// 4. The strip shows or hides the panel, like the real one.
const strip = document.querySelector(".strip");
const panel = document.getElementById("panel");
if (strip && panel) {
  strip.addEventListener("click", () => {
    const closed = panel.classList.toggle("is-closed");
    strip.setAttribute("aria-expanded", String(!closed));
  });
}

// 5. Google Analytics, loaded only after the visitor allows it (Consent Mode v2, basic).
// A Global Privacy Control signal counts as "no" and the question isn't asked.
const GA_ID = "G-J1CQKCWK6E";
const CONSENT_KEY = "analytics-consent"; // "granted" | "denied"
function track(name) { if (window.gtag) window.gtag("event", name); }
function startAnalytics() {
  if (window.gtag) return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); }; // gtag.js expects the arguments object
  window.gtag("consent", "default", {
    analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied",
  });
  window.gtag("js", new Date());
  window.gtag("config", GA_ID, { allow_google_signals: false, allow_ad_personalization_signals: false });
  const s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
  document.head.append(s);
}
function stopAnalytics() {
  if (window.gtag) window.gtag("consent", "update", { analytics_storage: "denied" });
  // GA sets _ga and _ga_<id> on the site's domain; the tag itself is gone on the next page load.
  for (const c of document.cookie.split(";")) {
    const name = c.split("=")[0].trim();
    if (name !== "_ga" && !name.startsWith("_ga_")) continue;
    document.cookie = name + "=; Max-Age=0; path=/";
    document.cookie = name + "=; Max-Age=0; path=/; domain=." + location.hostname;
  }
}
const consent = document.querySelector(".consent");
if (consent && !navigator.globalPrivacyControl) {
  let choice = null;
  try { choice = localStorage.getItem(CONSENT_KEY); } catch {}
  if (choice === "granted") startAnalytics();
  else if (choice !== "denied") consent.hidden = false;
  for (const btn of consent.querySelectorAll("[data-consent]")) {
    btn.addEventListener("click", () => {
      const value = btn.dataset.consent;
      try { localStorage.setItem(CONSENT_KEY, value); } catch {}
      consent.hidden = true;
      if (value === "granted") startAnalytics(); else stopAnalytics();
    });
  }
  for (const open of document.querySelectorAll("[data-consent-open]")) {
    open.hidden = false;
    open.querySelector("button").addEventListener("click", () => {
      consent.hidden = false;
      consent.querySelector("button").focus();
    });
  }
}
