'use client';

import React, { useState } from 'react';
import { FiSquare, FiType, FiBox, FiCircle, FiMinus, FiCornerRightDown, FiChevronDown, FiUser, FiTag, FiAlignLeft } from 'react-icons/fi';
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
  dropdownText?: string; // Add dropdown text property
  badgeText?: string; // Add badge text property
  avatarText?: string; // Add avatar text property
  [key: string]: any; // Allow for additional properties
}

interface DefaultStylesType {
  Button: StyleProperties;
  Input: StyleProperties;
  Card: StyleProperties;
  Rectangle: StyleProperties;
  Circle: StyleProperties;
  Line: StyleProperties;
  Dropdown: StyleProperties;
  Badge: StyleProperties;
  Avatar: StyleProperties;
  Divider: StyleProperties;
  Text: StyleProperties;
  [key: string]: StyleProperties; // Allow indexing with string
}

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
    borderWidth: "2px",
    borderTopWidth: "2px",
    borderStyle: "solid",
    width: "100px",
    height: "0",
    shadow: "none",
    opacity: 100,
    library: "shadcn", // Default library
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
    library: "shadcn", // Default library
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
    library: "shadcn", // Default library
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
    library: "shadcn", // Default library
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
    library: "shadcn", // Default library
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
    library: "shadcn", // Default library
    textContent: "Text content", // Default text content
  }
};

const ComponentList: React.FC<ComponentListProps> = ({ onDragStart }) => {
  const [componentStyles, setComponentStyles] = useState<ComponentStyles>({
    Button: { ...defaultStyles.Button },
    Input: { ...defaultStyles.Input },
    Card: { ...defaultStyles.Card },
    Rectangle: { ...defaultStyles.Rectangle },
    Circle: { ...defaultStyles.Circle },
    Line: { ...defaultStyles.Line },
    Dropdown: { ...defaultStyles.Dropdown },
    Badge: { ...defaultStyles.Badge },
    Avatar: { ...defaultStyles.Avatar },
    Divider: { ...defaultStyles.Divider },
    Text: { ...defaultStyles.Text }
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
      textAlign: styles.textAlign || defaultStyles[name]?.textAlign,
      letterSpacing: styles.letterSpacing || defaultStyles[name]?.letterSpacing,
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
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto'
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
              borderWidth: styles.borderWidth || defaultStyles.Line.borderWidth,
              borderColor: styles.borderColor || defaultStyles.Line.borderColor,
              borderStyle: styles.borderStyle || defaultStyles.Line.borderStyle
            }}
            className="flex items-center justify-center"
          />
        );
      case 'Dropdown':
        return (
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
            <span style={{ color: styles.textColor || defaultStyles.Dropdown.textColor }}>
              {styles.dropdownText || 'Select option'}
            </span>
            <FiChevronDown style={{ color: styles.textColor || defaultStyles.Dropdown.textColor }} />
          </div>
        );
      case 'Badge':
        return (
          <div
            style={{
              ...commonStyles,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            className="inline-flex"
          >
            <span style={{ color: styles.textColor || defaultStyles.Badge.textColor }}>
              {styles.badgeText || 'New'}
            </span>
          </div>
        );
      case 'Avatar':
        return (
          <div
            style={{
              ...commonStyles,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            className="flex items-center justify-center"
          >
            <span style={{ color: styles.textColor || defaultStyles.Avatar.textColor }}>
              {styles.avatarText || 'JD'}
            </span>
          </div>
        );
      case 'Divider':
        return (
          <div
            style={{
              ...commonStyles,
              width: styles.width || defaultStyles.Divider.width,
              height: '0',
              borderTopWidth: styles.borderTopWidth || defaultStyles.Divider.borderTopWidth,
              borderWidth: styles.borderWidth || defaultStyles.Divider.borderWidth,
              borderColor: styles.borderColor || defaultStyles.Divider.borderColor,
              borderStyle: styles.borderStyle || defaultStyles.Divider.borderStyle
            }}
            className="flex items-center justify-center"
          />
        );
      case 'Text':
        return (
          <div
            style={{
              ...commonStyles,
              textAlign: styles.textAlign as any || 'left',
            }}
          >
            <span style={{ color: styles.textColor || defaultStyles.Text.textColor }}>
              {styles.textContent || 'Text content'}
            </span>
          </div>
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
    {
      name: 'Dropdown',
      icon: FiChevronDown,
    },
    {
      name: 'Badge',
      icon: FiTag,
    },
    {
      name: 'Avatar',
      icon: FiUser,
    },
    {
      name: 'Text',
      icon: FiAlignLeft,
    },
    {
      name: 'Divider',
      icon: FiMinus,
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
