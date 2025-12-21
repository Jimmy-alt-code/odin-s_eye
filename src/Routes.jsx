import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import DetailedAnalysisResults from './pages/detailed-analysis-results';
import AnalysisHistoryArchive from './pages/analysis-history-archive';
import MainAnalysisDashboard from './pages/main-analysis-dashboard';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<MainAnalysisDashboard />} />
        <Route path="/detailed-analysis-results" element={<DetailedAnalysisResults />} />
        <Route path="/analysis-history-archive" element={<AnalysisHistoryArchive />} />
        <Route path="/main-analysis-dashboard" element={<MainAnalysisDashboard />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
