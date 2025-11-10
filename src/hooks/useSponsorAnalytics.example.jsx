/**
 * Usage Example: useSponsorAnalytics Hook
 * 
 * This file demonstrates how to integrate GA4 sponsor tracking
 * in a typical sponsor detail page or microsite component.
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col, Button } from 'react-bootstrap';
import useSponsorAnalytics from './useSponsorAnalytics';

/**
 * Example 1: Sponsor Detail Page
 * Tracks view event on mount and CTA clicks
 */
const SponsorDetailPage = ({ sponsor }) => {
  const {
    trackViewSponsor,
    trackCtaClick,
    trackAssetDownload,
    trackLeadSubmit,
    canTrack
  } = useSponsorAnalytics(sponsor);

  // Track page view when component mounts
  useEffect(() => {
    trackViewSponsor();
  }, [trackViewSponsor]);

  const handlePrimaryCtaClick = () => {
    trackCtaClick('primary');
    // Navigate or show contact form
    window.location.href = sponsor.showcase?.ctaPrimary?.href || '#';
  };

  const handleSecondaryCtaClick = () => {
    trackCtaClick('secondary');
    // Handle secondary action
    window.open(sponsor.showcase?.ctaSecondary?.href, '_blank');
  };

  const handleWebsiteClick = () => {
    trackCtaClick('website');
    window.open(sponsor.website, '_blank');
  };

  const handleBookingClick = () => {
    trackCtaClick('booking');
    window.open(sponsor.booking?.url, '_blank');
  };

  const handleDossierDownload = () => {
    trackAssetDownload('dossier');
    // Trigger download
    const link = document.createElement('a');
    link.href = sponsor.showcase?.ctaSecondary?.href || '';
    link.download = 'sponsor-dossier.pdf';
    link.click();
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    trackLeadSubmit();
    // Submit form data
    // Form submission logic would go here
  };

  return (
    <Container className="sponsor-detail-page">
      <Row>
        <Col md={8}>
          <h1>{sponsor.name}</h1>
          <p>{sponsor.longDesc}</p>
          
          {/* Primary and Secondary CTAs */}
          <div className="cta-buttons mb-4">
            {sponsor.showcase?.ctaPrimary && (
              <Button 
                variant="primary" 
                onClick={handlePrimaryCtaClick}
                className="me-2"
              >
                {sponsor.showcase.ctaPrimary.label}
              </Button>
            )}
            
            {sponsor.showcase?.ctaSecondary && (
              <Button 
                variant="outline-primary" 
                onClick={handleSecondaryCtaClick}
              >
                {sponsor.showcase.ctaSecondary.label}
              </Button>
            )}
          </div>

          {/* Additional CTAs */}
          <div className="additional-ctas mb-4">
            <Button 
              variant="link" 
              onClick={handleWebsiteClick}
            >
              Visit Website
            </Button>
            
            {sponsor.booking?.url && (
              <Button 
                variant="link" 
                onClick={handleBookingClick}
              >
                Book a Meeting
              </Button>
            )}
            
            <Button 
              variant="link" 
              onClick={handleDossierDownload}
            >
              Download Dossier
            </Button>
          </div>

          {/* Lead Form */}
          <div className="lead-form mt-5">
            <h3>Contact {sponsor.name}</h3>
            <form onSubmit={handleFormSubmit}>
              <input type="text" placeholder="Name" required />
              <input type="email" placeholder="Email" required />
              <textarea placeholder="Message" rows="4" />
              <Button type="submit" variant="success">
                Submit
              </Button>
            </form>
          </div>

          {/* Debug Info (only in development) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="debug-info mt-4 p-3 bg-light">
              <strong>Analytics Debug:</strong>
              <p>Tracking Enabled: {canTrack() ? 'Yes' : 'No'}</p>
              <p>Sponsor ID: {sponsor.id}</p>
              <p>Sponsor Slug: {sponsor.slug}</p>
              <p>Sponsor Tier: {sponsor.tier}</p>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

SponsorDetailPage.propTypes = {
  sponsor: PropTypes.shape({
    id: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    tier: PropTypes.string.isRequired,
    longDesc: PropTypes.string,
    website: PropTypes.string,
    showcase: PropTypes.shape({
      ctaPrimary: PropTypes.shape({
        label: PropTypes.string,
        href: PropTypes.string
      }),
      ctaSecondary: PropTypes.shape({
        label: PropTypes.string,
        href: PropTypes.string
      })
    }),
    booking: PropTypes.shape({
      url: PropTypes.string
    })
  }).isRequired
};

/**
 * Example 2: Sponsor Card in a Grid
 * Tracks CTA clicks from a sponsor card component
 */
const SponsorCard = ({ sponsor }) => {
  const { trackCtaClick, trackAssetDownload } = useSponsorAnalytics(sponsor);

  const handleLogoClick = () => {
    trackCtaClick('logo');
    // Navigate to sponsor detail page or website
  };

  const handleDownloadClick = (e) => {
    e.stopPropagation();
    trackAssetDownload('brochure');
  };

  return (
    <div className="sponsor-card" onClick={handleLogoClick}>
      <img src={sponsor.logoUrl} alt={sponsor.name} />
      <h4>{sponsor.name}</h4>
      <p>{sponsor.shortDesc}</p>
      <Button 
        size="sm" 
        variant="outline-secondary"
        onClick={handleDownloadClick}
      >
        Download Info
      </Button>
    </div>
  );
};

SponsorCard.propTypes = {
  sponsor: PropTypes.shape({
    id: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    tier: PropTypes.string.isRequired,
    logoUrl: PropTypes.string,
    shortDesc: PropTypes.string
  }).isRequired
};

/**
 * Example 3: Asset Download Link
 * Tracks when users download sponsor assets
 */
const SponsorAssetDownloadLink = ({ sponsor, assetType, label, href }) => {
  const { trackAssetDownload } = useSponsorAnalytics(sponsor);

  const handleClick = (e) => {
    e.preventDefault();
    trackAssetDownload(assetType);
    // Trigger actual download
    window.open(href, '_blank');
  };

  return (
    <a href={href} onClick={handleClick}>
      {label}
    </a>
  );
};

SponsorAssetDownloadLink.propTypes = {
  sponsor: PropTypes.object.isRequired,
  assetType: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired
};

/**
 * Example 4: Inline Integration in SponsorsGrid
 * Shows how to add tracking to existing SponsorsGrid component
 */
const SponsorCardWithTracking = ({ sponsor }) => {
  const { trackViewSponsor, trackCtaClick } = useSponsorAnalytics(sponsor);

  // Track when sponsor card becomes visible (optional)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            trackViewSponsor();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.5 }
    );

    const element = document.getElementById(`sponsor-${sponsor.id}`);
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [sponsor.id, trackViewSponsor]);

  const handleSponsorClick = () => {
    trackCtaClick('website');
    window.open(sponsor.website, '_blank');
  };

  return (
    <div 
      id={`sponsor-${sponsor.id}`}
      className="sponsor-card-with-tracking"
      onClick={handleSponsorClick}
    >
      <img src={sponsor.logo} alt={sponsor.name} />
      <h4>{sponsor.name}</h4>
    </div>
  );
};

SponsorCardWithTracking.propTypes = {
  sponsor: PropTypes.shape({
    id: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    tier: PropTypes.string.isRequired,
    logo: PropTypes.string,
    website: PropTypes.string
  }).isRequired
};

export {
  SponsorDetailPage,
  SponsorCard,
  SponsorAssetDownloadLink,
  SponsorCardWithTracking
};
