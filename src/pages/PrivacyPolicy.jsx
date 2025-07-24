import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import SEO from '../components/SEO';
import AnimationWrapper from '../components/AnimationWrapper';

const PrivacyPolicy = () => {
  return (
    <>
      <SEO
        title="Política de Privacidad - X-Ops Conference"
        description="Política de privacidad y protección de datos de X-Ops Conference Madrid."
        path="/politica-de-privacidad"
        image="https://xopsconference.com/assets/xops-og.jpg"
        lang="es"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Política de Privacidad - X-Ops Conference",
          "description": "Información sobre el tratamiento de datos personales en X-Ops Conference"
        }}
      />
      
      <section className="privacy-policy-section py-5" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <Container>
          <AnimationWrapper animation="fade-up" duration={1000}>
            <Row className="justify-content-center">
              <Col lg={10} xl={8}>
                <div className="bg-white rounded-lg p-4 p-md-5 shadow-sm">
                  <h1 className="text-center mb-5 text-primary">Política de Privacidad</h1>
                  
                  <div className="privacy-content">
                    <section className="mb-4">
                      <h2 className="h4 text-secondary mb-3">1. Información General</h2>
                      <p>
                        La presente Política de Privacidad describe cómo X-Ops Conference recopila, 
                        utiliza y protege la información personal de los usuarios de nuestro sitio web 
                        y evento. Nos comprometemos a proteger su privacidad y cumplir con el 
                        Reglamento General de Protección de Datos (GDPR).
                      </p>
                    </section>

                    <section className="mb-4">
                      <h2 className="h4 text-secondary mb-3">2. Datos que Recopilamos</h2>
                      <h3 className="h5 mb-2">2.1 Datos de Navegación Anónimos</h3>
                      <ul>
                        <li>Información de analítica web anónima para mejorar la experiencia del usuario</li>
                        <li>Datos de rendimiento del sitio web para optimización técnica</li>
                        <li>Estadísticas de uso agregadas y anonimizadas</li>
                      </ul>
                      
                      <h3 className="h5 mb-2 mt-3">2.2 Datos Almacenados Localmente</h3>
                      <ul>
                        <li>Preferencias de consentimiento de cookies</li>
                        <li>Favoritos de la agenda del evento (almacenados en su dispositivo)</li>
                        <li>Configuraciones de accesibilidad y preferencias de usuario</li>
                      </ul>
                      
                      <h3 className="h5 mb-2 mt-3">2.3 Datos de Ponentes y Autenticación</h3>
                      <ul>
                        <li>Los ponentes acceden mediante login federado gestionado por Microsoft</li>
                        <li>No almacenamos credenciales de autenticación en nuestros sistemas</li>
                        <li>La información de ponentes es gestionada exclusivamente por terceros autorizados</li>
                      </ul>
                    </section>

                    <section className="mb-4">
                      <h2 className="h4 text-secondary mb-3">3. Propósito del Tratamiento</h2>
                      <p>Los datos se utilizan únicamente para:</p>
                      <ul>
                        <li>Mejorar la experiencia del usuario en el sitio web</li>
                        <li>Medir el rendimiento y optimizar el funcionamiento del sitio</li>
                        <li>Proporcionar funcionalidades personalizadas del evento</li>
                        <li>Cumplir con obligaciones técnicas y de seguridad</li>
                      </ul>
                    </section>

                    <section className="mb-4">
                      <h2 className="h4 text-secondary mb-3">4. Base Legal del Tratamiento</h2>
                      <p>
                        El tratamiento de datos se basa en el consentimiento del usuario para 
                        analíticas y el interés legítimo para el funcionamiento técnico del sitio web.
                        Los datos de ponentes son tratados por terceros bajo sus propias políticas 
                        de privacidad.
                      </p>
                    </section>

                    <section className="mb-4">
                      <h2 className="h4 text-secondary mb-3">5. Sus Derechos bajo el GDPR</h2>
                      <p>Como usuario, tiene derecho a:</p>
                      <ul>
                        <li><strong>Acceso:</strong> Solicitar información sobre los datos que tenemos sobre usted</li>
                        <li><strong>Rectificación:</strong> Corregir datos inexactos o incompletos</li>
                        <li><strong>Supresión:</strong> Solicitar la eliminación de sus datos personales</li>
                        <li><strong>Limitación:</strong> Restringir el procesamiento de sus datos</li>
                        <li><strong>Portabilidad:</strong> Recibir sus datos en un formato estructurado</li>
                        <li><strong>Oposición:</strong> Oponerse al tratamiento de sus datos</li>
                        <li><strong>Revocación del consentimiento:</strong> Retirar el consentimiento en cualquier momento</li>
                      </ul>
                    </section>

                    <section className="mb-4">
                      <h2 className="h4 text-secondary mb-3">6. Retención de Datos</h2>
                      <p>
                        Los datos analíticos se conservan de forma agregada y anonimizada. 
                        Los datos almacenados localmente permanecen en su dispositivo hasta 
                        que los elimine. No mantenemos una base de datos de usuarios registrados.
                      </p>
                    </section>

                    <section className="mb-4">
                      <h2 className="h4 text-secondary mb-3">7. Seguridad</h2>
                      <p>
                        Implementamos medidas técnicas y organizativas apropiadas para proteger 
                        sus datos contra acceso no autorizado, alteración, divulgación o destrucción. 
                        Nuestro sitio utiliza HTTPS y seguimos las mejores prácticas de seguridad web.
                      </p>
                    </section>

                    <section className="mb-4">
                      <h2 className="h4 text-secondary mb-3">8. Terceros</h2>
                      <p>
                        No compartimos datos personales con terceros, excepto:
                      </p>
                      <ul>
                        <li>Servicios de analítica anónima (Google Analytics con IP anonimizada)</li>
                        <li>Servicios de autenticación federada para ponentes (Microsoft)</li>
                        <li>Proveedores de infraestructura técnica bajo acuerdos de confidencialidad</li>
                      </ul>
                    </section>

                    <section className="mb-4">
                      <h2 className="h4 text-secondary mb-3">9. Contacto para Privacidad</h2>
                      <div className="bg-light p-3 rounded">
                        <p className="mb-2">
                          <strong>Para consultas relacionadas con privacidad y protección de datos:</strong>
                        </p>
                        <p className="mb-1">
                          Email: <a href="mailto:info@xopsconference.com" className="text-primary">info@xopsconference.com</a>
                        </p>
                        <p className="mb-0">
                          Asunto: "Consulta de Privacidad - GDPR"
                        </p>
                      </div>
                      <p className="mt-3 small text-muted">
                        Nos comprometemos a responder a todas las consultas relacionadas con 
                        privacidad en un plazo máximo de 30 días.
                      </p>
                    </section>

                    <section className="mb-4">
                      <h2 className="h4 text-secondary mb-3">10. Cambios en esta Política</h2>
                      <p>
                        Nos reservamos el derecho de actualizar esta política de privacidad. 
                        Los cambios significativos serán notificados a través del sitio web. 
                        Le recomendamos revisar esta página periódicamente.
                      </p>
                    </section>

                    <section className="mb-4">
                      <h2 className="h4 text-secondary mb-3">11. Información de Contacto</h2>
                      <div className="bg-light p-3 rounded">
                        <p className="mb-1"><strong>X-Ops Conference</strong></p>
                        <p className="mb-1">Email: <a href="mailto:info@xopsconference.com" className="text-primary">info@xopsconference.com</a></p>
                        <p className="mb-0">Web: <a href="https://xopsconference.com" className="text-primary">www.xopsconference.com</a></p>
                      </div>
                    </section>

                    <div className="text-center mt-5 pt-4 border-top">
                      <p className="text-muted small">
                        <strong>Última actualización:</strong> Enero 2025<br/>
                        <strong>Versión:</strong> 1.0
                      </p>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </AnimationWrapper>
        </Container>
      </section>
    </>
  );
};

export default PrivacyPolicy;