"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { Icon } from "./Icon";

interface ToastContextType {
  showToast: (msg: string, icon?: string) => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toast, setToast] = useState<{ message: string; icon: string; visible: boolean }>({
    message: "",
    icon: "sparkle",
    visible: false,
  });

  const showToast = useCallback((message: string, icon = "sparkle") => {
    setToast({ message, icon, visible: true });
    setTimeout(() => {
      setToast((prev) => ({ ...prev, visible: false }));
    }, 2800);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className={`toast ${toast.visible ? "show" : ""}`}
        role="status"
        aria-live="polite"
      >
        <Icon name={toast.icon} className="ico" />
        <span>{toast.message}</span>
      </div>
    </ToastContext.Provider>
  );
};
