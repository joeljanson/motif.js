import { Time } from "tone";
import motifsData from "./Motifs.json";
import { MotifOptions } from "./Motif";
import Motif from "./Motif";

console.log(motifsData);

// // Define the possible beat combination
const twoBeats = [
	["2n", "2n"],
	["2n.", "4n"],
	["4n", "2n."],
];

const possible: Record<string, Array<Array<string>>> = {
	"4n": [
		["8n", "8n"],
		["4n"],
		//["8n.", "16n"],
		//["8n", "16n", "16n"],
		//["16n", "16n", "16n", "16n"],
	],
	"1m": [["1m"], ["2n", "2n"], ["2n.", "4n"], ["2n.", "8n", "8n"]],
};

class Generator {
	constructor() {
		console.log("Generator was constructed.");
	}

	static getMotifFromStore() {
		const bachMotifs = motifsData.motifs.bach;
		//const bachMotifs = motifsData.motifs.bach;
		//console.log("bachMotifs: ", bachMotifs);
		const randomIndex = Math.floor(Math.random() * bachMotifs.length);
		const returnMotif = new Motif(bachMotifs[0]);
		return returnMotif;
	}

	static generateSmallForm(form: Array<string>, noteValue: string) {
		const result = [];
		// const partA = this.fill(noteValue, 2);
		// const partB = this.fill(noteValue, 2);
		const partA = this.getMotifFromStore();
		const partB = this.getMotifFromStore();
		for (const part of form) {
			if (part === "A") {
				// If the part is 'A', add a fill generation for 'A'
				result.push(partA);
			} else if (part === "B") {
				// If the part is 'B', add a fill generation for 'B'
				result.push(partB);
			} else {
				// Handle other parts if needed, e.g., add a default fill generation
				result.push(this.fill(noteValue)); // You can replace 'Default' with your preferred default value
			}
		}
		const returnMotif = new Motif(this.concatenateResults(result));
		return returnMotif;
	}

	private static concatenateResults(result: any) {
		const concatenatedResult = {
			times: [],
			noteIndexes: [],
			transpositions: [],
			octaveShifts: [],
		};

		result.forEach((oneResult: any) => {
			concatenatedResult.times = concatenatedResult.times.concat(
				oneResult.times
			);
			concatenatedResult.noteIndexes = concatenatedResult.noteIndexes.concat(
				oneResult.noteIndexes
			);
			concatenatedResult.transpositions =
				concatenatedResult.transpositions.concat(oneResult.transpositions);
			concatenatedResult.octaveShifts = concatenatedResult.octaveShifts.concat(
				oneResult.octaveShifts
			);
		});

		return concatenatedResult;
	}

	static plainMotifFromNotes(notes: Array<string>) {
		const times = notes.map(() => "4n");
		const noteIndexes = notes.map((note, index) => index);
		const transpositions = notes.map(() => 0);
		const octaveShifts = notes.map(() => 0);
		const returnMotif = new Motif({
			times,
			noteIndexes,
			transpositions,
			octaveShifts,
		});
		returnMotif.notes.notenames = notes;
		return returnMotif;
	}

	static fill(notevalue: string, numberOfBeats: number = 1) {
		const times = this.times(notevalue, numberOfBeats);
		const noteIndexes = this.noteIndexes(times);
		const transpositions = this.transpositions(noteIndexes, 7);
		const octaveShifts = this.octaveShifts(transpositions);
		const returnMotif = new Motif({
			times,
			noteIndexes,
			transpositions,
			octaveShifts,
		});
		return returnMotif;
	}

	static times(notevalue: string, numberOfBeats: number = 1) {
		const combinedCombinations = [];
		for (let i = 0; i < numberOfBeats; i++) {
			const possibleNoteCombinations = possible[notevalue];
			// Generate a random index to select one of the arrays
			const randomIndex = Math.floor(
				Math.random() * possibleNoteCombinations.length
			);

			// Return the selected array
			combinedCombinations.push(possibleNoteCombinations[randomIndex]);
		}
		return combinedCombinations.flat();
	}

	static noteIndexes(time: Array<string>) {
		return time.map(() => Math.floor(Math.random() * 3)).sort((a, b) => a - b);
	}

	static transpositions(
		noteIndexes: Array<number>,
		maxSteps: number = 1
	): Array<number> {
		let hasPreceedingNote = false;
		let hasFollowingNote = false;
		const transpositions: Array<number> = [];
		noteIndexes.forEach((noteIndex, index) => {
			if (index === 0) {
				hasPreceedingNote = false;
				hasFollowingNote = this.findHasNextNote(
					noteIndexes,
					index,
					transpositions
				);
			} else if (index + 1 > noteIndexes.length) {
				hasFollowingNote = false;
				hasPreceedingNote = this.findHasPreviousNote(
					noteIndexes,
					index,
					transpositions
				);
			} else {
				hasFollowingNote = this.findHasNextNote(
					noteIndexes,
					index,
					transpositions
				);
				hasPreceedingNote = this.findHasPreviousNote(
					noteIndexes,
					index,
					transpositions
				);
			}
			if (hasFollowingNote || hasPreceedingNote) {
				const values = this.generateArrayOfSteps(maxSteps);
				const randomValue = values[Math.floor(Math.random() * values.length)];
				transpositions.push(randomValue);
			} else {
				transpositions.push(0);
			}
		});
		return transpositions;
	}

