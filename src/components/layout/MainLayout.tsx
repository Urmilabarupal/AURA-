/*
 FILE: src/components/layout/MainLayout.tsx

 PURPOSE:
 Master responsive layout shell hosting the Header, Sidebar, and active Page router.
 Implements Rule 7 (Responsive Design), Rule 22 (Sidebar), and Rule 23.

 RESPONSIBILITIES:
 - Wrap application pages in responsive grid (Desktop fixed sidebar, tablet adaptive, mobile drawer)
 - Coordinate top navigation bar and security alert modal
 - Route all 35+ pages represented in reference screenshots cleanly
 - Provide consistent dark mode aesthetics and anti-AI slop visual polish

 NOTE:
 Developer documentation only. Never expose sensitive information.
*/

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { SubpageHeader } from './SubpageHeader';
import { MobileBottomNav } from './MobileBottomNav';
import { SecurityModal } from '../common/SecurityModal';

// Pages
import { Dashboard } from '../../pages/Dashboard';
import { TradeView } from '../../pages/trade/TradeView';
import { WalletsList } from '../../pages/wallets/WalletsList';
import { DepositPage } from '../../pages/wallets/DepositPage';
import { WithdrawPage } from '../../pages/wallets/WithdrawPage';
import { SingleWallet } from '../../pages/wallets/SingleWallet';
import { ExtraWallet } from '../../pages/wallets/ExtraWallet';
import { ProfileView } from '../../pages/profile/ProfileView';
import { InternationalTrip } from '../../pages/rewards/InternationalTrip';
import { PortfolioView } from '../../pages/rewards/PortfolioView';
import { RewardRanks } from '../../pages/rewards/RewardRanks';
import { TransactionsView } from '../../pages/transactions/TransactionsView';
import { RoyaltySlot } from '../../pages/rewards/RoyaltySlot';
import { BloggingView } from '../../pages/rewards/BloggingView';
import { SipBonus } from '../../pages/rewards/SipBonus';
import { TicketsView } from '../../pages/tickets/TicketsView';
import { RedeemView } from '../../pages/redeem/RedeemView';
import { XahConvert } from '../../pages/convert/XahConvert';
import { HxcConvert } from '../../pages/convert/HxcConvert';
import { DirectConvert } from '../../pages/convert/DirectConvert';
import { StakingView } from '../../pages/staking/StakingView';
import { StakingPlanView } from '../../pages/staking/StakingPlan';
import { TeamStaking } from '../../pages/staking/TeamStaking';
import { TeamAprInfo } from '../../pages/staking/TeamAprInfo';
import { FarmingView } from '../../pages/farming/FarmingView';
import { FarmingPlanView } from '../../pages/farming/FarmingPlan';
import { FarmingIncome } from '../../pages/farming/FarmingIncome';
import { CommunityOverview } from '../../pages/community/CommunityOverview';
import { CommunityLevels } from '../../pages/community/CommunityLevels';
import { CommunityTransactions } from '../../pages/community/CommunityTransactions';
import { CommunityIncome } from '../../pages/community/CommunityIncome';
import { CommunityShare } from '../../pages/community/CommunityShare';
import { JackpotView } from '../../pages/jackpot/JackpotView';
import { JackpotDeposit } from '../../pages/jackpot/JackpotDeposit';
import { JackpotWallet } from '../../pages/jackpot/JackpotWallet';
import { JackpotReward } from '../../pages/jackpot/JackpotReward';
import { JackpotDirectReward } from '../../pages/jackpot/JackpotDirectReward';
import { JackpotWinners } from '../../pages/jackpot/JackpotWinners';
import { AboutView } from '../../pages/info/AboutView';
import { ContactView } from '../../pages/info/ContactView';
import { LegalView } from '../../pages/info/LegalView';
import { PrivacyView } from '../../pages/info/PrivacyView';
import { TermsView } from '../../pages/info/TermsView';
import { SalesPolicyView } from '../../pages/info/SalesPolicyView';

