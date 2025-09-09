// Figma Helper Utilities for Cursor Integration

/**
 * Convert Figma CSS properties to Tailwind classes
 * @param {Object} figmaStyles - CSS properties from Figma Dev Mode
 * @returns {Object} - Tailwind classes and custom styles
 */
export function convertFigmaToTailwind(figmaStyles) {
  const tailwindClasses = [];
  const customStyles = {};

  // Convert common properties
  if (figmaStyles.width) {
    if (figmaStyles.width.includes('px')) {
      const width = parseInt(figmaStyles.width);
      if (width <= 640) tailwindClasses.push(`w-${width}`);
      else customStyles.width = figmaStyles.width;
    }
  }

  if (figmaStyles.height) {
    if (figmaStyles.height.includes('px')) {
      const height = parseInt(figmaStyles.height);
      if (height <= 640) tailwindClasses.push(`h-${height}`);
      else customStyles.height = figmaStyles.height;
    }
  }

  if (figmaStyles.backgroundColor) {
    const color = figmaStyles.backgroundColor;
    if (color.includes('rgb')) {
      // Convert RGB to hex for Tailwind
      const rgb = color.match(/\d+/g);
      if (rgb) {
        const hex = rgbToHex(rgb[0], rgb[1], rgb[2]);
        customStyles.backgroundColor = `#${hex}`;
      }
    }
  }

  if (figmaStyles.borderRadius) {
    const radius = parseInt(figmaStyles.borderRadius);
    if (radius <= 32) tailwindClasses.push(`rounded-${radius}`);
    else customStyles.borderRadius = figmaStyles.borderRadius;
  }

  if (figmaStyles.padding) {
    const padding = parseInt(figmaStyles.padding);
    if (padding <= 64) tailwindClasses.push(`p-${padding}`);
    else customStyles.padding = figmaStyles.padding;
  }

  if (figmaStyles.margin) {
    const margin = parseInt(figmaStyles.margin);
    if (margin <= 64) tailwindClasses.push(`m-${margin}`);
    else customStyles.margin = figmaStyles.margin;
  }

  if (figmaStyles.fontSize) {
    const fontSize = parseInt(figmaStyles.fontSize);
    if (fontSize <= 72) {
      const sizeMap = {
        12: 'text-xs',
        14: 'text-sm',
        16: 'text-base',
        18: 'text-lg',
        20: 'text-xl',
        24: 'text-2xl',
        30: 'text-3xl',
        36: 'text-4xl',
        48: 'text-5xl',
        60: 'text-6xl',
        72: 'text-7xl'
      };
      tailwindClasses.push(sizeMap[fontSize] || `text-[${fontSize}px]`);
    }
  }

  if (figmaStyles.fontWeight) {
    const weightMap = {
      '100': 'font-thin',
      '200': 'font-extralight',
      '300': 'font-light',
      '400': 'font-normal',
      '500': 'font-medium',
      '600': 'font-semibold',
      '700': 'font-bold',
      '800': 'font-extrabold',
      '900': 'font-black'
    };
    tailwindClasses.push(weightMap[figmaStyles.fontWeight] || 'font-normal');
  }

  if (figmaStyles.textAlign) {
    const alignMap = {
      'left': 'text-left',
      'center': 'text-center',
      'right': 'text-right',
      'justify': 'text-justify'
    };
    tailwindClasses.push(alignMap[figmaStyles.textAlign] || 'text-left');
  }

  if (figmaStyles.display === 'flex') {
    tailwindClasses.push('flex');
    if (figmaStyles.flexDirection === 'column') {
      tailwindClasses.push('flex-col');
    }
    if (figmaStyles.justifyContent) {
      const justifyMap = {
        'flex-start': 'justify-start',
        'flex-end': 'justify-end',
        'center': 'justify-center',
        'space-between': 'justify-between',
        'space-around': 'justify-around',
        'space-evenly': 'justify-evenly'
      };
      tailwindClasses.push(justifyMap[figmaStyles.justifyContent] || 'justify-start');
    }
    if (figmaStyles.alignItems) {
      const alignMap = {
        'flex-start': 'items-start',
        'flex-end': 'items-end',
        'center': 'items-center',
        'baseline': 'items-baseline',
        'stretch': 'items-stretch'
      };
      tailwindClasses.push(alignMap[figmaStyles.alignItems] || 'items-start');
    }
  }

  return {
    classes: tailwindClasses.join(' '),
    styles: customStyles
  };
}

