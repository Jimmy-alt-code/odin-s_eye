import React from "react";
import Icon from "./AppIcon";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      errorId: null
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // Generate unique error ID for tracking
    const errorId = Date.now().toString(36) + Math.random().toString(36).substr(2);
    
    this.setState({
      error,
      errorInfo,
      errorId
    });
    
    // Log error details
    console.error('Application Error Caught by ErrorBoundary:', {
      errorId,
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      timestamp: new Date().toISOString()
    });
    
    error.__ErrorBoundary = true;
    window.__COMPONENT_ERROR__?.(error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, errorId: null });
    window.location.reload();
  };

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, errorId: null });
  };

  render() {
    if (this.state?.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="text-center p-8 max-w-lg mx-4">
            {/* Error Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 rounded-full bg-error/10 flex items-center justify-center">
                <Icon name="AlertTriangle" size={40} color="var(--color-error)" />
              </div>
            </div>
            
            {/* Error Message */}
            <div className="space-y-4 mb-8">
              <h1 className="text-3xl font-bold text-foreground">Oops! Something went wrong</h1>
              <p className="text-text-secondary text-lg">
                We encountered an unexpected error in the Deepfake Radar application.
              </p>
              
              {/* Error Details (Development Mode) */}
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="mt-6 p-4 bg-error/5 border border-error/20 rounded-lg text-left">
                  <h3 className="font-semibold text-error mb-2">Error Details (Development)</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Message:</strong> {this.state.error.message}</p>
                    <p><strong>Error ID:</strong> {this.state.errorId}</p>
                    <details className="mt-3">
                      <summary className="cursor-pointer text-error hover:text-error/80">
                        View Stack Trace
                      </summary>
                      <pre className="mt-2 text-xs text-text-secondary overflow-auto max-h-32 whitespace-pre-wrap">
                        {this.state.error.stack}
                      </pre>
                    </details>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
              >
                <Icon name="RotateCcw" size={18} color="currentColor" />
                Try Again
              </button>
              
              <button
                onClick={this.handleReload}
                className="px-6 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/90 transition-colors flex items-center justify-center gap-2"
              >
                <Icon name="RefreshCw" size={18} color="currentColor" />
                Reload Page
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-3 bg-muted text-muted-foreground rounded-lg font-medium hover:bg-muted/80 transition-colors flex items-center justify-center gap-2"
              >
                <Icon name="Home" size={18} color="currentColor" />
                Go Home
              </button>
            </div>
            
            {/* Help Text */}
            <div className="mt-8 p-4 bg-muted/30 rounded-lg">
              <h3 className="font-semibold text-foreground mb-2">Need Help?</h3>
              <div className="text-sm text-text-secondary space-y-1">
                <p>• Check that both frontend and backend servers are running</p>
                <p>• Verify your internet connection</p>
                <p>• Try refreshing the page</p>
                <p>• Check browser console for additional error details</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props?.children;
  }
}

export default ErrorBoundary;