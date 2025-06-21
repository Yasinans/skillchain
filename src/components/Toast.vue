<script setup lang="ts">
import { 
  CheckCircleIcon, 
  XCircleIcon, 
  ExclamationTriangleIcon, 
  InformationCircleIcon,
  XMarkIcon 
} from '@heroicons/vue/24/outline';
import { computed } from 'vue';

export interface ToastProps {
  title: string;
  message: string;
  status: 'success' | 'error' | 'warning' | 'info';
  isVisible: boolean;
  duration?: number;
  closable?: boolean;
}

const props = withDefaults(defineProps<ToastProps>(), {
  duration: 5000,
  closable: true
});

const emit = defineEmits<{
  close: [];
}>();

// Status configurations
const statusConfig = computed(() => {
  const configs = {
    success: {
      icon: CheckCircleIcon,
      primaryColor: '#10b981', // emerald-500
      gradientFrom: 'from-emerald-500/20',
      gradientTo: 'to-emerald-500/5',
      borderColor: 'border-emerald-500/30',
      shadowColor: 'shadow-emerald-500/10',
      topGradient: 'via-emerald-500/40',
      bottomGradient: 'via-emerald-500/20',
      iconColor: 'text-emerald-500',
      dotColors: ['bg-emerald-500', 'bg-emerald-500/70', 'bg-emerald-500/40']
    },
    error: {
      icon: XCircleIcon,
      primaryColor: '#ef4444', // red-500
      gradientFrom: 'from-red-500/20',
      gradientTo: 'to-red-500/5',
      borderColor: 'border-red-500/30',
      shadowColor: 'shadow-red-500/10',
      topGradient: 'via-red-500/40',
      bottomGradient: 'via-red-500/20',
      iconColor: 'text-red-500',
      dotColors: ['bg-red-500', 'bg-red-500/70', 'bg-red-500/40']
    },
    warning: {
      icon: ExclamationTriangleIcon,
      primaryColor: '#f59e0b', // amber-500
      gradientFrom: 'from-amber-500/20',
      gradientTo: 'to-amber-500/5',
      borderColor: 'border-amber-500/30',
      shadowColor: 'shadow-amber-500/10',
      topGradient: 'via-amber-500/40',
      bottomGradient: 'via-amber-500/20',
      iconColor: 'text-amber-500',
      dotColors: ['bg-amber-500', 'bg-amber-500/70', 'bg-amber-500/40']
    },
    info: {
      icon: InformationCircleIcon,
      primaryColor: '#3b82f6', // blue-500
      gradientFrom: 'from-blue-500/20',
      gradientTo: 'to-blue-500/5',
      borderColor: 'border-blue-500/30',
      shadowColor: 'shadow-blue-500/10',
      topGradient: 'via-blue-500/40',
      bottomGradient: 'via-blue-500/20',
      iconColor: 'text-blue-500',
      dotColors: ['bg-blue-500', 'bg-blue-500/70', 'bg-blue-500/40']
    }
  };
  
  return configs[props.status];
});

const handleClose = () => {
  emit('close');
};

// Auto close functionality
if (props.duration > 0) {
  setTimeout(() => {
    if (props.isVisible) {
      handleClose();
    }
  }, props.duration);
}
</script>

<template>
  <Transition 
    enter-active-class="transition-all duration-300 ease-out" 
    enter-from-class="opacity-0 translate-y-2" 
    enter-to-class="opacity-100 translate-y-0" 
    leave-active-class="transition-all duration-200 ease-in" 
    leave-from-class="opacity-100 translate-y-0" 
    leave-to-class="opacity-0 translate-y-2"
  >
    <div 
      v-if="isVisible" 
      :class="[
        'fixed bottom-4 right-4 z-50 max-w-md w-full',
        'bg-gradient-to-b from-[#252236] to-[#1f1d2c] rounded-2xl',
        'shadow-2xl overflow-hidden',
        statusConfig.borderColor,
        statusConfig.shadowColor,
        'border'
      ]"
    >
      
      <div 
        :class="[
          'absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent',
          statusConfig.topGradient
        ]"
      ></div>

      <div class="p-6 relative">
        
        <button 
          v-if="closable"
          @click="handleClose"
          class="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors duration-200"
        >
          <XMarkIcon class="h-5 w-5" />
        </button>

        <div class="flex items-start space-x-4">
          
          <div class="flex-shrink-0">
            <div class="relative">
              <div 
                :class="[
                  'absolute inset-0 h-12 w-12 rounded-full border-2',
                  statusConfig.borderColor.replace('border-', 'border-').replace('/30', '/20')
                ]"
              ></div>
              <div 
                :class="[
                  'h-12 w-12 rounded-full bg-gradient-to-br flex items-center justify-center',
                  statusConfig.gradientFrom,
                  statusConfig.gradientTo
                ]"
              >
                <component 
                  :is="statusConfig.icon" 
                  :class="['h-6 w-6', statusConfig.iconColor]" 
                />
              </div>
              <div 
                :class="[
                  'absolute inset-0 h-12 w-12 rounded-full animate-pulse',
                  statusConfig.gradientFrom.replace('from-', 'bg-').replace('/20', '/10')
                ]"
              ></div>
            </div>
          </div>

          
          <div class="flex-1 min-w-0 pt-1">
            <h3 class="text-lg font-bold text-white mb-2 leading-tight">
              {{ title }}
            </h3>

            <p class="text-gray-300 leading-relaxed text-sm">
              {{ message }}
            </p>
          </div>
        </div>

        
        <div class="flex justify-center gap-1 mt-4">
          <div 
            v-for="(colorClass, index) in statusConfig.dotColors" 
            :key="index"
            :class="[
              'h-1.5 w-1.5 rounded-full animate-pulse',
              colorClass
            ]" 
            :style="{ animationDelay: `${index * 150}ms` }"
          ></div>
        </div>
      </div>

      
      <div 
        :class="[
          'absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent to-transparent',
          statusConfig.bottomGradient
        ]"
      ></div>
    </div>
  </Transition>
</template>