import React from 'react';

const Sponsor = () => {
  return (
    <section className="sponsorship-levels-section text-center">
    <h2>Sponsorship Levels</h2>
    <div className="container">
      <div className="row">

        {/* Diamond Level */}
        <div className="col-md-4 mb-4">
          <div className="card border-primary">
            <div className="card-body">
              <h3 className="card-title">Diamante</h3>
              <p className="card-text"><strong>Logo en toda la promoción:</strong> Sí</p>
              <p className="card-text"><strong>Tamaño:</strong> Grande</p>
              <p className="card-text"><strong>Entradas Incluidas:</strong> 15 entradas</p>
              <p className="card-text"><strong>Brindar Workshop:</strong> Exclusivo</p>
              <h4 className="card-text">INVERSIÓN: €3,500</h4>
            </div>
          </div>
        </div>

        {/* Gold Level */}
        <div className="col-md-4 mb-4">
          <div className="card border-warning">
            <div className="card-body">
              <h3 className="card-title">Oro</h3>
              <p className="card-text"><strong>Logo en toda la promoción:</strong> Sí</p>
              <p className="card-text"><strong>Tamaño:</strong> Mediano</p>
              <p className="card-text"><strong>Entradas Incluidas:</strong> 10 entradas</p>
              <p className="card-text"><strong>Brindar Workshop:</strong> Posible</p>
              <h4 className="card-text">INVERSIÓN: €2,500</h4>
            </div>
          </div>
        </div>

        {/* Silver Level */}
        <div className="col-md-4 mb-4">
          <div className="card border-secondary">
            <div className="card-body">
              <h3 className="card-title">Plata</h3>
              <p className="card-text"><strong>Logo en toda la promoción:</strong> No</p>
              <p className="card-text"><strong>Tamaño:</strong> Pequeño</p>
              <p className="card-text"><strong>Entradas Incluidas:</strong> 5 entradas</p>
              <p className="card-text"><strong>Brindar Workshop:</strong> No</p>
              <h4 className="card-text">INVERSIÓN: €1,000</h4>
            </div>
          </div>
        </div>

      </div>
    </div>
  </section>
  );
};

export default Sponsor;
