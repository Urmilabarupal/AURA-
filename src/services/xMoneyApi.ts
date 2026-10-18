import type { ApiConnectionConfig } from './userApiService';
import { UserApiService } from './userApiService';
import type { ApiResponse, Transaction, TransactionStatus, TransactionType, UserProfile, UserWallets } from '../types';

type XMoneyEnvelope = {
  status_code?: number;
  s?: number;
  c?: unknown;
  o?: unknown;
  data?: unknown;
  message?: string;
  [key: string]: unknown;
};

const zeroWallets = (): UserWallets => ({
  spotBalanceUSDT: 0,
  spotBalanceNative: 0,
  mainBalanceUSDT: 0,
  mainBalanceNative: 0,
  fundingBalanceUSDT: 0,
  fundingBalanceNative: 0,
  jackpotBalanceUSDT: 0,
  extraBalanceHXC: 0,
  totalBalanceUSDT: 0,
  totalDepositUSDT: 0,
  totalWithdrawUSDT: 0,
});

const numberFrom = (...values: unknown[]): number | undefined => {
  for (const value of values) {
    if (value === null || value === undefined || value === '') continue;
    const parsed = typeof value === 'number' ? value : Number(String(value).replace(/,/g, ''));
    if (Number.isFinite(parsed)) return parsed;
  }
  return undefined;
};

const textFrom = (...values: unknown[]): string => {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value.trim();
    if (typeof value === 'number') return String(value);
  }
  return '';
};

const envelopeRecords = (payload: unknown): Record<string, unknown>[] => {
  const decode = (value: unknown): unknown => {
    if (typeof value !== 'string') return value;
    const trimmed = value.trim();
    if (!trimmed || (trimmed[0] !== '[' && trimmed[0] !== '{')) return value;
    try {
      return JSON.parse(trimmed) as unknown;
    } catch {
      return value;
    }
  };

  const findRecords = (input: unknown, depth = 0): Record<string, unknown>[] | null => {
    const value = decode(input);
    if (!value || typeof value !== 'object' || depth > 6) return null;
    if (Array.isArray(value)) {
      const records = value.filter((item): item is Record<string, unknown> => !!item && typeof item === 'object' && !Array.isArray(item));
      if (records.length || value.length === 0) return records;
      for (const item of value) {
        const nested = findRecords(item, depth + 1);
        if (nested) return nested;
      }
      return null;
    }

    const record = value as Record<string, unknown>;
    // Prefer explicit list keys so arbitrary nested objects are never treated as rows.
    for (const key of ['o', 'c', 'data', 'result', 'records', 'rows', 'items', 'list', 'transactions', 'deposits', 'withdrawals', 'orders']) {
      if (record[key] === undefined || record[key] === value) continue;
      const nested = findRecords(record[key], depth + 1);
      if (nested) return nested;
    }
    return null;
  };

  return findRecords(payload) ?? [];
};

const mapStatus = (value: unknown): TransactionStatus => {
  const status = String(value ?? '').toUpperCase();
  if (status.includes('FAIL') || status.includes('REJECT')) return 'FAILED';
  if (status.includes('PROCESS')) return 'PROCESSING';
  if (status.includes('PEND') || status.includes('WAIT')) return 'PENDING';
  return status.includes('COMPLETE') || status.includes('SUCCESS') || status === '1' || status === 'APPROVED' ? 'COMPLETED' : 'PENDING';
};

const mapType = (row: Record<string, unknown>): TransactionType => {
  const raw = textFrom(row.ttype, row.type, row.transaction_type, row.app).toUpperCase();
  if (raw.includes('DEPOSIT')) return 'DEPOSIT';
  if (raw.includes('WITHDRAW')) return 'WITHDRAW';
  if (raw.includes('SELL')) return 'TRADE_SELL';
  if (raw.includes('BUY') || raw.includes('TRADE')) return 'TRADE_BUY';
  if (raw.includes('CONVERT')) return 'CONVERT_DIRECT';
  return 'APP_TRANSFER';
};

export type XMoneyEndpointStatus = 'OK' | 'EMPTY' | 'ERROR';

