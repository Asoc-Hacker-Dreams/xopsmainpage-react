import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { BsGeoAlt } from 'react-icons/bs';

const SummitLocation = () => {
  return (
    <section className="summit-location" id="ubicacion">
      <Container>
        <Row className="justify-content-center text-center mb-5">
          <Col lg={8}>
            <h2 className="summit-section-title">Ubicación</h2>
            <p className="summit-section-subtitle">
              Un espacio premium para un evento premium
            </p>
          </Col>
        </Row>

        <Row className="justify-content-center">
          <Col lg={8} className="text-center">
            <div className="location-info">
              <h3 className="location-venue">Fundación Juan XXIII Roncalli</h3>
              <p className="location-address">
                <BsGeoAlt className="location-icon" />
                Madrid, España
              </p>
              <div
                className="location-map"
                style={{
                  borderRadius: '8px',
                  overflow: 'hidden',
                  marginTop: '2rem',
                }}
              >
                <iframe
                  src="https://maps.google.com/maps?q=Fundaci%C3%B3n+Juan+XXIII+Roncalli+Madrid&output=embed"
                  width="100%"
                  height="320"
                  style={{ border: 0, display: 'block' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Fundación Juan XXIII Roncalli, Madrid"
                />
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default SummitLocation;
