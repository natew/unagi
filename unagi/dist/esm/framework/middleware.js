let entrypointError = null;
function unagiMiddleware({
  dev,
  cache,
  indexTemplate,
  getServerEntrypoint,
  devServer
}) {
  if (dev && devServer) {
    globalThis.__viteDevServer = devServer;
  }
  const webPolyfills = !globalThis.fetch || !globalThis.ReadableStream ? import("../utilities/webPolyfill.js") : void 0;
  return async function(request, response, next) {
    try {
      await webPolyfills;
      const entrypoint = await Promise.resolve(getServerEntrypoint()).catch((error) => {
        entrypointError = error;
      });
      const handleRequest = (entrypoint == null ? void 0 : entrypoint.default) ?? entrypoint;
      if (typeof handleRequest !== "function") {
        if (entrypointError) {
          throw entrypointError;
        } else {
          throw new Error('Something is wrong in your project. Make sure to add "export default renderUnagi(...)" in your server entry file.');
        }
      }
      entrypointError = null;
      await handleRequest(request, {
        dev,
        cache,
        indexTemplate,
        streamableResponse: response
      });
    } catch (e) {
      if (dev && devServer)
        devServer.ssrFixStacktrace(e);
      response.statusCode = 500;
      try {
        const template = typeof indexTemplate === "function" ? await indexTemplate(request.originalUrl ?? request.url ?? "") : indexTemplate;
        const html = template.replace(`<div id="root"></div>`, `<div id="root"><pre><code>${e.stack}</code></pre></div>`);
        response.write(html);
        next(e);
      } catch (_e) {
        response.write(e.stack);
        next(e);
      }
    }
  };
}
export {
  unagiMiddleware
};
//# sourceMappingURL=middleware.js.map
