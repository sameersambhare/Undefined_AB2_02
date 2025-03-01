'use client';

import React from 'react';
import { ToastContainer, toast, ToastOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Default toast options
const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  theme: "colored",
};

// Create a context for toast functions
export const ToastContext = React.createContext({
  success: (message: string, options?: ToastOptions) => {},
  error: (message: string, options?: ToastOptions) => {},
  info: (message: string, options?: ToastOptions) => {},
  warning: (message: string, options?: ToastOptions) => {},
});

export const useToast = () => React.useContext(ToastContext);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  // Toast functions
  const success = (message: string, options?: ToastOptions) => 
    toast.success(message, { ...defaultOptions, ...options });
  
  const error = (message: string, options?: ToastOptions) => 
    toast.error(message, { ...defaultOptions, ...options });
  
  const info = (message: string, options?: ToastOptions) => 
    toast.info(message, { ...defaultOptions, ...options });
  
  const warning = (message: string, options?: ToastOptions) => 
    toast.warning(message, { ...defaultOptions, ...options });

  const value = {
    success,
    error,
    info,
    warning,
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </ToastContext.Provider>
  );
} 