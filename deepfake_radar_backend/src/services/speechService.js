/**
 * Azure Speech Service
 * 
 * This service handles speech-to-text and audio analysis for deepfake detection
 * using Azure Cognitive Services Speech API
 */

const sdk = require('microsoft-cognitiveservices-speech-sdk');
const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

// Azure Speech configuration
let speechConfig;
try {
  const subscriptionKey = process.env.AZURE_SPEECH_KEY;
  const region = process.env.AZURE_SPEECH_REGION;
  
  if (subscriptionKey && region) {
    speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, region);
    speechConfig.speechRecognitionLanguage = 'en-US';
    logger.info('Azure Speech Services client initialized');
  } else {
    logger.warn('Azure Speech Services not configured: missing credentials');
  }
} catch (error) {
  logger.error(`Failed to initialize Azure Speech client: ${error.message}`);
}

/**
 * Extracts speech from audio file and analyzes for deepfake indicators
 * @param {string} audioPath - Path to the audio file
 * @returns {Object} Analysis results
 */
async function analyzeAudio(audioPath) {
  if (!speechConfig) {
    logger.warn('Speech API client not initialized, skipping audio analysis');
    return {
      success: false,
      error: 'Speech API not configured'
    };
  }

  try {
    logger.info(`Analyzing audio: ${path.basename(audioPath)}`);
    
    // Create audio configuration from file
    const audioConfig = sdk.AudioConfig.fromWavFileInput(fs.readFileSync(audioPath));
    
    // Create speech recognizer
    const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
    
    // Start recognition
    const transcriptionResult = await new Promise((resolve, reject) => {
      let transcription = '';
      let wordTimings = [];
      
      recognizer.recognized = (s, e) => {
        if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
          transcription += e.result.text + ' ';
          
          // Get word-level timing information
          const words = e.result.json.NBest[0].Words || [];
          wordTimings = [...wordTimings, ...words];
        }
      };
      
      recognizer.canceled = (s, e) => {
        if (e.reason === sdk.CancellationReason.Error) {
          reject(new Error(`Speech recognition error: ${e.errorDetails}`));
        }
      };
      
      recognizer.sessionStopped = (s, e) => {
        recognizer.stopContinuousRecognitionAsync();
        resolve({ transcription: transcription.trim(), wordTimings });
      };
      
      recognizer.startContinuousRecognitionAsync(
        () => logger.debug('Speech recognition started'),
        err => reject(new Error(`Failed to start speech recognition: ${err}`))
      );
    });
    
    // Analyze speech patterns for deepfake indicators
    const audioAnalysis = analyzeAudioPatterns(transcriptionResult.wordTimings);
    
    return {
      success: true,
      data: {
        transcription: transcriptionResult.transcription,
        wordCount: transcriptionResult.transcription.split(' ').length,
        deepfakeIndicators: {
          unnaturalPauses: audioAnalysis.unnaturalPauses,
          inconsistentSpeed: audioAnalysis.inconsistentSpeed,
          artificialPatterns: audioAnalysis.artificialPatterns,
          voiceInconsistencies: audioAnalysis.voiceInconsistencies
        },
        deepfakeProbability: calculateAudioDeepfakeProbability(audioAnalysis)
      }
    };
  } catch (error) {
    logger.error(`Error analyzing audio: ${error.message}`);
    return {
      success: false,
      error: `Audio analysis failed: ${error.message}`
    };
  }
}

/**
 * Analyzes speech patterns to detect potential deepfake indicators
 * @param {Array} wordTimings - Word timing data from speech recognition
 * @returns {Object} Audio analysis results
 */
