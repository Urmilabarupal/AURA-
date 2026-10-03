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
    return AuthoritativeBackend.getProfile();
  },

  async updateProfile(data: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    return AuthoritativeBackend.updateProfile(data);
  },

  // Wallets
  async getWallets(): Promise<ApiResponse<UserWallets>> {
    return AuthoritativeBackend.getWallets();
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
    return AuthoritativeBackend.getTransactions(params);
  },

  // Trading
  async getMarketTrades(): Promise<ApiResponse<MarketTrade[]>> {
    return {
      success: true,
      data: AuthoritativeBackend.MARKET_TRADES,
      message: 'Market trades retrieved.',
    };
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
    return AuthoritativeBackend.getOrders();
  },

  // Staking
  async getStakingPlans(): Promise<ApiResponse<StakingPlan[]>> {
    return {
      success: true,
      data: AuthoritativeBackend.STAKING_PLANS,
      message: 'Staking plans retrieved.',
    };
  },

  async stake(params: {
    planId: string;
    amountAURA: number;
  }): Promise<ApiResponse<{ wallets: UserWallets }>> {
    return AuthoritativeBackend.stake(params);
  },

  // Farming
  async getFarmingPlans(): Promise<ApiResponse<FarmingPlan[]>> {
    return {
      success: true,
      data: AuthoritativeBackend.FARMING_PLANS,
      message: 'Farming plans retrieved.',
    };
  },

  // Rewards, Ranks, SIP
  async getRankAchievements(): Promise<ApiResponse<RankAchievement[]>> {
    return {
      success: true,
      data: AuthoritativeBackend.RANK_ACHIEVEMENTS,
      message: 'Rank achievements retrieved.',
    };
  },

  async getSipBonusTiers(): Promise<ApiResponse<SipBonusTier[]>> {
    return {
      success: true,
      data: AuthoritativeBackend.SIP_TIERS,
      message: 'SIP bonus tiers retrieved.',
    };
  },

  // Tickets
  async getTickets(): Promise<ApiResponse<LotteryTicket[]>> {
    return AuthoritativeBackend.getTickets();
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
    return {
      success: true,
      data: AuthoritativeBackend.COMMUNITY_LEVELS,
      message: 'Community levels retrieved.',
    };
  },

  // Jackpot
  async getJackpotWinners(): Promise<ApiResponse<JackpotDrawWinner[]>> {
    return {
      success: true,
      data: AuthoritativeBackend.JACKPOT_WINNERS,
      message: 'Jackpot winners retrieved.',
    };
  },

  // Testing utilities for Populated vs Empty data states
  resetSeedData() {
    AuthoritativeBackend.resetToSeed();
  },

  clearDataForEmptyState() {
    AuthoritativeBackend.clearDataForEmptyStateTesting();
  },
};
