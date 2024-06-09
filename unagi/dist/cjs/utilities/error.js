"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var error_exports = {};
__export(error_exports, {
  getErrorMarkup: () => getErrorMarkup
});
module.exports = __toCommonJS(error_exports);
function getErrorMarkup(error) {
  return `<script type="module">
    import {ErrorOverlay} from '/@vite/client.js';
    document.body.appendChild(new ErrorOverlay(${JSON.stringify(error, Object.getOwnPropertyNames(error)).replace(/</g, "\\u003c")}));
<\/script>`;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getErrorMarkup
});
//# sourceMappingURL=error.js.map
