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
// Import the ResizableComponent from the new file
import ResizableComponent from './ResizableComponent';

// Add type imports for dynamic imports
type Html2Canvas = typeof import('html2canvas')['default'];
interface JsPDFInstance {
  internal: {
    pageSize: {
      getWidth: () => number;
      getHeight: () => number;
    };
  };
  addImage: (data: string, format: string, x: number, y: number, width: number, height: number) => void;
  save: (filename: string) => void;
}

interface DroppedComponent {
  id: string;
  type: string;
  position: { x: number; y: number };
  styles: any;
  library?: 'shadcn' | 'mui' | 'antd';
}

// Define props interface for DragDropEditor
interface DragDropEditorProps {
  components?: DroppedComponent[];
  onAddComponent?: (component: DroppedComponent) => void;
  onUpdateComponent?: (id: string, newData: DroppedComponent) => void;
  onDeleteComponent?: (id: string) => void;
  onResetCanvas?: () => void;
  isCollaborative?: boolean;
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

const DragDropEditor: React.FC<DragDropEditorProps> = ({
  components: externalComponents,
  onAddComponent,
  onUpdateComponent,
  onDeleteComponent,
  onResetCanvas,
  isCollaborative = false
}) => {
  const [components, setComponents] = useState<DroppedComponent[]>(externalComponents || []);
  const [history, setHistory] = useState<DroppedComponent[][]>([[]]); // Add history state
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0); // Add current history index
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [layoutName, setLayoutName] = useState('');
  const [draggedComponentId, setDraggedComponentId] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [savedLayouts, setSavedLayouts] = useState<SavedLayout[]>([]);
  const [selectedLayout, setSelectedLayout] = useState<string>('');
  const [exportFormat, setExportFormat] = useState<string>('json');
  const [canvasRef, setCanvasRef] = useState<HTMLDivElement | null>(null);

  // Add search params hook
  const searchParams = useSearchParams();

  // Add auth context
  const { user } = useAuth();

