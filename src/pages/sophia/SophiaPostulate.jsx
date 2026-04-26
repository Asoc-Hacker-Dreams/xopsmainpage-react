import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './SophiaPostulate.css';

function SophiaPostulate() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    handle: '',
    email: '',
    country: '',
    displayName: '',
    declaration: '',
    acceptTerms: false
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.declaration.length < 200) {
      alert('Declaration must be at least 200 characters');
      return;
    }
    setSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setSubmitted(true);
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div className="sophia-postulate">
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
            </div>
          </nav>
        </header>
        <div className="sophia-success">
          <span className="sophia-success-icon">✓</span>
          <h1>{t('sophia.postulate.success.title')}</h1>
          <p>{t('sophia.postulate.success.message')}</p>
          <Link to="/sophia" className="sophia-btn-primary">
            {t('sophia.postulate.success.checkStatus')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="sophia-postulate">
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
          </div>
        </nav>
      </header>

      <div className="sophia-postulate-content">
        <h1>{t('sophia.postulate.title')}</h1>
        <p className="sophia-postulate-intro">{t('sophia.postulate.intro')}</p>

        <form onSubmit={handleSubmit} className="sophia-form">
          {/* Section 1: Basic Data */}
          <section className="sophia-form-section">
            <div className="form-group">
              <label htmlFor="handle">{t('sophia.postulate.form.handle')}</label>
              <input
                type="text"
                id="handle"
                name="handle"
                value={formData.handle}
                onChange={handleChange}
                placeholder={t('sophia.postulate.form.handlePlaceholder')}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">{t('sophia.postulate.form.email')}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t('sophia.postulate.form.emailPlaceholder')}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="country">{t('sophia.postulate.form.country')}</label>
                <input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="displayName">{t('sophia.postulate.form.displayName')}</label>
                <input
                  type="text"
                  id="displayName"
                  name="displayName"
                  value={formData.displayName}
                  onChange={handleChange}
                />
              </div>
            </div>
          </section>

          {/* Section 2: Personal Declaration */}
          <section className="sophia-form-section">
            <label htmlFor="declaration">{t('sophia.postulate.form.declaration')}</label>
            <p className="form-help">{t('sophia.postulate.form.declarationPrompt')}</p>
            <textarea
              id="declaration"
              name="declaration"
              value={formData.declaration}
              onChange={handleChange}
              rows={8}
              minLength={200}
              maxLength={2000}
              required
            />
            <p className="form-hint">
              {formData.declaration.length}/2000 · {formData.declaration.length < 200 ? `${200 - formData.declaration.length} more needed` : '✓ OK'}
            </p>
            <p className="form-declaration-help">{t('sophia.postulate.form.declarationHelp')}</p>
          </section>

          {/* Section 3: Confirmation */}
          <section className="sophia-form-section">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleChange}
                required
              />
              <span>{t('sophia.postulate.form.terms')}</span>
            </label>
          </section>

          <button
            type="submit"
            className="sophia-btn-submit"
            disabled={submitting || formData.declaration.length < 200 || !formData.acceptTerms}
          >
            {submitting ? t('sophia.postulate.form.submitting') : t('sophia.postulate.form.submit')}
          </button>
        </form>
      </div>
    </div>
  );
}

export default SophiaPostulate;