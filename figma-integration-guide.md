# Figma + Cursor Integration Guide

## 🎯 Best Practices for Figma to Cursor Workflow

### 1. Figma Dev Mode Setup
1. Open your design in Figma
2. Switch to "Dev Mode" (top right)
3. Select elements to get:
   - CSS properties
   - Tailwind classes
   - Exact measurements
   - Color codes
   - Font specifications

### 2. Asset Export Workflow
1. **Select elements** in Figma
2. **Right-click → Export** or use Export panel
3. **Choose format**: SVG for icons, PNG/JPG for images
4. **Set naming convention**: `component-name-element.png`
5. **Export at 2x resolution** for retina displays

### 3. Code Generation Process
1. **Copy CSS from Figma Dev Mode**
2. **Paste into Cursor** with context
3. **Ask Cursor to convert** to Tailwind classes
4. **Request component structure** based on design

### 4. Cursor Prompts for Figma Integration

#### **Component Generation:**
```
"Create a React component based on this Figma design:
- Use Tailwind CSS for styling
- Make it responsive
- Include hover states
- Add proper TypeScript types"
```

#### **Style Conversion:**
```
"Convert this Figma CSS to Tailwind classes:
[Paste CSS here]

Make it match the design exactly with proper spacing and colors."
```

#### **Layout Implementation:**
```
"Implement this Figma layout structure:
- Header with navigation
- Sidebar with 320px width
- Main content area
- Footer with controls
- Use CSS Grid/Flexbox as appropriate"
```

### 5. Figma Token Integration
```bash
# Set up environment variables
REACT_APP_FIGMA_TOKEN=your-figma-token
REACT_APP_FIGMA_FILE_KEY=your-file-key
```

### 6. Automated Workflow
1. **Design in Figma** with proper naming
2. **Export assets** to `src/assets/`
3. **Copy CSS** from Dev Mode
4. **Ask Cursor** to implement components
5. **Test and iterate** in development

## 🛠️ Cursor-Specific Tips

### **Use Cursor's AI Features:**
- **@codebase** to reference existing components
- **@web** to search for Figma integration tools
- **@docs** to reference Tailwind documentation

### **Effective Prompts:**
- "Create a component that matches this Figma design"
- "Convert this Figma CSS to Tailwind"
- "Make this component responsive like the Figma mobile version"
- "Add animations based on Figma prototype"

### **File Organization:**
```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── layout/       # Layout components
│   └── figma/        # Figma-specific components
├── assets/
│   ├── images/       # Exported images
│   ├── icons/        # Exported icons
│   └── figma/        # Figma assets
└── styles/
    ├── figma.css     # Figma-specific styles
    └── tokens.css    # Design tokens
```

## 🚀 Advanced Integration

### **Figma API Integration:**
- **Fetch design data** programmatically
- **Sync colors and typography** automatically
- **Generate design tokens** from Figma
- **Update components** when designs change

### **Design System Sync:**
- **Extract design tokens** from Figma
- **Generate Tailwind config** from Figma
- **Create component library** from Figma components
- **Maintain consistency** across projects

## 📱 Mobile-First Approach
1. **Start with mobile** design in Figma
2. **Implement mobile** version first
3. **Use responsive utilities** for larger screens
4. **Test on actual devices**

## 🔄 Iteration Process
1. **Design changes** in Figma
2. **Export new assets** if needed
3. **Update components** in Cursor
4. **Test and refine** in browser
5. **Repeat** for continuous improvement
