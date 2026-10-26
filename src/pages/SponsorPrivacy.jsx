import React from 'react';
import LegalDocument from '../legal/LegalDocument';
import { noticesContent } from '../legal/noticesContent';

export default function SponsorPrivacy() {
  return <LegalDocument document={noticesContent.sponsors} />;
}
