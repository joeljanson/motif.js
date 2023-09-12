function generateArrayOfPitches(numberOfNotes, range = [0, 127]) {
	return Array.from(
		{ length: numberOfNotes },
		() => Math.floor(Math.random() * (range[1] - range[0] + 1)) + range[0]
	);
}

function generateMajorChord(startNote = 60) {
	return [startNote, startNote + 7, startNote + 12, startNote + 16];
}

function generateArrayOfPitchesFromSet(
	numberOfNotes,
	setOfPitches = [60, 64, 67]
) {
	return Array.from({ length: numberOfNotes }, () =>
		randomItemInArray(setOfPitches)
	);
}
