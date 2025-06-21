export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
export const EXPLORER_BASE_URL = 'https://sepolia.etherscan.io'

// Blockchain Configuration
export const CONTRACT_ADDRESS = '0x39c52ea5190FaE336C7BCa389b2086897A55500E'
export const TARGET_CHAIN_ID = '0xaa36a7'
// App Configuration
export const APP_NAME = 'SkillChain'
export const APP_VERSION = '1.0.0'

// File Upload Configuration
export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const ALLOWED_FILE_TYPES = ['application/pdf']

// Supabase Storage Configuration
export const SUPABASE_STORAGE_BUCKET = 'certificates'
export const SUPABASE_STORAGE_FOLDER = 'certificates'

// Domain Verification Configuration
export const WELL_KNOWN_PATH = '/.well-known/skillchain-credentials'
export const VERIFICATION_COOLDOWN = 24 * 60 * 60 * 1000 // 24 hours in milliseconds