/*
 FILE: src/services/api.ts

 PURPOSE:
 Authoritative frontend API service client.
 Implements Rule 6 (API-First Architecture).

 RESPONSIBILITIES:
 - Provide strongly typed API methods for Profile, Wallets, Trading, Staking,
   Farming, Community, Jackpot, Conversions, and Transactions
 - Handle network and server error normalization
 - Maintain session token management and Bearer authorization headers
 - Support testing toggles for data states (populated vs empty states)

 API:
 Encapsulates all /api/* routes requested in Master Prompt:
 - /api/profile
 - /api/wallets, /api/wallet/:id, /api/wallets/deposit, /api/wallets/withdraw, /api/wallets/transfer
 - /api/transactions
 - /api/trade/order, /api/trade/orders, /api/trade/market
 - /api/staking, /api/staking/plans, /api/staking/stake
 - /api/farming/plans
 - /api/tickets, /api/tickets/buy
 - /api/redeem
 - /api/convert/xah, /api/convert/hxc, /api/convert/direct
 - /api/community/levels, /api/community/overview
 - /api/jackpot/winners

 SECURITY:
 In accordance with Rules 4, 5, and 7, user identity and balances are authoritative.
 Client never dictates balances or authorization privileges.

 NOTE:
 Developer documentation only. Never expose sensitive information.
*/

import { AuthoritativeBackend } from './backendEngine';
import { UserApiService, ApiConnectionConfig } from './userApiService';
import { XMoneyApiService } from './xMoneyApi';
import {
  ApiResponse,
  CommunityLevelData,
  FarmingPlan,
  JackpotDrawWinner,
  LotteryTicket,
  MarketTrade,
  RankAchievement,
  SipBonusTier,
  StakingPlan,
  TradeOrder,
  Transaction,
  UserProfile,
  UserWallets,
} from '../types';

