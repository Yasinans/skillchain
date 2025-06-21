<template>
  <Transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0"
    enter-to-class="opacity-100" leave-active-class="transition-all duration-200 ease-in" leave-from-class="opacity-100"
    leave-to-class="opacity-0">
    <div v-if="qrDetailsModal.isOpen"
      class="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      @click.self="closeModal">

      <Transition enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 scale-95 translate-y-4" enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in" leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-4">
        <div v-if="qrDetailsModal.isOpen"
          class="relative bg-gradient-to-b from-[#252236] to-[#1f1d2c] rounded-2xl border border-[#e6902e]/30 shadow-2xl shadow-[#e6902e]/10 max-w-4xl w-full overflow-hidden max-h-[90vh] overflow-y-auto">

          
          <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e6902e]/40 to-transparent">
          </div>

          
          <div class="flex justify-between items-center border-b border-[#e6902e]/20 p-6">
            <div class="flex items-center gap-3">
              <div class="h-10 w-10 bg-[#e6902e]/15 rounded-lg flex items-center justify-center">
                <QrCodeIcon class="h-6 w-6 text-[#e6902e]" />
              </div>
              <div>
                <h3 class="font-bold text-xl text-white">QR Code Details</h3>
                <p class="text-sm text-[#9b9182]">Shared credential verification</p>
              </div>
            </div>
            <button @click="closeModal"
              class="p-2 rounded-full hover:bg-[#e6902e]/10 transition-all duration-200 group">
              <XMarkIcon class="h-6 w-6 text-gray-400 group-hover:text-[#e6902e] transition-colors" />
            </button>
          </div>

          <div class="p-6" v-if="qrDetailsModal.qrCode">
            <div class="grid lg:grid-cols-2 gap-8">
              
              <div class="space-y-6">
                
                <div class="bg-white p-6 rounded-2xl shadow-lg">
                  <div class="text-center">
                    <img 
                      :src="qrDetailsModal.qrCodeUrl" 
                      alt="QR Code" 
                      class="w-64 h-64 mx-auto rounded-lg shadow-md"
                    />
                    <div class="mt-4 px-4 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm rounded-lg inline-flex items-center gap-2">
                      <CheckCircleIcon class="h-4 w-4" />
                      Ready to scan
                    </div>
                  </div>
                </div>

                
                <div class="space-y-3">
                  <h4 class="text-sm font-semibold text-[#e6902e] uppercase tracking-wide">Quick Actions</h4>
                  <div class="grid grid-cols-2 gap-3">
                    <button
                      @click="downloadQRCode"
                      class="bg-[#2a2838]/50 hover:bg-[#2a2838] border border-[#e6902e]/10 hover:border-[#e6902e]/30 rounded-lg p-3 text-center transition-all flex items-center justify-center gap-2 text-white hover:text-[#e6902e]"
                    >
                      <ArrowDownTrayIcon class="h-4 w-4" />
                      <span class="text-sm font-medium">Download</span>
                    </button>
                    <button
                      @click="copyVerificationLink"
                      class="bg-[#2a2838]/50 hover:bg-[#2a2838] border border-[#e6902e]/10 hover:border-[#e6902e]/30 rounded-lg p-3 text-center transition-all flex items-center justify-center gap-2 text-white hover:text-[#e6902e]"
                    >
                      <LinkIcon class="h-4 w-4" />
                      <span class="text-sm font-medium">Copy Link</span>
                    </button>
                  </div>
                </div>

                
                <div class="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <h4 class="text-sm font-semibold text-blue-400 mb-2 flex items-center gap-2">
                    <InformationCircleIcon class="h-4 w-4" />
                    How to Share
                  </h4>
                  <ul class="text-sm text-blue-300/80 space-y-1 list-disc list-inside">
                    <li>Display this QR code for others to scan</li>
                    <li>Share the verification link directly</li>
                    <li>Download and include in presentations</li>
                  </ul>
                </div>
              </div>

              
              <div class="space-y-6">
                
                <div class="bg-[#2a2838]/50 rounded-lg p-4 border border-[#e6902e]/10">
                  <h4 class="text-sm font-semibold text-[#e6902e] mb-3 uppercase tracking-wide flex items-center gap-2">
                    <ShieldCheckIcon class="h-4 w-4" />
                    Status Overview
                  </h4>
                  <div class="space-y-3">
                    <div class="flex justify-between items-center">
                      <span class="text-gray-300 text-sm">Current Status</span>
                      <div :class="[
                        'text-xs px-3 py-1 rounded-full font-medium',
                        getShareStatusInfo().bgColor,
                        getShareStatusInfo().color
                      ]">
                        {{ getShareStatusInfo().status }}
                      </div>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-gray-300 text-sm">Access Count</span>
                      <span class="text-white font-medium">{{ formatAccessInfo() }}</span>
                    </div>
                    <div v-if="qrDetailsModal.qrCode?.expiryDate" class="flex justify-between items-center">
                      <span class="text-gray-300 text-sm">Expires</span>
                      <span class="text-white font-medium">{{ formatDate(qrDetailsModal.qrCode.expiryDate) }}</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-gray-300 text-sm">Created</span>
                      <span class="text-white font-medium">{{ formatDate(qrDetailsModal.qrCode?.dateShared) }}</span>
                    </div>
                  </div>
                </div>

                
                <div class="bg-[#2a2838]/50 rounded-lg p-4 border border-[#e6902e]/10">
                  <h4 class="text-sm font-semibold text-[#e6902e] mb-3 uppercase tracking-wide">Shared Credentials</h4>
                  <div class="space-y-3">
                    <div
                      v-for="credential in qrDetailsModal.qrCode?.credentials || []"
                      :key="credential.id"
                      class="bg-gradient-to-r from-[#1f1d2c]/50 to-[#252236]/50 rounded-lg p-3 border border-[#e6902e]/10"
                    >
                      <div class="flex items-start gap-3">
                        <div :class="[
                          'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
                          getCredentialColor(credential)
                        ]">
                          <BookOpenIcon class="h-5 w-5" />
                        </div>
                        <div class="flex-1 min-w-0">
                          <h5 class="text-white font-medium text-sm">{{ credential.credentialName }}</h5>
                          <p class="text-[#9b9182] text-xs">{{ credential.organizationName }}</p>
                          <div class="flex items-center gap-2 mt-2">
                            <span v-if="credential.skillLevel" :class="[
                              'text-xs px-2 py-1 rounded-full border font-medium',
                              getSkillLevelClass(credential.skillLevel)
                            ]">
                              {{ credential.skillLevel }}
                            </span>
                            <span :class="[
                              'text-xs px-2 py-1 rounded-full border font-medium',
                              credential.status ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30'
                            ]">
                              {{ credential.status ? 'Active' : 'Revoked' }}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                
                <div class="bg-[#2a2838]/50 rounded-lg p-4 border border-[#e6902e]/10">
                  <h4 class="text-sm font-semibold text-[#e6902e] mb-3 uppercase tracking-wide">Technical Details</h4>
                  <div class="space-y-3">
                    <div>
                      <label class="text-xs text-[#9b9182] uppercase tracking-wide">Share ID</label>
                      <div class="bg-[#1f1d2c]/80 p-2 rounded border border-[#e6902e]/10 mt-1">
                        <p class="text-white font-mono text-xs break-all">{{ qrDetailsModal.qrCode?.id || 'N/A' }}</p>
                      </div>
                    </div>
                    <div>
                      <label class="text-xs text-[#9b9182] uppercase tracking-wide">Verification URL</label>
                      <div class="bg-[#1f1d2c]/80 p-2 rounded border border-[#e6902e]/10 mt-1">
                        <p class="text-gray-300 font-mono text-xs break-all">{{ getVerificationUrl() }}</p>
                      </div>
                    </div>
                    <div v-if="qrDetailsModal.qrCode?.description">
                      <label class="text-xs text-[#9b9182] uppercase tracking-wide">Description</label>
                      <div class="bg-[#1f1d2c]/80 p-2 rounded border border-[#e6902e]/10 mt-1">
                        <p class="text-white text-sm">{{ qrDetailsModal.qrCode.description }}</p>
                      </div>
                    </div>
                  </div>
                </div>

                
                <div v-if="(qrDetailsModal.qrCode?.accessCount || 0) > 0" class="bg-[#2a2838]/50 rounded-lg p-4 border border-[#e6902e]/10">
                  <h4 class="text-sm font-semibold text-[#e6902e] mb-3 uppercase tracking-wide flex items-center gap-2">
                    <ClockIcon class="h-4 w-4" />
                    Access Analytics
                  </h4>
                  <div class="grid grid-cols-2 gap-4">
                    <div class="text-center">
                      <div class="text-2xl font-bold text-white">{{ qrDetailsModal.qrCode?.accessCount || 0 }}</div>
                      <div class="text-xs text-[#9b9182]">Total Views</div>
                    </div>
                    <div class="text-center">
                      <div class="text-2xl font-bold text-white">{{ getRemainingAccess() }}</div>
                      <div class="text-xs text-[#9b9182]">Remaining</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          
          <div class="border-t border-[#e6902e]/20 p-6 bg-gradient-to-r from-[#252236]/50 to-[#1f1d2c]/50">
            <div class="flex justify-between items-center">
              <div class="text-sm text-[#9b9182]">
                Share this QR code to allow others to verify your credentials
              </div>
              <div class="flex gap-3">
                <button
                  v-if="qrDetailsModal.qrCode?.isActive"
                  @click="revokeAccess"
                  class="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
                >
                  <XMarkIcon class="h-4 w-4" />
                  Revoke Access
                </button>
                <button @click="closeModal"
                  class="px-6 py-2 bg-gradient-to-r from-[#e6902e] to-[#d4851f] hover:from-[#f29d32] hover:to-[#e6902e] text-white rounded-lg font-medium shadow-lg shadow-[#e6902e]/30 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]">
                  Close
                </button>
              </div>
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
  QrCodeIcon,
  BookOpenIcon,
  ShieldCheckIcon,
  ClockIcon,
  LinkIcon,
  ArrowDownTrayIcon,
  InformationCircleIcon,
  CheckCircleIcon
} from '@heroicons/vue/24/outline';
import { useToast } from '../../composables/useToast';
import type { SharedQR } from '../../types/credentials.type';

