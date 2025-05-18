// src/components/ui/dialog.jsx
import React, { createContext, useContext, useState } from "react";

const DialogContext = createContext();

export const Dialog = ({ open, onOpenChange, children }) => {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
};
export const DialogDescription = ({ children }) => {
  return <p className="text-sm text-gray-600">{children}</p>;
};

export const DialogTrigger = ({ asChild, children }) => {
  const { onOpenChange } = useContext(DialogContext);

  const trigger = React.cloneElement(children, {
    onClick: () => onOpenChange(true),
  });

  return asChild ? trigger : <button onClick={() => onOpenChange(true)}>{children}</button>;
};

export const DialogContent = ({ children }) => {
  const { open, onOpenChange } = useContext(DialogContext);

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
      <div className="bg-white p-6 rounded shadow-lg w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
          onClick={() => onOpenChange(false)}
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export const DialogHeader = ({ children }) => {
  return <div className="mb-4">{children}</div>;
};

export const DialogTitle = ({ children }) => {
  return <h2 className="text-xl font-semibold">{children}</h2>;
};
export const DialogFooter = ({ children }) => {
  return <div className="mt-4 flex justify-end">{children}</div>;
};
