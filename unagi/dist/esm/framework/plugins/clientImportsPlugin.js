function clientImportsPlugin() {
  return {
    name: "unagi:client-imports",
    enforce: "pre",
    async resolveId(source, importer, { ssr }) {
      console.log("resolving client", source, importer);
      if (ssr)
        return;
      if (/\.server\.(j|t)sx?/.test(importer ?? ""))
        return;
      if ("@tamagui/unagi" !== source)
        return;
      const resolution = await this.resolve("@tamagui/unagi/client", importer, {
        skipSelf: true
      });
      if (resolution) {
        return resolution.id;
      }
    }
  };
}
export {
  clientImportsPlugin as default
};
//# sourceMappingURL=clientImportsPlugin.js.map
