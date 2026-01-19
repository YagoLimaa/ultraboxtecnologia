const formatTLV = (id, value) => {
  const len = String(value.length).padStart(2, '0');
  return `${id}${len}${value}`;
};

// CRC16-CCITT calculation used in PIX QR codes 
const crc16 = (data) => {
  let crc = 0xFFFF;
  for (let i = 0; i < data.length; i++) {
    crc ^= data.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 0x8000) ? (crc << 1) ^ 0x1021 : crc << 1;
    }
  }
  return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4, '0');
};

// Validação do algoritmo de Luhn para número de cartão
const validateLuhn = (cardNumber) => {
  let sum = 0;
  let isEven = false;
  
  // Percorrer do final para o início
  for (let i = cardNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cardNumber[i], 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

export async function onRequestPost(context) {
  const { request, env } = context;

  if (request.method !== 'POST') {
    return new Response(`Method ${request.method} not allowed.`, {
      status: 405,
      headers: { 'Allow': 'POST' },
    });
  }

  const body = await request.json();
  const requestedMethod = (body.paymentMethod || 'PIX').toString().toUpperCase();

  try {
    const clientId = env.CLIENT_ID;
    const clientSecret = env.CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error('API credentials (CLIENT_ID or CLIENT_SECRET) are not configured.');
      return new Response(JSON.stringify({ error: 'API credentials not configured' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const authToken = `Basic ${btoa(`${clientId}:${clientSecret}`)}`;

    // vendo qual tipo de pagamento para escolher a url correta
    const method = (body.paymentMethod || 'PIX').toString().toUpperCase();

    let click2payApiUrl = '';
    const options = {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'authorization': authToken
      },
      body: null
    };

    if (method === 'BOLETO' || method === 'BOLETO_BANCARIO') {
      click2payApiUrl = 'https://apisandbox.click2pay.com.br/v1/transactions/boleto';
      options.body = JSON.stringify({
        payerInfo: body.payerInfo,
        payment_limit_days: body.payment_limit_days || body.paymentLimitDays || 3,
        fine: body.fine || { mode: 'FIXED', start: 2 },
        interest: body.interest || { mode: 'DAILY_AMOUNT' },
        id: body.id,
        totalAmount: body.totalAmount,
        logo: body.logo
      });
    } else if (method === 'CARD' || method === 'CREDIT_CARD' || method === 'CARTAO') {
      // Validações para cartão de crédito
      if (!body.cardInfo) {
        return new Response(JSON.stringify({ error: 'Dados do cartão são obrigatórios para pagamento com cartão de crédito' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' }
        });
      }

      const cardInfo = body.cardInfo;
      const cardNumber = (cardInfo.number || '').replace(/\D/g, '');
      const cardName = (cardInfo.name || '').trim();
      const cardCVV = (cardInfo.cvv || '').replace(/\D/g, '');
      const cardExpiration = (cardInfo.expiration || '').replace(/\D/g, '');

      // Validação do número do cartão (13-19 dígitos)
      if (!cardNumber || cardNumber.length < 13 || cardNumber.length > 19) {
        return new Response(JSON.stringify({ error: 'Número do cartão inválido. Deve conter entre 13 e 19 dígitos' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' }
        });
      }

      // Validação do algoritmo de Luhn
      if (!validateLuhn(cardNumber)) {
        return new Response(JSON.stringify({ error: 'Número do cartão inválido. Verifique os dígitos informados' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' }
        });
      }

      // Validação do nome no cartão
      if (!cardName || cardName.length < 3) {
        return new Response(JSON.stringify({ error: 'Nome no cartão é obrigatório e deve ter pelo menos 3 caracteres' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' }
        });
      }

      // Validação do CVV (3-4 dígitos)
      if (!cardCVV || cardCVV.length < 3 || cardCVV.length > 4) {
        return new Response(JSON.stringify({ error: 'CVV inválido. Deve conter 3 ou 4 dígitos' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' }
        });
      }

      // Validação da validade (MMAA - 4 dígitos)
      if (!cardExpiration || cardExpiration.length !== 4) {
        return new Response(JSON.stringify({ error: 'Validade do cartão inválida. Use o formato MM/AA' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' }
        });
      }

      // Extrair mês e ano da validade
      const month = cardExpiration.slice(0, 2);
      const year = cardExpiration.slice(2, 4);
      const monthNum = parseInt(month, 10);

      // Validação do mês (01-12)
      if (monthNum < 1 || monthNum > 12) {
        return new Response(JSON.stringify({ error: 'Mês de validade inválido. Deve ser entre 01 e 12' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' }
        });
      }

      // Validação se a validade não está no passado
      const currentYear = new Date().getFullYear() % 100; // últimos 2 dígitos do ano
      const currentMonth = new Date().getMonth() + 1;
      const yearNum = parseInt(year, 10);
      
      if (yearNum < currentYear || (yearNum === currentYear && monthNum < currentMonth)) {
        return new Response(JSON.stringify({ error: 'Cartão expirado. Verifique a validade' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' }
        });
      }

      click2payApiUrl = 'https://apisandbox.click2pay.com.br/v1/transactions/creditcard';
      options.body = JSON.stringify({
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
      });
    } else {
      // pix padrão
      click2payApiUrl = 'https://apisandbox.click2pay.com.br/v1/transactions/pix';
      options.body = JSON.stringify({
        payerInfo: body.payerInfo,
        expiration: body.expiration || '86400',
        returnQRCode: true,
        id: body.id,
        totalAmount: body.totalAmount
      });
    }

    const apiResponse = await fetch(click2payApiUrl, options);

    if (apiResponse.status >= 500) {
      const errorText = await apiResponse.text();
      console.error(`Upstream API failed with status ${apiResponse.status}: ${errorText}`);
      if (requestedMethod === 'BOLETO' || requestedMethod === 'CARD' || requestedMethod === 'CREDIT_CARD' || requestedMethod === 'CARTAO') {
        const headers = { 
          'Content-Type': apiResponse.headers.get('content-type') || 'text/plain',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        };
        return new Response(errorText, { status: apiResponse.status, headers });
      }
      return new Response(JSON.stringify({ error: 'Upstream payment provider error' }), { 
        status: 502, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        } 
      });
    }

    if (!apiResponse.ok) {
      const errorBody = await apiResponse.text();
      console.error(`Error from Click2Pay API (Status: ${apiResponse.status}):`, errorBody);

      // Para permitir testes com force-set-status mesmo quando a API retorna erro
      // (ex: 401 quando cartão/PIX não está habilitado), retornar billingId baseado no id enviado
      if (method === 'CARD' || method === 'CREDIT_CARD' || method === 'CARTAO' || method === 'PIX') {
        try {
          // Tentar parsear o erro para ver se tem algum billingId
          let errorJson = {};
          try {
            errorJson = JSON.parse(errorBody);
          } catch (e) {
            // Se não for JSON, usar o body como está
          }

          // Usar o id do payload como billingId para permitir force-set-status
          const fallbackBillingId = body.id;
          
          const errorResponse = {
            error: true,
            errorCode: errorJson.errorCode || `HTTP_${apiResponse.status}`,
            errorMessage: errorJson.errorMessage || errorJson.error || 'Erro ao processar pagamento',
            errorDescription: errorJson.errorDescription || errorJson.error || errorBody,
            billingId: fallbackBillingId, // Incluir billingId para permitir force-set-status
            raw: errorJson
          };

          const headers = { 
            'Content-Type': 'application/json', 
            'Access-Control-Allow-Origin': '*', 
            'Access-Control-Allow-Methods': 'POST, OPTIONS', 
            'Access-Control-Allow-Headers': 'Content-Type, Authorization' 
          };
          return new Response(JSON.stringify(errorResponse), { status: apiResponse.status, headers });
        } catch (e) {
          // Se falhar, retornar erro original
        }
      }

      const headers = { 'Content-Type': apiResponse.headers.get('content-type') || 'text/plain', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' };
      return new Response(errorBody, { status: apiResponse.status, headers });
    }

    const responseData = await apiResponse.json();
    
    const frontendResponse = {
      billingId: responseData?.data?.tid || responseData?.tid || responseData?.data?.billing_id || responseData?.billing_id || responseData?.data?.id || responseData?.id,
      paymentUrl: responseData?.data?.payment_url || responseData?.payment_url || responseData?.data?.boleto?.url || responseData?.data?.boleto?.pdf || responseData?.data?.creditcard?.payment_url || null,
      raw: responseData
    };

    return new Response(JSON.stringify(frontendResponse), {
      status: apiResponse.status,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type, Authorization' },
    });

  } catch (error) {
    console.error('Error in create-payment function:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}
