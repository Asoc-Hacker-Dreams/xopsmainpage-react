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
              <h3 className="location-venue">Madrid, España</h3>
              <p className="location-address">
                <BsGeoAlt className="location-icon" />
                Lugar por confirmar — próximamente
              </p>
              <div
                className="location-map"
                style={{
                  background: '#1a1a2e',
                  border: '1px solid #333',
                  borderRadius: '8px',
                  padding: '60px 20px',
                  marginTop: '2rem',
                  color: '#888',
                }}
              >
                <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📍</p>
                <p style={{ margin: 0 }}>Mapa disponible próximamente</p>
                <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                  La ubicación exacta será anunciada en los próximos meses
                </p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default SummitLocation;
