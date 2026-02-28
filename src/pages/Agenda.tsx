import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useAgenda } from '../hooks/useAgenda';
import { useFavorites } from '../hooks/useFavorites';
import { downloadICS } from '../utils/ics';
import type { Talk } from '../dal/types';

const TalkCard: React.FC<{
  talk: Talk;
  isFav: boolean;
  onToggleFav: (id: string) => void;
}> = ({ talk, isFav, onToggleFav }) => (
  <div className="col-md-6 mb-4">
    <div className="card h-100 shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <span className="badge bg-secondary me-2">{talk.track}</span>
            <span className="badge bg-info text-dark">{talk.room}</span>
          </div>
          <button
            className="btn btn-sm"
            onClick={() => onToggleFav(talk.id)}
            title={isFav ? 'Quitar de favoritos' : 'Añadir a favoritos'}
            aria-label={isFav ? 'Quitar de favoritos' : 'Añadir a favoritos'}
          >
            {isFav ? '⭐' : '☆'}
          </button>
        </div>
        <h5 className="card-title mt-2">{talk.title}</h5>
        <p className="card-text text-muted">
          🕐 {talk.startTime} – {talk.endTime} | 📅 {talk.day}
        </p>
        {talk.speakerIds && talk.speakerIds.length > 0 && (
          <p className="card-text">
            👤{' '}
            {talk.speakerIds.map((sid, i) => (
              <span key={sid}>
                <Link to={`/speaker/${sid}`}>{sid.replace(/-/g, ' ')}</Link>
                {i < talk.speakerIds!.length - 1 ? ', ' : ''}
              </span>
            ))}
          </p>
        )}
        {talk.description && (
          <p className="card-text small">{talk.description.slice(0, 200)}…</p>
        )}
      </div>
    </div>
  </div>
);

const Agenda: React.FC = () => {
  const [day, setDay] = useState<string | undefined>();
  const [track, setTrack] = useState<string | undefined>();
  const [room, setRoom] = useState<string | undefined>();
  const [search, setSearch] = useState('');

  const { talks, loading, days, tracks, rooms } = useAgenda({ day, track, room, search });
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <>
      <Helmet>
        <title>Agenda – X-Ops Conference Madrid 2025</title>
        <meta name="description" content="Consulta la agenda completa de la X-Ops Conference Madrid 2025. Filtra por día, track y sala." />
      </Helmet>

      <section className="container py-5">
        <h2 className="text-center mb-4">Agenda</h2>

        {/* Filters */}
        <div className="row mb-4 g-2">
          <div className="col-md-3">
            <select
              className="form-select"
              value={day || ''}
              onChange={e => setDay(e.target.value || undefined)}
              aria-label="Filtrar por día"
            >
              <option value="">Todos los días</option>
              {days.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={track || ''}
              onChange={e => setTrack(e.target.value || undefined)}
              aria-label="Filtrar por track"
            >
              <option value="">Todos los tracks</option>
              {tracks.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={room || ''}
              onChange={e => setRoom(e.target.value || undefined)}
              aria-label="Filtrar por sala"
            >
              <option value="">Todas las salas</option>
              {rooms.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div className="col-md-3">
            <input
              type="search"
              className="form-control"
              placeholder="Buscar charla…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Buscar charla"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="d-flex justify-content-between mb-3">
          <span className="text-muted">{talks.length} charlas</span>
          <div>
            <button
              className="btn btn-outline-primary btn-sm me-2"
              onClick={() => downloadICS(talks)}
              disabled={talks.length === 0}
            >
              📥 Exportar ICS
            </button>
            <Link to="/mi-agenda" className="btn btn-outline-warning btn-sm">
              ⭐ Mi Agenda
            </Link>
          </div>
        </div>

        {loading ? (
          <p className="text-center">Cargando agenda…</p>
        ) : talks.length === 0 ? (
          <p className="text-center text-muted">No se encontraron charlas con esos filtros.</p>
        ) : (
          <div className="row">
            {talks.map(talk => (
              <TalkCard
                key={talk.id}
                talk={talk}
                isFav={isFavorite(talk.id)}
                onToggleFav={toggleFavorite}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default Agenda;
