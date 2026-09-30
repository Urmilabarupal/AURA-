/*
 FILE: src/types/index.ts

 PURPOSE:
 Core TypeScript definitions for the entire AURA Financial & Wallet Platform.

 RESPONSIBILITIES:
 - Define User, Session, and Auth models
 - Define Multi-Chain Wallets, Balances, and Transaction models
 - Define Trading Pair, Order Book, Trades, and Order types
 - Define Staking, Farming, Community, and Reward structures
 - Define Jackpot, Lottery, and Conversion types
 - Define API response and filter contracts

 NOTE:
 Developer documentation only. Never expose sensitive information.
*/

export type UserRole = 'USER' | 'VERIFIED' | 'VIP';

export interface UserProfile {
  id: string;
  username: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email: string;
  mobile: string;
  country: string;
  walletAddress: string;
  referId: string;
  referBy: string;
  createdAt: string;
  passcodeConfigured: boolean;
  kycStatus: 'UNVERIFIED' | 'PENDING' | 'VERIFIED';
}

export type WalletType = 'spot' | 'main' | 'funding' | 'jackpot' | 'extra';

export interface WalletBalance {
  currency: string;
  symbol: string;
  chain: string;
  balance: number;
  usdValue: number;
  available: number;
  locked: number;
  icon?: string;
}

export interface UserWallets {
  spotBalanceUSDT: number;
  spotBalanceNative: number;
  mainBalanceUSDT: number;
  mainBalanceNative: number;
  fundingBalanceUSDT: number;
  fundingBalanceNative: number;
  jackpotBalanceUSDT: number;
  extraBalanceHXC: number;
  totalBalanceUSDT: number;
  totalDepositUSDT: number;
  totalWithdrawUSDT: number;
}

export type TransactionType =
  | 'APP_TRANSFER'
  | 'DEPOSIT'
  | 'WITHDRAW'
  | 'TRADE_BUY'
  | 'TRADE_SELL'
  | 'CONVERT_XAH'
  | 'CONVERT_HXC'
  | 'CONVERT_DIRECT'
  | 'STAKING_DEPOSIT'
  | 'STAKING_INCOME'
  | 'FARMING_DEPOSIT'
  | 'FARMING_HARVEST'
  | 'TICKET_PURCHASE'
  | 'LOTTERY_WIN'
  | 'REDEEM'
  | 'ROYALTY_INCOME'
  | 'BLOGGING_INCOME'
  | 'SIP_SALARY'
  | 'COMMUNITY_COMMISSION'
  | 'JACKPOT_REWARD';

export type TransactionStatus = 'COMPLETED' | 'PENDING' | 'FAILED' | 'PROCESSING';

export interface Transaction {
  id: string;
  userId: string;
  type: TransactionType;
  typeLabel: string;
  amount: number;
  currency: string;
  amountUSD: number;
  status: TransactionStatus;
  timestamp: string;
  referenceId: string;
  description: string;
  toAddress?: string;
  fromWallet?: WalletType;
  toWallet?: WalletType;
}

export interface StakingPlan {
  id: string;
  name: string;
  durationDays: number;
  aprPercent: number;
  minAmount: number;
  maxAmount: number;
  currency: string;
  periodType: string;
  description: string;
  features: string[];
}

export interface UserStakingRecord {
  id: string;
  userId: string;
  planId: string;
  planName: string;
  amountStaked: number;
  currency: string;
  aprPercent: number;
  startDate: string;
  endDate: string;
  earnedIncome: number;
  dailyYield: number;
  status: 'ACTIVE' | 'COMPLETED' | 'UNSTAKED';
}

export interface FarmingPlan {
  id: string;
  poolPair: string;
  apyPercent: number;
  lockPeriodDays: number;
  tvlUSD: number;
  rewardToken: string;
  multiplier: string;
}

export interface UserFarmingRecord {
  id: string;
  userId: string;
  poolId: string;
  poolPair: string;
  stakedAmountLP: number;
  stakedUSDValue: number;
  harvestableReward: number;
  startDate: string;
  status: 'FARMING' | 'HARVESTED' | 'ENDED';
}

export interface TradeOrder {
  id: string;
  userId: string;
  pair: string;
  side: 'BUY' | 'SELL';
  walletSource: 'spot' | 'main';
  price: number;
  amount: number;
  total: number;
  status: 'OPEN' | 'FILLED' | 'CANCELLED';
  timestamp: string;
}

export interface MarketTrade {
  id: string;
  price: number;
  amount: number;
  time: string;
  type: 'BUY' | 'SELL';
}

export interface LotteryTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  purchaseDate: string;
  drawDate: string;
  drawWeek: number;
  priceUSDT: number;
  isWinner: boolean;
  prizeAmountUSDT: number;
  status: 'ACTIVE' | 'WON' | 'DRAWN';
}

export interface RankAchievement {
  rank: number;
  title: string;
  neededDirectDeposit: number;
  neededMasterLegDeposit: number;
  neededAllLegsDeposit: number;
  rewardUSDT: number;
  achieved: boolean;
  claimed: boolean;
  progressPercent: number;
}

export interface SipBonusTier {
  rankName: string;
  neededPersons: number;
  sipAmount: number;
  totalVolumeRequired: number;
  monthlyRewardSalary: number;
  activeUsersCount: number;
  isUnlocked: boolean;
}

export interface CommunityLevelData {
  level: number;
  commissionPercent: number;
  referredUsersCount: number;
  totalDepositUSDT: number;
  earnedIncomeUSDT: number;
}

export interface JackpotDrawWinner {
  id: string;
  drawId: string;
  ticketNumber: string;
  userIdMasked: string;
  prizeUSDT: number;
  date: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
}
