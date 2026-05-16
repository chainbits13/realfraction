import { useState, useCallback } from "react";
import { useToast } from "../context/ToastContext";

/**
 * Wraps async contract calls with pending state and toast on error/success.
 */
export function useTransaction() {
  const [pendingId, setPendingId] = useState(null);
  const toast = useToast();

  const execute = useCallback(
    async (txId, fn, { successMessage, errorMessage = "Transaction failed" } = {}) => {
      setPendingId(txId);
      try {
        const result = await fn();
        if (successMessage) toast.success(successMessage);
        return result;
      } catch (e) {
        const message = e?.reason ?? e?.message ?? errorMessage;
        toast.error(message);
        throw e;
      } finally {
        setPendingId(null);
      }
    },
    [toast]
  );

  const isPending = useCallback((id) => pendingId === id, [pendingId]);

  return { execute, pendingId, isPending };
}
