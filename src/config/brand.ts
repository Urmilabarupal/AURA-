/*
 FILE: src/config/brand.ts

 PURPOSE:
 Centralized dynamic brand configuration for the entire application.
 Modifying this single file instantly updates the brand name, token symbols,
 blockchain network names, referral defaults, and copyright across all pages,
 components, modals, navigation bars, and footers.
*/

export interface BrandConfig {
  /** Primary brand display name, e.g. "Money X" */
  name: string;
  /** Short or uppercase brand display name, e.g. "Money X" */
  shortName: string;
  /** Blockchain network name, e.g. "Money X Chain" */
  chainName: string;
  /** Mainnet network identifier, e.g. "Money X Mainnet" */
  chainNetwork: string;
  /** Native token symbol, e.g. "Money X" */
  tokenSymbol: string;
  /** Native token descriptive title, e.g. "Money X Native" */
  tokenName: string;
  /** Secondary utility / convert token symbol, e.g. "Money X" */
  secondaryTokenSymbol: string;
  /** Secondary utility / convert token name, e.g. "Money X Convert" */
  secondaryTokenName: string;
  /** Sub-brand / ecosystem banner text, e.g. "MONEY X ECOSYSTEM" */
  ecosystemName: string;
  /** Legal or protocol identity, e.g. "Money X Protocol" */
  legalName: string;
  /** Dynamic full copyright notice with current year */
  copyright: string;
  /** Dynamic compact copyright notice with current year */
  shortCopyright: string;
  /** Brand tagline */
  tagline: string;
  /** Protocol meta description */
  description: string;
  /** Protocol / network version */
  version: string;
  /** Official brand domain */
  domain: string;
  /** Default WhatsApp/Telegram support text */
  supportText: string;
  /** Default fallback sponsor / referral ID */
  defaultReferId: string;
  /** Default fallback demo user ID */
  defaultUserId: string;
}

export const BRAND: BrandConfig = {
  name: 'Money X',
  shortName: 'Money X',
  chainName: 'Money X Chain',
  chainNetwork: 'Money X Mainnet',
  tokenSymbol: 'Money X',
  tokenName: 'Money X Native',
  secondaryTokenSymbol: 'Money X',
  secondaryTokenName: 'Money X Convert',
  ecosystemName: 'MONEY X ECOSYSTEM',
  legalName: 'Money X Protocol',
  copyright: `© ${new Date().getFullYear()} Money X. All rights reserved.`,
  shortCopyright: `© ${new Date().getFullYear()} Money X. Non-Custodial Protocol.`,
  tagline: 'Decentralized Wealth & Staking Ecosystem',
  description: 'Enterprise-grade digital asset wallet, multi-chain liquidity, staking, trading, and decentralized financial rewards platform on Money X Chain.',
  version: 'v2.4',
  domain: 'moneyx.com',
  supportText: 'Hello Money X Support',
  defaultReferId: 'MNX001',
  defaultUserId: 'MNX633547863',
};
