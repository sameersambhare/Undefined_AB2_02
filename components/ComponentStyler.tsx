import React, { useState } from 'react';
import { FiSettings, FiX, FiEye, FiEyeOff, FiChevronDown, FiChevronUp, FiRefreshCw } from 'react-icons/fi';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import { Label } from './ui/label';
import { Card } from './ui/card';

interface StyleOption {
  label: string;
  type: 'select' | 'input' | 'color' | 'range' | 'color-with-transparent';
  options?: string[];
  value: string;
  min?: string;
  max?: string;
  step?: string;
  onChange: (value: string) => void;
  description?: string;
  isTransparent?: boolean;
  onTransparentChange?: (isTransparent: boolean) => void;
}

interface ComponentStylerProps {
  componentType: string;
  onStyleChange: (styles: any) => void;
  initialStyles?: any;
}

// Define a more comprehensive styles interface
interface StylesState {
  // Layout
  width: string;
  height: string;
  padding: string;
  margin: string;
  
  // Typography
  fontSize: string;
  fontWeight: string;
  textAlign: string;
  letterSpacing: string;
  
  // Colors
  backgroundColor: string;
  textColor: string;
  
  // Border
  borderColor: string;
  borderWidth: string;
  borderStyle: string;
  borderRadius: string;
  borderTopWidth?: string;
  
  // Component-specific
  variant: string;
  size: string;
  placeholder: string;
  buttonText: string;
  cardTitle: string;
  cardContent: string;
  dropdownText: string;
  badgeText: string;
  avatarText: string;
  textContent: string;
  
  // Effects
  opacity: string;
  shadow: string;
}

