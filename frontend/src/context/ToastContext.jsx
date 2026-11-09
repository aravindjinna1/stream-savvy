/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, opts = {}) => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2,8);
    const toast = { id, message, duration: opts.duration || 3000, type: opts.type || "info" };
    setToasts((s) => [...s, toast]);
    setTimeout(() => {
      setToasts((s) => s.filter(t => t.id !== id));
    }, toast.duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((s) => s.filter(t => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, removeToast }}>
      {children}
      <div className="fixed right-4 bottom-6 z-50 flex flex-col gap-2 items-end">
        {toasts.map(t => (
          <div key={t.id} className={`max-w-xs w-full px-4 py-2 rounded shadow-lg transform transition-all duration-200 ${t.type === 'error' ? 'bg-red-600' : t.type === 'success' ? 'bg-green-600' : 'bg-gray-800'} text-white`}>
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx.showToast;
};
