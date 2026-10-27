import assert from 'node:assert/strict';
import { afterEach, beforeEach, test } from 'node:test';
import { DEFAULT_API_ENDPOINT, UserApiService } from '../src/services/userApiService';
import { ApiService } from '../src/services/api';
import { XMoneyApiService, X_MONEY_READ_ENDPOINTS } from '../src/services/xMoneyApi';

const originalFetch = globalThis.fetch;
const originalLocalStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');
const originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window');
let persisted = new Map<string, string>();
let requests: Array<{ url: string; init?: RequestInit }> = [];

const testStorage = (): Storage => ({
  get length() { return persisted.size; },
  clear: () => persisted.clear(),
  getItem: (key: string) => persisted.get(key) ?? null,
  key: (index: number) => [...persisted.keys()][index] ?? null,
  removeItem: (key: string) => { persisted.delete(key); },
  setItem: (key: string, value: string) => { persisted.set(key, value); },
});

const jsonResponse = (payload: unknown, status = 200): Response => ({
  ok: status >= 200 && status < 300,
  status,
  statusText: status === 200 ? 'OK' : 'Error',
  text: async () => JSON.stringify(payload),
} as Response);

const installFetch = (handler: (url: string, init?: RequestInit) => Promise<Response>) => {
  globalThis.fetch = (async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input);
    requests.push({ url, init });
    return handler(url, init);
  }) as typeof fetch;
};

beforeEach(() => {
  persisted = new Map<string, string>();
  requests = [];
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: testStorage() });
  Object.defineProperty(globalThis, 'window', {
    configurable: true,
    value: {
      location: { hostname: 'localhost', protocol: 'http:', origin: 'http://localhost:3000' },
      setTimeout: globalThis.setTimeout.bind(globalThis),
      clearTimeout: globalThis.clearTimeout.bind(globalThis),
    } as unknown as Window & typeof globalThis,
  });
  UserApiService.saveConfig({
    endpointUrl: 'http://localhost/x.money/',
    userId: 'test-uid-73',
    status: 'IDLE',
    lastError: null,
    rawResponse: null,
  });
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalLocalStorage) Object.defineProperty(globalThis, 'localStorage', originalLocalStorage);
  else Reflect.deleteProperty(globalThis, 'localStorage');
  if (originalWindow) Object.defineProperty(globalThis, 'window', originalWindow);
  else Reflect.deleteProperty(globalThis, 'window');
});

test('parses a nested PHP user record and ignores a numeric wallet foreign key', () => {
  const parsed = UserApiService.parseUserData({
    status_code: 200,
    s: 1,
    data: {
      ID: 73,
      user_login: 'sample-account',
      user_email: 'sample@example.test',
      wallet_address: '987654321098765432109876',
      balances: {
        total_balance_usdt: '12.50',
        spot_balance: '3',
      },
    },
  });

  assert.equal(parsed.user.id, '73');
  assert.equal(parsed.user.name, 'sample-account');
  assert.equal(parsed.user.email, 'sample@example.test');
  assert.equal(parsed.user.walletAddress, '');
  assert.equal(parsed.wallets?.totalBalanceUSDT, 12.5);
  assert.equal(parsed.wallets?.spotBalanceUSDT, 3);
});

test('does not persist raw API payloads in localStorage', () => {
  UserApiService.saveConfig({ rawResponse: { private_email: 'do-not-persist@example.test' } });
  const stored = [...persisted.values()].join('\n');

  assert.equal(stored.includes('do-not-persist@example.test'), false);
  assert.equal(stored.includes('rawResponse'), false);
  assert.equal(UserApiService.getConfig().rawResponse, null);
});

test('requests the PHP api parameter using expected casing and omits browser credentials', async () => {
  installFetch(async () => jsonResponse({
    status_code: 200,
    s: 1,
    data: { ID: 73, display_name: 'Local Test User', user_email: 'sample@example.test' },
  }));

  const result = await UserApiService.fetchUserData();

  assert.equal(result.success, true);
  assert.equal(requests.length, 1);
  const url = new URL(requests[0].url);
  assert.equal(url.searchParams.get('api'), 'User');
  assert.equal(url.searchParams.get('uid'), 'test-uid-73');
  assert.equal(url.searchParams.has('user'), false);
  assert.equal(requests[0].init?.credentials, 'omit');
  assert.equal(requests[0].init?.redirect, 'error');
  assert.equal(requests[0].init?.cache, 'no-store');
  assert.equal(persisted.get('moneyx_api_config_v1')?.includes('sample@example.test'), false);
});

