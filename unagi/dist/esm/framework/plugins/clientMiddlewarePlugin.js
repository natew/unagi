import { send } from "vite";
var clientMiddlewarePlugin_default = () => {
  return {
    name: "vite-plugin-unagi-client-middleware",
    enforce: "pre",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url;
        try {
          if (/\.client\.[jt]sx?\?v=/.test(url) && !/\/node_modules\//.test(url)) {
            const result = await server.transformRequest(url, { html: false });
            if (result) {
              return send(req, res, result.code, "js", {
                etag: result.etag,
                cacheControl: "no-cache",
                headers: server.config.server.headers,
                map: result.map
              });
            }
          }
        } catch (e) {
          next(e);
        }
        next();
      });
    }
  };
};
export {
  clientMiddlewarePlugin_default as default
};
//# sourceMappingURL=clientMiddlewarePlugin.js.map
