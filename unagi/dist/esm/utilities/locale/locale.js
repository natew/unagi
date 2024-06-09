function getLocale(language, countryCode) {
  if (!language || !countryCode) {
    return "";
  }
  if (isLanguageExtended(language)) {
    return hyphenateLanguage(language);
  }
  return `${language}-${countryCode}`;
}
function hyphenateLanguage(str) {
  return str.replace("_", "-");
}
function isLanguageExtended(str) {
  if (!str)
    return false;
  return str.includes("_") || str.includes("-");
}
export {
  getLocale
};
//# sourceMappingURL=locale.js.map
