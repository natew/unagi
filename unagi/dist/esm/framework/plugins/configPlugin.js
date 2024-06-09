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
export {
  configPlugin_default as default
};
//# sourceMappingURL=configPlugin.js.map
