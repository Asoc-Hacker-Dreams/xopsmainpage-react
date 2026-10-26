export const noticesContent = {
  cookies: {
    es: {
      title: 'Política de cookies y almacenamiento local',
      subtitle: 'Qué tecnologías utilizamos, para qué sirven y cómo controlar cada finalidad.',
      sections: [
        { title: '1. Qué son las cookies y las tecnologías similares', paragraphs: [
          'Las cookies son identificadores que el navegador puede almacenar y enviar a un servicio. También utilizamos almacenamiento local del navegador para guardar preferencias, sin que ello convierta esos datos en cookies. Algunas tecnologías permiten identificar o reconocer un dispositivo y, por tanto, tratar datos personales.',
          'Las cookies no necesarias para prestar el servicio solicitado no se activan sin consentimiento previo, libre, específico e informado. Continuar navegando, desplazar la página o cerrar el aviso no equivale a consentir.'
        ]},
        { title: '2. Tecnologías necesarias', bullets: [
          'xopsconf_consent_v3 (localStorage, del propio sitio): guarda las categorías de consentimiento elegidas y su fecha, durante un máximo de doce meses. Necesaria para recordar y aplicar tu decisión.',
          'Preferencias de idioma, tema, agenda u otras configuraciones locales: permiten recordar decisiones sobre el funcionamiento y presentación de la web; pueden variar según el módulo.',
          'Cookies técnicas de autenticación o seguridad: pueden ser utilizadas por los servicios externos de entradas o autenticación cuando sea indispensable para la función solicitada.'
        ]},
        { title: '3. Analítica opcional', paragraphs: [
          'Google Analytics (Google LLC) puede instalar identificadores como _ga o _ga_* cuando autorizas la analítica. Si aceptas, medimos páginas vistas, selección de entrada, inicio y abandono del checkout y compras confirmadas mediante transacción única, moneda, importe y tipo de entrada; no enviamos nombre, correo ni datos completos de tarjeta. La duración de las cookies depende de la configuración del proveedor.',
          'La atribución opcional de campañas usa utm_source, utm_medium, utm_campaign, utm_id, utm_content y utm_term, filtrados para excluir datos personales visibles. xops_utm_attribution_v1 (sessionStorage, máximo 24 horas y hasta el cierre de la pestaña) conserva el primer y el último contacto. xops_checkout_departure_v1 (sessionStorage, máximo 2 horas) evita contar cancelaciones que no proceden de Stripe. xops_ga4_purchase_v1 (localStorage, máximo 30 días) evita duplicar compras. Solo se crean tras consentir analítica y se eliminan al retirarla.' ,
          'La analítica no es necesaria para obtener información del evento ni comprar una entrada. No se carga el script de Google Analytics antes del consentimiento expresamente otorgado desde el panel.'
        ]},
        { title: '4. Marketing y terceros', paragraphs: [
          'Actualmente no se cargan etiquetas de publicidad ni se solicita consentimiento anticipado para proveedores de marketing futuros. Si se incorporan, deberá actualizarse el inventario, la política y el panel de consentimiento antes de activarlas.',
          'Los enlaces externos a Sessionize, Stripe, Microsoft Forms, LinkedIn u otras plataformas llevan a servicios con políticas y tecnologías propias. Un enlace simple no equivale a cargar sus cookies en nuestra página.'
        ]},
        { title: '5. Cómo aceptar, rechazar, cambiar o retirar el consentimiento', paragraphs: [
          'En el aviso inicial puedes Aceptar todo, Rechazar todo o Personalizar la analítica opcional. Rechazar todo mantiene únicamente las tecnologías necesarias. Aceptar y rechazar se ofrecen en la misma capa y con visibilidad equivalente.',
          'Puedes abrir de nuevo el panel desde “Gestionar cookies” en el pie de página. Retirar el consentimiento impide nuevas cargas de los scripts correspondientes y el sitio procura eliminar los identificadores de analítica que controla. Las cookies gestionadas por terceros también pueden requerir borrado desde el navegador.'
        ]},
        { title: '6. Cambios y contacto', paragraphs: [
          'El inventario debe contrastarse periódicamente mediante inspección técnica de cada dominio y actualización de esta política cuando se añadan proveedores. El consentimiento de cookies no cubre la suscripción a newsletters ni la cesión de contactos a patrocinadores.',
          'Responsable: Asociación Hacker Dreams (CIF G56643158). Contacto: info@xopsconference.com.'
        ]}
      ]
    },
    en: {
      title: 'Cookie and browser storage policy',
      subtitle: 'Which technologies are used, for which purposes, and how to control them.',
      sections: [
        { title: '1. Cookies and similar technologies', paragraphs: [
          'Cookies are identifiers a browser can store and transmit to services. Browser local storage is also used for preferences; it is not itself a cookie. Some identifiers can relate to a device and therefore to personal data.',
          'Technologies not essential to a service you request remain inactive until free, specific and informed prior consent. Continued browsing, scrolling or closing the banner does not mean consent.'
        ]},
        { title: '2. Essential storage', bullets: [
          'xopsconf_consent_v3 (first-party localStorage): records the chosen consent categories and timestamp for no longer than twelve months. Required to remember and enforce your decision.',
          'Language, theme, agenda and other functional browser preferences: remember presentation and feature choices, depending on which module you use.',
          'Authentication and security cookies may be set by external ticketing or sign-in services where technically necessary for the requested function.'
        ]},
        { title: '3. Optional analytics', paragraphs: [
          'Google Analytics (Google LLC) may set identifiers such as _ga and _ga_* after analytics opt-in. With your consent we measure page views, ticket selection, checkout initiation/cancellation and purchases confirmed with a unique transaction ID, currency, amount and ticket type. We never send your name, email or full payment card details. Cookie duration depends on the provider’s configuration.',
          'Optional campaign attribution uses filtered utm_source, utm_medium, utm_campaign, utm_id, utm_content and utm_term. xops_utm_attribution_v1 (sessionStorage, up to 24 hours or tab close) keeps first and last touches. xops_checkout_departure_v1 (sessionStorage, up to 2 hours) avoids attributing arbitrary page visits as Stripe cancellations. xops_ga4_purchase_v1 (localStorage, up to 30 days) prevents duplicate purchases. All three are created only after analytics consent and removed if it is withdrawn.',
          'Analytics is not required to view the event or buy tickets. The Google Analytics script is not loaded before you explicitly authorise the analytics category.'
        ]},
        { title: '4. Marketing and external services', paragraphs: [
          'No advertising tags are currently loaded and we do not ask for advance consent to unknown future marketing vendors. If vendors are added, the inventory, policy and consent controls must be updated before activation.',
          'Links to Sessionize, Stripe, Microsoft Forms, LinkedIn and other external websites lead to providers with their own tracking practices. A normal outbound link does not itself load their cookies on our site.'
        ]},
        { title: '5. Accepting, rejecting and withdrawing', paragraphs: [
          'The first layer offers Accept all, Reject all and Customise analytics with equivalent prominence for accept and reject. Reject all preserves strictly essential storage only.',
          'Open “Manage cookies” in the footer at any time. Withdrawal prevents subsequent loads of the corresponding scripts and the site attempts to remove analytics identifiers under its control. Third-party cookies may also need to be cleared in the browser.'
        ]},
        { title: '6. Changes and contact', paragraphs: [
          'The inventory must be rechecked periodically on every host and updated whenever providers change. Cookie consent is not newsletter consent or permission to share attendee lists with sponsors.',
          'Controller: Asociación Hacker Dreams (Spanish tax ID G56643158). Contact: info@xopsconference.com.'
        ]}
      ]
    }
  },
  sponsors: {
    es: {
      title: 'Privacidad en patrocinio, networking y contacto con empresas',
      subtitle: 'Información para asistentes, patrocinadores y empresas que participan en X-Ops Conference.',
      sections: [
        { title: '1. Contactos de asistentes y patrocinadores', paragraphs: [
          'El registro y la compra de una entrada no suponen autorización para recibir publicidad de patrocinadores ni para compartir con ellos automáticamente la lista de asistentes. Solo se comunicarán datos para finalidades específicas con información previa y una base jurídica suficiente.',
          'Cuando una empresa recibe voluntariamente tu tarjeta, escanea tu acreditación con tu participación o recoge información mediante su formulario, debe indicarte quién trata los datos, la finalidad, la base jurídica y cómo ejercer tus derechos. Puede actuar como responsable independiente; nuestra política no sustituye la suya.'
        ]},
        { title: '2. Leads, QR y networking', paragraphs: [
          'Participar en el networking no obliga a facilitar tus datos a todas las empresas presentes. Mostrar información profesional o un código QR a otro asistente puede permitir un intercambio voluntario, pero no autoriza su reventa ni campañas ajenas a la finalidad explicada.',
          'Si en futuras ediciones habilitamos una función para compartir datos con patrocinadores concretos, la selección será granular, no premarcada y deberá registrar la identidad de cada destinatario, su finalidad y la versión de la información aceptada.'
        ]},
        { title: '3. Solicitudes comerciales y Startup Pack', paragraphs: [
          'Los formularios de patrocinio y Startup Pack recogen datos profesionales y de empresa para evaluar la solicitud y contactar a quien la envía. Su gestión se realiza mediante sistemas internos como Holos CRM. La suscripción opcional a información comercial aparece separada de las declaraciones necesarias.',
          'La verificación de elegibilidad puede requerir solicitar documentos adicionales mediante canales adecuados. No envíes documentación sensible o datos de terceros innecesarios en campos de texto libres.'
        ]},
        { title: '4. Solicitudes y ejercicio de derechos', paragraphs: [
          'Puedes pedir información sobre el tratamiento por la organización a info@xopsconference.com. Cuando tus datos se entreguen voluntariamente a una empresa externa, dirige a dicha empresa las solicitudes relativas a su tratamiento independiente.',
          'Consulta también la política de privacidad correspondiente a Madrid o Dubái y el aviso de fotografía y vídeo.'
        ]}
      ]
    },
    en: {
      title: 'Sponsorship, networking and lead privacy',
      subtitle: 'Information for event attendees, sponsors and companies interacting at X-Ops Conference.',
      sections: [
        { title: '1. Attendee and sponsor contacts', paragraphs: [
          'Registering or purchasing a ticket does not authorise sponsor advertising or automatically share attendee lists. Data may be disclosed for a specific purpose only where people are informed and a lawful basis exists.',
          'When a company receives your business card voluntarily, scans your badge through an interaction you choose, or collects details through its own form, it must identify who controls the data, the purposes, legal basis and rights contact. It may be an independent controller.'
        ]},
        { title: '2. Leads, QR codes and networking', paragraphs: [
          'Networking does not require sharing contact details with every exhibitor. Showing a professional profile or QR code can allow a voluntary exchange; it does not permit resale or unrelated bulk marketing.',
          'If sponsor-specific lead sharing is offered in future, the choice must be granular, unticked by default and record each recipient, purpose and notice version.'
        ]},
        { title: '3. Sponsorship applications and Startup Pack', paragraphs: [
          'Sponsorship and Startup Pack forms collect professional and company details for eligibility review and follow-up, processed through internal systems such as Holos CRM. Optional marketing subscription is independent of required declarations.',
          'Additional evidence of eligibility may be requested through an appropriate channel. Do not submit unnecessary sensitive or third-party personal data in free-text fields.'
        ]},
        { title: '4. Questions and rights', paragraphs: [
          'Contact info@xopsconference.com about processing by the organiser. Where you voluntarily provide details directly to a separate exhibitor, contact that company concerning its independent processing.',
          'See the privacy policy for Madrid or Dubai and the Photography and Video Notice.'
        ]}
      ]
    }
  },
  media: {
    es: {
      title: 'Aviso de fotografía, vídeo y grabaciones',
      subtitle: 'Información para asistentes, ponentes y profesionales de medios en X-Ops Conference.',
      sections: [
        { title: '1. Actividades de captación', paragraphs: [
          'Durante la conferencia pueden tomarse fotografías generales del recinto, planos de ambiente y grabaciones de sesiones para documentar y comunicar la actividad de la comunidad. Los lugares de grabación previstos deberán señalarse de forma visible en la sede.',
          'La captación general no habilita un uso indiscriminado de retratos individualizados o datos personales. La finalidad, proporcionalidad, base jurídica y derechos se evalúan por tipo de grabación.'
        ]},
        { title: '2. Entrevistas, primeros planos y testimonios', paragraphs: [
          'Para entrevistas, testimonios preparados, retratos individuales destinados a campañas o usos promocionales específicos se solicitará la autorización o licencia pertinente. Rechazar un uso promocional voluntario no condiciona la posibilidad de asistir al evento.',
          'Se respetarán los derechos sobre la propia imagen y, en su caso, la normativa aplicable de propiedad intelectual y protección de datos.'
        ]},
        { title: '3. Grabación de ponencias', paragraphs: [
          'La grabación, edición, reproducción y distribución de una ponencia se pactarán con su titular en unas condiciones diferenciadas de la mera aceptación de la charla. Los terceros titulares de gráficos, fotografías, música o demos deben contar con autorización cuando corresponda.',
          'Un acuerdo de grabación debería identificar canales, territorios, duración, extractos promocionales, posibles licencias y procedimiento para incidencias.'
        ]},
        { title: '4. Información, oposición y retirada', paragraphs: [
          'Si tienes dudas sobre la captación de tu imagen o deseas ejercer derechos cuando procedan, escribe a info@xopsconference.com antes o después del evento, indicando la edición, fecha y una descripción suficiente para localizar el contenido. Evita enviar copias completas de documentos de identidad salvo petición necesaria y justificada.',
          'No podemos prometer la eliminación de capturas legítimamente publicadas por terceros independientes, pero estudiaremos la solicitud respecto de materiales bajo nuestro control conforme a la normativa aplicable.'
        ]},
        { title: '5. Señalización para la sede', paragraphs: [
          'Texto recomendado para carteles informativos: “Este evento puede ser fotografiado y grabado por la organización para documentación y comunicación. Para información sobre finalidades, derechos y consultas sobre tu imagen: info@xopsconference.com. Consulta el Aviso de fotografía y vídeo en xopsconference.com/fotografia-y-video. Las entrevistas y usos promocionales individualizados se gestionan separadamente”.',
          'El personal y los proveedores audiovisuales deberán recibir instrucciones operativas sobre zonas de filmación, solicitudes de oposición y permisos de ponentes. El cartel no sustituye las autorizaciones que sean necesarias.'
        ]}
      ]
    },
    en: {
      title: 'Photography, filming and recording notice',
      subtitle: 'Information for attendees, speakers and media professionals at X-Ops Conference.',
      sections: [
        { title: '1. Filming and photography', paragraphs: [
          'During the conference, the organiser may take venue-wide photographs, atmosphere shots and session recordings to document and communicate community activities. Planned recording areas must be indicated by visible on-site notices.',
          'General event photography is not unlimited permission for individualised portraits or personal data. The purpose, proportionality, lawful basis and available rights should be assessed for each recording type.'
        ]},
        { title: '2. Interviews, close-ups and testimonials', paragraphs: [
          'Interviews, prepared testimonials, individual portraits for campaigns and other specific promotional uses require appropriate authorisation or licensing. Declining voluntary promotional use must not be a condition for attending the event.',
          'Image and intellectual-property rights, as well as applicable privacy law, must be respected.'
        ]},
        { title: '3. Speaker recordings', paragraphs: [
          'Recording, editing, reproducing and sharing a talk should be agreed separately with the rights holder, not presumed from speaker acceptance alone. Third-party images, music, charts and demonstrations may require additional rights clearances.',
          'Speaker agreements should define channels, territories, duration, promotional extracts, licence scope and a contact for disputes.'
        ]},
        { title: '4. Objections and removal requests', paragraphs: [
          'For photography queries or applicable rights requests, contact info@xopsconference.com before or after the event with the edition, date and information sufficient to identify the content. Avoid sending complete identity documents unless specifically and lawfully required.',
          'We cannot guarantee removal of independent third-party publications but will assess requests involving content under our control in accordance with applicable law.'
        ]},
        { title: '5. On-site notice wording', paragraphs: [
          'Suggested venue notice: “This event may be photographed and filmed by the organiser for documentation and communications. For purposes, rights and image queries, email info@xopsconference.com. See xopsconference.com/fotografia-y-video. Interviews and individual promotional use are handled separately.”',
          'Crew and audiovisual vendors must receive clear instructions for filming areas, objections and speaker permissions. A sign does not replace individual authorisations where required.'
        ]}
      ]
    }
  }
};