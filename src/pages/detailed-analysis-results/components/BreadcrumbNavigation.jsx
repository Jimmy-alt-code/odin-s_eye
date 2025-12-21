import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const BreadcrumbNavigation = ({ filename }) => {
  const breadcrumbs = [
    { name: 'Dashboard', path: '/main-analysis-dashboard', icon: 'Home' },
    { name: 'Analysis Results', path: '/detailed-analysis-results', icon: 'FileSearch' },
    { name: filename || 'Current File', path: null, icon: 'File' }
  ];

  return (
    <nav className="flex items-center space-x-2 text-sm mb-6" aria-label="Breadcrumb">
      {breadcrumbs?.map((breadcrumb, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <Icon 
              name="ChevronRight" 
              size={14} 
              color="var(--color-text-secondary)" 
              strokeWidth={2}
            />
          )}
          
          {breadcrumb?.path ? (
            <Link
              to={breadcrumb?.path}
              className="flex items-center space-x-1 text-text-secondary hover:text-foreground transition-micro"
            >
              <Icon 
                name={breadcrumb?.icon} 
                size={14} 
                color="currentColor" 
                strokeWidth={2}
              />
              <span>{breadcrumb?.name}</span>
            </Link>
          ) : (
            <div className="flex items-center space-x-1 text-foreground font-medium">
              <Icon 
                name={breadcrumb?.icon} 
                size={14} 
                color="currentColor" 
                strokeWidth={2}
              />
              <span className="truncate max-w-xs">{breadcrumb?.name}</span>
            </div>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default BreadcrumbNavigation;