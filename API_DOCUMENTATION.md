# Collaborative AI Platform - API Documentation

## 🚀 Enhanced Backend Features

### **New Backend Architecture**

The enhanced backend now includes:

- **🗄️ SQLite Database**: Persistent data storage with proper relationships
- **🔐 JWT Authentication**: Secure user authentication and authorization
- **⚡ WebSocket Support**: Real-time collaboration features
- **📁 File Upload System**: Complete file management with upload/download
- **🤖 AI Service Integration**: Advanced AI agent processing
- **📊 Activity Logging**: Comprehensive activity tracking
- **🔒 Role-based Access Control**: Granular permissions system

---

## 📋 API Endpoints

### **Authentication**

#### `POST /api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token",
  "user": {
    "id": "uuid",
    "username": "string",
    "email": "string",
    "role": "user"
  }
}
```

#### `POST /api/auth/login`
Authenticate user and get access token.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token",
  "user": {
    "id": "uuid",
    "username": "string",
    "email": "string",
    "role": "string"
  }
}
```

---

### **User Management**

#### `GET /api/users/profile`
Get current user profile.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "username": "string",
    "email": "string",
    "role": "string",
    "avatar_url": "string",
    "created_at": "datetime"
  }
}
```

---

### **Project Management**

#### `GET /api/projects`
Get all projects for the authenticated user.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "projects": [
    {
      "id": "uuid",
      "name": "string",
      "description": "string",
      "owner_id": "uuid",
      "status": "active",
      "settings": {},
      "owner_name": "string",
      "collaborator_count": 2,
      "created_at": "datetime",
      "updated_at": "datetime"
    }
  ]
}
```

#### `POST /api/projects`
Create a new project.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "name": "string",
  "description": "string",
  "settings": {
    "theme": "minimal",
    "layout": "grid",
    "aiEnabled": true
  }
}
```

#### `GET /api/projects/:id`
Get project details with collaborators.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "project": {
    "id": "uuid",
    "name": "string",
    "description": "string",
    "owner_id": "uuid",
    "status": "active",
    "settings": {},
    "owner_name": "string",
    "collaborators": [
      {
        "id": "uuid",
        "username": "string",
        "email": "string",
        "avatar_url": "string",
        "role": "collaborator",
        "joined_at": "datetime"
      }
    ],
    "created_at": "datetime",
    "updated_at": "datetime"
  }
}
```

---

### **Task Management**

#### `GET /api/projects/:projectId/tasks`
Get all tasks for a project.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "tasks": [
    {
      "id": "uuid",
      "project_id": "uuid",
      "title": "string",
      "description": "string",
      "status": "pending",
      "priority": "medium",
      "assignee_id": "uuid",
      "assignee_name": "string",
      "created_by": "uuid",
      "created_by_name": "string",
      "due_date": "datetime",
      "tags": ["string"],
      "created_at": "datetime",
      "updated_at": "datetime"
    }
  ]
}
```

#### `POST /api/projects/:projectId/tasks`
Create a new task.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "title": "string",
  "description": "string",
  "priority": "low|medium|high|urgent",
  "assignee_id": "uuid",
  "due_date": "datetime",
  "tags": ["string"]
}
```

---

### **AI Agent Integration**

#### `GET /api/agents`
Get all available AI agents.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "agents": [
    {
      "id": "uuid",
      "name": "Design Assistant",
      "type": "design",
      "description": "Helps with UI/UX design and visual elements",
      "capabilities": ["color_schemes", "layout_suggestions", "component_generation"],
      "status": "active",
      "configuration": {
        "model": "gpt-4",
        "temperature": 0.7
      }
    }
  ]
}
```

#### `POST /api/agents/:agentId/execute`
Execute an AI agent task.

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "task": "string",
  "context": {},
  "projectId": "uuid"
}
```

**Response:**
```json
{
  "success": true,
  "result": {
    "executionId": "uuid",
    "agent": {
      "id": "uuid",
      "name": "string",
      "type": "string"
    },
    "result": "string",
    "status": "completed",
    "timestamp": "datetime"
  }
}
```

---

### **File Management**

#### `POST /api/upload`
Upload files to the server.

**Headers:** `Authorization: Bearer <token>`

**Request:** `multipart/form-data`
- `files`: File array (max 5 files, 10MB each)
- `projectId`: Optional project ID

