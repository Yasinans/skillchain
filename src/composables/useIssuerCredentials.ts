import { ref, computed } from 'vue';
import { useVerifiedCredentials } from './useVerifiedCredentials';
import { useUserStore } from '../stores/user';
import { useToast } from './useToast';
import { useDB } from './useDB';

export interface CredentialFormData {
  recipientAddr: string;
  skillName: string;
  skillLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert' | '';
  expiryDate: string;
  description: string;
  notes: string;
}

export interface IssuerProfile {
  domain: string;
  isVerified: boolean;
  verifiedAt: number;
  organizationName: string;
  description: string;
}

export const useIssuerCredentials = () => {
  const userStore = useUserStore();
  const {
    isLoading: isBlockchainLoading,
    registerDomain,
    getIssuerProfile,
    getNextCredentialId,
    isDomainVerificationValid,
    issueCredential,
    revokeCredential,
    getUserCredentials,
    getCredential,
    listenToCredentialIssued,
    listenToCredentialRevoked,
    removeAllListeners
  } = useVerifiedCredentials();
  const { success, error } = useToast();

  const isLoading = ref(false);
  const issuerProfile = ref<IssuerProfile | null>(null);
  const isVerified = ref(false);
  const userCredentials = ref<number[]>([]);

  const formData = ref<CredentialFormData>({
    recipientAddr: '',
    skillName: '',
    skillLevel: '',
    expiryDate: '',
    notes: '',
    description: ''
  });

  const initializeIssuer = async () => {
    if (!userStore.address) return;

    isLoading.value = true;
    try {
      const profile = await getIssuerProfile();
      if (profile) {
        issuerProfile.value = profile;

        const validVerification = await isDomainVerificationValid();
        isVerified.value = validVerification;
      }
      const credentialIds = await getUserCredentials();
      userCredentials.value = credentialIds;

    } catch (err) {
      console.error('Failed to initialize issuer:', err);
    } finally {
      isLoading.value = false;
    }
  };

  const registerOrganizationDomain = async (
    domain: string,
    organizationName: string,
    description: string = ''
  ): Promise<boolean> => {
    isLoading.value = true;
    try {
      const tx = await registerDomain(domain, organizationName, description);
      if (tx) {
        success('Registration Successful', 'Organization domain registered successfully');
        await initializeIssuer(); 
        return true;
      }
      return false;
    } catch (err) {
      error('Registration Failed', 'Failed to register organization domain');
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const createCredential = async (certificateUrl?: string): Promise<boolean> => {
    if (!formData.value.recipientAddr || !formData.value.skillName || !formData.value.description) {
      error('Invalid Form', 'Please fill in all required fields');
      return false;
    }
    if (!formData.value.recipientAddr.match(/^0x[a-fA-F0-9]{40}$/)) {
      error('Invalid Address', 'Please enter a valid wallet address');
      return false;
    }
    if (!isVerified.value) {
      error('Verification Required', 'You must complete domain verification before issuing credentials');
      return false;
    }

    isLoading.value = true;
    try {
      const originalIssuedAt = new Date().toISOString();
      const credentialData = formatCredentialDataWithTimestamp(certificateUrl, originalIssuedAt);
      const tx = await issueCredential(formData.value.recipientAddr, credentialData);
      console.log("Debug: ", credentialData);
      const nextCredentialId = await getNextCredentialId();
      if (tx) {
        await tx.wait();
        success('Credential Issued', 'Credential has been successfully issued on the blockchain');
        await saveCredentialToFirestore(tx.hash, nextCredentialId - 1, certificateUrl, originalIssuedAt);

        formData.value = {
          recipientAddr: '',
          skillName: '',
          skillLevel: '',
          expiryDate: '',
          description: '',
          notes: ''
        };

        const credentialIds = await getUserCredentials();
        userCredentials.value = credentialIds;

        return true;
      }
      return false;
    } catch (err) {
      error('Issuance Failed', 'Failed to issue credential');
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const formatCredentialDataWithTimestamp = (certificateUrl?: string, issuedAt?: string): string => {
    const data = {
      skillName: formData.value.skillName,
      skillLevel: formData.value.skillLevel,
      description: formData.value.description,
      expiryDate: formData.value.expiryDate,
      notes: formData.value.notes,
      issuedBy: userStore.name,
      issuedAt: issuedAt || new Date().toISOString(),
      certificateUrl: certificateUrl || null
    };

    return JSON.stringify(data);
  };

  const saveCredentialToFirestore = async (
    txHash: string,
    credentialId: number,
    certificateUrl?: string,
    originalIssuedAt?: string
  ) => {
    try {
      await (await useDB()).issueCredentialToFirestore({
        txHash,
        credentialId,
        issuerAddress: userStore.address!,
        recipientAddress: formData.value.recipientAddr,
        credentialName: formData.value.skillName,
        description: formData.value.description,
        skillLevel: formData.value.skillLevel,
        expiryDate: formData.value.expiryDate,
        additionalNotes: formData.value.notes,
        certificateUrl,
        originalIssuedAt 
      });
    } catch (err) {
      console.error('Failed to save credential to Firestore:', err);
      error('Database Error', 'Credential issued on blockchain but failed to save to database');
    }
  };


  const revokeUserCredential = async (credentialId: number, recipientAddress: string, txHash: string): Promise<boolean> => {
    isLoading.value = true;
    try {
      const tx = await revokeCredential(credentialId);
      if (tx) {
        await tx.wait();
        await (await useDB()).revokeCredentialInFirestore(txHash, recipientAddress);
        success('Credential Revoked', 'Credential has been successfully revoked');
        //investigate this below >:(
        const credentialIds = await getUserCredentials();
        userCredentials.value = credentialIds;

        return true;
      }
      return false;
    } catch (err) {
      error('Revocation Failed', 'Failed to revoke credential');
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const getCredentialDetails = async (credentialId: number) => {
    return await getCredential(credentialId);
  };

  const setupEventListeners = () => {
    listenToCredentialIssued((credentialId, issuer, _holder, _dataHash, _domain) => {
      if (issuer.toLowerCase() === userStore.address?.toLowerCase()) {
        success('Credential Issued', `Credential #${credentialId} has been issued`);


        getUserCredentials().then(credentialIds => {
          userCredentials.value = credentialIds;
        });
      }
    });

    listenToCredentialRevoked((credentialId) => {
      success('Credential Revoked', `Credential #${credentialId} has been revoked`);
      getUserCredentials().then(credentialIds => {
        userCredentials.value = credentialIds;
      });
    });
  };

  const cleanup = () => {
    removeAllListeners();
  };

  const formatCredentialData = (certificateUrl?: string): string => {
    const data = {
      skillName: formData.value.skillName,
      skillLevel: formData.value.skillLevel,
      description: formData.value.description,
      expiryDate: formData.value.expiryDate,
      notes: formData.value.notes,
      issuedBy: issuerProfile.value?.organizationName || userStore.address,
      issuedAt: new Date().toISOString(),
      certificateUrl: certificateUrl || null
    };

    return JSON.stringify(data);
  };

  const isFormValid = computed(() => {
    return !!(formData.value.recipientAddr &&
      formData.value.skillName &&
      formData.value.skillLevel &&
      formData.value.description &&
      formData.value.recipientAddr.match(/^0x[a-fA-F0-9]{40}$/));
  });
  return {
    isLoading: computed(() => isLoading.value || isBlockchainLoading.value),
    issuerProfile: computed(() => issuerProfile.value),
    isVerified: computed(() => isVerified.value),
    userCredentials: computed(() => userCredentials.value),
    formData,
    isFormValid,

    initializeIssuer,
    registerOrganizationDomain,
    createCredential,
    revokeUserCredential,
    getCredentialDetails,
    setupEventListeners,
    cleanup,
    formatCredentialData
  };
};