<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useUserStore } from '../stores/user'
import {
  BuildingOfficeIcon,
  GlobeAltIcon,
  DocumentTextIcon,
  ShieldCheckIcon,
  InformationCircleIcon,
  ClipboardDocumentIcon,
  ChevronDownIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/vue/24/solid'
import type { WellKnownContent } from '../composables/useDomainVerification'

interface VerificationStep {
  id: number
  title: string
  description: string
  completed: boolean
  active: boolean
}

interface Props {
  verificationSteps: VerificationStep[]
  currentStep: number
  registrationData: {
    organizationName: string
    domainName: string
    walletAddress: string
  }
  wellKnownContent: WellKnownContent | null
  isLoading: boolean
}

interface Emits {
  (e: 'next-step'): void
  (e: 'cancel'): void
  (e: 'generate-content'): void
  (e: 'verify-domain'): void
  (e: 'update:registrationData', value: Props['registrationData']): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const userStore = useUserStore()

const domainError = ref<string | null>(null)
const isValidatingDomain = ref(false)

const DOMAIN_PATTERNS = {
  basic: /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
  edu: /\.(edu|ac\.[a-z]{2}|edu\.[a-z]{2})$/i,
  validTLD: /\.(com|org|net|edu|gov|mil|int|co|io|ly|me|tv|cc|tk|xyz|info|biz|name|pro|museum|aero|coop|[a-z]{2})$/i,
  ipAddress: /^(\d{1,3}\.){3}\d{1,3}$/,
  localhost: /^(localhost|127\.0\.0\.1|0\.0\.0\.0|::1)$/i
}

const validateDomain = (domain: string): { isValid: boolean; error?: string } => {
  if (!domain || domain.trim() === '') {
    return { isValid: false, error: 'Domain is required' }
  }

  const trimmedDomain = domain.trim().toLowerCase()

  const cleanDomain = trimmedDomain.replace(/^https?:\/\//, '').replace(/^www\./, '')

  if (!/^[a-zA-Z0-9.-]+$/.test(cleanDomain)) {
    return { isValid: false, error: 'Domain contains invalid characters' }
  }

  if (DOMAIN_PATTERNS.ipAddress.test(cleanDomain)) {
    return { isValid: false, error: 'IP addresses are not allowed. Please use a domain name.' }
  }

  if (DOMAIN_PATTERNS.localhost.test(cleanDomain)) {
    return { isValid: false, error: 'Localhost and internal domains are not allowed' }
  }

  if (!DOMAIN_PATTERNS.basic.test(cleanDomain)) {
    return { isValid: false, error: 'Invalid domain format' }
  }

  if (cleanDomain.length < 3) {
    return { isValid: false, error: 'Domain must be at least 3 characters long' }
  }

  if (cleanDomain.length > 253) {
    return { isValid: false, error: 'Domain must be less than 253 characters' }
  }

  if (cleanDomain.includes('..')) {
    return { isValid: false, error: 'Domain cannot contain consecutive dots' }
  }

  if (cleanDomain.startsWith('.') || cleanDomain.endsWith('.') || 
      cleanDomain.startsWith('-') || cleanDomain.endsWith('-')) {
    return { isValid: false, error: 'Domain cannot start or end with dot or hyphen' }
  }

  if (!DOMAIN_PATTERNS.validTLD.test(cleanDomain)) {
    return { isValid: false, error: 'Domain must have a valid top-level domain (TLD)' }
  }

  const labels = cleanDomain.split('.')
  for (const label of labels) {
    if (label.length === 0) {
      return { isValid: false, error: 'Domain labels cannot be empty' }
    }
    if (label.length > 63) {
      return { isValid: false, error: 'Domain labels must be 63 characters or less' }
    }
    if (label.startsWith('-') || label.endsWith('-')) {
      return { isValid: false, error: 'Domain labels cannot start or end with hyphens' }
    }
  }

  if (!cleanDomain.includes('.')) {
    return { isValid: false, error: 'Domain must include a top-level domain (e.g., .com, .org, .edu)' }
  }

  return { isValid: true }
}

const checkDomainAvailability = async (domain: string): Promise<{ isAvailable: boolean; error?: string }> => {
  try {
    isValidatingDomain.value = true
    

    const response = await fetch(`https://dns.google/resolve?name=${domain}&type=A`)
    const data = await response.json()
    
    if (data.Status === 0 && data.Answer && data.Answer.length > 0) {
      return { isAvailable: true }
    } else {
      return { isAvailable: false, error: 'Domain does not appear to be reachable. Please verify the domain exists and is properly configured.' }
    }
  } catch (error) {
    return { isAvailable: false, error: 'Unable to verify domain availability. Please check your internet connection.' }
  } finally {
    isValidatingDomain.value = false
  }
}

const handleDomainInput = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const domain = target.value.trim().toLowerCase()
  
  domainError.value = null
  
  if (!domain) {
    updateRegistrationData({ ...props.registrationData, domainName: '' })
    return
  }

  const cleanDomain = domain.replace(/^https?:\/\//, '').replace(/^www\./, '')
  
  const validation = validateDomain(cleanDomain)
  if (!validation.isValid) {
    domainError.value = validation.error || 'Invalid domain'
    updateRegistrationData({ ...props.registrationData, domainName: cleanDomain })
    return
  }

  updateRegistrationData({ ...props.registrationData, domainName: cleanDomain })

  setTimeout(async () => {
    if (cleanDomain === props.registrationData.domainName) {
      const availability = await checkDomainAvailability(cleanDomain)
      if (!availability.isAvailable) {
        domainError.value = availability.error || 'Domain is not available'
      }
    }
  }, 500)
}

const updateRegistrationData = (data: Props['registrationData']) => {
  emit('update:registrationData', data)
}

const isDomainValid = computed(() => {
  if (!props.registrationData.domainName) return false
  const validation = validateDomain(props.registrationData.domainName)
  return validation.isValid && !domainError.value
})

const wellKnownJson = computed(() => {
  if (!props.wellKnownContent) return ''
  return JSON.stringify(props.wellKnownContent, null, 2)
})

watch(() => props.registrationData.domainName, (newDomain) => {
  if (newDomain && domainError.value) {
    domainError.value = null
  }
})
</script>

<template>
  <div class="max-w-4xl mx-auto">
    <div class="mb-8 text-center">
      <h2 class="text-2xl font-bold text-white mb-3">Organization Verification</h2>
      <p class="text-[#d1c9c1] text-lg">Verify your organization to enable credential issuance</p>
    </div>

    <!-- Progress Steps -->
    <div class="mb-12">
      <div class="flex items-center justify-between">
        <div v-for="(step, index) in verificationSteps" :key="step.id" class="flex-1 relative">
          <div class="flex items-center">
            <div :class="[
              'w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300',
              step.completed ? 'bg-[#e6902e] text-white' : 
              step.active ? 'bg-[#e6902e]/20 text-[#e6902e] border-2 border-[#e6902e]' : 
              'bg-[#2a2622] text-[#d1c9c1]/50 border-2 border-[#3a3631]'
            ]">
              <CheckCircleIconSolid v-if="step.completed" class="h-6 w-6" />
              <span v-else>{{ step.id }}</span>
            </div>
            <div v-if="index < verificationSteps.length - 1" :class="[
              'flex-1 h-0.5 mx-4 transition-all duration-300',
              step.completed ? 'bg-[#e6902e]' : 'bg-[#3a3631]'
            ]"></div>
          </div>
          <div class="mt-3">
            <p :class="['text-sm font-medium', step.active ? 'text-white' : 'text-[#d1c9c1]/70']">
              {{ step.title }}
            </p>
            <p class="text-xs text-[#d1c9c1]/50 mt-1">{{ step.description }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="bg-[#1f1d2c]/60 backdrop-blur-sm rounded-xl border border-[#e6902e]/20 shadow-lg overflow-hidden">
      <!-- Step 1: Organization Information -->
      <div v-if="currentStep === 1" class="p-8">
        <div class="flex items-center gap-4 mb-6">
          <div class="bg-[#e6902e]/10 p-3 rounded-lg">
            <BuildingOfficeIcon class="h-8 w-8 text-[#e6902e]" />
          </div>
          <div>
            <h3 class="text-2xl font-bold text-white">Organization Information</h3>
            <p class="text-[#d1c9c1]/80">Tell us about your organization</p>
          </div>
        </div>

        <form @submit.prevent="emit('next-step')" class="space-y-6">
          <div>
            <label class="block text-sm font-medium mb-2">Organization Name</label>
            <input 
              :value="userStore.name"
              type="text" 
              placeholder="Acme University"
              class="w-full bg-[#2a2622]/50 border border-[#3a3631] rounded-lg px-4 py-3 text-[#d1c9c1]/80 cursor-not-allowed"
              disabled
            />
            <p class="text-xs text-[#d1c9c1]/60 mt-2">This will be displayed on all issued credentials</p>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Domain Name</label>
            <div class="relative">
              <GlobeAltIcon class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#d1c9c1]/60" />
              <input 
                :value="registrationData.domainName"
                @input="handleDomainInput"
                type="text" 
                placeholder="example.edu"
                :class="[
                  'w-full pl-12 bg-[#2a2622] border rounded-lg px-4 py-3 text-white placeholder-[#d1c9c1]/50 focus:ring-2 focus:ring-[#e6902e]/50 outline-none transition-all',
                  domainError ? 'border-red-500 focus:border-red-500' : 'border-[#3a3631] focus:border-[#e6902e]'
                ]"
                required
              />
              <div v-if="isValidatingDomain" class="absolute right-4 top-1/2 -translate-y-1/2">
                <ArrowPathIcon class="h-5 w-5 text-[#e6902e] animate-spin" />
              </div>
            </div>
            
            <!-- Domain Error Message -->
            <div v-if="domainError" class="mt-2 flex items-center gap-2 text-red-400 text-sm">
              <ExclamationTriangleIcon class="h-4 w-4 flex-shrink-0" />
              <span>{{ domainError }}</span>
            </div>
            
            <!-- Domain Help Text -->
            <div v-else class="mt-2 space-y-1">
              <p class="text-xs text-[#d1c9c1]/60">You must have control over this domain for verification</p>
              <div class="text-xs text-[#d1c9c1]/50">
                <span class="text-[#e6902e]">Examples:</span> university.edu, company.com, organization.org
              </div>
            </div>

            <!-- Domain Validation Tips -->
            <div class="mt-3 bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
              <h4 class="text-blue-300 text-sm font-medium mb-2">Domain Requirements:</h4>
              <ul class="text-xs text-blue-200/80 space-y-1">
                <li>• Must be a valid, publicly accessible domain</li>
                <li>• Cannot be an IP address or localhost</li>
                <li>• Must include a valid TLD (.com, .org, .edu, etc.)</li>
                <li>• You must have administrative access to add files</li>
              </ul>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Wallet Address</label>
            <div class="relative">
              <ShieldCheckIcon class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#d1c9c1]/60" />
              <input 
                :value="userStore.address"
                type="text" 
                class="w-full pl-12 bg-[#2a2622]/50 border border-[#3a3631] rounded-lg px-4 py-3 text-[#d1c9c1]/80 cursor-not-allowed"
                disabled
              />
            </div>
            <p class="text-xs text-[#d1c9c1]/60 mt-2">Connected from your wallet</p>
          </div>

          <div class="flex justify-between pt-4">
            <button 
              type="button"
              @click="emit('cancel')"
              class="text-[#d1c9c1] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              :disabled="!isDomainValid || isValidatingDomain"
              class="bg-gradient-to-r from-[#e6902e] to-[#f7b955] hover:from-[#f7b955] hover:to-[#e6902e] text-white px-8 py-3 rounded-lg font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowPathIcon v-if="isValidatingDomain" class="h-5 w-5 animate-spin" />
              <span>{{ isValidatingDomain ? 'Validating...' : 'Continue to Verification' }}</span>
              <ChevronDownIcon v-if="!isValidatingDomain" class="h-5 w-5 rotate-270" />
            </button>
          </div>
        </form>
      </div>

      <!-- Step 2: Domain Verification -->
      <div v-if="currentStep === 2" class="p-8">
        <div class="flex items-center gap-4 mb-6">
          <div class="bg-[#e6902e]/10 p-3 rounded-lg">
            <DocumentTextIcon class="h-8 w-8 text-[#e6902e]" />
          </div>
          <div>
            <h3 class="text-2xl font-bold text-white">Domain Verification</h3>
            <p class="text-[#d1c9c1]/80">Prove ownership of {{ registrationData.domainName }}</p>
          </div>
        </div>

        <div class="space-y-6">
          <div class="bg-[#2a2622]/50 rounded-lg p-6 border border-[#3a3631]">
            <h4 class="font-semibold text-white mb-4 flex items-center gap-2">
              <InformationCircleIcon class="h-5 w-5 text-[#e6902e]" />
              Verification Instructions
            </h4>
            <ol class="space-y-3 text-sm">
              <li class="flex gap-3">
                <span class="text-[#e6902e] font-bold">1.</span>
                <div>
                  <p>Create a file named <code class="bg-[#1a1612] px-2 py-1 rounded text-[#e6902e]">skillchain-credentials</code></p>
                </div>
              </li>
              <li class="flex gap-3">
                <span class="text-[#e6902e] font-bold">2.</span>
                <div>
                  <p>Copy the verification JSON below into the file</p>
                </div>
              </li>
              <li class="flex gap-3">
                <span class="text-[#e6902e] font-bold">3.</span>
                <div>
                  <p>Upload it to: <code class="bg-[#1a1612] px-2 py-1 rounded text-[#e6902e]">https://{{ registrationData.domainName }}/.well-known/skillchain-credentials</code></p>
                </div>
              </li>
            </ol>
          </div>

          <div>
            <div class="flex items-center justify-between mb-2">
              <label class="text-sm font-medium">Verification JSON</label>
              <button
                @click="emit('generate-content')"
                class="text-sm text-[#e6902e] hover:text-[#f7b955] flex items-center gap-1 transition-colors"
              >
                <ClipboardDocumentIcon class="h-4 w-4" />
                Generate & Copy JSON
              </button>
            </div>
            <div class="bg-[#1a1612] rounded-lg p-4 border border-[#3a3631] font-mono text-sm text-[#d1c9c1]/80 overflow-x-auto">
              <pre v-if="wellKnownContent">{{ wellKnownJson }}</pre>
              <div v-else class="text-center py-4 text-[#d1c9c1]/50">
                Click "Generate & Copy JSON" to create verification content
              </div>
            </div>
          </div>

          <div class="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
            <p class="text-sm text-amber-400">
              ⚠️ Make sure the file is publicly accessible and returns the correct JSON content
            </p>
          </div>

          <div class="flex justify-between pt-4">
            <button
              @click="emit('cancel')"
              class="text-[#d1c9c1] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button 
              @click="emit('next-step')"
              :disabled="!wellKnownContent"
              class="bg-gradient-to-r from-[#e6902e] to-[#f7b955] hover:from-[#f7b955] hover:to-[#e6902e] text-white px-8 py-3 rounded-lg font-medium transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              I've uploaded the file
              <ChevronDownIcon class="h-5 w-5 rotate-270" />
            </button>
          </div>
        </div>
      </div>

      <!-- Step 3: Complete Registration -->
      <div v-if="currentStep === 3" class="p-8">
        <div class="flex items-center gap-4 mb-6">
          <div class="bg-[#e6902e]/10 p-3 rounded-lg">
            <ShieldCheckIcon class="h-8 w-8 text-[#e6902e]" />
          </div>
          <div>
            <h3 class="text-2xl font-bold text-white">Complete Registration</h3>
            <p class="text-[#d1c9c1]/80">Verify and register on the blockchain</p>
          </div>
        </div>

        <div class="space-y-6">
          <div class="bg-[#2a2622]/50 rounded-lg p-6 border border-[#3a3631]">
            <h4 class="font-semibold text-white mb-4">Registration Summary</h4>
            <dl class="space-y-3">
              <div class="flex justify-between">
                <dt class="text-[#d1c9c1]/70">Organization:</dt>
                <dd class="text-white font-medium">{{ userStore.name }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-[#d1c9c1]/70">Domain:</dt>
                <dd class="text-white font-medium">{{ registrationData.domainName }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-[#d1c9c1]/70">Wallet:</dt>
                <dd class="text-white font-mono text-sm">{{ userStore.address?.slice(0, 10) }}...{{ userStore.address?.slice(-8) }}</dd>
              </div>
              <div class="flex justify-between">
                <dt class="text-[#d1c9c1]/70">Verification URL:</dt>
                <dd class="text-[#e6902e] text-sm">https://{{ registrationData.domainName }}/.well-known/skillchain-credentials</dd>
              </div>
            </dl>
          </div>

          <div class="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4">
            <p class="text-sm text-emerald-400">
              ✓ Ready to verify! Click the button below to complete your registration.
            </p>
          </div>

          <div class="flex justify-between items-center pt-4">
            <button
              @click="emit('cancel')"
              class="text-[#d1c9c1] hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button 
              @click="emit('verify-domain')"
              :disabled="isLoading"
              class="bg-gradient-to-r from-[#e6902e] to-[#f7b955] hover:from-[#f7b955] hover:to-[#e6902e] text-white px-12 py-4 rounded-lg font-medium transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowPathIcon v-if="isLoading" class="h-5 w-5 animate-spin" />
              <ShieldCheckIcon v-else class="h-5 w-5" />
              {{ isLoading ? 'Verifying...' : 'Verify & Register' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>