**Response:**
```json
{
  "success": true,
  "files": [
    {
      "id": "uuid",
      "filename": "string",
      "originalName": "string",
      "mimeType": "string",
      "size": 12345,
      "url": "/api/files/uuid",
      "uploadedAt": "datetime"
    }
  ]
}
```

#### `GET /api/files/:fileId`
Download a file.

**Response:** File download

---

### **Real-time Collaboration**

#### `GET /api/projects/:projectId/users`
Get currently connected users for a project.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "id": "uuid",
      "username": "string",
      "email": "string",
      "role": "string"
    }
  ]
}
```

#### `GET /api/projects/:projectId/activity`
Get recent activity for a project.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "success": true,
  "activities": [
    {
      "id": "uuid",
      "user_id": "uuid",
      "project_id": "uuid",
      "action": "string",
      "details": {},
      "user_name": "string",
      "created_at": "datetime"
    }
  ]
}
```

---

## 🔌 WebSocket Events

### **Client to Server Events**

#### `authenticate`
Authenticate WebSocket connection.

**Data:**
```json
{
  "token": "jwt_token"
}
```

#### `join_project`
Join a project room for real-time collaboration.

**Data:**
```json
{
  "projectId": "uuid"
}
```

#### `leave_project`
Leave a project room.

**Data:**
```json
{
  "projectId": "uuid"
}
```

#### `document_edit`
Send document changes to other users.

**Data:**
```json
{
  "projectId": "uuid",
  "changes": {}
}
```

#### `cursor_update`
Update cursor position for other users.

**Data:**
```json
{
  "projectId": "uuid",
  "position": {
    "x": 100,
    "y": 200
  }
}
```

#### `task_update`
Update task in real-time.

**Data:**
```json
{
  "projectId": "uuid",
  "taskId": "uuid",
  "updates": {
    "status": "completed",
    "priority": "high"
  }
}
```

#### `ai_request`
Request AI agent execution.

**Data:**
```json
{
  "projectId": "uuid",
  "agentId": "uuid",
  "task": "string",
  "context": {}
}
```

#### `typing_start` / `typing_stop`
Indicate typing status.

**Data:**
```json
{
  "projectId": "uuid"
}
```

### **Server to Client Events**

#### `authenticated`
Authentication successful.

**Data:**
```json
{
  "user": {
    "id": "uuid",
    "username": "string",
    "email": "string",
    "role": "string"
  }
}
```

#### `user_joined`
User joined project room.

**Data:**
```json
{
  "user": {
    "id": "uuid",
    "username": "string",
    "email": "string",
    "role": "string"
  },
  "timestamp": "datetime"
}
```

#### `user_left`
User left project room.

**Data:**
```json
{
  "user": {
    "id": "uuid",
    "username": "string",
    "email": "string",
    "role": "string"
  },
  "timestamp": "datetime"
}
```

#### `project_users`
Current users in project room.

**Data:**
```json
{
  "users": [
    {
      "id": "uuid",
      "username": "string",
      "email": "string",
      "role": "string"
    }
  ]
}
```

#### `document_updated`
Document changes from other users.

**Data:**
```json
{
  "user": {
    "id": "uuid",
    "username": "string"
  },
  "changes": {},
  "timestamp": "datetime"
}
```

#### `cursor_moved`
Cursor position update from other users.

**Data:**
```json
{
  "user": {
    "id": "uuid",
    "username": "string"
  },
  "position": {
    "x": 100,
    "y": 200
  },
  "timestamp": "datetime"
}
```

#### `task_updated`
Task update from other users.

**Data:**
```json
{
  "taskId": "uuid",
  "updates": {
    "status": "completed"
  },
  "updatedBy": {
    "id": "uuid",
    "username": "string"
  },
  "timestamp": "datetime"
}
```

#### `ai_response`
AI agent execution result.

**Data:**
```json
{
  "executionId": "uuid",
  "agent": {
    "id": "uuid",
    "name": "string",
    "type": "string"
  },
  "result": "string",
  "timestamp": "datetime"
}
```

#### `ai_activity`
AI agent activity in project.

**Data:**
```json
{
  "user": {
    "id": "uuid",
    "username": "string"
  },
  "agent": {
    "id": "uuid",
    "name": "string"
  },
  "task": "string",
  "result": "string",
  "timestamp": "datetime"
}
```

