<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useUserStore } from '../stores/user'
import { useDomainVerification } from '../composables/useDomainVerification'
import { useIssuerCredentials } from '../composables/useIssuerCredentials'
import { useToast } from '../composables/useToast'
import { useSupabaseStorage } from '../composables/useSupabaseStorage'
import { storeToRefs } from 'pinia'
import type { Credential } from '../types/credentials.type'
import type { ConfirmationModalData } from '../types/modals.type'

// Components
import Header from '../components/Header.vue'
import LoadingModal from '../components/LoadingModal.vue'
import ConfirmationModal from '../components/ConfirmationModal.vue'
import DomainVerificationFlow from '../components/DomainVerificationFlow.vue'
import CredentialIssueForm from '../components/CredentialIssueForm.vue'
import ViewCredentialModal from '../components/dashboard/ViewCredentialModal.vue'
import IssuerOverview from '../components/issuer/IssuerOverview.vue'
import IssuerCredentialsList from '../components/issuer/IssuerCredentialsList.vue'

// Icons
import { 
  TrophyIcon, 
  CheckCircleIcon,
  ShieldCheckIcon,
  PlusCircleIcon,
  AcademicCapIcon,
  SparklesIcon,
  ExclamationTriangleIcon,
  XCircleIcon
} from '@heroicons/vue/24/outline'

const userStore = useUserStore()
const {
  isLoading: isDomainLoading,
  generateWellKnownContent,
  verifyDomainOwnership,
  copyWellKnownContent,
  wellKnownContent
} = useDomainVerification()
const { 
  uploadFile, 
  isUploading: isStorageUploading, 
  uploadProgress: storageUploadProgress,
  error: storageError,
  resetUploadState
} = useSupabaseStorage()
const {
  isLoading: isCredentialsLoading,
  issuerProfile,
  isVerified,
  formData,
  isFormValid,
  initializeIssuer,
  registerOrganizationDomain,
  createCredential,
  revokeUserCredential,
  setupEventListeners,
  cleanup,
} = useIssuerCredentials()

const isUploading = computed(() => isStorageUploading.value)
const uploadProgress = computed(() => storageUploadProgress.value)
const { name: organizationName, credentials } = storeToRefs(userStore)
const { success, error } = useToast()

const isLoading = ref(false)
const activeTab = ref('overview') 
const showVerificationFlow = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)
const uploadedFile = ref<File | null>(null)
const isDragging = ref(false)
const certificateUrl = ref('')

const registrationData = ref({
  organizationName: '',
  domainName: '',
  walletAddress: ''
})

const verificationSteps = ref([
  {
    id: 1,
    title: 'Enter Organization Details',
    description: 'Provide your organization name and domain',
    completed: false,
    active: true
  },
  {
    id: 2,
    title: 'Add Verification File',
    description: 'Upload credentials.json to your domain',
    completed: false,
    active: false
  },
  {
    id: 3,
    title: 'Verify Ownership',
    description: 'Complete blockchain verification',
    completed: false,
    active: false
  }
])
const handleGenerateContent = async () => {
  if (!registrationData.value.domainName) {
    error('Validation Error', 'Please enter a domain name first')
    return
  }
  
  const content = await generateWellKnownContent(registrationData.value.domainName)
  if (content) {
    copyWellKnownContent(content)
  }
}

const handleVerifyDomain = async () => {
  if (!isRegisteredInBlockchain.value) {
    const registered = await registerOrganizationDomain(
      registrationData.value.domainName,
      registrationData.value.organizationName,
      'Verified credential issuer'
    )
    
    if (!registered) return
  }
  
  const result = await verifyDomainOwnership(
    registrationData.value.domainName,
    userStore.address || ''
  )
  
  if (result?.success) {
    
    const finalStepIndex = verificationSteps.value.length - 1
    verificationSteps.value[finalStepIndex].completed = true
    verificationSteps.value[finalStepIndex].active = false
    
    showVerificationFlow.value = false
    activeTab.value = 'overview'
    await initializeIssuer()
  }
}
const confirmationModal = ref<ConfirmationModalData>({
  isOpen: false,
  type: '',
  title: '',
  message: '',
  actionType: '',
  action: () => {}
})

const viewCredentialModal = ref({
  isOpen: false,
  credential: {} as Credential,
  color: ''
})

const errors = ref({
  recipientAddr: '',
  skillName: '',
  skillLevel: '',
  description: ''
})

