'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerClassName=""
      containerStyle={{}}
      toastOptions={{
        // Define default options
        className: '',
        duration: 4000,
        style: {
          background: 'rgba(31, 41, 55, 0.95)',
          color: '#fff',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(75, 85, 99, 0.5)',
          borderRadius: '12px',
          fontSize: '14px',
          fontWeight: '500',
          padding: '12px 16px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        },
        // Default options for specific types
        success: {
          duration: 3000,
          style: {
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            color: '#10b981',
          },
          iconTheme: {
            primary: '#10b981',
            secondary: 'rgba(16, 185, 129, 0.1)',
          },
        },
        error: {
          duration: 5000,
          style: {
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
          },
          iconTheme: {
            primary: '#ef4444',
            secondary: 'rgba(239, 68, 68, 0.1)',
          },
        },
        loading: {
          duration: Infinity,
          style: {
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            color: '#3b82f6',
          },
          iconTheme: {
            primary: '#3b82f6',
            secondary: 'rgba(59, 130, 246, 0.1)',
          },
        },
      }}
    />
  );
}
