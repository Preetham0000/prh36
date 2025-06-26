"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const getWebviewOptions = (extensionUri) => {
    return {
        enableScripts: true,
        localResourceRoots: [
            vscode_1.Uri.joinPath(extensionUri, "out", "app"),
            vscode_1.Uri.joinPath(extensionUri, "app"),
        ],
    };
};
exports.default = getWebviewOptions;
//# sourceMappingURL=getWebviewOptions.js.map