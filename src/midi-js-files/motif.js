class OldMotif {
	/**
	 * Defining variables of this class.
	 *
	 * @variable notes - a variable containing the notes
	 * @variable rythm - a variable containing information about the time and
	 * the note indexes.
	 * @variable motifId - a variable to identify the motif which will be used
	 * on when the motif is supposed to be triggered.
	 * @variable stepHarmonization - a variable containing information about the
	 * harmonization of each step of notes.
	 * @variable position - a variable that holds information about the offset
	 * of the motif. Imagine the following scenario:
	 * @variable transposition - a variable used to transpose the entire motif
	 * in semitones.
	 * @variable inversion - a variable used to change the order of the notes
	 * @variabel submotifs - an array holding all of the submotifs
	 *
	 * Planned:
	 * @variable accents - an array of accents that will set the velocity of the
	 * note at the current step. Either as [50, 127, 50] or [w, s, w] as in weak,
	 * strong, weak.
	 *
	 * Defining functions of this class
	 * @function getNotesFromNoteIndexAndId(noteIndex,id) - asks the parentmotif
	 * for the notes of the motif with corresponding id which should then return
	 * the notes for that rythmstep in that motif.
	 * @function fitInto("1m") - a function that takes this motif and all of it's
	 * submotifs and fits them into whatever notevalue is sent in.
	 * @function add(rythm) - a function to add rythms or motifs.
	 * @function layer(rythm) - a function to layer rythms or motifs.
	 *
	 * Planned:
	 * @function retrograde, reverse, and those kinds of functions.
	 * Very useful for transforming the motifs.
	 */

	/**
	 * @param notes is an array like [60, 64, 67]
	 * @param options is a motif-object or parts of it.
	 */
	/*constructor(notes);
	constructor(options);*/
	constructor(options) {
		if (Array.isArray(options)) {
			options = { notes: options };
		}

		//Implement the constructor completely with all of the variables
		this.motifId = this.generateShortUniqueId();
		this.notes =
			options?.notes ??
			console.error(
				"No notes when creating motif. Will break as it is built now."
			);
		this.rythm = options?.rythm ?? this.notes.map((note, index) => index);
		this.stepHarmonization = options?.stepHarmonization ?? [[0]];
		this.position = options?.position ?? 0;
		this.submotifs = [];

		/* Not yet implemented 
		this.transposition = options?.transposition ?? 0;
		this.inversion = options?.inversion ?? 0;
        this.accents = options?.accents ?? 0;
        */
	}

	/**
	 * A motif has to have notes. When created as new motif()
	 * this will result in notes being an empty array. When you add a motif
	 * as a submotif using motif.add(submotif), the addmotif function will
	 * by default inherit the notes from the parentmotif. However, this could
	 * maybe be changed into like move(fromNoteIndex: 0, step:-1) wich would
	 * result in an array of chromatic steps downwards from the noteindex.
	 * An idea is to have a variable like "notesAlteration" or something
	 * that can alter the actual notes array in different ways.
	 * A future feature! For now, only inherit.
	 */
	set notes(notes) {
		//Always turn the notes into midi-values
		console.warn("Turning all values into midi. Is this the wanted behaviour?");
		notes = notes.map((noteName) => {
			if (isNaN(noteName)) {
				const midiNote = Tone.Frequency(noteName).toMidi();
				if (isNaN(midiNote)) {
					console.error(
						"Note provided could not be turned into a midi note. Note was: ",
						noteName
					);
				}
				return midiNote;
			}
			return noteName;
		});

		//Here we should also loop through all the submotifs and update the notes
		// of them as well.
		this.submotifs.forEach((submotif) => {
			submotif.notes = notes;
		});
		//If I go with the alterationidea, this is where the alteration should be done
		//after the notes has been passed down to the submotifs (?) or maybe before
		//actually. Think about it. Or should it be when we get the notes?
		this._notes = notes;
	}

	get notes() {
		return this._notes;
	}

	/**
	 * Setting the position must update the position of this motif and
	 * all submotifs. But for now it's implemented enough.
	 */

	set position(position) {
		console.warn(
			"Position is only implemented when adding motifs. Do not use for moving motifs."
		);
		this._position = position;
	}

	get position() {
		console.warn(
			"Position is only implemented when adding motifs. Do not use for moving motifs."
		);
		return this._position;
	}

	/**
	 * When setting the rythm, what happens behind the scenes is first to empty
	 * the current rythm array, removing all current rythm events. Then it calls
	 * the add() function passing in whatever is set.
	 */
	set rythm(rythm) {
		this._rythm = [];
		//When hard setting the rythm. Always add the rythm at 0 and no fit into.
		this.add(rythm, undefined, 0);
	}

	get rythm() {
		return this?._rythm ?? [0];
	}

	get asPart() {
		let completePart = this._rythm;
		let allSubParts = [];
		this.submotifs.forEach((motif) => {
			allSubParts = allSubParts.concat(motif.asPart);
		});
		completePart = completePart.concat(allSubParts);
		return completePart;
	}

	/**
	 * Step harmonization is an array that will harmonize each or every step in
	 * the notes array.
	 */
	set stepHarmonization(steps) {
		if (!Array.isArray(steps)) {
			steps = [steps];
		}
		this._stepHarmonization = steps;
	}

	get stepHarmonization() {
		return this?._stepHarmonization ?? [[0]];
	}

	set submotifs(submotifs) {
		console.warn("Currently only implemented as read-only");
		this._submotifs = submotifs;
	}

	get submotifs() {
		return this?._submotifs ?? [];
	}

	/**
	 * Read-only property, returns the timestamps and durations of all motifs and
	 * submotifs.
	 */
	get length() {
		let maxLength = this.motifLength;
		// Recursively calculate maximum value for submotifs
		this.submotifs.forEach((submotif) => {
			const submotifLength = submotif.motifLength;
			maxLength = Math.max(maxLength, submotifLength);
		});

		return maxLength;
	}

	get motifLength() {
		let maxLength = 0;

		// Calculate maximum value for the rythm array of the current motif
		const currentLength = this.rythm.reduce((max, rythm) => {
			const total = this.position + rythm.time + rythm.duration;
			return total > max ? total : max;
		}, 0);
		return Math.max(maxLength, currentLength);
	}

	/**
	 * In this function, you can add a rythm
	 * and that will add to the current motif.
	 * Eventually a function called simply add() will be in place.
	 * A rythm can either be an array of note indexes, that is, what
	 * note of the motif to play at what beat or like described further down.
	 * Like so: addRythm([0, 2, 1, 2])
	 * is a simple alberti base. It has an additional parameter that can
	 * add what subdivision this rythm should fit into. This makes it easy
	 * to add things like quintuplets.
	 *
	 * You can also add a rythm like this addRythm(["4n.", "8n"], "1m")
	 * which would add that rythm inside of one measure. In this case
	 * the note indexes would be 0 and 1 but if you want to be more specific
	 * you can add rythms as addRythm([{t:"4n.",ni:1}, {t:"8n",ni:0}]). More on this later.
	 * When adding rythms, if no subdivision is set it will become the length of
	 * the rythms combined. so ["4n", "4n", "4n"] would become the length of "2n."
	 *
	 * If the note index is a dot ".", this means a rest.
	 *
	 * One thing to bear in mind is that rythms and motifs are considered slightly
	 * different. A rythm is added to this current motif rythm. A motif is added
	 * to the list of submotifs in this motif.
	 */
	addRythm(rythm, subdivisionToFit = "1m", position) {
		let startOffset = position;
		if (!Array.isArray(rythm)) {
			rythm = [rythm];
		}
		const finishedRythm = rythm.map((singleRythm, index) => {
			if (isNaN(singleRythm)) {
				if (typeof singleRythm === "string") {
					//Rythm should be written in "4n" notation
					const time = startOffset;
					const duration = Tone.Time(singleRythm).toSeconds();
					startOffset += duration;
					return {
						time: time,
						duration: duration,
						noteIndex: index,
						motifId: this.motifId,
					};
				} else if (typeof singleRythm === "object" && singleRythm !== null) {
					//like {duration: "4n", noteindex: 0}
					const time = startOffset;
					const duration = Tone.Time(singleRythm.duration).toSeconds();
					startOffset += duration;
					return {
						time: time,
						duration: duration,
						noteIndex: singleRythm.noteIndex,
						motifId: this.motifId,
					};
				}
			} else if (typeof singleRythm === "number" && isFinite(singleRythm)) {
				//Rythm is a rythmindex
				const subdivisionAsSeconds = Tone.Time(subdivisionToFit).toSeconds();
				const lengthOfEachBeat = subdivisionAsSeconds / rythm.length;
				console.log("lengthOfEachBeat is: ", lengthOfEachBeat);
				const time = startOffset + lengthOfEachBeat * index;
				return {
					time: time,
					duration: lengthOfEachBeat,
					noteIndex: singleRythm,
					motifId: this.motifId,
				};
			}
		});
		this._rythm = this._rythm.concat(finishedRythm);
	}

	addmotif(motif, subdivisionToFit, position) {
		// this below ensures that the submotifs has the same notes as the parent
		// motif. This has to be updated when this.notes is changed.
		const subdivision = subdivisionToFit ? subdivisionToFit : motif.length;
		motif.fitInto(subdivision);
		//Since we're adding it to this motif, if this motif starts at 0.2
		//we want to add that position
		position += this.position;
		motif.notes = this.notes;
		motif.position = position;

		//This line makes the trouble of moving the time of the first motif.
		this.submotifs.push(motif);
	}

	add(addition, subdivisionToFit, position) {
		//If the position to add the motif or rythm to is not set,
		//add it to the end of the current motif.
		position = Tone.Time(
			position !== undefined ? position : this.length
		).toSeconds();

		//TO-DO the adding of position is not really thought through I think. It has to be implemented properly at some point!

		if (addition instanceof Motif) {
			this.addmotif(addition, subdivisionToFit, position);
		} else {
			this.addRythm(addition, subdivisionToFit, position);
		}
		return this;
	}

	/**
	 * Convencience method for layering motifs.
	 */
	layer(addition, subdivisionToFit) {
		this.add(addition, subdivisionToFit, this.position);
	}

	fitInto(subdivision, ratio) {
		let newRatio = ratio;
		if (!ratio) {
			//If there is no ratio, this motif is the first.
			const subdivisionInSeconds = Tone.Time(subdivision).toSeconds();
			newRatio = subdivisionInSeconds / this.motifLength;
		}

		this.rythm = this.rythm.map((rythm) => {
			/* console.log("new this.position is: ", this.position);
			console.log("new rythm.time is: ", rythm.time);
			console.log("new ratio is: ", newRatio);
			console.log("new timing is: ", (this.position + rythm.time) * newRatio); */
			return {
				...rythm,
				time: (this.position + rythm.time) * newRatio,
				duration: rythm.duration * newRatio,
			};
		});

		this.submotifs.forEach((motif) => {
			motif.fitInto(subdivision, newRatio);
		});
	}

	/**
	 *
	 * @param {Optional subdivision Used to fill the length or provided subdivision by repeating the rythm, if undefined the function will use the length of the motif} subdivision
	 */
	fill(subdivision) {}

	/**
	 * This is the function where everything is glued together
	 * The harmonization should be added
	 */
	getNotesFromNoteIndexAndId(noteIndex, motifId) {
		return this.findInstanceById(motifId).harmonizedFromNoteIndex(noteIndex);
	}

	harmonizedFromNoteIndex(noteIndex) {
		//Get the current step:
		if (!Array.isArray(noteIndex)) {
			noteIndex = [noteIndex];
		}
		return noteIndex.map((ni) => {
			const shl = this.stepHarmonization.length; //Get the length to do modul operation;
			const nl = this.notes.length; //Get the length to do modul operation;
			const step = this.stepHarmonization[ni % shl]; //This should always return an array;
			//So then we can loop through the current step
			return step.map((harmonization) => {
				return this.notes[ni % nl] + harmonization;
			});
		});
	}

	findInstanceById(motifId) {
		// Check if the current object matches the desired ID
		if (this.motifId === motifId) {
			return this; // Found the instance
		}

		// Iterate over the children array
		for (let submotif of this.submotifs) {
			const result = submotif.findInstanceById(motifId); // Recursively search nested children
			if (result !== null) {
				return result; // Found the instance in the child
			}
		}

		// ID not found in the current object or its descendants
		return null;
	}

	generateShortUniqueId() {
		const timestamp = new Date().getTime().toString(36);
		const randomNum = Math.random().toString(36).substring(2, 5);
		return timestamp + randomNum;
	}
}

