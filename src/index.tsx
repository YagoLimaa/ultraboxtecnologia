import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './app.tsx';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.tsx';
import Checkout from './components/Checkout.tsx';
import PaymentSuccess from './components/PaymentSuccess.tsx';
import PoliticaPrivacidade from './pages/PoliticaPrivacidade.tsx';
import QuemSomos from './pages/QuemSomos.tsx';
import PoliticaEntrega from './pages/PoliticaEntrega.tsx';
import ScrollToTop from './components/ScrollToTop.tsx';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<App />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="payment-success" element={<PaymentSuccess />} />
          <Route path="politica-de-privacidade" element={<PoliticaPrivacidade />} />
          <Route path="quem-somos" element={<QuemSomos />} />
          <Route path="politica-de-entrega" element={<PoliticaEntrega />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
