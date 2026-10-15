/*
 FILE: src/services/userApiService.ts

 PURPOSE:
 Dedicated service to connect to external User APIs (specifically the ?Api=User endpoint
 such as http://localhost/x.money/?Api=User), parse user ledger data, handle CORS / mixed-content
 situations gracefully, and provide a full live data sync bridge.

 RESPONSIBILITIES:
 - Store and manage the target API URL (e.g. http://localhost/x.money/?Api=User)
 - Fetch user data via HTTP GET / POST
 - Intelligently parse arbitrary user JSON schemas (nested data, flat fields, underscore or camelCase)
 - Allow direct pasting / importing of API JSON response payloads
 - Cache raw API responses for inspection in the User Data Viewer
 - Synchronize parsed user data into localStorage and AuthContext
*/

import { UserProfile, UserWallets } from '../types';
import { BRAND } from '../config/brand';

export interface ApiConnectionConfig {
  endpointUrl: string;
  autoSyncOnLoad: boolean;
  status: 'IDLE' | 'CONNECTING' | 'CONNECTED' | 'ERROR' | 'IMPORTED';
  lastSyncTime: string | null;
  lastError: string | null;
  rawResponse: any | null;
}

const STORAGE_KEY_API_CONFIG = 'moneyx_api_config_v1';
const STORAGE_KEY_USER_DATA = 'aura_auth_user_v1';
const STORAGE_KEY_WALLETS_DATA = 'aura_wallets_v1';
const STORAGE_KEY_RAW_JSON = 'moneyx_last_api_raw_json_v1';

export const DEFAULT_API_ENDPOINT = 'http://localhost/x.money/?Api=User';

// Sample JSON matching authentic PHP/REST ?Api=User endpoints
export const SAMPLE_API_USER_JSON = {
  status: 'success',
  message: 'User details fetched successfully',
  data: {
    id: 'MNX7729104',
    user_id: 'MNX7729104',
    username: 'sandeep_crypto',
    name: 'Sandeep Kumar',
    first_name: 'Sandeep',
    last_name: 'Kumar',
    email: 'sandeepaliens01@gmail.com',
    mobile: '9876543210',
    country: 'India (+91)',
    wallet_address: '0x7acc4892c9b4e1837015e5ae4f4d3c5237f2b90',
    refer_id: 'MNX992',
    refer_by: 'SPONSOR_MNX01',
    kyc_status: 'VERIFIED',
    account_status: 'ACTIVE',
    created_at: '2026-03-15T10:30:00Z',
    balances: {
      total_balance_usdt: 12500.0,
      main_balance_usdt: 7500.0,
      main_balance_native: 2.85,
      spot_balance_usdt: 3200.0,
      spot_balance_native: 1.25,
      funding_balance_usdt: 1800.0,
      funding_balance_native: 0.65,
      jackpot_balance_usdt: 0.0,
      extra_balance_hxc: 450.0,
      total_deposit_usdt: 15000.0,
      total_withdraw_usdt: 2500.0,
    },
  },
};

