/*
 FILE: src/services/web3Wallet.ts

 PURPOSE:
 Real Web3 & MetaMask EIP-1193 wallet provider service with full Mobile Device support.
 Supports:
 1. Injected MetaMask provider (Desktop Chrome, Brave, Kiwi, etc.)
 2. In-App Web3 mobile browsers (MetaMask App, Trust Wallet, OKX, Bitget)
 3. Native Mobile Deep-Linking (launches MetaMask / Trust Wallet mobile apps)
 4. Direct Mobile Web3 Session Connection for mobile Chrome / Safari users
*/

export interface Web3AccountState {
  address: string | null;
  chainId: string | null;
  isConnected: boolean;
  isMetaMask: boolean;
  error?: string;
}

class Web3WalletService {
  private ethereum: any = null;

  constructor() {
    this.initProvider();
    if (typeof window !== 'undefined') {
      window.addEventListener('ethereum#initialized', () => {
        this.initProvider();
      });
    }
  }

  public isMobile(): boolean {
    if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  public initProvider() {
    if (typeof window === 'undefined') return null;

    let injected: any = (window as any).ethereum;
    let provider: any = null;

    // Only select a provider explicitly identifying itself as MetaMask.
    // Never silently connect a different wallet and label it MetaMask.
    if (injected?.providers && Array.isArray(injected.providers)) {
      provider = injected.providers.find((candidate: any) => candidate?.isMetaMask) || null;
    } else if (injected?.isMetaMask) {
      provider = injected;
    }

    // Some browser wallet integrations expose MetaMask directly under this key.
    if (!provider && (window as any).metamask?.isMetaMask) {
      provider = (window as any).metamask;
    }

    // Cross-frame discovery is allowed only for an explicitly identified MetaMask.
    if (!provider && typeof window.parent !== 'undefined' && window.parent !== window) {
      try {
        const parentEth = (window.parent as any).ethereum;
        if (parentEth?.providers && Array.isArray(parentEth.providers)) {
          provider = parentEth.providers.find((candidate: any) => candidate?.isMetaMask) || null;
        } else if (parentEth?.isMetaMask) {
          provider = parentEth;
        }
      } catch {
        // Cross-origin iframe security restrictions.
      }
    }

    this.ethereum = provider;
    return this.ethereum;
  }

  public getEthereumProvider() {
    return this.initProvider();
  }

  public isInIframe(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      return window.self !== window.top;
    } catch {
      return true;
    }
  }

  public isMetaMaskInstalled(): boolean {
    const provider = this.getEthereumProvider();
    return Boolean(provider && (provider.isMetaMask || provider.providers?.some((p: any) => p.isMetaMask)));
  }

  public isMetaMaskAvailable(): boolean {
    return this.isMetaMaskInstalled();
  }

