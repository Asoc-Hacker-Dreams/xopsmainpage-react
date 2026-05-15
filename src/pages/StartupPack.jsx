import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import './StartupPack.css';

const SYNC_URL = import.meta.env.VITE_HUBSPOT_SYNC_URL || 'http://localhost:3002';

const CITIES = [
  { key: 'madrid', flag: '🇪🇸', name: 'Madrid', price: '€850', currency: 'EUR', amount: 850 },
  { key: 'barcelona', flag: '🇪🇸', name: 'Barcelona', price: '€950', currency: 'EUR', amount: 950 },
  { key: 'dubai', flag: '🇦🇪', name: 'Dubai', price: 'AED 3.500', currency: 'AED', amount: 3500 },
  { key: 'london', flag: '🇬🇧', name: 'London', price: '£900', currency: 'GBP', amount: 900 },
];

const COUNTRIES = ['España', 'UAE', 'United Kingdom', 'Germany', 'France', 'Netherlands', 'USA', 'Other'];

const CATEGORIES = [
  { value: 'devsecops', label: 'DevSecOps / Security tooling' },
  { value: 'platform', label: 'Platform Engineering / IDP' },
  { value: 'aiops', label: 'AIOps / MLOps' },
  { value: 'cloud', label: 'Cloud-native infrastructure' },
  { value: 'observability', label: 'Observability / Monitoring' },
  { value: 'cicd', label: 'CI/CD / GitOps' },
  { value: 'compliance', label: 'Compliance / Policy as Code' },
  { value: 'other', label: 'Other X-Ops' },
];

const ARR_OPTIONS = [
  { value: '', label: { es: 'Seleccionar…', en: 'Select…' } },
  { value: 'pre-revenue', label: { es: 'Pre-revenue', en: 'Pre-revenue' } },
  { value: '0-100k', label: '€0–€100K' },
  { value: '100k-250k', label: '€100K–€250K' },
  { value: '250k-500k', label: '€250K–€500K' },
  { value: 'over-500k', label: '>€500K' },
];

const DOC_OPTIONS = [
  { value: 'certificate', icon: '📄', label: { es: 'Certificado de constitución', en: 'Certificate of incorporation' } },
  { value: 'linkedin', icon: '💼', label: { es: 'Captura LinkedIn empresa', en: 'Company LinkedIn screenshot' } },
  { value: 'declaration', icon: '✍️', label: { es: 'Declaración firmada representante legal', en: 'Signed declaration from legal representative' } },
];

const OwlSmall = () => (
  <svg viewBox="0 0 200 200" style={{ width: 36, height: 36 }}>
    <circle cx="100" cy="100" r="95" fill="#0D1A4A" stroke="#00BCD4" strokeWidth="3"/>
    <circle cx="83" cy="88" r="14" fill="#00BCD4" opacity="0.9"/>
    <circle cx="117" cy="88" r="14" fill="#00BCD4" opacity="0.9"/>
    <circle cx="83" cy="88" r="5" fill="#00E5FF"/>
    <circle cx="117" cy="88" r="5" fill="#00E5FF"/>
    <polygon points="100,98 93,108 107,108" fill="#FFD600"/>
  </svg>
);

function calcEligibility(foundedDate, employees, arr) {
  const ageYears = foundedDate
    ? (new Date() - new Date(foundedDate)) / (1000 * 60 * 60 * 24 * 365.25)
    : null;
  const agePass = foundedDate ? ageYears <= 3 : null;
  const empPass = employees !== '' ? parseInt(employees) <= 15 : null;
  const arrPass = arr !== '' ? arr !== 'over-500k' : null;
  return { agePass, empPass, arrPass };
}

function EligDot({ status }) {
  const cls = status === true ? 'pass' : status === false ? 'fail' : 'pending';
  return <div className={`stk-dot ${cls}`} />;
}

