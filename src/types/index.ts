export type NoteBass = 'C' | 'D' | 'E' | 'F' | 'G' | 'A' | 'B';
export type Accidental = '' | '#' | 'b';
export type Note = `${NoteBass}${Accidental}`;

export type ChordQuality =
	| 'major'
	| 'minor'
	| 'diminished'
	| 'augmented'
	| 'major7'
	| 'minor7'
	| 'dominant7'
	| 'halfDiminished7'
	| 'diminished7';

export type Inversion = 0 | 1 | 2 | 3;

export type InputNotation = 'jazz' | 'figuredBass';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface GameConfig {
	timeLimit: number;
	difficulty: Difficulty;
	allowInversions: boolean;
	includeSevenths: boolean;
	inputNotation: InputNotation;
}

export interface Chord {
	root: Note;
	quality: ChordQuality;
	notes: string[];
	acceptedAnswers: string[];
	display: string;
	inversion: Inversion;
	bassNote: string;
}

export type GameStatus = 'setup' | 'config' | 'playing' | 'gameOver';

export interface GameState {
	status: GameStatus;
	score: number;
	timeRemaining: number;
	totalTime: number;
	currentChord: Chord | null;
	config: GameConfig;
}

export interface TimerOption {
	label: string;
	seconds: number;
}
