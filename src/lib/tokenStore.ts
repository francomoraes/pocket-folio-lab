let _token: string | null = null;
let _onLogout: (() => void) | null = null;

export const tokenStore = {
  get: () => _token,
  set: (token: string | null) => {
    _token = token;
  },
  clear: () => {
    _token = null;
  },
  setLogoutHandler: (handler: () => void) => {
    _onLogout = handler;
  },
  triggerLogout: () => {
    _onLogout?.();
  },
};
