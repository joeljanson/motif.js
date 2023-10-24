import { Time } from "tone";
import { Frequency, Part, Transport, now } from "tone";
import MidiHandler from "../midi-handling/MidiHandler";
import Generator from "./Generator";
import Notes from "./Notes";
import {
	midiNoteToPitchClassNumber,
	pitchClassNumberToNote,
	pitchClassToAllMidiNotes,
	pitchToPitchClassNumber,
} from "./Conversions";
import { Note } from "tonal";

export type MotifOptions = {
	times: Array<number | string>;
	noteIndexes: Array<number>;
	transpositions: Array<number>;
	octaveShifts: Array<number>;
	notesToPlayAtIndex: Array<number>;
};

export type MotifPartOptions = {
	time: number;
	duration: number;
	//noteIndex: number;
	//transposition: number;
	//octaveShift: number;
	//notesToPlayAtIndex: Array<number>;
	index: number;
};

class Motif {
	private _motif: MotifOptions;
	private _notes: Notes;
	private _part: Part | undefined;
	private _globalTransposition: number = 0;
	private _key: Array<number>; // An array containing the pitchclasses in the current key

	public position: number;

	constructor(motif?: Partial<MotifOptions>) {
		this._motif = {
			times: [0],
			noteIndexes: [0],
			transpositions: [0],
			octaveShifts: [0],
			notesToPlayAtIndex: [0],
		};

		this._motif.times = motif?.times ?? [0];
		this._motif.noteIndexes = motif?.noteIndexes ?? [0];
		this._motif.transpositions = motif?.transpositions ?? [0];
		this._motif.octaveShifts = motif?.octaveShifts ?? [0];
		this._motif.notesToPlayAtIndex = motif?.notesToPlayAtIndex ?? [0];
		console.log(this._motif);

		this._notes = new Notes();
		this._key = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

		this.position = 0;
		this.updateNotesToPlayAtIndex();
	}

	get motif(): MotifPartOptions[] {
		// Assuming all arrays in _motifs have the same length
		if (this._motif) {
			const length = this._motif.times.length;
			console.log("The lenght of the motif is: ", length);
			let startOffset = 0;
			// Use map to create MotifPartOptions objects
			const motifParts: MotifPartOptions[] = Array.from(
				{ length },
				(_, index) => {
					const time = startOffset;
					const duration = Time(this._motif.times[index]).toSeconds();
					startOffset += duration;
					return {
						time: time,
						duration: duration,
						index: index,
						//noteIndex: this._motif.noteIndex[index],
						//transposition: this._motif.transposition[index],
						//octaveShift: this._motif.octaveShift[index],
					};
				}
			);
			return motifParts;
		}
		return [];
	}

	get length() {
		if (this._motif) {
			const length = this.motif.reduce(
				(rhythmAcc, value) => rhythmAcc + value.duration,
				0
			);
			return length;
		} else {
			return 0;
		}
	}

	set notes(notes: Notes) {
		this._notes = notes;
	}

	get notes(): Notes {
		return this._notes;
	}

	get key(): Array<number> {
		return this._key;
	}

	get transposition() {
		return this._globalTransposition;
	}

	set transposition(transposition: number) {
		this._globalTransposition = transposition;
	}

	setKeyWithStrings(key: Array<string>) {
		const pitchClassNumbers = key.map(pitchToPitchClassNumber);
		this._key = pitchClassNumbers;
	}

	setNoteNames(notenames: Array<string>) {
		this.notes.notenames = notenames;
		this.updateNotesToPlayAtIndex();
	}

