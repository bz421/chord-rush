import type { Chord, Note, ChordQuality, Inversion, Difficulty, InputNotation } from '../types';

const NOTE_LETTERS = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];

// Semitones from C for each natural note
const NATURAL_SEMITONES: Record<string, number> = {
	'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11
};

export const CHORD_STRUCTURE: Record<ChordQuality, { degrees: number[]; semitones: number[] }> = {
	major: { degrees: [0, 2, 4], semitones: [0, 4, 7] },        // 1-3-5
	minor: { degrees: [0, 2, 4], semitones: [0, 3, 7] },        // 1-b3-5
	diminished: { degrees: [0, 2, 4], semitones: [0, 3, 6] },        // 1-b3-b5
	augmented: { degrees: [0, 2, 4], semitones: [0, 4, 8] },        // 1-3-#5
	major7: { degrees: [0, 2, 4, 6], semitones: [0, 4, 7, 11] }, // 1-3-5-7
	minor7: { degrees: [0, 2, 4, 6], semitones: [0, 3, 7, 10] }, // 1-b3-5-b7
	dominant7: { degrees: [0, 2, 4, 6], semitones: [0, 4, 7, 10] }, // 1-3-5-b7
	halfDiminished7: { degrees: [0, 2, 4, 6], semitones: [0, 3, 6, 10] }, // 1-b3-b5-b7
	diminished7: { degrees: [0, 2, 4, 6], semitones: [0, 3, 6, 9] }, // 1-b3-b5-bb7
};

export const JAZZ_QUALITY: Record<ChordQuality, { display: string; accepted: string[] }> = {
	major: {
		display: 'Major',
		accepted: [''],
	},
	minor: {
		display: 'Minor',
		accepted: ['m'],
	},
	diminished: {
		display: 'Diminished',
		accepted: ['dim', 'o'],
	},
	augmented: {
		display: 'Augmented',
		accepted: ['aug', '+'],
	},
	major7: {
		display: 'Major 7',
		accepted: ['maj7', 'M7'],
	},
	minor7: {
		display: 'Minor 7',
		accepted: ['m7'],
	},
	dominant7: {
		display: '7',
		accepted: ['7'],
	},
	halfDiminished7: {
		display: 'Half-Diminished 7',
		accepted: ['m7(b5)', 'm7b5', '07'],
	},
	diminished7: {
		display: 'Diminished 7',
		accepted: ['dim7', 'o7'],
	},
};

export const FIGURED_BASS_QUALITY: Record<ChordQuality, { display: string; accepted: string[] }> = {
	major: {
		display: 'Major',
		accepted: [''],
	},
	minor: {
		display: 'Minor',
		accepted: ['m'],
	},
	diminished: {
		display: 'Diminished',
		accepted: ['o'],
	},
	augmented: {
		display: 'Augmented',
		accepted: ['+'],
	},
	major7: {
		display: 'Major 7',
		accepted: ['M'],
	},
	minor7: {
		display: 'Minor 7',
		accepted: ['m'],
	},
	dominant7: {
		display: '7',
		accepted: [''],
	},
	halfDiminished7: {
		display: 'Half-Diminished 7',
		accepted: ['0'],
	},
	diminished7: {
		display: 'Diminished 7',
		accepted: ['o'],
	},
};


export const FIGURED_BASS_TRIADS: Record<Inversion, { display: string; accepted: string[] }> = {
	0: { display: '', accepted: [''] },
	1: { display: '6', accepted: ['6'] },
	2: { display: '6/4', accepted: ['6/4', '64'] },
	3: { display: '', accepted: [''] }, // Not used for triads
};

export const FIGURED_BASS_SEVENTHS: Record<Inversion, { display: string; accepted: string[] }> = {
	0: { display: '7', accepted: ['7'] },
	1: { display: '6/5', accepted: ['6/5', '65'] },
	2: { display: '4/3', accepted: ['4/3', '43'] },
	3: { display: '4/2', accepted: ['4/2', '42', '2'] },
};

export const ROOTS_BY_DIFFICULTY: Record<Difficulty, Note[]> = {
	easy: ['C', 'D', 'E', 'F', 'G', 'A', 'B'],
	medium: ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'F#', 'Gb', 'Db', 'Ab', 'Eb', 'Bb'],
	hard: ['C', 'C#', 'Db', 'D', 'D#', 'Eb', 'E', 'Fb', 'E#', 'F', 'F#', 'Gb', 'G', 'G#', 'Ab', 'A', 'A#', 'Bb', 'B', 'Cb', 'B#'],
};

export const AVAILABLE_ROOTS: Note[] = ROOTS_BY_DIFFICULTY.hard;

export const TRIAD_QUALITIES: ChordQuality[] = [
	'major',
	'minor',
	'diminished',
	'augmented',
];

