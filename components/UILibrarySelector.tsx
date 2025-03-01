'use client';

import React, { useState, useEffect } from 'react';
import { Card as MuiCard } from './ui-libraries/mui/card';
import { Button as MuiButton } from './ui-libraries/mui/button';
import { Input as MuiInput } from './ui-libraries/mui/input';
import { Card as AntdCard } from './ui-libraries/antd/card';
import { Button as AntdButton } from './ui-libraries/antd/button';
import { Input as AntdInput } from './ui-libraries/antd/input';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface UILibrarySelectorProps {
  onSelect: (library: UILibrary) => void;
  selectedLibrary: UILibrary;
}

type UILibrary = 'mui' | 'antd' | 'shadcn';

const UILibrarySelector: React.FC<UILibrarySelectorProps> = ({ onSelect, selectedLibrary }) => {
  // Add state to track if component is mounted (client-side only)
  const [isMounted, setIsMounted] = useState(false);

  // Use effect to set mounted state after component mounts on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const renderCardPreview = () => {
    // Don't render anything during SSR
    if (!isMounted) return <div className="h-24 bg-gray-100 dark:bg-zinc-800 animate-pulse rounded"></div>;

    switch (selectedLibrary) {
      case 'mui':
        return (
          <MuiCard>
            <h3>Material UI Card</h3>
            <p>This is a card component from Material UI.</p>
          </MuiCard>
        );
      case 'antd':
        return (
          <AntdCard title="Ant Design Card">
            <p>This is a card component from Ant Design.</p>
          </AntdCard>
        );
      case 'shadcn':
      default:
        return (
          <Card className="p-4">
            <h3 className="text-lg font-medium mb-2">Shadcn Card</h3>
            <p className="text-sm text-gray-600 dark:text-zinc-400">This is a card component from Shadcn UI.</p>
          </Card>
        );
    }
  };

  const renderButtonPreview = () => {
    // Don't render anything during SSR
    if (!isMounted) return <div className="h-10 w-32 bg-gray-100 dark:bg-zinc-800 animate-pulse rounded"></div>;

    switch (selectedLibrary) {
      case 'mui':
        return (
          <MuiButton variant="contained" color="primary">
            Material UI Button
          </MuiButton>
        );
      case 'antd':
        return (
          <AntdButton type="primary">
            Ant Design Button
          </AntdButton>
        );
      case 'shadcn':
      default:
        return (
          <Button>
            Shadcn Button
          </Button>
        );
    }
  };

  const renderInputPreview = () => {
    // Don't render anything during SSR
    if (!isMounted) return <div className="h-10 w-full bg-gray-100 dark:bg-zinc-800 animate-pulse rounded"></div>;

    switch (selectedLibrary) {
      case 'mui':
        return (
          <MuiInput
            label="Material UI Input"
            variant="outlined"
            fullWidth
          />
        );
      case 'antd':
        return (
          <AntdInput
            placeholder="Ant Design Input"
          />
        );
      case 'shadcn':
      default:
        return (
          <Input
            placeholder="Shadcn Input"
            className="w-full"
          />
        );
    }
  };

  return (
    <div className="p-4 border rounded-lg bg-white dark:bg-zinc-800 dark:border-zinc-700 shadow-sm">
      <h2 className="text-xl font-semibold mb-4 dark:text-zinc-100">Select UI Library</h2>
      
      <div className="flex flex-wrap gap-2 mb-6">
        <button
          className={`px-4 py-2 rounded ${selectedLibrary === 'shadcn' 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 dark:bg-zinc-700 dark:text-zinc-200'}`}
          onClick={() => onSelect('shadcn')}
        >
          Shadcn UI
        </button>
        <button
          className={`px-4 py-2 rounded ${selectedLibrary === 'mui' 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 dark:bg-zinc-700 dark:text-zinc-200'}`}
          onClick={() => onSelect('mui')}
        >
          Material UI
        </button>
        <button
          className={`px-4 py-2 rounded ${selectedLibrary === 'antd' 
            ? 'bg-blue-500 text-white' 
            : 'bg-gray-200 dark:bg-zinc-700 dark:text-zinc-200'}`}
          onClick={() => onSelect('antd')}
        >
          Ant Design
        </button>
      </div>
      
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-2 dark:text-zinc-100">Card Component</h3>
          <div className="border p-4 rounded dark:border-zinc-700">
            {renderCardPreview()}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2 dark:text-zinc-100">Button Component</h3>
          <div className="border p-4 rounded flex justify-center dark:border-zinc-700">
            {renderButtonPreview()}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium mb-2 dark:text-zinc-100">Input Component</h3>
          <div className="border p-4 rounded dark:border-zinc-700">
            {renderInputPreview()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UILibrarySelector; 