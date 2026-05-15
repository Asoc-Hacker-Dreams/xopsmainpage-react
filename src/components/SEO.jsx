import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';

const SEO = ({
  title = 'X-Ops Conference',
  description = 'Conferencia internacional sobre DevOps, DevSecOps, AIOps y MLOps en Madrid.',
  path = '/',
  image = 'https://xopsconference.com/icon-512x512.png',
  keywords = 'X-Ops, DevOps, DevSecOps, AIOps, MLOps, Conferencia, Madrid, Tecnología',
  lang,
  author = 'X-Ops Conference Team',
  robots = 'index, follow',
  alternates = [],
  structuredData = null,
}) => {
  const { i18n } = useTranslation();
  const activeLang = lang || i18n.language || 'es';

  const baseUrl = 'https://xopsconference.com';
  const fullUrl = `${baseUrl}${path}`;
  const ogLocale = activeLang === 'es' ? 'es_ES' : 'en_US';
  const ogLocaleAlternate = activeLang === 'es' ? 'en_US' : 'es_ES';

  return (
    <Helmet>
      <html lang={activeLang} />
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
      <meta property="og:locale" content={ogLocale} />
      <meta property="og:locale:alternate" content={ogLocaleAlternate} />
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@xopsconf" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      {/* Structured data for AI/search */}
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