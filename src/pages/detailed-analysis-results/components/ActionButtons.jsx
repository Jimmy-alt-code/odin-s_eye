import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActionButtons = ({ fileData, onReanalyze }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);

  const handleDownloadReport = async () => {
    setIsDownloading(true);
    // Simulate download process
    setTimeout(() => {
      setIsDownloading(false);
      // In a real app, this would trigger the actual download
      console.log('Downloading report for:', fileData?.filename);
    }, 2000);
  };

  const handleShare = async (platform) => {
    setIsSharing(true);
    setShowShareMenu(false);
    
    // Simulate sharing process
    setTimeout(() => {
      setIsSharing(false);
      console.log(`Sharing to ${platform}:`, fileData?.filename);
    }, 1500);
  };

  const shareOptions = [
    { name: 'Copy Link', icon: 'Link', action: () => handleShare('link') },
    { name: 'Email', icon: 'Mail', action: () => handleShare('email') },
    { name: 'Export PDF', icon: 'FileText', action: () => handleShare('pdf') },
    { name: 'Export JSON', icon: 'Code', action: () => handleShare('json') }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 shadow-card">
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="Zap" size={20} color="var(--color-primary)" strokeWidth={2} />
        <h2 className="text-lg font-semibold text-foreground">Actions</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Download Report */}
        <Button
          variant="default"
          fullWidth
          loading={isDownloading}
          iconName="Download"
          iconPosition="left"
          onClick={handleDownloadReport}
          className="h-12"
        >
          Download Report
        </Button>

        {/* Share Results */}
        <div className="relative">
          <Button
            variant="outline"
            fullWidth
            loading={isSharing}
            iconName="Share2"
            iconPosition="left"
            onClick={() => setShowShareMenu(!showShareMenu)}
            className="h-12"
          >
            Share Results
          </Button>

          {/* Share Dropdown */}
          {showShareMenu && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setShowShareMenu(false)}
              />
              <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-elevated z-20">
                <div className="py-2">
                  {shareOptions?.map((option) => (
                    <button
                      key={option?.name}
                      onClick={option?.action}
                      className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-text-secondary hover:text-foreground hover:bg-muted transition-micro"
                    >
                      <Icon name={option?.icon} size={16} color="currentColor" />
                      <span>{option?.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Reanalyze */}
        <Button
          variant="secondary"
          fullWidth
          iconName="RefreshCw"
          iconPosition="left"
          onClick={onReanalyze}
          className="h-12"
        >
          Reanalyze
        </Button>

        {/* View History */}
        <Button
          variant="ghost"
          fullWidth
          iconName="History"
          iconPosition="left"
          onClick={() => window.location.href = '/analysis-history-archive'}
          className="h-12"
        >
          View History
        </Button>
      </div>
      {/* Additional Options */}
      <div className="mt-6 pt-6 border-t border-border">
        <h3 className="text-sm font-medium text-foreground mb-3">Advanced Options</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            variant="ghost"
            size="sm"
            iconName="Settings"
            iconPosition="left"
            onClick={() => console.log('Configure analysis parameters')}
          >
            Configure Parameters
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="BarChart3"
            iconPosition="left"
            onClick={() => console.log('Compare with other files')}
          >
            Compare Results
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="Flag"
            iconPosition="left"
            onClick={() => console.log('Report false positive')}
          >
            Report Issue
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconName="BookOpen"
            iconPosition="left"
            onClick={() => console.log('View documentation')}
          >
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ActionButtons;