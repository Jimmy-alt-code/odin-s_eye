import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const HistoryCard = ({ item, onViewDetails, onDelete, isSelected, onSelect }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Real':
        return 'text-success bg-success/10 border-success/20';
      case 'Deepfake':
        return 'text-destructive bg-destructive/10 border-destructive/20';
      case 'Inconclusive':
        return 'text-warning bg-warning/10 border-warning/20';
      default:
        return 'text-text-secondary bg-muted border-border';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 80) return 'text-success';
    if (confidence >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  return (
    <div className={`bg-card border border-border rounded-lg p-4 transition-micro hover:shadow-elevated ${
      isSelected ? 'ring-2 ring-primary' : ''
    }`}>
      <div className="flex items-start space-x-4">
        {/* Selection Checkbox */}
        <div className="flex items-center pt-1">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => onSelect(item?.id, e?.target?.checked)}
            className="w-4 h-4 text-primary bg-input border-border rounded focus:ring-primary focus:ring-2"
          />
        </div>

        {/* File Thumbnail */}
        <div className="flex-shrink-0">
          <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden flex items-center justify-center">
            {item?.type === 'video' ? (
              <Image
                src={item?.thumbnail}
                alt={`${item?.filename} thumbnail`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center">
                <Icon name="AudioWaveform" size={20} color="var(--color-text-secondary)" />
                <span className="text-xs text-text-secondary mt-1">Audio</span>
              </div>
            )}
          </div>
        </div>

        {/* File Details */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-foreground truncate">
                {item?.filename}
              </h3>
              <div className="flex items-center space-x-4 mt-1">
                <span className="text-xs text-text-secondary">
                  {new Date(item.analysisDate)?.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                <span className="text-xs text-text-secondary">
                  {formatFileSize(item?.fileSize)}
                </span>
                <span className="text-xs text-text-secondary">
                  {item?.processingTime}ms
                </span>
              </div>
            </div>

            {/* Status Badge */}
            <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(item?.status)}`}>
              {item?.status}
            </div>
          </div>

          {/* Confidence Score */}
          <div className="flex items-center space-x-2 mt-2">
            <span className="text-xs text-text-secondary">Confidence:</span>
            <span className={`text-sm font-semibold ${getConfidenceColor(item?.confidence)}`}>
              {item?.confidence}%
            </span>
            <div className="flex-1 bg-muted rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  item?.confidence >= 80 ? 'bg-success' :
                  item?.confidence >= 60 ? 'bg-warning' : 'bg-destructive'
                }`}
                style={{ width: `${item?.confidence}%` }}
              />
            </div>
          </div>

          {/* Algorithm Version */}
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-text-secondary">
              Algorithm: {item?.algorithmVersion}
            </span>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="xs"
                iconName="Eye"
                iconSize={14}
                onClick={() => onViewDetails(item)}
                className="text-text-secondary hover:text-foreground"
              >
                View
              </Button>
              <Button
                variant="ghost"
                size="xs"
                iconName="Download"
                iconSize={14}
                className="text-text-secondary hover:text-foreground"
              >
                Report
              </Button>
              <Button
                variant="ghost"
                size="xs"
                iconName="Trash2"
                iconSize={14}
                onClick={() => onDelete(item?.id)}
                className="text-text-secondary hover:text-destructive"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryCard;