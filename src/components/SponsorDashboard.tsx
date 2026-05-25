import React, { useState, useEffect, useRef } from 'react';
import type { Sponsor } from '../dal/types';
import { IdbSponsorsDal } from '../dal/idb-dal';
import { sponsors as seedSponsors } from '../dal/sponsors';
import './SponsorDashboard.css';

const dal = new IdbSponsorsDal();

interface SponsorDashboardProps {
  onSelectSponsor?: (sponsor: Sponsor) => void;
}

type TierOrder = Record<Sponsor['tier'], number>;
const TIER_ORDER: TierOrder = {
  platinum: 1,
  gold: 2,
  silver: 3,
  bronze: 4,
  community: 5,
};

const TIER_LABELS: Record<Sponsor['tier'], string> = {
  platinum: 'Platinum',
  gold: 'Gold',
  silver: 'Silver',
  bronze: 'Bronze',
  community: 'Community',
};

const TIER_COLORS: Record<Sponsor['tier'], string> = {
  platinum: '#e5e4e2',
  gold: '#ffd700',
  silver: '#c0c0c0',
  bronze: '#cd7f32',
  community: '#4a90d9',
};

const SponsorDashboard: React.FC<SponsorDashboardProps> = ({ onSelectSponsor }) => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSponsor, setSelectedSponsor] = useState<Sponsor | null>(null);
  const [filterTier, setFilterTier] = useState<Sponsor['tier'] | 'all'>('all');
  const carouselRef = useRef<HTMLDivElement>(null);
  const [carouselPosition, setCarouselPosition] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const existing = await dal.getAllSponsors();
      if (existing.length === 0) {
        await dal.putSponsors(seedSponsors);
      }
      const all = await dal.getAllSponsors();
      if (!cancelled) {
        setSponsors(all);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const groupedSponsors = sponsors.reduce((acc, sponsor) => {
    if (!acc[sponsor.tier]) acc[sponsor.tier] = [];
    acc[sponsor.tier].push(sponsor);
    return acc;
  }, {} as Record<Sponsor['tier'], Sponsor[]>);

  const sortedTiers = Object.keys(groupedSponsors).sort(
    (a, b) => TIER_ORDER[a as Sponsor['tier']] - TIER_ORDER[b as Sponsor['tier']]
  ) as Sponsor['tier'][];

  const filteredSponsors = filterTier === 'all'
    ? sponsors
    : sponsors.filter(s => s.tier === filterTier);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = 300;
      const newPosition = direction === 'left'
        ? carouselPosition - scrollAmount
        : carouselPosition + scrollAmount;
      carouselRef.current.scrollTo({ left: newPosition, behavior: 'smooth' });
      setCarouselPosition(newPosition);
    }
  };

  const handleSponsorClick = (sponsor: Sponsor) => {
    setSelectedSponsor(sponsor);
    onSelectSponsor?.(sponsor);
  };

  const closeModal = () => {
    setSelectedSponsor(null);
  };

  if (loading) {
    return <div className="sponsor-dashboard-loading">Cargando patrocinadores...</div>;
  }

  return (
    <div className="sponsor-dashboard">
      <div className="sponsor-header">
        <h2>Nuestros Patrocinadores</h2>
        <p className="sponsor-subtitle">
          Gracias al apoyo de estas empresas, hacemos posible la X-Ops Conference
        </p>
      </div>

      {/* Tier Filter */}
      <div className="tier-filter">
        <button
          className={"tier-filter-btn" + (filterTier === 'all' ? ' active' : '')}
          onClick={() => setFilterTier('all')}
        >
          Todos
        </button>
        {sortedTiers.map(tier => (
          <button
            key={tier}
            className={"tier-filter-btn" + (filterTier === tier ? ' active' : '')}
            onClick={() => setFilterTier(tier)}
            style={{ '--tier-color': TIER_COLORS[tier] } as React.CSSProperties}
          >
            {TIER_LABELS[tier]}
          </button>
        ))}
      </div>

      {/* Logo Carousel */}
      <div className="sponsor-carousel-container">
        <button
          className="carousel-btn prev"
          onClick={() => scrollCarousel('left')}
          aria-label="Anterior"
        >
          ‹
        </button>
        <div className="sponsor-carousel" ref={carouselRef}>
          {filteredSponsors.map(sponsor => (
            <div
              key={sponsor.id}
              className="sponsor-logo-card"
              onClick={() => handleSponsorClick(sponsor)}
            >
              <div className="sponsor-logo">
                {sponsor.logoUrl ? (
                  <img src={sponsor.logoUrl} alt={sponsor.name} />
                ) : (
                  <div className="logo-placeholder">
                    {sponsor.name.charAt(0)}
                  </div>
                )}
              </div>
              <span className="tier-badge" style={{ background: TIER_COLORS[sponsor.tier] }}>
                {TIER_LABELS[sponsor.tier]}
              </span>
            </div>
          ))}
        </div>
        <button
          className="carousel-btn next"
          onClick={() => scrollCarousel('right')}
          aria-label="Siguiente"
        >
          ›
        </button>
      </div>

      {/* Sponsors by Tier */}
      <div className="sponsors-by-tier">
        {sortedTiers
          .filter(tier => filterTier === 'all' || tier === filterTier)
          .map(tier => (
            <div key={tier} className="tier-section">
              <h3 className="tier-title" style={{ color: TIER_COLORS[tier] }}>
                <span className="tier-icon">
                  {tier === 'platinum' && '💎'}
                  {tier === 'gold' && '🥇'}
                  {tier === 'silver' && '🥈'}
                  {tier === 'bronze' && '🥉'}
                  {tier === 'community' && '🤝'}
                </span>
                {TIER_LABELS[tier]} Partners
              </h3>
              <div className="tier-sponsors">
                {groupedSponsors[tier].map(sponsor => (
                  <div
                    key={sponsor.id}
                    className="sponsor-card"
                    onClick={() => handleSponsorClick(sponsor)}
                  >
                    <div className="sponsor-card-logo">
                      {sponsor.logoUrl ? (
                        <img src={sponsor.logoUrl} alt={sponsor.name} />
                      ) : (
                        <div className="logo-placeholder large">
                          {sponsor.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="sponsor-card-info">
                      <h4>{sponsor.name}</h4>
                      {sponsor.description && (
                        <p>{sponsor.description}</p>
                      )}
                    </div>
                    <span
                      className="tier-badge small"
                      style={{ background: TIER_COLORS[tier] }}
                    >
                      {TIER_LABELS[tier]}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
      </div>

      {/* Sponsor Detail Modal */}
      {selectedSponsor && (
        <div className="sponsor-modal-overlay" role="button" tabIndex={0} aria-label="Cerrar modal" onClick={closeModal} onKeyDown={(e) => e.key === 'Enter' && closeModal()}>
          <div className="sponsor-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal} aria-label="Cerrar">
              ×
            </button>
            <div className="modal-content">
              <div className="modal-header">
                <div className="modal-logo">
                  {selectedSponsor.logoUrl ? (
                    <img src={selectedSponsor.logoUrl} alt={selectedSponsor.name} />
                  ) : (
                    <div className="logo-placeholder xlarge">
                      {selectedSponsor.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="modal-title">
                  <h2>{selectedSponsor.name}</h2>
                  <span
                    className="tier-badge large"
                    style={{ background: TIER_COLORS[selectedSponsor.tier] }}
                  >
                    {TIER_LABELS[selectedSponsor.tier]} Partner
                  </span>
                </div>
              </div>
              <div className="modal-body">
                {selectedSponsor.description && (
                  <div className="modal-section">
                    <h4>Sobre {selectedSponsor.name}</h4>
                    <p>{selectedSponsor.description}</p>
                  </div>
                )}
                {selectedSponsor.websiteUrl && (
                  <div className="modal-section">
                    <h4>Website</h4>
                    <a
                      href={selectedSponsor.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="visit-website-btn"
                    >
                      Visitar sitio web →
                    </a>
                  </div>
                )}
                <div className="modal-section">
                  <h4>Beneficios de {TIER_LABELS[selectedSponsor.tier]}</h4>
                  <ul className="tier-benefits">
                    {selectedSponsor.tier === 'platinum' && (
                      <>
                        <li>Logo destacado en homepage y materiales</li>
                        <li>Stand premium en zona principal</li>
                        <li>8 pases completos para el evento</li>
                        <li>Keynote de 15 minutos</li>
                        <li>Acceso VIP networking dinner</li>
                      </>
                    )}
                    {selectedSponsor.tier === 'gold' && (
                      <>
                        <li>Logo en homepage y materiales</li>
                        <li>Stand en zona principal</li>
                        <li>5 pases completos para el evento</li>
                        <li>Slot de charla de 30 minutos</li>
                        <li>Acceso a networking event</li>
                      </>
                    )}
                    {selectedSponsor.tier === 'silver' && (
                      <>
                        <li>Logo en materiales del evento</li>
                        <li>Stand estándar</li>
                        <li>3 pases completos para el evento</li>
                        <li>Posibilidad de lightning talk</li>
                      </>
                    )}
                    {selectedSponsor.tier === 'bronze' && (
                      <>
                        <li>Logo en materiales del evento</li>
                        <li>2 pases completos para el evento</li>
                        <li>Mención en redes sociales</li>
                      </>
                    )}
                    {selectedSponsor.tier === 'community' && (
                      <>
                        <li>Logo en página de colaboradores</li>
                        <li>1 pase completo para el evento</li>
                        <li>Mención en newsletter</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SponsorDashboard;
