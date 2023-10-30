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
	harmonizations: Array<Array<number>>;
	velocities: Array<number>;
	notesToPlayAtIndex: Array<Array<number>>;
	length: number | undefined;
};

export type MotifPartOptions = {
	time: number;
	duration: number;
	//noteIndex: number;
	//transposition: number;
	//octaveShift: number;
	//notesToPlayAtIndex: Array<number>;
	index: number;
	velocity: number;
};

class Motif {
	private _motif: MotifOptions;
	private _notes: Notes;
	private _part: Part | undefined;
	private _globalTransposition: number = 0;
	private _key: Array<number>; // An array containing the pitchclasses in the current key
	private _length: number | undefined;

	public position: number;

	constructor(motif?: Partial<MotifOptions>) {
		this._motif = {
			times: [0],
			noteIndexes: [0],
			transpositions: [0],
			octaveShifts: [0],
			notesToPlayAtIndex: [[0]],
			harmonizations: [[0]],
			velocities: [0.5],
			length: undefined,
		};

		this._motif.times = motif?.times ?? [0];
		this._motif.noteIndexes = motif?.noteIndexes ?? [0];
		this._motif.transpositions = motif?.transpositions ?? [0];
		this._motif.octaveShifts = motif?.octaveShifts ?? [0];
		this._motif.harmonizations = motif?.harmonizations ?? [[0]];
		this._motif.velocities = motif?.velocities ?? [0.5];
		this._motif.notesToPlayAtIndex = motif?.notesToPlayAtIndex ?? [[0]];
		console.log(this._motif);

		this._notes = new Notes();
		this._key = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
		this._length = motif?.length ?? undefined;

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
						velocity:
							this._motif.velocities[index % this._motif.velocities.length],
						/* noteIndexes: this._motif.noteIndexes[index],
						transpositions: this._motif.transpositions[index],
						octaveShifts: this._motif.octaveShifts[index], */
					};
				}
			);
			return motifParts;
		}
		return [];
	}

	set length(loopLength: number) {
		this._length = loopLength;
	}

	get length() {
		if (this._motif) {
			if (!this._length) {
				const length = this.motif.reduce(
					(rhythmAcc, value) => rhythmAcc + value.duration,
					0
				);
				return length;
			} else {
				return this._length;
			}
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
		if (this._motif.noteIndexes.length > this._motif.times.length) {
			console.log("Noteindexes are longer!");
			this._motif.notesToPlayAtIndex = this.getNoteIndexesToPlayFromArray(
				this._motif.noteIndexes
			);
		} else {
			this._motif.notesToPlayAtIndex = this._motif.times.map(
				(time: any, index: number) => {
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
					const noteIndex =
						this._motif.noteIndexes[index % this._motif.noteIndexes.length];

					const midiNoteToPlay =
						this.notes.notesAsMidi[noteIndex % this.notes.notesAsMidi.length];
					const midiNoteChroma = Note.chroma(Note.fromMidi(midiNoteToPlay));
					if (midiNoteChroma != null) {
						const indexOfNoteInMidiPitchclasses =
							midiPitchClasses.indexOf(midiNoteChroma);
						/* console.log(
					"indexOfNoteInMidiPitchclasses:",
					indexOfNoteInMidiPitchclasses
				); */
						let transposedMidiIndex =
							(indexOfNoteInMidiPitchclasses +
								this._motif.transpositions[
									index % this._motif.transpositions.length
								] +
								midiPitchClasses.length) %
							midiPitchClasses.length;
						//console.log("Transposed midi note is: ", transposedMidiIndex);

						const finalMidiNote =
							midiPitchClasses[transposedMidiIndex] +
							(midiNoteToPlay - midiNoteChroma) +
							this._motif.octaveShifts[
								index % this._motif.octaveShifts.length
							] *
								12 +
							this.transposition;
						//console.log("Final midi note is: ", finalMidiNote);

						const harmonizedNotes = this._motif.harmonizations[
							index % this._motif.harmonizations.length
						].map((note) => {
							return note + finalMidiNote;
						});

						return harmonizedNotes;
					} else {
						return [0];
					}
				}
			);
		}
		//console.log(this._motif.notesToPlayAtIndex);
	}

	getNoteIndexesToPlayFromArray(array: number[]) {
		return array.map((noteIndex: number, index: number) => {
			const midiPitchClasses = Array.from(new Set([...this.key]));

			const allMidiNotes = midiPitchClasses
				.map((pitchClass) => pitchClassToAllMidiNotes(pitchClass, 12))
				.flat();
			allMidiNotes.sort((a, b) => a - b);

			const midiNoteToPlay =
				this.notes.notesAsMidi[noteIndex % this.notes.notesAsMidi.length];
			const midiNoteChroma = Note.chroma(Note.fromMidi(midiNoteToPlay));
			if (midiNoteChroma != null) {
				const indexOfNoteInMidiPitchclasses =
					midiPitchClasses.indexOf(midiNoteChroma);

				let transposedMidiIndex =
					(indexOfNoteInMidiPitchclasses +
						this._motif.transpositions[
							index % this._motif.transpositions.length
						] +
						midiPitchClasses.length) %
					midiPitchClasses.length;

				const finalMidiNote =
					midiPitchClasses[transposedMidiIndex] +
					(midiNoteToPlay - midiNoteChroma) +
					this._motif.octaveShifts[index % this._motif.octaveShifts.length] *
						12 +
					this.transposition;

				const harmonizedNotes = this._motif.harmonizations[
					index % this._motif.harmonizations.length
				].map((note) => {
					return note + finalMidiNote;
				});

				return harmonizedNotes;
			} else {
				return [0];
			}
		});
	}

	get notesToPlayAtIndex(): Array<Array<number>> {
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
		console.log(this._motif);
		console.log(this._motif.notesToPlayAtIndex);
		console.log(this.notesToPlayAtIndex[1]);
		if (!this._part) {
			this._part = new Part((time, note: MotifPartOptions) => {
				// the notes given as the second element in the array
				// will be passed in as the second argument
				const lookAhead = 0.1 + (time - Transport.now());
				const notesToPlay = this.notesToPlayAtIndex[note.index];
				console.log("Notes to play", notesToPlay);
				midiHandler.playNotes({
					notes: notesToPlay,
					time: lookAhead,
					duration: note.duration,
					velocity: note.velocity,
				});
				console.log("Playing notes: ", notesToPlay);
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
					notes: notesToPlay,
					time: lookAhead,
					duration: note.duration,
					velocity: note.velocity,
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
