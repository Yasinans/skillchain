import { ref, computed } from 'vue';
import { ethers, Contract } from 'ethers';
import { useWalletStore } from '../stores/wallet';
import { useErrorHandling } from './useErrorHandling';
import {CONTRACT_ADDRESS} from '../config';
const CONTRACT_ABI = [
  "event CredentialIssued(uint256 indexed credentialId, address indexed issuer, address indexed holder, bytes32 dataHash, string domain)",
  "event CredentialRevoked(uint256 indexed credentialId)",
  "event IssuerDomainRegistered(address indexed issuer, string domain)",
  "event IssuerDomainVerified(address indexed issuer, string domain, uint256 timestamp)",
  
  "function credentials(uint256) view returns (address issuer, address holder, bytes32 dataHash, uint256 issuedAt, bool revoked)",
  "function userCredentials(address, uint256) view returns (uint256)",
  "function issuerProfiles(address) view returns (string domain, bool isVerified, uint256 verifiedAt, string organizationName, string description)",
  "function nextCredentialId() view returns (uint256)",
  "function admin() view returns (address)",
  "function verificationValidityPeriod() view returns (uint256)",
  "function verificationOracles(address) view returns (bool)",
  "function isDomainVerificationValid(address issuer) view returns (bool)",
  "function getUserCredentials(address user) view returns (uint256[])",
  "function verifyCredentialData(uint256 credentialId, string credentialData) view returns (bool)",
  "function getIssuerProfile(address issuer) view returns (string domain, bool isVerified, uint256 verifiedAt, string organizationName, string description)",
  
  "function addVerificationOracle(address oracle)",
  "function registerDomain(string domain, string organizationName, string description)",
  "function verifyDomainOwnership(address issuer, bool verified)",
  "function issueCredential(address holder, bytes32 dataHash)",
  "function revokeCredential(uint256 credentialId)"
];


export interface Credential {
  issuer: string;
  holder: string;
  dataHash: string;
  issuedAt: number;
  revoked: boolean;
}

export interface IssuerProfile {
  domain: string;
  isVerified: boolean;
  verifiedAt: number;
  organizationName: string;
  description: string;
}

