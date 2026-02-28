import type { Speaker } from '../dal/types';

function slug(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '').slice(0, 60);
}

export const speakers2025: Speaker[] = [
  { id: slug('Luis Guirigay'), name: 'Luis Guirigay', company: 'AWS', role: 'Worldwide Head of Cloud Infrastructure Solutions' },
  { id: slug('Rossana Suarez'), name: 'Rossana Suarez', company: 'naranjax', role: 'Tech Lead DevOps' },
  { id: slug('Juan Vicente Herrera Ruiz de Alejo'), name: 'Juan Vicente Herrera Ruiz de Alejo', company: 'Red Hat', role: 'Cloud Architect' },
  { id: slug('Shani Adadi Kazaz'), name: 'Shani Adadi Kazaz', company: 'AWS', role: 'Senior Containers & Serverless GTM Specialist' },
  { id: slug('Alejandro de la Hoz Martin'), name: 'Alejandro de la Hoz Martin', company: 'Red Hat', role: 'Senior Consultant' },
  { id: slug('Alberto Morgante'), name: 'Alberto Morgante', company: 'SUSE', role: 'Principal Telco Edge Engineer' },
  { id: slug('Pablo Sánchez Carmona'), name: 'Pablo Sánchez Carmona', company: 'AWS', role: 'Senior Network Specialist Solutions Architect' },
  { id: slug('Antonio Berben'), name: 'Antonio Berben', company: 'Solo.io', role: 'Principal Solutions Engineer' },
  { id: slug('Felipe Vicens'), name: 'Felipe Vicens', role: 'Telco Cloud Architect' },
  { id: slug('Carlos Villanúa'), name: 'Carlos Villanúa', company: 'Traefik Labs', role: 'Solutions Architect' },
  { id: slug('Mani Ghelichkhani'), name: 'Mani Ghelichkhani', company: 'AWS', role: 'Senior Cloud Operations Architect' },
  { id: slug('Cleyra Uzcategui'), name: 'Cleyra Uzcategui', company: 'JP Morgan & Chase Co.', role: 'Software Engineer' },
  { id: slug('Sara San Luís Rodríguez'), name: 'Sara San Luís Rodríguez', company: 'MDW', role: 'AI Team Lead' },
  { id: slug('Christian Carballo Lozano'), name: 'Christian Carballo Lozano', company: 'Plain Concepts', role: 'AI Engineer' },
  { id: slug('Dachi Gogotchuri'), name: 'Dachi Gogotchuri', company: 'Nationale Nederlanden Spain', role: 'Platform Engineering Lead' },
  { id: slug('Carlos Polop'), name: 'Carlos Polop', company: 'HackTricks Training', role: 'Co-Founder' },
  { id: slug('Patricia Rodríguez Vaquero'), name: 'Patricia Rodríguez Vaquero', company: 'MDW', role: 'Senior Data Engineer' },
  { id: slug('Almudena Zhou Ramírez López'), name: 'Almudena Zhou Ramírez López', company: 'MDW', role: 'Senior AI Engineer' },
  { id: slug('Verónica Rivas Remiseiro'), name: 'Verónica Rivas Remiseiro', role: 'Microsoft MVP M365 Copilot' },
  { id: slug('Toni Granell'), name: 'Toni Granell', role: 'Microsoft MVP & MVS' },
  { id: slug('Ignacio Dominguez'), name: 'Ignacio Dominguez', company: 'Circle', role: 'Cloud Security Engineer' },
  { id: slug('Jeff Fan'), name: 'Jeff Fan', company: 'DigitalOcean', role: 'Senior Solutions Architect' },
  { id: slug('Jose Gómez-Sellés'), name: 'Jose Gómez-Sellés', company: 'VictoriaMetrics', role: 'Product Lead' },
  { id: slug('Juarez Junior'), name: 'Juarez Junior', company: 'Oracle', role: 'Sr Principal Developer Evangelist' },
  { id: slug('José Enrique Calderón Sanz'), name: 'José Enrique Calderón Sanz', company: 'JP Morgan Chase', role: 'Lead Software Engineer' },
  { id: slug('David Amorín García'), name: 'David Amorín García', company: 'MDW', role: 'Analista de Inteligencia Empresarial' },
  { id: slug('Gisela Torres'), name: 'Gisela Torres', company: 'Microsoft', role: 'Sr. Global Blackbelt' },
  { id: slug('David Reguera García'), name: 'David Reguera García', role: 'Hardware Hacking Expert' },
  { id: slug('Alberto Lobato'), name: 'Alberto Lobato', role: 'OT Cybersecurity Expert' },
  { id: slug('David Sastre'), name: 'David Sastre', company: 'Nexthink', role: 'Staff Product Security Engineer' },
];
