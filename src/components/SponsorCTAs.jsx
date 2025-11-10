import PropTypes from 'prop-types';
import { Container, Row, Col, Button } from 'react-bootstrap';
import AnimationWrapper from './AnimationWrapper';

const SponsorCTAs = ({ ctas }) => {
  if (!ctas || ctas.length === 0) {
    return null;
  }

  const getButtonVariant = (type) => {
    const variants = {
      primary: 'primary',
      secondary: 'outline-primary',
    };
    return variants[type] || 'primary';
  };

  return (
    <section className="sponsor-ctas py-5 bg-light" aria-labelledby="ctas-heading">
      <Container>
        <Row className="justify-content-center">
          <Col md={8} className="text-center">
            <AnimationWrapper animation="fade-up" duration={1000}>
              <h2 id="ctas-heading" className="h4 mb-4">
                Conoce más
              </h2>
              <div className="d-flex flex-wrap justify-content-center gap-3">
                {ctas.map((cta, index) => (
                  <Button
                    key={index}
                    variant={getButtonVariant(cta.type)}
                    size="lg"
                    href={cta.url}
                    target={cta.url.startsWith('http') ? '_blank' : '_self'}
                    rel={cta.url.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="px-4 py-2"
                    aria-label={cta.text}
                  >
                    {cta.text}
                  </Button>
                ))}
              </div>
            </AnimationWrapper>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

SponsorCTAs.propTypes = {
  ctas: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['primary', 'secondary']),
    })
  ),
};

SponsorCTAs.defaultProps = {
  ctas: [],
};

export default SponsorCTAs;
