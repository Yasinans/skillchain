<template>
  <div class="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a1612] to-[#0f0b0a] text-[#d1c9c1]">
    <Header />
    
    <main class="container mx-auto max-w-7xl px-4 py-8">
      
      <div class="mb-8">
        <div class="text-center mb-8">
          <h1 class="text-3xl md:text-4xl lg:text-4xl font-bold bg-gradient-to-r from-white via-[#e6902e] to-[#fac044] bg-clip-text text-transparent mb-4">
            My Dashboard
          </h1>
          <p class="text-lg text-[#9b9182] max-w-2xl mx-auto">
            Manage and share your verified professional credentials securely on the blockchain
          </p>
        </div>

        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 rounded-xl border border-emerald-500/20 p-6 hover:scale-105 transition-all duration-300 hover:border-emerald-500/40">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-emerald-400 text-sm font-medium">Total Credentials</p>
                <p class="text-2xl font-bold text-white">{{ credentials.length }}</p>
                <p class="text-xs text-emerald-400/60 mt-1">Active on blockchain</p>
              </div>
              <div class="bg-emerald-500/20 p-3 rounded-lg">
                <ShieldCheckIcon class="h-6 w-6 text-emerald-400" />
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-xl border border-blue-500/20 p-6 hover:scale-105 transition-all duration-300 hover:border-blue-500/40">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-blue-400 text-sm font-medium">Shared QR Codes</p>
                <p class="text-2xl font-bold text-white">{{ sharedQRCodes.length }}</p>
                <p class="text-xs text-blue-400/60 mt-1">{{ activeCodes.length }} active</p>
              </div>
              <div class="bg-blue-500/20 p-3 rounded-lg">
                <QrCodeIcon class="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-br from-purple-500/10 to-purple-600/5 rounded-xl border border-purple-500/20 p-6 hover:scale-105 transition-all duration-300 hover:border-purple-500/40">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-purple-400 text-sm font-medium">Total Views</p>
                <p class="text-2xl font-bold text-white">{{ getTotalViews() }}</p>
                <p class="text-xs text-purple-400/60 mt-1">Across all shares</p>
              </div>
              <div class="bg-purple-500/20 p-3 rounded-lg">
                <EyeIcon class="h-6 w-6 text-purple-400" />
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-br from-orange-500/10 to-orange-600/5 rounded-xl border border-orange-500/20 p-6 hover:scale-105 transition-all duration-300 hover:border-orange-500/40">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-orange-400 text-sm font-medium">Expert Level</p>
                <p class="text-2xl font-bold text-white">{{ getExpertCount() }}</p>
                <p class="text-xs text-orange-400/60 mt-1">Professional skills</p>
              </div>
              <div class="bg-orange-500/20 p-3 rounded-lg">
                <TrophyIcon class="h-6 w-6 text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        
        <div class="bg-white/5 rounded-xl p-1 border border-white/10 backdrop-blur-sm">
          <div class="flex">
            <button @click="activeTab = 'skills'" :class="[
              'flex-1 px-6 py-3 text-sm font-medium transition-all relative rounded-lg',
              activeTab === 'skills'
                ? 'bg-gradient-to-r from-orange-500/20 to-yellow-500/10 text-orange-400 border border-orange-500/30'
                : 'text-[#9b9182] hover:text-white hover:bg-white/5'
            ]">
              <div class="flex items-center justify-center gap-2">
                <ArrowTrendingUpIcon class="h-4 w-4" />
                My Verified Skills
              </div>
            </button>
            <button @click="activeTab = 'shared'" :class="[
              'flex-1 px-6 py-3 text-sm font-medium transition-all relative rounded-lg',
              activeTab === 'shared'
                ? 'bg-gradient-to-r from-orange-500/20 to-yellow-500/10 text-orange-400 border border-orange-500/30'
                : 'text-[#9b9182] hover:text-white hover:bg-white/5'
            ]">
              <div class="flex items-center justify-center gap-2">
                <QrCodeIcon class="h-4 w-4" />
                Shared Credentials
              </div>
            </button>
          </div>
        </div>
      </div>

      
      <div v-show="activeTab === 'skills'" class="space-y-8">
  
  <div class="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10 p-8">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      
      <div class="text-center">
        <div class="text-3xl font-bold text-white mb-2">{{ credentials.length }}</div>
        <div class="text-[#9b9182] text-sm uppercase tracking-wide">Total Credentials</div>
      </div>
      
      
      <div class="text-center">
        <div class="text-3xl font-bold text-emerald-400 mb-2">{{ validCredentials.length }}</div>
        <div class="text-[#9b9182] text-sm uppercase tracking-wide">Available to Share</div>
      </div>
      
      
      <div class="text-center">
        <div class="text-3xl font-bold text-yellow-400 mb-2">{{ getExpertCount() }}</div>
        <div class="text-[#9b9182] text-sm uppercase tracking-wide">Expert Level</div>
      </div>
      
      
      <div class="text-center">
        <div class="text-3xl font-bold text-orange-400 mb-2">{{ getTotalViews() }}</div>
        <div class="text-[#9b9182] text-sm uppercase tracking-wide">Total Views</div>
      </div>
    </div>
  </div>

  
  <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10 p-6">
    <div>
      <h2 class="text-2xl font-bold text-white mb-2">Your Credentials</h2>
      <p class="text-[#9b9182]">Select credentials to generate a QR code for sharing</p>
    </div>
    
    <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
      <button @click="refreshCredentials()" :disabled="isRefreshing" :class="[
        'px-4 py-3 bg-white/10 hover:bg-white/20 text-[#d1c9c1] hover:text-white rounded-xl text-sm font-medium transition-all border border-white/10',
        isRefreshing ? 'opacity-50 cursor-not-allowed' : ''
      ]">
        {{ isRefreshing ? 'Refreshing...' : 'Refresh' }}
      </button>
      
      <div class="bg-white/5 px-4 py-2 rounded-lg border border-white/10">
        <span class="text-sm text-[#9b9182]">Selected: </span>
        <span class="text-white font-medium">{{ selectedCredentials.length }}/{{ validCredentials.length }}</span>
        <span v-if="credentials.length !== validCredentials.length" class="text-orange-400 text-xs ml-2">
          ({{ credentials.length - validCredentials.length }} unavailable)
        </span>
      </div>
      
      <button @click="openShareModal()" 
        :disabled="selectedCredentials.length === 0 || selectedCredentials.filter(isCredentialValidForSharing).length === 0" 
        :class="[
          'px-6 py-3 rounded-xl text-sm font-medium transition-all flex items-center gap-2 shadow-lg',
          selectedCredentials.length === 0 || selectedCredentials.filter(isCredentialValidForSharing).length === 0
            ? 'bg-white/10 text-[#9b9182] cursor-not-allowed'
            : 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-105'
        ]">
        <ShareIcon class="h-4 w-4" />
        Generate QR Code
      </button>
    </div>
  </div>

  
  <div v-if="credentials.length > 0" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
    <div v-for="credential in sortedCredentials" :key="credential.id" 
      @click="isCredentialValidForSharing(credential) ? toggleCredential(credential) : null" 
      :class="[
        'group relative bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border backdrop-blur-sm transition-all duration-300 overflow-hidden hover:shadow-xl hover:shadow-white/5',
        isCredentialValidForSharing(credential) ? [
          'cursor-pointer hover:scale-[1.02]',
          isCredentialSelected(credential.id)
            ? 'border-orange-500/60 bg-gradient-to-br from-orange-500/10 to-yellow-500/5 shadow-lg shadow-orange-500/20'
            : 'border-white/10 hover:border-white/20'
        ] : [
          'cursor-not-allowed opacity-60',
          'border-gray-500/30'
        ]
      ]">
      
      
      <div v-if="!isCredentialValidForSharing(credential)" 
        class="absolute inset-0 bg-black/30 backdrop-blur-[1px] rounded-2xl flex items-center justify-center z-10">
        <div class="text-center">
          <XMarkIcon class="h-8 w-8 text-red-400 mx-auto mb-2" />
          <p class="text-red-400 text-sm font-medium">
            {{ isCredentialRevoked(credential) ? 'Revoked' : 'Expired' }}
          </p>
          <p class="text-gray-400 text-xs">Cannot be shared</p>
        </div>
      </div>

      
      <div v-if="isCredentialSelected(credential.id) && isCredentialValidForSharing(credential)" 
        class="absolute top-4 right-4 w-6 h-6 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-full flex items-center justify-center shadow-lg z-20">
        <CheckCircleIcon class="h-4 w-4 text-white" />
      </div>

      
      <div :class="[
        'h-1 w-full',
        isCredentialValidForSharing(credential) ? (
          getColorFromName(credential.credentialName) === 'emerald' ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' :
          getColorFromName(credential.credentialName) === 'blue' ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
          getColorFromName(credential.credentialName) === 'purple' ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
          'bg-gradient-to-r from-orange-500 to-orange-600'
        ) : 'bg-gradient-to-r from-gray-500 to-gray-600'
      ]"></div>

      <div class="p-6">
        
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <span v-if="credential.skillLevel" :class="[
              'text-xs px-3 py-1 rounded-full border font-medium',
              credential.skillLevel === 'Expert' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
              credential.skillLevel === 'Advanced' ? 'bg-red-500/20 text-red-300 border-red-500/30' :
              credential.skillLevel === 'Intermediate' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
              'bg-gray-500/20 text-gray-300 border-gray-500/30'
            ]">
              {{ credential.skillLevel }}
            </span>
            <span :class="[
              'text-xs px-3 py-1 rounded-full border font-medium',
              isCredentialValidForSharing(credential) ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-red-500/20 text-red-300 border-red-500/30'
            ]">
              {{ isCredentialRevoked(credential) ? 'Revoked' : isCredentialExpired(credential) ? 'Expired' : 'Active' }}
            </span>
          </div>
        </div>

        
        <h3 class="text-lg font-bold text-white mb-2 group-hover:text-orange-300 transition-colors">
          {{ credential.credentialName }}
        </h3>
        <p class="text-[#9b9182] text-sm mb-4 flex items-center gap-2">
          <BuildingOfficeIcon class="h-4 w-4" />
          {{ credential.organizationName }}
        </p>

        
        <div class="space-y-2 text-xs text-[#9b9182]">
          <div class="flex items-center gap-2">
            <CalendarIcon class="h-3 w-3" />
            <span>Issued: {{ formatDate(credential.issuedDate) }}</span>
          </div>
          <div v-if="credential.expiryDate" class="flex items-center gap-2">
            <ClockIcon class="h-3 w-3" />
            <span :class="isCredentialExpired(credential) ? 'text-red-400' : ''">
              Expires: {{ formatDate(credential.expiryDate) }}
            </span>
          </div>
        </div>

        
        <div class="flex gap-2 mt-4 pt-4 border-t border-white/10">
          <button
            @click.stop="openViewCredential(credential)"
            class="flex-1 bg-white/10 hover:bg-white/20 text-[#d1c9c1] hover:text-white px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1"
          >
            <EyeIcon class="h-3 w-3" />
            View Details
          </button>
          <button
            v-if="credential.certificateUrl"
            @click.stop="viewCertificate(credential)"
            class="flex-1 bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 hover:text-orange-200 px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1"
          >
            <DocumentIcon class="h-3 w-3" />
            Certificate
          </button>
        </div>
      </div>
    </div>
  </div>

  
  <div v-if="credentials.length === 0"
    class="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10 p-12 text-center">
    <div class="mx-auto w-20 h-20 bg-gradient-to-br from-orange-500/20 to-yellow-500/20 rounded-2xl flex items-center justify-center mb-6">
      <ShieldCheckIcon class="h-10 w-10 text-orange-400" />
    </div>
    <h3 class="text-2xl font-bold text-white mb-3">No Credentials Found</h3>
    <p class="text-[#9b9182] mb-8 max-w-md mx-auto">
      You don't have any verified credentials yet.
    </p>
  </div>

  
  <div v-if="credentials.length > 0 && validCredentials.length === 0"
    class="bg-gradient-to-br from-red-500/10 to-red-600/5 rounded-2xl border border-red-500/20 p-8 text-center">
    <div class="mx-auto w-16 h-16 bg-red-500/20 rounded-2xl flex items-center justify-center mb-4">
      <ExclamationCircleIcon class="h-8 w-8 text-red-400" />
    </div>
    <h3 class="text-xl font-bold text-white mb-2">No Valid Credentials Available</h3>
    <p class="text-red-400 mb-4">
      All your credentials are either revoked or expired and cannot be shared.
    </p>
    <p class="text-[#9b9182] text-sm">
      Contact the issuing organizations to renew expired credentials.
    </p>
  </div>
</div>

      
      <div v-if="activeTab === 'shared'">
        <div class="bg-gradient-to-r from-white/5 to-white/[0.02] rounded-xl border border-white/10 backdrop-blur-sm mb-8">
          <div class="p-6">
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div class="flex items-center gap-4">
                <div class="bg-gradient-to-br from-blue-500/20 to-purple-500/20 p-3 rounded-lg">
                  <QrCodeIcon class="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h2 class="text-xl font-bold text-white">Shared Credentials</h2>
                  <p class="text-[#9b9182]">Manage and track your shared credential QR codes</p>
                </div>
              </div>
              <button
                @click="refreshSharedCredentials"
                :disabled="isLoading"
                class="bg-white/10 hover:bg-white/20 text-[#d1c9c1] hover:text-white px-4 py-2 rounded-lg text-sm transition-all flex items-center gap-2 disabled:opacity-50 hover:scale-105"
              >
                <svg v-if="!isLoading" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <div v-else class="w-4 h-4 border-2 border-[#d1c9c1]/30 border-t-[#d1c9c1] rounded-full animate-spin"></div>
                {{ isLoading ? 'Loading...' : 'Refresh' }}
              </button>
            </div>
          </div>
        </div>

        <div class="space-y-8">
          
          <div v-if="activeCodes.length > 0">
            <h3 class="text-lg font-semibold text-white mb-4 flex items-center">
              <div class="bg-emerald-500/20 p-2 rounded-lg mr-3">
                <ShieldCheckIcon class="h-5 w-5 text-emerald-400" />
              </div>
              Active Shares ({{ activeCodes.length }})
            </h3>

            <div class="grid gap-4">
              <div v-for="qrCode in activeCodes" :key="qrCode.id"
                class="bg-gradient-to-r from-emerald-500/10 to-teal-500/5 rounded-xl border border-emerald-500/20 p-6 hover:border-emerald-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10">
                <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <QrCodeIcon class="h-5 w-5 text-emerald-400" />
                      <h4 class="text-white font-semibold text-lg">{{ formatCredentialsList(qrCode.credentials) }}</h4>
                      <div :class="[
                        'text-xs px-3 py-1 rounded-full font-medium',
                        getShareStatusInfo(qrCode).bgColor,
                        getShareStatusInfo(qrCode).color
                      ]">
                        {{ getShareStatusInfo(qrCode).status }}
                      </div>
                    </div>
                    <div class="text-sm text-[#9b9182] space-y-1">
                      <p class="flex items-center gap-2">
                        <ClockIcon class="h-4 w-4" />
                        Originally shared on {{ qrCode.dateShared }}
                      </p>
                      <p class="flex items-center gap-2">
                        <EyeIcon class="h-4 w-4" />
                        {{ formatAccessInfo(qrCode) }}
                      </p>
                      <p v-if="qrCode.expiryDate" class="flex items-center gap-2">
                        <CalendarIcon class="h-4 w-4" />
                        {{ formatExpiryInfo(qrCode) }}
                      </p>
                    </div>
                  </div>
                  
                  <div class="flex items-center gap-3">
                    <button
                      @click="openQRDetails(qrCode)"
                      class="bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 hover:text-blue-200 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 hover:scale-105"
                    >
                      <EyeIcon class="h-4 w-4" />
                      View Details
                    </button>
                    <button
                      @click="copyShareLink(qrCode)"
                      class="bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 hover:text-purple-200 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 hover:scale-105"
                    >
                      <LinkIcon class="h-4 w-4" />
                      Copy Link
                    </button>
                    <button
                      @click="openRevokeConfirmation(qrCode)"
                      class="bg-red-500/20 hover:bg-red-500/30 text-red-300 hover:text-red-200 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 hover:scale-105"
                    >
                      <XMarkIcon class="h-4 w-4" />
                      Revoke
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          
          <div v-if="expiredCodes.length > 0">
            <h3 class="text-lg font-semibold text-white mb-4 flex items-center">
              <div class="bg-gray-500/20 p-2 rounded-lg mr-3">
                <ExclamationCircleIcon class="h-5 w-5 text-gray-400" />
              </div>
              Inactive Shares ({{ expiredCodes.length }})
            </h3>

            <div class="grid gap-4">
              <div v-for="qrCode in expiredCodes" :key="qrCode.id"
                class="bg-gradient-to-r from-gray-500/5 to-gray-600/[0.02] rounded-xl border border-gray-500/20 p-6 opacity-75">
                <div class="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                  <div class="flex-1">
                    <div class="flex items-center gap-3 mb-2">
                      <QrCodeIcon class="h-5 w-5 text-gray-400" />
                      <h4 class="text-gray-300 font-semibold">{{ formatCredentialsList(qrCode.credentials) }}</h4>
                      <div :class="[
                        'text-xs px-3 py-1 rounded-full font-medium',
                        getShareStatusInfo(qrCode).bgColor,
                        getShareStatusInfo(qrCode).color
                      ]">
                        {{ getShareStatusInfo(qrCode).status }}
                      </div>
                    </div>
                    <div class="text-sm text-gray-500 space-y-1">
                      <p class="flex items-center gap-2">
                        <ClockIcon class="h-4 w-4" />
                        Originally shared on {{ qrCode.dateShared }}
                      </p>
                      <p>{{ formatAccessInfo(qrCode) }}</p>
                    </div>
                  </div>
                  
                  <div class="flex items-center gap-3">
                    <button
                      @click="openQRDetails(qrCode)"
                      class="bg-gray-500/20 hover:bg-gray-500/30 text-gray-300 hover:text-gray-200 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
                    >
                      <EyeIcon class="h-4 w-4" />
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          
          <div v-if="sharedQRCodes.length === 0"
            class="bg-gradient-to-br from-white/5 to-white/[0.02] rounded-2xl border border-white/10 p-12 text-center">
            <div
              class="mx-auto w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl flex items-center justify-center mb-6">
              <QrCodeIcon class="h-10 w-10 text-blue-400" />
            </div>
            <h3 class="text-2xl font-bold text-white mb-3">No Shared Credentials</h3>
            <p class="text-[#9b9182] mb-8 max-w-md mx-auto">
              You haven't shared any credentials via QR code yet. Go to your skills to start sharing.
            </p>
            <button @click="activeTab = 'skills'"
              class="bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white px-8 py-3 rounded-xl font-medium transition-all hover:scale-105 shadow-lg shadow-orange-500/25">
              Share Credentials
            </button>
          </div>
        </div>
      </div>
    </main>

    
    <LoadingModal :title="'Processing Request'" :message="'Please wait while we process your request'"
      :isLoading="isLoading" />
    
    <QRCodeModal 
      v-model:isModalOpen="isShareModalOpen"
      :selectedCredentials="selectedCredentials"
      @qr-generated="handleQRGenerated"
    />
    
    <ViewCredentialModal 
      :viewCredentialModal="viewCredentialModal"
      @share-credential="handleShareFromModal"
    />
    <QRDetailsModal 
      :qrDetailsModal="qrDetailsModal"
      @revoke-access="handleRevokeQRCode"
    />
    <ConfirmationModal :confirmationModal="confirmationModal" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useUserStore } from '../stores/user';
