import React, { useEffect } from "react";
import Motif from "../motif/Motif";
import { Loop, Transport } from "tone";
import { getRandomValues, interpolateWeights, repeatValues } from "./Utils";

const Rythmic: React.FC = () => {
	useEffect(() => {
		const repeatedValues = repeatValues(16, ["16n"]);
		console.log("Repeated values are", repeatedValues);

		const randomValues = getRandomValues(16, ["16n", "8n", "16n"], [1, 0.5]);
		console.log("Random values values are", randomValues);

		Transport.bpm.value = 60;

		const chordArray = createChordArray();
		console.log(chordArray);
	});

	const createChordArray = () => {
		const rootNotes = ["Eb", "F", "G", "Ab", "Bb", "C", "D"];
		const chordArray = rootNotes.map((rootNote) => {
			const chord = [
				rootNote,
				rootNotes[(rootNotes.indexOf(rootNote) + 2) % 7],
				rootNotes[(rootNotes.indexOf(rootNote) + 4) % 7],
			];
			return chord;
		});
		return chordArray;
	};

	const handleClick = () => {
		//motif.octaveShifts = interpolateWeights([0, -2], 6);
		//motif.octaveShifts = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7];

		let timesTwo = getRandomValues(
			30,
			[
				"4n",
				"4n",
				["8n", "8n"],
				/* ["8t", "8t", "8t"],
				["16n", "16n", "16n", "16n"],
				["16n", "16n", "16n", "16n"], */
				["8n", "16n", "16n"],
			],
			[1.5, 1]
		);

		//timesTwo = repeatValues(16, ["8n"]);
		//const rootNotes = ["Eb", "E", "F", "Gb", "Ab", "Bb"];
		//const rootNotes = ["Eb", "C", "G", "A", "Bb"];
		const rootNotes = ["Eb", "D", "Db", "C", "B"];

		const motifOne = createMotif(
			rootNotes.map((note) => note + "5"),
			1,
			timesTwo
		);
		const motifTwo = createMotif(
			rootNotes.map((note) => note + "4"),
			2,
			timesTwo
		);
		const motifThree = createMotif(
			rootNotes.map((note) => note + "3"),
			3,
			timesTwo
		);
		const motifFour = createMotif(
			rootNotes.map((note) => note + "2"),
			4,
			timesTwo
		);
		motifOne.start();
		motifTwo.start();
		motifThree.start();
		motifFour.start();

		const chordArray = createChordArray();
		console.log(chordArray);

		const loop = new Loop((time) => {
			const randomChordIndex = Math.floor(Math.random() * chordArray.length);
			const randomChord = chordArray[randomChordIndex];

			motifOne.setNoteNames(randomChord.map((note) => note + "5"));
			motifTwo.setNoteNames(randomChord.map((note) => note + "4"));
			motifThree.setNoteNames(randomChord.map((note) => note + "3"));
			motifFour.setNoteNames(randomChord.map((note) => note + "2"));
		}, "4n").start();
	};

	const createMotif = (notes: string[], channel: number, times?: string[]) => {
		const newTimes = times
			? times
			: getRandomValues(
					30,
					[
						"2n",
						"2n",
						"2n.",
						"1m",
						"4n",
						"4n",
						["8n", "8n"],
						["8t", "8t", "8t"],
						["8t", "8t", "16t", "16t"],
						["16n", "16n", "16n", "16n"],
						["16n", "16n", "16n", "16n"],
						["8n", "16n", "16n"],
					],
					[1.5, 1]
			  );
		const motif = new Motif({
			times: newTimes,
			midi: { channel: channel },
		});
		const concatNotes = [...notes];
		//motif.setNoteNames(getRandomValues(125, concatNotes, [1, 0.5]));
		motif.setNoteNames(notes);
		//motif.transposition = 5;
		motif.loop = false;
		//motif.octaveShifts = getRandomValues(24, [0, 1, -1], [1, 0.5]);
		motif.octaveShifts = [
			0, 0, -0.1, -0.15, -0.2, -0.25, -0.3, -0.35, -0.4, -0.45, -0.5, -0.55,
			-0.6, -0.65, -0.7,
		];
		motif.setKeyWithStrings(["Eb", "F", "G", "Ab", "Bb", "C", "D"]);
		/* motif.noteIndexes = getRandomValues(
			10,
			[
				[0, 2, 3],
				[0, 1, 5],
				[0, 2, 4, 5],
				[3, 2, 1, 4],
			],
			[1, 0.5]
		); */
		motif.noteIndexes = getRandomValues(
			40,
			[0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
			[1, 0.5]
		);
		//motif.noteIndexes = [0, 1, 2, 3, 4];
		return motif;
	};

	return (
		<div>
			<button onClick={handleClick}>Create Motif</button>
		</div>
	);
};

export default Rythmic;
