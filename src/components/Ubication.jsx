import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Ubication () {
    return (
        <div className="container mt-5">
        <h3 className="text-center">Ubicación</h3>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3040.8060719427917!2d-3.8460590999999997!3d40.3466478!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd418eb8a773ffe7%3A0x5c6be77d8f2cc8cc!2sUniversidad%20Rey%20Juan%20Carlos%20Campus%20de%20Alcorc%C3%B3n!5e0!3m2!1ses!2ses!4v1746785413756!5m2!1ses!2ses" 
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Ubicación en Google Maps"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  export default Ubication 
  