/*class Voicing {
	constructor(chord = ["C4", "E4", "G4"], voicing = "v1") {
		this.chord = chord;
		this.inversion = 0;
		this.voicing = voicing;
	}

	get chordAsMidi() {
		return this.chord.map((noteName) => {
			if (isNaN(noteName)) {
				return Tone.Frequency(noteName).toMidi();
			}
			return noteName;
		});
	}

	get voicingAsMidi() {}

	get appliedVoicing() {
		const currentVoicing = voicings.get(this.voicing);
		if (currentVoicing) {
			const voicingToReturn = this.chordAsMidi.map((note, index) => {
				//If the note is below 0, then dont transpose. Should add similar check for above 127.
				return note + currentVoicing[index % currentVoicing.length] > 0
					? note + currentVoicing[index % currentVoicing.length]
					: note;
			});
			return voicingToReturn.sort();
		} else {
			return "Voicing does not exist!";
		}
	}
}*/
