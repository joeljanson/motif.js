const patterns = new Map();
patterns.set("p1", ["4n", "4n", "4n", "4n"]);
patterns.set("p2", ["4n", "4n", "2n"]);
patterns.set("p3", ["2n", "4n", "4n"]);

function getRythmicPattern(pattern = "p1", subdivision = "4n") {
	//currentPattern will be an array, like ["4n", "4n", "4n", "4n"] which means we can use map to change it.
	const currentPattern = patterns.get(pattern);

	//Get the seconds of the subdivision and the quarter note and divide it to get the ratio.
	const subdivisionTime = Tone.Time(subdivision).toSeconds();
	const fourthNote = Tone.Time("4n").toSeconds();
	const divisionOfTime = subdivisionTime / fourthNote;

	//This ratio is then used to calculate the new value
	const returnPattern = currentPattern.map(
		(value) => Tone.Time(value).toSeconds() * divisionOfTime
	);

	return returnPattern;
}

/*
This is a function that generates a row of rythms that are "randomly" selected from an array of possible rythms.
*/
function generateArrayOfRythms(
	numberOfRythms,
	possibleRythms = ["8n", "4n", "16n", "2n", "4t"]
) {
	const returnArray = [];
	for (let i = 0; i < numberOfRythms; i++) {
		returnArray.push(randomItemInArray(possibleRythms));
	}
	return returnArray;
}

class Rythmic {
	constructor(pattern, rythms = []) {
		this.sequence = [];
		if (pattern) {
			const patternArray = patterns.get(pattern);
			if (patternArray) {
				this.sequence = patternArray;
			} else {
				console.warn(
					"The pattern you've provided does not exist in the database."
				);
			}
		} else if (rythms) {
			this.sequence = rythms;
		}
	}

	addRandomRythms(numberOfRythms, possibleRythms = ["4n", "8n", "16n"]) {
		const returnArray = [];
		for (let i = 0; i < numberOfRythms; i++) {
			returnArray.push(randomItemInArray(possibleRythms));
		}
		this.sequence = this.sequence.concat(returnArray);
		console.log("sequence now is", this.sequence);
		return this;
	}

	repeat(numberOfRepeats = 2, numberOfRythmsToRepeat) {
		const tempArray = this.sequence;
		for (let i = 1; i < numberOfRepeats; i++) {
			if (numberOfRythmsToRepeat) {
				this.sequence = this.sequence.concat(
					tempArray.slice(-numberOfRythmsToRepeat)
				);
			} else {
				this.sequence = this.sequence.concat(tempArray);
			}
		}
		return this;
	}

	repeatWithTie(numberOfRepeats = 1) {
		for (let i = 0; i < numberOfRepeats; i++) {
			this.tie(this.sequence);
		}
		return this;
	}

	tie(sequenceToTieTo) {
		const currentSequence = this.sequenceAsSeconds(this.sequence);
		const comingSequence = this.sequenceAsSeconds(sequenceToTieTo);
		let tiedSequence = [];
		if (currentSequence.length > 0 && comingSequence.length > 0) {
			const lastObjectOfExistingSeq =
				currentSequence[currentSequence.length - 1];
			const firstObjectOfNewSeq = comingSequence[0];
			const tiedNote = lastObjectOfExistingSeq + firstObjectOfNewSeq;
			currentSequence.splice(currentSequence.length - 1, 1, tiedNote);
			comingSequence.splice(0, 1);
			tiedSequence = currentSequence.concat(comingSequence);
			this.sequence = this.sequenceAsNotation(tiedSequence);
		}
		return this;
	}

	sequenceAsSeconds(sequence) {
		return sequence.map((val) => Tone.Time(val).toSeconds());
	}

	sequenceAsNotation(sequence) {
		return sequence.map((val) => Tone.Time(val).toNotation());
	}
}

/*
This class should hold a rythmic sequence. Quite simple. 
this.sequence -> returns the sequence as an array of seconds


*/
