// Máscaras e helpers reutilizáveis para o checkout
export const maskPhone = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length === 0) return '';
  if (numbers.length <= 2) return `(${numbers}`;
  if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
};

export const maskCPF = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length === 0) return '';
  if (numbers.length <= 3) return numbers;
  if (numbers.length <= 6) return `${numbers.slice(0, 3)}.${numbers.slice(3)}`;
  if (numbers.length <= 9) return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6)}`;
  return `${numbers.slice(0, 3)}.${numbers.slice(3, 6)}.${numbers.slice(6, 9)}-${numbers.slice(9, 11)}`;
};

export const maskCEP = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length === 0) return '';
  if (numbers.length <= 5) return numbers;
  return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
};

export const maskCardNumber = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length === 0) return '';
  if (numbers.length <= 4) return numbers;
  if (numbers.length <= 8) return `${numbers.slice(0, 4)} ${numbers.slice(4)}`;
  if (numbers.length <= 12) return `${numbers.slice(0, 4)} ${numbers.slice(4, 8)} ${numbers.slice(8)}`;
  return `${numbers.slice(0, 4)} ${numbers.slice(4, 8)} ${numbers.slice(8, 12)} ${numbers.slice(12, 16)}`;
};

export const maskExpiration = (value: string): string => {
  const numbers = value.replace(/\D/g, '');
  if (numbers.length === 0) return '';
  if (numbers.length <= 2) return numbers;
  return `${numbers.slice(0, 2)}/${numbers.slice(2, 4)}`;
};

export const maskCVV = (value: string): string => {
  return value.replace(/\D/g, '').slice(0, 4);
};

export const sanitizeId = (input: string) => {
  return input.replace(/[^a-zA-Z0-9_\-|]/g, '');
};

export const formatAmount = (priceStr: string) => {
  if (!priceStr) return 0;
  let s = String(priceStr).trim();
  s = s.replace(/[^0-9,.]/g, '');
  if (s.includes(',') && !s.includes('.')) s = s.replace(/,/, '.');
  if (s.includes('.') && s.indexOf('.') !== s.lastIndexOf('.')) {
    s = s.replace(/\.(?=.*\.)/g, '');
  }
  const n = parseFloat(s);
  return Number.isFinite(n) ? n : 0;
};
