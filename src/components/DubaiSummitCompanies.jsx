import { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { dubaiSummitSpeakerCompanies2026 } from '../data/dubaiSummitSpeakerCompanies2026';
import { dubaiSpeakers2026 } from '../data/dubaiAcceptedSessions2026';
import './DubaiSummitCompanies.css';

const CompanyLogo = ({ company }) => {
  const [failed, setFailed] = useState(false);
  const initials = company.name.split(/\s+/).map((word) => word[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div className="dubai-summit-companies__logo-area">
      {company.logo && !failed ? (
        <img src={company.logo} alt={company.name} loading="lazy" decoding="async" referrerPolicy="no-referrer" onError={() => setFailed(true)} />
      ) : (
        <span className="dubai-summit-companies__wordmark" aria-label={company.name}>
          {company.name.length > 17 ? initials : company.name}
        </span>
      )}
    </div>
  );
};

CompanyLogo.propTypes = {
  company: PropTypes.shape({ name: PropTypes.string.isRequired, logo: PropTypes.string }).isRequired,
};

const DubaiSummitCompanies = () => {
  const { t } = useTranslation();
  return (
    <section className="dubai-summit-companies" id="empresas-summit" aria-labelledby="dubai-summit-companies-heading">
      <div className="container">
        <header className="dubai-summit-companies__heading">
          <p className="city-kicker city-kicker--gold">{t('cityEvent.summitCompanies.kicker')}</p>
          <h2 id="dubai-summit-companies-heading">{t('cityEvent.summitCompanies.title')}</h2>
          <p>{t('cityEvent.summitCompanies.intro')}</p>
        </header>
        <div className="dubai-summit-companies__grid">
          {dubaiSummitSpeakerCompanies2026.map((company) => {
            const speakers = company.speakers.map((id) => dubaiSpeakers2026[id]?.name).filter(Boolean);
            return (
              <article className="dubai-summit-companies__card" key={company.id}>
                {company.url ? (
                  <a href={company.url} className="dubai-summit-companies__logo-link" rel="noopener noreferrer" target="_blank" aria-label={t('cityEvent.summitCompanies.visitWebsite', { company: company.name })}>
                    <CompanyLogo company={company} />
                  </a>
                ) : <CompanyLogo company={company} />}
                <div className="dubai-summit-companies__body">
                  <h3>{company.name}</h3>
                  <p>{t('cityEvent.summitCompanies.representedBy', { names: speakers.join(', ') })}</p>
                  {company.url ? (
                    <a className="dubai-summit-companies__website" href={company.url} target="_blank" rel="noopener noreferrer">
                      {t('cityEvent.summitCompanies.website')} <span aria-hidden="true">↗</span>
                    </a>
                  ) : (
                    <span className="dubai-summit-companies__pending">{t('cityEvent.summitCompanies.websitePending')}</span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
        <p className="dubai-summit-companies__disclaimer">{t('cityEvent.summitCompanies.disclaimer')}</p>
      </div>
    </section>
  );
};

export default DubaiSummitCompanies;
