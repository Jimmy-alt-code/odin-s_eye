// Simple system verification test
import fetch from 'node-fetch';

async function verifySystem() {
  console.log('🔍 Verifying Deepfake Radar System...\n');
  
  // Test 1: Backend Health
  console.log('1. Testing Backend Health...');
  try {
    const response = await fetch('http://localhost:3001/api/health');
    const data = await response.json();
    if (data.success) {
      console.log('   ✅ Backend is healthy and running');
      console.log(`   📊 Uptime: ${Math.round(data.data.uptime)}s`);
      console.log(`   💾 Memory: ${data.data.memory.used}MB used`);
    } else {
      console.log('   ❌ Backend health check failed');
      return false;
    }
  } catch (error) {
    console.log('   ❌ Cannot connect to backend:', error.message);
    console.log('   💡 Make sure backend is running: cd deepfake_radar_backend && npm start');
    return false;
  }
  
  // Test 2: Analysis Service Status
  console.log('\n2. Testing Analysis Service...');
  try {
    const response = await fetch('http://localhost:3001/api/analysis/status');
    const data = await response.json();
    if (data.success) {
      console.log('   ✅ Analysis service is operational');
      console.log(`   🔬 Version: ${data.data.version}`);
      console.log(`   📁 Supported formats: ${Object.keys(data.data.supportedFormats).join(', ')}`);
    } else {
      console.log('   ❌ Analysis service status check failed');
    }
  } catch (error) {
    console.log('   ❌ Analysis service test failed:', error.message);
  }
  
  // Test 3: Frontend Accessibility
  console.log('\n3. Checking Frontend Accessibility...');
  for (const port of [5173, 5174, 5175]) {
    try {
      const response = await fetch(`http://localhost:${port}`, { timeout: 2000 });
      if (response.ok) {
        console.log(`   ✅ Frontend is accessible on port ${port}`);
        console.log(`   🌐 Open: http://localhost:${port}`);
        break;
      }
    } catch (error) {
      // Continue checking other ports
    }
  }
  
  console.log('\n🎉 System Verification Complete!');
  console.log('\n📋 Quick Start Guide:');
  console.log('   1. Open the frontend URL in your browser');
  console.log('   2. Upload a video, audio, or image file');
  console.log('   3. Click "Start Analysis" to detect deepfakes');
  console.log('   4. Review the results and confidence scores');
  
  console.log('\n🔧 For Enhanced Accuracy:');
  console.log('   • Configure Google Cloud Vision API');
  console.log('   • Configure Google Speech API');
  console.log('   • See SETUP_INSTRUCTIONS.md for details');
  
  return true;
}

verifySystem().then(success => {
  if (success) {
    console.log('\n✅ Deepfake Radar is ready for use!');
  } else {
    console.log('\n❌ System verification failed - check the logs above');
  }
}).catch(console.error);
