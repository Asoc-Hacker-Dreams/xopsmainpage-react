import PropTypes from 'prop-types';
import { Container, Row, Col } from 'react-bootstrap';
import AnimationWrapper from './AnimationWrapper';

const SponsorAbout = ({ description, socialMedia }) => {
  const hasSocialMedia = socialMedia && Object.keys(socialMedia).length > 0;

  return (
    <section className="sponsor-about py-5" aria-labelledby="about-heading">
      <Container>
        <Row className="justify-content-center">
          <Col md={10} lg={8}>
            <AnimationWrapper animation="fade-up" duration={1000}>
              <h2 id="about-heading" className="h3 mb-4 text-center">
                Acerca de
              </h2>
              <div 
                className="lead text-muted mb-4"
                style={{ textAlign: 'justify', lineHeight: '1.8' }}
              >
                {description}
              </div>
              
              {hasSocialMedia && (
                <div className="social-media text-center mt-5">
                  <h3 className="h5 mb-3">Síguenos</h3>
                  <div className="d-flex justify-content-center gap-3">
                    {socialMedia.twitter && (
                      <a
                        href={socialMedia.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-primary"
                        aria-label="Twitter"
                      >
                        <i className="bi bi-twitter" aria-hidden="true"></i> Twitter
                      </a>
                    )}
                    {socialMedia.linkedin && (
                      <a
                        href={socialMedia.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-primary"
                        aria-label="LinkedIn"
                      >
                        <i className="bi bi-linkedin" aria-hidden="true"></i> LinkedIn
                      </a>
                    )}
                    {socialMedia.facebook && (
                      <a
                        href={socialMedia.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-primary"
                        aria-label="Facebook"
                      >
                        <i className="bi bi-facebook" aria-hidden="true"></i> Facebook
                      </a>
                    )}
                  </div>
                </div>
              )}
            </AnimationWrapper>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

SponsorAbout.propTypes = {
  description: PropTypes.string.isRequired,
  socialMedia: PropTypes.shape({
    twitter: PropTypes.string,
    linkedin: PropTypes.string,
    facebook: PropTypes.string,
  }),
};

SponsorAbout.defaultProps = {
  socialMedia: {},
};

export default SponsorAbout;
