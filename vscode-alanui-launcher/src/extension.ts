import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as path from 'path';

export function activate(context: vscode.ExtensionContext) {
  // Create the status bar button
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBarItem.text = '🚀 Launch Arclight_App on Local 3000';
  statusBarItem.command = 'alanui-launcher.launchApp';
  statusBarItem.show();

  // Register the command
  const disposable = vscode.commands.registerCommand('alanui-launcher.launchApp', async () => {
    // Run 'npm start' in the workspace root
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
      vscode.window.showErrorMessage('No workspace folder open.');
      return;
    }
    const rootPath = workspaceFolders[0].uri.fsPath;

    // Check if a terminal named "arclight-app" already exists
    let terminal = vscode.window.terminals.find(t => t.name === 'arclight-app');
    if (!terminal) {
      terminal = vscode.window.createTerminal({ name: 'arclight-app', cwd: rootPath });
    }
    terminal.show();
    terminal.sendText('npm start');

    // Open http://localhost:3000 in the default browser
    const url = 'http://localhost:3000';
    let openCmd = '';
    if (process.platform === 'win32') {
      openCmd = `start ${url}`;
    } else if (process.platform === 'darwin') {
      openCmd = `open ${url}`;
    } else {
      openCmd = `xdg-open ${url}`;
    }
    cp.exec(openCmd);
  });

  context.subscriptions.push(disposable, statusBarItem);
}

export function deactivate() {}
