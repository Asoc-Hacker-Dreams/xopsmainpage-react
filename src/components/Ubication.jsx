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
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3038.882198458713!2d-3.6293443!3d40.389303399999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd4225a4623324d7%3A0x55062a088f78765e!2sUniversidad%20Polit%C3%A9cnica%20de%20Madrid%20(UPM)%20-%20Campus%20Sur!5e0!3m2!1ses-419!2sve!4v1729742316704!5m2!1ses-419!2sve"
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
  