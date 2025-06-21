<script setup lang="ts">
import { ref } from 'vue'
import {
  UserIcon,
  TrophyIcon,
  Bars3Icon,
  ChevronDownIcon,
  DocumentArrowUpIcon,
  DocumentTextIcon,
  TrashIcon,
  ClipboardDocumentIcon,
  CheckBadgeIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon
} from '@heroicons/vue/24/outline'
import type { CredentialFormData } from '../composables/useIssuerCredentials'

interface Props {
  isVerified: boolean
  formData: CredentialFormData
  isFormValid: boolean
  uploadedFile: File | null
  isUploading: boolean
  uploadProgress: number
  certificateUrl: string
  isDragging: boolean
  errors?: {
    recipientAddr?: string
    skillName?: string
    skillLevel?: string
    description?: string
  }
}

interface Emits {
  (e: 'start-verification'): void
  (e: 'submit'): void
  (e: 'file-change', event: Event): void
  (e: 'file-drop', event: DragEvent): void
  (e: 'drag-enter'): void
  (e: 'drag-leave'): void
  (e: 'drag-over'): void
  (e: 'remove-file'): void
  (e: 'copy-certificate-url'): void
  (e: 'switch-tab', tab: string): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const fileInput = ref<HTMLInputElement | null>(null)

const handleSubmit = () => {
  emit('submit')
}

const triggerFileInput = () => {
  fileInput.value?.click()
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' bytes'
  else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
  else return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
}
</script>

<template>
  <div>
    
    <div v-if="!isVerified" class="mb-6 bg-red-500/10 border border-red-500/20 rounded-xl p-6">
      <div class="flex items-start gap-4">
        <div class="bg-red-500/20 p-3 rounded-lg flex-shrink-0">
          <ExclamationTriangleIcon class="h-6 w-6 text-red-400" />
        </div>
        <div class="flex-1">
          <h3 class="text-lg font-semibold text-red-400 mb-2">Verification Required</h3>
          <p class="text-red-400/80 mb-4">
            You must complete organization verification before you can issue credentials. This ensures the authenticity
            and trustworthiness of your credentials.
          </p>
          <button @click="emit('start-verification')"
            class="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-500 text-white px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2">
            <ShieldCheckIcon class="h-5 w-5" />
            Start Verification Process
          </button>
        </div>
      </div>
    </div>

    <div class="bg-white/5 backdrop-blur-sm rounded-lg border border-[#e6902e]/20 overflow-hidden"
      :class="!isVerified ? 'opacity-50 pointer-events-none' : ''">
      <div class="p-6">
        <div class="flex items-center gap-3 mb-6">
          <div class="bg-[#e6902e]/10 p-3 rounded-lg">
            <DocumentArrowUpIcon class="h-6 w-6 text-[#e6902e]" />
          </div>
          <div>
            <h2 class="text-xl font-bold text-white">Issue New Credential</h2>
            <p class="text-sm text-[#d1c9c1]/70">Create a blockchain-verified credential</p>
          </div>
        </div>

        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid md:grid-cols-2 gap-6">
            
            <div class="space-y-6">
              <div>
                <label for="recipientAddr" class="block text-sm font-medium mb-2">
                  Recipient Wallet Address
                </label>
                <div class="relative">
                  <UserIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#d1c9c1]/60" />
                  <input id="recipientAddr" type="text" v-model="formData.recipientAddr" placeholder="0x..."
                    class="w-full pl-10 pr-4 py-3 bg-[#2a2622] border rounded-lg focus:ring-2 focus:ring-[#e6902e]/50 focus:border-[#e6902e] outline-none transition-all text-white placeholder-[#d1c9c1]/50"
                    :class="errors?.recipientAddr ? 'border-red-500/50' : 'border-[#3a3631]'" required />
                </div>
                <p v-if="errors?.recipientAddr" class="mt-1 text-sm text-red-400">{{ errors.recipientAddr }}</p>
              </div>

