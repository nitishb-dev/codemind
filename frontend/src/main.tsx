import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Apply base styles to the body for a consistent look and feel
document.body.className = 'bg-gray-50 text-gray-800 font-sans';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
