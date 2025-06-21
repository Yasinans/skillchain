<script setup lang="ts">
import {
    WalletIcon,
    XMarkIcon,
    ArrowTopRightOnSquareIcon,
    ShieldCheckIcon
} from '@heroicons/vue/24/outline';
import { storeToRefs } from 'pinia';
import MetamaskIcon from '../assets/images/MetaMask_Icon.svg';
import { useWalletStore } from '../stores/wallet';
import { useToast } from '../composables/useToast';
import { useRouter } from 'vue-router';
import LoadingModal from './LoadingModal.vue';

const router = useRouter();
const { success, error } = useToast();
const walletStore = useWalletStore();
const {
    connect,
} = walletStore;
const {
    isLoading,
    currentAccount,
    error : walletError
} = storeToRefs(walletStore);
interface WalletOption {
    id: string;
    name: string;
    icon: string;
    description: string;
    installed?: boolean;
}

interface WalletModalData {
    isOpen: boolean;

}

const props = defineProps<{
    walletModal: WalletModalData
}>();

const closeModal = () => {
    props.walletModal.isOpen = false;
};

const walletOptions: WalletOption[] = [
    {
        id: 'metamask',
        name: 'MetaMask',
        icon: MetamaskIcon,
        description: 'Connect using MetaMask wallet',
        installed: typeof window.ethereum !== 'undefined'
    }
];
const handleWalletConnect = async () => {
    await connect();
    if(walletError.value) {
        if(walletError.value.toLowerCase().includes("register")){
            router.push('/register');
        }
        else error('Error Connecting Wallet',walletError.value);
    }
    else success('Wallet Connected',currentAccount.value+" is connected");
    closeModal();
};


</script>

<template>
    <Transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0"
        enter-to-class="opacity-100" leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100" leave-to-class="opacity-0">
        <div v-if="walletModal.isOpen"
            class="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            @click.self="closeModal">

            <Transition enter-active-class="transition-all duration-300 ease-out"
                enter-from-class="opacity-0 scale-95 translate-y-4" enter-to-class="opacity-100 scale-100 translate-y-0"
                leave-active-class="transition-all duration-200 ease-in"
                leave-from-class="opacity-100 scale-100 translate-y-0"
                leave-to-class="opacity-0 scale-95 translate-y-4">
                <div v-if="walletModal.isOpen"
                    class="relative bg-gradient-to-b from-[#252236] to-[#1f1d2c] rounded-2xl border border-[#e6902e]/30 shadow-2xl shadow-[#e6902e]/10 max-w-md w-full overflow-hidden">

                    
                    <div
                        class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e6902e]/40 to-transparent">
                    </div>

                    
                    <button @click="closeModal"
                        class="absolute top-4 right-4 p-2 rounded-full hover:bg-[#e6902e]/10 transition-all duration-200 group z-10">
                        <XMarkIcon class="h-5 w-5 text-gray-400 group-hover:text-[#e6902e] transition-colors" />
                    </button>

                    
                    <div class="p-6 pb-4">
                        <div class="flex items-start gap-4">
                            <div
                                class="flex-shrink-0 h-12 w-12 rounded-xl flex items-center justify-center ring-2 ring-offset-2 ring-offset-[#1f1d2c] bg-[#e6902e]/15 ring-[#e6902e]/40 text-[#e6902e] transition-all duration-300">
                                <WalletIcon class="h-6 w-6" />
                            </div>

                            <div class="flex-1 pt-1">
                                <h3 class="text-xl font-bold text-white mb-2 leading-tight">
                                    Connect Wallet
                                </h3>
                                <p class="text-gray-300 leading-relaxed text-[15px]">
                                    Choose your preferred wallet to connect.
                                </p>
                            </div>
                        </div>
                    </div>

                    
                    <div class="px-6 pb-6">
                        <div class="space-y-3">
                            <div v-for="wallet in walletOptions" :key="wallet.id" @click="handleWalletConnect()"
                                class="group relative p-4 rounded-xl border border-[#3a3631] hover:border-[#e6902e]/50 bg-gradient-to-r from-[#252236]/50 to-[#1f1d2c]/50 hover:from-[#e6902e]/5 hover:to-[#e6902e]/10 transition-all duration-200 cursor-pointer">
                                <div class="flex items-center gap-4">
                                    <div class="relative">
                                        <img :src="wallet.icon" :alt="wallet.name" class="h-10 w-10 rounded-lg" />
                                    </div>

                                    <div class="flex-1">
                                        <div class="flex items-center gap-2">
                                            <h4
                                                class="text-white font-semibold group-hover:text-[#e6902e] transition-colors">
                                                {{ wallet.name }}
                                            </h4>
                                            <span v-if="wallet.installed"
                                                class="flex items-center gap-1 px-2 py-0.5 bg-green-900/30 text-green-400 text-xs rounded-full">
                                                <ShieldCheckIcon class="h-3 w-3" />
                                                Detected
                                            </span>
                                            <span v-else-if="wallet.installed === false"
                                                class="flex items-center gap-1 px-2 py-0.5 bg-red-900/30 text-gray-400 text-xs rounded-full">
                                                Not Installed
                                            </span>
                                        </div>
                                        <p class="text-gray-400 text-sm mt-0.5">
                                            {{ wallet.description }}
                                        </p>
                                    </div>

                                    <ArrowTopRightOnSquareIcon
                                        class="h-5 w-5 text-gray-500 group-hover:text-[#e6902e] transition-colors" />
                                </div>
                            </div>
                        </div>

                        
                        <div class="mt-6 p-4 bg-[#e6902e]/5 border border-[#e6902e]/20 rounded-xl">
                            <div class="flex items-start gap-3">
                                <ShieldCheckIcon class="h-5 w-5 text-[#e6902e] flex-shrink-0 mt-0.5" />
                                <div>
                                    <p class="text-white font-medium text-sm">Secure Connection</p>
                                    <p class="text-gray-300 text-xs mt-1 leading-relaxed">
                                        We use industry-standard encryption to protect your wallet connection. Your
                                        private keys never leave your wallet.
                                    </p>
                                </div>
                            </div>
                        </div>

                        
                        <div class="pt-6 border-t border-[#e6902e]/10 mt-6">
                            <div class="flex justify-end">
                                <button @click="closeModal"
                                    class="px-5 py-2.5 border border-[#3a3631] rounded-lg text-gray-300 hover:bg-[#e6902e]/5 hover:border-[#e6902e]/30 hover:text-white transition-all duration-200 font-medium">
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>

                    
                    <div
                        class="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#e6902e]/20 to-transparent">
                    </div>
                </div>
            </Transition>
        </div>
    </Transition>
    <LoadingModal :title="'Waiting for Wallet Connection'" :message="''" :isLoading="isLoading" />
</template>