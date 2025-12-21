import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import HistoryCard from './components/HistoryCard';
import HistoryTable from './components/HistoryTable';
import FilterSidebar from './components/FilterSidebar';
import BulkActions from './components/BulkActions';
import SearchAndSort from './components/SearchAndSort';
import EmptyState from './components/EmptyState';
import Pagination from './components/Pagination';
import Icon from '../../components/AppIcon';

const AnalysisHistoryArchive = () => {
  const navigate = useNavigate();
  
  // Mock data for analysis history
  const mockHistoryData = [
    {
      id: 'ah_001',
      filename: 'interview_deepfake_test.mp4',
      type: 'video',
      thumbnail: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop',
      analysisDate: new Date('2025-08-28T10:30:00'),
      status: 'Deepfake',
      confidence: 92,
      fileSize: 45678912,
      processingTime: 2847,
      algorithmVersion: 'v2.1.3'
    },
    {
      id: 'ah_002',
      filename: 'news_conference_authentic.mp4',
      type: 'video',
      thumbnail: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=300&fit=crop',
      analysisDate: new Date('2025-08-28T09:15:00'),
      status: 'Real',
      confidence: 87,
      fileSize: 78234567,
      processingTime: 3124,
      algorithmVersion: 'v2.1.3'
    },
    {
      id: 'ah_003',
      filename: 'podcast_audio_sample.mp3',
      type: 'audio',
      thumbnail: null,
      analysisDate: new Date('2025-08-27T16:45:00'),
      status: 'Real',
      confidence: 94,
      fileSize: 12345678,
      processingTime: 1892,
      algorithmVersion: 'v2.1.2'
    },
    {
      id: 'ah_004',
      filename: 'suspicious_voice_call.wav',
      type: 'audio',
      thumbnail: null,
      analysisDate: new Date('2025-08-27T14:20:00'),
      status: 'Inconclusive',
      confidence: 67,
      fileSize: 8765432,
      processingTime: 2156,
      algorithmVersion: 'v2.1.2'
    },
    {
      id: 'ah_005',
      filename: 'celebrity_fake_video.mp4',
      type: 'video',
      thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
      analysisDate: new Date('2025-08-27T11:30:00'),
      status: 'Deepfake',
      confidence: 89,
      fileSize: 56789123,
      processingTime: 3456,
      algorithmVersion: 'v2.1.2'
    },
    {
      id: 'ah_006',
      filename: 'corporate_presentation.mp4',
      type: 'video',
      thumbnail: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop',
      analysisDate: new Date('2025-08-26T15:10:00'),
      status: 'Real',
      confidence: 91,
      fileSize: 34567890,
      processingTime: 2789,
      algorithmVersion: 'v2.1.1'
    },
    {
      id: 'ah_007',
      filename: 'social_media_clip.mp4',
      type: 'video',
      thumbnail: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=400&h=300&fit=crop',
      analysisDate: new Date('2025-08-26T12:45:00'),
      status: 'Deepfake',
      confidence: 85,
      fileSize: 23456789,
      processingTime: 2234,
      algorithmVersion: 'v2.1.1'
    },
    {
      id: 'ah_008',
      filename: 'radio_interview.mp3',
      type: 'audio',
      thumbnail: null,
      analysisDate: new Date('2025-08-25T18:20:00'),
      status: 'Real',
      confidence: 96,
      fileSize: 15678901,
      processingTime: 1567,
      algorithmVersion: 'v2.1.1'
    }
  ];

  // State management
  const [historyData, setHistoryData] = useState(mockHistoryData);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('card');
  const [selectedItems, setSelectedItems] = useState([]);
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Filter state
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    status: 'all',
    confidence: 'all',
    fileType: 'all',
    algorithm: 'all',
    minSize: '',
    maxSize: ''
  });

  // Filter and search logic
  const filteredAndSortedData = useMemo(() => {
    let filtered = [...historyData];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered?.filter(item =>
        item?.filename?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        item?.status?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        item?.algorithmVersion?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
    }

    // Apply filters
    if (filters?.status !== 'all') {
      filtered = filtered?.filter(item => 
        item?.status?.toLowerCase() === filters?.status?.toLowerCase()
      );
    }

    if (filters?.confidence !== 'all') {
      const confidenceRanges = {
        high: [80, 100],
        medium: [60, 79],
        low: [0, 59]
      };
      const [min, max] = confidenceRanges?.[filters?.confidence] || [0, 100];
      filtered = filtered?.filter(item => 
        item?.confidence >= min && item?.confidence <= max
      );
    }

    if (filters?.fileType !== 'all') {
      filtered = filtered?.filter(item => item?.type === filters?.fileType);
    }

    if (filters?.algorithm !== 'all') {
      filtered = filtered?.filter(item => item?.algorithmVersion === filters?.algorithm);
    }

    if (filters?.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filtered = filtered?.filter(item => new Date(item.analysisDate) >= fromDate);
    }

    if (filters?.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate?.setHours(23, 59, 59, 999);
      filtered = filtered?.filter(item => new Date(item.analysisDate) <= toDate);
    }

    if (filters?.minSize) {
      const minBytes = parseFloat(filters?.minSize) * 1024 * 1024;
      filtered = filtered?.filter(item => item?.fileSize >= minBytes);
    }

    if (filters?.maxSize) {
      const maxBytes = parseFloat(filters?.maxSize) * 1024 * 1024;
      filtered = filtered?.filter(item => item?.fileSize <= maxBytes);
    }

    // Apply sorting
    filtered?.sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case 'date':
          aValue = new Date(a.analysisDate);
          bValue = new Date(b.analysisDate);
          break;
        case 'filename':
          aValue = a?.filename?.toLowerCase();
          bValue = b?.filename?.toLowerCase();
          break;
        case 'confidence':
          aValue = a?.confidence;
          bValue = b?.confidence;
          break;
        case 'status':
          aValue = a?.status;
          bValue = b?.status;
          break;
        case 'fileSize':
          aValue = a?.fileSize;
          bValue = b?.fileSize;
          break;
        case 'processingTime':
          aValue = a?.processingTime;
          bValue = b?.processingTime;
          break;
        default:
          aValue = a?.analysisDate;
          bValue = b?.analysisDate;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [historyData, searchQuery, sortBy, sortOrder, filters]);

  // Pagination logic
  const totalItems = filteredAndSortedData?.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filteredAndSortedData?.slice(startIndex, startIndex + itemsPerPage);

  // Event handlers
  const handleViewDetails = (item) => {
    navigate('/detailed-analysis-results', { state: { analysisData: item } });
  };

  const handleDelete = (itemId) => {
    if (window.confirm('Are you sure you want to delete this analysis?')) {
      setHistoryData(prev => prev?.filter(item => item?.id !== itemId));
      setSelectedItems(prev => prev?.filter(id => id !== itemId));
    }
  };

  const handleSelectItem = (itemId, isSelected) => {
    setSelectedItems(prev => 
      isSelected 
        ? [...prev, itemId]
        : prev?.filter(id => id !== itemId)
    );
  };

  const handleSelectAll = (isSelected) => {
    setSelectedItems(isSelected ? paginatedData?.map(item => item?.id) : []);
  };

  const handleBulkDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${selectedItems?.length} selected items?`)) {
      setHistoryData(prev => prev?.filter(item => !selectedItems?.includes(item?.id)));
      setSelectedItems([]);
    }
  };

  const handleBulkExport = () => {
    const selectedData = historyData?.filter(item => selectedItems?.includes(item?.id));
    const exportData = selectedData?.map(item => ({
      filename: item?.filename,
      analysisDate: item?.analysisDate?.toISOString(),
      status: item?.status,
      confidence: item?.confidence,
      fileSize: item?.fileSize,
      processingTime: item?.processingTime,
      algorithmVersion: item?.algorithmVersion
    }));
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `analysis_history_export_${new Date()?.toISOString()?.split('T')?.[0]}.json`;
    document.body?.appendChild(a);
    a?.click();
    document.body?.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  const handleClearFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      status: 'all',
      confidence: 'all',
      fileType: 'all',
      algorithm: 'all',
      minSize: '',
      maxSize: ''
    });
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleApplyFilters = () => {
    setCurrentPage(1);
    setIsFilterSidebarOpen(false);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setSelectedItems([]);
  };

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
    setSelectedItems([]);
  };

  // Check if filters are active
  const hasActiveFilters = Object.values(filters)?.some(value => 
    value !== '' && value !== 'all'
  ) || searchQuery !== '';

  // Responsive view mode
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setViewMode('card');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="flex">
          {/* Filter Sidebar */}
          <FilterSidebar
            isOpen={isFilterSidebarOpen}
            onClose={() => setIsFilterSidebarOpen(false)}
            filters={filters}
            onFiltersChange={setFilters}
            onClearFilters={handleClearFilters}
            onApplyFilters={handleApplyFilters}
          />

          {/* Main Content */}
          <div className="flex-1 p-6 lg:pl-6">
            {/* Breadcrumb */}
            <div className="flex items-center space-x-2 text-sm text-text-secondary mb-6">
              <span>Dashboard</span>
              <Icon name="ChevronRight" size={14} color="currentColor" />
              <span className="text-foreground font-medium">Analysis History</span>
            </div>

            {/* Page Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-foreground mb-2">
                Analysis History Archive
              </h1>
              <p className="text-text-secondary">
                Browse and manage your complete deepfake detection history with advanced filtering and search capabilities.
              </p>
            </div>

            {/* Search and Sort Controls */}
            <div className="mb-6">
              <SearchAndSort
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSortChange={(newSortBy, newSortOrder) => {
                  setSortBy(newSortBy);
                  setSortOrder(newSortOrder);
                  setCurrentPage(1);
                }}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                onRefresh={handleRefresh}
                onToggleFilters={() => setIsFilterSidebarOpen(true)}
                isRefreshing={isRefreshing}
              />
            </div>

            {/* Results Summary */}
            {totalItems > 0 && (
              <div className="mb-4">
                <p className="text-sm text-text-secondary">
                  {hasActiveFilters ? (
                    <>Showing {totalItems} filtered result{totalItems !== 1 ? 's' : ''} from {historyData?.length} total</>
                  ) : (
                    <>Showing all {totalItems} analysis result{totalItems !== 1 ? 's' : ''}</>
                  )}
                </p>
              </div>
            )}

            {/* Content Area */}
            {totalItems === 0 ? (
              <EmptyState 
                hasFilters={hasActiveFilters}
                onClearFilters={handleClearFilters}
              />
            ) : (
              <>
                {/* History List/Table */}
                {viewMode === 'card' ? (
                  <div className="space-y-4 mb-6">
                    {paginatedData?.map((item) => (
                      <HistoryCard
                        key={item?.id}
                        item={item}
                        onViewDetails={handleViewDetails}
                        onDelete={handleDelete}
                        isSelected={selectedItems?.includes(item?.id)}
                        onSelect={handleSelectItem}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="mb-6">
                    <HistoryTable
                      items={paginatedData}
                      onViewDetails={handleViewDetails}
                      onDelete={handleDelete}
                      selectedItems={selectedItems}
                      onSelectAll={handleSelectAll}
                      onSelectItem={handleSelectItem}
                    />
                  </div>
                )}

                {/* Pagination */}
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={totalItems}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                  onItemsPerPageChange={handleItemsPerPageChange}
                />
              </>
            )}
          </div>
        </div>
      </div>
      {/* Bulk Actions */}
      <BulkActions
        selectedCount={selectedItems?.length}
        onDeleteSelected={handleBulkDelete}
        onExportSelected={handleBulkExport}
        onClearSelection={() => setSelectedItems([])}
        isVisible={selectedItems?.length > 0}
      />
    </div>
  );
};

export default AnalysisHistoryArchive;