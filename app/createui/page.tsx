'use client';

import React from 'react';
import ComponentList from '../components/ComponentList';
import DragDropEditor from '../components/DragDropEditor';
import Navbar from '../components/Navbar';

const CreateUI: React.FC = () => {
  const handleDragStart = (event: React.DragEvent<HTMLDivElement>, component: string, styles: any) => {
    event.dataTransfer.setData('componentType', component);
    event.dataTransfer.setData('componentStyles', JSON.stringify(styles || {}));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6">
            <ComponentList onDragStart={handleDragStart} />
            <DragDropEditor />
          </div>
        </div>
      </main>
    </div>
  );
};

export default CreateUI;
