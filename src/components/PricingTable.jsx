import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { BsCheckCircleFill, BsStar } from 'react-icons/bs';
import AnimationWrapper from './AnimationWrapper';

const CONTACT_EMAIL = 'info@xopsconference.com';
const EUR_TO_AED = 4.0;
const EUR_TO_USD = 1.1;
const ROUND_STEP = 50;
const COMBINED_DISCOUNT = 0.1;

const roundToStep = (value, step = ROUND_STEP) => Math.round(value / step) * step;
const formatNumber = (value) => value.toLocaleString('es-ES');

const ecosystemBenefits = {
  es: {
    platinum: '4 X-Ops Ecosystem Credits',
    track: '2 X-Ops Ecosystem Credits',
    gold: '1 X-Ops Ecosystem Credit',
    silver: 'X-Ops Technology Scorecard incluido',
    virtual: 'Beneficios digitales del ecosistema · sin créditos adicionales',
  },
  en: {
    platinum: '4 X-Ops Ecosystem Credits',
    track: '2 X-Ops Ecosystem Credits',
    gold: '1 X-Ops Ecosystem Credit',
    silver: 'X-Ops Technology Scorecard included',
    virtual: 'Digital ecosystem benefits · no additional credits',
  },
};

const ecosystemBenefitLabels = {
  es: 'Beneficio X-Ops Ecosystem',
  en: 'X-Ops Ecosystem benefit',
};

// Note: `planDefs` below are generic pricing TIERS (Platinum/Track/Gold/Silver/
// Virtual) offered to prospective sponsors, not a list of confirmed sponsor
// companies with logos — city selection here is handled by the Madrid/Dubai/
// Both tabs (`cityModeDefs`), which already apply to whichever tier a sponsor
// picks. There's no per-company entry to attach a <SponsorFlag /> to in this
// file; that mechanism lives in Collaborators.jsx, where real, named sponsor
// logos are rendered. See SponsorFlag.jsx if a future "confirmed sponsors"
// list is added here.
//
// Names and features are localized via i18n (pricingTable.plans.<id>) —
// only the non-textual data (price, flags, metrics) lives here.
const planDefs = [
  {
    id: 'platinum',
    eurPrice: 10000,
    featured: true,
    metrics: { reach: '~15K', leads: '150+', impressions: '250K+' },
  },
  {
    id: 'track',
    eurPrice: 6000,
    track: true,
    metrics: { reach: '~10K', leads: '100+', impressions: '180K+' },
  },
  {
    id: 'gold',
    eurPrice: 3000,
    metrics: { reach: '~6K', leads: '60+', impressions: '100K+' },
  },
  {
    id: 'silver',
    eurPrice: 1500,
    metrics: { reach: '~3K', leads: '30+', impressions: '50K+' },
  },
  {
    id: 'virtual',
    eurPrice: 1000,
    metrics: { reach: '~2K', leads: '20+', impressions: '30K+' },
  },
];

const cityModeDefs = [
  {
    id: 'madrid',
    currencySymbol: '€',
    currencyCode: 'EUR',
    computePrice: (eur) => eur,
    subjectPrefixKey: 'madrid',
  },
  {
    id: 'dubai',
    currencySymbol: 'AED',
    currencyCode: 'AED',
    computePrice: (eur) => roundToStep(eur * EUR_TO_AED),
    subjectPrefixKey: 'dubai',
  },
  {
    id: 'both',
    currencySymbol: 'US$',
    currencyCode: 'USD',
    computePrice: (eur) => roundToStep(eur * 2 * EUR_TO_USD * (1 - COMBINED_DISCOUNT)),
    subjectPrefixKey: 'both',
  },
];

const renderPrice = (symbol, amount) => (
  <div className="sponsor-tiers__price">
    <span className="sponsor-tiers__price-sign">{symbol}</span>
    <span className="sponsor-tiers__price-amount">{formatNumber(amount)}</span>
  </div>
);

