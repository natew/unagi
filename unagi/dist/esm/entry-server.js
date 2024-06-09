import React, { Suspense } from "react";
import { splitCookiesString } from "set-cookie-parser";
import { getBuiltInRoute } from "./foundation/BuiltInRoutes/BuiltInRoutes.js";
import {
  deleteItemFromCache,
  getItemFromCache,
  isStale,
  setItemInCache
} from "./foundation/Cache/cache.js";
import { CacheShort, NO_STORE } from "./foundation/Cache/strategies/index.js";
import { DevTools } from "./foundation/DevTools/DevTools.server.js";
import { Html, applyHtmlHead } from "./foundation/Html/Html.js";
import { getCache, setCache } from "./foundation/runtime.js";
import { ServerPropsProvider } from "./foundation/ServerPropsProvider/index.js";
import {
  ServerRequestProvider,
  preloadRequestCacheData
} from "./foundation/ServerRequestProvider/index.js";
import { getSyncSessionApi } from "./foundation/session/session.js";
import { UnagiRequest } from "./foundation/UnagiRequest/UnagiRequest.server.js";
import { UnagiResponse } from "./foundation/UnagiResponse/UnagiResponse.server.js";
import {
  bufferReadableStream,
  createFromReadableStream,
  rscRenderToReadableStream,
  ssrRenderToPipeableStream,
  ssrRenderToReadableStream
} from "./streaming.server.js";
import { getApiRouteFromURL, getApiRoutes, renderApiRoute } from "./utilities/apiRoutes.js";
import { isBotUA } from "./utilities/bot-ua.js";
import { getErrorMarkup } from "./utilities/error.js";
import { htmlEncode } from "./utilities/htmlEncoding.js";
import {
  getLoggerWithContext,
  logCacheControlHeaders,
  logQueryTimings,
  logServerResponse,
  setLogger
} from "./utilities/log/index.js";
import { parseJSON } from "./utilities/parse.js";
import { stripScriptsFromTemplate } from "./utilities/template.js";
const DOCTYPE = "<!DOCTYPE html>";
const CONTENT_TYPE = "Content-Type";
const HTML_CONTENT_TYPE = "text/html; charset=UTF-8";
const renderUnagi = (App) => {
  const handleRequest = async function(rawRequest, options) {
    var _a, _b;
    const { cache, context, buyerIpHeader, headers } = options;
    const request = new UnagiRequest(rawRequest);
    const url = new URL(request.url);
    let sessionApi = options.sessionApi;
    const { default: inlineUnagiConfig } = await import(
      // @ts-ignore
      "virtual__unagi.config.ts"
    );
    const { default: unagiRoutes } = await import(
      // @ts-ignore
      "virtual__unagi-routes.server.jsx"
    );
    const unagiConfig = {
      ...inlineUnagiConfig,
      routes: unagiRoutes
    };
    request.ctx.unagiConfig = unagiConfig;
    request.ctx.buyerIpHeader = buyerIpHeader;
    setLogger(unagiConfig.logger);
    const log = getLoggerWithContext(request);
    const response = new UnagiResponse(null, {
      headers: headers || {}
    });
    if (unagiConfig.poweredByHeader ?? true) {
      response.headers.set("powered-by", "Tamagui-Unagi");
    }
    sessionApi ??= (_a = unagiConfig.session) == null ? void 0 : _a.call(unagiConfig, log);
    request.ctx.session = getSyncSessionApi(request, response, log, sessionApi);
    request.ctx.runtime = context;
    setCache(cache);
    const builtInRouteResource = getBuiltInRoute(url);
    if (builtInRouteResource) {
      const apiResponse = await renderApiRoute(request, {
        resource: builtInRouteResource,
        params: {},
        hasServerComponent: false
      }, unagiConfig, {
        session: sessionApi,
        suppressLog: true
      });
      return apiResponse instanceof Request ? handleRequest(apiResponse, {
        ...options,
        sessionApi,
        headers: apiResponse.headers
      }) : apiResponse;
    }
    if (cache) {
      const cachedResponse = await getItemFromCache(request.cacheKey());
      if (cachedResponse) {
        if (isStale(request, cachedResponse)) {
          const lockCacheKey = request.cacheKey(true);
          const staleWhileRevalidatePromise = getItemFromCache(lockCacheKey).then(async (lockExists) => {
            if (lockExists)
              return;
            try {
              response.doNotStream();
              await setItemInCache(lockCacheKey, new Response(null), CacheShort({
                maxAge: 10
              }));
              await processRequest(handleRequest, App, url, request, sessionApi, options, response, unagiConfig, true);
            } catch (e) {
              log.error("Cache revalidate error", e);
            }
          });
          (_b = request.ctx.runtime) == null ? void 0 : _b.waitUntil(staleWhileRevalidatePromise);
        }
        return cachedResponse;
      }
    }
    return processRequest(handleRequest, App, url, request, sessionApi, options, response, unagiConfig);
  };
  if (__UNAGI_WORKER__)
    return handleRequest;
  return (rawRequest, options) => handleFetchResponseInNode(handleRequest(rawRequest, options), options.streamableResponse);
};
async function processRequest(handleRequest, App, url, request, sessionApi, options, response, unagiConfig, revalidate = false) {
  const { dev, nonce, indexTemplate, streamableResponse: nodeResponse } = options;
  const log = getLoggerWithContext(request);
  const isRSCRequest = request.isRscRequest();
  const apiRoute = !isRSCRequest && getApiRoute(url, unagiConfig.routes);
  if (apiRoute && (!apiRoute.hasServerComponent || request.method !== "GET")) {
    const apiResponse = await renderApiRoute(request, apiRoute, unagiConfig, {
      session: sessionApi
    });
    return apiResponse instanceof Request ? handleRequest(apiResponse, {
      ...options,
      sessionApi,
      headers: apiResponse.headers
    }) : apiResponse;
  }
  const state = isRSCRequest ? parseJSON(decodeURIComponent(url.searchParams.get("state") || "{}")) : {
    pathname: decodeURIComponent(url.pathname),
    search: decodeURIComponent(url.search)
  };
  const rsc = runRSC({ App, state, log, request, response });
  if (isRSCRequest) {
    const buffered = await bufferReadableStream(rsc.readable.getReader());
    postRequestTasks("rsc", 200, request, response);
    cacheResponse(response, request, [buffered], revalidate);
    return new Response(buffered, {
      headers: response.headers
    });
  }
  if (isBotUA(url, request.headers.get("user-agent"))) {
    response.doNotStream();
  }
  return runSSR({
    log,
    dev,
    rsc,
    nonce,
    state,
    request,
    response,
    nodeResponse,
    template: await getTemplate(indexTemplate, url),
    revalidate
  });
}
async function getTemplate(indexTemplate, url) {
  let template = typeof indexTemplate === "function" ? await indexTemplate(url.toString()) : indexTemplate;
  if (template && typeof template !== "string") {
    template = template.default;
  }
  return template;
}
function getApiRoute(url, routes) {
  const apiRoutes = getApiRoutes(routes);
  return getApiRouteFromURL(url, apiRoutes);
}
function assembleHtml({ ssrHtml, rscPayload, request, template }) {
  let html = applyHtmlHead(ssrHtml, request.ctx.head, template);
  if (rscPayload) {
    html = html.replace("</body>", () => flightContainer(rscPayload) + "</body>");
  }
  return html;
}
async function runSSR({
  rsc,
  state,
  request,
  response,
  nodeResponse,
  template,
  nonce,
  dev,
  log,
  revalidate
}) {
  let ssrDidError;
  const didError = () => rsc.didError() ?? ssrDidError;
  const [rscReadableForFizz, rscReadableForFlight] = rsc.readable.tee();
  const rscResponse = createFromReadableStream(rscReadableForFizz);
  const RscConsumer = () => rscResponse.readRoot();
  const { noScriptTemplate, bootstrapScripts, bootstrapModules } = stripScriptsFromTemplate(template);
  const AppSSR = /* @__PURE__ */ React.createElement(Html, {
    template: response.canStream() ? noScriptTemplate : template,
    unagiConfig: request.ctx.unagiConfig
  }, /* @__PURE__ */ React.createElement(ServerRequestProvider, {
    request
  }, /* @__PURE__ */ React.createElement(ServerPropsProvider, {
    initialServerProps: state,
    setServerPropsForRsc: () => {
    },
    setRscResponseFromApiRoute: () => {
    }
  }, /* @__PURE__ */ React.createElement(Suspense, {
    fallback: null
  }, /* @__PURE__ */ React.createElement(RscConsumer, null)))));
  log.trace("start ssr");
  const rscReadable = response.canStream() ? new ReadableStream({
    start(controller) {
      log.trace("rsc start chunks");
      const encoder = new TextEncoder();
      bufferReadableStream(rscReadableForFlight.getReader(), (chunk) => {
        const metaTag = flightContainer(chunk);
        controller.enqueue(encoder.encode(metaTag));
      }).then(() => {
        log.trace("rsc finish chunks");
        return controller.close();
      });
    }
  }) : rscReadableForFlight;
  if (__UNAGI_WORKER__) {
    const encoder = new TextEncoder();
    const transform = new TransformStream();
    const writable = transform.writable.getWriter();
    const responseOptions = {};
    const savedChunks = tagOnWrite(writable);
    let ssrReadable;
    try {
      ssrReadable = await ssrRenderToReadableStream(AppSSR, {
        nonce,
        bootstrapScripts,
        bootstrapModules,
        onError(error) {
          ssrDidError = error;
          if (dev && !writable.closed && !!responseOptions.status) {
            writable.write(getErrorMarkup(error));
          }
          log.error(error);
        }
      });
    } catch (error) {
      log.error(error);
      return new Response(template + (dev ? getErrorMarkup(error) : ""), {
        status: 500,
        headers: { [CONTENT_TYPE]: HTML_CONTENT_TYPE }
      });
    }
    if (response.canStream())
      log.trace("worker ready to stream");
    ssrReadable.allReady.then(() => log.trace("worker complete ssr"));
    const prepareForStreaming = () => {
      Object.assign(responseOptions, getResponseOptions(response, didError()));
      if (responseOptions.status >= 400) {
        responseOptions.headers.set("cache-control", "no-store");
      } else {
        responseOptions.headers.set("cache-control", response.cacheControlHeader);
      }
      if (isRedirect(responseOptions)) {
        return false;
      }
      responseOptions.headers.set(CONTENT_TYPE, HTML_CONTENT_TYPE);
      writable.write(encoder.encode(DOCTYPE));
      const error = didError();
      if (error) {
        writable.write(encoder.encode(dev ? getErrorMarkup(error) : template));
      }
      return true;
    };
    const shouldFlushBody = response.canStream() ? prepareForStreaming() : await ssrReadable.allReady.then(prepareForStreaming);
    if (shouldFlushBody) {
      let bufferedSsr = "";
      let isPendingSsrWrite = false;
      const writingSSR = bufferReadableStream(ssrReadable.getReader(), response.canStream() ? (chunk) => {
        bufferedSsr += chunk;
        if (!isPendingSsrWrite) {
          isPendingSsrWrite = true;
          setTimeout(() => {
            isPendingSsrWrite = false;
            if (bufferedSsr) {
              writable.write(encoder.encode(bufferedSsr));
              bufferedSsr = "";
            }
          }, 0);
        }
      } : void 0);
      const writingRSC = bufferReadableStream(rscReadable.getReader(), response.canStream() ? (scriptTag) => writable.write(encoder.encode(scriptTag)) : void 0);
      Promise.all([writingSSR, writingRSC]).then(([ssrHtml, rscPayload]) => {
        if (!response.canStream()) {
          const html = assembleHtml({ ssrHtml, rscPayload, request, template });
          writable.write(encoder.encode(html));
        }
        setTimeout(() => {
          writable.close();
          postRequestTasks("str", responseOptions.status, request, response);
          response.status = responseOptions.status;
          cacheResponse(response, request, savedChunks, revalidate);
        }, 0);
      });
    } else {
      writable.close();
      postRequestTasks("str", responseOptions.status, request, response);
    }
    if (response.canStream()) {
      return new Response(transform.readable, responseOptions);
    }
    const bufferedBody = await bufferReadableStream(transform.readable.getReader());
    return new Response(bufferedBody, responseOptions);
  } else if (nodeResponse) {
    const savedChunks = tagOnWrite(nodeResponse);
    nodeResponse.on("finish", () => {
      response.status = nodeResponse.statusCode;
      cacheResponse(response, request, savedChunks, revalidate);
    });
    const { pipe } = ssrRenderToPipeableStream(AppSSR, {
      nonce,
      bootstrapScripts,
      bootstrapModules,
      onShellReady() {
        log.trace("node ready to stream");
        writeHeadToNodeResponse(nodeResponse, response, log, didError());
        if (isRedirect(nodeResponse)) {
          return nodeResponse.end();
        }
        if (!response.canStream())
          return;
        startWritingToNodeResponse(nodeResponse, dev ? didError() : void 0);
        setTimeout(() => {
          log.trace("node pipe response");
          if (!nodeResponse.writableEnded)
            pipe(nodeResponse);
        }, 0);
        bufferReadableStream(rscReadable.getReader(), (chunk) => {
          log.trace("rsc chunk");
          if (!nodeResponse.writableEnded)
            nodeResponse.write(chunk);
        });
      },
      async onAllReady() {
        log.trace("node complete ssr");
        if (!revalidate && (response.canStream() || nodeResponse.writableEnded)) {
          postRequestTasks("str", nodeResponse.statusCode, request, response);
          return;
        }
        writeHeadToNodeResponse(nodeResponse, response, log, didError());
        if (isRedirect(nodeResponse)) {
          return nodeResponse.end();
        }
        const bufferedResponse = await createNodeWriter();
        const bufferedRscPromise = bufferReadableStream(rscReadable.getReader());
        let ssrHtml = "";
        bufferedResponse.on("data", (chunk) => ssrHtml += chunk.toString());
        bufferedResponse.once("error", (error) => ssrDidError = error);
        bufferedResponse.once("end", async () => {
          const rscPayload = await bufferedRscPromise;
          const error = didError();
          startWritingToNodeResponse(nodeResponse, dev ? error : void 0);
          let html = template;
          if (!error) {
            html = assembleHtml({ ssrHtml, rscPayload, request, template });
            postRequestTasks("ssr", nodeResponse.statusCode, request, response);
          }
          if (!nodeResponse.writableEnded) {
            nodeResponse.write(html);
            nodeResponse.end();
          }
        });
        pipe(bufferedResponse);
      },
      onShellError(error) {
        log.error(error);
        if (!nodeResponse.writableEnded) {
          writeHeadToNodeResponse(nodeResponse, response, log, error);
          startWritingToNodeResponse(nodeResponse, dev ? error : void 0);
          nodeResponse.write(template);
          nodeResponse.end();
        }
      },
      onError(error) {
        var _a;
        if ((_a = error.message) == null ? void 0 : _a.includes("stream closed early")) {
          return;
        }
        ssrDidError = error;
        if (dev && nodeResponse.headersSent && !nodeResponse.writableEnded) {
          nodeResponse.write(getErrorMarkup(error));
        }
        log.error(error);
      }
    });
  }
}
function runRSC({ App, state, log, request, response }) {
  var _a;
  const serverProps = { ...state, request, response, log };
  request.ctx.router.serverProps = serverProps;
  preloadRequestCacheData(request);
  const AppRSC = /* @__PURE__ */ React.createElement(ServerRequestProvider, {
    request
  }, /* @__PURE__ */ React.createElement(App, {
    ...serverProps
  }), ((_a = request.ctx.unagiConfig) == null ? void 0 : _a.__EXPERIMENTAL__devTools) && /* @__PURE__ */ React.createElement(Suspense, {
    fallback: null
  }, /* @__PURE__ */ React.createElement(DevTools, null)));
  let rscDidError;
  const rscReadable = rscRenderToReadableStream(AppRSC, {
    onError(e) {
      rscDidError = e;
      log.error(e);
    }
  });
  return { readable: rscReadable, didError: () => rscDidError };
}
var entry_server_default = renderUnagi;
function startWritingToNodeResponse(nodeResponse, error) {
  if (nodeResponse.writableEnded)
    return;
  if (!nodeResponse.headersSent) {
    nodeResponse.setHeader(CONTENT_TYPE, HTML_CONTENT_TYPE);
    nodeResponse.write(DOCTYPE);
  }
  if (error) {
    nodeResponse.write(getErrorMarkup(error));
  }
}
function getResponseOptions({ headers, status, statusText }, error) {
  const responseInit = {
    headers,
    status: error ? 500 : status
  };
  if (!error && statusText) {
    responseInit.statusText = statusText;
  }
  return responseInit;
}
function writeHeadToNodeResponse(nodeResponse, componentResponse, log, error) {
  if (nodeResponse.headersSent)
    return;
  log.trace("writeHeadToNodeResponse");
  const { headers, status, statusText } = getResponseOptions(componentResponse, error);
  if (status >= 400) {
    nodeResponse.setHeader("cache-control", "no-store");
  } else {
    nodeResponse.setHeader("cache-control", componentResponse.cacheControlHeader);
  }
  nodeResponse.statusCode = status;
  if (statusText) {
    nodeResponse.statusMessage = statusText;
  }
  setNodeHeaders(headers, nodeResponse);
}
function isRedirect(response) {
  const status = response.status ?? response.statusCode ?? 0;
  return status >= 300 && status < 400;
}
async function createNodeWriter() {
  const streamImport = __UNAGI_WORKER__ ? "" : "stream";
  const { PassThrough } = await import(streamImport);
  return new PassThrough();
}
function flightContainer(chunk) {
  return `<meta data-flight="${htmlEncode(chunk)}" />`;
}
function postRequestTasks(type, status, request, response) {
  logServerResponse(type, request, status);
  logCacheControlHeaders(type, request, response);
  logQueryTimings(type, request);
  request.savePreloadQueries();
}
function handleFetchResponseInNode(fetchResponsePromise, nodeResponse) {
  if (nodeResponse) {
    fetchResponsePromise.then((response) => {
      if (!response || nodeResponse.writableEnded)
        return;
      setNodeHeaders(response.headers, nodeResponse);
      nodeResponse.statusCode = response.status;
      if (response.body) {
        if (response.body instanceof ReadableStream) {
          bufferReadableStream(response.body.getReader(), (chunk) => {
            nodeResponse.write(chunk);
          }).then(() => nodeResponse.end());
        } else {
          nodeResponse.write(response.body);
          nodeResponse.end();
        }
      } else {
        nodeResponse.end();
      }
    });
  }
  return fetchResponsePromise;
}
function setNodeHeaders(headers, nodeResponse) {
  for (const [key, value] of headers.entries()) {
    if (key.toLowerCase() === "set-cookie") {
      nodeResponse.setHeader(key, splitCookiesString(value));
    } else {
      nodeResponse.setHeader(key, value);
    }
  }
}
function tagOnWrite(response) {
  const originalWrite = response.write;
  const decoder = new TextDecoder();
  const savedChunks = [];
  response.write = (arg) => {
    if (arg instanceof Uint8Array) {
      savedChunks.push(decoder.decode(arg));
    } else {
      savedChunks.push(arg);
    }
    return originalWrite.apply(response, [arg]);
  };
  return savedChunks;
}
async function cacheResponse(response, request, chunks, revalidate) {
  var _a;
  const cache = getCache();
  if (cache && chunks.length > 0 && response.status === 200 && response.cache().mode !== NO_STORE && !response.headers.has("Set-Cookie") && /get/i.test(request.method) && !sessionHasCustomerAccessToken(request)) {
    if (revalidate) {
      await saveCacheResponse(response, request, chunks);
    } else {
      const cachePutPromise = Promise.resolve(true).then(() => saveCacheResponse(response, request, chunks));
      (_a = request.ctx.runtime) == null ? void 0 : _a.waitUntil(cachePutPromise);
    }
  }
}
function sessionHasCustomerAccessToken(request) {
  const session = request.ctx.session;
  try {
    const sessionData = session == null ? void 0 : session.get();
    return sessionData && sessionData["customerAccessToken"];
  } catch (error) {
    return false;
  }
}
async function saveCacheResponse(response, request, chunks) {
  const cache = getCache();
  if (cache && chunks.length > 0) {
    const { headers, status, statusText } = getResponseOptions(response);
    headers.set("cache-control", response.cacheControlHeader);
    const currentHeader = headers.get("Content-Type");
    if (!currentHeader && !request.isRscRequest()) {
      headers.set("Content-Type", HTML_CONTENT_TYPE);
    }
    await setItemInCache(request.cacheKey(), new Response(chunks.join(""), {
      status,
      statusText,
      headers
    }), response.cache());
    deleteItemFromCache(request.cacheKey(true));
  }
}
export {
  entry_server_default as default,
  renderUnagi
};
//# sourceMappingURL=entry-server.js.map
