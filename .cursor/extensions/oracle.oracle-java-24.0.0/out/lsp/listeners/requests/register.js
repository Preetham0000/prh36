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
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRequestListeners = void 0;
const handlers_1 = require("./handlers");
const terminal_1 = require("./terminal");
const listeners = [
    ...handlers_1.requestListeners,
    ...terminal_1.terminalListeners
];
const registerRequestListeners = (client) => {
    listeners.forEach((listener) => {
        const { type, handler } = listener;
        client.onRequest(type, handler);
    });
};
exports.registerRequestListeners = registerRequestListeners;
//# sourceMappingURL=register.js.map