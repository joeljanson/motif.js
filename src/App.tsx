import React from "react";
import { useEffect, useRef } from "react";
import "./App.css";
import GenerateButton from "./GenerateButton";
import Rhythm from "./motif/Rythm";
import { start, Transport } from "tone";
import MidiHandler from "./midi-handling/MidiHandler";
import HoverAreasComponent from "./HoverComponent";
import LogicController from "./LogicController";

function App() {
	const rythm = useRef<Rhythm | null>(null);

	const handleClick = async () => {
		console.log("Button clicked!");
		start();
		const midiHandler = MidiHandler.getInstance();
		const result = await midiHandler.enableMidi();
		midiHandler.output = 0;
		console.log("Midi enabled result:", result);
		//midiHandler.startRecording();

		//const rythm = new Rhythm({ rythmicMotif: [{ time: "4n", noteIndex: 0 }] });
		// const sixEightRadio = ["8n", "8n", "8n", "16n", "16n", "8n", "8n"]; //Lutoslawski
		let ritm = new Rhythm({
			rythm: [
				"2n",
				"2n",
				"2n",
				"2n.",
				"1m",
				"2n.",
				"2n",
				"2n",
				"2n",
				"2n.",
				"1m",
				"2n.",
			],
		});
		// let ritm = new Rhythm({
		// 	rythm: ["2n", "2n.", "2n", "2n", "2n.", "2n.", "1m.", "1m"],
		// });
		let secondRythm = new Rhythm({ rythm: ["1m"] });
		rythm.current = ritm;
		rythm.current.notes = ["Eb2", "Gb3", "F2", "Gb2", "Cb2"];
		secondRythm.notes = ["Eb2", "Gb3", "F2", "Gb2", "Cb2"];
		rythm.current.startRythm(true);
	};

	// Callback function to handle the hovered value
	const handleHover = (value: Array<string>) => {
		// setHoveredValue(value);
		if (rythm.current) {
			rythm.current.notes = value;
			//rythm.current?.shuffleNoteIndexes();
		}
		console.log(value);
	};

	useEffect(() => {
		//const generator = new Generator();
		//generator.generateRythm(4);
		// This code will run when the component mounts (on page refresh) and whenever the dependencies change.
		Transport.bpm.rampTo(120, 1);
	}, []); // The empty dependency array [] ensures it only runs once on component mount
	return (
		<div className="App">
			<header className="App-header">
				<GenerateButton onClick={handleClick} text="Click Me" />
				<HoverAreasComponent
					noteArrays={[
						["Db4", "Cb4", "Bb3"],
						["Gb3", ".", "Gb3", "Ab3"],
						["Gb3", ".", "Gb3", "F3", "Eb3"],
						["Eb3", "Cb3", ".", "Ab2", "Gb2", "F2"],
						["Gb3", "Ab3", "Gb3", "Db3", "Cb3"],
						["Gb3", "Ab3", "F3", "Gb3", "F3"],
						["Db2", "Ab3", "Bb2", "Gb2", "Cb2"],
						["Ab2", "Cb3", "Bb2", "Gb2", "Cb2"],
						["Ab3", "Eb3", "Bb2", "Gb3", "Cb2"],
						[
							"Ab2",
							"Cb3",
							"Eb5",
							"Ab2",
							"Cb3",
							"Eb5",
							"Ab2",
							"Cb3",
							"Bb2",
							"Gb2",
							"Cb2",
						],
					]}
					onHover={handleHover}
				></HoverAreasComponent>
				<LogicController />
			</header>
		</div>
	);
}

export default App;
