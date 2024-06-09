import fs from "fs";
import path from "path";
import fastGlob from "fast-glob";
import MagicString from "magic-string";
import { normalizePath } from "vite";
import { UNAGI_DEFAULT_SERVER_ENTRY } from "./virtualFilesPlugin";
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
      if (normalizePath(source).includes("/unagi/platforms/")) {
        const unagiPath = path.dirname(require.resolve("@tamagui/unagi/package.json"));
        const platformEntryName = source.split(path.sep).pop() || "";
        const platformEntryPath = path.resolve(unagiPath, "dist", "esnext", "platforms", platformEntryName);
        return this.resolve(platformEntryPath, importer, {
          skipSelf: true
        });
      }
      return null;
    },
    async transform(code, id, options) {
      if (config.command === "build" && (options == null ? void 0 : options.ssr) && /@tamagui\/unagi\/.+platforms\/virtual\./.test(normalizePath(id))) {
        const ms = new MagicString(code);
        ms.replace("__UNAGI_ENTRY__", UNAGI_DEFAULT_SERVER_ENTRY);
        if (!clientBuildPath) {
          clientBuildPath = normalizePath(path.resolve(config.root, config.build.outDir, "..", "client"));
        }
        ms.replace("__UNAGI_HTML_TEMPLATE__", normalizePath(path.resolve(clientBuildPath, "index.html")));
        ms.replace("__UNAGI_RELATIVE_CLIENT_BUILD__", normalizePath(path.relative(normalizePath(path.resolve(config.root, config.build.outDir)), clientBuildPath)));
        const files = clientBuildPath ? (await fastGlob("**/*", {
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
        clientBuildPath = normalizePath(path.resolve(config.root, config.build.outDir));
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
        fs.writeFileSync(path.join(options.dir, "package.json"), JSON.stringify(packageJson, null, 2), "utf-8");
      }
    }
  };
};
export {
  platformEntryPlugin_default as default
};
//# sourceMappingURL=platformEntryPlugin.js.map
