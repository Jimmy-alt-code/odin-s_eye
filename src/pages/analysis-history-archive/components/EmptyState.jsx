import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmptyState = ({ hasFilters, onClearFilters }) => {
  if (hasFilters) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <Icon name="SearchX" size={32} color="var(--color-text-secondary)" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">
          No results found
        </h3>
        <p className="text-text-secondary text-center mb-6 max-w-md">
          No analysis history matches your current filters. Try adjusting your search criteria or clearing filters to see all results.
        </p>
        <Button
          variant="outline"
          onClick={onClearFilters}
          iconName="RotateCcw"
          iconSize={16}
        >
          Clear Filters
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mb-6">
        <Icon name="Archive" size={40} color="var(--color-primary)" />
      </div>
      <h3 className="text-xl font-semibold text-foreground mb-2">
        No Analysis History Yet
      </h3>
      <p className="text-text-secondary text-center mb-8 max-w-md">
        You haven't analyzed any media files yet. Start by uploading a video or audio file to begin detecting deepfakes and building your analysis history.
      </p>
      <Link to="/main-analysis-dashboard">
        <Button
          variant="default"
          iconName="Upload"
          iconSize={16}
        >
          Start First Analysis
        </Button>
      </Link>
    </div>
  );
};

export default EmptyState;