import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import SEO from '../components/SEO';
import AnimationWrapper from '../components/AnimationWrapper';

const TermsOfService = () => {
  return (
    <>
      <SEO
        title="Términos de Servicio - X-Ops Conference"
        description="Términos y condiciones de uso del sitio web y servicios de X-Ops Conference. Organizado por X-Ops Alliance, S.L."
        path="/terminos-de-servicio"
        image="https://xopsconference.com/assets/xops-og.jpg"
        lang="es"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Términos de Servicio - X-Ops Conference",
          "description": "Términos y condiciones de uso de X-Ops Conference"
        }}
      />
      <section className="py-5" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
        <Container>
          <AnimationWrapper animation="fade-up" duration={1000}>
            <Row className="justify-content-center">
              <Col lg={10} xl={8}>
                <div className="bg-white rounded-lg p-4 p-md-5 shadow-sm">
                  <h1 className="text-center mb-2 text-primary">Términos de Servicio</h1>
                  <p className="text-center text-muted small mb-5">Última actualización: junio 2025</p>
                  <div className="privacy-content">

                    {/* 1. Objeto */}
                    <section className="mb-4">
                      <h2 className="h4 text-secondary mb-3">1. Objeto</h2>
                      <p>Los presentes Términos de Servicio regulan el acceso y uso del sitio web <strong>xopsconference.com</strong> y los servicios relacionados con el evento <strong>X-Ops Conference</strong>, organizado por <strong>X-Ops Alliance, S.L.</strong>, con domicilio en Madrid, España.</p>
                      <p>El acceso al sitio web implica la aceptación plena y sin reservas de estos términos. Si no está de acuerdo con alguna de las condiciones aquí establecidas, le rogamos que no utilice este sitio web ni sus servicios.</p>
                    </section>

                    {/* 2. Acceso y Uso */}
                    <section className="mb-4">
                      <h2 className="h4 text-secondary mb-3">2. Acceso y Uso</h2>
                      <p>El acceso al sitio web es gratuito y está dirigido principalmente a profesionales del sector tecnológico. El usuario se compromete a:</p>
                      <ul>
                        <li>Utilizar el sitio de forma lícita, conforme a la legislación vigente y a las buenas costumbres.</li>
                        <li>No realizar actividades que puedan dañar, inutilizar o deteriorar el sitio web o impedir su normal utilización por otros usuarios.</li>
                        <li>No intentar acceder sin autorización a secciones restringidas, sistemas o redes vinculados al sitio web.</li>
                        <li>No transmitir contenidos ilícitos, ofensivos, difamatorios o que vulneren derechos de terceros.</li>
                      </ul>
                    </section>

                    {/* 3. Compra de Entradas y Reservas */}
                    <section className="mb-4">
                      <h2 className="h4 text-secondary mb-3">3. Compra de Entradas y Reservas</h2>
                      <ul>
                        <li>La compra de entradas es definitiva. No se admiten cancelaciones ni reembolsos por parte del asistente, salvo en caso de cancelación del evento por parte del organizador.</li>
                        <li>En caso de cancelación del evento por causa imputable a X-Ops Alliance, S.L., se procederá al reembolso íntegro del importe abonado en un plazo máximo de <strong>14 días hábiles</strong> desde la comunicación oficial de la cancelación.</li>
                        <li>Las entradas son <strong>nominales y no transferibles</strong> a terceros sin autorización expresa y por escrito de la organización.</li>
                        <li>La organización se reserva el derecho de solicitar identificación oficial en el acceso al evento para verificar la titularidad de la entrada.</li>
                        <li>Los pagos se procesan de forma segura a través de <strong>Stripe</strong>. X-Ops Alliance no almacena datos de tarjeta bancaria.</li>
                      </ul>
                    </section>

                    {/* 4. Ponentes y Contenidos */}
                    <section className="mb-4">
                      <h2 className="h4 text-secondary mb-3">4. Ponentes y Contenidos</h2>
                      <ul>
                        <li>Los ponentes confirman que poseen todos los derechos necesarios sobre sus presentaciones y materiales, y que estos no infringen derechos de propiedad intelectual de terceros.</li>
                        <li>X-Ops Alliance, S.L. podrá grabar y difundir las ponencias con fines de archivo y promoción del evento, previa obtención del consentimiento expreso del ponente correspondiente.</li>
                        <li>Los ponentes son responsables del contenido de sus presentaciones. X-Ops Alliance no asume responsabilidad por las opiniones expresadas por los ponentes durante el evento.</li>
                      </ul>
                    </section>

                    {/* 5. Propiedad Intelectual */}
                    <section className="mb-4">
                      <h2 className="h4 text-secondary mb-3">5. Propiedad Intelectual</h2>
                      <p>El contenido del sitio web — incluyendo, sin carácter limitativo, logotipos, diseño gráfico, textos, fotografías, vídeos y código fuente — es propiedad de <strong>X-Ops Alliance, S.L.</strong> o de sus licenciantes y está protegido por la legislación española e internacional sobre propiedad intelectual e industrial.</p>
                      <p>Queda expresamente prohibida su reproducción, distribución, comunicación pública o transformación, total o parcial, sin la autorización previa y por escrito de X-Ops Alliance, S.L., salvo en los supuestos legalmente permitidos.</p>
                    </section>

                    {/* 6. Limitación de Responsabilidad */}
                    <section className="mb-4">
                      <h2 className="h4 text-secondary mb-3">6. Limitación de Responsabilidad</h2>
                      <p>X-Ops Alliance, S.L. no será responsable de:</p>
                      <ul>
                        <li>Daños indirectos, incidentales o consecuentes derivados del uso o la imposibilidad de uso del sitio web.</li>
                        <li>Pérdida de beneficios, datos o ingresos esperados.</li>
                        <li>Interrupciones del servicio por causas técnicas ajenas a su control.</li>
                        <li>Contenidos de sitios web de terceros enlazados desde xopsconference.com.</li>
                      </ul>
                      <p>La limitación anterior no se aplica en casos de dolo o negligencia grave por parte de X-Ops Alliance, S.L., ni en aquellos supuestos en que la legislación aplicable no permita dicha limitación.</p>
                    </section>

                    {/* 7. Cancelación del Evento */}
                    <section className="mb-4">
                      <h2 className="h4 text-secondary mb-3">7. Cancelación o Modificación del Evento</h2>
                      <p>En caso de fuerza mayor, circunstancias extraordinarias o causas ajenas a la voluntad del organizador, X-Ops Alliance, S.L. se reserva el derecho de:</p>
                      <ul>
                        <li>Modificar el formato del evento (presencial a virtual o híbrido).</li>
                        <li>Cambiar la fecha o el lugar de celebración.</li>
                        <li>Cancelar el evento en su totalidad.</li>
                      </ul>
                      <p>En cualquiera de estos casos, la organización notificará a los asistentes con la mayor antelación posible a través de los datos de contacto proporcionados en el momento de la compra y del sitio web oficial.</p>
                    </section>

                    {/* 8. Modificaciones de los Términos */}
                    <section className="mb-4">
                      <h2 className="h4 text-secondary mb-3">8. Modificaciones de los Términos</h2>
                      <p>X-Ops Alliance, S.L. se reserva el derecho de actualizar o modificar estos Términos de Servicio en cualquier momento. Los cambios se publicarán en el sitio web con al menos <strong>30 días de antelación</strong> a su entrada en vigor. El uso continuado del sitio web tras la publicación de los cambios implica la aceptación de los nuevos términos.</p>
                    </section>

                    {/* 9. Ley Aplicable y Jurisdicción */}
                    <section className="mb-4">
                      <h2 className="h4 text-secondary mb-3">9. Ley Aplicable y Jurisdicción</h2>
                      <p>Estos Términos de Servicio se rigen e interpretan de conformidad con la legislación española. Para la resolución de cualquier conflicto o controversia que pudiera derivarse del acceso o uso del sitio web o de la asistencia al evento, las partes se someten expresamente a la jurisdicción de los <strong>Juzgados y Tribunales de Madrid</strong>, con renuncia expresa a cualquier otro fuero que pudiera corresponderles.</p>
                      <p>En el caso de usuarios que tengan la condición de consumidores, se estará a lo dispuesto en la legislación de protección de consumidores y usuarios vigente en España.</p>
                    </section>

                    {/* 10. Contacto */}
                    <section className="mb-4">
                      <h2 className="h4 text-secondary mb-3">10. Contacto</h2>
                      <div className="bg-light p-3 rounded">
                        <p className="mb-1"><strong>X-Ops Alliance, S.L.</strong></p>
                        <p className="mb-1">Domicilio: Madrid, España</p>
                        <p className="mb-1">Email legal/privacidad: <a href="mailto:privacy@xopsalliance.com">privacy@xopsalliance.com</a></p>
                        <p className="mb-0">Email del evento: <a href="mailto:info@xopsconference.com">info@xopsconference.com</a></p>
                      </div>
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

export default TermsOfService;