export const MainLayout: React.FC = () => {
  const { activeRoute, securityModalOpen, setSecurityModalOpen } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  const renderActivePage = () => {
    switch (activeRoute) {
      case 'home':
        return <Dashboard />;
      case 'trade':
        return <TradeView />;
      case 'wallets':
        return <WalletsList />;
      case 'deposit':
        return <DepositPage />;
      case 'withdraw':
        return <WithdrawPage />;
      case 'wallet-detail':
        return <SingleWallet />;
      case 'extra-wallet':
      case 'hxc-wallet':
        return <ExtraWallet />;
      case 'profile':
        return <ProfileView />;
      case 'international-trip':
        return <InternationalTrip />;
      case 'portfolio':
        return <PortfolioView />;
      case 'reward':
        return <RewardRanks />;
      case 'transactions':
        return <TransactionsView />;
      case 'royalty-slot':
        return <RoyaltySlot />;
      case 'blogging':
        return <BloggingView />;
      case 'sip-bonus':
        return <SipBonus />;
      case 'tickets':
        return <TicketsView />;
      case 'redeem':
        return <RedeemView />;
      case 'xah-convert':
        return <XahConvert />;
      case 'hxc-convert':
        return <HxcConvert />;
      case 'convert':
        return <DirectConvert />;
      case 'staking':
        return <StakingView />;
      case 'staking-plan':
        return <StakingPlanView />;
      case 'staking-income':
        return <TeamStaking />;
      case 'team-staking':
      case 'team-staking-income':
        return <TeamStaking />;
      case 'team-apr-info':
        return <TeamAprInfo />;
      case 'farming':
        return <FarmingView />;
      case 'farming-plan':
        return <FarmingPlanView />;
      case 'farming-income':
        return <FarmingIncome />;
      case 'community-overview':
        return <CommunityOverview />;
      case 'community-levels':
        return <CommunityLevels />;
      case 'community-transactions':
        return <CommunityTransactions />;
      case 'community-income':
        return <CommunityIncome />;
      case 'community-share':
        return <CommunityShare />;
      case 'jackpot':
        return <JackpotView />;
      case 'jackpot-deposit':
        return <JackpotDeposit />;
      case 'jackpot-wallet':
        return <JackpotWallet />;
      case 'jackpot-reward':
        return <JackpotReward />;
      case 'jackpot-direct-reward':
        return <JackpotDirectReward />;
      case 'winner':
        return <JackpotWinners />;
      case 'about':
        return <AboutView />;
      case 'contact':
        return <ContactView />;
      case 'legal':
        return <LegalView />;
      case 'privacy':
        return <PrivacyView />;
      case 'terms':
        return <TermsView />;
      case 'sales-policy':
        return <SalesPolicyView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1118] text-slate-100 flex flex-col font-sans">
      {/* Sidebar Navigation */}
      <Sidebar mobileOpen={mobileMenuOpen} setMobileOpen={setMobileMenuOpen} />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Header */}
        <Header mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />

        {/* Page Content Container */}
        <main className="flex-1 p-3.5 sm:p-5 lg:p-6 w-full mx-auto max-w-[1600px] pb-24 lg:pb-8">
          {/* Subpage Header matching screenshot (rendered on all pages except Home) */}
          {activeRoute !== 'home' && <SubpageHeader currentRoute={activeRoute} />}
          {renderActivePage()}
        </main>
      </div>

      {/* Global Mobile Bottom Navigation Dock */}
      <MobileBottomNav onOpenMenu={() => setMobileMenuOpen(true)} />

      {/* Security Notice Modal (Step 12 of Auth Flow from Screenshots 4 & 5) */}
      <SecurityModal
        isOpen={securityModalOpen}
        onClose={() => setSecurityModalOpen(false)}
      />
    </div>
  );
};
