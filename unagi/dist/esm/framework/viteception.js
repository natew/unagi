import { createServer } from "vite";
async function viteception(paths, options) {
  const isWorker = process.env.WORKER;
  delete process.env.WORKER;
  const server = await createServer({
    clearScreen: false,
    server: { middlewareMode: "ssr" },
    ...options
  });
  if (isWorker) {
    process.env.WORKER = isWorker;
  }
  const loaded = await Promise.all(paths.map((path) => server.ssrLoadModule(path)));
  await server.close();
  return { server, loaded };
}
export {
  viteception
};
//# sourceMappingURL=viteception.js.map
