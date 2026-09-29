# opentokenusage.github.io

The website for [OpenTokenUsage](https://github.com/PowerUserZ/OpenTokenUsage), a free Windows 11 tray app that shows your AI coding limits next to the clock. Live at <https://opentokenusage.github.io/>.

The app itself, its releases and its issues live in [PowerUserZ/OpenTokenUsage](https://github.com/PowerUserZ/OpenTokenUsage). Report app problems there.

## What's here

Plain HTML, CSS and JavaScript. No build step, no frameworks, no web fonts, no analytics.

- `index.html`, `404.html`
- `assets/site.css`, `assets/site.js`
- `assets/*.webp`: crops of the screenshots in the app repo's `docs/images/`
- `assets/og.png`: the 1200x630 share image, a screenshot of a page built from the site's own hero
- `assets/logo.svg`, `assets/icon.png`: the app logo from `src-tauri/icons/`
- `assets/providers/*.svg`: provider icons from the app's `plugins/<id>/icon.svg`

GitHub Pages serves the repo root. The only request to another site is the latest version number from the GitHub API; if it fails, the page shows the version written in the HTML (update `data-version` in `index.html` on each release).

## Preview locally

Serve the folder over HTTP, so the Content Security Policy and the `/assets/` paths in `404.html` behave like on GitHub Pages:

```powershell
python -m http.server 8000
```

Then open <http://localhost:8000/> (and <http://localhost:8000/404.html>).

## License

[MIT](LICENSE). Provider names and logos belong to their owners.
