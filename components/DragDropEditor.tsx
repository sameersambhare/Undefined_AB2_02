'use client'
import React, { useState, useEffect, useRef } from "react";
import { FiMove, FiTrash2, FiSave, FiEye, FiEdit2, FiDownload, FiList, FiCode, FiRotateCcw, FiRotateCw, FiCornerRightDown, FiChevronDown } from 'react-icons/fi';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
// Import UI library components
import { Button as MuiButton } from './ui-libraries/mui/button';
import { Input as MuiInput } from './ui-libraries/mui/input';
import { Card as MuiCard } from './ui-libraries/mui/card';
import { Button as AntdButton } from './ui-libraries/antd/button';
import { Input as AntdInput } from './ui-libraries/antd/input';
import { Card as AntdCard } from './ui-libraries/antd/card';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { useAuth } from '@/app/providers/AuthProvider';
import { useSearchParams } from 'next/navigation';
import { useToast } from "@/components/ui/use-toast";
import { Toaster } from "@/components/ui/toaster";

interface DroppedComponent {
  id: string;
  type: string;
  position: { x: number; y: number };
  styles: any;
  library?: 'shadcn' | 'mui' | 'antd';
}

interface SavedLayout {
  _id?: string;
  name: string;
  components: DroppedComponent[];
  createdAt?: string;
  updatedAt?: string;
}

// Add a counter for stable ID generation
let componentIdCounter = 0;

// Resizable Component Wrapper
interface ResizableComponentProps {
  children: React.ReactNode;
  component: DroppedComponent;
  isSelected: boolean;
  isPreviewMode: boolean;
  onResize: (id: string, width: string, height: string) => void;
}

const ResizableComponent: React.FC<ResizableComponentProps> = ({
  children,
  component,
  isSelected,
  isPreviewMode,
  onResize
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState({ width: 0, height: 0 });
  
  // Handle resize start
  const handleResizeStart = (e: React.MouseEvent) => {
    if (isPreviewMode) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    if (containerRef.current) {
      const { width, height } = containerRef.current.getBoundingClientRect();
      setStartSize({ width, height });
      setStartPos({ x: e.clientX, y: e.clientY });
      setIsResizing(true);
    }
  };

  // Handle resize move
  const handleResizeMove = (e: MouseEvent) => {
    if (!isResizing) return;
    
    const deltaX = e.clientX - startPos.x;
    const deltaY = e.clientY - startPos.y;
    
    let newWidth = Math.max(20, startSize.width + deltaX);
    let newHeight = Math.max(20, startSize.height + deltaY);
    
    // Maintain aspect ratio for Circle
    if (component.type === 'Circle') {
      newHeight = newWidth;
    }
    
    // Special case for Line component
    if (component.type === 'Line') {
      newHeight = 0;
    }
    
    // Update component size
    onResize(component.id, `${newWidth}px`, `${newHeight}px`);
  };

  // Handle resize end
  const handleResizeEnd = () => {
    setIsResizing(false);
  };

  // Add and remove event listeners
  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', handleResizeMove);
      window.addEventListener('mouseup', handleResizeEnd);
    }
    
    return () => {
      window.removeEventListener('mousemove', handleResizeMove);
      window.removeEventListener('mouseup', handleResizeEnd);
    };
  }, [isResizing, startPos, startSize]);

  return (
    <div 
      ref={containerRef}
      className="relative"
    >
      {children}
      
      {/* Resize handle - only show when selected and not in preview mode */}
      {isSelected && !isPreviewMode && (
        <div 
          className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize flex items-center justify-center bg-white dark:bg-zinc-700 border border-gray-300 dark:border-zinc-600 rounded-sm shadow-sm z-10"
          onMouseDown={handleResizeStart}
          title="Resize"
        >
          <FiCornerRightDown className="w-3 h-3 text-orange-500" />
        </div>
      )}
    </div>
  );
};

interface DragDropEditorProps {
  selectedMobileComponent?: {
    type: string;
    styles: any;
    library: 'shadcn' | 'mui' | 'antd';
  } | null;
  onMobileComponentPlaced?: () => void;
}

