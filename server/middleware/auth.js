// Authentication middleware
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const database = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      username: user.username, 
      email: user.email, 
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
};

// Verify JWT token
const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Hash password
const hashPassword = async (password) => {
  return await bcrypt.hash(password, 10);
};

// Compare password
const comparePassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access token required' 
    });
  }

  try {
    const decoded = verifyToken(token);
    if (!decoded) {
      return res.status(403).json({ 
        success: false, 
        message: 'Invalid or expired token' 
      });
    }

    // Get user from database
    const user = await database.get(
      'SELECT id, username, email, role, is_active FROM users WHERE id = ? AND is_active = 1',
      [decoded.id]
    );

    if (!user) {
      return res.status(403).json({ 
        success: false, 
        message: 'User not found or inactive' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(403).json({ 
      success: false, 
      message: 'Invalid token' 
    });
  }
};

// Role-based authorization middleware
const authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: 'Insufficient permissions' 
      });
    }

    next();
  };
};

// Project access middleware
const checkProjectAccess = async (req, res, next) => {
  try {
    const { projectId } = req.params;
    const userId = req.user.id;

    if (!projectId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Project ID required' 
      });
    }

    // Check if user is owner or collaborator
    const project = await database.get(
      `SELECT p.*, pc.role as user_role 
       FROM projects p 
       LEFT JOIN project_collaborators pc ON p.id = pc.project_id AND pc.user_id = ?
       WHERE p.id = ? AND (p.owner_id = ? OR pc.user_id IS NOT NULL)`,
      [userId, projectId, userId]
    );

    if (!project) {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied to this project' 
      });
    }

    req.project = project;
    next();
  } catch (error) {
    console.error('Project access check error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};

// Optional authentication (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token) {
    try {
      const decoded = verifyToken(token);
      if (decoded) {
        const user = await database.get(
          'SELECT id, username, email, role, is_active FROM users WHERE id = ? AND is_active = 1',
          [decoded.id]
        );
        if (user) {
          req.user = user;
        }
      }
    } catch (error) {
      // Ignore auth errors for optional auth
    }
  }

  next();
};

module.exports = {
  generateToken,
  verifyToken,
  hashPassword,
  comparePassword,
  authenticateToken,
  authorize,
  checkProjectAccess,
  optionalAuth
};