import { useCredentialSharing } from '../composables/useCredentialSharing';
import { useToast } from '../composables/useToast';
import Header from '../components/Header.vue';
import ViewCredentialModal from '../components/dashboard/ViewCredentialModal.vue';
import QRDetailsModal from '../components/dashboard/QRDetailsModal.vue';
import ConfirmationModal from '../components/ConfirmationModal.vue';
import LoadingModal from '../components/LoadingModal.vue';
import QRCodeModal from '../components/dashboard/QRCodeModal.vue';
import type { Credential, SharedQR } from '../types/credentials.type';
import type { ConfirmationModalData } from '../types/modals.type';
import {
  ShareIcon,
  EyeIcon,
  XMarkIcon, 
  CalendarIcon,
  BuildingOfficeIcon,
  QrCodeIcon,
  ShieldCheckIcon,
  ClockIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  TrophyIcon,
  ArrowTrendingUpIcon,
  DocumentIcon,
  LinkIcon
} from '@heroicons/vue/24/outline';

const selectedCredentials = ref<Credential[]>([]);
const isShareModalOpen = ref(false);
const isLoading = ref(false);
const isRefreshing = ref(false);
const activeTab = ref('skills');
const confirmationModal = ref<ConfirmationModalData>({
  isOpen: false,
  type: '',
  title: '',
  message: '',
  actionType: '',
  action: () => { }
});
const viewCredentialModal = ref({
  isOpen: false,
  credential: {} as Credential,
  color: ''
});
const qrDetailsModal = ref({
  isOpen: false,
  qrCode: {} as SharedQR,
  qrCodeUrl: ''
});

