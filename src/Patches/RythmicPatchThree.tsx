// XYPad.tsx

import React, { useEffect, useRef, useState } from "react";
import { Time, Transport, getContext, start } from "tone";
import MidiHandler from "../midi-handling/MidiHandler";
import Motif from "../motif/Motif";
import NoteSequence from "../motif/TonalHelper";
import Generator from "../motif/Generator";
import { Scale } from "tonal";

interface XYCoordinates {
	x: number;
	y: number;
}

const RythmicPatchThree: React.FC = () => {
	const [mouseDown, setMouseDown] = useState(false);
	const [midiHandler, setMidiHandler] = useState<MidiHandler | null>(null);
	const motifs = useRef<Array<Motif | null>>([]);
	const [coordinates, setCoordinates] = useState<XYCoordinates>({ x: 0, y: 0 });

	const startToneSetupMidiHandler = async () => {
		await start();
		const internalMidiHandler = MidiHandler.getInstance();
		const result = await internalMidiHandler.enableMidi();
		internalMidiHandler.output = 0;
		setMidiHandler(midiHandler);
		console.log("Midi enabled result:", result);
	};

	const handleMouseDown = (e: React.MouseEvent) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const x = (e.clientX - rect.left) / rect.width; // Normalize to 0-1
		const y = 1 - (e.clientY - rect.top) / rect.height; // Normalize to 0-1 and invert y axis

		// Convert to desired scale
		const scaledX = x; // Converts 0-1 to -1 to 1
		const scaledY = y * 2 - 1; // Converts 0-1 to -1 to 1

		console.log("Context state is: ", getContext().state);
		if (getContext().state !== "running") {
			startToneSetupMidiHandler();
		}

		setMouseDown(true);
		updateCoordinates(e);
		//updateRythms(scaledX, scaledY);
		updateTransposition(scaledX, scaledY);
		//updateScale();
		motifs.current.forEach((motif) => {
			motif?.start();
		});
	};

	const handleMouseUp = () => {
		setMouseDown(false);
		motifs.current.forEach((motif) => {
			motif?.stop();
		});
	};

	const handleMouseMove = (e: React.MouseEvent) => {
		if (mouseDown) {
			updateCoordinates(e);
		}
	};

	const updateCoordinates = (e: React.MouseEvent) => {
		const rect = e.currentTarget.getBoundingClientRect();
		const x = (e.clientX - rect.left) / rect.width; // Normalize to 0-1
		const y = 1 - (e.clientY - rect.top) / rect.height; // Normalize to 0-1 and invert y axis

		// Convert to desired scale
		const scaledX = x; // Converts 0-1 to -1 to 1
		const scaledY = y * 2 - 1; // Converts 0-1 to -1 to 1

		setCoordinates({ x: scaledX, y: scaledY });
		console.log(`X: ${scaledX}, Y: ${scaledY}`);
		//updateRootNotes();
		updateTransposition(scaledX, scaledY);
		const internalMidiHandler = MidiHandler.getInstance();
		internalMidiHandler.velocityFactor = scaledX;
		/* Transport.bpm.value = 50;
		Transport.bpm.rampTo(50 + scaledX * 80, 2); */
	};

	const updateTransposition = (x: number, y: number) => {
		motifs.current.forEach((motif, index) => {
			motif!.transposition = Math.round(y * 12);
			motif!.updateNotesToPlayAtIndex();
			console.log(motif?.transposition);
		});
	};

	const updateScale = () => {
		const scale = "C messiaen's mode #3";
		//const scale = "C whole tone";
		motifs.current.forEach((motif) => {
			motif!.setKeyWithStrings(
				Scale.get(scale).notes.map((note) => note + "4")
			);
			motif!.updateNotesToPlayAtIndex();
		});
	};

	const updateRythms = (x: number, y: number) => {
		const possibleTimes = getRhythmForXValue(x);

		motifs.current.forEach((motif) => {
			motif!.transposition = Math.round(y * 12);
			const transformedMotifTimes = motif!.times.map(() =>
				getRandomItem(possibleTimes)
			);
			motif!.times = transformedMotifTimes;
			motif!.updateNotesToPlayAtIndex();
		});
	};

	const getRhythmForXValue = (x: number): string[] => {
		if (x >= 0 && x < 0.25) {
			return ["2n", "2n."];
		} else if (x >= 0.25 && x < 0.5) {
			return ["4n", "4n."];
		} else if (x >= 0.5 && x < 0.75) {
			return ["8n", "8n."];
		} else if (x >= 0.75 && x <= 1) {
			return ["16n", "16n"];
		} else {
			throw new Error("Invalid X value");
		}
	};

	const getRandomItem = (array: string[]): string => {
		const randomIndex = Math.floor(Math.random() * array.length);
		return array[randomIndex];
	};

	const setupMotifs = () => {
		/* const rootNotes = ["C3", "D4", "E4", "F#4"]; */

		const firstMotif = new Motif({
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
				"16n",
				"16n",
				"16n",
				"16n",
			],
			noteIndexes: [2, 0, 1, 0, 1, 1, 1, 2, 3, 0, 3, 4, 5],
			transpositions: [0, 0, 1, 0, 1, 1, 1, 2, 3, 0, 3, 4, 5],
			//velocities: [1, 0.5, 0.5, 1, 0.5, 0.5, 1, 1, 1, 1, 1],
		});
		firstMotif.setNoteNames(["C4", "Db4", "D4", "B3", "F#4", "G4"]);

		const secondMotif = new Motif({
			times: ["4n", "4n", "4n", "4n"],
			noteIndexes: [0, 1, 2, 1],
			transpositions: [-0, -1, -6, -7],
			velocities: [1, 0.5, 0.5],
			length: Time("1m").toSeconds() + Time("2n").toSeconds(),
		});
		secondMotif.setNoteNames(["G3", "EB3", "C3"]);

		/*const fourth = new Motif({
			times: ["16n", "16n", "16n", "16n", "2n"],
			noteIndexes: [0, 1, 2, 0],
			transpositions: [0, -1, -6, -7],
			velocities: [1, 1.0, 1.0, 0.5, 0.5],
		});
		fourth.setNoteNames([".", "F5", "A5"]);

		const thirdMotif = new Motif({
			times: ["16t", "16t", "16t", "16n", "8t", "8t", "8t", "16n"],
			noteIndexes: [0, 0, 0, 0, 0, 0, 0, 0],
			transpositions: [0, -10, -9, -7, -5, -3, -2, 0],
			velocities: [1, 0.5, 0.5],
		});
		thirdMotif.setNoteNames(["G5"]); */

		motifs.current.push(firstMotif, secondMotif);
		//motifs.current.push(fourth);
		/* const rootNotes = ["C4", "C5", "G4", "Eb4"];
		const possibleTimes = ["2n", "8n", "4n", "8n."];
		rootNotes.forEach((note) => {
			const noteSeq = new NoteSequence(note);
			//const intervals = [-1, 0, -5, -6, 5, 4];
			const intervals = [-1, -1, -1, -1, -1];
			intervals.forEach((interval) => noteSeq.repeat(interval));
			const notes = noteSeq.sequence;

			const motif = Generator.plainMotifFromNotes(notes);
			const transformedMotifTimes = motif.times.map(() =>
				getRandomItem(possibleTimes)
			);
			motif.times = transformedMotifTimes;

			motifs.current.push(motif);
		}); */

		//motif.setNoteNames(notes);
	};
	useEffect(() => {
		setupMotifs();
	}, []);

	return (
		<div
			onMouseDown={handleMouseDown}
			onMouseUp={handleMouseUp}
			onMouseMove={handleMouseMove}
			style={{ width: "300px", height: "300px", border: "1px solid black" }}
		></div>
	);
};

export default RythmicPatchThree;
