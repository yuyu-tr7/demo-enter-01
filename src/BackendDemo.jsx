import React, { useState, useEffect } from 'react';
import apiService from './api';

function BackendDemo() {
  const [projects, setProjects] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [agentTask, setAgentTask] = useState('');
  const [selectedAgent, setSelectedAgent] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Try to login first (using demo credentials)
      await apiService.login('admin', 'password');
      
      // Load projects and agents
      const [projectsRes, agentsRes] = await Promise.all([
        apiService.getProjects(),
        apiService.getAgents()
      ]);
      
      setProjects(projectsRes.projects);
      setAgents(agentsRes.agents);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const executeAgent = async () => {
    if (!selectedAgent || !agentTask) return;
    
    setLoading(true);
    try {
      const response = await apiService.executeAgent(selectedAgent, agentTask);
      alert(`Agent Response: ${response.response.result}`);
      setAgentTask('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createNewProject = async () => {
    const name = prompt('Enter project name:');
    if (!name) return;
    
    setLoading(true);
    try {
      const response = await apiService.createProject(name, 'A new collaborative project');
      setProjects([...projects, response.project]);
      alert('Project created successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-white">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-600 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-600 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 text-white">
      <h3 className="text-lg font-semibold mb-4">Backend Integration Demo</h3>
      
      {error && (
        <div className="bg-red-600 text-white p-3 rounded mb-4">
          Error: {error}
        </div>
      )}

      <div className="space-y-4">
        {/* Projects Section */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium">Projects ({projects.length})</h4>
            <button 
              onClick={createNewProject}
              className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
            >
              + New Project
            </button>
          </div>
          <div className="space-y-2">
            {projects.map(project => (
              <div key={project.id} className="bg-gray-700 p-3 rounded">
                <div className="font-medium">{project.name}</div>
                <div className="text-sm text-gray-300">{project.description}</div>
                <div className="text-xs text-gray-400">
                  Status: {project.status} | Collaborators: {project.collaborators.length}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Agents Section */}
        <div>
          <h4 className="font-medium mb-2">AI Agents ({agents.length})</h4>
          <div className="space-y-2">
            {agents.map(agent => (
              <div key={agent.id} className="bg-gray-700 p-3 rounded">
                <div className="font-medium">{agent.name}</div>
                <div className="text-sm text-gray-300">{agent.description}</div>
                <div className="text-xs text-gray-400">
                  Type: {agent.type} | Status: {agent.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Agent Execution */}
        <div>
          <h4 className="font-medium mb-2">Execute AI Agent</h4>
          <div className="space-y-2">
            <select 
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white"
            >
              <option value="">Select an agent</option>
              {agents.map(agent => (
                <option key={agent.id} value={agent.id}>{agent.name}</option>
              ))}
            </select>
            <input
              type="text"
              value={agentTask}
              onChange={(e) => setAgentTask(e.target.value)}
              placeholder="Enter task for the agent..."
              className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-400"
            />
            <button 
              onClick={executeAgent}
              disabled={!selectedAgent || !agentTask}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-4 py-2 rounded text-sm"
            >
              Execute Agent
            </button>
          </div>
        </div>

        {/* API Status */}
        <div className="pt-4 border-t border-gray-600">
          <div className="text-sm text-gray-400">
            Backend API: <span className="text-green-400">Connected</span>
          </div>
          <div className="text-xs text-gray-500">
            Endpoint: http://localhost:4000/api
          </div>
        </div>
      </div>
    </div>
  );
}

export default BackendDemo;

