import React from 'react';
import Icon from '../../../components/AppIcon';

const FileMetadataCard = ({ fileData }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <Icon 
              name={fileData?.type === 'video' ? 'Video' : 'AudioWaveform'} 
              size={24} 
              color="white" 
              strokeWidth={2}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground truncate max-w-xs">
              {fileData?.filename}
            </h3>
            <p className="text-sm text-text-secondary">
              {fileData?.type === 'video' ? 'Video File' : 'Audio File'}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-foreground">
            {formatFileSize(fileData?.size)}
          </p>
          <p className="text-xs text-text-secondary">
            {formatDuration(fileData?.duration)}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-3 bg-muted rounded-lg">
          <Icon name="Calendar" size={16} color="var(--color-text-secondary)" className="mx-auto mb-1" />
          <p className="text-xs text-text-secondary">Upload Date</p>
          <p className="text-sm font-medium text-foreground">{fileData?.uploadDate}</p>
        </div>
        <div className="text-center p-3 bg-muted rounded-lg">
          <Icon name="Clock" size={16} color="var(--color-text-secondary)" className="mx-auto mb-1" />
          <p className="text-xs text-text-secondary">Processing Time</p>
          <p className="text-sm font-medium text-foreground">{fileData?.processingTime}</p>
        </div>
        <div className="text-center p-3 bg-muted rounded-lg">
          <Icon name="Zap" size={16} color="var(--color-text-secondary)" className="mx-auto mb-1" />
          <p className="text-xs text-text-secondary">Algorithm</p>
          <p className="text-sm font-medium text-foreground">{fileData?.algorithm}</p>
        </div>
        <div className="text-center p-3 bg-muted rounded-lg">
          <Icon name="Hash" size={16} color="var(--color-text-secondary)" className="mx-auto mb-1" />
          <p className="text-xs text-text-secondary">File Hash</p>
          <p className="text-sm font-medium text-foreground font-mono">
            {fileData?.hash?.substring(0, 8)}...
          </p>
        </div>
      </div>
    </div>
  );
};

export default FileMetadataCard;