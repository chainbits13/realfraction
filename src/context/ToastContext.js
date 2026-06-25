import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

const AUTO_DISMISS_MS = 5000;

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({ show: false, message: "", variant: "info" });

  const show = useCallback((message, variant = "info") => {
    setToast({ show: true, message, variant });
  }, []);

  const hide = useCallback(() => {
    setToast((t) => ({ ...t, show: false }));
  }, []);

  const error = useCallback((message) => show(message, "danger"), [show]);
  const success = useCallback((message) => show(message, "success"), [show]);
  const info = useCallback((message) => show(message, "info"), [show]);

  React.useEffect(() => {
    if (!toast.show) return;
    const id = setTimeout(hide, AUTO_DISMISS_MS);
    return () => clearTimeout(id);
  }, [toast.show, hide]);

  const value = { toast, show, hide, error, success, info };

  return (
    <ToastContext.Provider value={value}>
      {children}
      {toast.show && (
        <div
          role="alert"
          aria-live="polite"
          className={`alert alert-${toast.variant} position-fixed top-0 end-0 m-3 shadow`}
          style={{ zIndex: 1060, minWidth: 280 }}
        >
          <div className="d-flex justify-content-between align-items-start">
            <span>{toast.message}</span>
            <button type="button" className="btn-close btn-close-white ms-2" aria-label="Close" onClick={hide} />
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) return { toast: { show: false }, show: () => {}, hide: () => {}, error: () => {}, success: () => {}, info: () => {} };
  return ctx;
}
