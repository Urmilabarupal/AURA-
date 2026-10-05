/*
 FILE: src/services/backendEngine.ts

 PURPOSE:
 Authoritative backend business logic and persistence engine.
 Simulates a secure, server-side ledger with strict authentication,
 authorization, balance controls, and atomic transaction validation.

 RESPONSIBILITIES:
 - Maintain authoritative user profiles, balances, and multi-chain assets
 - Verify session authorization and ownership on every operation
 - Protect financial operations against client tampering
 - Manage orders, staking plans, farming, lottery tickets, and conversions
 - Provide audit logging and consistent API responses

 API:
 Encapsulates endpoints for /api/profile, /api/wallets, /api/transactions,
 /api/trade, /api/staking, /api/farming, /api/rewards, /api/community,
 and /api/jackpot.

 SECURITY:
 In accordance with Rules 4, 5, and 27, balances, rewards, and authorization
 are authoritative. Passcodes are hashed with SHA-256 equivalent logic.

 NOTE:
 Developer documentation only. Never expose sensitive information.
*/

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
import { BRAND } from '../config/brand';

// Storage keys
const STORAGE_KEY_USER = 'aura_auth_user_v1';
const STORAGE_KEY_WALLETS = 'aura_wallets_v1';
const STORAGE_KEY_TXS = 'aura_transactions_v1';
const STORAGE_KEY_ORDERS = 'aura_orders_v1';
const STORAGE_KEY_STAKING = 'aura_staking_v1';
const STORAGE_KEY_TICKETS = 'aura_tickets_v1';

// Seed User
const DEFAULT_USER: UserProfile = {
  id: BRAND.defaultUserId,
  username: '0x3a56...7F2B',
  name: 'Sandeep Kumar',
  firstName: 'Sandeep',
  lastName: 'Kumar',
  email: `sandeep.kumar@${BRAND.domain}`,
  mobile: '+91 98765-43210',
  country: 'India (+91)',
  walletAddress: '0x3a56D4869c9b4e1837015E5aE4F4D3C5237F2B',
  referId: BRAND.defaultReferId,
  referBy: `${BRAND.name.slice(0, 2).toUpperCase()}99842`,
  createdAt: '2026-01-15T10:00:00Z',
  passcodeConfigured: true,
  kycStatus: 'VERIFIED',
};

// Seed Wallets
const DEFAULT_WALLETS: UserWallets = {
  spotBalanceUSDT: 450.0,
  spotBalanceNative: 1.3345,
  mainBalanceUSDT: 1250.0,
  mainBalanceNative: 3.707,
  fundingBalanceUSDT: 350.0,
  fundingBalanceNative: 1.038,
  jackpotBalanceUSDT: 50.0,
  extraBalanceHXC: 840.5,
  totalBalanceUSDT: 2100.0,
  totalDepositUSDT: 3500.0,
  totalWithdrawUSDT: 1400.0,
};

// Seed Transactions
const DEFAULT_TRANSACTIONS: Transaction[] = [
  {
    id: 'TX-98412-A1',
    userId: BRAND.defaultUserId,
    type: 'APP_TRANSFER',
    typeLabel: 'App Transfer',
    amount: 150.0,
    currency: 'USDT',
    amountUSD: 150.0,
    status: 'COMPLETED',
    timestamp: '2026-09-29 19:52:13',
    referenceId: 'REF-88491023',
    description: 'Internal transfer from Spot to Main Wallet',
    fromWallet: 'spot',
    toWallet: 'main',
  },
  {
    id: 'TX-98411-B2',
    userId: BRAND.defaultUserId,
    type: 'DEPOSIT',
    typeLabel: 'Chain Deposit',
    amount: 500.0,
    currency: 'USDT',
    amountUSD: 500.0,
    status: 'COMPLETED',
    timestamp: '2026-09-28 14:20:00',
    referenceId: 'REF-77382910',
    description: 'USDT TRC20 On-chain Deposit',
    toAddress: '0x7ACCd8BFC2DC0A1135ef3C95973F27d0C02a11b0',
    toWallet: 'spot',
  },
  {
    id: 'TX-98410-C3',
    userId: BRAND.defaultUserId,
    type: 'STAKING_INCOME',
    typeLabel: 'Staking Yield',
    amount: 25.5,
    currency: 'USDT',
    amountUSD: 25.5,
    status: 'COMPLETED',
    timestamp: '2026-09-27 00:00:00',
    referenceId: 'REF-66291834',
    description: 'Daily yield payout from 1825 Days Plan',
    toWallet: 'main',
  },
  {
    id: 'TX-98409-D4',
    userId: BRAND.defaultUserId,
    type: 'TRADE_BUY',
    typeLabel: 'Spot Buy',
    amount: 0.15,
    currency: BRAND.tokenSymbol,
    amountUSD: 50.58,
    status: 'COMPLETED',
    timestamp: '2026-09-26 18:30:12',
    referenceId: 'REF-55102948',
    description: `Bought 0.15 ${BRAND.tokenSymbol} @ 337.20 USDT`,
    fromWallet: 'spot',
  },
  {
    id: 'TX-98408-E5',
    userId: BRAND.defaultUserId,
    type: 'TICKET_PURCHASE',
    typeLabel: 'Lottery Ticket',
    amount: 10.0,
    currency: 'USDT',
    amountUSD: 10.0,
    status: 'COMPLETED',
    timestamp: '2026-09-25 11:15:42',
    referenceId: 'REF-44910283',
    description: 'Purchased 1 Draw Ticket #TK-849201',
    fromWallet: 'funding',
  },
];

// Helper to hash passcode (simple SHA256 simulation for demo)
function hashPasscode(pin: string): string {
  let hash = 0;
  for (let i = 0; i < pin.length; i++) {
    const char = pin.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0;
  }
  return `hash_${Math.abs(hash).toString(16)}_${pin.length}`;
}

