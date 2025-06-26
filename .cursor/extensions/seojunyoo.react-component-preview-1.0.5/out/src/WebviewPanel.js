"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const path = require("path");
const fs = require("fs");
const Webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const getWebviewOptions_1 = require("./utils/getWebviewOptions");
const createJSTemplate_1 = require("./utils/createJSTemplate");
const createWebpackConfig_1 = require("./utils/createWebpackConfig");
const previewConfigController_1 = require("./utils/previewConfigController");
class WebviewPanel {
    constructor(panel, extensionUri, workspacePath) {
        this._disposable = [];
        this._currentComponentName = "";
        this._currentComponentPath = "";
        this._currentComponentPropList = [];
        this._panel = panel;
        this._extensionUri = extensionUri;
        this._workspacePath = workspacePath;
        this._updateWebview();
        vscode.workspace.onDidSaveTextDocument(() => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                return;
            }
            if (editor.document.languageId !== "javascript" &&
                editor.document.languageId !== "javascriptreact") {
                return;
            }
            this._updatePreview();
        }, null, this._disposable);
        vscode.window.onDidChangeActiveTextEditor(() => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                return;
            }
            if (editor.document.languageId !== "javascript" &&
                editor.document.languageId !== "javascriptreact") {
                return;
            }
            this._updateWebview();
        }, null, this._disposable);
        this._panel.webview.onDidReceiveMessage((message) => {
            switch (message.command) {
                case "add":
                    (0, previewConfigController_1.addPropInfo)(this._workspacePath, this._currentComponentName, message.payload);
                    this._updateWebview();
                case "delete":
                    (0, previewConfigController_1.removePropInfo)(this._workspacePath, this._currentComponentName, message.propName);
                    this._updateWebview();
                case "update":
                    (0, previewConfigController_1.updatePropInfo)(this._workspacePath, this._currentComponentName, message.prevPropName, message.payload);
                    this._updatePreview();
            }
        }, null, this._disposable);
        this._panel.onDidDispose(() => this.dispose(), null, this._disposable);
    }
    static createAndShow(extensionUri, workspacePath) {
        if (WebviewPanel.currentPanel) {
            WebviewPanel.currentPanel._panel.reveal(vscode.ViewColumn.Beside);
            return;
        }
        const panel = vscode.window.createWebviewPanel(WebviewPanel.viewType, "react-preview", vscode.ViewColumn.Beside, (0, getWebviewOptions_1.default)(extensionUri));
        WebviewPanel.currentPanel = new WebviewPanel(panel, extensionUri, workspacePath);
    }
    static revive(panel, extensionUri, workspacePath) {
        WebviewPanel.currentPanel = new WebviewPanel(panel, extensionUri, workspacePath);
    }
    dispose() {
        WebviewPanel.currentPanel = undefined;
        this._panel.dispose();
        this._stopPreviewServer();
        while (this._disposable.length) {
            const x = this._disposable.pop();
            if (x) {
                x.dispose();
            }
        }
    }
    _updateWebview() {
        const webview = this._panel.webview;
        this._panel.title = "React Component Preview";
        this._panel.iconPath = vscode.Uri.joinPath(this._extensionUri, "icon.png");
        this._panel.webview.html = this._getHtmlForWebview(webview);
        this._updateCurrentComponentPathAndName();
        this._updateCurrentPropList();
        this._panel.webview.postMessage({
            command: "updateComponent",
            currentComponentName: this._currentComponentName,
            propList: this._currentComponentPropList,
        });
        this._updatePreview();
    }
    _updatePreview() {
        this._updateCurrentPropList();
        fs.writeFileSync(path.resolve(this._extensionUri.path, "preview", "index.js"), (0, createJSTemplate_1.default)(this._currentComponentPath, this._currentComponentName, this._currentComponentPropList));
        if (!this._previewServer) {
            this._startPreviewServer();
        }
    }
    _updateCurrentComponentPathAndName() {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        if (editor.document.languageId !== "javascript" &&
            editor.document.languageId !== "javascriptreact") {
            return;
        }
        this._currentComponentPath = editor.document.uri.path;
        const activeFileName = this._currentComponentPath.split("/").pop();
        this._currentComponentName = activeFileName.split(".")[0];
    }
    _updateCurrentPropList() {
        const props = (0, previewConfigController_1.createAndShowPreviewConfig)(this._workspacePath);
        this._currentComponentPropList = props[this._currentComponentName] || [];
    }
    _startPreviewServer() {
        const webpackConfig = (0, createWebpackConfig_1.default)(this._extensionUri.path, this._workspacePath);
        const compiler = Webpack(webpackConfig);
        const devServerOptions = { ...webpackConfig.devServer, open: false };
        this._previewServer = new WebpackDevServer(devServerOptions, compiler);
        this._previewServer.startCallback(() => {
            console.log("start preview");
        });
    }
    _stopPreviewServer() {
        if (this._previewServer) {
            this._previewServer.stopCallback(() => {
                console.log("stop preview");
            });
            this._previewServer = undefined;
        }
    }
    _getHtmlForWebview(webview) {
        const styleResetPath = vscode.Uri.joinPath(this._extensionUri, "app", "reset.css");
        const stylesResetUri = webview.asWebviewUri(styleResetPath);
        const bundleScriptPath = vscode.Uri.joinPath(this._extensionUri, "out", "app", "bundle.js");
        const bundleScriptUri = webview.asWebviewUri(bundleScriptPath);
        return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link href="${stylesResetUri}" rel="stylesheet">

      <title>React Component Preview</title>
    </head>
    <body>
      <div id="root"></div>
      <script>
        const vscode = acquireVsCodeApi();
      </script>
      <script src="${bundleScriptUri}"></script>
    </body>
    </html>`;
    }
}
WebviewPanel.viewType = "reactPreview";
exports.default = WebviewPanel;
//# sourceMappingURL=WebviewPanel.js.map