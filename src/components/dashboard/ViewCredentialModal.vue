<template>
  <Transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0"
    enter-to-class="opacity-100" leave-active-class="transition-all duration-200 ease-in" leave-from-class="opacity-100"
    leave-to-class="opacity-0">
    <div v-if="viewCredentialModal.isOpen"
      class="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="closeViewCredentialModal">

      <Transition enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 scale-95 translate-y-4" enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in" leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-4">
        <div v-if="viewCredentialModal.isOpen"
          class="relative bg-gradient-to-b from-[#252236] to-[#1f1d2c] rounded-2xl border border-[#e6902e]/30 shadow-2xl shadow-[#e6902e]/10 max-w-5xl w-full overflow-hidden max-h-[90vh] overflow-y-auto">

          
          <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e6902e]/40 to-transparent">
          </div>

          
          <div class="flex justify-between items-center border-b border-[#e6902e]/20 p-6">
            <div class="flex items-center gap-4">
              <div class="h-12 w-12 bg-[#e6902e]/15 rounded-xl flex items-center justify-center">
                <ShieldCheckIcon class="h-7 w-7 text-[#e6902e]" />
              </div>
              <div>
                <h3 class="font-bold text-xl text-white">Credential Details</h3>
                <p class="text-sm text-[#9b9182]">Comprehensive credential information</p>
              </div>
            </div>
            <button @click="closeViewCredentialModal"
              class="p-2 rounded-full hover:bg-[#e6902e]/10 transition-all duration-200 group">
              <XMarkIcon class="h-6 w-6 text-gray-400 group-hover:text-[#e6902e] transition-colors" />
            </button>
          </div>

          <div class="p-6" v-if="viewCredentialModal.credential">
            <div class="grid lg:grid-cols-3 gap-8">
              <div class="space-y-6">
                <div class="relative">
                  <div
                    :class="[`h-2 rounded-t-xl bg-gradient-to-r`, `from-${viewCredentialModal.color}-500`, `to-${viewCredentialModal.color}-600`]">
                  </div>

                  <div class="bg-gradient-to-b from-[#2a2838] to-[#252236] p-6 rounded-b-xl border border-[#e6902e]/20 border-t-0">
                    <div class="flex justify-center mb-6">
                      <div :class="[
                        'w-20 h-20 rounded-2xl flex items-center justify-center ring-4 ring-offset-4 ring-offset-[#252236] transition-all duration-300 shadow-lg',
                        `bg-${viewCredentialModal.color}-900/40 ring-${viewCredentialModal.color}-500/30 text-${viewCredentialModal.color}-400`
                      ]">
                        <BookOpenIcon class="h-10 w-10" />
                      </div>
                    </div>

                    <h4 class="text-xl font-bold text-white text-center mb-3">
                      {{ viewCredentialModal.credential.credentialName }}
                    </h4>
                    <p class="text-[#9b9182] text-center text-sm mb-6 font-medium">
                      {{ viewCredentialModal.credential.organizationName }}
                    </p>
                    
                    <div class="flex flex-col gap-3">
                      <div class="flex justify-center">
                        <div v-if="viewCredentialModal.credential.skillLevel" :class="[
                          'px-4 py-2 rounded-full border font-medium text-sm',
                          getSkillLevelClass(viewCredentialModal.credential.skillLevel)
                        ]">
                          {{ viewCredentialModal.credential.skillLevel }} Level
                        </div>
                      </div>
                      <div class="flex justify-center">
                        <div :class="[
                          'px-4 py-2 rounded-full border font-medium text-sm flex items-center gap-2',
                          viewCredentialModal.credential.status ? 
                            'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 
                            'bg-red-500/20 text-red-300 border-red-500/30'
                        ]">
                          <div :class="[
                            'w-2 h-2 rounded-full',
                            viewCredentialModal.credential.status ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'
                          ]"></div>
                          {{ viewCredentialModal.credential.status ? 'Active & Verified' : 'Revoked' }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="bg-[#2a2838]/50 rounded-xl p-4 border border-[#e6902e]/10">
                  <h4 class="text-sm font-semibold text-[#e6902e] mb-3 uppercase tracking-wide">Quick Actions</h4>
                  <div class="space-y-2">
                    <button
                      v-if="viewCredentialModal.credential.certificateUrl"
                      @click="viewCertificate"
                      class="w-full bg-[#1f1d2c]/80 hover:bg-[#1f1d2c] border border-[#e6902e]/10 hover:border-[#e6902e]/30 rounded-lg p-3 text-left transition-all flex items-center gap-3"
                    >
                      <DocumentIcon class="h-5 w-5 text-[#e6902e]" />
                      <div>
                        <div class="text-white font-medium text-sm">View Certificate</div>
                        <div class="text-[#9b9182] text-xs">Open original document</div>
                      </div>
                      <ArrowTopRightOnSquareIcon class="h-4 w-4 text-[#9b9182] ml-auto" />
                    </button>
                    
                    <button
                      v-if="viewCredentialModal.credential.id"
                      @click="viewOnBlockchain"
                      class="w-full bg-[#1f1d2c]/80 hover:bg-[#1f1d2c] border border-[#e6902e]/10 hover:border-[#e6902e]/30 rounded-lg p-3 text-left transition-all flex items-center gap-3"
                    >
                      <LinkIcon class="h-5 w-5 text-[#e6902e]" />
                      <div>
                        <div class="text-white font-medium text-sm">View on Blockchain</div>
                        <div class="text-[#9b9182] text-xs">Verify on explorer</div>
                      </div>
                      <ArrowTopRightOnSquareIcon class="h-4 w-4 text-[#9b9182] ml-auto" />
                    </button>

                    <button
                      @click="shareCredential"
                      class="w-full bg-[#1f1d2c]/80 hover:bg-[#1f1d2c] border border-[#e6902e]/10 hover:border-[#e6902e]/30 rounded-lg p-3 text-left transition-all flex items-center gap-3"
                    >
                      <ShareIcon class="h-5 w-5 text-[#e6902e]" />
                      <div>
                        <div class="text-white font-medium text-sm">Share Credential</div>
                        <div class="text-[#9b9182] text-xs">Generate QR code</div>
                      </div>
                      <LinkIcon class="h-4 w-4 text-[#9b9182] ml-auto" />
                    </button>
                  </div>
                </div>
              </div>

              <div class="lg:col-span-2 space-y-6">
                <div class="bg-[#2a2838]/50 rounded-xl p-6 border border-[#e6902e]/10">
                  <h4 class="text-lg font-semibold text-[#e6902e] mb-4 flex items-center gap-2">
                    <InformationCircleIcon class="h-5 w-5" />
                    Description
                  </h4>
                  <p class="text-gray-200 leading-relaxed">
                    {{ viewCredentialModal.credential.description || 'No description provided for this credential.' }}
                  </p>
                </div>

                <div class="grid md:grid-cols-2 gap-6">
                  <div class="bg-[#2a2838]/50 rounded-xl p-6 border border-[#e6902e]/10">
                    <h4 class="text-sm font-semibold text-[#e6902e] mb-4 uppercase tracking-wide flex items-center gap-2">
                      <CalendarIcon class="h-4 w-4" />
                      Issue Date
                    </h4>
                    <div class="space-y-2">
                      <p class="text-white text-lg font-semibold">{{ formatDate(viewCredentialModal.credential.issuedDate) }}</p>
                      <p class="text-[#9b9182] text-sm">{{ getRelativeTime(viewCredentialModal.credential.issuedDate) }}</p>
                    </div>
                  </div>
                  
                  <div v-if="viewCredentialModal.credential.expiryDate" class="bg-[#2a2838]/50 rounded-xl p-6 border border-[#e6902e]/10">
                    <h4 class="text-sm font-semibold text-[#e6902e] mb-4 uppercase tracking-wide flex items-center gap-2">
                      <ClockIcon class="h-4 w-4" />
                      Expiry Date
                    </h4>
                    <div class="space-y-2">
                      <p class="text-white text-lg font-semibold">{{ formatDate(viewCredentialModal.credential.expiryDate) }}</p>
                      <p :class="[
                        'text-sm font-medium',
                        isExpired(viewCredentialModal.credential.expiryDate) ? 'text-red-400' : 'text-emerald-400'
                      ]">
                        {{ getExpiryStatus(viewCredentialModal.credential.expiryDate) }}
                      </p>
                    </div>
                  </div>
                  
                  <div v-else class="bg-[#2a2838]/50 rounded-xl p-6 border border-[#e6902e]/10">
                    <h4 class="text-sm font-semibold text-[#e6902e] mb-4 uppercase tracking-wide flex items-center gap-2">
                      <span class="text-lg">∞</span>
                      Validity
                    </h4>
                    <div class="space-y-2">
                      <p class="text-white text-lg font-semibold">No Expiration</p>
                      <p class="text-emerald-400 text-sm font-medium">Valid indefinitely</p>
                    </div>
                  </div>
                </div>

                <div class="bg-[#2a2838]/50 rounded-xl p-6 border border-[#e6902e]/10">
                  <h4 class="text-lg font-semibold text-[#e6902e] mb-4 flex items-center gap-2">
                    <CogIcon class="h-5 w-5" />
                    Technical Information
                  </h4>
                  <div class="grid gap-4">
                    <div>
                      <label class="text-xs text-[#9b9182] uppercase tracking-wide font-semibold">Credential ID</label>
                      <div class="bg-[#1f1d2c]/80 p-3 rounded-lg border border-[#e6902e]/10 mt-2">
                        <p class="text-white font-mono text-sm break-all">{{ viewCredentialModal.credential.id }}</p>
                      </div>
                    </div>

                    <div>
                      <label class="text-xs text-[#9b9182] uppercase tracking-wide font-semibold">Issuer Address</label>
                      <div class="bg-[#1f1d2c]/80 p-3 rounded-lg border border-[#e6902e]/10 mt-2">
                        <div class="flex items-center justify-between">
                          <p class="text-gray-200 font-mono text-sm break-all flex-1">{{ viewCredentialModal.credential.issuer }}</p>
                          <button
                            @click="copyToClipboard(viewCredentialModal.credential.issuer)"
                            class="ml-3 p-1 hover:bg-[#e6902e]/20 rounded transition-colors"
                            title="Copy address"
                          >
                            <ClipboardIcon class="h-4 w-4 text-[#e6902e]" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div v-if="viewCredentialModal.credential.id">
                      <label class="text-xs text-[#9b9182] uppercase tracking-wide font-semibold">Transaction Hash</label>
                      <div class="bg-[#1f1d2c]/80 p-3 rounded-lg border border-[#e6902e]/10 mt-2">
                        <div class="flex items-center justify-between">
                          <p class="text-gray-200 font-mono text-sm break-all flex-1">{{ viewCredentialModal.credential.id }}</p>
                          <div class="flex items-center gap-2 ml-3">
                            <button
                              @click="copyToClipboard(viewCredentialModal.credential.id)"
                              class="p-1 hover:bg-[#e6902e]/20 rounded transition-colors"
                              title="Copy hash"
                            >
                              <ClipboardIcon class="h-4 w-4 text-[#e6902e]" />
                            </button>
                            <button
                              @click="viewOnBlockchain"
                              class="p-1 hover:bg-[#e6902e]/20 rounded transition-colors"
                              title="View on explorer"
                            >
                              <ArrowTopRightOnSquareIcon class="h-4 w-4 text-[#e6902e]" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div class="grid md:grid-cols-2 gap-4">
                      <div v-if="viewCredentialModal.credential.skillLevel">
                        <label class="text-xs text-[#9b9182] uppercase tracking-wide font-semibold">Skill Level</label>
                        <div class="bg-[#1f1d2c]/80 p-3 rounded-lg border border-[#e6902e]/10 mt-2">
                          <div :class="[
                            'inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium',
                            getSkillLevelClass(viewCredentialModal.credential.skillLevel)
                          ]">
                            <component :is="getSkillLevelIcon(viewCredentialModal.credential.skillLevel)" class="h-4 w-4" />
                            {{ viewCredentialModal.credential.skillLevel }}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <label class="text-xs text-[#9b9182] uppercase tracking-wide font-semibold">Status</label>
                        <div class="bg-[#1f1d2c]/80 p-3 rounded-lg border border-[#e6902e]/10 mt-2">
                          <div :class="[
                            'inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium',
                            viewCredentialModal.credential.status ? 
                              'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 
                              'bg-red-500/20 text-red-300 border border-red-500/30'
                          ]">
                            <div :class="[
                              'w-2 h-2 rounded-full',
                              viewCredentialModal.credential.status ? 'bg-emerald-400' : 'bg-red-400'
                            ]"></div>
                            {{ viewCredentialModal.credential.status ? 'Active' : 'Revoked' }}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="viewCredentialModal.credential.certificateUrl" class="bg-[#2a2838]/50 rounded-xl p-6 border border-[#e6902e]/10">
                  <h4 class="text-lg font-semibold text-[#e6902e] mb-4 flex items-center gap-2">
                    <DocumentIcon class="h-5 w-5" />
                    Certificate Document
                  </h4>
                  <div class="bg-[#1f1d2c]/80 rounded-lg p-4 border border-[#e6902e]/10">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-3">
                        <div class="p-3 bg-[#e6902e]/20 rounded-lg">
                          <DocumentIcon class="h-6 w-6 text-[#e6902e]" />
                        </div>
                        <div>
                          <div class="text-white font-medium">Original Certificate</div>
                          <div class="text-[#9b9182] text-sm">Click to view the official document</div>
                        </div>
                      </div>
                      <button
                        @click="viewCertificate"
                        class="bg-[#e6902e]/20 hover:bg-[#e6902e]/30 text-[#e6902e] px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 hover:scale-105"
                      >
                        <EyeIcon class="h-4 w-4" />
                        View Certificate
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="border-t border-[#e6902e]/20 p-6 bg-gradient-to-r from-[#252236]/50 to-[#1f1d2c]/50">
            <div class="flex justify-between items-center">
              <div class="text-sm text-[#9b9182]">
                This credential is verified and stored on the blockchain
              </div>
              <button @click="closeViewCredentialModal"
                class="px-6 py-3 bg-gradient-to-r from-[#e6902e] to-[#d4851f] hover:from-[#f29d32] hover:to-[#e6902e] text-white rounded-lg font-semibold shadow-lg shadow-[#e6902e]/30 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]">
                Close
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import {
  XMarkIcon,
  BookOpenIcon,
  ShieldCheckIcon,
  DocumentIcon,
  EyeIcon,
  LinkIcon,
  ShareIcon,
  CalendarIcon,
  ClockIcon,
  InformationCircleIcon,
  CogIcon,
  ClipboardIcon,
  ArrowTopRightOnSquareIcon,
  TrophyIcon,
  FireIcon,
  StarIcon,
  SparklesIcon
} from '@heroicons/vue/24/outline';
import { EXPLORER_BASE_URL } from '../../config';
import { useToast } from '../../composables/useToast';
import type { Credential } from '../../types/credentials.type';

