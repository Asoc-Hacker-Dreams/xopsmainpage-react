import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { BsAward, BsBullseye, BsCalendar3, BsGeoAlt, BsGraphUp, BsPeople, BsShieldCheck, BsTrophy } from 'react-icons/bs';
import SEO from '../components/SEO';
import SpeakersSection from '../components/SpeakersSection';
import { cityEvents, cityUrl } from '../data/cityEvents';
import './CityEventPage.css';

const summitBenefits = [
  { icon: BsGraphUp, title: 'Enfoque estratégico', text: 'Contenido para C-levels y directivos, orientado a impacto de negocio y decisiones aplicables.' },
  { icon: BsPeople, title: 'Networking ejecutivo', text: 'Conversaciones de alto nivel en un formato de aforo limitado que favorece conexiones relevantes.' },
  { icon: BsTrophy, title: 'ROI demostrable', text: 'Casos de adopción DevOps, SecOps y Platform Engineering con métricas y aprendizajes accionables.' },
  { icon: BsAward, title: 'Certificación', text: 'Certificado de asistencia emitido por X-Ops Conference.' },
  { icon: BsShieldCheck, title: 'Exclusividad', text: 'Una experiencia cuidada para líderes tecnológicos y responsables de transformación.' },
];

const agendaTimes = ['09:00', '10:00', '11:00', '12:00', '13:00', '15:00', '16:00', '17:00'];

