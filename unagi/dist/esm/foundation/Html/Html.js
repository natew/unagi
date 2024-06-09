import React from "react";
const HTML_ATTR_SEP_RE = /(?<!=)"\s+/gim;
const getHtmlAttrs = (template) => {
  var _a;
  return ((_a = template.match(/<html\s+([^>]+?)\s*>/s)) == null ? void 0 : _a[1]) || "";
};
const getBodyAttrs = (template) => {
  var _a;
  return ((_a = template.match(/<body\s+([^>]+?)\s*>/s)) == null ? void 0 : _a[1]) || "";
};
const REACT_ATTR_MAP = /* @__PURE__ */ Object.create(null);
REACT_ATTR_MAP.class = "className";
REACT_ATTR_MAP.style = "data-style";
function attrsToProps(attrs) {
  attrs = attrs == null ? void 0 : attrs.trim();
  return attrs ? Object.fromEntries(attrs.split(HTML_ATTR_SEP_RE).map((attr) => {
    const [key, value] = attr.replace(/"/g, "").split(/=(.+)/);
    return [REACT_ATTR_MAP[key.toLowerCase()] || key, value];
  })) : {};
}
function propsToAttrs(props) {
  return Object.entries(props).map(([key, value]) => `${key === REACT_ATTR_MAP.class ? "class" : key}="${value}"`).join(" ");
}
const clientConfigOptions = ["strictMode"];
function Html({ children, template, htmlAttrs, bodyAttrs, unagiConfig }) {
  let head = template.match(/<head>(.+?)<\/head>/s)[1] || "";
  if (import.meta.env.DEV) {
    head = "<script><\/script>" + head.replace(/>(\s*?import[\s\w]+?['"]\/@react-refresh)/, ' async="">$1');
  }
  const clientConfig = {};
  for (const key of clientConfigOptions) {
    if (unagiConfig[key] != null) {
      clientConfig[key] = unagiConfig[key];
    }
  }
  const clientConfigAttr = Object.keys(clientConfig).length > 0 ? JSON.stringify(clientConfig) : void 0;
  return /* @__PURE__ */ React.createElement("html", {
    ...attrsToProps(getHtmlAttrs(template)),
    ...htmlAttrs
  }, /* @__PURE__ */ React.createElement("head", {
    dangerouslySetInnerHTML: { __html: head }
  }), /* @__PURE__ */ React.createElement("body", {
    ...attrsToProps(getBodyAttrs(template)),
    ...bodyAttrs
  }, /* @__PURE__ */ React.createElement("div", {
    id: "root",
    "data-client-config": clientConfigAttr
  }, children)));
}
function applyHtmlHead(html, head, template) {
  const { bodyAttrs, htmlAttrs, ...headTags } = extractHeadElements(head, template);
  return html.replace(/<head>(.*?)<\/head>/s, generateHeadTag(headTags)).replace(/<html[^>]*?>/s, htmlAttrs ? `<html ${htmlAttrs}>` : "$&").replace(/<body[^>]*?>/s, bodyAttrs ? `<body ${bodyAttrs}>` : "$&");
}
function extractHeadElements({ context: { helmet } }, template) {
  const htmlUniqueProps = attrsToProps(`${getHtmlAttrs(template)} ${helmet.htmlAttributes}`);
  const bodyUniqueProps = attrsToProps(`${getBodyAttrs(template)} ${helmet.bodyAttributes}`);
  return {
    htmlAttrs: propsToAttrs(htmlUniqueProps),
    bodyAttrs: propsToAttrs(bodyUniqueProps),
    base: helmet.base.toString(),
    link: helmet.link.toString(),
    meta: helmet.meta.toString(),
    noscript: helmet.noscript.toString(),
    script: helmet.script.toString(),
    style: helmet.style.toString(),
    title: helmet.title.toString()
  };
}
function generateHeadTag({ title, ...rest }) {
  const headProps = ["base", "meta", "style", "noscript", "script", "link"];
  const otherHeadProps = headProps.map((prop) => rest[prop]).filter(Boolean).join("\n");
  return (_outerHtml, innerHtml) => {
    let headHtml = otherHeadProps + innerHtml;
    if (title) {
      if (headHtml.includes("<title>")) {
        headHtml = headHtml.replace(/(<title>(?:.|\n)*?<\/title>)/, title);
      } else {
        headHtml += title;
      }
    }
    return `<head>${headHtml}</head>`;
  };
}
export {
  Html,
  applyHtmlHead
};
//# sourceMappingURL=Html.js.map
