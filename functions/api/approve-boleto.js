
// nao ta implemtando ainda
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

  if (request.method !== 'POST') {
    return new Response(`Method ${request.method} not allowed.`, { status: 405, headers: { Allow: 'POST' } });
  }

  let body = {};
  try {
    body = await request.json();
  } catch (e) {
    // ignore JSON parse errors
  }

  const tid = body.tid || new URL(request.url).searchParams.get('tid');
  if (!tid) {
    return new Response(JSON.stringify({ error: 'Missing tid in request body or query' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
  }

  const clientId = env.CLIENT_ID;
  const clientSecret = env.CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return new Response(JSON.stringify({ error: 'API credentials not configured' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }

  const authToken = `Basic ${btoa(`${clientId}:${clientSecret}`)}`;
  const approveUrl = `https://apisandbox.click2pay.com.br/v1/transactions/boleto/${encodeURIComponent(tid)}/approve`;

  try {
    const res = await fetch(approveUrl, {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
        authorization: authToken
      }
    });

    const text = await res.text();
    const headers = { 'Content-Type': res.headers.get('content-type') || 'text/plain', 'Access-Control-Allow-Origin': '*' };
    return new Response(text, { status: res.status, headers });
  } catch (err) {
    console.error('Error approving boleto:', err);
    return new Response(JSON.stringify({ error: 'Failed to contact Click2Pay approve endpoint' }), { status: 502, headers: { 'Content-Type': 'application/json' } });
  }
}
