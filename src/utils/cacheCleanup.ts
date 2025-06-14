
// Cache cleanup utility for development
export const clearBrowserCache = () => {
  // Clear localStorage
  localStorage.clear();
  
  // Clear sessionStorage
  sessionStorage.clear();
  
  // Clear service worker cache if available
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => {
        registration.unregister();
      });
    });
  }
  
  // Clear browser cache programmatically (limited in browsers)
  if ('caches' in window) {
    caches.keys().then(names => {
      names.forEach(name => {
        caches.delete(name);
      });
    });
  }
  
  console.log('Cache cleared successfully');
};

// Force reload the page
export const forceReload = () => {
  window.location.reload();
};
