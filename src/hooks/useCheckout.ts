import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Certificate } from '../data/products.ts';
import { getApiBaseUrl } from '../utils.ts';
import { maskPhone, maskCPF, maskCEP, sanitizeId, formatAmount } from '../utils/checkoutUtils';

interface ViaCepResponse {
  logradouro?: string;
  bairro?: string;
  localidade?: string;
  uf?: string;
  erro?: boolean;
}

interface UseCheckoutResult {
  // form state
  customerName: string;
  setCustomerName: (v: string) => void;
  customerEmail: string;
  setCustomerEmail: (v: string) => void;
  customerCellphone: string;
  setCustomerCellphone: (v: string) => void;
  customerTaxId: string;
  setCustomerTaxId: (v: string) => void;

  customerAddressCep: string;
  setCustomerAddressCep: (v: string) => void;
  customerAddressPlace: string;
  setCustomerAddressPlace: (v: string) => void;
  customerAddressNumber: string;
  setCustomerAddressNumber: (v: string) => void;
  customerAddressComplement: string;
  setCustomerAddressComplement: (v: string) => void;
  customerAddressNeighborhood: string;
  setCustomerAddressNeighborhood: (v: string) => void;
  customerAddressCity: string;
  setCustomerAddressCity: (v: string) => void;
  customerAddressState: string;
  setCustomerAddressState: (v: string) => void;

  cardNumber: string;
  setCardNumber: (v: string) => void;
  cardName: string;
  setCardName: (v: string) => void;
  cardCVV: string;
  setCardCVV: (v: string) => void;
  cardExpiration: string;
  setCardExpiration: (v: string) => void;

  paymentMethod: 'PIX' | 'CARD' | 'BOLETO';
  setPaymentMethod: (v: 'PIX' | 'CARD' | 'BOLETO') => void;

  // payment state
  paymentLink: string | null;
  billingId: string | null;
  pixPayload: string | null;
  boletoBarcode: string | null;
  isLoading: boolean;
  error: string | null;

  resetPaymentState: () => void;
  handleCreatePayment: () => Promise<void>;
  billingIdParam: string | null;
}

