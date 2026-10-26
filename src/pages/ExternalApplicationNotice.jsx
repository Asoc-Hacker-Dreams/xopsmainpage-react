import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import SEO from '../components/SEO';
import { ORGANIZER } from '../legal/identity';
import '../legal/legal.css';

const destinations = {
  volunteer: 'https://forms.office.com/Pages/ResponsePage.aspx?id=EaWMGDgsSEi09sqLCPLFFUHOFUdEMtRPqJBa35Bh2thURUtLTkZURlhTRFFJUlZDTTk5ODcyNTFBMi4u&embed=true',
  speaker: 'https://sessionize.com/x-ops-conference-2026/',
};
const texts = {
  volunteer: {
    es: {
      title: 'Voluntariado en X-Ops Conference',
      lead: 'Antes de enviar tu solicitud, conoce quién utiliza tus datos y dónde se recibirá el formulario.',
      purpose: 'Utilizaremos los datos facilitados para valorar la participación como voluntario, coordinar actividades y comunicarnos sobre esta convocatoria. No te inscribiremos en comunicaciones comerciales por solicitar participar.',
      provider: 'La solicitud se cumplimenta en Microsoft Forms, un servicio externo que también puede facilitar su propio aviso de privacidad.',
      action: 'Continuar al formulario de voluntariado'
    },
    en: {
      title: 'Volunteer at X-Ops Conference',
      lead: 'Before applying, please review who handles your details and where the external form is hosted.',
      purpose: 'The details you provide will be used to review your volunteer application, coordinate event duties and contact you about this opportunity. Applying does not subscribe you to marketing.',
      provider: 'The application is completed on Microsoft Forms, an external service that may also provide its own privacy notice.',
      action: 'Continue to volunteer form'
    }
  },
  speaker: {
    es: {
      title: 'Convocatoria de ponentes · X-Ops Conference 2026',
      lead: 'Las propuestas de charla se reciben mediante Sessionize para su revisión por el equipo de programa.',
      purpose: 'El título, resumen, biografía, datos profesionales y fotografía que envíes se utilizarán para evaluar tu propuesta y, si se acepta, organizar y publicar tu participación según la información ofrecida en la convocatoria.',
      provider: 'Sessionize es un servicio externo. Revisa también su aviso de privacidad y las condiciones específicas al enviar la propuesta. La grabación o distribución de la charla se gestionará separadamente.',
      action: 'Continuar a Sessionize'
    },
    en: {
      title: 'Call for speakers · X-Ops Conference 2026',
      lead: 'Talk proposals are collected through Sessionize and reviewed by the programme committee.',
      purpose: 'Your talk title, abstract, biography, professional details and picture will be used to evaluate the proposal and, if selected, organise and promote your participation as described in the call for speakers.',
      provider: 'Sessionize is an external provider. Review its own privacy notice and terms before submitting. Recording and publishing your session are handled separately.',
      action: 'Continue to Sessionize'
    }
  }
};

export default function ExternalApplicationNotice({ type }) {
  const { i18n } = useTranslation();
  const [params] = useSearchParams();
  const lang = (i18n.resolvedLanguage || i18n.language || 'es').startsWith('en') ? 'en' : 'es';
  const copy = texts[type]?.[lang] || texts.speaker[lang];
  const city = params.get('city') === 'dubai' || (params.get('city') !== 'madrid' && typeof window !== 'undefined' && window.location.hostname === 'dubai.xopsconference.com') ? 'dubai' : 'madrid';
  return (
    <main id="main-content" className="xops-legal">
      <SEO title={copy.title} description={copy.lead} path={type === 'volunteer' ? '/voluntariado' : '/convocatoria-ponentes'} lang={lang} />
      <div className="container" style={{maxWidth:850}}>
        <article className="xops-legal__document">
          <p className="xops-legal__eyebrow">X-Ops Conference 2026</p>
          <h1>{copy.title}</h1>
          <p className="xops-legal__lead">{copy.lead}</p>
          <section className="xops-legal__section">
            <h2>{lang === 'es' ? 'Responsable y finalidad' : 'Controller and purpose'}</h2>
            <p><strong>{ORGANIZER.name}</strong> · {lang === 'es' ? 'CIF' : 'Tax ID'} {ORGANIZER.taxId} · <a href={'mailto:' + ORGANIZER.privacyEmail}>{ORGANIZER.privacyEmail}</a>.</p>
            <p>{copy.purpose}</p>
          </section>
          <section className="xops-legal__section">
            <h2>{lang === 'es' ? 'Servicio externo' : 'External service'}</h2>
            <p>{copy.provider}</p>
            <p>
              <Link to={'/politica-de-privacidad/' + city}>{lang === 'es' ? 'Política de privacidad aplicable' : 'Applicable privacy notice'}</Link>
              {' · '}
              <Link to="/fotografia-y-video">{lang === 'es' ? 'Fotografía y vídeo' : 'Photography and filming'}</Link>
            </p>
          </section>
          <a className="btn btn-primary mt-3" href={destinations[type]} target="_blank" rel="noopener noreferrer">
            {copy.action}
          </a>
        </article>
      </div>
    </main>
  );
}
