import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link, useSearchParams } from 'react-router-dom';
import SEO from '../components/SEO';
import AnimationWrapper from '../components/AnimationWrapper';
import { trackLeadSubmit } from '../utils/analytics';

const ThankYou = () => {
  const [searchParams] = useSearchParams();
  const [sponsorInfo, setSponsorInfo] = useState(null);

  useEffect(() => {
    // Get sponsor information from URL params
    const sponsorId = searchParams.get('sponsor_id');
    const tier = searchParams.get('tier');
    const sponsorName = searchParams.get('sponsor_name');
    const resourceUrl = searchParams.get('resource_url');

    if (sponsorId && tier) {
      const info = {
        sponsor_id: sponsorId,
        tier,
        sponsor_name: sponsorName || 'Patrocinador',
        resource_url: resourceUrl
      };
      
      setSponsorInfo(info);
      
      // Track the lead submission in GA4
      trackLeadSubmit({
        sponsor_id: sponsorId,
        tier,
        sponsor_name: sponsorName
      });
    }
  }, [searchParams]);

  return (
    <>
      <SEO
        title="¡Gracias! - X-Ops Conference"
        description="Gracias por tu interés en nuestros patrocinadores."
        path="/thank-you"
        lang="es"
      />
      
      <Container className="my-5 py-5">
        <AnimationWrapper animation="fade-up" duration={1000}>
          <Row className="justify-content-center">
            <Col md={8} lg={6} className="text-center">
              {/* Success Icon */}
              <div className="mb-4">
                <div 
                  style={{ 
                    fontSize: '80px', 
                    color: '#28a745',
                    lineHeight: '1'
                  }}
                >
                  ✓
                </div>
              </div>

              {/* Thank You Message */}
              <h1 className="display-4 mb-4" style={{ color: '#333' }}>
                ¡Gracias por tu interés!
              </h1>
              
              <p className="lead mb-4" style={{ color: '#666' }}>
                Tu solicitud ha sido enviada correctamente.
                {sponsorInfo?.sponsor_name && (
                  <span> El equipo de <strong>{sponsorInfo.sponsor_name}</strong> se pondrá en contacto contigo pronto.</span>
                )}
              </p>

              {/* Sponsor Resources Section */}
              {sponsorInfo && (
                <div className="mt-5 mb-4">
                  <h3 className="mb-3" style={{ color: '#333' }}>
                    Recursos del Patrocinador
                  </h3>
                  
                  <div className="d-flex flex-column gap-3 align-items-center">
                    {sponsorInfo.resource_url && (
                      <a
                        href={sponsorInfo.resource_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-primary btn-lg"
                        style={{ 
                          minWidth: '250px',
                          backgroundColor: '#0066CC',
                          borderColor: '#0066CC'
                        }}
                      >
                        📄 Ver recursos del patrocinador
                      </a>
                    )}
                    
                    <Link
                      to="/Sponsor"
                      className="btn btn-outline-primary btn-lg"
                      style={{ minWidth: '250px' }}
                    >
                      Ver todos los patrocinadores
                    </Link>
                  </div>
                </div>
              )}

              {/* Additional Actions */}
              <div className="mt-5 pt-4" style={{ borderTop: '1px solid #dee2e6' }}>
                <p className="mb-3" style={{ color: '#666' }}>
                  Mientras tanto, descubre más sobre X-Ops Conference:
                </p>
                
                <div className="d-flex flex-wrap justify-content-center gap-2">
                  <Link to="/" className="btn btn-outline-secondary">
                    Inicio
                  </Link>
                  <Link to="/speakers" className="btn btn-outline-secondary">
                    Ponentes
                  </Link>
                  <Link to="/#events" className="btn btn-outline-secondary">
                    Agenda
                  </Link>
                </div>
              </div>
            </Col>
          </Row>
        </AnimationWrapper>
      </Container>
    </>
  );
};

export default ThankYou;
