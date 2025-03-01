'use client'
import React, { useState } from "react";
import { FiMove, FiTrash2, FiSave, FiEye, FiEdit2 } from 'react-icons/fi';
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

interface SavedLayout {
  name: string;
  components: DroppedComponent[];
  savedAt: string;
}

const DragDropEditor: React.FC = () => {
  const [components, setComponents] = useState<DroppedComponent[]>([]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [layoutName, setLayoutName] = useState('');
  const [draggedComponentId, setDraggedComponentId] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);

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

    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // If we're moving an existing component
    if (draggedComponentId) {
      setComponents(prev => prev.map(comp => 
        comp.id === draggedComponentId
          ? { ...comp, position: { x, y } }
          : comp
      ));
      setDraggedComponentId(null);
      return;
    }

    // If we're adding a new component
    const componentType = e.dataTransfer.getData('componentType');
    const componentStyles = JSON.parse(e.dataTransfer.getData('componentStyles') || '{}');

    // Default styles based on component type if no styles are provided
    const defaultStyles = {
      Button: {
        variant: "default",
        size: "default",
        backgroundColor: "#3b82f6", // blue-500
        textColor: "#ffffff",
        borderColor: "transparent",
        borderWidth: "1px",
        borderStyle: "solid",
        borderRadius: "0.375rem", // rounded-md
        padding: "0.5rem 1rem",
        fontSize: "0.875rem", // text-sm
        fontWeight: "500", // font-medium
        width: "auto",
        height: "auto",
        shadow: "sm",
      },
      Input: {
        placeholder: "Input field",
        backgroundColor: "#ffffff",
        borderColor: "#d1d5db", // gray-300
        borderWidth: "1px",
        borderStyle: "solid",
        borderRadius: "0.375rem", // rounded-md
        padding: "0.5rem 0.75rem",
        fontSize: "0.875rem", // text-sm
        width: "100%",
        height: "auto",
        textColor: "#374151", // gray-700
      },
      Card: {
        backgroundColor: "#ffffff",
        borderColor: "#e5e7eb", // gray-200
        borderWidth: "1px",
        borderStyle: "solid",
        borderRadius: "0.5rem", // rounded-lg
        padding: "1rem",
        width: "100%",
        height: "auto",
        shadow: "sm",
        textColor: "#374151", // gray-700
      }
    };

    // Merge default styles with provided styles
    const mergedStyles = {
      ...(defaultStyles[componentType as keyof typeof defaultStyles] || {}),
      ...componentStyles
    };

    const newComponent: DroppedComponent = {
      id: `${componentType}-${Date.now()}`,
      type: componentType,
      position: { x, y },
      styles: mergedStyles,
    };

    setComponents((prev) => [...prev, newComponent]);
  };

  const handleComponentDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.stopPropagation();
    setDraggedComponentId(id);
    // Set a transparent drag image
    const dragImage = new Image();
    dragImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(dragImage, 0, 0);
  };

  const handleReset = () => {
    setComponents([]);
    setSelectedComponent(null);
  };

  const handleSave = () => {
    if (!layoutName.trim()) return;

    const savedLayout: SavedLayout = {
      name: layoutName,
      components: components,
      savedAt: new Date().toISOString(),
    };

    const existingLayouts = JSON.parse(localStorage.getItem('savedLayouts') || '[]');
    const updatedLayouts = [...existingLayouts, savedLayout];
    localStorage.setItem('savedLayouts', JSON.stringify(updatedLayouts));
    
    setShowSaveDialog(false);
    setLayoutName('');
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
    const isSelected = selectedComponent === id && !isPreviewMode;
    const commonStyles = {
      width: styles?.width || 'auto',
      height: styles?.height || 'auto',
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

    const wrapperClasses = `relative group ${isPreviewMode ? '' : 'cursor-move'} ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`;

    switch (type) {
      case 'Button':
        return (
          <div 
            className={wrapperClasses}
            onClick={(e) => !isPreviewMode && handleComponentClick(id, e)}
            draggable={!isPreviewMode}
            onDragStart={(e) => handleComponentDragStart(e, id)}
          >
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
          <div 
            className={wrapperClasses}
            onClick={(e) => !isPreviewMode && handleComponentClick(id, e)}
            draggable={!isPreviewMode}
            onDragStart={(e) => handleComponentDragStart(e, id)}
          >
            <Input
              placeholder={styles?.placeholder || "Input field"}
              style={commonStyles}
              disabled={isPreviewMode}
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
          <div 
            className={wrapperClasses}
            onClick={(e) => !isPreviewMode && handleComponentClick(id, e)}
            draggable={!isPreviewMode}
            onDragStart={(e) => handleComponentDragStart(e, id)}
          >
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
      </div>
      <div
        className={`flex-1 min-h-[600px] bg-white rounded-t-lg shadow-sm border-2 ${
          isDraggingOver && !isPreviewMode ? 'border-indigo-500 border-dashed' : 'border-gray-200'
        } relative overflow-hidden`}
        onDragOver={!isPreviewMode ? handleDragOver : undefined}
        onDragLeave={!isPreviewMode ? handleDragLeave : undefined}
        onDrop={!isPreviewMode ? handleDrop : undefined}
        onClick={!isPreviewMode ? handleCanvasClick : undefined}
      >
        {components.length === 0 && !isPreviewMode && (
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

      {/* Footer with actions */}
      <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-x-2 border-b-2 border-gray-200 rounded-b-lg">
        <div className="flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                size="sm" 
                className="flex items-center gap-2"
                disabled={components.length === 0 || isPreviewMode}
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

          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => {
              setIsPreviewMode(!isPreviewMode);
              if (!isPreviewMode) {
                setSelectedComponent(null);
              }
            }}
          >
            {isPreviewMode ? (
              <>
                <FiEdit2 className="w-4 h-4" />
                Edit Mode
              </>
            ) : (
              <>
                <FiEye className="w-4 h-4" />
                Preview
              </>
            )}
          </Button>
        </div>

        <AlertDialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
          <AlertDialogTrigger asChild>
            <Button 
              variant="default" 
              size="sm" 
              className="flex items-center gap-2"
              disabled={components.length === 0 || isPreviewMode}
            >
              <FiSave className="w-4 h-4" />
              Save Layout
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Save Layout</AlertDialogTitle>
              <AlertDialogDescription>
                Give your layout a name to save it. You can load it later.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <div className="py-4">
              <Input
                placeholder="Enter layout name"
                value={layoutName}
                onChange={(e) => setLayoutName(e.target.value)}
                className="w-full"
              />
            </div>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setLayoutName('')}>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleSave} disabled={!layoutName.trim()}>
                Save
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default DragDropEditor;
