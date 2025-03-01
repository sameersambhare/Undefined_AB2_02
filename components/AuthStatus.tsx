'use client';

import React, { useEffect } from 'react';
import { useAuth } from '@/app/providers/AuthProvider';
import { useToast } from '@/app/providers/ToastProvider';
import Cookies from 'js-cookie';

const AuthStatus: React.FC = () => {
  const { user, token } = useAuth();
  const toast = useToast();

  useEffect(() => {
    // Check if the auth_token cookie exists
    const authToken = Cookies.get('auth_token');
    
    console.log('Auth Status Component:');
    console.log('- User:', user ? `${user.name} (${user.email})` : 'Not logged in');
    console.log('- Token in state:', token ? 'Exists' : 'Not exists');
    console.log('- Token in cookies:', authToken ? 'Exists' : 'Not exists');
    
    if (!authToken) {
      toast.warning('Authentication token not found in cookies');
    }
  }, [user, token, toast]);

  return (
    <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-sm mb-4">
      <h2 className="text-lg font-semibold mb-2">Authentication Status</h2>
      <div className="space-y-2">
        <p>
          <span className="font-medium">Status:</span>{' '}
          {user ? (
            <span className="text-green-600 dark:text-green-400">Authenticated</span>
          ) : (
            <span className="text-red-600 dark:text-red-400">Not Authenticated</span>
          )}
        </p>
        {user && (
          <>
            <p>
              <span className="font-medium">User:</span> {user.name}
            </p>
            <p>
              <span className="font-medium">Email:</span> {user.email}
            </p>
          </>
        )}
        <p>
          <span className="font-medium">Token in State:</span>{' '}
          {token ? (
            <span className="text-green-600 dark:text-green-400">Present</span>
          ) : (
            <span className="text-red-600 dark:text-red-400">Missing</span>
          )}
        </p>
        <p>
          <span className="font-medium">Token in Cookies:</span>{' '}
          {Cookies.get('auth_token') ? (
            <span className="text-green-600 dark:text-green-400">Present</span>
          ) : (
            <span className="text-red-600 dark:text-red-400">Missing</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default AuthStatus; 