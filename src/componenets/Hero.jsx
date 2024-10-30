import React from 'react';

function Hero() {
  return (
    <div className='Hero-section d-flex align-items-center justify-content-center text-center'>
      <div className="d-flex align-items-center justify-content-center text-center text-white py-5">
    <div className="container">
        <h1 className="display-4 font-weight-bold">¡ÚNETE A LA REVOLUCIÓN X-OPS!    </h1>
        <p className="lead">El mundo de las IT está cambiando. Únete a nosotros en la X-Ops Conference, donde descubrirás cómo la tecnología y las personas adecuadas están impulsando el cambio.        </p>
        <p className="lead">Fecha: Noviembre 2024 </p>
        <div className="mt-4 mx-4">
        <a href="https://www.eventbrite.es/e/entradas-xops-conference-1049115200807?aff=oddtdtcreator" class="btn mx-2 my-2 bg-color text-white btn-lg mr-3">Compra tu entrada</a>
            <a href="#learn-more" className="btn mx-2  my-2 btn-outline-light btn-lg">Descubre más</a>
        </div>
    </div>
</div>

    </div>
  )
}

export default Hero