const currentStep = computed(() => verificationSteps.value.findIndex(step => step.active) + 1)
const isRegisteredInBlockchain = computed(() => isVerified.value)
const activeCredentials = computed(() => credentials.value.filter(c => c.status).length)
const expiredCredentials = computed(() => credentials.value.filter(c => !c.status).length)
const initializeRegistrationData = () => {
  registrationData.value = {
    organizationName: userStore.name || '',
    domainName: issuerProfile.value?.domain || '',
    walletAddress: userStore.address || ''
  }
}

onMounted(async () => {
  await initializeIssuer()
  setupEventListeners()
  initializeRegistrationData() 
})
onUnmounted(() => {
  cleanup()
})

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

const openViewModal = (credential: Credential) => {
  viewCredentialModal.value = {
    isOpen: true,
    credential,
    color: getColorFromName(credential.credentialName)
  }
}

const handleRevoke = (credential: Credential) => {
  confirmationModal.value = {
    isOpen: true,
    type: 'warning',
    title: 'Revoke Credential',
    message: `Are you sure you want to revoke this credential? This action cannot be undone.`,
    actionType: 'Revoke',
    action: async () => {
      await confirmRevoke(credential)
    }
  }
}

const confirmRevoke = async (credential: Credential) => {
  try {
    confirmationModal.value.isOpen = false
    const result = await revokeUserCredential(credential.credentialId, credential.holder, credential.id)
    if (result) {
      success('Success', 'Credential revoked successfully')
    }
  } catch (err) {
    error('Error', 'Failed to revoke credential')
  }
}

const nextStep = async () => {
  const currentIndex = verificationSteps.value.findIndex(step => step.active)
  
  if (currentIndex === 0) {
    if (!registrationData.value.domainName) {
      error('Validation Error', 'Please enter a valid domain name')
      return
    }
    
    registrationData.value.walletAddress = userStore.address || ''
    registrationData.value.organizationName = userStore.name || ''
    
    verificationSteps.value[currentIndex].completed = true
    verificationSteps.value[currentIndex].active = false
    verificationSteps.value[currentIndex + 1].active = true
  } else if (currentIndex === 1) {
    if (!wellKnownContent.value) {
      error('Validation Error', 'Please generate the verification content first')
      return
    }
    
    verificationSteps.value[currentIndex].completed = true
    verificationSteps.value[currentIndex].active = false
    verificationSteps.value[currentIndex + 1].active = true
  }
}

const startVerificationFlow = () => {
  showVerificationFlow.value = true
  activeTab.value = 'verify'
  verificationSteps.value.forEach((step, index) => {
    step.completed = false
    step.active = index === 0
  })
}

const cancelVerification = () => {
  showVerificationFlow.value = false
  activeTab.value = 'overview'
}

const handleFileChange = async (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files.length > 0) {
    const file = input.files[0]
    await handleFileUpload(file)
  }
}

const handleFileDrop = async (event: DragEvent) => {
  isDragging.value = false
  if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
    const file = event.dataTransfer.files[0]
    await handleFileUpload(file)
  }
}

const handleFileUpload = async (file: File) => {
  try {
    resetUploadState()
    uploadedFile.value = file

    const publicUrl = await uploadFile(file)
    
    if (publicUrl) {
      certificateUrl.value = publicUrl
      success('Upload Successful', 'Certificate uploaded to Supabase Storage!')
    } else {
      const errorMessage = storageError.value || 'Upload failed'
      error('Upload Failed', errorMessage)
      uploadedFile.value = null
    }
  } catch (err) {
    console.error('File upload error:', err)
    error('Upload Error', 'An unexpected error occurred during upload')
    uploadedFile.value = null
  }
}

