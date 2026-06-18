import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import './SponsorDossier.css';


const CITY_DATA = {
  madrid: {
    flag: '🇪🇸',
    price: { es: 'desde €2.000', en: 'from €2,000' },
    detail: {
      title: { es: 'Madrid · Summit 2d + Conference 2d', en: 'Madrid · Summit 2d + Conference 2d' },
      venue: 'URJC Madrid',
      items: {
        es: ['Día 1–2: X-Ops Summit Ejecutivo (C-Level, Enterprise)', 'Día 3–4: X-Ops Conference (3 tracks técnicos)', 'Networking, Expo & CrackerNight'],
        en: ['Days 1–2: X-Ops Executive Summit (C-Level, Enterprise)', 'Days 3–4: X-Ops Conference (3 technical tracks)', 'Networking, Expo & CrackerNight'],
      },
    },
    tiers: {
      es: [
        { name: 'Platinum', price: '€8.000', platinum: true, features: ['Stand 3×2m Premium', '15 pases completos', 'Keynote exclusiva 30min', 'X-Ops Academy incluida', 'Logo máximo web + emails'] },
        { name: 'Track Sponsor', price: '€6.000', features: ['Naming rights del track', '10 pases completos', 'Keynote 30min en tu track', 'Logo web + emails'] },
        { name: 'Gold', price: '€3.000', features: ['5 pases completos', 'Charla técnica 45min', 'Stand 2×2m', 'Logo destacado en web'] },
        { name: 'Silver', price: '€2.000', features: ['2 pases completos', 'Logo en web', 'Stand 2×2m'] },
        { name: 'Welcome Pack', price: '€350', features: ['Producto en welcome pack', 'Logo en web'] },
      ],
      en: [
        { name: 'Platinum', price: '€8,000', platinum: true, features: ['3×2m Premium booth', '15 full passes', 'Exclusive 30min Keynote', 'X-Ops Academy included', 'Max logo web + emails'] },
        { name: 'Track Sponsor', price: '€6,000', features: ['Track naming rights', '10 full passes', '30min Keynote in your track', 'Logo web + emails'] },
        { name: 'Gold', price: '€3,000', features: ['5 full passes', '45min tech talk', '2×2m booth', 'Featured logo on web'] },
        { name: 'Silver', price: '€2,000', features: ['2 full passes', 'Logo on website', '2×2m booth'] },
        { name: 'Welcome Pack', price: '€350', features: ['Product in welcome pack', 'Logo on website'] },
      ],
    },
  },
  dubai: {
    flag: '🇦🇪',
    price: { es: 'desde AED 10.000', en: 'from AED 10,000' },
    detail: {
      title: { es: 'Dubai · Summit 2d + Conference 2d', en: 'Dubai · Summit 2d + Conference 2d' },
      venue: 'TBD · Dubai (Q2–Q3 2027)',
      items: {
        es: ['Día 1–2: Summit Ejecutivo GCC', 'Día 3–4: Conference Technical Tracks', 'Modelo Black Hat · Hackathon'],
        en: ['Days 1–2: GCC Executive Summit', 'Days 3–4: Technical Tracks Conference', 'Black Hat model · Hackathon'],
      },
    },
    tiers: {
      es: [
        { name: 'Platinum', price: 'AED 75.000', platinum: true, features: ['Booth Summit + Conference', '15 pases', 'Keynote Día 1', 'X-Ops Academy incluida', 'Logo máximo'] },
        { name: 'Track Sponsor', price: 'AED 45.000', features: ['Naming rights track', '10 pases', 'Keynote en tu track'] },
        { name: 'Gold', price: 'AED 22.000', features: ['5 pases', 'Charla 45min', 'Stand 2×2m'] },
        { name: 'Silver', price: 'AED 10.000', features: ['2 pases', 'Logo en web', 'Stand 2×2m'] },
      ],
      en: [
        { name: 'Platinum', price: 'AED 75,000', platinum: true, features: ['Booth Summit + Conference', '15 passes', 'Day 1 Keynote', 'X-Ops Academy included', 'Max logo'] },
        { name: 'Track Sponsor', price: 'AED 45,000', features: ['Track naming rights', '10 passes', 'Keynote in your track'] },
        { name: 'Gold', price: 'AED 22,000', features: ['5 passes', '45min talk', '2×2m booth'] },
        { name: 'Silver', price: 'AED 10,000', features: ['2 passes', 'Logo on website', '2×2m booth'] },
      ],
    },
  },
  london: {
    flag: '🇬🇧',
    price: { es: 'desde £3.000', en: 'from £3,000' },
    detail: {
      title: { es: 'London · Summit 2d + Conference 2d Global', en: 'London · Summit 2d + Conference 2d Global' },
      venue: 'TBD · London (Q3–Q4 2027)',
      items: {
        es: ['Día 1–2: Summit Global', 'Día 3–4: Conference + Hackathon', 'Formato internacional premier'],
        en: ['Days 1–2: Global Summit', 'Days 3–4: Conference + Hackathon', 'Premier international format'],
      },
    },
    tiers: {
      es: [
        { name: 'Platinum', price: '£15.000', platinum: true, features: ['Booth Summit + Conference', '15 pases', 'Keynote + C-Level roundtable', 'X-Ops Academy incluida', 'Logo máximo'] },
        { name: 'Track Sponsor', price: '£10.000', features: ['Naming rights track', '10 pases', 'Keynote en tu track'] },
        { name: 'Gold', price: '£6.000', features: ['5 pases', 'Charla 45min', 'Stand 2×2m'] },
        { name: 'Silver', price: '£3.000', features: ['2 pases', 'Logo en web', 'Stand 2×2m'] },
      ],
      en: [
        { name: 'Platinum', price: '£15,000', platinum: true, features: ['Booth Summit + Conference', '15 passes', 'Keynote + C-Level roundtable', 'X-Ops Academy included', 'Max logo'] },
        { name: 'Track Sponsor', price: '£10,000', features: ['Track naming rights', '10 passes', 'Keynote in your track'] },
        { name: 'Gold', price: '£6,000', features: ['5 passes', '45min talk', '2×2m booth'] },
        { name: 'Silver', price: '£3,000', features: ['2 passes', 'Logo on website', '2×2m booth'] },
      ],
    },
  },
};

