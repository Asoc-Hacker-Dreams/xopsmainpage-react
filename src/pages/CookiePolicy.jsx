import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import SEO from '../components/SEO';
import AnimationWrapper from '../components/AnimationWrapper';

const CookiePolicy = () => {
  return (
    <>
      <SEO
        title="Política de Cookies - X-Ops Conference"
        description="Información sobre el uso de cookies en el sitio web de X-Ops Conference."
        path="/politica-de-cookies"
        image="https://xopsconference.com/assets/xops-og.jpg"
        lang="es"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Política de Cookies - X-Ops Conference",
          "description": "Política de uso de cookies de X-Ops Conference"
        }}
      />
      <section className="py-5" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <Container>
          <AnimationWrapper animation="fade-up" duration={1000}>
            <Row className="justify-content-center">
              <Col lg={10} xl={8}>
                <div className="bg-white rounded-lg p-4 p-md-5 shadow-sm">
                  <h1 className="text-center mb-2 text-primary">Política de Cookies</h1>
                  <p className="text-center text-muted small mb-5">Última actualización: junio 2025</p>
                  <div className="privacy-content">

                    {/* 1. ¿Qué son las Cookies? */}
                    <section className="mb-4">
                      <h2 className="h4 text-secondary mb-3">1. ¿Qué son las Cookies?</h2>
                      <p>Las cookies son pequeños archivos de texto que los sitios web almacenan en el navegador del usuario cuando este los visita. Permiten que el sitio recuerde información sobre su visita, como el idioma preferido y otras opciones de configuración, lo que puede facilitar su próxima visita y hacer que el sitio le resulte más útil.</p>
                      <p>Las cookies no contienen información personal identificable por sí solas, aunque en algunos casos pueden vincularse a ella. Conforme al Reglamento (UE) 2016/679 (RGPD) y la Ley 34/2002 de Servicios de la Sociedad de la Información (LSSI), las cookies no esenciales requieren su consentimiento previo.</p>
                    </section>

                    {/* 2. ¿Qué Cookies Utilizamos? */}
                    <section className="mb-4">
                      <h2 className="h4 text-secondary mb-3">2. ¿Qué Cookies Utilizamos?</h2>

                      <h3 className="h5 mb-2">2.1 Cookies Esenciales</h3>
                      <p className="text-muted small mb-2">Siempre activas — base legal: interés legítimo / funcionamiento técnico del servicio.</p>
                      <div className="table-responsive">
                        <table className="table table-bordered table-sm">
                          <thead className="table-light">
                            <tr>
                              <th>Nombre</th>
                              <th>Finalidad</th>
                              <th>Duración</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td><code>xops_consent</code></td>
                              <td>Almacena sus preferencias de consentimiento de cookies</td>
                              <td>1 año</td>
                            </tr>
                            <tr>
                              <td>Cookie de sesión</td>
                              <td>Mantiene la sesión activa en el portal de ponentes</td>
                              <td>Sesión (se elimina al cerrar el navegador)</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <h3 className="h5 mb-2 mt-4">2.2 Cookies Analíticas</h3>
                      <p className="text-muted small mb-2">Solo con su consentimiento — base legal: Art. 6.1.a RGPD.</p>
                      <div className="table-responsive">
                        <table className="table table-bordered table-sm">
                          <thead className="table-light">
                            <tr>
                              <th>Proveedor</th>
                              <th>Finalidad</th>
                              <th>Duración</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td>Google Analytics / analítica web</td>
                              <td>Mide el rendimiento y uso del sitio con IP anonimizada. No permite identificar a usuarios individuales.</td>
                              <td>Máximo 26 meses (datos agregados)</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <h3 className="h5 mb-2 mt-4">2.3 Cookies de Redes Sociales y Terceros</h3>
                      <p className="text-muted small mb-2">Solo con su consentimiento.</p>
                      <p>Pueden activarse al interactuar con botones para compartir contenido en redes sociales (LinkedIn, Twitter/X, etc.). Estas cookies son gestionadas por las propias plataformas y están sujetas a sus respectivas políticas de privacidad, sobre las que X-Ops Alliance no tiene control.</p>
                    </section>

                    {/* 3. ¿Cómo Gestionar las Cookies? */}
                    <section className="mb-4">
                      <h2 className="h4 text-secondary mb-3">3. ¿Cómo Gestionar las Cookies?</h2>

                      <h3 className="h5 mb-2">3.1 Desde Nuestro Panel de Preferencias</h3>
                      <p>Puede modificar sus preferencias de cookies en cualquier momento pulsando el botón <strong>"Gestionar cookies"</strong> disponible en el pie de página del sitio web. Los cambios se aplicarán de inmediato.</p>

                      <h3 className="h5 mb-2 mt-3">3.2 Desde la Configuración de su Navegador</h3>
                      <p>También puede gestionar o eliminar las cookies directamente desde su navegador:</p>
                      <ul>
                        <li><strong>Chrome:</strong> Configuración → Privacidad y seguridad → Cookies y otros datos de sitios</li>
                        <li><strong>Firefox:</strong> Opciones → Privacidad y seguridad → Cookies y datos del sitio</li>
                        <li><strong>Safari:</strong> Preferencias → Privacidad → Gestionar datos de sitios web</li>
                        <li><strong>Edge:</strong> Configuración → Privacidad, búsqueda y servicios → Cookies y permisos del sitio</li>
                      </ul>
                      <div className="alert alert-warning small mt-2" role="alert">
                        <strong>Aviso:</strong> Desactivar todas las cookies puede afectar al correcto funcionamiento de algunas secciones del sitio web, especialmente el portal de ponentes.
                      </div>
                    </section>

                    {/* 4. Cookies de Terceros */}
                    <section className="mb-4">
                      <h2 className="h4 text-secondary mb-3">4. Cookies de Terceros</h2>
                      <p>Los siguientes terceros pueden instalar cookies en su navegador a través de nuestro sitio:</p>
                      <ul>
                        <li>
                          <strong>Google LLC</strong> (Google Analytics) —{' '}
                          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Política de privacidad de Google</a>
                        </li>
                        <li>
                          <strong>Microsoft Corporation</strong> (autenticación federada) —{' '}
                          <a href="https://privacy.microsoft.com/es-es/privacystatement" target="_blank" rel="noopener noreferrer">Declaración de privacidad de Microsoft</a>
                        </li>
                      </ul>
                      <p>X-Ops Alliance no controla las cookies instaladas por estos terceros. Para más información, consulte sus respectivas políticas de privacidad.</p>
                    </section>

                    {/* 5. Contacto */}
                    <section className="mb-4">
                      <h2 className="h4 text-secondary mb-3">5. Contacto</h2>
                      <div className="bg-light p-3 rounded">
                        <p className="mb-1"><strong>X-Ops Alliance, S.L.</strong></p>
                        <p className="mb-1">Email: <a href="mailto:privacy@xopsalliance.com">privacy@xopsalliance.com</a></p>
                        <p className="mb-1">DPO: <a href="mailto:dpo@xopsalliance.com">dpo@xopsalliance.com</a></p>
                        <p className="mb-0">Autoridad de control: <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">AEPD — www.aepd.es</a></p>
                      </div>
                      <p className="mt-3 small text-muted">Para más información sobre el tratamiento de sus datos personales, consulte nuestra <a href="/politica-de-privacidad">Política de Privacidad</a>.</p>
                    </section>

                    <div className="text-center mt-5 pt-4 border-top">
                      <p className="text-muted small">
                        <strong>Última actualización:</strong> junio 2025 · <strong>Responsable:</strong> X-Ops Alliance, S.L.
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

export default CookiePolicy;
