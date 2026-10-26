import React from 'react';
import LegalDocument from '../legal/LegalDocument';
import { noticesContent } from '../legal/noticesContent';

export default function CookiePolicy() {
  return <LegalDocument document={noticesContent.cookies} />;
}
