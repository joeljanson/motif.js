import React, { useEffect, useRef, useState } from "react";
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
import { Scale, ScaleType, note } from "tonal";

export interface BendablePatchProps {
	title: string;
	times: string[];
	noteIndexes: number[];
	transpositions: number[];
	harmonizations: number[][];
	octaveShifts?: number[] | undefined;
	rootNotes: string[];
	bpm: number;
}

const BendablePatch: React.FC<BendablePatchProps> = ({
	title,
	times,
	noteIndexes,
	transpositions,
	harmonizations,
	octaveShifts = [0],
	rootNotes,
	bpm,
}) => {
	useEffect(() => {
		Transport.bpm.value = bpm;
		/* console.log("rootnotes", rootNotes);
		console.log("bpm", bpm);
		console.log("noteIndexes", noteIndexes);
		console.log("transpositions", transpositions);
		console.log("Times: ", times); */
		if (motifRef.current) {
			motifRef.current.transpositions = transpositions;
			motifRef.current.noteIndexes = noteIndexes;
			motifRef.current.times = times;
			motifRef.current.setNoteNames(rootNotes);
		}
	}, [bpm, transpositions, rootNotes, times]);

	// State to track whether the motif is playing
	const [isPlaying, setIsPlaying] = useState(false);

	// Ref to store the motif object
	const motifRef = useRef<Motif | null>(null);

	// Function to create and/or toggle the motif play state
	const handleClick = () => {
		// Only create the motif if it hasn't been created yet
		if (!motifRef.current) {
			motifRef.current = createMotif(
				rootNotes,
				1,
				times,
				noteIndexes,
				transpositions,
				octaveShifts,
				harmonizations
			);
		}

		// Toggle the play state based on isPlaying
		if (isPlaying) {
			motifRef.current.stop();
		} else {
			motifRef.current.start();
		}

		// Update the isPlaying state
		setIsPlaying(!isPlaying);
	};

	const createMotif = (
		notes: string[],
		channel: number,
		times: string[],
		noteIndexes: number[],
		transpositions: number[],
		octaveShifts: number[],
		harmonizations: number[][]
	) => {
		/* const pattern = getRandomPatterns(1, [
			{ times, noteIndexes, transpositions },
		]); */

		const motif = new Motif({
			times: times,
			noteIndexes: noteIndexes,
			transpositions: transpositions,
			midi: { channel },
		});

		motif.setNoteNames(notes);
		motif.loop = false;
		motif.harmonizations = harmonizations;
		motif.octaveShifts = octaveShifts;
		console.log(motif);
		// Customize harmonizations and other properties as needed
		return motif;
	};

	const buttonClass = isPlaying ? "button-stop" : "button-play";

	return (
		<div>
			<button className={"button " + buttonClass} onClick={handleClick}>
				{title}
			</button>
		</div>
	);
};

export default BendablePatch;
