
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { createStorageBuckets } from './integrations/supabase/setupStorage.ts';
import { toast } from 'sonner';

// Set up storage buckets
createStorageBuckets()
  .then(() => {
    console.log('Storage buckets setup complete');
  })
  .catch(error => {
    console.error('Failed to set up storage buckets:', error);
    toast.error('Falha ao configurar buckets de armazenamento');
  });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
