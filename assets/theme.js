"use strict";

// Dark by default, whatever the system theme; the header button switches to light and back.
// Loaded in <head> without defer, so a saved light theme is applied before the first paint.
(() => {
  const KEY = "theme"; // "light" | absent (dark)
  const root = document.documentElement;
  const apply = (theme) => {
    if (theme === "light") root.dataset.theme = "light"; else delete root.dataset.theme;
    const scheme = document.querySelector('meta[name="color-scheme"]');
    const bar = document.querySelector('meta[name="theme-color"]');
    if (scheme) scheme.content = theme === "light" ? "light" : "dark";
    if (bar) bar.content = theme === "light" ? "#F3F3F3" : "#000000";
  };
  let saved = null;
  try { saved = localStorage.getItem(KEY); } catch {}
  apply(saved);

  document.addEventListener("DOMContentLoaded", () => {
    for (const btn of document.querySelectorAll("[data-theme-toggle]")) {
      // The button names the theme it switches to; its visible icon does the same.
      const label = () => {
        const text = root.dataset.theme === "light" ? "Switch to dark theme" : "Switch to light theme";
        btn.setAttribute("aria-label", text);
        btn.title = text;
      };
      label();
      btn.hidden = false; // hidden in the HTML: without JS the button could do nothing
      btn.addEventListener("click", () => {
        const next = root.dataset.theme === "light" ? "dark" : "light";
        apply(next);
        try { if (next === "light") localStorage.setItem(KEY, "light"); else localStorage.removeItem(KEY); } catch {}
        label();
      });
    }
  });
})();
