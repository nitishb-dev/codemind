import { useState } from 'react';
import type { ApiResponse } from '../types';

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const executeRequest = async <T>(
    apiCall: () => Promise<ApiResponse<T>>
  ): Promise<T | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiCall();
      
      if (response.success) {
        return response.data || null;
      } else {
        setError(response.error || 'An unknown error occurred');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Request failed';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    executeRequest,
    clearError: () => setError(null),
  };
}