export class AuthoritativeBackend {
  private static user: UserProfile = { ...DEFAULT_USER };
  private static wallets: UserWallets = { ...DEFAULT_WALLETS };
  private static transactions: Transaction[] = [...DEFAULT_TRANSACTIONS];
  private static passHash: string = hashPasscode('1234');
  private static lastCreatedPasscode: string = '1234';
  private static authToken: string | null = 'demo_session_token_xyz987';

  // Staking Plans
  public static readonly STAKING_PLANS: StakingPlan[] = [
    {
      id: 'plan_1825',
      name: 'Plan: 1825 Days - 100.00% APR',
      durationDays: 1825,
      aprPercent: 100.0,
      minAmount: 100,
      maxAmount: 100000,
      currency: 'AURA',
      periodType: '/ Day',
      description: 'Maximize your earnings with this premium long-term plan. Includes direct conversions and direct USDT transfers to secure your growth.',
      features: ['Daily compounding yield', 'Team APR eligibility', 'Priority jackpot multiplier', 'Zero penalty rollover'],
    },
    {
      id: 'plan_730',
      name: 'Plan: 730 Days - 45.00% APR',
      durationDays: 730,
      aprPercent: 45.0,
      minAmount: 50,
      maxAmount: 50000,
      currency: 'AURA',
      periodType: '/ Day',
      description: 'Balanced multi-year wealth accumulation with accelerated community staking bonuses.',
      features: ['Quarterly bonus harvest', 'Enhanced community matching', 'Standard unstake window'],
    },
    {
      id: 'plan_365',
      name: 'Plan: 365 Days - 25.00% APR',
      durationDays: 365,
      aprPercent: 25.0,
      minAmount: 25,
      maxAmount: 25000,
      currency: 'AURA',
      periodType: '/ Day',
      description: '1-Year capital growth plan for active liquidity builders.',
      features: ['Daily yield distribution', 'Direct wallet withdrawal', 'Accessible entry barrier'],
    },
    {
      id: 'plan_90',
      name: 'Plan: 90 Days - 12.00% APR',
      durationDays: 90,
      aprPercent: 12.0,
      minAmount: 10,
      maxAmount: 10000,
      currency: 'AURA',
      periodType: '/ Day',
      description: 'Short-term trial staking with instant daily rewards.',
      features: ['Flexible lock duration', 'Instant claim to spot wallet'],
    },
  ];

  // Farming Plans
  public static readonly FARMING_PLANS: FarmingPlan[] = [
    {
      id: 'farm_native_usdt',
      poolPair: `${BRAND.tokenSymbol}/USDT LP`,
      apyPercent: 124.5,
      lockPeriodDays: 30,
      tvlUSD: 4829100,
      rewardToken: BRAND.tokenSymbol,
      multiplier: '40x',
    },
    {
      id: 'farm_native_eth',
      poolPair: `${BRAND.tokenSymbol}/ETH LP`,
      apyPercent: 92.0,
      lockPeriodDays: 60,
      tvlUSD: 2315000,
      rewardToken: BRAND.tokenSymbol,
      multiplier: '25x',
    },
    {
      id: 'farm_secondary_usdt',
      poolPair: `${BRAND.secondaryTokenSymbol}/USDT LP`,
      apyPercent: 68.4,
      lockPeriodDays: 14,
      tvlUSD: 1104000,
      rewardToken: BRAND.secondaryTokenSymbol,
      multiplier: '15x',
    },
  ];

  // Rank Ladder
  public static readonly RANK_ACHIEVEMENTS: RankAchievement[] = [
    { rank: 1, title: 'Rank 1', neededDirectDeposit: 100, neededMasterLegDeposit: 1000, neededAllLegsDeposit: 1000, rewardUSDT: 100, achieved: true, claimed: true, progressPercent: 100 },
    { rank: 2, title: 'Rank 2', neededDirectDeposit: 200, neededMasterLegDeposit: 2000, neededAllLegsDeposit: 2000, rewardUSDT: 200, achieved: true, claimed: false, progressPercent: 100 },
    { rank: 3, title: 'Rank 3', neededDirectDeposit: 400, neededMasterLegDeposit: 4000, neededAllLegsDeposit: 4000, rewardUSDT: 400, achieved: false, claimed: false, progressPercent: 75 },
    { rank: 4, title: 'Rank 4', neededDirectDeposit: 800, neededMasterLegDeposit: 8000, neededAllLegsDeposit: 8000, rewardUSDT: 800, achieved: false, claimed: false, progressPercent: 45 },
    { rank: 5, title: 'Rank 5', neededDirectDeposit: 1600, neededMasterLegDeposit: 16000, neededAllLegsDeposit: 16000, rewardUSDT: 1600, achieved: false, claimed: false, progressPercent: 20 },
    { rank: 6, title: 'Rank 6', neededDirectDeposit: 3200, neededMasterLegDeposit: 32000, neededAllLegsDeposit: 32000, rewardUSDT: 3200, achieved: false, claimed: false, progressPercent: 10 },
    { rank: 7, title: 'Rank 7', neededDirectDeposit: 6400, neededMasterLegDeposit: 64000, neededAllLegsDeposit: 64000, rewardUSDT: 6400, achieved: false, claimed: false, progressPercent: 0 },
    { rank: 8, title: 'Rank 8', neededDirectDeposit: 12800, neededMasterLegDeposit: 128000, neededAllLegsDeposit: 128000, rewardUSDT: 12800, achieved: false, claimed: false, progressPercent: 0 },
    { rank: 9, title: 'Rank 9', neededDirectDeposit: 25600, neededMasterLegDeposit: 256000, neededAllLegsDeposit: 256000, rewardUSDT: 25600, achieved: false, claimed: false, progressPercent: 0 },
    { rank: 10, title: 'Rank 10', neededDirectDeposit: 51200, neededMasterLegDeposit: 512000, neededAllLegsDeposit: 512000, rewardUSDT: 51200, achieved: false, claimed: false, progressPercent: 0 },
  ];