const props = defineProps<{
  viewCredentialModal: {
    isOpen: boolean,
    credential: Credential,
    color: string
  }
}>();

const emit = defineEmits(['share-credential']);
const { success: successToast, error } = useToast();

const closeViewCredentialModal = () => {
  props.viewCredentialModal.isOpen = false;
};

const viewCertificate = () => {
  if (props.viewCredentialModal.credential.certificateUrl) {
    window.open(props.viewCredentialModal.credential.certificateUrl, '_blank');
  }
};

const viewOnBlockchain = () => {
  if (props.viewCredentialModal.credential.id) {
    const explorerUrl = `${EXPLORER_BASE_URL}/tx/${props.viewCredentialModal.credential.id}`;
    window.open(explorerUrl, '_blank');
  }
};

const shareCredential = () => {
  emit('share-credential', props.viewCredentialModal.credential);
  closeViewCredentialModal();
};

const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    successToast('Copied', 'Text copied to clipboard');
  } catch (err) {
    error('Copy Failed', 'Failed to copy to clipboard');
  }
};

const formatDate = (dateValue: string | Date | null | undefined) => {
  if (!dateValue) return 'Not specified';
  
  try {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return 'Invalid date';
    
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric"
    });
  } catch (error) {
    return 'Invalid date';
  }
};

