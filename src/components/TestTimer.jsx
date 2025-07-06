import { useEffect, useState } from 'react';
import { Alert } from 'react-bootstrap';

const TestTimer = ({ initialTime, onTimeout }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  
  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeout();
      return;
    }
    
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, [timeLeft, onTimeout]);
  
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  return (
    <Alert variant={timeLeft < 60 ? 'danger' : 'info'} className="d-inline-block">
      Time Remaining: <strong>{formatTime(timeLeft)}</strong>
    </Alert>
  );
};

export default TestTimer;