              <div>
                <label for="skillName" class="block text-sm font-medium mb-2">
                  Credential Name
                </label>
                <div class="relative">
                  <TrophyIcon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#d1c9c1]/60" />
                  <input id="skillName" type="text" v-model="formData.skillName"
                    placeholder="e.g. Blockchain Development"
                    class="w-full pl-10 pr-4 py-3 bg-[#2a2622] border rounded-lg focus:ring-2 focus:ring-[#e6902e]/50 focus:border-[#e6902e] outline-none transition-all text-white placeholder-[#d1c9c1]/50"
                    :class="errors?.skillName ? 'border-red-500/50' : 'border-[#3a3631]'" required />
                </div>
                <p v-if="errors?.skillName" class="mt-1 text-sm text-red-400">{{ errors.skillName }}</p>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label for="skillLevel" class="block text-sm font-medium mb-2">
                    Skill Level (Optional)
                  </label>
                  <div class="relative">
                    <Bars3Icon class="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#d1c9c1]/60" />
                    <select id="skillLevel" v-model="formData.skillLevel"
                      class="w-full pl-10 pr-8 py-3 bg-[#2a2622] border rounded-lg focus:ring-2 focus:ring-[#e6902e]/50 focus:border-[#e6902e] outline-none transition-all appearance-none text-white select-no-arrow"
                      :class="errors?.skillLevel ? 'border-red-500/50' : 'border-[#3a3631]'">
                      <option value="" selected>None</option>
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="expert">Expert</option>
                    </select>
                    <ChevronDownIcon
                      class="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#d1c9c1]/60 pointer-events-none" />
                  </div>
                  <p v-if="errors?.skillLevel" class="mt-1 text-sm text-red-400">{{ errors.skillLevel }}</p>
                </div>

                <div>
                  <label for="expiryDate" class="block text-sm font-medium mb-2">
                    Expiry Date (Optional)
                  </label>
                  <input id="expiryDate" type="date" v-model="formData.expiryDate"
                    class="w-full px-4 py-3 bg-[#2a2622] border border-[#3a3631] rounded-lg focus:ring-2 focus:ring-[#e6902e]/50 focus:border-[#e6902e] outline-none transition-all text-white" />
                  <p class="text-xs text-[#d1c9c1]/60 mt-1">Leave empty for no expiration</p>
                </div>
              </div>

              <div>
                <label for="description" class="block text-sm font-medium mb-2">
                  Description
                </label>
                <textarea id="description" v-model="formData.description" rows="3"
                  placeholder="Detailed description of the credential and its requirements"
                  class="w-full px-4 py-3 bg-[#2a2622] border rounded-lg focus:ring-2 focus:ring-[#e6902e]/50 focus:border-[#e6902e] outline-none transition-all text-white placeholder-[#d1c9c1]/50 resize-none"
                  :class="errors?.description ? 'border-red-500/50' : 'border-[#3a3631]'" required></textarea>
                <p v-if="errors?.description" class="mt-1 text-sm text-red-400">{{ errors.description }}</p>
              </div>

              <div>
                <label for="notes" class="block text-sm font-medium mb-2">
                  Additional Notes (Optional)
                </label>
                <textarea id="notes" v-model="formData.notes" rows="2"
                  placeholder="Any additional information about this credential"
                  class="w-full px-4 py-3 bg-[#2a2622] border border-[#3a3631] rounded-lg focus:ring-2 focus:ring-[#e6902e]/50 focus:border-[#e6902e] outline-none transition-all text-white placeholder-[#d1c9c1]/50 resize-none"></textarea>
              </div>
            </div>

            
            <div>
              <label class="block text-sm font-medium mb-2">
                Upload Certificate (PDF - Optional)
              </label>
              <div
                class="border-2 border-dashed border-[#3a3631] rounded-lg p-6 transition-all h-full min-h-[400px] flex flex-col"
                :class="{ 'border-[#e6902e]/60 bg-[#2a2622]/60': isDragging }" @dragenter.prevent="emit('drag-enter')"
                @dragleave.prevent="emit('drag-leave')" @dragover.prevent="emit('drag-over')"
                @drop.prevent="emit('file-drop', $event)">
                <div v-if="!uploadedFile" class="flex flex-col items-center justify-center h-full text-center">
                  <div class="bg-[#2a2622] p-4 rounded-full mb-4">
                    <DocumentArrowUpIcon class="h-12 w-12 text-[#e6902e]/60" />
                  </div>
                  <p class="font-medium text-white mb-2">
                    Drag and drop your PDF certificate here
                  </p>
                  <p class="text-sm text-[#d1c9c1]/70 mb-4">or</p>
                  <button type="button"
                    class="bg-[#e6902e]/20 hover:bg-[#e6902e]/30 text-[#e6902e] px-6 py-2 rounded-lg font-medium transition-colors"
                    @click="triggerFileInput">
                    Browse Files
                  </button>
                  <p class="mt-4 text-xs text-[#d1c9c1]/50">
                    PDF files only, max 10MB • Optional certificate attachment
                  </p>
                  <input ref="fileInput" type="file" accept="application/pdf" class="hidden"
                    @change="emit('file-change', $event)" />
                </div>

