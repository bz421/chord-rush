import type { Chord } from '../types';

// Normalize user input for comparison
function normalizeInput(input: string): string {
  // console.log(`Normalizing input: ${input}`);
  return input
    .trim()
    .replace(/\s+/g, '') // Remove all whitespace
    .replace(/♯/g, '#') // Normalize sharp symbol
    .replace(/♭/g, 'b') // Normalize flat symbol
    .replace(/x/g, '##'); // Normalize double sharp
}

// Check if user input matches the chord
export function validateChordInput(input: string, chord: Chord): boolean {
  const normalizedInput = normalizeInput(input);
  // console.log(`Expecting one of: ${chord.acceptedAnswers.join(', ')} for chord ${chord.display}`);
  
  if (!normalizedInput) {
    return false;
  }

  // Check against all accepted answers
  return chord.acceptedAnswers.some(answer => {
    const normalizedAnswer = normalizeInput(answer);
    return normalizedInput === normalizedAnswer;
  });
}

export function getInputFeedback(
  input: string, 
  chord: Chord
): { correct: boolean; message: string } {
  if (validateChordInput(input, chord)) {
    return { correct: true, message: 'Correct!' };
  }

  else return { correct: false, message: 'Try again!' };
}
