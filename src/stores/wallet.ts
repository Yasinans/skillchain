import { defineStore } from "pinia";
import { ethers, BrowserProvider, JsonRpcSigner } from 'ethers';
import { getAuth, signOut } from "firebase/auth";
import {  markRaw } from 'vue';
import { useUserStore } from "./user";
import { useVerify } from "../composables/useVerify";
import { useDB } from "../composables/useDB";
import { TARGET_CHAIN_ID } from "../config";
interface WalletState {
    provider: BrowserProvider | null;
    signer: JsonRpcSigner | null;
    currentAccount: string;
    chainId: string | null;
    error: string | null;
    isConnected: boolean;
    isLoading: boolean;
}


export const useWalletStore = defineStore("wallet", {
    persist: true,
    state: (): WalletState => ({
        provider: null,
        signer: null,
        currentAccount: '',
        chainId: null,
        isConnected: false,
        isLoading: false,
        error: null,
    }),
    actions: {
        clearState() {
            this.currentAccount = '';
            this.chainId = null;
            this.provider = null;
            this.signer = null;
            this.isConnected = false;
            this.isLoading = false;
            this.error = null
        },
        //connect wallet
        async connect(isRegister = false) {
            this.isLoading = true;
            try {
                if (!window.ethereum) throw new Error('MetaMask is not installed');
                
                const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
                this.currentAccount = accounts[0];
                this.chainId = await (window as any).ethereum.request({ method: 'eth_chainId' });
                
                if (this.chainId !== TARGET_CHAIN_ID) {
                    await this.switchToTargetChain();
                    
                    const maxWaitTime = 30000; 
                    const startTime = Date.now();
                    
                    while (this.chainId !== TARGET_CHAIN_ID && Date.now() - startTime < maxWaitTime) {
                        await new Promise(resolve => setTimeout(resolve, 500));
                        this.chainId = await (window as any).ethereum.request({ method: 'eth_chainId' });
                    }
                    
                    if (this.chainId !== TARGET_CHAIN_ID) {
                        throw new Error('Failed to switch to the correct network. Please switch manually and try again.');
                    }
                }
                this.provider = await markRaw(new ethers.BrowserProvider(window.ethereum));
                this.signer = await markRaw(this.provider.getSigner());
                this.error = null;
                const token = await this.getAuthToken();
                
                if (!token) throw new Error('Authentication failed - please sign the message to continue');
                                this.isConnected = true;

                const idToken = await (await useDB()).signInWithWallet(token);
                const isIssuer = await (await useDB()).isIssuer(this.currentAccount);
                const isVerified = await (await useDB()).isIssuerVerified(this.currentAccount);
                useUserStore().setUser({
                    address: this.currentAccount,
                    name: '',
                    email: '',
                    isIssuer: isIssuer,
                    isVerified: isVerified,
                    isRegistered: false,
                    token: idToken || '',
                    credentials: []
                });

                const isRegistered = await useUserStore().checkRegistration();
                if (!isRegister) {
                    if (!isRegistered) {
                        this.disconnect();
                        throw new Error('Register');
                    } else {
                        await useUserStore().loadUserData();
                        await useUserStore().loadCredentials();
                    }
                }
                
                this.setupListeners();
            } catch (error: any) {
                this.error = error.message;
                if (!error.message.includes('Register')) {
                    this.disconnect();
                }
            } finally {
                this.isLoading = false;
            }
        },
        async getAuthToken() {
            if (!window.ethereum  || !this.signer) {
                throw new Error('You need to connect wallet first');
            }
            
            try {
                const message = `Sign this message to log in to SkillChain: ${Date.now()}`;
                if (window.focus) {
                    window.focus();
                }

                const signature = await this.signer.signMessage(message);
                const verify = useVerify(this.currentAccount, message, signature);
                const token = await verify.verifyMessage();
                return token;
            } catch (error: any) {
                console.error('Signing error:', error);
                
                if (error.code === 4001) {
                    throw new Error('Signing was cancelled. Please sign the message to continue.');
                } else {
                    throw new Error('Failed to sign message. Please try again.');
                }
            }
        },
        //disconnect wallet
        async disconnect() {
            if (!window.ethereum) return;
            try {
                const auth = getAuth();

                signOut(auth)
                    .then(() => {
                    })
                    .catch((error) => {
                        console.error("Error signing out:", error);
                    });
                await window.ethereum.request({ method: 'wallet_revokePermissions', params: [{ eth_accounts: {} }] });
                window.ethereum.removeAllListeners();
                this.clearState();
                useUserStore().clearUser();
            } catch (error) {
                console.error('Error revoking permissions:', error);
            }

            this.clearState();
        },
        //check connection
        async checkConnection() {
            this.isLoading = true;
            if (!window.ethereum) {
                this.error = 'MetaMask is not installed';
                this.isLoading = false
                return false;
            };
            try {
                const accounts = await (window as any).ethereum.request({ method: 'eth_accounts' });
                if (accounts.length > 0) {
                    this.currentAccount = accounts[0];
                    this.chainId = await (window as any).ethereum.request({ method: 'eth_chainId' });
                    if (this.chainId !== TARGET_CHAIN_ID) {
                        await this.switchToTargetChain();
                        return;
                    }
                    this.isConnected = true;
                    this.provider = await markRaw(new ethers.BrowserProvider(window.ethereum));
                    this.signer = await markRaw(this.provider.getSigner());
                    this.error = null;
                    return true;
                } else {
                    this.clearState();
                }
            } catch (error) {
                this.error = 'Error checking connection: ' + error;
                this.clearState();
            } finally {
                this.isLoading = false
            }
            return false;
        },
        //setup listeners
        setupListeners() {
            if (!window.ethereum) return;
            if (window.ethereum.removeAllListeners) {
                window.ethereum.removeAllListeners();
            }
            window.ethereum.on('accountsChanged', (accounts: string[]) => {
                if (accounts.length === 0) {
                    this.disconnect();
                } else {
                    this.currentAccount = accounts[0];
                    if (this.provider) {
                        this.provider.getSigner().then((signer: JsonRpcSigner) => {
                            this.signer = markRaw(signer)
                        })
                    }
                }
            });
            window.ethereum.on('chainChanged', (chainId: string) => {
                this.chainId = chainId;
                if (this.chainId !== TARGET_CHAIN_ID && this.isConnected) {
                    this.error = 'Please switch back to the correct network';
                    this.isConnected = false;
                }
            });
        },
        async switchToTargetChain() {
            this.isLoading = true;
            try {
                await (window as any).ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: TARGET_CHAIN_ID }],
                });
                this.error = null;
                await new Promise(resolve => setTimeout(resolve, 1000));
                
            } catch (switchError: any) {
                console.error('Chain switch error:', switchError);
                    if (switchError.code === 4902) {
                    this.error = 'Please add the Sepolia testnet to MetaMask first.';
                } else if (switchError.code === 4001) {
                    this.error = 'Chain switch was cancelled. Please switch to the correct network manually.';
                } else {
                    this.error = 'Error switching chain. Please switch to the correct network manually.';
                }
                throw switchError;
            } finally {
                this.isLoading = false;
            }
        },
    }
});