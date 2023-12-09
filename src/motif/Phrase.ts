import { Part } from "tone";
import Motif from "./Motif";
import { Chord, Scale } from "tonal";

// Define the structure of the object expected by the constructor
type PhraseConstructorArg = {
	time: number | string;
	chord: string[] | string;
	key: string[] | string;
}[];

class Phrase {
	private sequence: PhraseConstructorArg;
	private motifs: Motif[] = [];
	private part: Part<any>;
	private key: Array<number>; // Pitch classes in the current key

	constructor(sequence: PhraseConstructorArg, length: number | string) {
		this.sequence = sequence;

		this.key = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]; // Chromatic scale
		// Setup the Tone.js part with the provided sequence
		this.part = new Part((time, object) => {
			// Handle the note playing logic here
			// For example, triggering a synth or sampler
			let key: string[] = [];
			if (Array.isArray(object.key)) {
				key = object.key;
			} else {
				key = Scale.get(object.key).notes;
			}
			let chord: string[] = [];
			if (Array.isArray(object.chord)) {
				chord = object.chord;
			} else {
				//chord = Chord.get(object.chord).notes;
				const internalChord = Chord.get(object.chord);
				chord = Chord.getChord(
					internalChord.aliases[0],
					internalChord.tonic + "4",
					internalChord.tonic + "4"
				).notes;
			}
			this.motifs.forEach((motif) => {
				motif.setNoteNames(chord);
				console.log("Updated chord");
				motif.setKeyWithStrings(key);
				console.log("Updated key");
			});
		}, this.sequence);
		this.part.loop = true;
		this.part.loopEnd = length;
	}

	add(motif: Motif): void {
		this.motifs.push(motif);
	}

	start(time: string | number = 0): void {
		this.part.start(time);
		//console.log("motifs: ", this.motifs);
		this.motifs.forEach((motif) => motif.start(time));
	}
}

export default Phrase;
