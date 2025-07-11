"use strict";
/*
  Copyright (c) 2023-2024, Oracle and/or its affiliates.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

     https://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
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
exports.JdkDownloaderView = void 0;
const constants_1 = require("../../constants");
const vscode_1 = require("vscode");
const os = require("os");
const action_1 = require("./action");
const styles_1 = require("./styles");
const localiser_1 = require("../../localiser");
const logger_1 = require("../../logger");
const utils_1 = require("../../utils");
class JdkDownloaderView {
    constructor() {
        this.jdkDownloaderTitle = localiser_1.l10n.value("jdk.downloader.heading");
        this.oracleJdkVersions = [];
        this.createView = () => __awaiter(this, void 0, void 0, function* () {
            try {
                logger_1.LOGGER.log("Creating JDK downloader webview");
                this.jdkDownloaderWebView = vscode_1.window.createWebviewPanel('jdkDownloader', this.jdkDownloaderTitle, vscode_1.ViewColumn.One, {
                    enableScripts: true
                });
                this.oracleJdkVersions = yield this.getOracleJdkVersions();
                this.setDropdownOptions();
                this.jdkDownloaderWebView.webview.html = this.fetchJdkDownloadViewHtml();
                this.jdkDownloaderWebView.webview.onDidReceiveMessage(message => {
                    const jdkDownloader = new action_1.JdkDownloaderAction(this);
                    jdkDownloader.attachListener(message);
                });
                logger_1.LOGGER.log("JDK downloader webview created successfully");
            }
            catch (err) {
                logger_1.LOGGER.error("Error creating JDK downloader webview:");
                logger_1.LOGGER.error((err === null || err === void 0 ? void 0 : err.message) || "No Error message received");
                vscode_1.window.showErrorMessage(localiser_1.l10n.value("jdk.downloader.error_message.errorLoadingPage"));
            }
        });
        this.disposeView = () => __awaiter(this, void 0, void 0, function* () {
            var _a;
            yield ((_a = this.jdkDownloaderWebView) === null || _a === void 0 ? void 0 : _a.dispose());
        });
        this.setDropdownOptions = () => __awaiter(this, void 0, void 0, function* () {
            const osTypeNode = os.type();
            switch (osTypeNode) {
                case "Linux":
                    this.osType = "linux";
                    break;
                case "Darwin":
                    this.osType = "macOS";
                    break;
                default:
                    this.osType = "windows";
                    break;
            }
            logger_1.LOGGER.log(`OS identified: ${this.osType}`);
            const machineArchNode = os.arch();
            if (machineArchNode === "arm64") {
                this.machineArch = "aarch64";
            }
            else {
                this.machineArch = "x64";
            }
            logger_1.LOGGER.log(`Machine architecture identified: ${this.machineArch}`);
        });
        this.fetchJdkDownloadViewHtml = () => {
            return `<!DOCTYPE html>
        <head>
            <title>${this.jdkDownloaderTitle}</title>
            <style>
            ${styles_1.downloaderCss}
            </style>
        </head>
        <body>
            <h1>${this.jdkDownloaderTitle}</h1>
            ${localiser_1.l10n.value("jdk.downloader.html.details")}
            <br>
            <button id="oracleJDK" class="select-jdk">${localiser_1.l10n.value("jdk.downloader.button.label.oracleJdk")}</button>
            ${localiser_1.l10n.value("jdk.downloader.label.or")}
            <button id="openJDK" class="select-jdk">${localiser_1.l10n.value("jdk.downloader.button.label.openJdk")}</button> 
            ${localiser_1.l10n.value("jdk.downloader.label.or")}
            <button id="addJDKPathManually" class="select-jdk">${localiser_1.l10n.value("jdk.downloader.button.label.selectJdkFromSystem")}</button>
            <br>
            <br>
            <div class="jdk-version-container" id="oracleJDKDiv">
            <div class="jdk-flex-basis">
                <label class="jdk-version-label">${localiser_1.l10n.value("jdk.downloader.label.selectOracleJdkVersion")}</label>
                <br />
                <div class="jdk-version-dropdown">
                <select id="oracleJDKVersionDropdown">
                    ${this.getJdkVersionsHtml(this.oracleJdkVersions)}
                </select>
                </div>
            </div>
            <div class="jdk-flex-basis">
                <label class="jdk-version-label">${localiser_1.l10n.value("jdk.downloader.label.detectedOs")}</label>
                <br />
                <div class="jdk-version-dropdown">
                <select id="oracleJDKOsTypeDropdown">
                    ${this.getOsTypeHtml()}
                </select>
                </div>
            </div>
            <div class="jdk-flex-basis">
                <label class="jdk-version-label">${localiser_1.l10n.value("jdk.downloader.label.detectedMachineArchitecture")}</label>
                <br />
                <div class="jdk-version-dropdown">
                <select id="oracleJDKMachineArchDropdown">
                    ${this.getMachineArchHtml()}
                </select>
                </div>
            </div>
            <div class="jdk-confirm-button">
                <button id="oracleJDKDownloadButton" class="select-jdk">${localiser_1.l10n.value("jdk.downloader.button.label.downloadAndInstall")}</button>
            </div>
            </div>
            <div class="jdk-version-container" id="openJDKDiv">
            <div class="jdk-flex-basis">
                <label class="jdk-version-label">${localiser_1.l10n.value("jdk.downloader.label.selectOpenJdkVersion")}</label>
                <br />
                <div class="jdk-version-dropdown">
                <select id="openJDKVersionDropdown">
                    ${this.getJdkVersionsHtml(Object.keys(constants_1.jdkDownloaderConstants.OPEN_JDK_VERSION_DOWNLOAD_LINKS))}
                </select>
                </div>
            </div>
            <div class="jdk-flex-basis">
                <label class="jdk-version-label">${localiser_1.l10n.value("jdk.downloader.label.detectedOs")}</label>
                <br />
                <div class="jdk-version-dropdown">
                <select id="openJDKOsTypeDropdown">
                    ${this.getOsTypeHtml()}
                </select>
                </div>
            </div>
            <div class="jdk-flex-basis">
                <label class="jdk-version-label">${localiser_1.l10n.value("jdk.downloader.label.detectedMachineArchitecture")}</label>
                <br />
                <div class="jdk-version-dropdown">
                <select id="openJDKMachineArchDropdown">
                    ${this.getMachineArchHtml()}
                </select>
                </div>
            </div>
            <div class="jdk-confirm-button">
                <button id="openJDKDownloadButton" class="select-jdk">${localiser_1.l10n.value("jdk.downloader.button.label.downloadAndInstall")}</button>
            </div>
            </div>
        </body>
        <script>
        ${this.getScriptJs()}
        </script>
      </html>
    `;
        };
        this.getOracleJdkVersions = () => __awaiter(this, void 0, void 0, function* () {
            var _b;
            try {
                logger_1.LOGGER.log("Fetching Oracle JDK versions...");
                const availableVersions = yield (0, utils_1.httpsGet)(`${constants_1.jdkDownloaderConstants.ORACLE_JDK_RELEASES_BASE_URL}?licenseType=NFTC&sortBy=jdkVersion&sortOrder=DESC`);
                if ((0, utils_1.isString)(availableVersions)) {
                    const availableVersionsObj = JSON.parse(availableVersions);
                    if (availableVersionsObj === null || availableVersionsObj === void 0 ? void 0 : availableVersionsObj.items) {
                        const jdkVersions = (_b = availableVersionsObj === null || availableVersionsObj === void 0 ? void 0 : availableVersionsObj.items) === null || _b === void 0 ? void 0 : _b.map((version) => version.jdkDetails.jdkVersion);
                        logger_1.LOGGER.log(`Fetched Oracle JDK versions: ${jdkVersions}`);
                        return jdkVersions;
                    }
                }
                logger_1.LOGGER.warn(`Response of Oracle JDK versions is not as expected`);
            }
            catch (error) {
                const msg = `Some error occurred while fetching Oracle JDK versions: ${(0, utils_1.isError)(error) ? error.message : null}`;
                logger_1.LOGGER.warn(msg);
            }
            return constants_1.jdkDownloaderConstants.ORACLE_JDK_FALLBACK_VESIONS;
        });
        this.getJdkVersionsHtml = (jdkVersions) => {
            let htmlStr = "";
            jdkVersions.forEach((el, index) => {
                if (index === 0) {
                    htmlStr += `<option value=${el} default>JDK ${el}</option>\n`;
                }
                else {
                    htmlStr += `<option value=${el}>JDK ${el}</option>\n`;
                }
            });
            return htmlStr;
        };
        this.getOsTypeHtml = () => {
            return `<option value="windows" ${this.osType === 'windows' ? 'selected' : null}>${localiser_1.l10n.value("jdk.downloader.label.windows")}</option>
                <option value="macOS" ${this.osType === 'macOS' ? 'selected' : null}>${localiser_1.l10n.value("jdk.downloader.label.mac")}</option>
                <option value="linux" ${this.osType === 'linux' ? 'selected' : null}>${localiser_1.l10n.value("jdk.downloader.label.linux")}</option>`;
        };
        this.getMachineArchHtml = () => {
            if (this.osType === 'windows') {
                return `<option value="x64" selected>x64</option>`;
            }
            else {
                return `<option value="aarch64" ${this.machineArch === 'aarch64' ? 'selected' : null}>arm64</option>
                    <option value="x64" ${this.machineArch === 'x64' ? 'selected' : null}>x64</option>`;
            }
        };
        this.getScriptJs = () => {
            return `const vscode = acquireVsCodeApi();
                let activeButton = null;
                const oracleJdkButtonId = 'oracleJDK';
                const openJdkButtonId = 'openJDK';

                document.getElementById("openJDK")?.addEventListener('click', event => {
                    hideOrDisplayDivs(event);
                });

                document.getElementById("oracleJDK")?.addEventListener('click', event => {
                    hideOrDisplayDivs(event);
                });

                document.getElementById("addJDKPathManually")?.addEventListener('click', event => {
                    vscode.postMessage({
                        command: "${JdkDownloaderView.DOWNLOAD_CMD_LABEL}",
                        installType: "${action_1.JdkDownloaderAction.MANUAL_INSTALLATION_TYPE}",
                    });
                });

                document.getElementById("openJDKDownloadButton")?.addEventListener('click', event => {
                    triggerJDKDownload(event);
                });

                document.getElementById("oracleJDKDownloadButton")?.addEventListener('click', event => {
                    triggerJDKDownload(event);
                });

                document.getElementById("oracleJDKOsTypeDropdown")?.addEventListener('change', (event) => {
                    updateMachineArchOptions(event.target.id);
                });

                document.getElementById("openJDKOsTypeDropdown")?.addEventListener('change', (event) => {
                    updateMachineArchOptions(event.target.id);
                });
                
                const updateMachineArchOptions = (osDropdownId) => {
                    const osDropdown = document.getElementById(osDropdownId);
                    const machineArchDropdown = document.getElementById(osDropdownId.replace('OsTypeDropdown', 'MachineArchDropdown'));
                    
                    if (osDropdown.value === 'windows') {
                        machineArchDropdown.innerHTML = '<option value="x64" selected>x64</option>';
                    } else {
                        machineArchDropdown.innerHTML = \`
                            <option value="aarch64" \${machineArchDropdown.value === 'aarch64' ? 'selected' : null}>arm64</option>
                            <option value="x64" \${machineArchDropdown.value === 'x64' ? 'selected' : null}>x64</option>
                        \`;
                    }
                };

                const hideOrDisplayDivs = (e) => {
                    const { id } = e.target;
                    if(activeButton){
                        activeButton.classList.remove("active");
                        const activeButtonDiv = document.getElementById(activeButton.id+'Div'); 
                        activeButtonDiv.style.display ='none';
                    }

                    if(activeButton?.id !== id){
                        activeButton = e.target;
                        activeButton.classList.add("active");
                        document.getElementById(id+'Div').style.display ='flex';
                    } else{
                        activeButton = null;
                    }
                };

                const triggerJDKDownload = (e) => {
                    const { id } = e.target;
                    const jdkType = id === openJdkButtonId+'DownloadButton' ? "${JdkDownloaderView.OPEN_JDK_LABEL}" : "${JdkDownloaderView.ORACLE_JDK_LABEL}";
                    vscode.postMessage({
                        command: "${JdkDownloaderView.DOWNLOAD_CMD_LABEL}",
                        id: jdkType,
                        installType: "${action_1.JdkDownloaderAction.AUTO_INSTALLATION_TYPE}",
                        jdkVersion: document.getElementById(activeButton.id+'VersionDropdown').value,
                        jdkOS: document.getElementById(activeButton.id+'OsTypeDropdown').value,
                        jdkArch: document.getElementById(activeButton.id+'MachineArchDropdown').value
                    });
                }
                `;
        };
    }
}
exports.JdkDownloaderView = JdkDownloaderView;
JdkDownloaderView.OPEN_JDK_LABEL = "OpenJDK";
JdkDownloaderView.ORACLE_JDK_LABEL = "Oracle JDK";
JdkDownloaderView.DOWNLOAD_CMD_LABEL = 'downloadJDK';
//# sourceMappingURL=view.js.map