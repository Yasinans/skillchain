<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { useWalletStore } from '../stores/wallet'
import ConnectWallet from './ConnectWallet.vue'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const walletStore = useWalletStore()

// Mobile menu state
const isMobileMenuOpen = ref(false)

// Copy address state
const addressCopied = ref(false)

const walletModal = ref({
  isOpen: false
})

// Check if current route is dashboard
const isDashboard = computed(() => {
  return route.path.startsWith('/dashboard') || route.path.startsWith('/issue') || route.path.startsWith('/verify')
})

// Mobile menu functions
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}

// Address utility functions
const shortenAddress = (address: string | null) => {
  if (!address) return ''
  if (address.length <= 20) return address
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

const copyAddress = async () => {
  if (!userStore.address) return

  try {
    await navigator.clipboard.writeText(userStore.address)
    addressCopied.value = true
    setTimeout(() => {
      addressCopied.value = false
    }, 2000)
  } catch (error) {
    console.error('Failed to copy Address:', error)
    // Fallback for older browsers
    const textArea = document.createElement('textarea')
    textArea.value = userStore.address
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
    addressCopied.value = true
    setTimeout(() => {
      addressCopied.value = false
    }, 2000)
  }
}

const logoutWallet = () => {
  walletStore.disconnect()
  // Navigate back to home if currently in dashboard
  if (isDashboard.value) {
    router.push('/')
  }
}
</script>

<template>
  <nav class="top-0 z-50 bg-[#1d1717]/95 backdrop-blur-md border-b border-[#4f4b61]/50 shadow-lg">
    <div class="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center space-x-2">
          <RouterLink to="/" class="flex items-center space-x-2 group">
            <div class="relative">
              <div class="w-8 h-8 bg-gradient-to-br from-[#e6902e] to-[#fac044] rounded-lg flex items-center justify-center shadow-lg">
                <span class="text-white font-bold text-sm">S</span>
              </div>
              <div class="absolute -inset-1 bg-gradient-to-br from-[#e6902e]/20 to-[#fac044]/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <span class="text-xl font-bold main-text hidden sm:block">SkillChain</span>
          </RouterLink>
        </div>

        <div v-if="!isDashboard" class="hidden md:flex items-center space-x-8">
          <a href="#features" class="text-slate-300 hover:text-[#fac044] transition-colors duration-200 text-sm font-medium">
            Features
          </a>
          <a href="#how-it-works" class="text-slate-300 hover:text-[#fac044] transition-colors duration-200 text-sm font-medium">
            How It Works
          </a>
          <a href="#use-cases" class="text-slate-300 hover:text-[#fac044] transition-colors duration-200 text-sm font-medium">
            Use Cases
          </a>
          <RouterLink to="/verify" class="text-slate-300 hover:text-[#fac044] transition-colors duration-200 text-sm font-medium">
            Verifier
          </RouterLink>
        </div>

        <div class="flex items-center space-x-3">
          <div v-if="!walletStore.isConnected" class="hidden sm:block">
            <button 
              @click="walletModal.isOpen = true"
              class="bg-gradient-to-r from-[#e6902e] to-[#fac044] text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg hover:shadow-[#e6902e]/25 transition-all duration-200 text-sm"
            >
              Connect Wallet
            </button>
          </div>
          
          <div v-else class="flex items-center space-x-3">
            <RouterLink 
              v-if="userStore.isRegistered" 
              :to="userStore.isIssuer ? '/issuer' : '/dashboard'"
              class="hidden sm:flex items-center space-x-2 px-3 py-2 bg-slate-800/30 hover:bg-gradient-to-r hover:from-[#e6902e]/20 hover:to-[#fac044]/20 text-slate-300 hover:text-[#fac044] border border-slate-600/50 hover:border-[#e6902e]/50 rounded-lg transition-all duration-200 text-sm font-medium"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
              </svg>
              <span>Dashboard</span>
            </RouterLink>

            <div class="sm:hidden flex items-center bg-slate-800/50 backdrop-blur-sm rounded-lg px-3 py-2.5 border border-slate-700/50">
              <div class="flex items-center space-x-2">
                <div class="w-6 h-6 bg-gradient-to-br from-[#e6902e] to-[#fac044] rounded-full flex items-center justify-center">
                  <span class="text-white text-xs font-bold">{{ userStore.address?.slice(0, 1).toUpperCase() }}</span>
                </div>
                <span class="text-slate-300 text-sm font-mono">{{ shortenAddress(userStore.address) }}</span>
              </div>
            </div>

            <div class="hidden sm:flex items-center bg-slate-800/50 backdrop-blur-sm rounded-xl px-4 py-3 border border-slate-700/50">
              <div class="flex items-center space-x-3">
                <div class="w-8 h-8 bg-gradient-to-br from-[#e6902e] to-[#fac044] rounded-full flex items-center justify-center">
                  <span class="text-white text-sm font-bold">{{ userStore.address?.slice(0, 1).toUpperCase() || '' }}</span>
                </div>
                <div class="flex flex-col">
                  <span class="text-xs text-slate-400">Connected</span>
                  <span class="text-slate-300 text-sm font-mono">{{ shortenAddress(userStore.address) }}</span>
                </div>
              </div>

              <button 
                @click="copyAddress"
                class="ml-3 p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors duration-200"
                :title="'Copy Address: ' + userStore.address"
              >
                <svg v-if="!addressCopied" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                </svg>
                <svg v-else class="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"/>
                </svg>
              </button>
            </div>

            <button 
              @click="logoutWallet" 
              type="button"
              class="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200 border border-slate-700/50 hover:border-red-500/30"
              title="Disconnect Wallet"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
            </button>
          </div>

          <div class="flex items-center space-x-2">
            <div v-if="!walletStore.isConnected" class="sm:hidden">
              <button 
                @click="walletModal.isOpen = true"
                class="bg-gradient-to-r from-[#e6902e] to-[#fac044] text-white px-3 py-2 rounded-lg font-medium text-sm"
              >
                Connect
              </button>
            </div>

            <button 
              v-if="!isDashboard" 
              @click="toggleMobileMenu" 
              type="button"
              class="md:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors duration-200"
              aria-controls="mobile-menu" 
              :aria-expanded="isMobileMenuOpen"
            >
              <span class="sr-only">Open main menu</span>
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path v-if="!isMobileMenuOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 -translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-4"
      >
        <div 
          v-if="!isDashboard && isMobileMenuOpen" 
          class="md:hidden border-t border-slate-700/50 bg-[#1d1717]/98 backdrop-blur-md"
          id="mobile-menu"
        >
          <div class="px-4 pt-4 pb-6 space-y-3">
            <a 
              href="#features" 
              @click="closeMobileMenu"
              class="flex items-center px-4 py-3 text-slate-300 hover:text-[#fac044] hover:bg-slate-700/30 rounded-xl transition-all duration-200 group"
            >
              <span class="w-2 h-2 bg-[#e6902e] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
              Features
            </a>
            <a 
              href="#how-it-works" 
              @click="closeMobileMenu"
              class="flex items-center px-4 py-3 text-slate-300 hover:text-[#fac044] hover:bg-slate-700/30 rounded-xl transition-all duration-200 group"
            >
              <span class="w-2 h-2 bg-[#e6902e] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
              How It Works
            </a>
            <a 
              href="#use-cases" 
              @click="closeMobileMenu"
              class="flex items-center px-4 py-3 text-slate-300 hover:text-[#fac044] hover:bg-slate-700/30 rounded-xl transition-all duration-200 group"
            >
              <span class="w-2 h-2 bg-[#e6902e] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
              Use Cases
            </a>
            <RouterLink 
              to="/verify" 
              @click="closeMobileMenu"
              class="flex items-center px-4 py-3 text-slate-300 hover:text-[#fac044] hover:bg-slate-700/30 rounded-xl transition-all duration-200 group"
            >
              <span class="w-2 h-2 bg-[#e6902e] rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></span>
              Verifier
            </RouterLink>
            
            <RouterLink 
              v-if="walletStore.isConnected && userStore.isRegistered"
              :to="userStore.isIssuer ? '/issuer' : '/dashboard'"
              @click="closeMobileMenu"
              class="flex items-center px-4 py-3 bg-gradient-to-r from-[#e6902e]/15 to-[#fac044]/15 border border-[#e6902e]/40 rounded-xl transition-all duration-200 group hover:from-[#e6902e]/25 hover:to-[#fac044]/25"
            >
              <div class="flex items-center space-x-3">
                <div class="p-2 bg-gradient-to-br from-[#e6902e] to-[#fac044] rounded-lg">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                  </svg>
                </div>
                <div class="flex flex-col">
                  <span class="text-[#fac044] font-medium">Dashboard</span>
                  <span class="text-xs text-slate-400">{{ userStore.isIssuer ? 'Issuer Portal' : 'My Credentials' }}</span>
                </div>
              </div>
            </RouterLink>
          </div>
        </div>
      </Transition>
    </div>
  </nav>

  <ConnectWallet :walletModal="walletModal" />
</template>