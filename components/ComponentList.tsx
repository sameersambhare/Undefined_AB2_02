'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FiSquare, FiType, FiBox, FiCircle, FiMinus, FiCornerRightDown } from 'react-icons/fi';
import { Button as ShadcnButton } from './ui/button';
import { Input as ShadcnInput } from './ui/input';
import { Card as ShadcnCard } from './ui/card';
import dynamic from 'next/dynamic';
import ComponentStyler from './ComponentStyler';

// Dynamically import UI library components with SSR disabled
const MuiButton = dynamic(() => import('./ui-libraries/mui/button').then(mod => mod.Button), { ssr: false });
const MuiInput = dynamic(() => import('./ui-libraries/mui/input').then(mod => mod.Input), { ssr: false });
const MuiCard = dynamic(() => import('./ui-libraries/mui/card').then(mod => mod.Card), { ssr: false });
const AntdButton = dynamic(() => import('./ui-libraries/antd/button').then(mod => mod.Button), { ssr: false });
const AntdInput = dynamic(() => import('./ui-libraries/antd/input').then(mod => mod.Input), { ssr: false });
const AntdCard = dynamic(() => import('./ui-libraries/antd/card').then(mod => mod.Card), { ssr: false });

// UI Library type
type UILibrary = 'shadcn' | 'mui' | 'antd';

interface ComponentListProps {
  onDragStart: (event: React.DragEvent<HTMLDivElement>, component: string, styles: any, library: UILibrary) => void;
}

interface ComponentStyles {
  [key: string]: any;
}

// Define the type for component styles
interface StyleProperties {
  variant?: string;
  size?: string;
  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  borderWidth?: string;
  borderStyle?: string;
  borderRadius?: string;
  padding?: string;
  margin?: string;
  fontSize?: string;
  fontWeight?: string;
  width?: string;
  height?: string;
  shadow?: string;
  placeholder?: string;
  opacity?: number;
  textAlign?: string;
  letterSpacing?: string;
  library?: UILibrary; // Add library property
  buttonText?: string; // Add button text property
  cardTitle?: string; // Add card title property
  cardContent?: string; // Add card content property
  [key: string]: any; // Allow for additional properties
}

interface DefaultStylesType {
  Button: StyleProperties;
  Input: StyleProperties;
  Card: StyleProperties;
  Rectangle: StyleProperties;
  Circle: StyleProperties;
  Line: StyleProperties;
  [key: string]: StyleProperties; // Allow indexing with string
}

// Resizable Preview Component
interface ResizablePreviewProps {
  children: React.ReactNode;
  componentName: string;
  styles: StyleProperties;
  onResize: (width: string, height: string) => void;
  aspectRatio?: boolean;
}

