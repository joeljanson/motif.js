import { Time } from "tone";
import { Frequency, Part, Transport, now } from "tone";
import MidiHandler from "../midi-handling/MidiHandler";
import Generator from "./Generator";
import Notes from "./Notes";
import {
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
	notes?: Notes;
	midi?: {
		channel: number;
	};
};

export type MotifPartOptions = {
	time: number;
	duration: number;
	index: number;
	velocity: number;
};

class Motif {
	// Properties of the Motif class
	private _motif: MotifOptions;
	private _notes: Notes;
	private _part: Part | undefined;
	private _globalTransposition: number = 0;
	private _key: Array<number>; // Pitch classes in the current key
	private _length: number | undefined;
	private _loop: boolean = false;
	private _lastPitchClass: number | null = null;

	public position: number;

	constructor(motif?: Partial<MotifOptions>) {
		this._motif = this.initializeMotif(motif);
		this._notes = this._motif.notes!;
		this._key = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
		this._length = motif?.length ?? undefined;
		this.position = 0;
		this._part = new Part((time, note: MotifPartOptions) => {}, this.motif);
		this.updateNotesToPlayAtIndex();
	}

	// Initialize motif with default values or provided motif options
	private initializeMotif(motif?: Partial<MotifOptions>): MotifOptions {
		// Default values
		let defaultMotif: MotifOptions = {
			// Default values for each property
			times: [0],
			noteIndexes: [0],
			transpositions: [0],
			octaveShifts: [0],
			notesToPlayAtIndex: [[0]],
			harmonizations: [[0]],
			velocities: [0.5],
			length: undefined,
			notes: new Notes(["C4"]),
			midi: {
				channel: 1,
			},
		};

		return {
			...defaultMotif,
			...motif,
		};
	}

	get motif(): MotifPartOptions[] {
		// Assuming all arrays in _motifs have the same length
		if (this._motif) {
			const length = this._motif.times.length;
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

	set loop(loop: boolean) {
		if (this._part) {
			this._part.loop = loop;
		}
		this._loop = loop;
	}

	get loop() {
		return this._loop;
	}

	setKeyWithStrings(key: Array<string>) {
		const pitchClassNumbers = key.map(pitchToPitchClassNumber);
		this._key = pitchClassNumbers;
		this.updateNotesToPlayAtIndex();
	}

	setNoteNames(notenames: Array<string>) {
		this.notes.notenames = notenames;
		this.updateNotesToPlayAtIndex();
	}

	updateNotesToPlayAtIndex() {
		// Determine the longer array
		const longerLength = Math.max(
			this._motif.noteIndexes.length,
			this._motif.times.length
		);

		this._motif.notesToPlayAtIndex = Array.from(
			{ length: longerLength },
			(_, index) => {
				// Determine the note index and calculate the MIDI note to play
				const noteIndex =
					this._motif.noteIndexes[index % this._motif.noteIndexes.length];
				if (noteIndex < 0) {
					return [0];
				}
				const midiNoteToPlay =
					this.notes.notesAsMidi[noteIndex % this.notes.notesAsMidi.length];
				const midiNoteChroma = midiNoteToPlay % 12;

				if (midiNoteChroma != null) {
					// Calculate the final MIDI note
					const finalMidiNote =
						midiNoteToPlay +
						this._motif.octaveShifts[index % this._motif.octaveShifts.length] *
							12 +
						this._motif.transpositions[
							index % this._motif.transpositions.length
						] +
						this._globalTransposition;

					// Calculate the harmonized notes
					const harmonizedNotes = this._motif.harmonizations[
						index % this._motif.harmonizations.length
					].map((note) => {
						let harmonizedNote = note + finalMidiNote;
						let pitchClass = harmonizedNote % 12;

						// Check if the pitch class is in the key
						if (!this._key.includes(pitchClass)) {
							pitchClass = this.findClosestPitchClass(pitchClass, this._key);
							harmonizedNote =
								harmonizedNote - (harmonizedNote % 12) + pitchClass;
						}

						return harmonizedNote;
					});

					return harmonizedNotes;
				} else {
					return [0];
				}
			}
		);
	}

	findClosestPitchClass(pitchClass: number, key: Array<number>): number {
		let closest = key[0];
		let smallestDiff = Math.abs(key[0] - pitchClass);

		for (let k of key) {
			let diff = Math.abs(k - pitchClass);
			if (diff < smallestDiff) {
				smallestDiff = diff;
				closest = k;
			}
		}

		return closest;
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

	set harmonizations(newHarmonizations: Array<Array<number>>) {
		this._motif.harmonizations = newHarmonizations;
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
		this.updateNotesToPlayAtIndex();
	}

	start(startTime: number | string = 0) {
		const midiHandler = MidiHandler.getInstance();
		this.updatePart();
		this._part!.callback = (time, note: MotifPartOptions) => {
			// the notes given as the second element in the array
			// will be passed in as the second argument
			const lookAhead = 0.1 + (time - Transport.now());
			const notesToPlay = this.notesToPlayAtIndex[note.index];
			midiHandler.playNotes({
				notes: notesToPlay,
				time: lookAhead,
				duration: note.duration,
				velocity: note.velocity,
				channel: this._motif.midi?.channel ?? 1,
			});
			// console.log("Playing with velocity: ", 0.5);
		};

		this._part!.start(
			"+" + Time(startTime).toSeconds() + Time(this.position).toSeconds()
		);
		this._part!.loop = this._loop;
		this._part!.loopEnd = this.length;
		Transport.start();
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
