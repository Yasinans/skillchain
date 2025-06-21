<template>
  <div class="min-h-screen bg-gradient-to-br from-[#0a0a0f] via-[#1a1612] to-[#0f0b0a] text-[#d1c9c1]">
    <Header />
    
    <main class="container mx-auto max-w-7xl px-4 py-8">
      
      <div v-if="verificationResult" class="text-center mb-6">
        <div class="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#e6902e]/20 to-[#fac044]/30 rounded-lg mb-3">
          <ShieldCheckIcon class="h-6 w-6 text-[#e6902e]" />
        </div>
        <h1 class="text-1xl md:text-2xl font-bold bg-gradient-to-r from-white via-[#e6902e] to-[#fac044] bg-clip-text text-transparent mb-2">
          Credential Verification
        </h1>
        <p class="text-sm text-[#9b9182]">Verify blockchain-secured professional credentials</p>
      </div>

      
      <div v-else class="text-center mb-12">
        <div class="relative inline-block mb-6">
          <div class="absolute inset-0 bg-gradient-to-r from-[#e6902e] to-[#fac044] rounded-2xl blur-xl opacity-20"></div>
          <div class="relative bg-gradient-to-br from-[#e6902e]/20 to-[#fac044]/30 rounded-2xl p-4">
            <ShieldCheckIcon class="h-12 w-12 text-[#e6902e] mx-auto" />
          </div>
        </div>
        <h1 class="text-3xl md:text-4xl lg:text-4xl font-bold bg-gradient-to-r from-white via-[#e6902e] to-[#fac044] bg-clip-text text-transparent mb-6">
          Credential Verification
        </h1>
        <p class="text-lg text-[#9b9182] max-w-3xl mx-auto leading-relaxed">
          Verify the authenticity of blockchain-secured professional credentials in seconds. 
          Scan a QR code or enter credential information to begin verification.
        </p>
      </div>

      
      <div v-if="isLoading || isVerifying" class="flex justify-center items-center py-8">
        <div class="bg-white/5 rounded-xl border border-white/10 p-6 text-center max-w-md mx-auto">
          <div class="relative mb-6">
            <div class="w-16 h-16 border-4 border-[#e6902e]/30 border-t-[#e6902e] rounded-full animate-spin mx-auto"></div>
            <div class="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-[#fac044]/50 rounded-full animate-spin mx-auto" style="animation-direction: reverse; animation-duration: 1s;"></div>
          </div>
          <h3 class="text-lg font-bold text-white mb-3">{{ isVerifying ? 'Verifying with Blockchain' : 'Loading' }}</h3>
          <p class="text-[#9b9182] text-sm mb-6">{{ isVerifying ? 'Checking authenticity on blockchain...' : 'Please wait...' }}</p>
          
          
          <div v-if="isVerifying" class="space-y-3">
            <div class="bg-slate-700 rounded-full h-1.5 mb-4">
              <div class="h-1.5 bg-gradient-to-r from-[#e6902e] to-[#fac044] rounded-full animate-pulse" style="width: 75%"></div>
            </div>
            
            <div class="space-y-2 text-xs">
              <div class="flex items-center justify-center gap-2 text-[#9b9182]">
                <div class="w-1.5 h-1.5 bg-[#e6902e] rounded-full animate-pulse"></div>
                <span>Parsing credential data...</span>
              </div>
              <div class="flex items-center justify-center gap-2 text-[#9b9182]">
                <div class="w-1.5 h-1.5 bg-[#e6902e] rounded-full animate-pulse" style="animation-delay: 0.5s"></div>
                <span>Validating blockchain records...</span>
              </div>
              <div class="flex items-center justify-center gap-2 text-[#9b9182]">
                <div class="w-1.5 h-1.5 bg-[#e6902e] rounded-full animate-pulse" style="animation-delay: 1s"></div>
                <span>Verifying credential status...</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      
      <div v-else-if="error" class="max-w-2xl mx-auto">
        <div class="bg-red-500/10 rounded-xl border border-red-500/20 p-6 text-center">
          <ExclamationTriangleIcon class="h-12 w-12 text-red-400 mx-auto mb-4" />
          <h3 class="text-xl font-bold text-red-400 mb-3">Verification Failed</h3>
          <p class="text-red-400/80 mb-6">{{ error }}</p>
          <button
            @click="retry"
            class="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>

      
      <div v-else-if="!verificationResult" class="max-w-4xl mx-auto">
        <div class="grid lg:grid-cols-2 gap-12 items-start">
          <div class="space-y-8">
            <div class="bg-white/5 rounded-2xl border border-white/10 p-8">
              <h2 class="text-2xl font-bold text-white mb-6">How Verification Works</h2>
              <div class="space-y-6">
                <div class="flex items-start gap-4">
                  <div class="w-8 h-8 bg-gradient-to-br from-[#e6902e] to-[#fac044] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-1">1</div>
                  <div>
                    <h3 class="text-white font-semibold mb-2">Scan or Enter</h3>
                    <p class="text-[#9b9182] text-sm">Use your camera to scan a QR code or manually enter the credential share ID</p>
                  </div>
                </div>
                <div class="flex items-start gap-4">
                  <div class="w-8 h-8 bg-gradient-to-br from-[#e6902e] to-[#fac044] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-1">2</div>
                  <div>
                    <h3 class="text-white font-semibold mb-2">Blockchain Validation</h3>
                    <p class="text-[#9b9182] text-sm">Our system validates the credential against the blockchain records</p>
                  </div>
                </div>
                <div class="flex items-start gap-4">
                  <div class="w-8 h-8 bg-gradient-to-br from-[#e6902e] to-[#fac044] rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 mt-1">3</div>
                  <div>
                    <h3 class="text-white font-semibold mb-2">Instant Results</h3>
                    <p class="text-[#9b9182] text-sm">Get comprehensive verification results with detailed credential information</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="bg-blue-500/10 rounded-2xl border border-blue-500/20 p-6">
              <div class="flex items-start gap-3">
                <ShieldCheckIcon class="w-6 h-6 text-blue-400 mt-1 flex-shrink-0" />
                <div>
                  <h3 class="text-blue-300 font-semibold mb-2">Secure & Private</h3>
                  <p class="text-blue-200/80 text-sm">
                    All verification is performed using cryptographic signatures and blockchain validation. 
                    No personal data is stored during this process.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="space-y-6">
            <div class="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
              <div class="p-6">
                <div class="text-center mb-6">
                  <h2 class="text-xl font-bold text-white mb-3">Choose Verification Method</h2>
                </div>

                
                <div class="flex gap-2 p-2 bg-white/5 rounded-xl mb-6">
                  <button
                    @click="activeMethod = 'manual'"
                    class="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200"
                    :class="activeMethod === 'manual' 
                      ? 'bg-gradient-to-r from-[#e6902e] to-[#fac044] text-white shadow-lg' 
                      : 'text-[#9b9182] hover:text-white hover:bg-white/10'"
                  >
                    <HashtagIcon class="w-4 h-4" />
                    Enter Share ID
                  </button>
                  <button
                    @click="activeMethod = 'scan'"
                    class="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200"
                    :class="activeMethod === 'scan' 
                      ? 'bg-gradient-to-r from-[#e6902e] to-[#fac044] text-white shadow-lg' 
                      : 'text-[#9b9182] hover:text-white hover:bg-white/10'"
                  >
                    <QrCodeIcon class="w-4 h-4" />
                    Scan QR
                  </button>
                </div>

                
                <div v-if="activeMethod === 'manual'" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-white mb-2">
                      Credential Share ID
                    </label>
                    <input
                      v-model="shareIdInput"
                      type="text"
                      placeholder="Enter credential share ID..."
                      class="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-3 text-white placeholder-[#9b9182] focus:border-[#e6902e] focus:outline-none transition-colors"
                      @keyup.enter="verifyCredentials"
                    />
                  </div>
                  <button
                    @click="verifyCredentials"
                    :disabled="!shareIdInput.trim()"
                    class="w-full bg-gradient-to-r from-[#e6902e] to-[#fac044] hover:from-[#d17a26] hover:to-[#f0ab45] disabled:from-white/10 disabled:to-white/10 disabled:text-[#9b9182] text-white px-4 py-3 rounded-lg font-medium transition-all duration-200"
                  >
                    Verify Credentials
                  </button>
                </div>

                
                <div v-else class="space-y-6">
                  
                  <div 
                    class="relative mx-auto max-w-md aspect-square border-2 border-dashed rounded-2xl overflow-hidden transition-all duration-200"
                    :class="isScanning ? 'border-[#e6902e]/60 bg-black/90' : 'border-white/20 bg-white/5'"
                  >
                    
                    <div v-if="!isScanning && !cameraError" class="absolute inset-0 flex items-center justify-center">
                      <div class="text-center p-8">
                        <div class="w-20 h-20 mx-auto bg-gradient-to-br from-[#e6902e]/20 to-[#fac044]/30 rounded-2xl flex items-center justify-center mb-6">
                          <CameraIcon class="w-10 h-10 text-[#e6902e]" />
                        </div>
                        <h3 class="text-xl font-bold text-white mb-3">Ready to Scan</h3>
                        <p class="text-[#9b9182] mb-6 text-sm leading-relaxed">
                          Position the QR code within the camera frame for automatic detection
                        </p>
                        <button
                          @click="startScanning"
                          class="inline-flex items-center px-6 py-3 bg-gradient-to-r from-[#e6902e] to-[#fac044] hover:from-[#d17a26] hover:to-[#f0ab45] text-white rounded-lg font-medium transition-all duration-200 shadow-lg"
                        >
                          <CameraIcon class="w-5 h-5 mr-2" />
                          Start Camera
                        </button>
                      </div>
                    </div>

                    
                    <div v-else-if="cameraError" class="absolute inset-0 flex items-center justify-center">
                      <div class="text-center p-8">
                        <ExclamationTriangleIcon class="w-10 h-10 text-red-400 mx-auto mb-4" />
                        <h3 class="text-lg font-bold text-white mb-3">Camera Access Failed</h3>
                        <p class="text-red-400 text-sm mb-6">{{ cameraError }}</p>
                        <button
                          @click="retryCamera"
                          class="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-6 py-3 rounded-lg font-medium transition-colors"
                        >
                          Retry Camera
                        </button>
                      </div>
                    </div>

                    
                    <div v-else class="absolute inset-0">
                      
                      <video
                        ref="videoRef"
                        class="w-full h-full object-cover"
                        muted
                        playsinline
                        webkit-playsinline
                      />
                      
                      
                      <canvas ref="canvasRef" class="hidden" />
                      
                      
                      <div class="absolute inset-8 border-2 border-[#e6902e]/80 rounded-lg">
                        <div class="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-[#e6902e]"></div>
                        <div class="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-[#e6902e]"></div>
                        <div class="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-[#e6902e]"></div>
                        <div class="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-[#e6902e]"></div>
                      </div>
                      
                      
                      <div class="absolute top-4 right-4">
                        <button
                          @click="stopScanning"
                          class="bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
                        >
                          <XMarkIcon class="h-5 w-5" />
                        </button>
                      </div>
                      
                      
                      <div class="absolute bottom-4 left-4 right-4 bg-black/50 rounded-lg p-4 text-center">
                        <div class="flex items-center justify-center gap-2 text-[#e6902e]">
                          <div class="w-2 h-2 bg-[#e6902e] rounded-full animate-pulse"></div>
                          <span class="text-sm font-medium">Scanning for QR codes...</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  
                  <div v-if="isScanning" class="text-center space-y-4">
                    <div class="flex items-center justify-center gap-2 text-[#9b9182]">
                      <div class="w-2 h-2 bg-[#e6902e] rounded-full animate-pulse"></div>
                      <span class="text-sm">Scanning for QR codes...</span>
                    </div>
                    
                    <div class="bg-white/5 rounded-lg p-4">
                      <h4 class="text-white font-medium mb-3">Scanning Tips</h4>
                      <div class="space-y-2 text-sm text-[#9b9182]">
                        <p>• Center the QR code within the scanning frame</p>
                        <p>• Ensure adequate lighting for clear visibility</p>
                        <p>• Keep the camera steady for optimal detection</p>
                        <p>• Move closer or farther to improve focus</p>
                      </div>
                    </div>
                  </div>

                  
                  <div v-if="!isScanning && !cameraError && activeMethod === 'scan'" class="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
                    <div class="flex items-start gap-4">
                      <div class="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <CameraIcon class="w-5 h-5 text-blue-400" />
                      </div>
                      <div class="flex-1">
                        <h4 class="text-blue-400 font-semibold mb-2">Camera Permission Required</h4>
                        <p class="text-blue-300 mb-4 text-sm leading-relaxed">
                          We need access to your camera to scan QR codes. Your privacy is protected - 
                          no images or videos are stored.
                        </p>
                        <p class="text-blue-200/60 text-xs">
                          📱 On mobile: You may need to allow camera permission in your browser settings if this fails
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="bg-white/5 rounded-xl border border-white/10 p-4">
              <h3 class="text-sm font-semibold text-white mb-3">Need Help?</h3>
              <div class="space-y-2 text-xs">
                <p class="text-[#9b9182]">
                  • Share IDs are usually provided by the credential holder
                </p>
                <p class="text-[#9b9182]">
                  • QR codes are typically found on digital certificates
                </p>
                <p class="text-[#9b9182]">
                  • Contact the credential holder if you're having trouble
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      
      <div v-else-if="verificationResult" class="space-y-6">
        
        <div class="bg-gradient-to-r from-emerald-500/10 via-[#e6902e]/10 to-emerald-500/10 rounded-xl border border-emerald-500/20 p-4">
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <ShieldCheckIcon class="h-5 w-5 text-emerald-400" />
            </div>
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <h2 class="text-lg font-bold text-white">Verification Successful</h2>
                <div class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
              <p class="text-emerald-400 text-sm">{{ verificationResult.shareInfo.title || 'Professional Credentials' }}</p>
            </div>
            
            <div class="text-right">
              <div v-if="walletStore.isConnected" class="flex items-center gap-2 text-xs">
                <div class="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span class="text-blue-400">Direct Blockchain Verification</span>
              </div>
              <div v-else class="flex items-center gap-2 text-xs">
                <div class="w-2 h-2 bg-yellow-400 rounded-full"></div>
                <span class="text-yellow-400">API Verification</span>
              </div>
              <button
                v-if="!walletStore.isConnected"
                @click="connectWallet"
                class="mt-1 text-xs text-blue-400 hover:text-blue-300 underline"
              >
                Connect wallet for direct blockchain verification
              </button>
            </div>
          </div>

          
          <div class="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div class="flex items-center gap-2">
              <UserIcon class="h-3 w-3 text-[#9b9182]" />
              <div>
                <p class="text-[#9b9182]">Credential Owner</p>
                <p class="text-white font-mono">{{ shortenAddress(verificationResult.shareInfo.owner) }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <CalendarIcon class="h-3 w-3 text-[#9b9182]" />
              <div>
                <p class="text-[#9b9182]">Shared</p>
                <p class="text-white">{{ formatDate(verificationResult.shareInfo.createdAt) }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <DocumentIcon class="h-3 w-3 text-[#9b9182]" />
              <div>
                <p class="text-[#9b9182]">Total Credentials</p>
                <p class="text-white font-bold">{{ verificationResult.credentials.length }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <EyeIcon class="h-3 w-3 text-[#9b9182]" />
              <div>
                <p class="text-[#9b9182]">Access Count</p>
                <p class="text-white">{{ verificationResult.shareInfo.accessCount }}</p>
              </div>
            </div>
          </div>

          
          <div v-if="verificationResult.shareInfo.description" class="mt-3 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p class="text-blue-400 text-xs font-medium mb-1">Description</p>
            <p class="text-white text-sm">{{ verificationResult.shareInfo.description }}</p>
          </div>
        </div>

        
        <div class="bg-white/5 rounded-xl border border-white/10 p-4">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-white flex items-center gap-2">
              <AcademicCapIcon class="h-5 w-5 text-[#e6902e]" />
              Credentials Summary
            </h3>
            <div class="flex items-center gap-4 text-xs">
              <div class="flex items-center gap-1">
                <div class="w-2 h-2 bg-emerald-400 rounded-full"></div>
                <span class="text-emerald-400">{{ activeCredentialsCount }} Active</span>
              </div>
              <div v-if="revokedCredentialsCount > 0" class="flex items-center gap-1">
                <div class="w-2 h-2 bg-red-400 rounded-full"></div>
                <span class="text-red-400">{{ revokedCredentialsCount }} Revoked</span>
              </div>
              <div class="flex items-center gap-1">
                <div class="w-2 h-2 bg-blue-400 rounded-full"></div>
                <span class="text-blue-400">{{ blockchainVerifiedCount }} Blockchain ✓</span>
              </div>
              <div class="flex items-center gap-1">
                <div class="w-2 h-2 bg-purple-400 rounded-full"></div>
                <span class="text-purple-400">{{ hashVerifiedCount }} Hash ✓</span>
              </div>
            </div>
          </div>

          
          <div class="space-y-3">
            <div
              v-for="(credential, _index) in verificationResult.credentials"
              :key="credential.id"
              class="border border-white/10 rounded-lg overflow-hidden transition-all duration-200"
              :class="[
                credential.blockchainStatus?.isValid ? 'hover:border-emerald-500/30' : 'hover:border-red-500/30'
              ]"
            >
              
              <div 
                class="p-4 cursor-pointer"
                :class="[
                  'transition-colors',
                  credential.blockchainStatus?.isValid 
                    ? 'bg-emerald-500/5 hover:bg-emerald-500/10' 
                    : 'bg-red-500/5 hover:bg-red-500/10'
                ]"
                @click="toggleCredential(credential.id)"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3 flex-1 min-w-0">
                    
                    <div class="flex items-center gap-2">
                      <div 
                        :class="[
                          'w-3 h-3 rounded-full',
                          credential.blockchainStatus?.isValid ? 'bg-emerald-400' : 'bg-red-400'
                        ]"
                      ></div>
                      <div 
                        :class="[
                          'w-2 h-2 rounded-full',
                          credential.status ? 'bg-green-400' : 'bg-gray-400'
                        ]"
                      ></div>
                    </div>

                    
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 mb-1">
                        <h4 class="text-sm font-bold text-white truncate">{{ credential.credentialName }}</h4>
                        <span v-if="credential.skillLevel" class="px-2 py-0.5 rounded-full text-xs font-medium"
                              :class="getSkillLevelColor(credential.skillLevel)">
                          {{ credential.skillLevel }}
                        </span>
                      </div>
                      <div class="flex items-center gap-4 text-xs text-[#9b9182]">
                        <span class="flex items-center gap-1">
                          <BuildingOfficeIcon class="h-3 w-3" />
                          {{ credential.organizationName }}
                        </span>
                        <span class="flex items-center gap-1">
                          <CalendarIcon class="h-3 w-3" />
                          {{ formatDate(credential.issuedDate) }}
                        </span>
                      </div>
                    </div>

                    
                    <div class="flex items-center gap-2">
                      <div v-if="!credential.status" class="px-2 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-medium">
                        Revoked
                      </div>
                      <div 
                        :class="[
                          'px-2 py-1 rounded-full text-xs font-medium',
                          credential.blockchainStatus?.isValid 
                            ? 'bg-emerald-500/20 text-emerald-400' 
                            : 'bg-red-500/20 text-red-400'
                        ]"
                      >
                        {{ credential.blockchainStatus?.verificationMethod || 'Unknown' }} Verified
                      </div>
                      <div 
                        v-if="credential.blockchainStatus?.dataHashVerified !== undefined"
                        :class="[
                          'px-2 py-1 rounded-full text-xs font-medium',
                          credential.blockchainStatus.dataHashVerified 
                            ? 'bg-blue-500/20 text-blue-400' 
                            : 'bg-orange-500/20 text-orange-400'
                        ]"
                      >
                        {{ credential.blockchainStatus.dataHashVerified ? 'Hash ✓' : 'Hash ✗' }}
                      </div>
                    </div>

                    
                    <ChevronDownIcon 
                      :class="[
                        'h-4 w-4 text-[#9b9182] transition-transform duration-200',
                        expandedCredentials.has(credential.id) ? 'transform rotate-180' : ''
                      ]"
                    />
                  </div>
                </div>
              </div>

              
              <div v-if="expandedCredentials.has(credential.id)" class="border-t border-white/10">
                <div class="p-4 space-y-4">
                  
                  <div class="bg-white/5 rounded-lg p-3">
                    <h5 class="text-xs font-medium text-[#9b9182] mb-1">Description</h5>
                    <p class="text-sm text-white">{{ credential.description }}</p>
                  </div>

                  
                  <div :class="[
                    'rounded-lg p-4 border',
                    credential.blockchainStatus?.isValid 
                      ? 'bg-emerald-500/10 border-emerald-500/20' 
                      : 'bg-red-500/10 border-red-500/20'
                  ]">
                    <div class="flex items-center gap-2 mb-3">
                      <CubeIcon class="h-4 w-4" :class="credential.blockchainStatus?.isValid ? 'text-emerald-400' : 'text-red-400'" />
                      <h5 class="text-sm font-medium" :class="credential.blockchainStatus?.isValid ? 'text-emerald-400' : 'text-red-400'">
                        Blockchain Verification ({{ credential.blockchainStatus?.verificationMethod || 'Unknown' }})
                      </h5>
                    </div>
                    
                    
                    <div class="mb-3 p-3 rounded-lg" :class="[
                      credential.blockchainStatus?.dataHashVerified 
                        ? 'bg-blue-500/10 border border-blue-500/20' 
                        : 'bg-orange-500/10 border border-orange-500/20'
                    ]">
                      <div class="flex items-center gap-2 mb-1">
                        <div :class="[
                          'w-2 h-2 rounded-full',
                          credential.blockchainStatus?.dataHashVerified ? 'bg-blue-400' : 'bg-orange-400'
                        ]"></div>
                        <span :class="[
                          'text-xs font-medium',
                          credential.blockchainStatus?.dataHashVerified ? 'text-blue-400' : 'text-orange-400'
                        ]">
                          Data Hash Verification: {{ credential.blockchainStatus?.dataHashVerified ? 'PASSED' : 'FAILED' }}
                        </span>
                      </div>
                      <p class="text-xs" :class="credential.blockchainStatus?.dataHashVerified ? 'text-blue-300' : 'text-orange-300'">
                        {{ credential.blockchainStatus?.dataHashVerified 
                          ? 'Credential data matches blockchain hash' 
                          : 'Credential data does not match stored hash' 
                        }}
                      </p>
                    </div>
                    
                    <div v-if="credential.blockchainStatus?.isValid" class="space-y-3 text-xs">
                      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <span class="text-[#9b9182]">Credential ID:</span>
                          <span class="text-white font-mono ml-1">#{{ credential.credentialId }}</span>
                        </div>
                      </div>
                      <div>
                        <span class="text-[#9b9182]">Transaction Hash:</span>
                        <div class="flex items-center gap-1 mt-1">
                          <span class="text-white font-mono text-xs bg-white/5 px-2 py-1 rounded flex-1 min-w-0 break-all">
                            {{ credential.id }}
                          </span>
                          <button 
                            @click="copyToClipboard(credential.id)"
                            class="p-1 hover:bg-white/10 rounded flex-shrink-0"
                            title="Copy transaction hash"
                          >
                            <ClipboardIcon class="h-3 w-3 text-[#9b9182]" />
                          </button>
                          <a 
                            :href="getExplorerLink(credential.id)"
                            target="_blank"
                            class="p-1 hover:bg-blue-500/20 rounded text-blue-400 flex-shrink-0"
                            title="View on blockchain explorer"
                          >
                            <ArrowTopRightOnSquareIcon class="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                      <div>
                        <span class="text-[#9b9182]">Data Hash:</span>
                        <div class="flex items-center gap-1 mt-1">
                          <span class="text-white font-mono text-xs bg-white/5 px-2 py-1 rounded flex-1 min-w-0 break-all">
                            {{ credential.blockchainStatus.blockchainData?.dataHash || 'N/A' }}
                          </span>
                          <button 
                            v-if="credential.blockchainStatus.blockchainData?.dataHash"
                            @click="copyToClipboard(credential.blockchainStatus.blockchainData.dataHash)"
                            class="p-1 hover:bg-white/10 rounded flex-shrink-0"
                            title="Copy data hash"
                          >
                            <ClipboardIcon class="h-3 w-3 text-[#9b9182]" />
                          </button>
                        </div>
                      </div>
                      <div class="pt-2 border-t border-white/10">
                        <div class="flex items-center gap-2">
                          <span class="text-[#9b9182] text-xs">Smart Contract:</span>
                          <a 
                            :href="getContractExplorerLink()"
                            target="_blank"
                            class="text-blue-400 hover:text-blue-300 text-xs font-mono flex items-center gap-1"
                            title="View contract on blockchain explorer"
                          >
                            {{ getContractAddress() }}
                            <ArrowTopRightOnSquareIcon class="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    </div>

                    <div v-else class="text-xs">
                      <div class="text-red-400 mb-2">Verification Errors:</div>
                      <ul class="list-disc list-inside space-y-1 text-red-300">
                        <li v-for="error in credential.blockchainStatus?.errors" :key="error">{{ error }}</li>
                      </ul>
                    </div>
                  </div>

                  
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="bg-white/5 rounded-lg p-3">
                      <h5 class="text-xs font-medium text-[#9b9182] mb-2">Issuer</h5>
                      <div class="space-y-2">
                        <p class="text-sm text-white font-medium">{{ credential.organizationName }}</p>
                        <div class="flex items-start gap-1">
                          <span class="text-xs text-white font-mono bg-white/5 px-2 py-1 rounded flex-1 min-w-0 break-all">{{ credential.issuer }}</span>
                          <button @click="copyToClipboard(credential.issuer)" class="p-1 hover:bg-white/10 rounded flex-shrink-0" title="Copy address">
                            <ClipboardIcon class="h-3 w-3 text-[#9b9182]" />
                          </button>
                          <a 
                            :href="getAddressExplorerLink(credential.issuer)"
                            target="_blank"
                            class="p-1 hover:bg-blue-500/20 rounded text-blue-400 flex-shrink-0"
                            title="View on blockchain explorer"
                          >
                            <ArrowTopRightOnSquareIcon class="h-3 w-3" />
                          </a>
                        </div>
                      </div>
                    </div>

                    <div class="bg-white/5 rounded-lg p-3">
                      <h5 class="text-xs font-medium text-[#9b9182] mb-2">Holder</h5>
                      <div class="flex items-start gap-1">
                        <span class="text-xs text-white font-mono bg-white/5 px-2 py-1 rounded flex-1 min-w-0 break-all">{{ credential.holder }}</span>
                        <button @click="copyToClipboard(credential.holder)" class="p-1 hover:bg-white/10 rounded flex-shrink-0" title="Copy address">
                          <ClipboardIcon class="h-3 w-3 text-[#9b9182]" />
                        </button>
                        <a 
                          :href="getAddressExplorerLink(credential.holder)"
                          target="_blank"
                          class="p-1 hover:bg-blue-500/20 rounded text-blue-400 flex-shrink-0"
                          title="View on blockchain explorer"
                        >
                          <ArrowTopRightOnSquareIcon class="h-3 w-3" />
                        </a>
                      </div>
                    </div>
                  </div>

                  
                  <div v-if="credential.certificateUrl" class="bg-[#e6902e]/10 border border-[#e6902e]/20 rounded-lg p-3">
                    <div class="flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <DocumentIcon class="h-4 w-4 text-[#e6902e]" />
                        <span class="text-[#e6902e] text-xs font-medium">Certificate Available</span>
                      </div>
                      <a
                        :href="credential.certificateUrl"
                        target="_blank"
                        class="bg-[#e6902e] hover:bg-[#d17e1f] text-white px-3 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1"
                      >
                        View
                        <ArrowTopRightOnSquareIcon class="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        
        <div class="flex flex-wrap gap-3 justify-center">
          <button
            @click="shareIdInput = ''; verificationResult = null; expandedCredentials.clear()"
            class="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <PencilIcon class="h-4 w-4" />
            Verify Another
          </button>
          <button
            @click="exportVerificationReport"
            class="bg-[#e6902e] hover:bg-[#d17e1f] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <DocumentIcon class="h-4 w-4" />
            Export Report
          </button>
          <button
            @click="refreshVerification"
            class="bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <ArrowPathIcon class="h-4 w-4" />
            Re-verify
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { useToast } from '../composables/useToast';
import { useWalletStore } from '../stores/wallet';
import jsQR from 'jsqr';
import { API_BASE_URL, EXPLORER_BASE_URL, CONTRACT_ADDRESS } from '../config';
import Header from '../components/Header.vue';
import {
  QrCodeIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  CalendarIcon,
  DocumentIcon,
  HashtagIcon,
  CameraIcon,
  PencilIcon,
  UserIcon,
  ArrowTopRightOnSquareIcon,
  ChevronDownIcon,
  EyeIcon,
  ArrowPathIcon,
  XMarkIcon,
  CubeIcon,
  ClipboardIcon
} from '@heroicons/vue/24/outline';

const route = useRoute();
const { success: showToastSuccess, error: showToastError } = useToast();
const walletStore = useWalletStore();

const error = ref('');
const verificationResult = ref<any>(null);
const shareIdInput = ref('');
const activeMethod = ref<'scan' | 'manual'>('manual');
const expandedCredentials = ref(new Set<string>());
const isVerifying = ref(false);
const isLoading = ref(false);

const isScanning = ref(false);
const videoRef = ref<HTMLVideoElement | null>(null);
const canvasRef = ref<HTMLCanvasElement | null>(null);
const stream = ref<MediaStream | null>(null);
const cameraError = ref('');
let scanInterval: ReturnType<typeof setInterval> | null = null;

const activeCredentialsCount = computed(() => {
  if (!verificationResult.value?.credentials) return 0;
  return verificationResult.value.credentials.filter((c: any) => c.status).length;
});

const revokedCredentialsCount = computed(() => {
  if (!verificationResult.value?.credentials) return 0;
  return verificationResult.value.credentials.filter((c: any) => !c.status).length;
});

const blockchainVerifiedCount = computed(() => {
  if (!verificationResult.value?.credentials) return 0;
  return verificationResult.value.credentials.filter((c: any) => c.blockchainStatus?.isValid).length;
});

const hashVerifiedCount = computed(() => {
  if (!verificationResult.value?.credentials) return 0;
  return verificationResult.value.credentials.filter((c: any) => c.blockchainStatus?.dataHashVerified).length;
});

onMounted(() => {
  const shareId = route.params.shareId as string || route.query.shareId as string;
  if (shareId) {
    shareIdInput.value = shareId;
    verifyCredentials();
  }
});

onUnmounted(() => {
  stopScanning();
});

const startScanning = async () => {
  try {
    cameraError.value = '';
    
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Camera not supported on this device or browser');
    }
    
    const constraints = {
      video: {
        facingMode: 'environment',
        width: { min: 320, ideal: 640, max: 1920 },
        height: { min: 240, ideal: 480, max: 1080 }
      },
      audio: false
    };

    let mediaStream;
    try {
      mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
    } catch (error) {
      const fallbackConstraints = {
        video: { facingMode: 'environment' },
        audio: false
      };
      mediaStream = await navigator.mediaDevices.getUserMedia(fallbackConstraints);
    }
    
    stream.value = mediaStream;
    isScanning.value = true;

    await nextTick();

    if (videoRef.value) {
      videoRef.value.srcObject = mediaStream;
      videoRef.value.setAttribute('playsinline', 'true');
      videoRef.value.setAttribute('webkit-playsinline', 'true');
      videoRef.value.setAttribute('muted', 'true');
      videoRef.value.muted = true;
      videoRef.value.autoplay = true;
      
      const playPromise = videoRef.value.play();
      if (playPromise !== undefined) {
        await playPromise;
      }
      
      if (videoRef.value.readyState >= 2) {
        startQRDetection();
      } else {
        videoRef.value.addEventListener('loadedmetadata', () => {
          startQRDetection();
        }, { once: true });
      }
    }
  } catch (error: any) {
    console.error('Camera access error:', error);
    
    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
      cameraError.value = 'Camera access denied. Please allow camera access.';
    } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
      cameraError.value = 'No camera found on this device.';
    } else if (error.name === 'NotSupportedError') {
      cameraError.value = 'Camera not supported on this browser.';
    } else if (error.name === 'NotReadableError') {
      cameraError.value = 'Camera is being used by another application.';
    } else {
      cameraError.value = `Camera error: ${error.message}`;
    }
  }
};

