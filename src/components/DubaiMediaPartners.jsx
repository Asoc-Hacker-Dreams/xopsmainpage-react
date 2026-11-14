import { useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { dubaiMediaPartners2026 } from '../data/dubaiMediaPartners2026';
import './DubaiMediaPartners.css';

const PartnerLogo = ({ partner }) => {
  const [failed, setFailed] = useState(false);
  const initials = partner.name.split(/\s+/).map((word) => word[0]).slice(0, 2).join('').toUpperCase();
  return (
    <div className="dubai-media-partners__logo-area">
      {partner.logo && !failed ? (
        <img src={partner.logo} alt={partner.name} loading="lazy" decoding="async" onError={() => setFailed(true)} />
      ) : (
        <span className="dubai-media-partners__wordmark" aria-label={partner.name}>{initials}</span>
      )}
    </div>
  );
};

PartnerLogo.propTypes = {
  partner: PropTypes.shape({ name: PropTypes.string.isRequired, logo: PropTypes.string }).isRequired,
};

const DubaiMediaPartners = () => {
  const { t } = useTranslation();
  return (
    <section className="dubai-media-partners" id="media-partners" aria-labelledby="dubai-media-partners-heading">
      <div className="container">
        <header className="dubai-media-partners__heading">
          <p className="city-kicker city-kicker--gold">{t('cityEvent.mediaPartners.kicker')}</p>
          <h2 id="dubai-media-partners-heading">{t('cityEvent.mediaPartners.title')}</h2>
          <p>{t('cityEvent.mediaPartners.intro')}</p>
        </header>
        <div className="dubai-media-partners__grid">
          {dubaiMediaPartners2026.map((partner) => (
            <article className="dubai-media-partners__card" key={partner.id}>
              <a
                href={partner.url}
                className="dubai-media-partners__logo-link"
                rel="noopener noreferrer"
                target="_blank"
                aria-label={t('cityEvent.mediaPartners.visitWebsite', { partner: partner.name })}
              >
                <PartnerLogo partner={partner} />
              </a>
              <div className="dubai-media-partners__body">
                <h3>{partner.name}</h3>
                <p>{t(`cityEvent.mediaPartners.partners.${partner.id}.role`)}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DubaiMediaPartners;
