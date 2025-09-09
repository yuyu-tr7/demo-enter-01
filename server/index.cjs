const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// In-memory database (in production, use a real database)
const USERS = [
  { id: '1', username: 'admin', password: 'password', email: 'admin@example.com', avatar: null, role: 'admin' },
  { id: '2', username: 'designer', password: 'design123', email: 'designer@example.com', avatar: null, role: 'designer' },
  { id: '3', username: 'developer', password: 'dev123', email: 'dev@example.com', avatar: null, role: 'developer' }
];

const PROJECTS = [
  {
    id: '1',
    name: 'Portfolio Template',
    description: 'A modern portfolio template for creative professionals',
    owner: '1',
    collaborators: ['2', '3'],
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    settings: {
      theme: 'minimal',
      layout: 'grid',
      aiEnabled: true
    }
  }
];

const TASKS = [
  {
    id: '1',
    projectId: '1',
    title: 'Build collaborative AI platforms like Figma meets Notion',
    description: 'Help me build collaborative AI platforms like Figma meets Notion with GitHub-style resource management',
    status: 'in_progress',
    priority: 'high',
    assignee: '1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['ai', 'collaboration', 'platform']
  }
];

const AI_AGENTS = [
  {
    id: '1',
    name: 'Design Assistant',
    type: 'design',
    description: 'Helps with UI/UX design and visual elements',
    status: 'active',
    capabilities: ['color_schemes', 'layout_suggestions', 'component_generation']
  },
  {
    id: '2',
    name: 'Code Generator',
    type: 'development',
    description: 'Generates code based on design specifications',
    status: 'active',
    capabilities: ['react_components', 'styling', 'api_integration']
  },
  {
    id: '3',
    name: 'Content Writer',
    type: 'content',
    description: 'Creates and optimizes content for projects',
    status: 'active',
    capabilities: ['copywriting', 'seo_optimization', 'content_strategy']
  }
];

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, message: 'Access token required' });
  }
  
  // In production, verify JWT token
  req.user = { id: '1', username: 'admin' }; // Demo user
  next();
};

// Routes

// Authentication
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  const user = USERS.find(u => u.username === username && u.password === password);
  if (user) {
    const token = uuidv4();
    return res.json({ 
      success: true, 
      token, 
      user: { id: user.id, username: user.username, email: user.email, role: user.role }
    });
  }
  res.status(401).json({ success: false, message: 'Invalid credentials' });
});

app.post('/api/auth/register', (req, res) => {
  const { username, password, email } = req.body;
  const existingUser = USERS.find(u => u.username === username || u.email === email);
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'User already exists' });
  }
  
  const newUser = {
    id: uuidv4(),
    username,
    password,
    email,
    avatar: null,
    role: 'user'
  };
  USERS.push(newUser);
  
  const token = uuidv4();
  res.json({ 
    success: true, 
    token, 
    user: { id: newUser.id, username: newUser.username, email: newUser.email, role: newUser.role }
  });
});

// Projects
app.get('/api/projects', authenticateToken, (req, res) => {
  res.json({ success: true, projects: PROJECTS });
});

app.post('/api/projects', authenticateToken, (req, res) => {
  const { name, description, settings } = req.body;
  const newProject = {
    id: uuidv4(),
    name,
    description,
    owner: req.user.id,
    collaborators: [],
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    settings: settings || { theme: 'minimal', layout: 'grid', aiEnabled: true }
  };
  PROJECTS.push(newProject);
  res.json({ success: true, project: newProject });
});

app.get('/api/projects/:id', authenticateToken, (req, res) => {
  const project = PROJECTS.find(p => p.id === req.params.id);
  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }
  res.json({ success: true, project });
});

// Tasks
app.get('/api/projects/:projectId/tasks', authenticateToken, (req, res) => {
  const tasks = TASKS.filter(t => t.projectId === req.params.projectId);
  res.json({ success: true, tasks });
});

app.post('/api/projects/:projectId/tasks', authenticateToken, (req, res) => {
  const { title, description, priority, tags } = req.body;
  const newTask = {
    id: uuidv4(),
    projectId: req.params.projectId,
    title,
    description,
    status: 'pending',
    priority: priority || 'medium',
    assignee: req.user.id,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: tags || []
  };
  TASKS.push(newTask);
  res.json({ success: true, task: newTask });
});

// AI Agents
app.get('/api/agents', authenticateToken, (req, res) => {
  res.json({ success: true, agents: AI_AGENTS });
});

app.post('/api/agents/:agentId/execute', authenticateToken, (req, res) => {
  const { agentId } = req.params;
  const { task, context } = req.body;
  
  const agent = AI_AGENTS.find(a => a.id === agentId);
  if (!agent) {
    return res.status(404).json({ success: false, message: 'Agent not found' });
  }
  
  // Simulate AI agent response
  const response = {
    id: uuidv4(),
    agentId,
    task,
    result: `AI Agent "${agent.name}" processed: ${task}`,
    status: 'completed',
    timestamp: new Date().toISOString()
  };
  
  res.json({ success: true, response });
});

// Collaboration
app.get('/api/projects/:projectId/collaborators', authenticateToken, (req, res) => {
  const project = PROJECTS.find(p => p.id === req.params.projectId);
  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }
  
  const collaborators = USERS.filter(u => project.collaborators.includes(u.id));
  res.json({ success: true, collaborators });
});

app.post('/api/projects/:projectId/collaborators', authenticateToken, (req, res) => {
  const { userId } = req.body;
  const project = PROJECTS.find(p => p.id === req.params.projectId);
  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }
  
  if (!project.collaborators.includes(userId)) {
    project.collaborators.push(userId);
    project.updatedAt = new Date().toISOString();
  }
  
  res.json({ success: true, project });
});

// Content Management
app.get('/api/projects/:projectId/content', authenticateToken, (req, res) => {
  // Simulate content data
  const content = {
    hero: {
      title: "Helping collaboration create unique product preview",
      subtitle: "Sustainable, colorful and VOC free paints for a modern interior.",
      image: "/api/images/hero-landscape.jpg"
    },
    sections: [
      {
        id: '1',
        type: 'text',
        content: 'Sustainable, colorful and VOC free paints for a modern interior.',
        position: { x: 0, y: 0 }
      }
    ]
  };
  
  res.json({ success: true, content });
});

app.put('/api/projects/:projectId/content', authenticateToken, (req, res) => {
  const { content } = req.body;
  // In production, save to database
  res.json({ success: true, message: 'Content updated successfully' });
});

// File Upload (simulated)
app.post('/api/upload', authenticateToken, (req, res) => {
  // In production, handle actual file upload
  const fileUrl = `/api/images/${uuidv4()}.jpg`;
  res.json({ success: true, url: fileUrl });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, status: 'healthy', timestamp: new Date().toISOString() });
});

const figmaProxy = require('./figmaProxy.cjs');
app.use('/figma', figmaProxy);

app.listen(PORT, () => {
  console.log(`🚀 Collaborative AI Platform Server running on http://localhost:${PORT}`);
  console.log(`📊 Available endpoints:`);
  console.log(`   - POST /api/auth/login`);
  console.log(`   - POST /api/auth/register`);
  console.log(`   - GET  /api/projects`);
  console.log(`   - GET  /api/agents`);
  console.log(`   - POST /api/agents/:id/execute`);
});
