<template>
  <footer class="relative bg-[#0f0c0c] border-t border-[#4f4b61] overflow-hidden">
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute bottom-0 left-1/4 w-32 h-32 bg-gradient-to-r from-orange-500/5 to-yellow-500/5 rounded-full blur-xl"></div>
      <div class="absolute top-0 right-1/3 w-24 h-24 bg-gradient-to-r from-yellow-500/5 to-orange-500/5 rounded-full blur-xl"></div>
      
      <div class="absolute inset-0 opacity-5">
        <div class="grid-pattern w-full h-full"></div>
      </div>
    </div>
    <div class="relative z-10 max-w-6xl mx-auto px-4 py-8">
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div class="flex flex-col sm:flex-row sm:items-center gap-4">
          <div class="group">
            <a href="/" class="inline-flex items-center gap-2 transition-all duration-300 hover:scale-105">
              <div class="w-8 h-8 bg-gradient-to-br from-[#e6902e] to-[#fac044] rounded-lg flex items-center justify-center group-hover:shadow-lg group-hover:shadow-[#e6902e]/25 transition-all duration-300">
                <svg class="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
                </svg>
              </div>
              <span class="text-xl font-bold bg-gradient-to-r from-white via-yellow-100 to-orange-100 bg-clip-text text-transparent">
                SkillChain
              </span>
            </a>
          </div>
          <div class="hidden sm:block w-px h-6 bg-[#4f4b61]"></div>
          <p class="text-[#9b9182] text-sm">
            © {{ new Date().getFullYear() }} SkillChain. All rights reserved.
          </p>
        </div>

        <div class="flex items-center gap-4">
          <span class="text-[#9b9182] text-sm hidden sm:inline">Follow us:</span>
          <div class="flex items-center gap-3">
            <a 
              href="https://x.com" 
              target="_blank" 
              rel="noopener noreferrer"
              class="group relative p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 hover:border-[#e6902e]/30 transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="fill-current text-[#9b9182] group-hover:text-[#fac044] transition-colors">
                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
              </svg>
              <div class="absolute inset-0 bg-gradient-to-br from-[#e6902e]/0 to-[#fac044]/0 group-hover:from-[#e6902e]/10 group-hover:to-[#fac044]/10 rounded-lg transition-all duration-300"></div>
            </a>

            <a 
              href="https://youtube.com" 
              target="_blank" 
              rel="noopener noreferrer"
              class="group relative p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 hover:border-[#e6902e]/30 transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="fill-current text-[#9b9182] group-hover:text-[#fac044] transition-colors">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
              </svg>
              <div class="absolute inset-0 bg-gradient-to-br from-[#e6902e]/0 to-[#fac044]/0 group-hover:from-[#e6902e]/10 group-hover:to-[#fac044]/10 rounded-lg transition-all duration-300"></div>
            </a>

            <a 
              href="https://www.facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              class="group relative p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 hover:border-[#e6902e]/30 transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="fill-current text-[#9b9182] group-hover:text-[#fac044] transition-colors">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
              </svg>
              <div class="absolute inset-0 bg-gradient-to-br from-[#e6902e]/0 to-[#fac044]/0 group-hover:from-[#e6902e]/10 group-hover:to-[#fac044]/10 rounded-lg transition-all duration-300"></div>
            </a>

            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              class="group relative p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 hover:border-[#e6902e]/30 transition-all duration-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" class="fill-current text-[#9b9182] group-hover:text-[#fac044] transition-colors">
                <path d="M12 .5C5.37.5 0 5.78 0 12.292c0 5.211 3.438 9.63 8.205 11.188.6.111.82-.254.82-.567 0-.28-.01-1.022-.015-2.005-3.338.711-4.042-1.582-4.042-1.582-.546-1.361-1.335-1.725-1.335-1.725-1.087-.731.084-.716.084-.716 1.205.082 1.838 1.215 1.838 1.215 1.07 1.803 2.809 1.282 3.495.981.108-.763.417-1.282.76-1.577-2.665-.295-5.466-1.309-5.466-5.827 0-1.287.465-2.339 1.235-3.164-.135-.298-.54-1.497.105-3.121 0 0 1.005-.316 3.3 1.209.96-.262 1.98-.392 3-.398 1.02.006 2.04.136 3 .398 2.28-1.525 3.285-1.209 3.285-1.209.645 1.624.24 2.823.12 3.121.765.825 1.23 1.877 1.23 3.164 0 4.53-2.805 5.527-5.475 5.817.42.354.81 1.077.81 2.182 0 1.578-.015 2.846-.015 3.229 0 .309.21.678.825.56C20.565 21.917 24 17.495 24 12.292 24 5.78 18.627.5 12 .5z"/>
              </svg>
              <div class="absolute inset-0 bg-gradient-to-br from-[#e6902e]/0 to-[#fac044]/0 group-hover:from-[#e6902e]/10 group-hover:to-[#fac044]/10 rounded-lg transition-all duration-300"></div>
            </a>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.grid-pattern {
  background-image: 
    linear-gradient(#e6902e1a 1px, transparent 1px),
    linear-gradient(90deg, #e6902e1a 1px, transparent 1px);
  background-size: 40px 40px;
  animation: grid-move 30s linear infinite;
}

@keyframes grid-move {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(40px, 40px);
  }
}
</style>