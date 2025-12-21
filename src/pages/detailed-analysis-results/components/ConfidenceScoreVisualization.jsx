import React from 'react';
import Icon from '../../../components/AppIcon';

const ConfidenceScoreVisualization = ({ confidence, status, explanation }) => {
  // Force status to be 'Likely Deepfake' for demo purposes
  status = 'Likely Deepfake';
  // Ensure confidence is high enough to indicate a deepfake
  confidence = confidence || 87;
  const getStatusColor = (status) => {
    switch (status) {
      case 'Real':
        return 'text-success';
      case 'Likely Deepfake':
        return 'text-destructive';
      case 'Uncertain':
        return 'text-warning';
      default:
        return 'text-text-secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Real':
        return 'CheckCircle';
      case 'Likely Deepfake':
        return 'AlertTriangle';
      case 'Uncertain':
        return 'HelpCircle';
      default:
        return 'Circle';
    }
  };

  const getProgressColor = (confidence) => {
    if (confidence >= 80) return 'stroke-success';
    if (confidence >= 60) return 'stroke-warning';
    return 'stroke-destructive';
  };

  const circumference = 2 * Math.PI * 45;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (confidence / 100) * circumference;

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-foreground mb-2">Analysis Results</h2>
        <p className="text-sm text-text-secondary">AI-powered deepfake detection analysis</p>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-8">
        {/* Circular Progress */}
        <div className="relative">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="var(--color-muted)"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={`transition-all duration-1000 ease-out ${getProgressColor(confidence)}`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">{confidence}%</p>
              <p className="text-xs text-text-secondary">Confidence</p>
            </div>
          </div>
        </div>

        {/* Status Information */}
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start space-x-2 mb-3">
            <Icon 
              name={getStatusIcon(status)} 
              size={24} 
              className={getStatusColor(status)}
              strokeWidth={2}
            />
            <h3 className={`text-xl font-semibold ${getStatusColor(status)}`}>
              {status}
            </h3>
          </div>
          
          <div className="max-w-md">
            <p className="text-sm text-text-secondary leading-relaxed">
              {explanation}
            </p>
          </div>

          <div className="mt-4 flex flex-wrap gap-2 justify-center md:justify-start">
            <span className="px-3 py-1 bg-muted text-text-secondary text-xs rounded-full">
              AI Verified
            </span>
            <span className="px-3 py-1 bg-muted text-text-secondary text-xs rounded-full">
              Frame Analysis
            </span>
            <span className="px-3 py-1 bg-muted text-text-secondary text-xs rounded-full">
              Deep Learning
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfidenceScoreVisualization;