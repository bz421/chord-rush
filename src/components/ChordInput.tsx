import React, { useState, useRef, useEffect } from 'react';
import type { Chord } from '../types';
import { validateChordInput } from '../utils/chordValidator';

interface ChordInputProps {
  chord: Chord;
  onCorrectAnswer: () => void;
  disabled?: boolean;
}

export const ChordInput: React.FC<ChordInputProps> = ({
  chord,
  onCorrectAnswer,
  disabled = false,
}) => {
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState<{ message: string; isError: boolean } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when chord changes
  useEffect(() => {
    if (inputRef.current && !disabled) {
      inputRef.current.focus();
    }
    // Clear input when chord changes
    setInput('');
    setFeedback(null);
  }, [chord, disabled]);

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (disabled || !input.trim()) return;

    if (validateChordInput(input, chord)) {
      setFeedback({ message: 'Correct!', isError: false });
      setInput('');
      // small delay for feedback
      setTimeout(() => {
        setFeedback(null);
        onCorrectAnswer();
      }, 150);
    } else {
      setFeedback({ message: 'Try again!', isError: true });
      // Shake animation trigger
      if (inputRef.current) {
        inputRef.current.classList.add('shake');
        setTimeout(() => {
          inputRef.current?.classList.remove('shake');
        }, 500);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    if (feedback?.isError) {
      setFeedback(null);
    }
  };

  return (
    <form className="chord-input-container" onSubmit={handleSubmit}>
      <div className="input-wrapper">
        <input
          ref={inputRef}
          type="text"
          className={`chord-input ${feedback?.isError ? 'error' : ''} ${feedback && !feedback.isError ? 'success' : ''}`}
          value={input}
          onChange={handleChange}
          placeholder="Enter chord name..."
          disabled={disabled}
          autoComplete="off"
          autoCapitalize="off"
          spellCheck={false}
        />
        <button 
          type="submit" 
          className="submit-button"
          disabled={disabled || !input.trim()}
        >
          Submit
        </button>
      </div>
      {feedback && (
        <div className={`feedback ${feedback.isError ? 'feedback-error' : 'feedback-success'}`}>
          {feedback.message}
        </div>
      )}
      <div className="input-hint">
        Press Enter to submit
      </div>
    </form>
  );
};
