import { useTranslation } from 'react-i18next';
import './LanguageSwitcher.css';

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  const languages = [
    { code: 'es', label: 'Español', flag: '🇪🇸' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ];

  const currentLang = languages.find((l) => l.code === i18n.language) || languages[0];

  const switchLanguage = (langCode) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem('language', langCode);
  };

  return (
    <div className="language-switcher">
      <button className="language-switcher-btn" title={t('language.label')}>
        <span className="language-flag">{currentLang.flag}</span>
        <span className="language-code">{currentLang.code.toUpperCase()}</span>
      </button>
      <div className="language-dropdown">
        {languages.map((lang) => (
          <button
            key={lang.code}
            className={`language-option ${lang.code === i18n.language ? 'active' : ''}`}
            onClick={() => switchLanguage(lang.code)}
          >
            <span className="language-flag">{lang.flag}</span>
            <span>{lang.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSwitcher;
