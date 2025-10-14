import React, { useState } from 'react';
import MadridFriday from './madrid_friday';
import MadridSaturday from './madrid_saturday';
const App = () => {
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
        {selectedDay === 'friday' ? <MadridFriday /> : <MadridSaturday />}
      </div>
    </div>
  );
};

export default App;