const userStore = useUserStore();
const { credentials } = storeToRefs(userStore);
const { success: successToast, error } = useToast();

const {
  sharedQRCodes,
  activeCodes,
  expiredCodes,
  revokeSharedAccess,
  loadSharedCredentials,
  isShareExpired,
  hasReachedMaxAccess
} = useCredentialSharing();

onMounted(async () => {
  if (userStore.address && userStore.credentials.length > 0) {
    await loadSharedCredentials();
  }
});

watch(() => userStore.credentials, async (newCredentials) => {
  if (newCredentials.length > 0 && userStore.address) {
    await loadSharedCredentials();
  }
}, { deep: true });

watch(() => userStore.address, async (newAddress) => {
  if (newAddress) {
    await loadSharedCredentials();
  } 
});

function getColorFromName(name: string): string {
  const colors = ['emerald', 'blue', 'purple', 'orange'];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    const char = name.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
}

const formatCredentialsList = (credentials: Credential[]) => {
  if (credentials.length === 1) {
    return credentials[0].credentialName;
  } else if (credentials.length === 2) {
    return `${credentials[0].credentialName} and ${credentials[1].credentialName}`;
  } else {
    return `${credentials[0].credentialName} and ${credentials.length - 1} more`;
  }
};

const formatDate = (dateValue: string | Date | null | undefined) => {
  if (!dateValue) return 'Not specified';
  
  try {
    const date = new Date(dateValue);
    if (isNaN(date.getTime())) return 'Invalid date';
    
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  } catch (error) {
    return 'Invalid date';
  }
};

