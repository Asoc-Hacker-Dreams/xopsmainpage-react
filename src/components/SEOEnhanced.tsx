import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOEnhancedProps {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  imageAlt?: string;
  keywords?: string;
  lang?: string;
  author?: string;
  robots?: string;
  alternates?: Array<{ hrefLang: string; href: string }>;
  structuredData?: object;
  ogType?: 'website' | 'article' | 'event';
  ogLocale?: string;
  ogSiteName?: string;
  twitterCreator?: string;
  twitterSite?: string;
  eventStartDate?: string;
  eventEndDate?: string;
  eventLocation?: string;
  eventPrice?: string;
}

const SEOEnhanced: React.FC<SEOEnhancedProps> = ({
  title = 'X-Ops Conference',
  description = 'Conferencia internacional sobre DevOps, DevSecOps, AIOps y MLOps en Madrid.',
  path = '/',
  image = 'https://xopsconference.com/assets/og-default.jpg',
  imageAlt = 'X-Ops Conference Madrid 2026',
  keywords = 'X-Ops, DevOps, DevSecOps, AIOps, MLOps, Conferencia, Madrid, Tecnología',
  lang = 'es',
  author = 'X-Ops Conference Team',
  robots = 'index, follow',
  alternates = [],
  structuredData = null,
  ogType = 'website',
  ogLocale = 'es_ES',
  ogSiteName = 'X-Ops Conference',
  twitterCreator = '@xopsconf',
  twitterSite = '@xopsconf',
  eventStartDate,
  eventEndDate,
  eventLocation,
  eventPrice,
}) => {
  const baseUrl = 'https://xopsconference.com';
  const fullUrl = `${baseUrl}${path}`;
  const fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;

  const eventStructuredData = eventStartDate
    ? {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: title,
        description,
        startDate: eventStartDate,
        endDate: eventEndDate,
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        location: eventLocation
          ? {
              '@type': 'Place',
              name: eventLocation,
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Madrid',
                addressCountry: 'ES',
              },
            }
          : undefined,
        image: [fullImageUrl],
        organizer: {
          '@type': 'Organization',
          name: 'X-Ops Conference',
          url: baseUrl,
        },
        offers: eventPrice
          ? {
              '@type': 'Offer',
              price: eventPrice,
              priceCurrency: 'EUR',
              availability: 'https://schema.org/InStock',
              url: `${baseUrl}/tickets`,
            }
          : undefined,
      }
    : null;

  const finalStructuredData = structuredData || eventStructuredData;

  return (
    <Helmet>
      <html lang={lang} />
      <title>{title} | X-Ops Conference</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <meta name="robots" content={robots} />
      <link rel="canonical" href={fullUrl} />

      {alternates.map((alt) => (
        <link
          key={alt.hrefLang}
          rel="alternate"
          hrefLang={alt.hrefLang}
          href={alt.href}
        />
      ))}

      {/* Open Graph - Enhanced */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:type" content={ogType} />
      <meta property="og:image" content={fullImageUrl} />
      <meta property="og:image:alt" content={imageAlt} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content={ogLocale} />
      <meta property="og:site_name" content={ogSiteName} />

      {ogType === 'article' && eventStartDate && (
        <meta property="article:published_time" content={eventStartDate} />
      )}
      {ogType === 'event' && eventStartDate && (
        <>
          <meta property="event:start_time" content={eventStartDate} />
          {eventEndDate && <meta property="event:end_time" content={eventEndDate} />}
        </>
      )}

      {/* Twitter Card - Enhanced */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={twitterSite} />
      <meta name="twitter:creator" content={twitterCreator} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImageUrl} />
      <meta name="twitter:image:alt" content={imageAlt} />

      <meta name="facebook-domain-verification" content="xops-conference-verification" />
      <meta name="theme-color" content="#005DAA" />
      <meta name="msapplication-TileColor" content="#005DAA" />
      <meta name="apple-mobile-web-app-title" content="X-Ops" />

      {finalStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(finalStructuredData)}
        </script>
      )}
    </Helmet>
  );
};

export default SEOEnhanced;