const startQRDetection = () => {
  if (!videoRef.value || !canvasRef.value) return;

  const video = videoRef.value;
  const canvas = canvasRef.value;
  const context = canvas.getContext('2d');
  if (!context) return;

  scanInterval = setInterval(() => {
    if (!video.videoWidth || !video.videoHeight) return;

    try {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const qrData = jsQR(imageData.data, imageData.width, imageData.height);
       if (qrData) {
         handleQRDetected(qrData.data);
       }
      
    } catch (error) {
      console.error('QR detection error:', error);
    }
  }, 200);
};

const handleQRDetected = (qrData: string) => {
  if (scanInterval) {
    clearInterval(scanInterval);
    scanInterval = null;
  }
  
  setTimeout(() => {
    stopScanning();
    handleScanComplete(qrData);
  }, 300);
};

const handleScanComplete = async (scannedData: string) => {
  try {
    const parsedData = scannedData.split("/")
    let shareId = parsedData[parsedData.length - 1];
    shareIdInput.value = shareId;
    await verifyCredentials();
    
  } catch (error) {
    console.error('Error parsing scanned data:', error);
    shareIdInput.value = scannedData;
    await verifyCredentials();
  }
};

const retryCamera = () => {
  cameraError.value = '';
  startScanning();
};

const stopScanning = () => {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop());
    stream.value = null;
  }
  
  if (scanInterval) {
    clearInterval(scanInterval);
    scanInterval = null;
  }
  
  isScanning.value = false;
};

