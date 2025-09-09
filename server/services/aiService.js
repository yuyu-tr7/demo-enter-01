// AI Service for integrating with AI agents
const database = require('../config/database');
const { v4: uuidv4 } = require('uuid');

class AIService {
  constructor() {
    this.agents = new Map();
    this.loadAgents();
  }

  async loadAgents() {
    try {
      const agents = await database.all('SELECT * FROM ai_agents WHERE status = "active"');
      agents.forEach(agent => {
        this.agents.set(agent.id, {
          ...agent,
          capabilities: JSON.parse(agent.capabilities || '[]'),
          configuration: JSON.parse(agent.configuration || '{}')
        });
      });
      console.log(`✅ Loaded ${agents.length} AI agents`);
    } catch (error) {
      console.error('Error loading AI agents:', error);
    }
  }

  // Get all available agents
  async getAgents() {
    return Array.from(this.agents.values());
  }

  // Get agent by ID
  async getAgent(agentId) {
    return this.agents.get(agentId);
  }

  // Execute AI agent task
  async executeAgent(agentId, task, context = {}, userId, projectId = null) {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error('Agent not found');
    }

    // Create execution record
    const executionId = uuidv4();
    await database.run(
      'INSERT INTO ai_executions (id, agent_id, user_id, project_id, task, context, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [executionId, agentId, userId, projectId, task, JSON.stringify(context), 'pending']
    );

    try {
      // Simulate AI processing based on agent type
      const result = await this.processTask(agent, task, context);
      
      // Update execution record
      await database.run(
        'UPDATE ai_executions SET result = ?, status = ?, completed_at = CURRENT_TIMESTAMP WHERE id = ?',
        [result, 'completed', executionId]
      );

      return {
        executionId,
        agent,
        result,
        status: 'completed',
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      // Update execution record with error
      await database.run(
        'UPDATE ai_executions SET result = ?, status = ?, completed_at = CURRENT_TIMESTAMP WHERE id = ?',
        [error.message, 'failed', executionId]
      );

      throw error;
    }
  }

  // Process task based on agent type
  async processTask(agent, task, context) {
    switch (agent.type) {
      case 'design':
        return await this.processDesignTask(agent, task, context);
      case 'development':
        return await this.processDevelopmentTask(agent, task, context);
      case 'content':
        return await this.processContentTask(agent, task, context);
      case 'analysis':
        return await this.processAnalysisTask(agent, task, context);
      default:
        return await this.processGenericTask(agent, task, context);
    }
  }

  // Design agent processing
  async processDesignTask(agent, task, context) {
    const responses = {
      'color_schemes': `Here's a color scheme for your project:
        - Primary: #3B82F6 (Blue)
        - Secondary: #10B981 (Green) 
        - Accent: #F59E0B (Amber)
        - Neutral: #6B7280 (Gray)
        - Background: #F9FAFB (Light Gray)`,
      
      'layout_suggestions': `Layout suggestions for your design:
        - Use a 12-column grid system
        - Implement responsive breakpoints at 768px, 1024px, 1280px
        - Maintain 16px base spacing unit
        - Use consistent 8px spacing scale`,
      
      'component_generation': `Component design recommendations:
        - Create reusable button variants (primary, secondary, ghost)
        - Implement consistent form field styling
        - Use consistent typography scale (12px, 14px, 16px, 20px, 24px, 32px)
        - Apply consistent border radius (4px, 8px, 12px)`
    };

    // Find matching capability
    for (const capability of agent.capabilities) {
      if (task.toLowerCase().includes(capability.replace('_', ' '))) {
        return responses[capability] || `Design suggestion: ${task}`;
      }
    }

    return `Design Assistant: I can help with color schemes, layout suggestions, and component generation. For "${task}", I recommend focusing on user experience and visual hierarchy.`;
  }

