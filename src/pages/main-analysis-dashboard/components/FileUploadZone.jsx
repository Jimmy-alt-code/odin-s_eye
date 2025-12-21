import React, { useState, useCallback } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FileUploadZone = ({ onFileSelect, selectedFile, isAnalyzing }) => {
  const [dragActive, setDragActive] = useState(false);
  const [uploadError, setUploadError] = useState('');

  const handleDrag = useCallback((e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (e?.type === "dragenter" || e?.type === "dragover") {
      setDragActive(true);
    } else if (e?.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragActive(false);
    setUploadError('');

    if (e?.dataTransfer?.files && e?.dataTransfer?.files?.[0]) {
      const file = e?.dataTransfer?.files?.[0];
      validateAndSelectFile(file);
    }
  }, []);

  const handleFileInput = useCallback((e) => {
    setUploadError('');
    if (e?.target?.files && e?.target?.files?.[0]) {
      const file = e?.target?.files?.[0];
      validateAndSelectFile(file);
    }
  }, []);

  const validateAndSelectFile = (file) => {
    const maxSize = 100 * 1024 * 1024; // 100MB
    const allowedTypes = [
      'video/mp4', 'video/avi', 'video/mov', 'video/wmv', 'video/quicktime',
      'audio/mp3', 'audio/wav', 'audio/m4a', 'audio/aac', 'audio/mpeg',
      'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'
    ];

    // Check if file exists
    if (!file) {
      setUploadError('No file selected. Please choose a file to upload.');
      return;
    }

    // Check file size
    if (file.size === 0) {
      setUploadError('Selected file is empty. Please choose a valid media file.');
      return;
    }

    if (file.size > maxSize) {
      const sizeMB = (file.size / 1024 / 1024).toFixed(1);
      setUploadError(`File size (${sizeMB}MB) exceeds the 100MB limit. Please choose a smaller file.`);
      return;
    }

    // Check file type
    if (!allowedTypes.includes(file.type)) {
      setUploadError(`Unsupported file type: ${file.type}. Please upload a video (MP4, AVI, MOV, WMV), audio (MP3, WAV, M4A, AAC), or image (JPEG, PNG, GIF, WebP) file.`);
      return;
    }

    // Check for suspicious file names (basic security)
    const suspiciousPatterns = ['.exe', '.bat', '.cmd', '.scr', '.js', '.vbs'];
    if (suspiciousPatterns.some(pattern => file.name.toLowerCase().includes(pattern))) {
      setUploadError('File type not allowed for security reasons. Please upload media files only.');
      return;
    }

    // Minimum file size check (too small files are suspicious)
    const minSizes = {
      video: 1024 * 50,    // 50KB minimum for video
      audio: 1024 * 10,    // 10KB minimum for audio
      image: 1024 * 2      // 2KB minimum for image
    };
    
    const fileType = file.type.split('/')[0];
    const minSize = minSizes[fileType] || 1024;
    
    if (file.size < minSize) {
      setUploadError(`File seems too small (${(file.size / 1024).toFixed(1)}KB) for a valid ${fileType} file.`);
      return;
    }

    // Success - clear any previous errors
    setUploadError('');
    onFileSelect(file);
  };

  return (
    <div className="w-full">
      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
          dragActive
            ? 'border-primary bg-primary/5 scale-[1.02]'
            : selectedFile
            ? 'border-success bg-success/5' :'border-border bg-muted/30 hover:border-primary/50 hover:bg-primary/5'
        } ${isAnalyzing ? 'pointer-events-none opacity-60' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          accept="video/*,audio/*"
          onChange={handleFileInput}
          disabled={isAnalyzing}
        />

        <div className="flex flex-col items-center space-y-4">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-colors ${
            dragActive
              ? 'bg-primary text-primary-foreground'
              : selectedFile
              ? 'bg-success text-success-foreground'
              : 'bg-muted text-muted-foreground'
          }`}>
            <Icon 
              name={selectedFile ? "CheckCircle" : dragActive ? "Upload" : "FileVideo"} 
              size={32} 
              color="currentColor" 
            />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-foreground">
              {selectedFile ? 'File Selected' : 'Upload Media File'}
            </h3>
            <p className="text-sm text-text-secondary max-w-md">
              {selectedFile 
                ? `${selectedFile?.name} (${(selectedFile?.size / 1024 / 1024)?.toFixed(1)} MB)`
                : 'Drag and drop your video or audio file here, or click to browse'
              }
            </p>
          </div>

          {!selectedFile && (
            <Button variant="outline" size="sm" className="mt-4">
              <Icon name="FolderOpen" size={16} className="mr-2" />
              Choose File
            </Button>
          )}
        </div>

        <div className="mt-6 text-xs text-text-secondary">
          <p>Supported formats: MP4, AVI, MOV, WMV, MP3, WAV, M4A, AAC</p>
          <p>Maximum file size: 100MB</p>
        </div>
      </div>
      {uploadError && (
        <div className="mt-4 p-3 bg-error/10 border border-error/20 rounded-lg flex items-center space-x-2">
          <Icon name="AlertCircle" size={16} color="var(--color-error)" />
          <span className="text-sm text-error">{uploadError}</span>
        </div>
      )}
    </div>
  );
};

export default FileUploadZone;