export const useVerifiedCredentials = () => {
  const walletStore = useWalletStore();
  const { withErrorHandling, isRetrying } = useErrorHandling();
  
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  
  const contract = computed(() => {
    if (!walletStore.provider) return null;
    return new Contract(CONTRACT_ADDRESS, CONTRACT_ABI, walletStore.provider);
  });
  
  const contractWithSigner = computed(() => {
    if (!walletStore.signer || !contract.value) return null;
    return contract.value.connect(walletStore.signer);
  });

  const startOperation = () => {
    error.value = null;
    isLoading.value = true;
  };

  const endOperation = () => {
    isLoading.value = false;
  };

  const getCredential = async (credentialId: number): Promise<Credential | null> => {
    startOperation();
    try {
      if (!contract.value) throw new Error('Contract not available');
      
      const result = await withErrorHandling(
        () => contract.value!.credentials(credentialId),
        'Get Credential'
      );
      
      if (!result) return null;
      
      return {
        issuer: result.issuer,
        holder: result.holder,
        dataHash: result.dataHash,
        issuedAt: Number(result.issuedAt),
        revoked: result.revoked
      };
    } finally {
      endOperation();
    }
  };

  const getUserCredentials = async (userAddress?: string): Promise<number[]> => {
    startOperation();
    try {
      if (!contract.value) throw new Error('Contract not available');
      
      const address = userAddress || walletStore.currentAccount;
      if (!address) throw new Error('No user address provided');
      
      const credentialIds = await withErrorHandling(
        () => contract.value!.getUserCredentials(address),
        'Get User Credentials'
      );
      
      if (!credentialIds) return [];
      
      return credentialIds.map((id: any) => Number(id));
    } finally {
      endOperation();
    }
  };

  const getIssuerProfile = async (issuerAddress?: string): Promise<IssuerProfile | null> => {
    startOperation();
    try {
      if (!contract.value) throw new Error('Contract not available');
      
      const address = issuerAddress || walletStore.currentAccount;
      if (!address) throw new Error('No issuer address provided');
      
      const result = await withErrorHandling(
        () => contract.value!.getIssuerProfile(address),
        'Get Issuer Profile'
      );
      
      if (!result) return null;
      
      return {
        domain: result.domain,
        isVerified: result.isVerified,
        verifiedAt: Number(result.verifiedAt),
        organizationName: result.organizationName,
        description: result.description
      };
    } finally {
      endOperation();
    }
  };

  const isDomainVerificationValid = async (issuerAddress?: string): Promise<boolean> => {
    startOperation();
    try {
      if (!contract.value) throw new Error('Contract not available');
      
      const address = issuerAddress || walletStore.currentAccount;
      if (!address) throw new Error('No issuer address provided');
      
      const result = await withErrorHandling(
        () => contract.value!.isDomainVerificationValid(address),
        'Check Domain Verification'
      );
      
      return result || false;
    } finally {
      endOperation();
    }
  };

  const verifyCredentialData = async (credentialId: number, credentialData: string): Promise<boolean> => {
    startOperation();
    try {
      if (!contract.value) throw new Error('Contract not available');
      const result = await withErrorHandling(
        () => contract.value!.verifyCredentialData(credentialId, credentialData),
        'Verify Credential Data'
      );
      
      return result || false;
    } finally {
      endOperation();
    }
  };

  const getNextCredentialId = async (): Promise<number> => {
    startOperation();
    try {
      if (!contract.value) throw new Error('Contract not available');
      
      const id = await withErrorHandling(
        () => contract.value!.nextCredentialId(),
        'Get Next Credential ID'
      );
      
      return id ? Number(id) : 0;
    } finally {
      endOperation();
    }
  };

  const isVerificationOracle = async (address?: string): Promise<boolean> => {
    startOperation();
    try {
      if (!contract.value) throw new Error('Contract not available');
      
      const oracleAddress = address || walletStore.currentAccount;
      if (!oracleAddress) throw new Error('No address provided');
      
      const result = await withErrorHandling(
        () => contract.value!.verificationOracles(oracleAddress),
        'Check Verification Oracle'
      );
      
      return result || false;
    } finally {
      endOperation();
    }
  };

  const registerDomain = async (
    domain: string, 
    organizationName: string, 
    description: string
  ): Promise<ethers.ContractTransactionResponse | null> => {
    startOperation();
    try {
      if (!contractWithSigner.value) throw new Error('Contract with signer not available');
      
      const tx = await withErrorHandling(
        async () => {
          const transaction = await (contractWithSigner.value as any).registerDomain(domain, organizationName, description);
          await transaction.wait();
          return transaction;
        },
        'Register Domain'
      );
      
      return tx;
    } finally {
      endOperation();
    }
  };

  const verifyDomainOwnership = async (
    issuerAddress: string, 
    verified: boolean
  ): Promise<ethers.ContractTransactionResponse | null> => {
    startOperation();
    try {
      if (!contractWithSigner.value) throw new Error('Contract with signer not available');
      
      const tx = await withErrorHandling(
        async () => {
          const transaction = await (contractWithSigner.value as any).verifyDomainOwnership(issuerAddress, verified);
          await transaction.wait();
          return transaction;
        },
        'Verify Domain Ownership'
      );
      
      return tx;
    } finally {
      endOperation();
    }
  };

  const issueCredential = async (
    holderAddress: string, 
    credentialData: string
  ): Promise<ethers.ContractTransactionResponse | null> => {
    startOperation();
    try {
      if (!contractWithSigner.value) throw new Error('Contract with signer not available');
      const dataHash = ethers.keccak256(ethers.toUtf8Bytes(credentialData));
      
      const tx = await withErrorHandling(
        async () => {
          const transaction = await (contractWithSigner.value as any).issueCredential(holderAddress, dataHash);
          await transaction.wait();
          return transaction;
        },
        'Issue Credential'
      );
      
      return tx;
    } finally {
      endOperation();
    }
  };

  const revokeCredential = async (credentialId: number): Promise<ethers.ContractTransactionResponse | null> => {
    startOperation();
    try {
      if (!contractWithSigner.value) throw new Error('Contract with signer not available');
      const tx = await withErrorHandling(
        async () => {
          const transaction = await (contractWithSigner.value as any).revokeCredential(credentialId);
          await transaction.wait();
          return transaction;
        },
        'Revoke Credential'
      );
      
      return tx;
    } finally {
      endOperation();
    }
  };

  const addVerificationOracle = async (oracleAddress: string): Promise<ethers.ContractTransactionResponse | null> => {
    startOperation();
    try {
      if (!contractWithSigner.value) throw new Error('Contract with signer not available');
      
      const tx = await withErrorHandling(
        async () => {
          const transaction = await (contractWithSigner.value as any).addVerificationOracle(oracleAddress);
          await transaction.wait();
          return transaction;
        },
        'Add Verification Oracle'
      );
      
      return tx;
    } finally {
      endOperation();
    }
  };

  const listenToCredentialIssued = (callback: (credentialId: number, issuer: string, holder: string, dataHash: string, domain: string) => void) => {
    if (!contract.value) return;
    
    contract.value.on('CredentialIssued', (credentialId, issuer, holder, dataHash, domain) => {
      callback(Number(credentialId), issuer, holder, dataHash, domain);
    });
  };

  const listenToCredentialRevoked = (callback: (credentialId: number) => void) => {
    if (!contract.value) return;
    
    contract.value.on('CredentialRevoked', (credentialId) => {
      callback(Number(credentialId));
    });
  };

  const listenToIssuerDomainRegistered = (callback: (issuer: string, domain: string) => void) => {
    if (!contract.value) return;
    
    contract.value.on('IssuerDomainRegistered', (issuer, domain) => {
      callback(issuer, domain);
    });
  };

  const listenToIssuerDomainVerified = (callback: (issuer: string, domain: string, timestamp: number) => void) => {
    if (!contract.value) return;
    
    contract.value.on('IssuerDomainVerified', (issuer, domain, timestamp) => {
      callback(issuer, domain, Number(timestamp));
    });
  };

  const removeAllListeners = () => {
    if (!contract.value) return;
    contract.value.removeAllListeners();
  };

  const hashCredentialData = (data: string): string => {
    return ethers.keccak256(ethers.toUtf8Bytes(data));
  };

  const clearError = () => {
    error.value = null;
  };

  return {
    isLoading: computed(() => isLoading.value || isRetrying.value),
    error: computed(() => error.value),
    contract: computed(() => contract.value),
    contractWithSigner: computed(() => contractWithSigner.value),
    
    getCredential,
    getUserCredentials,
    getIssuerProfile,
    isDomainVerificationValid,
    verifyCredentialData,
    getNextCredentialId,
    isVerificationOracle,
    
    registerDomain,
    verifyDomainOwnership,
    issueCredential,
    revokeCredential,
    addVerificationOracle,
    
    listenToCredentialIssued,
    listenToCredentialRevoked,
    listenToIssuerDomainRegistered,
    listenToIssuerDomainVerified,
    removeAllListeners,
    
    hashCredentialData,
    clearError
  };
};