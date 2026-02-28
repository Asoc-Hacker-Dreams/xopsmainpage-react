import React from 'react';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import SEOEnhanced from '../components/SEOEnhanced';

const AnalyticsPage: React.FC = () => {
  return (
    <>
      <SEOEnhanced
        title="Analytics Dashboard"
        description="Panel de análisis y métricas de X-Ops Conference"
        path="/analytics"
        robots="noindex, nofollow"
      />

      <div className="container py-5">
        <AnalyticsDashboard />
      </div>
    </>
  );
};

export default AnalyticsPage;