/**
 * Generate React component from Figma design data
 * @param {Object} designData - Figma design information
 * @returns {String} - React component code
 */
export function generateComponentFromFigma(designData) {
  const { name, type, styles, children } = designData;
  
  const componentName = name.charAt(0).toUpperCase() + name.slice(1).replace(/\s+/g, '');
  const { classes, styles: customStyles } = convertFigmaToTailwind(styles);
  
  let component = `import React from 'react';

export default function ${componentName}() {
  return (
    <div 
      className="${classes}"
      style={${JSON.stringify(customStyles, null, 2)}}
    >
`;

  if (children && children.length > 0) {
    children.forEach(child => {
      const childComponent = generateComponentFromFigma(child);
      component += `      ${childComponent}\n`;
    });
  }

  component += `    </div>
  );
}`;

  return component;
}

/**
 * Extract design tokens from Figma styles
 * @param {Object} figmaStyles - CSS properties from Figma
 * @returns {Object} - Design tokens
 */
export function extractDesignTokens(figmaStyles) {
  return {
    colors: {
      primary: figmaStyles.backgroundColor || '#000000',
      text: figmaStyles.color || '#000000'
    },
    typography: {
      fontFamily: figmaStyles.fontFamily || 'Inter',
      fontSize: figmaStyles.fontSize || '16px',
      fontWeight: figmaStyles.fontWeight || '400',
      lineHeight: figmaStyles.lineHeight || '1.5'
    },
    spacing: {
      padding: figmaStyles.padding || '0px',
      margin: figmaStyles.margin || '0px'
    },
    layout: {
      width: figmaStyles.width || 'auto',
      height: figmaStyles.height || 'auto',
      display: figmaStyles.display || 'block'
    }
  };
}

/**
 * Generate Tailwind config from Figma design tokens
 * @param {Object} designTokens - Design tokens from Figma
 * @returns {Object} - Tailwind config object
 */
export function generateTailwindConfig(designTokens) {
  return {
    theme: {
      extend: {
        colors: {
          primary: designTokens.colors.primary,
          text: designTokens.colors.text
        },
        fontFamily: {
          sans: [designTokens.typography.fontFamily, 'sans-serif']
        },
        fontSize: {
          base: designTokens.typography.fontSize
        },
        fontWeight: {
          normal: designTokens.typography.fontWeight
        },
        lineHeight: {
          base: designTokens.typography.lineHeight
        }
      }
    }
  };
}

// Helper function to convert RGB to hex
function rgbToHex(r, g, b) {
  return ((1 << 24) + (parseInt(r) << 16) + (parseInt(g) << 8) + parseInt(b))
    .toString(16)
    .slice(1);
}

// Example usage for Cursor prompts
export const cursorPrompts = {
  componentGeneration: `
    "Create a React component based on this Figma design:
    - Component name: [COMPONENT_NAME]
    - Use Tailwind CSS for styling
    - Make it responsive
    - Include hover states
    - Add proper TypeScript types
    - Use the figmaHelper utilities for style conversion"
  `,
  
  styleConversion: `
    "Convert this Figma CSS to Tailwind classes using the figmaHelper:
    [PASTE_FIGMA_CSS_HERE]
    
    Make it match the design exactly with proper spacing and colors."
  `,
  
  responsiveDesign: `
    "Make this component responsive based on Figma mobile/desktop designs:
    - Mobile: [MOBILE_DESIGN_DETAILS]
    - Desktop: [DESKTOP_DESIGN_DETAILS]
    - Use Tailwind responsive utilities
    - Test on different screen sizes"
  `
};
