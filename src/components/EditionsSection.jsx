import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import AnimationWrapper from './AnimationWrapper';

const useCountdown = (targetDate) => {
  const calc = () => {
    const diff = new Date(targetDate).getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days:    Math.floor(diff / 86400000),
      hours:   Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetDate]);
  return time;
};

const CountdownDisplay = ({ targetDate }) => {
  const { t } = useTranslation();
  const { days, hours, minutes, seconds } = useCountdown(targetDate);
  const units = [
    { value: days,    label: t('editions.countdown.days') },
    { value: hours,   label: t('editions.countdown.hours') },
    { value: minutes, label: t('editions.countdown.min') },
    { value: seconds, label: t('editions.countdown.sec') },
  ];
  return (
    <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-start', marginBottom: '24px' }}>
      {units.map(({ value, label }, i) => (
        <React.Fragment key={label}>
          <div style={{ textAlign: 'center', minWidth: '44px' }}>
            <div style={{
              fontSize: '1.5rem',
              fontWeight: 800,
              color: '#FFD600',
              lineHeight: 1,
              fontVariantNumeric: 'tabular-nums',
            }}>
              {String(value).padStart(2, '0')}
            </div>
            <div style={{ fontSize: '0.6rem', color: '#636e7b', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: '4px' }}>
              {label}
            </div>
          </div>
          {i < units.length - 1 && (
            <div style={{ color: '#2a2a4a', fontSize: '1.2rem', fontWeight: 700, alignSelf: 'flex-start', paddingTop: '2px' }}>·</div>
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

const Badge = ({ text }) => (
  <span style={{
    display: 'inline-block',
    background: 'rgba(255,214,0,0.1)',
    color: '#FFD600',
    fontSize: '0.68rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    padding: '3px 10px',
    borderRadius: '20px',
    marginRight: '6px',
    marginBottom: '6px',
    border: '1px solid rgba(255,214,0,0.2)',
  }}>
    {text}
  </span>
);

const VenueRow = ({ label, name, dates, venue }) => (
  <div style={{ borderLeft: '2px solid #2a2a4a', paddingLeft: '14px', marginBottom: '14px' }}>
    <p style={{ color: '#00BCD4', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '2px' }}>{label}</p>
    <p style={{ color: '#e0e0e0', fontSize: '0.85rem', fontWeight: 700, marginBottom: '2px' }}>{name}</p>
    <p style={{ color: '#636e7b', fontSize: '0.78rem', marginBottom: '2px' }}>{dates}</p>
    <p style={{ color: '#636e7b', fontSize: '0.78rem' }}>{venue}</p>
  </div>
);

const CityCard = ({ flagEmoji, dates, year, title, city, summit, conference, narrative, badges, ctaSummit, ctaSummitTo, ctaConference, ctaConferenceTo, targetDate, animDir }) => (
  <AnimationWrapper animation={`fade-${animDir}`} duration={1200}>
    <div style={{
      background: '#16213e',
      borderRadius: '14px',
      padding: '36px',
      border: '1px solid #2a2a4a',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Flag + Dates header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
        <span style={{ fontSize: '2.4rem', lineHeight: 1 }}>{flagEmoji}</span>
        <div>
          <div style={{ color: '#ffffff', fontSize: '1.4rem', fontWeight: 800, letterSpacing: '0.08em' }}>
            {dates}
          </div>
          <div style={{ color: '#636e7b', fontSize: '0.78rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>{year}</div>
        </div>
      </div>

      {/* Title + City */}
      <h3 style={{ color: '#ffffff', fontWeight: 800, fontSize: '1.25rem', marginBottom: '4px' }}>{title}</h3>
      <p style={{ color: '#8892a0', fontSize: '0.85rem', marginBottom: '20px' }}>{city}</p>

      {/* Venues */}
      <div style={{ marginBottom: '20px' }}>
        <VenueRow
          label={summit.label}
          name={summit.name}
          dates={summit.dates}
          venue={summit.venue}
        />
        <VenueRow
          label={conference.label}
          name={conference.name}
          dates={conference.dates}
          venue={conference.venue}
        />
      </div>

      {/* Narrative */}
      <p style={{ color: '#8892a0', fontSize: '0.875rem', lineHeight: 1.7, marginBottom: '24px', flex: 1 }}>
        {narrative}
      </p>

      {/* Countdown */}
      <CountdownDisplay targetDate={targetDate} />

      {/* Badges */}
      <div style={{ marginBottom: '24px' }}>
        {badges.map((b) => <Badge key={b} text={b} />)}
      </div>

      {/* CTAs */}
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <Link
          to={ctaSummitTo}
          style={{
            background: '#FFD600',
            color: '#0A0F2E',
            fontWeight: 700,
            fontSize: '0.8rem',
            padding: '10px 18px',
            borderRadius: '8px',
            textDecoration: 'none',
            letterSpacing: '0.04em',
          }}
        >
          {ctaSummit}
        </Link>
        <Link
          to={ctaConferenceTo}
          style={{
            background: 'transparent',
            color: '#FFD600',
            fontWeight: 700,
            fontSize: '0.8rem',
            padding: '10px 18px',
            borderRadius: '8px',
            textDecoration: 'none',
            border: '1px solid rgba(255,214,0,0.35)',
            letterSpacing: '0.04em',
          }}
        >
          {ctaConference}
        </Link>
      </div>
    </div>
  </AnimationWrapper>
);

const EditionsSection = () => {
  const { t } = useTranslation();

  return (
    <section id="ediciones" style={{ background: '#0f0f1a', padding: '80px 0 60px' }}>
      <div className="container">
        <AnimationWrapper animation="fade-up" duration={1000}>
          <div className="text-center mb-5">
            <span style={{ color: '#00BCD4', fontSize: '0.72rem', fontWeight: 700, letterSpacing: '0.24em', textTransform: 'uppercase' }}>
              {t('editions.sectionPrefix')}
            </span>
            <h2 style={{ color: '#ffffff', fontWeight: 800, marginTop: '12px', marginBottom: '16px', fontSize: '2rem' }}>
              {t('editions.title')}
            </h2>
            <p style={{ color: '#8892a0', maxWidth: '540px', margin: '0 auto', fontSize: '0.95rem', lineHeight: 1.7 }}>
              {t('editions.subtitle')}
            </p>
          </div>
        </AnimationWrapper>

        <div className="row justify-content-center g-4">
          {/* Madrid */}
          <div className="col-lg-5 col-md-6">
            <CityCard
              flagEmoji={t('editions.madrid.flag')}
              dates={t('editions.madrid.dates')}
              year={t('editions.madrid.year')}
              title={t('editions.madrid.title')}
              city={t('editions.madrid.city')}
              summit={{
                label: t('editions.madrid.summit.label'),
                name:  t('editions.madrid.summit.venue'),
                dates: t('editions.madrid.summit.dates'),
                venue: '',
              }}
              conference={{
                label: t('editions.madrid.conference.label'),
                name:  t('editions.madrid.conference.venue'),
                dates: t('editions.madrid.conference.dates'),
                venue: '',
              }}
              narrative={t('editions.madrid.narrative')}
              badges={[
                t('editions.madrid.badges.format'),
                t('editions.madrid.badges.edition'),
                t('editions.madrid.badges.attendees'),
              ]}
              ctaSummit={t('editions.madrid.cta.summit')}
              ctaSummitTo="/summit"
              ctaConference={t('editions.madrid.cta.conference')}
              ctaConferenceTo="/#events"
              targetDate="2026-11-19T09:00:00"
              animDir="right"
            />
          </div>

          {/* Dubai */}
          <div className="col-lg-5 col-md-6">
            <CityCard
              flagEmoji={t('editions.dubai.flag')}
              dates={t('editions.dubai.dates')}
              year={t('editions.dubai.year')}
              title={t('editions.dubai.title')}
              city={t('editions.dubai.city')}
              summit={{
                label: t('editions.dubai.summit.label'),
                name:  t('editions.dubai.summit.venue'),
                dates: t('editions.dubai.summit.dates'),
                venue: '',
              }}
              conference={{
                label: t('editions.dubai.conference.label'),
                name:  t('editions.dubai.conference.venue'),
                dates: t('editions.dubai.conference.dates'),
                venue: '',
              }}
              narrative={t('editions.dubai.narrative')}
              badges={[
                t('editions.dubai.badges.format'),
                t('editions.dubai.badges.edition'),
                t('editions.dubai.badges.region'),
              ]}
              ctaSummit={t('editions.dubai.cta.summit')}
              ctaSummitTo="/events/x-ops-conference-dubai-2026#summit-dubai"
              ctaConference={t('editions.dubai.cta.conference')}
              ctaConferenceTo="/events/x-ops-conference-dubai-2026#conference-dubai"
              targetDate="2026-10-15T09:00:00"
              animDir="left"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditionsSection;