	updateNotesToPlayAtIndex() {
		this._motif.notesToPlayAtIndex = this._motif.noteIndexes.map(
			(noteIndex, index) => {
				const midiPitchClasses = Array.from(
					new Set([
						//...this.notes.notesAsMidi.map(midiNoteToPitchClassNumber),
						...this.key,
					])
				);

				//console.log("Midi pitchclasses: ", midiPitchClasses);
				//console.log("This key: ", this._key);
				//const notePC = Note.chroma(note);
				//const midiNote = Note.midi(note);

				const allMidiNotes = midiPitchClasses
					.map((pitchClass) => pitchClassToAllMidiNotes(pitchClass, 12))
					.flat();
				allMidiNotes.sort((a, b) => a - b);
				//console.log("All midi notes:", allMidiNotes);

				const midiNoteToPlay =
					this.notes.notesAsMidi[noteIndex % this.notes.notesAsMidi.length];
				const midiNoteChroma = Note.chroma(Note.fromMidi(midiNoteToPlay));
				//console.log("midiNoteToPlay midi notes:", midiNoteToPlay);
				if (midiNoteChroma != null) {
					const indexOfNoteInMidiPitchclasses =
						midiPitchClasses.indexOf(midiNoteChroma);
					/* console.log(
					"indexOfNoteInMidiPitchclasses:",
					indexOfNoteInMidiPitchclasses
				); */
					let transposedMidiIndex =
						(indexOfNoteInMidiPitchclasses +
							this._motif.transpositions[index] +
							midiPitchClasses.length) %
						midiPitchClasses.length;

					const finalMidiNote =
						midiPitchClasses[transposedMidiIndex] +
						(midiNoteToPlay - midiNoteChroma) +
						this._motif.octaveShifts[index] * 12 +
						this.transposition;
					//console.log("Final midi note is: ", finalMidiNote);
					return finalMidiNote;
				} else {
					return 0;
				}
			}
		);
		//console.log(this._motif.notesToPlayAtIndex);
	}

	get notesToPlayAtIndex(): Array<number> {
		return this._motif.notesToPlayAtIndex;
	}

	get times() {
		return this._motif.times;
	}

	set times(newTimes: Array<number | string>) {
		this._motif.times = newTimes;
		this.updatePart();
	}

	set noteIndexes(newNoteIndexes: Array<number>) {
		this._motif.noteIndexes = newNoteIndexes;
		this.updatePart();
	}

	set transpositions(newTranspositions: Array<number>) {
		this._motif.transpositions = newTranspositions;
		this.updatePart();
	}

	set octaveShifts(newOctaveShifts: Array<number>) {
		this._motif.octaveShifts = newOctaveShifts;
		this.updatePart();
	}

	updatePart() {
		if (this._part) {
			this._part.clear();
			this.motif.forEach((subMotif) => {
				this._part?.add(subMotif.time, subMotif);
			});
			this._part.loopEnd = this.length;
		}
	}

	start(startTime: number | string = 0) {
		const midiHandler = MidiHandler.getInstance();
		if (!this._part) {
			this._part = new Part((time, note: MotifPartOptions) => {
				// the notes given as the second element in the array
				// will be passed in as the second argument
				const lookAhead = 0.1 + (time - Transport.now());
				const notesToPlay = this.notesToPlayAtIndex[note.index];
				midiHandler.playNotes({
					notes: [notesToPlay],
					time: lookAhead,
					duration: note.duration,
					velocity: 0.5,
				});
				//console.log("Playing notes: ", notesToPlay);
				console.log("Playing for duration: ", note.duration);
				// console.log("Playing with velocity: ", 0.5);
			}, this.motif);
			this._part.start(
				"+" + Time(startTime).toSeconds() + Time(this.position).toSeconds()
			);
			this._part.loop = true;
			//this._part.loop = loop;
			this._part.loopEnd = this.length;
			Transport.start();
		} else {
			this._part = new Part((time, note: MotifPartOptions) => {
				// the notes given as the second element in the array
				// will be passed in as the second argument
				const lookAhead = 0.1 + time - now();
				const notesToPlay = this.notesToPlayAtIndex[note.index];
				midiHandler.playNotes({
					notes: [notesToPlay],
					time: lookAhead,
					duration: note.duration,
					velocity: 0.5,
				});
				//console.log("Playing notes: ", notesToPlay);
				console.log("Playing for duration: ", note.duration);
				// console.log("Playing with velocity: ", 0.5);
			}, this.motif);
			this._part.start("+" + Time(startTime).toSeconds());
			this._part.loop = true;
			//this._part.loop = loop;
			this._part.loopEnd = this.length;
			Transport.start();
		}
	}
	stop() {
		if (this._part) {
			this._part.stop();
		}
	}
	reverse() {
		this._motif.times.reverse();
		this._motif.noteIndexes.reverse();
		this._motif.transpositions.reverse();
		this._motif.octaveShifts.reverse();
	}
}

export default Motif;
