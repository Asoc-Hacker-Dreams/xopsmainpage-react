import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'react-bootstrap';
import AnimationWrapper from '../../components/AnimationWrapper';
import { useAgenda } from '../../hooks/useAgenda';
import useFavorites from '../../hooks/useFavorites';
import AgendaList from './AgendaList';

/**
 * MyAgenda Component - Displays user's favorite talks
 * Provides personalized schedule based on user selections
 */
const MyAgenda = () => {
  const { talks, loading, error } = useAgenda();
  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  // Filter talks to show only favorites
  const favoriteTalks = talks.filter(talk => isFavorite(talk.id));

  if (loading) {
    return (
      <section id="my-agenda" className="my-agenda-section">
        <Container>
          <h2 className="text-center margin-top">Mi Agenda</h2>
          <div className="text-center my-5">
            <p>Cargando tu agenda personalizada...</p>
          </div>
        </Container>
      </section>
    );
  }

  if (error) {
    return (
      <section id="my-agenda" className="my-agenda-section">
        <Container>
          <h2 className="text-center margin-top">Mi Agenda</h2>
          <div className="alert alert-danger text-center my-5" role="alert">
            <p>Error al cargar tu agenda: {error}</p>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section id="my-agenda" className="my-agenda-section">
      <AnimationWrapper animation="fade-up" duration={1500}>
        <Container>
          <h2 className="text-center margin-top">Mi Agenda</h2>
          <p className="text-center mb-4">
            Aquí encontrarás todas las charlas que has marcado como favoritas.
          </p>

          {favoriteTalks.length === 0 ? (
            <Row className="justify-content-center">
              <Col md={8} lg={6}>
                <div className="text-center my-5">
                  <p className="mb-4">
                    Aún no has añadido ninguna charla a tu agenda personalizada.
                  </p>
                  <p>
                    Explora la agenda completa y marca tus charlas favoritas para crear tu
                    horario personalizado.
                  </p>
                </div>
              </Col>
            </Row>
          ) : (
            <>
              <div className="text-center mb-4">
                <p>
                  <strong>{favoriteTalks.length}</strong> {favoriteTalks.length === 1 ? 'charla marcada' : 'charlas marcadas'}
                </p>
              </div>
              
              <AgendaList 
                talks={favoriteTalks} 
                isFavorite={isFavorite}
                onToggleFavorite={toggleFavorite}
              />
            </>
          )}
        </Container>
      </AnimationWrapper>
    </section>
  );
};

export default MyAgenda;
