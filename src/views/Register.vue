<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { CheckIcon, ChevronRightIcon } from '@heroicons/vue/24/outline'
import { AcademicCapIcon, UserIcon, BuildingOfficeIcon, ShieldCheckIcon, CheckCircleIcon } from '@heroicons/vue/24/outline'
import { useWalletStore } from '../stores/wallet';
import { useDB } from '../composables/useDB';
import MetamaskIcon from '../assets/images/MetaMask_Icon.svg';
import { TARGET_CHAIN_ID } from '../config';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useUserStore } from '../stores/user';
import { useToast } from '../composables/useToast';
//store
const userStore = useUserStore();
const router = useRouter();
const walletStore = useWalletStore();
const {
  connect,
  disconnect,
  checkConnection
} = walletStore;
const {
  isRegistered,
  isIssuer
} = storeToRefs(userStore);
const {
  isLoading,
  isConnected,
  currentAccount,
  error: walletError,
  chainId
} = storeToRefs(walletStore);
const { success, error } = useToast();

const currentStep = ref(0)
const selectedUserType = ref('')
const isRegistering = ref(false)
const userDetails = ref({
  fullName: '',
  organizationName: '',
  email: ''
})

const steps = [
  { title: 'Choose Role' },
  { title: 'Connect Wallet' },
  { title: 'Complete Setup' }
]

const userTypes = [
  {
    type: 'issuer',
    title: 'Issuer',
    description: 'Universities, bootcamps, and training providers',
    icon: AcademicCapIcon,
    needsRegistration: true,
    color: 'emerald'
  },
  {
    type: 'user',
    title: 'User',
    description: 'Professionals collecting credentials',
    icon: UserIcon,
    needsRegistration: true,
    color: 'blue'
  },
  {
    type: 'verifier',
    title: 'Verifier',
    description: 'Employers verifying credentials',
    icon: BuildingOfficeIcon,
    needsRegistration: false,
    color: 'purple'
  }
]

const walletOptions = [
  {
    name: 'MetaMask',
    icon: MetamaskIcon
  },
]

const progressWidth = computed(() => {
  return (currentStep.value / (steps.length - 1)) * 100
})

const isEmailValid = computed(() => {
  if (!userDetails.value.email) return true;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(userDetails.value.email);
})

const isFormValid = computed(() => {
  const baseValidation =   userDetails.value.email && isEmailValid.value;
  
  if (selectedUserType.value === 'issuer') {
    return baseValidation && userDetails.value.organizationName;
  }
  return baseValidation && userDetails.value.fullName;
})

const selectUserType = (type: string) => {
  selectedUserType.value = type
}

const nextStep = () => {
  if (currentStep.value < steps.length - 1) {
    currentStep.value++
  }
}

const getStepIndicatorClass = (index: number) => {
  if (currentStep.value > index) {
    return 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white shadow-lg shadow-orange-500/25'
  } else if (currentStep.value === index) {
    return 'bg-gradient-to-r from-orange-400 to-yellow-400 text-white ring-4 ring-orange-400/20 shadow-lg shadow-orange-500/25'
  } else {
    return 'bg-white/5 text-[#9b9182] border border-white/10'
  }
}

const handleWalletConnect = async () => {
  await connect(true)
  if(userStore.isRegistered){
    success('Already Registered', 'User is already registered')
    if(!userStore.isIssuer) {
    router.push('/dashboard')
   } else {
    router.push('/issuer')
  }
  }
  if (walletError.value) {
    error('Error Connecting Wallet', walletError.value);
  }

}

const submitRegistration = async () => {
  if (!isFormValid.value) return

  isRegistering.value = true
  try {
    let userResp;
    if(selectedUserType.value === 'issuer') {
       userResp = await (await useDB()).createUser(userDetails.value.organizationName, userDetails.value.email, true);
       isIssuer.value = true
      }
       
    else {
       userResp = await (await useDB()).createUser(userDetails.value.fullName, userDetails.value.email)
    }
    isRegistered.value = true;
    if(!userResp) throw new Error('Email already exists')
    success('User Registered', 'User has been registered successfully')
    if(userResp) proceedToDashboard()
  } catch (regError: any) {
    error('Error Registering User', regError.message)
    
  } finally {
    isRegistering.value = false
  }
}

