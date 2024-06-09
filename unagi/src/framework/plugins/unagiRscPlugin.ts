import reactServerDomVite from '@tamagui/unagi/vendor/react-server-dom-vite/plugin.js'

import { UNAGI_DEFAULT_SERVER_ENTRY, VIRTUAL_PROXY_UNAGI_ROUTES_ID } from './virtualFilesPlugin.js'

export default function (options?: any) {
  return reactServerDomVite({
    serverBuildEntries: [UNAGI_DEFAULT_SERVER_ENTRY, VIRTUAL_PROXY_UNAGI_ROUTES_ID],
    isServerComponentImporterAllowed(importer: string, source: string) {
      console.log('source', source)
      return (
        // Always allow the entry server (e.g. App.server.jsx) to be imported
        // in other files such as worker.js or server.js.
        source.includes(UNAGI_DEFAULT_SERVER_ENTRY) ||
        /(index|entry-server|tamagui\.config)\.[jt]s/.test(importer) ||
        // Support importing server components for testing
        // TODO: revisit this when RSC splits into two bundles
        /\.test\.[tj]sx?$/.test(importer)
      )
    },
    ...options,
  })
}
