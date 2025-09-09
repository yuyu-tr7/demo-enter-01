import React from 'react';
import { convertFigmaToTailwind } from '../utils/figmaHelper';

export default function FigmaComponent() {
  // Example: Convert Figma CSS to Tailwind
  // This is how you would use the figmaHelper in practice
  
  // Step 1: Get CSS properties from Figma Dev Mode
  const figmaStyles = {
    width: '400px',
    height: '200px',
    backgroundColor: 'rgb(59, 130, 246)', // blue-500
    borderRadius: '12px',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '18px',
    fontWeight: '600',
    color: 'rgb(255, 255, 255)',
    textAlign: 'center'
  };

  // Step 2: Convert to Tailwind classes
  const { classes, styles } = convertFigmaToTailwind(figmaStyles);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        Figma Component Example
      </h3>
      
      {/* Original Figma Design */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-600 mb-2">
          Converted from Figma CSS:
        </h4>
        <div 
          className={classes}
          style={styles}
        >
          <p className="text-white font-semibold">
            This component was generated from Figma!
          </p>
          <p className="text-white text-sm mt-2 opacity-90">
            Using figmaHelper utilities
          </p>
        </div>
      </div>

      {/* Generated Code Display */}
      <div className="bg-gray-100 p-4 rounded-md">
        <h4 className="text-sm font-medium text-gray-600 mb-2">
          Generated Tailwind Classes:
        </h4>
        <code className="text-sm text-gray-800">
          className="{classes}"
        </code>
        
        {Object.keys(styles).length > 0 && (
          <div className="mt-2">
            <h4 className="text-sm font-medium text-gray-600 mb-2">
              Custom Styles:
            </h4>
            <pre className="text-xs text-gray-700">
              {JSON.stringify(styles, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Instructions */}
      <div className="mt-4 bg-blue-50 p-4 rounded-md">
        <h4 className="text-sm font-semibold text-blue-800 mb-2">
          How to use this pattern:
        </h4>
        <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
          <li>Copy CSS properties from Figma Dev Mode</li>
          <li>Create a figmaStyles object with the properties</li>
          <li>Use convertFigmaToTailwind() to get classes and styles</li>
          <li>Apply the generated className and style props</li>
        </ol>
      </div>
    </div>
  );
}
