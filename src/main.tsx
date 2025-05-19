
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { createStorageBuckets } from './integrations/supabase/setupStorage.ts';

// Set up storage buckets
createStorageBuckets()
  .then(() => {
    console.log('Storage buckets setup complete');
  })
  .catch(error => {
    console.error('Failed to set up storage buckets:', error);
  });

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
