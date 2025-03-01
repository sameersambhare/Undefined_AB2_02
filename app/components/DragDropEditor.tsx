'use client'
import React, { useState, useEffect } from "react";
import { FiMove, FiTrash2, FiSave, FiEye, FiEdit2, FiDownload, FiList, FiCode, FiRotateCcw, FiRotateCw } from 'react-icons/fi';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import { Label } from './ui/label';
// Import UI library components
import { Button as MuiButton } from './ui-libraries/mui/button';
import { Input as MuiInput } from './ui-libraries/mui/input';
import { Card as MuiCard } from './ui-libraries/mui/card';
import { Label as MuiLabel } from './ui-libraries/mui/label';
import { Button as AntdButton } from './ui-libraries/antd/button';
import { Input as AntdInput } from './ui-libraries/antd/input';
import { Card as AntdCard } from './ui-libraries/antd/card';
import { Label as AntdLabel } from './ui-libraries/antd/label';
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

interface SavedLayout {
  name: string;
  components: DroppedComponent[];
  savedAt: string;
}

// Add a counter for stable ID generation
let componentIdCounter = 0;

const DragDropEditor: React.FC = () => {
  const [components, setComponents] = useState<DroppedComponent[]>([]);
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
  const [editingText, setEditingText] = useState<string | null>(null);

  // Load saved layouts from localStorage on component mount - safely with useEffect
  useEffect(() => {
    try {
      const layouts = JSON.parse(localStorage.getItem('savedLayouts') || '[]');
      setSavedLayouts(layouts);
    } catch (error) {
      console.error('Error loading saved layouts:', error);
      setSavedLayouts([]);
    }
  }, []);

  // Use a stable ID generation method that doesn't rely on Math.random() during SSR
  const generateComponentId = (componentType: string) => {
    componentIdCounter += 1;
    return `${componentType}-${componentIdCounter}`;
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
      const newComponents = components.map(comp => 
        comp.id === draggedComponentId
          ? { ...comp, position: { x, y } }
          : comp
      );
      setComponents(newComponents);
      updateHistory(newComponents); // Add to history
      setDraggedComponentId(null);
      return;
    }

    // If we're adding a new component
    const componentType = e.dataTransfer.getData('componentType');
    const componentStyles = JSON.parse(e.dataTransfer.getData('componentStyles') || '{}');
    const componentLibrary = e.dataTransfer.getData('componentLibrary') || 'shadcn';

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
        buttonText: "Button", // Add default button text
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
        cardTitle: "Card Title", // Add default card title
        cardContent: "Card Content", // Add default card content
      },
      Label: {
        backgroundColor: "transparent",
        textColor: "#374151", // gray-700
        fontSize: "0.875rem", // text-sm
        fontWeight: "500", // font-medium
        width: "auto",
        height: "auto",
        labelText: "Label"
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
    setDraggedComponentId(id);
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

  const handleSave = () => {
    if (!layoutName.trim()) return;

    // Create the saved layout object
    const savedLayout: SavedLayout = {
      name: layoutName,
      components: components,
      savedAt: new Date().toISOString(), // This is fine in a client component
    };

    try {
      const existingLayouts = JSON.parse(localStorage.getItem('savedLayouts') || '[]');
      
      // Check if layout with same name exists and replace it
      const layoutIndex = existingLayouts.findIndex((layout: SavedLayout) => layout.name === layoutName);
      let updatedLayouts;
      
      if (layoutIndex >= 0) {
        updatedLayouts = [...existingLayouts];
        updatedLayouts[layoutIndex] = savedLayout;
      } else {
        updatedLayouts = [...existingLayouts, savedLayout];
      }
      
      localStorage.setItem('savedLayouts', JSON.stringify(updatedLayouts));
      setSavedLayouts(updatedLayouts);
      
      setShowSaveDialog(false);
      setLayoutName('');
    } catch (error) {
      console.error('Error saving layout:', error);
      alert('There was an error saving your layout. Please try again.');
    }
  };

  const handleLoad = () => {
    if (!selectedLayout) return;
    
    try {
      const layout = savedLayouts.find(layout => layout.name === selectedLayout);
      if (layout) {
        setComponents(layout.components);
        setSelectedComponent(null);
      }
      
      setShowLoadDialog(false);
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
    const clonedElement = element.cloneNode(true) as HTMLDivElement;
    document.body.appendChild(clonedElement);
    clonedElement.style.position = 'absolute';
    clonedElement.style.left = '-9999px';
    
    try {
      // Process all elements in the clone to replace oklch colors
      const processElements = (elements: HTMLElement[]) => {
        elements.forEach(el => {
          // Get computed style
          const computedStyle = window.getComputedStyle(el);
          
          // Apply computed styles directly to element
          el.style.backgroundColor = computedStyle.backgroundColor;
          el.style.color = computedStyle.color;
          el.style.borderColor = computedStyle.borderColor;
          
          // Handle box-shadow and other properties that might use oklch
          el.style.boxShadow = computedStyle.boxShadow;
          
          // Process children recursively
          const children = Array.from(el.children) as HTMLElement[];
          if (children.length > 0) {
            processElements(children);
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
        
        html2canvas(clonedElement, {
          backgroundColor: '#ffffff',
          scale: 2,
          logging: false,
          useCORS: true,
          allowTaint: true,
          onclone: (clonedDoc, clonedElement) => {
            // Additional processing in the cloned document if needed
            return clonedElement;
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
          document.body.removeChild(clonedElement);
        }).catch(error => {
          console.error("Error rendering canvas:", error);
          alert("There was an error exporting to PDF. Please try a different format.");
          document.body.removeChild(clonedElement);
        });
      }).catch(error => {
        console.error("Error loading modules:", error);
        alert("There was an error loading the export modules. Please try again later.");
        document.body.removeChild(clonedElement);
      });
    } catch (error) {
      console.error("Error in PDF export:", error);
      alert("There was an error preparing the PDF. Please try a different format.");
      if (document.body.contains(clonedElement)) {
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

  const handleStyleChange = (componentId: string, newStyles: any) => {
    const newComponents = components.map(comp => 
      comp.id === componentId 
        ? { ...comp, styles: { ...comp.styles, ...newStyles } }
        : comp
    );
    setComponents(newComponents);
    updateHistory(newComponents); // Add to history
  };

  const handleLabelTextChange = (id: string, value: string) => {
    handleStyleChange(id, { labelText: value });
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

    const wrapperClasses = `relative group ${isPreviewMode ? '' : 'cursor-move'} ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`;

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
              <MuiInput
                // @ts-ignore - Ignoring type error for demo purposes
                label="MUI Input"
                variant="outlined"
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
              <MuiCard 
                // @ts-ignore - Ignoring type error for demo purposes
                style={{
                  ...commonStyles,
                  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                  borderRadius: '4px',
                  boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)',
                  padding: '16px',
                }}
              >
                <div style={{ padding: '16px' }}>
                  <h3 style={{ color: styles?.textColor, fontWeight: 500, marginBottom: '8px', fontSize: '1.1em' }}>
                    {styles.cardTitle || 'MUI Card'}
                  </h3>
                  <p style={{ color: styles?.textColor, fontSize: '0.875rem' }}>
                    {styles.cardContent === undefined || styles.cardContent === null ? 'This is a Material UI card with elevation and padding.' : styles.cardContent}
                  </p>
                </div>
              </MuiCard>
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
        case 'Label':
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
                  {isSelected && !isPreviewMode ? (
                    <input
                      type="text"
                      value={editingText !== null ? editingText : (styles.labelText || '')}
                      onChange={(e) => setEditingText(e.target.value)}
                      onBlur={() => {
                        if (editingText !== null) {
                          handleLabelTextChange(id, editingText);
                        }
                        setEditingText(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          if (editingText !== null) {
                            handleLabelTextChange(id, editingText);
                          }
                          setEditingText(null);
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-transparent border-b border-dashed border-gray-400 focus:outline-none px-1 min-w-[60px]"
                      style={commonStyles}
                      autoFocus
                      placeholder="Enter text"
                    />
                  ) : (
                    <div onClick={() => {
                      if (isSelected && !isPreviewMode) {
                        setEditingText(styles.labelText || '');
                      }
                    }}>
                      <Label style={commonStyles}>
                        {styles.labelText || 'Label'}
                      </Label>
                    </div>
                  )}
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
                  {isSelected && !isPreviewMode ? (
                    <input
                      type="text"
                      value={editingText !== null ? editingText : (styles.labelText || '')}
                      onChange={(e) => setEditingText(e.target.value)}
                      onBlur={() => {
                        if (editingText !== null) {
                          handleLabelTextChange(id, editingText);
                        }
                        setEditingText(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          if (editingText !== null) {
                            handleLabelTextChange(id, editingText);
                          }
                          setEditingText(null);
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-transparent border-b border-dashed border-gray-400 focus:outline-none px-1 min-w-[60px]"
                      style={commonStyles}
                      autoFocus
                      placeholder="Enter text"
                    />
                  ) : (
                    <div onClick={() => {
                      if (isSelected && !isPreviewMode) {
                        setEditingText(styles.labelText || '');
                      }
                    }}>
                      <AntdLabel style={commonStyles}>
                        {styles.labelText || 'Label'}
                      </AntdLabel>
                    </div>
                  )}
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
                  {isSelected && !isPreviewMode ? (
                    <input
                      type="text"
                      value={editingText !== null ? editingText : (styles.labelText || '')}
                      onChange={(e) => setEditingText(e.target.value)}
                      onBlur={() => {
                        if (editingText !== null) {
                          handleLabelTextChange(id, editingText);
                        }
                        setEditingText(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          if (editingText !== null) {
                            handleLabelTextChange(id, editingText);
                          }
                          setEditingText(null);
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-transparent border-b border-dashed border-gray-400 focus:outline-none px-1 min-w-[60px]"
                      style={commonStyles}
                      autoFocus
                      placeholder="Enter text"
                    />
                  ) : (
                    <div onClick={() => {
                      if (isSelected && !isPreviewMode) {
                        setEditingText(styles.labelText || '');
                      }
                    }}>
                      <Label style={commonStyles}>
                        {styles.labelText || 'Label'}
                      </Label>
                    </div>
                  )}
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
        default:
          return null;
      }
    };

    return renderComponentByLibrary();
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex justify-between items-center mb-4 px-4">
        <h2 className="text-lg font-semibold text-gray-900">Editor Canvas</h2>
      </div>
      <div
        ref={setCanvasRef}
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
                className="flex items-center gap-2 text-black"
                disabled={components.length === 0 || isPreviewMode}
              >
                <FiTrash2 className="w-4 h-4" />
                Reset Canvas
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white/80 backdrop-blur-md border border-gray-200">
              <AlertDialogHeader>
                <AlertDialogTitle>Reset Canvas</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to reset the canvas? This will remove all components and cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => {
                  handleReset();
                  updateHistory([]);
                }}>
                  Reset
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

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
            <AlertDialogContent className="bg-white/80 backdrop-blur-md border border-gray-200">
              <AlertDialogHeader>
                <AlertDialogTitle>Load Layout</AlertDialogTitle>
                <AlertDialogDescription>
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
                      <SelectItem key={layout.name} value={layout.name}>
                        {layout.name}
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
            <AlertDialogContent className="bg-white/80 backdrop-blur-md border border-gray-200">
              <AlertDialogHeader>
                <AlertDialogTitle>Export Layout</AlertDialogTitle>
                <AlertDialogDescription>
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
            <AlertDialogContent className="bg-white/80 backdrop-blur-md border border-gray-200">
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
    </div>
  );
};

export default DragDropEditor;