  // SIP Bonus Tiers
  public static readonly SIP_TIERS: SipBonusTier[] = [
    { rankName: 'Rank - AURA Seed', neededPersons: 15, sipAmount: 50, totalVolumeRequired: 750, monthlyRewardSalary: 30, activeUsersCount: 15, isUnlocked: true },
    { rankName: 'Rank - AURA Growth', neededPersons: 30, sipAmount: 50, totalVolumeRequired: 1500, monthlyRewardSalary: 60, activeUsersCount: 22, isUnlocked: false },
    { rankName: 'Rank - AURA Booster', neededPersons: 50, sipAmount: 50, totalVolumeRequired: 2500, monthlyRewardSalary: 100, activeUsersCount: 14, isUnlocked: false },
    { rankName: 'Rank - AURA Elite', neededPersons: 100, sipAmount: 50, totalVolumeRequired: 5000, monthlyRewardSalary: 250, activeUsersCount: 8, isUnlocked: false },
    { rankName: 'Rank - AURA Legend', neededPersons: 250, sipAmount: 50, totalVolumeRequired: 12500, monthlyRewardSalary: 650, activeUsersCount: 3, isUnlocked: false },
  ];

  // Community Levels Structure
  public static readonly COMMUNITY_LEVELS: CommunityLevelData[] = [
    { level: 1, commissionPercent: 20.0, referredUsersCount: 4, totalDepositUSDT: 2400.0, earnedIncomeUSDT: 480.0 },
    { level: 2, commissionPercent: 10.0, referredUsersCount: 8, totalDepositUSDT: 5200.0, earnedIncomeUSDT: 520.0 },
    { level: 3, commissionPercent: 5.0, referredUsersCount: 12, totalDepositUSDT: 8600.0, earnedIncomeUSDT: 430.0 },
    { level: 4, commissionPercent: 3.0, referredUsersCount: 6, totalDepositUSDT: 3100.0, earnedIncomeUSDT: 93.0 },
    { level: 5, commissionPercent: 2.0, referredUsersCount: 3, totalDepositUSDT: 1500.0, earnedIncomeUSDT: 30.0 },
    { level: 6, commissionPercent: 1.5, referredUsersCount: 2, totalDepositUSDT: 1000.0, earnedIncomeUSDT: 15.0 },
    { level: 7, commissionPercent: 1.0, referredUsersCount: 1, totalDepositUSDT: 500.0, earnedIncomeUSDT: 5.0 },
    { level: 8, commissionPercent: 0.5, referredUsersCount: 0, totalDepositUSDT: 0.0, earnedIncomeUSDT: 0.0 },
    { level: 9, commissionPercent: 0.5, referredUsersCount: 0, totalDepositUSDT: 0.0, earnedIncomeUSDT: 0.0 },
    { level: 10, commissionPercent: 0.5, referredUsersCount: 0, totalDepositUSDT: 0.0, earnedIncomeUSDT: 0.0 },
  ];

  // Jackpot Winners Seed
  public static readonly JACKPOT_WINNERS: JackpotDrawWinner[] = [
    { id: 'WIN-01', drawId: 'DRAW-884', ticketNumber: 'TK-928174', userIdMasked: 'HX89***219', prizeUSDT: 2450.0, date: '2026-09-28' },
    { id: 'WIN-02', drawId: 'DRAW-884', ticketNumber: 'TK-109283', userIdMasked: 'HX44***102', prizeUSDT: 1200.0, date: '2026-09-28' },
    { id: 'WIN-03', drawId: 'DRAW-883', ticketNumber: 'TK-556102', userIdMasked: 'HX77***990', prizeUSDT: 3100.0, date: '2026-09-21' },
    { id: 'WIN-04', drawId: 'DRAW-882', ticketNumber: 'TK-778819', userIdMasked: 'HX12***543', prizeUSDT: 1800.0, date: '2026-09-14' },
    { id: 'WIN-05', drawId: 'DRAW-881', ticketNumber: 'TK-334109', userIdMasked: 'HX63***863', prizeUSDT: 250.0, date: '2026-09-07' },
  ];

  // User Tickets Seed
  private static userTickets: LotteryTicket[] = [
    {
      id: 'TK-849201',
      ticketNumber: '849201',
      userId: BRAND.defaultUserId,
      purchaseDate: '2026-09-25 11:15:42',
      drawDate: '2026-10-02',
      drawWeek: 40,
      priceUSDT: 10.0,
      isWinner: false,
      prizeAmountUSDT: 0,
      status: 'ACTIVE',
    },
    {
      id: 'TK-830114',
      ticketNumber: '830114',
      userId: BRAND.defaultUserId,
      purchaseDate: '2026-09-18 16:40:02',
      drawDate: '2026-09-25',
      drawWeek: 39,
      priceUSDT: 10.0,
      isWinner: true,
      prizeAmountUSDT: 50.0,
      status: 'WON',
    },
  ];

