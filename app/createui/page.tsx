'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ComponentList from '@/components/ComponentList';
import DragDropEditor from '@/components/DragDropEditor';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthStatus from '@/components/AuthStatus';
import { useAuth } from '@/app/providers/AuthProvider';
import { useToast } from '@/app/providers/ToastProvider';
import Cookies from 'js-cookie';

type UILibrary = 'shadcn' | 'mui' | 'antd';

export default function CreateUI() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const toast = useToast();
  const [showDebug, setShowDebug] = useState(false);
  const [selectedMobileComponent, setSelectedMobileComponent] = useState<{
    type: string;
    styles: any;
    library: UILibrary;
  } | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const authToken = Cookies.get('auth_token');
      
      if (!isLoading) {
        if (!user || !authToken) {
          toast.error('You must be logged in to access this page');
          router.push('/signin?callbackUrl=/createui');
        }
      }
    };
    
    checkAuth();
  }, [user, isLoading, router, toast]);

  const handleDragStart = (
    event: React.DragEvent<HTMLDivElement>,
    component: string,
    styles: any,
    library: UILibrary
  ) => {
    event.dataTransfer.setData('componentType', component);
    event.dataTransfer.setData('componentStyles', JSON.stringify(styles || {}));
    event.dataTransfer.setData('componentLibrary', library);
  };

  const handleMobileComponentSelect = (
    component: string,
    styles: any,
    library: UILibrary
  ) => {
    setSelectedMobileComponent({
      type: component,
      styles,
      library
    });
    toast.info(`${component} selected. Tap on the canvas to place it.`);
  };

  const handleClearMobileComponent = () => {
    setSelectedMobileComponent(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex items-center justify-center px-4">
        <div className="text-center w-full max-w-md">
          <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
          <p className="mb-4">Please sign in to access this page.</p>
          <button 
            onClick={() => router.push('/signin?callbackUrl=/createui')}
            className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Go to Sign In
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex flex-col">
      <Navbar />
      {selectedMobileComponent && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-orange-500 text-white py-2 px-4 text-center">
          <p className="text-sm">
            {selectedMobileComponent.type} selected. Tap on the canvas to place it.
            <button 
              onClick={handleClearMobileComponent}
              className="ml-2 bg-white text-orange-500 px-2 py-0.5 rounded text-xs"
            >
              Cancel
            </button>
          </p>
        </div>
      )}
      <main className="container mx-auto py-4 sm:py-6 px-3 sm:px-4 flex-grow page-content">        
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
          <div className="w-full lg:w-1/4 order-2 lg:order-1">
            <ComponentList 
              onDragStart={handleDragStart} 
              onMobileComponentSelect={handleMobileComponentSelect}
            />
          </div>
          <div className="w-full lg:w-3/4 order-1 lg:order-2">
            <DragDropEditor 
              selectedMobileComponent={selectedMobileComponent}
              onMobileComponentPlaced={handleClearMobileComponent}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
