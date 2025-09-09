import React, { useState } from "react";
import "./index.css";
import BackendDemo from "./BackendDemo";

// Main App Header
function AppHeader() {
  return (
    <header className="bg-[#171717] border-b border-gray-700 text-white px-6 py-3 flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-mono">&lt;/&gt;</span>
          <button className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-1.5 rounded-full text-sm font-medium transition-colors flex items-center space-x-1">
            <span>Untitled.project</span>
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      {/* Center Section - Responsive Controls */}
      <div className="flex items-center space-x-2">
        <button className="p-2 bg-gray-600 text-white rounded">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
        <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
        <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Project Navigation */}
        <div className="flex items-center space-x-2">
          <span className="text-green-500 text-sm">🌲</span>
          <span className="text-sm text-gray-300">Portfolio template web...</span>
          <button className="bg-gray-700 hover:bg-gray-600 text-white px-2 py-1 rounded text-xs transition-colors">
            /Homepage
          </button>
        </div>
        
        {/* Navigation Controls */}
        <div className="flex items-center space-x-1">
          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
          </button>
          <button className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
        </div>
        
        {/* Collaborators */}
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">A</span>
          </div>
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">D</span>
          </div>
          <button className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center hover:bg-gray-500 transition-colors">
            <span className="text-white text-xs font-bold">+</span>
          </button>
        </div>
        
        {/* Publish Button */}
        <button className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors">
          Publish
        </button>
      </div>
    </header>
  );
}

// Task Preview Header
function TaskPreviewHeader() {
  return (
    <header className="bg-white border-b border-gray-200 text-gray-800 px-6 py-3 flex items-center justify-between">
      <span className="text-sm font-medium text-gray-700">Task preview</span>
    </header>
  );
}

// Left Panel Header
function LeftPanelHeader() {
  return (
    <header className="bg-gray-800 border-b border-gray-700 text-white px-4 py-3 flex items-center justify-between">
      {/* Left Section */}
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <span className="text-lg font-mono">&lt;/&gt;</span>
          <span className="font-semibold">Untitled.project</span>
          <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      
      {/* Right Section - View Controls */}
      <div className="flex items-center space-x-2">
        <button className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
        <button className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
        <button className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </header>
  );
}