const verifyCredentials = async () => {
  if (!shareIdInput.value.trim()) return;

  error.value = '';
  verificationResult.value = null;
  isLoading.value = true;

  try {
    const response = await fetch(`${API_BASE_URL}/api/credentials/shared/${shareIdInput.value.trim()}/credentials`);
    if (!response.ok) {
      const errorData = await response.json();
      switch (errorData.code) {
        case 'SHARE_NOT_FOUND':
          error.value = 'Shared credential not found. Please check the share ID and try again.';
          break;
        case 'SHARE_REVOKED':
          error.value = 'This shared credential has been revoked by the owner.';
          break;
        case 'SHARE_EXPIRED':
          error.value = 'This shared credential has expired.';
          break;
        case 'ACCESS_LIMIT_REACHED':
          error.value = 'Access limit reached for this shared credential.';
          break;
        case 'NO_CREDENTIALS_FOUND':
          error.value = 'No valid credentials found for this share.';
          break;
        default:
          error.value = errorData.error || 'Failed to verify credentials. Please check the share ID and try again.';
      }
      return;
    }
    
    const result = await response.json();
    if (result.success && result.credentials) {
      verificationResult.value = {
        success: true,
        credentials: result.credentials,
        shareInfo: {
          ...result.shareInfo,
          title: result.shareInfo.description || 'Professional Credentials'
        }
      };
      
      isLoading.value = false;
      isVerifying.value = true;
      await performBlockchainVerification();
      isVerifying.value = false;
      
      showToastSuccess('Verification Complete', 'Credentials verified successfully!');
    } else {
      error.value = 'Failed to verify credentials. Please check the share ID and try again.';
    }
  } catch (err: any) {
    console.error('Verification error:', err);

    error.value = 'An error occurred while verifying credentials. Please check your connection and try again.';
  } finally {
    isLoading.value = false;
    isVerifying.value = false;
  }
};

