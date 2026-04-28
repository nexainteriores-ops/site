import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import V2 from './V2.tsx';
import V3 from './V3.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/v2" element={<V2 />} />
        <Route path="/v3" element={<V3 />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
