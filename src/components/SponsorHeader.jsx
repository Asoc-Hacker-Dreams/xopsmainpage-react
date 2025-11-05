import PropTypes from 'prop-types';
import { Container, Row, Col, Badge } from 'react-bootstrap';
import AnimationWrapper from './AnimationWrapper';

const SponsorHeader = ({ name, logo, tier, website }) => {
  const getTierColor = (tier) => {
    const tierColors = {
      platinum: 'warning',
      oro: 'warning',
      gold: 'warning',
      silver: 'secondary',
      plata: 'secondary',
      community: 'info',
      colaborador: 'info',
    };
    return tierColors[tier?.toLowerCase()] || 'primary';
  };

  const getTierLabel = (tier) => {
    const tierLabels = {
      platinum: 'Patrocinador Platinum',
      oro: 'Patrocinador Oro',
      gold: 'Patrocinador Gold',
      silver: 'Patrocinador Silver',
      plata: 'Patrocinador Plata',
      community: 'Colaborador',
      colaborador: 'Colaborador',
    };
    return tierLabels[tier?.toLowerCase()] || 'Patrocinador';
  };

  return (
    <section className="sponsor-header bg-light py-5" role="banner">
      <Container>
        <Row className="align-items-center justify-content-center">
          <Col md={8} className="text-center">
            <AnimationWrapper animation="fade-down" duration={1000}>
              <div className="mb-4">
                <Badge 
                  bg={getTierColor(tier)} 
                  className="mb-3 px-4 py-2"
                  aria-label={`Nivel de patrocinio: ${getTierLabel(tier)}`}
                >
                  {getTierLabel(tier)}
                </Badge>
              </div>
              {logo && (
                <div className="sponsor-logo mb-4">
                  <img
                    src={logo}
                    alt={`Logo de ${name}`}
                    className="img-fluid"
                    style={{ maxHeight: '200px', maxWidth: '100%' }}
                    loading="eager"
                  />
                </div>
              )}
              <h1 className="display-4 mb-3" tabIndex="0">
                {name}
              </h1>
              {website && website !== '#' && (
                <a
                  href={website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted"
                  aria-label={`Visitar sitio web de ${name}`}
                >
                  {website}
                </a>
              )}
            </AnimationWrapper>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

SponsorHeader.propTypes = {
  name: PropTypes.string.isRequired,
  logo: PropTypes.string,
  tier: PropTypes.oneOf(['platinum', 'gold', 'silver', 'community', 'oro', 'plata', 'colaborador']).isRequired,
  website: PropTypes.string,
};

export default SponsorHeader;
