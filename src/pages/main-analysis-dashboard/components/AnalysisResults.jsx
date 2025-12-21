import React from 'react';
import Icon from '../../../components/AppIcon';

const AnalysisResults = ({ results, isAnalyzing }) => {
  if (isAnalyzing) {
    return (
      <div className="w-full bg-card border border-border rounded-xl p-6 shadow-card">
        <div className="flex items-center justify-center space-x-3 py-8">
          <div className="animate-spin">
            <Icon name="Loader2" size={24} color="var(--color-primary)" />
          </div>
          <span className="text-lg font-medium text-foreground">
            Analyzing media file...
          </span>
        </div>
        
        <div className="space-y-3">
          <div className="text-center text-sm text-text-secondary">
            <p>Extracting frames and analyzing facial landmarks...</p>
            <p className="text-xs mt-1">This may take a few moments depending on file size</p>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div className="bg-primary h-2 rounded-full transition-all duration-1000 animate-pulse" style={{width: '100%'}}></div>
          </div>
        </div>
      </div>
    );
  }

  if (!results) return null;

  const getStatusColor = (status) => {
    if (status === 'Real' || status === 'Likely Real') return 'success';
    if (status === 'Likely Deepfake') return 'error';
    if (status === 'Suspicious') return 'warning';
    if (status === 'Uncertain') return 'warning';
    if (status === 'Analysis Limited') return 'muted';
    return 'error';
  };

  const getStatusIcon = (status) => {
    if (status === 'Real' || status === 'Likely Real') return 'Shield';
    if (status === 'Likely Deepfake') return 'AlertTriangle';
    if (status === 'Suspicious' || status === 'Uncertain') return 'AlertCircle';
    if (status === 'Analysis Limited') return 'Info';
    return 'AlertTriangle';
  };

  // Enhanced confidence interpretation
  const getConfidenceInterpretation = (confidence, status) => {
    if (results?.isError) {
      return {
        color: 'error',
        text: 'Analysis Failed',
        description: 'Unable to complete analysis'
      };
    }
    
    if (confidence >= 90) {
      return {
        color: status === 'Real' ? 'success' : 'error',
        text: 'Very High',
        description: 'Extremely confident in analysis'
      };
    }
    if (confidence >= 75) {
      return {
        color: status === 'Real' ? 'success' : 'error', 
        text: 'High',
        description: 'Confident in analysis'
      };
    }
    if (confidence >= 60) {
      return {
        color: 'warning',
        text: 'Moderate',
        description: 'Reasonably confident'
      };
    }
    if (confidence >= 40) {
      return {
        color: 'warning',
        text: 'Low',
        description: 'Limited confidence'
      };
    }
    return {
      color: 'muted',
      text: 'Very Low',
      description: 'Analysis uncertain'
    };
  };
  
  // Helper to render analysis indicators
  const renderAnalysisIndicators = (indicators) => {
    if (!indicators || indicators.length === 0) return null;
    
    return (
      <div className="space-y-2 max-h-40 overflow-y-auto">
        {indicators.map((indicator, index) => (
          <div key={index} className="bg-muted/30 rounded-lg p-3">
            <div className="flex items-start justify-between mb-1">
              <span className="text-xs font-medium text-foreground capitalize">
                {indicator.name?.replace(/_/g, ' ')}
              </span>
              <span className="text-xs text-text-secondary">
                {Math.round((indicator.confidence || 0) * 100)}% confidence
              </span>
            </div>
            <p className="text-xs text-text-secondary">
              {indicator.description}
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full bg-card border border-border rounded-xl p-6 shadow-card">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Analysis Results</h3>
          <div className="text-xs text-text-secondary">
            {new Date()?.toLocaleString()}
          </div>
        </div>

        {/* Confidence Score */}
        <div className="flex items-center justify-center">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="var(--color-muted)"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke={`var(--color-${getStatusColor(results?.status)})`}
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 50}`}
                strokeDashoffset={`${2 * Math.PI * 50 * (1 - results?.confidence / 100)}`}
                className="transition-all duration-1000"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-foreground">
                {results?.confidence}%
              </span>
              <span className="text-xs text-text-secondary">Confidence</span>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex justify-center">
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-full bg-${getStatusColor(results?.status)}/10 border border-${getStatusColor(results?.status)}/20`}>
            <Icon 
              name={getStatusIcon(results?.status)} 
              size={16} 
              color={`var(--color-${getStatusColor(results?.status)})`} 
            />
            <span className={`font-semibold text-${getStatusColor(results?.status)}`}>
              {results?.status}
            </span>
          </div>
        </div>

        {/* Error Alert for Failed Analysis */}
        {results?.isError && (
          <div className="bg-error/10 border border-error/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Icon name="AlertTriangle" size={20} color="var(--color-error)" />
              <div>
                <h4 className="font-semibold text-error mb-1">Analysis Error</h4>
                <p className="text-sm text-error/80">{results?.errorMessage}</p>
              </div>
            </div>
          </div>
        )}

        {/* Confidence Interpretation */}
        {!results?.isError && (
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Confidence Assessment</h4>
            <div className={`bg-${getConfidenceInterpretation(results?.confidence, results?.status).color}/10 border border-${getConfidenceInterpretation(results?.confidence, results?.status).color}/20 rounded-lg p-4`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-foreground">
                  Confidence Level: {getConfidenceInterpretation(results?.confidence, results?.status).text}
                </span>
                <span className="text-xs text-text-secondary">
                  {results?.confidence}% certainty
                </span>
              </div>
              <p className="text-xs text-text-secondary">
                {getConfidenceInterpretation(results?.confidence, results?.status).description}
              </p>
            </div>
          </div>
        )}

        {/* Detailed Analysis */}
        <div className="space-y-4">
          <h4 className="font-semibold text-foreground">Analysis Details</h4>
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-text-secondary leading-relaxed">
              {results?.explanation}
            </p>
          </div>
        </div>

        {/* Visual Analysis */}
        {results?.visualAnalysis && results?.visualAnalysis?.indicators?.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">
              <div className="flex items-center space-x-2">
                <Icon name="Eye" size={16} color="var(--color-text-secondary)" />
                <span>Visual Analysis</span>
              </div>
            </h4>
            {renderAnalysisIndicators(results.visualAnalysis.indicators)}
          </div>
        )}

        {/* Audio Analysis */}
        {results?.audioAnalysis && results?.audioAnalysis?.indicators?.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">
              <div className="flex items-center space-x-2">
                <Icon name="AudioWaveform" size={16} color="var(--color-text-secondary)" />
                <span>Audio Analysis</span>
              </div>
            </h4>
            {renderAnalysisIndicators(results.audioAnalysis.indicators)}
          </div>
        )}
        
        {/* Legacy Evidence Summary - Fallback */}
        {!results?.visualAnalysis && !results?.audioAnalysis && results?.evidence && results?.evidence?.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Detection Evidence</h4>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {results?.evidence?.slice(0, 5)?.map((evidence, index) => (
                <div key={index} className="bg-muted/30 rounded-lg p-3">
                  <div className="flex items-start justify-between mb-1">
                    <span className="text-xs font-medium text-foreground capitalize">
                      {evidence.type?.replace(/-/g, ' ')}
                    </span>
                    <span className="text-xs text-text-secondary">
                      {Math.round((evidence.score || 0) * 100)}% severity
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary">
                    {evidence.description}
                  </p>
                </div>
              ))}
              {results?.evidence?.length > 5 && (
                <div className="text-center">
                  <span className="text-xs text-text-secondary">
                    +{results?.evidence?.length - 5} more indicators
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Technical Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <span className="text-text-secondary">Processing Time</span>
            <p className="font-medium text-foreground">{results?.processingTime}</p>
          </div>
          <div className="space-y-1">
            <span className="text-text-secondary">
              {results?.visualAnalysis ? 'Frames Analyzed' : 'Segments Analyzed'}
            </span>
            <p className="font-medium text-foreground">
              {results?.visualAnalysis?.framesAnalyzed || results?.framesAnalyzed || 'N/A'}
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-text-secondary">Analysis Type</span>
            <p className="font-medium text-foreground">
              {results?.visualAnalysis && results?.audioAnalysis ? 'Multimodal' : 
               results?.visualAnalysis ? 'Visual Only' : 
               results?.audioAnalysis ? 'Audio Only' : 'Basic'}
            </p>
          </div>
          <div className="space-y-1">
            <span className="text-text-secondary">Risk Level</span>
            <p className={`font-medium text-${getStatusColor(results?.status)}`}>
              {results?.riskLevel}
            </p>
          </div>
          {results?.visualAnalysis?.modelVersion && (
            <div className="space-y-1">
              <span className="text-text-secondary">Vision Model</span>
              <p className="font-medium text-foreground">{results?.visualAnalysis?.modelVersion}</p>
            </div>
          )}
          {results?.audioAnalysis?.modelVersion && (
            <div className="space-y-1">
              <span className="text-text-secondary">Audio Model</span>
              <p className="font-medium text-foreground">{results?.audioAnalysis?.modelVersion}</p>
            </div>
          )}
          {!results?.visualAnalysis?.modelVersion && !results?.audioAnalysis?.modelVersion && results?.modelVersion && (
            <div className="space-y-1">
              <span className="text-text-secondary">Model Version</span>
              <p className="font-medium text-foreground">{results?.modelVersion}</p>
            </div>
          )}
        </div>

        {/* Timestamp References */}
        {results?.timestamps && results?.timestamps?.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">Key Timestamps</h4>
            <div className="space-y-2">
              {results?.timestamps?.map((timestamp, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <span className="text-sm text-foreground">{timestamp?.time}</span>
                  <span className="text-xs text-text-secondary">{timestamp?.note}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisResults;