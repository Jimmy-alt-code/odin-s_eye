import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DetailedFindings = ({ findings, fileType, visualAnalysis, audioAnalysis }) => {
  const [expandedSections, setExpandedSections] = useState(new Set());

  const toggleSection = (sectionId) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded?.has(sectionId)) {
      newExpanded?.delete(sectionId);
    } else {
      newExpanded?.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high':
        return 'text-destructive bg-red-50 border-red-200';
      case 'medium':
        return 'text-warning bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-success bg-green-50 border-green-200';
      default:
        return 'text-text-secondary bg-muted border-border';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity) {
      case 'high':
        return 'AlertTriangle';
      case 'medium':
        return 'AlertCircle';
      case 'low':
        return 'Info';
      default:
        return 'Circle';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg shadow-card">
      <div className="p-6 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon name="Search" size={20} color="var(--color-primary)" strokeWidth={2} />
          <h2 className="text-lg font-semibold text-foreground">Detailed Findings</h2>
        </div>
        <p className="text-sm text-text-secondary mt-1">
          {fileType === 'video' ? 'Frame-by-frame' : 'Timestamp-specific'} analysis results
        </p>
      </div>
      <div className="divide-y divide-border">
        {/* Visual Analysis Findings */}
        {visualAnalysis?.indicators?.map((indicator, index) => (
          <div key={`visual-${index}`} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg border ${getSeverityColor(indicator.confidence > 0.7 ? 'high' : indicator.confidence > 0.4 ? 'medium' : 'low')}`}>
                  <Icon 
                    name="Eye"
                    size={16} 
                    color="currentColor"
                    strokeWidth={2}
                  />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{indicator.name?.replace(/_/g, ' ')}</h3>
                  <p className="text-sm text-text-secondary">
                    Visual Indicator • Confidence: {Math.round(indicator.confidence * 100)}%
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                iconName={expandedSections?.has(`visual-${index}`) ? 'ChevronUp' : 'ChevronDown'}
                iconPosition="right"
                onClick={() => toggleSection(`visual-${index}`)}
              >
                {expandedSections?.has(`visual-${index}`) ? 'Less' : 'More'}
              </Button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-foreground leading-relaxed">
                {indicator.description}
              </p>
            </div>

            {/* Expanded Technical Details */}
            {expandedSections?.has(`visual-${index}`) && (
              <div className="bg-muted rounded-lg p-4 space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Technical Analysis</h4>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Visual analysis detected potential manipulation in the image data. The confidence score is based on facial landmark inconsistencies, lighting anomalies, and texture patterns.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="text-center p-2 bg-surface rounded">
                    <p className="text-xs text-text-secondary">Algorithm</p>
                    <p className="text-sm font-medium text-foreground">{visualAnalysis.modelVersion || 'Vision AI v1.0'}</p>
                  </div>
                  <div className="text-center p-2 bg-surface rounded">
                    <p className="text-xs text-text-secondary">Processing Time</p>
                    <p className="text-sm font-medium text-foreground">{visualAnalysis.processingTime || '250'}ms</p>
                  </div>
                  <div className="text-center p-2 bg-surface rounded">
                    <p className="text-xs text-text-secondary">Confidence</p>
                    <p className="text-sm font-medium text-foreground">{Math.round(indicator.confidence * 100)}%</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Audio Analysis Findings */}
        {audioAnalysis?.indicators?.map((indicator, index) => (
          <div key={`audio-${index}`} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg border ${getSeverityColor(indicator.confidence > 0.7 ? 'high' : indicator.confidence > 0.4 ? 'medium' : 'low')}`}>
                  <Icon 
                    name="AudioWaveform"
                    size={16} 
                    color="currentColor"
                    strokeWidth={2}
                  />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{indicator.name?.replace(/_/g, ' ')}</h3>
                  <p className="text-sm text-text-secondary">
                    Audio Indicator • Confidence: {Math.round(indicator.confidence * 100)}%
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                iconName={expandedSections?.has(`audio-${index}`) ? 'ChevronUp' : 'ChevronDown'}
                iconPosition="right"
                onClick={() => toggleSection(`audio-${index}`)}
              >
                {expandedSections?.has(`audio-${index}`) ? 'Less' : 'More'}
              </Button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-foreground leading-relaxed">
                {indicator.description}
              </p>
            </div>

            {/* Expanded Technical Details */}
            {expandedSections?.has(`audio-${index}`) && (
              <div className="bg-muted rounded-lg p-4 space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Technical Analysis</h4>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    Audio analysis detected potential manipulation in the voice data. The confidence score is based on speech pattern inconsistencies, unnatural pauses, and frequency analysis.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="text-center p-2 bg-surface rounded">
                    <p className="text-xs text-text-secondary">Algorithm</p>
                    <p className="text-sm font-medium text-foreground">{audioAnalysis.modelVersion || 'Speech AI v1.0'}</p>
                  </div>
                  <div className="text-center p-2 bg-surface rounded">
                    <p className="text-xs text-text-secondary">Processing Time</p>
                    <p className="text-sm font-medium text-foreground">{audioAnalysis.processingTime || '180'}ms</p>
                  </div>
                  <div className="text-center p-2 bg-surface rounded">
                    <p className="text-xs text-text-secondary">Confidence</p>
                    <p className="text-sm font-medium text-foreground">{Math.round(indicator.confidence * 100)}%</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {/* Legacy Findings */}
        {(!visualAnalysis?.indicators || visualAnalysis.indicators.length === 0) && (!audioAnalysis?.indicators || audioAnalysis.indicators.length === 0) && findings?.map((finding, index) => (
          <div key={finding?.id} className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-3">
                <div className={`p-2 rounded-lg border ${getSeverityColor(finding?.severity)}`}>
                  <Icon 
                    name={getSeverityIcon(finding?.severity)} 
                    size={16} 
                    color="currentColor"
                    strokeWidth={2}
                  />
                </div>
                <div>
                  <h3 className="font-medium text-foreground">{finding?.title}</h3>
                  <p className="text-sm text-text-secondary">
                    {fileType === 'video' ? `Frame ${finding?.frameNumber}` : `${finding?.timestamp}s`} • 
                    Confidence: {finding?.confidence}%
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                iconName={expandedSections?.has(finding?.id) ? 'ChevronUp' : 'ChevronDown'}
                iconPosition="right"
                onClick={() => toggleSection(finding?.id)}
              >
                {expandedSections?.has(finding?.id) ? 'Less' : 'More'}
              </Button>
            </div>

            <div className="mb-4">
              <p className="text-sm text-foreground leading-relaxed">
                {finding?.description}
              </p>
            </div>

            {/* Visual Evidence */}
            {finding?.evidence && (
              <div className="mb-4">
                <div className="bg-muted rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name="Eye" size={16} color="var(--color-text-secondary)" />
                    <span className="text-sm font-medium text-foreground">Visual Evidence</span>
                  </div>
                  {fileType === 'video' ? (
                    <div className="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Icon name="Image" size={32} color="var(--color-text-secondary)" />
                      <span className="ml-2 text-sm text-text-secondary">Frame {finding?.frameNumber}</span>
                    </div>
                  ) : (
                    <div className="w-full h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                      <Icon name="AudioWaveform" size={32} color="var(--color-text-secondary)" />
                      <span className="ml-2 text-sm text-text-secondary">Waveform Analysis</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Expanded Technical Details */}
            {expandedSections?.has(finding?.id) && (
              <div className="bg-muted rounded-lg p-4 space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-2">Technical Analysis</h4>
                  <p className="text-sm text-text-secondary leading-relaxed">
                    {finding?.technicalDetails}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  <div className="text-center p-2 bg-surface rounded">
                    <p className="text-xs text-text-secondary">Algorithm</p>
                    <p className="text-sm font-medium text-foreground">{finding?.algorithm}</p>
                  </div>
                  <div className="text-center p-2 bg-surface rounded">
                    <p className="text-xs text-text-secondary">Processing Time</p>
                    <p className="text-sm font-medium text-foreground">{finding?.processingTime}ms</p>
                  </div>
                  <div className="text-center p-2 bg-surface rounded">
                    <p className="text-xs text-text-secondary">Model Version</p>
                    <p className="text-sm font-medium text-foreground">{finding?.modelVersion}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DetailedFindings;