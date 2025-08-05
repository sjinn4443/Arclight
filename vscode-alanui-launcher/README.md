# AlanUI Launcher VSCode Extension

This extension adds a status bar button to VSCode that launches the Arclight_App on Local 3000.

## Features

- Adds a "🚀 Launch Arclight_App on Local 3000" button to the status bar (bottom right).
- Clicking the button runs `npm start` in your workspace root and opens [http://localhost:3000](http://localhost:3000) in your default browser.

## Usage

1. Open your project folder in VSCode.
2. Click the "🚀 Launch Arclight_App on Local 3000" button in the status bar.
3. The app will start and your browser will open to [http://localhost:3000](http://localhost:3000).

## Development

- Run `npm install` to install dependencies.
- Run `npm run compile` to build the extension.
- Use `vsce package` to package the extension for installation.
