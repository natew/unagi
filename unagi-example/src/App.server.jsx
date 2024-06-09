import { FileRoutes, Router } from '@tamagui/unagi'
import renderUnagi from '@tamagui/unagi/entry-server'
import { Suspense } from 'react'

function App() {
  return (
    <Suspense fallback="Loading...">
      <Router>
        <FileRoutes />
      </Router>
    </Suspense>
  )
}

export default renderUnagi(App)