const TECH_TAGS = ['Kubernetes','Docker','AWS','Azure','GCP','Terraform','ArgoCD','Prometheus',
  'Grafana','Datadog','Falco','OPA','Kyverno','Snyk','Trivy','Wazuh','GitLab','GitHub Actions'];

const AUDIENCE = [
  { label: { es: 'Platform / DevOps Engineers', en: 'Platform / DevOps Engineers' }, pct: 30 },
  { label: { es: 'DevSecOps Engineers', en: 'DevSecOps Engineers' }, pct: 20 },
  { label: { es: 'SRE / Infrastructure', en: 'SRE / Infrastructure' }, pct: 15 },
  { label: { es: 'Ciberseguridad / SecOps Engineers', en: 'Cybersecurity / SecOps Engineers' }, pct: 20 },
  { label: { es: 'CTOs / Tech Leads', en: 'CTOs / Tech Leads' }, pct: 10 },
  { label: { es: 'AIOps / MLOps', en: 'AIOps / MLOps' }, pct: 5 },
];

const REASONS = [
  { icon: '🎯', title: { es: 'Audiencia ultra-cualificada', en: 'Ultra-qualified audience' },
    desc: { es: 'Ingenieros con poder de decisión sobre herramientas y presupuestos.', en: 'Engineers with decision power over tools and budgets.' } },
  { icon: '🏛️', title: { es: 'Summit + Conference · Doble acceso', en: 'Summit + Conference · Dual access' },
    desc: { es: 'Formato único que combina C-Level y técnicos en un solo evento.', en: 'Unique format combining C-Level and technical profiles in one event.' } },
  { icon: '🎓', title: { es: 'Academy 365 días/año', en: 'Academy 365 days/year' },
    desc: { es: 'Visibilidad continua en los cursos de X-Ops Academy.', en: 'Continuous visibility across X-Ops Academy courses.' } },
  { icon: '🌍', title: { es: 'Multi-ciudad con descuento', en: 'Multi-city discount' },
    desc: { es: '−20% para 2 ciudades · −30% para 3–4 ciudades.', en: '−20% for 2 cities · −30% for 3–4 cities.' } },
  { icon: '📊', title: { es: 'Leads con datos reales', en: 'Real-data qualified leads' },
    desc: { es: 'Acceso a perfiles verificados de asistentes cualificados.', en: 'Access to verified profiles of qualified attendees.' } },
  { icon: '🚀', title: { es: 'Early mover advantage', en: 'Early mover advantage' },
    desc: { es: 'Edición en crecimiento — los mejores spots se cierran pronto.', en: 'Growing edition — best spots close early.' } },
];

