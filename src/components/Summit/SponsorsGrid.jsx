import React from 'react';
import { Container, Row, Col, Image } from 'react-bootstrap';
import { sponsors, getSponsorsByTier } from '../../dal/sponsors';

const tierConfig = {
  platinum: {
    label: 'PLATINUM',
    className: 'sponsor-platinum',
    logoHeight: 80,
    md: 4,
  },
  gold: {
    label: 'GOLD',
    className: 'sponsor-gold',
    logoHeight: 60,
    md: 4,
  },
  silver: {
    label: 'SILVER',
    className: 'sponsor-silver',
    logoHeight: 50,
    md: 3,
  },
};

const SponsorCard = ({ sponsor, config }) => {
  const handleClick = () => {
    if (sponsor.websiteUrl) {
      window.open(sponsor.websiteUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      className={`sponsor-card ${config.className}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      title={sponsor.description || sponsor.name}
    >
      <div className="sponsor-logo-wrapper">
        {sponsor.logoUrl ? (
          <Image
            src={sponsor.logoUrl}
            alt={`${sponsor.name} logo`}
            className="sponsor-logo"
            style={{ maxHeight: config.logoHeight }}
            fluid
          />
        ) : (
          <div className="sponsor-logo-placeholder" style={{ height: config.logoHeight }}>
            {sponsor.name}
          </div>
        )}
      </div>
    </div>
  );
};

const SponsorsGrid = () => {
  const platinumSponsors = getSponsorsByTier('platinum');
  const goldSponsors = getSponsorsByTier('gold');
  const silverSponsors = getSponsorsByTier('silver');

  return (
    <section className="sponsors-section" id="sponsors">
      <Container>
        <Row className="justify-content-center text-center mb-5">
          <Col lg={8}>
            <h2 className="summit-section-title">Patrocinadores</h2>
            <p className="summit-section-subtitle">
              Gracias a nuestros patrocinadores por hacer posible este evento
            </p>
          </Col>
        </Row>

        {/* Platinum Tier */}
        {platinumSponsors.length > 0 && (
          <div className="sponsor-tier mb-5">
            <h3 className="tier-title tier-platinum">
              <span className="tier-badge">⭐ PLATINUM</span>
            </h3>
            <Row className="justify-content-center">
              {platinumSponsors.map((sponsor) => (
                <Col
                  key={sponsor.id}
                  md={tierConfig.platinum.md}
                  className="mb-4 d-flex justify-content-center"
                >
                  <SponsorCard sponsor={sponsor} config={tierConfig.platinum} />
                </Col>
              ))}
            </Row>
          </div>
        )}

        {/* Gold Tier */}
        {goldSponsors.length > 0 && (
          <div className="sponsor-tier mb-5">
            <h3 className="tier-title tier-gold">
              <span className="tier-badge">🥇 GOLD</span>
            </h3>
            <Row className="justify-content-center">
              {goldSponsors.map((sponsor) => (
                <Col
                  key={sponsor.id}
                  md={tierConfig.gold.md}
                  className="mb-4 d-flex justify-content-center"
                >
                  <SponsorCard sponsor={sponsor} config={tierConfig.gold} />
                </Col>
              ))}
            </Row>
          </div>
        )}

        {/* Silver Tier */}
        {silverSponsors.length > 0 && (
          <div className="sponsor-tier mb-4">
            <h3 className="tier-title tier-silver">
              <span className="tier-badge">🥈 SILVER</span>
            </h3>
            <Row className="justify-content-center">
              {silverSponsors.map((sponsor) => (
                <Col
                  key={sponsor.id}
                  md={tierConfig.silver.md}
                  sm={6}
                  className="mb-3 d-flex justify-content-center"
                >
                  <SponsorCard sponsor={sponsor} config={tierConfig.silver} />
                </Col>
              ))}
            </Row>
          </div>
        )}

        {/* Become a Sponsor CTA */}
        <Row className="justify-content-center mt-4">
          <Col lg={8} className="text-center">
            <p className="become-sponsor-text">
              ¿Quieres patrocinar X-Ops Summit?{' '}
              <a href="mailto:sponsors@xopsconference.com" className="contact-link">
                Contáctanos
              </a>
            </p>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default SponsorsGrid;
