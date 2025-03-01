'use client'
import React, { useState } from "react";
import { FiMove, FiTrash2 } from 'react-icons/fi';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import ComponentStyler from './ComponentStyler';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from './ui/alert-dialog';

interface DroppedComponent {
  id: string;
  type: string;
  position: { x: number; y: number };
  styles: any;
}

const DragDropEditor: React.FC = () => {
  const [components, setComponents] = useState<DroppedComponent[]>([]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);

    const componentType = e.dataTransfer.getData('componentType');
    const componentStyles = JSON.parse(e.dataTransfer.getData('componentStyles') || '{}');
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newComponent: DroppedComponent = {
      id: `${componentType}-${Date.now()}`,
      type: componentType,
      position: { x, y },
      styles: componentStyles,
    };

    setComponents((prev) => [...prev, newComponent]);
  };

  const handleReset = () => {
    setComponents([]);
    setSelectedComponent(null);
  };

  const handleComponentClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedComponent(id);
  };

  const handleCanvasClick = () => {
    setSelectedComponent(null);
  };

  const handleStyleChange = (componentId: string, newStyles: any) => {
    setComponents(prev => prev.map(comp => 
      comp.id === componentId 
        ? { ...comp, styles: { ...comp.styles, ...newStyles } }
        : comp
    ));
  };

  const renderComponent = (component: DroppedComponent) => {
    const { type, styles, id } = component;
    const isSelected = selectedComponent === id;
    const commonStyles = {
      width: styles?.width,
      height: styles?.height,
      padding: styles?.padding,
      margin: styles?.margin,
      fontSize: styles?.fontSize,
      fontWeight: styles?.fontWeight,
      textAlign: styles?.textAlign as any,
      letterSpacing: styles?.letterSpacing,
      backgroundColor: styles?.backgroundColor,
      color: styles?.textColor,
      borderColor: styles?.borderColor,
      borderWidth: styles?.borderWidth,
      borderStyle: styles?.borderStyle,
      borderRadius: styles?.borderRadius,
      opacity: styles?.opacity ? Number(styles.opacity) / 100 : 1,
      boxShadow: styles?.shadow === 'none' ? 'none' : 
                 styles?.shadow === 'sm' ? '0 1px 2px 0 rgb(0 0 0 / 0.05)' :
                 styles?.shadow === 'md' ? '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' :
                 styles?.shadow === 'lg' ? '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' :
                 styles?.shadow === 'xl' ? '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' : 'none',
    };

    switch (type) {
      case 'Button':
        return (
          <div className="relative group" onClick={(e) => handleComponentClick(id, e)}>
            <Button
              size={styles?.size || "default"}
              variant={styles?.variant || "default"}
              style={commonStyles}
            >
              Button
            </Button>
            {isSelected && (
              <ComponentStyler
                componentType={type}
                onStyleChange={(styles) => handleStyleChange(id, styles)}
                initialStyles={component.styles}
              />
            )}
          </div>
        );
      case 'Input':
        return (
          <div className="relative group" onClick={(e) => handleComponentClick(id, e)}>
            <Input
              placeholder={styles?.placeholder || "Input field"}
              style={commonStyles}
            />
            {isSelected && (
              <ComponentStyler
                componentType={type}
                onStyleChange={(styles) => handleStyleChange(id, styles)}
                initialStyles={component.styles}
              />
            )}
          </div>
        );
      case 'Card':
        return (
          <div className="relative group" onClick={(e) => handleComponentClick(id, e)}>
            <Card
              className="flex items-center justify-center"
              style={commonStyles}
            >
              <span style={{ color: styles?.textColor }}>Card Content</span>
            </Card>
            {isSelected && (
              <ComponentStyler
                componentType={type}
                onStyleChange={(styles) => handleStyleChange(id, styles)}
                initialStyles={component.styles}
              />
            )}
          </div>
        );
      default:
        return <div>Unknown Component</div>;
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex justify-between items-center mb-4 px-4">
        <h2 className="text-lg font-semibold text-gray-900">Editor Canvas</h2>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button 
              variant="destructive" 
              size="sm" 
              className="flex items-center gap-2"
              disabled={components.length === 0}
            >
              <FiTrash2 className="w-4 h-4" />
              Reset Canvas
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset Canvas</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to reset the canvas? This will remove all components and cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleReset}>Reset</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div
        className={`flex-1 min-h-[600px] bg-white rounded-lg shadow-sm border-2 ${
          isDraggingOver ? 'border-indigo-500 border-dashed' : 'border-gray-200'
        } relative overflow-hidden`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleCanvasClick}
      >
        {components.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
            <FiMove className="w-8 h-8 mb-2" />
            <p className="text-sm">Drag and drop components here</p>
          </div>
        )}

        {components.map((component) => (
          <div
            key={component.id}
            className="absolute"
            style={{
              left: component.position.x,
              top: component.position.y,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {renderComponent(component)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DragDropEditor;
