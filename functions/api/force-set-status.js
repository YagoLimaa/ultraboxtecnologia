export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  if (request.method !== 'POST') return new Response(null, { status: 405 });

  let body = {};
  try { body = await request.json(); } catch (e) { /* ignore */ }

  const billingId = body?.billingId || body?.id || new URL(request.url).searchParams.get('billingId');
  const status = (body?.status || 'PAID').toString().toUpperCase();

  if (!billingId) {
    return new Response(JSON.stringify({ error: 'Missing billingId' }), { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
  }

  const kv = (env && (env.PAYMENTS_KV || env.PAYMENTS));
  try {
    if (kv && typeof kv.put === 'function') {
      await kv.put(`payment:${billingId}`, status);
      console.log('force-set-status: wrote to KV', { billingId, status });
    } else {
      if (!globalThis.__TEST_PAYMENT_STORE) globalThis.__TEST_PAYMENT_STORE = new Map();
      globalThis.__TEST_PAYMENT_STORE.set(billingId, status);
      console.log('force-set-status: wrote to in-memory store', { billingId, status });
    }
    return new Response(JSON.stringify({ ok: true, billingId, status }), { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
  } catch (err) {
    console.error('force-set-status error', err);
    return new Response(JSON.stringify({ error: 'Failed to set status' }), { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
  }
}
