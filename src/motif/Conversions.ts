export function pitchToPitchClassNumber(pitch: string): number {
	const noteToPitchClass: { [note: string]: number } = {
		C: 0,
		"C#": 1,
		Db: 1,
		D: 2,
		"D#": 3,
		Eb: 3,
		E: 4,
		F: 5,
		"F#": 6,
		Gb: 6,
		G: 7,
		"G#": 8,
		Ab: 8,
		A: 9,
		"A#": 10,
		Bb: 10,
		B: 11,
	};

	const noteWithoutOctave: string = pitch.replace(/\d+/g, "");

	const note = noteWithoutOctave.match(/[A-G](#|b)?/)?.[0] || "";
	const pitchClassNumber = noteToPitchClass[note];

	return pitchClassNumber;
}

export function pitchClassNumberToNote(pitchClass: number): string {
	const pitchClassToNote: { [pitchClass: number]: string } = {
		0: "C",
		1: "C#",
		2: "D",
		3: "D#",
		4: "E",
		5: "F",
		6: "F#",
		7: "G",
		8: "G#",
		9: "A",
		10: "A#",
		11: "B",
	};

	const note = pitchClassToNote[pitchClass % 12]; // Ensure it's within 0-11

	return note;
}

export function midiNoteToPitchClassNumber(midiNote: number): number {
	// Ensure the input is within the valid MIDI note number range (0 to 127)
	if (midiNote < 0 || midiNote > 127) {
		throw new Error("Invalid MIDI note number.");
	}

	// Calculate the pitch class number
	const pitchClassNumber = midiNote % 12;

	return pitchClassNumber;
}

export function pitchClassToAllMidiNotes(
	pitchClass: number,
	numOctaves: number
): number[] {
	// Ensure the pitch class is within the valid range (0-11)
	if (pitchClass < 0 || pitchClass > 11) {
		throw new Error("Invalid pitch class number.");
	}

	// Ensure the number of octaves is a positive integer
	if (numOctaves <= 0) {
		throw new Error("Invalid number of octaves.");
	}

	// Calculate all MIDI notes for the given pitch class and octaves
	const midiNotes = [];
	for (let octave = 0; octave < numOctaves; octave++) {
		const midiNote = pitchClass + octave * 12;
		midiNotes.push(midiNote);
	}

	return midiNotes;
}
