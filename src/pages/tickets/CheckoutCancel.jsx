import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './CheckoutCancel.css';

function CheckoutCancel() {
  const { t } = useTranslation();

  return (
    <div className="checkout-cancel">
      <div className="checkout-cancel-content">
        <span className="checkout-cancel-icon">✕</span>
        <h1>{t('tickets.cancel.title')}</h1>
        <p>{t('tickets.cancel.message')}</p>
        <div className="checkout-cancel-ctas">
          <Link to="/events/x-ops-conference-dubai-2026/buy" className="checkout-btn-primary">
            {t('tickets.cancel.tryAgain')}
          </Link>
          <a href="mailto:support@xopsconference.com" className="checkout-btn-secondary">
            {t('tickets.cancel.contactSupport')}
          </a>
        </div>
      </div>
    </div>
  );
}

export default CheckoutCancel;