/**
 * Google Cloud Vision API Service
 * 
 * This service handles image analysis using Google Cloud Vision API
 * for detecting visual anomalies in potential deepfake images/videos
 */

const { ImageAnnotatorClient } = require('@google-cloud/vision');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

// Initialize the Vision client
let visionClient;
try {
  visionClient = new ImageAnnotatorClient();
  logger.info('Google Cloud Vision API client initialized');
} catch (error) {
  logger.error(`Failed to initialize Vision API client: ${error.message}`);
}

/**
 * Analyzes an image for potential deepfake indicators
 * @param {string} imagePath - Path to the image file
 * @returns {Object} Analysis results
 */
async function analyzeImage(imagePath) {
  if (!visionClient) {
    logger.warn('Vision API client not initialized, skipping image analysis');
    return {
      success: false,
      error: 'Vision API not configured'
    };
  }

  try {
    logger.info(`Analyzing image: ${path.basename(imagePath)}`);
    
    // Read the image file
    const imageContent = fs.readFileSync(imagePath);
    
    // Run face detection
    const [faceResult] = await visionClient.faceDetection({
      image: { content: imageContent }
    });
    const faces = faceResult.faceAnnotations || [];
    
    // Run landmark detection
    const [landmarkResult] = await visionClient.landmarkDetection({
      image: { content: imageContent }
    });
    
    // Run safe search detection
    const [safeSearchResult] = await visionClient.safeSearchDetection({
      image: { content: imageContent }
    });
    
    // Analyze face details for potential deepfake indicators
    const faceAnalysis = analyzeFaceDetails(faces);
    
    return {
      success: true,
      data: {
        faceCount: faces.length,
        faceAnalysis,
        landmarks: landmarkResult.landmarkAnnotations || [],
        safeSearch: safeSearchResult.safeSearchAnnotation,
        deepfakeIndicators: {
          artificialFacePatterns: faceAnalysis.artificialPatterns,
          inconsistentLighting: faceAnalysis.inconsistentLighting,
          blendingArtifacts: faceAnalysis.blendingArtifacts,
          unnaturalFeatures: faceAnalysis.unnaturalFeatures
        },
        deepfakeProbability: calculateDeepfakeProbability(faceAnalysis)
      }
    };
  } catch (error) {
    logger.error(`Error analyzing image: ${error.message}`);
    return {
      success: false,
      error: `Image analysis failed: ${error.message}`
    };
  }
}

/**
 * Analyzes face details to detect potential deepfake indicators
 * @param {Array} faces - Face annotations from Vision API
 * @returns {Object} Face analysis results
 */
function analyzeFaceDetails(faces) {
  if (!faces || faces.length === 0) {
    return {
      artificialPatterns: 0,
      inconsistentLighting: 0,
      blendingArtifacts: 0,
      unnaturalFeatures: 0
    };
  }
  
  // Analyze each face for potential deepfake indicators
  let artificialPatterns = 0;
  let inconsistentLighting = 0;
  let blendingArtifacts = 0;
  let unnaturalFeatures = 0;
  
  faces.forEach(face => {
    // Check for unnatural symmetry (too perfect symmetry can indicate AI generation)
    const leftEye = face.landmarks?.find(l => l.type === 'LEFT_EYE');
    const rightEye = face.landmarks?.find(l => l.type === 'RIGHT_EYE');
    
    if (leftEye && rightEye) {
      // Perfect symmetry is suspicious
      const tooSymmetrical = Math.abs(leftEye.position.y - rightEye.position.y) < 0.01;
      if (tooSymmetrical) unnaturalFeatures += 20;
    }
    
    // Check confidence scores - very high confidence can sometimes indicate AI-generated faces
    if (face.detectionConfidence > 0.98) artificialPatterns += 10;
    
    // Check for inconsistent lighting based on face annotations
    if (face.landmarkingConfidence < 0.8) inconsistentLighting += 15;
    
    // Analyze joy likelihood - deepfakes often have unusual emotion patterns
    if (face.joyLikelihood === 'VERY_LIKELY' && face.sorrowLikelihood === 'VERY_LIKELY') {
      // Contradictory emotions are suspicious
      blendingArtifacts += 25;
    }
  });
  
  // Normalize scores to 0-100 range
  return {
    artificialPatterns: Math.min(100, artificialPatterns),
    inconsistentLighting: Math.min(100, inconsistentLighting),
    blendingArtifacts: Math.min(100, blendingArtifacts),
    unnaturalFeatures: Math.min(100, unnaturalFeatures)
  };
}

/**
 * Calculates overall deepfake probability based on face analysis
 * @param {Object} faceAnalysis - Results from face analysis
 * @returns {number} Probability score (0-100)
 */
function calculateDeepfakeProbability(faceAnalysis) {
  const {
    artificialPatterns,
    inconsistentLighting,
    blendingArtifacts,
    unnaturalFeatures
  } = faceAnalysis;
  
  // Weighted average of different indicators
  const weightedScore = (
    (artificialPatterns * 0.25) +
    (inconsistentLighting * 0.2) +
    (blendingArtifacts * 0.3) +
    (unnaturalFeatures * 0.25)
  );
  
  return Math.round(weightedScore);
}

module.exports = {
  analyzeImage
};