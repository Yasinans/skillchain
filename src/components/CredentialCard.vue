


<template>
  <div class="credential-card bg-[#2a2622] rounded-lg p-6 border border-[#3a3631] hover:border-[#e6902e]/30 transition-all">
    
    <div class="flex items-start gap-4 mb-4">
      <div class="bg-gradient-to-br from-[#e6902e] to-[#f7b955] p-3 rounded-lg shadow-lg shadow-[#e6902e]/20">
        <TrophyIcon class="h-6 w-6 text-white" />
      </div>
      <div class="flex-1">
        <h3 class="text-xl font-bold text-white mb-1">{{ credential.credentialName }}</h3>
        <p class="text-[#d1c9c1]/80 text-sm">{{ credential.organizationName }}</p>
      </div>
      <div class="flex flex-col gap-2">
        <span :class="[
          'text-xs px-3 py-1 rounded-full border font-medium text-center',
          getSkillLevelClass(credential.skillLevel)
        ]">
          {{ getSkillLevelText(credential.skillLevel) }}
        </span>
        <span :class="[
          'text-xs px-3 py-1 rounded-full border font-medium text-center',
          credential.status ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
        ]">
          {{ credential.status ? 'Active' : 'Revoked' }}
        </span>
      </div>
    </div>

    
    <div class="space-y-2 mb-4 text-sm">
      <div class="flex items-center gap-2 text-[#d1c9c1]/70">
        <CalendarIcon class="h-4 w-4" />
        <span>Issued: {{ formatDate(credential.issuedDate) }}</span>
      </div>
      <div v-if="credential.canExpire && credential.expiryDate" class="flex items-center gap-2 text-[#d1c9c1]/70">
        <XCircleIcon class="h-4 w-4" />
        <span>Expires: {{ formatDate(credential.expiryDate) }}</span>
      </div>
    </div>

    
    <div class="border-t border-[#3a3631] pt-4">
      <div v-if="credential.certificateUrl" class="certificate-section">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <DocumentIcon class="h-5 w-5 text-[#e6902e]" />
            <span class="text-sm font-medium text-[#d1c9c1]">Certificate Available</span>
          </div>
          <div class="flex gap-2">
            <button 
              @click="viewCertificate"
              class="px-3 py-1 bg-[#e6902e]/10 text-[#e6902e] rounded-lg text-sm hover:bg-[#e6902e]/20 transition-all flex items-center gap-1"
              title="View Certificate"
            >
              <EyeIcon class="h-4 w-4" />
              View
            </button>
            <button 
              @click="downloadCertificate"
              class="px-3 py-1 bg-[#e6902e]/10 text-[#e6902e] rounded-lg text-sm hover:bg-[#e6902e]/20 transition-all flex items-center gap-1"
              title="Download Certificate"
            >
              <ArrowDownTrayIcon class="h-4 w-4" />
              Download
            </button>
          </div>
        </div>
      </div>

      
      <div v-else class="flex items-center gap-2 text-[#d1c9c1]/50">
        <DocumentIcon class="h-5 w-5" />
        <span class="text-sm">No certificate file attached</span>
      </div>

      
      <div class="mt-3 pt-3 border-t border-[#3a3631]/50">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <ShieldCheckIcon class="h-4 w-4 text-green-400" />
            <span class="text-xs text-[#d1c9c1]/70">Blockchain Verified</span>
          </div>
          <button 
            v-if="credential.id"
            @click="viewOnBlockchain"
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
</template>

<script setup lang="ts">
import { 
  DocumentIcon, 
  EyeIcon, 
  ArrowDownTrayIcon, 
  ShieldCheckIcon,
  TrophyIcon,
  CalendarIcon,
  XCircleIcon,
  LinkIcon
} from '@heroicons/vue/24/outline'
import type { Credential } from '../types/credentials.type'
import { EXPLORER_BASE_URL } from '../config'

interface Props {
  credential: Credential
}

const props = defineProps<Props>()

// Helper functions
const getSkillLevelClass = (level: string) => {
  switch (level.toLowerCase()) {
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

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}

// Certificate functions
const viewCertificate = () => {
  if (props.credential.certificateUrl) {
    window.open(props.credential.certificateUrl, '_blank')
  }
}

const downloadCertificate = async () => {
  if (props.credential.certificateUrl) {
    try {
      const response = await fetch(props.credential.certificateUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${props.credential.credentialName}-certificate.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Download failed:', error)
    }
  }
}

const viewOnBlockchain = () => {
  if (props.credential.id) {
    window.open(`${EXPLORER_BASE_URL}/tx/${props.credential.id}`, '_blank')
  }
}
</script>