const getRelativeTime = (dateValue: string | Date | null | undefined) => {
  if (!dateValue) return '';
  
  try {
    const date = new Date(dateValue);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 30) return `${diffDays} days ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  } catch (error) {
    return '';
  }
};

const isExpired = (expiryDate: string | Date | null | undefined) => {
  if (!expiryDate) return false;
  return new Date(expiryDate) < new Date();
};

const getExpiryStatus = (expiryDate: string | Date | null | undefined) => {
  if (!expiryDate) return '';
  
  const expiry = new Date(expiryDate);
  const now = new Date();
  
  if (expiry < now) return 'Expired';
  
  const diffTime = expiry.getTime() - now.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return 'Expires tomorrow';
  if (diffDays < 30) return `Expires in ${diffDays} days`;
  if (diffDays < 365) return `Expires in ${Math.floor(diffDays / 30)} months`;
  return `Expires in ${Math.floor(diffDays / 365)} years`;
};

const getSkillLevelClass = (level: string) => {
  switch (level) {
    case 'Expert':
      return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    case 'Advanced':
      return 'bg-red-500/20 text-red-300 border-red-500/30';
    case 'Intermediate':
      return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    default:
      return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  }
};

const getSkillLevelIcon = (level: string) => {
  switch (level) {
    case 'Expert': return TrophyIcon;
    case 'Advanced': return FireIcon;
    case 'Intermediate': return StarIcon;
    default: return SparklesIcon;
  }
};
</script>