/*
*
This class will be the best of both worlds.
It should (for now) have a constructor that can take an array of notes [60, 64, 67].
These will be the basis for all harmonic and rythmic things going on.

Now the rythms will be an array where the noteindex can be assigned. So for example:
Isle([60, 64, 67]).rythm = [0, 1, 2] would play the notes 60, 64 and 67 in that order in whatever subdivision is set.
What this does behind  the scenes is to create a RythmObject with a constructor that looks like the rythmobject below.
The RythmObject will then has a property called combinedRythms, which is an array of all the BeatObjects.
What would be great is to then take this normalized values of 0-1 which is the BeatObjects and convert them into whatever time we have in the phrase.
So in the Isle object when getting the rythm it would look like this:
set rythm(rythm) {
    this._rythm = rythm;
}

get rythm() {
    //In this example it would return simply 
    const availableTime = Tone.Time(this.subdivision).toSeconds();
    const combinedRythms = new RythmObject(this._rythm).calculateTimeFrom(availableTime);
    const calculatedTimes = 
    [{time:0}, {time:0.3}, {time:0.6}]
    return 
}
*/

//Rythm can also be constructed from BeatObjects which has a constructor like this:
class BeatObject {
	constructor(time, duration, noteIndex) {
		if (time >= 1) {
			console.warn("time variable is bigger than 1. Omitting rythm.");
		} else {
			this.time = time;
		}
		if (duration > 1) {
			console.warn(
				"Duration variable is bigger than 1. Setting duration to 1."
			);
			this.duration = 1;
		} else {
			this.duration = duration;
		}
		this.noteIndex = noteIndex;
	}
}

class NewRythmObject {
	/**
	 * @param rythm Either an array of noteIndexes. That is what index in the phrase to play. Or a BeatObject.
	 * A BeatObject can be useful to be more specifik about the rythms like a dotted (4n.) followed by an 8n.
	 * Actually. That is the future. How can I create a rythmobject that accepts like this ["4n.", "8n"]
	 */
	constructor(rythm) {
		//If the rythm is an array with noteindexes, add them to this rythmobjects rythms
		//In the future, this could be recursive.
		//Then it would be possible to say something like isle.rythm = [0,[0,1],[0,2,1]]
		//That would create a structure that looked like this: ??
		let combinedRythms = this.combineRythms(rythm);

		this.combinedRythms = combinedRythms;
	}

	combineRythms(rythm, numNoteIndexes = 1, currentIndex = 0, startTime = 0) {
		//Input is say [0, [2,1], 0]
		//First value is a simple value, add it to the array
		const combinedRythms = [];
		if (Array.isArray(rythm)) {
			const numberOfNoteindexes = rythm.length;
			const internalCombinedRythms = rythm.map((noteIndex, index) => {
				combinedRythms.push(
					this.combineRythms(noteIndex, numberOfNoteindexes, index)
				);
				//return this.combineRythms(noteIndex, numberOfNoteindexes, index);
			});
			//console.log(internalCombinedRythms);
			//combinedRythms.concat(internalCombinedRythms);
		} else {
			if (rythm instanceof BeatObject) {
				combinedRythms.push(rythm);
			} else {
				if (!isNaN(rythm)) {
					const lengthOfEachBeat = 1 / numNoteIndexes;
					const time = lengthOfEachBeat * currentIndex;
					const duration = lengthOfEachBeat;
					//return combinedRythms.push(new BeatObject(time, duration, rythm));
					return new BeatObject(time, duration, rythm);
				} else {
					console.warn(
						"Noteindex is not a number. Omitting beat. Noteindex is: ",
						rythm
					);
					const time = Tone.Time(rythm).toSeconds();
					const duration = 1 - time;
					return new BeatObject(time, duration, currentIndex);
				}
			}
		}
		console.log(combinedRythms);
		return combinedRythms;
	}

	add(rythm) {
		console.log(
			"this function should add the rythm and make the phrase longer. Or maybe optionally fit into whatever division that the isle is."
		);
	}

	get asPattern() {
		return this.combinedRythms;
	}

	get lengthOfPattern() {
		const lastNoteOff = this.combinedRythms.reduce((max, rythm) => {
			return rythm.time + rythm.duration > max
				? rythm.time + rythm.duration
				: max;
		}, 0);
		return lastNoteOff;
	}

