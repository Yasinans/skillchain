<script setup lang="ts">
import { 
  ExclamationTriangleIcon, 
  QrCodeIcon,
  XMarkIcon
} from '@heroicons/vue/24/outline';
import type { ConfirmationModalData } from '../types/modals.type';

const props = defineProps<{
    confirmationModal: ConfirmationModalData
}>();

const closeConfirmation = () => {
  props.confirmationModal.isOpen = false;
};
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="confirmationModal.isOpen" 
         class="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4"
         @click.self="closeConfirmation">
      
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 scale-95 translate-y-4"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-4"
      >
        <div v-if="confirmationModal.isOpen" 
             class="relative bg-gradient-to-b from-[#252236] to-[#1f1d2c] rounded-2xl border border-[#e6902e]/30 shadow-2xl shadow-[#e6902e]/10 max-w-md w-full overflow-hidden">
                    <div class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#e6902e]/40 to-transparent"></div>
          
          <button @click="closeConfirmation"
                  class="absolute top-4 right-4 p-2 rounded-full hover:bg-[#e6902e]/10 transition-all duration-200 group z-10">
            <XMarkIcon class="h-5 w-5 text-gray-400 group-hover:text-[#e6902e] transition-colors" />
          </button>
          <div class="p-6 pb-4">
            <div class="flex items-start gap-4">
              <div :class="[
                'flex-shrink-0 h-12 w-12 rounded-xl flex items-center justify-center ring-2 ring-offset-2 ring-offset-[#1f1d2c] transition-all duration-300',
                confirmationModal.type === 'generate' 
                  ? 'bg-[#e6902e]/15 ring-[#e6902e]/40 text-[#e6902e]' 
                  : 'bg-red-900/40 ring-red-500/40 text-red-400'
              ]">
                <QrCodeIcon v-if="confirmationModal.type === 'generate'" class="h-6 w-6" />
                <ExclamationTriangleIcon v-else class="h-6 w-6" />
              </div>
              
              <div class="flex-1 pt-1">
                <h3 class="text-xl font-bold text-white mb-3 leading-tight">
                  {{ confirmationModal.title }}
                </h3>
                <p class="text-gray-300 leading-relaxed text-[15px]">
                  {{ confirmationModal.message }}
                </p>
              </div>
            </div>
          </div>
          <div class="px-6 pb-6">
            <div class="pt-4 border-t border-[#e6902e]/10">
              <div class="flex justify-end gap-3">
                <button @click="closeConfirmation"
                        class="px-5 py-2.5 border border-[#3a3631] rounded-lg text-gray-300 hover:bg-[#e6902e]/5 hover:border-[#e6902e]/30 hover:text-white transition-all duration-200 font-medium">
                  Cancel
                </button>
                
                <button @click="confirmationModal.action"
                        :class="[
                          'px-5 py-2.5 rounded-lg font-semibold text-white shadow-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]',
                          confirmationModal.type === 'generate' 
                            ? 'bg-gradient-to-r from-[#e6902e] to-[#d4851f] hover:from-[#f29d32] hover:to-[#e6902e] shadow-[#e6902e]/30' 
                            : 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-red-500/30'
                        ]">
                  {{ confirmationModal.actionType }}
                </button>
              </div>
            </div>
          </div>
          <div class="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#e6902e]/20 to-transparent"></div>
        </div>
      </Transition>
    </div>
  </Transition>
</template>