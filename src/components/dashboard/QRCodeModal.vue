<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isModalOpen"
      class="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="closeModal"
    >
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 scale-95 translate-y-4"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-4"
      >
        <div
          v-if="isModalOpen"
          class="relative bg-gradient-to-b from-[#252236] to-[#1f1d2c] rounded-2xl border border-[#e6902e]/30 shadow-2xl shadow-[#e6902e]/10 max-w-2xl w-full overflow-hidden"
        >
          
          <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e6902e]/40 to-transparent"></div>

          
          <div class="flex justify-between items-center border-b border-[#e6902e]/20 p-6">
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 bg-[#e6902e]/15 rounded-xl flex items-center justify-center">
                <ShareIcon class="h-6 w-6 text-[#e6902e]" />
              </div>
              <div>
                <h3 class="text-xl font-bold text-white">Share Credentials</h3>
                <p class="text-sm text-[#d1c9c1]/70">Generate secure QR code for verification</p>
              </div>
            </div>
            <button
              @click="closeModal"
              class="p-2 hover:bg-white/10 rounded-lg transition-colors text-[#d1c9c1] hover:text-white"
            >
              <XMarkIcon class="h-5 w-5" />
            </button>
          </div>

          
          <div v-if="currentStep === 1" class="p-6 space-y-6">
            
            <div class="bg-white/5 rounded-xl p-4 border border-white/10">
              <h4 class="text-sm font-semibold text-[#e6902e] mb-3 flex items-center gap-2">
                <CheckCircleIcon class="h-4 w-4" />
                Selected Credentials ({{ selectedCredentials.length }})
              </h4>
              <div class="space-y-2">
                <div
                  v-for="credential in selectedCredentials"
                  :key="credential.id"
                  class="flex items-center gap-3 bg-gradient-to-r from-[#2a2640]/50 to-[#252236]/50 px-3 py-2 rounded-lg border border-[#e6902e]/10"
                >
                  <div class="w-2 h-2 rounded-full bg-emerald-400"></div>
                  <span class="text-white text-sm font-medium">{{ credential.credentialName }}</span>
                  <span class="text-[#d1c9c1]/60 text-xs">{{ credential.organizationName }}</span>
                </div>
              </div>
            </div>

            
            <div class="space-y-4">
              <h4 class="text-lg font-semibold text-white mb-4">Share Settings</h4>
              
              
              <div>
                <label class="block text-sm font-medium text-[#d1c9c1] mb-2">
                  Description (Optional)
                </label>
                <textarea
                  v-model="shareForm.description"
                  placeholder="Add a note about this share..."
                  rows="3"
                  class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-[#d1c9c1]/50 focus:outline-none focus:ring-2 focus:ring-[#e6902e]/50 focus:border-[#e6902e]/50 resize-none"
                ></textarea>
              </div>

              
              <div>
                <label class="block text-sm font-medium text-[#d1c9c1] mb-2">
                  Expiry Date (Optional)
                </label>
                <input
                  v-model="shareForm.expiryDate"
                  type="datetime-local"
                  :min="minDateTime"
                  class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#e6902e]/50 focus:border-[#e6902e]/50"
                />
                <p class="text-xs text-[#d1c9c1]/50 mt-1">
                  Leave empty for no expiration
                </p>
              </div>

              
              <div>
                <label class="block text-sm font-medium text-[#d1c9c1] mb-2">
                  Access Limit (Optional)
                </label>
                <div class="flex items-center gap-3">
                  <input
                    v-model="enableAccessLimit"
                    type="checkbox"
                    class="w-4 h-4 text-[#e6902e] bg-white/5 border-white/10 rounded focus:ring-[#e6902e]/50"
                  />
                  <span class="text-sm text-[#d1c9c1]">Limit number of times this can be accessed</span>
                </div>
                <input
                  v-if="enableAccessLimit"
                  v-model.number="shareForm.allowedAccessCount"
                  type="number"
                  min="1"
                  max="100"
                  placeholder="Maximum access count"
                  class="w-full mt-2 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#e6902e]/50 focus:border-[#e6902e]/50"
                />
              </div>
            </div>

            
            <div class="flex justify-between gap-3 pt-4 border-t border-white/10">
              <button
                @click="closeModal"
                class="px-6 py-3 bg-white/10 hover:bg-white/20 text-[#d1c9c1] hover:text-white rounded-xl font-medium transition-all"
              >
                Cancel
              </button>
              <button
                @click="generateQRCode"
                :disabled="isLoading"
                class="px-6 py-3 bg-gradient-to-r from-[#e6902e] to-[#f7b955] hover:from-[#d17a26] hover:to-[#f0ab45] text-white rounded-xl font-medium transition-all hover:scale-105 shadow-lg shadow-[#e6902e]/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <QrCodeIcon v-if="!isLoading" class="h-5 w-5" />
                <div v-if="isLoading" class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                {{ isLoading ? 'Generating...' : 'Generate QR Code' }}
              </button>
            </div>
          </div>

          
          <div v-if="currentStep === 2" class="p-6 text-center space-y-6">
            
            <div class="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4">
              <div class="flex items-center justify-center gap-2 text-emerald-400 mb-2">
                <CheckCircleIcon class="h-5 w-5" />
                <span class="font-semibold">QR Code Generated Successfully!</span>
              </div>
              <p class="text-sm text-emerald-400/80">
                Share this QR code to allow others to verify your credentials
              </p>
            </div>

            
            <div class="flex justify-center">
              <div class="relative bg-white p-6 rounded-2xl shadow-lg">
                <img 
                  :src="currentQRUrl" 
                  alt="QR Code" 
                  class="w-64 h-64 rounded-lg"
                />
                <div class="absolute -bottom-2 -right-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-xs px-3 py-1.5 rounded-full flex items-center shadow-lg ring-2 ring-emerald-500/20">
                  <ShieldCheckIcon class="h-3 w-3 mr-1.5" />
                  Verified
                </div>
              </div>
            </div>

            
            <div class="bg-white/5 rounded-xl p-4 text-left space-y-3">
              <h4 class="text-sm font-semibold text-[#e6902e] flex items-center gap-2">
                <InformationCircleIcon class="h-4 w-4" />
                Share Information
              </h4>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                <div>
                  <span class="text-[#d1c9c1]/60">Credentials:</span>
                  <span class="text-white ml-2">{{ selectedCredentials.length }}</span>
                </div>
                
                <div v-if="shareForm.expiryDate">
                  <span class="text-[#d1c9c1]/60">Expires:</span>
                  <span class="text-white ml-2">{{ formatDateTime(shareForm.expiryDate) }}</span>
                </div>
                
                <div v-if="shareForm.allowedAccessCount">
                  <span class="text-[#d1c9c1]/60">Access Limit:</span>
                  <span class="text-white ml-2">{{ shareForm.allowedAccessCount }} times</span>
                </div>
                
                <div>
                  <span class="text-[#d1c9c1]/60">Created:</span>
                  <span class="text-white ml-2">{{ new Date().toLocaleString() }}</span>
                </div>
              </div>
            </div>

            
            <div class="bg-white/5 rounded-xl p-4">
              <label class="block text-sm font-medium text-[#d1c9c1] mb-2">
                Verification Link
              </label>
              <div class="flex items-center gap-2">
                <input
                  :value="currentVerificationLink"
                  readonly
                  class="flex-1 bg-white/10 border border-white/10 rounded-lg px-3 py-2 text-sm text-[#d1c9c1] focus:outline-none"
                />
                <button
                  @click="copyLink"
                  class="px-4 py-2 bg-[#e6902e]/20 hover:bg-[#e6902e]/30 text-[#e6902e] rounded-lg transition-colors flex items-center gap-2"
                >
                  <LinkIcon class="h-4 w-4" />
                  {{ linkCopied ? 'Copied!' : 'Copy' }}
                </button>
              </div>
            </div>

            
            <div class="flex justify-between gap-3 pt-4 border-t border-white/10">
              <button
                @click="goBack"
                class="px-6 py-3 bg-white/10 hover:bg-white/20 text-[#d1c9c1] hover:text-white rounded-xl font-medium transition-all"
              >
                Back
              </button>
              <button
                @click="closeModal"
                class="px-6 py-3 bg-gradient-to-r from-[#e6902e] to-[#f7b955] hover:from-[#d17a26] hover:to-[#f0ab45] text-white rounded-xl font-medium transition-all hover:scale-105 shadow-lg shadow-[#e6902e]/25"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { 
  XMarkIcon,
  ShareIcon,
  QrCodeIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  InformationCircleIcon,
  LinkIcon
} from '@heroicons/vue/24/outline';
import type { Credential } from '../../types/credentials.type';
import { useCredentialSharing } from '../../composables/useCredentialSharing';
import { useToast } from '../../composables/useToast';

interface Props {
  isModalOpen: boolean;
  selectedCredentials: Credential[];
}

interface Emits {
  (e: 'update:isModalOpen', value: boolean): void;
  (e: 'qr-generated', data: any): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { shareCredentials, isLoading } = useCredentialSharing();
const { success } = useToast();

// Form state
const currentStep = ref(1);
const shareForm = ref({
  description: '',
  expiryDate: '',
  allowedAccessCount: 5
});
const enableAccessLimit = ref(false);
const currentQRUrl = ref('');
const currentVerificationLink = ref('');
const linkCopied = ref(false);

// Computed
const minDateTime = computed(() => {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 30); // Minimum 30 minutes from now
  return now.toISOString().slice(0, 16);
});

// Methods
const closeModal = () => {
  emit('update:isModalOpen', false);
  resetForm();
};

const resetForm = () => {
  currentStep.value = 1;
  shareForm.value = {
    description: '',
    expiryDate: '',
    allowedAccessCount: 5
  };
  enableAccessLimit.value = false;
  currentQRUrl.value = '';
  currentVerificationLink.value = '';
  linkCopied.value = false;
};

const generateQRCode = async () => {
  const request = {
    credentialIds: props.selectedCredentials.map(cred => cred.id),
    description: shareForm.value.description || undefined,
    expiryDate: shareForm.value.expiryDate ? new Date(shareForm.value.expiryDate) : undefined,
    allowedAccessCount: enableAccessLimit.value ? shareForm.value.allowedAccessCount : undefined
  };

  const result = await shareCredentials(request);
  
  if (result) {
    currentQRUrl.value = result.qrCodeUrl;
    currentVerificationLink.value = result.verificationUrl;
    currentStep.value = 2;
    
    emit('qr-generated', {
      shareId: result.shareId,
      qrCodeUrl: result.qrCodeUrl,
      verificationUrl: result.verificationUrl,
      credentials: props.selectedCredentials,
      ...shareForm.value
    });
  }
};

const goBack = () => {
  currentStep.value = 1;
};

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(currentVerificationLink.value);
    linkCopied.value = true;
    success('Link Copied', 'Verification link copied to clipboard');
    setTimeout(() => {
      linkCopied.value = false;
    }, 2000);
  } catch (error) {
    console.error('Failed to copy link:', error);
  }
};

const formatDateTime = (dateTimeString: string) => {
  return new Date(dateTimeString).toLocaleString();
};

// Watch for modal close to reset form
</script>