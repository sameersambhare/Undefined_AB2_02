import React from 'react';
import { FiSettings } from 'react-icons/fi';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Popover, PopoverTrigger, PopoverContent } from './ui/popover';
import { Label } from './ui/label';

interface StyleOption {
  label: string;
  type: 'select' | 'input' | 'color' | 'range';
  options?: string[];
  value: string;
  min?: string;
  max?: string;
  step?: string;
  onChange: (value: string) => void;
}

interface ComponentStylerProps {
  componentType: string;
  onStyleChange: (styles: any) => void;
  initialStyles?: any;
}

const ComponentStyler: React.FC<ComponentStylerProps> = ({ componentType, onStyleChange, initialStyles = {} }) => {
  const [styles, setStyles] = React.useState({
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
    
    // Effects
    opacity: initialStyles.opacity || '100',
    shadow: initialStyles.shadow || 'none',
  });

  const handleStyleChange = (key: string, value: string) => {
    const newStyles = { ...styles, [key]: value };
    setStyles(newStyles);
    onStyleChange(newStyles);
  };

  const commonOptions: StyleOption[] = [
    {
      label: 'Width',
      type: 'input',
      value: styles.width,
      onChange: (value) => handleStyleChange('width', value),
    },
    {
      label: 'Height',
      type: 'input',
      value: styles.height,
      onChange: (value) => handleStyleChange('height', value),
    },
    {
      label: 'Padding',
      type: 'input',
      value: styles.padding,
      onChange: (value) => handleStyleChange('padding', value),
    },
    {
      label: 'Font Size',
      type: 'input',
      value: styles.fontSize,
      onChange: (value) => handleStyleChange('fontSize', value),
    },
    {
      label: 'Font Weight',
      type: 'select',
      options: ['normal', 'medium', 'semibold', 'bold'],
      value: styles.fontWeight,
      onChange: (value) => handleStyleChange('fontWeight', value),
    },
    {
      label: 'Text Align',
      type: 'select',
      options: ['left', 'center', 'right'],
      value: styles.textAlign,
      onChange: (value) => handleStyleChange('textAlign', value),
    },
    {
      label: 'Background Color',
      type: 'color',
      value: styles.backgroundColor,
      onChange: (value) => handleStyleChange('backgroundColor', value),
    },
    {
      label: 'Text Color',
      type: 'color',
      value: styles.textColor,
      onChange: (value) => handleStyleChange('textColor', value),
    },
    {
      label: 'Border Color',
      type: 'color',
      value: styles.borderColor,
      onChange: (value) => handleStyleChange('borderColor', value),
    },
    {
      label: 'Border Width',
      type: 'range',
      value: styles.borderWidth.replace('px', ''),
      min: '0',
      max: '10',
      step: '1',
      onChange: (value) => handleStyleChange('borderWidth', `${value}px`),
    },
    {
      label: 'Border Style',
      type: 'select',
      options: ['none', 'solid', 'dashed', 'dotted', 'double'],
      value: styles.borderStyle,
      onChange: (value) => handleStyleChange('borderStyle', value),
    },
    {
      label: 'Border Radius',
      type: 'range',
      value: styles.borderRadius.replace('rem', ''),
      min: '0',
      max: '2',
      step: '0.125',
      onChange: (value) => handleStyleChange('borderRadius', `${value}rem`),
    },
    {
      label: 'Opacity',
      type: 'range',
      value: styles.opacity,
      min: '0',
      max: '100',
      step: '5',
      onChange: (value) => handleStyleChange('opacity', value),
    },
    {
      label: 'Shadow',
      type: 'select',
      options: ['none', 'sm', 'md', 'lg', 'xl'],
      value: styles.shadow,
      onChange: (value) => handleStyleChange('shadow', value),
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
          },
          {
            label: 'Size',
            type: 'select',
            options: ['default', 'sm', 'lg', 'icon'],
            value: styles.size,
            onChange: (value) => handleStyleChange('size', value),
          },
        ];
      case 'Input':
        return [
          {
            label: 'Placeholder',
            type: 'input',
            value: styles.placeholder,
            onChange: (value) => handleStyleChange('placeholder', value),
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
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <FiSettings className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 max-h-[80vh] overflow-y-auto">
        <div className="space-y-6">
          <h4 className="font-medium leading-none">{componentType} Styles</h4>
          {styleCategories.map((category, categoryIndex) => (
            category.options.length > 0 && (
              <div key={categoryIndex} className="space-y-4">
                <h5 className="text-sm font-medium text-gray-500">{category.title}</h5>
                <div className="space-y-3">
                  {category.options.map((option, index) => (
                    <div key={index} className="space-y-1">
                      <Label className="flex justify-between">
                        {option.label}
                        {option.type === 'range' && (
                          <span className="text-xs text-gray-500">
                            {option.value}
                            {option.label.includes('Opacity') ? '%' : ''}
                          </span>
                        )}
                      </Label>
                      {option.type === 'select' && (
                        <select
                          className="w-full p-2 border rounded-md bg-white"
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
                        />
                      )}
                      {option.type === 'color' && (
                        <div className="flex gap-2">
                          <Input
                            type="color"
                            value={option.value || '#000000'}
                            onChange={(e) => option.onChange(e.target.value)}
                            className="w-12 h-8 p-1"
                          />
                          <Input
                            value={option.value}
                            onChange={(e) => option.onChange(e.target.value)}
                            placeholder="#000000"
                          />
                        </div>
                      )}
                      {option.type === 'range' && (
                        <div className="flex gap-2 items-center">
                          <input
                            type="range"
                            min={option.min}
                            max={option.max}
                            step={option.step}
                            value={option.value}
                            onChange={(e) => option.onChange(e.target.value)}
                            className="w-full"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ComponentStyler; 