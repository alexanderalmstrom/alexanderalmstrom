import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import App from './components/App'

import './styles/index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Content is fetched once per visit, and a failed request (such as an
      // unknown page slug) is reported straight away instead of retried.
      staleTime: Infinity,
      retry: false,
      // Contentful entries hold resolved links, which can make them circular,
      // so results are stored as they are instead of being deeply compared.
      structuralSharing: false,
    },
  },
})

createRoot(document.getElementById('app')!).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>,
)

if (import.meta.env.PROD && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(function () {
    console.log('Service Worker Registered')
  })
}
