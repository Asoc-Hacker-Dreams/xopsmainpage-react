import React from 'react';

// Emoji per city slug — kept in sync with src/data/cityEvents.js flags
// (🇪🇸 Madrid, 🇦🇪 Dubai).
const CITY_FLAGS = {
  madrid: '🇪🇸',
  dubai: '🇦🇪',
};

/**
 * Renders a small cluster of country-flag emojis next to a sponsor logo,
 * indicating which cities that sponsor is active in.
 *
 * Only renders when the sponsor is confirmed in MORE THAN ONE city — a
 * single-city sponsor (today, effectively all of them) shows no flag at
 * all, so we don't add visual noise until there's an actual multi-city
 * sponsor to call out.
 */
const SponsorFlag = ({ cities = [] }) => {
  if (!Array.isArray(cities) || cities.length <= 1) return null;

  return (
    <span
      className="sponsor-flags"
      style={{ display: 'inline-flex', gap: '4px', marginLeft: '8px', verticalAlign: 'middle' }}
      aria-label={`Patrocinador en ${cities.join(', ')}`}
    >
      {cities.map((city) => (
        <span key={city} className="sponsor-flags__flag" style={{ fontSize: '1.2rem' }} role="img" aria-hidden="true">
          {CITY_FLAGS[city] || ''}
        </span>
      ))}
    </span>
  );
};

export default SponsorFlag;
