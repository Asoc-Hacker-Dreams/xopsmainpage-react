// Sponsors data for X-Ops Summit
import type { Sponsor } from './types';

export const sponsors: Sponsor[] = [
  // Platinum sponsors
  {
    id: 'platinum-1',
    name: 'TechCorp Global',
    tier: 'platinum',
    logoUrl: '/assets/sponsors/techcorp.png',
    websiteUrl: 'https://techcorp.example.com',
    description: 'Líder global en soluciones cloud y DevOps',
  },
  {
    id: 'platinum-2',
    name: 'CloudNine Solutions',
    tier: 'platinum',
    logoUrl: '/assets/sponsors/cloudnine.png',
    websiteUrl: 'https://cloudnine.example.com',
    description: 'Infraestructura cloud empresarial',
  },
  // Gold sponsors
  {
    id: 'gold-1',
    name: 'DevOps Masters',
    tier: 'gold',
    logoUrl: '/assets/sponsors/devopsmasters.png',
    websiteUrl: 'https://devopsmasters.example.com',
    description: 'Consultoría DevOps y automatización',
  },
  {
    id: 'gold-2',
    name: 'Security First',
    tier: 'gold',
    logoUrl: '/assets/sponsors/securityfirst.png',
    websiteUrl: 'https://securityfirst.example.com',
    description: 'Ciberseguridad empresarial',
  },
  {
    id: 'gold-3',
    name: 'Kube Experts',
    tier: 'gold',
    logoUrl: '/assets/sponsors/kubeexperts.png',
    websiteUrl: 'https://kubeexperts.example.com',
    description: 'Especialistas en Kubernetes',
  },
  // Silver sponsors
  {
    id: 'silver-1',
    name: 'Agile Tools',
    tier: 'silver',
    logoUrl: '/assets/sponsors/agiletools.png',
    websiteUrl: 'https://agiletools.example.com',
    description: 'Herramientas para equipos ágiles',
  },
  {
    id: 'silver-2',
    name: 'Monitoring Pro',
    tier: 'silver',
    logoUrl: '/assets/sponsors/monitoringpro.png',
    websiteUrl: 'https://monitoringpro.example.com',
    description: 'Observabilidad y monitoring',
  },
  {
    id: 'silver-3',
    name: 'CI/CD Solutions',
    tier: 'silver',
    logoUrl: '/assets/sponsors/cicdsolutions.png',
    websiteUrl: 'https://cicdsolutions.example.com',
    description: 'Pipelines y automatización',
  },
  {
    id: 'silver-4',
    name: 'Container Hub',
    tier: 'silver',
    logoUrl: '/assets/sponsors/containerhub.png',
    websiteUrl: 'https://containerhub.example.com',
    description: 'Registries y orquestación',
  },
];

export const getSponsorsByTier = (tier: Sponsor['tier']): Sponsor[] => {
  return sponsors.filter((s) => s.tier === tier);
};

export const getAllSponsors = (): Sponsor[] => {
  return sponsors;
};
