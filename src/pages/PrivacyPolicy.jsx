import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import SEO from '../components/SEO';
import AnimationWrapper from '../components/AnimationWrapper';

const PrivacyPolicy = () => {
  return (
    <>
      <SEO
        title="Política de Privacidad - X-Ops Conference"
        description="Política de privacidad y protección de datos de X-Ops Conference. Responsable: X-Ops Alliance, S.L."
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
                  <h1 className="text-center mb-2 text-primary">Política de Privacidad</h1>
                  <p className="text-center text-muted small mb-5">Última actualización: junio 2025 · Versión 2.0</p>

                  <div className="privacy-content">

                    {/* 1. Responsable del Tratamiento */}
                    <section className="mb-4">
                      <h2 className="h4 text-secondary mb-3">1. Responsable del Tratamiento</h2>
                      <div className="bg-light p-3 rounded border-start border-primary border-3">
                        <p className="mb-1"><strong>X-Ops Alliance, S.L.</strong></p>
                        <p className="mb-1">Domicilio: Madrid, España</p>
                        <p className="mb-1">Correo electrónico: <a href="mailto:privacy@xopsalliance.com">privacy@xopsalliance.com</a></p>
                        <p className="mb-1">Delegado de Protección de Datos (DPO): <a href="mailto:dpo@xopsalliance.com">dpo@xopsalliance.com</a></p>
                        <p className="mb-0">Tratamiento conforme al Reglamento (UE) 2016/679 (RGPD) y la Ley Orgánica 3/2018 (LOPDGDD).</p>
                      </div>
                    </section>

                    {/* 2. Datos que Recopilamos */}
                    <section className="mb-4">
                      <h2 className="h4 text-secondary mb-3">2. Datos que Recopilamos</h2>
                      <h3 className="h5 mb-2">2.1 Datos de Navegación Anónimos</h3>
                      <ul>
                        <li>Analítica web anónima para mejorar la experiencia de usuario</li>
                        <li>Datos de rendimiento y optimización técnica</li>
                        <li>Estadísticas agregadas y anonimizadas</li>
                      </ul>
                      <h3 className="h5 mb-2 mt-3">2.2 Datos Almacenados Localmente</h3>
                      <ul>
                        <li>Preferencias de consentimiento de cookies (almacenadas en su dispositivo)</li>
                        <li>Favoritos de la agenda del evento (almacenados en su dispositivo)</li>
                        <li>Configuraciones de accesibilidad y preferencias de usuario</li>
                      </ul>
                      <h3 className="h5 mb-2 mt-3">2.3 Datos de Asistentes y Ponentes</h3>
                      <ul>
                        <li>Nombre completo y correo electrónico (para gestión de entradas y acreditaciones)</li>
                        <li>Los ponentes acceden mediante login federado (Microsoft); no almacenamos sus credenciales</li>
                        <li>Datos de pago procesados por Stripe (no almacenamos datos de tarjeta)</li>
                      </ul>
                    </section>

                    {/* 3. Finalidad y Base Legal */}
                    <section className="mb-4">
                      <h2 className="h4 text-secondary mb-3">3. Finalidad y Base Legal del Tratamiento</h2>
                      <ul>
                        <li><strong>Ejecución del contrato (Art. 6.1.b RGPD):</strong> gestión de inscripciones, venta de entradas y acreditaciones para el evento.</li>
                        <li><strong>Obligación legal (Art. 6.1.c RGPD):</strong> conservación de registros contables y fiscales.</li>
                        <li><strong>Interés legítimo (Art. 6.1.f RGPD):</strong> seguridad del sitio web y prevención de fraude.</li>
                        <li><strong>Consentimiento (Art. 6.1.a RGPD):</strong> envío de comunicaciones sobre futuros eventos, analítica no esencial.</li>
                      </ul>
                    </section>

                    {/* 4. Plazos de Conservación */}
                    <section className="mb-4">
                      <h2 className="h4 text-secondary mb-3">4. Plazos de Conservación</h2>
                      <ul>
                        <li><strong>Datos de inscripción y asistencia al evento:</strong> 3 años desde la celebración del evento.</li>
                        <li><strong>Registros financieros (pagos, facturas):</strong> 7 años (obligación legal fiscal).</li>
                        <li><strong>Datos analíticos anónimos:</strong> máximo 26 meses en formato agregado.</li>
                        <li><strong>Preferencias de cookies:</strong> permanecen en su dispositivo hasta que las elimine.</li>
                        <li><strong>Registros de consentimiento:</strong> durante el periodo de tratamiento + 3 años adicionales.</li>
                      </ul>
                    </section>

                    {/* 5. Sus Derechos */}
                    <section className="mb-4">
                      <h2 className="h4 text-secondary mb-3">5. Sus Derechos bajo el RGPD</h2>
                      <p>De conformidad con los artículos 15 a 22 del RGPD, usted tiene derecho a:</p>
                      <ul>
                        <li><strong>Acceso (Art. 15):</strong> obtener confirmación sobre si tratamos sus datos y una copia de los mismos.</li>
                        <li><strong>Rectificación (Art. 16):</strong> corregir datos inexactos o incompletos.</li>
                        <li><strong>Supresión (Art. 17):</strong> solicitar la eliminación de sus datos cuando ya no sean necesarios.</li>
                        <li><strong>Limitación (Art. 18):</strong> restringir el tratamiento en determinadas circunstancias.</li>
                        <li><strong>Portabilidad (Art. 20):</strong> recibir sus datos en formato estructurado y legible por máquina.</li>
                        <li><strong>Oposición (Art. 21):</strong> oponerse al tratamiento basado en interés legítimo o para fines de marketing.</li>
                        <li><strong>Revocación del consentimiento:</strong> retirar el consentimiento en cualquier momento sin que afecte a la licitud del tratamiento previo.</li>
                      </ul>
                      <p>Para ejercer sus derechos, contacte con nosotros en <a href="mailto:privacy@xopsalliance.com">privacy@xopsalliance.com</a>. Responderemos en un plazo máximo de 30 días.</p>
                      <p>También tiene derecho a presentar una reclamación ante la <strong>Agencia Española de Protección de Datos (AEPD)</strong>: <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">www.aepd.es</a></p>
                    </section>

                    {/* 6. Información sobre Cookies */}
                    <section className="mb-4">
                      <h2 className="h4 text-secondary mb-3">6. Información sobre Cookies</h2>
                      <p>Utilizamos cookies esenciales para el funcionamiento del sitio y cookies analíticas (previa aceptación) para mejorar nuestros servicios. Puede gestionar sus preferencias en cualquier momento a través del panel de configuración de cookies disponible en el pie de página.</p>
                      <p>Para más información, consulte nuestra <a href="/politica-de-cookies">Política de Cookies</a>.</p>
                    </section>

                    {/* 7. Terceros y Transferencias */}
                    <section className="mb-4">
                      <h2 className="h4 text-secondary mb-3">7. Terceros y Transferencias Internacionales</h2>
                      <ul>
                        <li><strong>Stripe, Inc.</strong> (procesamiento de pagos) — sujeto a DPA conforme al RGPD.</li>
                        <li><strong>Microsoft</strong> (autenticación federada de ponentes) — bajo sus propias políticas de privacidad.</li>
                        <li><strong>Proveedores de analítica</strong> (con IP anonimizada y sin identificación personal).</li>
                      </ul>
                      <p>Las transferencias fuera del Espacio Económico Europeo se realizan mediante garantías adecuadas (cláusulas contractuales tipo aprobadas por la Comisión Europea).</p>
                    </section>

                    {/* 8. Seguridad */}
                    <section className="mb-4">
                      <h2 className="h4 text-secondary mb-3">8. Seguridad</h2>
                      <p>Implementamos medidas técnicas y organizativas apropiadas: cifrado TLS, control de acceso basado en roles y auditorías periódicas de seguridad. No obstante, ningún sistema es completamente invulnerable; en caso de brecha de seguridad, notificaremos a las autoridades y a los afectados conforme al Art. 33–34 RGPD.</p>
                    </section>

                    {/* 9. Contacto */}
                    <section className="mb-4">
                      <h2 className="h4 text-secondary mb-3">9. Contacto para Privacidad</h2>
                      <div className="bg-light p-3 rounded">
                        <p className="mb-1"><strong>X-Ops Alliance, S.L.</strong></p>
                        <p className="mb-1">Email: <a href="mailto:privacy@xopsalliance.com">privacy@xopsalliance.com</a></p>
                        <p className="mb-1">DPO: <a href="mailto:dpo@xopsalliance.com">dpo@xopsalliance.com</a></p>
                        <p className="mb-0">Autoridad de control: <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">AEPD — www.aepd.es</a></p>
                      </div>
                    </section>

                    {/* 10. Cambios */}
                    <section className="mb-4">
                      <h2 className="h4 text-secondary mb-3">10. Cambios en esta Política</h2>
                      <p>Nos reservamos el derecho de actualizar esta política. Los cambios significativos se notificarán a través del sitio web con al menos 30 días de antelación. Le recomendamos revisar esta página periódicamente.</p>
                    </section>

                    <div className="text-center mt-5 pt-4 border-top">
                      <p className="text-muted small">
                        <strong>Última actualización:</strong> junio 2025 · <strong>Versión:</strong> 2.0
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