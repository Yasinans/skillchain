import { ref } from 'vue';

export interface Toast {
  id: string;
  title: string;
  message: string;
  status: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  closable?: boolean;
}

const toasts = ref<Toast[]>([]);

export const useToast = () => {
  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      id,
      duration: 5000,
      closable: true,
      ...toast,
    };

    toasts.value.push(newToast);

    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, newToast.duration);
    }

    return id;
  };

  const removeToast = (id: string) => {
    const index = toasts.value.findIndex(toast => toast.id === id);
    if (index > -1) {
      toasts.value.splice(index, 1);
    }
  };

  const clearAllToasts = () => {
    toasts.value = [];
  };

  const success = (title: string, message: string, options?: Partial<Omit<Toast, 'id' | 'title' | 'message' | 'status'>>) => {
    return addToast({ title, message, status: 'success', ...options });
  };

  const error = (title: string, message: string, options?: Partial<Omit<Toast, 'id' | 'title' | 'message' | 'status'>>) => {
    return addToast({ title, message, status: 'error', ...options });
  };

  const warning = (title: string, message: string, options?: Partial<Omit<Toast, 'id' | 'title' | 'message' | 'status'>>) => {
    return addToast({ title, message, status: 'warning', ...options });
  };

  const info = (title: string, message: string, options?: Partial<Omit<Toast, 'id' | 'title' | 'message' | 'status'>>) => {
    return addToast({ title, message, status: 'info', ...options });
  };

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    success,
    error,
    warning,
    info,
  };
};