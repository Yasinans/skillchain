<script setup lang="ts">
import {
  CalendarIcon,
  PlusCircleIcon,
  AcademicCapIcon,
  TrophyIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  DocumentArrowUpIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'
import type { Credential } from '../types/credentials.type'
import { CheckCircleIcon as CheckCircleIconSolid } from '@heroicons/vue/24/solid'

interface Props {
  organizationName: string | null
  isVerified: boolean
  domain: string | null
  credentials: Credential[]
  activeCredentials: number
}

interface Emits {
  (e: 'start-verification'): void
  (e: 'switch-tab', tab: string): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()
</script>

<template>
  <div class="space-y-6">
    
    <div class="bg-gradient-to-r from-[#e6902e]/10 to-[#f7b955]/10 rounded-xl p-6 border border-[#e6902e]/20">
      <div class="flex items-start justify-between">
        <div>
          <h2 class="text-xl font-bold text-white mb-2">
            Welcome back, {{ organizationName }}!
          </h2>
          <p class="text-[#d1c9c1]/80 mb-4">
            {{ isVerified ? 'Your credential issuing platform is active and verified' : 'Your dashboard is ready for use' }}
          </p>
          <div class="flex flex-wrap gap-4 text-sm">
            <div class="flex items-center gap-2">
              <CheckCircleIconSolid v-if="isVerified" class="h-5 w-5 text-emerald-400" />
              <ExclamationTriangleIcon v-else class="h-5 w-5 text-amber-400" />
              <span class="text-[#d1c9c1]">
                {{ isVerified ? 'Blockchain Verified' : 'Not Verified' }}
              </span>
            </div>
            <div v-if="domain" class="flex items-center gap-2">
              <GlobeAltIcon class="h-5 w-5 text-[#e6902e]" />
              <span class="text-[#d1c9c1]">{{ domain }}</span>
            </div>
          </div>
        </div>
        <div class="hidden lg:block">
          <ShieldCheckIcon class="h-16 w-16" :class="isVerified ? 'text-[#e6902e]/20' : 'text-amber-400/20'" />
        </div>
      </div>
    </div>

    
    <div>
      <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <CalendarIcon class="h-5 w-5 text-[#e6902e]" />
        Recent Activity
      </h3>
      <div v-if="credentials.length > 0" class="grid gap-3">
        <div v-for="cred in credentials.slice(0, 3)" :key="cred.id" 
          class="bg-white/5 rounded-lg p-4 border border-white/10 hover:border-[#e6902e]/30 transition-all"
        >
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="bg-[#e6902e]/10 p-2 rounded-lg">
                <TrophyIcon class="h-5 w-5 text-[#e6902e]" />
              </div>
              <div>
                <p class="text-white font-medium">{{ cred.credentialName }}</p>
                <p class="text-xs text-[#d1c9c1]/60">
                  Issued to {{ cred.holder }} • {{ new Date(cred.issuedDate).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric"
                  }) }}
                </p>
               
              </div>
            </div>
            <span :class="[
              'text-xs px-2 py-1 rounded-full border',
              cred.status ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
            ]">
              {{ cred.status ? 'Active' : 'Expired' }}
            </span>
          </div>
        </div>
      </div>
      <div v-else class="bg-white/5 rounded-lg p-8 text-center border border-white/10">
        <TrophyIcon class="h-12 w-12 text-[#e6902e]/50 mx-auto mb-3" />
        <p class="text-[#d1c9c1]/70">No credentials issued yet</p>
        <p class="text-sm text-[#d1c9c1]/50">
          {{ isVerified ? 'Start issuing your first credential' : 'Complete verification to start issuing credentials' }}
        </p>
      </div>
    </div>

    
    <div>
      <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <PlusCircleIcon class="h-5 w-5 text-[#e6902e]" />
        Quick Actions
      </h3>
      <div class="grid md:grid-cols-2 gap-4">
        <button 
          @click="isVerified ? emit('switch-tab', 'issue') : null"
          :disabled="!isVerified"
          class="bg-gradient-to-r from-[#e6902e]/20 to-[#f7b955]/20 border border-[#e6902e]/30 rounded-lg p-4 text-left hover:border-[#e6902e]/50 transition-all group relative"
          :class="!isVerified ? 'opacity-60 cursor-not-allowed' : ''"
        >
          <div class="flex items-center gap-3">
            <div class="bg-[#e6902e]/20 p-2 rounded-lg group-hover:bg-[#e6902e]/30 transition-colors">
              <DocumentArrowUpIcon class="h-6 w-6 text-[#e6902e]" />
            </div>
            <div>
              <h4 class="text-white font-medium">Issue New Credential</h4>
              <p class="text-xs text-[#d1c9c1]/60">
                {{ isVerified ? 'Create and sign a new credential' : 'Verification required to issue credentials' }}
              </p>
            </div>
          </div>
          <ExclamationTriangleIcon v-if="!isVerified" class="h-5 w-5 text-amber-400 absolute top-2 right-2" />
        </button>
        <button 
          @click="emit('switch-tab', 'credentials')"
          class="bg-white/5 border border-white/10 rounded-lg p-4 text-left hover:border-white/20 transition-all group"
        >
          <div class="flex items-center gap-3">
            <div class="bg-white/10 p-2 rounded-lg group-hover:bg-white/20 transition-colors">
              <AcademicCapIcon class="h-6 w-6 text-white" />
            </div>
            <div>
              <h4 class="text-white font-medium">Manage Credentials</h4>
              <p class="text-xs text-[#d1c9c1]/60">View and manage issued credentials</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>