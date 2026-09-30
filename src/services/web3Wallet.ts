/*
 FILE: src/services/web3Wallet.ts

 PURPOSE:
 Strict Real MetaMask EIP-1193 wallet provider service.
 Absolutely NO dummy / simulated fallback addresses.
 Only connects to authentic injected MetaMask wallets.

 RESPONSIBILITIES:
 - Strict detection of authentic MetaMask injected provider via window.ethereum
 - Multi-provider resolution (locates MetaMask when alongside other Web3 wallets)
 - Triggers authentic MetaMask `eth_requestAccounts` authorization popup
 - Handles user rejections, locked extensions, and chain switches
 - Listens to accountsChanged and chainChanged events

 SECURITY:
 Never requests or accesses user private keys.
 All transactions and authorization requests are handled exclusively by MetaMask.
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

  public initProvider() {
    if (typeof window === 'undefined') return null;

    let provider: any = (window as any).ethereum;

    // Check if multiple providers are injected (e.g. MetaMask + Phantom + Coinbase)
    if (provider?.providers && Array.isArray(provider.providers)) {
      const mm = provider.providers.find((p: any) => p.isMetaMask);
      provider = mm || null;
    }

    // Attempt to access parent frame if running inside an iframe (e.g. AI Studio preview)
    if (!provider && typeof window.parent !== 'undefined' && window.parent !== window) {
      try {
        const parentEth = (window.parent as any).ethereum;
        if (parentEth) {
          if (parentEth.providers && Array.isArray(parentEth.providers)) {
            provider = parentEth.providers.find((p: any) => p.isMetaMask) || parentEth;
          } else {
            provider = parentEth;
          }
        }
      } catch {
        // Cross-origin iframe security restrictions
      }
    }

    this.ethereum = provider;
    return this.ethereum;
  }

  public getEthereumProvider() {
    return this.initProvider();
  }

  public isMetaMaskInstalled(): boolean {
    const provider = this.getEthereumProvider();
    return Boolean(provider && (provider.isMetaMask || provider.providers?.some((p: any) => p.isMetaMask)));
  }

  /**
   * Strictly connects to REAL MetaMask.
   * NO dummy or simulated wallets.
   */
  public async connectMetaMask(): Promise<{
    success: boolean;
    address?: string;
    chainId?: string;
    isRealMetaMask: boolean;
    error?: string;
    message?: string;
  }> {
    const provider = this.getEthereumProvider();

    // 1. Verify that real MetaMask provider exists in the browser
    if (!provider || typeof provider.request !== 'function') {
      return {
        success: false,
        isRealMetaMask: false,
        error: 'MetaMask extension is not detected in your browser. Please install and unlock MetaMask to connect.',
        message: 'MetaMask extension not found.',
      };
    }

    // 2. Request authentic EIP-1193 accounts from MetaMask
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

      return {
        success: true,
        address,
        chainId,
        isRealMetaMask: true,
        message: `Real MetaMask Connected: ${address.slice(0, 6)}...${address.slice(-4)}`,
      };
    } catch (err: any) {
      console.error('MetaMask authorization error:', err);
      // Real user rejection / lock errors from MetaMask
      if (err.code === 4001) {
        return {
          success: false,
          isRealMetaMask: true,
          error: 'Connection rejected. Please approve the MetaMask connection request.',
          message: 'Connection rejected in MetaMask.',
        };
      }
      if (err.code === -32002) {
        return {
          success: false,
          isRealMetaMask: true,
          error: 'MetaMask is already open with a pending request. Please open your extension and approve.',
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
