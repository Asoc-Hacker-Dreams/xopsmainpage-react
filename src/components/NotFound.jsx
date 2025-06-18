import { Link } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';

const NotFound = () => {
  return (
    <Container className="text-center py-5">
      <h1 className="display-1">404</h1>
      <h2>Página no encontrada</h2>
      <p>La página que buscas no existe o ha sido movida.</p>
      <Link to="/">
        <Button variant="primary">Volver al inicio</Button>
      </Link>
    </Container>
  );
};

export default NotFound;