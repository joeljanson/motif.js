/*
Could you help me write this function? You don't have to show html imports and stuff, I only want the js function!
Create a function that receives notes as an array, like this ["C2", "E4", "G3"] or with midi-numbers like this ["60", "64","74", "96"]
Convert the values to midi values using Tone.js
Also using Tone.js time conversion, use Tone.Time("1m").toSeconds() to get how long a measure is and then divide this in to how ever many notes there are in the array.
Store that time as a variable and then create a Tone.Loop that triggers every measure and inside that loop, with WebMidi.js trigger the converted midi values at the time of when the loop is triggered + the calculated time * the position of the value in the array.
Also keep in mind that the time that is passed into the Tone.Loop will be "wrong" since we want to trigger the midi with a lookahead we need to use this little code to calculate that:
const triggerTime = Tone.now() - loopTime - Tone.Transport.seconds;

Thanks!
*/

function playNotesWithEvenDistribution(notes) {
	const midiNotes = notes.map((note) => Tone.Midi(note).toMidi());
	const noteLength = Tone.Time("1m").toSeconds() / notes.length;
	console.log(noteLength);
	const velocity = 60;

	new Tone.Loop((time) => {
		//This does not seem to woooork.
		const triggerTime = WebMidi.time / 1000 - time;
		midiNotes.forEach((note, index) => {
			const playTime = index * noteLength;
			playNotes({
				notes: [note],
				duration: noteLength,
				time: playTime,
			});
		});
	}, "1m").start();
}

function playRandomNotesWithEvenDistribution(numberOfNotes) {
	const noteLength = Tone.Time("1m").toSeconds() / numberOfNotes;
	const velocity = 60;

	new Tone.Loop((time) => {
		//This does not seem to woooork.
		const triggerTime = WebMidi.time / 1000 - time;
		const randomNumbersArray = Array.from(
			{ length: numberOfNotes },
			() => Math.floor(Math.random() * (80 - 30 + 1)) + 30
		);
		randomNumbersArray.forEach((note, index) => {
			const playTime = index * noteLength;
			playNotes({
				notes: [note],
				duration: noteLength,
				time: playTime,
			});
		});
	}, "1m").start();
}

function playRandomChords(timeInterval, numberOfNotes, range = [30, 80]) {
	new Tone.Loop((time) => {
		//This does not seem to woooork.
		const triggerTime = WebMidi.time / 1000 - time;
		const randomNumbersArray = Array.from(
			{ length: numberOfNotes },
			() => Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0]
		);
		randomNumbersArray.forEach((note, index) => {
			const playTime = (10 + index * 2) / 1000;
			playNotes({
				notes: randomNumbersArray,
				duration: Tone.Time(timeInterval).toSeconds() - 0.1,
				time: playTime,
			});
		});
	}, timeInterval).start();
}

function playSetOfNotes(playableObject) {
	const notes = playableObject.notes ?? "C4";
	const rythms = playableObject.rythms ?? ["4n"];
	const order = playableObject.order ?? "up";
	let prevStart = 0;
	rythms.forEach((rythm, index) => {
		const start = prevStart;
		const duration = rythm;
		prevStart += Tone.Time(duration).toSeconds();

		let note;
		if (order === "r") {
			note = randomItemInArray(notes);
		} else if (order === "c") {
			note = notes[index % notes.length];
		} else {
			console.warn("No order is set. Chosing randomly.");
			note = randomItemInArray(notes);
		}
		playNotes({
			notes: note,
			duration: Tone.Time(duration).toSeconds(),
			time: Tone.Time(start).toSeconds(),
		});
	});
}

function playChordProgression(progression = [], rythms = ["4n"]) {
	console.log(progression);
	const chordsToPlay = progression.map((chord) =>
		Tonal.Chord.getChord(chord[0], chord[1], chord[2])
	);
	console.log(chordsToPlay);
	let prevStart = 0;
	chordsToPlay.forEach((chord, index) => {
		const start =
			Tone.Time(
				index === 0 ? 0 : rythms[(index - 1) % rythms.length]
			).toSeconds() + prevStart;
		prevStart = start;
		const duration = rythms[index % rythms.length];

		playNotes({
			notes: chord.notes,
			duration: Tone.Time(duration).toSeconds(),
			time: Tone.Time(start).toSeconds(),
		});
	});
}

function playMelody(melody) {
	let prevStart = 0;
	//console.log(melody);
	melody.notes.forEach((note, index) => {
		const start =
			Tone.Time(
				index === 0 ? 0 : melody.rythm[(index - 1) % melody.rythm.length]
			).toSeconds() + prevStart;
		prevStart = start;
		const duration = melody.rythm[index % melody.rythm.length];
		playNotes({
			notes: note,
			duration: Tone.Time(duration).toSeconds(),
			time: Tone.Time(start).toSeconds(),
		});
	});
}
