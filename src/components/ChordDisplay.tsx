import React, { useEffect, useRef } from 'react';
import { Renderer, Stave, StaveNote, Voice, Formatter, Accidental } from 'vexflow';
import type { Chord } from '../types';

interface ChordDisplayProps {
  chord: Chord;
}

// Convert to VexFlow format (need octave)
function noteToVexFlow(note: string, bassOctave: number = 4): { key: string; accidental?: string } {
  // Extract the bass (first char)
  const bass = note[0].toLowerCase();
  
  // Determine accidental
  let accidental: string | undefined;
  if (note.includes('##')) {
    accidental = '##';
  } else if (note.includes('bb')) {
    accidental = 'bb';
  } else if (note.includes('#')) {
    accidental = '#';
  } else if (note.includes('b')) {
    accidental = 'b';
  }

  return {
    key: `${bass}/${bassOctave}`,
    accidental,
  };
}

// Calculate octaves to keep chord in reasonable range
function calculateOctaves(notes: string[]): number[] {
  const noteOrder = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const octaves: number[] = [];
  let currentOctave = 4;

  for (let i = 0; i < notes.length; i++) {
    if (i === 0) {
      octaves.push(currentOctave);
    } else {
      const prevNote = notes[i - 1].replace(/[#b]/g, '');
      const currNote = notes[i].replace(/[#b]/g, '');
      const prevIndex = noteOrder.indexOf(prevNote);
      const currIndex = noteOrder.indexOf(currNote);
      
      // If current note is lower in the scale, wrap to next octave
      if (currIndex <= prevIndex) {
        currentOctave++;
      }
      octaves.push(currentOctave);
    }
  }

  return octaves;
}

export const ChordDisplay: React.FC<ChordDisplayProps> = ({ chord }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<Renderer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear previous render
    containerRef.current.innerHTML = '';

    // Create renderer
    const renderer = new Renderer(
      containerRef.current,
      Renderer.Backends.SVG
    );

    rendererRef.current = renderer;

    // Configure renderer
    renderer.resize(300, 180);
    const context = renderer.getContext();
    context.setFont('Arial', 10);

    // Create staff
    const stave = new Stave(10, 40, 280);
    stave.addClef('treble');
    stave.setContext(context).draw();

    // octaves
    const octaves = calculateOctaves(chord.notes);

    // Create notes with accidentals
    const vexNotes = chord.notes.map((note, index) => 
      noteToVexFlow(note, octaves[index])
    );

    // Create the chord as a StaveNote
    const staveNote = new StaveNote({
      keys: vexNotes.map(n => n.key),
      duration: 'w', // whole note
    });

    // Add accidentals
    vexNotes.forEach((note, index) => {
      if (note.accidental) {
        staveNote.addModifier(new Accidental(note.accidental), index);
      }
    });

    // Create voice and add note
    const voice = new Voice({ numBeats: 4, beatValue: 4 });
    voice.addTickables([staveNote]);

    // Format and draw
    new Formatter().joinVoices([voice]).format([voice], 250);
    voice.draw(context, stave);

  }, [chord]);

  return (
    <div className="chord-display">
      <div className="staff-container" ref={containerRef} />
      <div className="chord-hint">
        Identify this chord:
      </div>
    </div>
  );
};
