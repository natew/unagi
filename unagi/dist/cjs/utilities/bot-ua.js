"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var bot_ua_exports = {};
__export(bot_ua_exports, {
  isBotUA: () => isBotUA
});
module.exports = __toCommonJS(bot_ua_exports);
const botUserAgents = [
  "AdsBot-Google",
  "applebot",
  "Baiduspider",
  "baiduspider",
  "Bytespider",
  "360Spider",
  "PetalBot",
  "Yisouspider",
  "bingbot",
  "Bingbot",
  "BingPreview",
  "bitlybot",
  "Discordbot",
  "DuckDuckBot",
  "Embedly",
  "facebookcatalog",
  "facebookexternalhit",
  "Google-PageRenderer",
  "Googlebot",
  "googleweblight",
  "ia_archive",
  "LinkedInBot",
  "Mediapartners-Google",
  "outbrain",
  "pinterest",
  "quora link preview",
  "redditbot",
  "rogerbot",
  "showyoubot",
  "SkypeUriPreview",
  "Slackbot",
  "Slurp",
  "sogou",
  "Storebot-Google",
  "TelegramBot",
  "tumblr",
  "Twitterbot",
  "vkShare",
  "W3C_Validator",
  "WhatsApp",
  "yandex",
  "Seoradar",
  "W3C html2txt"
];
const botUARegex = new RegExp(botUserAgents.join("|"), "i");
function isBotUA(url, userAgent) {
  return url.searchParams.has("_bot") || !!userAgent && botUARegex.test(userAgent);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  isBotUA
});
//# sourceMappingURL=bot-ua.js.map
