import React from 'react';

import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const FilterSidebar = ({ 
  isOpen, 
  onClose, 
  filters, 
  onFiltersChange, 
  onClearFilters,
  onApplyFilters 
}) => {
  const statusOptions = [
    { value: 'all', label: 'All Status', count: 156 },
    { value: 'real', label: 'Real', count: 89 },
    { value: 'deepfake', label: 'Deepfake', count: 43 },
    { value: 'inconclusive', label: 'Inconclusive', count: 24 }
  ];

  const confidenceRanges = [
    { value: 'all', label: 'All Confidence', min: 0, max: 100 },
    { value: 'high', label: 'High (80-100%)', min: 80, max: 100 },
    { value: 'medium', label: 'Medium (60-79%)', min: 60, max: 79 },
    { value: 'low', label: 'Low (0-59%)', min: 0, max: 59 }
  ];

  const fileTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'video', label: 'Video Files' },
    { value: 'audio', label: 'Audio Files' }
  ];

  const algorithmVersions = [
    { value: 'all', label: 'All Versions' },
    { value: 'v2.1.3', label: 'v2.1.3 (Latest)' },
    { value: 'v2.1.2', label: 'v2.1.2' },
    { value: 'v2.1.1', label: 'v2.1.1' },
    { value: 'v2.0.8', label: 'v2.0.8' }
  ];

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      {/* Sidebar */}
      <div className={`
        fixed lg:sticky top-0 right-0 lg:right-auto h-full lg:h-auto
        w-80 bg-card border-l lg:border-l-0 lg:border-r border-border
        transform transition-transform duration-300 z-50 lg:z-auto
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        lg:w-64 lg:flex-shrink-0
      `}>
        <div className="h-full overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Filters</h3>
            <Button
              variant="ghost"
              size="xs"
              iconName="X"
              iconSize={16}
              onClick={onClose}
              className="lg:hidden"
            />
          </div>

          <div className="p-4 space-y-6">
            {/* Date Range */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">Date Range</h4>
              <div className="space-y-3">
                <Input
                  type="date"
                  label="From"
                  value={filters?.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e?.target?.value)}
                  className="text-sm"
                />
                <Input
                  type="date"
                  label="To"
                  value={filters?.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e?.target?.value)}
                  className="text-sm"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">Detection Status</h4>
              <div className="space-y-2">
                {statusOptions?.map((option) => (
                  <label key={option?.value} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value={option?.value}
                      checked={filters?.status === option?.value}
                      onChange={(e) => handleFilterChange('status', e?.target?.value)}
                      className="w-4 h-4 text-primary bg-input border-border focus:ring-primary focus:ring-2"
                    />
                    <div className="flex items-center justify-between flex-1">
                      <span className="text-sm text-foreground">{option?.label}</span>
                      <span className="text-xs text-text-secondary">{option?.count}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Confidence Range */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">Confidence Level</h4>
              <div className="space-y-2">
                {confidenceRanges?.map((range) => (
                  <label key={range?.value} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="confidence"
                      value={range?.value}
                      checked={filters?.confidence === range?.value}
                      onChange={(e) => handleFilterChange('confidence', e?.target?.value)}
                      className="w-4 h-4 text-primary bg-input border-border focus:ring-primary focus:ring-2"
                    />
                    <span className="text-sm text-foreground">{range?.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* File Type */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">File Type</h4>
              <div className="space-y-2">
                {fileTypes?.map((type) => (
                  <label key={type?.value} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="fileType"
                      value={type?.value}
                      checked={filters?.fileType === type?.value}
                      onChange={(e) => handleFilterChange('fileType', e?.target?.value)}
                      className="w-4 h-4 text-primary bg-input border-border focus:ring-primary focus:ring-2"
                    />
                    <span className="text-sm text-foreground">{type?.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Algorithm Version */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">Algorithm Version</h4>
              <div className="space-y-2">
                {algorithmVersions?.map((version) => (
                  <label key={version?.value} className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="radio"
                      name="algorithm"
                      value={version?.value}
                      checked={filters?.algorithm === version?.value}
                      onChange={(e) => handleFilterChange('algorithm', e?.target?.value)}
                      className="w-4 h-4 text-primary bg-input border-border focus:ring-primary focus:ring-2"
                    />
                    <span className="text-sm text-foreground">{version?.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* File Size Range */}
            <div>
              <h4 className="text-sm font-medium text-foreground mb-3">File Size (MB)</h4>
              <div className="space-y-3">
                <Input
                  type="number"
                  label="Min Size"
                  placeholder="0"
                  value={filters?.minSize}
                  onChange={(e) => handleFilterChange('minSize', e?.target?.value)}
                  className="text-sm"
                />
                <Input
                  type="number"
                  label="Max Size"
                  placeholder="1000"
                  value={filters?.maxSize}
                  onChange={(e) => handleFilterChange('maxSize', e?.target?.value)}
                  className="text-sm"
                />
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-border space-y-2">
            <Button
              variant="default"
              fullWidth
              onClick={onApplyFilters}
              iconName="Filter"
              iconSize={16}
            >
              Apply Filters
            </Button>
            <Button
              variant="outline"
              fullWidth
              onClick={onClearFilters}
              iconName="RotateCcw"
              iconSize={16}
            >
              Clear All
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;