import { Time } from "tone";
import { Frequency, Part, Transport, now } from "tone";
import MidiHandler from "../midi-handling/MidiHandler";
import Generator from "./Generator";

type RythmicMotif = {
	time: number;
	duration: number;
	noteIndex: number;
};

type RythmicPhrase = {
	motifs: Array<RythmicMotif>;
};

type RythmOptions = {
	rythm?: Array<number | string>;
	noteIndexes?: Array<number>;
	length?: number | string;
	rythmicMotif?: Array<RythmicMotif>; // Updated type name here
};

class Rhythm {
	private _rythms: Array<Array<RythmicMotif>>;
	private _notes: Array<number>;
	noteIndexes: Array<number>;
	private _length: number | string;
	private _part: Part | undefined;
	//rythmicMotif: Array<RythmicMotif>; // Updated type name here

	constructor(
		optionsOrRythm?: Partial<RythmOptions> | Array<number | string>,
		noteIndexes?: Array<number>,
		length?: number | string
	) {
		this._rythms = [];
		this._notes = [];
		this.noteIndexes = [];
		this._length = 0;

		console.log("Rythm constructor is run!");
		if (typeof optionsOrRythm === "object" && optionsOrRythm !== null) {
			// Constructor was called with an options object
			const options = optionsOrRythm as Partial<RythmOptions>;
			const rythmsAsMotif = this.convertRythmToRythmMotif(
				options.rythm ? options.rythm : ["4n", "4n", "4n", "4n"]
			);
			this.rythms = [rythmsAsMotif];
			const noteIndexesAsMotif = this.convertNoteIndexesToRythmMotif(
				options.noteIndexes || [0, 2, 1, 2]
			);
			this.length = options.length || "1m";
			// If there is a rythmic motif, override the rythms and note indexes.
			if (options.rythmicMotif) {
				this.setRythmicMotif(options.rythmicMotif);
			}
		} else {
			// Constructor was called with individual parameters
			console.log("Constructs with individual params");
			const rythmsAsMotif = this.convertRythmToRythmMotif(
				optionsOrRythm ? optionsOrRythm : ["4n", "4n", "4n", "4n"]
			);
			this.rythms = [rythmsAsMotif];
			const noteIndexesAsMotif = this.convertNoteIndexesToRythmMotif(
				noteIndexes || [0, 2, 1, 2]
			);
			this.length = length || "1m";
		}
	}

	convertRythmToRythmMotif(
		rythms: Array<number | string>
	): Array<RythmicMotif> {
		let startOffset = 0;
		return rythms.map((singleRythm, index) => {
			const time = startOffset;
			const duration = Time(singleRythm).toSeconds();
			startOffset += duration;
			return {
				time: time,
				noteIndex: index, //Math.floor(Math.random() * 100),
				duration: duration,
			};
		});
	}

	convertNoteIndexesToRythmMotif(
		noteIndexes: Array<number>
	): Array<RythmicMotif> {
		let startOffset = 0;
		return noteIndexes.map((noteIndex) => {
			const time = startOffset;
			const duration = Time("4n").toSeconds();
			startOffset += duration;
			return {
				time: time,
				noteIndex: noteIndex,
				duration: duration,
			};
		});
	}

	// Define methods for your algorithmic composition logic
	generateMotif(
		length: string = "1m",
		speed: number = 1,
		complexity: number = 1
	): Array<RythmicMotif> {
		let motif = [
			{
				time: Time("2n").toSeconds(),
				duration: 1,
				noteIndex: 0,
			},
			{
				time: Time("2n").toSeconds(),
				duration: 1,
				noteIndex: 2,
			},
		];
		// Your logic here
		return motif;
	}

	addGeneratedRythm(numberOfNotes: number) {
		const generator = new Generator();
		//generator.generateRythm(numberOfNotes)
		this.addRythm(generator.generateRythm(numberOfNotes));
	}

