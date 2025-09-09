import React, { useState } from "react";
import "./index.css";
import BackendDemo from "./BackendDemo";
import FigmaComponentGenerator from "./components/FigmaComponentGenerator";
import FigmaComponent from "./components/FigmaComponent";
import FigmaExamples from "./components/FigmaExamples";

// Main App Header
function AppHeader() {
  return (
    <header className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50 text-white px-6 py-4 shadow-2xl backdrop-blur-sm">
      {/* Left Section */}
      <div className="flex items-center space-x-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white text-lg font-bold">&lt;/&gt;</span>
          </div>
          <div className="flex flex-col">
            <button className="bg-slate-700/80 hover:bg-slate-600/80 backdrop-blur-sm text-white px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl">
              <span>Untitled.project</span>
              <svg className="w-3 h-3 transition-transform duration-200" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <span className="text-xs text-slate-400 mt-1">Collaborative AI Platform</span>
          </div>
        </div>
      </div>
      
      {/* Center Section - Responsive Controls */}
      <div className="flex items-center space-x-1 bg-slate-800/50 rounded-xl p-1 backdrop-blur-sm">
        <button className="p-2.5 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-200 hover:scale-105">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
        <button className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200 hover:scale-105">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
        <button className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200 hover:scale-105">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      
      {/* Right Section */}
      <div className="flex items-center space-x-6">
        {/* Project Navigation */}
        <div className="flex items-center space-x-3 bg-slate-800/50 rounded-xl px-4 py-2 backdrop-blur-sm">
          <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-xs font-bold">🌲</span>
          </div>
          <span className="text-sm text-slate-200 font-medium">Portfolio template</span>
          <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
          <button className="bg-slate-700/80 hover:bg-slate-600/80 text-slate-200 px-3 py-1 rounded-lg text-xs font-medium transition-all duration-200 hover:scale-105">
            /Homepage
          </button>
        </div>
        
        {/* Navigation Controls */}
        <div className="flex items-center space-x-1 bg-slate-800/50 rounded-xl p-1 backdrop-blur-sm">
          <button className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200 hover:scale-105">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <button className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200 hover:scale-105">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
          <button className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200 hover:scale-105">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
          </button>
          <button className="p-2.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200 hover:scale-105">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
        </div>
        
        {/* Collaborators */}
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center shadow-lg ring-2 ring-slate-700">
            <span className="text-white text-sm font-bold">A</span>
          </div>
          <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg ring-2 ring-slate-700">
            <span className="text-white text-sm font-bold">D</span>
          </div>
          <button className="w-9 h-9 bg-slate-700/80 hover:bg-slate-600/80 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 shadow-lg ring-2 ring-slate-700">
            <span className="text-slate-300 text-sm font-bold">+</span>
          </button>
        </div>
        
        {/* Publish Button */}
        <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 backdrop-blur-sm">
          Publish
        </button>
      </div>
    </header>
  );
}

