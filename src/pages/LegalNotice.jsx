import React from 'react';
import { useTranslation } from 'react-i18next';
import { Container } from 'react-bootstrap';
import SEO from '../components/SEO';
import { LEGAL_VERSION, ORGANIZER, PAYMENT_COLLECTOR } from '../legal/identity';

export default function LegalNotice() {
  const { i18n } = useTranslation();
  const en = i18n.language.startsWith('en');
  const L = (es, english) => en ? english : es;
  return (
    <>
      <SEO title={L('Aviso legal - X-Ops Conference', 'Legal notice - X-Ops Conference')}
        description={L('Identificación del organizador y condiciones legales del sitio.', 'Legal identity of the event organiser and site information.')}
        path="/aviso-legal" lang={en ? 'en' : 'es'} />
      <section className="py-5" style={{ background: '#f8f9fa', minHeight: '100vh' }}>
        <Container style={{ maxWidth: 920 }}>
          <article className="bg-white rounded p-4 p-md-5 shadow-sm text-dark">
            <h1>{L('Aviso legal', 'Legal notice')}</h1>
            <p className="text-muted">{L('Actualizado', 'Updated')}: {LEGAL_VERSION}</p>
            <h2 className="h4 mt-4">{L('Titular y organizador', 'Website operator and event organiser')}</h2>
            <p><strong>{ORGANIZER.name}</strong> · {L('CIF', 'Spanish tax ID')}: {ORGANIZER.taxId} · {ORGANIZER.country}</p>
            <p>{L('Correo de contacto', 'Contact email')}: <a href={'mailto:' + ORGANIZER.contactEmail}>{ORGANIZER.contactEmail}</a></p>
            {ORGANIZER.registeredAddress
              ? <p>{L('Domicilio registral', 'Registered address')}: {ORGANIZER.registeredAddress}</p>
              : <p>{L('El domicilio registral está pendiente de validación documental. Solicite el contacto postal al correo indicado; este dato debe completarse antes de publicar esta versión.', 'Registered address awaits documentary validation. Request postal contact at the above email; this field must be completed before publishing this version.')}</p>}
            {ORGANIZER.associationRegistry
              ? <p>{L('Registro de asociaciones', 'Associations register')}: {ORGANIZER.associationRegistry}</p>
              : <p>{L('Los datos de inscripción en el registro de asociaciones deben incorporarse tras su comprobación documental.', 'Association registration details must be completed once documentary verification is finished.')}</p>}
            <h2 className="h4 mt-4">{L('Pagos y entidad recaudadora', 'Payments and collection entity')}</h2>
            <p>{L('La organización del evento corresponde a la asociación. La entidad indicada para la gestión de cobros a través de Stripe es', 'The association organises the event. The entity designated to handle collections through Stripe is')} <strong>{PAYMENT_COLLECTOR.name}</strong> ({PAYMENT_COLLECTOR.jurisdiction}).</p>
            <p>{L('Stripe suministra la pasarela técnica de pago. El nombre que aparece en el extracto o en la pantalla de cobro no debe confundirse automáticamente con el organizador. El emisor de la factura y la contraparte contractual deben coincidir con los datos comunicados antes de pagar.', 'Stripe supplies payment-processing technology. A card statement descriptor or payment screen name does not automatically identify the organiser. The invoice issuer and contracting business must match the details disclosed before payment.')}</p>
            <h2 className="h4 mt-4">{L('Ediciones y alcance territorial', 'Event editions and territorial scope')}</h2>
            <p>{L('Este aviso se aplica a xopsconference.com y a madrid.xopsconference.com y dubai.xopsconference.com. La información sobre el recinto no constituye el domicilio social del organizador.', 'This notice covers xopsconference.com, madrid.xopsconference.com and dubai.xopsconference.com. A venue address is not the organiser’s registered address.')}</p>
            <p>{L('Para Dubái pueden resultar aplicables normas adicionales de EAU. El uso de una entidad de cobro estadounidense no significa que exista una licencia comercial o establecimiento registrado en EAU.', 'Additional UAE rules may apply to Dubai. The use of a US collection entity does not imply a UAE commercial licence or registered establishment.')}</p>
            <h2 className="h4 mt-4">{L('Propiedad intelectual y responsabilidad', 'Intellectual property and liability')}</h2>
            <p>{L('Las marcas, contenidos y materiales pertenecen a sus respectivos titulares. Su uso no autorizado puede vulnerar derechos de terceros. Los enlaces externos se proporcionan para facilitar el acceso a servicios de otros operadores.', 'Marks, content and materials belong to their respective owners. Unauthorised use may infringe third-party rights. External links are provided for access to third-party services.')}</p>
            <p>{L('Consulte las', 'See the')} <a href="/terminos-de-servicio">{L('condiciones de contratación', 'terms of service')}</a>, <a href="/politica-de-privacidad">{L('privacidad', 'privacy notice')}</a> {L('y', 'and')} <a href="/politica-de-cookies">{L('cookies', 'cookie notice')}</a>.</p>
          </article>
        </Container>
      </section>
    </>
  );
}
