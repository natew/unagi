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
export {
  isBotUA
};
//# sourceMappingURL=bot-ua.js.map
