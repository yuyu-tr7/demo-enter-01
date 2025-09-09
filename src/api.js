// API service for communicating with the backend
const API_BASE_URL = 'http://localhost:4000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('authToken');
  }

  setToken(token) {
    this.token = token;
    localStorage.setItem('authToken', token);
  }

  getHeaders() {
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }
      
      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Authentication
  async login(username, password) {
    const response = await this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    
    if (response.success) {
      this.setToken(response.token);
    }
    
    return response;
  }

  async register(username, password, email) {
    const response = await this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, email }),
    });
    
    if (response.success) {
      this.setToken(response.token);
    }
    
    return response;
  }

  // Projects
  async getProjects() {
    return this.request('/projects');
  }

  async createProject(name, description, settings = {}) {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify({ name, description, settings }),
    });
  }

  async getProject(id) {
    return this.request(`/projects/${id}`);
  }

  // Tasks
  async getProjectTasks(projectId) {
    return this.request(`/projects/${projectId}/tasks`);
  }

  async createTask(projectId, title, description, priority = 'medium', tags = []) {
    return this.request(`/projects/${projectId}/tasks`, {
      method: 'POST',
      body: JSON.stringify({ title, description, priority, tags }),
    });
  }

  // AI Agents
  async getAgents() {
    return this.request('/agents');
  }

  async executeAgent(agentId, task, context = {}) {
    return this.request(`/agents/${agentId}/execute`, {
      method: 'POST',
      body: JSON.stringify({ task, context }),
    });
  }

  // Collaboration
  async getCollaborators(projectId) {
    return this.request(`/projects/${projectId}/collaborators`);
  }

  async addCollaborator(projectId, userId) {
    return this.request(`/projects/${projectId}/collaborators`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  // Content Management
  async getProjectContent(projectId) {
    return this.request(`/projects/${projectId}/content`);
  }

  async updateProjectContent(projectId, content) {
    return this.request(`/projects/${projectId}/content`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
  }

  // File Upload
  async uploadFile(file) {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.request('/upload', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${this.token}`,
      },
    });
  }

  // Health Check
  async healthCheck() {
    return this.request('/health');
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;

