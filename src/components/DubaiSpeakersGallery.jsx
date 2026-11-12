import { useTranslation } from 'react-i18next';
import { dubaiProgramme2026 } from '../data/dubaiProgramme2026';
import { dubaiAcceptedSessions2026, dubaiSpeakers2026 } from '../data/dubaiAcceptedSessions2026';
import DubaiSpeakerPortrait from './DubaiSpeakerPortrait';
import './DubaiSpeakersGallery.css';

const speakersByDay = (slots) => {
  const distinct = new Map();
  slots.forEach((slot) => {
    const session = slot.sessionId ? dubaiAcceptedSessions2026[slot.sessionId] : null;
    if (!session) return;
    session.speakers.forEach((id) => {
      const person = dubaiSpeakers2026[id];
      if (person && !distinct.has(id)) distinct.set(id, { person, session });
    });
  });
  return [...distinct.values()];
};

const DubaiSpeakersGallery = () => {
  const { t } = useTranslation();
  const groups = [
    { key: 'summit', people: speakersByDay(dubaiProgramme2026.summit.items), date: '30 Nov' },
    { key: 'conference', people: speakersByDay(dubaiProgramme2026.conference.items), date: '1 Dec' },
  ];

  return (
    <section className="dubai-speakers" id="ponentes" aria-labelledby="dubai-speakers-heading">
      <div className="container">
        <div className="dubai-speakers__heading">
          <p className="city-kicker">{t('cityEvent.dubaiSpeakers.kicker')}</p>
          <h2 id="dubai-speakers-heading">{t('cityEvent.dubaiSpeakers.title')}</h2>
          <p>{t('cityEvent.dubaiSpeakers.intro')}</p>
        </div>
        {groups.map(({ key, people, date }) => (
          <div className={`dubai-speakers__group dubai-speakers__group--${key}`} key={key}>
            <div className="dubai-speakers__group-heading">
              <h3>{t(`cityEvent.dubaiSpeakers.${key}`)}</h3>
              <span>{date} 2026 · {t('cityEvent.dubaiSpeakers.speakerCount', { count: people.length })}</span>
            </div>
            <div className="dubai-speakers__grid">
              {people.map(({ person, session }) => (
                <article key={person.id} className="dubai-speakers__card">
                  <DubaiSpeakerPortrait speaker={person} large />
                  <div className="dubai-speakers__card-details">
                    <h4>{person.name}</h4>
                    {person.role && <p className="dubai-speakers__role">{person.role}</p>}
                    <p className="dubai-speakers__talk">{session.title}</p>
                    <div className="dubai-speakers__links">
                      <a href={`#talk-${session.id}`}>{t('cityEvent.dubaiSpeakers.viewTalk')}</a>
                      {(person.linkedIn || person.sessionizeProfile) && (
                        <a href={person.linkedIn || person.sessionizeProfile} target="_blank" rel="noopener noreferrer">
                          {t('cityEvent.dubaiProgramme.profileLink')}
                          <span aria-hidden="true"> ↗</span>
                        </a>
                      )}
                    </div>
                    {person.bio && (
                      <details className="dubai-speakers__bio">
                        <summary>{t('cityEvent.dubaiSpeakers.viewBio')}</summary>
                        <p>{person.bio}</p>
                      </details>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DubaiSpeakersGallery;
