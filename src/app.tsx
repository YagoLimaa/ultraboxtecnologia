import React from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from './components/Hero.tsx';
import MapSection from './components/MapSection.tsx';
import SystemsSection from './components/SystemsSection.tsx';
import CertificatesSection from './components/CertificatesSection.tsx';
import { systems, certificates, Certificate } from './data/products.ts';

export default function App() {
  const navigate = useNavigate();

  const handleBuyClick = (certificate: Certificate) => {
    navigate('/checkout', { state: { certificate } });
  };

  return (
    <>
      <Hero />
      <MapSection />
      <SystemsSection systems={systems} />
      <CertificatesSection certificates={certificates} onBuyClick={handleBuyClick} />
    </>
  );
}