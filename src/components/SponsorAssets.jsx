import PropTypes from 'prop-types';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import AnimationWrapper from './AnimationWrapper';

const SponsorAssets = ({ assets }) => {
  if (!assets || assets.length === 0) {
    return null;
  }

  return (
    <section className="sponsor-assets py-5" aria-labelledby="assets-heading">
      <Container>
        <Row className="justify-content-center">
          <Col md={10}>
            <AnimationWrapper animation="fade-up" duration={1000}>
              <h2 id="assets-heading" className="h4 mb-4 text-center">
                Recursos y Descargas
              </h2>
              <Row className="g-4">
                {assets.map((asset, index) => (
                  <Col key={index} md={6} lg={4}>
                    <Card className="h-100 shadow-sm">
                      <Card.Body>
                        <Card.Title>{asset.title}</Card.Title>
                        <Card.Text className="text-muted">
                          {asset.description}
                        </Card.Text>
                        <Button
                          variant="outline-primary"
                          href={asset.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2"
                          aria-label={`Descargar ${asset.title}`}
                        >
                          <i className="bi bi-download" aria-hidden="true"></i> Descargar
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </AnimationWrapper>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

SponsorAssets.propTypes = {
  assets: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string,
      url: PropTypes.string.isRequired,
    })
  ),
};

SponsorAssets.defaultProps = {
  assets: [],
};

export default SponsorAssets;