export interface XMoneyEndpointDiagnostic {
  endpoint: string;
  status: XMoneyEndpointStatus;
  rowCount: number | null;
  fields: string[];
  message: string;
  elapsedMs: number;
}

export const X_MONEY_READ_ENDPOINTS = [
  'User',
  'Transactions',
  'Deposits',
  'Withdraws',
  'Spot_Wallets',
  'Funding_Wallets',
  'Staking_Wallets',
  'Currencys',
  'Referes',
  'Trades',
  'Staking_Plans',
] as const;

const payloadFields = (input: unknown, depth = 0): string[] => {
  let value = input;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
      try { value = JSON.parse(trimmed) as unknown; } catch { return []; }
    } else {
      return [];
    }
  }
  if (!value || typeof value !== 'object' || depth > 6) return [];
  if (Array.isArray(value)) {
    const firstRecord = value.find((item) => !!item && typeof item === 'object' && !Array.isArray(item));
    return firstRecord ? Object.keys(firstRecord as Record<string, unknown>).sort() : [];
  }

  const record = value as Record<string, unknown>;
  const containerKeys = ['o', 'c', 'data', 'result', 'user', 'profile', 'records', 'rows', 'items', 'list', 'transactions', 'deposits', 'withdrawals', 'orders'];
  for (const key of containerKeys) {
    if (record[key] === undefined || record[key] === value) continue;
    const fields = payloadFields(record[key], depth + 1);
    if (fields.length) return fields;
  }

  return Object.keys(record)
    .filter((key) => !['status_code', 's', 'message', 'success', 'status', 'o', 'c', 'data', 'result'].includes(key))
    .sort();
};

const payloadMessage = (payload: unknown): string => {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return '';
  const record = payload as Record<string, unknown>;
  for (const key of ['message', 'error', 'o', 'c']) {
    if (typeof record[key] === 'string' && record[key].trim()) return (record[key] as string).trim();
  }
  return '';
};

export class XMoneyApiService {
  private static accountUserId = '';

  private static config(): ApiConnectionConfig {
    return UserApiService.getConfig();
  }

