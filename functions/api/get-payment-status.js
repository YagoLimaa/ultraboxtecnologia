export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  });
}

const inMemoryStore = new Map();

async function getStatus(env, billingId) {
  if (!billingId) return null;
  const kv = (env && (env.PAYMENTS_KV || env.PAYMENTS));
  if (kv && typeof kv.get === 'function') {
    try {
      const v = await kv.get(`payment:${billingId}`);
      return v;
    } catch (e) {
      console.warn('Failed to read from KV, falling back to memory', e);
    }
  }
  return inMemoryStore.get(billingId) || null;
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const billingId = url.searchParams.get('billingId') || url.searchParams.get('id') || url.searchParams.get('session') || null;

  if (!billingId) {
    return new Response(JSON.stringify({ error: 'Missing billingId or session parameter' }), { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
  }

  let rawValue = null;
  let source = 'memory';
  try {
    const kv = (env && (env.PAYMENTS_KV || env.PAYMENTS));
    if (kv && typeof kv.get === 'function') {
      try {
        rawValue = await kv.get(`payment:${billingId}`);
        source = 'kv';
      } catch (e) {
        console.warn('get-payment-status: KV read failed, falling back to memory', e);
        rawValue = null;
      }
    }
  } catch (e) {
    console.warn('get-payment-status: error checking KV', e);
  }

  if (rawValue == null) {
    rawValue = inMemoryStore.get(billingId) || null;
    source = rawValue ? 'memory' : source;
  }

  const status = rawValue || 'PENDING';

  console.log('get-payment-status', { billingId, status, source });

  return new Response(JSON.stringify({ billingId, status }), { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
}
