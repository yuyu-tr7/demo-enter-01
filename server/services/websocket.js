// WebSocket service for real-time collaboration
const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const database = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

class WebSocketService {
  constructor(server) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        methods: ["GET", "POST"]
      }
    });

    this.connectedUsers = new Map(); // socketId -> user info
    this.projectRooms = new Map(); // projectId -> Set of socketIds
    this.userSessions = new Map(); // userId -> socketId

    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.io.on('connection', (socket) => {
      console.log(`🔌 New connection: ${socket.id}`);

      // Handle authentication
      socket.on('authenticate', async (data) => {
        try {
          const decoded = jwt.verify(data.token, JWT_SECRET);
          const user = await database.get(
            'SELECT id, username, email, role FROM users WHERE id = ? AND is_active = 1',
            [decoded.id]
          );

          if (user) {
            this.connectedUsers.set(socket.id, user);
            this.userSessions.set(user.id, socket.id);

            // Update user session in database
            await database.run(
              'INSERT OR REPLACE INTO user_sessions (id, user_id, socket_id, is_online, last_seen) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)',
              [socket.id, user.id, socket.id, 1]
            );

            socket.emit('authenticated', { user });
            console.log(`✅ User authenticated: ${user.username} (${socket.id})`);
          } else {
            socket.emit('auth_error', { message: 'Invalid user' });
          }
        } catch (error) {
          console.error('Authentication error:', error);
          socket.emit('auth_error', { message: 'Invalid token' });
        }
      });

      // Handle joining project room
      socket.on('join_project', async (data) => {
        const user = this.connectedUsers.get(socket.id);
        if (!user) {
          socket.emit('error', { message: 'Not authenticated' });
          return;
        }

        const { projectId } = data;
        
        // Check if user has access to project
        const project = await database.get(
          `SELECT p.*, pc.role as user_role 
           FROM projects p 
           LEFT JOIN project_collaborators pc ON p.id = pc.project_id AND pc.user_id = ?
           WHERE p.id = ? AND (p.owner_id = ? OR pc.user_id IS NOT NULL)`,
          [user.id, projectId, user.id]
        );

        if (!project) {
          socket.emit('error', { message: 'Access denied to project' });
          return;
        }

        // Join project room
        socket.join(`project_${projectId}`);
        
        if (!this.projectRooms.has(projectId)) {
          this.projectRooms.set(projectId, new Set());
        }
        this.projectRooms.get(projectId).add(socket.id);

        // Notify others in the project
        socket.to(`project_${projectId}`).emit('user_joined', {
          user: user,
          timestamp: new Date().toISOString()
        });

        // Send current project users
        const projectUsers = Array.from(this.projectRooms.get(projectId))
          .map(socketId => this.connectedUsers.get(socketId))
          .filter(Boolean);

        socket.emit('project_users', { users: projectUsers });

        console.log(`👥 User ${user.username} joined project ${projectId}`);
      });

      // Handle leaving project room
      socket.on('leave_project', (data) => {
        const user = this.connectedUsers.get(socket.id);
        const { projectId } = data;

        if (projectId && this.projectRooms.has(projectId)) {
          this.projectRooms.get(projectId).delete(socket.id);
          socket.leave(`project_${projectId}`);

          // Notify others
          socket.to(`project_${projectId}`).emit('user_left', {
            user: user,
            timestamp: new Date().toISOString()
          });
        }
      });

      // Handle real-time editing
      socket.on('document_edit', (data) => {
        const user = this.connectedUsers.get(socket.id);
        if (!user) return;

        const { projectId, changes } = data;
        
        // Broadcast changes to other users in the project
        socket.to(`project_${projectId}`).emit('document_updated', {
          user: user,
          changes: changes,
          timestamp: new Date().toISOString()
        });
      });

      // Handle cursor position updates
      socket.on('cursor_update', (data) => {
        const user = this.connectedUsers.get(socket.id);
        if (!user) return;

        const { projectId, position } = data;
        
        socket.to(`project_${projectId}`).emit('cursor_moved', {
          user: user,
          position: position,
          timestamp: new Date().toISOString()
        });
      });

      // Handle task updates
      socket.on('task_update', async (data) => {
        const user = this.connectedUsers.get(socket.id);
        if (!user) return;

        const { projectId, taskId, updates } = data;

        try {
          // Update task in database
          const updateFields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
          const updateValues = Object.values(updates);
          updateValues.push(taskId);

          await database.run(
            `UPDATE tasks SET ${updateFields}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            updateValues
          );

          // Broadcast update to project room
          this.io.to(`project_${projectId}`).emit('task_updated', {
            taskId: taskId,
            updates: updates,
            updatedBy: user,
            timestamp: new Date().toISOString()
          });

          // Log activity
          await database.run(
            'INSERT INTO activity_logs (id, user_id, project_id, action, details) VALUES (?, ?, ?, ?, ?)',
            [
              require('uuid').v4(),
              user.id,
              projectId,
              'task_updated',
              JSON.stringify({ taskId, updates })
            ]
          );

        } catch (error) {
          console.error('Task update error:', error);
          socket.emit('error', { message: 'Failed to update task' });
        }
      });

      // Handle AI agent requests
      socket.on('ai_request', async (data) => {
        const user = this.connectedUsers.get(socket.id);
        if (!user) return;

        const { projectId, agentId, task, context } = data;

        try {
          // Create AI execution record
          const executionId = require('uuid').v4();
          await database.run(
            'INSERT INTO ai_executions (id, agent_id, user_id, project_id, task, context, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [executionId, agentId, user.id, projectId, task, JSON.stringify(context), 'pending']
          );

          // Get agent details
          const agent = await database.get('SELECT * FROM ai_agents WHERE id = ?', [agentId]);
          if (!agent) {
            socket.emit('ai_error', { message: 'Agent not found' });
            return;
          }

          // Simulate AI processing (in real implementation, call AI API)
          setTimeout(async () => {
            const result = `AI Agent "${agent.name}" processed: ${task}`;
            
            // Update execution record
            await database.run(
              'UPDATE ai_executions SET result = ?, status = ?, completed_at = CURRENT_TIMESTAMP WHERE id = ?',
              [result, 'completed', executionId]
            );

            // Send result to user
            socket.emit('ai_response', {
              executionId: executionId,
              agent: agent,
              result: result,
              timestamp: new Date().toISOString()
            });

            // Broadcast to project room
            this.io.to(`project_${projectId}`).emit('ai_activity', {
              user: user,
              agent: agent,
              task: task,
              result: result,
              timestamp: new Date().toISOString()
            });

          }, 2000); // Simulate processing time

        } catch (error) {
          console.error('AI request error:', error);
          socket.emit('ai_error', { message: 'Failed to process AI request' });
        }
      });

      // Handle typing indicators
      socket.on('typing_start', (data) => {
        const user = this.connectedUsers.get(socket.id);
        if (!user) return;

        socket.to(`project_${data.projectId}`).emit('user_typing', {
          user: user,
          isTyping: true,
          timestamp: new Date().toISOString()
        });
      });

      socket.on('typing_stop', (data) => {
        const user = this.connectedUsers.get(socket.id);
        if (!user) return;

        socket.to(`project_${data.projectId}`).emit('user_typing', {
          user: user,
          isTyping: false,
          timestamp: new Date().toISOString()
        });
      });

      // Handle disconnection
      socket.on('disconnect', async () => {
        const user = this.connectedUsers.get(socket.id);
        
        if (user) {
          // Update user session
          await database.run(
            'UPDATE user_sessions SET is_online = 0, last_seen = CURRENT_TIMESTAMP WHERE socket_id = ?',
            [socket.id]
          );

          // Remove from project rooms
          for (const [projectId, socketIds] of this.projectRooms.entries()) {
            if (socketIds.has(socket.id)) {
              socketIds.delete(socket.id);
              socket.to(`project_${projectId}`).emit('user_left', {
                user: user,
                timestamp: new Date().toISOString()
              });
            }
          }

          this.userSessions.delete(user.id);
          console.log(`👋 User disconnected: ${user.username} (${socket.id})`);
        }

        this.connectedUsers.delete(socket.id);
      });
    });
  }

  // Get connected users for a project
  getProjectUsers(projectId) {
    if (!this.projectRooms.has(projectId)) {
      return [];
    }

    return Array.from(this.projectRooms.get(projectId))
      .map(socketId => this.connectedUsers.get(socketId))
      .filter(Boolean);
  }

  // Broadcast to project room
  broadcastToProject(projectId, event, data) {
    this.io.to(`project_${projectId}`).emit(event, data);
  }

  // Send to specific user
  sendToUser(userId, event, data) {
    const socketId = this.userSessions.get(userId);
    if (socketId) {
      this.io.to(socketId).emit(event, data);
    }
  }
}

module.exports = WebSocketService;