  // Update local components when external components change (for collaborative mode)
  useEffect(() => {
    if (isCollaborative && externalComponents) {
      setComponents(externalComponents);
    }
  }, [externalComponents, isCollaborative]);

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
        setSavedLayouts(data.layouts);
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
    const newHistory = history.slice(0, currentHistoryIndex + 1);
    newHistory.push([...newComponents]);
    setHistory(newHistory);
    setCurrentHistoryIndex(newHistory.length - 1);
  };

  // Add undo function
  const handleUndo = () => {
    if (currentHistoryIndex > 0) {
      setCurrentHistoryIndex(currentHistoryIndex - 1);
      setComponents([...history[currentHistoryIndex - 1]]);
    }
  };

  // Add redo function
  const handleRedo = () => {
    if (currentHistoryIndex < history.length - 1) {
      setCurrentHistoryIndex(currentHistoryIndex + 1);
      setComponents([...history[currentHistoryIndex + 1]]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    
    // If we're dragging a component from the sidebar, just show the drag indicator
    if (!draggedComponentId || !e.dataTransfer.types.includes('componentId')) {
    setIsDraggingOver(true);
      return;
    }
    
    // For existing components being moved
    const componentId = e.dataTransfer.getData('componentId');
    
    // Skip if we don't have the component ID yet (it's not available until drop in some browsers)
    if (!componentId && draggedComponentId) {
      // Use the draggedComponentId state instead
      const component = components.find(comp => comp.id === draggedComponentId);
      if (!component) return;
      
      // Calculate new position
      const canvasRect = e.currentTarget.getBoundingClientRect();
      const newX = e.clientX - canvasRect.left;
      const newY = e.clientY - canvasRect.top;
      
      // Move the component in real-time
      handleComponentMove(draggedComponentId, { x: newX, y: newY });
    }
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingOver(false);

    // Check if we're dropping an existing component
    const componentId = e.dataTransfer.getData('componentId');
    if (componentId) {
      // This is an existing component being moved
      const canvasRect = e.currentTarget.getBoundingClientRect();
      const newX = e.clientX - canvasRect.left;
      const newY = e.clientY - canvasRect.top;
      
      // Update the component position
      handleComponentMove(componentId, { x: newX, y: newY });
      setDraggedComponentId(null);
      return;
    }

    // If not a component being moved, handle as a new component from the sidebar
    const componentType = e.dataTransfer.getData('componentType');
    const componentStyles = JSON.parse(e.dataTransfer.getData('componentStyles') || '{}');
    const componentLibrary = e.dataTransfer.getData('componentLibrary') as 'shadcn' | 'mui' | 'antd';
    
    if (!componentType) return;
    
    const canvasRect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - canvasRect.left;
    const y = e.clientY - canvasRect.top;

    const newComponent: DroppedComponent = {
      id: `${componentType}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type: componentType,
      position: { x, y },
      styles: componentStyles,
      library: componentLibrary,
    };

    // For collaborative mode, use the provided callback
    if (isCollaborative && onAddComponent) {
      onAddComponent(newComponent);
    } else {
      // For non-collaborative mode, update local state
    const newComponents = [...components, newComponent];
    setComponents(newComponents);
      
      // Add to history
      const newHistory = history.slice(0, currentHistoryIndex + 1);
      newHistory.push(newComponents);
      setHistory(newHistory);
      setCurrentHistoryIndex(newHistory.length - 1);
    }
  };

  const handleComponentDragStart = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.stopPropagation();
    setDraggedComponentId(id);
    
    // Store the initial mouse position relative to the component
    const component = components.find(comp => comp.id === id);
    if (!component) return;
    
    // Calculate the offset of the mouse from the component's center
    const rect = e.currentTarget.getBoundingClientRect();
    const offsetX = e.clientX - rect.left - rect.width / 2;
    const offsetY = e.clientY - rect.top - rect.height / 2;
    
    // Store this offset in the dataTransfer
    e.dataTransfer.setData('offsetX', offsetX.toString());
    e.dataTransfer.setData('offsetY', offsetY.toString());
    e.dataTransfer.setData('componentId', id);
    
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
      alert('You must be logged in to save layouts');
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
        alert('Authentication token not found. Please log in again.');
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
        setShowSaveDialog(false);
        setLayoutName('');
        // Refresh the layouts list
        fetchLayouts();
      } else {
        throw new Error(data.error || 'Failed to save layout');
      }
    } catch (error) {
      console.error('Error saving layout:', error);
      alert('There was an error saving your layout. Please try again.');
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
        setShowLoadDialog(false);
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
    
    switch (exportFormat) {
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
        
      case 'jpg':
        fileName = `${layoutName || 'ui-layout'}.jpg`;
        if (canvasRef) {
          exportAsImage(canvasRef, fileName, 'jpg');
        }
        break;
        
      case 'pdf':
        fileName = `${layoutName || 'ui-layout'}.pdf`;
        if (canvasRef) {
          exportAsPDF(canvasRef, fileName);
        }
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
    
    setShowExportDialog(false);
  };

  // Function to export canvas as image (JPG)
  const exportAsImage = (element: HTMLDivElement, fileName: string, type: 'jpg' | 'png') => {
    // Use html2canvas to capture the canvas
    import('html2canvas').then(html2canvasModule => {
      const html2canvas = html2canvasModule.default as Html2Canvas;
      html2canvas(element, {
        backgroundColor: '#ffffff',
        scale: 2, // Higher scale for better quality
        logging: false,
        useCORS: true,
        allowTaint: true,
      }).then(canvas => {
        // Convert to image and download
        const imgType = type === 'jpg' ? 'image/jpeg' : 'image/png';
        const imgData = canvas.toDataURL(imgType, 0.8);
        const link = document.createElement('a');
        link.download = fileName;
        link.href = imgData;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    });
  };

  // Function to export canvas as PDF
  const exportAsPDF = (element: HTMLDivElement, fileName: string) => {
    // Create a clone of the element to avoid modifying the original
    let clonedElement: HTMLDivElement | null = null;
    
    try {
      clonedElement = element.cloneNode(true) as HTMLDivElement;
      document.body.appendChild(clonedElement);
      clonedElement.style.position = 'absolute';
      clonedElement.style.left = '-9999px';
      clonedElement.style.width = `${element.offsetWidth}px`;
      clonedElement.style.height = `${element.offsetHeight}px`;
      
      // Process all elements in the clone to replace oklch colors
      const processElements = (elements: HTMLElement[]) => {
        elements.forEach(el => {
          // Process computed styles
          const computedStyle = window.getComputedStyle(el);
          const backgroundColor = computedStyle.backgroundColor;
          const color = computedStyle.color;
          
          // Check if the color is in oklch format and convert it
          if (backgroundColor && backgroundColor.includes('oklch')) {
            el.style.backgroundColor = 'rgba(200, 200, 200, 0.5)'; // Fallback color
          }
          
          if (color && color.includes('oklch')) {
            el.style.color = '#333333'; // Fallback color
          }
          
          // Process children recursively
          if (el.children && el.children.length > 0) {
            processElements(Array.from(el.children) as HTMLElement[]);
          }
        });
      };
      
      // Start processing from the root element's children
      processElements([clonedElement]);
      
      // Use html2canvas and jspdf to create PDF with the cloned element
      Promise.all([
        import('html2canvas'),
        import('jspdf')
      ]).then(([html2canvasModule, jspdfModule]) => {
        const html2canvas = html2canvasModule.default as Html2Canvas;
        const jspdf = jspdfModule.default;
        
        html2canvas(clonedElement as HTMLDivElement, {
          backgroundColor: '#ffffff',
          scale: 2,
          logging: false,
          useCORS: true,
          allowTaint: true,
          onclone: (clonedDoc, el) => {
            // Additional processing in the cloned document if needed
            return el;
          }
        }).then(canvas => {
          const imgData = canvas.toDataURL('image/jpeg', 1.0);
          const pdf = new jspdf('p', 'mm', 'a4') as JsPDFInstance;
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          const imgWidth = canvas.width;
          const imgHeight = canvas.height;
          const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
          const imgX = (pdfWidth - imgWidth * ratio) / 2;
          const imgY = 30;
          
          pdf.addImage(imgData, 'JPEG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
          pdf.save(fileName);
          
          // Clean up - remove the cloned element
          if (clonedElement && document.body.contains(clonedElement)) {
            document.body.removeChild(clonedElement);
          }
        }).catch(error => {
          console.error("Error rendering canvas:", error);
          alert("There was an error exporting to PDF. Please try a different format.");
          // Clean up
          if (clonedElement && document.body.contains(clonedElement)) {
            document.body.removeChild(clonedElement);
          }
        });
      }).catch(error => {
        console.error("Error loading modules:", error);
        alert("There was an error loading the export modules. Please try again later.");
        // Clean up
        if (clonedElement && document.body.contains(clonedElement)) {
          document.body.removeChild(clonedElement);
        }
      });
    } catch (error) {
      console.error("Error in PDF export:", error);
      alert("There was an error preparing the PDF. Please try a different format.");
      // Clean up
      if (clonedElement && document.body.contains(clonedElement)) {
        document.body.removeChild(clonedElement);
      }
    }
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

  const handleCanvasClick = () => {
    setSelectedComponent(null);
  };

  const handleStyleChange = (id: string, styles: any) => {
    const componentIndex = components.findIndex(comp => comp.id === id);
    if (componentIndex === -1) return;
    
    const updatedComponent = {
      ...components[componentIndex],
      styles: {
        ...components[componentIndex].styles,
        ...styles
      }
    };
    
    // For collaborative mode, use the provided callback
    if (isCollaborative && onUpdateComponent) {
      onUpdateComponent(id, updatedComponent);
    } else {
      // For non-collaborative mode, update local state
      const newComponents = [...components];
      newComponents[componentIndex] = updatedComponent;
    setComponents(newComponents);
    }
  };

  const handleComponentResize = (id: string, width: string, height: string) => {
    const componentIndex = components.findIndex(comp => comp.id === id);
    if (componentIndex === -1) return;
    
    const updatedComponent = {
      ...components[componentIndex],
      styles: {
        ...components[componentIndex].styles,
        width,
        height
      }
    };
    
    // For collaborative mode, use the provided callback
    if (isCollaborative && onUpdateComponent) {
      onUpdateComponent(id, updatedComponent);
    } else {
      // For non-collaborative mode, update local state
      const newComponents = [...components];
      newComponents[componentIndex] = updatedComponent;
      setComponents(newComponents);
    }
  };

  const handleComponentMove = (id: string, newPosition: { x: number; y: number }) => {
    const componentIndex = components.findIndex(comp => comp.id === id);
    if (componentIndex === -1) return;
    
    const updatedComponent = {
      ...components[componentIndex],
      position: newPosition
    };
    
    // For collaborative mode, use the provided callback
    if (isCollaborative && onUpdateComponent) {
      onUpdateComponent(id, updatedComponent);
    } else {
      // For non-collaborative mode, update local state
      const newComponents = [...components];
      newComponents[componentIndex] = updatedComponent;
      setComponents(newComponents);
      
      // Don't update history during active dragging to prevent infinite loops
      // The history will be updated on mouse up instead
    }
  };

  const handleDeleteComponent = (id: string) => {
    // For collaborative mode, use the provided callback
    if (isCollaborative && onDeleteComponent) {
      onDeleteComponent(id);
      if (selectedComponent === id) {
        setSelectedComponent(null);
      }
    } else {
      // For non-collaborative mode, update local state
      const newComponents = components.filter(comp => comp.id !== id);
      setComponents(newComponents);
      
      if (selectedComponent === id) {
        setSelectedComponent(null);
      }
      
      // Add to history
      const newHistory = history.slice(0, currentHistoryIndex + 1);
      newHistory.push(newComponents);
      setHistory(newHistory);
      setCurrentHistoryIndex(newHistory.length - 1);
    }
  };

  // Add state for tracking component mouse movement
  const [isMoving, setIsMoving] = useState(false);
  const [moveOffset, setMoveOffset] = useState({ x: 0, y: 0 });
  
  // Create refs at the top level of the component
  const componentsRef = React.useRef(components);
  const selectedComponentRef = React.useRef(selectedComponent);
  
  // Handle mouse movement for components
  const handleMouseDown = (e: React.MouseEvent, componentId: string) => {
    if (isPreviewMode) return;
    
    e.stopPropagation();
    
    const component = components.find(comp => comp.id === componentId);
    if (!component) return;
    
    // Calculate offset from mouse position to component position
    const canvasRect = e.currentTarget.parentElement?.parentElement?.getBoundingClientRect();
    if (!canvasRect) return;

    // Calculate the offset from the mouse position to the component's origin
    const offsetX = e.clientX - canvasRect.left - component.position.x;
    const offsetY = e.clientY - canvasRect.top - component.position.y;
    
    setMoveOffset({ x: offsetX, y: offsetY });
    setSelectedComponent(componentId);
    setIsMoving(true);
  };
  
  // Handle mouse move for the entire canvas
  useEffect(() => {
    // Keep refs in sync with state
    componentsRef.current = components;
    selectedComponentRef.current = selectedComponent;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isMoving || isPreviewMode || !selectedComponentRef.current || !canvasRef) return;
      
      // Get canvas position
      const canvasRect = canvasRef.getBoundingClientRect();
      
      // Calculate new position within the canvas
      const x = e.clientX - canvasRect.left - moveOffset.x;
      const y = e.clientY - canvasRect.top - moveOffset.y;
      
      // Update component position without updating history
      handleComponentMove(selectedComponentRef.current, { x, y });
    };
    
    const handleMouseUp = () => {
      if (isMoving && selectedComponentRef.current) {
        setIsMoving(false);
        
        // Use a functional update to avoid dependency on components state
        setHistory(prevHistory => {
          const newHistory = prevHistory.slice(0, currentHistoryIndex + 1);
          newHistory.push([...componentsRef.current]); // Use the ref to get current components
          return newHistory;
        });
        
        // Use functional update
        setCurrentHistoryIndex(prevIndex => prevIndex + 1);
      }
    };
    
    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    
    // Clean up
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isMoving, moveOffset, canvasRef, isPreviewMode, currentHistoryIndex]);
  // Removed selectedComponent and components from the dependency array
  // since we're using refs to access their current values

  // Add an event listener for the addComponent custom event
  useEffect(() => {
    if (!canvasRef) return;
    
    const handleAddComponentEvent = (e: any) => {
      const { componentType, styles, library } = e.detail;
      
      // Calculate center of canvas for component placement
      const canvasRect = canvasRef.getBoundingClientRect();
      const x = canvasRect.width / 2;
      const y = 100; // Place near the top
      
      const newComponent: DroppedComponent = {
        id: `${componentType}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        type: componentType,
        position: { x, y },
        styles: styles || {},
        library,
      };
      
      // For collaborative mode, use the provided callback
      if (isCollaborative && onAddComponent) {
        onAddComponent(newComponent);
      } else {
        // For non-collaborative mode, update local state
        const newComponents = [...components, newComponent];
    setComponents(newComponents);
        
        // Add to history
        const newHistory = history.slice(0, currentHistoryIndex + 1);
        newHistory.push(newComponents);
        setHistory(newHistory);
        setCurrentHistoryIndex(newHistory.length - 1);
      }
    };
    
    // Add the event listener to the document so it can be triggered from the sidebar
    document.addEventListener('addComponent', handleAddComponentEvent);
    
    return () => {
      document.removeEventListener('addComponent', handleAddComponentEvent);
    };
  }, [canvasRef, components, currentHistoryIndex, history, isCollaborative, onAddComponent]);

  // Add support for touch events by enhancing handleTouchStart
  const handleTouchStart = (e: React.TouchEvent, componentId: string) => {
    if (isPreviewMode) return;
    
    e.stopPropagation();
    
    const component = components.find(comp => comp.id === componentId);
    if (!component) return;
    
    // Calculate offset from touch position to component position
    const touch = e.touches[0];
    const canvasRect = e.currentTarget.parentElement?.parentElement?.getBoundingClientRect();
    if (!canvasRect) return;
    
    // Calculate the offset from the touch position to the component's origin
    const offsetX = touch.clientX - canvasRect.left - component.position.x;
    const offsetY = touch.clientY - canvasRect.top - component.position.y;
    
    setMoveOffset({ x: offsetX, y: offsetY });
    setSelectedComponent(componentId);
    setIsMoving(true);
  };

  // Add touch event handlers to your useEffect for mouse movement
  useEffect(() => {
    // Keep refs in sync with state
    componentsRef.current = components;
    selectedComponentRef.current = selectedComponent;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isMoving || isPreviewMode || !selectedComponentRef.current || !canvasRef) return;
      
      // Get canvas position
      const canvasRect = canvasRef.getBoundingClientRect();
      
      // Calculate new position within the canvas
      const x = e.clientX - canvasRect.left - moveOffset.x;
      const y = e.clientY - canvasRect.top - moveOffset.y;
      
      // Update component position without updating history
      handleComponentMove(selectedComponentRef.current, { x, y });
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      if (!isMoving || isPreviewMode || !selectedComponentRef.current || !canvasRef) return;
      
      // Prevent default to avoid scrolling while dragging
      e.preventDefault();
      
      const touch = e.touches[0];
      
      // Get canvas position
      const canvasRect = canvasRef.getBoundingClientRect();
      
      // Calculate new position within the canvas
      const x = touch.clientX - canvasRect.left - moveOffset.x;
      const y = touch.clientY - canvasRect.top - moveOffset.y;
      
      // Update component position without updating history
      handleComponentMove(selectedComponentRef.current, { x, y });
    };
    
    const handleMouseUp = () => {
      if (isMoving && selectedComponentRef.current) {
        setIsMoving(false);
        
        // Use a functional update to avoid dependency on components state
        setHistory(prevHistory => {
          const newHistory = prevHistory.slice(0, currentHistoryIndex + 1);
          newHistory.push([...componentsRef.current]); // Use the ref to get current components
          return newHistory;
        });
        
        // Use functional update
        setCurrentHistoryIndex(prevIndex => prevIndex + 1);
      }
    };
    
    const handleTouchEnd = () => {
      if (isMoving && selectedComponentRef.current) {
        setIsMoving(false);
        
        // Use a functional update to avoid dependency on components state
        setHistory(prevHistory => {
          const newHistory = prevHistory.slice(0, currentHistoryIndex + 1);
          newHistory.push([...componentsRef.current]); // Use the ref to get current components
          return newHistory;
        });
        
        // Use functional update
        setCurrentHistoryIndex(prevIndex => prevIndex + 1);
      }
    };
    
    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);
    
    // Clean up
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMoving, moveOffset, canvasRef, isPreviewMode, currentHistoryIndex, handleComponentMove]);

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

    const wrapperClasses = `relative group ${isPreviewMode ? '' : 'cursor-move touch-none'} ${isSelected ? 'ring-2 ring-orange-500 ring-offset-2' : ''}`;

    const handleDelete = (e: React.MouseEvent) => {
      e.stopPropagation();
      handleDeleteComponent(id);
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
                  <MuiButton 
                    // @ts-ignore - Ignoring type error for demo purposes
                    variant="contained"
                    color="primary"
                    style={{
                      ...commonStyles,
                      textTransform: 'none',
                      boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
                      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                      fontWeight: 500,
                      borderRadius: '4px',
                    }}
                  >
                    {styles.buttonText === undefined || styles.buttonText === null ? 'MUI Button' : styles.buttonText}
                  </MuiButton>
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
                  <AntdButton 
                    type="primary"
                    style={commonStyles}
                  >
                    {styles.buttonText === undefined || styles.buttonText === null ? 'Ant Button' : styles.buttonText}
                  </AntdButton>
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
                  <Button
                    size={styles?.size || "default"}
                    variant={styles?.variant || "default"}
                    style={{
                      ...commonStyles,
                      fontFamily: 'var(--font-sans)',
                      fontWeight: 500,
                      borderRadius: 'var(--radius)',
                      boxShadow: 'none',
                    }}
                    className="transition-colors"
                  >
                    {styles.buttonText === undefined || styles.buttonText === null ? 'Shadcn Button' : styles.buttonText}
                  </Button>
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
              <Input
                placeholder={styles.placeholder || "Input field"}
                className="dark:text-zinc-200 dark:placeholder:text-zinc-400 dark:bg-zinc-800 dark:border-zinc-700"
                style={{
                  ...commonStyles,
                  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                  borderRadius: '4px',
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
        case 'Card':
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
              <Card className="dark:bg-zinc-800 dark:border-zinc-700 dark:text-zinc-200">
                <div style={{ 
                  ...commonStyles,
                  padding: '16px',
                }}>
                  <h3 className="text-gray-900 dark:text-zinc-100 font-medium mb-2 text-lg">
                    {styles.cardTitle || 'Card Title'}
                  </h3>
                  <p className="text-gray-700 dark:text-zinc-300 text-sm">
                    {styles.cardContent === undefined || styles.cardContent === null ? 'Card content goes here' : styles.cardContent}
                  </p>
                </div>
              </Card>
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
    <div className="flex-1 flex flex-col h-[90vh] w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center p-2 sm:p-4 bg-white dark:bg-zinc-900 border-b border-gray-200 dark:border-zinc-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-zinc-100 mb-2 sm:mb-0">Editor Canvas</h2>
        
        {/* Move preview button to header on mobile */}
        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={handleUndo}
            disabled={currentHistoryIndex === 0 || isPreviewMode}
          >
            <FiRotateCcw className="w-4 h-4" />
            Undo
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={handleRedo}
            disabled={currentHistoryIndex === history.length - 1 || isPreviewMode}
          >
            <FiRotateCw className="w-4 h-4" />
            Redo
          </Button>

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

        <div className="flex gap-2">
          {/* Load Layout Button */}
          <AlertDialog open={showLoadDialog} onOpenChange={setShowLoadDialog}>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2"
                disabled={savedLayouts.length === 0 || isPreviewMode}
              >
                <FiList className="w-4 h-4" />
                Load Layout
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md border border-gray-200 dark:border-zinc-700">
              <AlertDialogHeader>
                <AlertDialogTitle>Load Layout</AlertDialogTitle>
                <AlertDialogDescription className="dark:text-zinc-300">
                  Select a saved layout to load. This will replace your current canvas.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="py-4">
                <Select value={selectedLayout} onValueChange={setSelectedLayout}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a layout" />
                  </SelectTrigger>
                  <SelectContent>
                    {savedLayouts.map((layout) => (
                      <SelectItem key={layout._id || layout.name} value={layout._id || layout.name}>
                        {layout.name} {layout.createdAt && `(${new Date(layout.createdAt).toLocaleDateString()})`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setSelectedLayout('')}>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleLoad} disabled={!selectedLayout}>
                  Load
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Export Layout Button */}
          <AlertDialog open={showExportDialog} onOpenChange={setShowExportDialog}>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-2"
                disabled={components.length === 0 || isPreviewMode}
              >
                <FiDownload className="w-4 h-4" />
                Export
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md border border-gray-200 dark:border-zinc-700">
              <AlertDialogHeader>
                <AlertDialogTitle>Export Layout</AlertDialogTitle>
                <AlertDialogDescription className="dark:text-zinc-300">
                  Choose a format to export your layout.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="py-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Layout Name
                  </label>
                  <Input
                    placeholder="Enter layout name"
                    value={layoutName}
                    onChange={(e) => setLayoutName(e.target.value)}
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Export Format
                  </label>
                  <Select value={exportFormat} onValueChange={setExportFormat}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="html">HTML</SelectItem>
                      <SelectItem value="react">React Component</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleExport}>
                  Export
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Save Layout Button */}
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
            <AlertDialogContent className="bg-white/80 dark:bg-zinc-800/80 backdrop-blur-md border border-gray-200 dark:border-zinc-700">
              <AlertDialogHeader>
                <AlertDialogTitle>Save Layout</AlertDialogTitle>
                <AlertDialogDescription className="dark:text-zinc-300">
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
      <div className="flex-1 flex flex-col h-[90vh] w-full">
        <div 
          ref={(el) => setCanvasRef(el)}
          className={`flex-1 relative overflow-auto border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 ${isDraggingOver ? 'bg-orange-50 dark:bg-orange-900/20' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleCanvasClick}
          style={{ minHeight: '500px', width: '100%' }}
        >
          {components.map((component) => (
            <div
              key={component.id}
              className={`absolute ${isPreviewMode ? '' : 'cursor-move touch-none'}`}
              style={{
                left: `${component.position.x}px`,
                top: `${component.position.y}px`,
                transform: 'translate(-50%, -50%)',
                touchAction: 'none', // Prevent touch scrolling while dragging
              }}
              onMouseDown={(e) => !isPreviewMode && handleMouseDown(e, component.id)}
              onTouchStart={(e) => !isPreviewMode && handleTouchStart(e, component.id)}
            >
              <ResizableComponent
                component={component}
                isSelected={selectedComponent === component.id}
                isPreviewMode={isPreviewMode}
                onResize={handleComponentResize}
              >
                {renderComponent(component)}
              </ResizableComponent>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DragDropEditor;