export function useCheckout(certificate?: Certificate): UseCheckoutResult {
  const [searchParams] = useSearchParams();

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerCellphone, setCustomerCellphone] = useState('');
  const [customerTaxId, setCustomerTaxId] = useState('');

  const [customerAddressCep, setCustomerAddressCep] = useState('');
  const [customerAddressPlace, setCustomerAddressPlace] = useState('');
  const [customerAddressNumber, setCustomerAddressNumber] = useState('');
  const [customerAddressComplement, setCustomerAddressComplement] = useState('');
  const [customerAddressNeighborhood, setCustomerAddressNeighborhood] = useState('');
  const [customerAddressCity, setCustomerAddressCity] = useState('');
  const [customerAddressState, setCustomerAddressState] = useState('');

  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardCVV, setCardCVV] = useState('');
  const [cardExpiration, setCardExpiration] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<'PIX' | 'CARD' | 'BOLETO'>('PIX');
  const [paymentLink, setPaymentLink] = useState<string | null>(null);
  const [billingId, setBillingId] = useState<string | null>(null);
  const [pixPayload, setPixPayload] = useState<string | null>(null);
  const [boletoBarcode, setBoletoBarcode] = useState<string | null>(null);
  const [autoOpened, setAutoOpened] = useState(false);
  const [pollError, setPollError] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function resetPaymentState() {
    setPaymentLink(null);
    setBillingId(null);
    setPixPayload(null);
    setBoletoBarcode(null);
    setAutoOpened(false);
    setPollError(null);
    setError(null);
    setIsLoading(false);
    setCardNumber('');
    setCardName('');
    setCardCVV('');
    setCardExpiration('');
  }

  useEffect(() => {
    const fetchAddress = async () => {
      const cep = customerAddressCep.replace(/\D/g, '');
      if (cep.length === 8) {
        try {
          const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
          if (response.ok) {
            const data: ViaCepResponse = await response.json();
            if (!data.erro) {
              setCustomerAddressPlace(data.logradouro || '');
              setCustomerAddressNeighborhood(data.bairro || '');
              setCustomerAddressCity(data.localidade || '');
              setCustomerAddressState(data.uf || '');
            }
          }
        } catch (error) {
          // ignore
        }
      }
    };
    fetchAddress();
  }, [customerAddressCep]);

  useEffect(() => {
    const billingIdFromUrl = searchParams.get('billingId');
    if (billingIdFromUrl) setBillingId(billingIdFromUrl);
  }, [searchParams]);

  // Polling handled by the component; hook exposes billingId and helpers to check status externally

  const handleCreatePayment = async () => {
    if (!certificate) return;
    resetPaymentState();
    if (!customerName || !customerEmail || !customerTaxId) {
      setError('Preencha nome, email e CPF/CNPJ.');
      return;
    }

    if (paymentMethod === 'BOLETO' &&
        (!customerAddressCep || !customerAddressPlace || !customerAddressNumber ||
         !customerAddressNeighborhood || !customerAddressCity || !customerAddressState)) {
      setError('Preencha todos os campos do endereço de cobrança.');
      return;
    }

    if (paymentMethod === 'CARD' &&
        (!cardNumber || !cardName || !cardCVV || !cardExpiration)) {
      setError('Preencha todos os dados do cartão.');
      return;
    }

    setIsLoading(true);
    setError(null);

    const rawId = (typeof crypto !== 'undefined' && (crypto as any).randomUUID) ? (crypto as any).randomUUID() : `tx-${Date.now()}`;
    const externalId = sanitizeId(rawId);

    const amount = formatAmount(certificate.price);

    try {
      const payload: any = {
        id: externalId,
        totalAmount: amount,
        description: certificate.title,
        payerInfo: {
          name: customerName,
          taxid: customerTaxId.replace(/\D/g, ''),
          phonenumber: customerCellphone.replace(/\D/g, ''),
          email: customerEmail,
          address: paymentMethod === 'BOLETO' ? {
            zipcode: customerAddressCep.replace(/\D/g, ''),
            place: customerAddressPlace,
            number: customerAddressNumber,
            complement: customerAddressComplement,
            neighborhood: customerAddressNeighborhood,
            city: customerAddressCity,
            state: customerAddressState,
          } : undefined,
        },
        paymentMethod,
        cardInfo: paymentMethod === 'CARD' ? {
          number: cardNumber.replace(/\D/g, ''),
          name: cardName,
          cvv: cardCVV,
          expiration: cardExpiration.replace(/\D/g, ''),
        } : undefined,
        callbackAddress: `${getApiBaseUrl()}/api/webhook`,
      };

      const response = await fetch(`${getApiBaseUrl()}/api/create-payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json() as any;

        let hasPaymentInfo = false;

        if (paymentMethod === 'BOLETO') {
          const url = data.paymentUrl || data.raw?.data?.boleto?.url;
          if (url) {
            setPaymentLink(url);
            hasPaymentInfo = true;
          }
          if (data.raw?.data?.boleto?.barcode) setBoletoBarcode(data.raw.data.boleto.barcode);
        } else if (paymentMethod === 'PIX') {
          if (data.raw?.data?.pix?.textPayment) {
            const txt = data.raw.data.pix.textPayment;
            setPixPayload(txt);
            setPaymentLink(`https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(txt)}&size=300x300`);
            hasPaymentInfo = true;
          } else if (data.paymentUrl) {
            const match = String(data.paymentUrl).match(/[?&]data=([^&]+)/);
            if (match && match[1]) {
              try {
                const decoded = decodeURIComponent(match[1]);
                setPixPayload(decoded);
                setPaymentLink(data.paymentUrl);
                hasPaymentInfo = true;
              } catch (e) {}
            }
          }
        } else {
          if (data.paymentUrl) {
            setPaymentLink(data.paymentUrl);
            hasPaymentInfo = true;
          }
        }

        if (data.billingId) {
          setBillingId(data.billingId);
          try { if (typeof window !== 'undefined' && window.history && window.history.replaceState) window.history.replaceState(null, '', `?billingId=${encodeURIComponent(data.billingId)}`); } catch {}
        }

        if (!hasPaymentInfo) setError('Ocorreu um erro ao gerar os dados de pagamento.');
      } else {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json() as any;
          if (errorData.billingId && (paymentMethod === 'CARD' || paymentMethod === 'PIX')) {
            setBillingId(errorData.billingId);
            try { if (typeof window !== 'undefined' && window.history && window.history.replaceState) window.history.replaceState(null, '', `?billingId=${encodeURIComponent(errorData.billingId)}`); } catch {}
          }
          setError(errorData.errorMessage || errorData.error || 'Ocorreu um erro ao processar o pagamento.');
        } else {
          const errorText = await response.text().catch(() => '');
          setError(`Ocorreu um erro inesperado do servidor (${response.status}). ${errorText}`);
        }
      }
    } catch (err) {
      setError(`Ocorreu um erro ao processar o pagamento: ${err instanceof Error ? err.message : 'Erro desconhecido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    customerName, setCustomerName,
    customerEmail, setCustomerEmail,
    customerCellphone: maskPhone(customerCellphone), setCustomerCellphone,
    customerTaxId: maskCPF(customerTaxId), setCustomerTaxId,

    customerAddressCep, setCustomerAddressCep,
    customerAddressPlace, setCustomerAddressPlace,
    customerAddressNumber, setCustomerAddressNumber,
    customerAddressComplement, setCustomerAddressComplement,
    customerAddressNeighborhood, setCustomerAddressNeighborhood,
    customerAddressCity, setCustomerAddressCity,
    customerAddressState, setCustomerAddressState,

    cardNumber, setCardNumber,
    cardName, setCardName,
    cardCVV, setCardCVV,
    cardExpiration, setCardExpiration,

    paymentMethod, setPaymentMethod,
    paymentLink, billingId, pixPayload, boletoBarcode,
    isLoading, error,
    resetPaymentState, handleCreatePayment,
    billingIdParam: searchParams.get('billingId'),
  } as UseCheckoutResult;
}
