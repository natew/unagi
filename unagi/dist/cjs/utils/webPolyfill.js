"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var import_abort_controller = __toESM(require("abort-controller"));
var import_undici = __toESM(require("undici"));
var import_ponyfill = require("web-streams-polyfill/ponyfill");
if (!globalThis.fetch) {
  Object.assign(globalThis, {
    fetch: import_undici.default,
    Request: import_undici.Request,
    Response: import_undici.Response,
    Headers: import_undici.Headers,
    AbortController: import_abort_controller.default
  });
}
if (!globalThis.FormData) {
  Object.assign(globalThis, {
    FormData: import_undici.FormData
  });
}
if (!globalThis.ReadableStream) {
  Object.assign(globalThis, {
    ReadableStream: import_ponyfill.ReadableStream,
    WritableStream: import_ponyfill.WritableStream,
    TransformStream: import_ponyfill.TransformStream
  });
}
//# sourceMappingURL=webPolyfill.js.map
