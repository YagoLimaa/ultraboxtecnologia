import { processPixPayment } from './payment-methods/pix.js';
import { processBoletoPayment } from './payment-methods/boleto.js';
import { processCardPayment } from './payment-methods/card.js';
import { createErrorResponse, createSuccessResponse, getCorsHeaders } from './payment-methods/utils.js';

export async function onRequestPost(context) {
  const { request, env } = context;

  if (request.method !== 'POST') {
    return new Response(`Method ${request.method} not allowed.`, {
      status: 405,
      headers: { 'Allow': 'POST' },
    });
  }

  const body = await request.json();
  const paymentMethod = (body.paymentMethod || 'PIX').toString().toUpperCase();

  try {
    const clientId = env.CLIENT_ID;
    const clientSecret = env.CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      console.error('API credentials (CLIENT_ID or CLIENT_SECRET) are not configured.');
      return createErrorResponse({ error: 'API credentials not configured' }, 500);
    }

    const authToken = `Basic ${btoa(`${clientId}:${clientSecret}`)}`;

    // Rotear para o método de pagamento apropriado
    let response;

    if (paymentMethod === 'BOLETO' || paymentMethod === 'BOLETO_BANCARIO') {
      response = await processBoletoPayment(body, authToken);
    } else if (paymentMethod === 'CARD' || paymentMethod === 'CREDIT_CARD' || paymentMethod === 'CARTAO') {
      response = await processCardPayment(body, authToken);
    } else {
      // PIX é o padrão
      response = await processPixPayment(body, authToken);
    }

    return response;

  } catch (error) {
    console.error('Error in create-payment function:', error);
    return createErrorResponse({ error: 'Internal server error' }, 500);
  }
}

export function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders()
  });
}
