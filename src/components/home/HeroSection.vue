<script setup>
import DashboardImage from '../../assets/images/dashboard_image.png'
import { useRouter } from 'vue-router';
</script>
<template>
  <div class="relative isolate overflow-hidden">
    <svg
      class="absolute inset-0 -z-10 h-full w-full stroke-white/10 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
      aria-hidden="true">
      <defs>
        <pattern id="983e3e4c-de6d-4c3f-8d64-b9761d1534cc" width="200" height="200" x="50%" y="-1"
          patternUnits="userSpaceOnUse">
          <path d="M.5 200V.5H200" fill="none" />
        </pattern>
      </defs>

      <rect width="100%" height="100%" stroke-width="0" fill="url(#983e3e4c-de6d-4c3f-8d64-b9761d1534cc)" />
    </svg>
    <div
      class="absolute left-[calc(50%-4rem)] top-10 -z-10 transform-gpu blur-3xl sm:left-[calc(50%-18rem)] lg:left-48 lg:top-[calc(50%-30rem)] xl:left-[calc(50%-24rem)]"
      aria-hidden="true">
      <div class="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-[#ff8080] to-[#e58646] opacity-20"
        style="clip-path: polygon(73.6% 51.7%, 91.7% 11.8%, 100% 46.4%, 97.4% 82.2%, 92.5% 84.9%, 75.7% 64%, 55.3% 47.5%, 46.5% 49.4%, 45% 62.9%, 50.3% 87.2%, 21.3% 64.1%, 0.1% 100%, 5.4% 51.1%, 21.4% 63.9%, 58.9% 0.2%, 73.6% 51.7%)" />
    </div>
    <div class="mx-auto max-w-7xl px-6 pb-24 pt-10 sm:pb-32 lg:flex lg:px-8 lg:py-30">
      <div class="mx-auto max-w-2xl flex-shrink-0 lg:mx-0 lg:max-w-xl ">
        <h1 class="main-text mt-10 text-4xl font-bold tracking-tight text-white sm:text-6xl">Skills Never Lie on the
          <span class="blockchain-text">Blockchain</span></h1>
        <p class="mt-6 text-lg leading-8 text-gray-300">Instant, tamper-proof verification of certifications and skills
          powered by decentralized technology</p>
        <div class="mt-10 flex items-center gap-x-6">
          <a href="/register"
            class="rounded-md transition-all bg-button-primary hover:bg-button-primary-hover px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm  focus-visible:outline  focus-visible:outline-offset-2 focus-visible:outline-[#e67f0af1]">Get
            Started</a>
          <a href="#features" class="text-sm font-semibold leading-6 text-white">Learn more <span
              aria-hidden="true">→</span></a>
        </div>
      </div>
      <div class="mx-auto mt-16 flex max-w-2xl sm:mt-24 lg:ml-10 lg:mr-0 lg:mt-0 lg:max-w-none lg:flex-none xl:ml-32">
        <div class="max-w-3xl flex-none sm:max-w-5xl ">
          <img :src="DashboardImage"
            alt="App screenshot" width="1824" height="1082"
            class="w-[76rem] rounded-md bg-white/5 shadow-2xl ring-1 ring-white/10" />
        </div>
      </div>
    </div>
  </div>
</template>


<style scoped></style>