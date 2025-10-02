# How to Create and Install a Custom VSCode Extension Button (Launch Arclight_App on Local 3000)

This guide documents all the steps taken to create, build, and install a custom VSCode extension that adds a "Launch Arclight_App on Local 3000" button to the status bar. This button runs `npm start` and opens your local site in the browser.

---

## 1. Scaffold the Extension

- Create a new folder: `vscode-alanui-launcher`
- Add these files:
  - `package.json` (extension manifest)
  - `src/extension.ts` (extension source code)
  - `tsconfig.json` (TypeScript config)
  - `README.md` (usage instructions)
  - `.vscodeignore` (files to exclude from package)

## 2. Install Dependencies

Open a terminal in the `vscode-alanui-launcher` directory and run:
\`\`\`sh
npm install
npm install --save-dev vscode
\`\`\`

## 3. Compile the Extension

From the same directory, run:
\`\`\`sh
npm run compile
\`\`\`

## 4. Package the Extension

Install the VSCE packager globally (if not already installed):
\`\`\`sh
npm install -g vsce
\`\`\`

Package the extension:
\`\`\`sh
vsce package
\`\`\`

- If prompted about missing `repository` or `LICENSE`, type `y` to continue.
- This creates a `.vsix` file (e.g., `alanui-launcher-0.0.1.vsix`).

## 5. Install the Extension in VSCode

From the root project directory, run:
\`\`\`sh
code --install-extension vscode-alanui-launcher/alanui-launcher-0.0.1.vsix
\`\`\`
Or, in VSCode:

- Open the Command Palette (Ctrl+Shift+P)
- Choose "Extensions: Install from VSIX..." and select the `.vsix` file

## 6. Use the Button

- Open your project folder in VSCode.
- The "🚀 Launch Arclight_App on Local 3000" button will appear in the status bar (bottom right).
- Click it to run `npm start` and open [http://localhost:3000](http://localhost:3000) in your browser.

---

**Summary:**
This process creates a reusable VSCode extension that adds a custom status bar button for project automation. You can share the `.vsix` file or the full source with others to repeat the process.
