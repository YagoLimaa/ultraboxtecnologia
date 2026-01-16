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

const inMemoryStore = new Map();
async function setStatus(env, billingId, status) {
  if (!billingId) return;
  const kv = (env && (env.PAYMENTS_KV || env.PAYMENTS));
  if (kv && typeof kv.put === 'function') {
    try {
      await kv.put(`payment:${billingId}`, status);
      return;
    } catch (e) {
      console.warn('Failed to write to KV, falling back to memory', e);
    }
  }
  inMemoryStore.set(billingId, status);
}

export async function onRequestPost(context) {
  const { request, env } = context;

  if (request.method !== 'POST') {
    return new Response(`Method ${request.method} not allowed.`, { status: 405, headers: { Allow: 'POST' } });
  }

  let body = null;
  const ct = request.headers.get('content-type') || '';
  try {
    if (ct.includes('application/json')) body = await request.json();
    else if (ct.includes('application/x-www-form-urlencoded')) {
      const text = await request.text();
      body = Object.fromEntries(new URLSearchParams(text));
    } else {
      // try json parse anyway
      const text = await request.text();
      try { body = JSON.parse(text); } catch { body = { raw: text }; }
    }
  } catch (err) {
    console.error('Failed to parse webhook body', err);
    return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const providerPayload = body?.raw?.data || body?.data || body;

  const ids = new Set();
  const pushIf = (v) => { if (v) ids.add(String(v)); };

  pushIf(body?.billing_id);
  pushIf(body?.id);
  pushIf(body?.transaction_id);
  pushIf(body?.tid);
  pushIf(providerPayload?.tid);
  pushIf(providerPayload?.billing_id);
  pushIf(providerPayload?.id);
  pushIf(providerPayload?.externalIdentifier);
  pushIf(new URL(request.url).searchParams.get('billingId'));

  const rawStatus = body?.status || body?.event || body?.state || body?.payment_status || providerPayload?.status || null;
  let status = 'PENDING';
  try {
    if (body?.raw?.success === true) {
      status = 'PAID';
    } else if (rawStatus) {
      const s = String(rawStatus).toUpperCase();
      if (s.includes('PAID') || s.includes('SETTLED') || s.includes('COMPLETED') || s.includes('SUCCESS')) status = 'PAID';
      else if (s.includes('EXPIRED') || s.includes('CANCELLED') || s.includes('CANCELED') || s.includes('FAILED')) status = 'EXPIRED';
    } else if (providerPayload && providerPayload.payment_type && String(providerPayload.payment_type).toUpperCase().includes('INSTANT')) {
    }
  } catch (e) {
    console.warn('Error normalizing status', e);
  }

  console.log('webhook received', { ids: Array.from(ids), status, raw: body });

  const stored = [];
  for (const id of ids) {
    try {
      await setStatus(env, id, status);
      stored.push(id);
    } catch (e) {
      console.warn('Failed to persist status for', id, e);
    }
  }

  return new Response(JSON.stringify({ ok: true, stored, status }), { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
}
