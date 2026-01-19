import { createErrorResponse, createSuccessResponse } from './utils.js';

export const validateBoletoData = (body) => {
  // validações específicas do boleto no futuro
  return null; 
};

export const processBoletoPayment = async (body, authToken) => {
  const click2payApiUrl = 'https://apisandbox.click2pay.com.br/v1/transactions/boleto';
  
  const options = {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'authorization': authToken
    },
    body: JSON.stringify({
      payerInfo: body.payerInfo,
      payment_limit_days: body.payment_limit_days || body.paymentLimitDays || 3,
      fine: body.fine || { mode: 'FIXED', start: 2 },
      interest: body.interest || { mode: 'DAILY_AMOUNT' },
      id: body.id,
      totalAmount: body.totalAmount,
      logo: body.logo
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
      errorMessage: errorJson.errorMessage || errorJson.error || 'Erro ao processar pagamento com boleto',
      errorDescription: errorJson.errorDescription || errorJson.error || errorBody,
      billingId: fallbackBillingId,
      raw: errorJson
    };

    return createErrorResponse(errorResponse, apiResponse.status);
  }

  const responseData = await apiResponse.json();
  
  const frontendResponse = {
    billingId: responseData?.data?.tid || responseData?.tid || responseData?.data?.billing_id || responseData?.billing_id || responseData?.data?.id || responseData?.id,
    paymentUrl: responseData?.data?.boleto?.url || responseData?.data?.boleto?.pdf || null,
    raw: responseData
  };

  return createSuccessResponse(frontendResponse, apiResponse.status);
};
