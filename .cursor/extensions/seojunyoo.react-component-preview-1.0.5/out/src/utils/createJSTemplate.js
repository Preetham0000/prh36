"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const createJSTemplate = (componentUri, componentName, propList) => {
    let props = "";
    propList &&
        propList.forEach((prop) => {
            if (prop.propType === "string") {
                props = `${props} ${prop.propName}={"${prop.defaultValue}"}`;
            }
            else {
                props = `${props} ${prop.propName}={${prop.defaultValue}}`;
            }
        });
    return `
  import ReactDOM from "react-dom";
  import ${componentName} from "${componentUri}";

  ReactDOM.render(<${componentName} ${props}/>, document.getElementById("root"));`;
};
exports.default = createJSTemplate;
//# sourceMappingURL=createJSTemplate.js.map