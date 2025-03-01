'use client';

import React, { useState } from 'react';
import UILibrarySelector from '@/components/UILibrarySelector';

type UILibrary = 'shadcn' | 'mui' | 'antd';

export default function UILibrariesPage() {
  const [selectedLibrary, setSelectedLibrary] = useState<UILibrary>('shadcn');

  const handleLibrarySelect = (library: UILibrary) => {
    setSelectedLibrary(library);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">UI Libraries Showcase</h1>
      <p className="mb-6">
        This page demonstrates different UI components from various UI libraries.
        Select a library to see how the components look and behave.
      </p>
      <UILibrarySelector 
        selectedLibrary={selectedLibrary} 
        onSelect={handleLibrarySelect} 
      />
    </div>
  );
} 