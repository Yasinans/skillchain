<script setup lang="ts">
import { RouterLink } from 'vue-router'
import { 
  HomeIcon, 
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  MagnifyingGlassIcon
} from '@heroicons/vue/24/outline'
import Header from '../components/Header.vue'
</script>

<template>
  <div class="min-h-screen">
    <Header />
    
    <main class="flex-1">
      <div class="relative overflow-hidden">
        <div class="absolute inset-0">
          <div class="absolute top-20 left-10 w-64 h-64 bg-gradient-to-br from-[#e6902e]/10 to-[#fac044]/5 rounded-full blur-3xl"></div>
          <div class="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-[#fac044]/8 to-[#e6902e]/3 rounded-full blur-3xl"></div>
        </div>

        <div class="relative max-w-4xl mx-auto px-6 pt-20 pb-16 text-center">
          <div class="mb-8">
            <div class="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-[#e6902e]/20 to-[#fac044]/10 rounded-2xl border border-[#e6902e]/20 backdrop-blur-sm">
              <ExclamationTriangleIcon class="h-12 w-12 text-[#e6902e]" />
            </div>
          </div>

          <div class="mb-6">
            <h1 class="text-8xl md:text-9xl font-bold mb-4 main-text">
              404
            </h1>
            <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">
              Page Not Found
            </h2>
            <p class="text-[#d1c9c1] text-lg max-w-2xl mx-auto leading-relaxed">
              Oops! The page you're looking for seems to have vanished into the blockchain. 
              Don't worry, your credentials are still safe and sound.
            </p>
          </div>

          <div class="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <RouterLink 
              to="/"
              class="bg-gradient-to-r from-[#e6902e] to-[#fac044] hover:from-[#fac044] hover:to-[#e6902e] text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-lg shadow-[#e6902e]/25 inline-flex items-center gap-2"
            >
              <HomeIcon class="h-5 w-5" />
              Go to Homepage
            </RouterLink>
            
            <button 
              @click="$router.go(-1)"
              class="bg-white/5 hover:bg-white/10 text-[#d1c9c1] hover:text-white border border-white/10 hover:border-[#e6902e]/50 px-8 py-3 rounded-lg font-medium transition-all duration-200 inline-flex items-center gap-2"
            >
              <ArrowLeftIcon class="h-5 w-5" />
              Go Back
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <RouterLink 
              to="/dashboard"
              class="group bg-white/5 hover:bg-gradient-to-br hover:from-[#e6902e]/10 hover:to-[#fac044]/5 backdrop-blur-sm border border-white/10 hover:border-[#e6902e]/30 rounded-xl p-6 transition-all duration-200 hover:scale-105"
            >
              <div class="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#e6902e]/20 to-[#fac044]/10 rounded-lg mb-4 mx-auto group-hover:from-[#e6902e]/30 group-hover:to-[#fac044]/20 transition-all">
                <svg class="w-6 h-6 text-[#e6902e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"/>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-white mb-2 group-hover:text-[#fac044] transition-colors">
                Dashboard
              </h3>
              <p class="text-[#d1c9c1]/70 text-sm">
                View and manage your credentials
              </p>
            </RouterLink>

            <RouterLink 
              to="/verify"
              class="group bg-white/5 hover:bg-gradient-to-br hover:from-[#e6902e]/10 hover:to-[#fac044]/5 backdrop-blur-sm border border-white/10 hover:border-[#e6902e]/30 rounded-xl p-6 transition-all duration-200 hover:scale-105"
            >
              <div class="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#e6902e]/20 to-[#fac044]/10 rounded-lg mb-4 mx-auto group-hover:from-[#e6902e]/30 group-hover:to-[#fac044]/20 transition-all">
                <MagnifyingGlassIcon class="w-6 h-6 text-[#e6902e]" />
              </div>
              <h3 class="text-lg font-semibold text-white mb-2 group-hover:text-[#fac044] transition-colors">
                Verify Credentials
              </h3>
              <p class="text-[#d1c9c1]/70 text-sm">
                Check credential authenticity
              </p>
            </RouterLink>

            <RouterLink 
              to="/register"
              class="group bg-white/5 hover:bg-gradient-to-br hover:from-[#e6902e]/10 hover:to-[#fac044]/5 backdrop-blur-sm border border-white/10 hover:border-[#e6902e]/30 rounded-xl p-6 transition-all duration-200 hover:scale-105"
            >
              <div class="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-[#e6902e]/20 to-[#fac044]/10 rounded-lg mb-4 mx-auto group-hover:from-[#e6902e]/30 group-hover:to-[#fac044]/20 transition-all">
                <svg class="w-6 h-6 text-[#e6902e]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
                </svg>
              </div>
              <h3 class="text-lg font-semibold text-white mb-2 group-hover:text-[#fac044] transition-colors">
                Get Started
              </h3>
              <p class="text-[#d1c9c1]/70 text-sm">
                Create your account today
              </p>
            </RouterLink>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.min-h-screen {
  background: #271712;
  background: linear-gradient(180deg, #1a1612 0%, rgba(54, 27, 46, 0.171) 100%);
}

.main-text {
  color: #ffffff; 
  background-image: linear-gradient(45deg, #f7e6cc, #ffffff 50%, #ffaa5a 100%); 
  background-clip: text; 
  -webkit-background-clip: text; 
  -webkit-text-fill-color: transparent; 
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
}

.group:hover .animate-float {
  animation: float 2s ease-in-out infinite;
}
</style>