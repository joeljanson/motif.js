import { Frequency } from "tone";

class Notes {
	private _notenames: Array<number | string>;

	constructor(notenames?: Array<number | string>) {
		this._notenames = notenames ?? ["C4", "E4", "G4"];
	}

	set notenames(newNotes: Array<number | string>) {
		this._notenames = newNotes;
	}

	get notenames(): Array<number | string> {
		return this._notenames;
	}

	get notesAsMidi(): Array<number> {
		const parsedNotes = this._notenames.map((noteName) => {
			const midiNote = Frequency(noteName).toMidi().valueOf();
			if (isNaN(midiNote)) {
				console.error(
					"Note provided could not be turned into a midi note. Note was: ",
					noteName
				);
				return -1;
			}
			return midiNote;
		});
		return parsedNotes;
	}

	reverse() {
		this.notenames = this.notenames.reverse();
	}
}

export default Notes;
