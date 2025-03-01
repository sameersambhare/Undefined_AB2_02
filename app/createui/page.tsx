'use client';

import React, { useState } from 'react';
import ComponentList from '@/components/ComponentList';
import DragDropEditor from '@/components/DragDropEditor';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

type UILibrary = 'shadcn' | 'mui' | 'antd';

export default function CreateUI() {
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="container mx-auto py-6 px-4 flex-grow">
        <div className="flex flex-col md:flex-row gap-6">
          <ComponentList onDragStart={handleDragStart} />
          <DragDropEditor />
        </div>
      </main>
      <Footer />
    </div>
  );
}
