<script setup lang="ts">
import { computed } from 'vue'
import type { Credential } from '../../types/credentials.type'
import { 
  BuildingOfficeIcon,
  ClockIcon,
  PlusCircleIcon,
  DocumentTextIcon
} from '@heroicons/vue/24/outline'

interface IssuerProfile {
  domain: string;
  isVerified: boolean;
  verifiedAt: number;
  organizationName: string;
  description: string;
}

interface Props {
  issuerProfile: IssuerProfile | null
  isVerified: boolean
  credentials: Credential[]
}

interface Emits {
  (e: 'switch-tab', tab: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Sort credentials by date (newest first)
const sortedCredentials = computed(() => {
  return [...props.credentials].sort((a, b) => {
    const dateA = new Date(a.issuedDate).getTime()
    const dateB = new Date(b.issuedDate).getTime()
    return dateB - dateA
  })
})

const getRelativeTime = (date: Date) => {
  const now = new Date()
  const diff = now.getTime() - new Date(date).getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 30) return `${days} days ago`
  if (days < 365) return `${Math.floor(days / 30)} months ago`
  return `${Math.floor(days / 365)} years ago`
}
</script>

<template>
  <div>
    <div class="grid md:grid-cols-2 gap-6">
      <div class="bg-[#2a2631]/50 rounded-xl p-6 border border-[#e6902e]/10">
        <h3 class="text-xl font-bold mb-4 text-white flex items-center gap-2">
          <BuildingOfficeIcon class="h-6 w-6 text-[#e6902e]" />
          Organization Profile
        </h3>
        <div class="space-y-3">
          <div>
            <p class="text-sm text-[#9b9182]">Organization Name</p>
            <p class="text-white font-medium">{{ issuerProfile?.organizationName || 'Not Set' }}</p>
          </div>
          <div>
            <p class="text-sm text-[#9b9182]">Domain</p>
            <p class="text-white font-medium">{{ issuerProfile?.domain || 'Not Verified' }}</p>
          </div>
          <div>
            <p class="text-sm text-[#9b9182]">Verification Status</p>
            <div class="flex items-center gap-2 mt-1">
              <div :class="[
                'w-2 h-2 rounded-full',
                isVerified ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              ]"></div>
              <p :class="isVerified ? 'text-emerald-400' : 'text-amber-400'" class="font-medium">
                {{ isVerified ? 'Verified' : 'Unverified' }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div class="bg-[#2a2631]/50 rounded-xl p-6 border border-[#e6902e]/10">
        <h3 class="text-xl font-bold mb-4 text-white flex items-center gap-2">
          <ClockIcon class="h-6 w-6 text-[#e6902e]" />
          Recent Activity
        </h3>
        <div v-if="sortedCredentials.length > 0" class="space-y-3">
          <div v-for="credential in sortedCredentials.slice(0, 3)" :key="credential.id" 
            class="flex items-center justify-between">
            <div class="flex-1 min-w-0">
              <p class="text-white font-medium truncate">{{ credential.credentialName }}</p>
              <p class="text-sm text-[#9b9182]">{{ getRelativeTime(credential.issuedDate) }}</p>
            </div>
            <span :class="[
              'px-2 py-1 rounded text-xs font-medium',
              credential.status ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'
            ]">
              {{ credential.status ? 'Active' : 'Expired' }}
            </span>
          </div>
        </div>
        <div v-else class="text-center py-8 text-[#9b9182]">
          No credentials issued yet
        </div>
      </div>
    </div>

    <div class="mt-6 bg-gradient-to-r from-[#e6902e]/10 to-[#fac044]/10 rounded-xl p-6 border border-[#e6902e]/20">
      <h3 class="text-xl font-bold mb-3 text-white">Quick Actions</h3>
      <div class="grid md:grid-cols-2 gap-4">
        <button 
          @click="emit('switch-tab', 'issue')"
          :disabled="!isVerified"
          class="flex items-center gap-3 p-4 bg-[#2a2631]/80 hover:bg-[#342e3a] rounded-lg transition-all duration-200 border border-[#e6902e]/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <PlusCircleIcon class="h-8 w-8 text-[#e6902e]" />
          <div class="text-left">
            <p class="font-medium text-white">Issue New Credential</p>
            <p class="text-sm text-[#9b9182]">Create a verified credential</p>
          </div>
        </button>
        <button 
          @click="emit('switch-tab', 'issued')"
          class="flex items-center gap-3 p-4 bg-[#2a2631]/80 hover:bg-[#342e3a] rounded-lg transition-all duration-200 border border-[#e6902e]/20"
        >
          <DocumentTextIcon class="h-8 w-8 text-[#e6902e]" />
          <div class="text-left">
            <p class="font-medium text-white">View All Credentials</p>
            <p class="text-sm text-[#9b9182]">Manage issued credentials</p>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>