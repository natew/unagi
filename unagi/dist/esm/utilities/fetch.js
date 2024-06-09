import { LIB_VERSION } from "../version.js";
const defaultHeaders = {
  "content-type": "application/json",
  "user-agent": `Unagi ${LIB_VERSION}`
};
function fetchBuilder(url, options = {}) {
  const requestInit = {
    ...options,
    headers: { ...defaultHeaders, ...options.headers }
  };
  return async () => {
    const response = await fetch(url, requestInit);
    if (!response.ok) {
      throw response;
    }
    const data = await response.json();
    return data;
  };
}
function graphqlRequestBody(query, variables) {
  return JSON.stringify({
    query,
    variables
  });
}
function decodeShopifyId(id) {
  if (!id.startsWith("gid://")) {
    throw new Error("invalid Shopify ID");
  }
  return id;
}
export {
  decodeShopifyId,
  fetchBuilder,
  graphqlRequestBody
};
//# sourceMappingURL=fetch.js.map
