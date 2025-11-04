import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col, Badge } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import AnimationWrapper from './AnimationWrapper';
import sponsorsData from '../data/sponsorsData.json';

const SponsorsGrid = ({ orderBy = 'tier' }) => {
  const location = useLocation();
  
  // Extract tier filter from query params
  const tierFilter = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('tier')?.toLowerCase();
  }, [location.search]);

  // Define tier order for sorting
  const tierOrder = useMemo(() => ({
    'platinum': 1,
    'track sponsor': 2,
    'gold': 3,
    'silver': 4,
    'virtual-only': 5,
    'community': 6
  }), []);

  // Get tier display color
  const getTierColor = (tier) => {
    const colors = {
      'platinum': 'primary',
      'track sponsor': 'info',
      'gold': 'warning',
      'silver': 'secondary',
      'virtual-only': 'light',
      'community': 'success'
    };
    return colors[tier.toLowerCase()] || 'light';
  };

  // Filter and sort sponsors based on orderBy prop
  const filteredAndSortedSponsors = useMemo(() => {
    let sponsors = [...sponsorsData.sponsors];
    
    // Apply tier filter if specified
    if (tierFilter) {
      sponsors = sponsors.filter(sponsor => 
        sponsor.tier.toLowerCase() === tierFilter
      );
    }

    // Sort sponsors based on orderBy prop
    if (orderBy === 'name') {
      sponsors.sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Default to tier ordering
      sponsors.sort((a, b) => {
        const tierCompare = (tierOrder[a.tier.toLowerCase()] || 999) - (tierOrder[b.tier.toLowerCase()] || 999);
        if (tierCompare !== 0) return tierCompare;
        return a.name.localeCompare(b.name);
      });
    }

    return sponsors;
  }, [tierFilter, orderBy, tierOrder]);

  // Group sponsors by tier for organized display (only when not sorting by name)
  const sponsorsByTier = useMemo(() => {
    if (orderBy === 'name') {
      // When sorting by name, show all sponsors in a single group
      return { 'all': filteredAndSortedSponsors };
    }
    
    const groups = {};
    filteredAndSortedSponsors.forEach(sponsor => {
      const tier = sponsor.tier;
      // eslint-disable-next-line security/detect-object-injection
      if (!groups[tier]) {
        // eslint-disable-next-line security/detect-object-injection
        groups[tier] = [];
      }
      // eslint-disable-next-line security/detect-object-injection
      groups[tier].push(sponsor);
    });
    return groups;
  }, [filteredAndSortedSponsors, orderBy]);

  const tierNames = useMemo(() => {
    if (orderBy === 'name') {
      return ['all'];
    }
    return Object.keys(sponsorsByTier).sort(
      (a, b) => (tierOrder[a.toLowerCase()] || 999) - (tierOrder[b.toLowerCase()] || 999)
    );
  }, [sponsorsByTier, orderBy, tierOrder]);

  return (
    <section id="sponsors-grid" className="sponsors-section py-5" role="region" aria-label="Patrocinadores">
      <Container>
        <AnimationWrapper animation="fade-up" duration={1000}>
          <h2 className="text-center mb-4">Nuestros Patrocinadores</h2>
          
          {filteredAndSortedSponsors.length === 0 ? (
            <div className="text-center py-5">
              <p>No hay patrocinadores disponibles para los filtros seleccionados.</p>
            </div>
          ) : (
            tierNames.map(tier => {
              // Using tier from sponsorsData.json which is a controlled source, not user input
              // eslint-disable-next-line security/detect-object-injection
              const sponsors = sponsorsByTier[tier];
              return (
              <div key={tier} className="tier-group mb-5">
                {tier !== 'all' && (
                  <h3 className="text-center text-uppercase mb-4">
                    {tier}
                    <Badge bg={getTierColor(tier)} className="ms-2">
                      {sponsors.length}
                    </Badge>
                  </h3>
                )}
                
                <Row className="justify-content-center">
                  {sponsors.map((sponsor) => (
                    <Col 
                      key={sponsor.id} 
                      xs={12} 
                      sm={6} 
                      md={4} 
                      lg={3} 
                      className="mb-4"
                    >
                      <AnimationWrapper 
                        animation="fade-up" 
                        duration={1000}
                      >
                        <div 
                          className="sponsor-card h-100 d-flex flex-column align-items-center justify-content-center p-3 border rounded"
                          role="article"
                          aria-label={`Patrocinador: ${sponsor.name}`}
                        >
                          <a 
                            href={sponsor.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="d-flex flex-column align-items-center text-decoration-none"
                            aria-label={`Visitar sitio web de ${sponsor.name}`}
                          >
                            <img 
                              src={sponsor.logo} 
                              alt={`Logo de ${sponsor.name}`}
                              className="sponsor-logo mb-3"
                              style={{ maxWidth: '150px', maxHeight: '100px', objectFit: 'contain' }}
                              loading="lazy"
                            />
                            <h4 className="text-center sponsor-name mb-2 text-dark">
                              {sponsor.name}
                            </h4>
                            <Badge bg={getTierColor(sponsor.tier)} className="mb-2">
                              {sponsor.tier}
                            </Badge>
                          </a>
                          <p className="text-center text-muted small mb-0">
                            {sponsor.description}
                          </p>
                        </div>
                      </AnimationWrapper>
                    </Col>
                  ))}
                </Row>
              </div>
            );
            })
          )}
        </AnimationWrapper>
      </Container>
    </section>
  );
};

SponsorsGrid.propTypes = {
  orderBy: PropTypes.oneOf(['tier', 'name'])
};

export default SponsorsGrid;
