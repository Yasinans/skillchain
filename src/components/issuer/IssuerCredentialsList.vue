<script setup lang="ts">
import { computed } from 'vue'
import type { Credential } from '../../types/credentials.type'
import { 
  EyeIcon,
  XCircleIcon,
  CalendarIcon,
  PlusCircleIcon,
  AcademicCapIcon,
  SparklesIcon,
  StarIcon,
  FireIcon,
  TrophyIcon
} from '@heroicons/vue/24/outline'

interface Props {
  credentials: Credential[]
  isVerified: boolean
}

interface Emits {
  (e: 'view-credential', credential: Credential): void
  (e: 'revoke-credential', credential: Credential): void
  (e: 'switch-tab', tab: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const sortedCredentials = computed(() => {
  return [...props.credentials].sort((a, b) => {
    const dateA = new Date(a.issuedDate).getTime()
    const dateB = new Date(b.issuedDate).getTime()
    return dateB - dateA
  })
})

const formatDate = (date: Date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getColorFromName = (name: string): string => {
  const colors = ['emerald', 'blue', 'purple', 'orange']
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  const index = Math.abs(hash) % colors.length
  return colors[index]
}

const getLevelIcon = (level: string) => {
  switch (level.toLowerCase()) {
    case 'expert': return SparklesIcon
    case 'advanced': return StarIcon
    case 'intermediate': return FireIcon
    default: return TrophyIcon
  }
}

const getSkillLevelClass = (level: string) => {
  switch (level.toLowerCase()) {
    case 'expert': return 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    case 'advanced': return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    case 'intermediate': return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    default: return 'bg-amber-500/20 text-amber-300 border-amber-500/30'
  }
}
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between mb-6">
      <h3 class="text-2xl font-bold text-white">Issued Credentials</h3>
      <div class="flex items-center gap-2">
        <span class="text-sm text-[#9b9182]">Total:</span>
        <span class="text-lg font-semibold text-white">{{ sortedCredentials.length }}</span>
      </div>
    </div>

    <div v-if="sortedCredentials.length > 0" class="grid gap-4">
      <div v-for="credential in sortedCredentials" :key="credential.id"
        class="group bg-gradient-to-r from-[#2a2631]/80 to-[#1f1d2c]/80 rounded-xl border border-[#e6902e]/20 hover:border-[#e6902e]/40 transition-all duration-300 p-6">
        
        <div class="flex items-start justify-between">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-3 mb-3">
              <div :class="[
                'w-12 h-12 rounded-xl flex items-center justify-center ring-2 ring-offset-2 ring-offset-[#252236]',
                `bg-${getColorFromName(credential.credentialName)}-900/40 ring-${getColorFromName(credential.credentialName)}-500/30 text-${getColorFromName(credential.credentialName)}-400`
              ]">
                <component :is="getLevelIcon(credential.skillLevel)" class="h-6 w-6" />
              </div>
              <div>
                <h4 class="text-lg font-semibold text-white">{{ credential.credentialName }}</h4>
                <p class="text-sm text-[#9b9182]">{{ credential.organizationName }}</p>
              </div>
            </div>

            <div class="grid md:grid-cols-2 gap-4 mb-4">
              <div>
                <p class="text-xs text-[#9b9182] uppercase tracking-wide mb-1">Recipient</p>
                <p class="text-sm text-white font-mono">
                  {{ credential.holder.slice(0, 6) }}...{{ credential.holder.slice(-4) }}
                </p>
              </div>
              <div>
                <p class="text-xs text-[#9b9182] uppercase tracking-wide mb-1">Issued Date</p>
                <p class="text-sm text-white">{{ formatDate(credential.issuedDate) }}</p>
              </div>
            </div>

            <div class="flex items-center gap-3">
              <span v-if="credential.skillLevel" :class="[
                'px-3 py-1 rounded-full text-sm font-medium',
                getSkillLevelClass(credential.skillLevel)
              ]">
                {{ credential.skillLevel }}
              </span>
              <span :class="[
                'px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2',
                credential.status ? 
                  'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 
                  'bg-red-500/20 text-red-300 border border-red-500/30'
              ]">
                <div :class="[
                  'w-2 h-2 rounded-full',
                  credential.status ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'
                ]"></div>
                {{ credential.status ? 'Active' : 'Expired' }}
              </span>
              <span v-if="credential.expiryDate" class="text-xs text-[#9b9182]">
                <CalendarIcon class="h-4 w-4 inline mr-1" />
                Expires: {{ formatDate(credential.expiryDate) }}
              </span>
            </div>
          </div>

          <div class="flex items-center gap-2 ml-4">
            <button
              @click="emit('view-credential', credential)"
              class="p-2 rounded-lg bg-[#342e3a]/50 hover:bg-[#e6902e]/20 transition-all duration-200 group"
              title="View Details"
            >
              <EyeIcon class="h-5 w-5 text-[#9b9182] group-hover:text-[#e6902e]" />
            </button>
            <button
              v-if="credential.status"
              @click="emit('revoke-credential', credential)"
              class="p-2 rounded-lg bg-[#342e3a]/50 hover:bg-red-500/20 transition-all duration-200 group"
              title="Revoke Credential"
            >
              <XCircleIcon class="h-5 w-5 text-[#9b9182] group-hover:text-red-400" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-16">
      <div class="inline-flex items-center justify-center w-20 h-20 bg-[#e6902e]/10 rounded-full mb-4">
        <AcademicCapIcon class="h-10 w-10 text-[#e6902e]" />
      </div>
      <h3 class="text-xl font-semibold text-white mb-2">No Credentials Issued Yet</h3>
      <p class="text-[#9b9182] mb-6 max-w-md mx-auto">
        Start issuing verified credentials to professionals in your organization
      </p>
      <button
        @click="emit('switch-tab', 'issue')"
        :disabled="!isVerified"
        class="bg-gradient-to-r from-[#e6902e] to-[#d4851f] hover:from-[#f29d32] hover:to-[#e6902e] text-white px-6 py-3 rounded-lg font-semibold shadow-lg shadow-[#e6902e]/30 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
      >
        <PlusCircleIcon class="h-5 w-5" />
        Issue First Credential
      </button>
    </div>
  </div>
</template>