const getTotalViews = () => {
  return sharedQRCodes.value.reduce((total, qr) => total + (qr.accessCount || 0), 0);
};

const getExpertCount = () => {
  return credentials.value.filter(cred => cred.skillLevel.toLowerCase() === 'expert' && cred.status).length;
};

const toggleCredential = (credential: Credential) => {
  if (!isCredentialValidForSharing(credential)) {
    if (isCredentialRevoked(credential)) {
      error('Cannot Select', 'Revoked credentials cannot be selected for sharing');
    } else if (isCredentialExpired(credential)) {
      error('Cannot Select', 'Expired credentials cannot be selected for sharing');
    }
    return;
  }

  const index = selectedCredentials.value.findIndex(c => c.id === credential.id);
  if (index >= 0) {
    selectedCredentials.value.splice(index, 1);
  } else {
    selectedCredentials.value.push(credential);
  }
};

const isCredentialSelected = (credentialId: string) => {
  return selectedCredentials.value.some(c => c.id === credentialId);
};

const openShareModal = () => {
  const validSelectedCredentials = selectedCredentials.value.filter(isCredentialValidForSharing);
  
  if (validSelectedCredentials.length === 0) {
    error('No Valid Credentials', 'Please select at least one active, non-expired credential to share');
    return;
  }
  
  selectedCredentials.value = validSelectedCredentials;
  isShareModalOpen.value = true;
};