/**
 * A new class called Rythm which essentially replaces the "addRythm" function, 
you can still add rythms the same way but they are inserted into a new
rythm class. It will just make things cleaner and easier to create helper
functions.

This rythm class could also contain a function called "generate" that takes
arguments like "slow" or "fast", "increasing" or "decreasing" so
generate("slow", "2n")
generate(type, totalLength)

Instead of "randomizing" these, create a set of figures and reuse them with
fitInto and subdivide the totalLength into 1,2,3 or 4 pieces and then fill them
with these figures of "fitInto" so for example, "2n" could be divided into 
"8n", "8n" and "4n" then take one of the figures like ["8n", "8n", "4n"] and
fitInto a "8n" which would be ["32n", "32n", "16n"]

Eventually, it would be great to be able to say 
generateSmallForm(["A", "A", "B", "A"], "1m") and it would
repeat sections "A".

- play the chord as a whole, set motif.rythm = [”all”, “lowest2”, “highest3”] etc. This would also give the ability to divide the chords.
- With the above, also add the functionality to play multiple noteIndexes at once like motif.rythm = [ [0, 1, 2], 2, 0] which would play the first second and third at the first beat.
- Play the chord as a “voiced” motif like this [{duration:”4n”, noteIndex:0, transposition:-7}]

 */

class Rythm {
	constructor(duration, time, noteIndexes, motifId) {
		this.duration = duration;
		this.time = time;
		this.noteIndexes = noteIndexes;
		this.motifId = motifId;
	}
}