interface QRDetailsModalProps {
  qrDetailsModal: {
    isOpen: boolean;
    qrCode: SharedQR;
    qrCodeUrl: string;
  };
}

const props = defineProps<QRDetailsModalProps>();
const emit = defineEmits(['revoke-access']);
const { success: successToast, error } = useToast();

const closeModal = () => {
  props.qrDetailsModal.isOpen = false;
};

const downloadQRCode = async () => {
  try {
    const response = await fetch(props.qrDetailsModal.qrCodeUrl);
    const blob = await response.blob();
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'qr-code.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Failed to download QR code:', error);
  }
};

const copyVerificationLink = async () => {
  const verificationUrl = getVerificationUrl();
  
  try {
    await navigator.clipboard.writeText(verificationUrl);
    successToast('Link Copied', 'Verification link copied to clipboard');
  } catch (err) {
    error('Copy Failed', 'Failed to copy link to clipboard');
  }
};

const getVerificationUrl = () => {
  return `${window.location.origin}/verify/${props.qrDetailsModal.qrCode?.id || ''}`;
};

const revokeAccess = () => {
  emit('revoke-access', props.qrDetailsModal.qrCode);
  closeModal();
};

const formatDate = (dateValue: string | Date | null | undefined) => {
  if (!dateValue) return 'Not specified';
  
  try {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return 'Invalid date';
    
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  } catch (error) {
    return 'Invalid date';
  }
};