const removeFile = () => {
  uploadedFile.value = null
  certificateUrl.value = ''
  resetUploadState()
  
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const copyCertificateUrl = () => {
  navigator.clipboard.writeText(certificateUrl.value)
  success('Copied!', 'Certificate URL copied to clipboard!')
}

const handleIssueCredential = async () => {
  errors.value = {
    recipientAddr: '',
    skillName: '',
    skillLevel: '',
    description: ''
  }
  let hasError = false
  if (!formData.value.recipientAddr) {
    errors.value.recipientAddr = 'Recipient wallet address is required.'
    hasError = true
  } else if (!formData.value.recipientAddr.match(/^0x[a-fA-F0-9]{40}$/)) {
    errors.value.recipientAddr = 'Please enter a valid wallet address.'
    hasError = true
  }
  
  if (!formData.value.skillName) {
    errors.value.skillName = 'Credential name is required.'
    hasError = true
  }
  
  
  if (!formData.value.description) {
    errors.value.description = 'Description is required.'
    hasError = true
  }

  if (hasError) {
    error('Validation Error', 'Please fill all required fields correctly.')
    return
  }

  isLoading.value = true
  try {    
    const result = await createCredential(certificateUrl.value || undefined)
    
    if (result) {
      success('Success', 'Credential issued successfully!')
      
      formData.value = {
        recipientAddr: '',
        skillName: '',
        skillLevel: '',
        description: '',
        expiryDate: '',
        notes: ''
      }
      certificateUrl.value = ''
      uploadedFile.value = null
      
      activeTab.value = 'issued'
    }
  } catch (err) {
    error('Error', 'Failed to issue credential. Please try again.')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a1612] to-[#0f0b0a] text-[#d1c9c1]">
    <Header />
    
    <main class="container mx-auto max-w-7xl px-4 py-8">
      
      <div class="mb-8">
        <div class="text-center mb-8">
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-white via-[#e6902e] to-[#fac044] bg-clip-text text-transparent mb-4">
            Issuer Dashboard
          </h1>
          <p class="text-lg text-[#9b9182] max-w-2xl mx-auto">
            Issue and manage verified professional credentials on the blockchain
          </p>
        </div>

        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5 rounded-xl border border-emerald-500/20 p-6 hover:scale-105 transition-all duration-300 hover:border-emerald-500/40">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-emerald-400 text-sm font-medium">Total Issued</p>
                <p class="text-2xl font-bold text-white">{{ credentials.length }}</p>
                <p class="text-xs text-emerald-400/60 mt-1">Credentials on chain</p>
              </div>
              <div class="bg-emerald-500/20 p-3 rounded-lg">
                <TrophyIcon class="h-6 w-6 text-emerald-400" />
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-br from-blue-500/10 to-blue-600/5 rounded-xl border border-blue-500/20 p-6 hover:scale-105 transition-all duration-300 hover:border-blue-500/40">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-blue-400 text-sm font-medium">Active</p>
                <p class="text-2xl font-bold text-white">{{ activeCredentials }}</p>
                <p class="text-xs text-blue-400/60 mt-1">Valid credentials</p>
              </div>
              <div class="bg-blue-500/20 p-3 rounded-lg">
                <CheckCircleIcon class="h-6 w-6 text-blue-400" />
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-br from-amber-500/10 to-amber-600/5 rounded-xl border border-amber-500/20 p-6 hover:scale-105 transition-all duration-300 hover:border-amber-500/40">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-amber-400 text-sm font-medium">Expired</p>
                <p class="text-2xl font-bold text-white">{{ expiredCredentials }}</p>
                <p class="text-xs text-amber-400/60 mt-1">Need renewal</p>
              </div>
              <div class="bg-amber-500/20 p-3 rounded-lg">
                <XCircleIcon class="h-6 w-6 text-amber-400" />
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-br from-[#e6902e]/10 to-[#fac044]/5 rounded-xl border border-[#e6902e]/20 p-6 hover:scale-105 transition-all duration-300 hover:border-[#e6902e]/40">
            <div class="flex items-center justify-between">
              <div class="flex-1 min-w-0 mr-3">
                <p class="text-[#fac044] text-sm font-medium">Organization</p>
                <p class="text-xl font-bold text-white break-words line-clamp-2" 
                   :title="organizationName || 'Not Set'">
                  {{ organizationName || 'Not Set' }}
                </p>
                <p class="text-xs text-[#fac044]/60 mt-1">
                  {{ isVerified ? 'Verified' : 'Unverified' }}
                </p>
              </div>
              <div class="bg-[#e6902e]/20 p-3 rounded-lg flex-shrink-0">
                <ShieldCheckIcon class="h-6 w-6" :class="isVerified ? 'text-emerald-400' : 'text-[#e6902e]'" />
              </div>
            </div>
          </div>
        </div>

        
        <div v-if="!isRegisteredInBlockchain" class="mb-6 bg-amber-500/10 border border-amber-500/20 rounded-xl p-6">
          <div class="flex items-start gap-4">
            <div class="bg-amber-500/20 p-3 rounded-lg flex-shrink-0">
              <ExclamationTriangleIcon class="h-6 w-6 text-amber-400" />
            </div>
            <div class="flex-1">
              <h3 class="text-lg font-semibold text-amber-400 mb-2">Verification Required</h3>
              <p class="text-amber-400/80 mb-4">
                To issue credentials, you need to verify your organization's domain ownership. This ensures the authenticity and trustworthiness of your issued credentials.
              </p>
              <button
                @click="startVerificationFlow"
                class="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white px-6 py-2 rounded-lg font-medium transition-all flex items-center gap-2"
              >
                <ShieldCheckIcon class="h-5 w-5" />
                Start Verification
              </button>
            </div>
          </div>
        </div>
      </div>

      
      <div class="bg-[#1f1d2c]/60 backdrop-blur-sm rounded-xl border border-[#e6902e]/20 shadow-lg overflow-hidden">
        
        <div class="border-b border-[#3a3631] px-6 py-4">
          <div class="flex flex-wrap items-center gap-2">
            <button 
              @click="activeTab = 'overview'; showVerificationFlow = false"
              class="px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2"
              :class="activeTab === 'overview' 
                ? 'bg-[#e6902e] text-white shadow-lg shadow-[#e6902e]/20' 
                : 'bg-[#2a2631] text-[#9b9182] hover:bg-[#342e3a] hover:text-white'"
            >
              <SparklesIcon class="h-5 w-5" />
              Overview
            </button>
            <button 
              @click="activeTab = 'issue'; showVerificationFlow = false"
              class="px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2"
              :class="activeTab === 'issue' 
                ? 'bg-[#e6902e] text-white shadow-lg shadow-[#e6902e]/20' 
                : 'bg-[#2a2631] text-[#9b9182] hover:bg-[#342e3a] hover:text-white'"
              :disabled="!isVerified"
            >
              <PlusCircleIcon class="h-5 w-5" />
              Issue Credential
            </button>
            <button 
              @click="activeTab = 'issued'; showVerificationFlow = false"
              class="px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2"
              :class="activeTab === 'issued' 
                ? 'bg-[#e6902e] text-white shadow-lg shadow-[#e6902e]/20' 
                : 'bg-[#2a2631] text-[#9b9182] hover:bg-[#342e3a] hover:text-white'"
            >
              <AcademicCapIcon class="h-5 w-5" />
              Issued Credentials
            </button>
          </div>
        </div>

        
        <div class="p-6">
          
          <IssuerOverview 
            v-if="activeTab === 'overview' && !showVerificationFlow"
            :issuerProfile="issuerProfile"
            :isVerified="isVerified"
            :credentials="credentials"
            @switch-tab="activeTab = $event"
          />

          
          <CredentialIssueForm
            v-if="activeTab === 'issue' && !showVerificationFlow"
            :isVerified="isVerified"
            :formData="formData"
            :isFormValid="isFormValid"
            :uploadedFile="uploadedFile"
            :isUploading="isUploading"
            :uploadProgress="uploadProgress"
            :certificateUrl="certificateUrl"
            :isDragging="isDragging"
            :errors="errors"
            @start-verification="startVerificationFlow"
            @submit="handleIssueCredential"
            @file-change="handleFileChange"
            @file-drop="handleFileDrop"
            @drag-enter="isDragging = true"
            @drag-leave="isDragging = false"
            @drag-over="isDragging = true"
            @remove-file="removeFile"
            @copy-certificate-url="copyCertificateUrl"
            @switch-tab="activeTab = $event"
          />

          
          <IssuerCredentialsList 
            v-if="activeTab === 'issued' && !showVerificationFlow"
            :credentials="credentials"
            :isVerified="isVerified"
            @view-credential="openViewModal"
            @revoke-credential="handleRevoke"
            @switch-tab="activeTab = $event"
          />
          <DomainVerificationFlow
  v-if="showVerificationFlow"
  v-model:registrationData="registrationData"
  :currentStep="currentStep"
  :verificationSteps="verificationSteps"
  :wellKnownContent="wellKnownContent"
  :isLoading="isDomainLoading"
  @next-step="nextStep"
  @cancel="cancelVerification"
  @generate-content="handleGenerateContent"
  @verify-domain="handleVerifyDomain"
/>
        </div>
      </div>

      
      
    </main>

    
    <LoadingModal 
      :isLoading="isLoading || isDomainLoading || isCredentialsLoading"
      title="Processing"
      message="Please wait while we process your request..."
    />
    <ConfirmationModal
      :confirmationModal="confirmationModal"
      @close="confirmationModal.isOpen = false"
      @confirm="confirmationModal.action"
    />
    <ViewCredentialModal
      :viewCredentialModal="viewCredentialModal"
      @share-credential="() => {}"
    />
  </div>
</template>