const ResizablePreview: React.FC<ResizablePreviewProps> = ({ 
  children, 
  componentName, 
  styles, 
  onResize,
  aspectRatio = false
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [startSize, setStartSize] = useState({ width: 0, height: 0 });
  
  // Get initial dimensions from styles
  const getInitialDimensions = () => {
    const width = styles.width ? parseInt(styles.width) : 100;
    const height = styles.height ? parseInt(styles.height) : 60;
    return { width, height };
  };

  // Handle resize start
  const handleResizeStart = (e: React.MouseEvent) => {
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
    
    // Maintain aspect ratio if needed (for Circle)
    if (aspectRatio) {
      newHeight = newWidth;
    }
    
    // Special case for Line component
    if (componentName === 'Line') {
      newHeight = 0;
    }
    
    // Update component size
    onResize(`${newWidth}px`, `${newHeight}px`);
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
      className="relative w-full h-full flex items-center justify-center"
      style={{ 
        width: styles.width || 'auto',
        height: componentName === 'Line' ? 'auto' : (styles.height || 'auto'),
      }}
    >
      {children}
      
      {/* Resize handle */}
      <div 
        className="absolute bottom-0 right-0 w-4 h-4 cursor-nwse-resize flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        onMouseDown={handleResizeStart}
        title="Resize"
      >
        <FiCornerRightDown className="w-3 h-3 text-orange-500" />
      </div>
    </div>
  );
};

// Default styles for components
const defaultStyles: DefaultStylesType = {
  Button: {
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
    library: "shadcn", // Default library
    buttonText: "Button", // Default button text
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
    library: "shadcn", // Default library
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
    library: "shadcn", // Default library
    cardTitle: "Card Title", // Default card title
    cardContent: "Card Content", // Default card content
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
    library: "shadcn", // Default library
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
    library: "shadcn", // Default library
  },
  Line: {
    backgroundColor: "transparent",
    borderColor: "#f97316", // orange-500
    borderWidth: "0",
    borderTopWidth: "2px",
    borderStyle: "solid",
    width: "100px",
    height: "0",
    shadow: "none",
    opacity: 100,
    library: "shadcn", // Default library
  }
};

const ComponentList: React.FC<ComponentListProps> = ({ onDragStart }) => {
  const [componentStyles, setComponentStyles] = useState<ComponentStyles>({
    Button: { ...defaultStyles.Button },
    Input: { ...defaultStyles.Input },
    Card: { ...defaultStyles.Card },
    Rectangle: { ...defaultStyles.Rectangle },
    Circle: { ...defaultStyles.Circle },
    Line: { ...defaultStyles.Line }
  });
  
  const handleStyleChange = (componentName: string, styles: any) => {
    setComponentStyles(prev => ({
      ...prev,
      [componentName]: { ...prev[componentName], ...styles }
    }));
  };

  const handleLibraryChange = (componentName: string, library: UILibrary) => {
    setComponentStyles(prev => ({
      ...prev,
      [componentName]: { ...prev[componentName], library }
    }));
  };

  const renderPreview = (name: string) => {
    const styles = componentStyles[name] || {};
    const library = styles.library || 'shadcn';
    
    const commonStyles = {
      width: styles.width || defaultStyles[name].width,
      height: styles.height || defaultStyles[name].height,
      padding: styles.padding || defaultStyles[name].padding,
      margin: styles.margin,
      fontSize: styles.fontSize || defaultStyles[name].fontSize,
      fontWeight: styles.fontWeight || defaultStyles[name].fontWeight,
      backgroundColor: styles.backgroundColor || defaultStyles[name].backgroundColor,
      color: styles.textColor || defaultStyles[name].textColor,
      borderColor: styles.borderColor || defaultStyles[name].borderColor,
      borderWidth: styles.borderWidth || defaultStyles[name].borderWidth,
      borderStyle: styles.borderStyle || defaultStyles[name].borderStyle,
      borderRadius: styles.borderRadius || defaultStyles[name].borderRadius,
      opacity: styles.opacity ? Number(styles.opacity) / 100 : 1,
      boxShadow: styles.shadow === 'none' ? 'none' : 
                 styles.shadow === 'sm' ? '0 1px 2px 0 rgb(0 0 0 / 0.05)' :
                 styles.shadow === 'md' ? '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' :
                 styles.shadow === 'lg' ? '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' :
                 styles.shadow === 'xl' ? '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)' : 
                 defaultStyles[name].shadow === 'sm' ? '0 1px 2px 0 rgb(0 0 0 / 0.05)' : 'none',
    };

    const handleResize = (width: string, height: string) => {
      const newStyles = { ...componentStyles[name] };
      newStyles.width = width;
      
      // For Circle, update both width and height to maintain aspect ratio
      if (name === 'Circle') {
        newStyles.height = width;
      } else if (name !== 'Line') {
        // For Line, we don't update height
        newStyles.height = height;
      }
      
      handleStyleChange(name, newStyles);
    };

    const component = (() => {
      switch (name) {
        case 'Button':
          switch (library) {
            case 'mui':
              return (
                <MuiButton variant="contained" color="primary" style={commonStyles}>
                  {styles.buttonText === undefined || styles.buttonText === null ? 'Button' : styles.buttonText}
                </MuiButton>
              );
            case 'antd':
              return (
                <AntdButton type="primary" style={commonStyles}>
                  {styles.buttonText === undefined || styles.buttonText === null ? 'Button' : styles.buttonText}
                </AntdButton>
              );
            case 'shadcn':
            default:
              return (
                <ShadcnButton
                  size={styles.size || defaultStyles.Button.size}
                  variant={styles.variant || defaultStyles.Button.variant}
                  style={commonStyles}
                >
                  {styles.buttonText === undefined || styles.buttonText === null ? 'Button' : styles.buttonText}
                </ShadcnButton>
              );
          }
        case 'Input':
          switch (library) {
            case 'mui':
              return (
                <MuiInput
                  // @ts-ignore - Ignoring type error for demo purposes
                  label={styles.placeholder || defaultStyles.Input.placeholder}
                  variant="outlined"
                  style={commonStyles}
                />
              );
            case 'antd':
              return (
                <AntdInput
                  placeholder={styles.placeholder || defaultStyles.Input.placeholder}
                  style={commonStyles}
                />
              );
            case 'shadcn':
            default:
              return (
                <ShadcnInput
                  placeholder={styles.placeholder || defaultStyles.Input.placeholder}
                  style={commonStyles}
                />
              );
          }
        case 'Card':
          switch (library) {
            case 'mui':
              return (
                <div className="scale-[0.7] transform-origin-center">
                  <MuiCard style={{...commonStyles, maxWidth: '100%', maxHeight: '100%'}}>
                    <span style={{ color: styles.textColor || defaultStyles.Card.textColor, padding: '8px', display: 'block', fontSize: '0.8rem' }}>
                      {styles.cardContent || 'Card Content'}
                    </span>
                  </MuiCard>
                </div>
              );
            case 'antd':
              return (
                <div className="scale-[0.7] transform-origin-center">
                  <AntdCard 
                    title={styles.cardTitle || "Card"} 
                    style={{...commonStyles, maxWidth: '100%', maxHeight: '100%'}}
                    headStyle={{padding: '8px', fontSize: '0.9rem'}}
                    bodyStyle={{padding: '8px'}}
                  >
                    <span style={{ color: styles.textColor || defaultStyles.Card.textColor, fontSize: '0.8rem' }}>
                      {styles.cardContent || 'Card Content'}
                    </span>
                  </AntdCard>
                </div>
              );
            case 'shadcn':
            default:
              return (
                <ShadcnCard
                  className="flex items-center justify-center p-2"
                  style={{...commonStyles, maxWidth: '100%', maxHeight: '100%'}}
                >
                  <span style={{ color: styles.textColor || defaultStyles.Card.textColor, fontSize: '0.8rem' }}>
                    {styles.cardContent || 'Card Content'}
                  </span>
                </ShadcnCard>
              );
          }
        case 'Rectangle':
          return (
            <div
              style={{
                ...commonStyles,
                width: '100%',
                height: '100%',
              }}
              className="flex items-center justify-center"
            />
          );
        case 'Circle':
          return (
            <div
              style={{
                ...commonStyles,
                width: '100%',
                height: '100%',
                borderRadius: '9999px',
              }}
              className="flex items-center justify-center"
            />
          );
        case 'Line':
          return (
            <div
              style={{
                ...commonStyles,
                width: '100%',
                height: '0',
                borderTopWidth: styles.borderTopWidth || defaultStyles.Line.borderTopWidth,
              }}
              className="flex items-center justify-center"
            />
          );
        default:
          return null;
      }
    })();

    // Wrap the component with ResizablePreview
    return (
      <ResizablePreview 
        componentName={name} 
        styles={styles} 
        onResize={handleResize}
        aspectRatio={name === 'Circle'}
      >
        {component}
      </ResizablePreview>
    );
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
    {
      name: 'Rectangle',
      icon: FiSquare,
    },
    {
      name: 'Circle',
      icon: FiCircle,
    },
    {
      name: 'Line',
      icon: FiMinus,
    },
  ];

  return (
    <div className="w-72 bg-white dark:bg-zinc-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-zinc-700">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-zinc-100">Components</h2>
      <div className="space-y-3">
        {components.map((component) => {
          const Icon = component.icon;
          const currentLibrary = componentStyles[component.name]?.library || 'shadcn';
          
          return (
            <div
              key={component.name}
              draggable
              onDragStart={(e) => onDragStart(e, component.name, componentStyles[component.name], currentLibrary as UILibrary)}
              className="group relative flex flex-col gap-2 p-3 rounded-md cursor-move hover:bg-gray-50 dark:hover:bg-zinc-700 border border-gray-200 dark:border-zinc-700 transition-colors dark:bg-zinc-800"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5 text-gray-600 dark:text-zinc-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-zinc-300">{component.name}</span>
                </div>
                <div className="text-xs">
                  <select 
                    value={currentLibrary}
                    onChange={(e) => handleLibraryChange(component.name, e.target.value as UILibrary)}
                    className="text-xs border rounded px-1 py-0.5 bg-white dark:bg-zinc-700 dark:text-zinc-300 dark:border-zinc-600"
                  >
                    <option value="shadcn">shadcn</option>
                    <option value="mui">Material UI</option>
                    <option value="antd">Ant Design</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-center bg-gray-50 dark:bg-zinc-700 rounded-md p-3 h-20 overflow-hidden">
                {renderPreview(component.name)}
              </div>
              <div className="relative">
                <ComponentStyler
                  componentType={component.name}
                  onStyleChange={(styles) => handleStyleChange(component.name, styles)}
                  initialStyles={componentStyles[component.name]}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ComponentList;
