/*
 FILE: src/services/userApiService.ts

 PURPOSE:
 Dedicated service to connect to external User APIs (specifically the ?api=User endpoint
 such as http://localhost/x.money/?api=User), parse user ledger data, handle CORS / mixed-content
 situations gracefully, and provide a full live data sync bridge.

 RESPONSIBILITIES:
 - Store and manage the target API URL (e.g. http://localhost/x.money/?api=User)
 - Fetch user data via HTTP GET / POST
 - Intelligently parse arbitrary user JSON schemas (nested data, flat fields, underscore or camelCase)
 - Allow direct pasting / importing of API JSON response payloads
 - Cache raw API responses for inspection in the User Data Viewer
 - Synchronize parsed user data into localStorage and AuthContext
*/

import { UserProfile, UserWallets } from '../types';

export interface ApiConnectionConfig {
  endpointUrl: string;
  userId: string;
  autoSyncOnLoad: boolean;
  status: 'IDLE' | 'CONNECTING' | 'CONNECTED' | 'ERROR' | 'IMPORTED';
  lastSyncTime: string | null;
  lastError: string | null;
  rawResponse: any | null;
}

const STORAGE_KEY_API_CONFIG = 'moneyx_api_config_v1';

export const DEFAULT_API_ENDPOINT = import.meta.env?.VITE_XMONEY_API_BASE_URL?.trim() || '/x.money/';

export class UserApiService {
  private static emptyConfig(): ApiConnectionConfig {
    return {
      endpointUrl: DEFAULT_API_ENDPOINT,
      userId: '',
      autoSyncOnLoad: true,
      status: 'IDLE',
      lastSyncTime: null,
      lastError: null,
      rawResponse: null,
    };
  }

