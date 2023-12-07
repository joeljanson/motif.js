import React from "react";
import { useEffect, useRef } from "react";
import "../App.css";
import { Transport, start } from "tone";
import MidiHandler from "../midi-handling/MidiHandler";
import HoverAreasComponent from "../HoverComponent";
import LogicController from "../LogicController";
import Motif from "../motif/Motif";
import Generator from "../motif/Generator";
import Phrase from "../motif/Phrase";
import NoteSequence, {
	getChordsFromScale,
	getMajorScale,
	quantizeNotesToScale,
} from "../motif/TonalHelper";
import { Scale } from "tonal";

function FirstTestPatch() {
	const motif = useRef<Motif | null>(null);
	const motifs = useRef<Array<Motif | null>>([]);
	const phrase = useRef<Phrase | null>(null);

	const handleClick = async () => {
		console.log("Button clicked!");
		start();
		const midiHandler = MidiHandler.getInstance();
		const result = await midiHandler.enableMidi();
		midiHandler.output = 0;
		console.log("Midi enabled result:", result);

		const noteSeq = new NoteSequence("C4");
		const noteSeqTwo = new NoteSequence("C4");
		const intervals = [-1, -2, -4, -4]; //[6, 3, -1, 1, 1, 1, 1, 5, 5, -12, -12, -12, -12];
		const intervalsTwo = [1, 2, 3, 2, 5, 6, 7]; //[1, 2, -1, 1, 1, 1, 1, 5, 5, -12, -7, 7, 7];
		//intervals.map(noteSeq.repeat);
		intervals.forEach((interval) => noteSeq.repeat(interval));
		intervalsTwo.forEach((interval) => noteSeqTwo.repeat(interval));
		//noteSeq.addUpwardsShape(5, 10);

		console.log("Noteseq two notes: ", noteSeqTwo.sequence);

		const notes = noteSeq.sequence;
		console.log(Scale.names());
		const scale = "C messiaen's mode #3";
		//const scale = "Bb major";
		const quantizedNotes = quantizeNotesToScale(notes, scale);
		console.log("Quantized notes are: ", quantizedNotes); // Output should be: [ 'C', 'G', 'A', 'A', 'C', 'D' ]
		const thirdMotif = Generator.plainMotifFromNotes(quantizedNotes);
		const secondMotif = Generator.plainMotifFromNotes(quantizedNotes);
		const newMotif = Generator.plainMotifFromNotes(noteSeqTwo.sequence);

		secondMotif.transposition = 12;
		newMotif.transposition = 7;

		//newMotif.transposition = -12;

		newMotif.setKeyWithStrings(
			Scale.get(scale).notes.map((note) => note + "4")
		);
		secondMotif.setKeyWithStrings(
			Scale.get(scale).notes.map((note) => note + "4")
		);
		thirdMotif.setKeyWithStrings(
			Scale.get(scale).notes.map((note) => note + "4")
		);
		//intMotif.setKeyWithStrings(["C", "D", "E", "F", "G", "A", "B"]);
		//intMotif.setKeyWithStrings(["Ab"]);
		newMotif.setNoteNames(quantizedNotes);
		thirdMotif.setNoteNames(noteSeqTwo.sequence);
		secondMotif.setNoteNames(quantizedNotes);

		//secondMotif.position = 0.5;
		//thirdMotif.position = 0.25;

		secondMotif.start();
		//newMotif.start();
		thirdMotif.start();
		Transport.start();

		console.log("newMotif rythms: ", newMotif);
		console.log("thirdMotif rythms: ", thirdMotif);
		console.log("secondMotif rythms: ", secondMotif);

		motifs.current.push(newMotif);
		motifs.current.push(secondMotif);
		motifs.current.push(thirdMotif);
		//frase.startPhrase(true);
		//phrase.current = frase;
	};

	// Callback function to handle the hovered value
	const handleHover = (value: Array<string>) => {
		// setHoveredValue(value);
		if (phrase.current) {
			//phrase.current.setNotesFromNoteNames(value);
		}
		if (motifs.current) {
			console.log(motifs.current);
			motifs.current.forEach((motif) => {
				motif?.reverse();
				motif?.setNoteNames(value);
				console.log("Notes to play at index!", motif?.notesToPlayAtIndex);
			});
			//motif.current.notes.reverse();
			// const newMotif = Generator.getMotifFromStore();
			// motif.current.noteIndexes = newMotif.noteIndexes;
			// motif.current.transpositions = newMotif.transpositions;
			// motif.current.times = newMotif.times;
			// motif.current.octaveShifts = newMotif.octaveShifts;

			//motif.current.transposition = [0, -1, -2, 0, 0, 0, 0, 0, 0];
			//rythm.current?.shuffleNoteIndexes();
		}
		console.log(value);
	};

	useEffect(() => {
		const noteSeq = new NoteSequence("C4");
		//const intervals = [-4, 3, -1, 1, 1, 1, 1, 5, 5, -12, -12, -12, -12];
		//intervals.map(noteSeq.repeat);
		//intervals.forEach((interval) => noteSeq.repeat(interval));
		noteSeq.addUpwardsShape(5, 4);

		console.log(noteSeq.sequence);

		const notes = noteSeq.sequence;
		const scale = "C pentatonic";
		const quantizedNotes = quantizeNotesToScale(notes, scale);
		console.log("Quantized notes are: ", quantizedNotes); // Output should be: [ 'C', 'G', 'A', 'A', 'C', 'D' ]
		//console.log(Generator.generateSmallForm(["A", "B", "A"], "1m"));
		//console.log(Generator.plainMotifFromNotes(["C4", "E4", "G4"]));
		// This code will run when the component mounts (on page refresh) and whenever the dependencies change.
		Transport.bpm.value = 60;
	}, []); // The empty dependency array [] ensures it only runs once on component mount

	const majorScaleChords = getChordsFromScale(getMajorScale("G")).map(
		(chord: any) => chord.notes
	);

	const chords = [
		["G3", "Bb3", "D4", "F4"],
		["D3", "F3", "A3", "C#4"],
		["Bb3", "Eb4", "G4"],
		["D3", "F3", "A3"],
		["D3", "F#3", "A3"],
		["Eb3", "G3", "Bb3"],
		["C3", "Eb3", "G3"],
	];
	return (
		<div className="first-test-patch">
			<button onClick={handleClick}>Click me</button>
			<HoverAreasComponent
				noteArrays={chords}
				onHover={handleHover}
			></HoverAreasComponent>
		</div>
	);
}

export default FirstTestPatch;
