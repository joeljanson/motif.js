function randomItemInArray(array) {
	if (!Array.isArray(array)) {
		throw new Error("Input is not an array.");
	}

	if (array.length === 0) {
		throw new Error("Array is empty.");
	}

	const randomIndex = Math.floor(Math.random() * array.length);
	return array[randomIndex];
}