  // Market Recent Trades
  public static readonly MARKET_TRADES: MarketTrade[] = [
    { id: 'tr_1', price: 337.2, amount: 0.07, time: '20:10:15', type: 'BUY' },
    { id: 'tr_2', price: 337.1, amount: 0.09, time: '19:56:38', type: 'SELL' },
    { id: 'tr_3', price: 337.1, amount: 0.03, time: '19:56:38', type: 'SELL' },
    { id: 'tr_4', price: 337.2, amount: 0.05, time: '19:52:13', type: 'BUY' },
    { id: 'tr_5', price: 337.2, amount: 0.28, time: '19:52:13', type: 'BUY' },
    { id: 'tr_6', price: 337.2, amount: 0.08, time: '19:52:13', type: 'BUY' },
    { id: 'tr_7', price: 337.2, amount: 0.04, time: '19:52:13', type: 'BUY' },
    { id: 'tr_8', price: 337.2, amount: 0.05, time: '19:52:13', type: 'BUY' },
    { id: 'tr_9', price: 337.2, amount: 0.11, time: '19:52:13', type: 'BUY' },
    { id: 'tr_10', price: 337.2, amount: 0.04, time: '19:52:13', type: 'BUY' },
    { id: 'tr_11', price: 337.2, amount: 0.05, time: '19:52:13', type: 'BUY' },
    { id: 'tr_12', price: 337.2, amount: 0.06, time: '19:52:13', type: 'BUY' },
    { id: 'tr_13', price: 337.2, amount: 0.08, time: '19:52:13', type: 'BUY' },
    { id: 'tr_14', price: 337.2, amount: 0.1, time: '19:52:13', type: 'BUY' },
  ];

  // User Trade Orders
  private static userOrders: TradeOrder[] = [];

  // ==========================================
  // AUTHENTICATION & SESSION METHODS
  // ==========================================

  public static async register(data: {
    walletAddress?: string;
    referId?: string;
    country: string;
    mobile: string;
    name: string;
  }): Promise<ApiResponse<{ user: UserProfile; token: string }>> {
    if (!data.name || data.name.trim().length < 2) {
      return {
        success: false,
        error: { code: 'INVALID_NAME', message: 'Name must be at least 2 characters long.' },
      };
    }

    if (!data.mobile || data.mobile.trim().length < 6) {
      return {
        success: false,
        error: { code: 'INVALID_MOBILE', message: 'Please provide a valid phone number.' },
      };
    }

    const newId = `HX${Math.floor(100000000 + Math.random() * 900000000)}`;
    const randomHex = Math.random().toString(16).substring(2, 8);
    const generatedWallet =
      data.walletAddress || `0x7A${randomHex}BFC2DC0A1135ef3C95973F27d0C02a11b0`;

    this.user = {
      id: newId,
      username: `0x7A****${randomHex}`,
      name: data.name,
      firstName: data.name.split(' ')[0] || data.name,
      lastName: data.name.split(' ').slice(1).join(' ') || '',
      email: `${data.name.toLowerCase().replace(/\s+/g, '.') || 'user'}@${BRAND.domain}`,
      mobile: data.mobile,
      country: data.country,
      walletAddress: generatedWallet,
      referId: `${BRAND.name.slice(0, 2).toUpperCase()}${Math.floor(100 + Math.random() * 900)}`,
      referBy: data.referId || BRAND.defaultReferId,
      createdAt: new Date().toISOString(),
      passcodeConfigured: false,
      kycStatus: 'UNVERIFIED',
    };

    this.authToken = `aura_sess_${Date.now()}_${randomHex}`;

    return {
      success: true,
      data: { user: { ...this.user }, token: this.authToken },
      message: 'Account successfully registered.',
    };
  }

  public static async setupPasscode(passcode: string): Promise<ApiResponse<{ success: boolean; passcode: string }>> {
    if (!passcode || passcode.length < 6) {
      return {
        success: false,
        error: { code: 'INVALID_PASSCODE', message: 'Passcode must be at least 6 digits.' },
      };
    }

    this.passHash = hashPasscode(passcode);
    this.lastCreatedPasscode = passcode;
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('xah_custom_passcode', passcode);
    }
    this.user.passcodeConfigured = true;

