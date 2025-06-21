<script setup lang="ts">
import { useToast } from '../composables/useToast';
import Toast from './Toast.vue';

const { toasts, removeToast } = useToast();
</script>

<template>
  <div class="fixed bottom-4 right-4 z-50 space-y-3 pointer-events-none">
    <TransitionGroup
      name="toast"
      tag="div"
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-x-full scale-95 translate-y-4"
      enter-to-class="opacity-100 translate-x-0 scale-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-x-0 scale-100 translate-y-0"
      leave-to-class="opacity-0 translate-x-full scale-95 translate-y-4"
      move-class="transition-transform duration-300"
    >
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto"
      >
        <Toast
          :title="toast.title"
          :message="toast.message"
          :status="toast.status"
          :is-visible="true"
          :duration="0"
          :closable="toast.closable"
          @close="removeToast(toast.id)"
        />
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.toast-move {
  transition: transform 0.3s ease;
}
</style>