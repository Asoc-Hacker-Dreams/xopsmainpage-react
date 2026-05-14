import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { triskelGateClient } from '../../adapters/triskelgate/client';
import './CheckoutSuccess.css';

function CheckoutSuccess() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('processing'); // processing, confirmed, error

  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    if (!sessionId) {
      setStatus('error');
      return;
    }
    // Poll backend for payment confirmation
    const pollInterval = setInterval(async () => {
      try {
        const data = await triskelGateClient.getCheckoutSessionStatus(sessionId);
        if (data.status === 'paid') {
          setStatus('confirmed');
          clearInterval(pollInterval);
        }
      } catch (e) {
        // Keep polling
      }
    }, 2000);
    // Stop after 60 seconds
    setTimeout(() => clearInterval(pollInterval), 60000);
    return () => clearInterval(pollInterval);
  }, [searchParams]);

  return (
    <div className="checkout-success">
      <div className="checkout-success-content">
        {status === 'processing' && (
          <>
            <div className="checkout-spinner" />
            <h1>{t('tickets.success.processing')}</h1>
          </>
        )}
        {status === 'confirmed' && (
          <>
            <span className="checkout-success-icon">✓</span>
            <h1>{t('tickets.success.title')}</h1>
            <div className="checkout-summary">
              <h3>{t('tickets.success.summary')}</h3>
              <p><strong>X-Ops Conference Dubai 2026</strong></p>
              <p>General Admission · €299</p>
            </div>
            <p className="checkout-ticket-info">{t('tickets.success.ticketSent')}</p>
            <div className="checkout-ctas">
              <Link to="/" className="checkout-btn-primary">
                {t('tickets.success.backHome')}
              </Link>
              <Link to="/sophia" className="checkout-btn-secondary">
                {t('tickets.success.learnSophia')}
              </Link>
            </div>
          </>
        )}
        {status === 'error' && (
          <>
            <span className="checkout-success-icon">⚠</span>
            <h1>Error processing your purchase</h1>
            <Link to="/" className="checkout-btn-primary">Return to home</Link>
          </>
        )}
      </div>
    </div>
  );
}

export default CheckoutSuccess;