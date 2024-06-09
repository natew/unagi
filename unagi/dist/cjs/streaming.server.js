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
var streaming_server_exports = {};
__export(streaming_server_exports, {
  bufferReadableStream: () => bufferReadableStream,
  createFromReadableStream: () => createFromReadableStream,
  rscRenderToReadableStream: () => rscRenderToReadableStream,
  ssrRenderToPipeableStream: () => import_server.renderToPipeableStream,
  ssrRenderToReadableStream: () => import_server.renderToReadableStream
});
module.exports = __toCommonJS(streaming_server_exports);
var import_server = require("react-dom/server");
var import_react_server_dom_vite = require("@tamagui/unagi/vendor/react-server-dom-vite");
var import_writer_browser = require("@tamagui/unagi/vendor/react-server-dom-vite/writer.browser.server");
const rscRenderToReadableStream = import_writer_browser.renderToReadableStream;
const createFromReadableStream = import_react_server_dom_vite.createFromReadableStream;
async function bufferReadableStream(reader, cb) {
  const decoder = new TextDecoder();
  let result = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done)
      break;
    const stringValue = typeof value === "string" ? value : decoder.decode(value);
    result += stringValue;
    if (cb) {
      cb(stringValue);
    }
  }
  return result;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  bufferReadableStream,
  createFromReadableStream,
  rscRenderToReadableStream,
  ssrRenderToPipeableStream,
  ssrRenderToReadableStream
});
//# sourceMappingURL=streaming.server.js.map
