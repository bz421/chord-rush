import { useState, useCallback, useEffect } from 'react';
import './App.css';
import type { GameState, GameConfig } from './types';
import { useTimer } from './hooks/useTimer';
import { generateRandomChord } from './utils/chordGenerator';
import { GameSetup } from './components/GameSetup';
import { GameConfig as GameConfigComponent } from './components/GameConfig';
import { ChordDisplay } from './components/ChordDisplay';
import { ChordInput } from './components/ChordInput';
import { Timer } from './components/Timer';
import { Scoreboard } from './components/Scoreboard';
import { GameOver } from './components/GameOver';

const defaultConfig: GameConfig = {
	timeLimit: 60,
	difficulty: 'medium',
	allowInversions: false,
	includeSevenths: false,
	inputNotation: 'figuredBass',
};

const initialGameState: GameState = {
	status: 'setup',
	score: 0,
	timeRemaining: 60,
	totalTime: 60,
	currentChord: null,
	config: defaultConfig,
};

function App() {
	const [gameState, setGameState] = useState<GameState>(initialGameState);

	useEffect(() => {
		const escapeListener = (e: KeyboardEvent) => {
			if (e.key !== 'Escape') return;
			setGameState(prev => {
				if (prev.status === 'playing') return { ...prev, status: 'config' };
				if (prev.status === 'config') return { ...prev, status: 'setup' };
				return { ...prev, status: 'setup' };
			});
		};
		window.addEventListener('keydown', escapeListener);
		return () => window.removeEventListener('keydown', escapeListener);
	});

	const handleGameOver = useCallback(() => {
		setGameState(prev => ({
			...prev,
			status: 'gameOver',
		}));
	}, []);

	const { timeRemaining, start, reset } = useTimer({
		initialTime: gameState.totalTime,
		onExpire: handleGameOver,
	});

	const handleTimerSelected = (seconds: number) => {
		setGameState(prev => ({
			...prev,
			status: 'config',
			config: { ...prev.config, timeLimit: seconds },
		}));
	};

	const handleBackToSetup = () => {
		setGameState(prev => ({
			...prev,
			status: 'setup',
		}));
	};

	const handleStartGame = (config: GameConfig) => {
		const firstChord = generateRandomChord(config);
		setGameState({
			status: 'playing',
			score: 0,
			timeRemaining: config.timeLimit,
			totalTime: config.timeLimit,
			currentChord: firstChord,
			config,
		});

		if (config.timeLimit > 0) {
			reset(config.timeLimit);
			setTimeout(() => start(), 50);
		}
	};

	const handleCorrectAnswer = () => {
		setGameState(prev => {
			const newChord = generateRandomChord(prev.config, prev.currentChord);
			return {
				...prev,
				score: prev.score + 1,
				currentChord: newChord,
			};
		});
	};

	const handlePlayAgain = () => {
		setGameState(initialGameState);
		reset(60);
	};

	return (
		<div className="app">
			{gameState.status === 'setup' && (
				<GameSetup initialTime={gameState.config.timeLimit} onNext={handleTimerSelected} />
			)}

			{gameState.status === 'config' && (
				<GameConfigComponent
					initialConfig={gameState.config}
					onStartGame={handleStartGame}
					onBack={handleBackToSetup}
				/>
			)}

			{gameState.status === 'playing' && gameState.currentChord && (
				<div className="game-container">
					<div className="game-header">
						<Scoreboard score={gameState.score} />
						{gameState.totalTime > 0 && <Timer
							timeRemaining={timeRemaining}
							totalTime={gameState.totalTime}
						/>}
					</div>

					<div className="game-content">
						<ChordDisplay chord={gameState.currentChord} clef={Math.random() < 0.5 ? 'treble' : 'bass'} />
						<ChordInput
							chord={gameState.currentChord}
							onCorrectAnswer={handleCorrectAnswer}
						/>
					</div>
				</div>
			)}

			{gameState.status === 'gameOver' && (
				<GameOver
					score={gameState.score}
					totalTime={gameState.totalTime}
					onPlayAgain={handlePlayAgain}
				/>
			)}
		</div>
	);
}

export default App;
