import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { getApiBaseUrl } from '../utils';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function PaymentSuccess() {
  const query = useQuery();
  const billingId = query.get('billingId');
  const sessionId = query.get('session');
  const navigate = useNavigate();
  console.log('PaymentSuccess mounted', { billingId, sessionId, search: window.location.search });
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPolling, setIsPolling] = useState(true);

  useEffect(() => {
    let interval: number | undefined;
    console.log('PaymentSuccess effect', { billingId, sessionId, isPolling });
    async function checkStatus() {
      if (!billingId && !sessionId) {
        console.log('checkStatus: no billingId or sessionId, skipping');
        return;
      }
      try {
        const q = sessionId ? `session=${encodeURIComponent(sessionId)}` : `billingId=${encodeURIComponent(billingId || '')}`;
        const res = await fetch(`${getApiBaseUrl()}/api/get-payment-status?${q}`, { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } });
        let data: any = null;
        try {
          data = await res.json();
        } catch (e) {
          console.log('checkStatus: invalid JSON response', { q, status: res.status });
          throw new Error('Invalid response from status endpoint');
        }
        console.log('get-payment-status response for', q, res.status, data);

        if (!res.ok) {
          console.log('checkStatus: non-ok response', { status: res.status, data });
          setError(data?.error || data?.message || 'Failed to get payment status');
          return;
        }

        setError(null);
        setPaymentStatus(data.status);
        console.log('set paymentStatus ->', data.status);
        if (data.status === 'PAID') {
          setIsPolling(false);
          if (interval) window.clearInterval(interval);
        }
      } catch (err: unknown) {
        console.log('checkStatus error', err);
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred.');
        }
      }
    }

    if ((billingId || sessionId) && isPolling) {
      checkStatus();
      interval = window.setInterval(checkStatus, 3000);
    }

    function handleFocus() {
      console.log('window focus - rechecking status', { billingId, sessionId });
      if (billingId || sessionId) checkStatus();
    }
    window.addEventListener('focus', handleFocus);

    return () => {
      if (interval) window.clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [billingId, sessionId, isPolling]);

  return (
    <div className="max-w-3xl mx-auto px-6 py-24 text-gray-900">
      <div style={{ position: 'fixed', right: 8, top: 8, background: '#111', color: '#fff', padding: 8, borderRadius: 6, zIndex: 9999 }}>
        <div style={{ fontSize: 12 }}>debug: <span style={{ fontFamily: 'monospace' }}>{window.location.search}</span></div>
      </div>
      <h1 className="text-3xl font-bold mb-2">Payment Successful!</h1>
      <p className="text-gray-600 mb-4">Thank you for your purchase.</p>
      <h1 className="text-xl font-semibold mb-6">teste teste</h1>
      {(billingId || sessionId) && (
        <div>
          <h2 className="text-2xl font-semibold mb-2">Payment Status</h2>
          <p>
            {billingId ? (
              <>Billing ID: <strong className="text-gray-900">{billingId}</strong></>
            ) : (
              <>Session: <strong className="text-gray-900">{sessionId}</strong></>
            )}
          </p>
          {error && <p className="text-red-400">Error: {error}</p>}
          {paymentStatus ? <p>Status: {paymentStatus}</p> : <p>Loading status...</p>}
          {paymentStatus === 'PAID' && (
            <div style={{ marginTop: 12 }}>
              <h3>Enviar arquivos</h3>
              <UploadForm billingId={billingId || ''} />
            </div>
          )}
          <div style={{ marginTop: 8 }}>
            <button onClick={() => setIsPolling(true)} className="px-3 py-2 bg-orange-600 text-white rounded-md mr-2">Continuar polling</button>
            <button onClick={() => {
              if (!billingId && !sessionId) return;
              const q = sessionId ? `session=${encodeURIComponent(sessionId)}` : `billingId=${encodeURIComponent(billingId || '')}`;
              fetch(`${getApiBaseUrl()}/api/get-payment-status?${q}`, { cache: 'no-store', headers: { 'Cache-Control': 'no-cache' } }).then(r => r.json()).then(d => setPaymentStatus((d as any).status)).catch(() => setError('Erro ao verificar status'));
            }} className="px-3 py-2 bg-gray-300 text-gray-900 rounded-md">Verificar agora</button>
            <button onClick={() => navigate('/')} className="px-3 py-2 ml-2 bg-gray-200 text-gray-900 rounded-md">Ir para a loja</button>
          </div>
        </div>
      )}
    </div>
  );
}

function UploadForm({ billingId }: { billingId: string }) {
  const [files, setFiles] = useState<FileList | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!files || files.length === 0) return setStatus('Selecione arquivos');
    console.log('UploadForm submit', { billingId, filesLength: files.length });
    setStatus('Enviando...');
    try {
      const form = new FormData();
      for (let i = 0; i < files.length; i++) form.append('file' + i, files[i]);
      const res = await fetch(`${getApiBaseUrl()}/api/upload-files?billingId=${encodeURIComponent(billingId)}`, {
        method: 'POST',
        body: form,
      });
      const data = await res.json();
      console.log('upload response', { status: res.status, data });
      if (!res.ok) {
        setStatus((typeof data === 'object' && data !== null && 'error' in data ? (data as any).error : null) || 'Falha no upload');
      } else {
        setStatus('Upload realizado com sucesso');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setStatus(`Erro ao enviar arquivos: ${err.message}`);
      } else {
        setStatus('Erro ao enviar arquivos');
      }
    }
  }

  return (
    <form onSubmit={submit}>
      <input type="file" multiple onChange={(e) => setFiles(e.target.files)} />
      <div style={{ marginTop: 8 }}>
        <button type="submit" className="px-3 py-2 bg-orange-600 text-white rounded-md">Enviar arquivos</button>
      </div>
      {status && <p style={{ marginTop: 8 }}>{status}</p>}
    </form>
  );
}
