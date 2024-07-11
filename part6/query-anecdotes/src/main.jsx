import ReactDOM from 'react-dom/client'
import App from './App'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AnecdotesContextProvider } from './AnecdotesContext'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <AnecdotesContextProvider>
      <App />
    </AnecdotesContextProvider>
  </QueryClientProvider>
)
