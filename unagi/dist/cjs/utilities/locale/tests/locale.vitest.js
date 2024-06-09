"use strict";
var import__ = require("../index.js");
describe("locale", () => {
  describe("getLocale", () => {
    it("returns `language` as `locale` given a language with a subtag extensions", () => {
      const countryCode = "US";
      const language = "PT_BR";
      const result = (0, import__.getLocale)(language, countryCode);
      expect(result).toBe("PT-BR");
    });
    it("returns `locale` as the merge of the `language` and `countryCode`", () => {
      const countryCode = "US";
      const language = "PT";
      const result = (0, import__.getLocale)(language, countryCode);
      expect(result).toBe("PT-US");
    });
    it("returns empty string when `language` or `countryCode` as missing", () => {
      const countryCode = "US";
      const result = (0, import__.getLocale)(void 0, countryCode);
      expect(result).toBe("");
    });
  });
});
//# sourceMappingURL=locale.vitest.js.map
