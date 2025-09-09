// Enhanced Collaborative AI Platform Server
const express = require('express');
const cors = require('cors');
const http = require('http');
const path = require('path');
const fs = require('fs');

// Import services
const database = require('./config/database');
const { authenticateToken, generateToken, hashPassword, comparePassword, authorize, checkProjectAccess, optionalAuth } = require('./middleware/auth');
const WebSocketService = require('./services/websocket');
const fileUploadService = require('./services/fileUpload');
const aiService = require('./services/aiService');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 4000;

// Initialize WebSocket
const wsService = new WebSocketService(server);

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static files
app.use('/api/files', express.static(path.join(__dirname, 'uploads')));
app.use('/api/images', express.static(path.join(__dirname, 'uploads/images')));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    version: '2.0.0',
    services: {
      database: 'connected',
      websocket: 'active',
      fileUpload: 'ready',
      aiService: 'ready'
    }
  });
});

// Authentication routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate input
    if (!username || !email || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username, email, and password are required' 
      });
    }

    // Check if user already exists
    const existingUser = await database.get(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        message: 'User already exists' 
      });
    }

    // Create new user
    const userId = require('uuid').v4();
    const passwordHash = await hashPassword(password);

    await database.run(
      'INSERT INTO users (id, username, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
      [userId, username, email, passwordHash, 'user']
    );

    const token = generateToken({ id: userId, username, email, role: 'user' });

    res.json({ 
      success: true, 
      token, 
      user: { id: userId, username, email, role: 'user' }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        success: false, 
        message: 'Username and password are required' 
      });
    }

    // Find user
    const user = await database.get(
      'SELECT * FROM users WHERE username = ? AND is_active = 1',
      [username]
    );

    if (!user || !(await comparePassword(password, user.password_hash))) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid credentials' 
      });
    }

    const token = generateToken(user);

    res.json({ 
      success: true, 
      token, 
      user: { 
        id: user.id, 
        username: user.username, 
        email: user.email, 
        role: user.role 
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
});

// User routes
app.get('/api/users/profile', authenticateToken, async (req, res) => {
  try {
    const user = await database.get(
      'SELECT id, username, email, role, avatar_url, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    res.json({ success: true, user });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Project routes
app.get('/api/projects', authenticateToken, async (req, res) => {
  try {
    const projects = await database.all(`
      SELECT p.*, u.username as owner_name,
             COUNT(pc.user_id) as collaborator_count
      FROM projects p
      JOIN users u ON p.owner_id = u.id
      LEFT JOIN project_collaborators pc ON p.id = pc.project_id
      WHERE p.owner_id = ? OR p.id IN (
        SELECT project_id FROM project_collaborators WHERE user_id = ?
      )
      GROUP BY p.id
      ORDER BY p.updated_at DESC
    `, [req.user.id, req.user.id]);

    res.json({ success: true, projects });
  } catch (error) {
    console.error('Projects error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.post('/api/projects', authenticateToken, async (req, res) => {
  try {
    const { name, description, settings } = req.body;
    const projectId = require('uuid').v4();

    await database.run(
      'INSERT INTO projects (id, name, description, owner_id, settings) VALUES (?, ?, ?, ?, ?)',
      [projectId, name, description, req.user.id, JSON.stringify(settings || {})]
    );

    const project = await database.get(
      'SELECT * FROM projects WHERE id = ?',
      [projectId]
    );

    res.json({ success: true, project });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.get('/api/projects/:id', authenticateToken, checkProjectAccess, async (req, res) => {
  try {
    const project = await database.get(`
      SELECT p.*, u.username as owner_name
      FROM projects p
      JOIN users u ON p.owner_id = u.id
      WHERE p.id = ?
    `, [req.params.id]);

    // Get collaborators
    const collaborators = await database.all(`
      SELECT u.id, u.username, u.email, u.avatar_url, pc.role, pc.joined_at
      FROM project_collaborators pc
      JOIN users u ON pc.user_id = u.id
      WHERE pc.project_id = ?
    `, [req.params.id]);

    project.collaborators = collaborators;
    res.json({ success: true, project });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Task routes
app.get('/api/projects/:projectId/tasks', authenticateToken, checkProjectAccess, async (req, res) => {
  try {
    const tasks = await database.all(`
      SELECT t.*, u1.username as assignee_name, u2.username as created_by_name
      FROM tasks t
      LEFT JOIN users u1 ON t.assignee_id = u1.id
      LEFT JOIN users u2 ON t.created_by = u2.id
      WHERE t.project_id = ?
      ORDER BY t.created_at DESC
    `, [req.params.projectId]);

    res.json({ success: true, tasks });
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.post('/api/projects/:projectId/tasks', authenticateToken, checkProjectAccess, async (req, res) => {
  try {
    const { title, description, priority, assignee_id, due_date, tags } = req.body;
    const taskId = require('uuid').v4();

    await database.run(
      'INSERT INTO tasks (id, project_id, title, description, priority, assignee_id, created_by, due_date, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [taskId, req.params.projectId, title, description, priority || 'medium', assignee_id, req.user.id, due_date, JSON.stringify(tags || [])]
    );

    const task = await database.get(
      'SELECT * FROM tasks WHERE id = ?',
      [taskId]
    );

    res.json({ success: true, task });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// AI Agent routes
app.get('/api/agents', authenticateToken, async (req, res) => {
  try {
    const agents = await aiService.getAgents();
    res.json({ success: true, agents });
  } catch (error) {
    console.error('Get agents error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

app.post('/api/agents/:agentId/execute', authenticateToken, async (req, res) => {
  try {
    const { agentId } = req.params;
    const { task, context, projectId } = req.body;

    const result = await aiService.executeAgent(agentId, task, context, req.user.id, projectId);
    res.json({ success: true, result });
  } catch (error) {
    console.error('Execute agent error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// File upload routes
app.post('/api/upload', authenticateToken, fileUploadService.uploadMiddleware, async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'No files uploaded' 
      });
    }

    const { projectId } = req.body;
    const processedFiles = await fileUploadService.processUploadedFiles(
      req.files, 
      req.user.id, 
      projectId
    );

    res.json({ success: true, files: processedFiles });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: 'Upload failed' });
  }
});

app.get('/api/files/:fileId', async (req, res) => {
  try {
    const file = await fileUploadService.getFileById(req.params.fileId);
    
    if (!file) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }

    if (!fs.existsSync(file.path)) {
      return res.status(404).json({ success: false, message: 'File not found on disk' });
    }

    res.download(file.path, file.original_name);
  } catch (error) {
    console.error('File download error:', error);
    res.status(500).json({ success: false, message: 'Download failed' });
  }
});

// Real-time collaboration routes
app.get('/api/projects/:projectId/users', authenticateToken, checkProjectAccess, async (req, res) => {
  try {
    const users = wsService.getProjectUsers(req.params.projectId);
    res.json({ success: true, users });
  } catch (error) {
    console.error('Get project users error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Activity logs
app.get('/api/projects/:projectId/activity', authenticateToken, checkProjectAccess, async (req, res) => {
  try {
    const activities = await database.all(`
      SELECT al.*, u.username as user_name
      FROM activity_logs al
      JOIN users u ON al.user_id = u.id
      WHERE al.project_id = ?
      ORDER BY al.created_at DESC
      LIMIT 50
    `, [req.params.projectId]);

    res.json({ success: true, activities });
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Server error:', error);
  res.status(500).json({ 
    success: false, 
    message: 'Internal server error' 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Endpoint not found' 
  });
});

// Initialize database and start server
async function startServer() {
  try {
    // Connect to database
    await database.connect();
    
    // Start server
    server.listen(PORT, () => {
      console.log(`🚀 Enhanced Collaborative AI Platform Server running on http://localhost:${PORT}`);
      console.log(`📊 Available endpoints:`);
      console.log(`   - POST /api/auth/login`);
      console.log(`   - POST /api/auth/register`);
      console.log(`   - GET  /api/projects`);
      console.log(`   - GET  /api/agents`);
      console.log(`   - POST /api/agents/:id/execute`);
      console.log(`   - POST /api/upload`);
      console.log(`   - WebSocket: ws://localhost:${PORT}`);
      console.log(`   - Health: http://localhost:${PORT}/api/health`);
    });

    // Cleanup on exit
    process.on('SIGINT', async () => {
      console.log('\n🛑 Shutting down server...');
      await database.close();
      process.exit(0);
    });

  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Start the server
startServer();
