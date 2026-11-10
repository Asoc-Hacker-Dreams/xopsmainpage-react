import { useTranslation } from 'react-i18next';
import './MadridPostponementNotice.css';

export default function MadridPostponementNotice({ expanded = false }) {
  const { t } = useTranslation();
  return (
    <section
      className={expanded ? 'madrid-postponement madrid-postponement--full' : 'madrid-postponement'}
      id="comunicado-madrid" aria-labelledby="madrid-postponement-title">
      <div className="container madrid-postponement__inner">
        <p className="madrid-postponement__eyebrow">{t('announcement.eyebrow')}</p>
        <h2 id="madrid-postponement-title">{t('announcement.title')}</h2>
        <p className="madrid-postponement__lead">{t('announcement.lead')}</p>
        <p>{t('announcement.scope')}</p>
        <p>{t('announcement.newDate')}</p>
        {expanded && <p>{t('announcement.buyers')}</p>}
        <div className="madrid-postponement__dubai">
          <strong>{t('announcement.dubaiHeading')}</strong>
          <p>{t('announcement.dubai')}</p>
        </div>
        <div className="madrid-postponement__actions">
          {!expanded && <a href="https://madrid.xopsconference.com/" className="madrid-postponement__link">{t('announcement.ctaMadrid')}</a>}
          <a href="https://dubai.xopsconference.com/" className="madrid-postponement__link madrid-postponement__link--primary">{t('announcement.ctaDubai')}</a>
        </div>
        {expanded && <p className="madrid-postponement__contact">
          {t('announcement.contact')} <a href="mailto:info@xopsconference.com">info@xopsconference.com</a>
        </p>}
      </div>
    </section>
  );
}