const formatAccessInfo = () => {
  const accessCount = props.qrDetailsModal.qrCode?.accessCount || 0;
  const maxAccessCount = props.qrDetailsModal.qrCode?.maxAccessCount;
  
  if (!maxAccessCount) {
    return `${accessCount} views`;
  }
  return `${accessCount}/${maxAccessCount} views`;
};

const getRemainingAccess = () => {
  const maxAccessCount = props.qrDetailsModal.qrCode?.maxAccessCount;
  const accessCount = props.qrDetailsModal.qrCode?.accessCount || 0;
  
  if (!maxAccessCount) return '∞';
  const remaining = maxAccessCount - accessCount;
  return Math.max(0, remaining);
};

const getShareStatusInfo = () => {
  const qrCode = props.qrDetailsModal.qrCode;
  
  if (!qrCode?.isActive) {
    return { status: 'Revoked', color: 'text-red-400', bgColor: 'bg-red-500/20' };
  }
  
  if (qrCode.expiryDate && new Date(qrCode.expiryDate) < new Date()) {
    return { status: 'Expired', color: 'text-orange-400', bgColor: 'bg-orange-500/20' };
  }
  
  if (qrCode.maxAccessCount && 
      (qrCode.accessCount || 0) >= qrCode.maxAccessCount) {
    return { status: 'Limit Reached', color: 'text-amber-400', bgColor: 'bg-amber-500/20' };
  }
  
  return { status: 'Active', color: 'text-emerald-400', bgColor: 'bg-emerald-500/20' };
};

const getCredentialColor = (credential: any) => {
  const colors = ['emerald', 'blue', 'purple', 'orange'];
  let hash = 0;
  for (let i = 0; i < credential.credentialName.length; i++) {
    const char = credential.credentialName.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const index = Math.abs(hash) % colors.length;
  const color = colors[index];
  
  return color === 'emerald' ? 'bg-emerald-900/40 text-emerald-400' :
         color === 'blue' ? 'bg-blue-900/40 text-blue-400' :
         color === 'purple' ? 'bg-purple-900/40 text-purple-400' :
         'bg-orange-900/40 text-orange-400';
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
</script>