const performBlockchainVerification = async () => {
  if (!verificationResult.value?.credentials) return;

  const canVerifyDirectly = walletStore.isConnected && walletStore.provider;

  for (const credential of verificationResult.value.credentials) {
    try {
      let blockchainData = null;
      let dataVerified = false;
      let verificationMethod = 'API';
      const errors = [];

      if (canVerifyDirectly) {
        try {
          const { useVerifiedCredentials } = await import('../composables/useVerifiedCredentials');
          const { getCredential, verifyCredentialData } = useVerifiedCredentials();
          
          blockchainData = await getCredential(credential.credentialId);
          verificationMethod = 'Blockchain';
          
          if (blockchainData) {
            const issuedAtFromDatabase = new Date(credential.issuedDate).toISOString();
            
            const originalFormat = JSON.stringify({
              skillName: credential.credentialName,
              skillLevel: credential.skillLevel,
              description: credential.description, 
              expiryDate: credential.expiryDate || '',
              notes: credential.additionalNotes || '',
              issuedBy: credential.organizationName,
              issuedAt: issuedAtFromDatabase,
              certificateUrl: credential.certificateUrl || null
            });
            dataVerified = await verifyCredentialData(credential.credentialId, originalFormat);
          }
        } catch (blockchainError) {
          console.warn('Direct blockchain verification failed, falling back to API:', blockchainError);
          errors.push('Direct blockchain access failed');
        }
      }
      
      if (!blockchainData || !canVerifyDirectly) {
        try {
          const credentialResponse = await fetch(`${API_BASE_URL}/api/credentials/verify-blockchain/${credential.credentialId}`);
          if (credentialResponse.ok) {
            const credentialResult = await credentialResponse.json();
            blockchainData = credentialResult.credential;
            verificationMethod = 'API';
          }

          const dataResponse = await fetch(`${API_BASE_URL}/api/credentials/verify-credential-data/${credential.credentialId}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              credentialData: credential 
            })
          });

          if (dataResponse.ok) {
            const dataResult = await dataResponse.json();
            dataVerified = dataResult.isValid;
          } else {
            errors.push('Data hash verification failed via API');
          }
        } catch (apiError) {
          console.error('API verification failed:', apiError);
          errors.push('API verification failed');
        }
      }

      if (!blockchainData) {
        credential.blockchainStatus = {
          isValid: false,
          errors: ['Credential not found on blockchain'],
          blockchainData: null,
          verificationMethod,
          dataHashVerified: false
        };
        continue;
      }

      if (blockchainData.revoked) {
        credential.blockchainStatus = {
          isValid: false,
          errors: ['Credential has been revoked on blockchain'],
          blockchainData,
          verificationMethod,
          dataHashVerified: false
        };
        continue;
      }

      if (!dataVerified) {
        errors.push('Credential data hash does not match blockchain record');
      }

      const isValid = dataVerified && !blockchainData.revoked;

      credential.blockchainStatus = {
        isValid,
        errors,
        blockchainData: {
          ...blockchainData,
          transactionHash: credential.id,
          blockNumber: blockchainData.blockNumber || 'Unknown'
        },
        verificationMethod,
        dataHashVerified: dataVerified
      };

    } catch (err: any) {
      console.error('Blockchain verification error:', err);
      credential.blockchainStatus = {
        isValid: false,
        errors: ['Verification failed: ' + (err.message || 'Unknown error')],
        blockchainData: null,
        verificationMethod: 'Failed',
        dataHashVerified: false
      };
    }
  }
};

const toggleCredential = (credentialId: string) => {
  if (expandedCredentials.value.has(credentialId)) {
    expandedCredentials.value.delete(credentialId);
  } else {
    expandedCredentials.value.add(credentialId);
  }
};

const retry = () => {
  error.value = '';
  verificationResult.value = null;
  verifyCredentials();
};

const refreshVerification = async () => {
  isVerifying.value = true;
  await performBlockchainVerification();
  isVerifying.value = false;
  showToastSuccess('Refresh Complete', 'Blockchain verification refreshed');
};

const connectWallet = async () => {
  try {
    await walletStore.connect();
    showToastSuccess('Wallet Connected', 'You can now perform direct blockchain verification');
    if (verificationResult.value) {
      isVerifying.value = true;
      await performBlockchainVerification();
      isVerifying.value = false;
    }
  } catch (error) {
    showToastError('Connection Failed', 'Failed to connect wallet');
  }
};

const getSkillLevelColor = (level: string) => {
  switch (level?.toLowerCase()) {
    case 'expert': return 'bg-red-500/20 text-red-400';
    case 'advanced': return 'bg-orange-500/20 text-orange-400';
    case 'intermediate': return 'bg-yellow-500/20 text-yellow-400';
    case 'beginner': return 'bg-green-500/20 text-green-400';
    default: return 'bg-gray-500/20 text-gray-400';
  }
};

const formatDate = (dateString: string) => {
  if (!dateString) return 'N/A';
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const shortenAddress = (address: string) => {
  if (!address) return 'N/A';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

const getExplorerLink = (txHash: string) => {
  if (!txHash) return '#';
  return `${EXPLORER_BASE_URL}/tx/${txHash}`;
};

const getAddressExplorerLink = (address: string) => {
  if (!address) return '#';
  return `${EXPLORER_BASE_URL}/address/${address}`;
};

const getContractExplorerLink = () => {
  return `${EXPLORER_BASE_URL}/address/${CONTRACT_ADDRESS}`;
};

const getContractAddress = () => {
  return `${CONTRACT_ADDRESS.slice(0, 6)}...${CONTRACT_ADDRESS.slice(-4)}`;
};

const copyToClipboard = async (text: string) => {
  if (!text) return;
  
  try {
    await navigator.clipboard.writeText(text);
    showToastSuccess('Copied', 'Copied to clipboard!');
  } catch (err) {
    showToastError('Copy Failed', 'Failed to copy to clipboard');
  }
};

const exportVerificationReport = () => {
  const reportData = {
    verificationDate: new Date().toISOString(),
    shareInfo: verificationResult.value?.shareInfo,
    credentials: verificationResult.value?.credentials,
    summary: {
      total: verificationResult.value?.credentials?.length || 0,
      active: activeCredentialsCount.value,
      revoked: revokedCredentialsCount.value,
      blockchainVerified: blockchainVerifiedCount.value,
      hashVerified: hashVerifiedCount.value
    },
    verifiedBy: 'SkillChain Verification System'
  };

  const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `verification-report-${Date.now()}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  
  showToastSuccess('Export Complete', 'Verification report exported!');
};
</script>