const CityEventPage = ({ city }) => {
  const event = cityEvents[city];
  const isMadrid = city === 'madrid';
  const canonicalUrl = cityUrl(city);

  return (
    <main className={`city-page city-page--${city}`} id="main-content">
      <SEO
        title={`X-Ops ${event.city} 2026 · Summit + Conference`}
        description={`X-Ops ${event.city} 2026 reúne un Summit ejecutivo y una Conference técnica en una única experiencia organizada por ciudad.`}
        path="/"
        baseUrl={canonicalUrl}
        keywords={`X-Ops ${event.city}, DevOps, DevSecOps, AIOps, Platform Engineering, Summit, Conference 2026`}
        alternates={[{ hrefLang: event.locale, href: canonicalUrl }]}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Event',
          name: `X-Ops ${event.city} 2026`,
          startDate: event.startDate,
          endDate: event.endDate,
          eventStatus: 'https://schema.org/EventScheduled',
          eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
          location: {
            '@type': 'Place',
            name: event.conference.venue,
            address: { '@type': 'PostalAddress', addressLocality: event.city, addressCountry: event.country },
          },
          organizer: { '@type': 'Organization', name: 'X-Ops Conference', url: 'https://xopsconference.com' },
          url: canonicalUrl,
        }}
      />

      <section className="city-hero" aria-labelledby={`${city}-title`}>
        <div className="city-hero__grid" aria-hidden="true" />
        <div className="container city-hero__content">
          <p className="city-eyebrow"><span>{event.flag}</span> X-Ops 2026</p>
          <h1 id={`${city}-title`}>{event.city}</h1>
          <p className="city-hero__statement">Una ciudad. Dos experiencias. Un mismo ecosistema tecnológico.</p>
          <div className="city-hero__facts" aria-label="Datos del evento">
            <span><BsCalendar3 aria-hidden="true" /> {event.dateRange}</span>
            <span><BsGeoAlt aria-hidden="true" /> {event.country}</span>
          </div>
          <nav className="city-hero__nav" aria-label={`Navegación de X-Ops ${event.city}`}>
            <a href="#summit">Summit ejecutivo</a>
            <a href="#conference">Conference técnica</a>
            <a href="#agenda">Agenda</a>
            {isMadrid && <a href="#ponentes">Ponentes</a>}
          </nav>
        </div>
      </section>

      <section className="city-program" aria-labelledby="program-title">
        <div className="container">
          <div className="city-section-heading">
            <p className="city-kicker">El programa de {event.city}</p>
            <h2 id="program-title">Dos formatos diseñados para públicos distintos</h2>
            <p>Summit y Conference comparten ciudad y visión, pero conservan su propósito, audiencia y ritmo.</p>
          </div>
          <div className="city-program__tracks">
            <article className="city-track city-track--summit">
              <span className="city-track__number">01</span>
              <p className="city-track__label">Summit</p>
              <h3>Liderazgo, estrategia y transformación</h3>
              <p>Una jornada ejecutiva para CTOs, CISOs y Decision Makers que buscan conversación estratégica y networking de alto nivel.</p>
              <dl>
                <div><dt>Cuándo</dt><dd>{event.summit.dates}</dd></div>
                <div><dt>Dónde</dt><dd>{event.summit.venue}</dd></div>
              </dl>
              <a href="#summit">Explorar Summit <span aria-hidden="true">↓</span></a>
            </article>
            <article className="city-track city-track--conference">
              <span className="city-track__number">02</span>
              <p className="city-track__label">Conference</p>
              <h3>Comunidad, práctica y conocimiento técnico</h3>
              <p>Charlas y encuentros sobre DevOps, DevSecOps, AIOps, MLOps y Platform Engineering para quienes construyen tecnología.</p>
              <dl>
                <div><dt>Cuándo</dt><dd>{event.conference.dates}</dd></div>
                <div><dt>Dónde</dt><dd>{event.conference.venue}</dd></div>
              </dl>
              <a href="#conference">Explorar Conference <span aria-hidden="true">↓</span></a>
            </article>
          </div>
        </div>
      </section>

      <section className="city-summit" id="summit" aria-labelledby="summit-title">
        <div className="container">
          <div className="city-summit__intro">
            <div>
              <p className="city-kicker city-kicker--gold">Evento ejecutivo</p>
              <h2 id="summit-title">X-Ops Summit <strong>{event.city} 2026</strong></h2>
            </div>
            <p>Programa diseñado para líderes tecnológicos que buscan conectar decisiones de negocio, transformación y futuro.</p>
          </div>
          <div className="city-detail-strip">
            <span><BsCalendar3 aria-hidden="true" /> {event.summit.dates}</span>
            <span><BsGeoAlt aria-hidden="true" /> {event.summit.venue}</span>
            <span><BsBullseye aria-hidden="true" /> {event.summit.attendees}</span>
          </div>
          <div className="city-benefits">
            {summitBenefits.map(({ icon: Icon, title, text }) => (
              <article key={title}>
                <Icon aria-hidden="true" />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="city-agenda" id="agenda" aria-labelledby="agenda-title">
        <div className="container city-agenda__layout">
          <div className="city-agenda__heading">
            <p className="city-kicker city-kicker--gold">{event.summit.agendaDate}</p>
            <h2 id="agenda-title">Programa ejecutivo</h2>
            <p>Agenda en construcción. Próximamente publicaremos sesiones y ponentes.</p>
          </div>
          <ol className="city-agenda__timeline">
            {agendaTimes.map((time) => (
              <li key={time}><time>{time}</time><span>Por anunciar</span></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="city-conference" id="conference" aria-labelledby="conference-title">
        <div className="container city-conference__layout">
          <div>
            <p className="city-kicker">Conference técnica</p>
            <h2 id="conference-title">X-Ops Conference <strong>{event.city} 2026</strong></h2>
            <p>Un punto de encuentro para compartir experiencia real, patrones de arquitectura, seguridad y operación de plataformas modernas.</p>
          </div>
          <div className="city-conference__announcement">
            <span aria-hidden="true">●</span>
            <p>Agenda 2026</p>
            <h3>Ponentes y agenda próximamente</h3>
            {event.conference.cfpUrl ? (
              <a href={event.conference.cfpUrl} target="_blank" rel="noopener noreferrer">Proponer charla <span aria-hidden="true">↗</span></a>
            ) : (
              <p className="city-conference__status">El Call for Papers de Dubai se anunciará próximamente.</p>
            )}
          </div>
        </div>
      </section>

      {isMadrid ? (
        <SpeakersSection />
      ) : (
        <section className="city-speakers-soon" id="ponentes" aria-labelledby="speakers-soon-title">
          <div className="container">
            <p className="city-kicker">Voces de la edición</p>
            <h2 id="speakers-soon-title">Ponentes de Dubai</h2>
            <p>La selección de ponentes se publicará cuando finalice el proceso de programación.</p>
          </div>
        </section>
      )}

      <section className="city-final-cta">
        <div className="container">
          <p>Continúa explorando X-Ops</p>
          <h2>{event.city} es parte de un ecosistema internacional.</h2>
          <Link to="/">Volver a xopsconference.com</Link>
        </div>
      </section>
    </main>
  );
};

CityEventPage.propTypes = {
  city: PropTypes.oneOf(['madrid', 'dubai']).isRequired,
};

export default CityEventPage;
