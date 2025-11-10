import React, { useState, useEffect } from 'react';
import { getSponsors } from '../data/dal.sponsors';
import type { Sponsor } from '../types/sponsor';

/**
 * Example component showing how to use the Sponsors DAL
 * 
 * This component demonstrates:
 * - Loading sponsors from the DAL
 * - Offline support (data loads from cache)
 * - Stale-while-revalidate pattern (instant load with background refresh)
 */
const SponsorsExample = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const loadSponsors = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Call the DAL - this will return cached data immediately if available
        // and trigger background revalidation if the cache is stale
        const data = await getSponsors();
        
        if (mounted) {
          setSponsors(data);
          setLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Error loading sponsors');
          setLoading(false);
        }
      }
    };

    loadSponsors();

    return () => {
      mounted = false;
    };
  }, []);

  if (loading && sponsors.length === 0) {
    return <div className="sponsors-loading">Cargando patrocinadores...</div>;
  }

  if (error && sponsors.length === 0) {
    return <div className="sponsors-error">Error: {error}</div>;
  }

  // Group sponsors by tier
  const sponsorsByTier = sponsors.reduce((acc, sponsor) => {
    if (!acc[sponsor.tier]) {
      acc[sponsor.tier] = [];
    }
    acc[sponsor.tier].push(sponsor);
    return acc;
  }, {} as Record<string, Sponsor[]>);

  const tierOrder = ['platinum', 'gold', 'silver', 'community'];

  return (
    <section className="sponsors-section">
      <div className="container">
        <h2 className="text-center mb-4">Nuestros Patrocinadores</h2>
        
        {tierOrder.map(tier => {
          const tierSponsors = sponsorsByTier[tier];
          if (!tierSponsors || tierSponsors.length === 0) return null;

          return (
            <div key={tier} className="sponsor-tier mb-5">
              <h3 className="text-center text-capitalize mb-3">
                {tier === 'platinum' && '💎 Platino'}
                {tier === 'gold' && '🥇 Oro'}
                {tier === 'silver' && '🥈 Plata'}
                {tier === 'community' && '🤝 Comunidad'}
              </h3>
              
              <div className="row justify-content-center">
                {tierSponsors.map(sponsor => (
                  <div key={sponsor.id} className="col-md-4 col-lg-3 mb-4">
                    <div className="sponsor-card text-center">
                      <a 
                        href={sponsor.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        aria-label={`Visit ${sponsor.name} website`}
                      >
                        <img 
                          src={sponsor.logoUrl} 
                          alt={sponsor.name}
                          className="sponsor-logo"
                          loading="lazy"
                        />
                      </a>
                      <h4 className="sponsor-name mt-2">{sponsor.name}</h4>
                      <p className="sponsor-description">{sponsor.shortDesc}</p>
                      
                      {sponsor.socials && sponsor.socials.length > 0 && (
                        <div className="sponsor-social mt-2">
                          {sponsor.socials.map((social, idx) => (
                            <a 
                              key={idx}
                              href={social.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className={idx > 0 ? "ms-2" : ""}
                              aria-label={`${sponsor.name} on ${social.type}`}
                            >
                              {social.type === 'x' || social.type === 'twitter' ? 'X/Twitter' : 
                               social.type === 'linkedin' ? 'LinkedIn' :
                               social.type === 'github' ? 'GitHub' : social.type}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default SponsorsExample;
