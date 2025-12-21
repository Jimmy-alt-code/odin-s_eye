import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AnalysisHistory = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const historyData = [
    {
      id: 1,
      fileName: "interview_video.mp4",
      status: "Real",
      confidence: 94.2,
      timestamp: "2025-08-28 11:45:32",
      processingTime: "2.3s",
      fileSize: "15.2 MB"
    },
    {
      id: 2,
      fileName: "suspicious_audio.wav",
      status: "Likely Deepfake",
      confidence: 87.8,
      timestamp: "2025-08-28 10:22:15",
      processingTime: "1.8s",
      fileSize: "8.7 MB"
    },
    {
      id: 3,
      fileName: "news_segment.mp4",
      status: "Real",
      confidence: 96.5,
      timestamp: "2025-08-28 09:15:44",
      processingTime: "3.1s",
      fileSize: "22.4 MB"
    },
    {
      id: 4,
      fileName: "voice_sample.m4a",
      status: "Likely Deepfake",
      confidence: 91.3,
      timestamp: "2025-08-27 16:33:21",
      processingTime: "1.5s",
      fileSize: "5.9 MB"
    },
    {
      id: 5,
      fileName: "presentation_video.mov",
      status: "Real",
      confidence: 89.7,
      timestamp: "2025-08-27 14:28:09",
      processingTime: "4.2s",
      fileSize: "31.8 MB"
    }
  ];

  const getStatusColor = (status) => {
    return status === 'Real' ? 'success' : 'error';
  };

  const getStatusIcon = (status) => {
    return status === 'Real' ? 'Shield' : 'AlertTriangle';
  };

  const getFileIcon = (fileName) => {
    const extension = fileName?.split('.')?.pop()?.toLowerCase();
    return ['mp4', 'avi', 'mov', 'wmv']?.includes(extension) ? 'Video' : 'Music';
  };

  return (
    <div className="w-full bg-card border border-border rounded-xl shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="History" size={20} color="var(--color-primary)" />
          <h3 className="text-lg font-semibold text-foreground">Analysis History</h3>
          <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full">
            {historyData?.length}
          </span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
          iconSize={16}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? 'Collapse' : 'Expand'}
        </Button>
      </div>
      {/* Content */}
      <div className={`transition-all duration-300 ${isExpanded ? 'max-h-none' : 'max-h-96 overflow-hidden'}`}>
        <div className="p-6 space-y-4">
          {historyData?.map((item, index) => (
            <div
              key={item?.id}
              className="flex items-center justify-between p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                {/* File Icon */}
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon 
                    name={getFileIcon(item?.fileName)} 
                    size={18} 
                    color="var(--color-primary)" 
                  />
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {item?.fileName}
                  </p>
                  <div className="flex items-center space-x-3 mt-1">
                    <span className="text-xs text-text-secondary">
                      {item?.fileSize}
                    </span>
                    <span className="text-xs text-text-secondary">
                      {item?.processingTime}
                    </span>
                    <span className="text-xs text-text-secondary">
                      {new Date(item.timestamp)?.toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Status & Confidence */}
                <div className="flex items-center space-x-3 flex-shrink-0">
                  <div className="text-right">
                    <div className="flex items-center space-x-1">
                      <Icon 
                        name={getStatusIcon(item?.status)} 
                        size={14} 
                        color={`var(--color-${getStatusColor(item?.status)})`} 
                      />
                      <span className={`text-sm font-medium text-${getStatusColor(item?.status)}`}>
                        {item?.status}
                      </span>
                    </div>
                    <p className="text-xs text-text-secondary mt-1">
                      {item?.confidence}% confidence
                    </p>
                  </div>

                  {/* Action Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="ExternalLink"
                    iconSize={14}
                    className="text-text-secondary hover:text-foreground"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-muted/20">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">
              Showing last {historyData?.length} analyses
            </span>
            <Button variant="outline" size="sm">
              View All History
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisHistory;