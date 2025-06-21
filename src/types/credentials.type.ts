
export interface Credential {
  id: string,
  credentialId: number
  credentialName: string
  description: string
  organizationName: string
  notes?: string
  holder: string
  issuer: string
  issuedDate: Date
  canExpire: boolean
  expiryDate: Date
  skillLevel: string
  status: boolean
  certificateUrl?: string
}
export interface SharedQR {
  id: string;
  dateShared: string;
  credentials: Credential[];
  isActive: boolean;
  expiryDate?: string;
  description?: string;
  qrCodeUrl?: string;
  verificationUrl?: string;
  accessCount?: number;
  maxAccessCount?: number;
}
export interface CredentialData {
  txHash: string;
  credentialId: number;
  issuerAddress: string;
  recipientAddress: string;
  credentialName: string;
  description: string;
  skillLevel: string;
  expiryDate?: string;
  additionalNotes?: string;
  certificateUrl?: string; 
}

export interface BlockchainCredentialData {
  skillName: string;
  skillLevel: string;
  description: string;
  expiryDate?: string;
  notes?: string;
  issuedBy: string;
  issuedAt: string;
  certificateUrl?: string; 
}