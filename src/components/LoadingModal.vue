<script setup lang="ts">
import { ArrowPathIcon } from '@heroicons/vue/24/outline';

defineProps<{
  title: string,
  message: string,
  isLoading: boolean
}>()
</script>

<template>
  <Transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0"
    enter-to-class="opacity-100" leave-active-class="transition-all duration-200 ease-in" leave-from-class="opacity-100"
    leave-to-class="opacity-0">
    <div v-if="isLoading" class="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50">

      <Transition enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 scale-95 translate-y-4" enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in" leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-4">
        <div v-if="isLoading"
          class="relative bg-gradient-to-b from-[#252236] to-[#1f1d2c] rounded-2xl border border-[#e6902e]/30 shadow-2xl shadow-[#e6902e]/10 max-w-md w-full overflow-hidden">
          <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e6902e]/40 to-transparent">
          </div>
          <div class="p-8 text-center">
            <div class="mb-6 flex justify-center">
              <div class="relative">
                <div class="absolute inset-0 h-16 w-16 rounded-full border-2 border-[#e6902e]/20"></div>
                <div
                  class="h-16 w-16 rounded-full bg-gradient-to-br from-[#e6902e]/20 to-[#e6902e]/5 flex items-center justify-center">
                  <ArrowPathIcon class="h-8 w-8 text-[#e6902e] animate-spin" />
                </div>
                <div class="absolute inset-0 h-16 w-16 rounded-full bg-[#e6902e]/10 animate-pulse"></div>
              </div>
            </div>

            <h3 class="text-xl font-bold text-white mb-3 leading-tight">
              {{title}}
            </h3>

            <p class="text-gray-300 leading-relaxed text-[15px] mb-4">
              {{message}}
            </p>

            <div class="flex justify-center gap-1">
              <div class="h-1.5 w-1.5 bg-[#e6902e] rounded-full animate-pulse" style="animation-delay: 0ms"></div>
              <div class="h-1.5 w-1.5 bg-[#e6902e]/70 rounded-full animate-pulse" style="animation-delay: 150ms"></div>
              <div class="h-1.5 w-1.5 bg-[#e6902e]/40 rounded-full animate-pulse" style="animation-delay: 300ms"></div>
            </div>
          </div>

          <div
            class="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#e6902e]/20 to-transparent">
          </div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>