import React from 'react';
import { useTranslation } from 'react-i18next';
import CookiePreferencesDialog from './CookiePreferencesDialog';

export default function CookiePreferencesManager({ show, onHide }) {
  const { i18n } = useTranslation();
  return <CookiePreferencesDialog show={show} onHide={onHide} language={i18n.resolvedLanguage || i18n.language || 'es'} />;
}
