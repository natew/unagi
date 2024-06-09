"use strict";
var import_useNavigate = require("./useNavigate.js");
describe("buildPath", () => {
  it(`doesn't transform base path "/"`, () => {
    expect((0, import_useNavigate.buildPath)("/", "/")).toBe("/");
    expect((0, import_useNavigate.buildPath)("/", "/path")).toBe("/path");
    expect((0, import_useNavigate.buildPath)("/", "/path?params")).toBe("/path?params");
  });
  it("transforms with base path", () => {
    expect((0, import_useNavigate.buildPath)("/base", "/")).toBe("/base/");
    expect((0, import_useNavigate.buildPath)("/base", "/path")).toBe("/base/path");
    expect((0, import_useNavigate.buildPath)("/base", "path")).toBe("/base/path");
    expect((0, import_useNavigate.buildPath)("/base/", "/path")).toBe("/base/path");
    expect((0, import_useNavigate.buildPath)("/base", "/path?params")).toBe("/base/path?params");
  });
  it("doesn't transform fully qualified URLs", () => {
    expect((0, import_useNavigate.buildPath)("/base", "http://website.com")).toBe("http://website.com");
    expect((0, import_useNavigate.buildPath)("/base", "https://website.com")).toBe("https://website.com");
    expect((0, import_useNavigate.buildPath)("/base", "//website.com")).toBe("//website.com");
    expect((0, import_useNavigate.buildPath)("/", "http://website.com")).toBe("http://website.com");
    expect((0, import_useNavigate.buildPath)("/", "https://website.com")).toBe("https://website.com");
    expect((0, import_useNavigate.buildPath)("/", "//website.com")).toBe("//website.com");
  });
});
//# sourceMappingURL=useNavigate.test.js.map
