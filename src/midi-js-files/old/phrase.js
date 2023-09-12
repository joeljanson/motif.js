class RythmObject {
	constructor(
		time = 0,
		noteindex = [0],
		duration = 1,
		subdivision = "4n",
		velocity = 50
	) {
		this.time = time * Tone.Time(subdivision).toSeconds();
		this.noteindex = noteindex;
		this.duration = duration;
		this.velocity = velocity;
	}
}

const rythmPatterns = {
	one: [new RythmObject(0, 0, 1)],
	two: [new RythmObject(0, 0, 1 / 2), new RythmObject(1 / 2, 1, 1 / 2)],
};

class Phrase {
	/**
	 * @param notes Either an array of notes or a phrase object
	 */
	constructor(notes, stop) {
		this.notes = [];
		this.phrases = [];

		//console.log("Notes is: ", notes);

		if (Array.isArray(notes) && !stop) {
			//console.log("Instance is created from an array of notes");
			notes.forEach((note) => {
				if (Array.isArray(note)) {
					this.phrases.push(new Phrase(note));
					this.notes.push(note);
				} else {
					this.phrases.push(new Phrase(note, true));
					this.notes.push(note);
				}
			});
		} else if (notes instanceof Phrase) {
			console.log("Instance is created from a phrase");
			console.log(
				"This is what's left. How to create a phrase from a more complex phrase?"
			);
			//this.phrases.push(new Phrase(notes.notes));
		} else {
			//console.log("Note is just a simple note");
			if (!stop) {
				this.phrases.push(new Phrase(notes, true));
			} else {
				this.notes.push(notes);
			}
		}
	}

	set harmony(steps) {
		if (steps) {
			this._harmony = steps;
		}
	}

	get harmony() {
		return this?._harmony ?? [0];
	}

	/**
	 * @param harmony Should be an array of semitones that will be used to harmonize the notes of the phrases and add them to the notes array.
	 */
	get harmonized() {
		console.log(
			"Get harmonized should return the notes array of the current phrase with the added notes as a new phrase: ",
			this.phrases
		);

		if (this.phrases.length > 0) {
			//So if we have any phrases, go deeper
		}

		console.log(
			"Unless it's a phrase, then we should ask it to harmonize again."
		);

		if (this.phrases.length > 0) {
			/*this.harmonizedPhrases = this.phrases.map((phrase) => {
				if (phrase.phrases.length > 0) {
					//phrase.harmonized;
					//console.log("Phrase has phrases: ", phrase);
					//this below adds recursive harmony
					phrase.harmony = this.harmony;
					phrase = phrase.harmonized;
				}
				const notesForPhrase = [];
				this.harmony.map((harmonicStep) => {
					phrase.notes.forEach((note) => {
						notesForPhrase.push(note + harmonicStep);
					});
				});
				//console.log("note inside phrase harmonized is: ", notesForPhrase);
				return {
					...phrase,
					notes: notesForPhrase,
				};
			});*/
		} else {
		}

		//console.log("note inside phrase harmonized is: ", this.phrases);
		return this;
	}

	get asPattern() {
		const rythmicPattern = rythmPatterns["two"];
		const subdivision = "4n";
		const calculatedSub = Tone.Time(subdivision).toSeconds() * 2;
		return rythmicPattern.map((obj, index) => {
			console.log("this: ", obj);
			return {
				...obj,
				time: obj.time * calculatedSub,
				duration: obj.duration * Tone.Time(subdivision).toSeconds(),
				chord: this,
			};
		});
	}

	get chordAsMidi() {
		return this.notes.map((noteName) => {
			if (isNaN(noteName)) {
				return Tone.Frequency(noteName).toMidi();
			}
			return noteName;
		});
	}

	get lengthOfPattern() {
		const lastNoteOff = this.pattern.reduce((max, rythm) => {
			return rythm.time + rythm.duration > max
				? rythm.time + rythm.duration
				: max;
		}, 0);
		return lastNoteOff;
	}

	updatePatternTimes(part, length) {
		return part.map((obj) => {
			return { ...obj, time: obj.time + length };
		});
	}
}
