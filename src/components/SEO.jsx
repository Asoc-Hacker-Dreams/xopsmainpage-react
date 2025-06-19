import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, path }) => {
  const baseUrl = 'https://xopsconference.com';
  const fullUrl = `${baseUrl}${path}`;
  
  return (
    <Helmet>
      <title>{title} | X-Ops Conference</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={fullUrl} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content="website" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Helmet>
  );
};

export default SEO;