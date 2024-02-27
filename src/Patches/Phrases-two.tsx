import React, { useEffect } from "react";
import Motif from "../motif/Motif";
import { Time, Transport } from "tone";
import {
	getRandomPatterns,
	getRandomValues,
	interpolateWeights,
	repeatValues,
} from "./Utils";
import Phrase from "../motif/Phrase";
import { Scale, ScaleType } from "tonal";

const PhrasesTwo: React.FC = () => {
	useEffect(() => {
		Transport.bpm.value = 120;
		console.log(ScaleType.get("messiaen's mode #2"));
		console.log(Scale.get("messiaen's mode #2"));
		console.log("All scales: ", ScaleType.all());
	});

	const handleClick = () => {
		//const rootNotes = ["Eb", "D", "Db", "C", "B"];

		const rootNotes = ["Eb", "F", "G", "Ab", "Bb", "C", "D"];

		const phrase = new Phrase(
			[
				{
					time: 0,
					//chord: ["Eb3", "G4", "Bb4", "D5"],
					chord: "Dm",
					key: "C whole-half diminished",
				},
				{
					time: "1:0",
					chord: "Am",
					key: "C whole-half diminished",
				},
				{
					time: "3:0",
					chord: "G",
					key: "C whole-half diminished",
				},
				{
					time: "4:0",
					chord: "C",
					key: "C whole-half diminished",
				},
				/* {
					time: "2:0",
					chord: "Fmin7",
					key: "Eb whole-half diminished",
				},
				{
					time: "3:0",
					chord: ["E4", "F#4"],
					key: "E major",
				},
				{
					time: "3:2:0",
					chord: ["C4", "Ab4"],
					key: "Eb major",
				}, */
			],
			"5m"
		);
		const motifOne = createMotif(["Eb3", "G4", "Ab4", "Bb4"], 1);
		motifOne.transposition = 12;
		const motifTwo = createMotif(rootNotes, 2);
		const motifThree = createMotif(rootNotes, 3);
		const motifFour = createMotif(rootNotes, 4);
		const motifFive = createMotif(rootNotes, 5);
		//motifTwo.harmonizations = [[0]];
		motifTwo.transposition = -10;
		//motifThree.transposition = 19;
		motifFour.transposition = -7;
		motifFive.transposition = -12;

		/* motifTwo.position = Time("0:2").toSeconds();
		motifThree.position = Time("1:2").toSeconds();
		motifFour.position = Time("0:3").toSeconds();
		motifFive.position = Time("1:4").toSeconds(); */

		phrase.add(motifOne);
		phrase.add(motifTwo);
		phrase.add(motifThree);
		/*phrase.add(motifFour);
		phrase.add(motifFive); */
		phrase.start();
		//motifOne.start();
	};

	const createMotif = (notes: string[], channel: number, times?: string[]) => {
		const newTimes = times
			? times
			: getRandomValues(30, ["2n", "2n", "2n.", "1m", "4n"], [1.5, 1]);

		const pattern = getRandomPatterns(4, [
			{
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
					"16n",
					"16n",
				],
				noteIndexes: [0, 0, 0, 0, 0],
				transpositions: [0, 1, 2, 3, 4, 0, 0, 1, 0, 0],
			},
		]);

		const patternTwo = getRandomPatterns(4, [
			{
				times: ["2n", "2n", "2n", "2n"],
				noteIndexes: [0, 1, 2, 1, 2, 1, 0, 1, 2, 2, 2, 0],
				transpositions: [0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
			},
		]);
		console.log("The pattern is: ", pattern);
		const motif = new Motif({
			times: pattern.times.concat(patternTwo.times),
			noteIndexes: pattern.noteIndexes.concat(patternTwo.noteIndexes),
			transpositions: pattern.transpositions.concat(patternTwo.transpositions),
			midi: { channel: channel },
		});

		/* const motif = new Motif({
			times: pattern.times,
			noteIndexes: pattern.noteIndexes,
			transpositions: pattern.transpositions,
			midi: { channel: channel },
		}); */
		motif.setNoteNames(notes);
		motif.loop = true;
		/* motif.octaveShifts = getRandomValues(24, [0, 1, -1], [1, 0.5]); */
		/* motif.octaveShifts = [
			1, 0.8, 0.7, 0.5, 0.4, 0.2, 0.1, 0, -0.1, -0.15, -0.2, -0.25, -0.3, -0.35,
			-0.4, -0.45, -0.5, -0.55, -0.6, -0.65, -0.7,
		]; */
		return motif;
	};

	return (
		<div>
			<button onClick={handleClick}>Create phrase motif</button>
		</div>
	);
};

export default PhrasesTwo;
