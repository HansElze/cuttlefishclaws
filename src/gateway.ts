type Listener = (msg: { type: string; [k: string]: unknown }) => void;

let ws: WebSocket | null = null;
let reqId = 0;
const pending = new Map<string, { resolve: (v: unknown) => void; reject: (e: Error) => void }>();
const listeners = new Set<Listener>();
let authenticated = false;
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;

function getWsUrl(): string {
  return localStorage.getItem('oc_ws_url') || 'ws://127.0.0.1:18789';
}

function getToken(): string {
  return localStorage.getItem('oc_token') || '';
}

export function isConnected(): boolean {
  return ws !== null && ws.readyState === WebSocket.OPEN && authenticated;
}

export function subscribe(fn: Listener): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function emit(msg: { type: string; [k: string]: unknown }) {
  listeners.forEach(fn => fn(msg));
}

export function connect() {
  if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) return;
  authenticated = false;
  emit({ type: 'event', event: 'connection.status', payload: { status: 'connecting' } } as never);

  const url = getWsUrl();
  ws = new WebSocket(url);

  ws.onopen = () => {
    emit({ type: 'event', event: 'connection.status', payload: { status: 'waiting-challenge' } } as never);
  };

  ws.onmessage = (ev) => {
    let msg: { type: string; [k: string]: unknown };
    try { msg = JSON.parse(ev.data as string); } catch { return; }

    // Handle connect challenge from gateway
    if (msg.type === 'event' && (msg as { event?: string }).event === 'connect.challenge') {
      const token = getToken();
      const authReq = {
        type: 'req',
        id: `auth-${Date.now()}`,
        method: 'connect',
        params: {
          minProtocol: 3,
          maxProtocol: 3,
          client: {
            id: 'webchat-ui',
            version: '0.1.0',
            platform: 'web',
            mode: 'webchat'
          },
          auth: {
            token
          },
          scopes: ['operator.write']
        }
      };
      ws!.send(JSON.stringify(authReq));
      return;
    }

    // Handle auth response
    if (msg.type === 'res' && (msg as { id?: string }).id?.startsWith('auth-')) {
      const res = msg as { ok?: boolean; error?: unknown };
      if (res.ok) {
        authenticated = true;
        emit({ type: 'event', event: 'connection.status', payload: { status: 'connected' } } as never);
      } else {
        console.error('[gateway] Auth failed:', res.error);
        emit({ type: 'event', event: 'connection.status', payload: { status: 'auth-failed' } } as never);
      }
      return;
    }

    // Handle request responses
    if (msg.type === 'res') {
      const id = (msg as unknown as { id: string }).id;
      const p = pending.get(id);
      if (p) {
        pending.delete(id);
        const res = msg as unknown as { ok: boolean; payload?: unknown };
        if (res.ok) p.resolve(res.payload);
        else p.reject(new Error(JSON.stringify(res.payload)));
      }
    }

    // Emit all messages to listeners
    emit(msg);
  };

  ws.onclose = () => {
    authenticated = false;
    emit({ type: 'event', event: 'connection.status', payload: { status: 'disconnected' } } as never);
    pending.forEach(p => p.reject(new Error('Connection closed')));
    pending.clear();
    ws = null;
    if (!reconnectTimer) {
      reconnectTimer = setTimeout(() => { reconnectTimer = null; connect(); }, 3000);
    }
  };

  ws.onerror = () => {
    ws?.close();
  };
}

export function disconnect() {
  if (reconnectTimer) { clearTimeout(reconnectTimer); reconnectTimer = null; }
  ws?.close();
  ws = null;
  authenticated = false;
}

export function request(method: string, params: Record<string, unknown> = {}): Promise<unknown> {
  return new Promise((resolve, reject) => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      return reject(new Error('Not connected'));
    }
    const id = `r-${++reqId}-${Date.now()}`;
    pending.set(id, { resolve, reject });
    ws.send(JSON.stringify({ type: 'req', id, method, params }));
    setTimeout(() => {
      if (pending.has(id)) {
        pending.delete(id);
        reject(new Error('Request timeout'));
      }
    }, 30000);
  });
}
