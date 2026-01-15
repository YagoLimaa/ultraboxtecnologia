export interface System {
    title: string;
    description: string;
    features: string[];
    price: string;
    highlight: boolean;
}

export interface Certificate {
    title: string;
    validity: string;
    description: string;
    price: string;
    badge: string | null;
}

export const systems: System[] = [
    {
        title: 'Ultrabox ERP Premium',
        description: 'Sistema completo de gestão empresarial com controle de estoque, financeiro e fiscal.',
        features: ['Emissão de NFe/NFCe', 'Controle Financeiro', 'Multilojas'],
        price: 'Sob Consulta',
        highlight: true,
    },
    {
        title: 'PDV Rápido',
        description: 'Frente de caixa ágil e intuitivo, perfeito para mercados, padarias e varejo em geral.',
        features: ['Funcionamento Offline', 'Integração com Balança', 'TEF Integrado'],
        price: 'A partir de R$ 89,90/mês',
        highlight: false,
    },
    {
        title: 'Gestor Food',
        description: 'Solução específica para restaurantes e delivery com controle de mesas e comandas.',
        features: ['Cardápio Digital', 'Integração iFood', 'KDS (Cozinha)'],
        price: 'A partir de R$ 129,90/mês',
        highlight: false,
    },
];

export const certificates: Certificate[] = [
    {
        title: 'e-CPF A1',
        validity: 'Validade 1 Ano',
        description: 'Arquivo digital. Ideal para pessoas físicas.',
        price: 'R$ 149,00',
        badge: 'Mais Vendido'
    },
    {
        title: 'e-CNPJ A1',
        validity: 'Validade 1 Ano',
        description: 'Arquivo digital. Essencial para sua empresa.',
        price: 'R$ 199,00',
        badge: 'Promoção'
    },
    {
        title: 'e-CNPJ A3',
        validity: 'Validade 3 Anos',
        description: 'Token ou Cartão. Maior segurança e durabilidade.',
        price: 'R$ 349,00',
        badge: null
    },
    {
        title: 'Nuvem PF/PJ',
        validity: 'Mensal',
        description: 'Acesse seu certificado de qualquer lugar.',
        price: 'R$ 49,90/mês',
        badge: 'Novo'
    }
];
