// Database configuration and connection
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

class Database {
  constructor() {
    this.db = null;
    this.dbPath = path.join(__dirname, '../data/collaborative_ai.db');
  }

  async connect() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, (err) => {
        if (err) {
          console.error('Error opening database:', err.message);
          reject(err);
        } else {
          console.log('✅ Connected to SQLite database');
          this.initializeTables().then(resolve).catch(reject);
        }
      });
    });
  }

  async initializeTables() {
    const tables = [
      // Users table
      `CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        avatar_url TEXT,
        role TEXT DEFAULT 'user',
        is_active BOOLEAN DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // Projects table
      `CREATE TABLE IF NOT EXISTS projects (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        owner_id TEXT NOT NULL,
        status TEXT DEFAULT 'active',
        settings TEXT, -- JSON string
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (owner_id) REFERENCES users (id)
      )`,

      // Project collaborators table
      `CREATE TABLE IF NOT EXISTS project_collaborators (
        id TEXT PRIMARY KEY,
        project_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        role TEXT DEFAULT 'collaborator',
        joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_id) REFERENCES projects (id),
        FOREIGN KEY (user_id) REFERENCES users (id),
        UNIQUE(project_id, user_id)
      )`,

      // Tasks table
      `CREATE TABLE IF NOT EXISTS tasks (
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
      )`,

      // AI Agents table
      `CREATE TABLE IF NOT EXISTS ai_agents (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        description TEXT,
        capabilities TEXT, -- JSON array
        status TEXT DEFAULT 'active',
        configuration TEXT, -- JSON object
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )`,

      // AI Agent executions table
      `CREATE TABLE IF NOT EXISTS ai_executions (
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
      )`,

      // File uploads table
      `CREATE TABLE IF NOT EXISTS file_uploads (
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
      )`,

      // Real-time sessions table
      `CREATE TABLE IF NOT EXISTS user_sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        socket_id TEXT,
        project_id TEXT,
        is_online BOOLEAN DEFAULT 1,
        last_seen DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (project_id) REFERENCES projects (id)
      )`,

      // Activity logs table
      `CREATE TABLE IF NOT EXISTS activity_logs (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL,
        project_id TEXT,
        action TEXT NOT NULL,
        details TEXT, -- JSON object
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id),
        FOREIGN KEY (project_id) REFERENCES projects (id)
      )`
    ];

    for (const table of tables) {
      await this.run(table);
    }

    // Insert default data
    await this.insertDefaultData();
  }

  async insertDefaultData() {
    // Check if data already exists
    const userCount = await this.get('SELECT COUNT(*) as count FROM users');
    if (userCount.count > 0) return;

    // Insert default users
    const bcrypt = require('bcryptjs');
    const defaultPassword = await bcrypt.hash('password', 10);

    const defaultUsers = [
      {
        id: '1',
        username: 'admin',
        email: 'admin@example.com',
        password_hash: defaultPassword,
        role: 'admin'
      },
      {
        id: '2',
        username: 'designer',
        email: 'designer@example.com',
        password_hash: await bcrypt.hash('design123', 10),
        role: 'designer'
      },
      {
        id: '3',
        username: 'developer',
        email: 'dev@example.com',
        password_hash: await bcrypt.hash('dev123', 10),
        role: 'developer'
      }
    ];

    for (const user of defaultUsers) {
      await this.run(
        'INSERT INTO users (id, username, email, password_hash, role) VALUES (?, ?, ?, ?, ?)',
        [user.id, user.username, user.email, user.password_hash, user.role]
      );
    }

    // Insert default project
    await this.run(
      'INSERT INTO projects (id, name, description, owner_id, settings) VALUES (?, ?, ?, ?, ?)',
      [
        '1',
        'Portfolio Template',
        'A modern portfolio template for creative professionals',
        '1',
        JSON.stringify({ theme: 'minimal', layout: 'grid', aiEnabled: true })
      ]
    );

    // Insert default collaborators
    await this.run(
      'INSERT INTO project_collaborators (id, project_id, user_id, role) VALUES (?, ?, ?, ?)',
      ['1', '1', '2', 'collaborator']
    );
    await this.run(
      'INSERT INTO project_collaborators (id, project_id, user_id, role) VALUES (?, ?, ?, ?)',
      ['2', '1', '3', 'collaborator']
    );

    // Insert default task
    await this.run(
      'INSERT INTO tasks (id, project_id, title, description, status, priority, assignee_id, created_by, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        '1',
        '1',
        'Build collaborative AI platforms like Figma meets Notion',
        'Help me build collaborative AI platforms like Figma meets Notion with GitHub-style resource management',
        'in_progress',
        'high',
        '1',
        '1',
        JSON.stringify(['ai', 'collaboration', 'platform'])
      ]
    );

    // Insert default AI agents
    const defaultAgents = [
      {
        id: '1',
        name: 'Design Assistant',
        type: 'design',
        description: 'Helps with UI/UX design and visual elements',
        capabilities: JSON.stringify(['color_schemes', 'layout_suggestions', 'component_generation']),
        configuration: JSON.stringify({ model: 'gpt-4', temperature: 0.7 })
      },
      {
        id: '2',
        name: 'Code Generator',
        type: 'development',
        description: 'Generates code based on design specifications',
        capabilities: JSON.stringify(['react_components', 'styling', 'api_integration']),
        configuration: JSON.stringify({ model: 'gpt-4', temperature: 0.3 })
      },
      {
        id: '3',
        name: 'Content Writer',
        type: 'content',
        description: 'Creates and optimizes content for projects',
        capabilities: JSON.stringify(['copywriting', 'seo_optimization', 'content_strategy']),
        configuration: JSON.stringify({ model: 'gpt-4', temperature: 0.8 })
      }
    ];

    for (const agent of defaultAgents) {
      await this.run(
        'INSERT INTO ai_agents (id, name, type, description, capabilities, configuration) VALUES (?, ?, ?, ?, ?, ?)',
        [agent.id, agent.name, agent.type, agent.description, agent.capabilities, agent.configuration]
      );
    }

    console.log('✅ Default data inserted successfully');
  }

  async run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve({ id: this.lastID, changes: this.changes });
        }
      });
    });
  }

  async get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  async all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  async close() {
    return new Promise((resolve) => {
      this.db.close((err) => {
        if (err) {
          console.error('Error closing database:', err.message);
        } else {
          console.log('Database connection closed');
        }
        resolve();
      });
    });
  }
}

module.exports = new Database();
