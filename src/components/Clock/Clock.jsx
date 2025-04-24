import { useState, useEffect } from 'react';
import './Clock.css';

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  
  // Convert to 12-hour format
  const formattedHours = hours % 12 || 12;
  
  // Add leading zeros
  const displayHours = formattedHours.toString().padStart(2, '0');
  const displayMinutes = minutes.toString().padStart(2, '0');
  const displaySeconds = seconds.toString().padStart(2, '0');

  return (
    <div className="clock">
      <div className="time">
        <span className="time-segment">{displayHours}</span>:
        <span className="time-segment">{displayMinutes}</span>:
        <span className="time-segment">{displaySeconds}</span>
        <span className="time-ampm">{ampm}</span>
      </div>
    </div>
  );
};

export default Clock; 