                <div v-else class="flex flex-col h-full">
                  <div class="bg-[#2a2622]/50 rounded-lg p-4 border border-[#3a3631]">
                    <div class="flex items-center justify-between mb-4">
                      <div class="flex items-center gap-3">
                        <div class="bg-[#e6902e]/10 p-3 rounded-lg">
                          <DocumentTextIcon class="h-6 w-6 text-[#e6902e]" />
                        </div>
                        <div>
                          <p class="font-medium text-white">{{ uploadedFile.name }}</p>
                          <p class="text-xs text-[#d1c9c1]/60">{{ formatFileSize(uploadedFile.size) }}</p>
                        </div>
                      </div>
                      <button type="button"
                        class="text-red-400 hover:text-red-300 p-2 hover:bg-white/5 rounded-lg transition-all"
                        @click="emit('remove-file')">
                        <TrashIcon class="h-5 w-5" />
                      </button>
                    </div>

                    <div v-if="isUploading" class="space-y-2">
                      <div class="flex justify-between text-sm">
                        <span class="text-[#d1c9c1]/70">Uploading to Supabase Storage...</span>
                        <span class="text-[#e6902e] font-medium">{{ uploadProgress }}%</span>
                      </div>
                      <div class="w-full bg-[#2a2622] rounded-full h-2 overflow-hidden">
                        <div
                          class="bg-gradient-to-r from-[#e6902e] to-[#f7b955] h-2 rounded-full transition-all duration-300"
                          :style="{ width: `${uploadProgress}%` }"></div>
                      </div>
                    </div>

                    <div class="text-center text-sm text-[#d1c9c1]/60 mt-2">
                    <p>Files are securely stored using Supabase Storage</p>
                    <p>Supported: PDF files up to 10MB</p>
                  </div>
                    <div v-if="certificateUrl" class="mt-4 p-3 bg-[#1a1612] rounded-lg border border-[#3a3631]">
                      <div class="flex items-center gap-2 text-sm">
                        <span class="text-[#d1c9c1]/70">Certificate URL:</span>
                        <a :href="certificateUrl" target="_blank"
                          class="text-[#e6902e] hover:text-[#f7b955] transition-colors flex-1 truncate">
                          View Certificate
                        </a>
                        <button type="button" class="text-[#d1c9c1] hover:text-white p-1"
                          @click="emit('copy-certificate-url')">
                          <ClipboardDocumentIcon class="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3 pt-4 border-t border-[#3a3631]">
            <button type="button" @click="emit('switch-tab', 'overview')"
              class="px-6 py-3 border border-[#3a3631] rounded-lg hover:bg-white/5 transition-colors">
              Cancel
            </button>
            <button type="submit"
              class="bg-gradient-to-r from-[#e6902e] to-[#f7b955] hover:from-[#f7b955] hover:to-[#e6902e] text-white px-8 py-3 rounded-lg font-medium transition-all flex items-center gap-2 shadow-lg shadow-[#e6902e]/20"
              :disabled="!isVerified || isUploading">
              <CheckBadgeIcon class="h-5 w-5" />
              Issue Credential
            </button>
          </div>
        </form>
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

input[type="date"]::-webkit-calendar-picker-indicator {
  filter: invert(0.8);
}
</style>