/// <reference types="vite/client" />

interface Window {
  ethereum?: {
    isMetaMask?: true;
    isConnected: () => boolean;
    request: (...args: any[]) => Promise<any>;
    on: (event: string, callback: (...args: any[]) => void) => void;
    removeListener: (event: string, callback: (...args: any[]) => void) => void;
    removeAllListeners: () => void;
  };
}