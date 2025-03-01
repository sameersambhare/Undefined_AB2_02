import React, { useState } from 'react';
import { FiSettings, FiX, FiEye, FiEyeOff, FiChevronDown, FiChevronUp, FiRefreshCw } from 'react-icons/fi';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import { Label } from './ui/label';
import { Card } from './ui/card';

interface StyleOption {
  label: string;
  type: 'select' | 'input' | 'color' | 'range';
  options?: string[];
  value: string;
  min?: string;
  max?: string;
  step?: string;
  onChange: (value: string) => void;
  description?: string;
}

interface ComponentStylerProps {
  componentType: string;
  onStyleChange: (styles: any) => void;
  initialStyles?: any;
}

const ComponentStyler: React.FC<ComponentStylerProps> = ({ componentType, onStyleChange, initialStyles = {} }) => {
  const [styles, setStyles] = useState({
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
    
    // Component-specific
    variant: initialStyles.variant || 'default',
    size: initialStyles.size || 'default',
    placeholder: initialStyles.placeholder || '',
    buttonText: initialStyles.buttonText || 'Button',
    cardTitle: initialStyles.cardTitle || 'Card Title',
    cardContent: initialStyles.cardContent || 'Card content goes here',
    
    // Effects
    opacity: initialStyles.opacity || '100',
    shadow: initialStyles.shadow || 'none',
  });

  // Track expanded sections
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'Component Specific': true,
    'Layout': false,
    'Typography': false,
    'Colors': false,
    'Border': false,
    'Effects': false
  });

  // Track if popover is open
  const [isOpen, setIsOpen] = useState(false);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
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
      }
    };
    
    const defaultStyles = defaultComponentStyles[componentType as keyof typeof defaultComponentStyles] || {};
    setStyles(defaultStyles);
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
      type: 'color',
      value: styles.backgroundColor,
      onChange: (value) => handleStyleChange('backgroundColor', value),
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
            size="sm"
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 shadow-sm"
            onClick={() => setIsOpen(true)}
          >
            <FiSettings className="w-4 h-4" />
            <span>Edit Styles</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-96 max-h-[80vh] overflow-y-auto p-0 shadow-xl border border-gray-200 rounded-lg z-50 thin-scrollbar"
          side="top"
          align="center"
          sideOffset={5}
        >
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-3 rounded-t-lg">
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-base flex items-center gap-2">
                <FiSettings className="w-4 h-4" />
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
          
          <div className="p-4 space-y-4 bg-white rounded-b-lg thin-scrollbar">
            {styleCategories.map((category, categoryIndex) => (
              category.options.length > 0 && (
                <Card key={categoryIndex} className="overflow-hidden border border-gray-200 shadow-sm">
                  <div 
                    className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => toggleSection(category.title)}
                  >
                    <h5 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      {category.title}
                    </h5>
                    <div>
                      {expandedSections[category.title] ? (
                        <FiChevronUp className="w-4 h-4 text-gray-500" />
                      ) : (
                        <FiChevronDown className="w-4 h-4 text-gray-500" />
                      )}
                    </div>
                  </div>
                  
                  {expandedSections[category.title] && (
                    <div className="p-3 space-y-4 border-t border-gray-200 thin-scrollbar">
                      {category.options.map((option, index) => (
                        <div key={index} className="space-y-1.5">
                          <Label className="flex justify-between text-sm text-gray-700">
                            {option.label}
                            {option.type === 'range' && (
                              <span className="text-xs text-gray-500 tabular-nums font-mono bg-gray-100 px-1.5 py-0.5 rounded">
                                {option.value}
                                {option.label.includes('Opacity') ? '%' : ''}
                              </span>
                            )}
                          </Label>
                          
                          {option.description && (
                            <p className="text-xs text-gray-500 mb-1">{option.description}</p>
                          )}
                          
                          {option.type === 'select' && (
                            <select
                              className="w-full p-2 text-sm border rounded-md bg-white hover:bg-gray-50 transition-colors focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none"
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
                              placeholder={`Enter ${option.label.toLowerCase()}`}
                              className="bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          )}
                          
                          {option.type === 'color' && (
                            <div className="flex gap-2">
                              <div className="relative">
                                <Input
                                  type="color"
                                  value={option.value || '#000000'}
                                  onChange={(e) => option.onChange(e.target.value)}
                                  className="w-12 h-9 p-1 cursor-pointer"
                                />
                                <div 
                                  className="absolute inset-0 pointer-events-none border border-gray-300 rounded-md"
                                  style={{ backgroundColor: option.value || 'transparent' }}
                                ></div>
                              </div>
                              <Input
                                value={option.value}
                                onChange={(e) => option.onChange(e.target.value)}
                                placeholder="#000000"
                                className="bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono"
                              />
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
                                className="w-full accent-blue-600"
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
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default ComponentStyler; 