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
const http = __importStar(require("http"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const appPort = 3000;
const appUrl = `http://localhost:${appPort}`;
let appProcess;
let appStartError;
let appOutputChannel;
async function openInChrome() {
  let executable;
  let args = [appUrl];
  if (process.platform === "win32") {
    const candidates = [
      process.env.PROGRAMFILES,
      process.env["PROGRAMFILES(X86)"],
      process.env.LOCALAPPDATA,
    ]
      .filter((directory) => Boolean(directory))
      .map((directory) =>
        path.join(directory, "Google", "Chrome", "Application", "chrome.exe"),
      );
    const chromePath = candidates.find((candidate) => fs.existsSync(candidate));
    if (!chromePath) {
      throw new Error(
        "Google Chrome was not found. Install Chrome and try again.",
      );
    }
    executable = chromePath;
  } else if (process.platform === "darwin") {
    executable = "/usr/bin/open";
    args = ["-a", "Google Chrome", appUrl];
  } else {
    executable = "google-chrome";
  }
  await new Promise((resolve, reject) => {
    const browser = child_process.spawn(executable, args, {
      detached: true,
      stdio: "ignore",
    });
    browser.once("error", reject);
    browser.once("spawn", () => {
      browser.unref();
      resolve();
    });
  });
}
async function findAppRoot(startPath) {
  let currentPath = startPath;
  while (true) {
    const packageJsonPath = path.join(currentPath, "package.json");
    try {
      const contents = await vscode.workspace.fs.readFile(
        vscode.Uri.file(packageJsonPath),
      );
      const packageJson = JSON.parse(Buffer.from(contents).toString("utf8"));
      if (typeof packageJson.scripts?.dev === "string") {
        return currentPath;
      }
    } catch (error) {
      if (
        !(error instanceof vscode.FileSystemError) ||
        error.code !== "FileNotFound"
      ) {
        throw error;
      }
    }
    const parentPath = path.dirname(currentPath);
    if (parentPath === currentPath) {
      throw new Error(
        "Could not find a package.json with a dev script in this workspace or its parent folders.",
      );
    }
    currentPath = parentPath;
  }
}
function isLocalServerReady() {
  return new Promise((resolve) => {
    const request = http.get(appUrl, (response) => {
      response.resume();
      resolve(true);
    });
    request.setTimeout(1000, () => request.destroy());
    request.on("error", () => resolve(false));
  });
}
async function waitForLocalServer(timeoutMs) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    if (await isLocalServerReady()) {
      return true;
    }
    if (
      appStartError ||
      (appProcess &&
        (appProcess.exitCode !== null || appProcess.signalCode !== null))
    ) {
      return false;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  return isLocalServerReady();
}
function startLocalServer(appRoot) {
  const serverPath = path.join(appRoot, "server.cjs");
  appStartError = undefined;
  appOutputChannel?.clear();
  appOutputChannel?.appendLine(`Starting Arclight at ${appUrl}`);
  appProcess = child_process.spawn(process.execPath, [serverPath], {
    cwd: appRoot,
    detached: true,
    env: {
      ...process.env,
      ELECTRON_RUN_AS_NODE: "1",
      HOST: "127.0.0.1",
      NODE_ENV: "development",
      PORT: String(appPort),
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  appProcess.stdout?.on("data", (data) => {
    appOutputChannel?.append(data.toString());
  });
  appProcess.stderr?.on("data", (data) => {
    appOutputChannel?.append(data.toString());
  });
  appProcess.on("error", (error) => {
    appStartError = error.message;
    appOutputChannel?.appendLine(
      `Failed to start the server: ${error.message}`,
    );
  });
  appProcess.on("exit", (code, signal) => {
    appStartError = `The server process exited before becoming ready (code ${code ?? "unknown"}, signal ${signal ?? "none"}).`;
    appOutputChannel?.appendLine(appStartError);
  });
  appProcess.unref();
}
function activate(context) {
  console.log(
    'Congratulations, your extension "vscode-alanui-launcher" is now active!',
  );
  appOutputChannel = vscode.window.createOutputChannel("Arclight App");
  context.subscriptions.push(appOutputChannel);
  let openingApp;
  const openLocalhost = () => {
    if (openingApp) {
      return openingApp;
    }
    openingApp = (async () => {
      try {
        if (!(await isLocalServerReady())) {
          const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
          if (!workspaceFolder) {
            throw new Error("Open the Arclight workspace first.");
          }
          const appRoot = await findAppRoot(workspaceFolder.uri.fsPath);
          startLocalServer(appRoot);
          vscode.window.setStatusBarMessage(
            "Starting Arclight on localhost:3000...",
            10000,
          );
          if (!(await waitForLocalServer(45000))) {
            appOutputChannel?.show(true);
            throw new Error(
              appStartError
                ? `Could not start the server: ${appStartError}`
                : "Arclight did not start on port 3000. Check the Arclight App output channel.",
            );
          }
        }
        await openInChrome();
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        vscode.window.showErrorMessage(`Unable to open Arclight: ${message}`);
      }
    })().finally(() => {
      openingApp = undefined;
    });
    return openingApp;
  };
  const openLocalhostCommand = vscode.commands.registerCommand(
    "vscode-alanui-launcher.openLocalhost3000",
    openLocalhost,
  );
  const disposable = vscode.commands.registerCommand(
    "vscode-alanui-launcher.launchArclightApp",
    openLocalhost,
  );
  // Add the button to the status bar
  const statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100,
  );
  statusBarItem.command = "vscode-alanui-launcher.launchArclightApp";
  statusBarItem.text = "$(rocket) Start Arclight (3000)";
  statusBarItem.tooltip =
    "Start Arclight if needed, then open http://localhost:3000 in Google Chrome";
  statusBarItem.show();
  const localhostStatusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    99,
  );
  localhostStatusBarItem.command = "vscode-alanui-launcher.openLocalhost3000";
  localhostStatusBarItem.text = "$(globe) localhost:3000";
  localhostStatusBarItem.tooltip =
    "Start Arclight if needed, then open http://localhost:3000 in Google Chrome";
  localhostStatusBarItem.show();
  context.subscriptions.push(
    disposable,
    openLocalhostCommand,
    statusBarItem,
    localhostStatusBarItem,
  );
}
function deactivate() {
  if (
    appProcess &&
    appProcess.exitCode === null &&
    appProcess.signalCode === null
  ) {
    appProcess.kill();
  }
}
//# sourceMappingURL=extension.js.map
