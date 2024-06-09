function stripScriptsFromTemplate(template) {
  var _a;
  const bootstrapScripts = [];
  const bootstrapModules = [];
  const scripts = template.matchAll(/<script\n*?.+?src="(?<script>([^"]+?))"\n*.*?><\/script>/g);
  for (const match of scripts) {
    const scriptName = (_a = match.groups) == null ? void 0 : _a.script;
    if (!scriptName)
      continue;
    if (match[0].includes(`type="module"`)) {
      bootstrapModules.push(scriptName);
    } else {
      bootstrapScripts.push(scriptName);
    }
    template = template.replace(match[0], "");
  }
  return { noScriptTemplate: template, bootstrapScripts, bootstrapModules };
}
export {
  stripScriptsFromTemplate
};
//# sourceMappingURL=template.js.map
