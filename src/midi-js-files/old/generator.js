/*
An idea that I have is to create a class where I can say for example
generateLine {
    timesignature: 3/4 //defaults to 4/4
    measures: 1
    notes:[C, E, G],
    patterns: [patterns.p1.16,patterns.p2.8,patterns.p2.16,p1], //Should this warn when the bar is to long or short? 
    order: "updown", "random", "up", "alberti"
}

The return of this function should be an object referring to the class itself where all of these settings are set
and then it can be returned and repeated.


This would be to generate single lines, like melodies and patterns like tremolos or arpeggios.
What's great about this is that it should be able to be chained, so saying like gen.generateLine({...}).repeat({})

generateProgression {
    timesignature: 3/4 //defaults to 4/4
    measures: 1
    chords:[C, E, G],
    patterns: [patterns.p1.16,patterns.p2.8,patterns.p2.16,p1], //Should this warn when the bar is to long or short? 
    order: "updown", "random", "up", "alberti"
}

*/

function createPatternFromPitches(array) {
	return array.map((note) => {
		return { notes: [note] };
	});
}

function generateArrayOfIntervals(numberOfNotes, range = [0, 127], interval) {
	//Make sure the biggest number always is the latter.
	range.sort();
	range.reverse();

	let firstValue =
		Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
	let returnArray = Array.from({ length: numberOfNotes }, () => {
		//console.log(firstValue);
		if (interval) {
			if (firstValue >= range[1]) {
				firstValue -= interval;
			} else if (firstValue <= range[0]) {
				firstValue += interval;
			} else {
				firstValue += randomItemInArray([-interval, +interval]);
			}
			return firstValue;
		} else {
			return Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0];
		}
	});
	return returnArray.map((midinote) =>
		Tonal.Interval.fromSemitones(firstValue - midinote)
	);
}

function generateArrayOfPitchesFromSet(
	numberOfNotes,
	setOfPitches = [60, 64, 67]
) {
	return Array.from({ length: numberOfNotes }, () =>
		randomItemInArray(setOfPitches)
	);
}

/* OLD PATCHES ------------------------ */

function triggerPatchOne() {
	const chordsToPlay = [Tonal.Chord.get("F5m6")];
	//const voicing = new Voicing(["C5", "D5", "E5", "G5"], "v3");
	const low = floor(map(mouseX, 0, width, 50, 70, true));
	const high = floor(map(mouseX, 0, width, 70, 100, true));
	const vel = floor(map(mouseY, 0, height, 127, 1, true));
	const numberNotes = floor(map(mouseX, 0, width, 1, 8, true));
	const voicing = new Voicing(
		//generateArrayOfPitches(numberNotes, [low, high]),
		generateArrayOfPitchesFromSet(
			numberNotes,
			randomItemInArray(chordsToPlay).notes
		),
		"v3"
	);
	console.log("Voicing as midi:", voicing.appliedVoicing);
	playNotes({
		notes: voicing.appliedVoicing,
		duration: Tone.Time(0.25).toSeconds(),
		time: Tone.Time(0).toSeconds(),
		velocity: vel,
		eventId: "mousePressed",
	});
}

function triggerPatchTwo(time) {
	const chordsToPlay = [Tonal.Chord.get("F5m6")];
	//const voicing = new Voicing(["C5", "D5", "E5", "G5"], "v3");
	const low = floor(map(mouseX, 0, width, 60, 10, true));
	const high = floor(map(mouseX, 0, width, 60, 100, true));
	const vel = floor(map(mouseY, 0, height, 127, 1, true));
	const numberNotes = floor(map(mouseX, 0, width, 1, 8, true));
	const voicing = new Voicing(
		generateArrayOfPitches(numberNotes, [low, high]),
		//generateArrayOfPitchesFromSet(numberNotes, ["C4", "C#4", "D4", "F4"]),
		"v3"
	);
	console.log("Voicing as midi:", voicing.appliedVoicing);
	playNotes({
		notes: voicing.appliedVoicing,
		duration: Tone.Time("16n").toSeconds(),
		time: time,
		velocity: vel,
		eventId: "mousePressed",
	});
}

