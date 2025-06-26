"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePropInfo = exports.removePropInfo = exports.addPropInfo = exports.createAndShowPreviewConfig = exports.addGitIgnore = void 0;
const path = require("path");
const fs = require("fs");
const addGitIgnore = (workspacePath) => {
    const gitIgnoreContent = "\n# React Component Preview\npreviewConfig.json";
    if (fs.existsSync(path.join(workspacePath, ".gitignore"))) {
        const gitIgnore = fs.readFileSync(path.join(workspacePath, ".gitignore"), "utf8");
        if (gitIgnore.indexOf(gitIgnoreContent) === -1) {
            fs.appendFileSync(path.join(workspacePath, ".gitignore"), gitIgnoreContent);
        }
    }
};
exports.addGitIgnore = addGitIgnore;
const createAndShowPreviewConfig = (workspacePath) => {
    let previewConfigData = {};
    if (!fs.existsSync(path.join(workspacePath, "previewConfig.json"))) {
        fs.appendFileSync(path.resolve(workspacePath, "previewConfig.json"), "");
    }
    else {
        const previewConfig = fs.readFileSync(path.resolve(workspacePath, "previewConfig.json"), "utf8");
        previewConfigData = previewConfig ? JSON.parse(previewConfig) : {};
    }
    return previewConfigData;
};
exports.createAndShowPreviewConfig = createAndShowPreviewConfig;
const addPropInfo = (workspacePath, componentName, propInfo) => {
    const previewConfigData = (0, exports.createAndShowPreviewConfig)(workspacePath);
    previewConfigData[componentName] = previewConfigData[componentName] || [];
    previewConfigData[componentName].push(propInfo);
    fs.writeFileSync(path.resolve(workspacePath, "previewConfig.json"), JSON.stringify(previewConfigData, null, 2));
};
exports.addPropInfo = addPropInfo;
const removePropInfo = (workspacePath, componentName, propName) => {
    const previewConfigData = (0, exports.createAndShowPreviewConfig)(workspacePath);
    if (previewConfigData[componentName]) {
        previewConfigData[componentName] = previewConfigData[componentName].filter((prop) => prop.propName !== propName);
    }
    fs.writeFileSync(path.resolve(workspacePath, "previewConfig.json"), JSON.stringify(previewConfigData, null, 2));
};
exports.removePropInfo = removePropInfo;
const updatePropInfo = (workspacePath, componentName, prevPropName, propInfo) => {
    const previewConfigData = (0, exports.createAndShowPreviewConfig)(workspacePath);
    if (previewConfigData[componentName]) {
        previewConfigData[componentName] = previewConfigData[componentName].map((prop) => {
            if (prop.propName === prevPropName) {
                return propInfo;
            }
            return prop;
        });
    }
    fs.writeFileSync(path.resolve(workspacePath, "previewConfig.json"), JSON.stringify(previewConfigData, null, 2));
};
exports.updatePropInfo = updatePropInfo;
//# sourceMappingURL=previewConfigController.js.map