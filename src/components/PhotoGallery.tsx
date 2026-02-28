import React, { useState } from 'react';
import './PhotoGallery.css';

interface Photo {
  id: string;
  url: string;
  thumbnail: string;
  caption?: string;
  category?: string;
}

// Demo photos - in production these would come from API
const demoPhotos: Photo[] = [
  { id: '1', url: '/assets/gallery/photo1.jpg', thumbnail: '/assets/gallery/thumb1.jpg', caption: 'Inauguración del evento', category: 'general' },
  { id: '2', url: '/assets/gallery/photo2.jpg', thumbnail: '/assets/gallery/thumb2.jpg', caption: 'Keynote principal', category: 'sessions' },
  { id: '3', url: '/assets/gallery/photo3.jpg', thumbnail: '/assets/gallery/thumb3.jpg', caption: 'Networking en el hall', category: 'networking' },
  { id: '4', url: '/assets/gallery/photo4.jpg', thumbnail: '/assets/gallery/thumb4.jpg', caption: 'Workshop de Kubernetes', category: 'sessions' },
  { id: '5', url: '/assets/gallery/photo5.jpg', thumbnail: '/assets/gallery/thumb5.jpg', caption: 'Stand de patrocinadores', category: 'sponsors' },
  { id: '6', url: '/assets/gallery/photo6.jpg', thumbnail: '/assets/gallery/thumb6.jpg', caption: 'Panel de expertos', category: 'sessions' },
  { id: '7', url: '/assets/gallery/photo7.jpg', thumbnail: '/assets/gallery/thumb7.jpg', caption: 'Coffee break', category: 'networking' },
  { id: '8', url: '/assets/gallery/photo8.jpg', thumbnail: '/assets/gallery/thumb8.jpg', caption: 'Clausura', category: 'general' },
];

const categories = [
  { id: 'all', label: 'Todas' },
  { id: 'general', label: 'General' },
  { id: 'sessions', label: 'Sesiones' },
  { id: 'networking', label: 'Networking' },
  { id: 'sponsors', label: 'Patrocinadores' },
];

const PhotoGallery: React.FC = () => {
  const [photos] = useState<Photo[]>(demoPhotos);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const filteredPhotos = selectedCategory === 'all'
    ? photos
    : photos.filter(p => p.category === selectedCategory);

  const openLightbox = (photo: Photo) => {
    const index = filteredPhotos.findIndex(p => p.id === photo.id);
    setLightboxIndex(index);
    setSelectedPhoto(photo);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    let newIndex = direction === 'prev'
      ? lightboxIndex - 1
      : lightboxIndex + 1;

    if (newIndex < 0) newIndex = filteredPhotos.length - 1;
    if (newIndex >= filteredPhotos.length) newIndex = 0;

    setLightboxIndex(newIndex);
    setSelectedPhoto(filteredPhotos[newIndex]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') navigateLightbox('prev');
    if (e.key === 'ArrowRight') navigateLightbox('next');
    if (e.key === 'Escape') closeLightbox();
  };

  return (
    <div className="photo-gallery">
      <div className="gallery-header">
        <h2>Galería de Fotos</h2>
        <p>Revive los mejores momentos de la X-Ops Conference 2025</p>
      </div>

      {/* Category Filter */}
      <div className="gallery-filter">
        {categories.map(cat => (
          <button
            key={cat.id}
            className={"filter-btn" + (selectedCategory === cat.id ? ' active' : '')}
            onClick={() => setSelectedCategory(cat.id)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Photo Grid */}
      <div className="photo-grid">
        {filteredPhotos.map(photo => (
          <div
            key={photo.id}
            className="photo-item"
            onClick={() => openLightbox(photo)}
          >
            <div className="photo-thumbnail">
              {/* Placeholder since we don't have actual images */}
              <div className="photo-placeholder">
                <span>📷</span>
                <span className="photo-number">{photo.id}</span>
              </div>
              <div className="photo-overlay">
                <span className="zoom-icon">🔍</span>
              </div>
            </div>
            {photo.caption && (
              <p className="photo-caption">{photo.caption}</p>
            )}
          </div>
        ))}
      </div>

      {filteredPhotos.length === 0 && (
        <div className="no-photos">
          <p>No hay fotos en esta categoría</p>
        </div>
      )}

      {/* Lightbox */}
      {selectedPhoto && (
        <div
          className="lightbox"
          onClick={closeLightbox}
          onKeyDown={handleKeyDown}
          tabIndex={0}
          role="dialog"
          aria-modal="true"
        >
          <div className="lightbox-content" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox} aria-label="Cerrar">
              ×
            </button>
            <button
              className="lightbox-nav prev"
              onClick={(e) => { e.stopPropagation(); navigateLightbox('prev'); }}
              aria-label="Anterior"
            >
              ‹
            </button>
            <div className="lightbox-image">
              <div className="lightbox-placeholder">
                <span>📷</span>
                <span className="photo-number">{selectedPhoto.id}</span>
              </div>
            </div>
            <button
              className="lightbox-nav next"
              onClick={(e) => { e.stopPropagation(); navigateLightbox('next'); }}
              aria-label="Siguiente"
            >
              ›
            </button>
            <div className="lightbox-info">
              <p>{selectedPhoto.caption}</p>
              <span className="lightbox-counter">
                {lightboxIndex + 1} / {filteredPhotos.length}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery;
