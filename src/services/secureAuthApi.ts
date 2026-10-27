import { UserApiService } from './userApiService';

type Envelope = { status_code?: number; s?: number; c?: any; o?: string; message?: string };

function apiUrl(endpoint: string): string {
  const config = UserApiService.getConfig();
  const base = config.endpointUrl.trim();
  if (!base) throw new Error('Configure the x.money API base URL first.');
  const url = new URL(base, window.location.origin);
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Only HTTP/HTTPS API URLs are supported.');
  const local = ['localhost', '127.0.0.1', '::1'].includes(url.hostname.toLowerCase());
  const pageLocal = ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname.toLowerCase());
  if (url.protocol === 'http:' && !local) throw new Error('Remote APIs must use HTTPS.');
  if (local && !pageLocal) throw new Error('A deployed frontend cannot access your computer localhost. Configure a public HTTPS backend URL.');
  url.search = '';
  url.hash = '';
  url.searchParams.set('api', endpoint);
  return url.toString();
}

async function post(endpoint: string, fields: Record<string, string>): Promise<Envelope> {
  const response = await fetch(apiUrl(endpoint), {
    method: 'POST',
    mode: 'cors',
    credentials: 'include',
    cache: 'no-store',
    redirect: 'error',
    headers: { Accept: 'application/json', 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
    body: new URLSearchParams(fields).toString(),
  });
  const text = await response.text();
  let body: Envelope;
  try { body = JSON.parse(text) as Envelope; }
  catch { throw new Error('The authentication API did not return valid JSON.'); }
  if (!response.ok || (typeof body.status_code === 'number' && body.status_code >= 400) || body.s === 0) {
    throw new Error(body.message || body.o || `Authentication API ${endpoint} failed (HTTP ${response.status}).`);
  }
  return body;
}

export const SecureAuthApi = {
  async getNonce(walletAddress: string): Promise<string> {
    const response = await post('Nonce', { wallet_address: walletAddress });
    const message = response.c?.message;
    if (typeof message !== 'string' || !message) throw new Error('Backend did not return a wallet challenge.');
    return message;
  },
  async verifySignature(walletAddress: string, signature: string): Promise<{ registered: boolean; userId?: string }> {
    const response = await post('VerifySignature', { wallet_address: walletAddress, signature });
    return { registered: response.c?.registered === true, userId: response.c?.user_id ? String(response.c.user_id) : undefined };
  },
  async setupPasscode(passcode: string): Promise<void> {
    await post('PasscodeSetup', { passcode });
  },
  async verifyPasscode(passcode: string): Promise<boolean> {
    const response = await post('PasscodeVerify', { passcode });
    return response.c?.verified === true;
  },
};
