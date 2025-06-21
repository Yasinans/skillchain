<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  UserIcon,
  TrophyIcon,
  XCircleIcon,
  ChevronDownIcon,
  CalendarIcon,
  ShieldCheckIcon,
  DocumentIcon,
  EyeIcon,
  ArrowDownTrayIcon,
  LinkIcon
} from '@heroicons/vue/24/outline'
import type { Credential } from '../types/credentials.type'
import { EXPLORER_BASE_URL } from '../config'

interface Props {
  credentials: Credential[]
  isVerified: boolean
}

interface Emits {
  (e: 'revoke', credential: Credential): void
  (e: 'start-verification'): void
  (e: 'switch-tab', tab: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Search and filter state
const credentialsSearch = ref('')
const credentialsFilter = ref('all')

// Filtered credentials
const filteredCredentials = computed(() => {
  let filtered = props.credentials

  // Apply search filter
  if (credentialsSearch.value.trim()) {
    const searchTerm = credentialsSearch.value.toLowerCase()
    filtered = filtered.filter(cred => 
      cred.credentialName.toLowerCase().includes(searchTerm) ||
      cred.holder.toLowerCase().includes(searchTerm)
    )
  }

  // Apply status filter
  if (credentialsFilter.value === 'active') {
    filtered = filtered.filter(cred => cred.status)
  } else if (credentialsFilter.value === 'expired') {
    filtered = filtered.filter(cred => !cred.status)
  }

  return filtered
})

// Helper functions
const getSkillLevelClass = (level: string) => {
  switch (level) {
    case 'beginner': return 'bg-blue-500/10 text-blue-400 border-blue-500/20'
    case 'intermediate': return 'bg-teal-500/10 text-teal-400 border-teal-500/20'
    case 'advanced': return 'bg-purple-500/10 text-purple-400 border-purple-500/20'
    case 'expert': return 'bg-amber-500/10 text-amber-400 border-amber-500/20'
    default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20'
  }
}

const getSkillLevelText = (level: string) => {
  return level.charAt(0).toUpperCase() + level.slice(1)
}

// Certificate functions
const viewCertificate = (credential: Credential) => {
  if (credential.certificateUrl) {
    window.open(credential.certificateUrl, '_blank')
  }
}

const downloadCertificate = async (credential: Credential) => {
  if (credential.certificateUrl) {
    try {
      const response = await fetch(credential.certificateUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${credential.credentialName}-certificate.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }
}

const viewOnBlockchain = (credential: Credential) => {
  if (credential.id) {
    window.open(`${EXPLORER_BASE_URL}/tx/${credential.id}`, '_blank')
  }
}
</script>

<template>
  <div>
    
    <div class="mb-6 flex flex-col sm:flex-row gap-4">
      <div class="flex-1 relative">
        <input 
          type="text" 
          v-model="credentialsSearch"
          placeholder="Search credentials..."
          class="w-full pl-10 pr-4 py-3 bg-[#2a2622] border border-[#3a3631] rounded-lg focus:ring-2 focus:ring-[#e6902e]/50 focus:border-[#e6902e] outline-none transition-all text-white placeholder-[#d1c9c1]/50"
        />
        <UserIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#d1c9c1]/60" />
      </div>
      <div class="relative">
        <select 
          v-model="credentialsFilter"
          class="bg-[#2a2622] border border-[#3a3631] rounded-lg px-4 py-3 pr-10 text-white appearance-none select-no-arrow focus:ring-2 focus:ring-[#e6902e]/50 focus:border-[#e6902e] outline-none transition-all"
        >
          <option value="all">All Credentials</option>
          <option value="active">Active Only</option>
          <option value="expired">Expired Only</option>
        </select>
        <ChevronDownIcon class="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#d1c9c1]/60 pointer-events-none" />
      </div>
    </div>

    
    <div class="grid gap-4">
      <div 
        v-for="cred in filteredCredentials" 
        :key="cred.id" 
        class="bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:border-[#e6902e]/30 transition-all p-6"
      >
        <div class="flex flex-col lg:flex-row gap-6">
          
          <div class="flex-1">
            <div class="flex items-start gap-4">
              <div class="bg-gradient-to-br from-[#e6902e] to-[#f7b955] p-3 rounded-lg shadow-lg shadow-[#e6902e]/20">
                <TrophyIcon class="h-6 w-6 text-white" />
              </div>
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-2">
                  <h3 class="text-xl font-bold text-white">{{ cred.credentialName }}</h3>
                  <span :class="[
                    'text-xs px-3 py-1 rounded-full border font-medium',
                    getSkillLevelClass(cred.skillLevel)
                  ]">
                    {{ getSkillLevelText(cred.skillLevel) }}
                  </span>
                  <span :class="[
                    'text-xs px-3 py-1 rounded-full border font-medium',
                    cred.status ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                  ]">
                    {{ cred.status ? 'Active' : 'Expired' }}
                  </span>
                </div>
                
                <div class="grid md:grid-cols-2 gap-4 text-sm mb-4">
                  <div class="space-y-2">
                    <div class="flex items-center gap-2 text-[#d1c9c1]/80">
                      <UserIcon class="h-4 w-4 flex-shrink-0" />
                      <span>Issued to {{ cred.holder }}</span>
                    </div>
                  </div>
                  <div class="space-y-2">
                    <div class="flex items-center gap-2 text-[#d1c9c1]/80">
                      <CalendarIcon class="h-4 w-4 flex-shrink-0" />
                      <span>Issued: {{ new Date(cred.issuedDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      }) }}</span>
                    </div>
                    <div v-if="cred.canExpire && cred.expiryDate" class="flex items-center gap-2" :class="!cred.status ? 'text-red-400' : 'text-[#d1c9c1]/80'">
                      <XCircleIcon class="h-4 w-4 flex-shrink-0" />
                      <span>Expires: {{ new Date(cred.expiryDate).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric"
                      }) }}</span>
                    </div>
                  </div>
                </div>

                
                <div class="border-t border-[#3a3631] pt-4">
                  <div v-if="cred.certificateUrl" class="certificate-section">
                    <div class="flex items-center justify-between mb-2">
                      <div class="flex items-center gap-2">
                        <DocumentIcon class="h-5 w-5 text-[#e6902e]" />
                        <span class="text-sm font-medium text-[#d1c9c1]">Certificate Available</span>
                      </div>
                      <div class="flex gap-2">
                        <button 
                          @click="viewCertificate(cred)"
                          class="px-3 py-1 bg-[#e6902e]/10 text-[#e6902e] rounded-lg text-sm hover:bg-[#e6902e]/20 transition-all flex items-center gap-1"
                          title="View Certificate"
                        >
                          <EyeIcon class="h-4 w-4" />
                          View
                        </button>
                        <button 
                          @click="downloadCertificate(cred)"
                          class="px-3 py-1 bg-[#e6902e]/10 text-[#e6902e] rounded-lg text-sm hover:bg-[#e6902e]/20 transition-all flex items-center gap-1"
                          title="Download Certificate"
                        >
                          <ArrowDownTrayIcon class="h-4 w-4" />
                          Download
                        </button>
                      </div>
                    </div>
                  </div>

                  
                  <div v-else class="certificate-section">
                    <div class="flex items-center gap-2 text-[#d1c9c1]/50">
                      <DocumentIcon class="h-5 w-5" />
                      <span class="text-sm">No certificate file attached</span>
                    </div>
                  </div>

                  
                  <div class="blockchain-info mt-3 pt-3 border-t border-[#3a3631]/50">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <ShieldCheckIcon class="h-4 w-4 text-green-400" />
                        <span class="text-xs text-[#d1c9c1]/70">Blockchain Verified</span>
                      </div>
                      <button 
                        v-if="cred.id"
                        @click="viewOnBlockchain(cred)"
                        class="text-xs text-[#e6902e] hover:text-[#f7b955] transition-all flex items-center gap-1"
                        title="View on Blockchain"
                      >
                        <LinkIcon class="h-3 w-3" />
                        View Transaction
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          
          <div class="flex flex-col justify-between items-end gap-4">
            <div class="flex items-center gap-2">
              <button 
                class="text-red-400 hover:text-red-300 p-2 rounded-lg hover:bg-red-400/10 transition-all group"
                @click="emit('revoke', cred)" 
                title="Revoke Credential"
              >
                <XCircleIcon class="h-5 w-5 group-hover:scale-110 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>

      
      <div v-if="filteredCredentials.length === 0 && credentials.length > 0" class="text-center py-12">
        <div class="bg-[#2a2622] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <UserIcon class="h-10 w-10 text-[#e6902e]" />
        </div>
        <h3 class="text-xl font-bold text-white mb-2">No Matching Credentials</h3>
        <p class="text-[#d1c9c1]/70 mb-6">
          Try adjusting your search terms or filter settings
        </p>
        <button 
          @click="credentialsSearch = ''; credentialsFilter = 'all'"
          class="bg-gradient-to-r from-[#e6902e] to-[#f7b955] hover:from-[#f7b955] hover:to-[#e6902e] text-white px-6 py-3 rounded-lg font-medium transition-all"
        >
          Clear Filters
        </button>
      </div>

      
      <div v-if="credentials.length === 0" class="text-center py-12">
        <div class="bg-[#2a2622] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <TrophyIcon class="h-10 w-10 text-[#e6902e]" />
        </div>
        <h3 class="text-xl font-bold text-white mb-2">No Credentials Issued Yet</h3>
        <p class="text-[#d1c9c1]/70 mb-6">
          {{ isVerified ? 'Start issuing credentials to see them listed here' : 'Complete verification to start issuing credentials' }}
        </p>
        <button 
          @click="isVerified ? emit('switch-tab', 'issue') : emit('start-verification')"
          class="bg-gradient-to-r from-[#e6902e] to-[#f7b955] hover:from-[#f7b955] hover:to-[#e6902e] text-white px-6 py-3 rounded-lg font-medium transition-all"
        >
          {{ isVerified ? 'Issue Your First Credential' : 'Start Verification' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.select-no-arrow {
  background-image: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

select:not(.select-no-arrow) {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%23d1c9c1' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  padding-right: 2.5rem;
}
</style>