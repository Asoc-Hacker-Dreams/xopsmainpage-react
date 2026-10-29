import React from 'react';
import LegalDocument from '../legal/LegalDocument';
import { ORGANIZER, PAYMENT_COLLECTOR } from '../legal/identity';

// Registry and registered-office fields are deliberately configuration-driven.
// They MUST be verified and populated before promotion to production.
const addressES = ORGANIZER.registeredAddress
  ? 'Domicilio registral: ' + ORGANIZER.registeredAddress
  : 'La dirección registral exacta debe verificarse y completarse antes de publicar esta versión.';
const addressEN = ORGANIZER.registeredAddress
  ? 'Registered office: ' + ORGANIZER.registeredAddress
  : 'The exact registered office must be verified and completed before publishing this version.';
const registryES = ORGANIZER.associationRegistry
  ? 'Registro de asociaciones: ' + ORGANIZER.associationRegistry
  : 'Los datos del registro de asociaciones deben verificarse y completarse antes de publicar esta versión.';
const registryEN = ORGANIZER.associationRegistry
  ? 'Associations register: ' + ORGANIZER.associationRegistry
  : 'Association registry details must be verified and completed before publishing this version.';
const collectorAddressES = PAYMENT_COLLECTOR.registeredAddress
  ? 'Domicilio de la entidad recaudadora: ' + PAYMENT_COLLECTOR.registeredAddress
  : 'El domicilio completo de la entidad recaudadora está sujeto a verificación documental antes de publicación.';
const collectorAddressEN = PAYMENT_COLLECTOR.registeredAddress
  ? 'Collection entity registered office: ' + PAYMENT_COLLECTOR.registeredAddress
  : 'The collection entity registered address must be verified before publication.';

const document = {
  es: {
    title: 'Aviso legal e identificación del organizador',
    subtitle: 'Información sobre quién organiza X-Ops Conference, quién gestiona los cobros y qué normas rigen el acceso a la web.',
    sections: [
      { title: '1. Titular y responsable de la web', paragraphs: [
        'Titular y organizador: ' + ORGANIZER.name + ' · CIF: ' + ORGANIZER.taxId + '. País: ' + ORGANIZER.country + '.',
        addressES, registryES,
        'Contacto público: ' + ORGANIZER.contactEmail + '. Contacto para protección de datos: ' + ORGANIZER.privacyEmail + '.'
      ]},
      { title: '2. Identidad de las entidades de cobro', paragraphs: [
        PAYMENT_COLLECTOR.name + ' (Delaware, Estados Unidos) es la entidad designada para gestionar cobros mediante Stripe. Stripe facilita la tecnología de pago. Esta diferenciación no constituye por sí sola una afirmación sobre quién es el vendedor contractual ni el emisor de una factura concreta.',
        collectorAddressES,
        'La identificación del vendedor, los impuestos y el emisor de factura deberán coincidir con la información contractual y de pago efectivamente facilitada en la compra de la edición correspondiente.'
      ]},
      { title: '3. Ámbito del sitio y ediciones', paragraphs: [
        'Este aviso afecta a xopsconference.com, madrid.xopsconference.com y dubai.xopsconference.com. La información facilitada sobre Fundación Juan XXIII, la Universidad Rey Juan Carlos u otras sedes se refiere a los lugares de celebración, no al domicilio social del titular.',
        'Madrid y Dubái pueden estar sujetos a normas territoriales distintas en contratación, protección de datos y comercio. Las políticas y condiciones específicas de cada edición están disponibles en el pie de página.'
      ]},
      { title: '4. Propiedad intelectual, uso responsable y enlaces', paragraphs: [
        'Las marcas, textos, gráficos, imágenes y materiales de terceros pertenecen a sus respectivos titulares. Los enlaces a Sessionize, Microsoft Forms y servicios de pago dirigen a proveedores ajenos que pueden publicar sus propios avisos.',
        'No están permitidos accesos no autorizados, actuaciones fraudulentas ni usos que infrinjan derechos de terceros. Se respetarán los derechos irrenunciables de consumidores y usuarios en los términos de la legislación aplicable.'
      ]},
      { title: '5. Condiciones y protección de datos', paragraphs: [
        'La navegación por la web no equivale a aceptar una compra. Antes de solicitar el pago se facilitan las condiciones de contratación y se exige la aceptación expresa correspondiente.',
        'Las condiciones de Madrid y Dubái, la privacidad UE y EAU, el uso de cookies y los avisos sobre patrocinadores y fotografías están disponibles en la sección de información legal.'
      ]}
    ]
  },
  en: {
    title: 'Legal notice and organiser identity',
    subtitle: 'Who organises X-Ops Conference, who handles collections and which rules apply to the website.',
    sections: [
      { title: '1. Website operator and event organiser', paragraphs: [
        'Operator and organiser: ' + ORGANIZER.name + ' · Spanish tax ID: ' + ORGANIZER.taxId + '. Country: ' + ORGANIZER.country + '.',
        addressEN, registryEN,
        'General contact: ' + ORGANIZER.contactEmail + '. Privacy contact: ' + ORGANIZER.privacyEmail + '.'
      ]},
      { title: '2. Payment collection entities', paragraphs: [
        PAYMENT_COLLECTOR.name + ' (Delaware, United States) is designated to handle collections through Stripe. Stripe provides payment technology. This distinction does not establish the contractual seller or invoice issuer for any particular transaction.',
        collectorAddressEN,
        'The merchant, applicable taxes and invoice issuer must match the actual contract and payment disclosures presented for the chosen event edition.'
      ]},
      { title: '3. Website and event editions', paragraphs: [
        'This notice covers xopsconference.com, madrid.xopsconference.com and dubai.xopsconference.com. Fundación Juan XXIII, Universidad Rey Juan Carlos and any other announced venues are event locations, not the registered office of the website operator.',
        'Madrid and Dubai can be subject to different territorial rules on contracts, personal data and e-commerce. Edition-specific notices and terms are accessible from the footer.'
      ]},
      { title: '4. Intellectual property and external links', paragraphs: [
        'Marks, copy, graphics, images and third-party materials remain the property of their respective rights holders. Links to Sessionize, Microsoft Forms and payment providers lead to independent services with their own notices.',
        'Unauthorised access, fraud and infringements of third-party rights are prohibited. Mandatory consumer and user rights are preserved by applicable law.'
      ]},
      { title: '5. Terms and privacy', paragraphs: [
        'Browsing alone does not constitute agreement to buy a ticket. The relevant purchase terms are displayed before requesting payment and require explicit acceptance.',
        'Madrid and Dubai terms, EU and UAE privacy policies, cookies, sponsorship leads and photography notices are linked in the legal information section.'
      ]}
    ]
  }
};

export default function LegalNotice() {
  return <LegalDocument document={document} />;
}
