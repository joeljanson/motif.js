// Defining interfaces and utility functions used by the patches

export interface NotePattern {
	times: string[];
	noteIndexes: number[];
	transpositions: number[];
}

export function interpolateWeights(
	weights: number[],
	targetLength: number
): number[] {
	if (weights.length === 1) {
		// If only one weight is provided, use it for all values
		return new Array(targetLength).fill(weights[0]);
	}

	const result = [];
	const step = (targetLength - 1) / (weights.length - 1);

	for (let i = 0; i < weights.length - 1; i++) {
		const startWeight = weights[i];
		const endWeight = weights[i + 1];
		for (let j = 0; j < step; j++) {
			const interpolatedWeight =
				startWeight + (endWeight - startWeight) * (j / step);
			result.push(interpolatedWeight);
		}
	}
	result.push(weights[weights.length - 1]); // Add the last weight

	return result;
}

export function getRandomValues<T>(
	length: number,
	values: (T | T[])[],
	weights?: number[]
): T[] {
	let adjustedWeights: number[];

	if (weights && values.length !== weights.length) {
		adjustedWeights = interpolateWeights(weights, values.length);
	} else if (weights) {
		adjustedWeights = weights;
	} else {
		adjustedWeights = new Array(values.length).fill(1);
	}

	const totalWeight = adjustedWeights.reduce((acc, weight) => acc + weight, 0);
	const result: T[] = [];

	for (let i = 0; i < length; i++) {
		let randomNum = Math.random() * totalWeight;
		for (let j = 0; j < adjustedWeights.length; j++) {
			randomNum -= adjustedWeights[j];
			if (randomNum <= 0) {
				const value = values[j];
				if (Array.isArray(value)) {
					// Flatten and push the entire array as a single entity
					result.push(...(value as T[]));
				} else {
					result.push(value as T);
				}
				break;
			}
		}
	}

	return result;
}

export function getRandomPatterns(
	length: number,
	patterns: NotePattern[],
	weights?: number[]
): NotePattern {
	// Similar weight adjustment logic as before
	let adjustedWeights: number[];

	if (weights && patterns.length !== weights.length) {
		adjustedWeights = interpolateWeights(weights, patterns.length);
	} else if (weights) {
		adjustedWeights = weights;
	} else {
		adjustedWeights = new Array(patterns.length).fill(1);
	}

	const totalWeight = adjustedWeights.reduce((acc, weight) => acc + weight, 0);
	let result: NotePattern = { times: [], noteIndexes: [], transpositions: [] };

	for (let i = 0; i < length; i++) {
		let randomNum = Math.random() * totalWeight;
		for (let j = 0; j < adjustedWeights.length; j++) {
			randomNum -= adjustedWeights[j];
			if (randomNum <= 0) {
				// Concatenate the selected NotePattern to the result
				result.times = result.times.concat(patterns[j].times);
				result.noteIndexes = result.noteIndexes.concat(patterns[j].noteIndexes);
				result.transpositions = result.transpositions.concat(
					patterns[j].transpositions
				);
				break;
			}
		}
	}

	return result;
}

export function repeatValues<T>(length: number, values: (T | T[])[]): T[] {
	const repeatedValues: T[] = [];
	if (Array.isArray(values)) {
		// values is an array, use flat()
		for (const value of values) {
			repeatedValues.push(...Array(length).fill(value));
		}
		return repeatedValues;
	} else {
		// values is a single value, repeat it length times
		return Array(length).fill(values);
	}
}

export function getUniqueRandomValues<T>(
	length: number,
	values: (T | T[])[],
	weights?: number[]
): T[] {
	let adjustedWeights: number[];
	let lastValueIndex: number | null = null; // Variable to track the index of the last value added

	if (weights && values.length !== weights.length) {
		adjustedWeights = interpolateWeights(weights, values.length);
	} else if (weights) {
		adjustedWeights = weights;
	} else {
		adjustedWeights = new Array(values.length).fill(1);
	}

	const result: T[] = [];
	const originalWeights = [...adjustedWeights]; // Clone original weights to restore later

	for (let i = 0; i < length; i++) {
		if (lastValueIndex !== null && values.length > 1) {
			// Ensure the last selected value cannot be chosen again
			adjustedWeights[lastValueIndex] = 0;
		}

		let totalWeight = adjustedWeights.reduce((acc, weight) => acc + weight, 0);
		let randomNum = Math.random() * totalWeight;

		for (let j = 0; j < adjustedWeights.length; j++) {
			randomNum -= adjustedWeights[j];
			if (randomNum <= 0) {
				const value = values[j];
				if (Array.isArray(value)) {
					result.push(...(value as T[]));
				} else {
					result.push(value as T);
				}
				lastValueIndex = j; // Update the lastValueIndex with the current index
				adjustedWeights = [...originalWeights]; // Restore original weights for next iteration
				break;
			}
		}
	}

	return result;
}

export function getSlidingRange(
	count: number,
	start: number,
	end: number
): number[] {
	if (count <= 0) {
		throw new Error("Invalid argument: count must be positive.");
	}

	// Calculate absolute difference and handle zero difference
	const absDiff = Math.abs(end - start);
	if (absDiff === 0) {
		return Array(count).fill(start);
	}

	const step = absDiff / (count - 1);
	const result: number[] = [];

	// Use sign based on start and end values
	const sign = start < end ? 1 : -1;

	for (let i = 0; i < count; i++) {
		result.push(start + i * step * sign);
	}

	return result;
}

export function getRandomizedVoicings(
	chord: number[],
	n: number,
	noteCount: number,
	lowerRange: number = -2,
	upperRange: number = 2
): number[][] {
	const uniqueVoicings = new Set<string>(); // Use a Set to ensure all voicings are unique
	const voicings: number[][] = []; // This will store the final array of voicings

	while (voicings.length < n) {
		let voicing: number[] = [];
		for (let i = 0; i < noteCount; i++) {
			// Select a random note from the chord
			const note = chord[Math.floor(Math.random() * chord.length)];
			// Randomly choose an octave shift within the specified range and apply it
			const octaveShift =
				Math.floor(Math.random() * (upperRange - lowerRange + 1) + lowerRange) *
				12;
			const transposedNote = note + octaveShift;
			voicing.push(transposedNote);
		}

		// Sort the voicing for consistency
		voicing.sort((a, b) => a - b);

		// Convert the voicing to a string for uniqueness checking
		const voicingString = voicing.join(",");

		// Check for uniqueness and add if it's a new voicing
		if (!uniqueVoicings.has(voicingString)) {
			uniqueVoicings.add(voicingString);
			voicings.push(voicing);
		}
	}

	return voicings;
}

export function getChromaticScale() {
	return [
		"C4",
		"C#4",
		"D4",
		"D#4",
		"E4",
		"F4",
		"F#4",
		"G4",
		"G#4",
		"A4",
		"A#4",
		"B4",
	];
}
