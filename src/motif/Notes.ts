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

	convertEnharmonic(noteName: string): string {
		// Define a mapping of notes with double sharps/flats to their enharmonic equivalents
		const enharmonicMap: { [key: string]: string } = {
			"C##": "D",
			"D##": "E",
			"E##": "F#",
			Fbb: "D",
			Gbb: "E",
			Abb: "G",
			Bbb: "A",
			Cb: "B",
			Fb: "E",
			"E#": "F",
			"B#": "C",
			// Add other double sharps or flats as needed
		};

		// Check if the note is in the map and return the mapped value, else return the original note
		return enharmonicMap[noteName] || noteName;
	}

	convertNoteNameToMidi(noteName: string) {
		const convertedNoteName = this.convertEnharmonic(noteName);

		const midiNote = Frequency(convertedNoteName).toMidi().valueOf();
		if (isNaN(midiNote)) {
			/* console.error(
				"Note provided could not be turned into a midi note. Note was: ",
				noteName
			); */
			return -1;
		}
		return midiNote;
	}

	reverse() {
		this.notenames = this.notenames.reverse();
	}
}

export default Notes;