export const ApiService = {
  // External ?Api=User Integration
  getUserApiConfig(): ApiConnectionConfig {
    return UserApiService.getConfig();
  },

  saveUserApiConfig(config: Partial<ApiConnectionConfig>): ApiConnectionConfig {
    return UserApiService.saveConfig(config);
  },

  async fetchUserDataFromApi(endpointUrl?: string): Promise<{
    success: boolean;
    user?: UserProfile;
    wallets?: UserWallets;
    raw?: any;
    error?: string;
    isCorsOrMixedContent?: boolean;
  }> {
    const res = await UserApiService.fetchUserData(endpointUrl);
    if (res.success && res.user) {
      AuthoritativeBackend.setUser(res.user);
      if (res.wallets) {
        AuthoritativeBackend.setWallets(res.wallets);
      }
    }
    return res;
  },

  importRawUserJson(jsonInput: string | object): {
    success: boolean;
    user?: UserProfile;
    wallets?: UserWallets;
    error?: string;
  } {
    const res = UserApiService.importRawJson(jsonInput);
    if (res.success && res.user) {
      AuthoritativeBackend.setUser(res.user);
      if (res.wallets) {
        AuthoritativeBackend.setWallets(res.wallets);
      }
    }
    return res;
  },

  loadSampleUserData(): { user: UserProfile; wallets?: UserWallets } {
    const res = UserApiService.loadSampleData();
    if (res.user) {
      AuthoritativeBackend.setUser(res.user);
      if (res.wallets) {
        AuthoritativeBackend.setWallets(res.wallets);
      }
    }
    return res;
  },

  // Auth & Profile
  async register(params: {
    walletAddress?: string;
    referId?: string;
    country: string;
    mobile: string;
    name: string;
  }): Promise<ApiResponse<{ user: UserProfile; token: string }>> {
    return AuthoritativeBackend.register(params);
  },

  async setupPasscode(passcode: string): Promise<ApiResponse<{ success: boolean; passcode?: string }>> {
    return AuthoritativeBackend.setupPasscode(passcode);
  },

  getLastCreatedPasscode(): string {
    return AuthoritativeBackend.getLastCreatedPasscode();
  },

  async verifyPasscode(pin: string): Promise<ApiResponse<{ verified: boolean }>> {
    return AuthoritativeBackend.verifyPasscode(pin);
  },

  async getProfile(): Promise<ApiResponse<UserProfile>> {
    try {
      const result = await XMoneyApiService.getUser();
      AuthoritativeBackend.setUser(result.user);
      if (result.wallets) AuthoritativeBackend.setWallets(result.wallets);
      return XMoneyApiService.success(result.user, 'Profile loaded from x.money API.');
    } catch (error) {
      return XMoneyApiService.failure<UserProfile>(error);
    }
  },

  async updateProfile(data: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    return AuthoritativeBackend.updateProfile(data);
  },

  // Wallets
  async getWallets(): Promise<ApiResponse<UserWallets>> {
    try {
      const wallets = await XMoneyApiService.getWallets();
      AuthoritativeBackend.setWallets(wallets);
      return XMoneyApiService.success(wallets, 'Wallet data loaded from x.money API.');
    } catch (error) {
      return XMoneyApiService.failure<UserWallets>(error);
    }
  },

  async deposit(params: {
    wallet: 'spot' | 'main' | 'funding' | 'jackpot';
    amountUSDT: number;
    currency: string;
  }): Promise<ApiResponse<{ wallets: UserWallets; tx: Transaction }>> {
    return AuthoritativeBackend.deposit(params);
  },

  async withdraw(params: {
    wallet: 'spot' | 'main' | 'funding';
    amountUSDT: number;
    toAddress: string;
    chain: string;
  }): Promise<ApiResponse<{ wallets: UserWallets; tx: Transaction }>> {
    return AuthoritativeBackend.withdraw(params);
  },

  async transferInternal(params: {
    fromWallet: 'spot' | 'main' | 'funding';
    toWallet: 'spot' | 'main' | 'funding';
    amountUSDT: number;
  }): Promise<ApiResponse<{ wallets: UserWallets }>> {
    return AuthoritativeBackend.transferInternal(params);
  },

  // Transactions
  async getTransactions(params?: {
    type?: string;
    search?: string;
    limit?: number;
  }): Promise<ApiResponse<Transaction[]>> {
    try {
      let rows = await XMoneyApiService.getTransactions(params?.limit ?? 100);
      if (params?.type) rows = rows.filter((row) => row.type === params.type || row.typeLabel.toLowerCase().includes(params.type!.toLowerCase()));
      if (params?.search) {
        const q = params.search.toLowerCase();
        rows = rows.filter((row) => [row.id, row.typeLabel, row.description, row.referenceId].some((value) => value.toLowerCase().includes(q)));
      }
      return XMoneyApiService.success(rows, rows.length ? 'Transactions loaded from x.money API.' : 'No transactions were returned by x.money.');
    } catch (error) {
      return XMoneyApiService.failure<Transaction[]>(error);
    }
  },

  // Trading
  async getMarketTrades(): Promise<ApiResponse<MarketTrade[]>> {
    return XMoneyApiService.success([], 'x.money does not expose a compatible public market-trades endpoint; showing an empty state instead of demo data.');
  },

  async submitTradeOrder(params: {
    side: 'BUY' | 'SELL';
    walletSource: 'spot' | 'main';
    price: number;
    amount: number;
  }): Promise<ApiResponse<{ order: TradeOrder; wallets: UserWallets }>> {
    return AuthoritativeBackend.submitOrder(params);
  },

  async getTradeOrders(): Promise<ApiResponse<TradeOrder[]>> {
    try {
      const rows = await XMoneyApiService.getCollection('Trades');
      const orders: TradeOrder[] = rows.map((row, index) => {
        const side = String(row.side ?? row.ttype ?? row.type ?? '').toUpperCase().includes('SELL') ? 'SELL' : 'BUY';
        const price = Number(row.price ?? 0) || 0;
        const amount = Number(row.amount ?? 0) || 0;
        return {
          id: String(row.id ?? row.orderid ?? `xmoney-order-${index}`),
          userId: String(row.uid ?? row.user ?? ''),
          pair: String(row.pair ?? row.ccc ?? '—'),
          side,
          walletSource: 'spot',
          price,
          amount,
          total: Number(row.total ?? row.value ?? price * amount) || 0,
          status: String(row.status ?? 'OPEN').toUpperCase().includes('FILL') ? 'FILLED' : String(row.status ?? '').toUpperCase().includes('CANCEL') ? 'CANCELLED' : 'OPEN',
          timestamp: String(row.created_at ?? row.date ?? row.time ?? ''),
        };
      });
      return XMoneyApiService.success(orders, orders.length ? 'Orders loaded from x.money API.' : 'No trade orders found.');
    } catch (error) {
      return XMoneyApiService.failure<TradeOrder[]>(error);
    }
  },

  // Staking
  async getStakingPlans(): Promise<ApiResponse<StakingPlan[]>> {
    try {
      const rows = await XMoneyApiService.getCollection('Staking_Plans');
      const plans: StakingPlan[] = rows.map((row, index) => ({
        id: String(row.id ?? row.plan_id ?? `staking-plan-${index}`),
        name: String(row.name ?? row.title ?? row.plan ?? 'Staking plan'),
        durationDays: Number(row.duration ?? row.duration_days ?? row.days ?? 0) || 0,
        aprPercent: Number(row.apr ?? row.apy ?? row.percent ?? row.rate ?? 0) || 0,
        minAmount: Number(row.min_amount ?? row.minimum ?? row.min ?? 0) || 0,
        maxAmount: Number(row.max_amount ?? row.maximum ?? row.max ?? 0) || 0,
        currency: String(row.ccc ?? row.currency ?? '—'),
        periodType: String(row.period ?? row.period_type ?? 'days'),
        description: String(row.description ?? ''),
        features: [],
      }));
      return XMoneyApiService.success(plans, plans.length ? 'Staking plans loaded from x.money API.' : 'No staking plans returned by x.money.');
    } catch (error) {
      return XMoneyApiService.failure<StakingPlan[]>(error);
    }
  },

  async stake(params: {
    planId: string;
    amountAURA: number;
  }): Promise<ApiResponse<{ wallets: UserWallets }>> {
    return AuthoritativeBackend.stake(params);
  },

  // Farming
  async getFarmingPlans(): Promise<ApiResponse<FarmingPlan[]>> {
    return XMoneyApiService.success([], 'No compatible farming-plans endpoint exists in the supplied x.money API; demo plans are disabled.');
  },

  // Rewards, Ranks, SIP
  async getRankAchievements(): Promise<ApiResponse<RankAchievement[]>> {
    return XMoneyApiService.success([], 'No compatible rank-achievements endpoint is available; demo rewards are disabled.');
  },

  async getSipBonusTiers(): Promise<ApiResponse<SipBonusTier[]>> {
    return XMoneyApiService.success([], 'No compatible SIP bonus endpoint is available; demo rewards are disabled.');
  },

  // Tickets
  async getTickets(): Promise<ApiResponse<LotteryTicket[]>> {
    return XMoneyApiService.success([], 'No compatible lottery-ticket endpoint exists in x.money; demo tickets are disabled.');
  },

  async buyTickets(params: {
    quantity: number;
    walletSource: 'funding' | 'spot';
  }): Promise<ApiResponse<{ tickets: LotteryTicket[]; wallets: UserWallets }>> {
    return AuthoritativeBackend.buyTickets(params);
  },

  // Redeem
  async redeemEarnings(amountUSDT: number): Promise<ApiResponse<{ redeemed: number; wallets: UserWallets }>> {
    return AuthoritativeBackend.redeemEarnings(amountUSDT);
  },

  // Conversions
  async convertXah(amountXAH: number): Promise<ApiResponse<{ receivedUSDT: number; wallets: UserWallets }>> {
    return AuthoritativeBackend.convertXah(amountXAH);
  },

  async convertHxc(amountHXC: number): Promise<ApiResponse<{ receivedUSDT: number; wallets: UserWallets }>> {
    return AuthoritativeBackend.convertHxc(amountHXC);
  },

  async convertDirect(params: {
    fromCurrency: string;
    toCurrency: string;
    amount: number;
  }): Promise<ApiResponse<{ received: number; wallets: UserWallets }>> {
    return AuthoritativeBackend.convertDirect(params as any);
  },

  // Community
  async getCommunityLevels(): Promise<ApiResponse<CommunityLevelData[]>> {
    return XMoneyApiService.success([], 'No compatible community-levels endpoint is available; demo community metrics are disabled.');
  },

  // Jackpot
  async getJackpotWinners(): Promise<ApiResponse<JackpotDrawWinner[]>> {
    return XMoneyApiService.success([], 'No compatible jackpot-winners endpoint exists in x.money; demo winners are disabled.');
  },

  // Testing utilities for Populated vs Empty data states
  resetSeedData() {
    AuthoritativeBackend.resetToSeed();
  },

  clearDataForEmptyState() {
    AuthoritativeBackend.clearDataForEmptyStateTesting();
  },
};
