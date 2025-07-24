import React from 'react';
import { useLocation } from 'react-router-dom';
import SEO from './SEO';
import useDynamicSEO from '../hooks/useDynamicSEO';

const PageLayout = ({ children }) => {
  const seoData = useDynamicSEO();
  const location = useLocation();

  return (
    <>
      <SEO 
        title={seoData.title}
        description={seoData.description}
        path={location.pathname}
        keywords={seoData.keywords}
        structuredData={seoData.structuredData}
      />
      {children}
    </>
  );
};

export default PageLayout;
