import { Part, Transport } from "tone";
import Notes from "./Notes";
import Motif, { MotifPartOptions } from "./Motif";

export type PhrasePart = {
	time: number;
	index: number;
};

class Phrase {
	private _motifs: Array<Motif>;
	private _part: Part | undefined;

	constructor() {
		this._motifs = [];
	}

	addMotif(motif: Motif) {
		motif.position = this.length;
		console.log("Phrase length: ", this.length);
		this._motifs.push(motif);
	}

	get phrase(): PhrasePart[] {
		// Assuming all arrays in _motifs have the same length
		if (this._motifs) {
			return this._motifs
				.map((motif, index) => {
					return { time: motif.position, index: index };
				})
				.flat();
		}
		return [];
	}

	get length() {
		if (this._motifs) {
			return this._motifs.reduce((acc, motif) => {
				// Calculate the length of each individual rhythm and add it to the accumulator
				const rhythmLength = motif.motif.reduce(
					(rhythmAcc, value) => rhythmAcc + value.duration,
					0
				);
				return acc + rhythmLength;
			}, 0);
		}
		return 0;
	}

	setNotesFromNoteNames(notes: Array<string>) {
		if (this._motifs) {
			this._motifs.forEach((motif) => (motif.notes.notenames = notes));
		}
	}

	set notes(notes: Notes) {
		if (this._motifs) {
			this._motifs.forEach((motif) => (motif.notes = notes));
		}
	}

	get notes(): Notes {
		return this._motifs.map((motif) => motif.notes)[0];
	}

	get key(): Array<number> {
		return this._motifs.map((motif) => motif.key)[0];
	}

	startPhrase(loop: boolean) {
		if (!this._part) {
			this._part = new Part((time, part: PhrasePart) => {
				console.log("Starttime for motif:", part);
				const motif = this._motifs[part.index];
				motif.start(0.1);
			}, this.phrase);
			this._part.start();
			this._part.loop = loop;
			this._part.loopEnd = this.length;
			Transport.start();
		}
	}
}

export default Phrase;
