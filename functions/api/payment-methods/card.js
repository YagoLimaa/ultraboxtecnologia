import { validateLuhn, createErrorResponse, createSuccessResponse } from './utils.js';

export const validateCardData = (cardInfo) => {
  if (!cardInfo) {
    return 'Dados do cartão são obrigatórios para pagamento com cartão de crédito';
  }

  const cardNumber = (cardInfo.number || '').replace(/\D/g, '');
  const cardName = (cardInfo.name || '').trim();
  const cardCVV = (cardInfo.cvv || '').replace(/\D/g, '');
  const cardExpiration = (cardInfo.expiration || '').replace(/\D/g, '');

  // Validação do número do cartão (13-19 dígitos)
  if (!cardNumber || cardNumber.length < 13 || cardNumber.length > 19) {
    return 'Número do cartão inválido. Deve conter entre 13 e 19 dígitos';
  }

  // Validação do algoritmo de Luhn
  if (!validateLuhn(cardNumber)) {
    return 'Número do cartão inválido. Verifique os dígitos informados';
  }

  // Validação do nome no cartão
  if (!cardName || cardName.length < 3) {
    return 'Nome no cartão é obrigatório e deve ter pelo menos 3 caracteres';
  }

  // Validação do CVV (3-4 dígitos)
  if (!cardCVV || cardCVV.length < 3 || cardCVV.length > 4) {
    return 'CVV inválido. Deve conter 3 ou 4 dígitos';
  }

  // Validação da validade (MMAA - 4 dígitos)
  if (!cardExpiration || cardExpiration.length !== 4) {
    return 'Validade do cartão inválida. Use o formato MM/AA';
  }

  // Extrair mês e ano da validade
  const month = cardExpiration.slice(0, 2);
  const year = cardExpiration.slice(2, 4);
  const monthNum = parseInt(month, 10);

  // Validação do mês (01-12)
  if (monthNum < 1 || monthNum > 12) {
    return 'Mês de validade inválido. Deve ser entre 01 e 12';
  }

  // Validação se a validade não está no passado
  const currentYear = new Date().getFullYear() % 100;
  const currentMonth = new Date().getMonth() + 1;
  const yearNum = parseInt(year, 10);
  
  if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
    return 'Cartão expirado. Verifique a validade';
  }

  return null; // Tudo válido
};

export const processCardPayment = async (body, authToken) => {
  // Validar dados do cartão
  const validationError = validateCardData(body.cardInfo);
  if (validationError) {
    return createErrorResponse({ error: validationError }, 400);
  }

  const cardInfo = body.cardInfo;
  const cardNumber = cardInfo.number.replace(/\D/g, '');
  const cardName = cardInfo.name.trim();
  const cardCVV = cardInfo.cvv.replace(/\D/g, '');
  const cardExpiration = cardInfo.expiration.replace(/\D/g, '');

  const month = cardExpiration.slice(0, 2);
  const year = cardExpiration.slice(2, 4);

  const click2payApiUrl = 'https://apisandbox.click2pay.com.br/v1/transactions/creditcard';
  
  const options = {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'authorization': authToken
    },
    body: JSON.stringify({
      payerInfo: body.payerInfo,
      id: body.id,
      totalAmount: body.totalAmount,
      card: {
        number: cardNumber,
        name: cardName,
        cvv: cardCVV,
        expirationMonth: month,
        expirationYear: `20${year}`
      },
      installments: body.installments || 1,
      description: body.description
    })
  };

  const apiResponse = await fetch(click2payApiUrl, options);

  if (apiResponse.status >= 500) {
    const errorText = await apiResponse.text();
    console.error(`Upstream API failed with status ${apiResponse.status}: ${errorText}`);
    const headers = { 
      'Content-Type': apiResponse.headers.get('content-type') || 'text/plain',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    };
    return new Response(errorText, { status: apiResponse.status, headers });
  }

  if (!apiResponse.ok) {
    const errorBody = await apiResponse.text();
    console.error(`Error from Click2Pay API (Status: ${apiResponse.status}):`, errorBody);

    let errorJson = {};
    try {
      errorJson = JSON.parse(errorBody);
    } catch (e) {
      // Se não for JSON, usar o body como está
    }

    const fallbackBillingId = body.id;
    
    const errorResponse = {
      error: true,
      errorCode: errorJson.errorCode || `HTTP_${apiResponse.status}`,
      errorMessage: errorJson.errorMessage || errorJson.error || 'Erro ao processar pagamento com cartão',
      errorDescription: errorJson.errorDescription || errorJson.error || errorBody,
      billingId: fallbackBillingId,
      raw: errorJson
    };

    return createErrorResponse(errorResponse, apiResponse.status);
  }

  const responseData = await apiResponse.json();
  
  const frontendResponse = {
    billingId: responseData?.data?.tid || responseData?.tid || responseData?.data?.billing_id || responseData?.billing_id || responseData?.data?.id || responseData?.id,
    paymentUrl: responseData?.data?.creditcard?.payment_url || null,
    raw: responseData
  };

  return createSuccessResponse(frontendResponse, apiResponse.status);
};
