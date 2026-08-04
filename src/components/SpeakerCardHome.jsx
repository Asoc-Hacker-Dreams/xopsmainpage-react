import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { BsLinkedin, BsTwitterX } from 'react-icons/bs';
import AnimationWrapper from './AnimationWrapper';

/**
 * Single speaker card used by SpeakersSection (home / Madrid speakers grid).
 *
 * NOT to be confused with `src/components/SpeakerCard.tsx`, which is a
 * different component (a modal used from the Agenda page, backed by the
 * `Speaker`/`Talk` DAL types). This component is purely presentational and
 * driven by the plain-object speaker shape defined in SpeakersSection.jsx.
 *
 * Social links (`linkedin` / `twitter`) are optional and only rendered when
 * present. None of the current speakers have real URLs yet — this is a
 * known pending item: populate `speaker.linkedin` / `speaker.twitter` with
 * real profile URLs as they become available.
 */
const BIO_PREVIEW_LENGTH = 220;

const SpeakerCardHome = ({ speaker, index }) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const bio = speaker.bio || '';
  const isLongBio = bio.length > BIO_PREVIEW_LENGTH;
  const speakerNumber = String(index + 1).padStart(2, '0');

  return (
    <div className="speaker1 d-flex justify-around margin-top">
      <div className="speaker-img">
        <AnimationWrapper animation="fade-left" duration={1500}>
          <span className="speaker-number-badge">
            {t('speakers.speakerLabel', { number: speakerNumber })}
          </span>
          <img
            src={speaker.img}
            alt={speaker.name}
            style={{ height: '360px', width: '320px', objectFit: 'cover' }}
          />
        </AnimationWrapper>
      </div>
      <div className="speaker-content">
        <AnimationWrapper animation="fade-right" duration={1500}>
          <h3>{speaker.name}</h3>
          {speaker.role && (
            <p>
              {speaker.role}
              {speaker.roleLogo && (
                <img
                  src={speaker.roleLogo}
                  alt={speaker.roleLogoAlt || ''}
                  style={{ height: '20px', marginLeft: '8px', verticalAlign: 'middle' }}
                />
              )}
            </p>
          )}
          {speaker.roleSecondary && <p>{speaker.roleSecondary}</p>}

          <p className={`speaker-bio ${!expanded && isLongBio ? 'speaker-bio-clamped' : ''}`}>
            {expanded || !isLongBio ? bio : `${bio.slice(0, BIO_PREVIEW_LENGTH).trimEnd()}…`}
          </p>
          {isLongBio && (
            <button
              type="button"
              className="speaker-bio-toggle"
              onClick={() => setExpanded((prev) => !prev)}
              aria-expanded={expanded}
            >
              {expanded ? t('speakers.readLess') : t('speakers.readMore')}
            </button>
          )}

          {speaker.talk && (
            <p>
              <strong>{t('speakers.talk')}: {speaker.talk}</strong>
            </p>
          )}
          {speaker.keynote && (
            <p>
              <strong>{speaker.keynote}</strong>
            </p>
          )}

          {(speaker.linkedin || speaker.twitter) && (
            <div className="speaker-social">
              {speaker.linkedin && (
                <a
                  href={speaker.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${speaker.name} on LinkedIn`}
                >
                  <BsLinkedin />
                </a>
              )}
              {speaker.twitter && (
                <a
                  href={speaker.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${speaker.name} on X (Twitter)`}
                >
                  <BsTwitterX />
                </a>
              )}
            </div>
          )}
        </AnimationWrapper>
      </div>
    </div>
  );
};

SpeakerCardHome.propTypes = {
  speaker: PropTypes.shape({
    name: PropTypes.string.isRequired,
    role: PropTypes.string,
    roleLogo: PropTypes.string,
    roleLogoAlt: PropTypes.string,
    roleSecondary: PropTypes.string,
    bio: PropTypes.string,
    img: PropTypes.string.isRequired,
    talk: PropTypes.string,
    keynote: PropTypes.string,
    linkedin: PropTypes.string,
    twitter: PropTypes.string,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

export default SpeakerCardHome;
