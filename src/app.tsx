import React from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from './component/Hero.tsx';
import MapSection from './component/MapSection.tsx';
import SystemsSection from './component/SystemsSection.tsx';
import CertificatesSection from './component/CertificatesSection.tsx';
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