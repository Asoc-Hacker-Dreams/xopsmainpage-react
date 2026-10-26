import React from 'react';
import { useLocation } from 'react-router-dom';
import LegalDocument from '../legal/LegalDocument';
import { termsContent } from '../legal/termsContent';
import { resolveLegalEdition } from '../legal/identity';

export default function TermsOfService() {
  const { pathname } = useLocation();
  const edition = resolveLegalEdition(pathname, typeof window !== 'undefined' ? window.location.hostname : '');
  return <LegalDocument document={termsContent[edition]} documentType="terms" />;
}
