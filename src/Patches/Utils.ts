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
	values: T[],
	weights?: number[]
): T[] {
	let adjustedWeights: number[];

	if (weights && values.length !== weights.length) {
		adjustedWeights = interpolateWeights(weights, values.length);
	} else if (weights) {
		adjustedWeights = weights;
	} else {
		// If no weights are provided, assign equal weights
		adjustedWeights = new Array(values.length).fill(1);
	}

	const totalWeight = adjustedWeights.reduce((acc, weight) => acc + weight, 0);
	const result: T[] = [];

	for (let i = 0; i < length; i++) {
		let randomNum = Math.random() * totalWeight;
		for (let j = 0; j < adjustedWeights.length; j++) {
			randomNum -= adjustedWeights[j];
			if (randomNum <= 0) {
				result.push(values[j]);
				break;
			}
		}
	}

	return result;
}
