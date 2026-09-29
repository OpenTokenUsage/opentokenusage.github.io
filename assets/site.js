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
