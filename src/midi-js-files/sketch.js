const chord = Tonal.Chord.get("F3m6");

/*const myChord = new CChord({
	notes: ["C4", "E4", "G4"],
	style: "up",
});*/

let seq;

let notes = [
	["D2", "A3", "F#4", "C#4", "D4"],
	["G2", "D3", "A4", "B4", "G4"],
	["E2", "B3", "G4", "B4", "F#4"],
];
let testMotif = new Motif(notes[0]);

function setup() {
	createCanvas(400, 400);
	background(220);
	let btn1 = createButton("start tone");
	btn1.mousePressed(startTone);
	enableMidi();
	//anotherMotif();

	/**
	 * Now this below is interesting, this is a way of describing
	 */

	testMotif.rythm = [{ duration: "1m", noteIndex: [0, 1, 2, 3, 4] }];
	//testMotif.add([0, 1, 2, 2, 2, 0], "1m", 0);
	//testMotif.add([1, 3, 4, 2, 4, 0], "2n", 0);
	//testMotif.add([1, 3, 4], "2n", "2n");
	testMotif.stepHarmonization = [[0, 7, 7]];
	// //testMotif.addRythm({ duration: "1m", noteIndex: [0, 1, 5, 6] }, "1m", "1m");
	setupPartFromMotif(testMotif);
}

// function aMotif() {
// 	const secondMotif = new Motif(motifWithNotes.notes);
// 	secondMotif.rythm = ["4n", "1m", "4n", "2n", "1m", "1m", "1m"];
// 	secondMotif.stepHarmonization = [[0, 7, 3]];
// 	motifWithNotes.rythm = [
// 		"2m",
// 		"1m",
// 		"1m",
// 		"2n",
// 		"2n",
// 		"1m",
// 		"2n",
// 		"1m",
// 		"2m",
// 		"2n",
// 		"1m",
// 		"2n",
// 	];
// 	motifWithNotes.add(secondMotif);
// 	motifWithNotes.stepHarmonization = [[0, 9]];
// 	setupPartFromMotif(motifWithNotes);
// }

// function anotherMotif() {
// 	const secondMotif = new Motif(motifWithNotes.notes);
// 	secondMotif.rythm = ["1m"];
// 	secondMotif.stepHarmonization = [[-12, -6, 12]];
// 	motifWithNotes.rythm = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
// 	motifWithNotes.fitInto("1m");
// 	motifWithNotes.add(secondMotif);
// 	motifWithNotes.stepHarmonization = [[0, 12]];
// 	setupPartFromMotif(motifWithNotes);
// }

let part;

function setupPartFromMotif(currentMotif) {
	part = new Tone.Part((time, motif) => {
		const notesToPlay = currentMotif.getNotesFromNoteIndexAndId(
			motif.noteIndex,
			motif.motifId
		);
		const lookAhead = 0.1 + time - Tone.now();
		const vel = floor(map(mouseX, 0, width, 10, 127, true));
		console.log(notesToPlay);
		playNotes({
			notes: notesToPlay,
			duration: motif.duration * 0.9,
			time: lookAhead,
			velocity: vel,
		});
	}, currentMotif.asPart);
	part.start();
	part.loop = true;
	part.loopEnd = currentMotif.length;
}

function enableMidi() {
	WebMidi.enable()
		.then(onEnabled)
		.catch((err) => alert(err));
}

// Function triggered when WEBMIDI.js is ready
function onEnabled() {
	console.log("webmidi enabled");
	console.log("webmidi outputs: ", WebMidi.outputs);
	//WebMidi.outputs[0].sendPitchBendRange(12);
}

function draw() {
	background(28);
	text(Tone.Transport.position, 40, 40);
}

async function startTone() {
	Tone.Transport.bpm.value = 120;
	await Tone.start();
	console.log("Tone started");

	const root = floor(random(32, 66));
	const notes = generateArrayOfPitches(
		16,
		[root, root + floor(random(1, 11))].sort()
	);
	//motifWithNotes.notes = notes.sort();
	/*motifWithNotes.rythm = ["16n", "16n", "16n", "16n"];
	part.clear();
	motifWithNotes.asPart.forEach((event) => {
		console.log(event);
		part.add(event);
	});
	part.loopEnd = motifWithNotes.length;*/
}

let notesToBeReleased = new Map();

let loop;
let currentIndex = 0;

function mousePressed() {
	//triggerPatchThree(0);
	/*myChord.notes = Tonal.Chord.get("C3m6").notes;
	seq.events = myChord.asPlainSequence;*/
	/*const root = floor(random(30, 100));
	motifWithNotes.notes = [root, root + floor(random(1, 11))].sort();*/

	// motifWithNotes.notes = generateMajorChord(floor(random(50, 70)));
	// motifWithNotes.add = [
	// 	{
	// 		duration: "8n",
	// 		noteIndex: [random(6), random(6), random(6), random(6)],
	// 	},

	print(random(2));

	testMotif.rythm = [{ duration: "8m", noteIndex: [0, 1, 2, 3, 4] }];
	testMotif.notes = notes[floor(random(3))]; //.sort(() => Math.random() - 0.5);
	// ];
	currentIndex++;

	Tone.start();
	Tone.Transport.start();
}

function mouseReleased() {
	//stopNotes("mousePressed");
}
