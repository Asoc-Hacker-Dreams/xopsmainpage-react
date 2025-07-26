import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  generateEventSchema, 
  generateOrganizationSchema, 
  generateWebsiteSchema,
  generateSponsorshipOfferSchema 
} from '../utils/schemaMarkup';

const useDynamicSEO = () => {
  const location = useLocation();

  const seoData = useMemo(() => {
    const pathname = location.pathname;
    
    const seoConfigs = {
      '/': {
        title: 'DevOps Conference Madrid 2025 | X-Ops Conference - DevSecOps, AIOps, MLOps',
        description: 'Conferencia internacional sobre DevOps, DevSecOps, AIOps y MLOps. 21-22 noviembre 2025 en Madrid. Más de 600 profesionales esperados. Universidad Rey Juan Carlos.',
        keywords: 'DevOps conference Madrid, DevSecOps, AIOps, MLOps, GitOps, SRE, conferencia tecnología España, X-Ops 2025',
        structuredData: {
          "@context": "https://schema.org",
          "@graph": [
            generateEventSchema(),
            generateOrganizationSchema(),
            generateWebsiteSchema()
          ]
        }
      },
      '/ponentes': {
        title: 'Ponentes DevOps Madrid 2025 | Speakers X-Ops Conference - Expertos DevSecOps',
        description: 'Conoce a los expertos internacionales en DevOps, DevSecOps, AIOps y MLOps que participarán en X-Ops Conference 2025. Líderes técnicos y profesionales de élite.',
        keywords: 'ponentes DevOps Madrid, speakers DevSecOps, expertos AIOps, MLOps professionals, conferencias Madrid',
        structuredData: {
          "@context": "https://schema.org",
          "@type": "Person",
          "name": "Ponentes X-Ops Conference",
          "description": "Expertos internacionales en X-Ops technologies"
        }
      },
      '/agenda': {
        title: 'Agenda DevOps Conference Madrid 2025 | Programa X-Ops - Charlas DevSecOps',
        description: 'Programa completo de charlas, talleres y keynotes sobre DevOps, DevSecOps, AIOps y MLOps en Madrid. 21-22 noviembre 2025, Universidad Rey Juan Carlos.',
        keywords: 'agenda DevOps Madrid, programa conferencia, charlas DevSecOps, talleres AIOps, keynotes MLOps',
        structuredData: {
          "@context": "https://schema.org",
          "@type": "EventSchedule",
          "name": "Agenda X-Ops Conference 2025"
        }
      },
      '/organizers': {
        title: 'Organizadores X-Ops Conference',
        description: 'Conoce al equipo organizador de la X-Ops Conference 2025, líderes en la comunidad DevOps y tecnología.',
        keywords: 'organizadores, equipo, team, DevOps community, Madrid tech',
        structuredData: {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "Equipo Organizador X-Ops Conference"
        }
      },
      '/patrocinadores': {
        title: 'Patrocinio DevOps Conference Madrid | Sponsors X-Ops 2025 - Marketing Tecnológico',
        description: 'Conviértete en patrocinador de X-Ops Conference 2025. Conecta con más de 600 profesionales de DevOps, DevSecOps, AIOps y MLOps. Oportunidades de marketing tech.',
        keywords: 'patrocinio DevOps Madrid, sponsors conferencia tecnología, marketing DevSecOps, patrocinadores AIOps MLOps',
        structuredData: {
          "@context": "https://schema.org",
          "@graph": [
            generateSponsorshipOfferSchema(),
            generateOrganizationSchema()
          ]
        }
      },
      '/faq': {
        title: 'FAQ Patrocinadores DevOps | Preguntas Sponsors X-Ops Madrid 2025',
        description: 'Encuentra respuestas sobre patrocinio, stands, charlas técnicas, canales de comunicación y beneficios de la X-Ops Conference 2025 en Madrid.',
        keywords: 'FAQ patrocinadores DevOps, preguntas sponsors Madrid, patrocinio conferencia tecnología, stands DevSecOps',
        structuredData: {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "name": "FAQ Patrocinadores X-Ops Conference"
        }
      },
      '/colaboradores': {
        title: 'Colaboradores X-Ops Conference 2025',
        description: 'Comunidades y organizaciones que colaboran con X-Ops Conference 2025 para impulsar el ecosistema DevOps.',
        keywords: 'colaboradores, partners, comunidades DevOps, organizaciones tech Madrid'
      },
      '/ubicacion': {
        title: 'Ubicación X-Ops Conference 2025',
        description: 'X-Ops Conference 2025 se celebra en la Universidad Rey Juan Carlos, campus Móstoles, Madrid. Información de acceso y transporte.',
        keywords: 'ubicación, localización, URJC, Móstoles, Madrid, transporte, acceso'
      }
    };

    return seoConfigs[pathname] || seoConfigs['/'];
  }, [location.pathname]);

  return seoData;
};

export default useDynamicSEO;
