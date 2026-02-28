import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { BsGeoAlt, BsTrainFront, BsCarFront } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';

const SummitLocation = () => {
  const { t } = useTranslation();

  return (
    <section className="summit-location" id="ubicacion">
      <Container>
        <Row className="justify-content-center text-center mb-5">
          <Col lg={8}>
            <h2 className="summit-section-title">
              {t('summit.location.sectionTitle')}
            </h2>
            <p className="summit-section-subtitle">
              {t('summit.location.sectionSubtitle')}
            </p>
          </Col>
        </Row>

        <Row className="align-items-center">
          <Col lg={6} className="mb-4 mb-lg-0">
            <div className="location-info">
              <h3 className="location-venue">{t('summit.location.venue')}</h3>
              <p className="location-address">
                <BsGeoAlt className="location-icon" />
                {t('summit.location.address')}
              </p>

              <div className="location-access">
                <h4>{t('summit.location.howToArrive')}</h4>
                <div className="access-item">
                  <BsTrainFront className="access-icon" />
                  <div>
                    <strong>{t('summit.location.metro')}</strong>
                    <span>{t('summit.location.metroStop')}</span>
                  </div>
                </div>
                <div className="access-item">
                  <BsTrainFront className="access-icon" />
                  <div>
                    <strong>{t('summit.location.tram')}</strong>
                    <span>{t('summit.location.tramStop')}</span>
                  </div>
                </div>
                <div className="access-item">
                  <BsCarFront className="access-icon" />
                  <div>
                    <strong>{t('summit.location.parking')}</strong>
                    <span>{t('summit.location.parkingInfo')}</span>
                  </div>
                </div>
              </div>

              <a 
                href="https://maps.google.com/?q=Cinesa+Diagonal+Mar+Barcelona" 
                target="_blank" 
                rel="noopener noreferrer"
                className="location-map-link"
              >
                {t('summit.location.viewMap')}
              </a>
            </div>
          </Col>

          <Col lg={6}>
            <div className="location-map">
              <iframe
                title="Ubicación Cinesa Diagonal Mar"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2993.5!2d2.2!3d41.4!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDI0JzAwLjAiTiAywrAxMicwMC4wIkU!5e0!3m2!1ses!2ses!4v1234567890"
                width="100%"
                height="400"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default SummitLocation;
