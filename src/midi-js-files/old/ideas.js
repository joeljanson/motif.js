//Om jag skriver en part som såhär:

class NoteObject {
	constructor(pitches = [60], duration = 100, velocity = 50) {
		this.pitches = pitches;
		this.duration = duration;
		this.velocity = velocity;
	}
}

const part = new PhrasePart();
//Då kan den se ut såhär
[
	{ time: "0:0", notes: new NoteObject(40, 1) },
	{
		time: "0:2",
		notes: new NoteObject([60, 62], part.map((obj) => obj.time)[1]),
	},
];

//den skulle kunna ha en property som heter "position" som räknas ut beroende på var i sekvensen den är / var den förra parten slutar.
//en property som också ger den ett notvärde, så som 4n eller 8t

part.add();

function add(partToAdd) {
	//In this function there should be a possibility to add a new part that just adds on to wherever in the bar the previous part ended
	//const lengthOfPart = This could be in seconds?
}

/* previous */

const styles = {
	alberti: [
		{ notes: 0, octave: 0 },
		{ notes: 2, octave: 0 },
		{ notes: ".", octave: 0 },
		{ notes: ".", octave: 0 },
		{ notes: { notes: [0, 2], octave: 1 }, octave: 0 },
		{ notes: { notes: [2, 3], octave: -1 }, octave: 0 },
	],
	up: [
		{ notes: 0, octave: 0 },
		{ notes: 1, octave: 0 },
		{ notes: 2, octave: 0 },
		{ notes: 3, octave: 0 },
	],
	down: [
		{ notes: 3, octave: 0 },
		{ notes: 2, octave: 0 },
		{ notes: 1, octave: 0 },
		{ notes: 0, octave: 0 },
	],
	tremolo: [
		{ notes: 0, octave: 0 },
		{ notes: 1, octave: 0 },
	],
	/*
    Below is a more elaborate version on how the styles can look like.
    Every object in the array represents a beat, just like with tidal sequences
    then inside every beat there's an object with the property "notes" that holds
    all the notes for that beat. Every note then has a name "note" which means the
    place in the array of the chord it appears and then an octave.
    */
	chopin1: [
		{ notes: 0, octave: 0 },
		{
			notes: [{ notes: { notes: [1, 2], octave: 1 } }],
		},
		{
			notes: [{ notes: { notes: [0, 2], octave: 2 } }],
		},
	],
	chopin2: [
		{ notes: ".", octave: 0 },
		{
			notes: [{ notes: { notes: [1, 2], octave: 1 } }],
		},
		{
			notes: [{ notes: { notes: [0, 2], octave: 2 } }],
		},
	],
};
