import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';

const SEO = ({
  title = 'X-Ops Conference',
  description = 'Conferencia internacional sobre DevOps, DevSecOps, AIOps y MLOps en Madrid.',
  path = '/',
  image = 'https://xopsconference.com/assets/og-default.jpg',
  keywords = 'X-Ops, DevOps, DevSecOps, AIOps, MLOps, Conferencia, Madrid, Tecnología',
  lang = 'es',
  author = 'X-Ops Conference Team',
  robots = 'index, follow',
  alternates = [],
  structuredData = null,
}) => {
  const baseUrl = 'https://xopsconference.com';
  const fullUrl = `${baseUrl}${path}`;

  return (
    <Helmet>
      <html lang={lang} />
      <title>{title} | X-Ops Conference</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={fullUrl} />
      {/* Alternate links for i18n */}
      {alternates.map((alt) => (
        <link
          key={alt.hrefLang}
          rel="alternate"
          hrefLang={alt.hrefLang}
          href={alt.href}
        />
      ))}
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={image} />
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {/* Datos estructurados para IA */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
};

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  path: PropTypes.string,
  image: PropTypes.string,
  keywords: PropTypes.string,
  lang: PropTypes.string,
  author: PropTypes.string,
  robots: PropTypes.string,
  alternates: PropTypes.arrayOf(
    PropTypes.shape({
      hrefLang: PropTypes.string.isRequired,
      href: PropTypes.string.isRequired,
    })
  ),
  structuredData: PropTypes.object,
};

export default SEO;