export class UserApiService {
  /**
   * Retrieves current API configuration from localStorage
   */
  public static getConfig(): ApiConnectionConfig {
    if (typeof localStorage === 'undefined') {
      return {
        endpointUrl: DEFAULT_API_ENDPOINT,
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
        const rawJsonStored = localStorage.getItem(STORAGE_KEY_RAW_JSON);
        if (rawJsonStored) {
          parsed.rawResponse = JSON.parse(rawJsonStored);
        }
        return parsed;
      }
    } catch (err) {
      console.warn('Failed to parse stored API config', err);
    }

    return {
      endpointUrl: DEFAULT_API_ENDPOINT,
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
            autoSyncOnLoad: updated.autoSyncOnLoad,
            status: updated.status,
            lastSyncTime: updated.lastSyncTime,
            lastError: updated.lastError,
          })
        );
        if (updated.rawResponse) {
          localStorage.setItem(STORAGE_KEY_RAW_JSON, JSON.stringify(updated.rawResponse));
        }
      } catch (err) {
        console.warn('Failed to save API config to localStorage', err);
      }
    }

    return updated;
  }

  /**
   * Intelligently parses whatever JSON payload is returned by ?Api=User
   */
  public static parseUserData(payload: any): { user: UserProfile; wallets?: UserWallets } {
    if (!payload || typeof payload !== 'object') {
      throw new Error('API response is not a valid JSON object');
    }

    // Determine the root data container
    // Common conventions: payload.data, payload.user, payload.userData, or root payload itself
    let root = payload.data || payload.user || payload.userData || payload.result || payload;

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
      root.user_id ||
      root.userId ||
      root.uid ||
      root.username ||
      payload.id ||
      BRAND.defaultUserId;

    const name =
      root.name ||
      root.fullName ||
      root.fullname ||
      (root.first_name ? `${root.first_name} ${root.last_name || ''}`.trim() : '') ||
      root.username ||
      'User';

    const firstName =
      root.first_name ||
      root.firstName ||
      name.split(' ')[0] ||
      'User';

    const lastName =
      root.last_name ||
      root.lastName ||
      name.split(' ').slice(1).join(' ') ||
      '';

    const email =
      root.email ||
      root.user_email ||
      root.mail ||
      `user@${BRAND.domain}`;

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
      'India (+91)';

    const walletAddress =
      root.wallet_address ||
      root.walletAddress ||
      root.wallet ||
      root.address ||
      root.eth_address ||
      root.bsc_address ||
      '';

    const referId =
      root.refer_id ||
      root.referId ||
      root.referral_code ||
      root.referCode ||
      root.my_referral ||
      root.ref_id ||
      BRAND.defaultReferId;

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
      new Date().toISOString();

    const kycRaw = (root.kyc_status || root.kycStatus || root.status || '').toString().toUpperCase();
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
      passcodeConfigured: true,
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
      const main = Number(b.main_balance_usdt ?? b.mainBalanceUSDT ?? b.main_balance ?? total * 0.6);
      const spot = Number(b.spot_balance_usdt ?? b.spotBalanceUSDT ?? b.spot_balance ?? total * 0.4);
      const funding = Number(b.funding_balance_usdt ?? b.fundingBalanceUSDT ?? b.funding_balance ?? 0);
      const jackpot = Number(b.jackpot_balance_usdt ?? b.jackpotBalanceUSDT ?? 0);
      const extra = Number(b.extra_balance_hxc ?? b.extraBalanceHXC ?? 0);
      const totalDeposit = Number(b.total_deposit_usdt ?? b.totalDepositUSDT ?? total);
      const totalWithdraw = Number(b.total_withdraw_usdt ?? b.totalWithdrawUSDT ?? 0);

      wallets = {
        totalBalanceUSDT: isNaN(total) ? 0 : total,
        mainBalanceUSDT: isNaN(main) ? 0 : main,
        mainBalanceNative: Number(b.main_balance_native ?? b.mainBalanceNative ?? (main / 2800).toFixed(4)),
        spotBalanceUSDT: isNaN(spot) ? 0 : spot,
        spotBalanceNative: Number(b.spot_balance_native ?? b.spotBalanceNative ?? (spot / 2800).toFixed(4)),
        fundingBalanceUSDT: isNaN(funding) ? 0 : funding,
        fundingBalanceNative: Number(b.funding_balance_native ?? b.fundingBalanceNative ?? (funding / 2800).toFixed(4)),
        jackpotBalanceUSDT: isNaN(jackpot) ? 0 : jackpot,
        extraBalanceHXC: isNaN(extra) ? 0 : extra,
        totalDepositUSDT: isNaN(totalDeposit) ? 0 : totalDeposit,
        totalWithdrawUSDT: isNaN(totalWithdraw) ? 0 : totalWithdraw,
      };
    }

    return { user: userProfile, wallets };
  }

  /**
   * Fetches user data from the configured ?Api=User endpoint
   */
  public static async fetchUserData(endpointUrl?: string): Promise<{
    success: boolean;
    user?: UserProfile;
    wallets?: UserWallets;
    raw?: any;
    error?: string;
    isCorsOrMixedContent?: boolean;
  }> {
    const targetUrl = endpointUrl || this.getConfig().endpointUrl;

    this.saveConfig({
      endpointUrl: targetUrl,
      status: 'CONNECTING',
      lastError: null,
    });

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

      const response = await fetch(targetUrl, {
        method: 'GET',
        headers: {
          Accept: 'application/json, text/plain, */*',
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
      }

      const text = await response.text();
      let json: any;
      try {
        json = JSON.parse(text);
      } catch {
        throw new Error(`Response from ${targetUrl} is not valid JSON. Received: ${text.slice(0, 120)}...`);
      }

      const { user, wallets } = this.parseUserData(json);

      // Persist to localStorage
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_USER_DATA, JSON.stringify(user));
        if (wallets) {
          localStorage.setItem(STORAGE_KEY_WALLETS_DATA, JSON.stringify(wallets));
        }
      }

      this.saveConfig({
        endpointUrl: targetUrl,
        status: 'CONNECTED',
        lastSyncTime: new Date().toISOString(),
        lastError: null,
        rawResponse: json,
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
        ? `Browser Security Block: HTTPS pages cannot directly call insecure ${targetUrl} (Mixed Content). Use an HTTPS URL/tunnel, or paste the JSON response directly below!`
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
    }
  }

  /**
   * Direct JSON importer: Allows the user to paste their API response directly
   * (Solves mixed-content / local XAMPP / localhost CORS restrictions during cloud preview)
   */
  public static importRawJson(jsonInput: string | object): {
    success: boolean;
    user?: UserProfile;
    wallets?: UserWallets;
    error?: string;
  } {
    try {
      let parsedObj = typeof jsonInput === 'string' ? JSON.parse(jsonInput.trim()) : jsonInput;
      const { user, wallets } = this.parseUserData(parsedObj);

      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_USER_DATA, JSON.stringify(user));
        if (wallets) {
          localStorage.setItem(STORAGE_KEY_WALLETS_DATA, JSON.stringify(wallets));
        }
      }

      this.saveConfig({
        status: 'IMPORTED',
        lastSyncTime: new Date().toISOString(),
        lastError: null,
        rawResponse: parsedObj,
      });

      return {
        success: true,
        user,
        wallets,
      };
    } catch (err: any) {
      return {
        success: false,
        error: `JSON parsing error: ${err.message}`,
      };
    }
  }

  /**
   * Loads sample API user data for testing and instant preview
   */
  public static loadSampleData(): { user: UserProfile; wallets?: UserWallets } {
    return this.importRawJson(SAMPLE_API_USER_JSON) as any;
  }
}