// Sidebar Component
function Sidebar() {
  return (
    <aside className="w-80 bg-[#171717] text-white h-screen overflow-y-auto border-r border-gray-700">
      <LeftPanelHeader />
      <div className="p-6">
        {/* Return to Tasks Center */}
        <div className="flex items-center space-x-2 mb-6">
          <button className="flex items-center space-x-2 text-gray-300 hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-sm">Return to task center</span>
          </button>
        </div>
        
        {/* Task Card */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6 border border-gray-700">
          <div className="flex items-center justify-between mb-3">
            <span className="bg-yellow-500 text-black px-2 py-1 rounded text-xs font-medium">
              Review needed
            </span>
            <div className="w-6 h-6 bg-gray-400 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-gray-600 rounded-full"></div>
            </div>
          </div>
          <p className="text-sm text-gray-200 mb-3 leading-relaxed">
            Help me build collaborative AI platforms like Figma meets Notion with GitHub-style resource management
          </p>
          <button className="text-xs text-gray-400 hover:text-white transition-colors">
            Discard this task
          </button>
        </div>
        
        {/* Assistant Section */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-lg">∞</span>
            <span className="font-semibold">Assistant</span>
          </div>
          
          {/* Assistant Response */}
          <div className="bg-gray-800 rounded-lg p-4 mb-4 border border-gray-700">
            <p className="text-sm text-gray-200 mb-3">
              I'll build collaborative AI platforms like Figma meets Notion using multiple agent
            </p>
            <h3 className="text-sm font-semibold text-white mb-2">Set up workspace</h3>
            <p className="text-sm text-gray-200 mb-3">
              Let me check if we're in a workspace and explore the current directory structure:
            </p>
          </div>
          
          {/* Code Execution Card */}
          <div className="bg-gray-800 rounded-lg p-4 mb-4 border border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white">Writing code</h3>
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
            
            {/* Terminal */}
            <div className="bg-gray-900 rounded p-3 mb-3 font-mono text-xs border border-gray-600">
              <div className="text-green-400">npm create vite@latest. --template react</div>
              <div className="text-green-400">npm install</div>
              <div className="text-green-400">npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p</div>
            </div>
            
            {/* File Creation Status */}
            <div className="space-y-2 mb-3">
              <div className="flex items-center space-x-2 text-green-400 text-xs">
                <span>✓</span>
                <span>Created</span>
                <span className="bg-gray-500 text-white px-2 py-0.5 rounded text-xs">App.jsx</span>
                <span className="bg-yellow-500 text-white px-2 py-0.5 rounded text-xs">index.cjs</span>
                <span className="bg-pink-500 text-white px-2 py-0.5 rounded text-xs">Style.css</span>
              </div>
              <div className="flex items-center space-x-2 text-green-400 text-xs">
                <span>✓</span>
                <span>Created</span>
                <span className="bg-orange-500 text-white px-2 py-0.5 rounded text-xs">index.html</span>
                <span className="bg-green-500 text-white px-2 py-0.5 rounded text-xs">package.json</span>
              </div>
            </div>
            
            {/* Next Steps */}
            <div className="mb-3">
              <h4 className="text-sm font-semibold text-white mb-2">Next, I'll</h4>
              <div className="space-y-1 text-xs text-gray-300">
                <div>1. Add Tailwind directives to your CSS.</div>
                <div>2. Update your React app to match the minimalist design</div>
              </div>
            </div>
            
            <p className="text-xs text-gray-400">Waiting for your response</p>
          </div>
        </div>
        
        {/* Input Section */}
        <div className="mt-auto">
          <div className="flex items-center space-x-2 bg-gray-800 rounded-lg p-3 border border-gray-700 hover:border-gray-600 transition-colors">
            <span className="text-gray-400">+</span>
            <input 
              type="text" 
              placeholder="Tell me what you want to make..."
              className="bg-transparent text-white placeholder-gray-400 text-sm flex-1 outline-none"
            />
            <svg className="w-4 h-4 text-gray-400 hover:text-white transition-colors cursor-pointer" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </aside>
  );
}

// Main Content Area
function MainContent() {
  return (
    <main className="flex-1 bg-white overflow-y-auto">
      <div className="p-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-5xl font-bold text-gray-900">Home</h1>
          </div>
          
          {/* Top Right Section */}
          <div className="flex justify-between items-start mb-12">
            <div className="flex-1"></div>
            <div className="text-right max-w-md">
              <p className="text-gray-600 text-sm mb-4">
                Sustainable, collorfull and VOC free paints for a modern interior.
              </p>
              <div className="w-48 h-32 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-gray-400/20 to-transparent"></div>
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="h-1 bg-white/40 rounded w-3/4 mb-1"></div>
                  <div className="h-1 bg-white/30 rounded w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Hero Section */}
          <div className="text-center">
            <h2 className="text-6xl font-bold text-gray-900 mb-12 leading-tight">
              Helping collaboration create unique product preview
            </h2>
            
            {/* Hero Image - Person in red robe by water with sheep and mountains */}
            <div className="w-full h-[500px] bg-gradient-to-br from-red-900 via-purple-900 to-gray-900 rounded-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              
              {/* Water/Lake */}
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-600/80 to-gray-400/40"></div>
              
              {/* Person silhouette in red robe */}
              <div className="absolute bottom-32 left-1/4 w-16 h-32 bg-red-800/90 rounded-t-full transform -translate-x-1/2"></div>
              
              {/* Sheep */}
              <div className="absolute bottom-28 left-1/3 w-6 h-6 bg-white/90 rounded-full"></div>
              <div className="absolute bottom-30 left-1/3 w-5 h-5 bg-white/90 rounded-full transform translate-x-8"></div>
              <div className="absolute bottom-32 left-1/3 w-4 h-4 bg-white/90 rounded-full transform translate-x-16"></div>
              
              {/* Mountains */}
              <div className="absolute bottom-0 left-0 right-0 h-64">
                <div className="absolute bottom-0 left-0 w-1/3 h-48 bg-gray-800 rounded-t-full transform -skew-x-12"></div>
                <div className="absolute bottom-0 right-0 w-1/2 h-56 bg-gray-700 rounded-t-full transform skew-x-12"></div>
              </div>
              
              {/* Sun/Moon */}
              <div className="absolute top-8 right-1/4 w-20 h-20 bg-orange-400 rounded-full shadow-2xl"></div>
              
              {/* Atmospheric elements */}
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-orange-200/30 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// Footer Component - Bottom Bar
function Footer() {
  return (
    <footer className="bg-[#171717] text-white px-6 py-3 flex items-center justify-between border-t border-gray-700">
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-300">Keyboard shortcut</span>
        <div className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center">
          <span className="text-xs font-mono">⌘K</span>
        </div>
        <span className="text-sm text-gray-300">Open super chat</span>
      </div>
      
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-300">Select UI element</span>
        <div className="w-6 h-6 bg-gray-700 rounded flex items-center justify-center">
          <span className="text-xs font-mono">⌘S</span>
        </div>
      </div>
    </footer>
  );
}

// Main App Component
function App() {
  return (
    <div className="h-screen flex flex-col bg-[#171717]">
      {/* Main App Header */}
      <AppHeader />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Coding Assistant */}
        <Sidebar />
        
        {/* Right Panel - Web Preview */}
        <div className="flex-1 flex flex-col bg-white">
          <TaskPreviewHeader />
          <MainContent />
        </div>
      </div>
      
      {/* Bottom Bar */}
      <Footer />
    </div>
  );
}

export default App;