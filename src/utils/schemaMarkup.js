// Schema markup generators para X-Ops Conference
// Estos esquemas ayudan a Google y otros motores a entender mejor el contenido

export const generateEventSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Event",
  "name": "X-Ops Conference Madrid 2025",
  "description": "Conferencia internacional sobre DevOps, DevSecOps, AIOps, MLOps y tecnologías X-Ops. El evento líder en España para profesionales y líderes técnicos.",
  "startDate": "2025-11-21T09:00:00+01:00",
  "endDate": "2025-11-22T18:00:00+01:00",
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/MixedEventAttendanceMode",
  "location": {
    "@type": "Place",
    "name": "Universidad Rey Juan Carlos - Campus Móstoles",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Calle Tulipan, s/n",
      "addressLocality": "Móstoles",
      "addressRegion": "Madrid",
      "postalCode": "28933",
      "addressCountry": "ES"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": "40.3305",
      "longitude": "-3.8840"
    }
  },
  "image": [
    "https://xopsconference.com/assets/xops-conference-2025.jpg",
    "https://xopsconference.com/assets/madrid-venue.jpg"
  ],
  "organizer": {
    "@type": "Organization",
    "name": "X-Ops Conference",
    "url": "https://xopsconference.com",
    "logo": "https://xopsconference.com/assets/xops-logo.png",
    "email": "info@xopsconference.com",
    "telephone": "+34744644873",
    "sameAs": [
      "https://twitter.com/XopsConference",
      "https://www.linkedin.com/company/101439409",
      "https://www.instagram.com/xops_conference"
    ]
  },
  "performer": [
    {
      "@type": "Person",
      "name": "Ponentes Internacionales X-Ops",
      "description": "Expertos en DevOps, DevSecOps, AIOps, MLOps y tecnologías emergentes"
    }
  ],
  "offers": {
    "@type": "Offer",
    "name": "Entrada X-Ops Conference 2025",
    "url": "https://www.eventbrite.ch/e/entradas-x-ops-conference-madrid-2025-1306767269079",
    "price": "0",
    "priceCurrency": "EUR",
    "availability": "https://schema.org/InStock",
    "validFrom": "2025-01-01T00:00:00+01:00"
  },
  "inLanguage": ["es", "en"],
  "maximumAttendeeCapacity": 600,
  "typicalAgeRange": "25-55",
  "audience": {
    "@type": "Audience",
    "audienceType": "Profesionales IT, DevOps Engineers, SRE, Arquitectos Cloud, CTOs, Líderes Técnicos"
  },
  "keywords": [
    "DevOps", "DevSecOps", "AIOps", "MLOps", "GitOps", "SecOps", 
    "SRE", "Cloud Architecture", "Kubernetes", "Terraform", 
    "CI/CD", "Infrastructure as Code", "Security", "Automation",
    "Madrid", "Conferencia", "Tecnología", "2025"
  ]
});

export const generateOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "X-Ops Conference",
  "alternateName": "XOps Conference",
  "url": "https://xopsconference.com",
  "logo": "https://xopsconference.com/assets/xops-logo.png",
  "description": "Organización líder en eventos X-Ops, DevOps, DevSecOps, AIOps y MLOps en España y Europa.",
  "email": "info@xopsconference.com",
  "telephone": "+34744644873",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Madrid",
    "addressRegion": "Madrid",
    "addressCountry": "ES"
  },
  "sameAs": [
    "https://twitter.com/XopsConference",
    "https://www.linkedin.com/company/101439409",
    "https://www.instagram.com/xops_conference",
    "https://t.me/xopscon",
    "https://linktr.ee/xopscon"
  ],
  "foundingDate": "2023",
  "knowsAbout": [
    "DevOps", "DevSecOps", "AIOps", "SecOps", "MLOps", "GitOps", 
    "Site Reliability Engineering", "Cloud Computing",
    "Infrastructure as Code", "Continuous Integration",
    "Continuous Deployment", "Security Automation"
  ],
  "memberOf": {
    "@type": "Organization",
    "name": "Comunidad DevOps España"
  }
});

export const generateWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "X-Ops Conference",
  "alternateName": "X-Ops Conference Madrid",
  "url": "https://xopsconference.com",
  "description": "Sitio oficial de la X-Ops Conference Madrid - El evento líder en DevOps, DevSecOps, AIOps y MLOps en España",
  "inLanguage": "es",
  "copyrightYear": "2025",
  "copyrightHolder": {
    "@type": "Organization",
    "name": "X-Ops Conference"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://xopsconference.com/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  },
  "publisher": {
    "@type": "Organization",
    "name": "X-Ops Conference",
    "logo": {
      "@type": "ImageObject",
      "url": "https://xopsconference.com/assets/xops-logo.png"
    }
  }
});

export const generateBreadcrumbSchema = (breadcrumbs) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((crumb, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": crumb.name,
    "item": crumb.url
  }))
});

export const generatePersonSchema = (speaker) => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "name": speaker.name,
  "jobTitle": speaker.jobTitle,
  "description": speaker.bio,
  "image": speaker.image,
  "worksFor": {
    "@type": "Organization",
    "name": speaker.company
  },
  "knowsAbout": speaker.expertise || [],
  "sameAs": speaker.socialLinks || [],
  "alumniOf": speaker.education || [],
  "award": speaker.awards || []
});

export const generateSponsorshipOfferSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Offer",
  "name": "Patrocinio X-Ops Conference 2025",
  "description": "Oportunidades de patrocinio para empresas tecnológicas en la X-Ops Conference Madrid 2025. Conecta con más de 600 profesionales de DevOps, DevSecOps, AIOps y MLOps.",
  "url": "https://xopsconference.com/patrocinadores",
  "seller": {
    "@type": "Organization",
    "name": "X-Ops Conference"
  },
  "category": "Patrocinio Tecnológico",
  "businessFunction": "http://purl.org/goodrelations/v1#Sell",
  "availableAtOrFrom": {
    "@type": "Place",
    "name": "Madrid, España"
  },
  "priceSpecification": [
    {
      "@type": "PriceSpecification",
      "name": "Patrocinio Virtual",
      "description": "Presencia digital completa",
      "eligibleQuantity": {
        "@type": "QuantitativeValue",
        "minValue": 1500
      }
    },
    {
      "@type": "PriceSpecification", 
      "name": "Patrocinio Silver",
      "description": "Stand físico 2x2m + beneficios digitales",
      "eligibleQuantity": {
        "@type": "QuantitativeValue",
        "minValue": 2000
      }
    },
    {
      "@type": "PriceSpecification",
      "name": "Patrocinio Gold", 
      "description": "Stand premium + charla técnica 45min",
      "eligibleQuantity": {
        "@type": "QuantitativeValue",
        "minValue": 3000
      }
    },
    {
      "@type": "PriceSpecification",
      "name": "Patrocinio Track", 
      "description": "Stand premium + charla técnica 45min + track sponsor",
      "eligibleQuantity": {
        "@type": "QuantitativeValue",
        "minValue": 6000
      }
    },
    {
      "@type": "PriceSpecification",
      "name": "Patrocinio Platinum", 
      "description": "Stand premium + charla técnica 45min + workshop +1h + track sponsor + visibilidad destacada",
      "eligibleQuantity": {
        "@type": "QuantitativeValue",
        "minValue": 8000
      }
    }
  ],
  "audience": {
    "@type": "Audience",
    "audienceType": "Empresas tecnológicas, startups, consultoras IT, proveedores de software"
  }
});
