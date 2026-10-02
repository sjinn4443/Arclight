# Arclight Mini Apps Gallery

Updated 30/9/2026. Authorship: WJW.

This folder is the lightweight catalogue for the 15 Arclight mini apps. The apps are assessment aids, teaching guides and simulators. They do not diagnose.

- `index.html` is a static, direct-file-compatible gallery.
- `apps.json` is the machine-readable integration manifest.
- `thumbnails/` contains WebP previews captured at `360 x 740` and resized to `180 x 370`.
- `verify.mjs` confirms that the manifest, visible cards, entry files and thumbnails remain in sync.

The catalogue uses two columns at mobile width, displays each app’s name and preserves each app’s accent colour. Open `index.html` directly or serve the parent folder over HTTP.

Run the dependency-free catalogue check from the parent folder:

```powershell
node gallery/verify.mjs
```

Clinical sign-off and physical-device acceptance remain separate from engineering verification.

The September contact sheet refresh retains the catalogue layout, app order, descriptions and accent colours. All 15 thumbnails are refreshed from the current HTTP entry pages at `360 x 740`. `contact-sheet.png` is a wide static overview for hand-over, not an alternative runtime.

To reproduce the previews with a locally installed Playwright Core and Chrome:

```powershell
node gallery/refresh-previews.mjs
py -3 gallery/build-thumbnails.py
node gallery/refresh-previews.mjs --gallery
```

The capture helper defaults to the existing Mires development dependency and local Chrome. Set `ARCLIGHT_PLAYWRIGHT_MODULE`, `ARCLIGHT_BROWSER_EXECUTABLE` and `ARCLIGHT_PREVIEW_BASE` if the receiving environment differs. These are development tools, not runtime dependencies. Results are written under `output/playwright/gallery-handover-20260930/`. HTTP and direct-file catalogue checks are separate from physical-device acceptance.
