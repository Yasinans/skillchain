<template>
<div id="how-it-works" class="relative bg-[#140f0f] border-y-[1px] border-[#707378] overflow-hidden">
  <div class="absolute inset-0 overflow-hidden">
    <div class="floating-orb absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-orange-500/10 to-yellow-500/10 rounded-full blur-xl"></div>
    <div class="floating-orb-2 absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-full blur-xl"></div>
    <div class="floating-orb-3 absolute bottom-32 left-1/4 w-40 h-40 bg-gradient-to-r from-orange-500/8 to-amber-500/8 rounded-full blur-xl"></div>
    
    <div v-for="i in 15" :key="i" 
         :class="`particle particle-${i} absolute w-1 h-1 bg-yellow-400/30 rounded-full`"
         :style="{
           left: Math.random() * 100 + '%',
           top: Math.random() * 100 + '%',
           animationDelay: Math.random() * 20 + 's'
         }">
    </div>
    
    
    <div class="grid-pattern absolute inset-0 opacity-5"></div>
  </div>
  
  
  <div class="relative z-10 max-w-5xl px-4 xl:px-0 py-10 lg:pt-20 lg:pb-20 mx-auto">
    <div class="max-w-3xl mb-10 lg:mb-14">
      <h2 class="main-text  font-bold text-2xl md:text-4xl md:leading-tight bg-gradient-to-r from-white via-yellow-100 to-orange-100 bg-clip-text text-transparent">
        How SkillChain Works
      </h2>
      <p class="mt-1 text-neutral-400 text-lg leading-relaxed">
        This profound insight guides our comprehensive strategy — from meticulous research and strategic planning to the seamless execution of brand development and website or product deployment.
      </p>
    </div>
    
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 lg:items-center">
      
      <div class="aspect-w-16 aspect-h-9 lg:aspect-none group">
        <div class="relative overflow-hidden rounded-xl bg-gradient-to-br from-orange-900/20 to-yellow-900/20 p-1">
          <img class="w-full object-cover rounded-lg transition-transform duration-700 group-hover:scale-105" 
               src="https://images.unsplash.com/photo-1587614203976-365c74645e83?q=80&w=480&h=600&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
               alt="Features Image">
          
          <div class="absolute inset-0 bg-gradient-to-t from-orange-900/20 via-transparent to-yellow-900/20 rounded-lg"></div>
        </div>
      </div>

      
      <div>
        <div class="mb-6">
          <h3 class="text-[#fac044] text-xs font-medium uppercase tracking-wider flex items-center">
            <span class="inline-block w-8 h-px bg-gradient-to-r from-[#e6902e] to-[#fac044] mr-3"></span>
            Steps
          </h3>
        </div>
        
        <div class="flex gap-x-5 ms-1 group">
          <div class="relative last:after:hidden after:absolute after:top-8 after:bottom-0 after:start-4 after:w-px after:-translate-x-[0.5px] after:bg-gradient-to-b after:from-[#e6902e]/50 after:to-[#fac044]/50">
            <div class="relative z-10 size-8 flex justify-center items-center">
              <span class="flex shrink-0 justify-center items-center size-8 border border-[#e6902e]/50 bg-gradient-to-br from-[#e6902e]/10 to-[#fac044]/10 text-[#fac044] font-semibold text-xs uppercase rounded-full transition-all duration-300 group-hover:border-[#fac044] group-hover:shadow-lg group-hover:shadow-[#e6902e]/25">
                1
              </span>
            </div>
          </div>
          <div class="grow pt-0.5 pb-8 sm:pb-12">
            <p class="text-sm lg:text-base text-neutral-400 leading-relaxed">
              <span class="text-white font-semibold bg-gradient-to-r from-white to-[#fac044] bg-clip-text ">Issuers Create Credentials</span><br>
              Verified organizations issue digital certificates that are permanently recorded on the blockchain
            </p>
          </div>
        </div>
        
        <div class="flex gap-x-5 ms-1 group">
          <div class="relative last:after:hidden after:absolute after:top-8 after:bottom-0 after:start-4 after:w-px after:-translate-x-[0.5px] after:bg-gradient-to-b after:from-[#e6902e]/50 after:to-[#fac044]/50">
            <div class="relative z-10 size-8 flex justify-center items-center">
              <span class="flex shrink-0 justify-center items-center size-8 border border-[#e6902e]/50 bg-gradient-to-br from-[#e6902e]/10 to-[#fac044]/10 text-[#fac044] font-semibold text-xs uppercase rounded-full transition-all duration-300 group-hover:border-[#fac044] group-hover:shadow-lg group-hover:shadow-[#e6902e]/25">
                2
              </span>
            </div>
          </div>
          <div class="grow pt-0.5 pb-8 sm:pb-12">
            <p class="text-sm lg:text-base text-neutral-400 leading-relaxed">
              <span class="text-white font-semibold bg-gradient-to-r from-white to-[#fac044] bg-clip-text ">Users Collect & Share</span><br>
              Professionals build their verifiable portfolio and control who can access their credentials
            </p>
          </div>
        </div>
        
        <div class="flex gap-x-5 ms-1 group">
          <div class="relative last:after:hidden after:absolute after:top-8 after:bottom-0 after:start-4 after:w-px after:-translate-x-[0.5px] after:bg-gradient-to-b after:from-[#e6902e]/50 after:to-[#fac044]/50">
            <div class="relative z-10 size-8 flex justify-center items-center">
              <span class="flex shrink-0 justify-center items-center size-8 border border-[#e6902e]/50 bg-gradient-to-br from-[#e6902e]/10 to-[#fac044]/10 text-[#fac044] font-semibold text-xs uppercase rounded-full transition-all duration-300 group-hover:border-[#fac044] group-hover:shadow-lg group-hover:shadow-[#e6902e]/25">
                3
              </span>
            </div>
          </div>
          <div class="grow pt-0.5 pb-8 sm:pb-12">
            <p class="text-sm md:text-base text-neutral-400 leading-relaxed">
              <span class="text-white font-semibold bg-gradient-to-r from-white to-[#fac044] bg-clip-text ">Verifiers Scan & Trust</span><br>
              Employers instantly verify authenticity with a simple QR scan - no registration needed
            </p>
          </div>
        </div>
        
        <a class="group inline-flex items-center gap-x-2 py-3 px-6 bg-[#e6902e] hover:bg-[#e67f0af1] font-medium text-sm text-white rounded-full transition-all duration-300 hover:shadow-lg hover:shadow-[#e6902e]/25 hover:scale-105 focus:outline-hidden" 
           href="/register">
          Get Started
          <svg class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </a>
      </div>
    </div>
  </div>
