import type { Chord, Inversion, GameConfig } from '../types';
import { 
  ROOTS_BY_DIFFICULTY,
  TRIAD_QUALITIES,
  SEVENTH_QUALITIES, 
  createChord,
  CHORD_STRUCTURE,
} from '../data/chords';

// Generate a random chord based on game config
export function generateRandomChord(
  config: GameConfig,
  excludeChord?: Chord | null,
): Chord {
  const roots = ROOTS_BY_DIFFICULTY[config.difficulty];
  const qualities = config.includeSevenths 
    ? [...TRIAD_QUALITIES, ...SEVENTH_QUALITIES]
    : TRIAD_QUALITIES;
  
  let newChord: Chord;
  let attempts = 0;
  const maxAttempts = 100;

  do {
    const randomRoot = roots[Math.floor(Math.random() * roots.length)];
    const randomQuality = qualities[Math.floor(Math.random() * qualities.length)];
    
    // Determine inversion
    let inversion: Inversion = 0;
    if (config.allowInversions) {
      const maxInversion = CHORD_STRUCTURE[randomQuality].degrees.length - 1;
      inversion = Math.floor(Math.random() * (maxInversion + 1)) as Inversion;
    }
    
    newChord = createChord(randomRoot, randomQuality, inversion, config.inputNotation);
    attempts++;
  } while (
    excludeChord && 
    newChord.display === excludeChord.display && 
    attempts < maxAttempts
  );

  console.log(`Generated chord in ${attempts} attempt(s): ${newChord.display}`);
  return newChord;
}
