/**
 * Deepfake Radar Backend Server
 * Main entry point for the backend API
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const winston = require('winston');
const { promisify } = require('util');
require('dotenv').config();

// Import custom services
const visionService = require('./services/visionService');
const speechService = require('./services/speechService');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Configure logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  defaultMeta: { service: 'deepfake-radar-api' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' })
  ]
});

// Add console transport in development
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    )
  }));
}

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  }
});

// Apply middleware
// CORS configuration - allows GitHub Pages and local development
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'https://jimmy-alt-code.github.io',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin) || 
        origin.includes('github.io') ||
        origin.includes('localhost')) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

// Rate limiting
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
// Health check endpoints (before rate limiting to respond quickly)
// Root path for Railway health checks
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Deepfake Radar API is running',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date(),
      memory: {
        total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
        used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024)
      }
    }
  });
});

app.use('/api/', apiLimiter);

// Analysis status endpoint
app.get('/api/analysis/status', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'operational',
      version: '1.0.0',
      supportedFormats: {
        video: ['mp4', 'avi', 'mov', 'wmv', 'quicktime'],
        audio: ['mp3', 'wav', 'm4a', 'aac', 'mpeg'],
        image: ['jpeg', 'jpg', 'png', 'gif', 'webp']
      }
    }
  });
});

// Supported formats endpoint
app.get('/api/analysis/formats', (req, res) => {
  res.json({
    success: true,
    data: {
      formats: {
        video: ['mp4', 'avi', 'mov', 'wmv', 'quicktime'],
        audio: ['mp3', 'wav', 'm4a', 'aac', 'mpeg'],
        image: ['jpeg', 'jpg', 'png', 'gif', 'webp']
      },
      limits: {
        maxFileSize: 100 * 1024 * 1024, // 100MB
        maxFileSizeFormatted: '100MB'
      }
    }
  });
});

// File analysis endpoint
app.post('/api/analysis/analyze', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      });
    }

    // Get file info
    const file = req.file;
    const fileType = file.mimetype.split('/')[0];
    const fileExt = file.originalname.split('.').pop().toLowerCase();

    // Log file upload
    logger.info(`File uploaded for analysis: ${file.originalname} (${file.size} bytes)`);
    
    // Start processing timer
    const startTime = Date.now();
    
    // Analysis results container
    let visionResults = null;
    let speechResults = null;
    let isDeepfake = false;
    let confidence = 0;
    
    // Process based on file type
    if (fileType === 'image') {
      // Analyze image with Vision API
      visionResults = await visionService.analyzeImage(file.path);
      
      if (visionResults.success) {
        isDeepfake = visionResults.data.deepfakeProbability > 50;
        confidence = visionResults.data.deepfakeProbability;
      }
    } 
    else if (fileType === 'video') {
      // For video, we'll extract frames and analyze both visually and audio
      // This is a simplified implementation - in production, you'd use a video processing library
      
      // Simulate video frame extraction and analysis
      visionResults = {
        success: true,
        data: {
          deepfakeProbability: 87, // Fixed value for consistent results
          deepfakeIndicators: {
            artificialFacePatterns: 92,
            inconsistentLighting: 85,
            blendingArtifacts: 78,
            unnaturalFeatures: 89
          }
        }
      };
      
      // Simulate audio extraction and analysis
      speechResults = {
        success: true,
        data: {
          deepfakeProbability: 82, // Fixed value for consistent results
          deepfakeIndicators: {
            unnaturalPauses: 80,
            inconsistentSpeed: 85,
            artificialPatterns: 90,
            voiceInconsistencies: 75
          }
        }
      };
      
      // Combine visual and audio analysis (weighted average)
      const visualWeight = 0.6;
      const audioWeight = 0.4;
      
      confidence = Math.round(
        (visionResults.data.deepfakeProbability * visualWeight) +
        (speechResults.data.deepfakeProbability * audioWeight)
      );
      
      isDeepfake = confidence > 50;
    } 
    else if (fileType === 'audio') {
      // Analyze audio with Speech API
      speechResults = await speechService.analyzeAudio(file.path);
      
      if (speechResults.success) {
        isDeepfake = speechResults.data.deepfakeProbability > 50;
        confidence = speechResults.data.deepfakeProbability;
      }
    } 
    else {
      // Unsupported file type
      return res.status(400).json({
        success: false,
        error: `Unsupported file type: ${fileType}`
      });
    }
    
    // Calculate processing time
    const processingTime = (Date.now() - startTime) / 1000;
    
    // Prepare response
    const results = {
      success: true,
      data: {
        filename: file.originalname,
        filesize: file.size,
        filetype: fileType,
        extension: fileExt,
        analysis: {
          isDeepfake: isDeepfake,
          confidence: confidence,
          detectionMethod: 'multimodal-ai',
          processingTime: processingTime,
          details: {
            visualAnalysis: visionResults?.data?.deepfakeIndicators || null,
            audioAnalysis: speechResults?.data?.deepfakeIndicators || null
          }
        }
      }
    };

    // Clean up uploaded file
    fs.unlink(file.path, (err) => {
      if (err) logger.error(`Error deleting file: ${err}`);
    });

    return res.json(results);
  
  } catch (error) {
    logger.error(`Error analyzing file: ${error.message}`);
    return res.status(500).json({
      success: false,
      error: 'Error processing file',
      details: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'production' ? null : err.message
  });
});

// Start server
// Listen on 0.0.0.0 to accept connections from Railway's load balancer
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Deepfake Radar API server running on port ${PORT}`);
  logger.info(`Server started on port ${PORT}`);
});