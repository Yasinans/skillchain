# SkillChain

A blockchain-based credential verification platform that enables secure issuance and verification of digital certificates using Web3 technology and decentralized storage.

Demo: [https://skillchains.vercel.app/](https://skillchains.vercel.app/)

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Setup](#environment-setup)
- [Development](#development)
- [Build](#build)
- [Project Structure](#project-structure)
- [Technologies Used](#technologies-used)
  
## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16.0.0 or higher)
- npm or yarn package manager
- Git

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/your-project-name.git
cd your-project-name
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up your environment variables (see [Environment Setup](#environment-setup))

## Environment Setup

1. Create a `.env` file in the root directory of your project:
```bash
cp .env.example .env
```

2. Add your environment variables to the `.env` file:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=your_api_base_url
```

### Getting your Supabase credentials:
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project or select an existing one
3. Navigate to Settings > API
4. Copy your Project URL and anon/public key

### API Base URL:
- For development: `http://localhost:3000/api` (or your local API port)
- For production: `https://your-api-domain.com/api`

## Database Configuration

### Supabase Storage Setup

1. Navigate to your Supabase Dashboard > Storage
2. Create a new bucket called `certificates`
3. Go to the SQL Editor in your Supabase Dashboard
4. Run the following SQL policies to configure access permissions:

```sql
-- Allow public access to view files
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'certificates');

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'certificates');

-- Allow users to delete their own files (optional)
CREATE POLICY "Users can delete own files" ON storage.objects
FOR DELETE USING (bucket_id = 'certificates');
```

### Firestore Rules Configuration

1. If using Firebase/Firestore, navigate to your Firebase Console
2. Go to Firestore Database > Rules
3. Replace the default rules with the following security rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{walletAddress} {
      allow read: if request.auth != null && request.auth.uid == walletAddress;
      allow create: if request.auth != null && 
        request.auth.uid == walletAddress && 
        request.resource.data.keys().hasAll(['name','email','isEmailVerified']) &&
        request.resource.data.keys().hasOnly(['name','email','isEmailVerified']) &&
        request.resource.data.isEmailVerified == false;     
        
      match /credentials/{credentialId} {
        allow read: if request.auth != null && (
          request.auth.uid == walletAddress ||
          resource.data.issuer == /databases/$(database)/documents/issuers/$(request.auth.uid)
        );
        
        allow create: if request.auth != null && 
          exists(/databases/$(database)/documents/issuers/$(request.auth.uid)) 
          && request.resource.data.issuer == /databases/$(database)/documents/issuers/$(request.auth.uid);
        
        allow update: if request.auth != null &&
          resource.data.issuer == /databases/$(database)/documents/issuers/$(request.auth.uid) &&
          request.resource.data.diff(resource.data).affectedKeys().hasOnly(['status']) &&
          request.resource.data.status == false;
      }
    }
    
    match /issuers/{walletAddress} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
        request.auth.uid == walletAddress && 
        request.resource.data.keys().hasAll(['organizationName','isVerified']) &&
        request.resource.data.keys().hasOnly(['organizationName','isVerified']) &&
        request.resource.data.isVerified == false;
        
      allow update: if request.auth != null &&
        request.auth.uid == walletAddress &&
        request.resource.data.diff(resource.data).affectedKeys().hasOnly(['isVerified']) &&
        request.resource.data.isVerified == true;
        
      match /issuedCredentials/{credentialId} {
        allow read: if request.auth != null && request.auth.uid == walletAddress;
        
        allow create: if request.auth != null && 
          request.auth.uid == walletAddress &&
          request.resource.data.keys().hasAll(['credRef','issuedDate','recipientAddress']) &&
          request.resource.data.keys().hasOnly(['credRef','issuedDate','recipientAddress']);
      }
    }
    
    match /emails/{email} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
        !exists(/databases/$(database)/documents/emails/$(email)) &&
        request.auth.token.email == null;
    }
    
    match /sharedCredentials/{shareId} {
      allow create: if request.auth != null 
        && request.auth.uid == request.resource.data.owner
        && validateSharedCredential(request.resource.data);
      
      allow update: if request.auth != null 
        && request.auth.uid == resource.data.owner
        && validateSharedCredentialUpdate(request.resource.data, resource.data);
      
      allow update: if validateVerificationUpdate(request.resource.data, resource.data);
      
      allow delete: if request.auth != null 
        && request.auth.uid == resource.data.owner;
      
      allow read: if request.auth != null 
        && request.auth.uid == resource.data.owner;
      
      allow read: if true;
    }
    
    function validateSharedCredential(data) {
      return data.keys().hasAll(['shareId', 'owner', 'credentialIds', 'createdAt', 'isActive', 'accessCount'])
        && data.shareId is string
        && data.owner is string
        && data.credentialIds is list
        && data.credentialIds.size() > 0
        && data.credentialIds.size() <= 10
        && data.createdAt is timestamp
        && data.isActive is bool
        && data.accessCount is number
        && data.accessCount >= 0
        && (data.expiryDate == null || data.expiryDate is timestamp)
        && (data.maxAccessCount == null || (data.maxAccessCount is number && data.maxAccessCount > 0))
        && (data.description == null || (data.description is string && data.description.size() <= 500))
        && (data.lastAccessedAt == null || data.lastAccessedAt is timestamp)
        && (data.revokedAt == null || data.revokedAt is timestamp);
    }
    
    function validateSharedCredentialUpdate(newData, oldData) {
      return newData.shareId == oldData.shareId
        && newData.owner == oldData.owner
        && newData.credentialIds == oldData.credentialIds
        && newData.createdAt == oldData.createdAt
        && (newData.accessCount >= oldData.accessCount)
        && (newData.isActive is bool)
        && (newData.revokedAt == null || newData.revokedAt is timestamp)
        && (newData.lastAccessedAt == null || newData.lastAccessedAt is timestamp)
        && (newData.expiryDate == oldData.expiryDate || newData.expiryDate == null || newData.expiryDate is timestamp)
        && (newData.maxAccessCount == oldData.maxAccessCount || newData.maxAccessCount == null || newData.maxAccessCount is number)
        && (newData.description == oldData.description || newData.description == null || newData.description is string);
    }
    
    function validateVerificationUpdate(newData, oldData) {
      return newData.shareId == oldData.shareId
        && newData.owner == oldData.owner
        && newData.credentialIds == oldData.credentialIds
        && newData.createdAt == oldData.createdAt
        && newData.isActive == oldData.isActive
        && newData.expiryDate == oldData.expiryDate
        && newData.maxAccessCount == oldData.maxAccessCount
        && newData.description == oldData.description
        && newData.accessCount == oldData.accessCount + 1
        && (newData.lastAccessedAt is timestamp)
        && newData.revokedAt == oldData.revokedAt;
    }
    
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

4. Click "Publish" to apply the rules

## Development

To run the development server:

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:5173` (default Vite port) and accessible from other devices on your network.

## Build

To build the project for production:

```bash
npm run build
# or
yarn build
```

This will run TypeScript type checking with `vue-tsc` before building.

To preview the production build:

```bash
npm run preview
# or
yarn preview
```

## Project Structure

```
├── public/            # Static assets
├── src/
│   ├── assets/        # Images, fonts, and other assets
│   ├── components/    # Reusable Vue components
│   ├── composables/   # Vue 3 composable functions
│   ├── lib/           # Utility functions and configurations
│   ├── router/        # Vue Router configuration
│   ├── stores/        # Pinia stores
│   ├── types/         # TypeScript type definitions
│   ├── views/         # Page components
│   ├── App.vue        # Root component
│   ├── config.ts      # App configuration
│   ├── firebase.ts    # Firebase configuration
│   ├── main.ts        # Application entry point
│   └── vite-env.d.ts  # Vite type definitions
├── .env               # Environment variables (not in version control)
├── .gitignore         # Git ignore file
├── index.html         # HTML entry point
├── package-lock.json  # NPM lock file
├── package.json       # Project dependencies and scripts
├── README.md          # Project documentation
├── tsconfig.app.json  # TypeScript app configuration
├── tsconfig.json      # TypeScript base configuration
├── tsconfig.node.json # TypeScript node configuration
├── vercel.json        # Vercel deployment configuration
└── vite.config.ts     # Vite configuration
```

## Configuration Files Setup

### Firebase Configuration (src/firebase.ts)

Create a `firebase.ts` file in your `src` folder:

```typescript
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB_OiG0B3Lk9iDdXwAAm0YbsemFwYkDzz4",
  authDomain: "skillchain-68998.firebaseapp.com",
  projectId: "skillchain-68998",
  storageBucket: "skillchain-68998.firebasestorage.app",
  messagingSenderId: "506231580358",
  appId: "1:506231580358:web:47761638eaa4637f2ed9c7",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export {db}
```

**⚠️ Security Note**: The Firebase configuration above contains public-facing keys that are safe to include in client-side code. However, ensure your Firestore security rules are properly configured to protect your data.

### App Configuration (src/config.ts)

Create a `config.ts` file in your `src` folder:

```typescript
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'
export const EXPLORER_BASE_URL = 'https://sepolia.etherscan.io'

// Blockchain Configuration
export const CONTRACT_ADDRESS = '0x39c52ea5190FaE336C7BCa389b2086897A55500E'
export const TARGET_CHAIN_ID = '0xaa36a7' // Sepolia testnet

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
```

### Installation Dependencies

Make sure to install the required dependencies:

```bash
npm install
# or
yarn install
```

The project includes all necessary dependencies in `package.json`:
- Vue 3 ecosystem (vue, vue-router, pinia)
- Blockchain libraries (ethers.js, web3.js)
- Firebase & Supabase SDKs
- Tailwind CSS v4
- TypeScript tooling

## Smart Contract

### Contract Overview

The `VerifiedCredentials` smart contract enables:
- Domain-based issuer verification
- Credential issuance with data hash verification
- Credential revocation by issuers
- Time-limited domain verification (90 days)
- Oracle-based domain ownership verification

### Deploying Your Own Contract

You can deploy the smart contract to any Ethereum-compatible network:

1. **Supported Networks**:
   - Ethereum Mainnet
   - Sepolia Testnet (default)
   - Polygon
   - Any EVM-compatible chain

2. **Deployment Steps**:
   ```bash
   # Using Hardhat, Foundry, or Remix
   # 1. Compile the contract
   # 2. Deploy to your chosen network
   # 3. Update CONTRACT_ADDRESS in src/config.ts
   ```

3. **Contract Functions**:
   - `registerDomain()`: Register organization domain
   - `verifyDomainOwnership()`: Oracle verifies domain (admin only)
   - `issueCredential()`: Issue credential to holder
   - `revokeCredential()`: Revoke issued credential
   - `verifyCredentialData()`: Verify credential authenticity

### Smart Contract Code

The complete smart contract is available in `contracts/VerifiedCredentials.sol`.

## Technologies Used

- **Frontend Framework**: Vue 3 with TypeScript
- **Build Tool**: Vite
- **State Management**: Pinia with persisted state
- **Blockchain**: Ethereum-compatible networks (Sepolia, Polygon, etc.)
- **Smart Contract Integration**: Ethers.js & Web3.js
- **Storage**: Supabase Storage (for PDF certificates)
- **Database**: Firebase Firestore
- **Authentication**: Web3 Wallet-based (MetaMask, etc.)
- **Styling**: Tailwind CSS v4
- **UI Icons**: Heroicons Vue
- **QR Code**: jsqr for credential verification

### Firestore Data Structure

The application uses the following Firestore collections:

- **users/{walletAddress}**
  - User profile information
  - Nested collection: `credentials/{credentialId}`

- **issuers/{walletAddress}**
  - Issuer organization information
  - Nested collection: `issuedCredentials/{credentialId}`

- **emails/{email}**
  - Email verification tracking

- **sharedCredentials/{shareId}**
  - Shared credential links with access control

---

## Additional Notes

- Make sure to never commit your `.env` file to version control
- The Firebase configuration in `firebase.ts` contains public-facing keys that are safe for client-side code
- Ensure Firestore security rules are properly configured before deploying to production
- The default configuration uses Sepolia testnet (chain ID: 0xaa36a7)
- Example smart contract deployed at: `0x39c52ea5190FaE336C7BCa389b2086897A55500E`
- You can deploy your own contract to any EVM-compatible network
- Domain verification requires setting up a `.well-known/skillchain-credentials` endpoint
- Domain verification is valid for 90 days and must be renewed
- For production deployment, ensure all environment variables are properly set in your hosting platform
- The project uses Vite's path aliasing via `vite-tsconfig-paths` for cleaner imports
