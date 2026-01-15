export async function onRequest(context) {
  const { request } = context;

  // Ensure this is a WebSocket upgrade request
  const upgradeHeader = request.headers.get('Upgrade');
  if (!upgradeHeader || upgradeHeader.toLowerCase() !== 'websocket') {
    return new Response('Expected a WebSocket upgrade request', { status: 426 });
  }

  // Create a new WebSocket pair
  const { 0: client, 1: server } = new WebSocketPair();

  // Accept the server-side of the WebSocket
  server.accept();

  // Handle messages, closing, and errors
  server.addEventListener('message', event => {
    console.log('Message from client:', event.data);
    // Echo the message back to the client
    server.send(`Echo: ${event.data}`);
  });

  server.addEventListener('close', () => {
    console.log('WebSocket connection closed');
  });

  server.addEventListener('error', error => {
    console.error('WebSocket error:', error);
  });

  // Return the client-side of the WebSocket to the client
  return new Response(null, {
    status: 101,
    webSocket: client,
  });
}