const TABLE_ROWS = [
  { benefit: { es: 'Stand físico', en: 'Physical booth' }, platinum: '3×2m Premium', track: '2×2m', gold: '2×2m', silver: '2×2m', welcomepack: '—' },
  { benefit: { es: 'Pases completos', en: 'Full passes' }, platinum: '15', track: '10', gold: '5', silver: '2', welcomepack: '—' },
  { benefit: { es: 'Logo en web', en: 'Logo on website' }, platinum: { es: 'Máximo', en: 'Maximum' }, track: { es: 'Máximo', en: 'Maximum' }, gold: { es: 'Destacado', en: 'Featured' }, silver: '✓', welcomepack: '✓' },
  { benefit: { es: 'Logo en emails', en: 'Logo in emails' }, platinum: '✓', track: '✓', gold: '—', silver: '—', welcomepack: '—' },
  { benefit: { es: 'Charla técnica 45min', en: '45min tech talk' }, platinum: '✓', track: '✓', gold: '✓', silver: '—', welcomepack: '—' },
  { benefit: { es: 'Keynote 30min', en: '30min Keynote' }, platinum: { es: 'Exclusiva', en: 'Exclusive' }, track: { es: 'En su track', en: 'In their track' }, gold: '—', silver: '—', welcomepack: '—' },
  { benefit: { es: 'Naming Rights Track', en: 'Track Naming Rights' }, platinum: { es: 'Sujeto disponib.', en: 'Subject to avail.' }, track: '✓', gold: '—', silver: '—', welcomepack: '—' },
  { benefit: { es: '✦ X-Ops Academy', en: '✦ X-Ops Academy' }, platinum: { es: 'Incluida', en: 'Included' }, track: '—', gold: '—', silver: '—', welcomepack: '—' },
  { benefit: { es: 'Producto en welcome pack', en: 'Product in welcome pack' }, platinum: '✓', track: '✓', gold: '✓', silver: '—', welcomepack: '✓' },
];

function renderCell(val, lang) {
  if (!val) return <span className="sp-dash">—</span>;
  if (typeof val === 'object') return val[lang] || val.es;
  if (val === '—') return <span className="sp-dash">—</span>;
  if (val === '✓') return <span className="sp-check">✓</span>;
  return val;
}

