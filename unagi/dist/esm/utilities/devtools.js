function sendMessageToClient(client = "browser-console", payload) {
  const devServer = globalThis.__viteDevServer;
  if (devServer) {
    devServer.ws.send({
      type: "custom",
      event: `hydrogen-${client}`,
      data: payload
    });
  }
}
export {
  sendMessageToClient
};
//# sourceMappingURL=devtools.js.map
