import { ref, computed } from 'vue';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { useUserStore } from '../stores/user';
import { useToast } from './useToast';

export interface WellKnownContent {
  domain: string;
  issuer: string;
  timestamp: number;
  signature: string;
  version: string;
  purpose: string;
}

export interface DomainVerificationResult {
  success: boolean;
  message: string;
  transactionHash?: string;
  domain: string;
  issuerAddress: string;
}

export const useDomainVerification = () => {
  const userStore = useUserStore();
  const { error, success } = useToast();
  
  const isLoading = ref(false);
  const errorMessage = ref<string | null>(null);
  const wellKnownContent = ref<WellKnownContent | null>(null);
  
  const generateWellKnownContent = async (domain: string): Promise<WellKnownContent | null> => {
    if (!userStore.token) {
      error('Authentication required', 'Please sign in first');
      return null;
    }
    
    isLoading.value = true;
    errorMessage.value = null;
    
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/domain/generate-wellknown`,
        { domain },
        {
          headers: {
            'Authorization': `Bearer ${userStore.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      wellKnownContent.value = response.data.content;
      return response.data.content;
      
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Failed to generate verification content';
      errorMessage.value = errorMsg;
      error('Generation Failed', errorMsg);
      return null;
    } finally {
      isLoading.value = false;
    }
  };
  
  const verifyDomainOwnership = async (domain: string, issuerAddress: string): Promise<DomainVerificationResult | null> => {
    if (!userStore.token) {
      error('Authentication required', 'Please sign in first');
      return null;
    }
    
    isLoading.value = true;
    errorMessage.value = null;
    
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/domain/verify`,
        { 
          domain,
          issuerAddress 
        },
        {
          headers: {
            'Authorization': `Bearer ${userStore.token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      const result = response.data;
      
      if (result.success) {
        success('Domain Verified!', `${domain} has been successfully verified and registered on the blockchain`);
        return result;
      } else {
        throw new Error(result.error || 'Domain verification failed');
      }
      
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Domain verification failed';
      errorMessage.value = errorMsg;
      
      if (err.response?.data?.code === 'DOMAIN_VERIFICATION_FAILED') {
        error('Verification Failed', errorMsg);
      } else if (err.response?.status === 429) {
        error('Rate Limited', 'Too many verification attempts. Please try again later.');
      } else {
        error('Verification Error', errorMsg);
      }
      
      return null;
    } finally {
      isLoading.value = false;
    }
  };
  
  const getWellKnownUrl = (domain: string): string => {
    return `https://${domain}/.well-known/skillchain-credentials`;
  };
  
  const copyWellKnownContent = (content: WellKnownContent): void => {
    const jsonContent = JSON.stringify(content, null, 2);
    navigator.clipboard.writeText(jsonContent);
    success('Copied!', 'Verification content copied to clipboard');
  };
  
  const clearError = () => {
    errorMessage.value = null;
  };
  
  return {
    isLoading: computed(() => isLoading.value),
    errorMessage: computed(() => errorMessage.value),
    wellKnownContent: computed(() => wellKnownContent.value),
    
    generateWellKnownContent,
    verifyDomainOwnership,
    getWellKnownUrl,
    copyWellKnownContent,
    clearError
  };
};