export const SEVENTH_QUALITIES: ChordQuality[] = [
	'major7',
	'minor7',
	'dominant7',
	'halfDiminished7',
	'diminished7',
];

export const AVAILABLE_QUALITIES: ChordQuality[] = [
	...TRIAD_QUALITIES,
	...SEVENTH_QUALITIES,
];

// Get bass letter and accidental offset from a note name
function parseNote(note: string): { letter: string; offset: number } {
	const letter = note[0];
	let offset = 0;
	if (note.includes('#')) offset = 1;
	if (note.includes('b')) offset = -1;
	return { letter, offset };
}

// Get integer value (0-11) for a note
function noteToSemitone(note: string): number {
	const { letter, offset } = parseNote(note);
	return (NATURAL_SEMITONES[letter] + offset + 12) % 12;
}

// Build a note name from letter + semitone target
function buildNoteName(letter: string, targetSemitone: number): string {
	const naturalSemitone = NATURAL_SEMITONES[letter];
	let diff = (targetSemitone - naturalSemitone + 12) % 12;

	if (diff === 0) return letter;
	if (diff === 1) return `${letter}#`;
	if (diff === 11) return `${letter}b`;
	if (diff === 2) return `${letter}##`;
	if (diff === 10) return `${letter}bb`;

	return `${letter}error`;
}

export function buildChordNotes(root: Note, quality: ChordQuality): string[] {
	const { letter: rootLetter } = parseNote(root);
	const rootLetterIndex = NOTE_LETTERS.indexOf(rootLetter);
	const rootSemitone = noteToSemitone(root);

	const structure = CHORD_STRUCTURE[quality];

	return structure.degrees.map((degree, i) => {
		const letterIndex = (rootLetterIndex + degree) % 7;
		const letter = NOTE_LETTERS[letterIndex];
		const targetSemitone = (rootSemitone + structure.semitones[i]) % 12;
		return buildNoteName(letter, targetSemitone);
	});
}

// Apply inversions
export function applyInversion(notes: string[], inversion: Inversion): string[] {
	if (inversion === 0 || inversion >= notes.length) return [...notes];

	const inverted = [...notes];
	for (let i = 0; i < inversion; i++) {
		const lowest = inverted.shift()!;
		inverted.push(lowest);
	}
	return inverted;
}

// Check if chord is a seventh chord
function isSeventhChord(quality: ChordQuality): boolean {
	return ['major7', 'minor7', 'dominant7', 'halfDiminished7', 'diminished7'].includes(quality);
}

// Generate accepted answers based on notation type
export function generateAcceptedAnswers(
	root: Note,
	quality: ChordQuality,
	inversion: Inversion,
	notation: InputNotation
): string[] {
	const answers: string[] = [];

	if (notation === 'jazz') {
		// Jazz notation
		const qualityAccepted = JAZZ_QUALITY[quality].accepted;
		const notes = buildChordNotes(root, quality);
		const invertedNotes = applyInversion(notes, inversion);
		const bassNote = invertedNotes[0];

		for (const q of qualityAccepted) {
			if (inversion === 0) {
				answers.push(`${root}${q}`);
			} else {
				answers.push(`${root}${q}/${bassNote}`);
			}
		}
	} else if (notation === 'figuredBass') {
		// Figured bass
		const isSeventh = isSeventhChord(quality);
		const qualityAccepted = FIGURED_BASS_QUALITY[quality].accepted;
		const figuredBass = isSeventh
			? FIGURED_BASS_SEVENTHS[inversion]
			: FIGURED_BASS_TRIADS[inversion];

		for (const q of qualityAccepted) {
			for (const fb of figuredBass.accepted) {
				answers.push(`${root}${q}${fb}`.trim());
			}
		}
	}

	return [...new Set(answers)];
}

export function createChord(
	root: Note,
	quality: ChordQuality,
	inversion: Inversion = 0,
	notation: InputNotation = 'jazz'
): Chord {
	const rootPositionNotes = buildChordNotes(root, quality);
	const invertedNotes = applyInversion(rootPositionNotes, inversion);
	const bassNote = invertedNotes[0];

	let display = `${root} ${JAZZ_QUALITY[quality].display}`;
	if (inversion > 0) {
		display += ` (${getInversionName(inversion, isSeventhChord(quality))})`;
	}

	return {
		root,
		quality,
		notes: invertedNotes,
		acceptedAnswers: generateAcceptedAnswers(root, quality, inversion, notation),
		display,
		inversion,
		bassNote,
	};
}

function getInversionName(inversion: Inversion, isSeventh: boolean): string {
	if (isSeventh) {
		switch (inversion) {
			case 1: return '1st inv';
			case 2: return '2nd inv';
			case 3: return '3rd inv';
			default: return 'root';
		}
	} else {
		switch (inversion) {
			case 1: return '1st inv';
			case 2: return '2nd inv';
			default: return 'root';
		}
	}
}