const proceedToDashboard = () => {
  if(selectedUserType.value==='user') {
    router.push('/dashboard');

  } else if(selectedUserType.value==='issuer') {
    router.push('/issuer');
  }
}

onMounted(async () => {
  if(await checkConnection())disconnect();
})
</script>

<template>
  <div class="bg-[#1a1612] text-white">
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute right-[calc(50%-12rem)] top-10 -z-10 transform-gpu blur-3xl" aria-hidden="true">
        <div class="aspect-[1108/632] w-[50rem] bg-gradient-to-l from-orange-500 to-yellow-500 opacity-10"
          style="clip-path: polygon(26.4% 48.3%, 8.3% 88.2%, 0% 53.6%, 2.6% 17.8%, 7.5% 15.1%, 24.3% 36%, 44.7% 52.5%, 53.5% 50.6%, 55% 37.1%, 49.7% 12.8%, 78.7% 35.9%, 99.9% 0%, 94.6% 48.9%, 78.6% 36.1%, 41.1% 99.8%, 26.4% 48.3%)" />
      </div>
    </div>

    <main class="container mx-auto px-4 py-6 relative z-10">
      <div class="text-center mb-8 mt-10">
        <h1
          class="text-3xl font-bold mb-3 bg-gradient-to-r from-orange-400 to-yellow-400 bg-clip-text text-transparent">
          Get Started with SkillChain
        </h1>
        <p class="text-[#a39a8d] mb-2">
          Create your account and start issuing or collecting credentials on the blockchain
        </p>
        <p class="text-sm text-[#9b9182]">
          Already have an account?
          <router-link to="/" class="text-orange-400 hover:text-orange-300 transition-colors">
            Return
          </router-link>
        </p>
      </div>

      <div class="max-w-3xl mx-auto">
        
        <div
          class="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl border border-white/10 p-6 mb-6 backdrop-blur-sm">
          <div class="flex items-center justify-between relative">
            <div class="absolute top-6 left-6 right-6 h-0.5 bg-white/10"></div>
            <div
              class="absolute top-6 left-6 h-0.5 bg-gradient-to-r from-orange-400 to-yellow-400 transition-all duration-500"
              :style="`width: calc(${progressWidth}% - ${progressWidth === 0 ? 0 : 48}px)`"></div>
            <div v-for="(step, index) in steps" :key="index" class="relative flex flex-col items-center z-10">
              <div
                class="flex items-center justify-center w-12 h-12 rounded-full transition-all duration-300 backdrop-blur-sm"
                :class="getStepIndicatorClass(index)">
                <component v-if="currentStep > index" :is="CheckIcon" class="h-5 w-5" />
                <span v-else class="text-sm font-semibold">{{ index + 1 }}</span>
              </div>
              <span class="mt-2 text-sm font-medium transition-colors duration-300 text-center whitespace-nowrap"
                :class="currentStep >= index ? 'text-white' : 'text-[#9b9182]'">
                {{ step.title }}
              </span>
            </div>
          </div>
        </div>

        
        <div
          class="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl border border-white/10 p-6 backdrop-blur-sm">
          <div v-if="currentStep === 0">
            <div class="text-center mb-6">
              <div class="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 p-3 rounded-xl inline-flex mb-3">
                <UserIcon class="h-6 w-6 text-orange-400" />
              </div>
              <h2 class="text-xl font-bold text-white mb-2">Choose Your Role</h2>
              <p class="text-[#a39a8d] text-sm">Select how you'll be using SkillChain</p>
            </div>

            <div class="grid md:grid-cols-3 gap-4 mb-6">
              <div v-for="userType in userTypes" :key="userType.type"
                class="group relative bg-gradient-to-br from-white/5 to-white/[0.02] rounded-xl border backdrop-blur-sm transition-all duration-300 cursor-pointer overflow-hidden hover:scale-[1.02]"
                :class="selectedUserType === userType.type
                  ? 'border-orange-400/50 shadow-lg shadow-orange-500/10 bg-gradient-to-br from-orange-500/10 to-yellow-500/5'
                  : 'border-white/10 hover:border-white/20 hover:shadow-md hover:shadow-white/5'"
                @click="selectUserType(userType.type)">

                <div :class="[
                  'h-0.5 bg-gradient-to-r',
                  userType.color === 'emerald' ? 'from-emerald-400 to-emerald-600' :
                    userType.color === 'blue' ? 'from-blue-400 to-blue-600' :
                      'from-purple-400 to-purple-600'
                ]"></div>

                <div v-if="selectedUserType === userType.type" class="absolute top-3 right-3 z-10">
                  <div class="bg-orange-500 rounded-full p-1">
                    <CheckCircleIcon class="h-4 w-4 text-white" />
                  </div>
                </div>

                <div class="p-4 text-center">
                  <div
                    class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full transition-all duration-300"
                    :class="[
                      'bg-gradient-to-r',
                      selectedUserType === userType.type
                        ? 'from-orange-500 to-yellow-500'
                        : userType.color === 'emerald' ? 'from-emerald-500/20 to-emerald-600/20 group-hover:from-emerald-500 group-hover:to-emerald-600' :
                          userType.color === 'blue' ? 'from-blue-500/20 to-blue-600/20 group-hover:from-blue-500 group-hover:to-blue-600' :
                            'from-purple-500/20 to-purple-600/20 group-hover:from-purple-500 group-hover:to-purple-600'
                    ]">
                    <component :is="userType.icon" class="h-6 w-6 text-white" />
                  </div>
                  <h3 class="text-base font-bold text-white mb-1 group-hover:text-orange-100 transition-colors">
                    {{ userType.title }}
                  </h3>
                  <p class="text-xs text-[#9b9182]">{{ userType.description }}</p>
                  <p v-if="userType.type==='issuer'" class="text-xs text-[#d35353]">(Requires gas fee for registration)</p>
                </div>
              </div>
            </div>

            <div class="text-center">
              <button v-if="selectedUserType && selectedUserType !== 'verifier'" @click="nextStep"
                class="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white px-6 py-2.5 rounded-lg font-medium transition-all hover:scale-105 shadow-lg shadow-orange-500/25 inline-flex items-center gap-2">
                Continue
                <ChevronRightIcon class="h-4 w-4" />
              </button>

              <button v-if="selectedUserType && selectedUserType === 'verifier'" @click="router.push('/verify')"
                class="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white px-6 py-2.5 rounded-lg font-medium transition-all hover:scale-105 shadow-lg shadow-orange-500/25 inline-flex items-center gap-2">
                Verify Credentials
                <ChevronRightIcon class="h-4 w-4" />
              </button>
            </div>
          </div>

          <div v-if="currentStep === 1">
            <div class="text-center mb-6">
              <div class="bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-3 rounded-xl inline-flex mb-3">
                <ShieldCheckIcon class="h-6 w-6 text-blue-400" />
              </div>
              <h2 class="text-xl font-bold text-white mb-2">Connect Your Wallet</h2>
              <p class="text-[#a39a8d] text-sm">Connect your wallet to secure your account</p>
              <div v-if="chainId && chainId !== TARGET_CHAIN_ID && chainId !== '0x1'" 
                class="bg-red-500/10 border border-red-500/20 rounded-lg p-3 mb-4 mt-3">
              <p class="text-red-400 text-sm">
                ⚠️ Wrong network detected. Please switch to Sepolia testnet. {{ chainId+":"+TARGET_CHAIN_ID }}
              </p>
            </div>
            </div>

            <div class="max-w-sm mx-auto">
              <div v-if="!isConnected || isLoading">
                <div class="grid gap-3 mb-4">
                  <button v-for="wallet in walletOptions" :key="wallet.name" @click="handleWalletConnect()"
                    :disabled="isLoading"
                    class="group bg-gradient-to-br from-white/5 to-white/[0.02] rounded-lg border border-white/10 p-4 hover:border-orange-400/50 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">
                    <div class="flex items-center justify-center space-x-3">
                      <img :src="wallet.icon" :alt="wallet.name" class="w-6 h-6" />
                      <span class="text-white font-medium group-hover:text-orange-100 transition-colors">{{ wallet.name
                        }}</span>
                    </div>
                  </button>
                </div>

                <div v-if="isLoading" class="flex items-center justify-center space-x-2 text-[#a39a8d] text-sm">
                  <div class="animate-spin rounded-full h-4 w-4 border-2 border-orange-400 border-t-transparent"></div>
                  <span>Connecting wallet...</span>
                </div>
              </div>

              <div v-if="isConnected && !isLoading" class="text-center">
                <div
                  class="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 rounded-lg p-4 mb-4">
                  <div class="flex justify-center mb-3">
                    <div class="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center">
                      <CheckIcon class="h-6 w-6 text-emerald-400" />
                    </div>
                  </div>
                  <h3 class="text-lg font-bold text-white mb-1">Wallet Connected!</h3>
                  <p class="text-[#a39a8d] text-xs">Address: <span class="text-emerald-400 font-mono">{{ currentAccount
                      }}</span></p>
                </div>

                <button @click="nextStep"
                  class="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white px-6 py-2.5 rounded-lg font-medium transition-all hover:scale-105 shadow-lg shadow-orange-500/25 inline-flex items-center gap-2">
                  Continue Setup
                  <ChevronRightIcon class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          <div v-if="currentStep === 2">
            <div class="text-center mb-6">
              <div class="bg-gradient-to-br from-orange-500/20 to-yellow-500/20 p-3 rounded-xl inline-flex mb-3">
                <UserIcon class="h-6 w-6 text-orange-400" />
              </div>
              <h2 class="text-xl font-bold text-white mb-2">Complete Your Profile</h2>
              <p class="text-[#a39a8d] text-sm">Fill in your details to complete registration</p>
            </div>

            <div class="max-w-md mx-auto">
              <div class="space-y-4 mb-6">
                <div v-if="selectedUserType !== 'issuer'">
                  <label class="block text-sm font-medium text-[#a39a8d] mb-2">Full Name *</label>
                  <input v-model="userDetails.fullName" type="text"
                    class="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-[#9b9182] focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400 transition-colors text-sm"
                    placeholder="Enter your full name" required>
                </div>

                <div v-if="selectedUserType === 'issuer'">
                  <label class="block text-sm font-medium text-[#a39a8d] mb-2">Organization Name *</label>
                  <input v-model="userDetails.organizationName" type="text"
                    class="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-[#9b9182] focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400 transition-colors text-sm"
                    placeholder="Enter organization name" required>
                </div>

                <div>
                  <label class="block text-sm font-medium text-[#a39a8d] mb-2">Email *</label>
                  <input v-model="userDetails.email" type="email"
                    :class="[
                      'w-full px-3 py-2.5 bg-white/5 border rounded-lg text-white placeholder-[#9b9182] focus:outline-none focus:ring-1 transition-colors text-sm',
                      userDetails.email && !isEmailValid 
                        ? 'border-red-400 focus:border-red-400 focus:ring-red-400' 
                        : 'border-white/10 focus:border-orange-400 focus:ring-orange-400'
                    ]"
                    placeholder="Enter your email" required>
                  <p v-if="userDetails.email && !isEmailValid" class="mt-1 text-xs text-red-400">
                    Please enter a valid email address
                  </p>
                </div>
              </div>

              <div class="text-center">
                <button @click="submitRegistration" :disabled="!isFormValid || isRegistering"
                  class="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white px-6 py-2.5 rounded-lg font-medium transition-all hover:scale-105 shadow-lg shadow-orange-500/25 inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                  <div v-if="isRegistering"
                    class="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>{{ isRegistering ? 'Creating Account...' : 'Complete Registration' }}</span>
                  <ChevronRightIcon v-if="!isRegistering" class="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>