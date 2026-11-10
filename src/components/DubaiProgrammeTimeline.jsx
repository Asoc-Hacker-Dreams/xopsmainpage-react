import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import './DubaiProgrammeTimeline.css';

const DubaiProgrammeTimeline = ({ sessions, variant = 'conference' }) => {
  const { t, i18n } = useTranslation();
  const language = i18n.language?.startsWith('es') ? 'es' : 'en';

  return (
    <div className={`dubai-programme dubai-programme--${variant}`}>
      <p className="dubai-programme__timezone">{t('cityEvent.dubaiProgramme.timezone')}</p>
      <p className="dubai-programme__disclaimer" role="note">{t('cityEvent.dubaiProgramme.disclaimer')}</p>
      <ol className="dubai-programme__list" aria-label={t('cityEvent.dubaiProgramme.listLabel')}>
        {sessions.map((session) => (
          <li key={`${session.start}-${session.end}`} className={`dubai-programme__item dubai-programme__item--${session.type}`}>
            <time className="dubai-programme__time" dateTime={session.start}>
              {session.start}<span aria-hidden="true">–</span>{session.end}
            </time>
            <div className="dubai-programme__details">
              <span className="dubai-programme__type">{t(`cityEvent.dubaiProgramme.types.${session.type}`)}</span>
              <h3>{session.topic[language]}</h3>
              {session.type === 'topic' || session.type === 'panel' || session.type === 'roundtable' || session.type === 'community' ? (
                <p className="dubai-programme__speaker">{t('cityEvent.dubaiProgramme.speakerPending')}</p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
};

DubaiProgrammeTimeline.propTypes = {
  sessions: PropTypes.arrayOf(PropTypes.shape({
    start: PropTypes.string.isRequired,
    end: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    topic: PropTypes.shape({ en: PropTypes.string.isRequired, es: PropTypes.string.isRequired }).isRequired,
  })).isRequired,
  variant: PropTypes.oneOf(['summit', 'conference']),
};

export default DubaiProgrammeTimeline;
