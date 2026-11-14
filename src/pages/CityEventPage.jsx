import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BsAward, BsBullseye, BsCalendar3, BsGeoAlt, BsGraphUp, BsPeople, BsShieldCheck, BsTrophy } from 'react-icons/bs';
import SEO from '../components/SEO';
import MadridPostponementNotice from '../components/MadridPostponementNotice';
import DubaiProgrammeTimeline from '../components/DubaiProgrammeTimeline';
import DubaiSpeakersGallery from '../components/DubaiSpeakersGallery';
import DubaiSummitCompanies from '../components/DubaiSummitCompanies';
import DubaiMediaPartners from '../components/DubaiMediaPartners';
import { dubaiProgramme2026 } from '../data/dubaiProgramme2026';
import { dubaiAcceptedSessions2026, dubaiSpeakers2026 } from '../data/dubaiAcceptedSessions2026';
import { cityEvents, cityUrl } from '../data/cityEvents';
import { ORGANIZER } from '../legal/identity';
import './CityEventPage.css';

const CityEventPage = ({ city }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const event = cityEvents[city];
  const isMadrid = city === 'madrid';
  const canonicalUrl = cityUrl(city);
  const summitTalkCount = dubaiProgramme2026.summit.items.filter((slot) => slot.sessionId).length;
  const conferenceTalkCount = dubaiProgramme2026.conference.items.filter((slot) => slot.sessionId).length;
  const fullLineupSize = Object.keys(dubaiSpeakers2026).length;
  const eventTracks = [
    { key: 'summit', name: 'X-Ops Executive Summit Dubai 2026', date: '2026-11-30', end: '18:30', anchor: '#agenda' },
    { key: 'conference', name: 'X-Ops Technical Conference Dubai 2026', date: '2026-12-01', end: '17:50', anchor: '#conference-schedule' },
  ];
  // Deep links to individual sessions and speakers must work on initial SPA load.
  useEffect(() => {
    if (isMadrid || !location.hash) return undefined;
    const id = decodeURIComponent(location.hash.slice(1));
    const frame = window.requestAnimationFrame(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'instant', block: 'start' });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [isMadrid, location.hash]);

  // Benefit icons are bound at render time so the rest of the content can be
  // translated via i18n keys.
  const summitBenefitKeys = ['strategic', 'networking', 'roi', 'certification', 'exclusivity'];
  const summitBenefitIcons = [BsGraphUp, BsPeople, BsTrophy, BsAward, BsShieldCheck];

  // Madrid is postponed; never present its former programme or venues as current.
  if (isMadrid) {
    return (
      <main className="city-page city-page--madrid" id="main-content">
        <SEO
          title="X-Ops Madrid 2026 aplazado · Comunicado oficial"
          description="La edición de Madrid del 19 al 21 de noviembre de 2026 se aplaza. X-Ops Dubai 2026 sigue adelante. Nueva fecha de Madrid por confirmar."
          path="/"
          baseUrl={canonicalUrl}
          lang="es"
          structuredData={{
            '@context': 'https://schema.org',
            '@type': 'Event',
            name: 'X-Ops Madrid 2026',
            startDate: event.startDate,
            endDate: event.endDate,
            eventStatus: 'https://schema.org/EventPostponed',
            organizer: { '@type': 'Organization', name: ORGANIZER.name, url: 'https://xopsconference.com' },
            url: canonicalUrl,
          }}
        />
        <MadridPostponementNotice expanded />
      </main>
    );
  }

  return (
    <main className={`city-page city-page--${city}`} id="main-content">
      <SEO
        title={`X-Ops Dubai 2026 · 30 Nov Summit + 1 Dec Conference · ${summitTalkCount + conferenceTalkCount} talks`}
        description={`X-Ops Dubai 2026: Executive Summit 30 November, Technical Conference 1 December. ${summitTalkCount + conferenceTalkCount} accepted talks, ${fullLineupSize} speakers, AI, DevSecOps, platforms and networking.`}
        path="/"
        baseUrl={canonicalUrl}
        keywords={`X-Ops ${event.city}, DevOps, DevSecOps, AIOps, Platform Engineering, Summit, Conference 2026`}
        alternates={[{ hrefLang: event.locale, href: canonicalUrl }]}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Event',
          name: 'X-Ops Dubai 2026 — Executive Summit + Technical Conference',
          description: '30 Nov Executive Summit and 1 Dec Technical Conference: 19 accepted talks, AI, DevSecOps, cloud, data platforms and engineering.',
          startDate: '2026-11-30T09:00:00+04:00',
          endDate: '2026-12-01T17:50:00+04:00',
          eventStatus: 'https://schema.org/EventScheduled',
          eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
          location: {
            '@type': 'Place',
            name: 'Dubai, United Arab Emirates',
            address: { '@type': 'PostalAddress', addressLocality: 'Dubai', addressCountry: 'AE' },
          },
          organizer: { '@type': 'Organization', name: ORGANIZER.name, url: 'https://xopsconference.com' },
          url: canonicalUrl,
          subEvent: eventTracks.map((track) => {
            const accepted = dubaiProgramme2026[track.key].items
              .filter((slot) => slot.sessionId)
              .map((slot) => dubaiAcceptedSessions2026[slot.sessionId]);
            const speakers = [...new Set(accepted.flatMap((session) => session.speakers))]
              .map((id) => dubaiSpeakers2026[id]).filter(Boolean);
            return {
              '@type': 'Event',
              name: track.name,
              startDate: `${track.date}T09:00:00+04:00`,
              endDate: `${track.date}T${track.end}:00+04:00`,
              eventStatus: 'https://schema.org/EventScheduled',
              eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
              url: `${canonicalUrl}${track.anchor}`,
              location: {
                '@type': 'Place',
                name: 'Dubai, United Arab Emirates',
                address: { '@type': 'PostalAddress', addressLocality: 'Dubai', addressCountry: 'AE' },
              },
              performer: speakers.map((speaker) => ({
                '@type': 'Person',
                name: speaker.name,
                image: speaker.photo,
                ...(speaker.linkedIn ? { sameAs: speaker.linkedIn } : {}),
              })),
            };
          }),
        }}
      />

      <section className="city-hero" aria-labelledby={`${city}-title`}>
        <div className="city-hero__grid" aria-hidden="true" />
        <div className="container city-hero__content">
          <p className="city-eyebrow"><span>{event.flag}</span> X-Ops 2026</p>
          <h1 id={`${city}-title`}>{event.city}</h1>
          <p className="city-hero__statement">{t('cityEvent.hero.statement')}</p>
          <div className="city-hero__facts" aria-label={t('cityEvent.hero.facts')}>
            <span><BsCalendar3 aria-hidden="true" /> {event.dateRange}</span>
            <span><BsGeoAlt aria-hidden="true" /> {event.country}</span>
          </div>
          <nav className="city-hero__nav" aria-label={t('cityEvent.hero.navLabel', { city: event.city })}>
            <a href="#summit">{t('cityEvent.hero.navSummit')}</a>
            <a href="#conference">{t('cityEvent.hero.navConference')}</a>
            <a href="#conference-schedule">{t('cityEvent.hero.navAgenda')}</a>
            <a href="#ponentes">{t('cityEvent.hero.navSpeakers')}</a>
            <a href="#empresas-summit">{t('cityEvent.summitCompanies.navLabel')}</a>
          </nav>
          <div className="city-hero__lineup" aria-label={t('cityEvent.experience.lineupSummary')}>
            <div className="city-hero__lineup-stat">
              <strong>{summitTalkCount + conferenceTalkCount}</strong>
              <span>{t('cityEvent.experience.acceptedTalks')}</span>
            </div>
            <div className="city-hero__lineup-stat">
              <strong>{fullLineupSize}</strong>
              <span>{t('cityEvent.experience.speakers')}</span>
            </div>
            <div className="city-hero__lineup-stat">
              <strong>02</strong>
              <span>{t('cityEvent.experience.days')}</span>
            </div>
          </div>
          <div className="city-hero__experience-grid">
            <article className="city-hero__experience city-hero__experience--summit">
              <span className="city-hero__experience-date">30 NOV · MON</span>
              <p className="city-hero__experience-label">{t('cityEvent.experience.summitLabel')}</p>
              <h2>{t('cityEvent.experience.summitTitle')}</h2>
              <p>{t('cityEvent.experience.summitDescription')}</p>
              <a href="#agenda">{t('cityEvent.experience.viewSummit')} <span aria-hidden="true">↘</span></a>
            </article>
            <article className="city-hero__experience city-hero__experience--conference">
              <span className="city-hero__experience-date">01 DEC · TUE</span>
              <p className="city-hero__experience-label">{t('cityEvent.experience.conferenceLabel')}</p>
              <h2>{t('cityEvent.experience.conferenceTitle')}</h2>
              <p>{t('cityEvent.experience.conferenceDescription')}</p>
              <a href="#conference-schedule">{t('cityEvent.experience.viewConference')} <span aria-hidden="true">↘</span></a>
            </article>
          </div>
          <div className="city-hero__ticket-row">
            <Link className="city-hero__ticket-link" to="/dubai?openTickets=1">
              {t('cityEvent.experience.getTickets')} <span aria-hidden="true">↗</span>
            </Link>
            <span>{t('cityEvent.experience.venuePending')}</span>
          </div>
        </div>
      </section>

      <section className="city-program" aria-labelledby="program-title">
        <div className="container">
          <div className="city-section-heading">
            <p className="city-kicker">{t('cityEvent.program.kicker', { city: event.city })}</p>
            <h2 id="program-title">{t('cityEvent.program.title')}</h2>
            <p>{t('cityEvent.program.subtitle')}</p>
          </div>
          <div className="city-program__tracks">
            <article className="city-track city-track--summit">
              <span className="city-track__number">01</span>
              <p className="city-track__label">Summit</p>
              <h3>{t('cityEvent.program.summit.h3')}</h3>
              <p>{t('cityEvent.program.summit.text')}</p>
              <dl>
                <div><dt>{t('cityEvent.when')}</dt><dd>{event.summit.dates}</dd></div>
                <div><dt>{t('cityEvent.where')}</dt><dd>{event.summit.venue}</dd></div>
              </dl>
              <a href="#summit">{t('cityEvent.program.summit.cta')} <span aria-hidden="true">↓</span></a>
            </article>
            <article className="city-track city-track--conference">
              <span className="city-track__number">02</span>
              <p className="city-track__label">Conference</p>
              <h3>{t('cityEvent.program.conference.h3')}</h3>
              <p>{t('cityEvent.program.conference.text')}</p>
              <dl>
                <div><dt>{t('cityEvent.when')}</dt><dd>{event.conference.dates}</dd></div>
                <div><dt>{t('cityEvent.where')}</dt><dd>{event.conference.venue}</dd></div>
              </dl>
              <a href="#conference">{t('cityEvent.program.conference.cta')} <span aria-hidden="true">↓</span></a>
            </article>
          </div>
        </div>
      </section>

      <section className="city-summit" id="summit" aria-labelledby="summit-title">
        <div className="container">
          <div className="city-summit__intro">
            <div>
              <p className="city-kicker city-kicker--gold">{t('cityEvent.summit.kicker')}</p>
              <h2 id="summit-title">X-Ops Summit <strong>{event.city} 2026</strong></h2>
            </div>
            <p>{t('cityEvent.summit.subtitle')}</p>
          </div>
          <div className="city-detail-strip">
            <span><BsCalendar3 aria-hidden="true" /> {event.summit.dates}</span>
            <span><BsGeoAlt aria-hidden="true" /> {event.summit.venue}</span>
            <span><BsBullseye aria-hidden="true" /> {event.summit.attendees}</span>
          </div>
          <div className="city-benefits">
            {summitBenefitKeys.map((key, idx) => {
              const Icon = summitBenefitIcons[idx];
              return (
                <article key={key}>
                  <Icon aria-hidden="true" />
                  <h3>{t(`cityEvent.summit.benefits.${key}.title`)}</h3>
                  <p>{t(`cityEvent.summit.benefits.${key}.text`)}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="city-agenda" id="agenda" aria-labelledby="agenda-title">
        <div className="container city-agenda__layout">
          <div className="city-agenda__heading">
            <p className="city-kicker city-kicker--gold">{event.summit.agendaDate}</p>
            <h2 id="agenda-title">{t('cityEvent.summit.agendaTitle')}</h2>
            <p>{t('cityEvent.summit.agendaSubtitle')}</p>
          </div>
          <DubaiProgrammeTimeline sessions={dubaiProgramme2026.summit.items} variant="summit" />
        </div>
      </section>

      <DubaiSummitCompanies />

      <section className="city-conference" id="conference" aria-labelledby="conference-title">
        <div className="container city-conference__layout">
          <div>
            <p className="city-kicker">{t('cityEvent.conference.kicker')}</p>
            <h2 id="conference-title">X-Ops Conference <strong>{event.city} 2026</strong></h2>
            <p>{t('cityEvent.conference.intro')}</p>
          </div>
          <div className="city-conference__announcement city-conference__announcement--published">
            <span aria-hidden="true">●</span>
            <p>{t('cityEvent.conference.agendaBadge')}</p>
            <h3>{t('cityEvent.dubaiProgramme.conferenceTitle')}</h3>
            <p className="city-conference__status">{t('cityEvent.dubaiProgramme.conferenceIntro')}</p>
            <a href="#conference-schedule">
              {t('cityEvent.conference.viewAgenda')} <span aria-hidden="true">↓</span>
            </a>
          </div>
          <div id="conference-schedule" className="city-conference__schedule">
            <DubaiProgrammeTimeline sessions={dubaiProgramme2026.conference.items} variant="conference" />
          </div>
        </div>
      <p className="small mt-4"><Link to="/politica-de-privacidad">{t('legalLinks.privacy', { defaultValue: 'Privacy notice / Privacidad' })}</Link> · <Link to="/fotografia-y-video">{t('legalLinks.media', { defaultValue: 'Recording & image rights / Fotografía y vídeo' })}</Link></p>
      </section>

      <section className="city-connections" id="connections" aria-labelledby="connections-heading">
        <div className="container">
          <p className="city-kicker city-kicker--gold">{t('cityEvent.experience.connectionsKicker')}</p>
          <div className="city-connections__intro">
            <h2 id="connections-heading">{t('cityEvent.experience.connectionsTitle')}</h2>
            <p>{t('cityEvent.experience.connectionsIntro')}</p>
          </div>
          <div className="city-connections__grid">
            {['learn', 'discuss', 'connect'].map((key, idx) => (
              <article key={key}>
                <span className="city-connections__number">0{idx + 1}</span>
                <h3>{t(`cityEvent.experience.connections.${key}.title`)}</h3>
                <p>{t(`cityEvent.experience.connections.${key}.text`)}</p>
              </article>
            ))}
          </div>
          <p className="city-connections__notice">{t('cityEvent.experience.connectionsNotice')}</p>
          <Link className="city-connections__cta" to="/dubai?openTickets=1">
            {t('cityEvent.experience.getTickets')} <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </section>

      <DubaiSpeakersGallery />

      {city === 'dubai' && <DubaiMediaPartners />}

      <section className="city-final-cta">
        <div className="container">
          <p>{t('cityEvent.finalCta.kicker')}</p>
          <h2>{t('cityEvent.finalCta.title', { city: event.city })}</h2>
          <div className="city-final-cta__actions">
            <Link to="/dubai?openTickets=1" className="city-final-cta__primary">{t('cityEvent.experience.getTickets')}</Link>
            <a href="#agenda" className="city-final-cta__secondary">{t('cityEvent.experience.viewSummit')}</a>
            <a href="#conference-schedule" className="city-final-cta__secondary">{t('cityEvent.experience.viewConference')}</a>
          </div>
        </div>
      </section>
    </main>
  );
};

CityEventPage.propTypes = {
  city: PropTypes.oneOf(['madrid', 'dubai']).isRequired,
};

export default CityEventPage;
