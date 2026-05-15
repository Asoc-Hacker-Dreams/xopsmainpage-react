import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './WalletLogin.css';

function WalletLogin() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const handleMagicLink = async (e) => {
    e.preventDefault();
    // Simulate sending magic link
    await new Promise(resolve => setTimeout(resolve, 1000));
    setMagicLinkSent(true);
  };

  return (
    <div className="wallet-login">
      <header className="sophia-header">
        <nav className="sophia-nav">
          <Link to="/sophia" className="sophia-brand">
            <span className="sophia-icon">◇</span>
            <span>Sophia Metapolis</span>
          </Link>
          <div className="sophia-nav-links">
            <Link to="/sophia">{t('sophia.nav.home')}</Link>
            <Link to="/sophia/about">{t('sophia.nav.about')}</Link>
            <Link to="/sophia/postulate">{t('sophia.nav.postulate')}</Link>
            <Link to="/wallet">{t('sophia.nav.wallet')}</Link>
          </div>
        </nav>
      </header>

      <div className="wallet-login-content">
        <h1>{t('sophia.wallet.login.title')}</h1>

        {magicLinkSent ? (
          <div className="wallet-magic-sent">
            <span className="wallet-magic-icon">✉</span>
            <p>{t('sophia.wallet.login.magicLinkSent')}</p>
          </div>
        ) : (
          <form onSubmit={handleMagicLink} className="wallet-login-form">
            <div className="form-group">
              <label htmlFor="email">{t('sophia.wallet.login.email')}</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('sophia.wallet.login.emailPlaceholder')}
                required
              />
            </div>
            <button type="submit" className="sophia-btn-primary wallet-btn-full">
              {t('sophia.wallet.login.magicLink')}
            </button>

            <div className="wallet-oauth-divider">
              <span>{t('sophia.wallet.login.oauth')}</span>
            </div>

            <div className="wallet-oauth-buttons">
              <button type="button" className="wallet-oauth-btn wallet-oauth-apple">
                <span>🍎</span> {t('sophia.wallet.login.apple')}
              </button>
              <button type="button" className="wallet-oauth-btn wallet-oauth-github">
                <span>⚙</span> {t('sophia.wallet.login.github')}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default WalletLogin;