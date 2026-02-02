import React, { useState } from 'react';
import type { Difficulty, InputNotation, GameConfig as GameConfigType } from '../types';

interface GameConfigProps {
  initialConfig: GameConfigType;
  onStartGame: (config: GameConfigType) => void;
  onBack: () => void;
}

interface DifficultyOption {
  value: Difficulty;
  label: string;
  description: string;
}

const DIFFICULTY_OPTIONS: DifficultyOption[] = [
  { 
    value: 'easy', 
    label: 'Easy', 
    description: 'Natural notes only (C, D, E, F, G, A, B)' 
  },
  { 
    value: 'medium', 
    label: 'Medium', 
    description: 'Common roots only (adds F#, Gb, Db, Ab, Eb, Bb)' 
  },
  { 
    value: 'hard', 
    label: 'Hard', 
    description: 'All roots' 
  },
];

interface NotationOption {
  value: InputNotation;
  label: string;
}

const NOTATION_OPTIONS: NotationOption[] = [
  { 
    value: 'jazz', 
    label: 'Jazz Symbols', 
  },
  { 
    value: 'figuredBass', 
    label: 'Figured Bass', 
  },
];

export const GameConfig: React.FC<GameConfigProps> = ({ initialConfig, onStartGame, onBack }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>(initialConfig.difficulty);
  const [allowInversions, setAllowInversions] = useState<boolean>(initialConfig.allowInversions);
  const [includeSevenths, setIncludeSevenths] = useState<boolean>(initialConfig.includeSevenths);
  const [inputNotation, setInputNotation] = useState<InputNotation>(initialConfig.inputNotation);
  const [showNotationHelp, setShowNotationHelp] = useState<boolean>(false);

  const handleStart = () => {
    onStartGame({
      timeLimit: initialConfig.timeLimit,
      difficulty,
      allowInversions,
      includeSevenths,
      inputNotation,
    });
  };

  return (
    <div className="game-setup">
      <h1 className="game-title">Settings</h1>

      {/* Difficulty Selection */}
      <div className="setup-section">
        <h2>Difficulty</h2>
        <div className="config-options">
          {DIFFICULTY_OPTIONS.map((option) => (
            <button
              key={option.value}
              className={`config-option ${difficulty === option.value ? 'selected' : ''}`}
              onClick={() => setDifficulty(option.value)}
            >
              <span className="option-label">{option.label}</span>
              <span className="option-description">{option.description}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Inversions Toggle */}
      <div className="setup-section">
        <h2>Inversions</h2>
        <div className="toggle-options">
          <button
            className={`toggle-option ${!allowInversions ? 'selected' : ''}`}
            onClick={() => setAllowInversions(false)}
          >
            Root Position Only
          </button>
          <button
            className={`toggle-option ${allowInversions ? 'selected' : ''}`}
            onClick={() => setAllowInversions(true)}
          >
            Include Inversions
          </button>
        </div>
      </div>

      {/* Seventh Chords Toggle */}
      <div className="setup-section">
        <h2>Seventh Chords</h2>
        <div className="toggle-options">
          <button
            className={`toggle-option ${!includeSevenths ? 'selected' : ''}`}
            onClick={() => setIncludeSevenths(false)}
          >
            Triads Only
          </button>
          <button
            className={`toggle-option ${includeSevenths ? 'selected' : ''}`}
            onClick={() => setIncludeSevenths(true)}
          >
            Include 7th Chords
          </button>
        </div>
      </div>

      {/* Input Notation Selection */}
      <div className="setup-section">
        <h2>
          Input Notation
          <button 
            className="help-button" 
            onClick={() => setShowNotationHelp(true)}
            aria-label="Help with notation"
          >
            <sup>?</sup>
          </button>
        </h2>
        <div className="toggle-options">
          {NOTATION_OPTIONS.map((option) => (
            <button
              key={option.value}
              className={`toggle-option ${inputNotation === option.value ? 'selected' : ''}`}
              onClick={() => setInputNotation(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Notation Help Modal */}
      {showNotationHelp && (
        <div className="modal-overlay" onClick={() => setShowNotationHelp(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowNotationHelp(false)}>×</button>
            <h2>Input Notation Guide</h2>
            
            <div className="notation-section">
              <h3>Jazz Symbols</h3>
              <table className="notation-table">
                <thead>
                  <tr><th>Chord Type</th><th>Symbol</th><th>Example</th></tr>
                </thead>
                <tbody>
                  <tr><td>Major</td><td><em>none</em></td><td>C, F#, Bb</td></tr>
                  <tr><td>Minor</td><td>m</td><td>Cm, F#m, Bbm</td></tr>
                  <tr><td>Diminished</td><td>dim, o</td><td>Cdim, Co</td></tr>
                  <tr><td>Augmented</td><td>aug, +</td><td>Caug, C+</td></tr>
                  <tr><td>Major 7</td><td>maj7, M7</td><td>Cmaj7, Fmaj7</td></tr>
                  <tr><td>Minor 7</td><td>m7</td><td>Cm7, Am7</td></tr>
                  <tr><td>Dominant 7</td><td>7</td><td>C7, G7</td></tr>
                  <tr><td>Half-dim 7</td><td>m7b5, m7(b5), 07</td><td>Cm7b5, C07</td></tr>
                  <tr><td>Dim 7</td><td>dim7, o7</td><td>Cdim7, Co7</td></tr>
                </tbody>
              </table>
              <p className="notation-note">For inversions, add /bass note: <strong>C/E</strong>, <strong>G7/B</strong></p>
            </div>

            <div className="notation-section">
              <h3>Figured Bass</h3>
              <table className="notation-table">
                <thead>
                  <tr><th>Position</th><th>Triads</th><th>7th Chords</th></tr>
                </thead>
                <tbody>
                  <tr><td>Root position</td><td>C</td><td>C7</td></tr>
                  <tr><td>1st inversion</td><td>C6</td><td>C65, C6/5</td></tr>
                  <tr><td>2nd inversion</td><td>C64, C6/4</td><td>C43, C4/3</td></tr>
                  <tr><td>3rd inversion</td><td>--</td><td>C42, C4/2, C2</td></tr>
                </tbody>
              </table>
              <p className="notation-note">Use only the final symbol listed in each jazz symbol row (e.g., <strong>Co7</strong> for dim 7).</p>
            </div>
          </div>
        </div>
      )}

      <div className="button-row">
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>
        <button className="start-button" onClick={handleStart}>
          Start Game
        </button>
      </div>
    </div>
  );
};
