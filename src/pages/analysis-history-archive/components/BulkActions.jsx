import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BulkActions = ({ 
  selectedCount, 
  onDeleteSelected, 
  onExportSelected, 
  onClearSelection,
  isVisible 
}) => {
  if (!isVisible || selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-30">
      <div className="bg-card border border-border rounded-lg shadow-elevated px-4 py-3">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="CheckCircle" size={16} color="var(--color-primary)" />
            <span className="text-sm font-medium text-foreground">
              {selectedCount} item{selectedCount !== 1 ? 's' : ''} selected
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              iconSize={14}
              onClick={onExportSelected}
            >
              Export
            </Button>
            
            <Button
              variant="destructive"
              size="sm"
              iconName="Trash2"
              iconSize={14}
              onClick={onDeleteSelected}
            >
              Delete
            </Button>

            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              iconSize={14}
              onClick={onClearSelection}
              className="text-text-secondary hover:text-foreground"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkActions;