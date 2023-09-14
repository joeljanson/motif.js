import { Time } from "tone";
import { Frequency, Part, Transport, now } from "tone";
import MidiHandler from "../midi-handling/MidiHandler";
import Generator from "./Generator";
import Notes from "./Notes";

type MotifOptions = {
	time: Array<number | string>;
	duration: Array<number>;
	noteIndex: Array<number>;
	transposition: Array<number>;
	octaveShift: Array<number>;
};

type MotifPartOptions = {
	time: number;
	duration: number;
	noteIndex: number;
	transposition: number;
	octaveShift: number;
};

class Motif {
	private _motif: MotifOptions;
	private _notes: Notes;
	private _length: number | string;
	private _part: Part | undefined;
	//MotifOptions: Array<MotifOptions>; // Updated type name here

	constructor(motif?: MotifOptions) {
		this._motif = motif ?? {
			time: [0],
			duration: [0],
			noteIndex: [0],
			transposition: [0],
			octaveShift: [0],
		};
		this._notes = new Notes();
		this._length = 0;
	}

	get motif(): MotifPartOptions[] {
		// Assuming all arrays in _motifs have the same length
		if (this._motif) {
			const length = this._motif.time.length;
			console.log("The lenght of the motif is: ", length);
			let startOffset = 0;
			// Use map to create MotifPartOptions objects
			const motifParts: MotifPartOptions[] = Array.from(
				{ length },
				(_, index) => {
					const time = startOffset;
					const duration = Time(this._motif.time[index]).toSeconds();
					startOffset += duration;
					return {
						time: time,
						duration: duration,
						noteIndex: this._motif.noteIndex[index],
						transposition: this._motif.transposition[index],
						octaveShift: this._motif.octaveShift[index],
					};
				}
			);
			return motifParts;
		}
		return [];
	}

	// addRythm(rythm: Array<string | number>) {
	// 	this._rythms.push(this.convertRythmToRythmMotif(rythm));
	// }

	// Setter for rythms
	// set rythms(val: Array<Array<MotifOptions>>) {
	// 	this._rythms = val.map((singleRythm) =>
	// 		singleRythm.map((singleBeat) => {
	// 			return {
	// 				time: Time(singleBeat.time).toSeconds(),
	// 				noteIndex: singleBeat.noteIndex,
	// 				duration: singleBeat.duration,
	// 			};
	// 		})
	// 	);
	// }

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

	set transposition(newTransposition: Array<number>) {
		this._motif.transposition = newTransposition;
		this.updatePart();
	}

	updatePart() {
		if (this._part) {
			this._part.clear();
			this.motif.forEach((subMotif) => {
				this._part?.add(subMotif.time, subMotif);
			});
		}
	}

	startRythm(loop: boolean) {
		const midiHandler = MidiHandler.getInstance();
		if (!this._part) {
			this._part = new Part((time, note: MotifPartOptions) => {
				// the notes given as the second element in the array
				// will be passed in as the second argument
				const lookAhead = 0.1 + time - now();
				// const vel = floor(map(mouseX, 0, width, 10, 127, true));
				//console.log("The lookahead is: ", lookAhead);
				const notesToPlay =
					this.notes.notesAsMidi[
						note.noteIndex % this.notes.notesAsMidi.length
					] +
					note.transposition +
					note.octaveShift * 12;
				midiHandler.playNotes({
					notes: [notesToPlay],
					time: lookAhead,
					duration: note.duration,
					velocity: 0.5,
				});
				console.log("Playing notes: ", notesToPlay);
				console.log("Playing for duration: ", note.duration);
				console.log("Playing with velocity: ", 0.5);
			}, this.motif);
			this._part.start();
			this._part.loop = loop;
			this._part.loopEnd = this.length;
			Transport.start();
		}
	}
}

export default Motif;
