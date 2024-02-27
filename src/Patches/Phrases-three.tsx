import React, { useEffect } from "react";
import Motif from "../motif/Motif";
import { Time, Transport } from "tone";
import {
	getRandomPatterns,
	getRandomValues,
	getUniqueRandomValues,
	interpolateWeights,
	repeatValues,
} from "./Utils";
import Phrase from "../motif/Phrase";
import { Scale, ScaleType } from "tonal";

const PhrasesThree: React.FC = () => {
	useEffect(() => {
		Transport.bpm.value = 120;
		console.log(ScaleType.get("messiaen's mode #2"));
		console.log(Scale.get("messiaen's mode #2"));
		console.log("All scales: ", ScaleType.all());
		console.log(getUniqueRandomValues(30, [0, 1, -1], [1.5, 1]));
		console.log(
			getRandomValues(30, [["8t", "8t", "8t"], ["4n"], ["8n", "8n"]], [1.5, 1])
		);
	});

	const handleClick = () => {
		const rootNotes = ["Eb", "F", "G", "Ab", "Bb", "C", "D"];
		const motifOne = createMotif(["Eb4", "F4", "Gb4", "G4"], 1);
		motifOne.start();
	};

	const createMotif = (notes: string[], channel: number, times?: string[]) => {
		const newTimes = times
			? times
			: getRandomValues(
					8,
					[
						["8t", "8t", "8t", "4n"],
						["8t", "8t", "8t", "8n", "8n"],
					],
					[1.5, 1]
			  ); //getRandomValues(8, ["2n"], [1.5, 1]);
		// : getRandomValues(30, ["16n"], [1.5, 1]);

		const pattern = getRandomPatterns(4, [
			{
				times: newTimes,
				noteIndexes: getRandomValues(8, [0], [1.5, 1]),
				transpositions: getRandomValues(8, [0], [1.5, 1]),
			},
		]);

		const motif = new Motif({
			times: pattern.times,
			noteIndexes: pattern.noteIndexes,
			transpositions: pattern.transpositions,
			midi: { channel: channel },
		});
		motif.setNoteNames(notes);
		motif.loop = false;
		motif.harmonizations = getRandomValues(
			24,
			[[[0, 1]], [[0, 7]], [[0, 5, 6]]],
			[1, 0.5]
		);
		/* motif.octaveShifts = getRandomValues(24, [0, 1, -1], [1, 0.5]); */
		/* motif.octaveShifts = [
			1, 0.8, 0.7, 0.5, 0.4, 0.2, 0.1, 0, -0.1, -0.15, -0.2, -0.25, -0.3, -0.35,
			-0.4, -0.45, -0.5, -0.55, -0.6, -0.65, -0.7,
		]; */
		return motif;
	};

	return (
		<div>
			<button onClick={handleClick}>Harmonized rythms</button>
		</div>
	);
};

export default PhrasesThree;
