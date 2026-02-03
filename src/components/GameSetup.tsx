import React, { useState } from 'react';
import type { TimerOption } from '../types';

interface GameSetupProps {
	onNext: (seconds: number) => void;
	initialTime?: number;
}

const TIMER_OPTIONS: TimerOption[] = [
	{ label: '30 seconds', seconds: 30 },
	{ label: '1 minute', seconds: 60 },
	{ label: '2 minutes', seconds: 120 },
	{ label: '3 minutes', seconds: 180 },
	{ label: '5 minutes', seconds: 300 },
	{ label: '∞', seconds: 0 },
];

export const GameSetup: React.FC<GameSetupProps> = ({ onNext, initialTime = 60 }) => {
	const [selectedTime, setSelectedTime] = useState<number>(initialTime);

	return (
		<div className="game-setup">
			<h1 className="game-title">Chord Rush</h1>
			<p className="game-description">
				Test your chord recognition skills! Identify as many chords as you can before time runs out.
			</p>

			<div className="setup-section">
				<h2>Select Time Limit</h2>
				<div className="timer-options">
					{TIMER_OPTIONS.map((option) => (
						<button
							key={option.seconds}
							className={`timer-option ${selectedTime === option.seconds ? 'selected' : ''}`}
							onClick={() => setSelectedTime(option.seconds)}
						>
							{option.label}
						</button>
					))}
				</div>
			</div>

			<div className="setup-section">
				<h2>How to Play</h2>
				<ul className="instructions">
					<li>A chord will be displayed on the staff</li>
					<li>Type the chord name</li>
					<li>Press Enter to submit your answer</li>
					<li>Get as many correct as possible before time runs out!</li>
					<li><strong>Input is case-sensitive</strong></li>
				</ul>
			</div>

			<button className="start-button" onClick={() => onNext(selectedTime)}>
				Continue
			</button>
		</div>
	);
};
