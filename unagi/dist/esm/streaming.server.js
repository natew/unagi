import {
  renderToPipeableStream,
  renderToReadableStream
} from "react-dom/server";
import { createFromReadableStream as _createFromReadableStream } from "@tamagui/unagi/vendor/react-server-dom-vite";
import { renderToReadableStream as _rscRenderToReadableStream } from "@tamagui/unagi/vendor/react-server-dom-vite/writer.browser.server";
const rscRenderToReadableStream = _rscRenderToReadableStream;
const createFromReadableStream = _createFromReadableStream;
async function bufferReadableStream(reader, cb) {
  const decoder = new TextDecoder();
  let result = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done)
      break;
    const stringValue = typeof value === "string" ? value : decoder.decode(value);
    result += stringValue;
    if (cb) {
      cb(stringValue);
    }
  }
  return result;
}
export {
  bufferReadableStream,
  createFromReadableStream,
  rscRenderToReadableStream,
  renderToPipeableStream as ssrRenderToPipeableStream,
  renderToReadableStream as ssrRenderToReadableStream
};
//# sourceMappingURL=streaming.server.js.map
