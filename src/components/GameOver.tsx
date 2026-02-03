import React from 'react';

interface GameOverProps {
	score: number;
	totalTime: number;
	onPlayAgain: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({ score, totalTime, onPlayAgain }) => {
	const chordsPerMinute = totalTime > 0 ? ((score / totalTime) * 60).toFixed(1) : 0;

	const getMessage = () => {
		return "you're trash"
	};

	return (
		<div className="game-over">
			<h1 className="game-over-title">Time's Up!</h1>

			<div className="final-score-container">
				<div className="final-score-label">Final Score</div>
				<div className="final-score-value">{score}</div>
				<div className="final-score-stat">
					{chordsPerMinute} chords per minute
				</div>
			</div>

			<p className="game-over-message">{getMessage()}</p>

			<div className="game-over-stats">
				<div className="stat">
					<span className="stat-value">{score}</span>
					<span className="stat-label">Chords Identified</span>
				</div>
				<div className="stat">
					<span className="stat-value">{totalTime}s</span>
					<span className="stat-label">Time Limit</span>
				</div>
			</div>

			<button className="play-again-button" onClick={onPlayAgain}>
				Play Again
			</button>
		</div>
	);
};