const PricingTable = () => {
  const { t, i18n } = useTranslation();
  const [activeModeId, setActiveModeId] = useState(cityModeDefs[0].id);
  const language = i18n.resolvedLanguage?.toLowerCase().startsWith('en') ? 'en' : 'es';

  const cityModes = cityModeDefs.map((mode) => ({
    ...mode,
    label: t(`pricingTable.cityTabs.${mode.id}`),
    copy: t(`pricingTable.cityCopy.${mode.id}`),
    subjectPrefix: t(`pricingTable.citySubject.${mode.subjectPrefixKey}`),
  }));

  const normalizeFeature = (feature) => {
    if (/bug bounty/i.test(feature)) {
      return language === 'en'
        ? 'X-Ops BugBounty by Grayback included'
        : 'X-Ops BugBounty by Grayback incluido';
    }
    return feature;
  };

  const plans = planDefs.map((plan) => ({
    ...plan,
    name: t(`pricingTable.plans.${plan.id}.name`),
    features: t(`pricingTable.plans.${plan.id}.features`, { returnObjects: true }).map(normalizeFeature),
    ecosystemBenefit: ecosystemBenefits[language][plan.id],
  }));

  const activeMode = cityModes.find((mode) => mode.id === activeModeId) || cityModes[0];
  const featuredPlan = plans.find((plan) => plan.featured);
  const trackPlan = plans.find((plan) => plan.track);
  const standardPlans = plans.filter((plan) => !plan.featured && !plan.track);

  // Estimated reach/leads/impressions per tier — not measured, so always
  // labelled "(est.)" to the visitor.
  const renderMetrics = (metrics) => (
    <div className="sponsor-tiers__metrics">
      <div className="sponsor-tiers__metric">
        <span className="sponsor-tiers__metric-num">{metrics.reach}</span>
        <span className="sponsor-tiers__metric-label">{t('pricingTable.metrics.reach')}</span>
      </div>
      <div className="sponsor-tiers__metric">
        <span className="sponsor-tiers__metric-num">{metrics.leads}</span>
        <span className="sponsor-tiers__metric-label">{t('pricingTable.metrics.leads')}</span>
      </div>
      <div className="sponsor-tiers__metric">
        <span className="sponsor-tiers__metric-num">{metrics.impressions}</span>
        <span className="sponsor-tiers__metric-label">{t('pricingTable.metrics.impressions')}</span>
      </div>
      <span className="sponsor-tiers__metrics-note">{t('pricingTable.metrics.estimateNote')}</span>
    </div>
  );

  const renderEcosystemBenefit = (plan, accent = 'slate') => (
    <div className={`sponsor-tiers__ecosystem-benefit sponsor-tiers__ecosystem-benefit--${accent}`}>
      <span>{ecosystemBenefitLabels[language]}</span>
      <strong>{plan.ecosystemBenefit}</strong>
    </div>
  );

  const mailtoHref = (planName) =>
    `mailto:${CONTACT_EMAIL}?subject=${t('pricingTable.subjectPrefix')} ${activeMode.subjectPrefix} ${planName}`;

  return (
    <section className="sponsor-tiers" id="patrocinio" aria-labelledby="sponsor-tiers-heading">
      <div className="sponsor-tiers__container">
        <header className="sponsor-tiers__header">
          <h2 id="sponsor-tiers-heading" className="sponsor-tiers__title">
            {t('pricingTable.title')}
          </h2>
          <p className="sponsor-tiers__subtitle">
            {t('pricingTable.subtitle')}
          </p>
          <div className="sponsor-tiers__city-tabs" role="tablist" aria-label={t('pricingTable.cityTabsAriaLabel')}>
            {cityModes.map((mode) => (
              <button
                key={mode.id}
                type="button"
                className={`sponsor-tiers__city-tab${activeMode.id === mode.id ? ' sponsor-tiers__city-tab--active' : ''}`}
                onClick={() => setActiveModeId(mode.id)}
                role="tab"
                aria-selected={activeMode.id === mode.id}
              >
                {mode.label}
              </button>
            ))}
          </div>
          <p className="sponsor-tiers__city-copy">
            {activeMode.copy}
          </p>
          <p className="sponsor-tiers__city-note">
            {t('pricingTable.cityNote', {
              aed: EUR_TO_AED.toFixed(2),
              usd: EUR_TO_USD.toFixed(2),
              step: ROUND_STEP,
            })}
          </p>
        </header>

        {featuredPlan && (
          <AnimationWrapper animation="fade-up" duration={800}>
            <div className="sponsor-tiers__featured">
              <div className="sponsor-tiers__featured-inner">
                <div className="sponsor-tiers__tier-side">
                  <span className="sponsor-tiers__tier-label sponsor-tiers__tier-label--gold">{featuredPlan.name}</span>
                  {renderPrice(activeMode.currencySymbol, activeMode.computePrice(featuredPlan.eurPrice))}
                  <span className="sponsor-tiers__price-sub">{t('pricingTable.priceSub', { currency: activeMode.currencyCode })}</span>
                  {renderEcosystemBenefit(featuredPlan, 'gold')}
                  <a
                    href={mailtoHref(featuredPlan.name)}
                    className="sponsor-tiers__cta sponsor-tiers__cta--gold"
                    aria-label={t('pricingTable.contactAriaLabel', { plan: featuredPlan.name, city: activeMode.subjectPrefix })}
                  >
                    {t('pricingTable.cta')}
                  </a>
                </div>
                <ul className="sponsor-tiers__features sponsor-tiers__features--grid" aria-label={t('pricingTable.featuresAriaLabel', { plan: featuredPlan.name })}>
                  {featuredPlan.features.map((feature) => (
                    <li key={feature} className="sponsor-tiers__feature">
                      <BsCheckCircleFill className="sponsor-tiers__check sponsor-tiers__check--gold" aria-hidden="true" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {featuredPlan.metrics && renderMetrics(featuredPlan.metrics)}
            </div>
          </AnimationWrapper>
        )}

        {trackPlan && (
          <AnimationWrapper animation="fade-up" duration={800}>
            <div className="sponsor-tiers__track-wrap">
              <div className="sponsor-tiers__track">
                <div className="sponsor-tiers__exclusive-badge" aria-label={t('pricingTable.exclusiveBadgeAriaLabel')}>
                  <BsStar aria-hidden="true" />
                  {t('pricingTable.exclusiveBadge')}
                </div>
                <div className="sponsor-tiers__featured-inner">
                  <div className="sponsor-tiers__tier-side">
                    <span className="sponsor-tiers__tier-label sponsor-tiers__tier-label--cyan">{trackPlan.name}</span>
                    {renderPrice(activeMode.currencySymbol, activeMode.computePrice(trackPlan.eurPrice))}
                    <span className="sponsor-tiers__price-sub">{t('pricingTable.priceSub', { currency: activeMode.currencyCode })}</span>
                    {renderEcosystemBenefit(trackPlan, 'cyan')}
                    <a
                      href={mailtoHref(trackPlan.name)}
                      className="sponsor-tiers__cta sponsor-tiers__cta--outline"
                      aria-label={t('pricingTable.contactAriaLabel', { plan: trackPlan.name, city: activeMode.subjectPrefix })}
                    >
                      {t('pricingTable.cta')}
                    </a>
                  </div>
                  <ul className="sponsor-tiers__features" aria-label={t('pricingTable.featuresAriaLabel', { plan: trackPlan.name })}>
                    {trackPlan.features.map((feature) => (
                      <li key={feature} className="sponsor-tiers__feature">
                        <BsCheckCircleFill className="sponsor-tiers__check sponsor-tiers__check--cyan" aria-hidden="true" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                {trackPlan.metrics && renderMetrics(trackPlan.metrics)}
              </div>
            </div>
          </AnimationWrapper>
        )}

        <div className="sponsor-tiers__standard-row">
          {standardPlans.map((plan) => (
            <AnimationWrapper key={plan.id} animation="fade-up" duration={800}>
              <div className={`sponsor-tiers__card sponsor-tiers__card--${plan.id}`}>
                <span className={`sponsor-tiers__tier-label sponsor-tiers__tier-label--${plan.id === 'gold' ? 'amber' : 'slate'}`}>
                  {plan.name}
                </span>
                {renderPrice(activeMode.currencySymbol, activeMode.computePrice(plan.eurPrice))}
                <span className="sponsor-tiers__price-sub">{t('pricingTable.priceSub', { currency: activeMode.currencyCode })}</span>
                {renderEcosystemBenefit(plan, plan.id === 'gold' ? 'cyan' : 'slate')}
                <ul className="sponsor-tiers__features" aria-label={t('pricingTable.featuresAriaLabel', { plan: plan.name })}>
                  {plan.features.map((feature) => (
                    <li key={feature} className="sponsor-tiers__feature">
                      <BsCheckCircleFill
                        className={`sponsor-tiers__check sponsor-tiers__check--${plan.id === 'gold' ? 'cyan-dim' : 'slate'}`}
                        aria-hidden="true"
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                {plan.metrics && renderMetrics(plan.metrics)}
                <a
                  href={mailtoHref(plan.name)}
                  className="sponsor-tiers__cta sponsor-tiers__cta--muted"
                  aria-label={t('pricingTable.contactAriaLabel', { plan: plan.name, city: activeMode.subjectPrefix })}
                >
                  {t('pricingTable.cta')}
                </a>
              </div>
            </AnimationWrapper>
          ))}
        </div>

        {/* Startup Pack — its own tier card (turquoise accent, matching
            StartupPack.css) rather than a plain text box, so it reads as a
            sponsorship tier like the ones above instead of an afterthought. */}
        <div className="sponsor-tiers__card sponsor-tiers__card--startup">
          <span className="sponsor-tiers__tier-label sponsor-tiers__tier-label--startup">
            {t('pricingTable.startupPack.label')}
          </span>
          <div className="sponsor-tiers__price">
            <span className="sponsor-tiers__price-amount">€350–€950</span>
          </div>
          <span className="sponsor-tiers__price-sub">{t('pricingTable.startupPack.priceSub')}</span>
          <ul className="sponsor-tiers__features" aria-label={t('pricingTable.startupPack.featuresAriaLabel')}>
            {t('pricingTable.startupPack.features', { returnObjects: true }).map((feature) => (
              <li key={feature} className="sponsor-tiers__feature">
                <BsCheckCircleFill className="sponsor-tiers__check sponsor-tiers__check--startup" aria-hidden="true" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <p className="sponsor-tiers__startup-eligibility">
            {t('pricingTable.startupPack.eligibility')}
          </p>
          <Link to="/startup-pack" className="sponsor-tiers__cta sponsor-tiers__cta--startup">
            {t('pricingTable.startupPack.cta')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default PricingTable;