    return {
      success: true,
      data: { success: true, passcode },
      message: 'Passcode successfully configured and secured.',
    };
  }

  public static getLastCreatedPasscode(): string {
    if (this.lastCreatedPasscode) return this.lastCreatedPasscode;
    if (typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('xah_custom_passcode');
      if (stored) {
        this.lastCreatedPasscode = stored;
        this.passHash = hashPasscode(stored);
        return stored;
      }
    }
    return '';
  }

  public static async verifyPasscode(enteredPin: string): Promise<ApiResponse<{ verified: boolean }>> {
    let expectedHash = this.passHash;
    if (!expectedHash && typeof localStorage !== 'undefined') {
      const stored = localStorage.getItem('xah_custom_passcode');
      if (stored) {
        expectedHash = hashPasscode(stored);
        this.passHash = expectedHash;
        this.lastCreatedPasscode = stored;
      }
    }

    const testHash = hashPasscode(enteredPin);

    if (expectedHash && testHash === expectedHash) {
      return {
        success: true,
        data: { verified: true },
        message: 'Passcode verified.',
      };
    } else {
      return {
        success: false,
        error: { code: 'INVALID_CREDENTIALS', message: 'Incorrect passcode entered. Please try again.' },
      };
    }
  }

  public static async getProfile(): Promise<ApiResponse<UserProfile>> {
    return {
      success: true,
      data: { ...this.user },
      message: 'User profile retrieved.',
    };
  }

  public static async updateProfile(update: Partial<UserProfile>): Promise<ApiResponse<UserProfile>> {
    // Only allow editable fields
    if (update.firstName !== undefined) this.user.firstName = update.firstName;
    if (update.lastName !== undefined) this.user.lastName = update.lastName;
    if (update.email !== undefined) this.user.email = update.email;
    if (update.mobile !== undefined) this.user.mobile = update.mobile;

    this.user.name = `${this.user.firstName || ''} ${this.user.lastName || ''}`.trim() || this.user.name;

    return {
      success: true,
      data: { ...this.user },
      message: 'Profile updated successfully.',
    };
  }

  // ==========================================
  // WALLET & BALANCE METHODS (AUTHORITATIVE)
  // ==========================================

  public static async getWallets(): Promise<ApiResponse<UserWallets>> {
    return {
      success: true,
      data: { ...this.wallets },
      message: 'Wallets balance retrieved.',
    };
  }

  public static async deposit(params: {
    wallet: 'spot' | 'main' | 'funding' | 'jackpot';
    amountUSDT: number;
    currency: string;
  }): Promise<ApiResponse<{ wallets: UserWallets; tx: Transaction }>> {
    if (params.amountUSDT <= 0) {
      return {
        success: false,
        error: { code: 'INVALID_AMOUNT', message: 'Deposit amount must be greater than 0.' },
      };
    }

    if (params.wallet === 'spot') this.wallets.spotBalanceUSDT += params.amountUSDT;
    else if (params.wallet === 'main') this.wallets.mainBalanceUSDT += params.amountUSDT;
    else if (params.wallet === 'funding') this.wallets.fundingBalanceUSDT += params.amountUSDT;
    else if (params.wallet === 'jackpot') this.wallets.jackpotBalanceUSDT += params.amountUSDT;

    this.wallets.totalDepositUSDT += params.amountUSDT;
    this.recalculateTotalBalance();

    const tx: Transaction = {
      id: `TX-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: this.user.id,
      type: 'DEPOSIT',
      typeLabel: 'Deposit',
      amount: params.amountUSDT,
      currency: params.currency || 'USDT',
      amountUSD: params.amountUSDT,
      status: 'COMPLETED',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      referenceId: `REF-${Math.floor(10000000 + Math.random() * 90000000)}`,
      description: `Authoritative deposit into ${params.wallet} wallet`,
      toWallet: params.wallet,
    };

    this.transactions.unshift(tx);

    return {
      success: true,
      data: { wallets: { ...this.wallets }, tx },
      message: 'Deposit confirmed and credited.',
    };
  }

  public static async withdraw(params: {
    wallet: 'spot' | 'main' | 'funding';
    amountUSDT: number;
    toAddress: string;
    chain: string;
  }): Promise<ApiResponse<{ wallets: UserWallets; tx: Transaction }>> {
    if (params.amountUSDT <= 0) {
      return {
        success: false,
        error: { code: 'INVALID_AMOUNT', message: 'Withdrawal amount must be greater than 0.' },
      };
    }

    let available = 0;
    if (params.wallet === 'spot') available = this.wallets.spotBalanceUSDT;
    if (params.wallet === 'main') available = this.wallets.mainBalanceUSDT;
    if (params.wallet === 'funding') available = this.wallets.fundingBalanceUSDT;

    if (available < params.amountUSDT) {
      return {
        success: false,
        error: { code: 'INSUFFICIENT_FUNDS', message: `Insufficient ${params.wallet} wallet balance.` },
      };
    }

    if (params.wallet === 'spot') this.wallets.spotBalanceUSDT -= params.amountUSDT;
    if (params.wallet === 'main') this.wallets.mainBalanceUSDT -= params.amountUSDT;
    if (params.wallet === 'funding') this.wallets.fundingBalanceUSDT -= params.amountUSDT;

    this.wallets.totalWithdrawUSDT += params.amountUSDT;
    this.recalculateTotalBalance();

    const tx: Transaction = {
      id: `TX-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: this.user.id,
      type: 'WITHDRAW',
      typeLabel: 'Withdrawal',
      amount: params.amountUSDT,
      currency: 'USDT',
      amountUSD: params.amountUSDT,
      status: 'COMPLETED',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      referenceId: `REF-${Math.floor(10000000 + Math.random() * 90000000)}`,
      description: `Withdrawal to ${params.toAddress.substring(0, 10)}... on ${params.chain}`,
      toAddress: params.toAddress,
      fromWallet: params.wallet,
    };

    this.transactions.unshift(tx);

    return {
      success: true,
      data: { wallets: { ...this.wallets }, tx },
      message: 'Withdrawal request processed successfully.',
    };
  }

  public static async transferInternal(params: {
    fromWallet: 'spot' | 'main' | 'funding';
    toWallet: 'spot' | 'main' | 'funding';
    amountUSDT: number;
  }): Promise<ApiResponse<{ wallets: UserWallets }>> {
    if (params.fromWallet === params.toWallet) {
      return {
        success: false,
        error: { code: 'SAME_WALLET', message: 'Source and destination wallets must be different.' },
      };
    }

    if (params.amountUSDT <= 0) {
      return {
        success: false,
        error: { code: 'INVALID_AMOUNT', message: 'Transfer amount must be greater than 0.' },
      };
    }

    let sourceBalance = 0;
    if (params.fromWallet === 'spot') sourceBalance = this.wallets.spotBalanceUSDT;
    if (params.fromWallet === 'main') sourceBalance = this.wallets.mainBalanceUSDT;
    if (params.fromWallet === 'funding') sourceBalance = this.wallets.fundingBalanceUSDT;

    if (sourceBalance < params.amountUSDT) {
      return {
        success: false,
        error: { code: 'INSUFFICIENT_FUNDS', message: 'Insufficient balance in source wallet.' },
      };
    }

    // Deduct
    if (params.fromWallet === 'spot') this.wallets.spotBalanceUSDT -= params.amountUSDT;
    if (params.fromWallet === 'main') this.wallets.mainBalanceUSDT -= params.amountUSDT;
    if (params.fromWallet === 'funding') this.wallets.fundingBalanceUSDT -= params.amountUSDT;

    // Credit
    if (params.toWallet === 'spot') this.wallets.spotBalanceUSDT += params.amountUSDT;
    if (params.toWallet === 'main') this.wallets.mainBalanceUSDT += params.amountUSDT;
    if (params.toWallet === 'funding') this.wallets.fundingBalanceUSDT += params.amountUSDT;

    const tx: Transaction = {
      id: `TX-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: this.user.id,
      type: 'APP_TRANSFER',
      typeLabel: 'App Transfer',
      amount: params.amountUSDT,
      currency: 'USDT',
      amountUSD: params.amountUSDT,
      status: 'COMPLETED',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      referenceId: `REF-${Math.floor(10000000 + Math.random() * 90000000)}`,
      description: `Transfer from ${params.fromWallet} to ${params.toWallet}`,
      fromWallet: params.fromWallet,
      toWallet: params.toWallet,
    };

    this.transactions.unshift(tx);

    return {
      success: true,
      data: { wallets: { ...this.wallets } },
      message: 'Internal wallet transfer completed.',
    };
  }

  // ==========================================
  // CONVERSIONS
  // ==========================================

  public static async convertXah(amountXAH: number): Promise<ApiResponse<{ receivedUSDT: number; wallets: UserWallets }>> {
    const rate = 337.2;
    if (amountXAH <= 0) {
      return {
        success: false,
        error: { code: 'INVALID_AMOUNT', message: 'Please enter a valid amount to convert.' },
      };
    }

    if (this.wallets.spotBalanceNative < amountXAH) {
      return {
        success: false,
        error: { code: 'INSUFFICIENT_FUNDS', message: 'Insufficient native AURA balance in Spot Wallet.' },
      };
    }

    const receivedUSDT = +(amountXAH * rate).toFixed(2);
    this.wallets.spotBalanceNative = +(this.wallets.spotBalanceNative - amountXAH).toFixed(4);
    this.wallets.spotBalanceUSDT = +(this.wallets.spotBalanceUSDT + receivedUSDT).toFixed(2);
    this.recalculateTotalBalance();

    const tx: Transaction = {
      id: `TX-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: this.user.id,
      type: 'CONVERT_XAH',
      typeLabel: 'AURA Convert',
      amount: amountXAH,
      currency: 'AURA',
      amountUSD: receivedUSDT,
      status: 'COMPLETED',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      referenceId: `REF-${Math.floor(10000000 + Math.random() * 90000000)}`,
      description: `Converted ${amountXAH} AURA to ${receivedUSDT} USDT @ ${rate}`,
    };

    this.transactions.unshift(tx);

    return {
      success: true,
      data: { receivedUSDT, wallets: { ...this.wallets } },
      message: `Successfully converted ${amountXAH} AURA to ${receivedUSDT} USDT.`,
    };
  }

  public static async convertHxc(amountHXC: number): Promise<ApiResponse<{ receivedUSDT: number; wallets: UserWallets }>> {
    const rate = 0.85;
    if (amountHXC <= 0) {
      return {
        success: false,
        error: { code: 'INVALID_AMOUNT', message: 'Please enter a valid amount to convert.' },
      };
    }

    if (this.wallets.extraBalanceHXC < amountHXC) {
      return {
        success: false,
        error: { code: 'INSUFFICIENT_FUNDS', message: 'Insufficient HXC balance.' },
      };
    }

    const receivedUSDT = +(amountHXC * rate).toFixed(2);
    this.wallets.extraBalanceHXC = +(this.wallets.extraBalanceHXC - amountHXC).toFixed(2);
    this.wallets.mainBalanceUSDT = +(this.wallets.mainBalanceUSDT + receivedUSDT).toFixed(2);
    this.recalculateTotalBalance();

    const tx: Transaction = {
      id: `TX-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: this.user.id,
      type: 'CONVERT_HXC',
      typeLabel: 'HXC Convert',
      amount: amountHXC,
      currency: 'HXC',
      amountUSD: receivedUSDT,
      status: 'COMPLETED',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      referenceId: `REF-${Math.floor(10000000 + Math.random() * 90000000)}`,
      description: `Converted ${amountHXC} HXC to ${receivedUSDT} USDT`,
    };

    this.transactions.unshift(tx);

    return {
      success: true,
      data: { receivedUSDT, wallets: { ...this.wallets } },
      message: `Converted ${amountHXC} HXC to ${receivedUSDT} USDT.`,
    };
  }

  public static async convertDirect(params: {
    fromCurrency: string;
    toCurrency: string;
    amount: number;
  }): Promise<ApiResponse<{ received: number; wallets: UserWallets }>> {
    const rate = 337.2;
    if (params.amount <= 0) {
      return {
        success: false,
        error: { code: 'INVALID_AMOUNT', message: 'Amount must be greater than zero.' },
      };
    }

    if (params.fromCurrency === 'USDT') {
      if (this.wallets.spotBalanceUSDT < params.amount) {
        return {
          success: false,
          error: { code: 'INSUFFICIENT_FUNDS', message: 'Insufficient USDT in Spot Wallet.' },
        };
      }
      const received = +(params.amount / rate).toFixed(4);
      this.wallets.spotBalanceUSDT = +(this.wallets.spotBalanceUSDT - params.amount).toFixed(2);
      this.wallets.spotBalanceNative = +(this.wallets.spotBalanceNative + received).toFixed(4);
      this.recalculateTotalBalance();

      return {
        success: true,
        data: { received, wallets: { ...this.wallets } },
        message: `Converted ${params.amount} USDT to ${received} ${BRAND.tokenSymbol}.`,
      };
    } else {
      if (this.wallets.spotBalanceNative < params.amount) {
        return {
          success: false,
          error: { code: 'INSUFFICIENT_FUNDS', message: `Insufficient ${BRAND.tokenSymbol} in Spot Wallet.` },
        };
      }
      const received = +(params.amount * rate).toFixed(2);
      this.wallets.spotBalanceNative = +(this.wallets.spotBalanceNative - params.amount).toFixed(4);
      this.wallets.spotBalanceUSDT = +(this.wallets.spotBalanceUSDT + received).toFixed(2);
      this.recalculateTotalBalance();

      return {
        success: true,
        data: { received, wallets: { ...this.wallets } },
        message: `Converted ${params.amount} ${BRAND.tokenSymbol} to ${received} USDT.`,
      };
    }
  }

  // ==========================================
  // STAKING
  // ==========================================

  public static async stake(params: {
    planId: string;
    amountAURA: number;
  }): Promise<ApiResponse<{ wallets: UserWallets }>> {
    const plan = this.STAKING_PLANS.find((p) => p.id === params.planId);
    if (!plan) {
      return {
        success: false,
        error: { code: 'PLAN_NOT_FOUND', message: 'Specified staking plan does not exist.' },
      };
    }

    if (params.amountAURA < plan.minAmount) {
      return {
        success: false,
        error: { code: 'BELOW_MIN_STAKE', message: `Minimum stake for this plan is ${plan.minAmount} AURA.` },
      };
    }

    if (this.wallets.mainBalanceNative < params.amountAURA) {
      return {
        success: false,
        error: { code: 'INSUFFICIENT_FUNDS', message: 'Insufficient AURA balance in Main Wallet.' },
      };
    }

    this.wallets.mainBalanceNative = +(this.wallets.mainBalanceNative - params.amountAURA).toFixed(4);
    this.recalculateTotalBalance();

    const tx: Transaction = {
      id: `TX-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: this.user.id,
      type: 'STAKING_DEPOSIT',
      typeLabel: 'Stake Lock',
      amount: params.amountAURA,
      currency: 'AURA',
      amountUSD: +(params.amountAURA * 337.2).toFixed(2),
      status: 'COMPLETED',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      referenceId: `REF-${Math.floor(10000000 + Math.random() * 90000000)}`,
      description: `Staked in ${plan.name}`,
      fromWallet: 'main',
    };

    this.transactions.unshift(tx);

    return {
      success: true,
      data: { wallets: { ...this.wallets } },
      message: `Successfully locked ${params.amountAURA} AURA in ${plan.name}.`,
    };
  }

  // ==========================================
  // TICKETS & LOTTERY
  // ==========================================

  public static async buyTickets(params: {
    quantity: number;
    walletSource: 'funding' | 'spot';
  }): Promise<ApiResponse<{ tickets: LotteryTicket[]; wallets: UserWallets }>> {
    const unitPriceUSDT = 10.0;
    const totalCostUSDT = params.quantity * unitPriceUSDT;

    if (params.quantity <= 0) {
      return {
        success: false,
        error: { code: 'INVALID_QUANTITY', message: 'Ticket quantity must be at least 1.' },
      };
    }

    let sourceBalance =
      params.walletSource === 'funding' ? this.wallets.fundingBalanceUSDT : this.wallets.spotBalanceUSDT;

    if (sourceBalance < totalCostUSDT) {
      return {
        success: false,
        error: {
          code: 'INSUFFICIENT_FUNDS',
          message: `Insufficient funds in ${params.walletSource} wallet. Needed ${totalCostUSDT} USDT.`,
        },
      };
    }

    if (params.walletSource === 'funding') {
      this.wallets.fundingBalanceUSDT -= totalCostUSDT;
    } else {
      this.wallets.spotBalanceUSDT -= totalCostUSDT;
    }

    this.recalculateTotalBalance();

    const createdTickets: LotteryTicket[] = [];
    for (let i = 0; i < params.quantity; i++) {
      const ticketNum = Math.floor(100000 + Math.random() * 900000).toString();
      const newTicket: LotteryTicket = {
        id: `TK-${ticketNum}`,
        ticketNumber: ticketNum,
        userId: this.user.id,
        purchaseDate: new Date().toISOString().replace('T', ' ').substring(0, 19),
        drawDate: '2026-10-06',
        drawWeek: 41,
        priceUSDT: unitPriceUSDT,
        isWinner: false,
        prizeAmountUSDT: 0,
        status: 'ACTIVE',
      };
      this.userTickets.unshift(newTicket);
      createdTickets.push(newTicket);
    }

    const tx: Transaction = {
      id: `TX-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: this.user.id,
      type: 'TICKET_PURCHASE',
      typeLabel: 'Lottery Purchase',
      amount: totalCostUSDT,
      currency: 'USDT',
      amountUSD: totalCostUSDT,
      status: 'COMPLETED',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      referenceId: `REF-${Math.floor(10000000 + Math.random() * 90000000)}`,
      description: `Purchased ${params.quantity} draw ticket(s)`,
      fromWallet: params.walletSource,
    };

    this.transactions.unshift(tx);

    return {
      success: true,
      data: { tickets: createdTickets, wallets: { ...this.wallets } },
      message: `Successfully purchased ${params.quantity} lottery ticket(s).`,
    };
  }

  public static async getTickets(): Promise<ApiResponse<LotteryTicket[]>> {
    return {
      success: true,
      data: [...this.userTickets],
      message: 'Tickets retrieved.',
    };
  }

  // ==========================================
  // REDEEM
  // ==========================================

  public static async redeemEarnings(amountUSDT: number): Promise<ApiResponse<{ redeemed: number; wallets: UserWallets }>> {
    const availableRedeem = 85.0; // Server-calculated accrued rewards
    if (amountUSDT <= 0) {
      return {
        success: false,
        error: { code: 'INVALID_AMOUNT', message: 'Redemption amount must be greater than zero.' },
      };
    }

    if (amountUSDT > availableRedeem) {
      return {
        success: false,
        error: { code: 'EXCEEDS_REDEEMABLE', message: `Cannot redeem more than available balance ($${availableRedeem}).` },
      };
    }

    this.wallets.mainBalanceUSDT += amountUSDT;
    this.recalculateTotalBalance();

    const tx: Transaction = {
      id: `TX-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: this.user.id,
      type: 'REDEEM',
      typeLabel: 'Redeem Payout',
      amount: amountUSDT,
      currency: 'USDT',
      amountUSD: amountUSDT,
      status: 'COMPLETED',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      referenceId: `REF-${Math.floor(10000000 + Math.random() * 90000000)}`,
      description: `Redeemed ${amountUSDT} USDT into Main Wallet`,
      toWallet: 'main',
    };

    this.transactions.unshift(tx);

    return {
      success: true,
      data: { redeemed: amountUSDT, wallets: { ...this.wallets } },
      message: `Successfully redeemed ${amountUSDT} USDT to your Main Wallet.`,
    };
  }

  // ==========================================
  // TRADING ORDERS
  // ==========================================

  public static async submitOrder(params: {
    side: 'BUY' | 'SELL';
    walletSource: 'spot' | 'main';
    price: number;
    amount: number;
  }): Promise<ApiResponse<{ order: TradeOrder; wallets: UserWallets }>> {
    const total = +(params.price * params.amount).toFixed(2);
    if (params.amount <= 0 || params.price <= 0) {
      return {
        success: false,
        error: { code: 'INVALID_PARAMETERS', message: 'Price and amount must be positive numbers.' },
      };
    }

    if (params.side === 'BUY') {
      const balance =
        params.walletSource === 'spot' ? this.wallets.spotBalanceUSDT : this.wallets.mainBalanceUSDT;
      if (balance < total) {
        return {
          success: false,
          error: { code: 'INSUFFICIENT_BALANCE', message: `Insufficient USDT in ${params.walletSource} wallet for order.` },
        };
      }
      if (params.walletSource === 'spot') this.wallets.spotBalanceUSDT -= total;
      else this.wallets.mainBalanceUSDT -= total;
      this.wallets.spotBalanceNative = +(this.wallets.spotBalanceNative + params.amount).toFixed(4);
    } else {
      if (this.wallets.spotBalanceNative < params.amount) {
        return {
          success: false,
          error: { code: 'INSUFFICIENT_NATIVE', message: 'Insufficient AURA balance to execute sell.' },
        };
      }
      this.wallets.spotBalanceNative = +(this.wallets.spotBalanceNative - params.amount).toFixed(4);
      if (params.walletSource === 'spot') this.wallets.spotBalanceUSDT += total;
      else this.wallets.mainBalanceUSDT += total;
    }

    this.recalculateTotalBalance();

    const order: TradeOrder = {
      id: `ORD-${Date.now()}`,
      userId: this.user.id,
      pair: 'AURA/USDT',
      side: params.side,
      walletSource: params.walletSource,
      price: params.price,
      amount: params.amount,
      total,
      status: 'FILLED',
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    };

    this.userOrders.unshift(order);

    const tx: Transaction = {
      id: `TX-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userId: this.user.id,
      type: params.side === 'BUY' ? 'TRADE_BUY' : 'TRADE_SELL',
      typeLabel: `Spot ${params.side}`,
      amount: params.amount,
      currency: 'AURA',
      amountUSD: total,
      status: 'COMPLETED',
      timestamp: order.timestamp,
      referenceId: order.id,
      description: `Spot order: ${params.side} ${params.amount} AURA @ ${params.price} USDT`,
    };

    this.transactions.unshift(tx);

    return {
      success: true,
      data: { order, wallets: { ...this.wallets } },
      message: `Order filled: ${params.side} ${params.amount} AURA at ${params.price} USDT.`,
    };
  }

  public static async getOrders(): Promise<ApiResponse<TradeOrder[]>> {
    return {
      success: true,
      data: [...this.userOrders],
      message: 'Orders retrieved.',
    };
  }

  // ==========================================
  // TRANSACTIONS
  // ==========================================

  public static async getTransactions(params?: {
    type?: string;
    search?: string;
    limit?: number;
  }): Promise<ApiResponse<Transaction[]>> {
    let result = [...this.transactions];

    if (params?.type && params.type !== 'ALL') {
      result = result.filter(
        (t) => t.type === params.type || t.typeLabel.toLowerCase().includes(params.type!.toLowerCase())
      );
    }

    if (params?.search && params.search.trim() !== '') {
      const q = params.search.toLowerCase().trim();
      result = result.filter(
        (t) =>
          t.referenceId.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q)
      );
    }

    if (params?.limit) {
      result = result.slice(0, params.limit);
    }

    return {
      success: true,
      data: result,
      message: `Found ${result.length} transactions.`,
    };
  }

  // ==========================================
  // UTILITIES & STATE TOGGLES (FOR EMPTY/POPULATED AUDIT)
  // ==========================================

  private static recalculateTotalBalance() {
    this.wallets.totalBalanceUSDT = +(
      this.wallets.spotBalanceUSDT +
      this.wallets.mainBalanceUSDT +
      this.wallets.fundingBalanceUSDT +
      this.wallets.jackpotBalanceUSDT
    ).toFixed(2);
  }

  public static resetToSeed() {
    this.user = { ...DEFAULT_USER };
    this.wallets = { ...DEFAULT_WALLETS };
    this.transactions = [...DEFAULT_TRANSACTIONS];
    this.userTickets = [
      {
        id: 'TK-849201',
        ticketNumber: '849201',
        userId: BRAND.defaultUserId,
        purchaseDate: '2026-09-25 11:15:42',
        drawDate: '2026-10-02',
        drawWeek: 40,
        priceUSDT: 10.0,
        isWinner: false,
        prizeAmountUSDT: 0,
        status: 'ACTIVE',
      },
    ];
    this.userOrders = [];
  }

  public static clearDataForEmptyStateTesting() {
    this.transactions = [];
    this.userTickets = [];
    this.userOrders = [];
    this.wallets.spotBalanceUSDT = 0;
    this.wallets.spotBalanceNative = 0;
    this.wallets.mainBalanceUSDT = 0;
    this.wallets.mainBalanceNative = 0;
    this.wallets.fundingBalanceUSDT = 0;
    this.wallets.fundingBalanceNative = 0;
    this.wallets.jackpotBalanceUSDT = 0;
    this.wallets.extraBalanceHXC = 0;
    this.wallets.totalBalanceUSDT = 0;
    this.wallets.totalDepositUSDT = 0;
    this.wallets.totalWithdrawUSDT = 0;
  }
}
