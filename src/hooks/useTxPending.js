import { useState, useCallback } from "react";

/**
 * Encapsulates pending transaction state and error handling for contract calls.
 * @returns {{ isPending: boolean; pendingId: string | number | null; setPending: (id: string | number | null) => void; execute: (fn: () => Promise<void>, options?: { pendingId?: string | number }) => Promise<void> }}
 */
export function useTxPending() {
  const [pendingId, setPendingId] = useState(null);
  const [error, setError] = useState(null);

  const setPending = useCallback((id) => {
    setPendingId(id);
    if (id == null) setError(null);
  }, []);

  const execute = useCallback(async (fn, options = {}) => {
    const id = options.pendingId ?? true;
    setPendingId(id);
    setError(null);
    try {
      await fn();
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setPendingId(null);
    }
  }, []);

  return {
    isPending: pendingId != null,
    pendingId,
    setPending,
    execute,
    error,
    clearError: () => setError(null),
  };
}

export default useTxPending;