	static octaveShifts(transpositions: Array<number>) {
		return transpositions.map(() => Math.floor(Math.random() * 1));
		//return transpositions.map(() => 0);
	}

	private static findHasPreviousNote(
		noteIndexes: Array<number>,
		index: number,
		transpositions: Array<number>
	): boolean {
		const currentNoteIndex = noteIndexes[index];
		const previousNoteIndex = noteIndexes[index - 1];
		if (currentNoteIndex === previousNoteIndex) {
			//console.log("Found previous note for: ", currentNoteIndex);
			// Check if the previous transposition is anything else than 0. In that case return no transposition.
			if (transpositions[transpositions.length - 1] === 0) {
				return true;
			}
			return false;
		}
		return false;
	}

	private static findHasNextNote(
		noteIndexes: Array<number>,
		index: number,
		transpositions: Array<number>
	): boolean {
		const currentNoteIndex = noteIndexes[index];
		const nextNoteIndex = noteIndexes[index + 1];
		if (currentNoteIndex === nextNoteIndex) {
			//console.log("Found next note for: ", currentNoteIndex);
			if (transpositions[transpositions.length - 1] === 0) {
				return true;
			}
			return false;
		}
		return false;
	}

	private static generateArrayOfSteps(maximumNumberOfSteps: number): number[] {
		const values = [];
		for (let i = -maximumNumberOfSteps; i <= maximumNumberOfSteps; i++) {
			if (i !== 0) {
				values.push(i);
			}
		}
		return values;
	}

	/* 
	splitValue(value: number, parts: number, isSimple: boolean = true): number[] {
		let combinations: number[][] = [];

		// Define a recursive function to generate combinations
		function generateCombinations(
			currentCombination: number[],
			remainingValue: number
		) {
			// Base case: If we have filled all parts
			if (currentCombination.length === parts) {
				if (remainingValue === 0) {
					combinations.push([...currentCombination]); // Valid combination
				}
				return;
			}

			// Try splitting the remaining value
			for (let i = 0; i <= remainingValue; i++) {
				currentCombination.push(i);
				generateCombinations(currentCombination, remainingValue - i);
				currentCombination.pop(); // Backtrack
			}
		}

		generateCombinations([], value);
		if (isSimple) {
			const filteredCombinations = combinations.filter(
				(combination) => !combination.includes(0)
			);
			combinations = filteredCombinations;
		}

		// Generate a random index to select one of the arrays
		const randomIndex = Math.floor(Math.random() * combinations.length);

		// Return the selected array
		return combinations[randomIndex];
	}

	getPossibleRythmValues(
		numberOfNotes: number,
		fitInto: string = "1m"
	): number[] {
		const ratio = Time(fitInto).toSeconds() / Time("1m").toSeconds();

		if (numberOfNotes === 1) {
			return [Time("1m").toSeconds() * ratio];
		} else {
			return [0];
		}
	}

	private getRandomDivisionOfTwo(fitInto: string | number): Array<number> {
		const ratio = Time(fitInto).toSeconds() / Time("1m").toSeconds();
		const randomIndex = Math.floor(Math.random() * twoBeats.length);
		const arrayOfTime = twoBeats[randomIndex].map(
			(value) => Time(value).toSeconds() * ratio
		);

		return arrayOfTime;
	}

	waysToSplitABar(numberOfBeats: number = 2, fitInto: string | number) {
		// Ta emot en siffra, om den inte är delbar med två så ta bort den första
		// oc
		const randomDivision = this.getRandomDivisionOfTwo(fitInto);
		if (numberOfBeats === 3) {
			return [
				randomDivision[0],
				this.getRandomDivisionOfTwo(randomDivision[1]),
			].flat();
		} else if (numberOfBeats === 2) {
			return randomDivision;
		} else if (numberOfBeats === 1) {
			return [Time(fitInto).toSeconds()];
		}
		return [1, 1, 1, 1];
	}

	generateRythm(numberOfNotes: number, fitInto: string = "1m") {
		//console.log(this.waysToSplitABar(3, "1m"));
		//console.log("--------");
		//console.log(this.waysToSplitABar(1, "1m"));
		//console.log(this.waysToSplitABar(2, 1));
		//console.log(this.waysToSplitABar(1, 0.25));
		//console.log(this.waysToSplitABar(2, 0.75));
		const randomSpaceDistribution =
			1 + Math.floor(Math.random() * numberOfNotes);
		//console.log("Number of spaces to be filled: ", randomSpaceDistribution);
		const splitSpaces = this.splitValue(numberOfNotes, randomSpaceDistribution);
		//console.log("How the spaces will be split: ", splitSpaces);
		const possibleSplit = this.waysToSplitABar(splitSpaces.length, fitInto);
		//console.log("possibleSplit: ", possibleSplit);
		const fullRythm: Array<Array<number>> = [];
		splitSpaces.forEach((value, index) => {
			const split = possibleSplit[index];
			fullRythm.push(this.waysToSplitABar(value, split));
		});
		return fullRythm.flat();
		// const timeForOneSpace = Time(fitInto).toSeconds() / numberOfNotes;
		// console.log(this.getPossibleRythmValues(1, "2n"));
	} */
}
export default Generator;
