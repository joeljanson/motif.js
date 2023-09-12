class NoteObject {
	constructor(pitches = [60], duration = 100, velocity = 50) {
		this.pitches = pitches;
		this.duration = duration;
		this.velocity = velocity;
	}
}

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

const styles = {
	one: [new RythmObject(0, 0, 1)],
	two: [new RythmObject(0, 0, 1 / 2), new RythmObject(1 / 2, 1, 1 / 2)],
	three: [
		new RythmObject(0, 0, 1 / 3),
		new RythmObject(1 / 3, 1, 1 / 3),
		new RythmObject(2 / 3, 2, 1 / 3),
	],
	four: [
		new RythmObject(0, 0, 1 / 4),
		new RythmObject(1 / 4, 1, 1 / 4),
		new RythmObject(2 / 4, 2, 1 / 4),
		new RythmObject(3 / 4, 3, 1 / 4),
	],
	alberti: [
		new RythmObject(0, 0, 4 / 4),
		new RythmObject(1 / 4, 2, 1 / 4),
		new RythmObject(2 / 4, 1, 1 / 4),
		new RythmObject(3 / 4, 2, 1 / 4),
	],
};

const voicings = {
	prim: [[0]],
	third: [[0, 1]],
	chopin1: [[-12], [4, 12], [7, 12, 16]],
	highpitch: [[12, 24, 36]],
};

class CChord {
	constructor(notes) {
		this.notes = [];
		this.voicing = "";
		this.inversion = 0;
		this.style = "alberti";
		this.pattern = [];
		this.add("1m", "alberti", "chopin1");
		this.add("2n", "four", "third");
		this.fitInto("1m");

		if (Array.isArray(notes)) {
			this.notes = notes;
		} else if (typeof notes === "object") {
			this.notes = notes.notes ?? this.notes;
			this.pattern = notes?.pattern ?? this.pattern;
			this.voicing = notes?.voicing ?? this.voicing;
			this.inversion = notes?.inversion ?? this.inversion;
			this.style = notes?.style ?? this.style;
		} else {
			throw new Error("Invalid input type: expected an array or an object");
		}
	}

	setStyle(newStyle) {
		console.log("function exists");
		this.style = newStyle;
		return this;
	}

	get chordAsMidi() {
		return this.notes.map((noteName) => {
			if (isNaN(noteName)) {
				return Tone.Frequency(noteName).toMidi();
			}
			return noteName;
		});
	}

	get asPlainSequence() {
		return this.chordAsMidi.map((note) => new NoteObject([note]));
	}

	get asPattern() {
		return this.pattern;
	}

	getMidiNoteFromVoicing(step, transposeBy) {
		const chordAsMidi = this.chordAsMidi;
		console.log("step is: ", step);
		console.log("transposeBy is: ", transposeBy);
		return chordAsMidi[step % chordAsMidi.length] + transposeBy;
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
			return Object.assign({}, obj, {
				time: obj.time + length,
			});
		});
	}

	add(subdivision = "4n", style = "four", voicing = "prim") {
		//Find the ending of this current part
		const part = this.generateStyle(subdivision, style, voicing);
		const length = this.lengthOfPattern;
		const updatedPart = this.updatePatternTimes(part, length);
		this.pattern = this.pattern.concat(updatedPart);
		console.log(this.pattern);
		return this;
	}

	generateStyle(subdivision, theStyle, voicing = "prim") {
		const style = styles[theStyle];
		const calculatedSub = Tone.Time(subdivision).toSeconds() * 2;
		const actualVocing = voicings[voicing];
		console.log(actualVocing);
		return style.map((obj, index) => {
			const arrayedVoicing = actualVocing[obj.noteindex % actualVocing.length];
			//console.log("this: ", arrayedVoicing);
			return Object.assign({}, obj, {
				time: obj.time * calculatedSub,
				duration: obj.duration * Tone.Time(subdivision).toSeconds(),
				noteindex: arrayedVoicing,
				voicing: voicing,
				step: index,
				chord: this,
			});
		});
	}

	fitInto(subdivision) {
		const length = this.lengthOfPattern;
		const subdivisionInSeconds = Tone.Time(subdivision).toSeconds();
		const ratio = subdivisionInSeconds / length;
		this.pattern = this.pattern.map((obj) => {
			return Object.assign({}, obj, {
				time: obj.time * ratio,
				duration: obj.duration * ratio,
			});
		});
		return this;
	}
}