const DragDropEditor: React.FC<DragDropEditorProps> = ({ 
  selectedMobileComponent = null,
  onMobileComponentPlaced
}) => {
  const [components, setComponents] = useState<DroppedComponent[]>([]);
  const [history, setHistory] = useState<DroppedComponent[][]>([[]]); // Add history state
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const [isDraggingOver, setIsDraggingOver] = useState<boolean>(false);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState<boolean>(false);
  const [saveDialogOpen, setSaveDialogOpen] = useState<boolean>(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState<boolean>(false);
  const [exportDialogOpen, setExportDialogOpen] = useState<boolean>(false);
  const [layoutName, setLayoutName] = useState<string>('');
  const [layouts, setLayouts] = useState<SavedLayout[]>([]);
  const [exportType, setExportType] = useState<'json' | 'html' | 'react'>('html');
  const [isMobileMoving, setIsMobileMoving] = useState<boolean>(false);
  const [mobileMovingComponentId, setMobileMovingComponentId] = useState<string | null>(null);
  const [touchStartPos, setTouchStartPos] = useState<{x: number, y: number} | null>(null);
  const [selectedLayout, setSelectedLayout] = useState<string>('');

  // Add search params hook
  const searchParams = useSearchParams();

  // Add auth context
  const { user } = useAuth();

  // Add toast notification context
  const { toast } = useToast();

  // Replace localStorage loading with API fetch
  useEffect(() => {
    if (user) {
      fetchLayouts();
    }
  }, [user]);

  // Add effect to load layout from URL parameter
  useEffect(() => {
    const layoutId = searchParams?.get('layout');
    if (layoutId && user) {
      // Load the layout specified in the URL
      loadLayoutById(layoutId);
    }
  }, [searchParams, user]);

  // Add function to load a layout by ID
  const loadLayoutById = async (layoutId: string) => {
    try {
      // Get auth token from cookies
      const authToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1];
      
      if (!authToken) {
        console.error('Authentication token not found');
        return;
      }
      
      // Fetch the specific layout from the API
      const response = await fetch(`/api/layouts/${layoutId}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Process components to ensure they have the correct structure for the editor
        const processedComponents = data.layout.components.map((component: any) => {
          // Ensure component has a position object
          if (!component.position && (component.x !== undefined && component.y !== undefined)) {
            component.position = { x: component.x, y: component.y };
          }
          
          // Ensure component has styles with width and height
          if (!component.styles) {
            component.styles = {};
          }
          
          // Convert numeric width and height to string values with 'px' for the UI
          if (component.width !== undefined) {
            // If width is a number, convert to string with 'px'
            if (typeof component.width === 'number') {
              component.styles.width = `${component.width}px`;
            } else if (!component.styles.width) {
              // If width is already a string but not in styles, add it
              component.styles.width = component.width;
            }
          }
          
          if (component.height !== undefined) {
            // If height is a number, convert to string with 'px'
            if (typeof component.height === 'number') {
              component.styles.height = `${component.height}px`;
            } else if (!component.styles.height) {
              // If height is already a string but not in styles, add it
              component.styles.height = component.height;
            }
          }
          
          return component;
        });
        
        setComponents(processedComponents);
        setSelectedComponent(null);
        
        // Set the layout name for potential re-saving
        setLayoutName(data.layout.name || '');
      } else {
        console.error('Failed to load layout:', data.error);
      }
    } catch (error) {
      console.error('Error loading layout:', error);
    }
  };

  // Add function to fetch layouts from API
  const fetchLayouts = async () => {
    try {
      // Get auth token from cookies
      const authToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1];
      
      if (!authToken) {
        console.error('Authentication token not found');
        return;
      }
      
      const response = await fetch('/api/layouts', {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setLayouts(data.layouts);
      } else {
        console.error('Failed to fetch layouts:', data.error);
      }
    } catch (error) {
      console.error('Error fetching layouts:', error);
    }
  };

  // Use a stable ID generation method that doesn't rely on Math.random() during SSR
  const generateComponentId = (componentType: string) => {
    componentIdCounter += 1;
    return `${componentType}-${componentIdCounter}-${Date.now()}`;
  };

  // Add function to update history
  const updateHistory = (newComponents: DroppedComponent[]) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push([...newComponents]);
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  // Add undo function
  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setComponents([...history[historyIndex - 1]]);
    }
  };

  // Add redo function
  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setComponents([...history[historyIndex + 1]]);
    }
  };

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
    const scrollTop = e.currentTarget.scrollTop;
    const scrollLeft = e.currentTarget.scrollLeft;
    const x = e.clientX - rect.left + scrollLeft;
    const y = e.clientY - rect.top + scrollTop;

    // If we're moving an existing component
    if (mobileMovingComponentId) {
      const newComponents = components.map(comp => 
        comp.id === mobileMovingComponentId
          ? { ...comp, position: { x, y } }
          : comp
      );
      setComponents(newComponents);
      updateHistory(newComponents);
      setMobileMovingComponentId(null);
      return;
    }

    // If we're adding a new component
    const componentType = e.dataTransfer.getData('componentType');
    const componentStyles = JSON.parse(e.dataTransfer.getData('componentStyles') || '{}');
    const componentLibrary = e.dataTransfer.getData('componentLibrary') || 'shadcn';

    // Default styles based on component type if no styles are provided
    const defaultButtonStyles = {
      variant: "default",
      size: "default",
      backgroundColor: "#f97316", // orange-500
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
      buttonText: "Button", // Default button text
    };

    const defaultStyles = {
      Button: defaultButtonStyles,
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
        cardTitle: "Card Title", // Add default card title
        cardContent: "Card Content", // Add default card content
      },
      Rectangle: {
        backgroundColor: "#f97316", // orange-500
        borderColor: "#f97316", // orange-500
        borderWidth: "2px",
        borderStyle: "solid",
        borderRadius: "0.375rem", // rounded-md
        width: "100px",
        height: "60px",
        shadow: "sm",
        opacity: 100,
      },
      Circle: {
        backgroundColor: "#f97316", // orange-500
        borderColor: "#f97316", // orange-500
        borderWidth: "2px",
        borderStyle: "solid",
        borderRadius: "9999px", // fully rounded
        width: "80px",
        height: "80px",
        shadow: "sm",
        opacity: 100,
      },
      Line: {
        backgroundColor: "transparent",
        borderColor: "#f97316", // orange-500
        borderWidth: "2px",
        borderStyle: "solid",
        width: "100px",
        height: "0",
        shadow: "none",
        opacity: 100,
      },
      Dropdown: {
        backgroundColor: "#ffffff",
        textColor: "#374151", // gray-700
        borderColor: "#d1d5db", // gray-300
        borderWidth: "1px",
        borderStyle: "solid",
        borderRadius: "0.375rem", // rounded-md
        padding: "0.5rem 0.75rem",
        fontSize: "0.875rem", // text-sm
        width: "100%",
        height: "auto",
        shadow: "sm",
        dropdownText: "Select option", // Default dropdown text
      },
      Badge: {
        backgroundColor: "#f97316", // orange-500
        textColor: "#ffffff",
        borderColor: "transparent",
        borderWidth: "1px",
        borderStyle: "solid",
        borderRadius: "9999px", // fully rounded
        padding: "0.25rem 0.5rem",
        fontSize: "0.75rem", // text-xs
        fontWeight: "500", // font-medium
        width: "auto",
        height: "auto",
        shadow: "none",
        badgeText: "New", // Default badge text
      },
      Avatar: {
        backgroundColor: "#f97316", // orange-500
        textColor: "#ffffff",
        borderColor: "transparent",
        borderWidth: "2px",
        borderStyle: "solid",
        borderRadius: "9999px", // fully rounded
        width: "40px",
        height: "40px",
        shadow: "none",
        opacity: 100,
        avatarText: "JD", // Default avatar text (initials)
      },
      Divider: {
        backgroundColor: "transparent",
        borderColor: "#e5e7eb", // gray-200
        borderWidth: "1px",
        borderTopWidth: "1px",
        borderStyle: "solid",
        width: "200px",
        height: "0",
        shadow: "none",
        opacity: 100,
      },
      Text: {
        backgroundColor: "transparent",
        textColor: "#374151", // gray-700
        fontSize: "0.875rem", // text-sm
        fontWeight: "400", // font-normal
        width: "auto",
        height: "auto",
        textAlign: "left",
        letterSpacing: "normal",
        textContent: "Text content", // Default text content
      }
    };

    // Merge default styles with provided styles
    const mergedStyles = {
      ...(defaultStyles[componentType as keyof typeof defaultStyles] || {}),
      ...componentStyles
    };

    const newComponent: DroppedComponent = {
      id: generateComponentId(componentType),
      type: componentType,
      position: { x, y },
      styles: mergedStyles,
      library: componentLibrary as 'shadcn' | 'mui' | 'antd'
    };

    const newComponents = [...components, newComponent];
    setComponents(newComponents);
    updateHistory(newComponents); // Add to history
  };

  const handleComponentDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.stopPropagation();
    setMobileMovingComponentId(id);
    // Set a transparent drag image
    const dragImage = new Image();
    dragImage.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(dragImage, 0, 0);
  };

  const handleReset = () => {
    setComponents([]);
    updateHistory([]); // Add empty state to history
    setSelectedComponent(null);
  };

  const handleSave = async () => {
    if (!layoutName.trim()) return;
    
    // Check if user is authenticated
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Required",
        description: "You must be logged in to save layouts",
      });
      return;
    }

    // Process components to ensure all required fields are present
    const processedComponents = components.map(component => {
      // Extract position values
      const x = component.position.x;
      const y = component.position.y;
      
      // Extract width and height from styles or set defaults
      let width = component.styles.width || '100px';
      let height = component.styles.height || '60px';
      
      // Convert width and height to numbers
      // Remove 'px', '%', etc. and convert to number
      const parseSize = (size: string | number): number => {
        if (typeof size === 'number') return size;
        
        // Handle 'auto' or other non-numeric values
        if (size === 'auto' || !size) return 100; // Default to 100
        
        // Extract numeric part
        const numericValue = parseFloat(size.replace(/[^0-9.]/g, ''));
        return isNaN(numericValue) ? 100 : numericValue;
      };
      
      // Return a properly formatted component with all required fields
      return {
        ...component,
        // Ensure position is properly formatted
        position: { x, y },
        // Add x, y as top-level properties for database schema
        x,
        y,
        // Add width, height as top-level properties for database schema as numbers
        width: parseSize(width),
        height: parseSize(height),
        // Keep the original string values in styles for the UI
        styles: {
          ...component.styles,
          width: typeof width === 'string' ? width : `${width}px`,
          height: typeof height === 'string' ? height : `${height}px`,
        }
      };
    });

    // Create the saved layout object
    const savedLayout = {
      name: layoutName,
      components: processedComponents,
    };

    try {
      // Get auth token from cookies
      const authToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1];
      
      if (!authToken) {
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Authentication token not found. Please log in again.",
        });
        return;
      }
      
      // Save layout to database using API
      const response = await fetch('/api/layouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify(savedLayout)
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        alert('Layout saved successfully!');
        setSaveDialogOpen(false);
        setLayoutName('');
        // Refresh the layouts list
        fetchLayouts();
      } else {
        throw new Error(data.error || 'Failed to save layout');
      }
    } catch (error) {
      console.error('Error saving layout:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was an error saving your layout. Please try again.",
      });
    }
  };

  const handleLoad = async () => {
    if (!selectedLayout) return;
    
    try {
      // Get auth token from cookies
      const authToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('auth_token='))
        ?.split('=')[1];
      
      if (!authToken) {
        alert('Authentication token not found. Please log in again.');
        return;
      }
      
      // Fetch the specific layout from the API
      const response = await fetch(`/api/layouts/${selectedLayout}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Process components to ensure they have the correct structure for the editor
        const processedComponents = data.layout.components.map((component: any) => {
          // Ensure component has a position object
          if (!component.position && (component.x !== undefined && component.y !== undefined)) {
            component.position = { x: component.x, y: component.y };
          }
          
          // Ensure component has styles with width and height
          if (!component.styles) {
            component.styles = {};
          }
          
          // Convert numeric width and height to string values with 'px' for the UI
          if (component.width !== undefined) {
            // If width is a number, convert to string with 'px'
            if (typeof component.width === 'number') {
              component.styles.width = `${component.width}px`;
            } else if (!component.styles.width) {
              // If width is already a string but not in styles, add it
              component.styles.width = component.width;
            }
          }
          
          if (component.height !== undefined) {
            // If height is a number, convert to string with 'px'
            if (typeof component.height === 'number') {
              component.styles.height = `${component.height}px`;
            } else if (!component.styles.height) {
              // If height is already a string but not in styles, add it
              component.styles.height = component.height;
            }
          }
          
          return component;
        });
        
        setComponents(processedComponents);
        setSelectedComponent(null);
        setLoadDialogOpen(false);
      } else {
        throw new Error(data.error || 'Failed to load layout');
      }
    } catch (error) {
      console.error('Error loading layout:', error);
      alert('There was an error loading your layout. Please try again.');
    }
  };

  const handleExport = () => {
    if (components.length === 0) return;
    
    let exportData;
    let fileName;
    let fileType;
    
    // Get current timestamp for export
    const exportTimestamp = new Date().toISOString();
    
    switch (exportType) {
      case 'json':
        exportData = JSON.stringify({
          name: layoutName || 'Untitled Layout',
          components: components,
          exportedAt: exportTimestamp
        }, null, 2);
        fileName = `${layoutName || 'ui-layout'}.json`;
        fileType = 'application/json';
        
        // Create a blob and download it
        const jsonBlob = new Blob([exportData], { type: fileType });
        const jsonUrl = URL.createObjectURL(jsonBlob);
        const jsonLink = document.createElement('a');
        jsonLink.href = jsonUrl;
        jsonLink.download = fileName;
        document.body.appendChild(jsonLink);
        jsonLink.click();
        document.body.removeChild(jsonLink);
        URL.revokeObjectURL(jsonUrl);
        break;
        
      case 'html':
        exportData = generateHtmlExport();
        fileName = `${layoutName || 'ui-layout'}.html`;
        fileType = 'text/html';
        
        // Create a blob and download it
        const htmlBlob = new Blob([exportData], { type: fileType });
        const htmlUrl = URL.createObjectURL(htmlBlob);
        const htmlLink = document.createElement('a');
        htmlLink.href = htmlUrl;
        htmlLink.download = fileName;
        document.body.appendChild(htmlLink);
        htmlLink.click();
        document.body.removeChild(htmlLink);
        URL.revokeObjectURL(htmlUrl);
        break;
        
      case 'react':
        exportData = generateReactExport();
        fileName = `${layoutName || 'UILayout'}.jsx`;
        fileType = 'text/javascript';
        
        // Create a blob and download it
        const reactBlob = new Blob([exportData], { type: fileType });
        const reactUrl = URL.createObjectURL(reactBlob);
        const reactLink = document.createElement('a');
        reactLink.href = reactUrl;
        reactLink.download = fileName;
        document.body.appendChild(reactLink);
        reactLink.click();
        document.body.removeChild(reactLink);
        URL.revokeObjectURL(reactUrl);
        break;
        
      default:
        exportData = JSON.stringify(components, null, 2);
        fileName = 'layout.json';
        fileType = 'application/json';
        
        // Create a blob and download it
        const defaultBlob = new Blob([exportData], { type: fileType });
        const defaultUrl = URL.createObjectURL(defaultBlob);
        const defaultLink = document.createElement('a');
        defaultLink.href = defaultUrl;
        defaultLink.download = fileName;
        document.body.appendChild(defaultLink);
        defaultLink.click();
        document.body.removeChild(defaultLink);
        URL.revokeObjectURL(defaultUrl);
    }
    
    setExportDialogOpen(false);
  };

  const generateHtmlExport = () => {
    let html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${layoutName || 'UI Layout'}</title>
  <style>
    body { margin: 0; font-family: sans-serif; }
    .layout-container { position: relative; width: 100%; height: 100vh; }
    .component { position: absolute; transform: translate(-50%, -50%); }
  </style>
</head>
<body>
  <div class="layout-container">
`;

    components.forEach(component => {
      const { type, position, styles } = component;
      const styleString = Object.entries(styles || {})
        .filter(([key]) => !['variant', 'size', 'placeholder'].includes(key))
        .map(([key, value]) => {
          if (key === 'textColor') return `color: ${value};`;
          if (key === 'shadow') {
            if (value === 'none') return 'box-shadow: none;';
            if (value === 'sm') return 'box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);';
            if (value === 'md') return 'box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);';
            if (value === 'lg') return 'box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);';
            if (value === 'xl') return 'box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);';
            return '';
          }
          return `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`;
        })
        .join(' ');

      html += `    <div class="component" style="left: ${position.x}px; top: ${position.y}px;">`;
      
      switch (type) {
        case 'Button':
          html += `<button style="${styleString}">${styles.buttonText === undefined || styles.buttonText === null ? 'Button' : styles.buttonText}</button>`;
          break;
        case 'Input':
          html += `<input type="text" placeholder="${styles.placeholder || 'Input field'}" style="${styleString}" />`;
          break;
        case 'Card':
          html += `<div style="${styleString}">
            <h3>${styles.cardTitle === undefined || styles.cardTitle === null ? 'Card Title' : styles.cardTitle}</h3>
            <p>${styles.cardContent === undefined || styles.cardContent === null ? 'Card Content' : styles.cardContent}</p>
          </div>`;
          break;
      }
      
      html += `</div>\n`;
    });

    html += `  </div>
</body>
</html>`;

    return html;
  };

  const generateReactExport = () => {
    let reactCode = `import React from 'react';

export const ${layoutName ? layoutName.replace(/\s+/g, '') : 'UILayout'} = () => {
  return (
    <div className="layout-container" style={{ position: 'relative', width: '100%', height: '100vh' }}>
`;

    components.forEach(component => {
      const { type, position, styles } = component;
      const styleObject = Object.entries(styles || {})
        .filter(([key]) => !['variant', 'size', 'placeholder'].includes(key))
        .reduce((acc, [key, value]) => {
          if (key === 'textColor') acc.color = value;
          else if (key === 'shadow') {
            if (value === 'none') acc.boxShadow = 'none';
            else if (value === 'sm') acc.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
            else if (value === 'md') acc.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)';
            else if (value === 'lg') acc.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)';
            else if (value === 'xl') acc.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)';
          }
          else acc[key] = value;
          return acc;
        }, {} as Record<string, any>);

      reactCode += `      <div style={{ 
        position: 'absolute', 
        left: ${position.x}, 
        top: ${position.y}, 
        transform: 'translate(-50%, -50%)' 
      }}>\n`;
      
      switch (type) {
        case 'Button':
          reactCode += `        <button style={${JSON.stringify(styleObject, null, 2)}}>
          ${styles.buttonText === undefined || styles.buttonText === null ? 'Button' : styles.buttonText}
        </button>`;
          break;
        case 'Input':
          reactCode += `        <input 
          type="text" 
          placeholder="${styles.placeholder || 'Input field'}" 
          style={${JSON.stringify(styleObject, null, 2)}} 
        />`;
          break;
        case 'Card':
          reactCode += `        <div style={${JSON.stringify(styleObject, null, 2)}}>
          <h3>${styles.cardTitle === undefined || styles.cardTitle === null ? 'Card Title' : styles.cardTitle}</h3>
          <p>${styles.cardContent === undefined || styles.cardContent === null ? 'Card Content' : styles.cardContent}</p>
        </div>`;
          break;
      }
      
      reactCode += `\n      </div>\n`;
    });

    reactCode += `    </div>
  );
};

export default ${layoutName ? layoutName.replace(/\s+/g, '') : 'UILayout'};
`;

    return reactCode;
  };

  const handleComponentClick = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedComponent(id);
  };

  // Add touch event handlers for mobile component movement
  const handleTouchStart = (e: React.TouchEvent, id: string) => {
    e.stopPropagation();
    if (isPreviewMode) return;
    
    setIsMobileMoving(true);
    setMobileMovingComponentId(id);
    
    const touch = e.touches[0];
    setTouchStartPos({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (!isMobileMoving || !mobileMovingComponentId || !touchStartPos) return;
    
    const touch = e.touches[0];
    const deltaX = touch.clientX - touchStartPos.x;
    const deltaY = touch.clientY - touchStartPos.y;
    
    // Update component position
    const newComponents = components.map(comp => {
      if (comp.id === mobileMovingComponentId) {
        return {
          ...comp,
          position: {
            x: comp.position.x + deltaX,
            y: comp.position.y + deltaY
          }
        };
      }
      return comp;
    });
    
    setComponents(newComponents);
    setTouchStartPos({ x: touch.clientX, y: touch.clientY });
  };

  const handleTouchEnd = () => {
    if (isMobileMoving && mobileMovingComponentId) {
      // Save the current state to history
      updateHistory(components);
      setIsMobileMoving(false);
      setMobileMovingComponentId(null);
      setTouchStartPos(null);
    }
  };

  // Add the handleStyleChange function
  const handleStyleChange = (id: string, newStyles: any) => {
    const newComponents = components.map(comp => {
      if (comp.id === id) {
        return {
          ...comp,
          styles: {
            ...comp.styles,
            ...newStyles
          }
        };
      }
      return comp;
    });
    
    setComponents(newComponents);
    // Add history update to enable undo/redo for style changes
    updateHistory(newComponents);
  };

  // Add the missing handleComponentResize function
  const handleComponentResize = (id: string, width: string, height: string) => {
    const newComponents = components.map(comp => {
      if (comp.id === id) {
        return {
          ...comp,
          styles: {
            ...comp.styles,
            width,
            height
          }
        };
      }
      return comp;
    });
    
    setComponents(newComponents);
    // Add history update to enable undo/redo for resize operations
    updateHistory(newComponents);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // If we're in mobile moving mode, don't clear the selection
    if (!isMobileMoving) {
      // Clear selected component
      setSelectedComponent(null);
    }
    
    // If we have a mobile component selected, place it at the click position
    if (selectedMobileComponent && onMobileComponentPlaced) {
      const canvasRect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - canvasRect.left;
      const y = e.clientY - canvasRect.top;
      
      // Create a new component with the selected type and styles
      const newComponent: DroppedComponent = {
        id: generateComponentId(selectedMobileComponent.type),
        type: selectedMobileComponent.type,
        position: { x, y },
        styles: selectedMobileComponent.styles,
        library: selectedMobileComponent.library
      };
      
      // Add the new component to the canvas
      const newComponents = [...components, newComponent];
      updateHistory(newComponents);
      setComponents(newComponents);
      
      // Notify parent that component has been placed
      onMobileComponentPlaced();
    }
  };

  const renderComponent = (component: DroppedComponent) => {
    const { type, styles, id, library = 'shadcn' } = component;
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

    const wrapperClasses = `relative group ${isPreviewMode ? '' : 'cursor-move'} ${isSelected ? 'ring-2 ring-orange-500 ring-offset-2' : ''}`;

    const handleDelete = (e: React.MouseEvent) => {
      e.stopPropagation();
      const newComponents = components.filter(comp => comp.id !== id);
      setComponents(newComponents);
      updateHistory(newComponents);
      setSelectedComponent(null);
    };

    // Import the components dynamically based on the library
    const renderComponentByLibrary = () => {
      switch (type) {
        case 'Button':
          switch (library) {
            case 'mui':
              return (
                <div className={wrapperClasses}
                  onClick={(e) => !isPreviewMode && handleComponentClick(id, e)}
                  draggable={!isPreviewMode}
                  onDragStart={(e) => handleComponentDragStart(e, id)}>
                  {isSelected && !isPreviewMode && (
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-md z-50 bg-red-500 hover:bg-red-600 border-2 border-white"
                      onClick={handleDelete}
                    >
                      <FiTrash2 className="h-3 w-3 text-white" />
                    </Button>
                  )}
                  <button 
                    style={{
                      backgroundColor: '#2196f3', // MUI primary blue
                      color: '#ffffff',
                      padding: '8px 22px',
                      borderRadius: '4px',
                      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                      textTransform: 'uppercase',
                      fontWeight: 500,
                      fontSize: '0.875rem',
                      lineHeight: 1.75,
                      letterSpacing: '0.02857em',
                      minWidth: '64px',
                      boxShadow: '0px 3px 5px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 250ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                      background: 'linear-gradient(to bottom, #42a5f5, #1976d2)',
                      position: 'relative',
                      overflow: 'hidden',
                      ...commonStyles
                    }}
                  >
                    {styles.buttonText === undefined || styles.buttonText === null ? 'BUTTON' : styles.buttonText}
                  </button>
                  {isSelected && (
                    <div className="absolute top-full left-0 right-0 mt-2 z-10">
                      <ComponentStyler
                        componentType={type}
                        onStyleChange={(styles) => handleStyleChange(id, styles)}
                        initialStyles={component.styles}
                      />
                    </div>
                  )}
                </div>
              );
            case 'antd':
              return (
                <div className={wrapperClasses}
                  onClick={(e) => !isPreviewMode && handleComponentClick(id, e)}
                  draggable={!isPreviewMode}
                  onDragStart={(e) => handleComponentDragStart(e, id)}>
                  {isSelected && !isPreviewMode && (
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-md z-50 bg-red-500 hover:bg-red-600 border-2 border-white"
                      onClick={handleDelete}
                    >
                      <FiTrash2 className="h-3 w-3 text-white" />
                    </Button>
                  )}
                  <button 
                    style={{
                      backgroundColor: '#1890ff', // Ant Design primary blue
                      color: '#ffffff',
                      padding: '4px 15px',
                      height: '32px',
                      borderRadius: '2px',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
                      fontWeight: 400,
                      fontSize: '14px',
                      lineHeight: '1.5715',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 2px 0 rgba(0, 0, 0, 0.045)',
                      transition: 'all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)',
                      background: '#1890ff',
                      textShadow: '0 -1px 0 rgba(0, 0, 0, 0.12)',
                      ...commonStyles
                    }}
                  >
                    {styles.buttonText === undefined || styles.buttonText === null ? 'Button' : styles.buttonText}
                  </button>
                  {isSelected && (
                    <div className="absolute top-full left-0 right-0 mt-2 z-10">
                      <ComponentStyler
                        componentType={type}
                        onStyleChange={(styles) => handleStyleChange(id, styles)}
                        initialStyles={component.styles}
                      />
                    </div>
                  )}
                </div>
              );
            case 'shadcn':
            default:
              return (
                <div className={wrapperClasses}
                  onClick={(e) => !isPreviewMode && handleComponentClick(id, e)}
                  draggable={!isPreviewMode}
                  onDragStart={(e) => handleComponentDragStart(e, id)}>
                  {isSelected && !isPreviewMode && (
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-md z-50 bg-red-500 hover:bg-red-600 border-2 border-white"
                      onClick={handleDelete}
                    >
                      <FiTrash2 className="h-3 w-3 text-white" />
                    </Button>
                  )}
                  <button
                    style={{
                      backgroundColor: '#f97316', // Shadcn orange primary
                      color: '#ffffff',
                      padding: '10px 16px',
                      borderRadius: '6px',
                      fontFamily: 'var(--font-sans)',
                      fontWeight: 500,
                      fontSize: '14px',
                      lineHeight: '1.5',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: 'none',
                      ...commonStyles
                    }}
                  >
                    {styles.buttonText === undefined || styles.buttonText === null ? 'Button' : styles.buttonText}
                  </button>
                  {isSelected && (
                    <div className="absolute top-full left-0 right-0 mt-2 z-10">
                      <ComponentStyler
                        componentType={type}
                        onStyleChange={(styles) => handleStyleChange(id, styles)}
                        initialStyles={component.styles}
                      />
                    </div>
                  )}
                </div>
              );
          }
        case 'Input':
          switch (library) {
            case 'mui':
              return (
                <div className={wrapperClasses}
                  onClick={(e) => !isPreviewMode && handleComponentClick(id, e)}
                  draggable={!isPreviewMode}
                  onDragStart={(e) => handleComponentDragStart(e, id)}>
                  {isSelected && !isPreviewMode && (
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-md z-50 bg-red-500 hover:bg-red-600 border-2 border-white"
                      onClick={handleDelete}
                    >
                      <FiTrash2 className="h-3 w-3 text-white" />
                    </Button>
                  )}
                  <input
                    type="text"
                    placeholder={styles.placeholder || "Input field"}
                    style={{
                      backgroundColor: '#ffffff',
                      color: '#1976d2',
                      padding: '8px 12px',
                      borderRadius: '4px',
                      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                      fontSize: '16px',
                      lineHeight: '1.5',
                      border: '1px solid #c4c4c4',
                      outline: 'none',
                      transition: 'border-color 200ms cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: 'none',
                      ...commonStyles
                    }}
                    disabled={isPreviewMode}
                  />
                  {isSelected && (
                    <div className="absolute top-full left-0 right-0 mt-2 z-10">
                      <ComponentStyler
                        componentType={type}
                        onStyleChange={(styles) => handleStyleChange(id, styles)}
                        initialStyles={component.styles}
                      />
                    </div>
                  )}
                </div>
              );
            case 'antd':
              return (
                <div className={wrapperClasses}
                  onClick={(e) => !isPreviewMode && handleComponentClick(id, e)}
                  draggable={!isPreviewMode}
                  onDragStart={(e) => handleComponentDragStart(e, id)}>
                  {isSelected && !isPreviewMode && (
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-md z-50 bg-red-500 hover:bg-red-600 border-2 border-white"
                      onClick={handleDelete}
                    >
                      <FiTrash2 className="h-3 w-3 text-white" />
                    </Button>
                  )}
                  <input
                    type="text"
                    placeholder={styles.placeholder || "Input field"}
                    style={{
                      backgroundColor: '#ffffff',
                      color: '#000000',
                      padding: '4px 11px',
                      height: '32px',
                      borderRadius: '2px',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
                      fontSize: '14px',
                      lineHeight: '1.5715',
                      border: '1px solid #d9d9d9',
                      outline: 'none',
                      transition: 'all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)',
                      boxShadow: 'none',
                      ...commonStyles
                    }}
                    disabled={isPreviewMode}
                  />
                  {isSelected && (
                    <div className="absolute top-full left-0 right-0 mt-2 z-10">
                      <ComponentStyler
                        componentType={type}
                        onStyleChange={(styles) => handleStyleChange(id, styles)}
                        initialStyles={component.styles}
                      />
                    </div>
                  )}
                </div>
              );
            case 'shadcn':
            default:
              return (
                <div className={wrapperClasses}
                  onClick={(e) => !isPreviewMode && handleComponentClick(id, e)}
                  draggable={!isPreviewMode}
                  onDragStart={(e) => handleComponentDragStart(e, id)}>
                  {isSelected && !isPreviewMode && (
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-md z-50 bg-red-500 hover:bg-red-600 border-2 border-white"
                      onClick={handleDelete}
                    >
                      <FiTrash2 className="h-3 w-3 text-white" />
                    </Button>
                  )}
                  <input
                    type="text"
                    placeholder={styles.placeholder || "Input field"}
                    style={{
                      backgroundColor: '#ffffff',
                      color: '#09090b',
                      padding: '8px 12px',
                      height: '40px',
                      borderRadius: '6px',
                      fontFamily: 'var(--font-sans)',
                      fontSize: '14px',
                      lineHeight: '1.5',
                      border: '1px solid #e2e8f0',
                      outline: 'none',
                      transition: 'border-color 150ms cubic-bezier(0.4, 0, 0.2, 1)',
                      boxShadow: 'none',
                      ...commonStyles
                    }}
                    disabled={isPreviewMode}
                  />
                  {isSelected && (
                    <div className="absolute top-full left-0 right-0 mt-2 z-10">
                      <ComponentStyler
                        componentType={type}
                        onStyleChange={(styles) => handleStyleChange(id, styles)}
                        initialStyles={component.styles}
                      />
                    </div>
                  )}
                </div>
              );
          }
        case 'Card':
          switch (library) {
            case 'mui':
              return (
                <div className={wrapperClasses}
                  onClick={(e) => !isPreviewMode && handleComponentClick(id, e)}
                  draggable={!isPreviewMode}
                  onDragStart={(e) => handleComponentDragStart(e, id)}>
                  {isSelected && !isPreviewMode && (
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-md z-50 bg-red-500 hover:bg-red-600 border-2 border-white"
                      onClick={handleDelete}
                    >
                      <FiTrash2 className="h-3 w-3 text-white" />
                    </Button>
                  )}
                  <div style={{ 
                    backgroundColor: '#ffffff',
                    borderRadius: '4px',
                    boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
                    overflow: 'hidden',
                    transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                    ...commonStyles
                  }}>
                    <div style={{ 
                      backgroundColor: '#1976d2', 
                      color: '#ffffff',
                      padding: '16px',
                      fontWeight: 500,
                      fontSize: '1.25rem',
                      lineHeight: 1.6,
                    }}>
                      {styles.cardTitle || 'Card Title'}
                    </div>
                    <div style={{ padding: '16px' }}>
                      <p style={{ 
                        color: 'rgba(0, 0, 0, 0.87)',
                        fontSize: '0.875rem',
                        lineHeight: 1.43,
                        letterSpacing: '0.01071em',
                        marginBottom: '16px'
                      }}>
                        {styles.cardContent === undefined || styles.cardContent === null ? 'Card content goes here' : styles.cardContent}
                      </p>
                      <div style={{ 
                        display: 'flex',
                        padding: '8px',
                        alignItems: 'center',
                        borderTop: '1px solid rgba(0, 0, 0, 0.12)',
                        marginTop: '8px'
                      }}>
                        <button style={{ 
                          color: '#1976d2',
                          padding: '6px 8px',
                          fontSize: '0.8125rem',
                          minWidth: '64px',
                          boxSizing: 'border-box',
                          fontWeight: 500,
                          lineHeight: 1.75,
                          borderRadius: '4px',
                          letterSpacing: '0.02857em',
                          textTransform: 'uppercase',
                          border: 'none',
                          background: 'none',
                          cursor: 'pointer'
                        }}>
                          Action
                        </button>
                      </div>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="absolute top-full left-0 right-0 mt-2 z-10">
                      <ComponentStyler
                        componentType={type}
                        onStyleChange={(styles) => handleStyleChange(id, styles)}
                        initialStyles={component.styles}
                      />
                    </div>
                  )}
                </div>
              );
            case 'antd':
              return (
                <div className={wrapperClasses}
                  onClick={(e) => !isPreviewMode && handleComponentClick(id, e)}
                  draggable={!isPreviewMode}
                  onDragStart={(e) => handleComponentDragStart(e, id)}>
                  {isSelected && !isPreviewMode && (
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-md z-50 bg-red-500 hover:bg-red-600 border-2 border-white"
                      onClick={handleDelete}
                    >
                      <FiTrash2 className="h-3 w-3 text-white" />
                    </Button>
                  )}
                  <div style={{ 
                    backgroundColor: '#ffffff',
                    borderRadius: '2px',
                    boxShadow: '0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12), 0 5px 12px 4px rgba(0, 0, 0, 0.09)',
                    border: '1px solid #f0f0f0',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
                    ...commonStyles
                  }}>
                    <div style={{ 
                      borderBottom: '1px solid #f0f0f0',
                      padding: '16px 24px',
                      color: 'rgba(0, 0, 0, 0.85)',
                      fontWeight: 500,
                      fontSize: '16px',
                      background: 'transparent',
                      borderRadius: '2px 2px 0 0',
                    }}>
                      {styles.cardTitle || 'Card Title'}
                    </div>
                    <div style={{ padding: '24px' }}>
                      <p style={{ 
                        color: 'rgba(0, 0, 0, 0.65)',
                        fontSize: '14px',
                        lineHeight: 1.5715,
                      }}>
                        {styles.cardContent === undefined || styles.cardContent === null ? 'Card content goes here' : styles.cardContent}
                      </p>
                    </div>
                    <div style={{ 
                      borderTop: '1px solid #f0f0f0',
                      padding: '12px 24px',
                      background: 'transparent',
                      display: 'flex',
                      justifyContent: 'flex-end'
                    }}>
                      <button style={{ 
                        color: '#000000',
                        backgroundColor: '#ffffff',
                        borderColor: '#d9d9d9',
                        padding: '4px 15px',
                        fontSize: '14px',
                        height: '32px',
                        borderRadius: '2px',
                        cursor: 'pointer',
                        border: '1px solid #d9d9d9',
                        marginRight: '8px'
                      }}>
                        Cancel
                      </button>
                      <button style={{ 
                        color: '#ffffff',
                        backgroundColor: '#1890ff',
                        borderColor: '#1890ff',
                        padding: '4px 15px',
                        fontSize: '14px',
                        height: '32px',
                        borderRadius: '2px',
                        cursor: 'pointer',
                        border: '1px solid #1890ff'
                      }}>
                        OK
                      </button>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="absolute top-full left-0 right-0 mt-2 z-10">
                      <ComponentStyler
                        componentType={type}
                        onStyleChange={(styles) => handleStyleChange(id, styles)}
                        initialStyles={component.styles}
                      />
                    </div>
                  )}
                </div>
              );
            case 'shadcn':
            default:
              return (
                <div className={wrapperClasses}
                  onClick={(e) => !isPreviewMode && handleComponentClick(id, e)}
                  draggable={!isPreviewMode}
                  onDragStart={(e) => handleComponentDragStart(e, id)}>
                  {isSelected && !isPreviewMode && (
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-md z-50 bg-red-500 hover:bg-red-600 border-2 border-white"
                      onClick={handleDelete}
                    >
                      <FiTrash2 className="h-3 w-3 text-white" />
                    </Button>
                  )}
                  <div style={{ 
                    backgroundColor: '#ffffff',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                    overflow: 'hidden',
                    fontFamily: 'var(--font-sans)',
                    ...commonStyles
                  }}>
                    <div style={{ padding: '24px' }}>
                      <h3 style={{ 
                        color: '#09090b',
                        fontSize: '18px',
                        fontWeight: 600,
                        marginBottom: '8px',
                        lineHeight: 1.5
                      }}>
                        {styles.cardTitle || 'Card Title'}
                      </h3>
                      <p style={{ 
                        color: '#71717a',
                        fontSize: '14px',
                        lineHeight: 1.5
                      }}>
                        {styles.cardContent === undefined || styles.cardContent === null ? 'Card content goes here' : styles.cardContent}
                      </p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="absolute top-full left-0 right-0 mt-2 z-10">
                      <ComponentStyler
                        componentType={type}
                        onStyleChange={(styles) => handleStyleChange(id, styles)}
                        initialStyles={component.styles}
                      />
                    </div>
                  )}
                </div>
              );
          }
        case 'Rectangle':
          return (
            <div className={wrapperClasses}
              onClick={(e) => !isPreviewMode && handleComponentClick(id, e)}
              draggable={!isPreviewMode}
              onDragStart={(e) => handleComponentDragStart(e, id)}>
              {isSelected && !isPreviewMode && (
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-md z-50 bg-red-500 hover:bg-red-600 border-2 border-white"
                  onClick={handleDelete}
                >
                  <FiTrash2 className="h-3 w-3 text-white" />
                </Button>
              )}
              <div
                style={{
                  ...commonStyles,
                  width: styles.width || "100px",
                  height: styles.height || "60px",
                }}
                className="dark:bg-zinc-800 dark:border-zinc-700"
              />
              {isSelected && (
                <div className="absolute top-full left-0 right-0 mt-2 z-10">
                  <ComponentStyler
                    componentType={type}
                    onStyleChange={(styles) => handleStyleChange(id, styles)}
                    initialStyles={component.styles}
                  />
                </div>
              )}
            </div>
          );
        case 'Circle':
          return (
            <div className={wrapperClasses}
              onClick={(e) => !isPreviewMode && handleComponentClick(id, e)}
              draggable={!isPreviewMode}
              onDragStart={(e) => handleComponentDragStart(e, id)}>
              {isSelected && !isPreviewMode && (
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-md z-50 bg-red-500 hover:bg-red-600 border-2 border-white"
                  onClick={handleDelete}
                >
                  <FiTrash2 className="h-3 w-3 text-white" />
                </Button>
              )}
              <div
                style={{
                  ...commonStyles,
                  width: styles.width || "80px",
                  height: styles.height || "80px",
                  borderRadius: "9999px",
                }}
                className="dark:bg-zinc-800 dark:border-zinc-700"
              />
              {isSelected && (
                <div className="absolute top-full left-0 right-0 mt-2 z-10">
                  <ComponentStyler
                    componentType={type}
                    onStyleChange={(styles) => handleStyleChange(id, styles)}
                    initialStyles={component.styles}
                  />
                </div>
              )}
            </div>
          );
        case 'Line':
          return (
            <div className={wrapperClasses}
              onClick={(e) => !isPreviewMode && handleComponentClick(id, e)}
              draggable={!isPreviewMode}
              onDragStart={(e) => handleComponentDragStart(e, id)}>
              {isSelected && !isPreviewMode && (
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-md z-50 bg-red-500 hover:bg-red-600 border-2 border-white"
                  onClick={handleDelete}
                >
                  <FiTrash2 className="h-3 w-3 text-white" />
                </Button>
              )}
              <div
                style={{
                  ...commonStyles,
                  width: styles.width || "100px",
                  height: "0",
                  borderTopWidth: styles.borderWidth || "2px",
                  borderWidth: styles.borderWidth || "2px"
                }}
                className="dark:border-zinc-400"
              />
              {isSelected && (
                <div className="absolute top-full left-0 right-0 mt-2 z-10">
                  <ComponentStyler
                    componentType={type}
                    onStyleChange={(styles) => handleStyleChange(id, styles)}
                    initialStyles={component.styles}
                  />
                </div>
              )}
            </div>
          );
        case 'Dropdown':
          return (
            <div className={wrapperClasses}
              onClick={(e) => !isPreviewMode && handleComponentClick(id, e)}
              draggable={!isPreviewMode}
              onDragStart={(e) => handleComponentDragStart(e, id)}>
              {isSelected && !isPreviewMode && (
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-md z-50 bg-red-500 hover:bg-red-600 border-2 border-white"
                  onClick={handleDelete}
                >
                  <FiTrash2 className="h-3 w-3 text-white" />
                </Button>
              )}
              <div
                style={{
                  ...commonStyles,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                }}
                className="bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-md"
              >
                <span style={{ color: styles.textColor }}>
                  {styles.dropdownText || 'Select option'}
                </span>
                <FiChevronDown style={{ color: styles.textColor }} />
              </div>
              {isSelected && (
                <div className="absolute top-full left-0 right-0 mt-2 z-10">
                  <ComponentStyler
                    componentType={type}
                    onStyleChange={(styles) => handleStyleChange(id, styles)}
                    initialStyles={component.styles}
                  />
                </div>
              )}
            </div>
          );
        case 'Badge':
          return (
            <div className={wrapperClasses}
              onClick={(e) => !isPreviewMode && handleComponentClick(id, e)}
              draggable={!isPreviewMode}
              onDragStart={(e) => handleComponentDragStart(e, id)}>
              {isSelected && !isPreviewMode && (
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-md z-50 bg-red-500 hover:bg-red-600 border-2 border-white"
                  onClick={handleDelete}
                >
                  <FiTrash2 className="h-3 w-3 text-white" />
                </Button>
              )}
              <div
                style={{
                  ...commonStyles,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                className="inline-flex"
              >
                <span style={{ color: styles.textColor }}>
                  {styles.badgeText || 'New'}
                </span>
              </div>
              {isSelected && (
                <div className="absolute top-full left-0 right-0 mt-2 z-10">
                  <ComponentStyler
                    componentType={type}
                    onStyleChange={(styles) => handleStyleChange(id, styles)}
                    initialStyles={component.styles}
                  />
                </div>
              )}
            </div>
          );
        case 'Avatar':
          return (
            <div className={wrapperClasses}
              onClick={(e) => !isPreviewMode && handleComponentClick(id, e)}
              draggable={!isPreviewMode}
              onDragStart={(e) => handleComponentDragStart(e, id)}>
              {isSelected && !isPreviewMode && (
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-md z-50 bg-red-500 hover:bg-red-600 border-2 border-white"
                  onClick={handleDelete}
                >
                  <FiTrash2 className="h-3 w-3 text-white" />
                </Button>
              )}
              <div
                style={{
                  ...commonStyles,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                className="flex items-center justify-center"
              >
                <span style={{ color: styles.textColor }}>
                  {styles.avatarText || 'JD'}
                </span>
              </div>
              {isSelected && (
                <div className="absolute top-full left-0 right-0 mt-2 z-10">
                  <ComponentStyler
                    componentType={type}
                    onStyleChange={(styles) => handleStyleChange(id, styles)}
                    initialStyles={component.styles}
                  />
                </div>
              )}
            </div>
          );
        case 'Divider':
          return (
            <div className={wrapperClasses}
              onClick={(e) => !isPreviewMode && handleComponentClick(id, e)}
              draggable={!isPreviewMode}
              onDragStart={(e) => handleComponentDragStart(e, id)}>
              {isSelected && !isPreviewMode && (
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-md z-50 bg-red-500 hover:bg-red-600 border-2 border-white"
                  onClick={handleDelete}
                >
                  <FiTrash2 className="h-3 w-3 text-white" />
                </Button>
              )}
              <div
                style={{
                  ...commonStyles,
                  width: styles.width || "200px",
                  height: '0',
                  borderTopWidth: styles.borderTopWidth || '1px',
                  borderWidth: styles.borderWidth || '1px'
                }}
                className="dark:border-zinc-600"
              />
              {isSelected && (
                <div className="absolute top-full left-0 right-0 mt-2 z-10">
                  <ComponentStyler
                    componentType={type}
                    onStyleChange={(styles) => handleStyleChange(id, styles)}
                    initialStyles={component.styles}
                  />
                </div>
              )}
            </div>
          );
        case 'Text':
          return (
            <div className={wrapperClasses}
              onClick={(e) => !isPreviewMode && handleComponentClick(id, e)}
              draggable={!isPreviewMode}
              onDragStart={(e) => handleComponentDragStart(e, id)}>
              {isSelected && !isPreviewMode && (
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full shadow-md z-50 bg-red-500 hover:bg-red-600 border-2 border-white"
                  onClick={handleDelete}
                >
                  <FiTrash2 className="h-3 w-3 text-white" />
                </Button>
              )}
              <div
                style={{
                  ...commonStyles,
                  textAlign: styles.textAlign as any || 'left',
                }}
                className="dark:text-zinc-200"
              >
                <span style={{ color: styles.textColor }}>
                  {styles.textContent || 'Text content'}
                </span>
              </div>
              {isSelected && (
                <div className="absolute top-full left-0 right-0 mt-2 z-10">
                  <ComponentStyler
                    componentType={type}
                    onStyleChange={(styles) => handleStyleChange(id, styles)}
                    initialStyles={component.styles}
                  />
                </div>
              )}
            </div>
          );
        default:
          return <div>Unknown Component</div>;
      }
    };

    return renderComponentByLibrary();
  };

  return (
    <div className="flex-1 flex flex-col h-[90vh]">
      <div className="flex flex-wrap justify-between items-center p-3 sm:p-4 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-zinc-100 mb-2 sm:mb-0">
          Editor Canvas
          {selectedMobileComponent && (
            <span className="ml-2 text-sm font-normal text-orange-500">
              Tap to place {selectedMobileComponent.type}
            </span>
          )}
          {isMobileMoving && (
            <span className="ml-2 text-sm font-normal text-blue-500">
              Moving component...
            </span>
          )}
        </h2>
        
        {/* Mobile-friendly toolbar */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 text-xs"
            onClick={() => setIsPreviewMode(!isPreviewMode)}
          >
            {isPreviewMode ? (
              <>
                <FiEdit2 className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Edit</span>
              </>
            ) : (
              <>
                <FiEye className="w-3.5 h-3.5" />
                <span className="hidden xs:inline">Preview</span>
              </>
            )}
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 text-xs"
            onClick={handleUndo}
            disabled={historyIndex === 0 || isPreviewMode}
          >
            <FiRotateCcw className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Undo</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 text-xs"
            onClick={handleRedo}
            disabled={historyIndex === history.length - 1 || isPreviewMode}
          >
            <FiRotateCw className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Redo</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 text-xs"
            onClick={() => setSaveDialogOpen(true)}
            disabled={components.length === 0 || isPreviewMode}
          >
            <FiSave className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Save</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 text-xs"
            onClick={() => setLoadDialogOpen(true)}
          >
            <FiList className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Load</span>
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 text-xs"
            onClick={() => setExportDialogOpen(true)}
            disabled={components.length === 0}
          >
            <FiDownload className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Export</span>
          </Button>
          
          <Button 
            variant="destructive" 
            size="sm" 
            className="flex items-center gap-1 text-xs"
            onClick={handleReset}
            disabled={components.length === 0 || isPreviewMode}
          >
            <FiTrash2 className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Reset</span>
          </Button>
        </div>
      </div>
      
      <div
        className={`flex-1 bg-white dark:bg-zinc-800 border-2 ${
          isDraggingOver && !isPreviewMode ? 'border-orange-500 border-dashed' : 
          selectedMobileComponent ? 'border-orange-500 border-dashed' : 'border-gray-200 dark:border-zinc-700'
        } relative overflow-y-scroll overflow-x-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:transparent [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-600`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleCanvasClick}
      >
        <div className="min-h-full w-full relative" style={{ minHeight: '100%', height: '200%' }}>
          {components.length === 0 && !isPreviewMode && !selectedMobileComponent && (
            <div className="absolute left-1/2 transform -translate-x-1/2 top-20 flex flex-col items-center justify-center text-gray-400 text-center px-4">
              <FiMove className="w-8 h-8 mb-2" />
              <p className="text-sm">Drag and drop components here</p>
              <p className="text-xs mt-2 max-w-xs">On mobile, tap a component in the sidebar first, then tap here to place it</p>
            </div>
          )}
          
          {components.length === 0 && !isPreviewMode && selectedMobileComponent && (
            <div className="absolute left-1/2 transform -translate-x-1/2 top-20 flex flex-col items-center justify-center text-orange-500 text-center px-4">
              <FiMove className="w-8 h-8 mb-2" />
              <p className="text-sm">Tap anywhere on the canvas to place the {selectedMobileComponent.type}</p>
            </div>
          )}

          {components.map((component) => (
            <div
              key={component.id}
              className={`absolute ${isPreviewMode ? '' : 'cursor-move'} ${selectedComponent === component.id ? 'ring-2 ring-orange-500' : ''} ${isMobileMoving && mobileMovingComponentId === component.id ? 'ring-2 ring-blue-500' : ''}`}
              style={{
                left: `${component.position.x}px`,
                top: `${component.position.y}px`,
                transform: 'translate(-50%, -50%)',
                zIndex: selectedComponent === component.id || (isMobileMoving && mobileMovingComponentId === component.id) ? 10 : 1,
              }}
              onClick={(e) => handleComponentClick(component.id, e)}
              draggable={!isPreviewMode}
              onDragStart={(e) => handleComponentDragStart(e, component.id)}
              onTouchStart={(e) => handleTouchStart(e, component.id)}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <ResizableComponent
                component={component}
                isSelected={selectedComponent === component.id}
                isPreviewMode={isPreviewMode}
                onResize={handleComponentResize}
              >
                {renderComponent(component)}
                
                {/* Delete button - only show when selected and not in preview mode */}
                {selectedComponent === component.id && !isPreviewMode && (
                  <button
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm hover:bg-red-600 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      const newComponents = components.filter(c => c.id !== component.id);
                      updateHistory(newComponents);
                      setComponents(newComponents);
                      setSelectedComponent(null);
                    }}
                    title="Delete Component"
                  >
                    <FiTrash2 className="w-3 h-3" />
                  </button>
                )}
              </ResizableComponent>
            </div>
          ))}
        </div>
      </div>

      {/* Component Properties Panel - only show when a component is selected and not in preview mode */}
      {selectedComponent && !isPreviewMode && (
        <div className="border-t border-gray-200 dark:border-zinc-700 p-3 max-h-64 overflow-auto">
          <h3 className="text-sm font-medium mb-2">Component Properties</h3>
          {components.find(c => c.id === selectedComponent) && (
            <ComponentStyler
              componentType={components.find(c => c.id === selectedComponent)!.type}
              onStyleChange={(styles) => handleStyleChange(selectedComponent, styles)}
              initialStyles={components.find(c => c.id === selectedComponent)!.styles}
            />
          )}
        </div>
      )}

      {/* Save Dialog */}
      <AlertDialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Save Layout</AlertDialogTitle>
            <AlertDialogDescription>
              Enter a name for your layout to save it.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Input
              placeholder="Layout Name"
              value={layoutName}
              onChange={(e) => setLayoutName(e.target.value)}
              className="w-full"
            />
          </div>
          <AlertDialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
            <AlertDialogCancel className="mt-2 sm:mt-0">Cancel</AlertDialogCancel>
            <Button 
              onClick={handleSave}
              disabled={!layoutName.trim()}
            >
              Save Layout
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Load Dialog */}
      <AlertDialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Load Layout</AlertDialogTitle>
            <AlertDialogDescription>
              Select a saved layout to load.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            {layouts.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-zinc-400 py-4">No saved layouts found.</p>
            ) : (
              <div className="space-y-2 max-h-60 overflow-auto">
                {layouts.map((layout) => (
                  <div 
                    key={layout._id} 
                    className={`p-3 rounded-md cursor-pointer border ${selectedLayout === layout._id ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/10' : 'border-gray-200 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800'}`}
                    onClick={() => setSelectedLayout(layout._id || '')}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{layout.name}</span>
                      <span className="text-xs text-gray-500 dark:text-zinc-400">
                        {new Date(layout.updatedAt || layout.createdAt || '').toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <AlertDialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
            <AlertDialogCancel className="mt-2 sm:mt-0">Cancel</AlertDialogCancel>
            <Button 
              onClick={handleLoad}
              disabled={!selectedLayout || layouts.length === 0}
            >
              Load Layout
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Export Dialog */}
      <AlertDialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle>Export Design</AlertDialogTitle>
            <AlertDialogDescription>
              Choose a format to export your design.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Select value={exportType} onValueChange={setExportType}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="html">HTML</SelectItem>
                <SelectItem value="react">React Components</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <AlertDialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
            <AlertDialogCancel className="mt-2 sm:mt-0">Cancel</AlertDialogCancel>
            <Button 
              onClick={handleExport}
              disabled={!exportType}
            >
              Export
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DragDropEditor;
