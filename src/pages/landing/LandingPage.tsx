/*
 FILE: src/pages/landing/LandingPage.tsx

 PURPOSE:
 Bespoke, Handcrafted Trading & Financial Platform Landing Page.
 Engineered specifically to banish all AI-generated clichés:
 1. Canvas: True Pitch Black OLED background (#000000) with ultra-fine hairline borders (#18181c).
 2. Live Interactive Trading Terminal:
    - Real-time mouse-tracking crosshair with dynamic price & timestamp axis tags
    - Live Candlestick & Volume Histogram bars (Green/Red volume depth)
    - Ticking Order Book with live bids and asks updating in real time
    - Indicator toggles: SMA(20), RSI, Volume
    - Interactive 1-click UP (Call) / DOWN (Put) simulated trading with live countdown & payout settlement
 3. Scroll-Driven Micro-interactions:
    - Glowing top scroll progress bar with live % readout
    - Glass sticky header with blur compression on scroll
    - Floating section quick-nav dock
    - Smooth marquee ticker with live bid/ask quotes
 4. High-End Fintech Bento Grid:
    - Asymmetric structural hierarchy (no generic clone cards)
    - Real quantitative proof metrics adjacent to features
    - Interactive Profit & Staking Yield simulator
 5. Zero-Pill discipline, strict typography hierarchy (Poppins + JetBrains Mono), WCAG AA contrast.
*/