function analyzeAudioPatterns(wordTimings) {
  if (!wordTimings || wordTimings.length === 0) {
    return {
      unnaturalPauses: 0,
      inconsistentSpeed: 0,
      artificialPatterns: 0,
      voiceInconsistencies: 0
    };
  }
  
  let unnaturalPauses = 0;
  let inconsistentSpeed = 0;
  let artificialPatterns = 0;
  let voiceInconsistencies = 0;
  
  // Calculate timing between words
  const wordGaps = [];
  for (let i = 1; i < wordTimings.length; i++) {
    const prevWordEnd = wordTimings[i-1].Offset + wordTimings[i-1].Duration;
    const currentWordStart = wordTimings[i].Offset;
    wordGaps.push(currentWordStart - prevWordEnd);
  }
  
  // Analyze word gaps for unnatural pauses
  if (wordGaps.length > 0) {
    const avgGap = wordGaps.reduce((sum, gap) => sum + gap, 0) / wordGaps.length;
    const gapVariance = wordGaps.reduce((sum, gap) => sum + Math.pow(gap - avgGap, 2), 0) / wordGaps.length;
    
    // Extremely consistent gaps are suspicious (too robotic)
    if (gapVariance < 0.01) artificialPatterns += 30;
    
    // Extremely inconsistent gaps are also suspicious
    if (gapVariance > 0.5) unnaturalPauses += 25;
  }
  
  // Check for inconsistent speaking speed
  const wordDurations = wordTimings.map(word => word.Duration);
  if (wordDurations.length > 0) {
    const avgDuration = wordDurations.reduce((sum, duration) => sum + duration, 0) / wordDurations.length;
    const durationVariance = wordDurations.reduce((sum, duration) => sum + Math.pow(duration - avgDuration, 2), 0) / wordDurations.length;
    
    // Highly variable word durations can indicate spliced audio
    if (durationVariance > 0.3) inconsistentSpeed += 20;
    
    // Too consistent word durations can indicate synthetic speech
    if (durationVariance < 0.05) voiceInconsistencies += 15;
  }
  
  // Check for repeating patterns in speech (can indicate AI generation)
  // This is a simplified implementation - real analysis would be more complex
  const patternScore = detectRepeatingPatterns(wordTimings);
  artificialPatterns += patternScore;
  
  // Normalize scores to 0-100 range
  return {
    unnaturalPauses: Math.min(100, unnaturalPauses),
    inconsistentSpeed: Math.min(100, inconsistentSpeed),
    artificialPatterns: Math.min(100, artificialPatterns),
    voiceInconsistencies: Math.min(100, voiceInconsistencies)
  };
}

/**
 * Detects repeating patterns in speech timing that might indicate AI generation
 * @param {Array} wordTimings - Word timing data from speech recognition
 * @returns {number} Pattern detection score
 */
function detectRepeatingPatterns(wordTimings) {
  // This is a simplified implementation
  // A real implementation would use more sophisticated pattern detection algorithms
  
  // For now, we'll just check for unusually regular patterns in word durations
  const durations = wordTimings.map(word => word.Duration);
  let patternScore = 0;
  
  // Check for repeating sequences of 3 durations
  for (let i = 0; i < durations.length - 6; i++) {
    const pattern1 = durations.slice(i, i + 3);
    const pattern2 = durations.slice(i + 3, i + 6);
    
    // Calculate similarity between patterns
    const similarity = pattern1.reduce((sum, val, idx) => {
      return sum + Math.abs(val - pattern2[idx]);
    }, 0) / 3;
    
    // If patterns are very similar, increase score
    if (similarity < 0.05) patternScore += 10;
  }
  
  return Math.min(100, patternScore);
}

/**
 * Calculates overall deepfake probability based on audio analysis
 * @param {Object} audioAnalysis - Results from audio analysis
 * @returns {number} Probability score (0-100)
 */
function calculateAudioDeepfakeProbability(audioAnalysis) {
  const {
    unnaturalPauses,
    inconsistentSpeed,
    artificialPatterns,
    voiceInconsistencies
  } = audioAnalysis;
  
  // Weighted average of different indicators
  const weightedScore = (
    (unnaturalPauses * 0.2) +
    (inconsistentSpeed * 0.25) +
    (artificialPatterns * 0.3) +
    (voiceInconsistencies * 0.25)
  );
  
  return Math.round(weightedScore);
}

module.exports = {
  analyzeAudio
};