import React from 'react';
import { Modal, Badge } from 'react-bootstrap';
import type { Speaker, Talk } from '../dal/types';

interface SpeakerCardProps {
  speaker: Speaker;
  talks: Talk[];
  onClose: () => void;
}

const SpeakerCard: React.FC<SpeakerCardProps> = ({ speaker, talks, onClose }) => {
  const speakerTalks = talks.filter(t => t.speakerIds?.includes(speaker.id));

  const initials = speaker.name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <Modal show onHide={onClose} size="lg" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title>{speaker.name}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div className="d-flex flex-column flex-sm-row gap-4 mb-4">
          <div className="text-center flex-shrink-0">
            {speaker.photoUrl ? (
              <img
                src={speaker.photoUrl}
                alt={speaker.name}
                className="rounded-circle"
                style={{ width: 140, height: 140, objectFit: 'cover' }}
              />
            ) : (
              <div
                className="rounded-circle bg-secondary d-flex align-items-center justify-content-center mx-auto"
                style={{ width: 140, height: 140 }}
              >
                <span className="text-white fs-2 fw-bold">{initials}</span>
              </div>
            )}
          </div>

          <div>
            {speaker.role && (
              <p className="text-muted mb-1 fw-semibold">{speaker.role}</p>
            )}
            {speaker.company && (
              <p className="mb-2">
                <strong>{speaker.company}</strong>
              </p>
            )}
            {speaker.social && (
              <div className="d-flex flex-wrap gap-2">
                {speaker.social.twitter && (
                  <a
                    href={`https://twitter.com/${speaker.social.twitter}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-outline-secondary"
                  >
                    𝕏 Twitter
                  </a>
                )}
                {speaker.social.linkedin && (
                  <a
                    href={speaker.social.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-outline-primary"
                  >
                    in LinkedIn
                  </a>
                )}
                {speaker.social.github && (
                  <a
                    href={`https://github.com/${speaker.social.github}`}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-outline-dark"
                  >
                    ⌥ GitHub
                  </a>
                )}
                {speaker.social.web && (
                  <a
                    href={speaker.social.web}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm btn-outline-info"
                  >
                    🌐 Web
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {speaker.bio && (
          <div className="mb-4">
            <h6 className="text-uppercase text-muted small mb-2">Biografía</h6>
            <p style={{ whiteSpace: 'pre-wrap' }}>{speaker.bio}</p>
          </div>
        )}

        {speakerTalks.length > 0 && (
          <div>
            <h6 className="text-uppercase text-muted small mb-2">Charlas</h6>
            <div className="d-flex flex-column gap-2">
              {speakerTalks.map(talk => (
                <div key={talk.id} className="card border">
                  <div className="card-body py-2 px-3">
                    <p className="fw-semibold mb-1">{talk.title}</p>
                    <p className="text-muted small mb-1">
                      📅 {talk.day} &nbsp;·&nbsp; 🕐 {talk.startTime}–{talk.endTime} &nbsp;·&nbsp; 📍 {talk.room}
                    </p>
                    <div className="d-flex flex-wrap gap-1">
                      {talk.track && (
                        <Badge bg="secondary" className="fw-normal">{talk.track}</Badge>
                      )}
                      {talk.level && (
                        <Badge bg="info" text="dark" className="fw-normal">{talk.level}</Badge>
                      )}
                      {talk.tags?.map(tag => (
                        <Badge key={tag} bg="light" text="dark" className="fw-normal border">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default SpeakerCard;