#### `user_typing`
User typing indicator.

**Data:**
```json
{
  "user": {
    "id": "uuid",
    "username": "string"
  },
  "isTyping": true,
  "timestamp": "datetime"
}
```

---

## 🗄️ Database Schema

### **Users Table**
```sql
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  avatar_url TEXT,
  role TEXT DEFAULT 'user',
  is_active BOOLEAN DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### **Projects Table**
```sql
CREATE TABLE projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  owner_id TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  settings TEXT, -- JSON string
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES users (id)
);
```

### **Project Collaborators Table**
```sql
CREATE TABLE project_collaborators (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  role TEXT DEFAULT 'collaborator',
  joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects (id),
  FOREIGN KEY (user_id) REFERENCES users (id),
  UNIQUE(project_id, user_id)
);
```

### **Tasks Table**
```sql
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  project_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  assignee_id TEXT,
  created_by TEXT NOT NULL,
  due_date DATETIME,
  tags TEXT, -- JSON array
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects (id),
  FOREIGN KEY (assignee_id) REFERENCES users (id),
  FOREIGN KEY (created_by) REFERENCES users (id)
);
```

### **AI Agents Table**
```sql
CREATE TABLE ai_agents (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  description TEXT,
  capabilities TEXT, -- JSON array
  status TEXT DEFAULT 'active',
  configuration TEXT, -- JSON object
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### **AI Executions Table**
```sql
CREATE TABLE ai_executions (
  id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  project_id TEXT,
  task TEXT NOT NULL,
  context TEXT, -- JSON object
  result TEXT,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  FOREIGN KEY (agent_id) REFERENCES ai_agents (id),
  FOREIGN KEY (user_id) REFERENCES users (id),
  FOREIGN KEY (project_id) REFERENCES projects (id)
);
```

### **File Uploads Table**
```sql
CREATE TABLE file_uploads (
  id TEXT PRIMARY KEY,
  filename TEXT NOT NULL,
  original_name TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size INTEGER NOT NULL,
  path TEXT NOT NULL,
  uploaded_by TEXT NOT NULL,
  project_id TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (uploaded_by) REFERENCES users (id),
  FOREIGN KEY (project_id) REFERENCES projects (id)
);
```

### **User Sessions Table**
```sql
CREATE TABLE user_sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  socket_id TEXT,
  project_id TEXT,
  is_online BOOLEAN DEFAULT 1,
  last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id),
  FOREIGN KEY (project_id) REFERENCES projects (id)
);
```

### **Activity Logs Table**
```sql
CREATE TABLE activity_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  project_id TEXT,
  action TEXT NOT NULL,
  details TEXT, -- JSON object
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users (id),
  FOREIGN KEY (project_id) REFERENCES projects (id)
);
```

---

## 🚀 Getting Started

### **1. Start the Enhanced Server**
```bash
# Start the enhanced server
node server/index-enhanced.cjs
```

### **2. Test the API**
```bash
# Health check
curl http://localhost:4000/api/health

# Register a new user
curl -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:4000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

### **3. WebSocket Connection**
```javascript
const socket = io('http://localhost:4000');

// Authenticate
socket.emit('authenticate', { token: 'your_jwt_token' });

// Join project
socket.emit('join_project', { projectId: 'project_id' });

// Listen for events
socket.on('user_joined', (data) => {
  console.log('User joined:', data.user);
});
```

---

## 🔧 Configuration

### **Environment Variables**
```bash
PORT=4000
FRONTEND_URL=http://localhost:5173
JWT_SECRET=your-secret-key-change-in-production
NODE_ENV=development
```

### **File Upload Limits**
- Maximum file size: 10MB
- Maximum files per request: 5
- Allowed file types: Images, documents, archives

### **Database**
- SQLite database file: `server/data/collaborative_ai.db`
- Automatic table creation and data seeding
- Backup recommended for production

---

## 📊 Monitoring

### **Health Check**
```bash
curl http://localhost:4000/api/health
```

### **Logs**
- Server logs: Console output
- File upload logs: `server/uploads/`
- Database: SQLite file

### **WebSocket Status**
- Connected users: Available via API
- Project rooms: Real-time user count
- Activity logs: Database tracking

This enhanced backend provides a complete foundation for a collaborative AI platform with real-time features, persistent storage, and comprehensive API endpoints!
