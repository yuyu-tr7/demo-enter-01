// File upload service
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const database = require('../config/database');

// Ensure upload directories exist
const uploadDir = path.join(__dirname, '../uploads');
const imageDir = path.join(uploadDir, 'images');
const documentDir = path.join(uploadDir, 'documents');
const tempDir = path.join(uploadDir, 'temp');

[uploadDir, imageDir, documentDir, tempDir].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath = tempDir;
    
    // Determine upload path based on file type
    if (file.mimetype.startsWith('image/')) {
      uploadPath = imageDir;
    } else if (file.mimetype.includes('document') || 
               file.mimetype.includes('text') ||
               file.mimetype.includes('pdf') ||
               file.mimetype.includes('word') ||
               file.mimetype.includes('excel') ||
               file.mimetype.includes('powerpoint')) {
      uploadPath = documentDir;
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueName = `${uuidv4()}_${Date.now()}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'application/pdf',
    'text/plain',
    'text/csv',
    'application/json',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/zip',
    'application/x-zip-compressed'
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error(`File type ${file.mimetype} not allowed`), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 5 // Maximum 5 files per request
  }
});

// File upload middleware
const uploadMiddleware = upload.array('files', 5);

// Process uploaded files
const processUploadedFiles = async (files, userId, projectId = null) => {
  const processedFiles = [];

  for (const file of files) {
    try {
      // Generate file ID
      const fileId = uuidv4();
      
      // Get file stats
      const stats = fs.statSync(file.path);
      
      // Create file record in database
      await database.run(
        `INSERT INTO file_uploads 
         (id, filename, original_name, mime_type, size, path, uploaded_by, project_id) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          fileId,
          file.filename,
          file.originalname,
          file.mimetype,
          stats.size,
          file.path,
          userId,
          projectId
        ]
      );

      // Generate file URL
      const fileUrl = `/api/files/${fileId}`;

      processedFiles.push({
        id: fileId,
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: stats.size,
        url: fileUrl,
        uploadedAt: new Date().toISOString()
      });

    } catch (error) {
      console.error('Error processing file:', error);
      // Clean up file if database insert failed
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }
    }
  }

  return processedFiles;
};

// Get file by ID
const getFileById = async (fileId) => {
  return await database.get(
    'SELECT * FROM file_uploads WHERE id = ?',
    [fileId]
  );
};

// Get files by project
const getProjectFiles = async (projectId) => {
  return await database.all(
    `SELECT f.*, u.username as uploaded_by_username 
     FROM file_uploads f 
     JOIN users u ON f.uploaded_by = u.id 
     WHERE f.project_id = ? 
     ORDER BY f.created_at DESC`,
    [projectId]
  );
};

// Get user files
const getUserFiles = async (userId) => {
  return await database.all(
    `SELECT f.*, p.name as project_name 
     FROM file_uploads f 
     LEFT JOIN projects p ON f.project_id = p.id 
     WHERE f.uploaded_by = ? 
     ORDER BY f.created_at DESC`,
    [userId]
  );
};

// Delete file
const deleteFile = async (fileId, userId) => {
  try {
    // Get file info
    const file = await database.get(
      'SELECT * FROM file_uploads WHERE id = ? AND uploaded_by = ?',
      [fileId, userId]
    );

    if (!file) {
      throw new Error('File not found or access denied');
    }

    // Delete physical file
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    // Delete database record
    await database.run(
      'DELETE FROM file_uploads WHERE id = ?',
      [fileId]
    );

    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    throw error;
  }
};

// Clean up old temporary files
const cleanupTempFiles = async () => {
  try {
    const files = fs.readdirSync(tempDir);
    const now = Date.now();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours

    for (const file of files) {
      const filePath = path.join(tempDir, file);
      const stats = fs.statSync(filePath);
      
      if (now - stats.mtime.getTime() > maxAge) {
        fs.unlinkSync(filePath);
        console.log(`Cleaned up temp file: ${file}`);
      }
    }
  } catch (error) {
    console.error('Error cleaning up temp files:', error);
  }
};

// Image optimization (basic resize)
const optimizeImage = async (filePath, maxWidth = 1920, maxHeight = 1080) => {
  // This is a placeholder - in production, use sharp or similar library
  // For now, just return the original file path
  return filePath;
};

// Generate thumbnail
const generateThumbnail = async (filePath, size = 200) => {
  // This is a placeholder - in production, use sharp or similar library
  // For now, just return the original file path
  return filePath;
};

module.exports = {
  uploadMiddleware,
  processUploadedFiles,
  getFileById,
  getProjectFiles,
  getUserFiles,
  deleteFile,
  cleanupTempFiles,
  optimizeImage,
  generateThumbnail
};
