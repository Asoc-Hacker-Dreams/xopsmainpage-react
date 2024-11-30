import React, { useState } from 'react';
import Madrid22 from './Madrid22';
import Madrid23 from './Madrid23';



const TextoComponente1 = () => {
  return <div>Este es el primer texto en un componente.</div>;
};

const TextoComponente2 = () => {
  return <div>Este es el segundo texto en un componente.</div>;
};

const App = () => {
  const [textoVisible, setTextoVisible] = useState('componente1');

  const mostrarTexto1 = () => {
    setTextoVisible('componente1');
  };

  const mostrarTexto2 = () => {
    setTextoVisible('componente2');
  };

  return (
    <div style={{ textAlign: 'center'}}>
      <h2 className="text-center margin-top">Horario del Evento</h2>
      <div>
        
        
        <button onClick={mostrarTexto1} className="date-btn">Viernes 22/11/2024</button>
        <button onClick={mostrarTexto2} className="date-btn">Sábado 23/11/2024</button>
      </div>
      <div style={{ textAlign: 'center', marginTop: '-45px' }}>
        {textoVisible === 'componente1' ? <Madrid22 /> : <Madrid23 />}
        </div>
    </div>
  );
};

export default App;