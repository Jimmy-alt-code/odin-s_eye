import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const location = useLocation();

  const isActiveRoute = (path) => {
    return location?.pathname === path;
  };

  const primaryNavItems = [
    {
      name: 'Analysis Dashboard',
      path: '/main-analysis-dashboard',
      icon: 'BarChart3'
    },
    {
      name: 'Analysis Results',
      path: '/detailed-analysis-results',
      icon: 'FileSearch'
    },
    {
      name: 'History Archive',
      path: '/analysis-history-archive',
      icon: 'Archive'
    }
  ];

  const secondaryNavItems = [
    { name: 'Settings', icon: 'Settings' },
    { name: 'Help & Support', icon: 'HelpCircle' },
    { name: 'Documentation', icon: 'BookOpen' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-surface border-b border-border shadow-card">
      <div className="flex items-center justify-between h-16 px-6">
        {/* Logo Section */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary">
            <Icon name="Shield" size={24} color="white" strokeWidth={2.5} />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-foreground leading-tight">
              Deepfake Radar
            </h1>
            <span className="text-xs text-text-secondary font-medium">
              AI Media Verification
            </span>
          </div>
        </div>

        {/* Primary Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          {primaryNavItems?.map((item) => (
            <Link
              key={item?.path}
              to={item?.path}
              className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-micro hover-scale ${
                isActiveRoute(item?.path)
                  ? 'bg-primary text-primary-foreground shadow-card'
                  : 'text-text-secondary hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon 
                name={item?.icon} 
                size={16} 
                color="currentColor" 
                strokeWidth={2}
              />
              <span>{item?.name}</span>
            </Link>
          ))}
        </nav>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* More Menu */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              iconName="MoreHorizontal"
              iconSize={18}
              onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
              className="hidden md:flex"
            >
              More
            </Button>

            {/* More Dropdown */}
            {isMoreMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => setIsMoreMenuOpen(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-48 bg-popover border border-border rounded-lg shadow-elevated z-20">
                  <div className="py-2">
                    {secondaryNavItems?.map((item) => (
                      <button
                        key={item?.name}
                        className="flex items-center space-x-3 w-full px-4 py-2 text-sm text-text-secondary hover:text-foreground hover:bg-muted transition-micro"
                        onClick={() => setIsMoreMenuOpen(false)}
                      >
                        <Icon name={item?.icon} size={16} color="currentColor" />
                        <span>{item?.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Profile */}
          <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-muted">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center">
              <Icon name="User" size={16} color="white" strokeWidth={2} />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-foreground">Analyst</p>
              <p className="text-xs text-text-secondary">Online</p>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            iconName="Menu"
            iconSize={20}
            className="md:hidden"
            onClick={() => {/* Mobile menu logic */}}
          />
        </div>
      </div>
      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-border bg-surface">
        <nav className="flex overflow-x-auto px-4 py-2 space-x-1">
          {primaryNavItems?.map((item) => (
            <Link
              key={item?.path}
              to={item?.path}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-micro ${
                isActiveRoute(item?.path)
                  ? 'bg-primary text-primary-foreground'
                  : 'text-text-secondary hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon 
                name={item?.icon} 
                size={16} 
                color="currentColor" 
                strokeWidth={2}
              />
              <span>{item?.name}</span>
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;