# opentokenusage.github.io

The website for [OpenTokenUsage](https://github.com/PowerUserZ/OpenTokenUsage), a free Windows 11 tray app that shows your AI coding limits next to the clock. Live at <https://opentokenusage.app/> (the `CNAME` file sets the custom domain; <https://opentokenusage.github.io/> redirects there).

The app itself, its releases and its issues live in [PowerUserZ/OpenTokenUsage](https://github.com/PowerUserZ/OpenTokenUsage). Report app problems there.

## What's here

Plain HTML, CSS and JavaScript. No build step, no frameworks, no web fonts.

- `index.html`, `404.html`
- `assets/site.css`, `assets/site.js`, `assets/theme.js`: bump the `?v=` on their links in `index.html` and `404.html` whenever you change them (GitHub Pages lets browsers cache for 10 minutes, so new HTML could meet old CSS/JS)
- Theme: dark by default whatever the system theme; the header button switches to light and `theme.js` (in `<head>`, not deferred, so there's no dark flash) remembers it in `localStorage` (`theme`). Light styles hang off `:root[data-theme="light"]`; `panel-light.webp` loads only when shown
- `assets/*.webp`: crops of the screenshots in the app repo's `docs/images/`
- `assets/og.png`: the 1200x630 share image, a screenshot of a page built from the site's own hero
- `assets/logo.svg`, `assets/icon.png`: the app logo from `src-tauri/icons/`
- `assets/providers/*.svg`: provider icons from the app's `plugins/<id>/icon.svg`
- `favicon.ico`, `apple-touch-icon.png`: made from `assets/icon.png`
- `assets/bmc-button.png`: Buy Me a Coffee's own yellow button graphic, hosted here so the page loads nothing from their CDN
- Search and AI: `robots.txt`, `sitemap.xml` (bump `lastmod` when the page changes), `llms.txt` (a plain-text summary for AI assistants), the JSON-LD block in `index.html` (its FAQ answers must match the visible FAQ word for word), and `<key>.txt`, the public IndexNow key for Bing and other engines

GitHub Pages serves the repo root. Without consent the only request to another site is the latest version number from the GitHub API; if it fails, the page shows the version written in the HTML (update `data-version` in `index.html` on each release).

## Preview locally

Serve the folder over HTTP, so the Content Security Policy and the `/assets/` paths in `404.html` behave like on GitHub Pages:

```powershell
python -m http.server 8000
```

Then open <http://localhost:8000/> (and <http://localhost:8000/404.html>).

## License

[MIT](LICENSE). Provider names and logos belong to their owners.

## Analytics

Google Analytics 4 (`G-J1CQKCWK6E`, in `assets/site.js`) loads only after the visitor clicks Allow in the notification-style question (Consent Mode v2, basic): nothing goes to Google before that, and a Global Privacy Control signal counts as no. The choice is kept in `localStorage` (`analytics-consent`); Decline removes the `_ga` cookies, and the footer's "change" link asks again. Google signals and ad personalization are off, and the CSP allows only the GA endpoints Google documents (`*.googletagmanager.com`, `*.google-analytics.com`, `*.analytics.google.com`), so the tag's extra hit to `www.google.com` is refused on purpose. Custom event: `copy_install_command`; installer downloads are counted by GA's enhanced measurement.
