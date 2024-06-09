import { promises as fs } from 'fs'
import path from 'path'

import { Plugin, ResolvedConfig, ViteDevServer, normalizePath } from 'vite'

import type { UnagiVitePluginOptions } from '../types.js'
import { viteception } from '../viteception.js'

export const UNAGI_DEFAULT_SERVER_ENTRY = process.env.UNAGI_SERVER_ENTRY || '/src/App.server'

// The character ":" breaks Vite with Node >= 16.15. Use "_" instead
const VIRTUAL_PREFIX = 'virtual__'
const PROXY_PREFIX = 'proxy__'

const ERROR_FILE = 'error.jsx'
const VIRTUAL_ERROR_FILE = VIRTUAL_PREFIX + ERROR_FILE

const UNAGI_CONFIG_ID = 'unagi.config.ts'
const VIRTUAL_UNAGI_CONFIG_ID = VIRTUAL_PREFIX + UNAGI_CONFIG_ID
export const VIRTUAL_PROXY_UNAGI_CONFIG_ID = VIRTUAL_PREFIX + PROXY_PREFIX + UNAGI_CONFIG_ID

const UNAGI_ROUTES_ID = 'unagi-routes.server.jsx'
const VIRTUAL_UNAGI_ROUTES_ID = VIRTUAL_PREFIX + UNAGI_ROUTES_ID
export const VIRTUAL_PROXY_UNAGI_ROUTES_ID = VIRTUAL_PREFIX + PROXY_PREFIX + UNAGI_ROUTES_ID

export default (pluginOptions: UnagiVitePluginOptions) => {
  let config: ResolvedConfig
  let server: ViteDevServer

  return {
    name: 'unagi:virtual-files',
    configResolved(_config) {
      config = _config
    },
    configureServer(_server) {
      server = _server
    },
    resolveId(source, importer) {
      console.log('virtual files', source, importer)
      if (source === VIRTUAL_UNAGI_CONFIG_ID) {
        return findUnagiConfigPath(config.root, pluginOptions.configPath).then((hcPath: string) =>
          // This direct dependency on a real file
          // makes HMR work for the virtual module.
          this.resolve(hcPath, importer, { skipSelf: true })
        )
      }

      if (
        [
          VIRTUAL_PROXY_UNAGI_CONFIG_ID,
          VIRTUAL_PROXY_UNAGI_ROUTES_ID,
          VIRTUAL_UNAGI_ROUTES_ID,
          VIRTUAL_ERROR_FILE,
        ].includes(source)
      ) {
        // Virtual modules convention
        // https://vitejs.dev/guide/api-plugin.html#virtual-modules-convention

        return '\0' + source
      }
    },
    load(id) {
      // Likely due to a bug in Vite, but virtual modules cannot be loaded
      // directly using ssrLoadModule from a Vite plugin. It needs to be proxied as follows:
      if (id === '\0' + VIRTUAL_PROXY_UNAGI_CONFIG_ID) {
        return `import hc from '${VIRTUAL_UNAGI_CONFIG_ID}'; export default hc;`
      }
      if (id === '\0' + VIRTUAL_PROXY_UNAGI_ROUTES_ID) {
        return `import hr from '${VIRTUAL_UNAGI_ROUTES_ID}'; export default hr;`
      }

      if (id === '\0' + VIRTUAL_UNAGI_ROUTES_ID) {
        return importUnagiConfig().then((hc) => {
          let routesPath: string =
            (typeof hc.routes === 'string' ? hc.routes : hc.routes?.files) ?? '/src/routes'

          if (routesPath.startsWith('./')) {
            routesPath = routesPath.slice(1)
          }

          if (!routesPath.includes('*')) {
            if (!routesPath.endsWith('/')) {
              routesPath += '/'
            }

            routesPath += '**/*.server.[jt](s|sx)'
          }

          const [dirPrefix] = routesPath.split('/*')

          let code = `export default {\n  dirPrefix: '${dirPrefix}',\n  basePath: '${
            hc.routes?.basePath ?? ''
          }',\n  files: import.meta.globEager('${routesPath}')\n};`

          if (config.command === 'serve') {
            // Add dependency on Unagi config for HMR
            code += `\nimport '${VIRTUAL_UNAGI_CONFIG_ID}';`
          }

          return { code }
        })
      }

      if (id === '\0' + VIRTUAL_ERROR_FILE) {
        return importUnagiConfig().then((hc) => {
          const errorPath = hc.serverErrorPage ?? '/src/Error.{jsx,tsx}'
          const code = `const errorPage = import.meta.glob("${errorPath}");\n export default Object.values(errorPage)[0];`
          return { code }
        })
      }
    },
  } as Plugin

  async function importUnagiConfig() {
    if (server) {
      const loaded = await server.ssrLoadModule(VIRTUAL_PROXY_UNAGI_CONFIG_ID)

      return loaded.default
    }

    const { loaded } = await viteception([VIRTUAL_PROXY_UNAGI_CONFIG_ID])
    return loaded[0].default
  }
}

async function findUnagiConfigPath(root: string, userProvidedPath?: string) {
  console.log('find', root, userProvidedPath)
  let configPath = userProvidedPath

  if (!configPath) {
    // Find the config file in the project root
    const files = await fs.readdir(root)
    configPath = files.find((file) => /^unagi\.config\.[jt]s$/.test(file))
  }

  console.log('configPath', configPath)

  if (configPath) {
    configPath = normalizePath(configPath)

    if (!configPath.startsWith('/')) configPath = path.resolve(root, configPath)
  }

  console.log('configPath', configPath)

  return configPath || require.resolve('@tamagui/unagi/utilities/empty-unagi-config')
}
