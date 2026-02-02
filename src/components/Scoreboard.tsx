import React from 'react';

interface ScoreboardProps {
  score: number;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({ score }) => {
  return (
    <div className="scoreboard">
      <div className="score-label">Score</div>
      <div className="score-value">{score}</div>
    </div>
  );
};
