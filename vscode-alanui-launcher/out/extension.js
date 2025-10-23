"use strict";
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        var desc = Object.getOwnPropertyDescriptor(m, k);
        if (
          !desc ||
          ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)
        ) {
          desc = {
            enumerable: true,
            get: function () {
              return m[k];
            },
          };
        }
        Object.defineProperty(o, k2, desc);
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
      }
    : function (o, v) {
        o["default"] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  (function () {
    var ownKeys = function (o) {
      ownKeys =
        Object.getOwnPropertyNames ||
        function (o) {
          var ar = [];
          for (var k in o)
            if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
          return ar;
        };
      return ownKeys(o);
    };
    return function (mod) {
      if (mod && mod.__esModule) return mod;
      var result = {};
      if (mod != null)
        for (var k = ownKeys(mod), i = 0; i < k.length; i++)
          if (k[i] !== "default") __createBinding(result, mod, k[i]);
      __setModuleDefault(result, mod);
      return result;
    };
  })();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const child_process = __importStar(require("child_process"));
function activate(context) {
  console.warn(
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
              console.warn(`stdout: ${stdout}`);
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
function deactivate() {}
//# sourceMappingURL=extension.js.map
