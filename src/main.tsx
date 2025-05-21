
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from '@/components/ui/theme-provider'
import { Toaster } from "@/components/ui/toaster"
import { BrowserRouter as Router } from 'react-router-dom'
import { createStorageBuckets } from './integrations/supabase/setupStorage'

// Initialize storage buckets
createStorageBuckets().catch(console.error);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <App />
        <Toaster />
      </Router>
    </ThemeProvider>
  </React.StrictMode>,
)
