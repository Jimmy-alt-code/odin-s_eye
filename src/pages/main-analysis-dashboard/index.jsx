import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import FileUploadZone from './components/FileUploadZone';
import FilePreview from './components/FilePreview';
import AnalysisResults from './components/AnalysisResults';
import AnalysisHistory from './components/AnalysisHistory';
import BenefitsCarousel from '../../components/BenefitsCarousel';
import { analyzeFile, checkBackendHealth } from '../../services/deepfakeAPI';

const MainAnalysisDashboard = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [backendConnected, setBackendConnected] = useState(true);
  const [analysisError, setAnalysisError] = useState(null);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    setAnalysisResults(null);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setAnalysisResults(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setAnalysisError(null);
    setAnalysisResults(null);
    
    try {
      // Check backend connection first
      const isBackendHealthy = await checkBackendHealth();
      setBackendConnected(isBackendHealthy);
      
      if (!isBackendHealthy) {
        throw new Error('Backend server is not responding. Please ensure the backend is running on http://localhost:3002');
      }

      // Call real backend API
      const results = await analyzeFile(selectedFile);
      setAnalysisResults(results);
      
    } catch (error) {
      console.error('Analysis failed:', error);
      setAnalysisError(error.message);
      setBackendConnected(false);
      
      // Show fallback mock results if backend fails
      const fallbackResults = {
        confidence: 50,
        status: 'Analysis Limited',
        explanation: `Analysis could not be completed: ${error.message}. This is a fallback result for demonstration purposes.`,
        processingTime: '0.0s',
        framesAnalyzed: 'N/A',
        modelVersion: 'DeepfakeRadar (Fallback Mode)',
        riskLevel: 'Unknown',
        isError: true,
        errorMessage: error.message,
        timestamps: []
      };
      setAnalysisResults(fallbackResults);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                  <Icon name="Radar" size={24} color="white" strokeWidth={2.5} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">
                    Deepfake Analysis Dashboard
                  </h1>
                  <p className="text-text-secondary mt-1">
                    Upload media files to detect potential deepfake content using advanced AI analysis
                  </p>
                </div>
              </div>
              
              {/* Backend Status Indicator */}
              <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium ${
                backendConnected 
                  ? 'bg-success/10 text-success border border-success/20' 
                  : 'bg-error/10 text-error border border-error/20'
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  backendConnected ? 'bg-success' : 'bg-error'
                }`} />
                <span>{backendConnected ? 'Backend Connected' : 'Backend Disconnected'}</span>
              </div>
            </div>
            
            {/* Error Banner */}
            {analysisError && (
              <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg flex items-start space-x-3">
                <Icon name="AlertTriangle" size={20} color="var(--color-error)" />
                <div>
                  <h4 className="text-sm font-semibold text-error mb-1">Analysis Error</h4>
                  <p className="text-sm text-error/80">{analysisError}</p>
                </div>
              </div>
            )}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Upload & Preview */}
            <div className="space-y-6">
              {/* Upload Zone */}
              <FileUploadZone
                onFileSelect={handleFileSelect}
                selectedFile={selectedFile}
                isAnalyzing={isAnalyzing}
              />

              {/* File Preview */}
              {selectedFile && (
                <FilePreview
                  file={selectedFile}
                  onRemove={handleRemoveFile}
                />
              )}

              {/* Analyze Button */}
              {selectedFile && !isAnalyzing && (
                <div className="flex justify-center">
                  <Button
                    variant="default"
                    size="lg"
                    iconName="Play"
                    iconPosition="left"
                    onClick={handleAnalyze}
                    className="px-8 py-3 text-lg font-semibold"
                  >
                    Start Analysis
                  </Button>
                </div>
              )}
            </div>

            {/* Right Column - Results & History */}
            <div className="space-y-6">
              {/* Analysis Results */}
              {(isAnalyzing || analysisResults) && (
                <AnalysisResults
                  results={analysisResults}
                  isAnalyzing={isAnalyzing}
                />
              )}

              {/* Quick Stats */}
              {!isAnalyzing && !analysisResults && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-card border border-border rounded-xl p-6 text-center shadow-card">
                    <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-3">
                      <Icon name="Shield" size={24} color="var(--color-success)" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">1,247</h3>
                    <p className="text-sm text-text-secondary">Files Analyzed</p>
                  </div>
                  <div className="bg-card border border-border rounded-xl p-6 text-center shadow-card">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <Icon name="Zap" size={24} color="var(--color-primary)" />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground">98.3%</h3>
                    <p className="text-sm text-text-secondary">Accuracy Rate</p>
                  </div>
                </div>
              )}

              {/* Analysis History */}
              <AnalysisHistory />
            </div>
          </div>

          {/* Features Section */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-xl p-6 shadow-card">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Icon name="Brain" size={24} color="var(--color-primary)" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Advanced AI Detection
              </h3>
              <p className="text-sm text-text-secondary">
                State-of-the-art neural networks trained on millions of samples for accurate deepfake detection
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 shadow-card">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center mb-4">
                <Icon name="Clock" size={24} color="var(--color-secondary)" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Real-time Processing
              </h3>
              <p className="text-sm text-text-secondary">
                Fast analysis with detailed results in seconds, not minutes
              </p>
            </div>

            <div className="bg-card border border-border rounded-xl p-6 shadow-card">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                <Icon name="FileCheck" size={24} color="var(--color-accent)" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Multiple Formats
              </h3>
              <p className="text-sm text-text-secondary">
                Support for various video and audio formats with comprehensive analysis
              </p>
            </div>
          </div>
        </div>
        
        {/* Benefits Carousel Section */}
        <BenefitsCarousel />
      </main>
      {/* Footer */}
      <footer className="bg-card border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <Icon name="Shield" size={16} color="white" strokeWidth={2.5} />
              </div>
              <span className="text-sm text-text-secondary">
                Deepfake Radar - Hackathon Project {new Date()?.getFullYear()}
              </span>
            </div>
            <div className="flex items-center space-x-6 text-sm text-text-secondary">
              <span>Built with React & AI</span>
              <span>•</span>
              <span>Secure & Private</span>
              <span>•</span>
              <span>Open Source</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainAnalysisDashboard;