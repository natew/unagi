"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target, mod));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var configPlugin_exports = {};
__export(configPlugin_exports, {
  default: () => configPlugin_default
});
module.exports = __toCommonJS(configPlugin_exports);
var configPlugin_default = () => {
  const rollupOptions = {
    output: {}
  };
  const isWorker = Boolean(process.env.WORKER) && process.env.WORKER !== "undefined";
  if (isWorker) {
    rollupOptions.output = {
      format: "es"
    };
  }
  if (process.env.NODE_ENV !== "development" && !process.env.LOCAL_DEV) {
    rollupOptions.output = {
      ...rollupOptions.output,
      chunkFileNames: "assets/[hash].js"
    };
  }
  return {
    name: "vite-plugin-unagi-config",
    config: async (config, env) => {
      var _a, _b, _c;
      return {
        resolve: {
          alias: {
            "react-server-dom-vite/client-proxy": require.resolve("@tamagui/unagi/vendor/react-server-dom-vite/esm/react-server-dom-vite-client-proxy.js")
          }
        },
        build: {
          minify: ((_a = config.build) == null ? void 0 : _a.minify) ?? (process.env.LOCAL_DEV ? false : "esbuild"),
          sourcemap: true,
          rollupOptions: ((_b = config.build) == null ? void 0 : _b.rollupOptions) ? Object.assign(rollupOptions, config.build.rollupOptions) : rollupOptions,
          target: ((_c = config.build) == null ? void 0 : _c.ssr) ? isWorker ? "es2022" : "es2020" : "modules"
        },
        ssr: {
          noExternal: isWorker || [/react-server-dom-vite/],
          target: isWorker ? "webworker" : "node"
        },
        server: process.env.LOCAL_DEV && {
          watch: {
            ignored: ["!**/node_modules/@tamagui/unagi/**", "!**/node_modules/tamagui/**"]
          }
        },
        optimizeDeps: {
          exclude: [
            "@tamagui/unagi",
            "@tamagui/unagi/client",
            "@tamagui/unagi/entry-client",
            "@tamagui/unagi-ui"
          ],
          include: [
            "react-helmet-async",
            "react-error-boundary",
            "react",
            "react-dom/client",
            "react-server-dom-vite/client-proxy",
            "react/jsx-runtime",
            "set-cookie-parser",
            "undici"
          ]
        },
        define: {
          __UNAGI_DEV__: env.mode !== "production",
          __UNAGI_WORKER__: isWorker,
          __UNAGI_TEST__: false
        },
        envPrefix: ["VITE_", "PUBLIC_"],
        base: process.env.UNAGI_ASSET_BASE_URL
      };
    }
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=configPlugin.js.map
