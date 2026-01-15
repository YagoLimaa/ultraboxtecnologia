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
const generateMockPixResponse = (body) => {
  console.warn("Generating a mock PIX response due to an upstream API failure.");

  const mockBillingId = `mock_${body.id || Date.now()}`;
  
  // trocar playload pix dps
  const merchantName = 'NOME DA LOJA';
  const merchantCity = 'CIDADE';
  const pixKey = '12345678900';
  const txid = (body.id || 'mocktx').substring(0, 25);
  const amount = (body.totalAmount || 0).toFixed(2);

  const payloadItems = [
    formatTLV('00', '01'),
    formatTLV('26', [
      formatTLV('00', 'br.gov.bcb.pix'), 
      formatTLV('01', pixKey)
    ].join('')),
    formatTLV('52', '0000'), 
    formatTLV('53', '986'), 
    formatTLV('54', amount), 
    formatTLV('58', 'BR'),   
    formatTLV('59', merchantName),
    formatTLV('60', merchantCity),
    formatTLV('62', formatTLV('05', txid)),
  ];
  
  const payloadString = payloadItems.join('');
  const payloadWithCrc = `${payloadString}6304${crc16(payloadString + '6304')}`;

  const mockResponseData = {
    success: true,
    data: {
      pix: {
        textPayment: payloadWithCrc
      }
    }
  };
  
  const frontendResponse = {
    billingId: mockBillingId,
    paymentUrl: null,
    raw: mockResponseData
  };

  return new Response(JSON.stringify(frontendResponse), {
    status: 200, 
    headers: { 'Content-Type': 'application/json' },
  });
};


export async function onRequestPost(context) {
  console.log('create-payment function called');
  const { request, env } = context;

  if (request.method !== 'POST') {
    return new Response(`Method ${request.method} not allowed.`, {
      status: 405,
      headers: { 'Allow': 'POST' },
    });
  }

  const body = await request.json();

  try {
    const clientId = env.CLIENT_ID;
    const clientSecret = env.CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error('API credentials (CLIENT_ID or CLIENT_SECRET) are not configured. Falling back to mock response.');
      return generateMockPixResponse(body);
    }

    const authToken = `Basic ${btoa(`${clientId}:${clientSecret}`)}`;
    const click2payApiUrl = 'https://apisandbox.click2pay.com.br/v1/transactions/pix';

    const options = {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'authorization': authToken
      },
      body: JSON.stringify({
        payerInfo: body.payerInfo,
        expiration: body.expiration || '86400',
        returnQRCode: true, 
        id: body.id,
        totalAmount: body.totalAmount
      })
    };

    const apiResponse = await fetch(click2payApiUrl, options);

    if (apiResponse.status >= 500) {
      const errorText = await apiResponse.text();
      console.error(`Upstream API failed with status ${apiResponse.status}: ${errorText}`);
      return generateMockPixResponse(body);
    }

    if (!apiResponse.ok) {
      const errorBody = await apiResponse.text();
      console.error(`Error from Click2Pay API (Status: ${apiResponse.status}):`, errorBody);

      return new Response(errorBody, {
        status: apiResponse.status,
        headers: apiResponse.headers,
      });
    }

    const responseData = await apiResponse.json();
    
    const frontendResponse = {
      billingId: responseData?.data?.billing_id || responseData?.billing_id,
      paymentUrl: responseData?.data?.payment_url || responseData?.payment_url,
      raw: responseData
    };

    return new Response(JSON.stringify(frontendResponse), {
      status: apiResponse.status,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in create-payment function:', error);

    return generateMockPixResponse(body);
  }
}