const ComponentStyler: React.FC<ComponentStylerProps> = ({ componentType, onStyleChange, initialStyles = {} }) => {
  const [styles, setStyles] = useState<StylesState>({
    // Layout
    width: initialStyles.width || '',
    height: initialStyles.height || '',
    padding: initialStyles.padding || '',
    margin: initialStyles.margin || '',
    
    // Typography
    fontSize: initialStyles.fontSize || '16px',
    fontWeight: initialStyles.fontWeight || 'normal',
    textAlign: initialStyles.textAlign || 'left',
    letterSpacing: initialStyles.letterSpacing || 'normal',
    
    // Colors
    backgroundColor: initialStyles.backgroundColor || '',
    textColor: initialStyles.textColor || '',
    
    // Border
    borderColor: initialStyles.borderColor || '',
    borderWidth: initialStyles.borderWidth || '1px',
    borderStyle: initialStyles.borderStyle || 'solid',
    borderRadius: initialStyles.borderRadius || '0.375rem',
    borderTopWidth: initialStyles.borderTopWidth || '1px',
    
    // Component-specific
    variant: initialStyles.variant || 'default',
    size: initialStyles.size || 'default',
    placeholder: initialStyles.placeholder || '',
    buttonText: initialStyles.buttonText || 'Button',
    cardTitle: initialStyles.cardTitle || 'Card Title',
    cardContent: initialStyles.cardContent || 'Card content goes here',
    dropdownText: initialStyles.dropdownText || 'Select option',
    badgeText: initialStyles.badgeText || 'New',
    avatarText: initialStyles.avatarText || 'JD',
    textContent: initialStyles.textContent || 'Text content',
    
    // Effects
    opacity: initialStyles.opacity || '100',
    shadow: initialStyles.shadow || 'none',
  });

  // Track expanded sections
  const [expandedSections, setExpandedSections] = useState<string[]>([
    'Component Specific'
  ]);

  // Track if popover is open
  const [isOpen, setIsOpen] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section) 
        ? prev.filter(s => s !== section) 
        : [...prev, section]
    );
  };

  const handleStyleChange = (key: string, value: string) => {
    const newStyles = { ...styles, [key]: value };
    setStyles(newStyles);
    onStyleChange(newStyles);
  };

  const resetToDefaults = () => {
    const defaultComponentStyles = {
      Button: {
        variant: "default",
        size: "default",
        backgroundColor: "#3b82f6",
        textColor: "#ffffff",
        borderColor: "transparent",
        borderWidth: "1px",
        borderStyle: "solid",
        borderRadius: "0.375rem",
        padding: "0.5rem 1rem",
        fontSize: "0.875rem",
        fontWeight: "500",
        width: "auto",
        height: "auto",
        shadow: "sm",
        buttonText: "Button",
        margin: "",
        textAlign: "center",
        letterSpacing: "normal",
        placeholder: "",
        opacity: "100",
        cardTitle: "",
        cardContent: "",
        dropdownText: "",
        badgeText: "",
        avatarText: "",
        textContent: "",
        borderTopWidth: "",
      },
      Input: {
        placeholder: "Input field",
        backgroundColor: "#ffffff",
        borderColor: "#d1d5db",
        borderWidth: "1px",
        borderStyle: "solid",
        borderRadius: "0.375rem",
        padding: "0.5rem 0.75rem",
        fontSize: "0.875rem",
        width: "100%",
        height: "auto",
        textColor: "#374151",
        variant: "default",
        size: "default",
        margin: "",
        fontWeight: "normal",
        textAlign: "left",
        letterSpacing: "normal",
        shadow: "none",
        opacity: "100",
        buttonText: "",
        cardTitle: "",
        cardContent: "",
        dropdownText: "",
        badgeText: "",
        avatarText: "",
        textContent: "",
        borderTopWidth: "",
      },
      Card: {
        backgroundColor: "#ffffff",
        borderColor: "#e5e7eb",
        borderWidth: "1px",
        borderStyle: "solid",
        borderRadius: "0.5rem",
        padding: "1rem",
        width: "100%",
        height: "auto",
        shadow: "sm",
        textColor: "#374151",
        cardTitle: "Card Title",
        cardContent: "Card Content",
        variant: "default",
        size: "default",
        margin: "",
        fontSize: "0.875rem",
        fontWeight: "normal",
        textAlign: "left",
        letterSpacing: "normal",
        opacity: "100",
        placeholder: "",
        buttonText: "",
        dropdownText: "",
        badgeText: "",
        avatarText: "",
        textContent: "",
        borderTopWidth: "",
      },
      Rectangle: {
        backgroundColor: "#f97316",
        borderColor: "#f97316",
        borderWidth: "2px",
        borderStyle: "solid",
        borderRadius: "0.375rem",
        width: "100px",
        height: "60px",
        shadow: "sm",
        opacity: "100",
        variant: "default",
        size: "default",
        margin: "",
        padding: "",
        fontSize: "0.875rem",
        fontWeight: "normal",
        textAlign: "left",
        letterSpacing: "normal",
        placeholder: "",
        buttonText: "",
        cardTitle: "",
        cardContent: "",
        dropdownText: "",
        badgeText: "",
        avatarText: "",
        textContent: "",
        borderTopWidth: "",
      },
      Circle: {
        backgroundColor: "#f97316",
        borderColor: "#f97316",
        borderWidth: "2px",
        borderStyle: "solid",
        borderRadius: "9999px",
        width: "80px",
        height: "80px",
        shadow: "sm",
        opacity: "100",
        variant: "default",
        size: "default",
        margin: "",
        padding: "",
        fontSize: "0.875rem",
        fontWeight: "normal",
        textAlign: "left",
        letterSpacing: "normal",
        placeholder: "",
        buttonText: "",
        cardTitle: "",
        cardContent: "",
        dropdownText: "",
        badgeText: "",
        avatarText: "",
        textContent: "",
        borderTopWidth: "",
      },
      Line: {
        backgroundColor: "transparent",
        borderColor: "#f97316",
        borderWidth: "0",
        borderTopWidth: "2px",
        borderStyle: "solid",
        width: "100px",
        height: "0",
        shadow: "none",
        opacity: "100",
        variant: "default",
        size: "default",
        margin: "",
        padding: "",
        fontSize: "0.875rem",
        fontWeight: "normal",
        textAlign: "left",
        letterSpacing: "normal",
        borderRadius: "0",
        placeholder: "",
        buttonText: "",
        cardTitle: "",
        cardContent: "",
        dropdownText: "",
        badgeText: "",
        avatarText: "",
        textContent: "",
      },
      Dropdown: {
        backgroundColor: "#ffffff",
        textColor: "#374151",
        borderColor: "#d1d5db",
        borderWidth: "1px",
        borderStyle: "solid",
        borderRadius: "0.375rem",
        padding: "0.5rem 0.75rem",
        fontSize: "0.875rem",
        width: "100%",
        height: "auto",
        shadow: "sm",
        dropdownText: "Select option",
        variant: "default",
        size: "default",
        margin: "",
        fontWeight: "normal",
        textAlign: "left",
        letterSpacing: "normal",
        opacity: "100",
        placeholder: "",
        buttonText: "",
        cardTitle: "",
        cardContent: "",
        badgeText: "",
        avatarText: "",
        textContent: "",
        borderTopWidth: "",
      },
      Badge: {
        backgroundColor: "#f97316",
        textColor: "#ffffff",
        borderColor: "transparent",
        borderWidth: "1px",
        borderStyle: "solid",
        borderRadius: "9999px",
        padding: "0.25rem 0.5rem",
        fontSize: "0.75rem",
        fontWeight: "500",
        width: "auto",
        height: "auto",
        shadow: "none",
        badgeText: "New",
        variant: "default",
        size: "default",
        margin: "",
        textAlign: "center",
        letterSpacing: "normal",
        opacity: "100",
        placeholder: "",
        buttonText: "",
        cardTitle: "",
        cardContent: "",
        dropdownText: "",
        avatarText: "",
        textContent: "",
        borderTopWidth: "",
      },
      Avatar: {
        backgroundColor: "#f97316",
        textColor: "#ffffff",
        borderColor: "transparent",
        borderWidth: "2px",
        borderStyle: "solid",
        borderRadius: "9999px",
        width: "40px",
        height: "40px",
        shadow: "none",
        opacity: "100",
        avatarText: "JD",
        variant: "default",
        size: "default",
        margin: "",
        padding: "",
        fontSize: "0.875rem",
        fontWeight: "500",
        textAlign: "center",
        letterSpacing: "normal",
        placeholder: "",
        buttonText: "",
        cardTitle: "",
        cardContent: "",
        dropdownText: "",
        badgeText: "",
        textContent: "",
        borderTopWidth: "",
      },
      Divider: {
        backgroundColor: "transparent",
        borderColor: "#e5e7eb",
        borderWidth: "0",
        borderTopWidth: "1px",
        borderStyle: "solid",
        width: "100%",
        height: "0",
        shadow: "none",
        opacity: "100",
        variant: "default",
        size: "default",
        margin: "",
        padding: "",
        fontSize: "0.875rem",
        fontWeight: "normal",
        textAlign: "left",
        letterSpacing: "normal",
        borderRadius: "0",
        placeholder: "",
        buttonText: "",
        cardTitle: "",
        cardContent: "",
        dropdownText: "",
        badgeText: "",
        avatarText: "",
        textContent: "",
      },
      Text: {
        backgroundColor: "transparent",
        textColor: "#374151",
        fontSize: "0.875rem",
        fontWeight: "400",
        width: "auto",
        height: "auto",
        textAlign: "left",
        letterSpacing: "normal",
        textContent: "Text content",
        variant: "default",
        size: "default",
        margin: "",
        padding: "",
        borderColor: "transparent",
        borderWidth: "0",
        borderStyle: "none",
        borderRadius: "0",
        shadow: "none",
        opacity: "100",
        placeholder: "",
        buttonText: "",
        cardTitle: "",
        cardContent: "",
        dropdownText: "",
        badgeText: "",
        avatarText: "",
        borderTopWidth: "",
      }
    };
    
    const defaultStyles = defaultComponentStyles[componentType as keyof typeof defaultComponentStyles] || {};
    setStyles(defaultStyles as StylesState);
    onStyleChange(defaultStyles);
  };

  const commonOptions: StyleOption[] = [
    {
      label: 'Width',
      type: 'input',
      value: styles.width,
      onChange: (value) => handleStyleChange('width', value),
      description: 'Set component width (px, %, rem, etc)'
    },
    {
      label: 'Height',
      type: 'input',
      value: styles.height,
      onChange: (value) => handleStyleChange('height', value),
      description: 'Set component height (px, %, rem, etc)'
    },
    {
      label: 'Padding',
      type: 'input',
      value: styles.padding,
      onChange: (value) => handleStyleChange('padding', value),
      description: 'Set internal spacing (px, rem)'
    },
    {
      label: 'Font Size',
      type: 'input',
      value: styles.fontSize,
      onChange: (value) => handleStyleChange('fontSize', value),
      description: 'Set text size (px, rem, em)'
    },
    {
      label: 'Font Weight',
      type: 'select',
      options: ['normal', 'medium', 'semibold', 'bold'],
      value: styles.fontWeight,
      onChange: (value) => handleStyleChange('fontWeight', value),
      description: 'Set text thickness'
    },
    {
      label: 'Text Align',
      type: 'select',
      options: ['left', 'center', 'right'],
      value: styles.textAlign,
      onChange: (value) => handleStyleChange('textAlign', value),
      description: 'Set text alignment'
    },
    {
      label: 'Background Color',
      type: 'color-with-transparent',
      value: styles.backgroundColor,
      isTransparent: styles.backgroundColor === 'transparent',
      onChange: (value) => handleStyleChange('backgroundColor', value),
      onTransparentChange: (isTransparent) => 
        handleStyleChange('backgroundColor', isTransparent ? 'transparent' : '#ffffff'),
      description: 'Set background color'
    },
    {
      label: 'Text Color',
      type: 'color',
      value: styles.textColor,
      onChange: (value) => handleStyleChange('textColor', value),
      description: 'Set text color'
    },
    {
      label: 'Border Color',
      type: 'color',
      value: styles.borderColor,
      onChange: (value) => handleStyleChange('borderColor', value),
      description: 'Set border color'
    },
    {
      label: 'Border Width',
      type: 'range',
      value: styles.borderWidth.replace('px', ''),
      min: '0',
      max: '10',
      step: '1',
      onChange: (value) => handleStyleChange('borderWidth', `${value}px`),
      description: 'Set border thickness'
    },
    {
      label: 'Border Style',
      type: 'select',
      options: ['none', 'solid', 'dashed', 'dotted', 'double'],
      value: styles.borderStyle,
      onChange: (value) => handleStyleChange('borderStyle', value),
      description: 'Set border style'
    },
    {
      label: 'Border Radius',
      type: 'range',
      value: styles.borderRadius.replace('rem', ''),
      min: '0',
      max: '2',
      step: '0.125',
      onChange: (value) => handleStyleChange('borderRadius', `${value}rem`),
      description: 'Set corner roundness'
    },
    {
      label: 'Opacity',
      type: 'range',
      value: styles.opacity,
      min: '0',
      max: '100',
      step: '5',
      onChange: (value) => handleStyleChange('opacity', value),
      description: 'Set transparency'
    },
    {
      label: 'Shadow',
      type: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl'],
      value: styles.shadow,
      onChange: (value) => handleStyleChange('shadow', value),
      description: 'Set drop shadow size'
    },
  ];

  const getComponentSpecificOptions = (): StyleOption[] => {
    switch (componentType) {
      case 'Button':
        return [
          {
            label: 'Variant',
            type: 'select',
            options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
            value: styles.variant,
            onChange: (value) => handleStyleChange('variant', value),
            description: 'Button appearance style'
          },
          {
            label: 'Size',
            type: 'select',
            options: ['default', 'sm', 'lg', 'icon'],
            value: styles.size,
            onChange: (value) => handleStyleChange('size', value),
            description: 'Button size preset'
          },
          {
            label: 'Button Text',
            type: 'input',
            value: styles.buttonText !== undefined ? styles.buttonText : 'Button',
            onChange: (value) => handleStyleChange('buttonText', value),
            description: 'Text displayed on button'
          },
        ];
      case 'Input':
        return [
          {
            label: 'Placeholder',
            type: 'input',
            value: styles.placeholder !== undefined ? styles.placeholder : 'Input field',
            onChange: (value) => handleStyleChange('placeholder', value),
            description: 'Text shown when empty'
          },
        ];
      case 'Card':
        return [
          {
            label: 'Card Title',
            type: 'input',
            value: styles.cardTitle !== undefined ? styles.cardTitle : 'Card Title',
            onChange: (value) => handleStyleChange('cardTitle', value),
            description: 'Card header text'
          },
          {
            label: 'Card Content',
            type: 'input',
            value: styles.cardContent !== undefined ? styles.cardContent : 'Card content goes here',
            onChange: (value) => handleStyleChange('cardContent', value),
            description: 'Card body text'
          },
        ];
      case 'Rectangle':
        return [
          {
            label: 'Width',
            type: 'input',
            value: styles.width || '100px',
            onChange: (value) => handleStyleChange('width', value),
            description: 'Rectangle width (px, %, rem)'
          },
          {
            label: 'Height',
            type: 'input',
            value: styles.height || '60px',
            onChange: (value) => handleStyleChange('height', value),
            description: 'Rectangle height (px, %, rem)'
          },
        ];
      case 'Circle':
        return [
          {
            label: 'Size',
            type: 'input',
            value: styles.width || '80px',
            onChange: (value) => {
              handleStyleChange('width', value);
              handleStyleChange('height', value);
            },
            description: 'Circle diameter (px, %, rem)'
          },
        ];
      case 'Line':
        return [
          {
            label: 'Length',
            type: 'input',
            value: styles.width || '100px',
            onChange: (value) => handleStyleChange('width', value),
            description: 'Line length (px, %, rem)'
          },
          {
            label: 'Thickness',
            type: 'range',
            value: (styles.borderWidth || '2').replace('px', ''),
            min: '1',
            max: '10',
            step: '1',
            onChange: (value) => handleStyleChange('borderWidth', `${value}px`),
            description: 'Line thickness (px)'
          },
        ];
      case 'Dropdown':
        return [
          {
            label: 'Dropdown Text',
            type: 'input',
            value: styles.dropdownText !== undefined ? styles.dropdownText : 'Select option',
            onChange: (value) => handleStyleChange('dropdownText', value),
            description: 'Text displayed in dropdown'
          },
          {
            label: 'Width',
            type: 'input',
            value: styles.width || '100%',
            onChange: (value) => handleStyleChange('width', value),
            description: 'Dropdown width (px, %, rem)'
          },
        ];
      case 'Badge':
        return [
          {
            label: 'Badge Text',
            type: 'input',
            value: styles.badgeText !== undefined ? styles.badgeText : 'New',
            onChange: (value) => handleStyleChange('badgeText', value),
            description: 'Text displayed in badge'
          },
          {
            label: 'Padding',
            type: 'input',
            value: styles.padding || '0.25rem 0.5rem',
            onChange: (value) => handleStyleChange('padding', value),
            description: 'Badge padding (px, rem)'
          },
        ];
      case 'Avatar':
        return [
          {
            label: 'Initials',
            type: 'input',
            value: styles.avatarText !== undefined ? styles.avatarText : 'JD',
            onChange: (value) => handleStyleChange('avatarText', value),
            description: 'Text displayed in avatar (usually initials)'
          },
          {
            label: 'Size',
            type: 'input',
            value: styles.width || '40px',
            onChange: (value) => {
              handleStyleChange('width', value);
              handleStyleChange('height', value);
            },
            description: 'Avatar size (px, rem)'
          },
        ];
      case 'Divider':
        return [
          {
            label: 'Width',
            type: 'input',
            value: styles.width || '100%',
            onChange: (value) => handleStyleChange('width', value),
            description: 'Divider width (px, %, rem)'
          },
          {
            label: 'Thickness',
            type: 'range',
            value: (styles.borderTopWidth || '1').replace('px', ''),
            min: '1',
            max: '10',
            step: '1',
            onChange: (value) => handleStyleChange('borderTopWidth', `${value}px`),
            description: 'Divider thickness (px)'
          },
        ];
      case 'Text':
        return [
          {
            label: 'Content',
            type: 'input',
            value: styles.textContent !== undefined ? styles.textContent : 'Text content',
            onChange: (value) => handleStyleChange('textContent', value),
            description: 'Text content to display'
          },
          {
            label: 'Font Size',
            type: 'input',
            value: styles.fontSize || '0.875rem',
            onChange: (value) => handleStyleChange('fontSize', value),
            description: 'Text size (px, rem, em)'
          },
          {
            label: 'Font Weight',
            type: 'select',
            options: ['normal', 'medium', 'semibold', 'bold'],
            value: styles.fontWeight || 'normal',
            onChange: (value) => handleStyleChange('fontWeight', value),
            description: 'Text thickness'
          },
          {
            label: 'Text Align',
            type: 'select',
            options: ['left', 'center', 'right'],
            value: styles.textAlign || 'left',
            onChange: (value) => handleStyleChange('textAlign', value),
            description: 'Text alignment'
          },
        ];
      default:
        return [];
    }
  };

  const styleCategories = [
    {
      title: 'Component Specific',
      options: getComponentSpecificOptions(),
    },
    {
      title: 'Layout',
      options: commonOptions.slice(0, 3),
    },
    {
      title: 'Typography',
      options: commonOptions.slice(3, 6),
    },
    {
      title: 'Colors',
      options: commonOptions.slice(6, 9),
    },
    {
      title: 'Border',
      options: commonOptions.slice(9, 12),
    },
    {
      title: 'Effects',
      options: commonOptions.slice(12),
    },
  ];

  return (
    <div className="relative">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="default"
            className="w-full flex items-center justify-center gap-2 bg-white dark:bg-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-700 shadow-sm py-4 text-base font-medium dark:text-zinc-100 dark:border-zinc-700"
            onClick={() => setIsOpen(true)}
          >
            <FiSettings className="w-4 h-4" />
            Style {componentType}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0 shadow-lg" align="center">
          <div className="overflow-hidden rounded-lg">
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 text-white p-3">
              <div className="flex justify-between items-center">
                <h4 className="text-sm font-medium">
                  {componentType} Properties
                </h4>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 text-white hover:bg-white/20"
                    onClick={resetToDefaults}
                    title="Reset to defaults"
                  >
                    <FiRefreshCw className="w-3.5 h-3.5" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-7 w-7 text-white hover:bg-white/20"
                    title="Close"
                    onClick={() => setIsOpen(false)}
                  >
                    <FiX className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="p-4 space-y-4 bg-white dark:bg-zinc-800 rounded-b-lg thin-scrollbar">
              {styleCategories.map((category, categoryIndex) => (
                category.options.length > 0 && (
                  <Card key={categoryIndex} className="overflow-hidden border border-gray-200 dark:border-zinc-700 shadow-sm">
                    <div 
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-zinc-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-zinc-600 transition-colors"
                      onClick={() => toggleSection(category.title)}
                    >
                      <h5 className="text-sm font-medium text-gray-900 dark:text-zinc-100">
                        {category.title}
                      </h5>
                      <div>
                        {expandedSections.includes(category.title) ? (
                          <FiChevronUp className="w-4 h-4 text-gray-500 dark:text-zinc-300" />
                        ) : (
                          <FiChevronDown className="w-4 h-4 text-gray-500 dark:text-zinc-300" />
                        )}
                      </div>
                    </div>
                    
                    {expandedSections.includes(category.title) && (
                      <div className="p-3 space-y-3 border-t border-gray-200 dark:border-zinc-700">
                        {category.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="space-y-1">
                            <Label className="flex items-center justify-between text-sm text-gray-700 dark:text-zinc-200">
                              {option.label}
                              {option.type === 'range' && (
                                <span className="text-xs text-gray-500 dark:text-zinc-400 tabular-nums font-mono bg-gray-100 dark:bg-zinc-700 px-1.5 py-0.5 rounded">
                                  {option.value}
                                  {option.label.includes('Opacity') ? '%' : ''}
                                </span>
                              )}
                            </Label>
                            
                            {option.description && (
                              <p className="text-xs text-gray-500 dark:text-zinc-400 mb-1">{option.description}</p>
                            )}
                            
                            {option.type === 'select' && (
                              <select
                                className="w-full p-2 text-sm border rounded-md bg-white dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors focus:ring-2 focus:ring-orange-500 focus:border-orange-500 focus:outline-none"
                                value={option.value}
                                onChange={(e) => option.onChange(e.target.value)}
                              >
                                {option.options?.map((opt) => (
                                  <option key={opt} value={opt}>
                                    {opt}
                                  </option>
                                ))}
                              </select>
                            )}
                            
                            {option.type === 'input' && (
                              <Input
                                value={option.value}
                                onChange={(e) => option.onChange(e.target.value)}
                                className="bg-white dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-mono"
                              />
                            )}
                            
                            {option.type === 'color' && (
                              <div className="flex gap-2">
                                <div 
                                  className="w-8 h-8 rounded border border-gray-300 dark:border-zinc-600 overflow-hidden relative"
                                  style={{ backgroundColor: option.value || 'transparent' }}
                                >
                                  <input 
                                    type="color" 
                                    value={option.value || '#000000'} 
                                    onChange={(e) => option.onChange(e.target.value)}
                                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                  />
                                </div>
                                <Input
                                  value={option.value}
                                  onChange={(e) => option.onChange(e.target.value)}
                                  placeholder="#000000"
                                  className="bg-white dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-mono"
                                />
                              </div>
                            )}
                            
                            {option.type === 'color-with-transparent' && (
                              <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="checkbox"
                                    id={`transparent-${optionIndex}`}
                                    checked={option.isTransparent}
                                    onChange={(e) => option.onTransparentChange && option.onTransparentChange(e.target.checked)}
                                    className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                                  />
                                  <label 
                                    htmlFor={`transparent-${optionIndex}`}
                                    className="text-xs text-gray-600 dark:text-zinc-400"
                                  >
                                    Transparent
                                  </label>
                                </div>
                                
                                {!option.isTransparent && (
                                  <div className="flex gap-2">
                                    <div 
                                      className="w-8 h-8 rounded border border-gray-300 dark:border-zinc-600 overflow-hidden relative"
                                      style={{ 
                                        backgroundColor: option.value || 'transparent',
                                        backgroundImage: option.value === 'transparent' ? 
                                          'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)' : 
                                          'none',
                                        backgroundSize: '10px 10px',
                                        backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0px'
                                      }}
                                    >
                                      <input 
                                        type="color" 
                                        value={option.value === 'transparent' ? '#ffffff' : (option.value || '#000000')} 
                                        onChange={(e) => option.onChange(e.target.value)}
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                        disabled={option.isTransparent}
                                      />
                                    </div>
                                    <Input
                                      value={option.value === 'transparent' ? '' : option.value}
                                      onChange={(e) => option.onChange(e.target.value)}
                                      placeholder="#000000"
                                      className="bg-white dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-mono"
                                      disabled={option.isTransparent}
                                    />
                                  </div>
                                )}
                              </div>
                            )}
                            
                            {option.type === 'range' && (
                              <div className="flex gap-2 items-center pt-1">
                                <input
                                  type="range"
                                  min={option.min}
                                  max={option.max}
                                  step={option.step}
                                  value={option.value}
                                  onChange={(e) => option.onChange(e.target.value)}
                                  className="w-full accent-orange-500"
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                )
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ComponentStyler; 