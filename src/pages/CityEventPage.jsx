import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BsAward, BsBullseye, BsCalendar3, BsGeoAlt, BsGraphUp, BsPeople, BsShieldCheck, BsTrophy } from 'react-icons/bs';
import SEO from '../components/SEO';
import SpeakersSection from '../components/SpeakersSection';
import { cityEvents, cityUrl } from '../data/cityEvents';
import './CityEventPage.css';

const agendaTimes = ['09:00', '10:00', '11:00', '12:00', '13:00', '15:00', '16:00', '17:00'];

const CityEventPage = ({ city }) => {
  const { t } = useTranslation();
  const event = cityEvents[city];
  const isMadrid = city === 'madrid';
  const canonicalUrl = cityUrl(city);

  // Benefit icons are bound at render time so the rest of the content can be
  // translated via i18n keys.
  const summitBenefitKeys = ['strategic', 'networking', 'roi', 'certification', 'exclusivity'];
  const summitBenefitIcons = [BsGraphUp, BsPeople, BsTrophy, BsAward, BsShieldCheck];

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
          <p className="city-hero__statement">{t('cityEvent.hero.statement')}</p>
          <div className="city-hero__facts" aria-label={t('cityEvent.hero.facts')}>
            <span><BsCalendar3 aria-hidden="true" /> {event.dateRange}</span>
            <span><BsGeoAlt aria-hidden="true" /> {event.country}</span>
          </div>
          <nav className="city-hero__nav" aria-label={t('cityEvent.hero.navLabel', { city: event.city })}>
            <a href="#summit">{t('cityEvent.hero.navSummit')}</a>
            <a href="#conference">{t('cityEvent.hero.navConference')}</a>
            <a href="#agenda">{t('cityEvent.hero.navAgenda')}</a>
            {isMadrid && <a href="#ponentes">{t('cityEvent.hero.navSpeakers')}</a>}
          </nav>
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
          <ol className="city-agenda__timeline">
            {agendaTimes.map((time) => (
              <li key={time}><time>{time}</time><span>{t('cityEvent.summit.agendaTbd')}</span></li>
            ))}
          </ol>
        </div>
      </section>

      <section className="city-conference" id="conference" aria-labelledby="conference-title">
        <div className="container city-conference__layout">
          <div>
            <p className="city-kicker">{t('cityEvent.conference.kicker')}</p>
            <h2 id="conference-title">X-Ops Conference <strong>{event.city} 2026</strong></h2>
            <p>{t('cityEvent.conference.intro')}</p>
          </div>
          <div className="city-conference__announcement">
            <span aria-hidden="true">●</span>
            <p>{t('cityEvent.conference.agendaBadge')}</p>
            <h3>{t('cityEvent.conference.agendaTitle')}</h3>
            {event.conference.cfpUrl ? (
              <a href={event.conference.cfpUrl} target="_blank" rel="noopener noreferrer">
                {t('cityEvent.conference.proposeTalk')} <span aria-hidden="true">↗</span>
              </a>
            ) : (
              <p className="city-conference__status">{t('cityEvent.conference.cfpComingSoon', { city: event.city })}</p>
            )}
          </div>
        </div>
      </section>

      {isMadrid ? (
        <SpeakersSection />
      ) : (
        <section className="city-speakers-soon" id="ponentes" aria-labelledby="speakers-soon-title">
          <div className="container">
            <p className="city-kicker">{t('cityEvent.speakersSoon.kicker')}</p>
            <h2 id="speakers-soon-title">{t('cityEvent.speakersSoon.title', { city: event.city })}</h2>
            <p>{t('cityEvent.speakersSoon.text')}</p>
          </div>
        </section>
      )}

      <section className="city-final-cta">
        <div className="container">
          <p>{t('cityEvent.finalCta.kicker')}</p>
          <h2>{t('cityEvent.finalCta.title', { city: event.city })}</h2>
          <Link to="/">{t('cityEvent.finalCta.back')}</Link>
        </div>
      </section>
    </main>
  );
};

CityEventPage.propTypes = {
  city: PropTypes.oneOf(['madrid', 'dubai']).isRequired,
};

export default CityEventPage;