export default function SponsorDossier() {
  const { i18n } = useTranslation();
  const lang = i18n.language;
  const [city, setCity] = useState('madrid');

  const t = (es, en) => lang === 'es' ? es : en;

  const cityBadge = () => {
    if (city === 'madrid') return t('📍 Madrid · Nov/Dic 2026 (Summit 2d + Conference 2d)', '📍 Madrid · Nov/Dec 2026 (Summit 2d + Conference 2d)');
    if (city === 'dubai') return '📍 Dubai · Q2–Q3 2027 · Premium GCC';
    if (city === 'london') return '📍 London · Q3–Q4 2027 · Global';
    return '';
  };

  const tiers = CITY_DATA[city].tiers[lang];
  const cityDetail = CITY_DATA[city].detail;
  const mailSubject = encodeURIComponent(
    t('Solicitud de Patrocinio X-Ops Conference 2026', 'Sponsorship Request X-Ops Conference 2026')
  );

  return (
    <div className="sp-wrap">
      {/* ── Hero ── */}
      <section className="sp-hero">
        <h1>X-OPS CONFERENCE</h1>
        <p className="sp-subtitle">{t('DOSSIER DE PATROCINIO 2026–2027', 'SPONSORSHIP DOSSIER 2026–2027')}</p>
        <div className="sp-badge">{cityBadge()}</div>

        <div className="sp-stats-row">
          <div className="sp-stat"><span className="sp-stat-num">3ª</span><span className="sp-stat-label">{t('Edición', 'Edition')}</span></div>
          <div className="sp-stat"><span className="sp-stat-num">300+</span><span className="sp-stat-label">{t('Asistentes', 'Attendees')}</span></div>
          <div className="sp-stat"><span className="sp-stat-num">4</span><span className="sp-stat-label">{t('Ciudades', 'Cities')}</span></div>
          <div className="sp-stat"><span className="sp-stat-num">4.7/5</span><span className="sp-stat-label">{t('Valoración', 'Rating')}</span></div>
          <div className="sp-stat"><span className="sp-stat-num">92%</span><span className="sp-stat-label">{t('Recomendarían', 'Would Recommend')}</span></div>
        </div>

        <div className="sp-tags">
          {TECH_TAGS.map(tag => <span key={tag} className="sp-tag">{tag}</span>)}
        </div>
      </section>

      {/* ── Trayectoria ── */}
      <section className="sp-section">
        <h2 className="sp-section-title">{t('Trayectoria', 'Track Record')}</h2>
        <div className="sp-timeline">
          <div className="sp-timeline-item">
            <span className="sp-timeline-year">2024</span>
            <p className="sp-timeline-title">{t('Primera Edición', 'First Edition')}</p>
            <p className="sp-timeline-desc">{t('ETSISI UPM, Vallecas · 1 día · 1 track · Lanzamiento de la comunidad X-Ops', 'ETSISI UPM, Vallecas · 1 day · 1 track · X-Ops community launch')}</p>
          </div>
          <div className="sp-timeline-item">
            <span className="sp-timeline-year">2025</span>
            <p className="sp-timeline-title">{t('Segunda Edición', 'Second Edition')}</p>
            <p className="sp-timeline-desc">{t('URJC Móstoles · 2 días · 3 tracks · 300+ asistentes · 4.7/5 valoración', 'URJC Móstoles · 2 days · 3 tracks · 300+ attendees · 4.7/5 rating')}</p>
          </div>
          <div className="sp-timeline-item">
            <span className="sp-timeline-year">2026</span>
            <p className="sp-timeline-title">{t('Tercera Edición · Expansión Internacional', 'Third Edition · International Expansion')}</p>
            <p className="sp-timeline-desc">{t('URJC Madrid + 4 ciudades · X-Ops Academy · Expansión GCC', 'URJC Madrid + 4 cities · X-Ops Academy · GCC Expansion')}</p>
          </div>
        </div>
      </section>

      {/* ── Ciudades ── */}
      <section className="sp-section">
        <h2 className="sp-section-title">{t('Ciudades', 'Cities')}</h2>
        <div className="sp-cities-grid">
          {Object.entries(CITY_DATA).map(([key, cd]) => (
            <div
              key={key}
              className={`sp-city-card${city === key ? ' active' : ''}`}
              onClick={() => setCity(key)}
            >
              <div className="sp-city-flag">{cd.flag}</div>
              <div className="sp-city-name">{key.charAt(0).toUpperCase() + key.slice(1)}</div>
              <div className="sp-city-price">{cd.price[lang]}</div>
            </div>
          ))}
        </div>

        <div className="sp-city-detail">
          <h4>{cityDetail.title[lang]} · {cityDetail.venue}</h4>
          <ul>
            {cityDetail.items[lang].map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>
      </section>

      {/* ── Audiencia ── */}
      <section className="sp-section">
        <h2 className="sp-section-title">{t('Audiencia', 'Audience')}</h2>
        {AUDIENCE.map((a, i) => (
          <div key={i} className="sp-bar-row">
            <span className="sp-bar-label">{a.label[lang]}</span>
            <div className="sp-bar-track">
              <div className="sp-bar-fill" style={{ width: `${a.pct}%` }} />
            </div>
            <span className="sp-bar-pct">{a.pct}%</span>
          </div>
        ))}
        <div className="sp-tags" style={{ marginTop: '1.5rem' }}>
          {TECH_TAGS.map(tag => <span key={tag} className="sp-tag">{tag}</span>)}
        </div>
      </section>

      {/* ── X-Ops Academy ── */}
      <section className="sp-section">
        <h2 className="sp-section-title">X-Ops Academy</h2>
        <div className="sp-academy-box">
          <p style={{ color: '#b0bec5', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
            {t('Formación continua 365 días/año · Visibilidad de patrocinadores en todos los cursos', 'Continuous training 365 days/year · Sponsor visibility across all courses')}
          </p>
          <div className="sp-academy-grid">
            <div className="sp-academy-track">
              <h4>DevSecOps Fundamentals</h4>
              <div className="sp-track-detail">{t('8 semanas · Online', '8 weeks · Online')}</div>
              <div className="sp-track-price">€299</div>
            </div>
            <div className="sp-academy-track">
              <h4>Platform Engineering</h4>
              <div className="sp-track-detail">{t('10 semanas · Online', '10 weeks · Online')}</div>
              <div className="sp-track-price">€499</div>
            </div>
            <div className="sp-academy-track">
              <h4>AIOps + MLOps</h4>
              <div className="sp-track-detail">{t('8 semanas · Online', '8 weeks · Online')}</div>
              <div className="sp-track-price">€599</div>
            </div>
            <div className="sp-academy-track">
              <h4>{t('In-Company Enterprise', 'In-Company Enterprise')}</h4>
              <div className="sp-track-detail">{t('Formación a medida', 'Custom training')}</div>
              <div className="sp-track-price">€2.000–€8.000 / {t('equipo', 'team')}</div>
            </div>
            <div className="sp-academy-track">
              <h4>{t('Ciberseguridad Ofensiva', 'Offensive Cybersecurity')}</h4>
              <div className="sp-track-detail">{t('10 semanas · Online', '10 weeks · Online')}</div>
              <div className="sp-track-price">€549</div>
            </div>
          </div>
          <p style={{ color: '#69F0AE', fontSize: '0.82rem', marginTop: '0.5rem' }}>
            ✦ {t('Patrocinadores Platinum: logo en todos los materiales del curso + mención en sesiones', 'Platinum sponsors: logo on all course materials + mention in sessions')}
          </p>
        </div>
      </section>

      {/* ── Por qué patrocinar ── */}
      <section className="sp-section">
        <h2 className="sp-section-title">{t('Por qué patrocinar', 'Why Sponsor')}</h2>
        <div className="sp-reasons-grid">
          {REASONS.map((r, i) => (
            <div key={i} className="sp-reason-card">
              <div className="sp-reason-icon">{r.icon}</div>
              <div className="sp-reason-title">{r.title[lang]}</div>
              <div className="sp-reason-desc">{r.desc[lang]}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tiers ── */}
      <section className="sp-section">
        <h2 className="sp-section-title">
          {t('Niveles de patrocinio', 'Sponsorship Tiers')} · {city.charAt(0).toUpperCase() + city.slice(1)}
        </h2>

        <div className="sp-tiers-grid">
          {tiers.map((tier, i) => (
            <div key={i} className={`sp-tier-card${tier.platinum ? ' platinum' : ''}`}>
              {tier.platinum && <div className="sp-tier-badge">★ BEST VALUE</div>}
              <div className="sp-tier-name">{tier.name}</div>
              <div className="sp-tier-price">{tier.price}</div>
              <ul className="sp-tier-features">
                {tier.features.map((f, j) => <li key={j}>{f}</li>)}
              </ul>
            </div>
          ))}
        </div>

        {/* Multi-city discount */}
        <div className="sp-discount-box">
          <div>
            <div style={{ color: '#b0bec5', fontSize: '0.82rem', marginBottom: '0.5rem', fontWeight: 700 }}>
              {t('DESCUENTO MULTI-CIUDAD', 'MULTI-CITY DISCOUNT')}
            </div>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
              <div className="sp-discount-item">
                <div className="sp-discount-pct">−20%</div>
                <div className="sp-discount-label">{t('2 ciudades', '2 cities')}</div>
              </div>
              <div className="sp-discount-item">
                <div className="sp-discount-pct">−30%</div>
                <div className="sp-discount-label">{t('3–4 ciudades', '3–4 cities')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Comparison table */}
        <h3 style={{ color: '#b0bec5', fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase', margin: '1.5rem 0 0.8rem' }}>
          {t('Comparativa de beneficios (Madrid baseline)', 'Benefits Comparison (Madrid baseline)')}
        </h3>
        <div className="sp-table-wrap">
          <table className="sp-table">
            <thead>
              <tr>
                <th>{t('Beneficio', 'Benefit')}</th>
                <th>Platinum</th>
                <th>Track Sponsor</th>
                <th>Gold</th>
                <th>Silver</th>
                <th>Welcome Pack</th>
              </tr>
            </thead>
            <tbody>
              {TABLE_ROWS.map((row, i) => (
                <tr key={i}>
                  <td style={{ color: '#fff' }}>{typeof row.benefit === 'object' ? row.benefit[lang] : row.benefit}</td>
                  <td>{renderCell(row.platinum, lang)}</td>
                  <td>{renderCell(row.track, lang)}</td>
                  <td>{renderCell(row.gold, lang)}</td>
                  <td>{renderCell(row.silver, lang)}</td>
                  <td>{renderCell(row.welcomepack, lang)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Startup Pack ── */}
      <section className="sp-section">
        <h2 className="sp-section-title">🌱 Startup Pack</h2>
        <div className="sp-academy-box">
          <p style={{ color: '#b0bec5', marginBottom: '1rem', fontSize: '0.95rem' }}>
            {t(
              'Diseñado para startups de hasta 3 años con menos de 15 empleados. El Startup Pack ofrece visibilidad real en el ecosistema X-Ops a una fracción del coste de patrocinio estándar.',
              'Designed for startups up to 3 years old with fewer than 15 employees. The Startup Pack offers real visibility in the X-Ops ecosystem at a fraction of standard sponsorship cost.'
            )}
          </p>
          <div className="sp-academy-grid">
            <div className="sp-academy-track">
              <h4>{t('¿Qué incluye?', "What's included?")}</h4>
              <div className="sp-track-detail" style={{ lineHeight: '1.8' }}>
                {t('Logo en web · Mención en redes · 1 pase completo · Stand compartido · Welcome Pack', 'Logo on web · Social mention · 1 full pass · Shared booth · Welcome Pack')}
              </div>
              <div className="sp-track-price">€350–€950</div>
            </div>
            <div className="sp-academy-track">
              <h4>{t('Criterios de elegibilidad', 'Eligibility criteria')}</h4>
              <div className="sp-track-detail" style={{ lineHeight: '1.8' }}>
                {t('≤3 años de antigüedad · ≤15 empleados · ARR <€500K · Sector X-Ops', '≤3 years old · ≤15 employees · ARR <€500K · X-Ops sector')}
              </div>
            </div>
            <div className="sp-academy-track">
              <h4>{t('Ciudades disponibles', 'Available cities')}</h4>
              <div className="sp-track-detail" style={{ lineHeight: '1.8' }}>
                Madrid · Dubai · London
              </div>
              <div className="sp-track-price" style={{ fontSize: '0.8rem', color: '#69F0AE' }}>
                {t('−10% multi-ciudad', '−10% multi-city')}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contact CTA ── */}
      <section className="sp-section">
        <div className="sp-cta-box" style={{ textAlign: 'center' }}>
          <div className="sp-cta-btns">
            <a
              href={`mailto:info@xopsconference.com?subject=${mailSubject}`}
              className="sp-cta-primary"
            >
              {t('✉️ Solicitar Patrocinio', '✉️ Request Sponsorship')}
            </a>
            <Link to="/startup-pack" className="sp-cta-secondary">
              {t('🌱 Solicitar Startup Pack', '🌱 Apply for Startup Pack')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
