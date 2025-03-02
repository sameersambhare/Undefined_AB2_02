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
  onMobileComponentSelect?: (component: string, styles: any, library: UILibrary) => void;
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

const ComponentList: React.FC<ComponentListProps> = ({ onDragStart, onMobileComponentSelect }) => {
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

  const handleLibraryChange = (library: UILibrary) => {
    setSelectedLibrary(library);
    // Update the library for all components
    const updatedStyles = { ...componentStyles };
    
    // Update each component's library
    Object.keys(updatedStyles).forEach(key => {
      updatedStyles[key] = { ...updatedStyles[key], library };
    });
    
    setComponentStyles(updatedStyles);
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
              <div style={{ display: 'inline-block', padding: '4px 0' }}>
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
                    overflow: 'hidden'
                  }}
                >
                  {styles.buttonText || 'BUTTON'}
                </button>
              </div>
            );
          case 'antd':
            return (
              <div style={{ display: 'inline-block', padding: '4px 0' }}>
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
                    textShadow: '0 -1px 0 rgba(0, 0, 0, 0.12)'
                  }}
                >
                  {styles.buttonText || 'Button'}
                </button>
              </div>
            );
          case 'shadcn':
          default:
            return (
              <ShadcnButton
                size={styles.size || defaultStyles.Button.size}
                variant={styles.variant || defaultStyles.Button.variant}
                style={{
                  backgroundColor: '#f97316', // orange-500 (default shadcn primary)
                  color: '#ffffff',
                  fontWeight: 500,
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem',
                  lineHeight: '1.25rem',
                  height: '2.5rem',
                  padding: '0 1rem',
                  border: 'none',
                  boxShadow: 'none'
                }}
              >
                {styles.buttonText || 'Button'}
              </ShadcnButton>
            );
        }
      case 'Input':
        switch (library) {
          case 'mui':
            return (
              <div style={{ width: '100%', position: 'relative' }}>
                <div style={{ 
                  position: 'absolute', 
                  top: '-8px', 
                  left: '10px', 
                  backgroundColor: '#fff',
                  padding: '0 4px',
                  fontSize: '12px',
                  color: '#2196f3',
                  zIndex: 1,
                  fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                  fontWeight: 500
                }}>
                  {styles.placeholder || 'Label'}
                </div>
                <input 
                  style={{
                    padding: '16.5px 14px',
                    borderRadius: '4px',
                    border: '1px solid rgba(0, 0, 0, 0.23)',
                    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                    fontSize: '16px',
                    lineHeight: '1.4375em',
                    width: '100%',
                    outline: 'none',
                    transition: 'border-color 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                    boxShadow: '0 2px 2px rgba(0,0,0,0.05)',
                    backgroundColor: '#f5f5f5'
                  }}
                  placeholder=""
                />
              </div>
            );
          case 'antd':
            return (
              <div style={{ width: '100%' }}>
                <input 
                  style={{
                    padding: '4px 11px',
                    height: '32px',
                    borderRadius: '2px',
                    border: '1px solid #d9d9d9',
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
                    fontSize: '14px',
                    lineHeight: '1.5715',
                    width: '100%',
                    outline: 'none',
                    transition: 'all 0.3s',
                    backgroundColor: '#ffffff',
                    boxShadow: 'none'
                  }}
                  placeholder={styles.placeholder || 'Input field'}
                />
              </div>
            );
          case 'shadcn':
          default:
            return (
              <ShadcnInput
                placeholder={styles.placeholder || defaultStyles.Input.placeholder}
                style={{
                  height: '2.5rem',
                  padding: '0 0.75rem',
                  fontSize: '0.875rem',
                  lineHeight: '1.25rem',
                  borderRadius: '0.375rem',
                  border: '1px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                  width: '100%',
                  '&:focus': {
                    outline: 'none',
                    ring: '2px',
                    ringColor: 'rgba(249, 115, 22, 0.5)',
                    borderColor: '#f97316'
                  }
                }}
              />
            );
        }
      case 'Card':
        switch (library) {
          case 'mui':
            return (
              <div style={{ 
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: '0px 3px 6px -1px rgba(0,0,0,0.2), 0px 6px 10px 0px rgba(0,0,0,0.14), 0px 1px 18px 0px rgba(0,0,0,0.12)',
                overflow: 'hidden',
                width: '100%',
                fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
                transition: 'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
                border: 'none'
              }}>
                <div style={{ 
                  padding: '16px 24px', 
                  borderBottom: '1px solid rgba(0,0,0,0.12)',
                  backgroundColor: '#2196f3',
                  color: 'white'
                }}>
                  <div style={{ fontWeight: 500, fontSize: '1.25rem', lineHeight: 1.6, letterSpacing: '0.0075em' }}>
                    Material UI Card
                  </div>
                </div>
                <div style={{ padding: '24px' }}>
                  <div style={{ fontSize: '0.875rem', lineHeight: 1.43, letterSpacing: '0.01071em', color: 'rgba(0,0,0,0.6)' }}>
                    {styles.cardContent || 'Material UI card with distinctive styling and elevation shadow.'}
                  </div>
                </div>
                <div style={{ 
                  padding: '8px 16px', 
                  borderTop: '1px solid rgba(0,0,0,0.12)',
                  backgroundColor: '#f5f5f5',
                  display: 'flex',
                  justifyContent: 'flex-end'
                }}>
                  <div style={{ 
                    fontSize: '0.8125rem',
                    textTransform: 'uppercase',
                    fontWeight: 500,
                    color: '#2196f3',
                    cursor: 'pointer'
                  }}>
                    Action
                  </div>
                </div>
              </div>
            );
          case 'antd':
            return (
              <div style={{ 
                backgroundColor: '#fff',
                borderRadius: '2px',
                border: '1px solid #f0f0f0',
                width: '100%',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
                boxSizing: 'border-box',
                fontSize: '14px',
                lineHeight: '1.5715',
                boxShadow: '0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12), 0 5px 12px 4px rgba(0, 0, 0, 0.09)'
              }}>
                <div style={{ 
                  padding: '16px 24px', 
                  borderBottom: '1px solid #f0f0f0',
                  backgroundColor: '#fafafa',
                  fontWeight: 500,
                  fontSize: '16px',
                  color: 'rgba(0, 0, 0, 0.85)',
                  borderRadius: '2px 2px 0 0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span>Ant Design Card</span>
                  <span style={{ 
                    fontSize: '12px',
                    color: '#1890ff',
                    cursor: 'pointer'
                  }}>More</span>
                </div>
                <div style={{ padding: '24px' }}>
                  <div style={{ fontSize: '14px', color: 'rgba(0, 0, 0, 0.65)' }}>
                    {styles.cardContent || 'Ant Design card with clean borders and subtle styling.'}
                  </div>
                </div>
                <div style={{ 
                  padding: '12px 24px', 
                  borderTop: '1px solid #f0f0f0',
                  backgroundColor: '#fafafa',
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '8px'
                }}>
                  <button style={{ 
                    padding: '4px 15px',
                    fontSize: '14px',
                    borderRadius: '2px',
                    border: '1px solid #d9d9d9',
                    backgroundColor: 'white',
                    cursor: 'pointer'
                  }}>
                    Cancel
                  </button>
                  <button style={{ 
                    padding: '4px 15px',
                    fontSize: '14px',
                    borderRadius: '2px',
                    border: 'none',
                    backgroundColor: '#1890ff',
                    color: 'white',
                    cursor: 'pointer'
                  }}>
                    OK
                  </button>
                </div>
              </div>
            );
          case 'shadcn':
          default:
            return (
              <ShadcnCard
                className="flex flex-col p-0 overflow-hidden w-full"
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '0.5rem',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
                  overflow: 'hidden'
                }}
              >
                <div className="p-4 border-b border-gray-200 dark:border-zinc-800">
                  <span className="font-medium text-sm">Shadcn Card</span>
                </div>
                <div className="p-4">
                  <span style={{ fontSize: '0.875rem', color: '#374151' }}>
                    {styles.cardContent || 'Shadcn card with minimal styling and rounded corners.'}
                  </span>
                </div>
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

  // Add state for mobile accordion
  const [openCategory, setOpenCategory] = useState<string | null>('UI Components');
  // Add state for selected library
  const [selectedLibrary, setSelectedLibrary] = useState<UILibrary>('shadcn');

  // Toggle category function
  const toggleCategory = (category: string) => {
    setOpenCategory(openCategory === category ? null : category);
  };

  // Add function to handle mobile tap
  const handleMobileTap = (component: string, styles: any, library: UILibrary) => {
    if (onMobileComponentSelect) {
      onMobileComponentSelect(component, styles, library);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 shadow-sm h-full">
      <div className="p-4 border-b border-gray-200 dark:border-zinc-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-zinc-100">Components</h2>
        <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1">Drag and drop to add to your design</p>
        <p className="text-xs text-orange-500 mt-1 lg:hidden">On mobile: Tap a component, then tap on the canvas to place it</p>
      </div>

      {/* UI Library Selector */}
      <div className="p-4 border-b border-gray-200 dark:border-zinc-800">
        <h3 className="text-sm font-medium text-gray-900 dark:text-zinc-100 mb-2">UI Library</h3>
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-3 py-1 text-xs rounded ${selectedLibrary === 'shadcn' 
              ? 'bg-orange-500 text-white' 
              : 'bg-gray-200 dark:bg-zinc-700 dark:text-zinc-200'}`}
            onClick={() => handleLibraryChange('shadcn')}
          >
            Shadcn UI
          </button>
          <button
            className={`px-3 py-1 text-xs rounded ${selectedLibrary === 'mui' 
              ? 'bg-orange-500 text-white' 
              : 'bg-gray-200 dark:bg-zinc-700 dark:text-zinc-200'}`}
            onClick={() => handleLibraryChange('mui')}
          >
            Material UI
          </button>
          <button
            className={`px-3 py-1 text-xs rounded ${selectedLibrary === 'antd' 
              ? 'bg-orange-500 text-white' 
              : 'bg-gray-200 dark:bg-zinc-700 dark:text-zinc-200'}`}
            onClick={() => handleLibraryChange('antd')}
          >
            Ant Design
          </button>
        </div>
      </div>

      {/* Mobile accordion categories */}
      <div className="lg:hidden">
        {/* UI Components Category */}
        <div className="border-b border-gray-200 dark:border-zinc-800">
          <button 
            className="flex items-center justify-between w-full p-4 text-left"
            onClick={() => toggleCategory('UI Components')}
          >
            <span className="font-medium">UI Components</span>
            <FiChevronDown className={`transition-transform ${openCategory === 'UI Components' ? 'rotate-180' : ''}`} />
          </button>
          
          {openCategory === 'UI Components' && (
            <div className="p-4 pt-0 grid grid-cols-2 gap-3">
              {/* Button Component */}
              <div
                draggable
                onDragStart={(e) => onDragStart(e, 'Button', componentStyles.Button, componentStyles.Button.library as UILibrary)}
                onClick={() => handleMobileTap('Button', componentStyles.Button, componentStyles.Button.library as UILibrary)}
                className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-zinc-800 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
              >
                <FiSquare className="text-orange-500 mb-2" />
                <span className="text-xs">Button</span>
              </div>
              
              {/* Input Component */}
              <div
                draggable
                onDragStart={(e) => onDragStart(e, 'Input', componentStyles.Input, componentStyles.Input.library as UILibrary)}
                onClick={() => handleMobileTap('Input', componentStyles.Input, componentStyles.Input.library as UILibrary)}
                className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-zinc-800 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
              >
                <FiType className="text-orange-500 mb-2" />
                <span className="text-xs">Input</span>
              </div>
              
              {/* Card Component */}
              <div
                draggable
                onDragStart={(e) => onDragStart(e, 'Card', componentStyles.Card, componentStyles.Card.library as UILibrary)}
                onClick={() => handleMobileTap('Card', componentStyles.Card, componentStyles.Card.library as UILibrary)}
                className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-zinc-800 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
              >
                <FiBox className="text-orange-500 mb-2" />
                <span className="text-xs">Card</span>
              </div>
              
              {/* Dropdown Component */}
              <div
                draggable
                onDragStart={(e) => onDragStart(e, 'Dropdown', componentStyles.Dropdown, componentStyles.Dropdown.library as UILibrary)}
                onClick={() => handleMobileTap('Dropdown', componentStyles.Dropdown, componentStyles.Dropdown.library as UILibrary)}
                className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-zinc-800 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
              >
                <FiChevronDown className="text-orange-500 mb-2" />
                <span className="text-xs">Dropdown</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Shapes Category */}
        <div className="border-b border-gray-200 dark:border-zinc-800">
          <button 
            className="flex items-center justify-between w-full p-4 text-left"
            onClick={() => toggleCategory('Shapes')}
          >
            <span className="font-medium">Shapes</span>
            <FiChevronDown className={`transition-transform ${openCategory === 'Shapes' ? 'rotate-180' : ''}`} />
          </button>
          
          {openCategory === 'Shapes' && (
            <div className="p-4 pt-0 grid grid-cols-2 gap-3">
              {/* Rectangle Component */}
              <div
                draggable
                onDragStart={(e) => onDragStart(e, 'Rectangle', componentStyles.Rectangle, 'shadcn')}
                onClick={() => handleMobileTap('Rectangle', componentStyles.Rectangle, 'shadcn')}
                className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-zinc-800 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
              >
                <FiSquare className="text-orange-500 mb-2" />
                <span className="text-xs">Rectangle</span>
              </div>
              
              {/* Circle Component */}
              <div
                draggable
                onDragStart={(e) => onDragStart(e, 'Circle', componentStyles.Circle, 'shadcn')}
                onClick={() => handleMobileTap('Circle', componentStyles.Circle, 'shadcn')}
                className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-zinc-800 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
              >
                <FiCircle className="text-orange-500 mb-2" />
                <span className="text-xs">Circle</span>
              </div>
              
              {/* Line Component */}
              <div
                draggable
                onDragStart={(e) => onDragStart(e, 'Line', componentStyles.Line, 'shadcn')}
                onClick={() => handleMobileTap('Line', componentStyles.Line, 'shadcn')}
                className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-zinc-800 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
              >
                <FiMinus className="text-orange-500 mb-2" />
                <span className="text-xs">Line</span>
              </div>
            </div>
          )}
        </div>
        
        {/* Other Elements Category */}
        <div>
          <button 
            className="flex items-center justify-between w-full p-4 text-left"
            onClick={() => toggleCategory('Other Elements')}
          >
            <span className="font-medium">Other Elements</span>
            <FiChevronDown className={`transition-transform ${openCategory === 'Other Elements' ? 'rotate-180' : ''}`} />
          </button>
          
          {openCategory === 'Other Elements' && (
            <div className="p-4 pt-0 grid grid-cols-2 gap-3">
              {/* Badge Component */}
              <div
                draggable
                onDragStart={(e) => onDragStart(e, 'Badge', componentStyles.Badge, 'shadcn')}
                onClick={() => handleMobileTap('Badge', componentStyles.Badge, 'shadcn')}
                className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-zinc-800 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
              >
                <FiTag className="text-orange-500 mb-2" />
                <span className="text-xs">Badge</span>
              </div>
              
              {/* Avatar Component */}
              <div
                draggable
                onDragStart={(e) => onDragStart(e, 'Avatar', componentStyles.Avatar, 'shadcn')}
                onClick={() => handleMobileTap('Avatar', componentStyles.Avatar, 'shadcn')}
                className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-zinc-800 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
              >
                <FiUser className="text-orange-500 mb-2" />
                <span className="text-xs">Avatar</span>
              </div>
              
              {/* Divider Component */}
              <div
                draggable
                onDragStart={(e) => onDragStart(e, 'Divider', componentStyles.Divider, 'shadcn')}
                onClick={() => handleMobileTap('Divider', componentStyles.Divider, 'shadcn')}
                className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-zinc-800 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
              >
                <FiMinus className="text-orange-500 mb-2" />
                <span className="text-xs">Divider</span>
              </div>
              
              {/* Text Component */}
              <div
                draggable
                onDragStart={(e) => onDragStart(e, 'Text', componentStyles.Text, 'shadcn')}
                onClick={() => handleMobileTap('Text', componentStyles.Text, 'shadcn')}
                className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-zinc-800 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
              >
                <FiAlignLeft className="text-orange-500 mb-2" />
                <span className="text-xs">Text</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop view - always expanded */}
      <div className="hidden lg:block p-4">
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-900 dark:text-zinc-100 mb-3">UI Components</h3>
          <div className="grid grid-cols-2 gap-3">
            {/* Button Component */}
            <div
              draggable
              onDragStart={(e) => onDragStart(e, 'Button', componentStyles.Button, componentStyles.Button.library as UILibrary)}
              className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-zinc-800 rounded-md cursor-move hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
            >
              <FiSquare className="text-orange-500 mb-2" />
              <span className="text-xs">Button</span>
            </div>
            
            {/* Input Component */}
            <div
              draggable
              onDragStart={(e) => onDragStart(e, 'Input', componentStyles.Input, componentStyles.Input.library as UILibrary)}
              className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-zinc-800 rounded-md cursor-move hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
            >
              <FiType className="text-orange-500 mb-2" />
              <span className="text-xs">Input</span>
            </div>
            
            {/* Card Component */}
            <div
              draggable
              onDragStart={(e) => onDragStart(e, 'Card', componentStyles.Card, componentStyles.Card.library as UILibrary)}
              className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-zinc-800 rounded-md cursor-move hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
            >
              <FiBox className="text-orange-500 mb-2" />
              <span className="text-xs">Card</span>
            </div>
            
            {/* Dropdown Component */}
            <div
              draggable
              onDragStart={(e) => onDragStart(e, 'Dropdown', componentStyles.Dropdown, componentStyles.Dropdown.library as UILibrary)}
              className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-zinc-800 rounded-md cursor-move hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
            >
              <FiChevronDown className="text-orange-500 mb-2" />
              <span className="text-xs">Dropdown</span>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-900 dark:text-zinc-100 mb-3">Shapes</h3>
          <div className="grid grid-cols-2 gap-3">
            {/* Rectangle Component */}
            <div
              draggable
              onDragStart={(e) => onDragStart(e, 'Rectangle', componentStyles.Rectangle, 'shadcn')}
              className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-zinc-800 rounded-md cursor-move hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
            >
              <FiSquare className="text-orange-500 mb-2" />
              <span className="text-xs">Rectangle</span>
            </div>
            
            {/* Circle Component */}
            <div
              draggable
              onDragStart={(e) => onDragStart(e, 'Circle', componentStyles.Circle, 'shadcn')}
              className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-zinc-800 rounded-md cursor-move hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
            >
              <FiCircle className="text-orange-500 mb-2" />
              <span className="text-xs">Circle</span>
            </div>
            
            {/* Line Component */}
            <div
              draggable
              onDragStart={(e) => onDragStart(e, 'Line', componentStyles.Line, 'shadcn')}
              className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-zinc-800 rounded-md cursor-move hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
            >
              <FiMinus className="text-orange-500 mb-2" />
              <span className="text-xs">Line</span>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-900 dark:text-zinc-100 mb-3">Other Elements</h3>
          <div className="grid grid-cols-2 gap-3">
            {/* Badge Component */}
            <div
              draggable
              onDragStart={(e) => onDragStart(e, 'Badge', componentStyles.Badge, 'shadcn')}
              className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-zinc-800 rounded-md cursor-move hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
            >
              <FiTag className="text-orange-500 mb-2" />
              <span className="text-xs">Badge</span>
            </div>
            
            {/* Avatar Component */}
            <div
              draggable
              onDragStart={(e) => onDragStart(e, 'Avatar', componentStyles.Avatar, 'shadcn')}
              className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-zinc-800 rounded-md cursor-move hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
            >
              <FiUser className="text-orange-500 mb-2" />
              <span className="text-xs">Avatar</span>
            </div>
            
            {/* Divider Component */}
            <div
              draggable
              onDragStart={(e) => onDragStart(e, 'Divider', componentStyles.Divider, 'shadcn')}
              className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-zinc-800 rounded-md cursor-move hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
            >
              <FiMinus className="text-orange-500 mb-2" />
              <span className="text-xs">Divider</span>
            </div>
            
            {/* Text Component */}
            <div
              draggable
              onDragStart={(e) => onDragStart(e, 'Text', componentStyles.Text, 'shadcn')}
              className="flex flex-col items-center justify-center p-3 bg-gray-50 dark:bg-zinc-800 rounded-md cursor-move hover:bg-gray-100 dark:hover:bg-zinc-700 transition-colors"
            >
              <FiAlignLeft className="text-orange-500 mb-2" />
              <span className="text-xs">Text</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Component Styler */}
      <div className="p-4">
        <ComponentStyler
          componentType={components[0].name}
          onStyleChange={(styles) => handleStyleChange(components[0].name, styles)}
          initialStyles={componentStyles[components[0].name]}
        />
        
        {/* Component Preview */}
        <div className="mt-6 border-t border-gray-200 dark:border-zinc-800 pt-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-zinc-100 mb-3">Preview</h3>
          <div className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-zinc-800 rounded-md">
            <div className="mb-4 text-center">
              <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100">
                {selectedLibrary === 'shadcn' ? 'Shadcn UI' : 
                 selectedLibrary === 'mui' ? 'Material UI' : 
                 'Ant Design'} Components
              </span>
            </div>
            
            <div className="w-full mb-4">
              <div className="text-xs text-gray-500 dark:text-zinc-400 mb-1">Button:</div>
              <div className="flex items-center justify-center w-full p-2 border border-gray-200 dark:border-zinc-700 rounded">
                {renderPreview('Button')}
              </div>
            </div>
            
            <div className="w-full mb-4">
              <div className="text-xs text-gray-500 dark:text-zinc-400 mb-1">Input:</div>
              <div className="flex items-center justify-center w-full p-2 border border-gray-200 dark:border-zinc-700 rounded">
                {renderPreview('Input')}
              </div>
            </div>
            
            <div className="w-full">
              <div className="text-xs text-gray-500 dark:text-zinc-400 mb-1">Card:</div>
              <div className="flex items-center justify-center w-full p-2 border border-gray-200 dark:border-zinc-700 rounded">
                {renderPreview('Card')}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComponentList;
