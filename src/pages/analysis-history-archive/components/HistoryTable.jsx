import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const HistoryTable = ({ items, onViewDetails, onDelete, selectedItems, onSelectAll, onSelectItem }) => {
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

  const isAllSelected = items?.length > 0 && selectedItems?.length === items?.length;
  const isIndeterminate = selectedItems?.length > 0 && selectedItems?.length < items?.length;

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted border-b border-border">
            <tr>
              <th className="w-12 px-4 py-3 text-left">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = isIndeterminate;
                  }}
                  onChange={(e) => onSelectAll(e?.target?.checked)}
                  className="w-4 h-4 text-primary bg-input border-border rounded focus:ring-primary focus:ring-2"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                File
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Analysis Date
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Confidence
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                File Size
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Processing Time
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-text-secondary uppercase tracking-wider">
                Algorithm
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-text-secondary uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {items?.map((item) => (
              <tr key={item?.id} className="hover:bg-muted/50 transition-micro">
                <td className="px-4 py-4">
                  <input
                    type="checkbox"
                    checked={selectedItems?.includes(item?.id)}
                    onChange={(e) => onSelectItem(item?.id, e?.target?.checked)}
                    className="w-4 h-4 text-primary bg-input border-border rounded focus:ring-primary focus:ring-2"
                  />
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-muted rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                      {item?.type === 'video' ? (
                        <Image
                          src={item?.thumbnail}
                          alt={`${item?.filename} thumbnail`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Icon name="AudioWaveform" size={16} color="var(--color-text-secondary)" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate max-w-48">
                        {item?.filename}
                      </p>
                      <p className="text-xs text-text-secondary capitalize">
                        {item?.type}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-text-secondary">
                  {new Date(item.analysisDate)?.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </td>
                <td className="px-4 py-4">
                  <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(item?.status)}`}>
                    {item?.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center space-x-2">
                    <span className={`text-sm font-semibold ${getConfidenceColor(item?.confidence)}`}>
                      {item?.confidence}%
                    </span>
                    <div className="w-16 bg-muted rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          item?.confidence >= 80 ? 'bg-success' :
                          item?.confidence >= 60 ? 'bg-warning' : 'bg-destructive'
                        }`}
                        style={{ width: `${item?.confidence}%` }}
                      />
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-text-secondary">
                  {formatFileSize(item?.fileSize)}
                </td>
                <td className="px-4 py-4 text-sm text-text-secondary">
                  {item?.processingTime}ms
                </td>
                <td className="px-4 py-4 text-sm text-text-secondary">
                  {item?.algorithmVersion}
                </td>
                <td className="px-4 py-4 text-right">
                  <div className="flex items-center justify-end space-x-1">
                    <Button
                      variant="ghost"
                      size="xs"
                      iconName="Eye"
                      iconSize={14}
                      onClick={() => onViewDetails(item)}
                      className="text-text-secondary hover:text-foreground"
                    />
                    <Button
                      variant="ghost"
                      size="xs"
                      iconName="Download"
                      iconSize={14}
                      className="text-text-secondary hover:text-foreground"
                    />
                    <Button
                      variant="ghost"
                      size="xs"
                      iconName="Trash2"
                      iconSize={14}
                      onClick={() => onDelete(item?.id)}
                      className="text-text-secondary hover:text-destructive"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryTable;