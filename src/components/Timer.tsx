import React from 'react';

interface TimerProps {
  timeRemaining: number;
  totalTime: number;
}

export const Timer: React.FC<TimerProps> = ({ timeRemaining, totalTime }) => {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  
  const percentage = (timeRemaining / totalTime) * 100;
  
  // Color changes based on time remaining
  const getTimerColor = () => {
    if (percentage > 50) return '#4ade80'; // Green
    if (percentage > 25) return '#fbbf24'; // Yellow
    return '#ef4444'; // Red
  };

  const isLowTime = timeRemaining <= 10;

  return (
    <div className="timer-container">
      <div 
        className={`timer-display ${isLowTime ? 'timer-pulse' : ''}`}
        style={{ color: getTimerColor() }}
      >
        {minutes}:{seconds.toString().padStart(2, '0')}
      </div>
      <div className="timer-bar-container">
        <div 
          className="timer-bar"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: getTimerColor(),
          }}
        />
      </div>
    </div>
  );
};
