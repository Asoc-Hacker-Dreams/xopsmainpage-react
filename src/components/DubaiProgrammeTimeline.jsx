import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { dubaiAcceptedSessions2026, dubaiSpeakers2026 } from '../data/dubaiAcceptedSessions2026';
import DubaiSpeakerPortrait from './DubaiSpeakerPortrait';
import './DubaiProgrammeTimeline.css';

const DubaiProgrammeTimeline = ({ sessions, variant = 'conference' }) => {
  const { t, i18n } = useTranslation();
  const language = i18n.language?.startsWith('es') ? 'es' : 'en';
  const isSummit = variant === 'summit';

  return (
    <div className={`dubai-programme dubai-programme--${variant}`}>
      <p className="dubai-programme__timezone">{t('cityEvent.dubaiProgramme.timezone')}</p>
      <p className="dubai-programme__disclaimer" role="note">
        {t(isSummit ? 'cityEvent.dubaiProgramme.summitDisclaimer' : 'cityEvent.dubaiProgramme.disclaimer')}
      </p>
      <ol className="dubai-programme__list" aria-label={t('cityEvent.dubaiProgramme.listLabel')}>
        {sessions.map((slot) => {
          const acceptedTalk = slot.sessionId ? dubaiAcceptedSessions2026[slot.sessionId] : null;
          const title = acceptedTalk ? acceptedTalk.title : slot.topic?.[language];
          const speakers = acceptedTalk
            ? acceptedTalk.speakers.map((id) => dubaiSpeakers2026[id]).filter(Boolean)
            : [];
          const showPanelNotice = slot.type === 'panel' || slot.type === 'roundtable';
          return (
            <li
              key={`${slot.start}-${slot.end}`}
              id={acceptedTalk ? `talk-${acceptedTalk.id}` : undefined}
              className={`dubai-programme__item dubai-programme__item--${slot.type}`}
            >
              <time className="dubai-programme__time" dateTime={slot.start}>
                {slot.start}<span aria-hidden="true">–</span>{slot.end}
              </time>
              <div className="dubai-programme__details">
                <div className="dubai-programme__topline">
                  <span className="dubai-programme__type">
                    {t(`cityEvent.dubaiProgramme.types.${slot.type}`)}
                  </span>
                  {acceptedTalk && (
                    <span className="dubai-programme__duration">
                      {t('cityEvent.dubaiProgramme.duration', { count: acceptedTalk.durationMinutes })}
                    </span>
                  )}
                </div>
                <h3>{title}</h3>
                {acceptedTalk ? (
                  <>
                    <div className="dubai-programme__people">
                      {speakers.map((person) => (
                        <div className="dubai-programme__person" key={person.id}>
                          <DubaiSpeakerPortrait speaker={person} />
                          <div className="dubai-programme__person-info">
                            <span className="dubai-programme__person-name">{person.name}</span>
                            {person.role && <span className="dubai-programme__person-role">{person.role}</span>}
                            {(person.linkedIn || person.sessionizeProfile) && (
                              <a
                                href={person.linkedIn || person.sessionizeProfile}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="dubai-programme__profile-link"
                                aria-label={t('cityEvent.dubaiProgramme.viewProfileOf', { name: person.name })}
                              >
                                {t('cityEvent.dubaiProgramme.profileLink')}
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    {acceptedTalk.language === 'Spanish' && (
                      <p className="dubai-programme__language-note">
                        {t('cityEvent.dubaiProgramme.sessionInSpanish')}
                      </p>
                    )}
                    {acceptedTalk.description && (
                      <details className="dubai-programme__abstract">
                        <summary>{t('cityEvent.dubaiProgramme.viewAbstract')}</summary>
                        <p>{acceptedTalk.description}</p>
                      </details>
                    )}
                  </>
                ) : (
                  <>
                    {slot.details?.[language] && (
                      <p className="dubai-programme__summary">{slot.details[language]}</p>
                    )}
                    {showPanelNotice && (
                      <p className="dubai-programme__speaker">
                        {t(slot.type === 'roundtable'
                          ? 'cityEvent.dubaiProgramme.facilitatorPending'
                          : 'cityEvent.dubaiProgramme.panelPending')}
                      </p>
                    )}
                    {slot.type === 'keynote' && (
                      <p className="dubai-programme__speaker">
                        {t('cityEvent.dubaiProgramme.hostPending')}
                      </p>
                    )}
                  </>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
};

DubaiProgrammeTimeline.propTypes = {
  sessions: PropTypes.arrayOf(PropTypes.shape({
    start: PropTypes.string.isRequired,
    end: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    sessionId: PropTypes.string,
    topic: PropTypes.shape({ en: PropTypes.string.isRequired, es: PropTypes.string.isRequired }),
    details: PropTypes.shape({ en: PropTypes.string.isRequired, es: PropTypes.string.isRequired }),
  })).isRequired,
  variant: PropTypes.oneOf(['summit', 'conference']),
};

export default DubaiProgrammeTimeline;