  // Development agent processing
  async processDevelopmentTask(agent, task, context) {
    const responses = {
      'react_components': `Here's a React component for your request:
        \`\`\`jsx
        import React from 'react';
        
        const ${this.camelCase(task)} = ({ className = '', ...props }) => {
          return (
            <div className={\`component \${className}\`} {...props}>
              {/* Component implementation */}
            </div>
          );
        };
        
        export default ${this.camelCase(task)};
        \`\`\``,
      
      'styling': `CSS styling recommendations:
        \`\`\`css
        .${this.kebabCase(task)} {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          padding: 1rem;
          border-radius: 0.5rem;
          background: white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        \`\`\``,
      
      'api_integration': `API integration pattern:
        \`\`\`javascript
        const apiCall = async (endpoint, options = {}) => {
          try {
            const response = await fetch(\`/api/\${endpoint}\`, {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': \`Bearer \${token}\`
              },
              ...options
            });
            
            if (!response.ok) throw new Error('API call failed');
            return await response.json();
          } catch (error) {
            console.error('API Error:', error);
            throw error;
          }
        };
        \`\`\``
    };

    for (const capability of agent.capabilities) {
      if (task.toLowerCase().includes(capability.replace('_', ' '))) {
        return responses[capability] || `Development solution: ${task}`;
      }
    }

    return `Code Generator: I can help with React components, styling, and API integration. For "${task}", I recommend following React best practices and maintaining clean, readable code.`;
  }

  // Content agent processing
  async processContentTask(agent, task, context) {
    const responses = {
      'copywriting': `Copywriting suggestions for "${task}":
        - Use clear, concise language
        - Focus on benefits rather than features
        - Include a strong call-to-action
        - Maintain consistent brand voice
        - Use active voice and short sentences`,
      
      'seo_optimization': `SEO optimization for your content:
        - Include target keywords naturally
        - Write compelling meta descriptions (150-160 characters)
        - Use proper heading hierarchy (H1, H2, H3)
        - Include internal and external links
        - Optimize for featured snippets`,
      
      'content_strategy': `Content strategy recommendations:
        - Define your target audience
        - Create content pillars around your expertise
        - Plan content calendar with consistent publishing
        - Repurpose content across different formats
        - Measure engagement and adjust strategy`
    };

    for (const capability of agent.capabilities) {
      if (task.toLowerCase().includes(capability.replace('_', ' '))) {
        return responses[capability] || `Content suggestion: ${task}`;
      }
    }

    return `Content Writer: I can help with copywriting, SEO optimization, and content strategy. For "${task}", I recommend focusing on your audience's needs and maintaining a consistent brand voice.`;
  }

  // Analysis agent processing
  async processAnalysisTask(agent, task, context) {
    return `Analysis Agent: I can help analyze data, identify patterns, and provide insights. For "${task}", I recommend:
      - Collecting relevant data points
      - Identifying key metrics and KPIs
      - Looking for trends and patterns
      - Providing actionable recommendations
      - Creating visual representations of findings`;
  }

  // Generic task processing
  async processGenericTask(agent, task, context) {
    return `${agent.name}: I can help with ${agent.capabilities.join(', ')}. For "${task}", I recommend considering the context and requirements carefully.`;
  }

  // Utility functions
  camelCase(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
  }

  kebabCase(str) {
    return str.replace(/([a-z])([A-Z])/g, '$1-$2')
              .replace(/[\s_]+/g, '-')
              .toLowerCase();
  }

  // Get execution history
  async getExecutionHistory(userId, projectId = null, limit = 50) {
    let query = `
      SELECT e.*, a.name as agent_name, a.type as agent_type
      FROM ai_executions e
      JOIN ai_agents a ON e.agent_id = a.id
      WHERE e.user_id = ?
    `;
    
    const params = [userId];
    
    if (projectId) {
      query += ' AND e.project_id = ?';
      params.push(projectId);
    }
    
    query += ' ORDER BY e.created_at DESC LIMIT ?';
    params.push(limit);
    
    return await database.all(query, params);
  }

  // Get agent statistics
  async getAgentStats(agentId) {
    const stats = await database.get(`
      SELECT 
        COUNT(*) as total_executions,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as successful_executions,
        COUNT(CASE WHEN status = 'failed' THEN 1 END) as failed_executions,
        AVG(CASE WHEN completed_at IS NOT NULL THEN 
          (julianday(completed_at) - julianday(created_at)) * 24 * 60 * 60 
        END) as avg_processing_time_seconds
      FROM ai_executions 
      WHERE agent_id = ?
    `, [agentId]);

    return stats;
  }
}

module.exports = new AIService();
