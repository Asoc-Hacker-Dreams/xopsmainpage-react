import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';
import { useConsent } from '../../contexts/ConsentContext';
import { takeCheckoutDeparture } from '../../analytics/checkoutJourney';
import { trackCheckoutCancel } from '../../analytics/ga4';
import { Link } from 'react-router-dom';
import './CheckoutCancel.css';

function CheckoutCancel() {
  const { t } = useTranslation();
  const { consent, hasInteracted } = useConsent();

  useEffect(() => {
    // Clear marker on any return. Only fire if there was a genuine checkout
    // departure AND analytics consent remains active.
    const attempt = takeCheckoutDeparture();
    if (attempt && hasInteracted && consent.analytics === true) {
      trackCheckoutCancel(attempt.edition);
    }
  }, [hasInteracted, consent.analytics]);

  return (
    <div className="checkout-cancel">
      <div className="checkout-cancel-content">
        <span className="checkout-cancel-icon">✕</span>
        <h1>{t('tickets.cancel.title')}</h1>
        <p>{t('tickets.cancel.message')}</p>
        <div className="checkout-cancel-ctas">
          <Link to="/?openTickets=1" className="checkout-btn-primary">
            {t('tickets.cancel.tryAgain')}
          </Link>
          <a href="mailto:info@xopsconference.com" className="checkout-btn-secondary">
            {t('tickets.cancel.contactSupport')}
          </a>
        </div>
      </div>
    </div>
  );
}

export default CheckoutCancel;