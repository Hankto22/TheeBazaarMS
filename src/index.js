import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App.js';
import reportWebVitals from './reportWebVitals.js';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);

// Register service worker for PWA (only in production)
if ('serviceWorker' in navigator) {
  if (process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration);
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError);
        });
    });
  } else {
    // Aggressively unregister service worker in development
    console.log('Development mode: unregistering service workers...');
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      console.log('Found', registrations.length, 'service worker registrations');
      registrations.forEach((registration) => {
        registration.unregister().then(() => {
          console.log('SW unregistered in dev mode:', registration.scope);
        });
      });
    });

    // Also unregister on every page load in dev
    window.addEventListener('load', () => {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        if (registrations.length > 0) {
          console.log('Unregistering', registrations.length, 'service workers on page load');
          registrations.forEach((registration) => {
            registration.unregister().then(() => {
              console.log('SW force unregistered on page load in dev:', registration.scope);
            });
          });
        }
      });
    });
  }
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
