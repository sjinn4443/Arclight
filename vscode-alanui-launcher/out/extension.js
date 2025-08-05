"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const cp = __importStar(require("child_process"));
function activate(context) {
    // Create the status bar button
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.text = '🚀 Launch Arclight_App on Local 3000';
    statusBarItem.command = 'alanui-launcher.launchApp';
    statusBarItem.show();
    // Register the command
    const disposable = vscode.commands.registerCommand('alanui-launcher.launchApp', () => __awaiter(this, void 0, void 0, function* () {
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
        }
        else if (process.platform === 'darwin') {
            openCmd = `open ${url}`;
        }
        else {
            openCmd = `xdg-open ${url}`;
        }
        cp.exec(openCmd);
    }));
    context.subscriptions.push(disposable, statusBarItem);
}
exports.activate = activate;
function deactivate() { }
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map