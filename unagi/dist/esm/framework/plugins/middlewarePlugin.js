import { promises as fs } from "fs";
import path from "path";
import bodyParser from "body-parser";
import { InMemoryCache } from "../cache.js";
import { unagiMiddleware } from "../middleware.js";
import { UNAGI_DEFAULT_SERVER_ENTRY } from "./virtualFilesPlugin.js";
var middlewarePlugin_default = (pluginOptions) => {
  return {
    name: "unagi:middleware",
    async configureServer(server) {
      const resolve = (p) => path.resolve(server.config.root, p);
      async function getIndexTemplate(url) {
        const indexHtml = await fs.readFile(resolve("index.html"), "utf-8");
        return await server.transformIndexHtml(url, indexHtml);
      }
      server.middlewares.use(bodyParser.raw({ type: "*/*" }));
      return () => server.middlewares.use(unagiMiddleware({
        dev: true,
        indexTemplate: getIndexTemplate,
        getServerEntrypoint: () => server.ssrLoadModule(UNAGI_DEFAULT_SERVER_ENTRY),
        devServer: server,
        cache: (pluginOptions == null ? void 0 : pluginOptions.devCache) ? new InMemoryCache() : void 0
      }));
    }
  };
};
export {
  middlewarePlugin_default as default
};
//# sourceMappingURL=middlewarePlugin.js.map
