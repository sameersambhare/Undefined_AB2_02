'use client';

import React, { useState } from 'react';
import { FiSquare, FiType, FiBox } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import ComponentStyler from './ComponentStyler';

interface ComponentListProps {
  onDragStart: (event: React.DragEvent<HTMLDivElement>, component: string, styles: any) => void;
}

interface ComponentStyles {
  [key: string]: any;
}

const ComponentList: React.FC<ComponentListProps> = ({ onDragStart }) => {
  const [componentStyles, setComponentStyles] = useState<ComponentStyles>({});

  const handleStyleChange = (componentName: string, styles: any) => {
    setComponentStyles(prev => ({
      ...prev,
      [componentName]: styles
    }));
  };

  const renderPreview = (name: string) => {
    const styles = componentStyles[name] || {};
    switch (name) {
      case 'Button':
        return (
          <Button
            size={styles.size || "sm"}
            variant={styles.variant || "default"}
            style={{
              backgroundColor: styles.backgroundColor,
              color: styles.textColor,
              borderColor: styles.borderColor,
            }}
          >
            Button
          </Button>
        );
      case 'Input':
        return (
          <Input
            placeholder={styles.placeholder || "Input field"}
            className="w-32"
            style={{
              borderColor: styles.borderColor,
            }}
          />
        );
      case 'Card':
        return (
          <Card
            className="w-32 h-16 flex items-center justify-center p-2"
            style={{
              backgroundColor: styles.backgroundColor,
              borderColor: styles.borderColor,
            }}
          >
            <span className="text-xs text-gray-600">Card Content</span>
          </Card>
        );
      default:
        return null;
    }
  };

  const components = [
    {
      name: 'Button',
      icon: FiSquare,
    },
    {
      name: 'Input',
      icon: FiType,
    },
    {
      name: 'Card',
      icon: FiBox,
    },
  ];

  return (
    <div className="w-72 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <h2 className="text-lg font-semibold mb-4 text-gray-900">Components</h2>
      <div className="space-y-3">
        {components.map((component) => {
          const Icon = component.icon;
          return (
            <div
              key={component.name}
              draggable
              onDragStart={(e) => onDragStart(e, component.name, componentStyles[component.name])}
              className="group relative flex flex-col gap-2 p-3 rounded-md cursor-move hover:bg-gray-50 border border-gray-200 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Icon className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">{component.name}</span>
              </div>
              <div className="flex items-center justify-center bg-gray-50 rounded-md p-2">
                {renderPreview(component.name)}
              </div>
              <ComponentStyler
                componentType={component.name}
                onStyleChange={(styles) => handleStyleChange(component.name, styles)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ComponentList;
