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

const RythmicPatchFour: React.FC = () => {
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
			//motif!.transposition = Math.round(y * 12);
			motif!.setNoteNames(getChordForValue(x));
			motif!.updateNotesToPlayAtIndex();
			console.log(motif?.transposition);
		});
	};

	const getChordForValue = (x: number): string[] => {
		if (x >= 0 && x < 0.25) {
			return ["G5", "Bb5", "D6"];
		} else if (x >= 0.25 && x < 0.5) {
			return ["F5", "A5", "D6"];
		} else if (x >= 0.5 && x < 0.75) {
			return ["G5", "Bb5", "Eb6"];
		} else if (x >= 0.75 && x <= 1) {
			return ["G5", "Bb5", "D6"];
		} else {
			throw new Error("Invalid X value");
		}
	};

	const setupMotifs = () => {
		Transport.bpm.value = 80;
		/* const rootNotes = ["C3", "D4", "E4", "F#4"]; */

		const firstMotif = new Motif({
			times: ["8t", "8t", "8t"],
			noteIndexes: [0, 0, 1, 0, 0, 1],
			octaveShifts: [0, 0, -1, 0, 0, -1],
			length: Time("2n.").toSeconds(),
			midi: { channel: 1 },
		});
		firstMotif.setNoteNames(["F5", "A4"]);

		const secondMotif = new Motif({
			times: ["4n", "8n", "8n", "4n"],
			noteIndexes: [2],
			octaveShifts: [-2],
			midi: { channel: 2 },
		});
		secondMotif.setNoteNames(["G4"]);

		const thirdMotif = new Motif({
			times: ["8t", "8t", "8t"],
			noteIndexes: [2, 0, 1, 2, 0, 1],
			octaveShifts: [0, 0, -1, 0, 0, -1],
			midi: { channel: 3 },
		});
		thirdMotif.setNoteNames(["F5", "A4"]);

		const fourthMotif = new Motif({
			times: ["8t", "8t", "8t"],
			noteIndexes: [1, 2, 0, 1, 2, 0],
			octaveShifts: [0, 0, 0, 0, 0, 0],
			midi: { channel: 4 },
		});
		fourthMotif.setNoteNames(["C5", "E5"]);

		motifs.current.push(firstMotif, secondMotif, thirdMotif, fourthMotif);

		//motifs.current.push(firstMotif, secondMotif, thirdMotif);
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

export default RythmicPatchFour;
