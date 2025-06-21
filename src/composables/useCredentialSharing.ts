import { ref, computed } from 'vue';
import { useUserStore } from '../stores/user';
import { useToast } from './useToast';
import { useDB } from './useDB';
import type {  SharedQR } from '../types/credentials.type';

export interface ShareCredentialsRequest {
  credentialIds: string[];
  expiryDate?: Date;
  description?: string;
  allowedAccessCount?: number;
}

export interface SharedCredentialResponse {
  shareId: string;
  verificationUrl: string;
  qrCodeUrl: string;
  expiryDate?: string;
  createdAt: string;
}

export interface VerifySharedCredentialsRequest {
  shareId: string;
}

export interface VerifySharedCredentialsResponse {
  success: boolean;
  credentials: Array<{
    id: string;
    credentialId: number;
    credentialName: string;
    description: string;
    organizationName: string;
    holder: string;
    issuer: string;
    issuedDate: string;
    expiryDate?: string;
    skillLevel: string;
    status: boolean;
    certificateUrl?: string;
    txHash?: string;
  }>;
  shareInfo: {
    shareId: string;
    owner: string;
    createdAt: string;
    expiryDate?: string;
    description?: string;
    accessCount: number;
    maxAccessCount?: number;
    isExpired: boolean;
  };
}

export const useCredentialSharing = () => {
  const userStore = useUserStore();
  const { success: successToast, error } = useToast();
  
  const isLoading = ref(false);
  const sharedQRCodes = ref<SharedQR[]>([]);


  const generateShareId = (): string => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 9);
    return `share_${timestamp}_${randomStr}`;
  };

  const generateQRCodeUrl = (verificationUrl: string, size: number = 400): string => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(verificationUrl)}`;
  };


  const generateVerificationUrl = (shareId: string): string => {
    return `${window.location.origin}/verify/${shareId}`;
  };

  const shareCredentials = async (request: ShareCredentialsRequest): Promise<SharedCredentialResponse | null> => {
    if (!userStore.address) {
      error('Authentication Required', 'Please connect your wallet first');
      return null;
    }

    if (!request.credentialIds.length) {
      error('No Credentials Selected', 'Please select at least one credential to share');
      return null;
    }

    const userCredentialIds = userStore.credentials.map(cred => cred.id);
    const invalidCredentials = request.credentialIds.filter(id => !userCredentialIds.includes(id));
    if (invalidCredentials.length > 0) {
      error('Invalid Credentials', 'You do not own some of the specified credentials');
      return null;
    }

    if (request.expiryDate) {
      const now = new Date();
      if (request.expiryDate <= now) {
        error('Invalid Expiry Date', 'Expiry date must be in the future');
        return null;
      }
    }

    isLoading.value = true;

    try {
      const shareId = generateShareId();
      const { createSharedCredential } = await useDB();

      const success = await createSharedCredential({
        shareId,
        credentialIds: request.credentialIds,
        expiryDate: request.expiryDate,
        description: request.description,
        maxAccessCount: request.allowedAccessCount
      });

      if (!success) {
        throw new Error('Failed to create shared credential in database');
      }

      const verificationUrl = generateVerificationUrl(shareId);
      const qrCodeUrl = generateQRCodeUrl(verificationUrl);
      
      const result: SharedCredentialResponse = {
        shareId,
        verificationUrl,
        qrCodeUrl,
        createdAt: new Date().toISOString(),
        expiryDate: request.expiryDate?.toISOString()
      };

      successToast(
        'Credentials Shared Successfully!', 
        `QR code generated for ${request.credentialIds.length} credential${request.credentialIds.length > 1 ? 's' : ''}`
      );

      await loadSharedCredentials();

      return result;

    } catch (err: any) {
      error('Sharing Failed', 'Failed to share credentials. Please try again.');
      console.error('Share credentials error:', err);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const revokeSharedAccess = async (shareId: string): Promise<boolean> => {
    if (!userStore.address) {
      error('Authentication Required', 'Please connect your wallet first');
      return false;
    }

    isLoading.value = true;

    try {
      const { revokeSharedCredential } = await useDB();
      const success = await revokeSharedCredential(shareId, userStore.address);

      if (success) {
        successToast('Access Revoked', 'The shared credential access has been revoked successfully');
        await loadSharedCredentials();
        return true;
      } else {
        throw new Error('Failed to revoke access');
      }

    } catch (err: any) {
      error('Revoke Failed', 'Failed to revoke access. Please try again.');
      console.error('Revoke shared access error:', err);
      return false;
    } finally {
      isLoading.value = false;
    }
  };

  const verifySharedCredentials = async (shareId: string): Promise<VerifySharedCredentialsResponse | null> => {
    isLoading.value = true;
    try {
      const { verifySharedCredential, getCredentials } = await useDB();
      const result = await verifySharedCredential(shareId);

      if (!result) {
        error('Share Not Found', 'This share does not exist or has been deleted');
        return null;
      }

      if (result.error) {
        if (result.code === 'SHARE_REVOKED') {
          error('Access Revoked', 'This shared credential access has been revoked');
        } else if (result.code === 'SHARE_EXPIRED') {
          error('Access Expired', 'This shared credential access has expired');
        } else if (result.code === 'ACCESS_LIMIT_REACHED') {
          error('Access Limit Reached', 'This share has reached its maximum access limit');
        } else {
          error('Verification Failed', result.error);
        }
        return null;
      }

      if (result.success && result.shareInfo) {
        const ownerCredentials = await getCredentials(result.shareInfo.owner);
        const sharedCredentials = ownerCredentials.filter(cred => 
          result.shareInfo.credentialIds.includes(cred.id)
        );
        const response: VerifySharedCredentialsResponse = {
          success: true,
          credentials: sharedCredentials.map(cred => ({
            id: cred.id,
            credentialId: cred.credentialId,
            credentialName: cred.credentialName,
            description: cred.description,
            organizationName: cred.organizationName,
            notes: cred.notes,
            holder: cred.holder,
            issuer: cred.issuer,
            issuedDate: cred.issuedDate.toISOString(),
            expiryDate: cred.expiryDate?.toISOString(),
            skillLevel: cred.skillLevel,
            status: cred.status,
            certificateUrl: cred.certificateUrl,
          })),
          shareInfo: {
            shareId: result.shareInfo.shareId,
            owner: result.shareInfo.owner,
            createdAt: result.shareInfo.createdAt,
            expiryDate: result.shareInfo.expiryDate || undefined,
            description: result.shareInfo.description || undefined,
            accessCount: result.shareInfo.accessCount,
            maxAccessCount: result.shareInfo.maxAccessCount || undefined,
            isExpired: result.shareInfo.isExpired
          }
        };
        successToast(
          'Credentials Verified!', 
          `Successfully verified ${sharedCredentials.length} credential${sharedCredentials.length > 1 ? 's' : ''}`
        );

        return response;
      }

      return null;

    } catch (err: any) {
      error('Verification Failed', 'Failed to verify credentials. Please try again.');
      console.error('Verify shared credentials error:', err);
      return null;
    } finally {
      isLoading.value = false;
    }
  };

  const loadSharedCredentials = async (): Promise<void> => {
    if (!userStore.address) {
      sharedQRCodes.value = [];
      return;
    }

    try {
      const { getSharedCredentials } = await useDB();
      const sharedCredentialsData = await getSharedCredentials(userStore.address);
      
      sharedQRCodes.value = sharedCredentialsData.map((share: any) => {
        const credentials = userStore.credentials.filter(cred => 
          share.credentialIds && share.credentialIds.includes(cred.id)
        );

        if (credentials.length === 0 && share.credentialIds && share.credentialIds.length > 0) {
          console.warn(`Credentials not found for share ${share.shareId}. This might happen if credentials haven't loaded yet.`);
        }

        return {
          id: share.shareId,
          dateShared: share.dateShared,
          credentials,
          isActive: share.isActive,
          expiryDate: share.expiryDate,
          description: share.description,
          qrCodeUrl: generateQRCodeUrl(generateVerificationUrl(share.shareId)),
          verificationUrl: generateVerificationUrl(share.shareId),
          accessCount: share.accessCount || 0,
          maxAccessCount: share.maxAccessCount
        };
      });

    } catch (err: any) {
      console.error('Load shared credentials error:', err);
      sharedQRCodes.value = [];
    }
  };

  const getShareStats = async () => {
    if (!userStore.address) return null;

    try {
      const { getSharedCredentialStats } = await useDB();
      return await getSharedCredentialStats(userStore.address);
    } catch (err: any) {
      console.error('Get share stats error:', err);
      return null;
    }
  };


  const shareStats = computed(() => {
    const total = sharedQRCodes.value.length;
    const active = sharedQRCodes.value.filter(qr => qr.isActive).length;
    const expired = total - active;
    const totalAccess = sharedQRCodes.value.reduce((sum, qr) => sum + (qr.accessCount || 0), 0);

    return {
      total,
      active,
      expired,
      totalAccess
    };
  });

  const isShareExpired = (qrCode: SharedQR): boolean => {
    if (!qrCode.expiryDate) return false;
    return new Date() > new Date(qrCode.expiryDate);
  };


  const hasReachedMaxAccess = (qrCode: SharedQR): boolean => {
    if (!qrCode.maxAccessCount) return false;
    return (qrCode.accessCount || 0) >= qrCode.maxAccessCount;
  };


  const activeCodes = computed(() => 
    sharedQRCodes.value.filter(qr => 
      qr.isActive && !isShareExpired(qr) && !hasReachedMaxAccess(qr)
    )
  );

  const expiredCodes = computed(() => 
    sharedQRCodes.value.filter(qr => 
      !qr.isActive || isShareExpired(qr) || hasReachedMaxAccess(qr)
    )
  );

  return {
    isLoading: computed(() => isLoading.value),
    sharedQRCodes: computed(() => sharedQRCodes.value),
    activeCodes,
    expiredCodes,
    shareStats,
    shareCredentials,
    revokeSharedAccess,
    verifySharedCredentials,
    loadSharedCredentials,
    getShareStats,
    isShareExpired,
    hasReachedMaxAccess,
    generateQRCodeUrl
  };
};