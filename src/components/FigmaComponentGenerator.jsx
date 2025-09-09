import React, { useState } from 'react';
import { convertFigmaToTailwind, generateComponentFromFigma, extractDesignTokens } from '../utils/figmaHelper';

export default function FigmaComponentGenerator() {
  const [figmaCSS, setFigmaCSS] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [designTokens, setDesignTokens] = useState(null);

  const handleConvertCSS = () => {
    try {
      // Parse CSS string to object (simplified)
      const cssObj = parseCSSToObject(figmaCSS);
      const result = convertFigmaToTailwind(cssObj);
      
      setGeneratedCode(`
// Generated Tailwind classes:
className="${result.classes}"

// Custom styles:
style={${JSON.stringify(result.styles, null, 2)}}
      `);
      
      setDesignTokens(extractDesignTokens(cssObj));
    } catch (error) {
      setGeneratedCode('Error parsing CSS: ' + error.message);
    }
  };

  const handleGenerateComponent = () => {
    try {
      const cssObj = parseCSSToObject(figmaCSS);
      const designData = {
        name: 'FigmaComponent',
        type: 'div',
        styles: cssObj,
        children: []
      };
      
      const component = generateComponentFromFigma(designData);
      setGeneratedCode(component);
    } catch (error) {
      setGeneratedCode('Error generating component: ' + error.message);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Figma to Cursor Component Generator
      </h2>
      
      <div className="space-y-6">
        {/* Input Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Paste Figma CSS from Dev Mode:
          </label>
          <textarea
            value={figmaCSS}
            onChange={(e) => setFigmaCSS(e.target.value)}
            placeholder="Paste CSS properties from Figma Dev Mode here..."
            className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4">
          <button
            onClick={handleConvertCSS}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Convert to Tailwind
          </button>
          <button
            onClick={handleGenerateComponent}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
          >
            Generate Component
          </button>
        </div>

        {/* Generated Code */}
        {generatedCode && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Generated Code:
            </label>
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
              {generatedCode}
            </pre>
            <button
              onClick={() => navigator.clipboard.writeText(generatedCode)}
              className="mt-2 px-3 py-1 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 transition-colors"
            >
              Copy to Clipboard
            </button>
          </div>
        )}

        {/* Design Tokens */}
        {designTokens && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Design Tokens:</h3>
            <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
              {JSON.stringify(designTokens, null, 2)}
            </pre>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 p-4 rounded-md">
          <h3 className="font-semibold text-blue-800 mb-2">How to use:</h3>
          <ol className="list-decimal list-inside text-sm text-blue-700 space-y-1">
            <li>Open your Figma design in Dev Mode</li>
            <li>Select an element and copy its CSS properties</li>
            <li>Paste the CSS in the textarea above</li>
            <li>Click "Convert to Tailwind" for classes</li>
            <li>Click "Generate Component" for React code</li>
            <li>Copy the generated code to your Cursor editor</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

// Helper function to parse CSS string to object
function parseCSSToObject(cssString) {
  const obj = {};
  const declarations = cssString.split(';').filter(decl => decl.trim());
  
  declarations.forEach(decl => {
    const [property, value] = decl.split(':').map(s => s.trim());
    if (property && value) {
      obj[property] = value;
    }
  });
  
  return obj;
}
