import { ref } from 'vue';
import { useToast } from './useToast';

export const useErrorHandling = () => {
  const { error: showError } = useToast();
  const isRetrying = ref(false);
  
  const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  
  const isCircuitBreakerError = (error: any): boolean => {
    return error?.code === -32603 && 
           error?.message?.includes('circuit breaker');
  };
  
  const isNetworkError = (error: any): boolean => {
    return error?.code === 'NETWORK_ERROR' || 
           error?.message?.includes('network') ||
           error?.message?.includes('timeout');
  };
  
  const handleBlockchainError = async <T>(
    requestFn: () => Promise<T>,
    context: string,
    maxRetries: number = 3,
    baseDelay: number = 2000
  ): Promise<T | null> => {
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await requestFn();
      } catch (error: any) {
        console.error(`${context} attempt ${attempt + 1} failed:`, error);
                if (isCircuitBreakerError(error)) {
          if (attempt < maxRetries - 1) {
            const delayMs = baseDelay * Math.pow(2, attempt);
            console.log(`Circuit breaker open, retrying in ${delayMs/1000} seconds...`);
            
            if (attempt === 0) {
              isRetrying.value = true;
              showError(
                'Network Busy', 
                'MetaMask is experiencing high load. Retrying automatically...'
              );
            }
            
            await delay(delayMs);
            continue;
          } else {
            isRetrying.value = false;
            showError(
              'Network Unavailable',
              'MetaMask circuit breaker is active. Please try again in a few minutes.'
            );
            return null;
          }
        }
        
        if (isNetworkError(error) && attempt < maxRetries - 1) {
          console.log(`Network error, retrying in ${baseDelay/1000} seconds...`);
          await delay(baseDelay);
          continue;
        }
        
        isRetrying.value = false;
        
        if (error?.message?.includes('user rejected')) {
          showError('Transaction Cancelled', 'You cancelled the transaction');
        } else if (error?.message?.includes('insufficient funds')) {
          showError('Insufficient Funds', 'You don\'t have enough ETH for gas fees');
        } else if (error?.message?.includes('nonce')) {
          showError('Transaction Error', 'Transaction nonce error. Please try again');
        } else {
          showError(
            `${context} Failed`, 
            error?.reason || error?.message || 'An unexpected error occurred'
          );
        }
        
        return null;
      }
    }
    
    isRetrying.value = false;
    return null;
  };
  
  const withErrorHandling = <T>(
    requestFn: () => Promise<T>,
    context: string
  ) => {
    return handleBlockchainError(requestFn, context);
  };
  
  return {
    isRetrying,
    handleBlockchainError,
    withErrorHandling,
    isCircuitBreakerError,
    isNetworkError
  };
};