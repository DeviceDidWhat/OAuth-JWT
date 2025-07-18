import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import OAuthSuccess from './pages/OAuthSuccess';
import Home from './pages/Home';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/oauth-success" element={<OAuthSuccess />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  </BrowserRouter>
);