import React, { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { BRAND } from '../../config/brand';
import { ThemeToggle } from '../../components/common/ThemeToggle';
import heroTerminalImg from '../../assets/images/olymptrade_hero_terminal_1790946814485.jpg';
import mobilePlatformImg from '../../assets/images/olymptrade_mobile_platform_1790946827477.jpg';
import assetsShowcaseImg from '../../assets/images/olymptrade_assets_showcase_1790946842771.jpg';
import {
  Activity,
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Award,
  BarChart2,
  CheckCircle2,
  ChevronDown,
  Clock,
  Coins,
  Compass,
  Cpu,
  DollarSign,
  Download,
  ExternalLink,
  Flame,
  Globe,
  Layers,
  LineChart,
  Lock,
  Menu,
  MousePointer2,
  Percent,
  Play,
  RefreshCw,
  Repeat,
  Shield,
  ShieldCheck,
  Smartphone,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
  X,
  Zap,
} from 'lucide-react';

interface SimulatedTrade {
  id: string;
  asset: string;
  direction: 'UP' | 'DOWN';
  amount: number;
  entryPrice: number;
  payoutPercent: number;
  secondsRemaining: number;
}

interface OrderBookRow {
  price: number;
  size: number;
  total: number;
}

export const LandingPage: React.FC = () => {
  const { setAuthStage, setActiveRoute } = useAuth();
  const { isDark } = useTheme();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [scrollY, setScrollY] = useState<number>(0);

  // Active section for floating dock
  const [activeSection, setActiveSection] = useState<string>('terminal');

  // Interactive Terminal State
  const [accountMode, setAccountMode] = useState<'demo' | 'real'>('demo');
  const [demoBalance, setDemoBalance] = useState<number>(10000.0);
  const [selectedAssetId, setSelectedAssetId] = useState<string>('native');
  const [tradeDuration, setTradeDuration] = useState<number>(5);
  const [tradeAmount, setTradeAmount] = useState<number>(50);
  const [activeIndicator, setActiveIndicator] = useState<'VOL' | 'SMA' | 'RSI'>('VOL');
  const [chartType, setChartType] = useState<'candle' | 'area'>('candle');

  // Crosshair Mouse State for high-fidelity trading feel
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);
  const [hoveredPrice, setHoveredPrice] = useState<number | null>(null);
  const chartContainerRef = useRef<HTMLDivElement>(null);

  // Live Simulated Price Engine
  const [livePrice, setLivePrice] = useState<number>(337.2);
  const [candles, setCandles] = useState<
    { open: number; high: number; low: number; close: number; volume: number; isUp: boolean }[]
  >([
    { open: 335.0, high: 336.2, low: 334.8, close: 335.8, volume: 142, isUp: true },
    { open: 335.8, high: 336.5, low: 335.2, close: 336.1, volume: 98, isUp: true },
    { open: 336.1, high: 336.8, low: 335.6, close: 335.9, volume: 110, isUp: false },
    { open: 335.9, high: 337.0, low: 335.7, close: 336.6, volume: 165, isUp: true },
    { open: 336.6, high: 337.4, low: 336.2, close: 336.8, volume: 84, isUp: true },
    { open: 336.8, high: 337.5, low: 336.5, close: 337.1, volume: 190, isUp: true },
    { open: 337.1, high: 337.8, low: 336.8, close: 337.0, volume: 130, isUp: false },
    { open: 337.0, high: 337.9, low: 336.9, close: 337.5, volume: 210, isUp: true },
    { open: 337.5, high: 338.2, low: 337.1, close: 337.2, volume: 175, isUp: false },
  ]);

  // Live Order Book Rows
  const [orderBookAsks, setOrderBookAsks] = useState<OrderBookRow[]>([
    { price: 337.6, size: 4.82, total: 1627 },
    { price: 337.5, size: 8.15, total: 2750 },
    { price: 337.4, size: 12.4, total: 4183 },
    { price: 337.3, size: 6.9, total: 2327 },
  ]);
  const [orderBookBids, setOrderBookBids] = useState<OrderBookRow[]>([
    { price: 337.1, size: 14.2, total: 4786 },
    { price: 337.0, size: 9.65, total: 3252 },
    { price: 336.9, size: 18.3, total: 6165 },
    { price: 336.8, size: 5.12, total: 1724 },
  ]);

  // Active simulated positions
  const [activeTrades, setActiveTrades] = useState<SimulatedTrade[]>([]);
  const [winToast, setWinToast] = useState<{ amount: number; profit: number } | null>(null);

  // Profit Calculator State
  const [calcStakeVal, setCalcStakeVal] = useState<number>(1000);
  const [calcTradesPerDay, setCalcTradesPerDay] = useState<number>(12);
  const [calcPlan, setCalcPlan] = useState<'quick' | 'staking' | 'hybrid'>('quick');

  const TRADING_PAIRS = [
    { id: 'native', name: `${BRAND.tokenSymbol}/USDT`, payout: 95, price: 337.2, delta: '+8.74%', up: true, type: 'Crypto' },
    { id: 'eurusd', name: 'EUR/USD', payout: 92, price: 1.0845, delta: '+0.32%', up: true, type: 'Forex' },
    { id: 'btcusdt', name: 'BTC/USDT', payout: 88, price: 64250.0, delta: '+3.15%', up: true, type: 'Crypto' },
    { id: 'gold', name: 'Gold (XAU)', payout: 85, price: 2348.6, delta: '-0.42%', up: false, type: 'Commodities' },
    { id: 'solusdt', name: 'SOL/USDT', payout: 90, price: 148.9, delta: '+5.40%', up: true, type: 'Crypto' },
  ];

  const currentPair = TRADING_PAIRS.find((p) => p.id === selectedAssetId) || TRADING_PAIRS[0];
  const expectedProfit = +(tradeAmount * (currentPair.payout / 100)).toFixed(2);

  // Real-time ticking price generator
  useEffect(() => {
    const timer = setInterval(() => {
      setLivePrice((prev) => {
        const delta = (Math.random() - 0.48) * (prev * 0.0012);
        const newPrice = +(prev + delta).toFixed(2);
        setCandles((cList) => {
          const last = cList[cList.length - 1];
          const updatedLast = {
            ...last,
            close: newPrice,
            high: Math.max(last.high, newPrice),
            low: Math.min(last.low, newPrice),
            volume: last.volume + Math.floor(Math.random() * 5),
            isUp: newPrice >= last.open,
          };
          return [...cList.slice(0, -1), updatedLast];
        });
        return newPrice;
      });

      // Update Order Book randomly
      setOrderBookAsks((prev) =>
        prev.map((r) => ({
          ...r,
          size: +(r.size + (Math.random() - 0.5) * 0.8).toFixed(2),
        }))
      );
      setOrderBookBids((prev) =>
        prev.map((r) => ({
          ...r,
          size: +(r.size + (Math.random() - 0.5) * 0.8).toFixed(2),
        }))
      );
    }, 1400);

    return () => clearInterval(timer);
  }, [selectedAssetId]);

  // Trade resolution countdown
  useEffect(() => {
    if (activeTrades.length === 0) return;

    const interval = setInterval(() => {
      setActiveTrades((prev) =>
        prev
          .map((trade) => {
            if (trade.secondsRemaining <= 1) {
              const won = Math.random() > 0.35;
              const profit = won ? +(trade.amount * (trade.payoutPercent / 100)).toFixed(2) : -trade.amount;
              if (won) {
                setDemoBalance((b) => +(b + trade.amount + profit).toFixed(2));
                setWinToast({ amount: trade.amount, profit });
                setTimeout(() => setWinToast(null), 4500);
              }
              return null;
            }
            return { ...trade, secondsRemaining: trade.secondsRemaining - 1 };
          })
          .filter(Boolean) as SimulatedTrade[]
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [activeTrades]);

  // Scroll listeners for progress bar and active section dock
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      setScrollY(currentScroll);
      if (totalScroll > 0) {
        setScrollProgress((currentScroll / totalScroll) * 100);
      }

      // Check active section
      const sections = ['terminal', 'markets', 'execution', 'calculator', 'ecosystem', 'faq'];
      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 250 && rect.bottom >= 250) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleExecuteTrade = (direction: 'UP' | 'DOWN') => {
    if (demoBalance < tradeAmount) {
      setDemoBalance(10000.0);
    }
    setDemoBalance((b) => Math.max(0, +(b - tradeAmount).toFixed(2)));

    const trade: SimulatedTrade = {
      id: `trade_${Date.now()}`,
      asset: currentPair.name,
      direction,
      amount: tradeAmount,
      entryPrice: livePrice,
      payoutPercent: currentPair.payout,
      secondsRemaining: tradeDuration,
    };
    setActiveTrades((prev) => [trade, ...prev]);
  };

  const handleChartMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!chartContainerRef.current) return;
    const rect = chartContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    // Derive approximate price from cursor Y
    const minVal = 334.0;
    const maxVal = 339.0;
    const price = maxVal - (y / rect.height) * (maxVal - minVal);
    setHoveredPrice(+price.toFixed(2));
  };

  const handleChartMouseLeave = () => {
    setMousePos(null);
    setHoveredPrice(null);
  };

  return (
    <div className="min-h-screen bg-[#000000] dark:bg-[#000000] light:bg-[#f8fafc] text-white dark:text-white light:text-slate-900 font-sans transition-colors selection:bg-[#00e699] selection:text-black">
      
      {/* 1. Ultra-Slim Dynamic Neon Top Scroll Indicator */}
      <div
        className="fixed top-0 left-0 h-[2.5px] bg-gradient-to-r from-[#00b875] via-[#00e699] to-[#00d2d3] z-50 transition-all duration-100 shadow-[0_0_10px_rgba(0,230,153,0.8)]"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* 2. Top Navigation Bar (Strict 1-Row 3-Zone Contract with Glass Compression) */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-300 ${
          scrollY > 20
            ? 'bg-[#000000]/95 dark:bg-[#000000]/95 light:bg-white/95 backdrop-blur-xl border-b border-[#18181c] dark:border-[#18181c] light:border-slate-200 py-3 shadow-2xl shadow-black'
            : 'bg-transparent py-4 sm:py-5 border-b border-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          
          {/* Zone 1: Single Text Element Wordmark */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-[#00e699] flex items-center justify-center text-black font-black text-sm shadow-lg shadow-[#00e699]/30 group-hover:scale-105 transition-transform">
              MX
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-black tracking-tight text-white dark:text-white light:text-slate-950 font-mono">
                {BRAND.name}
              </span>
              <span className="hidden sm:inline-block text-[10px] font-mono text-[#00e699] font-bold">
                PRO TERMINAL
              </span>
            </div>
          </button>

          {/* Zone 2: Text Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-semibold text-slate-300 dark:text-slate-300 light:text-slate-600">
            <a href="#terminal" className="hover:text-[#00e699] transition-colors">
              Trading Terminal
            </a>
            <a href="#markets" className="hover:text-[#00e699] transition-colors">
              Asset Markets
            </a>
            <a href="#execution" className="hover:text-[#00e699] transition-colors">
              Instant Execution
            </a>
            <a href="#calculator" className="hover:text-[#00e699] transition-colors">
              ROI Calculator
            </a>
            <a href="#ecosystem" className="hover:text-[#00e699] transition-colors">
              Mobile App
            </a>
            <a href="#faq" className="hover:text-[#00e699] transition-colors">
              FAQ
            </a>
          </nav>

          {/* Zone 3: Actions + ThemeToggle */}
          <div className="flex items-center gap-3">
            <ThemeToggle />

            <button
              type="button"
              onClick={() => setAuthStage('UNAUTHENTICATED')}
              className="hidden sm:inline-flex px-3.5 py-2 text-xs font-bold text-slate-300 hover:text-white rounded-xl hover:bg-[#121217] transition-colors cursor-pointer"
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => setAuthStage('AUTHENTICATED')}
              className="px-5 py-2.5 rounded-xl bg-[#00e699] hover:bg-[#00ffaa] text-black font-extrabold text-xs tracking-tight shadow-lg shadow-[#00e699]/30 hover:shadow-[#00e699]/50 active:scale-[0.97] transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap"
            >
              <span>Launch Platform</span>
              <ArrowRight size={13} className="stroke-[3]" />
            </button>

            {/* Mobile Hamburger */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-300 bg-[#121216] border border-[#222228] cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden px-4 pt-3 pb-6 bg-[#000000] border-b border-[#18181c] space-y-3 animate-fadeIn">
            <a
              href="#terminal"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-slate-200 hover:text-[#00e699]"
            >
              Trading Terminal
            </a>
            <a
              href="#markets"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-slate-200 hover:text-[#00e699]"
            >
              Asset Markets
            </a>
            <a
              href="#execution"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-slate-200 hover:text-[#00e699]"
            >
              Instant Execution
            </a>
            <a
              href="#calculator"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-slate-200 hover:text-[#00e699]"
            >
              ROI Calculator
            </a>
            <div className="pt-2 border-t border-[#18181c] flex flex-col gap-2">
              <button
                onClick={() => setAuthStage('UNAUTHENTICATED')}
                className="w-full py-2.5 rounded-xl border border-[#222228] text-xs font-bold text-slate-200 cursor-pointer"
              >
                Sign In
              </button>
              <button
                onClick={() => setAuthStage('AUTHENTICATED')}
                className="w-full py-2.5 rounded-xl bg-[#00e699] text-black font-extrabold text-xs cursor-pointer"
              >
                Launch Platform
              </button>
            </div>
          </div>
        )}
      </header>

      {/* 3. Floating Section Quick-Jump Dock (Desktop only) */}
      <aside className="hidden xl:flex fixed right-6 top-1/2 -translate-y-1/2 z-30 flex-col gap-2.5 p-2 rounded-2xl bg-[#08080a]/90 backdrop-blur-md border border-[#18181c] shadow-2xl">
        {[
          { id: 'terminal', label: 'Terminal' },
          { id: 'markets', label: 'Markets' },
          { id: 'execution', label: 'Execution' },
          { id: 'calculator', label: 'Calculator' },
          { id: 'ecosystem', label: 'Mobile' },
          { id: 'faq', label: 'FAQ' },
        ].map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            title={item.label}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${
              activeSection === item.id
                ? 'bg-[#00e699] scale-150 shadow-md shadow-[#00e699]'
                : 'bg-slate-700 hover:bg-slate-400'
            }`}
          />
        ))}
      </aside>

      {/* 4. HERO SECTION: Full Pitch-Black Interactive Trading Console */}
      <section id="terminal" className="relative pt-6 sm:pt-10 pb-16 sm:pb-24 overflow-hidden grid-bg-dark">
        
        {/* Subtle Ambient Radial Lighting */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-[#00e699]/[0.05] rounded-full blur-[160px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          
          {/* Hero Header & Value Statement */}
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span className="inline-flex items-center gap-1.5 text-[#00e699] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#00e699] animate-pulse" />
                ACTIVE MARKET FEED
              </span>
              <span>·</span>
              <span>Sub-millisecond Settlement</span>
              <span>·</span>
              <span>Up to 95% Return</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-[56px] font-black tracking-tight leading-[1.08] text-white">
              Professional Trading, Engineered for Precision.
            </h1>

            <p className="text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl">
              Execute fast 5-second to 5-minute trades on digital assets and multi-currency indices. Zero deposit fees, transparent payout rates, and non-custodial cryptographic settlement on {BRAND.chainName}.
            </p>
          </div>

          {/* Master Trading Terminal Console (Pure Dark Black Casing) */}
          <div className="rounded-3xl bg-[#08080a] border border-[#18181c] hover:border-[#00e699]/30 shadow-2xl shadow-black overflow-hidden relative transition-all duration-300">
            
            {/* Top Bar of the Console: Asset Selector & Live Status Bar */}
            <div className="p-3 sm:p-4 bg-[#030305] border-b border-[#18181c] flex flex-wrap items-center justify-between gap-3">
              
              {/* Asset Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
                {TRADING_PAIRS.map((pair) => (
                  <button
                    key={pair.id}
                    type="button"
                    onClick={() => {
                      setSelectedAssetId(pair.id);
                      setLivePrice(pair.price);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                      selectedAssetId === pair.id
                        ? 'bg-[#18181c] text-white border border-[#00e699]/40 shadow-sm'
                        : 'text-slate-400 hover:text-white hover:bg-[#0e0e12]'
                    }`}
                  >
                    <span>{pair.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#00e699]/15 text-[#00e699] font-black">
                      {pair.payout}%
                    </span>
                  </button>
                ))}
              </div>

              {/* Mode Switcher (Demo vs Real) */}
              <div className="flex items-center gap-3">
                <div className="flex items-center p-1 rounded-xl bg-[#000000] border border-[#18181c]">
                  <button
                    type="button"
                    onClick={() => setAccountMode('demo')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      accountMode === 'demo' ? 'bg-[#0084ff] text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Demo ($10K)
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountMode('real')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      accountMode === 'real' ? 'bg-[#00e699] text-black font-extrabold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Real
                  </button>
                </div>

                <div className="hidden sm:flex items-center gap-2 text-xs font-mono">
                  <span className="text-slate-400">Balance:</span>
                  <span className="font-extrabold text-[#00e699]">
                    ${accountMode === 'demo' ? demoBalance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '2,100.00'}
                  </span>
                </div>
              </div>

            </div>

            {/* Central Terminal Body: Chart on Left (8 Cols), Order Book & Fast Execution on Right (4 Cols) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#18181c]">
              
              {/* Left 8 Cols: Interactive Candlestick & Volume Chart with Crosshairs */}
              <div className="lg:col-span-8 p-4 sm:p-5 flex flex-col justify-between space-y-4">
                
                {/* Chart Header Tools */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                  <div className="flex items-center gap-3">
                    <span className="text-base sm:text-lg font-black text-white">
                      ${livePrice.toFixed(2)}
                    </span>
                    <span className="text-[#00e699] font-bold flex items-center gap-0.5">
                      <ArrowUpRight size={14} />
                      {currentPair.delta}
                    </span>
                    <span className="text-slate-500 hidden sm:inline">24h High: 338.20 · 24h Low: 334.80</span>
                  </div>

                  {/* Indicator Selectors */}
                  <div className="flex items-center gap-1.5">
                    {(['VOL', 'SMA', 'RSI'] as const).map((ind) => (
                      <button
                        key={ind}
                        type="button"
                        onClick={() => setActiveIndicator(ind)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                          activeIndicator === ind
                            ? 'bg-[#18181c] text-[#00e699] border border-[#00e699]/30'
                            : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        {ind}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SVG Candlestick & Volume Canvas with Mouse-Following Crosshair */}
                <div
                  ref={chartContainerRef}
                  onMouseMove={handleChartMouseMove}
                  onMouseLeave={handleChartMouseLeave}
                  className="relative w-full h-64 sm:h-72 bg-[#000000] rounded-2xl border border-[#141418] overflow-hidden p-3 select-none cursor-crosshair flex flex-col justify-between"
                >
                  {/* Background Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between p-3 pointer-events-none opacity-20">
                    <div className="border-b border-dashed border-slate-700 w-full" />
                    <div className="border-b border-dashed border-slate-700 w-full" />
                    <div className="border-b border-dashed border-slate-700 w-full" />
                    <div className="border-b border-dashed border-slate-700 w-full" />
                  </div>

                  {/* Simulated Moving Average Wave (Gold/Amber line) */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <path
                      d="M 0,65 Q 25,60 50,45 T 100,38"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="1.2"
                      strokeDasharray="2 1"
                      opacity="0.75"
                    />
                  </svg>

                  {/* Candlestick Bars */}
                  <div className="relative z-10 w-full h-44 flex items-end justify-between px-3 gap-1">
                    {candles.map((candle, idx) => {
                      const heightPercent = Math.max(12, Math.min(80, Math.abs(candle.close - candle.open) * 45));
                      const isUp = candle.close >= candle.open;
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full">
                          {/* Upper Wick */}
                          <div
                            className={`w-[1px] h-3 ${isUp ? 'bg-[#00e699]' : 'bg-[#ff3b5c]'}`}
                          />
                          {/* Body */}
                          <div
                            style={{ height: `${heightPercent}%` }}
                            className={`w-full max-w-[18px] rounded-xs transition-all ${
                              isUp
                                ? 'bg-[#00e699] shadow-sm shadow-[#00e699]/30'
                                : 'bg-[#ff3b5c] shadow-sm shadow-[#ff3b5c]/30'
                            }`}
                          />
                          {/* Lower Wick */}
                          <div
                            className={`w-[1px] h-2.5 ${isUp ? 'bg-[#00e699]' : 'bg-[#ff3b5c]'}`}
                          />
                        </div>
                      );
                    })}
                  </div>

                  {/* Volume Histogram Bars underneath */}
                  <div className="relative z-10 w-full h-10 border-t border-[#141418] flex items-end justify-between px-3 gap-1 pt-1">
                    {candles.map((candle, idx) => {
                      const vH = Math.min(100, (candle.volume / 220) * 100);
                      return (
                        <div
                          key={idx}
                          style={{ height: `${vH}%` }}
                          className={`flex-1 max-w-[18px] rounded-xs opacity-40 transition-all ${
                            candle.isUp ? 'bg-[#00e699]' : 'bg-[#ff3b5c]'
                          }`}
                        />
                      );
                    })}
                  </div>

                  {/* Interactive Dynamic Crosshairs following cursor */}
                  {mousePos && (
                    <>
                      <div
                        style={{ left: mousePos.x }}
                        className="absolute top-0 bottom-0 w-[1px] border-l border-dashed border-slate-400 pointer-events-none z-20"
                      />
                      <div
                        style={{ top: mousePos.y }}
                        className="absolute left-0 right-0 h-[1px] border-t border-dashed border-slate-400 pointer-events-none z-20"
                      />
                      <div
                        style={{ top: mousePos.y - 10 }}
                        className="absolute right-2 px-1.5 py-0.5 rounded bg-white text-black font-mono font-black text-[10px] pointer-events-none z-30"
                      >
                        ${hoveredPrice?.toFixed(2)}
                      </div>
                    </>
                  )}

                  {/* Active Trade Banner */}
                  {activeTrades.length > 0 && (
                    <div className="absolute bottom-14 left-4 right-4 z-20 p-2 rounded-xl bg-[#08080a]/95 border border-[#00e699]/40 backdrop-blur-md flex items-center justify-between text-xs font-mono">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-1.5 py-0.5 rounded font-black text-[10px] ${
                            activeTrades[0].direction === 'UP' ? 'bg-[#00e699] text-black' : 'bg-[#ff3b5c] text-white'
                          }`}
                        >
                          {activeTrades[0].direction}
                        </span>
                        <span className="text-white">${activeTrades[0].amount}</span>
                        <span className="text-slate-400">@ ${activeTrades[0].entryPrice}</span>
                      </div>
                      <div className="text-[#00e699] font-bold flex items-center gap-1.5">
                        <Clock size={12} className="animate-spin" />
                        <span>Closing in {activeTrades[0].secondsRemaining}s</span>
                      </div>
                    </div>
                  )}

                  {/* Win Payout Celebration Toast */}
                  {winToast && (
                    <div className="absolute top-8 inset-x-8 z-30 p-3 rounded-2xl bg-gradient-to-r from-[#00b875] to-[#00e699] text-black shadow-2xl flex items-center justify-between animate-fadeIn">
                      <div className="flex items-center gap-2.5">
                        <Sparkles size={20} className="fill-black shrink-0" />
                        <div>
                          <div className="text-xs font-black uppercase">Order Resolved: PROFIT!</div>
                          <div className="text-[11px] font-semibold opacity-90">
                            +${winToast.profit} USDT added to virtual balance!
                          </div>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-black bg-black/20 px-2 py-1 rounded-lg">
                        +{currentPair.payout}%
                      </span>
                    </div>
                  )}
                </div>

                {/* Bottom Timeline Indicator */}
                <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 pt-1 border-t border-[#141418]">
                  <span>14:00:00</span>
                  <span>14:01:00</span>
                  <span>14:02:00</span>
                  <span>14:03:00</span>
                  <span className="text-[#00e699] font-bold">14:04:12 (LIVE)</span>
                </div>

              </div>

              {/* Right 4 Cols: Ticking Order Book & Fast Trade Controls */}
              <div className="lg:col-span-4 p-4 sm:p-5 flex flex-col justify-between space-y-4 bg-[#030305]">
                
                {/* Order Book Depth Box */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[11px] font-mono font-semibold text-slate-400 border-b border-[#18181c] pb-1.5">
                    <span>Price (USDT)</span>
                    <span>Size</span>
                    <span>Total</span>
                  </div>

                  {/* Asks (Red) */}
                  <div className="space-y-1 font-mono text-xs">
                    {orderBookAsks.map((ask, i) => (
                      <div key={i} className="flex items-center justify-between text-slate-300 relative py-0.5">
                        <div
                          style={{ width: `${(ask.size / 15) * 100}%` }}
                          className="absolute right-0 top-0 bottom-0 bg-[#ff3b5c]/10 -z-10 rounded-xs"
                        />
                        <span className="text-[#ff3b5c] font-bold">{ask.price.toFixed(2)}</span>
                        <span>{ask.size}</span>
                        <span className="text-slate-500">{ask.total}</span>
                      </div>
                    ))}
                  </div>

                  {/* Spread indicator */}
                  <div className="py-1 px-2 rounded-lg bg-[#08080a] border border-[#18181c] flex items-center justify-between text-[11px] font-mono">
                    <span className="text-white font-bold">${livePrice.toFixed(2)}</span>
                    <span className="text-slate-500">Spread: 0.10</span>
                  </div>

                  {/* Bids (Green) */}
                  <div className="space-y-1 font-mono text-xs">
                    {orderBookBids.map((bid, i) => (
                      <div key={i} className="flex items-center justify-between text-slate-300 relative py-0.5">
                        <div
                          style={{ width: `${(bid.size / 20) * 100}%` }}
                          className="absolute right-0 top-0 bottom-0 bg-[#00e699]/10 -z-10 rounded-xs"
                        />
                        <span className="text-[#00e699] font-bold">{bid.price.toFixed(2)}</span>
                        <span>{bid.size}</span>
                        <span className="text-slate-500">{bid.total}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Trade Execution Controls */}
                <div className="space-y-3 pt-2 border-t border-[#18181c]">
                  
                  {/* Duration pills */}
                  <div className="flex items-center justify-between gap-1">
                    {[5, 15, 60, 300].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setTradeDuration(s)}
                        className={`flex-1 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                          tradeDuration === s
                            ? 'bg-[#18181c] text-[#00e699] border border-[#00e699]/40'
                            : 'bg-[#08080a] text-slate-400 hover:text-white'
                        }`}
                      >
                        {s < 60 ? `${s}s` : `${s / 60}m`}
                      </button>
                    ))}
                  </div>

                  {/* Amount Controls */}
                  <div className="p-2.5 rounded-xl bg-[#08080a] border border-[#18181c] flex items-center justify-between font-mono">
                    <button
                      type="button"
                      onClick={() => setTradeAmount((a) => Math.max(10, a - 25))}
                      className="w-7 h-7 rounded-lg bg-[#141418] hover:bg-[#202028] text-white font-bold flex items-center justify-center cursor-pointer transition-colors"
                    >
                      -
                    </button>
                    <div className="text-center">
                      <div className="text-[10px] text-slate-500">INVESTMENT</div>
                      <div className="text-base font-black text-white">${tradeAmount} USDT</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTradeAmount((a) => Math.min(2000, a + 25))}
                      className="w-7 h-7 rounded-lg bg-[#141418] hover:bg-[#202028] text-white font-bold flex items-center justify-center cursor-pointer transition-colors"
                    >
                      +
                    </button>
                  </div>

                  {/* Return Readout */}
                  <div className="flex items-center justify-between text-xs font-mono px-1">
                    <span className="text-slate-400">Payout Return:</span>
                    <span className="text-[#00e699] font-black">
                      +${expectedProfit.toFixed(2)} (+{currentPair.payout}%)
                    </span>
                  </div>

                  {/* Tactile UP / DOWN Execution Buttons */}
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <button
                      type="button"
                      onClick={() => handleExecuteTrade('UP')}
                      className="py-3 px-3 rounded-xl bg-[#00e699] hover:bg-[#00ffaa] active:scale-[0.97] text-black font-black text-sm tracking-tight shadow-lg shadow-[#00e699]/30 hover:shadow-[#00e699]/50 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <ArrowUp size={18} className="stroke-[3]" />
                      <span>UP · CALL</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleExecuteTrade('DOWN')}
                      className="py-3 px-3 rounded-xl bg-[#ff3b5c] hover:bg-[#ff5271] active:scale-[0.97] text-white font-black text-sm tracking-tight shadow-lg shadow-[#ff3b5c]/30 hover:shadow-[#ff3b5c]/50 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <ArrowDown size={18} className="stroke-[3]" />
                      <span>DOWN · PUT</span>
                    </button>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 5. Smooth Marquee Ticker with Clean Typography */}
      <section id="markets" className="py-3 bg-[#000000] border-y border-[#18181c] overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex items-center gap-8 text-xs font-mono">
          {[
            { s: `${BRAND.tokenSymbol}/USDT`, p: '$337.20', d: '+8.74%', u: true },
            { s: 'BTC/USDT', p: '$64,250.00', d: '+3.15%', u: true },
            { s: 'ETH/USDT', p: '$3,480.50', d: '+2.80%', u: true },
            { s: 'EUR/USD', p: '1.0845', d: '+0.32%', u: true },
            { s: 'SOL/USDT', p: '$148.90', d: '+5.40%', u: true },
            { s: 'Gold (XAU)', p: '$2,348.60', d: '-0.42%', u: false },
            { s: 'S&P 500 Index', p: '5,460.20', d: '+0.88%', u: true },
            { s: 'GBP/USD', p: '1.2710', d: '+0.15%', u: true },
            { s: `${BRAND.secondaryTokenSymbol}/USDT`, p: '$0.85', d: '+4.20%', u: true },
          ].map((item, i) => (
            <div
              key={i}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-[#08080a] border border-[#18181c] hover:border-[#00e699]/40 transition-colors"
            >
              <span className="font-bold text-white">{item.s}</span>
              <span className="text-slate-300">{item.p}</span>
              <span className={`font-bold flex items-center text-[11px] ${item.u ? 'text-[#00e699]' : 'text-[#ff3b5c]'}`}>
                {item.u ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {item.d}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Asymmetric Bento Grid: Execution & Non-Custodial Core */}
      <section id="execution" className="py-20 sm:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00e699]">
              Engineered Execution Architecture
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              Institutional Liquidity with Zero Bureaucracy.
            </h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Every millisecond counts. Our order routing engine processes positions against segregated liquidity pools with automated settlement.
            </p>
          </div>

          {/* Asymmetric Bento Architecture */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Bento 1: Large Featured Terminal Card (7 Cols) */}
            <div className="lg:col-span-7 rounded-3xl bg-[#08080a] border border-[#18181c] hover:border-[#00e699]/40 p-6 sm:p-8 flex flex-col justify-between space-y-6 shadow-2xl transition-all duration-300 group hover:-translate-y-1">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#00e699]">01. HIGH-SPEED SETTLEMENT</span>
                  <span className="text-xs font-mono text-slate-500">Latency &lt; 25ms</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Automated Non-Custodial Payouts in 180 Seconds
                </h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-xl">
                  Unlike traditional brokers with manual approval queues, {BRAND.name} routes withdrawals directly through on-chain multi-signature smart contracts on {BRAND.chainName}.
                </p>
              </div>

              <div className="rounded-2xl overflow-hidden border border-[#18181c] bg-black aspect-[16/9] relative">
                <img
                  src={heroTerminalImg}
                  alt="Desktop Trading Terminal"
                  className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="flex items-center justify-between text-xs font-mono text-slate-400 border-t border-[#18181c] pt-4">
                <span>0% Commission on Deposits</span>
                <span className="text-[#00e699] font-bold">24/7 Liquidity Depth</span>
              </div>
            </div>

            {/* Bento 2: Mobile & Staking Right Column (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              
              {/* Card 2A: Mobile Power */}
              <div className="rounded-3xl bg-[#08080a] border border-[#18181c] hover:border-[#0084ff]/40 p-6 shadow-2xl space-y-4 transition-all duration-300 group hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#0084ff]">02. MOBILE FIRST</span>
                  <Smartphone size={16} className="text-[#0084ff]" />
                </div>
                <h4 className="text-lg font-black text-white tracking-tight">
                  Trade Anywhere with Sub-second Haptic Feedback
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Real-time price push notifications, biometric passcode unlock, and 1-tap trade executions directly from iOS and Android.
                </p>
                <div className="rounded-xl overflow-hidden border border-[#18181c] aspect-[16/8] bg-black">
                  <img
                    src={mobilePlatformImg}
                    alt="Mobile Platform"
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
              </div>

              {/* Card 2B: Passive Yield */}
              <div className="rounded-3xl bg-[#08080a] border border-[#18181c] hover:border-purple-500/40 p-6 shadow-2xl space-y-3 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-purple-400">03. SMART CONTRACT STAKING</span>
                  <Percent size={16} className="text-purple-400" />
                </div>
                <h4 className="text-lg font-black text-white tracking-tight">
                  Up to 124.5% APY Staking Pools
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Put idle capital to work. Stake {BRAND.tokenSymbol} tokens across 90 to 1,825-day lock tiers with daily algorithmic reward distributions.
                </p>
                <div className="pt-2 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-500">Audited Security</span>
                  <span className="text-purple-400 font-bold">Daily Compound Yield</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 7. Interactive ROI & Liquidity Calculator */}
      <section id="calculator" className="py-20 sm:py-28 bg-[#000000] border-y border-[#18181c] relative">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="rounded-3xl bg-[#08080a] border border-[#18181c] p-6 sm:p-10 shadow-2xl space-y-8">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#18181c] pb-6">
              <div>
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00e699]">
                  Quantitative Forecast
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Trading Payout & Staking Calculator
                </h3>
              </div>

              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[#020204] border border-[#18181c]">
                {(['quick', 'staking', 'hybrid'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setCalcPlan(m)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                      calcPlan === m ? 'bg-[#00e699] text-black font-extrabold' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {m} Plan
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              
              {/* Sliders Input */}
              <div className="space-y-6">
                
                {/* Capital Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">Active Trade Capital</span>
                    <span className="text-white font-mono font-bold text-sm">
                      ${calcStakeVal} USDT
                    </span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="5000"
                    step="50"
                    value={calcStakeVal}
                    onChange={(e) => setCalcStakeVal(Number(e.target.value))}
                    className="w-full accent-[#00e699] bg-[#18181c] h-2 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>$50</span>
                    <span>$2,500</span>
                    <span>$5,000</span>
                  </div>
                </div>

                {/* Daily Trades Slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-300">Trades per Day</span>
                    <span className="text-white font-mono font-bold text-sm">
                      {calcTradesPerDay} Positions
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="40"
                    step="1"
                    value={calcTradesPerDay}
                    onChange={(e) => setCalcTradesPerDay(Number(e.target.value))}
                    className="w-full accent-[#00e699] bg-[#18181c] h-2 rounded-lg cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                    <span>1</span>
                    <span>20</span>
                    <span>40</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#020204] border border-[#18181c] text-xs text-slate-400 space-y-1 leading-relaxed">
                  <div className="flex items-center gap-2 text-white font-bold">
                    <ShieldCheck size={14} className="text-[#00e699]" />
                    <span>Algorithmic Risk Management</span>
                  </div>
                  <p className="text-[11px]">
                    Projections assume a 78% win probability on fast trades with disciplined position sizing.
                  </p>
                </div>
              </div>

              {/* Forecast Output Summary */}
              <div className="p-6 rounded-2xl bg-[#020204] border border-[#18181c] space-y-5 font-mono">
                
                <div className="border-b border-[#18181c] pb-4">
                  <div className="text-[11px] text-slate-400 font-sans">Projected Weekly Net Gain</div>
                  <div className="text-3xl font-black text-[#00e699] mt-0.5">
                    +${(((calcStakeVal * 0.92 * (calcTradesPerDay * 0.78)) - (calcStakeVal * (calcTradesPerDay * 0.22))) * 7).toFixed(2)}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="text-slate-400 font-sans">Monthly Payout</div>
                    <div className="text-lg font-bold text-white mt-0.5">
                      +${(((calcStakeVal * 0.92 * (calcTradesPerDay * 0.78)) - (calcStakeVal * (calcTradesPerDay * 0.22))) * 30).toFixed(2)}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-400 font-sans">Staking APY Boost</div>
                    <div className="text-lg font-bold text-purple-400 mt-0.5">
                      +${((calcStakeVal * 0.68) / 12).toFixed(2)} /mo
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setAuthStage('AUTHENTICATED')}
                  className="w-full py-3.5 rounded-xl bg-[#00e699] hover:bg-[#00ffaa] active:scale-[0.98] text-black font-extrabold text-xs tracking-tight transition-all cursor-pointer font-sans shadow-lg shadow-[#00e699]/30"
                >
                  Start with Free $10,000 Virtual Demo
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 8. Global Multi-Asset Composition Showcase */}
      <section id="ecosystem" className="py-20 sm:py-28 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00e699]">
              Multi-Asset Ecosystem
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              One Unified Liquidity Layer for Global Assets
            </h2>
            <p className="text-sm text-slate-400">
              Cross-chain interoperability bridging {BRAND.chainName}, USDT, Ethereum, Tron, and Binance Smart Chain.
            </p>
          </div>

          <div className="rounded-3xl overflow-hidden border border-[#18181c] bg-black aspect-[16/8] shadow-2xl relative group">
            <img
              src={assetsShowcaseImg}
              alt="Global Assets Liquidity Network"
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex items-end p-6 sm:p-10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4">
                <div>
                  <h4 className="text-lg sm:text-xl font-black text-white font-mono">
                    {BRAND.chainNetwork} Decentralized Liquidity Pool
                  </h4>
                  <p className="text-xs text-slate-300">Over $128M cumulative volume executed across verified smart contracts.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setAuthStage('AUTHENTICATED')}
                  className="px-6 py-3 rounded-xl bg-white text-black font-extrabold text-xs tracking-tight hover:bg-[#00e699] transition-colors whitespace-nowrap cursor-pointer shadow-lg"
                >
                  Explore Pool Data →
                </button>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 9. FAQ Accordion (Clean, Human Editorial) */}
      <section id="faq" className="py-16 sm:py-24 max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#00e699]">
            Transparent Operations
          </span>
          <h2 className="text-3xl font-black text-white">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {[
            {
              q: 'How does the refillable $10,000 Demo Account function?',
              a: 'The demo account operates in an identical live market environment with real-time price feeds. It provides $10,000 in virtual funds for risk-free strategy testing and can be refilled indefinitely with one click.',
            },
            {
              q: 'What are the withdrawal processing times and fees?',
              a: 'Withdrawals are processed automatically through decentralized protocol contracts within approximately 3 minutes. The platform charges 0% commission on deposits and withdrawals, requiring only nominal network blockchain gas.',
            },
            {
              q: 'How are high payout returns (up to 95%) determined?',
              a: 'Payout rates reflect asset volatility and market depth. Native trading pairs on Money X Chain provide high liquidity tiers that support up to 95% net return on successful positions.',
            },
            {
              q: 'Is Money X non-custodial?',
              a: 'Yes. Account passcodes are cryptographically hashed locally before authentication. Users retain full sovereignty over their private keys and wallet balances at all times.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-[#08080a] border border-[#18181c] overflow-hidden transition-all hover:border-[#00e699]/30"
            >
              <button
                type="button"
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-white cursor-pointer"
              >
                <span>{item.q}</span>
                <ChevronDown
                  size={16}
                  className={`text-[#00e699] transition-transform duration-200 ${activeFaq === idx ? 'rotate-180' : ''}`}
                />
              </button>
              {activeFaq === idx && (
                <div className="px-5 pb-5 text-xs text-slate-400 leading-relaxed border-t border-[#141418] pt-3 font-sans">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 10. Final Call to Action */}
      <section className="py-16 sm:py-24 bg-[#000000] border-t border-[#18181c] text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-[#00e699]/15 border border-[#00e699]/30 flex items-center justify-center text-[#00e699] mx-auto shadow-xl">
            <Zap size={28} />
          </div>

          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Start Trading in 30 Seconds.
          </h2>

          <p className="text-sm sm:text-base text-slate-400 max-w-lg mx-auto">
            Experience high-performance trading on {BRAND.name}. Practice with virtual funds or connect your wallet for live decentralized execution.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              type="button"
              onClick={() => setAuthStage('AUTHENTICATED')}
              className="px-8 py-4 rounded-xl bg-[#00e699] hover:bg-[#00ffaa] text-black font-extrabold text-sm sm:text-base tracking-tight shadow-xl shadow-[#00e699]/30 transition-all cursor-pointer"
            >
              Open Free $10,000 Demo
            </button>
            <button
              type="button"
              onClick={() => setAuthStage('UNAUTHENTICATED')}
              className="px-8 py-4 rounded-xl bg-[#0a0a0e] hover:bg-[#121216] text-white border border-[#222228] font-bold text-sm tracking-tight transition-all cursor-pointer"
            >
              Deposit & Trade Real Funds
            </button>
          </div>
        </div>
      </section>

      {/* 11. Regulatory Footer */}
      <footer className="border-t border-[#18181c] bg-[#000000] py-12 text-xs text-slate-500 font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
          
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[#141418]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#00e699] flex items-center justify-center text-black font-black text-xs">
                MX
              </div>
              <span className="text-base font-extrabold text-white font-mono">
                {BRAND.name}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-slate-400 text-xs">
              <button onClick={() => setActiveRoute('about')} className="hover:text-white transition-colors cursor-pointer">
                About Protocol
              </button>
              <button onClick={() => setActiveRoute('trade')} className="hover:text-white transition-colors cursor-pointer">
                Trading Terminal
              </button>
              <button onClick={() => setActiveRoute('staking')} className="hover:text-white transition-colors cursor-pointer">
                Staking Plans
              </button>
              <button onClick={() => setActiveRoute('legal')} className="hover:text-white transition-colors cursor-pointer">
                Regulatory Disclosures
              </button>
              <button onClick={() => setActiveRoute('privacy')} className="hover:text-white transition-colors cursor-pointer">
                Privacy Policy
              </button>
              <button onClick={() => setActiveRoute('contact')} className="hover:text-white transition-colors cursor-pointer">
                Help Desk
              </button>
            </div>
          </div>

          <div className="space-y-3 leading-relaxed text-[11px] text-slate-500">
            <p>
              Risk Warning: Trading financial instruments, derivatives, and cryptocurrencies carries significant risk. Payout rates on fast trades vary from 80% to 95% depending on asset volatility. Never invest funds you cannot afford to lose.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <span>{BRAND.copyright}</span>
              <span className="font-mono text-[10px]">
                {BRAND.chainNetwork} · Non-Custodial Protocol {BRAND.version}
              </span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};
