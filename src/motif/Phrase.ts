import { Part } from "tone";
import Motif from "./Motif";

// Define the structure of the object expected by the constructor
type PhraseConstructorArg = {
	time: number | string;
	chord: string[];
	key: string[];
}[];

class Phrase {
	private sequence: PhraseConstructorArg;
	private motifs: Motif[] = [];
	private part: Part<any>;

	constructor(sequence: PhraseConstructorArg, length: number | string) {
		this.sequence = sequence;

		// Setup the Tone.js part with the provided sequence
		this.part = new Part((time, object) => {
			// Handle the note playing logic here
			// For example, triggering a synth or sampler
			this.motifs.forEach((motif) => {
				motif.setNoteNames(object.chord);
				motif.setKeyWithStrings(object.key);
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
		console.log("motifs: ", this.motifs);
		this.motifs.forEach((motif) => motif.start(time));
	}
}

export default Phrase;
