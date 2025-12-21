// Deepfake Radar Backend API Integration
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3002';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'multipart/form-data'
  }
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log('📤 API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging and error handling
api.interceptors.response.use(
  (response) => {
    console.log('✅ API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.status, error.message);
    
    // Enhance error messages
    if (error.response?.data?.error) {
      error.message = error.response.data.error;
    } else if (error.code === 'ECONNREFUSED') {
      error.message = 'Backend server is not running. Please start it with: npm start';
    } else if (error.code === 'TIMEOUT') {
      error.message = 'Request timed out. The file might be too large or the server is busy.';
    }
    
    return Promise.reject(error);
  }
);

// Main analysis function
export const analyzeFile = async (file) => {
  if (!file) {
    throw new Error('No file provided for analysis');
  }

  console.log('🔍 Starting analysis for:', file.name, `(${(file.size / 1024 / 1024).toFixed(2)}MB)`);

  const formData = new FormData();
  formData.append('file', file);

  try {
    const startTime = Date.now();
    
    const response = await api.post('/api/analysis/analyze', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    const uploadTime = Date.now() - startTime;
    console.log(`⏱️ Analysis completed in ${uploadTime}ms`);

    if (response.data?.success) {
      const results = response.data.data;
      
      // Transform backend response to match frontend expectations
      const transformedResults = {
        // Map new backend format to existing frontend format
        confidence: results.overall_probability || results.confidence || 50,
        status: results.overall_probability > 0.5 ? 'Likely Deepfake' : 'Real',
        explanation: results.explanation || 'Analysis completed successfully.',
        processingTime: results.metadata?.processing_time || `${uploadTime}ms`,
        framesAnalyzed: results.metadata?.frames_analyzed || 'N/A',
        modelVersion: 'DeepfakeRadar v3.0.0 (Forensic Pipeline)',
        riskLevel: results.overall_probability > 0.7 ? 'High' : results.overall_probability > 0.3 ? 'Medium' : 'Low',
        
        // New enhanced features
        overall_probability: results.overall_probability,
        evidence: results.evidence || [],
        signals: results.signals || {},
        metadata: results.metadata || {},
        
        // Technical details
        uploadTime: uploadTime,
        fileInfo: {
          originalName: file.name,
          size: file.size,
          type: file.type
        },
        
        // Create timestamps from evidence for backward compatibility
        timestamps: results.evidence?.map(e => ({
          time: `${Math.floor(e.timestamp / 60)}:${String(Math.floor(e.timestamp % 60)).padStart(2, '0')}`,
          note: e.description
        })) || []
      };

      console.log('📊 Analysis Results:', transformedResults);
      return transformedResults;
    } else {
      throw new Error(response.data?.error || 'Analysis failed');
    }

  } catch (error) {
    console.error('❌ Analysis failed:', error);
    
    // Re-throw with enhanced error message
    if (error.response?.status === 413) {
      throw new Error('File too large. Maximum size is 100MB.');
    } else if (error.response?.status === 415) {
      throw new Error('Unsupported file type. Please upload video, image, or audio files.');
    } else if (error.response?.status === 429) {
      throw new Error('Too many requests. Please wait a moment and try again.');
    } else {
      throw error;
    }
  }
};

// Health check function
export const checkBackendHealth = async () => {
  try {
    const response = await api.get('/api/health');
    return response.data?.success || false;
  } catch (error) {
    console.error('Backend health check failed:', error.message);
    return false;
  }
};

// Get supported formats
export const getSupportedFormats = async () => {
  try {
    const response = await api.get('/api/analysis/formats');
    return response.data?.data || {};
  } catch (error) {
    console.error('Failed to get supported formats:', error.message);
    return {};
  }
};

// Get backend status
export const getBackendStatus = async () => {
  try {
    const response = await api.get('/api/analysis/status');
    return response.data?.data || {};
  } catch (error) {
    console.error('Failed to get backend status:', error.message);
    return {};
  }
};

export default {
  analyzeFile,
  checkBackendHealth,
  getSupportedFormats,
  getBackendStatus
};