function triggerPatchThree(time) {
	const chordsToPlay = [Tonal.Chord.get("F5m6")];
	//const voicing = new Voicing(["C5", "D5", "E5", "G5"], "v3");
	const steering = floor(map(mouseX, 0, width, 20, 100));
	const low = floor(map(mouseX, 0, width, steering, steering - 1, true));
	const high = floor(map(mouseX, 0, width, steering, steering + 1, true));
	const vel = floor(map(mouseY, 0, height, 127, 1, true));
	const numberNotes = floor(map(mouseX, 0, width, 1, 8, true));

	playNotes({
		notes: randomItemInArray(generateArrayOfPitches(numberNotes, [low, high])),
		duration: Tone.Time("16n").toSeconds(),
		time: time,
		velocity: vel,
	});
}

let currentChord = "C";
const allSymbols = Tonal.ChordType.symbols();
let numRepeats = 0;

console.log(allSymbols);
function triggerPatchFour(time) {
	let color = "maj7";
	if (numRepeats % 4 === 0) {
		currentChord = Tonal.Note.simplify(
			[currentChord].map(
				Tonal.Note.transposeBy(randomItemInArray(["5P", "2m", "1P", "4P"]))
			)[0]
		);
		color = randomItemInArray(["maj7", "6add9", "madd9"]);
	}
	console.log(numRepeats);
	numRepeats++;

	const chordToPlay = Tonal.Chord.getChord(
		//randomItemInArray(allSymbols),
		color,
		currentChord + "3"
	);

	chordToPlay.notes.map((note, index) =>
		Tonal.Note.transpose(note, chordToPlay.intervals[index])
	);
	const voicing = new Voicing(
		chordToPlay.notes.map((note) => Tonal.Note.simplify(note)),
		"v3"
	);

	console.log("voicing: ");

	/*const steering = floor(map(mouseX, 0, width, 20, 100));
	const low = floor(map(mouseX, 0, width, steering, steering - 1, true));
	const high = floor(map(mouseX, 0, width, steering, steering + 1, true));
	const numberNotes = floor(map(mouseX, 0, width, 1, 8, true));*/

	const vel = floor(map(mouseY, 0, height, 127, 1, true));

	playNotes({
		notes: voicing.appliedVoicing,
		//duration: Tone.Time("16n").toSeconds(),
		time: time,
		velocity: vel,
		eventId: "mousePressed",
	});
}

let pattern;

const patternOne = [
	[{ notes: ["7M"] }, { notes: ["6m"] }],
	[{ notes: ["1P"] }, { notes: ["3M"] }],
	{ notes: ["-8P", Tonal.Interval.fromSemitones(2 * -12)] },
	[],
];

const patternTwo = [
	[{ notes: ["1P"] }, { notes: ["3M"] }],
	[{ notes: ["7M"] }, { notes: ["6m"] }],
	{ notes: ["-5P", Tonal.Interval.fromSemitones(1 * -12)] },
	[],
];

const pitches = generateArrayOfPitches(64, [20, 110], 3);
const chromaticPattern = createPatternFromPitches(pitches);
//console.log(chromaticPattern);

const rythmicPattern = [
	[{ notes: ["1P"] }, { notes: ["5P"] }],
	[{ notes: ["3M"] }, { notes: ["4P"] }, { notes: ["5P"] }, { notes: ["6m"] }],
	[{ notes: ["1P"] }, { notes: ["2M"] }],
	[
		{ notes: ["3M"] },
		{ notes: ["1P"] },
		{ notes: ["5P"] },
		{ notes: ["1P"] },
		{ notes: ["5P"] },
		{ notes: ["1P"] },
		{ notes: ["5P"] },
		{ notes: ["8P"] },
	],
];
