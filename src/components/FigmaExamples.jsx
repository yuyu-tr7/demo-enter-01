import React from 'react';
import { convertFigmaToTailwind } from '../utils/figmaHelper';

export default function FigmaExamples() {
  // Example 1: Button Component from Figma
  const buttonStyles = {
    width: '120px',
    height: '40px',
    backgroundColor: 'rgb(37, 99, 235)', // blue-600
    borderRadius: '8px',
    padding: '8px 16px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '14px',
    fontWeight: '500',
    color: 'rgb(255, 255, 255)',
    cursor: 'pointer',
    border: 'none'
  };

  // Example 2: Card Component from Figma
  const cardStyles = {
    width: '300px',
    height: '200px',
    backgroundColor: 'rgb(255, 255, 255)',
    borderRadius: '16px',
    padding: '24px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px'
  };

  // Example 3: Input Field from Figma
  const inputStyles = {
    width: '100%',
    height: '44px',
    backgroundColor: 'rgb(249, 250, 251)', // gray-50
    borderRadius: '8px',
    padding: '12px 16px',
    border: '1px solid rgb(209, 213, 219)', // gray-300
    fontSize: '16px',
    color: 'rgb(17, 24, 39)', // gray-900
    outline: 'none'
  };

  const buttonResult = convertFigmaToTailwind(buttonStyles);
  const cardResult = convertFigmaToTailwind(cardStyles);
  const inputResult = convertFigmaToTailwind(inputStyles);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Figma to React Examples
      </h2>
      
      <div className="space-y-8">
        {/* Button Example */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Example 1: Button Component
          </h3>
          <div className="flex items-center space-x-4">
            <button 
              className={buttonResult.classes}
              style={buttonResult.styles}
            >
              Click me
            </button>
            <div className="text-sm text-gray-600">
              <p><strong>Classes:</strong> {buttonResult.classes}</p>
              {Object.keys(buttonResult.styles).length > 0 && (
                <p><strong>Styles:</strong> {JSON.stringify(buttonResult.styles)}</p>
              )}
            </div>
          </div>
        </div>

        {/* Card Example */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Example 2: Card Component
          </h3>
          <div className="flex space-x-4">
            <div 
              className={cardResult.classes}
              style={cardResult.styles}
            >
              <h4 className="text-lg font-semibold text-gray-800">Card Title</h4>
              <p className="text-gray-600">This is a card component generated from Figma styles.</p>
              <button className="mt-auto bg-blue-500 text-white px-4 py-2 rounded text-sm">
                Action
              </button>
            </div>
            <div className="text-sm text-gray-600">
              <p><strong>Classes:</strong> {cardResult.classes}</p>
              {Object.keys(cardResult.styles).length > 0 && (
                <p><strong>Styles:</strong> {JSON.stringify(cardResult.styles)}</p>
              )}
            </div>
          </div>
        </div>

        {/* Input Example */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Example 3: Input Field
          </h3>
          <div className="max-w-md">
            <input 
              type="text"
              placeholder="Enter your text..."
              className={inputResult.classes}
              style={inputResult.styles}
            />
            <div className="mt-2 text-sm text-gray-600">
              <p><strong>Classes:</strong> {inputResult.classes}</p>
              {Object.keys(inputResult.styles).length > 0 && (
                <p><strong>Styles:</strong> {JSON.stringify(inputResult.styles)}</p>
              )}
            </div>
          </div>
        </div>

        {/* Cursor Prompts Section */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4 text-gray-700">
            Cursor AI Prompts for Figma Integration
          </h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-800 mb-2">For Component Generation:</h4>
              <code className="block bg-gray-200 p-3 rounded text-sm">
                "Create a React component based on this Figma design. Use the figmaHelper utilities to convert CSS properties to Tailwind classes. Make it responsive and include hover states."
              </code>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-800 mb-2">For Style Conversion:</h4>
              <code className="block bg-gray-200 p-3 rounded text-sm">
                {`"Convert this Figma CSS to Tailwind classes using convertFigmaToTailwind(): {width: '200px', height: '100px', backgroundColor: 'rgb(59, 130, 246)', borderRadius: '8px'}"`}
              </code>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-800 mb-2">For Responsive Design:</h4>
              <code className="block bg-gray-200 p-3 rounded text-sm">
                "Make this component responsive based on Figma mobile and desktop designs. Use Tailwind responsive utilities and the figmaHelper for style conversion."
              </code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
