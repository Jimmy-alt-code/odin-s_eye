import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import FileMetadataCard from './components/FileMetadataCard';
import ConfidenceScoreVisualization from './components/ConfidenceScoreVisualization';
import DetailedFindings from './components/DetailedFindings';
import TechnicalDetailsAccordion from './components/TechnicalDetailsAccordion';
import ActionButtons from './components/ActionButtons';
import BreadcrumbNavigation from './components/BreadcrumbNavigation';

const DetailedAnalysisResults = () => {
  const [searchParams] = useSearchParams();
  const [analysisData, setAnalysisData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data for detailed analysis results
  const mockAnalysisData = {
    fileData: {
      id: searchParams?.get('id') || 'file_001',
      filename: searchParams?.get('filename') || 'suspicious_video_2024.mp4',
      type: 'video',
      size: 15728640, // 15MB
      duration: 127, // seconds
      uploadDate: '08/28/2024',
      processingTime: '2.3s',
      algorithm: 'DeepFake-V4',
      hash: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6'
    },
    confidence: 87,
    status: 'Likely Deepfake',
    explanation: `Advanced neural network analysis detected multiple inconsistencies in facial landmarks and temporal coherence patterns. The model identified unnatural eye movement patterns and subtle artifacts in facial texture rendering that are characteristic of deepfake generation techniques.`,
    // New visual analysis data
    visualAnalysis: {
      confidence: 0.89,
      modelVersion: 'Google Vision AI v1.2',
      processingTime: '1.4s',
      framesAnalyzed: 127,
      indicators: [
        {
          name: 'facial_landmark_inconsistency',
          confidence: 0.92,
          description: 'Detected significant deviations in facial landmark positioning between consecutive frames. The eye-to-nose ratio shows unnatural variations.',
          technicalDetails: 'Using a 68-point facial landmark detection model, we identified 23 points showing abnormal displacement vectors.'
        },
        {
          name: 'unnatural_eye_movement',
          confidence: 0.87,
          description: 'Eye movements do not follow natural patterns. Blink rate and eye tracking show algorithmic rather than human patterns.',
          technicalDetails: 'Eye movement velocity and acceleration metrics fall outside human physiological norms by 2.3 standard deviations.'
        },
        {
          name: 'texture_inconsistency',
          confidence: 0.78,
          description: 'Skin texture shows inconsistent patterns across frames, particularly around facial boundaries.',
          technicalDetails: 'Frequency domain analysis reveals artifacts typical of GAN-generated content.'
        }
      ]
    },
    // New audio analysis data
    audioAnalysis: {
      confidence: 0.76,
      modelVersion: 'Azure Speech Services v2.1',
      processingTime: '1.1s',
      indicators: [
        {
          name: 'unnatural_pauses',
          confidence: 0.82,
          description: 'Speech contains irregular pauses that don\'t align with natural human speech patterns.',
          technicalDetails: 'Temporal analysis shows pause distribution inconsistent with linguistic expectations.'
        },
        {
          name: 'voice_inconsistency',
          confidence: 0.79,
          description: 'Voice characteristics show subtle variations throughout the recording that suggest synthetic generation.',
          technicalDetails: 'Formant analysis reveals inconsistent vocal tract parameters across utterances.'
        },
        {
          name: 'frequency_artifacts',
          confidence: 0.68,
          description: 'Unusual frequency patterns detected in speech that are characteristic of AI-generated audio.',
          technicalDetails: 'Spectral analysis shows harmonic structures inconsistent with human vocal production.'
        }
      ]
    },
    findings: [
      {
        id: 'finding_001',
        title: 'Facial Landmark Inconsistencies',
        frameNumber: 1247,
        timestamp: 41.2,
        confidence: 92,
        severity: 'high',
        description: `Detected significant deviations in facial landmark positioning between consecutive frames. The eye-to-nose ratio shows unnatural variations that exceed normal human facial movement patterns.`,
        technicalDetails: `Using a 68-point facial landmark detection model, we identified 23 points showing abnormal displacement vectors. The temporal consistency score dropped to 0.34 (threshold: 0.7) indicating potential manipulation.`,
        algorithm: 'FaceLandmark-CNN',
        processingTime: 145,
        modelVersion: 'v2.1.3',
        evidence: true
      },
      {
        id: 'finding_002',
        title: 'Temporal Coherence Anomaly',
        frameNumber: 2156,
        timestamp: 71.8,
        confidence: 78,
        severity: 'medium',
        description: `Frame-to-frame analysis revealed sudden changes in lighting conditions and shadow patterns that don't align with the scene's environmental context.`,
        technicalDetails: `Optical flow analysis detected motion vectors with magnitude exceeding 15 pixels between frames 2155-2157, while surrounding frames show consistent 2-3 pixel movements. This suggests frame interpolation or replacement.`,
        algorithm: 'OpticalFlow-LSTM',
        processingTime: 89,
        modelVersion: 'v1.8.2',
        evidence: true
      },
      {
        id: 'finding_003',
        title: 'Audio-Visual Synchronization',
        frameNumber: 3421,
        timestamp: 113.7,
        confidence: 65,
        severity: 'low',
        description: `Minor discrepancies detected in lip-sync accuracy during speech segments. The audio waveform doesn't perfectly align with visible mouth movements.`,
        technicalDetails: `Cross-correlation analysis between audio phonemes and visual lip movements shows a correlation coefficient of 0.73 (normal range: 0.85-0.95). This could indicate audio replacement or video manipulation.`,
        algorithm: 'AudioVisual-Sync',
        processingTime: 234,
        modelVersion: 'v3.0.1',
        evidence: true
      }
    ],
    technicalData: {
      primaryAlgorithm: 'Multi-Modal Deepfake Detection Network (MDDN)',
      modelArchitecture: 'Transformer-based CNN with LSTM temporal analysis',
      trainingDataset: 'FaceForensics++, Celeb-DF, DFDC Dataset (2.1M samples)',
      modelVersion: 'MDDN-v4.2.1',
      parameters: [
        {
          name: 'Frame Sampling Rate',
          value: '10 FPS',
          description: 'Frames analyzed per second'
        },
        {
          name: 'Detection Threshold',
          value: '0.75',
          description: 'Minimum confidence for positive detection'
        },
        {
          name: 'Temporal Window',
          value: '32 frames',
          description: 'Consecutive frames analyzed together'
        },
        {
          name: 'Feature Dimensions',
          value: '2048',
          description: 'Neural network feature vector size'
        },
        {
          name: 'Batch Size',
          value: '16',
          description: 'Processing batch configuration'
        },
        {
          name: 'GPU Memory',
          value: '8.2 GB',
          description: 'VRAM utilized during analysis'
        }
      ],
      confidenceLevels: [
        {
          component: 'Facial Analysis',
          confidence: 92,
          description: 'Face detection, landmark analysis, and expression consistency'
        },
        {
          component: 'Temporal Coherence',
          confidence: 78,
          description: 'Frame-to-frame consistency and motion analysis'
        },
        {
          component: 'Audio-Visual Sync',
          confidence: 65,
          description: 'Lip-sync accuracy and audio-visual correlation'
        },
        {
          component: 'Texture Analysis',
          confidence: 89,
          description: 'Skin texture, lighting, and artifact detection'
        },
        {
          component: 'Compression Artifacts',
          confidence: 71,
          description: 'Video compression pattern analysis'
        }
      ],
      methodology: {
        steps: [
          {
            title: 'Preprocessing',
            description: 'Video frame extraction, face detection, and region of interest identification'
          },
          {
            title: 'Feature Extraction',
            description: 'Deep learning feature extraction using pre-trained CNN models'
          },
          {
            title: 'Temporal Analysis',
            description: 'LSTM-based analysis of temporal patterns and frame consistency'
          },
          {
            title: 'Multi-Modal Fusion',
            description: 'Combining visual, audio, and metadata features for final prediction'
          },
          {
            title: 'Confidence Scoring',
            description: 'Bayesian inference for confidence score calculation and uncertainty estimation'
          }
        ],
        indicators: [
          'Facial Landmarks',
          'Eye Movement',
          'Lip Sync',
          'Skin Texture',
          'Lighting Consistency',
          'Compression Artifacts',
          'Motion Vectors',
          'Frequency Analysis'
        ]
      }
    }
  };

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => {
      setAnalysisData(mockAnalysisData);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleReanalyze = () => {
    setLoading(true);
    // Simulate reanalysis
    setTimeout(() => {
      setLoading(false);
      console.log('Reanalysis completed');
    }, 3000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="pt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center min-h-96">
              <div className="text-center">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <h2 className="text-xl font-semibold text-foreground mb-2">Loading Analysis Results</h2>
                <p className="text-text-secondary">Processing detailed findings and technical data...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Back Button & Breadcrumb */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <Link
                to="/main-analysis-dashboard"
                className="flex items-center space-x-2 text-text-secondary hover:text-foreground transition-micro"
              >
                <Icon name="ArrowLeft" size={20} color="currentColor" strokeWidth={2} />
                <span className="font-medium">Back to Dashboard</span>
              </Link>
            </div>
            
            <div className="hidden md:block">
              <BreadcrumbNavigation filename={analysisData?.fileData?.filename} />
            </div>
          </div>

          {/* Mobile Breadcrumb */}
          <div className="md:hidden mb-6">
            <BreadcrumbNavigation filename={analysisData?.fileData?.filename} />
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* File Metadata */}
            <FileMetadataCard fileData={analysisData?.fileData} />

            {/* Confidence Score Visualization */}
            <ConfidenceScoreVisualization 
              confidence={analysisData?.confidence}
              status={analysisData?.status}
              explanation={analysisData?.explanation}
            />

            {/* Desktop Layout */}
            <div className="hidden lg:grid lg:grid-cols-3 lg:gap-8">
              {/* Left Column - Detailed Findings */}
              <div className="lg:col-span-2">
                <DetailedFindings 
                  findings={analysisData?.findings}
                  fileType={analysisData?.fileData?.type}
                  visualAnalysis={analysisData?.visualAnalysis}
                  audioAnalysis={analysisData?.audioAnalysis}
                />
              </div>

              {/* Right Column - Technical Details & Actions */}
              <div className="space-y-8">
                <TechnicalDetailsAccordion technicalData={analysisData?.technicalData} />
                <ActionButtons 
                  fileData={analysisData?.fileData}
                  onReanalyze={handleReanalyze}
                />
              </div>
            </div>

            {/* Mobile/Tablet Layout */}
            <div className="lg:hidden space-y-8">
              <DetailedFindings 
                findings={analysisData?.findings}
                fileType={analysisData?.fileData?.type}
                visualAnalysis={analysisData?.visualAnalysis}
                audioAnalysis={analysisData?.audioAnalysis}
              />
              <TechnicalDetailsAccordion technicalData={analysisData?.technicalData} />
              <ActionButtons 
                fileData={analysisData?.fileData}
                onReanalyze={handleReanalyze}
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
              <div className="text-center sm:text-left">
                <p className="text-sm text-text-secondary">
                  Analysis completed on {analysisData?.fileData?.uploadDate} • 
                  Processing time: {analysisData?.fileData?.processingTime}
                </p>
                <p className="text-xs text-text-secondary mt-1">
                  Powered by Deepfake Radar AI • Model version {analysisData?.technicalData?.modelVersion}
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="HelpCircle"
                  iconPosition="left"
                  onClick={() => console.log('Show help')}
                >
                  Need Help?
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  iconName="MessageSquare"
                  iconPosition="left"
                  onClick={() => console.log('Provide feedback')}
                >
                  Feedback
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailedAnalysisResults;