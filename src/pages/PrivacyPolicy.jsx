import React from 'react';
import { useLocation } from 'react-router-dom';
import LegalDocument from '../legal/LegalDocument';
import { privacyContent } from '../legal/privacyContent';
import { resolveLegalEdition } from '../legal/identity';

export default function PrivacyPolicy() {
  const { pathname } = useLocation();
  const edition = resolveLegalEdition(pathname, typeof window !== 'undefined' ? window.location.hostname : '');
  return <LegalDocument document={privacyContent[edition]} />;
}
