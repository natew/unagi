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
var platformEntryPlugin_exports = {};
__export(platformEntryPlugin_exports, {
  default: () => platformEntryPlugin_default
});
module.exports = __toCommonJS(platformEntryPlugin_exports);
var import_fs = __toESM(require("fs"));
var import_path = __toESM(require("path"));
var import_fast_glob = __toESM(require("fast-glob"));
var import_magic_string = __toESM(require("magic-string"));
var import_vite = require("vite");
var import_virtualFilesPlugin = require("./virtualFilesPlugin");
const SSR_BUNDLE_NAME = "index.js";
let clientBuildPath;
var platformEntryPlugin_default = () => {
  let config;
  let isESM;
  return {
    name: "unagi:platform-entry",
    enforce: "pre",
    configResolved(_config) {
      config = _config;
      if (config.build.ssr) {
        const { output = {} } = config.build.rollupOptions || {};
        const { format = "" } = (Array.isArray(output) ? output[0] : output) || {};
        isESM = Boolean(process.env.WORKER) || ["es", "esm"].includes(format);
      }
    },
    resolveId(source, importer) {
      console.log("platform entry", source, importer);
      if ((0, import_vite.normalizePath)(source).includes("/unagi/platforms/")) {
        const unagiPath = import_path.default.dirname(require.resolve("@tamagui/unagi/package.json"));
        const platformEntryName = source.split(import_path.default.sep).pop() || "";
        const platformEntryPath = import_path.default.resolve(unagiPath, "dist", "esnext", "platforms", platformEntryName);
        return this.resolve(platformEntryPath, importer, {
          skipSelf: true
        });
      }
      return null;
    },
    async transform(code, id, options) {
      if (config.command === "build" && (options == null ? void 0 : options.ssr) && /@tamagui\/unagi\/.+platforms\/virtual\./.test((0, import_vite.normalizePath)(id))) {
        const ms = new import_magic_string.default(code);
        ms.replace("__UNAGI_ENTRY__", import_virtualFilesPlugin.UNAGI_DEFAULT_SERVER_ENTRY);
        if (!clientBuildPath) {
          clientBuildPath = (0, import_vite.normalizePath)(import_path.default.resolve(config.root, config.build.outDir, "..", "client"));
        }
        ms.replace("__UNAGI_HTML_TEMPLATE__", (0, import_vite.normalizePath)(import_path.default.resolve(clientBuildPath, "index.html")));
        ms.replace("__UNAGI_RELATIVE_CLIENT_BUILD__", (0, import_vite.normalizePath)(import_path.default.relative((0, import_vite.normalizePath)(import_path.default.resolve(config.root, config.build.outDir)), clientBuildPath)));
        const files = clientBuildPath ? (await (0, import_fast_glob.default)("**/*", {
          cwd: clientBuildPath,
          ignore: ["**/index.html", `**/${config.build.assetsDir}/**`]
        })).map((file) => "/" + file) : [];
        ms.replace("\\['__UNAGI_ASSETS__'\\]", JSON.stringify(files));
        ms.replace("__UNAGI_ASSETS_DIR__", config.build.assetsDir);
        ms.replace("__UNAGI_ASSETS_BASE_URL__", (process.env.UNAGI_ASSET_BASE_URL || "").replace(/\/$/, ""));
        ms.replace("throw", "//");
        return {
          code: ms.toString(),
          map: ms.generateMap({ file: id, source: id })
        };
      }
    },
    buildEnd(err) {
      if (!err && !config.build.ssr && config.command === "build") {
        clientBuildPath = (0, import_vite.normalizePath)(import_path.default.resolve(config.root, config.build.outDir));
      }
    },
    generateBundle(options, bundle) {
      if (config.build.ssr) {
        const [key, value] = Object.entries(bundle).find(([, value2]) => value2.type === "chunk" && value2.isEntry);
        delete bundle[key];
        value.fileName = SSR_BUNDLE_NAME;
        bundle[SSR_BUNDLE_NAME] = value;
        if (value.type === "chunk" && !isESM) {
          value.code += `
module.exports = exports.default || exports;`;
        }
      }
    },
    writeBundle(options) {
      if (config.build.ssr && options.dir) {
        const mainFile = `./${SSR_BUNDLE_NAME}`;
        const packageJson = {
          type: isESM ? "module" : "commonjs",
          main: mainFile,
          exports: { ".": mainFile, [mainFile]: mainFile }
        };
        import_fs.default.writeFileSync(import_path.default.join(options.dir, "package.json"), JSON.stringify(packageJson, null, 2), "utf-8");
      }
    }
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=platformEntryPlugin.js.map
