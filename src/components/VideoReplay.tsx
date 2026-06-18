import React, { useState } from 'react';
import './VideoReplay.css';

interface Video {
  id: string;
  title: string;
  speaker: string;
  duration: string;
  thumbnail?: string;
  track?: string;
  description?: string;
  videoUrl?: string;
}

// Demo videos - in production these would come from API
const demoVideos: Video[] = [
  {
    id: '1',
    title: 'Keynote: El futuro de DevOps',
    speaker: 'Luis Guirigay',
    duration: '45:00',
    track: 'DevOps',
    description: 'Exploramos las tendencias y el futuro del DevOps en empresas modernas.',
  },
  {
    id: '2',
    title: 'Kubernetes Best Practices',
    speaker: 'Carlos Villanúa',
    duration: '35:00',
    track: 'Cloud Native',
    description: 'Mejores prácticas para gestionar clusters de Kubernetes en producción.',
  },
  {
    id: '3',
    title: 'Security as Code',
    speaker: 'Carlos Polop',
    duration: '40:00',
    track: 'DevSecOps',
    description: 'Cómo integrar seguridad en tu pipeline de CI/CD desde el día uno.',
  },
  {
    id: '4',
    title: 'Platform Engineering 101',
    speaker: 'Dachi Gogotchuri',
    duration: '30:00',
    track: 'Platform',
    description: 'Introducción a Platform Engineering y cómo empezar.',
  },
  {
    id: '5',
    title: 'AI in Operations',
    speaker: 'Sara San Luís',
    duration: '35:00',
    track: 'AIOps',
    description: 'Cómo la IA está transformando las operaciones de TI.',
  },
  {
    id: '6',
    title: 'Observabilidad con eBPF',
    speaker: 'Antonio Berben',
    duration: '25:00',
    track: 'Observability',
    description: 'Usando eBPF para observabilidad profunda en Kubernetes.',
  },
];

const VideoReplay: React.FC = () => {
  const [videos] = useState<Video[]>(demoVideos);
  const [selectedTrack, setSelectedTrack] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const tracks = ['all', ...new Set(videos.map(v => v.track).filter(Boolean))];

  const filteredVideos = videos.filter(video => {
    const matchesTrack = selectedTrack === 'all' || video.track === selectedTrack;
    const matchesSearch = !searchQuery ||
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.speaker.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTrack && matchesSearch;
  });

  const openVideo = (video: Video) => {
    setSelectedVideo(video);
  };

  const closeVideo = () => {
    setSelectedVideo(null);
  };

  return (
    <div className="video-replay">
      <div className="video-header">
        <h2>Charlas en Diferido</h2>
        <p>Revisa las grabaciones de las sesiones de la X-Ops Conference 2025</p>
      </div>

      {/* Search and Filter */}
      <div className="video-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Buscar por título o ponente..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="track-filter">
          {tracks.map(track => (
            <button
              key={track}
              className={"track-btn" + (selectedTrack === track ? ' active' : '')}
              onClick={() => setSelectedTrack(track || 'all')}
            >
              {track === 'all' ? 'Todas' : track}
            </button>
          ))}
        </div>
      </div>

      {/* Video Grid */}
      <div className="video-grid">
        {filteredVideos.map(video => (
          <div key={video.id} className="video-card" role="button" tabIndex={0} onClick={() => openVideo(video)} onKeyDown={(e) => e.key === 'Enter' && openVideo(video)}>
            <div className="video-thumbnail">
              <div className="video-placeholder">
                <span>▶️</span>
              </div>
              <span className="video-duration">{video.duration}</span>
              <div className="play-overlay">
                <span className="play-icon">▶</span>
              </div>
            </div>
            <div className="video-info">
              <h3>{video.title}</h3>
              <p className="video-speaker">{video.speaker}</p>
              {video.track && <span className="video-track">{video.track}</span>}
            </div>
          </div>
        ))}
      </div>

      {filteredVideos.length === 0 && (
        <div className="no-videos">
          <p>No se encontraron videos con esos criterios</p>
        </div>
      )}

      {/* Video Modal */}
      {selectedVideo && (
        <div className="video-modal-overlay" role="button" tabIndex={0} aria-label="Cerrar modal" onClick={closeVideo} onKeyDown={(e) => e.key === 'Enter' && closeVideo()}>
          <div className="video-modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeVideo} aria-label="Cerrar">
              ×
            </button>
            <div className="video-player">
              <div className="player-placeholder">
                <span>▶️</span>
                <p>Video Player</p>
                <span className="duration">{selectedVideo.duration}</span>
              </div>
            </div>
            <div className="video-modal-info">
              <h3>{selectedVideo.title}</h3>
              <p className="speaker">Por {selectedVideo.speaker}</p>
              {selectedVideo.track && (
                <span className="track-badge">{selectedVideo.track}</span>
              )}
              {selectedVideo.description && (
                <p className="description">{selectedVideo.description}</p>
              )}
              <div className="video-actions">
                <button className="action-btn">
                  ⬇️ Descargar
                </button>
                <button className="action-btn">
                  🔗 Compartir
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoReplay;
