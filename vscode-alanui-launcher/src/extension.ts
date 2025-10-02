import * as vscode from "vscode";
import * as child_process from "child_process";
import * as path from "path";

export function activate(context: vscode.ExtensionContext) {
  console.log(
    'Congratulations, your extension "vscode-alanui-launcher" is now active!',
  );

  const disposable = vscode.commands.registerCommand(
    "vscode-alanui-launcher.launchArclightApp",
    () => {
      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (!workspaceFolders) {
        vscode.window.showErrorMessage("No workspace folder open.");
        return;
      }

      // Assuming Arclight_App is the root of the workspace or a known subfolder.
      // For this example, we'll assume the command should be run from the root of the opened workspace.
      const workspacePath = workspaceFolders[0].uri.fsPath;

      vscode.window.showInformationMessage("Launching Arclight App...");

      // Execute npm start
      child_process.exec(
        "npm start",
        { cwd: workspacePath },
        (error, stdout, stderr) => {
          if (error) {
            console.error(`exec error: ${error}`);
            vscode.window.showErrorMessage(
              `Failed to start Arclight App: ${error.message}`,
            );
            if (stderr) {
              vscode.window.showErrorMessage(`stderr: ${stderr}`);
            }
            return;
          }
          if (stdout) {
            vscode.window.showInformationMessage(
              `Arclight App started. Output: ${stdout}`,
            );
          }
          if (stderr) {
            vscode.window.showWarningMessage(
              `Arclight App output (stderr): ${stderr}`,
            );
          }
          vscode.window.showInformationMessage(
            "Arclight App started. Opening in browser...",
          );

          // Open the URL in Google Chrome
          const url = "http://localhost:3000";
          const command = `open -a "Google Chrome" "${url}"`;

          child_process.exec(command, (error, stdout, stderr) => {
            if (error) {
              console.error(`exec error: ${error}`);
              vscode.window.showErrorMessage(
                `Failed to open Chrome: ${error.message}`,
              );
              if (stderr) {
                vscode.window.showErrorMessage(`stderr: ${stderr}`);
              }
              return;
            }
            if (stdout) {
              console.log(`stdout: ${stdout}`);
            }
            if (stderr) {
              console.warn(`stderr: ${stderr}`);
            }
            vscode.window.showInformationMessage(
              "Arclight App opened in Chrome.",
            );
          });
        },
      );
    },
  );

  // Add the button to the status bar
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100,
  );
  statusBarItem.command = "vscode-alanui-launcher.launchArclightApp";
  statusBarItem.text = `🚀 Launch Arclight_App on Local 3000`;
  statusBarItem.tooltip = "Click to start Arclight App and open in browser";
  statusBarItem.show();

  context.subscriptions.push(disposable, statusBarItem);
}

export function deactivate() {}
