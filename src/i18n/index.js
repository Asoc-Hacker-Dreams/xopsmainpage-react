import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import es from './locales/es.json';
import en from './locales/en.json';

const withCurrentDubaiSchedule = (translations, language) => {
  const isEnglish = language === 'en';

  return {
    ...translations,
    hero: {
      ...translations.hero,
      date: isEnglish
        ? 'Madrid: 19–21 Nov · Dubai: 1–3 Dec 2026'
        : 'Madrid: 19, 20 y 21 Nov · Dubai: 1, 2 y 3 Dic 2026',
    },
    editions: {
      ...translations.editions,
      dubai: {
        ...translations.editions.dubai,
        dates: isEnglish ? 'DEC 1 · 2 · 3' : '1 · 2 · 3 DIC',
        summit: {
          ...translations.editions.dubai.summit,
          dates: isEnglish ? 'December 1' : '1 de diciembre',
        },
        conference: {
          ...translations.editions.dubai.conference,
          dates: isEnglish ? 'December 2 & 3' : '2 y 3 de diciembre',
        },
      },
    },
    ubication: {
      ...translations.ubication,
      dubai: {
        ...translations.ubication.dubai,
        label: isEnglish
          ? 'X-Ops Dubai · December 1–3'
          : 'X-Ops Dubai · 1 a 3 de diciembre',
      },
    },
    themes: {
      ...translations.themes,
      card2: {
        ...translations.themes.card2,
        text: isEnglish
          ? 'X-Ops Conference Madrid 2026 takes place on 20 and 21 November at the Universidad Rey Juan Carlos Auditorium, Móstoles Campus. X-Ops Dubai 2026 runs 1–3 December. The agenda covers automation, continuous integration, continuous delivery, monitoring and secure architectures.'
          : 'X-Ops Conference Madrid 2026 se celebra los días 20 y 21 de noviembre en el Auditorio de la Universidad Rey Juan Carlos, campus Móstoles. X-Ops Dubai 2026 se celebra del 1 al 3 de diciembre. La agenda cubre automatización, integración continua, entrega continua, monitoreo y arquitecturas seguras.',
      },
    },
  };
};

const resources = {
  es: { translation: withCurrentDubaiSchedule(es, 'es') },
  en: { translation: withCurrentDubaiSchedule(en, 'en') }
};

// Get saved language from localStorage or default to Spanish
const savedLanguage = localStorage.getItem('language') || 'es';

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: savedLanguage,
    fallbackLng: 'es',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
