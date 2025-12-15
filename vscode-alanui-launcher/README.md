# `vscode-alanui-launcher/`

This folder contains a small Visual Studio Code extension intended to make local development easier by:

1. running `npm start` in the opened workspace
2. opening `http://localhost:3000` in your browser

## What’s in here

- `src/extension.ts` – registers the command `vscode-alanui-launcher.launchArclightApp` and adds a status bar button
- `package.json` – extension manifest
- `alanui-launcher-0.0.1.vsix` – packaged extension (if present/up to date)

## Install

### Option A: Install the packaged `.vsix`

From the repo root:

```bash
code --install-extension vscode-alanui-launcher/alanui-launcher-0.0.1.vsix
```

### Option B: Build and package

```bash
cd vscode-alanui-launcher
npm install
npm run compile
# packaging typically requires `vsce package` (not included in this repo workflow)
```

## Use

- Click the status bar button (created by the extension), or
- run the command id: `vscode-alanui-launcher.launchArclightApp`

The extension will run `npm start` in the **first workspace folder** and then attempt to open `http://localhost:3000`.

## Platform notes / limitations

- The current implementation uses `open -a "Google Chrome" ...`, which is **macOS-specific**.
  - On Windows, you may need to update the extension to use `start <url>` or VS Code’s `vscode.env.openExternal()`.
- The extension manifest currently does **not** declare `contributes.commands`. Depending on VS Code behavior, the command may not appear in the Command Palette even though it’s registered in code.

## Expected workspace layout

Open the **repo root** (the folder containing the main `package.json`) in VS Code so that `npm start` runs the Arclight server correctly.
