import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { BsGeoAlt, BsTrainFront, BsCarFront } from 'react-icons/bs';

const SummitLocation = () => {
  return (
    <section className="summit-location" id="ubicacion">
      <Container>
        <Row className="justify-content-center text-center mb-5">
          <Col lg={8}>
            <h2 className="summit-section-title">
              Ubicación
            </h2>
            <p className="summit-section-subtitle">
              Un espacio premium para un evento premium
            </p>
          </Col>
        </Row>

        <Row className="align-items-center">
          <Col lg={6} className="mb-4 mb-lg-0">
            <div className="location-info">
              <h3 className="location-venue">Cinesa Diagonal Mar</h3>
              <p className="location-address">
                <BsGeoAlt className="location-icon" />
                C/ de la Lluna, 13, 08005 Barcelona
              </p>

              <div className="location-access">
                <h4>Cómo llegar</h4>
                <div className="access-item">
                  <BsBus className="access-icon" />
                  <div>
                    <strong>Metro L4</strong>
                    <span>Parada Selva de Mar (5 min caminando)</span>
                  </div>
                </div>
                <div className="access-item">
                  <BsBus className="access-icon" />
                  <div>
                    <strong>Tranvía T4</strong>
                    <span>Parada Sant Adrià (3 min caminando)</span>
                  </div>
                </div>
                <div className="access-item">
                  <BsCarFront className="access-icon" />
                  <div>
                    <strong>Parking</strong>
                    <span>Parking subterráneo disponible</span>
                  </div>
                </div>
              </div>

              <a 
                href="https://maps.google.com/?q=Cinesa+Diagonal+Mar+Barcelona" 
                target="_blank" 
                rel="noopener noreferrer"
                className="location-map-link"
              >
                Ver en Google Maps →
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
