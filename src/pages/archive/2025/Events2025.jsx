import React, { useState } from 'react';
import Madrid22 from './Madrid22';
import Madrid23 from './Madrid23';

const Events2025 = () => {
  const [selectedDay, setSelectedDay] = useState('friday');

  return (
    <div style={{ textAlign: 'center'}}>
      <h2 className="text-center margin-top">Horario del Evento 2025</h2>
      <div>
        <button 
          onClick={() => setSelectedDay('friday')} 
          className="date-btn"
          style={{ marginRight: '10px' }}
        >
          Viernes 21/11/2025
        </button>
        <button 
          onClick={() => setSelectedDay('saturday')} 
          className="date-btn"
        >
          Sábado 22/11/2025
        </button>
      </div>
      <div style={{ textAlign: 'center', marginTop: '-45px' }}>
        {selectedDay === 'friday' ? <Madrid22 /> : <Madrid23 />}
      </div>
    </div>
  );
};

export default Events2025;
