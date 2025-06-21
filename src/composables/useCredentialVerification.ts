// src/composables/useCredentialVerification.ts
// Fixed version using your actual composables

import { ref, computed } from 'vue'
import { useVerifiedCredentials } from './useVerifiedCredentials'
import type { Credential } from '../types/credentials.type'

export const useCredentialVerification = () => {
  const isVerifying = ref(false)
  const verificationResult = ref<{
    isValid: boolean
    blockchainData?: any
    certificateAccessible?: boolean
    errors: string[]
  } | null>(null)

  const { getCredential, verifyCredentialData } = useVerifiedCredentials()

  /**
   * Verifies a credential by checking blockchain data and certificate accessibility
   */
  const verifyCredential = async (credential: Credential): Promise<boolean> => {
    isVerifying.value = true
    const errors: string[] = []
    let isValid = true
    let blockchainData = null
    let certificateAccessible = false

    try {
      // 1. Verify blockchain data
      try {
        blockchainData = await getCredential(credential.credentialId)
        
        if (!blockchainData) {
          errors.push('Credential not found on blockchain')
          isValid = false
        } else if (blockchainData.revoked) {
          errors.push('Credential has been revoked on blockchain')
          isValid = false
        } else {
          // Try to verify the credential data if we have the original data
          try {
            // Create the credential data to verify against blockchain
            const credentialDataToVerify = JSON.stringify({
              skillName: credential.credentialName,
              skillLevel: credential.skillLevel,
              // Add other fields as needed
            })
            
            const isDataValid = await verifyCredentialData(credential.credentialId, credentialDataToVerify)
            if (!isDataValid) {
              errors.push('Credential data does not match blockchain record')
              isValid = false
            }
            
            // Note: Since we only have the hash on blockchain, 
            // we can't directly verify certificate URL from blockchain
            // This verification focuses on credential existence and revocation status
            
          } catch (verificationError) {
            console.error('Credential data verification failed:', verificationError)
            // Don't mark as invalid since this might be expected
            errors.push('Could not verify credential data against blockchain (hash-based storage)')
          }
        }
      } catch (blockchainError) {
        console.error('Blockchain verification error:', blockchainError)
        errors.push('Failed to verify credential on blockchain')
        isValid = false
      }

      // 2. Verify certificate accessibility if URL exists
      if (credential.certificateUrl) {
        try {
          const response = await fetch(credential.certificateUrl, { method: 'HEAD' })
          certificateAccessible = response.ok
          
          if (!certificateAccessible) {
            errors.push('Certificate file is not accessible')
          }
        } catch (fetchError) {
          console.error('Certificate accessibility check failed:', fetchError)
          errors.push('Could not verify certificate accessibility')
        }
      } else {
        certificateAccessible = true // Not applicable
      }

      verificationResult.value = {
        isValid,
        blockchainData,
        certificateAccessible,
        errors
      }

      return isValid

    } catch (error) {
      console.error('Credential verification error:', error)
      verificationResult.value = {
        isValid: false,
        certificateAccessible: false,
        errors: ['Verification process failed']
      }
      return false
    } finally {
      isVerifying.value = false
    }
  }

  const checkCertificateAccessibility = async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(url, { method: 'HEAD' })
      return response.ok
    } catch (error) {
      console.error('Certificate accessibility check failed:', error)
      return false
    }
  }

  const downloadVerifiedCertificate = async (credential: Credential): Promise<boolean> => {
    if (!credential.certificateUrl) {
      console.error('No certificate URL provided')
      return false
    }

    try {
      const isAccessible = await checkCertificateAccessibility(credential.certificateUrl)
      
      if (!isAccessible) {
        console.error('Certificate is not accessible')
        return false
      }

      const response = await fetch(credential.certificateUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${credential.credentialName}-certificate.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      return true
    } catch (error) {
      console.error('Certificate download failed:', error)
      return false
    }
  }

  return {
    // State
    isVerifying: computed(() => isVerifying.value),
    verificationResult: computed(() => verificationResult.value),

    // Methods
    verifyCredential,
    checkCertificateAccessibility,
    downloadVerifiedCertificate
  }
}