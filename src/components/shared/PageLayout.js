import React from "react";
import { Container } from "react-bootstrap";
import { motion } from "framer-motion";

/**
 * Consistent page shell: container, optional title, and fade-in animation.
 */
export function PageLayout({ title, children, className = "" }) {
  return (
    <Container className={`py-5 ${className}`.trim()}>
      {title && (
        <motion.h2
          className="page-title mb-4"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {title}
        </motion.h2>
      )}
      {children}
    </Container>
  );
}

export function LoadingSpinner({ label = "Loading..." }) {
  return (
    <div className="text-center py-5" role="status" aria-live="polite">
      <div className="spinner-border text-primary" style={{ width: "2.5rem", height: "2.5rem" }} aria-hidden="true" />
      <p className="gray-50 mt-2 mb-0 small">{label}</p>
      <span className="visually-hidden">{label}</span>
    </div>
  );
}

export function EmptyState({ message, action }) {
  return (
    <div className="text-center py-5 px-3">
      <div className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3 bg-primary bg-opacity-10 p-4">
        <i className="fa-solid fa-inbox fa-2x text-primary" aria-hidden />
      </div>
      <p className="gray-50 mb-3 mb-md-0">{message}</p>
      {action}
    </div>
  );
}