  /**
   * Generates a MetaMask Mobile App deep link
   */
  public getMetaMaskDeepLink(): string {
    if (typeof window === 'undefined') return 'https://metamask.io/download/';
    const rawUrl = window.location.href.replace(/^https?:\/\//, '');
    return `https://metamask.app.link/dapp/${rawUrl}`;
  }

  /**
   * Generates a Trust Wallet Mobile App deep link
   */
  public getTrustWalletDeepLink(): string {
    if (typeof window === 'undefined') return 'https://trustwallet.com/download';
    return `https://link.trustwallet.com/open_url?coin_id=60&url=${encodeURIComponent(window.location.href)}`;
  }

  /**
   * Creates or retrieves a persistent mobile Web3 session wallet
   * for users browsing inside mobile Chrome/Safari where extensions cannot be installed.
   */
  public getOrCreateMobileSessionWallet(): string {
    // Real-wallet-only policy: never generate a wallet address in the browser.
    return '';
  }

  /**
   * Translates hex chainId to standard network name
   */
  public getNetworkName(chainId: string | null): string {
    if (!chainId) return 'Ethereum Mainnet';
    const lower = chainId.toLowerCase();
    switch (lower) {
      case '0x1':
      case '1':
        return 'Ethereum Mainnet';
      case '0x38':
      case '56':
        return 'BNB Smart Chain';
      case '0x89':
      case '137':
        return 'Polygon PoS';
      case '0xa4b1':
      case '42161':
        return 'Arbitrum One';
      case '0xa':
      case '10':
        return 'Optimism';
      case '0x2105':
      case '8453':
        return 'Base Network';
      case '0xaa36a7':
      case '11155111':
        return 'Sepolia Testnet';
      default:
        return `EVM Chain (${chainId})`;
    }
  }

  /**
   * Fetches real on-chain balance in Ether / Native token for an address
   */
  public async getRealBalance(address: string): Promise<string> {
    const provider = this.getEthereumProvider();
    if (provider && typeof provider.request === 'function') {
      try {
        const balanceHex: string = await provider.request({
          method: 'eth_getBalance',
          params: [address, 'latest'],
        });
        if (balanceHex) {
          const wei = BigInt(balanceHex);
          const eth = Number(wei) / 1e18;
          return eth.toFixed(4);
        }
      } catch (err) {
        console.warn('Could not read real on-chain balance:', err);
      }
    }
    // No provider balance was available; never substitute a fabricated balance.
    return '0.0000';
  }

  /**
   * Connects to REAL MetaMask EIP-1193 provider.
   * Prompts eth_requestAccounts directly with the user's real browser extension.
   */
  public async connectMetaMask(): Promise<{
    success: boolean;
    address?: string;
    chainId?: string;
    networkName?: string;
    balance?: string;
    isRealMetaMask: boolean;
    isMobile?: boolean;
    error?: string;
    message?: string;
  }> {
    const provider = this.getEthereumProvider();

    // 1. If MetaMask / Injected Web3 extension is present in browser:
    if (provider && typeof provider.request === 'function') {
      try {
        const accounts: string[] = await provider.request({
          method: 'eth_requestAccounts',
        });

        if (!accounts || accounts.length === 0) {
          return {
            success: false,
            isRealMetaMask: true,
            error: 'No accounts selected in MetaMask. Please select an account and approve.',
            message: 'No MetaMask account selected.',
          };
        }

        const address = accounts[0];
        let chainId = '0x1';
        try {
          chainId = await provider.request({ method: 'eth_chainId' });
        } catch (cErr) {
          console.warn('Could not read chainId from MetaMask', cErr);
        }

        const networkName = this.getNetworkName(chainId);
        const balance = await this.getRealBalance(address);

        return {
          success: true,
          address,
          chainId,
          networkName,
          balance,
          isRealMetaMask: true,
          message: `MetaMask Connected: ${address.slice(0, 6)}...${address.slice(-4)} (${networkName})`,
        };
      } catch (err: any) {
        console.error('MetaMask authorization error:', err);
        if (err.code === 4001) {
          return {
            success: false,
            isRealMetaMask: true,
            error: 'Connection rejected. Please approve the MetaMask connection request in your extension.',
            message: 'Connection rejected in MetaMask.',
          };
        }
        if (err.code === -32002) {
          return {
            success: false,
            isRealMetaMask: true,
            error: 'MetaMask is already open with a pending request. Please click the MetaMask extension icon to approve.',
            message: 'Request already pending in MetaMask.',
          };
        }
        return {
          success: false,
          isRealMetaMask: true,
          error: err.message || 'Failed to connect to MetaMask.',
          message: err.message || 'MetaMask connection failed.',
        };
      }
    }

    // 2. If provider is missing on mobile devices:
    if (this.isMobile()) {
      return {
        success: false,
        isRealMetaMask: false,
        isMobile: true,
        error: 'METAMASK_NOT_INSTALLED',
        message: 'No Web3 extension found in mobile browser. Tap to open directly in the MetaMask app.',
      };
    }

    // 3. Desktop browser without extension installed:
    return {
      success: false,
      isRealMetaMask: false,
      error: 'METAMASK_NOT_INSTALLED',
      message: 'MetaMask extension not detected in this browser. Please install MetaMask or scan QR with mobile app.',
    };
  }

  /** Return an already-authorized MetaMask account without opening a popup. */
  public async getConnectedAccount(): Promise<string | null> {
    const provider = this.getEthereumProvider();
    if (!provider || typeof provider.request !== 'function') return null;
    try {
      const accounts: string[] = await provider.request({ method: 'eth_accounts' });
      return Array.isArray(accounts) && accounts.length > 0 ? accounts[0] : null;
    } catch {
      return null;
    }
  }

  /**
   * Request user signature via real MetaMask
   */
  public async signMessage(
    address: string,
    message: string
  ): Promise<{ success: boolean; signature?: string; error?: string }> {
    const provider = this.getEthereumProvider();
    if (!provider || typeof provider.request !== 'function') {
      return {
        success: false,
        error: 'MetaMask provider is not available for signing.',
      };
    }

    try {
      const signature: string = await provider.request({
        method: 'personal_sign',
        params: [message, address],
      });
      return { success: true, signature };
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'User rejected signature request.',
      };
    }
  }

  /**
   * Listen for account changes
   */
  public onAccountsChanged(callback: (accounts: string[]) => void) {
    const provider = this.getEthereumProvider();
    if (provider && provider.on) {
      provider.on('accountsChanged', callback);
    }
  }

  /**
   * Listen for chain / network changes
   */
  public onChainChanged(callback: (chainId: string) => void) {
    const provider = this.getEthereumProvider();
    if (provider && provider.on) {
      provider.on('chainChanged', callback);
    }
  }
}

export const web3Wallet = new Web3WalletService();
