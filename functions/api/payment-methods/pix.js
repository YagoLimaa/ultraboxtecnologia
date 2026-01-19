import { createErrorResponse, createSuccessResponse } from './utils.js';

export const processPixPayment = async (body, authToken) => {
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
    return createErrorResponse(
      { error: 'Erro no provedor de pagamento' },
      502
    );
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
      errorMessage: errorJson.errorMessage || errorJson.error || 'Erro ao processar pagamento PIX',
      errorDescription: errorJson.errorDescription || errorJson.error || errorBody,
      billingId: fallbackBillingId,
      raw: errorJson
    };

    return createErrorResponse(errorResponse, apiResponse.status);
  }

  const responseData = await apiResponse.json();
  
  const frontendResponse = {
    billingId: responseData?.data?.tid || responseData?.tid || responseData?.data?.billing_id || responseData?.billing_id || responseData?.data?.id || responseData?.id,
    paymentUrl: responseData?.data?.payment_url || responseData?.payment_url || null,
    raw: responseData
  };

  return createSuccessResponse(frontendResponse, apiResponse.status);
};
