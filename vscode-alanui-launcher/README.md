# `vscode-alanui-launcher/`

This folder contains a small Visual Studio Code extension intended to make local development easier by:

1. starting `server.cjs` if nothing is listening on port 3000
2. opening `http://localhost:3000` in Google Chrome
3. providing status bar shortcuts that start the server when needed and open `http://localhost:3000`

## What’s in here

- `src/extension.ts` – registers the launch and localhost shortcut commands and status bar buttons
- `package.json` – extension manifest
- `vscode-alanui-launcher-0.0.8.vsix` – packaged extension

## Install

### Option A: Install the packaged `.vsix`

From the repo root:

```bash
code --install-extension vscode-alanui-launcher/vscode-alanui-launcher-0.0.8.vsix
```

If VS Code is already open, run **Developer: Reload Window** from the Command Palette after installing.

### Option B: Build and package

```bash
cd vscode-alanui-launcher
npm install
npm run compile
# packaging typically requires `vsce package` (not included in this repo workflow)
```

## Use

- Click either status bar button (**Start Arclight (3000)** or **localhost:3000**) to open the app. If port 3000 is not responding, the extension starts `server.cjs` with VS Code's bundled Node runtime and waits for it to respond before opening Google Chrome. This avoids depending on `npm` being available in the extension host's PATH.
- Run `vscode-alanui-launcher.openLocalhost3000` or `vscode-alanui-launcher.launchArclightApp` from the Command Palette.

The extension locates the nearest parent `package.json` with a `dev` script starting from the first workspace folder. Keep the Arclight workspace open and install the app's dependencies before launching.

## Platform notes / limitations

- Both status bar buttons open Google Chrome directly. On Windows, the extension checks Chrome's standard system and per-user installation locations. If Chrome is missing, it displays an installation error.

## Expected workspace layout

Open the **repo root** (the folder containing the main `package.json`) in VS Code so the extension can locate `server.cjs`.