	// returns a continuation of the current rhythm using the same note values or same division/main structure but continues
	// continue(duration: string | number = "4n") {
	// 	return this.generateRhythm("slow", duration, ["8n", "4n"]);
	// }

	/*
	 *
	 *  Ways to alter the note indexes
	 *
	 */

	// Function to shuffle the noteIndex within each subarray
	shuffle(array: any[]) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
	}

	shuffleNoteIndexes() {
		console.log("nefore ,", this._rythms);
		for (let subArray of this._rythms) {
			let noteIndices: number[] = subArray.map((note) => note.noteIndex);
			this.shuffle(noteIndices);
			for (let i = 0; i < subArray.length; i++) {
				subArray[i].noteIndex = noteIndices[i];
			}
		}
		this.updateRythm();
	}

	repeatWithVariation(fitInto: string | number | undefined = undefined) {
		// Check if there are items in the array
		if (this.rythms.length > 0) {
			// Get the last rythm from the rythms array
			const lastRythm = this.rythms[this.rythms.length - 1];
			// Create a copy the last rythm
			let rythmCopy = [...lastRythm];
			// shuffle the array
			for (let i = rythmCopy.length - 1; i > 0; i--) {
				const j = Math.floor(Math.random() * (i + 1));
				[rythmCopy[i], rythmCopy[j]] = [rythmCopy[j], rythmCopy[i]];
			}

			if (fitInto === undefined) {
				fitInto = this.getLengthOfRythmicMotif(rythmCopy);
			}

			// If fitInto is a number, recalibrate the rhythm to fit into the given total duration
			if (fitInto !== undefined) {
				const totalDuration = this.getLengthOfRythmicMotif(rythmCopy);
				if (totalDuration === 0) {
					throw new Error("totalDuration cannot be 0");
				}
				const ratio = Time(fitInto).toSeconds() / totalDuration;
				let startOffset = 0;
				console.log("The rythmcopy is: ", rythmCopy);
				rythmCopy = rythmCopy.map((d) => {
					const time = startOffset;
					const duration = Time(d.duration * ratio).toSeconds();
					startOffset += duration;
					return {
						time: time,
						noteIndex: d.noteIndex,
						duration: duration,
					};
				});
			}

			// Append the modulated and shuffled rythm to the rythms array
			this.rythms.push(rythmCopy);
		}
	}

	get rythmicMotif(): Array<RythmicMotif> {
		const motif: Array<RythmicMotif> = [];

		// Iterate through the outer array (this.rythms)
		let startTime = 0;
		for (let i = 0; i < this.rythms.length; i++) {
			const currentMotif = this.rythms[i];
			// Ensure that each rhythm array has the same length as noteIndexes
			// Iterate through the nested array (rhythm)
			for (let j = 0; j < currentMotif.length; j++) {
				const rythmicMotif = currentMotif[j];
				motif.push({
					time: rythmicMotif.time + startTime,
					noteIndex: rythmicMotif.noteIndex,
					duration: rythmicMotif.duration,
				});
			}
			console.log(startTime);
			startTime += this.getLengthOfRythmicMotif(currentMotif);
		}

		return motif;
	}

	setRythmicMotif(rythmicMotif: Array<RythmicMotif>) {
		//Reset this.rythm and this.noteIndexes to empty arrays
		this.rythms = [[]];
		this.noteIndexes = [];
		// Iterate through the rythmicMotif array and extract values
		let newRythms: Array<RythmicMotif> = [];
		let startOffset = 0;
		for (const motif of rythmicMotif) {
			if (motif.time && motif.noteIndex !== undefined) {
				const time = startOffset;
				const duration = Time(motif.time).toSeconds();
				startOffset += duration;
				newRythms.push({
					time: Time(time).toSeconds(),
					noteIndex: motif.noteIndex,
					duration: duration,
				});
				this.noteIndexes.push(motif.noteIndex);
			}
		}
		this.rythms.push(newRythms);
	}

	addRythm(rythm: Array<string | number>) {
		this._rythms.push(this.convertRythmToRythmMotif(rythm));
	}

	addMotif(motif: Array<RythmicMotif>) {
		let startOffset = 0;
		const finalMotif = motif.map((singleMotif) => {
			const time = startOffset;
			const duration = Time(singleMotif.time).toSeconds();
			startOffset += duration;
			return {
				time: time,
				noteIndex: singleMotif.noteIndex,
				duration: duration,
			};
		});
		this._rythms.push(finalMotif);
	}

	clearRythms() {
		this._rythms = [];
	}

	// Getter for rythms
	get rythms(): Array<Array<RythmicMotif>> {
		return this._rythms;
	}

	// Setter for rythms
	set rythms(val: Array<Array<RythmicMotif>>) {
		this._rythms = val.map((singleRythm) =>
			singleRythm.map((singleBeat) => {
				return {
					time: Time(singleBeat.time).toSeconds(),
					noteIndex: singleBeat.noteIndex,
					duration: singleBeat.duration,
				};
			})
		);
	}

	get length() {
		return this.rythms.reduce((acc, motif) => {
			// Calculate the length of each individual rhythm and add it to the accumulator
			const rhythmLength = motif.reduce(
				(rhythmAcc, value) => rhythmAcc + value.duration,
				0
			);
			return acc + rhythmLength;
		}, 0);
	}

	getLengthOfRythmicMotif(motif: Array<RythmicMotif>) {
		const rhythmLength = motif.reduce(
			(rhythmAcc, value) => rhythmAcc + value.duration,
			0
		);
		return rhythmLength;
	}

	//This function should perhaps not exist?
	set length(length: number | string) {
		this._length = Time(length).toSeconds();
	}

	set notes(notes: Array<number | string>) {
		const parsedNotes = notes.map((noteName) => {
			const midiNote = Frequency(noteName).toMidi().valueOf();
			if (isNaN(midiNote)) {
				console.error(
					"Note provided could not be turned into a midi note. Note was: ",
					noteName
				);
				return -1;
			}
			return midiNote;
		});
		this._notes = parsedNotes;
	}

	get notes(): Array<number> {
		return this._notes;
	}

	startRythm(loop: boolean) {
		const midiHandler = MidiHandler.getInstance();
		console.log(midiHandler.output);
		if (!this._part) {
			this._part = new Part(
				(time, note: { time: number; noteIndex: number; duration: number }) => {
					// the notes given as the second element in the array
					// will be passed in as the second argument
					const lookAhead = 0.1 + time - now();
					// const vel = floor(map(mouseX, 0, width, 10, 127, true));
					//console.log("The lookahead is: ", lookAhead);
					midiHandler.playNotes({
						notes: [this.notes[note.noteIndex % this.notes.length]],
						time: lookAhead,
						duration: note.duration,
						velocity: 0.5,
					});
					// playNotes({
					// 	notes: notesToPlay,
					// 	duration: motif.duration * 0.9,
					// 	time: lookAhead,
					// 	velocity: vel,
					// });
					// console.log("Time is: ", time);
					console.log("Noteindex is: ", note.noteIndex);
					console.log("Notes being played is: ", [
						this.notes[note.noteIndex % this.notes.length],
					]);
					// console.log("Duration is: ", note.duration);
				},
				this.rythmicMotif
			);
			this._part.start();
			this._part.loop = loop;
			this._part.loopEnd = this.length;
			Transport.start();
		}
	}

	updateRythm() {
		if (this._part) {
			console.log(this.rythmicMotif);
			this._part.clear();
			this.rythmicMotif.forEach((motif) => {
				this._part?.add(motif.time, motif);
			});
			//this._part.value = this.rythmicMotif;
			this._part.loopEnd = this.length;
		}
	}
}

export default Rhythm;