function priceBreakdown(selectedCities, discount) {
  if (selectedCities.length === 0) return null;
  const byCurrency = {};
  selectedCities.forEach(k => {
    const c = CITIES.find(x => x.key === k);
    if (!byCurrency[c.currency]) byCurrency[c.currency] = { symbol: c.price[0], total: 0 };
    byCurrency[c.currency].total += c.amount;
  });
  return Object.entries(byCurrency).map(([cur, data]) => {
    const disc = discount > 0 ? data.total * (1 - discount / 100) : data.total;
    const fmt = disc.toLocaleString();
    return { cur, display: cur === 'EUR' ? `€${fmt}` : cur === 'AED' ? `AED ${fmt}` : `£${fmt}` };
  });
}

export default function StartupPack() {
  const [lang, setLang] = useState('es');

  // Form state
  const [companyName, setCompanyName] = useState('');
  const [website, setWebsite] = useState('');
  const [country, setCountry] = useState('');
  const [foundedDate, setFoundedDate] = useState('');
  const [employees, setEmployees] = useState('');
  const [arr, setArr] = useState('');
  const [productDesc, setProductDesc] = useState('');
  const [category, setCategory] = useState('');

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [linkedin, setLinkedin] = useState('');

  const [selectedCities, setSelectedCities] = useState([]);
  const [docType, setDocType] = useState('');

  const [declAccuracy, setDeclAccuracy] = useState(false);
  const [declVerification, setDeclVerification] = useState(false);
  const [declTerms, setDeclTerms] = useState(false);
  const [declNewsletter, setDeclNewsletter] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const t = (es, en) => lang === 'es' ? es : en;

  const { agePass, empPass, arrPass } = calcEligibility(foundedDate, employees, arr);
  const bCriteria = empPass === true || arrPass === true;
  const isEligible = agePass === true && bCriteria;
  const isIneligible = agePass === false || (agePass !== null && empPass === false && arrPass === false);
  const isPartial = !isEligible && !isIneligible && (agePass !== null || empPass !== null || arrPass !== null);

  const discount = selectedCities.length >= 3 ? 30 : selectedCities.length === 2 ? 20 : 0;
  const breakdown = priceBreakdown(selectedCities, discount);

  const toggleCity = (key) => {
    setSelectedCities(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const formValid =
    companyName && website && country && foundedDate && employees && productDesc && category &&
    firstName && lastName && email && jobTitle &&
    selectedCities.length > 0 && docType &&
    declAccuracy && declVerification && declTerms;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formValid) return;
    setSubmitting(true);
    setSubmitError(false);
    try {
      const res = await fetch(`${SYNC_URL}/webhooks/startup-application`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          firstname: firstName,
          lastname: lastName,
          companyName,
          website,
          country,
          city: selectedCities.join(', '),
          stage: arr,
          employees,
          category,
          jobTitle,
          linkedin,
          productDesc,
          newsletterConsent: declNewsletter,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSubmitted(true);
    } catch (err) {
      console.error('Startup Pack submission error:', err);
      setSubmitError(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="stk-wrap">
        <header className="stk-header">
          <Link to="/Sponsor" className="stk-header-logo">
            <OwlSmall />
            <div className="stk-header-brand">
              <span className="stk-brand-name">X-OPS CONFERENCE</span>
              <span className="stk-brand-sub">STARTUP PACK</span>
            </div>
          </Link>
        </header>
        <div className="stk-main stk-success">
          <div className="stk-success-icon">✅</div>
          <h2>{t('¡Solicitud enviada!', 'Application submitted!')}</h2>
          <p>{t('Te contactamos en menos de 48h para confirmar tu elegibilidad.', 'We\'ll contact you within 48h to confirm your eligibility.')}</p>
          <p style={{ marginTop: '0.5rem' }}><strong>✓ {t('Solicitud enviada — Te contactamos en <48h', 'Application sent — We\'ll contact you in <48h')}</strong></p>
          <Link to="/Sponsor" style={{ color: '#00BCD4', display: 'inline-block', marginTop: '1.5rem' }}>
            ← {t('Volver al dossier', 'Back to dossier')}
          </Link>
        </div>
        <footer className="stk-footer">
          <a href="https://xopsconference.com" target="_blank" rel="noreferrer">xopsconference.com</a> ·{' '}
          <a href="mailto:info@xopsconference.com">info@xopsconference.com</a> · +34 744 644 873
        </footer>
      </div>
    );
  }

  return (
    <div className="stk-wrap">
      <SEO
        title="Startup Pack — X-Ops Conference 2026"
        description="Startup Pack de X-Ops Conference: visibilidad en el mayor evento de DevOps y DevSecOps de España para startups de hasta 3 años, 15 empleados y ARR &lt;€500K. Desde €350."
        path="/startup-pack"
        keywords="Startup Pack, X-Ops Conference, startup DevOps, patrocinio startup, Madrid 2026"
        lang="es"
        alternates={[
          { hrefLang: 'es', href: 'https://xopsconference.com/startup-pack' },
          { hrefLang: 'en', href: 'https://xopsconference.com/startup-pack' },
        ]}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Offer",
          "name": "X-Ops Conference Startup Pack",
          "description": "Sponsorship package for early-stage startups (≤3 years, ≤15 employees, ARR <€500K). Includes web visibility, social mention, 1 full pass, shared booth.",
          "priceCurrency": "EUR",
          "price": "350",
          "url": "https://xopsconference.com/startup-pack",
          "seller": {
            "@type": "Organization",
            "name": "X-Ops Conference",
            "url": "https://xopsconference.com"
          }
        }}
      />
      {/* ── Header ── */}
      <header className="stk-header">
        <Link to="/Sponsor" className="stk-header-logo">
          <OwlSmall />
          <div className="stk-header-brand">
            <span className="stk-brand-name">X-OPS CONFERENCE</span>
            <span className="stk-brand-sub">
              {t('STARTUP PACK — SOLICITUD DE ELEGIBILIDAD', 'STARTUP PACK — ELIGIBILITY APPLICATION')}
            </span>
          </div>
        </Link>
        <div className="stk-lang-btns">
          <button className={`stk-lang-btn${lang === 'es' ? ' active' : ''}`} onClick={() => setLang('es')}>ES</button>
          <button className={`stk-lang-btn${lang === 'en' ? ' active' : ''}`} onClick={() => setLang('en')}>EN</button>
        </div>
      </header>

      {/* ── Hero ── */}
      <div className="stk-hero">
        <h1>
          {t(
            <>Tu empresa merece estar en la sala. <span>Sin barreras de precio.</span></>,
            <>Your company deserves a seat at the table. <span>No price barriers.</span></>
          )}
        </h1>
        <p>
          {t(
            'El Startup Pack está diseñado para startups del ecosistema DevSecOps, Platform Engineering y AIOps que quieren visibilidad sin el coste de un patrocinio estándar.',
            'The Startup Pack is designed for startups in the DevSecOps, Platform Engineering and AIOps ecosystem who want visibility without the cost of a standard sponsorship.'
          )}
        </p>
      </div>

      <div className="stk-main">
        {/* ── Eligibility criteria ── */}
        <div className="stk-criteria-box">
          <h3>{t('Criterios de elegibilidad', 'Eligibility Criteria')}</h3>
          <div className="stk-criteria-row">
            <span className="stk-crit-badge">{t('OBLIGATORIO', 'REQUIRED')}</span>
            <span>{t('Criterio A — Empresa ≤3 años de antigüedad', 'Criterion A — Company ≤3 years old')}</span>
          </div>
          <div className="stk-criteria-row">
            <span className="stk-crit-badge optional">{t('UNO DE', 'ONE OF')}</span>
            <span>{t('Criterio B1 — ≤15 empleados FTE', 'Criterion B1 — ≤15 FTE employees')}</span>
          </div>
          <div className="stk-criteria-row">
            <span className="stk-crit-badge optional">{t('UNO DE', 'ONE OF')}</span>
            <span>{t('Criterio B2 — ARR ≤€500.000', 'Criterion B2 — ARR ≤€500,000')}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate>

          {/* ── Section 1: Company data ── */}
          <div className="stk-section">
            <div className="stk-section-title">{t('1. Datos de la empresa', '1. Company Data')}</div>

            <div className="stk-field">
              <label className="stk-label">{t('Nombre de la empresa', 'Company name')} <span className="req">*</span></label>
              <input className="stk-input" type="text" required value={companyName} onChange={e => setCompanyName(e.target.value)}
                placeholder={t('Acme DevSecOps SL', 'Acme DevSecOps Ltd')} />
            </div>

            <div className="stk-field">
              <label className="stk-label">{t('Sitio web', 'Website')} <span className="req">*</span></label>
              <input className="stk-input" type="url" required value={website} onChange={e => setWebsite(e.target.value)}
                placeholder="https://yourcompany.io" />
            </div>

            <div className="stk-field">
              <label className="stk-label">{t('País', 'Country')} <span className="req">*</span></label>
              <select className="stk-select" required value={country} onChange={e => setCountry(e.target.value)}>
                <option value="">{t('Seleccionar…', 'Select…')}</option>
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="stk-two-col">
              <div className="stk-field">
                <label className="stk-label">{t('Fecha de constitución', 'Founded date')} <span className="req">*</span></label>
                <input className="stk-input" type="date" required value={foundedDate} onChange={e => setFoundedDate(e.target.value)} />
              </div>
              <div className="stk-field">
                <label className="stk-label">{t('Empleados FTE', 'Employees FTE')} <span className="req">*</span></label>
                <input className="stk-input" type="number" required min="1" value={employees}
                  onChange={e => setEmployees(e.target.value)} placeholder="12" />
              </div>
            </div>

            <div className="stk-field">
              <label className="stk-label">
                ARR {t('(opcional si empleados ≤15)', '(optional if employees ≤15)')}
              </label>
              <select className="stk-select" value={arr} onChange={e => setArr(e.target.value)}>
                {ARR_OPTIONS.map(o => (
                  <option key={o.value} value={o.value}>
                    {typeof o.label === 'object' ? o.label[lang] : o.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="stk-field">
              <label className="stk-label">{t('Descripción del producto / solución', 'Product / solution description')} <span className="req">*</span></label>
              <textarea className="stk-textarea" required value={productDesc}
                onChange={e => setProductDesc(e.target.value)}
                placeholder={t('Describe brevemente tu producto o servicio y el problema que resuelve…', 'Briefly describe your product or service and the problem it solves…')} />
            </div>

            <div className="stk-field">
              <label className="stk-label">{t('Categoría', 'Category')} <span className="req">*</span></label>
              <select className="stk-select" required value={category} onChange={e => setCategory(e.target.value)}>
                <option value="">{t('Seleccionar…', 'Select…')}</option>
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
          </div>

          {/* ── Section 2: Eligibility checker ── */}
          <div className="stk-section">
            <div className="stk-section-title">{t('2. Verificación de elegibilidad', '2. Eligibility Check')}</div>
            <div className="stk-checker-box">
              <div className="stk-checker-title">{t('Estado de criterios', 'Criteria status')}</div>
              <div className="stk-checker-row">
                <EligDot status={agePass} />
                <span>
                  {t('Criterio A — Antigüedad ≤3 años', 'Criterion A — Age ≤3 years')}
                  {foundedDate && agePass !== null && (
                    <span style={{ color: '#78909c', fontSize: '0.8rem', marginLeft: '0.5rem' }}>
                      ({agePass
                        ? t('✓ Cumple', '✓ Meets criteria')
                        : t('✗ No cumple', '✗ Does not meet criteria')})
                    </span>
                  )}
                </span>
              </div>
              <div className="stk-checker-row">
                <EligDot status={empPass} />
                <span>
                  {t('Criterio B1 — Empleados ≤15', 'Criterion B1 — Employees ≤15')}
                  {empPass !== null && (
                    <span style={{ color: '#78909c', fontSize: '0.8rem', marginLeft: '0.5rem' }}>
                      ({empPass ? t('✓ Cumple', '✓ Meets') : t('✗ No cumple', '✗ Does not meet')})
                    </span>
                  )}
                </span>
              </div>
              <div className="stk-checker-row">
                <EligDot status={arrPass} />
                <span>
                  {t('Criterio B2 — ARR ≤€500K', 'Criterion B2 — ARR ≤€500K')}
                  {arrPass !== null && (
                    <span style={{ color: '#78909c', fontSize: '0.8rem', marginLeft: '0.5rem' }}>
                      ({arrPass ? t('✓ Cumple', '✓ Meets') : t('✗ Supera límite', '✗ Exceeds limit')})
                    </span>
                  )}
                </span>
              </div>

              {isEligible && (
                <div className="stk-eligibility-result eligible">
                  ✅ {t('Empresa elegible para el Startup Pack', 'Company eligible for Startup Pack')}
                </div>
              )}
              {isIneligible && (
                <div className="stk-eligibility-result ineligible">
                  ❌ {t('La empresa no cumple los criterios actuales', 'Company does not meet current criteria')}
                </div>
              )}
              {isPartial && (
                <div className="stk-eligibility-result partial">
                  ⏳ {t('Completa los campos para verificar elegibilidad', 'Complete the fields to verify eligibility')}
                </div>
              )}
            </div>
          </div>

          {/* ── Section 3: Contact ── */}
          <div className="stk-section">
            <div className="stk-section-title">{t('3. Datos de contacto', '3. Contact Information')}</div>

            <div className="stk-two-col">
              <div className="stk-field">
                <label className="stk-label">{t('Nombre', 'First name')} <span className="req">*</span></label>
                <input className="stk-input" type="text" required value={firstName}
                  onChange={e => setFirstName(e.target.value)} placeholder={t('María', 'John')} />
              </div>
              <div className="stk-field">
                <label className="stk-label">{t('Apellidos', 'Last name')} <span className="req">*</span></label>
                <input className="stk-input" type="text" required value={lastName}
                  onChange={e => setLastName(e.target.value)} placeholder={t('García López', 'Smith')} />
              </div>
            </div>

            <div className="stk-two-col">
              <div className="stk-field">
                <label className="stk-label">Email <span className="req">*</span></label>
                <input className="stk-input" type="email" required value={email}
                  onChange={e => setEmail(e.target.value)} placeholder="ceo@startup.io" />
              </div>
              <div className="stk-field">
                <label className="stk-label">{t('Cargo', 'Job title')} <span className="req">*</span></label>
                <input className="stk-input" type="text" required value={jobTitle}
                  onChange={e => setJobTitle(e.target.value)} placeholder="CEO / CTO / Founder" />
              </div>
            </div>

            <div className="stk-field">
              <label className="stk-label">{t('LinkedIn empresa', 'Company LinkedIn')} ({t('opcional', 'optional')})</label>
              <input className="stk-input" type="url" value={linkedin}
                onChange={e => setLinkedin(e.target.value)} placeholder="https://linkedin.com/company/..." />
            </div>
          </div>

          {/* ── Section 4: Cities ── */}
          <div className="stk-section">
            <div className="stk-section-title">{t('4. Ciudades de interés', '4. Cities of Interest')}</div>
            <div className="stk-cities-grid">
              {CITIES.map(c => (
                <div
                  key={c.key}
                  className={`stk-city-opt${selectedCities.includes(c.key) ? ' selected' : ''}`}
                  onClick={() => toggleCity(c.key)}
                >
                  <div className="stk-city-opt-flag">{c.flag}</div>
                  <div className="stk-city-opt-name">{c.name}</div>
                  <div className="stk-city-opt-price">{c.price}</div>
                </div>
              ))}
            </div>

            {discount > 0 && (
              <p className="stk-discount-note">
                🎉 {t(`Descuento multi-ciudad aplicado: −${discount}%`, `Multi-city discount applied: −${discount}%`)}
              </p>
            )}

            {breakdown && breakdown.length > 0 && (
              <div className="stk-price-summary">
                {t('Precio estimado: ', 'Estimated price: ')}
                {breakdown.map((b, i) => (
                  <span key={i}>
                    <strong>{b.display}</strong>{i < breakdown.length - 1 ? ' + ' : ''}
                  </span>
                ))}
                {discount > 0 && <span style={{ color: '#FFD600' }}> (−{discount}% {t('descuento multi-ciudad', 'multi-city discount')})</span>}
              </div>
            )}
          </div>

          {/* ── Section 5: Documentation ── */}
          <div className="stk-section">
            <div className="stk-section-title">{t('5. Tipo de documentación', '5. Documentation Type')}</div>
            <div className="stk-doc-options">
              {DOC_OPTIONS.map(opt => (
                <div
                  key={opt.value}
                  className={`stk-doc-opt${docType === opt.value ? ' selected' : ''}`}
                  onClick={() => setDocType(opt.value)}
                >
                  <div className={`stk-doc-radio${docType === opt.value ? ' selected' : ''}`} />
                  <span>{opt.icon} {opt.label[lang]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Section 6: Upgrade info ── */}
          <div className="stk-upgrade-box">
            <strong>{t('ℹ️ Política de upgrade', 'ℹ️ Upgrade Policy')}</strong><br />
            {t(
              'Si en la siguiente edición tu empresa supera los criterios, te ofrecemos upgrade a Silver con −20% de descuento.',
              'If by the next edition your company exceeds the criteria, we offer you an upgrade to Silver at −20% discount.'
            )}
          </div>

          {/* ── Section 7: Declarations ── */}
          <div className="stk-section">
            <div className="stk-section-title">{t('6. Declaraciones', '6. Declarations')}</div>

            <label className="stk-declaration">
              <input type="checkbox" checked={declAccuracy} onChange={e => setDeclAccuracy(e.target.checked)} />
              <span>
                {t(
                  'Declaro que los datos proporcionados son verídicos y corresponden a la empresa indicada. *',
                  'I declare that the provided information is accurate and corresponds to the indicated company. *'
                )}
              </span>
            </label>

            <label className="stk-declaration">
              <input type="checkbox" checked={declVerification} onChange={e => setDeclVerification(e.target.checked)} />
              <span>
                {t(
                  'Acepto que X-Ops Conference verifique la información mediante documentación adicional si es necesario. *',
                  'I accept that X-Ops Conference may verify the information with additional documentation if necessary. *'
                )}
              </span>
            </label>

            <label className="stk-declaration">
              <input type="checkbox" checked={declTerms} onChange={e => setDeclTerms(e.target.checked)} />
              <span>
                {t(
                  'He leído y acepto los términos y condiciones del Startup Pack. *',
                  'I have read and accept the Startup Pack terms and conditions. *'
                )}
              </span>
            </label>

            <label className="stk-declaration">
              <input type="checkbox" checked={declNewsletter} onChange={e => setDeclNewsletter(e.target.checked)} />
              <span>
                {t(
                  'Deseo recibir información sobre futuras ediciones y oportunidades de la comunidad X-Ops. (opcional)',
                  'I wish to receive information about future editions and X-Ops community opportunities. (optional)'
                )}
              </span>
            </label>
          </div>

          {submitError && (
            <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              {t('Error al enviar la solicitud. Inténtalo de nuevo.', 'Submission error. Please try again.')}
            </p>
          )}
          <button type="submit" className="stk-submit-btn" disabled={!formValid || submitting}>
            {submitting
              ? t('Enviando...', 'Submitting...')
              : t('Enviar solicitud de elegibilidad', 'Submit eligibility application')}
          </button>

        </form>
      </div>

      <footer className="stk-footer">
        <a href="https://xopsconference.com" target="_blank" rel="noreferrer">xopsconference.com</a> ·{' '}
        <a href="mailto:info@xopsconference.com">info@xopsconference.com</a> · +34 744 644 873
      </footer>
    </div>
  );
}