</div>
</template>

<style scoped>
.floating-orb {
  animation: float 8s ease-in-out infinite;
}

.floating-orb-2 {
  animation: float 10s ease-in-out infinite reverse;
}

.floating-orb-3 {
  animation: float 12s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  33% {
    transform: translateY(-20px) rotate(120deg);
  }
  66% {
    transform: translateY(20px) rotate(240deg);
  }
}

.particle {
  animation: particle-float 15s linear infinite;
}

@keyframes particle-float {
  0% {
    transform: translateY(100vh) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) translateX(100px);
    opacity: 0;
  }
}

.grid-pattern {
  background-image: 
    linear-gradient(#e6902e33 1px, transparent 1px),
    linear-gradient(90deg, #e6902e33 1px, transparent 1px);
  background-size: 50px 50px;
  animation: grid-move 20s linear infinite;
}

@keyframes grid-move {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(50px, 50px);
  }
}

.particle-1 { animation-delay: 0s; }
.particle-2 { animation-delay: 1s; }
.particle-3 { animation-delay: 2s; }
.particle-4 { animation-delay: 3s; }
.particle-5 { animation-delay: 4s; }
.particle-6 { animation-delay: 5s; }
.particle-7 { animation-delay: 6s; }
.particle-8 { animation-delay: 7s; }
.particle-9 { animation-delay: 8s; }
.particle-10 { animation-delay: 9s; }
.particle-11 { animation-delay: 10s; }
.particle-12 { animation-delay: 11s; }
.particle-13 { animation-delay: 12s; }
.particle-14 { animation-delay: 13s; }
.particle-15 { animation-delay: 14s; }

.group:hover .size-8 span {
  box-shadow: 0 0 20px #e6902e40;
}

@media (max-width: 768px) {
  .floating-orb,
  .floating-orb-2,
  .floating-orb-3 {
    display: none;
  }
}
</style>