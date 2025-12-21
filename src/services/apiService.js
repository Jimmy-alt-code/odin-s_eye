/**
 * Deepfake Radar API Service
 * 
 * This file should be placed in your frontend at:
 * src/services/apiService.js
 */

// API Configuration
const API_CONFIG = {
  baseURL: process.env.NODE_ENV === 'production' 
    ? 'https://your-production-api.com' // Change this when deploying
    : 'http://localhost:3002',
  
  endpoints: {
    analyze: '/api/analysis/analyze',
    status: '/api/analysis/status',
    health: '/api/health',
    formats: '/api/analysis/formats'
  },
  
  timeout: 300000, // 5 minutes for file analysis
};

/**
 * API Service Class
 */
class ApiService {
  constructor() {
    this.baseURL = API_CONFIG.baseURL;
  }

  /**
   * Generic fetch wrapper with error handling
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultOptions = {
      headers: {
        // Don't set Content-Type for FormData - browser will set it automatically
      },
      ...options
    };

    try {
      console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);
      
      const response = await fetch(url, defaultOptions);
      
      // Handle different response types
      const contentType = response.headers.get('content-type');
      let data;
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      console.log(`✅ API Response: ${response.status}`, data);

      if (!response.ok) {
        throw new Error(data.error || `API Error: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error(`❌ API Error:`, error);
      
      // Handle different error types
      if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error('Unable to connect to server. Please ensure the backend is running on http://localhost:3002');
      }
      
      if (error.name === 'AbortError') {
        throw new Error('Request timeout. The analysis is taking too long.');
      }
      
      throw error;
    }
  }

  /**
   * Analyze uploaded file for deepfake detection
   * @param {File} file - The file to analyze
   * @param {function} onProgress - Progress callback (optional)
   * @returns {Promise<Object>} Analysis results
   */
  async analyzeFile(file, onProgress = null) {
    if (!file) {
      throw new Error('No file provided for analysis');
    }

    // Validate file size (100MB limit)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      throw new Error(`File too large. Maximum size is ${Math.round(maxSize / 1024 / 1024)}MB`);
    }

    // Validate file type
    const supportedTypes = [
      'video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/quicktime',
      'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/aac', 'audio/mpeg',
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'
    ];

    if (!supportedTypes.includes(file.type)) {
      throw new Error(`Unsupported file type: ${file.type}. Please upload a video, audio, or image file.`);
    }

    const formData = new FormData();
    formData.append('file', file);

    console.log(`📁 Uploading file: ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`);

    // Create AbortController for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

    try {
      const result = await this.request(API_CONFIG.endpoints.analyze, {
        method: 'POST',
        body: formData,
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      
      return result.data || result;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Get API service status
   * @returns {Promise<Object>} Service status
   */
  async getStatus() {
    const result = await this.request(API_CONFIG.endpoints.status);
    return result.data || result;
  }

  /**
   * Health check
   * @returns {Promise<Object>} Health status
   */
  async healthCheck() {
    const result = await this.request(API_CONFIG.endpoints.health);
    return result.data || result;
  }

  /**
   * Get supported file formats
   * @returns {Promise<Object>} Supported formats and limits
   */
  async getSupportedFormats() {
    const result = await this.request(API_CONFIG.endpoints.formats);
    return result.data || result;
  }

  /**
   * Test connection to backend
   * @returns {Promise<boolean>} Connection status
   */
  async testConnection() {
    try {
      await this.healthCheck();
      return true;
    } catch (error) {
      console.warn('Backend connection test failed:', error.message);
      return false;
    }
  }
}

// Create and export singleton instance
const apiService = new ApiService();
export default apiService;

// Also export the class for advanced usage
export { ApiService };

// Export utilities
export const API_UTILS = {
  /**
   * Format file size for display
   * @param {number} bytes - File size in bytes
   * @returns {string} Formatted size
   */
  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  },

  /**
   * Check if backend is likely available
   * @returns {boolean} Whether backend might be available
   */
  isBackendAvailable() {
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1';
  },

  /**
   * Get API base URL
   * @returns {string} API base URL
   */
  getBaseURL() {
    return API_CONFIG.baseURL;
  }
};