  private static buildUrl(endpoint: string, extra: Record<string, string | number | undefined> = {}): URL {
    const config = this.config();
    const rawBase = config.endpointUrl.trim();
    let url: URL;
    try {
      url = new URL(rawBase);
    } catch {
      throw new Error('API base URL is invalid. Example: http://localhost/x.money/');
    }
    if (url.protocol !== 'http:' && url.protocol !== 'https:') throw new Error('Only HTTP/HTTPS API URLs are supported.');
    if (url.username || url.password) throw new Error('API URL must not contain embedded credentials.');
    const isLocalHost = ['localhost', '127.0.0.1', '::1'].includes(url.hostname.toLowerCase());
    const isLocalPage = typeof window !== 'undefined' && ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname.toLowerCase());
    if (!isLocalHost || !isLocalPage) throw new Error('This connector is restricted to a local XAMPP test environment. Remote API hosts are not allowed.');
    if (url.protocol === 'http:' && !isLocalHost) throw new Error('For non-local APIs, HTTPS is required.');
    if (!config.userId?.trim()) throw new Error('Enter the x.money user UID in API Setup before loading account data.');
    url.search = '';
    url.hash = '';
    url.searchParams.set('Api', endpoint);
    const userScopedEndpoints = new Set([
      'User', 'Transactions', 'Deposits', 'Withdraws',
      'Spot_Wallets', 'Funding_Wallets', 'Staking_Wallets',
      'Referes', 'Trades',
    ]);
    // Only attach UID filters to account-owned records. Global catalogues such as
    // Currencys and Staking_Plans must not be filtered by a non-existent user column.
    if (userScopedEndpoints.has(endpoint)) {
      url.searchParams.set('uid', config.userId.trim());
      // The PHP API distinguishes external UID from the internal user record ID.
      // Only send the internal ID after the profile endpoint has returned it.
      if (this.accountUserId) url.searchParams.set('user', this.accountUserId);
    }
    for (const [key, value] of Object.entries(extra)) {
      if (value !== undefined && value !== '') url.searchParams.set(key, String(value));
    }
    return url;
  }

  static async request(endpoint: string, extra: Record<string, string | number | undefined> = {}): Promise<unknown> {
    const url = this.buildUrl(endpoint, extra);
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 8000);
    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        mode: 'cors',
        credentials: 'omit',
        cache: 'no-store',
        redirect: 'error',
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });
      const bodyText = await response.text();
      let payload: unknown;
      try {
        payload = JSON.parse(bodyText);
      } catch {
        throw new Error('The x.money API did not return valid JSON.');
      }
      const env = payload && typeof payload === 'object' ? payload as XMoneyEnvelope : {};
      if (!response.ok || (typeof env.status_code === 'number' && env.status_code >= 400)) {
        throw new Error(`x.money API ${endpoint} failed (HTTP ${response.status || env.status_code}).`);
      }
      if (typeof env.error === 'string' && env.error.trim()) {
        throw new Error(`x.money API ${endpoint}: ${env.error.trim()}`);
      }
      if (env.success === false) {
        throw new Error(`x.money API ${endpoint}: ${typeof env.message === 'string' ? env.message : 'the server reported failure'}`);
      }
      if (env.s === 0) {
        const detail = typeof env.o === 'string' ? env.o : typeof env.c === 'string' ? env.c : '';
        if (/not found|data empty|empty list|no data|^empty$/i.test(detail)) return payload;
        if (detail) throw new Error(`x.money API ${endpoint}: ${detail}`);
      }
      return payload;
    } finally {
      window.clearTimeout(timeout);
    }
  }

  static async getUser(): Promise<{ user: UserProfile; wallets?: UserWallets; raw: unknown }> {
    const raw = await this.request('User');
    const parsed = UserApiService.parseUserData(raw);
    this.accountUserId = parsed.user.id;
    // Only accept an ID that was actually returned by the API; no demo identity fallback.
    if (!parsed.user.id) throw new Error('The API response did not contain a usable user profile.');
    return { ...parsed, raw };
  }

  static async getTransactions(limit = 100): Promise<Transaction[]> {
    const payload = await this.request('Transactions', { limit: Math.min(Math.max(limit, 1), 100) });
    return envelopeRecords(payload).map((row, index) => {
      const amount = numberFrom(row.amount, row.fnamount, row.value) ?? 0;
      const rawDate = textFrom(row.created_at, row.createdAt, row.time, row.date, row.timestamp);
      const timestamp = rawDate ? (Number.isFinite(Date.parse(rawDate)) ? new Date(rawDate).toISOString() : rawDate) : '';
      const currency = textFrom(row.ccc, row.currency) || '—';
      const explicitUsd = numberFrom(row.amount_usd, row.amountUSD, row.usd_value);
      const amountUSD = explicitUsd ?? (['USDT', 'USDC'].includes(currency.toUpperCase()) ? amount : 0);
      return {
        id: textFrom(row.id, row.transaction_id, row.orderid) || `xmoney-tx-${index}`,
        userId: textFrom(row.uid, row.user),
        type: mapType(row),
        typeLabel: textFrom(row.ttype, row.type, row.app) || 'Transaction',
        amount,
        currency,
        amountUSD,
        status: mapStatus(row.status),
        timestamp,
        referenceId: textFrom(row.orderid, row.reference, row.id),
        description: textFrom(row.description, row.name, row.ttype, row.app) || 'x.money transaction',
        toAddress: textFrom(row.to, row.address) || undefined,
      };
    });
  }

  static async getCollection(endpoint: string, limit = 100): Promise<Record<string, unknown>[]> {
    const payload = await this.request(endpoint, { limit: Math.min(Math.max(limit, 1), 100) });
    return envelopeRecords(payload);
  }

  static async getWallets(): Promise<UserWallets> {
    const { wallets: fromProfile } = await this.getUser();
    const wallets = { ...zeroWallets(), ...(fromProfile ?? {}) };
    // Wallet APIs expose records separately; only use explicit numeric balance fields.
    const [spot, funding, staking] = await Promise.allSettled([
      this.getCollection('Spot_Wallets'),
      this.getCollection('Funding_Wallets'),
      this.getCollection('Staking_Wallets'),
    ]);
    const sumUsdBalance = (records: Record<string, unknown>[]): number | undefined => {
      const values = records.map((row) => {
        const explicitUsd = numberFrom(row.balance_usdt, row.amount_usdt, row.usd_value, row.usdValue, row.balanceUSDT);
        if (explicitUsd !== undefined) return explicitUsd;
        const currency = textFrom(row.ccc, row.currency, row.symbol).toUpperCase();
        if (currency === 'USDT' || currency === 'USDC') return numberFrom(row.balance, row.amount, row.available);
        return undefined;
      }).filter((value): value is number => value !== undefined);
      return values.length ? values.reduce((sum, value) => sum + value, 0) : undefined;
    };
    const spotRows = spot.status === 'fulfilled' ? spot.value : [];
    const fundingRows = funding.status === 'fulfilled' ? funding.value : [];
    const stakingRows = staking.status === 'fulfilled' ? staking.value : [];
    const spotUsd = sumUsdBalance(spotRows);
    const fundingUsd = sumUsdBalance(fundingRows);
    const stakingUsd = sumUsdBalance(stakingRows);
    if (spotUsd !== undefined) wallets.spotBalanceUSDT = spotUsd;
    if (fundingUsd !== undefined) wallets.fundingBalanceUSDT = fundingUsd;
    // Do not guess native-coin prices or split balances into synthetic wallets.
    if (wallets.totalBalanceUSDT === 0) {
      wallets.totalBalanceUSDT = wallets.mainBalanceUSDT + wallets.spotBalanceUSDT + wallets.fundingBalanceUSDT + wallets.jackpotBalanceUSDT + (stakingUsd ?? 0);
    }
    return wallets;
  }

  /**
   * Executes every currently mapped read-only endpoint sequentially and reports
   * schema metadata only. It deliberately never calls write endpoints.
   */
  static async diagnoseReadEndpoints(): Promise<XMoneyEndpointDiagnostic[]> {
    const results: XMoneyEndpointDiagnostic[] = [];
    for (const endpoint of X_MONEY_READ_ENDPOINTS) {
      const startedAt = Date.now();
      try {
        const payload = await this.request(endpoint);
        const detail = payloadMessage(payload);
        if (/unknown api|api\\s*(?:not found|invalid)|invalid endpoint|unsupported endpoint/i.test(detail)) {
          throw new Error(detail);
        }

        let profileFound = false;
        if (endpoint === 'User') {
          const parsed = UserApiService.parseUserData(payload);
          profileFound = Boolean(parsed.user.id);
          if (!profileFound) throw new Error('The User endpoint returned JSON but no usable profile ID was found.');
          this.accountUserId = parsed.user.id;
        }
        const records = envelopeRecords(payload);
        const fields = records.length ? Object.keys(records[0]).sort() : payloadFields(payload);
        const rowCount = records.length || (profileFound || fields.length > 0 ? 1 : 0);
        results.push({
          endpoint,
          status: rowCount > 0 ? 'OK' : 'EMPTY',
          rowCount,
          fields,
          message: rowCount > 0
            ? 'Endpoint returned valid JSON; field names only are shown.'
            : detail || 'Endpoint returned valid JSON but no records were detected.',
          elapsedMs: Date.now() - startedAt,
        });
      } catch (error) {
        results.push({
          endpoint,
          status: 'ERROR',
          rowCount: null,
          fields: [],
          message: error instanceof Error ? error.message : 'Endpoint request failed.',
          elapsedMs: Date.now() - startedAt,
        });
      }
    }
    return results;
  }

  static success<T>(data: T, message: string): ApiResponse<T> {
    return { success: true, data, message };
  }

  static failure<T>(error: unknown): ApiResponse<T> {
    return { success: false, error: { code: 'X_MONEY_API_ERROR', message: error instanceof Error ? error.message : 'x.money API request failed.' } };
  }
}
