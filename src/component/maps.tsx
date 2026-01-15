import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { DivIcon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import novasEmpresas from '../data/empresas.json';

interface Cliente {
  id: number;
  nome: string;
  position: [number, number];
}

interface Regiao {
  id: number;
  nome: string;
  position: [number, number];
  totalClientes: number;
  clientes: Cliente[];
}

const empresaLocation: { position: [number, number]; nome: string; endereco: string } = {
  position: [-12.228252, -38.960909],
  nome: "Sede Principal",
  endereco: "Caminho Ilhéus, 13-1 - Cidade Nova, Feira de Santana - BA"
};

const allRegioes: Regiao[] = novasEmpresas as Regiao[];

const empresaIcon = new DivIcon({
  className: 'custom-icon-empresa',
  html: `<div style="background: #ef4444; width: 32px; height: 32px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.3);"></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32]
});

const regiaoIcon = new DivIcon({
    className: 'custom-icon-regiao',
    html: `<div style="background: #10b981; width: 32px; height: 32px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); border: 3px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.2);"></div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32]
});

const clienteIcon = new DivIcon({
  className: 'custom-icon-cliente',
  html: `<div style="background: #3b82f6; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

function MapResizer() {
  const map = useMap();
  useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
}


export default function Mapa() {
  const regioesVisiveis = allRegioes.filter(regiao => regiao.clientes && regiao.clientes.length > 0);
  const totalClientes = regioesVisiveis.reduce((sum, regiao) => sum + (regiao.clientes?.length || 0), 0);

  return (
    <div style={{ position: 'relative', height: '100%', width: '100%' }}>
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        zIndex: 401,
        background: 'rgba(23, 23, 23, 0.85)',
        backdropFilter: 'blur(4px)',
        color: 'white',
        borderRadius: '8px',
        padding: '12px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
        width: '220px',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <h3 style={{ margin: 0, marginBottom: '8px', fontSize: '16px', fontWeight: 'bold', borderBottom: '1px solid #555', paddingBottom: '8px' }}>
          Total de Clientes: {totalClientes}
        </h3>
        <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '14px' }}>
          <li style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ background: '#ef4444', width: '16px', height: '16px', borderRadius: '50%', marginRight: '8px', border: '2px solid white', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }}></span>
            Sede Principal
          </li>
          <li style={{ display: 'flex', alignItems: 'center', marginBottom: '6px' }}>
            <span style={{ background: '#10b981', width: '16px', height: '16px', borderRadius: '50%', marginRight: '8px', border: '2px solid white', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }}></span>
            Região Atendida
          </li>
          <li style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ background: '#3b82f6', width: '12px', height: '12px', borderRadius: '50%', marginRight: '8px', border: '2px solid white', boxShadow: '0 1px 2px rgba(0,0,0,0.2)' }}></span>
            Cliente
          </li>
        </ul>
      </div>

      <MapContainer
        center={[-14.2350, -51.9253]} 
        zoom={4}
        style={{ height: '100%', width: '100%' }}
        attributionControl={false}
      >
        <MapResizer />
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='© OpenStreetMap'
        />

        <Marker position={empresaLocation.position} icon={empresaIcon}>
          <Popup>
            <div className="p-1">
              <h3 className="font-bold text-base mb-1">🏢 {empresaLocation.nome}</h3>
              <p className="text-sm text-gray-600">{empresaLocation.endereco}</p>
            </div>
          </Popup>
        </Marker>

        {regioesVisiveis.map((regiao) => (
          <React.Fragment key={`regiao-${regiao.id}`}>
            <Marker position={regiao.position} icon={regiaoIcon}>
              <Popup>
                <div className="p-1">
                  <h3 className="font-bold text-base mb-1">📍 {regiao.nome}</h3>
                  <p className="text-sm text-gray-600">Total de Clientes: {regiao.clientes?.length || 0}</p>
                </div>
              </Popup>
            </Marker>

            {regiao.clientes.map((cliente) => (
              <Marker key={cliente.id} position={cliente.position} icon={clienteIcon}>
                <Popup>
                  <div className="p-1">
                    <h4 className="font-bold text-sm mb-1">👤 {cliente.nome}</h4>
                    <p className="text-xs text-gray-500">{regiao.nome}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </React.Fragment>
        ))}
      </MapContainer>
    </div>
  );
}