const openRevokeConfirmation = (qrCode: SharedQR) => {
  confirmationModal.value = {
    isOpen: true,
    type: 'revoke',
    title: 'Revoke Access',
    message: `Are you sure you want to revoke access to this shared credential? This action cannot be undone.`,
    actionType: 'Revoke',
    action: () => handleRevokeQRCode(qrCode)
  };
};

const handleRevokeQRCode = async (qrCode: SharedQR) => {
  confirmationModal.value.isOpen = false;
  isLoading.value = true;
  
  const success = await revokeSharedAccess(qrCode.id);
  if (success) {
    await loadSharedCredentials();
  }
  
  isLoading.value = false;
};

const openViewCredential = (credential: Credential) => {
  viewCredentialModal.value = {
    isOpen: true,
    credential,
    color: getColorFromName(credential.credentialName)
  };
};

const openQRDetails = (qrCode: SharedQR) => {
  const verificationUrl = `${window.location.origin}/verify/${qrCode.id}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(verificationUrl)}`;
  
  qrDetailsModal.value = {
    isOpen: true,
    qrCode,
    qrCodeUrl
  };
};

const copyShareLink = async (qrCode: SharedQR) => {
  const verificationUrl = `${window.location.origin}/verify/${qrCode.id}`;
  
  try {
    await navigator.clipboard.writeText(verificationUrl);
    successToast('Link Copied', 'Verification link copied to clipboard');
  } catch (err) {
    error('Copy Failed', 'Failed to copy link to clipboard');
  }
};

