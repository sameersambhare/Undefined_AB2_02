'use client';

import React from 'react';
import { useToast } from '@/app/providers/ToastProvider';

const ToastExample: React.FC = () => {
  const toast = useToast();

  const showSuccessToast = () => {
    toast.success('This is a success message!');
  };

  const showErrorToast = () => {
    toast.error('This is an error message!');
  };

  const showInfoToast = () => {
    toast.info('This is an information message!');
  };

  const showWarningToast = () => {
    toast.warning('This is a warning message!');
  };

  return (
    <div className="p-4 bg-white dark:bg-zinc-900 rounded-lg shadow-sm">
      <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Toast Notification Examples</h2>
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={showSuccessToast}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Show Success
        </button>
        <button
          onClick={showErrorToast}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Show Error
        </button>
        <button
          onClick={showInfoToast}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Show Info
        </button>
        <button
          onClick={showWarningToast}
          className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
        >
          Show Warning
        </button>
      </div>
    </div>
  );
};

export default ToastExample; 