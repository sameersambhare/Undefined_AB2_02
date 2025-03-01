'use client';

import React, { useState, useEffect } from 'react';
import { FiSquare, FiType, FiBox } from 'react-icons/fi';
import { Button as ShadcnButton } from './ui/button';
import { Input as ShadcnInput } from './ui/input';
import { Card as ShadcnCard } from './ui/card';
import { Button as MuiButton } from './ui-libraries/mui/button';
import { Input as MuiInput } from './ui-libraries/mui/input';
import { Card as MuiCard } from './ui-libraries/mui/card';
import { Button as AntdButton } from './ui-libraries/antd/button';
import { Input as AntdInput } from './ui-libraries/antd/input';
import { Card as AntdCard } from './ui-libraries/antd/card';
import ComponentStyler from './ComponentStyler';

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
  [key: string]: StyleProperties; // Allow indexing with string
}

// Default styles for components
const defaultStyles: DefaultStylesType = {
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
  }
};

const ComponentList: React.FC<ComponentListProps> = ({ onDragStart }) => {
  const [componentStyles, setComponentStyles] = useState<ComponentStyles>({
    Button: { ...defaultStyles.Button },
    Input: { ...defaultStyles.Input },
    Card: { ...defaultStyles.Card }
  });
  
  // Add state to track if component is mounted (client-side only)
  const [isMounted, setIsMounted] = useState(false);

  // Use effect to set mounted state after component mounts on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

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
    // Don't render actual components during SSR
    if (!isMounted) {
      return <div className="h-12 bg-gray-100 animate-pulse rounded"></div>;
    }
    
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
              <MuiCard style={commonStyles}>
                <span style={{ color: styles.textColor || defaultStyles.Card.textColor, padding: '16px', display: 'block' }}>
                  {styles.cardContent || 'Card Content'}
                </span>
              </MuiCard>
            );
          case 'antd':
            return (
              <AntdCard title={styles.cardTitle || "Card"} style={commonStyles}>
                <span style={{ color: styles.textColor || defaultStyles.Card.textColor }}>
                  {styles.cardContent || 'Card Content'}
                </span>
              </AntdCard>
            );
          case 'shadcn':
          default:
            return (
              <ShadcnCard
                className="flex items-center justify-center"
                style={commonStyles}
              >
                <span style={{ color: styles.textColor || defaultStyles.Card.textColor }}>
                  {styles.cardContent || 'Card Content'}
                </span>
              </ShadcnCard>
            );
        }
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
          const currentLibrary = componentStyles[component.name]?.library || 'shadcn';
          
          return (
            <div
              key={component.name}
              draggable
              onDragStart={(e) => onDragStart(e, component.name, componentStyles[component.name], currentLibrary as UILibrary)}
              className="group relative flex flex-col gap-2 p-3 rounded-md cursor-move hover:bg-gray-50 border border-gray-200 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{component.name}</span>
                </div>
                <div className="text-xs">
                  <select 
                    value={currentLibrary}
                    onChange={(e) => handleLibraryChange(component.name, e.target.value as UILibrary)}
                    className="text-xs border rounded px-1 py-0.5 bg-white"
                  >
                    <option value="shadcn">shadcn</option>
                    <option value="mui">Material UI</option>
                    <option value="antd">Ant Design</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-center bg-gray-50 rounded-md p-3 h-20">
                {renderPreview(component.name)}
              </div>
              <ComponentStyler
                componentType={component.name}
                onStyleChange={(styles) => handleStyleChange(component.name, styles)}
                initialStyles={componentStyles[component.name]}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ComponentList;