const viewCertificate = (credential: Credential) => {
  if (credential.certificateUrl) {
    window.open(credential.certificateUrl, '_blank');
  }
};

const handleQRGenerated = async (_data: any) => {
  selectedCredentials.value = [];
  await loadSharedCredentials();
};

const refreshCredentials = async () => {
  if (!userStore.address) return;
  
  isRefreshing.value = true;
  try {
    await userStore.loadCredentials();
    successToast('Refreshed', 'Credentials updated successfully');
  } catch (err) {
    error('Refresh Failed', 'Failed to refresh credentials');
  } finally {
    isRefreshing.value = false;
  }
};

const refreshSharedCredentials = async () => {
  isLoading.value = true;
  try {
    await loadSharedCredentials();
    successToast('Refreshed', 'Shared credentials updated successfully');
  } catch (err) {
    error('Refresh Failed', 'Failed to refresh shared credentials');
  } finally {
    isLoading.value = false;
  }
};

const sortedCredentials = computed(() => {
  return [...credentials.value].sort((a, b) => {
    const aValid = isCredentialValidForSharing(a);
    const bValid = isCredentialValidForSharing(b);
    
    if (aValid && !bValid) return -1; 
    if (!aValid && bValid) return 1; 
    
    const aDate = new Date(a.issuedDate).getTime();
    const bDate = new Date(b.issuedDate).getTime();
    
    return bDate - aDate;
  });
});

const getShareStatusInfo = (qrCode: SharedQR) => {
  if (!qrCode.isActive) {
    return { status: 'Revoked', color: 'text-red-400', bgColor: 'bg-red-500/20' };
  }
  
  if (isShareExpired(qrCode)) {
    return { status: 'Expired', color: 'text-orange-400', bgColor: 'bg-orange-500/20' };
  }
  
  if (hasReachedMaxAccess(qrCode)) {
    return { status: 'Limit Reached', color: 'text-amber-400', bgColor: 'bg-amber-500/20' };
  }
  
  return { status: 'Active', color: 'text-emerald-400', bgColor: 'bg-emerald-500/20' };
};

const formatExpiryInfo = (qrCode: SharedQR) => {
  if (!qrCode.expiryDate) return 'No expiration';
  const expiryDate = new Date(qrCode.expiryDate);
  return `Expires ${expiryDate.toLocaleDateString()}`;
};

const formatAccessInfo = (qrCode: SharedQR) => {
  if (!qrCode.maxAccessCount) return `${qrCode.accessCount || 0} views`;
  return `${qrCode.accessCount || 0}/${qrCode.maxAccessCount} views`;
};

const isCredentialExpired = (credential: Credential): boolean => {
  if (!credential.expiryDate) return false;
  return new Date(credential.expiryDate) < new Date();
};
const isCredentialRevoked = (credential: Credential): boolean => {
  return !credential.status;
};

const isCredentialValidForSharing = (credential: Credential): boolean => {
  return !isCredentialRevoked(credential) && !isCredentialExpired(credential);
};

const validCredentials = computed(() => {
  return credentials.value.filter(isCredentialValidForSharing);
});



//
const handleShareFromModal = (credential: Credential) => {
  if (!isCredentialValidForSharing(credential)) {
    if (isCredentialRevoked(credential)) {
      error('Cannot Share', 'This credential has been revoked and cannot be shared');
    } else if (isCredentialExpired(credential)) {
      error('Cannot Share', 'This credential has expired and cannot be shared');
    }
    return;
  }
  
  selectedCredentials.value = [credential];
  activeTab.value = 'skills';
  openShareModal();
};
</script>