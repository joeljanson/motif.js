import { Frequency } from "tone";

class Notes {
	private _notenames: Array<string>;

	constructor(notenames?: Array<string>) {
		this._notenames = notenames ?? [];
	}

	set notenames(newNotes: Array<string>) {
		this._notenames = newNotes;
	}

	get notenames(): Array<string> {
		return this._notenames;
	}

	get notesAsMidi(): Array<number> {
		const parsedNotes = this._notenames.map((noteName) => {
			return this.convertNoteNameToMidi(noteName);
		});
		return parsedNotes;
	}

	convertNoteNameToMidi(noteName: string) {
		const midiNote = Frequency(noteName).toMidi().valueOf();
		if (isNaN(midiNote)) {
			console.error(
				"Note provided could not be turned into a midi note. Note was: ",
				noteName
			);
			return -1;
		}
		return midiNote;
	}

	reverse() {
		this.notenames = this.notenames.reverse();
	}
}

export default Notes;
