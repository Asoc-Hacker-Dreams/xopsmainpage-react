import { useParams, Navigate, Link } from 'react-router-dom';
import { Container, Alert, Button } from 'react-bootstrap';
import SponsorHeader from '../components/SponsorHeader';
import SponsorAbout from '../components/SponsorAbout';
import SponsorCTAs from '../components/SponsorCTAs';
import SponsorAssets from '../components/SponsorAssets';
import SEO from '../components/SEO';
import sponsorsData from '../data/sponsors.json';

const SponsorDetail = () => {
  const { slug } = useParams();
  
  // Find sponsor by slug (sponsors.json is now an array)
  const sponsor = sponsorsData.find((s) => s.slug === slug);

  // If sponsor not found, show 404
  if (!sponsor) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="warning">
          <Alert.Heading>Patrocinador no encontrado</Alert.Heading>
          <p>
            El patrocinador que buscas no existe o ha sido eliminado.
          </p>
          <hr />
          <div className="d-flex justify-content-center">
            <Link to="/Sponsor">
              <Button variant="outline-warning">
                Ver todos los patrocinadores
              </Button>
            </Link>
          </div>
        </Alert>
      </Container>
    );
  }

  // Convert socials array to object for compatibility
  const socialMedia = sponsor.socials ? sponsor.socials.reduce((acc, social) => {
    acc[social.type] = social.url;
    return acc;
  }, {}) : {};

  // Convert showcase to CTAs format
  const ctas = [];
  if (sponsor.showcase?.ctaPrimary) {
    ctas.push({
      text: sponsor.showcase.ctaPrimary.label,
      url: sponsor.showcase.ctaPrimary.href,
      type: 'primary'
    });
  }
  if (sponsor.showcase?.ctaSecondary) {
    ctas.push({
      text: sponsor.showcase.ctaSecondary.label,
      url: sponsor.showcase.ctaSecondary.href,
      type: 'secondary'
    });
  }

  // Get description (use longDesc if available, otherwise shortDesc)
  const description = sponsor.longDesc || sponsor.shortDesc;

  // Generate Schema.org Organization structured data
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": sponsor.name,
    "url": sponsor.website,
    "logo": sponsor.logoUrl,
    "description": description,
    "sameAs": sponsor.socials ? sponsor.socials.map(s => s.url) : [],
  };

  return (
    <>
      <SEO
        title={`${sponsor.name} - Patrocinador`}
        description={sponsor.shortDesc}
        path={`/sponsors/${sponsor.slug}`}
        image={sponsor.logoUrl || 'https://xopsconference.com/assets/og-default.jpg'}
        keywords={`X-Ops, ${sponsor.name}, Patrocinador, DevOps, DevSecOps, Conferencia`}
        lang="es"
        alternates={[
          { hrefLang: 'es', href: `https://xopsconference.com/sponsors/${sponsor.slug}` },
        ]}
        structuredData={organizationSchema}
      />

      <main role="main">
        <SponsorHeader
          name={sponsor.name}
          logo={sponsor.logoUrl}
          tier={sponsor.tier}
          website={sponsor.website}
        />

        <SponsorAbout
          description={description}
          socialMedia={socialMedia}
        />

        <SponsorCTAs ctas={ctas} />

        <SponsorAssets assets={sponsor.assets || []} />

        {/* Back to sponsors section */}
        <section className="py-5 text-center">
          <Container>
            <Link to="/Sponsor#patros">
              <Button variant="outline-primary" size="lg">
                ← Ver todos los patrocinadores
              </Button>
            </Link>
          </Container>
        </section>
      </main>
    </>
  );
};

export default SponsorDetail;
