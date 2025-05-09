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
                src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d6082.624927769678!2d-3.8751798!3d40.335414!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd418fc5ceff7897%3A0x811e3f75ccc3b6fb!2sUniversidad%20Rey%20Juan%20Carlos%2C%20Campus%20de%20M%C3%B3stoles!5e0!3m2!1ses!2ses!4v1746789150695!5m2!1ses!2ses"
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
  