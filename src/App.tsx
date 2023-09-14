import React from "react";
import { useEffect, useRef } from "react";
import "./App.css";
import Rhythm from "./midi-js-files/Rythm";
import { Transport, start } from "tone";
import MidiHandler from "./midi-handling/MidiHandler";
import HoverAreasComponent from "./HoverComponent";
import LogicController from "./LogicController";
import Motif from "./motif/Motif";
import Generator from "./motif/Generator";

function App() {
	const motif = useRef<Motif | null>(null);

	const handleClick = async () => {
		console.log("Button clicked!");
		start();
		const midiHandler = MidiHandler.getInstance();
		const result = await midiHandler.enableMidi();
		midiHandler.output = 0;
		console.log("Midi enabled result:", result);

		const intMotif = new Motif({
			time: ["8n", "8n", "8n", "8n", "8n", "8n"],
			//time: Generator.fill("4n", 3),
			duration: [0, 0, 0, 0, 0, 0],
			noteIndex: [1, 1, 1, 2, 2, 0],
			transposition: [0, -1, 0, 0, 1, 0],
			octaveShift: [1, 1, 1, 0, 0, 0],
		});

		intMotif.setKeyWithStrings(["Eb", "F", "G", "A", "Bb", "C", "D"]);
		console.log("The motifs key is: ", intMotif.key);

		//motif.updateTransposition();
		intMotif.notes.notenames = ["G4", "C5", "D5"];
		//motif.notes.reverse();
		console.log("The motif as a part is: ", intMotif.motif);
		intMotif.startRythm(true);
		motif.current = intMotif;

		//midiHandler.startRecording();

		//const rythm = new Rhythm({ rythmicMotif: [{ time: "4n", noteIndex: 0 }] });
		// const sixEightRadio = ["8n", "8n", "8n", "16n", "16n", "8n", "8n"]; //Lutoslawski
		// let ritm = new Rhythm({
		// 	rythm: [
		// 		"2n",
		// 		"2n",
		// 		"2n",
		// 		"2n.",
		// 		"1m",
		// 		"2n.",
		// 		"2n",
		// 		"2n",
		// 		"2n",
		// 		"2n.",
		// 		"1m",
		// 		"2n.",
		// 	],
		// });
		// let ritm = new Rhythm({
		// 	rythm: [
		// 		"8n",
		// 		"8n",
		// 		"8n",
		// 		"8n",
		// 		"8n",
		// 		"8n",
		// 		"4n",
		// 		"4n",
		// 		"4n",
		// 		"8n",
		// 		"8n",
		// 		"8n",
		// 		"8n",
		// 		"8n",
		// 		"8n",
		// 		"8n",
		// 		"8n",
		// 		"8n",
		// 		"8n",
		// 		"8n",
		// 		"8n",
		// 	],
		// });

		// /*
		// *
		// * Vad är denna minuett från Bach? Jo första takten är
		// Ackord: Gm [G, Bb, D]
		// Rytm: 8n 8n 8n 8n 8n 8n
		// Noteindex: 1, 1, 1, 2, 2, 0
		// Transposition: 0, -1, 0, 0, 1, 0
		// Voicing ?? -> kanske inte applicerbart?
		// *
		// */

		// rythm.current = ritm;
		// rythm.current.notes = [
		// 	"Bb3",
		// 	"A3",
		// 	"Bb3",
		// 	"D3",
		// 	"Eb3",
		// 	"G2",
		// 	"F2",
		// 	"A3",
		// 	"D3",
		// ];

		// rythm.current.startRythm(true);
	};

	// Callback function to handle the hovered value
	const handleHover = (value: Array<string>) => {
		// setHoveredValue(value);
		if (motif.current) {
			motif.current.notes.notenames = value;
			//motif.current.transposition = [0, -1, -2, 0, 0, 0, 0, 0, 0];
			//rythm.current?.shuffleNoteIndexes();
		}
		console.log(value);
	};

	useEffect(() => {
		// This code will run when the component mounts (on page refresh) and whenever the dependencies change.
		Transport.bpm.rampTo(100, 0.1);
	}, []); // The empty dependency array [] ensures it only runs once on component mount
	return (
		<div className="App">
			<header className="App-header">
				<button onClick={handleClick}>Click me</button>
				<HoverAreasComponent
					noteArrays={[
						["G4", "Bb4", "D5"],
						["D4", "F4", "A4"],
						["D#3", "F4", "A4", "Bb4"],
						["Eb3", "G4", "Bb4"],
						["C3", "A4", "F4"],
						// ["Db4", "Cb4", "Bb3"],
						// ["Cb4", "Ab3", "Eb3", "F3", "Gb3", "A3", "Ab3"],
						// ["Cb4", "Bb3", "Gb3"],
						// // ["Gb3", ".", "Gb3", "Ab3"],
						// // ["Gb3", ".", "Gb3", "F3", "Eb3"],
						// // ["Eb3", "Cb3", ".", "Ab2", "Gb2", "F2"],
						// ["Gb3", "Ab3", "Gb3", "Db3", "Cb3"],
						// // ["Gb3", "Ab3", "F3", "Gb3", "F3"],
						// ["Db2", "Ab3", "Bb2", "Gb2", "Cb2"],
						// ["Ab2", "Cb3", "Bb2", "Gb2", "Cb2"],
						// ["Ab3", "Eb3", "Bb2", "Gb3", "Cb2"],
						// ["Ab2", "Cb3", "Eb5", "Ab2", "Cb3"],
					]}
					onHover={handleHover}
				></HoverAreasComponent>
				<LogicController />
			</header>
		</div>
	);
}

export default App;
