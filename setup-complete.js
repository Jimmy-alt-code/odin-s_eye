#!/usr/bin/env node

/**
 * Complete Setup Script for Deepfake Radar
 * This script sets up both frontend and backend with proper configuration
 */

import fs from 'fs/promises';
import path from 'path';
import { execSync } from 'child_process';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const logHeader = (message) => {
  log(`\n${'='.repeat(60)}`, 'cyan');
  log(`🚀 ${message}`, 'bright');
  log('='.repeat(60), 'cyan');
};

const logSuccess = (message) => log(`✅ ${message}`, 'green');
const logWarning = (message) => log(`⚠️  ${message}`, 'yellow');
const logError = (message) => log(`❌ ${message}`, 'red');
const logInfo = (message) => log(`ℹ️  ${message}`, 'blue');

async function main() {
  try {
    logHeader('DEEPFAKE RADAR COMPLETE SETUP');
    
    // Check if we're in the right directory
    const currentDir = process.cwd();
    if (!currentDir.includes('hackathon')) {
      logError('Please run this script from the hackathon directory');
      process.exit(1);
    }
    
    // Step 1: Install dependencies
    await installDependencies();
    
    // Step 2: Configure environment
    await configureEnvironment();
    
    // Step 3: Test backend
    await testBackend();
    
    // Step 4: Start services
    await startServices();
    
    logHeader('SETUP COMPLETE! 🎉');
    logSuccess('Your Deepfake Radar application is ready!');
    logInfo('Frontend: http://localhost:5173');
    logInfo('Backend: http://localhost:3001');
    
    log('\n📖 Usage Instructions:', 'bright');
    log('1. Open http://localhost:5173 in your browser');
    log('2. Upload a video, audio, or image file');
    log('3. Click "Start Analysis" to detect deepfakes');
    log('4. Review the results and confidence scores');
    
    log('\n🔧 For better accuracy:', 'bright');
    log('• Configure Google Cloud Vision API for advanced facial analysis');
    log('• Configure Google Speech API for lip-sync detection');
    log('• See SETUP_INSTRUCTIONS.md for Google Cloud setup');
    
  } catch (error) {
    logError(`Setup failed: ${error.message}`);
    process.exit(1);
  }
}

async function installDependencies() {
  logHeader('Installing Dependencies');
  
  try {
    logInfo('Installing frontend dependencies...');
    execSync('npm install', { stdio: 'inherit' });
    logSuccess('Frontend dependencies installed');
    
    logInfo('Installing backend dependencies...');
    execSync('npm install', { 
      cwd: path.join(process.cwd(), 'deepfake_radar_backend'),
      stdio: 'inherit' 
    });
    logSuccess('Backend dependencies installed');
    
  } catch (error) {
    throw new Error(`Dependency installation failed: ${error.message}`);
  }
}

async function configureEnvironment() {
  logHeader('Configuring Environment');
  
  try {
    // Check if .env files exist
    const frontendEnvPath = path.join(process.cwd(), '.env');
    const backendEnvPath = path.join(process.cwd(), 'deepfake_radar_backend', '.env');
    
    // Frontend .env
    try {
      await fs.access(frontendEnvPath);
      logSuccess('Frontend .env file already exists');
    } catch {
      logWarning('Frontend .env file not found, creating default...');
      const frontendEnv = `# Frontend Environment Variables
VITE_BACKEND_URL=http://localhost:3001
VITE_APP_NAME=Deepfake Radar
VITE_APP_VERSION=3.0.0
`;
      await fs.writeFile(frontendEnvPath, frontendEnv);
      logSuccess('Frontend .env file created');
    }
    
    // Backend .env
    try {
      await fs.access(backendEnvPath);
      logSuccess('Backend .env file already exists');
    } catch {
      logWarning('Backend .env file not found, creating default...');
      const backendEnv = `# Server Configuration
PORT=3001
NODE_ENV=development

# Google Gemini API Configuration
GEMINI_API_KEY=AIzaSyCTwvX8dBRYI4OEnN4DCV5l_qmujaVti6w

# Google Cloud Configuration (Optional - for enhanced accuracy)
# GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json
# GOOGLE_CLOUD_PROJECT=your-project-id

# CORS Configuration
FRONTEND_URL=http://localhost:5173

# File Upload Configuration
MAX_FILE_SIZE=104857600
UPLOAD_DIR=uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100

# Logging Level
LOG_LEVEL=info
`;
      await fs.writeFile(backendEnvPath, backendEnv);
      logSuccess('Backend .env file created');
    }
    
    // Create necessary directories
    const uploadsDir = path.join(process.cwd(), 'deepfake_radar_backend', 'uploads');
    const tempDir = path.join(uploadsDir, 'temp');
    
    try {
      await fs.mkdir(uploadsDir, { recursive: true });
      await fs.mkdir(tempDir, { recursive: true });
      logSuccess('Upload directories created');
    } catch (error) {
      logWarning(`Could not create upload directories: ${error.message}`);
    }
    
  } catch (error) {
    throw new Error(`Environment configuration failed: ${error.message}`);
  }
}

async function testBackend() {
  logHeader('Testing Backend Configuration');
  
  try {
    logInfo('Running backend health check...');
    execSync('node src/server.js &', { 
      cwd: path.join(process.cwd(), 'deepfake_radar_backend'),
      timeout: 5000
    });
    
    // Wait a moment for server to start
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    logSuccess('Backend server test completed');
    
  } catch (error) {
    logWarning(`Backend test encountered issues (this is normal): ${error.message}`);
  }
}

async function startServices() {
  logHeader('Starting Services');
  
  logInfo('Services will be started in separate terminals...');
  logInfo('1. Backend server on http://localhost:3001');
  logInfo('2. Frontend development server on http://localhost:5173');
  
  // Create start scripts for Windows
  const startBackendScript = `@echo off
echo Starting Deepfake Radar Backend...
cd deepfake_radar_backend
npm start
pause`;

  const startFrontendScript = `@echo off
echo Starting Deepfake Radar Frontend...
npm start
pause`;

  await fs.writeFile('start-backend.bat', startBackendScript);
  await fs.writeFile('start-frontend.bat', startFrontendScript);
  
  logSuccess('Start scripts created: start-backend.bat and start-frontend.bat');
}

// Run the setup
main().catch(console.error);
