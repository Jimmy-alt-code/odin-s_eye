import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SearchAndSort = ({ 
  searchQuery, 
  onSearchChange, 
  sortBy, 
  sortOrder, 
  onSortChange,
  viewMode,
  onViewModeChange,
  onRefresh,
  onToggleFilters,
  isRefreshing 
}) => {
  const sortOptions = [
    { value: 'date', label: 'Analysis Date' },
    { value: 'filename', label: 'File Name' },
    { value: 'confidence', label: 'Confidence Score' },
    { value: 'status', label: 'Detection Status' },
    { value: 'fileSize', label: 'File Size' },
    { value: 'processingTime', label: 'Processing Time' }
  ];

  const handleSortChange = (newSortBy) => {
    if (sortBy === newSortBy) {
      onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      onSortChange(newSortBy, 'desc');
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 space-y-4">
      {/* Search and Actions Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4">
        {/* Search Input */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Icon 
              name="Search" 
              size={16} 
              color="var(--color-text-secondary)"
              className="absolute left-3 top-1/2 transform -translate-y-1/2"
            />
            <Input
              type="search"
              placeholder="Search by filename, status, or algorithm..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e?.target?.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            iconName="RefreshCw"
            iconSize={16}
            onClick={onRefresh}
            loading={isRefreshing}
            className="flex-shrink-0"
          >
            <span className="hidden sm:inline">Refresh</span>
          </Button>

          <Button
            variant="outline"
            size="sm"
            iconName="Filter"
            iconSize={16}
            onClick={onToggleFilters}
            className="lg:hidden flex-shrink-0"
          >
            Filters
          </Button>

          {/* View Mode Toggle */}
          <div className="hidden md:flex items-center bg-muted rounded-lg p-1">
            <Button
              variant={viewMode === 'card' ? 'default' : 'ghost'}
              size="xs"
              iconName="LayoutGrid"
              iconSize={16}
              onClick={() => onViewModeChange('card')}
              className="rounded-md"
            />
            <Button
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              size="xs"
              iconName="List"
              iconSize={16}
              onClick={() => onViewModeChange('table')}
              className="rounded-md"
            />
          </div>
        </div>
      </div>
      {/* Sort Options */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-text-secondary font-medium">Sort by:</span>
        {sortOptions?.map((option) => (
          <Button
            key={option?.value}
            variant={sortBy === option?.value ? 'default' : 'ghost'}
            size="xs"
            onClick={() => handleSortChange(option?.value)}
            className="text-xs"
          >
            {option?.label}
            {sortBy === option?.value && (
              <Icon 
                name={sortOrder === 'asc' ? 'ChevronUp' : 'ChevronDown'} 
                size={12} 
                color="currentColor"
                className="ml-1"
              />
            )}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SearchAndSort;