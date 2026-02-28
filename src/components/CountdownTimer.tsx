import React, { useState, useEffect } from 'react';
import './CountdownTimer.css';

interface CountdownTimerProps {
  targetDate: Date;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ targetDate }) => {
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeRemaining = (): TimeRemaining => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    };

    setTimeRemaining(calculateTimeRemaining());

    const interval = setInterval(() => {
      setTimeRemaining(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const timeUnits = [
    { value: timeRemaining.days, label: 'Días', labelSingular: 'Día' },
    { value: timeRemaining.hours, label: 'Horas', labelSingular: 'Hora' },
    { value: timeRemaining.minutes, label: 'Minutos', labelSingular: 'Minuto' },
    { value: timeRemaining.seconds, label: 'Segundos', labelSingular: 'Segundo' },
  ];

  return (
    <div className="countdown-timer">
      <div className="countdown-units">
        {timeUnits.map((unit, index) => (
          <div key={unit.label} className="countdown-unit">
            <div className="countdown-value">
              {unit.value.toString().padStart(2, '0')}
            </div>
            <div className="countdown-label">
              {unit.value === 1 ? unit.labelSingular : unit.label}
            </div>
            {index < timeUnits.length - 1 && (
              <span className="countdown-separator">:</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CountdownTimer;
