// src/components/ui/dialog.jsx
import * as React from "react";

export function Dialog({ open, children }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      {children}
    </div>
  );
}

export function DialogTrigger({ children, onClick }) {
  return <button onClick={onClick}>{children}</button>;
}

export function DialogContent({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-lg shadow-lg p-6 ${className}`}>
      {children}
    </div>
  );
}

export function DialogHeader({ children, className = "" }) {
  return <div className={`mb-4 ${className}`}>{children}</div>;
}

export function DialogTitle({ children, className = "" }) {
  return <h2 className={`text-lg font-semibold text-center ${className}`}>{children}</h2>;
}

export function DialogDescription({ children, className = "" }) {
  return <p className={`text-gray-600 text-center ${className}`}>{children}</p>;
}

export function DialogFooter({ children, className = "" }) {
  return <div className={`flex justify-center gap-4 mt-6 ${className}`}>{children}</div>;
}