	/*
	calculateTimeFrom(availableTime, beat, startOffset = 0) {
		//let myIndex = startOffset;
		const calculatedArray = [];
		let internalStartOffset = startOffset;
		if (Array.isArray(beat)) {
			const internalAvailableTime = availableTime / beat.length;
			beat.forEach((singleBeat) => {
				const beat = this.calculateTimeFrom(
					internalAvailableTime,
					singleBeat,
					internalStartOffset
				);
				internalStartOffset += beat.time + beat.duration;
				calculatedArray.push(beat);
			});
		} else {
			console.log("availableTime time: ", availableTime);
			console.log("Beat.time: ", beat.time);
			console.log("Beat.duration: ", beat.duration);
			console.log("Startoffset: ", startOffset);
			const time = beat.time + startOffset;
			const duration = beat.duration;
			/*console.log(
				"Double check the duration and the time here. Duration: ",
				beat.duration,
				"Time: ",
				beat.time
			);
			return { ...beat, time: time, duration: duration };
		}
		return calculatedArray;
	}
    */
}

//const rObj = new NewRythmObject(["4n.", "8n"]);
const rObj = new NewRythmObject([1, 0, 2, 5]);
/*rObj.fitInto("1m"); // this woudl result in an array with four 4n
rObj.add([0, 1, 2], "16n"); // this would then add three sixteen notes to that 1m.
rObj.fitInto("1m"); // then that could be made into 1m. Super complex rythms.*/
console.log(rObj.combinedRythms);

class Isle {
	constructor(arrayOfNotes = [60, 64, 67]) {
		//If the array of notes is note an array, put it into one.
		this._notes = Array.isArray(arrayOfNotes) ? arrayOfNotes : [arrayOfNotes];
		//this.rythm = [0];
	}

	/**
	 * @param harmonizationArray below is an array that can contain numbers that will harmonize the corresponding step in this isle.
	 * So for example, if isle.notes = [60, 64] and isle.stepHarmonization = [0,[0, 12, 7]], this will harmonize 60 to be 60 and the second step
	 * 64 to become [64, 76, 71]. Now that step is also it's own isle. If the isle.notes are more than the stepHarmonization, % will be used.
	 * For example [60, 64, 67] would with the above harmonization become [60, [64, 76, 71], 67]
	 */
	set stepHarmonization(harmonizationArray) {
		this._stepHarmonization = harmonizationArray;
	}

	get stepHarmonization() {
		return this?._stepHarmonization ?? [0];
	}

	set notes(notes) {
		this.notesHarmonized;
		this._notes = notes;
	}

	get notes() {
		//console.log(this._notes);
		return this._notes;
	}

	get notesHarmonized() {
		//Go through the notes array. For every note, apply the harmonization and create a new isle object.
		return this._notes.map((note, index) => {
			const harmonization =
				this.stepHarmonization[index % this.stepHarmonization.length];
			if (Array.isArray(harmonization)) {
				const isle = new Isle(
					harmonization.map((harmonizationStep) => {
						return note + harmonizationStep;
					})
				);
				isle.stepHarmonization = harmonization;
				return isle;
			} else {
				const isle = new Isle(harmonization + note);
				isle.stepHarmonization = harmonization;
				return isle;
			}
		});
	}

	noteForNoteIndex(noteIndex) {
		const harmonizedNotes = this.notesHarmonized;
		const hnl = harmonizedNotes.length;
		console.log("harmonized notes: ", harmonizedNotes);
		return harmonizedNotes[noteIndex % hnl];
	}

	get asPart() {
		//This could actually only be rythm?
		const harmonizedNotes = this.notesHarmonized;
		const hnl = harmonizedNotes.length;
		return this.rythm.combinedRythms.map((singleBeat) => {
			const currentIsle = harmonizedNotes[singleBeat.noteIndex % hnl];
			return { ...singleBeat, isle: currentIsle };
		});
	}

	get rythm() {
		return this._rythm;
	}

	set rythm(rythm) {
		this._rythm = new NewRythmObject(rythm);
	}
}

const isle = new Isle();
isle.stepHarmonization = [0, [0, 7], [0, 6]];
isle.rythm = [0, 1, 3, 2];
//isle.rythm.add = [0, 3, 2, 1];
console.log("Notes harmonized", isle.notesHarmonized);
console.log("Notes harmonized", isle.asPart);

const part = new Tone.Part((time, object) => {
	/*console.log(part._events);
	isle.notes = generateArrayOfPitches(4, [20, 100]);
	isle.notesHarmonized.forEach((isle) => {
		//console.log("note for note index", isle);
	});*/
}, isle.asPart).start();
part.loop = true;
Tone.Transport.start();
/*
const part = new Tone.Part((time, obj) => {
	console.log(time, obj);
}, rObj.asPattern).start();
part.loop = true;
part.loopEnd = rObj.lengthOfPattern;
console.log(part.loopEnd);
Tone.Transport.start();*/

/*setInterval(() => {
	isle.notes = generateArrayOfPitches(4, [20, 100]);
	isle.stepHarmonization = [
		0,
		generateArrayOfPitches(5, [0, 4]),
		generateArrayOfPitches(2, [0, 4]),
	];
	isle.asPart.map((step) => {
		console.log("note for note index", step.isle.notes);
	});
}, 1000);*/