test('parses stringified nested record collections and maps transactions', async () => {
  installFetch(async () => jsonResponse({
    status_code: 200,
    s: 1,
    data: JSON.stringify({
      transactions: [{
        id: 991,
        ttype: 'Deposit',
        amount: '25.75',
        ccc: 'USDT',
        status: 'SUCCESS',
        orderid: 'deposit-ref-991',
        created_at: '2026-10-01 12:00:00',
      }],
    }),
  }));

  const rows = await XMoneyApiService.getTransactions(500);

  assert.equal(rows.length, 1);
  assert.equal(rows[0].id, '991');
  assert.equal(rows[0].type, 'DEPOSIT');
  assert.equal(rows[0].amount, 25.75);
  assert.equal(rows[0].amountUSD, 25.75);
  assert.equal(rows[0].status, 'COMPLETED');
  assert.equal(rows[0].referenceId, 'deposit-ref-991');
  const url = new URL(requests[0].url);
  assert.equal(url.searchParams.get('api'), 'Transactions');
  assert.equal(url.searchParams.get('uid'), 'test-uid-73');
  assert.equal(url.searchParams.get('limit'), '100');
});

test('blocks insecure remote API hosts before making a network request', async () => {
  UserApiService.saveConfig({ endpointUrl: 'http://api.example.test/' });
  let fetchCalled = false;
  installFetch(async () => {
    fetchCalled = true;
    return jsonResponse({});
  });

  await assert.rejects(() => XMoneyApiService.request('User'), /Remote x.money APIs must use HTTPS/);
  assert.equal(fetchCalled, false);
});


test('diagnoses every mapped read endpoint one by one and reports schema metadata', async () => {
  let activeRequests = 0;
  let maxConcurrentRequests = 0;
  installFetch(async (url) => {
    activeRequests += 1;
    maxConcurrentRequests = Math.max(maxConcurrentRequests, activeRequests);
    await new Promise((resolve) => setTimeout(resolve, 2));
    const endpoint = new URL(url).searchParams.get('api');
    activeRequests -= 1;

    if (endpoint === 'User') {
      return jsonResponse({ status_code: 200, s: 1, data: { ID: 73, display_name: 'Local Test User' } });
    }
    if (endpoint === 'Staking_Plans') {
      return jsonResponse({ status_code: 200, s: 0, o: 'Data empty' });
    }
    return jsonResponse({ status_code: 200, s: 1, data: [{ id: 1, name: 'field-only sample' }] });
  });

  const results = await XMoneyApiService.diagnoseReadEndpoints();

  assert.deepEqual(results.map((row) => row.endpoint), [...X_MONEY_READ_ENDPOINTS]);
  assert.deepEqual(requests.map(({ url }) => new URL(url).searchParams.get('api')), [...X_MONEY_READ_ENDPOINTS]);
  assert.equal(results.length, 11);
  assert.equal(maxConcurrentRequests, 1, 'endpoint checks must be sequential');
  assert.equal(results[0].status, 'OK');
  assert.equal(results[0].fields.includes('ID'), true);
  assert.equal(results.find((row) => row.endpoint === 'Staking_Plans')?.status, 'EMPTY');
  assert.equal(results.every((row) => !JSON.stringify(row).includes('Local Test User')), true);
});


test('uses a same-origin Vite proxy by default and migrates the previous Apache URL', () => {
  assert.equal(DEFAULT_API_ENDPOINT, '/x.moneyy/');

  persisted.set('moneyx_api_config_v1', JSON.stringify({
    endpointUrl: 'http://localhost/x.money/',
    userId: 'test-uid-73',
    autoSyncOnLoad: true,
    status: 'CONNECTED',
    lastSyncTime: null,
    lastError: null,
  }));

  assert.equal(UserApiService.getConfig().endpointUrl, DEFAULT_API_ENDPOINT);
});


test('blocks unsigned registration before making a database write request', async () => {
  UserApiService.saveConfig({ userId: '' });
  await assert.rejects(
    () => XMoneyApiService.registerUser({
      walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
      referId: '',
      country: 'India',
      mobile: '9876543210',
      name: 'Local New User',
    }),
    /Unsigned registration is disabled/,
  );
  assert.equal(requests.length, 0, 'signup must not write an account before backend signature verification exists');
});

test('fails closed for passcode setup and unlock without a server-issued session', async () => {
  const setup = await ApiService.setupPasscode('1234');
  const verify = await ApiService.verifyPasscode('1234');

  assert.equal(setup.success, false);
  assert.match(setup.error?.message ?? '', /not bound to a verified wallet session/);
  assert.equal(verify.success, false);
  assert.match(verify.error?.message ?? '', /does not establish an authenticated server session/);
});