// Task Preview Header
function TaskPreviewHeader() {
  return (
    <header className="bg-gradient-to-r from-white via-slate-50 to-white border-b border-slate-200/50 text-slate-800 px-6 py-4 flex items-center justify-between shadow-sm backdrop-blur-sm">
      <div className="flex items-center space-x-3">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-sm font-semibold text-slate-700">Task Preview</span>
      </div>
      <div className="flex items-center space-x-2 text-slate-500 text-xs">
        <span>Live Preview</span>
        <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
        <span>Auto-sync</span>
      </div>
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
    <aside className="w-80 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white h-screen overflow-y-auto border-r border-slate-700/50 shadow-2xl backdrop-blur-sm">
      <LeftPanelHeader />
      <div className="p-6 space-y-6">
        {/* Return to Tasks Center */}
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-3 text-slate-300 hover:text-white transition-all duration-200 group bg-slate-800/50 hover:bg-slate-700/50 rounded-xl px-4 py-3 backdrop-blur-sm">
            <svg className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium">Return to task center</span>
          </button>
        </div>
        
        {/* Task Card */}
        <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 rounded-2xl p-6 border border-slate-600/50 shadow-xl backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-slate-900 px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg">
              Review needed
            </span>
            <div className="w-8 h-8 bg-gradient-to-br from-slate-600 to-slate-700 rounded-full flex items-center justify-center shadow-lg">
              <div className="w-4 h-4 bg-slate-400 rounded-full"></div>
            </div>
          </div>
          <p className="text-sm text-slate-200 mb-4 leading-relaxed">
            Help me build collaborative AI platforms like Figma meets Notion with GitHub-style resource management
          </p>
          <button className="text-xs text-slate-400 hover:text-white transition-colors font-medium">
            Discard this task
          </button>
        </div>
        
        {/* Assistant Section */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-lg font-bold">∞</span>
            </div>
            <span className="font-semibold text-slate-200">AI Assistant</span>
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          </div>
          
          {/* Assistant Response */}
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 rounded-2xl p-5 border border-slate-600/50 shadow-xl backdrop-blur-sm">
            <p className="text-sm text-slate-200 mb-3 leading-relaxed">
              I'll build collaborative AI platforms like Figma meets Notion using multiple agents
            </p>
            <h3 className="text-sm font-semibold text-white mb-2">Set up workspace</h3>
            <p className="text-sm text-slate-300 mb-4">
              Let me check if we're in a workspace and explore the current directory structure:
            </p>
          </div>
          
          {/* Code Execution Card */}
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-700/80 rounded-2xl p-5 border border-slate-600/50 shadow-xl backdrop-blur-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <h3 className="text-sm font-semibold text-white">Writing code</h3>
              </div>
              <button className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-all duration-200">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            
            {/* Terminal */}
            <div className="bg-slate-900/80 rounded-xl p-4 mb-4 font-mono text-xs border border-slate-600/50 shadow-inner">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-slate-400 ml-2 text-xs">Terminal</span>
              </div>
              <div className="space-y-1">
                <div className="text-green-400">$ npm create vite@latest. --template react</div>
                <div className="text-green-400">$ npm install</div>
                <div className="text-green-400">$ npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p</div>
              </div>
            </div>
            
            {/* File Creation Status */}
            <div className="space-y-3 mb-4">
              <div className="flex items-center space-x-2 text-green-400 text-xs">
                <span className="w-4 h-4 bg-green-500/20 rounded-full flex items-center justify-center">
                  <span className="text-xs">✓</span>
                </span>
                <span>Created</span>
                <span className="bg-slate-600 text-white px-2 py-1 rounded-lg text-xs font-medium">App.jsx</span>
                <span className="bg-yellow-500 text-white px-2 py-1 rounded-lg text-xs font-medium">index.cjs</span>
                <span className="bg-pink-500 text-white px-2 py-1 rounded-lg text-xs font-medium">Style.css</span>
              </div>
              <div className="flex items-center space-x-2 text-green-400 text-xs">
                <span className="w-4 h-4 bg-green-500/20 rounded-full flex items-center justify-center">
                  <span className="text-xs">✓</span>
                </span>
                <span>Created</span>
                <span className="bg-orange-500 text-white px-2 py-1 rounded-lg text-xs font-medium">index.html</span>
                <span className="bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-medium">package.json</span>
              </div>
            </div>
            
            {/* Next Steps */}
            <div className="bg-slate-700/50 rounded-xl p-4 mb-4">
              <h4 className="text-sm font-semibold text-white mb-3">Next, I'll</h4>
              <div className="space-y-2 text-xs text-slate-300">
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  <span>Add Tailwind directives to your CSS</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                  <span>Update your React app to match the minimalist design</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-slate-400 text-xs">
                <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
                <span>Waiting for your response</span>
              </div>
              <span className="text-xs text-slate-500">Just now</span>
            </div>
          </div>
        </div>
        
        {/* Input Section */}
        <div className="mt-auto pt-6">
          <div className="flex items-center space-x-3 bg-gradient-to-r from-slate-800/80 to-slate-700/80 rounded-2xl p-4 border border-slate-600/50 hover:border-slate-500/50 transition-all duration-200 shadow-lg backdrop-blur-sm">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white text-sm font-bold">+</span>
            </div>
            <input 
              type="text" 
              placeholder="Tell me what you want to make..."
              className="bg-transparent text-white placeholder-slate-400 text-sm flex-1 outline-none"
            />
            <button className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

// Main Content Area
function MainContent() {
  return (
    <main className="flex-1 bg-gradient-to-br from-slate-50 via-white to-slate-50 overflow-y-auto">
      <div className="p-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Title */}
          <div className="mb-12">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent">
              Home
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mt-4"></div>
          </div>
          
          {/* Top Right Section */}
          <div className="flex justify-between items-start mb-16">
            <div className="flex-1"></div>
            <div className="text-right max-w-lg">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-slate-200/50">
                <p className="text-slate-600 text-base mb-6 leading-relaxed">
                  Sustainable, colorful and VOC free paints for a modern interior.
                </p>
                <div className="w-64 h-40 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl relative overflow-hidden shadow-lg">
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-300/30 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="h-2 bg-white/60 rounded-full w-3/4 mb-2"></div>
                    <div className="h-2 bg-white/40 rounded-full w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Hero Section */}
          <div className="text-center mb-20">
            <h2 className="text-7xl font-bold bg-gradient-to-r from-slate-900 via-slate-700 to-slate-900 bg-clip-text text-transparent mb-16 leading-tight">
              Helping collaboration create unique product preview
            </h2>
            
            {/* Hero Image - Person in red robe by water with sheep and mountains */}
            <div className="w-full h-[600px] bg-gradient-to-br from-red-900 via-purple-900 to-slate-900 rounded-3xl relative overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              
              {/* Water/Lake */}
              <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-slate-600/90 to-slate-400/50"></div>
              
              {/* Person silhouette in red robe */}
              <div className="absolute bottom-40 left-1/4 w-20 h-40 bg-red-800/90 rounded-t-full transform -translate-x-1/2"></div>
              
              {/* Sheep */}
              <div className="absolute bottom-32 left-1/3 w-8 h-8 bg-white/90 rounded-full"></div>
              <div className="absolute bottom-36 left-1/3 w-6 h-6 bg-white/90 rounded-full transform translate-x-10"></div>
              <div className="absolute bottom-40 left-1/3 w-5 h-5 bg-white/90 rounded-full transform translate-x-20"></div>
              
              {/* Mountains */}
              <div className="absolute bottom-0 left-0 right-0 h-80">
                <div className="absolute bottom-0 left-0 w-1/3 h-60 bg-slate-800 rounded-t-full transform -skew-x-12"></div>
                <div className="absolute bottom-0 right-0 w-1/2 h-72 bg-slate-700 rounded-t-full transform skew-x-12"></div>
              </div>
              
              {/* Sun/Moon */}
              <div className="absolute top-12 right-1/4 w-24 h-24 bg-orange-400 rounded-full shadow-2xl"></div>
              
              {/* Atmospheric elements */}
              <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-orange-200/40 to-transparent"></div>
            </div>
          </div>

          {/* Figma Integration Section */}
          <div className="mb-20">
            <FigmaComponentGenerator />
          </div>

          {/* Figma Component Example */}
          <div className="mb-20">
            <FigmaComponent />
          </div>

          {/* Figma Examples */}
          <div className="mb-20">
            <FigmaExamples />
          </div>
        </div>
      </div>
    </main>
  );
}

// Footer Component - Bottom Bar
function Footer() {
  return (
    <footer className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white px-6 py-4 flex items-center justify-between border-t border-slate-700/50 shadow-2xl backdrop-blur-sm">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3 bg-slate-800/50 rounded-xl px-4 py-2 backdrop-blur-sm">
          <span className="text-sm text-slate-300 font-medium">Keyboard shortcut</span>
          <div className="w-7 h-7 bg-slate-700/80 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-xs font-mono font-bold">⌘K</span>
          </div>
          <span className="text-sm text-slate-300">Open super chat</span>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-3 bg-slate-800/50 rounded-xl px-4 py-2 backdrop-blur-sm">
          <span className="text-sm text-slate-300 font-medium">Select UI element</span>
          <div className="w-7 h-7 bg-slate-700/80 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-xs font-mono font-bold">⌘S</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-slate-400 text-sm">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
          <span>Connected</span>
        </div>
      </div>
    </footer>
  );
}

// Main App Component
function App() {
  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Main App Header */}
      <AppHeader />
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Coding Assistant */}
        <Sidebar />
        
        {/* Right Panel - Web Preview */}
        <div className="flex-1 flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-50">
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