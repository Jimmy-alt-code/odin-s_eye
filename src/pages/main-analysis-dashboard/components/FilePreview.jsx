import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FilePreview = ({ file, onRemove }) => {
  const [previewUrl, setPreviewUrl] = useState('');
  const [fileType, setFileType] = useState('');

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setFileType(file?.type?.startsWith('video') ? 'video' : 'audio');

      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  if (!file) return null;

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs?.toString()?.padStart(2, '0')}`;
  };

  return (
    <div className="w-full bg-card border border-border rounded-xl p-6 shadow-card">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">File Preview</h3>
        <Button
          variant="ghost"
          size="sm"
          iconName="X"
          iconSize={16}
          onClick={onRemove}
          className="text-text-secondary hover:text-foreground"
        />
      </div>
      <div className="space-y-4">
        {/* File Info */}
        <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon 
              name={fileType === 'video' ? 'Video' : 'Music'} 
              size={20} 
              color="var(--color-primary)" 
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {file?.name}
            </p>
            <p className="text-xs text-text-secondary">
              {formatFileSize(file?.size)} • {fileType?.toUpperCase()}
            </p>
          </div>
        </div>

        {/* Media Preview */}
        <div className="relative bg-black rounded-lg overflow-hidden">
          {fileType === 'video' ? (
            <video
              src={previewUrl}
              controls
              className="w-full h-48 object-contain"
              preload="metadata"
            >
              Your browser does not support video playback.
            </video>
          ) : (
            <div className="w-full h-48 flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                <Icon name="Music" size={32} color="var(--color-primary)" />
              </div>
              <audio
                src={previewUrl}
                controls
                className="w-full max-w-sm"
                preload="metadata"
              >
                Your browser does not support audio playback.
              </audio>
            </div>
          )}
        </div>

        {/* File Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <span className="text-text-secondary">File Type</span>
            <p className="font-medium text-foreground">{file?.type}</p>
          </div>
          <div className="space-y-1">
            <span className="text-text-secondary">Last Modified</span>
            <p className="font-medium text-foreground">
              {new Date(file.lastModified)?.toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Analysis Ready Indicator */}
        <div className="flex items-center space-x-2 p-3 bg-success/10 border border-success/20 rounded-lg">
          <Icon name="CheckCircle" size={16} color="var(--color-success)" />
          <span className="text-sm text-success font-medium">
            File ready for analysis
          </span>
        </div>
      </div>
    </div>
  );
};

export default FilePreview;