"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivate = exports.activate = void 0;
const vscode = require("vscode");
const WebviewPanel_1 = require("./WebviewPanel");
const previewConfigController_1 = require("./utils/previewConfigController");
const activate = (context) => {
    context.subscriptions.push(vscode.commands.registerCommand("preview.start", () => {
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders)
            return;
        const workspacePath = workspaceFolders[0].uri.path;
        (0, previewConfigController_1.addGitIgnore)(workspacePath);
        WebviewPanel_1.default.createAndShow(context.extensionUri, workspacePath);
    }));
};
exports.activate = activate;
const deactivate = () => {
    if (WebviewPanel_1.default.currentPanel) {
        WebviewPanel_1.default.currentPanel.dispose();
    }
};
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map