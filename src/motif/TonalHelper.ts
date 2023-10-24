import { Chord, Interval, Note, Scale } from "tonal";

// Define a function to get the major scale of a note
export function getMajorScale(noteName: string): string[] {
	// Create the major scale using Tonal.js
	const majorScale = Scale.get(`${noteName} minor`);
	return majorScale.notes;
}

export function getChordsFromScale(scale: Array<string>): any {
	// Initialize an empty array to store the chords
	const finalChords = scale.map((scalenote, index) => {
		const chord = [scalenote];
		chord.push(scale[(index + 2) % scale.length]);
		chord.push(scale[(index + 4) % scale.length]);
		//Chord.detect(chord)
		const tonalChord = Chord.get(Chord.detect(chord)[0]);
		const transposedTonalChord = Chord.getChord(
			tonalChord.aliases[0],
			tonalChord.notes[0] + "4",
			tonalChord.notes[0] + "4"
		); // =>
		return transposedTonalChord;
	});
	return finalChords;
}
export function quantizeNotesToScale(notes: Array<any>, scale: string) {
	return notes.map((note) => quantizeNote(note, scale));
}

export function quantizeNote(note: any, scale: string) {
	// Get the notes of the scale
	//["C", "D", "E"].map(Note.chroma); // => [0, 2, 4]
	const notePC = Note.chroma(note);
	const midiNote = Note.midi(note);
	if (midiNote && notePC) {
		//console.log(midiNote);
		//console.log(notePC + (midiNote - notePC));
	}
	const scalePC = Scale.get(scale).notes.map(Note.chroma);
	const findClosestIndex = (notePC: any, scalePC: Array<any>) =>
		scalePC.reduce(
			(acc, val, idx) =>
				Math.abs(notePC - val) < Math.abs(notePC - scalePC[acc]) ? idx : acc,
			0
		);
	const transposedPC = scalePC[findClosestIndex(notePC, scalePC)];
	/* console.log("transposedPC: ", transposedPC);
	console.log("notePC: ", notePC);
	console.log("scalePC: ", scalePC); */
	if (transposedPC != null && midiNote != null && notePC != null) {
		return Note.fromMidi(transposedPC + (midiNote - notePC));
	} else {
		return "";
	}
}

class NoteSequence {
	public sequence: Array<string>;
	constructor(startingNote: string) {
		this.sequence = [startingNote];
		console.log("Has been created!");
	}
	repeat(transposition: number = 0) {
		const lastNote = Note.get(this.sequence[this.sequence.length - 1]);
		const intervalToTransposeBy = Interval.fromSemitones(transposition);
		const transposedNote = Note.simplify(
			Note.transpose(lastNote, intervalToTransposeBy)
		);
		this.sequence.push(transposedNote);
		return this;
	}
	addUpwardsShape(range: number, count: number) {
		// Create an empty array to hold the random numbers.
		const randomNumbers: number[] = [];

		// Generate 'count' random numbers within the specified range.
		for (let i = 0; i < count; i++) {
			const randomNumber = 1 + Math.floor(Math.random() * (range + 1));
			randomNumbers.push(randomNumber);
		}

		// Sort the array in ascending order.
		randomNumbers.sort((a, b) => a - b).forEach((value) => this.repeat(value));
		return this;
	}
}
export default NoteSequence;
