import { Time } from "tone";

// // Define the possible beat combination
const twoBeats = [
	["2n", "2n"],
	["2n.", "4n"],
	["4n", "2n."],
];

const possible: Record<string, Array<Array<string>>> = {
	"4n": [
		["8n", "8n"],
		["8n.", "16n"],
		["8n", "16n", "16n"],
		["16n", "16n", "16n", "16n"],
	],
	"1m": [["8n", "8n"]],
};

class Generator {
	constructor() {
		console.log("Generator was constructed.");
	}

	static fill(notevalue: string, numberOfBeats: number = 1) {
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
