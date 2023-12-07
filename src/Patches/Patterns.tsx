import React, { useEffect } from "react";
import Motif from "../motif/Motif";
import { Loop, Part, Time, Transport } from "tone";
import {
	getRandomPatterns,
	getRandomValues,
	interpolateWeights,
	repeatValues,
} from "./Utils";

const Patterns: React.FC = () => {
	useEffect(() => {
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
				/* rootNotes[(rootNotes.indexOf(rootNote) + 6) % 7],
				rootNotes[(rootNotes.indexOf(rootNote) + 8) % 7], */
			];
			return chord;
		});
		/* chordArray.push(["C", "E", "G", "D", "F"]); */
		const array = [
			["Eb", "G", "Bb", "D", "F"],
			["Bb", "Eb"],
		];
		return array;
	};

	const handleClick = () => {
		//const rootNotes = ["Eb", "D", "Db", "C", "B"];
		const rootNotes = ["Eb", "F", "G", "Ab", "Bb", "C", "D"];

		const motifOne = createMotif(
			rootNotes.map((note) => note + "5"),
			1
		);
		const motifTwo = createMotif(
			rootNotes.map((note) => note + "4"),
			2
		);
		const motifThree = createMotif(
			rootNotes.map((note) => note + "4"),
			3
		);
		const motifFour = new Motif({
			times: ["4n", "4n", "4n"],
			noteIndexes: [0, 1, 0],
			transpositions: [0, 0, 12],
			/* harmonizations: [
				[0, -12],
				[0, -11],
				[0, -10],
			], */
			midi: { channel: 4 },
		});
		motifFour.setNoteNames(rootNotes.map((note) => note + "2"));
		//motifFour.transposition = 5;
		motifFour.loop = true;

		motifOne.setKeyWithStrings(rootNotes);
		motifTwo.setKeyWithStrings(rootNotes);
		motifThree.setKeyWithStrings(rootNotes);
		motifFour.setKeyWithStrings(rootNotes);

		const chordArray = createChordArray();
		console.log(chordArray);

		let index = 0;
		const loop = new Part(
			(time) => {
				const randomChordIndex = Math.floor(Math.random() * chordArray.length);
				const randomChord = chordArray[index++ % chordArray.length];

				motifOne.setNoteNames(randomChord.map((note) => note + "5"));
				motifTwo.setNoteNames(randomChord.map((note) => note + "4"));
				motifThree.setNoteNames(randomChord.map((note) => note + "3"));
				motifFour.setNoteNames(randomChord.map((note) => note + "3"));
				motifOne.setKeyWithStrings(randomChord);
				motifTwo.setKeyWithStrings(randomChord);
				motifThree.setKeyWithStrings(randomChord);
				motifFour.setKeyWithStrings(randomChord);
				console.log("Loop runs at " + time);
			},
			[0, "2:0"]
		).start();
		loop.loop = true;
		loop.loopEnd = "4:0";

		motifOne.start();
		/* motifTwo.start();
		motifTwo.transposition = -7; */
		/* motifThree.start();
		motifFour.start(); */
	};

	const createMotif = (notes: string[], channel: number, times?: string[]) => {
		const newTimes = times
			? times
			: getRandomValues(30, ["2n", "2n", "2n.", "1m", "4n"], [1.5, 1]);

		const pattern = getRandomPatterns(20, [
			/* {
				times: ["16n", "16n", "16n"],
				noteIndexes: [0, 1, 2],
				transpositions: [0, 0, 0],
			}, */
			/* {
				times: [
					"16n",
					"16n",
					"16n",
					"16n",
					"16n",
					"16n",
					"16n",
					"16n",
					"16n",
					"16n",
				],
				noteIndexes: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				transpositions: [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0],
			},
			{
				times: ["16n", "16n", "16n", "16n", "16n", "16n"],
				noteIndexes: [0, 0, 0, 0, 0, 0, 0, 0],
				transpositions: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
			}, */
			/* {
				times: ["16n", "8n", "16n", "16n", "8n", "16n"],
				noteIndexes: [0, 1, 2, 3, 4, 5],
				transpositions: [-12, -12, -12, -12, -12, -12],
			}, */
			{
				times: ["8n", "8n", "8n"],
				noteIndexes: [-1, 1, 2],
				transpositions: [0, -1, 0],
			},
			{
				times: ["8n", "8n", "8n"],
				noteIndexes: [0, 1, 1],
				transpositions: [0, -2, 0],
			},
			{
				times: ["4n", "8n"],
				noteIndexes: [0, 3, 2],
				transpositions: [-12, 0, 0],
			},
			/* {
				times: ["16n", "16n", "16n", "16n", "16n", "16n", "16n", "16n"],
				noteIndexes: [1, 2, 1, 2, 0, 1, 2, 1],
				transpositions: [0, 0, 0, 0, 0, 0, 0, 0],
			}, */
			/* {
				times: ["8t", "8t", "8t"],
				noteIndexes: [0, 1, 2],
				transpositions: [-1, 0, 0],
			},
			{
				times: ["8t", "8t", "8t"],
				noteIndexes: [2, 1, 2],
				transpositions: [0, 0, 0],
			},
			{
				times: ["8t", "8t", "8t", "8t", "8t", "8t"],
				noteIndexes: [0, 1, 1, 1, 2, 0],
				transpositions: [1, -7, -13, -12, -12, 0],
			}, */
			/*{
				times: ["8n", "8n"],
				noteIndexes: [0, 2],
				transpositions: [0, 0],
			},
			{
				times: ["4n"],
				noteIndexes: [3],
				transpositions: [0],
			}, */
			/* {
				times: ["8t", "8t", "8t"],
				noteIndexes: [3, 3, 3],
				transpositions: [-1, -2, -3],
			},
			
			{
				times: ["8n", "8n"],
				noteIndexes: [0, 0],
				transpositions: [-2, 0],
			},
			{
				times: ["8n", "8n"],
				noteIndexes: [1, 2],
				transpositions: [0, 0],
			},
			{
				times: ["8n.", "16n"],
				noteIndexes: [1, 2],
				transpositions: [0, 0],
			},
			{
				times: ["1m", "2m"],
				noteIndexes: [0, 2, 1],
				transpositions: [0, 0, 0],
			},
			{
				times: ["1m"],
				noteIndexes: [0, 4],
				transpositions: [0, 0],
			},

			{
				times: ["8n.", "8n.", "8n."],
				noteIndexes: [4, 0],
				transpositions: [3, 12],
			},

			{
				times: ["8n", "8n", "8n"],
				noteIndexes: [1, 2],
				transpositions: [0, 12, 7],
			}, */
		]);
		console.log("The pattern is: ", pattern);

		const motif = new Motif({
			times: pattern.times,
			noteIndexes: pattern.noteIndexes,
			transpositions: pattern.transpositions,
			/* harmonizations: [[0], [0], [0], [0, -7], [0, -7], [0, -6], [0]], */
			midi: { channel: channel },
		});
		//motif.setNoteNames(getRandomValues(125, concatNotes, [1, 0.5]));
		motif.setNoteNames(notes);
		//motif.transposition = 5;
		motif.loop = true;
		//motif.octaveShifts = getRandomValues(24, [0, 1, -1], [1, 0.5]);
		/* motif.octaveShifts = [
			1, 0.8, 0.7, 0.5, 0.4, 0.2, 0.1, 0, -0.1, -0.15, -0.2, -0.25, -0.3, -0.35,
			-0.4, -0.45, -0.5, -0.55, -0.6, -0.65, -0.7,
		]; */
		//motif.setKeyWithStrings(["Eb", "F", "G", "Ab", "Bb", "C", "D"]);
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
		/* motif.noteIndexes = getRandomValues(
			40,
			[0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
			[1, 0.5]
		); */
		//motif.noteIndexes = [0, 1, 2, 3, 4];
		return motif;
	};

	return (
		<div>
			<button onClick={handleClick}>Create pattern motif</button>
		</div>
	);
};

export default Patterns;
