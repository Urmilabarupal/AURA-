/*
 FILE: src/services/cookieService.ts

 PURPOSE:
 Production-Grade Frontend Cookie Management Service.
 Explains and implements how cookies are created, read, and maintained directly
 in frontend JavaScript/TypeScript using document.cookie.

 HOW BROWSER COOKIES WORK IN FRONTEND:
 1. Writing a cookie:
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${seconds}; SameSite=Lax; Secure`;
 2. Reading cookies:
    document.cookie returns a semicolon-delimited string of key=value pairs:
    "moneyx_wallet_address=0x12...; moneyx_auth_token=aura_sec_..."
 3. Removing a cookie:
    Setting max-age=0 immediately expires and deletes the cookie from the browser storage.
*/

export interface AuthSessionData {
  token: string;
  walletAddress: string;
  passcodeConfigured: boolean;
  userId: string;
}

export const cookieService = {
  /**
   * Sets a frontend browser cookie with secure defaults
   * @param name Name of the cookie
   * @param value Value to store
   * @param days Validity in days (default: 7 days)
   */
  set(name: string, value: string, days: number = 7): void {
    if (typeof document === 'undefined') return;

    const maxAge = days * 24 * 60 * 60; // seconds
    const isHttps = typeof window !== 'undefined' && window.location.protocol === 'https:';
    const secureFlag = isHttps ? '; Secure' : '';

    document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax${secureFlag}`;
  },

  /**
   * Reads a cookie value by name from document.cookie
   * @param name Cookie name
   * @returns decoded string value or null if not found
   */
  get(name: string): string | null {
    if (typeof document === 'undefined') return null;

    const encodedName = encodeURIComponent(name);
    const cookies = document.cookie.split(';');

    for (let c of cookies) {
      c = c.trim();
      if (c.startsWith(`${encodedName}=`)) {
        return decodeURIComponent(c.substring(encodedName.length + 1));
      }
    }
    return null;
  },

  /**
   * Deletes a cookie by name by setting max-age=0
   * @param name Cookie name
   */
  remove(name: string): void {
    if (typeof document === 'undefined') return;
    document.cookie = `${encodeURIComponent(name)}=; path=/; max-age=0; SameSite=Lax`;
  },

  /**
   * Stores complete authentication session cookies once user connects wallet,
   * sets passcode, and logs in.
   */
  saveAuthSession(session: AuthSessionData): void {
    this.set('moneyx_auth_token', session.token, 7);
    this.set('moneyx_wallet_address', session.walletAddress, 7);
    this.set('moneyx_passcode_configured', session.passcodeConfigured ? 'true' : 'false', 7);
    this.set('moneyx_user_id', session.userId, 7);
    this.set('moneyx_session_status', 'authenticated', 7);
  },

  /**
   * Retrieves active session cookies
   */
  getAuthSession(): {
    token: string | null;
    walletAddress: string | null;
    passcodeConfigured: boolean;
    userId: string | null;
    isAuthenticated: boolean;
  } {
    const token = this.get('moneyx_auth_token');
    const walletAddress = this.get('moneyx_wallet_address');
    const passcodeConfigured = this.get('moneyx_passcode_configured') === 'true';
    const userId = this.get('moneyx_user_id');
    const status = this.get('moneyx_session_status');

    return {
      token,
      walletAddress,
      passcodeConfigured,
      userId,
      isAuthenticated: Boolean(token && walletAddress && status === 'authenticated'),
    };
  },

  /**
   * Clears all session cookies on logout
   */
  clearAuthSession(): void {
    this.remove('moneyx_auth_token');
    this.remove('moneyx_wallet_address');
    this.remove('moneyx_passcode_configured');
    this.remove('moneyx_user_id');
    this.remove('moneyx_session_status');
  },
};