  /**
   * Retrieves current API configuration from localStorage
   */
  public static getConfig(): ApiConnectionConfig {
    if (typeof localStorage === 'undefined') {
      return {
        endpointUrl: DEFAULT_API_ENDPOINT,
        userId: '',
        autoSyncOnLoad: true,
        status: 'IDLE',
        lastSyncTime: null,
        lastError: null,
        rawResponse: null,
      };
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY_API_CONFIG);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Raw API payloads contain personal data; never persist them in browser storage.
        parsed.rawResponse = null;
        // Migrate the previous direct-to-Apache default to the same-origin Vite proxy.
        if (parsed.endpointUrl === 'http://localhost/x.money/' || parsed.endpointUrl === 'http://127.0.0.1/x.money/') {
          parsed.endpointUrl = DEFAULT_API_ENDPOINT;
        }
        return { ...this.emptyConfig(), ...parsed };
      }
    } catch (err) {
      console.warn('Failed to parse stored API config', err);
    }

    return {
      endpointUrl: DEFAULT_API_ENDPOINT,
      userId: '',
      autoSyncOnLoad: true,
      status: 'IDLE',
      lastSyncTime: null,
      lastError: null,
      rawResponse: null,
    };
  }

  /**
   * Saves API connection configuration
   */
  public static saveConfig(config: Partial<ApiConnectionConfig>): ApiConnectionConfig {
    const current = this.getConfig();
    const updated: ApiConnectionConfig = {
      ...current,
      ...config,
    };

    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem(
          STORAGE_KEY_API_CONFIG,
          JSON.stringify({
            endpointUrl: updated.endpointUrl,
            userId: updated.userId,
            autoSyncOnLoad: updated.autoSyncOnLoad,
            status: updated.status,
            lastSyncTime: updated.lastSyncTime,
            lastError: updated.lastError,
          })
        );
      } catch (err) {
        console.warn('Failed to save API config to localStorage', err);
      }
    }

    return updated;
  }

  /**
   * Intelligently parses whatever JSON payload is returned by ?api=User
   */
  public static parseUserData(payload: any): { user: UserProfile; wallets?: UserWallets } {
    if (!payload || typeof payload !== 'object') {
      throw new Error('API response is not a valid JSON object');
    }

    // PHP endpoints may wrap payloads in data/user/result or the compact c/o envelope.
    // Locate the actual profile record instead of mistaking a status wrapper for a user.
    const profileKeys = [
      'id', 'ID', 'user_id', 'userId', 'uid', 'userid', 'username',
      'name', 'fullName', 'fullname', 'display_name', 'user_nicename',
      'user_login', 'user_email', 'email',
    ];
    const findProfileRecord = (input: any, depth = 0): any => {
      let value = input;
      if (typeof value === 'string') {
        const trimmed = value.trim();
        if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
          try { value = JSON.parse(trimmed); } catch { return null; }
        } else {
          return null;
        }
      }
      if (!value || typeof value !== 'object' || depth > 5) return null;
      if (Array.isArray(value)) {
        for (const item of value) {
          const nested = findProfileRecord(item, depth + 1);
          if (nested) return nested;
        }
        return null;
      }
      if (profileKeys.some((key) => value[key] !== undefined && value[key] !== null && value[key] !== '')) return value;
      for (const key of ['data', 'user', 'userData', 'result', 'profile', 'record', 'o', 'c']) {
        const nested = findProfileRecord(value[key], depth + 1);
        if (nested) return nested;
      }
      return null;
    };
    let root = findProfileRecord(payload) || payload;

    // In case payload.data is a stringified JSON
    if (typeof root === 'string') {
      try {
        root = JSON.parse(root);
      } catch {
        // keep as is
      }
    }

    const id =
      root.id ||
      root.ID ||
      root.user_id ||
      root.userId ||
      root.uid ||
      root.userid ||
      payload.id ||
      '';

    const name =
      root.name ||
      root.fullName ||
      root.fullname ||
      root.display_name ||
      root.user_nicename ||
      root.user_login ||
      (root.fname ? `${root.fname} ${root.lname || ''}`.trim() : '') ||
      (root.first_name ? `${root.first_name} ${root.last_name || ''}`.trim() : '') ||
      root.username ||
      '';

    const firstName =
      root.first_name ||
      root.firstName ||
      root.fname ||
      name.split(' ')[0] ||
      '';

    const lastName =
      root.last_name ||
      root.lastName ||
      root.lname ||
      name.split(' ').slice(1).join(' ') ||
      '';

    const email =
      root.email ||
      root.user_email ||
      root.mail ||
      '';

    const mobile =
      root.mobile ||
      root.mobile_number ||
      root.phone ||
      root.contact ||
      root.contact_number ||
      '';

    const country =
      root.country ||
      root.country_name ||
      root.location ||
      '';

    const addressCandidate =
      root.wallet_address ||
      root.walletAddress ||
      root.address ||
      root.eth_address ||
      root.bsc_address ||
      root.TRX ||
      root.BTC ||
      '';
    const walletAddress =
      typeof addressCandidate === 'string' &&
      addressCandidate.trim().length >= 20 &&
      !/^\d+$/.test(addressCandidate.trim())
        ? addressCandidate.trim()
        : '';

    const referId =
      root.refer_id ||
      root.referId ||
      root.referral_code ||
      root.referCode ||
      root.my_referral ||
      root.ref_id ||
      '';

    const referBy =
      root.refer_by ||
      root.referBy ||
      root.sponsor ||
      root.sponsor_id ||
      root.referred_by ||
      '';

    const createdAt =
      root.created_at ||
      root.createdAt ||
      root.join_date ||
      root.registered_at ||
      root.user_registered ||
      root.created ||
      '';

    const kycRaw = (root.kyc_status || root.kycStatus || '').toString().toUpperCase();
    const kycStatus: 'UNVERIFIED' | 'PENDING' | 'VERIFIED' =
      kycRaw === 'VERIFIED' || kycRaw === 'APPROVED' || kycRaw === 'ACTIVE'
        ? 'VERIFIED'
        : kycRaw === 'PENDING'
        ? 'PENDING'
        : 'UNVERIFIED';

    const userProfile: UserProfile = {
      id: String(id),
      username: String(root.username || id),
      name: String(name),
      firstName: String(firstName),
      lastName: String(lastName),
      email: String(email),
      mobile: String(mobile),
      country: String(country),
      walletAddress: String(walletAddress),
      referId: String(referId),
      referBy: String(referBy),
      createdAt: String(createdAt),
      passcodeConfigured: false,
      kycStatus,
    };

    // Extract wallet balances if provided by API
    let wallets: UserWallets | undefined = undefined;
    const b = root.balances || root.wallet_balance || root.wallets || root;
    if (
      b.total_balance_usdt !== undefined ||
      b.totalBalanceUSDT !== undefined ||
      b.balance !== undefined ||
      b.usdt_balance !== undefined ||
      b.spot_balance !== undefined ||
      b.main_balance !== undefined
    ) {
      const total = Number(
        b.total_balance_usdt ??
        b.totalBalanceUSDT ??
        b.balance ??
        b.usdt_balance ??
        0
      );
      const main = Number(b.main_balance_usdt ?? b.mainBalanceUSDT ?? b.main_balance ?? 0);
      const spot = Number(b.spot_balance_usdt ?? b.spotBalanceUSDT ?? b.spot_balance ?? 0);
      const funding = Number(b.funding_balance_usdt ?? b.fundingBalanceUSDT ?? b.funding_balance ?? 0);
      const jackpot = Number(b.jackpot_balance_usdt ?? b.jackpotBalanceUSDT ?? 0);
      const extra = Number(b.extra_balance_hxc ?? b.extraBalanceHXC ?? 0);
      const totalDeposit = Number(b.total_deposit_usdt ?? b.totalDepositUSDT ?? 0);
      const totalWithdraw = Number(b.total_withdraw_usdt ?? b.totalWithdrawUSDT ?? 0);

      wallets = {
        totalBalanceUSDT: isNaN(total) ? 0 : total,
        mainBalanceUSDT: isNaN(main) ? 0 : main,
        mainBalanceNative: Number(b.main_balance_native ?? b.mainBalanceNative ?? 0),
        spotBalanceUSDT: isNaN(spot) ? 0 : spot,
        spotBalanceNative: Number(b.spot_balance_native ?? b.spotBalanceNative ?? 0),
        fundingBalanceUSDT: isNaN(funding) ? 0 : funding,
        fundingBalanceNative: Number(b.funding_balance_native ?? b.fundingBalanceNative ?? 0),
        jackpotBalanceUSDT: isNaN(jackpot) ? 0 : jackpot,
        extraBalanceHXC: isNaN(extra) ? 0 : extra,
        totalDepositUSDT: isNaN(totalDeposit) ? 0 : totalDeposit,
        totalWithdrawUSDT: isNaN(totalWithdraw) ? 0 : totalWithdraw,
      };
    }

    return { user: userProfile, wallets };
  }

  /**
   * Fetches user data from the configured ?api=User endpoint
   */
  public static async fetchUserData(endpointUrl?: string): Promise<{
    success: boolean;
    user?: UserProfile;
    wallets?: UserWallets;
    raw?: any;
    error?: string;
    isCorsOrMixedContent?: boolean;
  }> {
    const config = this.getConfig();
    const targetUrl = endpointUrl || config.endpointUrl;
    if (!config.userId?.trim()) {
      const error = 'Enter the x.money user UID in API Setup before loading account data.';
      this.saveConfig({ endpointUrl: targetUrl, status: 'ERROR', lastError: error });
      return { success: false, error };
    }

    this.saveConfig({
      endpointUrl: targetUrl,
      status: 'CONNECTING',
      lastError: null,
    });

    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    try {
      const controller = new AbortController();
      timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

      const requestUrl = new URL(targetUrl, window.location.origin);
      if (requestUrl.protocol !== 'http:' && requestUrl.protocol !== 'https:') throw new Error('Only HTTP/HTTPS API URLs are supported.');
      if (requestUrl.username || requestUrl.password) throw new Error('API URL must not contain embedded credentials.');
      const localHost = ['localhost', '127.0.0.1', '::1'].includes(requestUrl.hostname.toLowerCase());
      const localPage = typeof window !== 'undefined' && ['localhost', '127.0.0.1', '::1'].includes(window.location.hostname.toLowerCase());
      if (requestUrl.protocol === 'http:' && !localHost) throw new Error('Remote x.money APIs must use HTTPS.');
      if (localHost && !localPage) throw new Error('A deployed AURA site cannot call localhost. Configure VITE_XMONEY_API_BASE_URL with the public HTTPS PHP API URL.');
      requestUrl.search = '';
      requestUrl.hash = '';
      requestUrl.searchParams.set('api', 'User');
      requestUrl.searchParams.set('uid', config.userId.trim());
      const response = await fetch(requestUrl.toString(), {
        method: 'GET',
        mode: 'cors',
        credentials: 'omit',
        cache: 'no-store',
        redirect: 'error',
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
      }

      const text = await response.text();
      let json: any;
      try {
        json = JSON.parse(text);
      } catch {
        throw new Error('The x.money API did not return valid JSON.');
      }

      const envelope = json as Record<string, unknown>;
      if (typeof envelope.status_code === 'number' && envelope.status_code >= 400) throw new Error(`x.money API returned HTTP ${envelope.status_code}.`);
      if (envelope.s === 0 && typeof envelope.o === 'string' && !/not found|data not found/i.test(envelope.o)) throw new Error(`x.money API: ${envelope.o}`);
      const { user, wallets } = this.parseUserData(json);
      if (!user.id || user.name === 'User') throw new Error('The API response did not contain a usable user profile.');

      this.saveConfig({
        endpointUrl: targetUrl,
        status: 'CONNECTED',
        lastSyncTime: new Date().toISOString(),
        lastError: null,
        rawResponse: null,
      });

      return {
        success: true,
        user,
        wallets,
        raw: json,
      };
    } catch (err: any) {
      const isMixedContent =
        typeof window !== 'undefined' &&
        window.location.protocol === 'https:' &&
        targetUrl.startsWith('http://');

      const isCorsOrNetwork =
        err.name === 'AbortError' ||
        err.message?.includes('Failed to fetch') ||
        err.message?.includes('NetworkError') ||
        err.message?.includes('CORS');

      const errorMessage = isMixedContent
        ? `Browser Security Block: HTTPS pages cannot directly call insecure ${targetUrl} (Mixed Content). Open AURA from localhost and use the local XAMPP base URL.`
        : err.name === 'AbortError'
        ? `Request timed out connecting to ${targetUrl}. Ensure your local server is running.`
        : err.message || 'Failed to fetch user data from API';

      this.saveConfig({
        endpointUrl: targetUrl,
        status: 'ERROR',
        lastError: errorMessage,
      });

      return {
        success: false,
        error: errorMessage,
        isCorsOrMixedContent: isMixedContent || isCorsOrNetwork,
      };
    } finally {
      if (timeoutId !== undefined) clearTimeout(timeoutId);
    }
  }

}
