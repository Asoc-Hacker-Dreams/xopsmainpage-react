import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useFavorites } from '../hooks/useFavorites';
import { useAgenda } from '../hooks/useAgenda';
import { downloadICS } from '../utils/ics';
import type { Talk } from '../dal/types';

const MyAgenda: React.FC = () => {
  const { favorites, loading: favsLoading, toggleFavorite } = useFavorites();
  const { talks, loading: talksLoading } = useAgenda();

  const favTalkIds = new Set(favorites.map(f => f.talkId));
  const favTalks: Talk[] = talks
    .filter(t => favTalkIds.has(t.id))
    .sort((a, b) => {
      const dayDiff = a.day.localeCompare(b.day);
      return dayDiff !== 0 ? dayDiff : a.startTime.localeCompare(b.startTime);
    });

  const loading = favsLoading || talksLoading;

  return (
    <>
      <Helmet>
        <title>Mi Agenda – X-Ops Conference Madrid 2025</title>
      </Helmet>

      <section className="container py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>⭐ Mi Agenda</h2>
          <div>
            <button
              className="btn btn-outline-primary btn-sm me-2"
              onClick={() => downloadICS(favTalks, 'mi-agenda-xops.ics')}
              disabled={favTalks.length === 0}
            >
              📥 Exportar ICS
            </button>
            <Link to="/agenda" className="btn btn-outline-secondary btn-sm">
              ← Toda la agenda
            </Link>
          </div>
        </div>

        {loading ? (
          <p className="text-center">Cargando…</p>
        ) : favTalks.length === 0 ? (
          <div className="text-center py-5">
            <p className="text-muted">No tienes charlas favoritas aún.</p>
            <Link to="/agenda" className="btn btn-primary">Explorar agenda</Link>
          </div>
        ) : (
          <div className="list-group">
            {favTalks.map(talk => (
              <div key={talk.id} className="list-group-item d-flex justify-content-between align-items-start">
                <div>
                  <h5>{talk.title}</h5>
                  <p className="text-muted mb-1">
                    📅 {talk.day} | 🕐 {talk.startTime}–{talk.endTime} | 📍 {talk.room}
                  </p>
                  <span className="badge bg-secondary">{talk.track}</span>
                </div>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => toggleFavorite(talk.id)}
                  title="Quitar de favoritos"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
};

export default MyAgenda;
