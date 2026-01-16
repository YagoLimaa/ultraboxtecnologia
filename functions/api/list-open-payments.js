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

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const dateInit = url.searchParams.get('dateInit');
  const dateEnd = url.searchParams.get('dateEnd');
  const type = url.searchParams.get('type');
  const index = url.searchParams.get('index') || '1';

  if (!dateInit || !dateEnd) {
    return new Response(JSON.stringify({ error: 'Missing dateInit or dateEnd (format: YYYY-MM-DD HH:II)' }), { status: 400, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
  }

  const clientId = env.CLIENT_ID;
  const clientSecret = env.CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return new Response(JSON.stringify({ error: 'API credentials not configured' }), { status: 500, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
  }

  const authToken = `Basic ${btoa(`${clientId}:${clientSecret}`)}`;
  const qp = new URLSearchParams();
  qp.set('dateInit', dateInit);
  qp.set('dateEnd', dateEnd);
  qp.set('index', index);
  if (type) qp.set('type', type);

  const apiUrl = `https://apisandbox.click2pay.com.br/v1/transactions?${qp.toString()}`;

  try {
    const res = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        authorization: authToken
      }
    });

    const text = await res.text();
    let data = null;
    try { data = JSON.parse(text); } catch (e) { data = null; }

    if (!res.ok) {
      console.error('list-open-payments upstream error', res.status, text);
      const headers = { 'Content-Type': res.headers.get('content-type') || 'text/plain', 'Access-Control-Allow-Origin': '*' };
      return new Response(text, { status: res.status, headers });
    }

    const txs = data?.data || data?.transactions || data || [];

    const kv = (env && (env.PAYMENTS_KV || env.PAYMENTS));
    const open = [];
    for (const tx of txs) {
      const tid = tx?.tid || tx?.id || tx?.billing_id || tx?.transaction_id || tx?.externalIdentifier || null;
      const providerStatus = (tx?.status || tx?.state || tx?.payment_status || tx?.data?.status || null);

      let isPaid = false;
      try {
        if (typeof providerStatus === 'string') {
          const s = providerStatus.toUpperCase();
          if (s.includes('PAID') || s.includes('SETTLED') || s.includes('COMPLETED') || s.includes('SUCCESS')) isPaid = true;
        }

        if (!isPaid && kv && typeof kv.get === 'function' && tid) {
          const v = await kv.get(`payment:${tid}`);
          if (v && String(v).toUpperCase() === 'PAID') isPaid = true;
        }
      } catch (e) {
        console.warn('list-open-payments: check paid failed for', tid, e);
      }

      if (!isPaid) open.push(tx);
    }

    console.log('list-open-payments', { dateInit, dateEnd, type, index, total: txs.length, open: open.length });

    return new Response(JSON.stringify({ total: txs.length, open: open.length, openTransactions: open }), { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
  } catch (err) {
    console.error('list-open-payments error', err);
    return new Response(JSON.stringify({ error: 'Failed to contact upstream API' }), { status: 502, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } });
  }
}
