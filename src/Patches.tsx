import { BendablePatchProps } from "./Patches/BendablePatch";
import {
	getChromaticScale,
	getRandomValues,
	getRandomizedVoicings,
	getSlidingRange,
	getUniqueRandomValues,
	repeatValues,
} from "./Patches/Utils";

///////// Harmonies -------------------------------*************************
/*
 *
 *
 *
 *
 *
 */

export const initialHarmonyPatches: BendablePatchProps[] = [
	{
		title: "Movement",
		times: getRandomValues(8, [["1m"]], [1.5, 1]),
		noteIndexes: getUniqueRandomValues(8, [0, 1, 2, 3, 4, 5]),
		transpositions: [0], //getUniqueRandomValues(8, [0, 7, -7, -4, 4]),
		harmonizations: [
			[-12, -7, 0, 7, 16, 14],
			[-6, -2, 0, 4, 9, 3],
			[-12, 0, 4, 7],
		],
		rootNotes: ["C4", "G3", "D4", "A4", "E3", "B3"],
		octaveShifts: getSlidingRange(24, 0, -2),
		bpm: 60,
	},
	{
		title: "Stacked fifths",
		times: getRandomValues(8, [["1m"]], [1.5, 1]),
		noteIndexes: getUniqueRandomValues(8, [0, 1, 2, 3, 4]),
		transpositions: [0],
		harmonizations: [[14, 7, 0, -7, -14, -21]],
		rootNotes: ["Eb4", "Ab4", "G4", "B4", "D4"],
		bpm: 120,
	},
	{
		title: "Stacked fourths",
		times: getRandomValues(8, [["1m"]], [1.5, 1]),
		noteIndexes: getUniqueRandomValues(8, [0, 1, 2, 3, 4]),
		transpositions: [0],
		harmonizations: [[10, 5, 0, -5, -10, -15]],
		rootNotes: ["Eb4", "Ab4", "G4", "B4", "D4"],
		bpm: 120,
	},
	{
		title: "Stacked fourths with intermission",
		times: getRandomValues(8, [["2m"]], [1.5, 1]),
		noteIndexes: getUniqueRandomValues(8, [0, 1, 2, 3, 4]),
		transpositions: [0],
		harmonizations: [
			[10, 5, 0, -5, -10, -15],
			[-1, 0, 1],
		],
		rootNotes: ["Eb4", "Ab4", "G4", "B4", "D4"],
		bpm: 120,
	},
	{
		title: "Stacked major/minor thirds with intermission",
		times: getRandomValues(8, [["2m"]], [1.5, 1]),
		noteIndexes: getUniqueRandomValues(8, [0, 1, 2, 3, 4]),
		transpositions: [0],
		harmonizations: [[7, 4, 0, -4, -7, -11], [0]],
		rootNotes: ["Eb4", "Ab4", "G4", "B4", "D4"],
		bpm: 120,
	},
	{
		title: "Stacked major/minor chords with intermission",
		times: getRandomValues(8, [["2m"]], [1.5, 1]),
		noteIndexes: getUniqueRandomValues(8, [0, 1, 2, 3, 4]),
		transpositions: [0],
		harmonizations: [getUniqueRandomValues(8, [-19, -26, 0])],
		rootNotes: ["Eb4", "Ab4", "G4", "B4", "D4"],
		bpm: 120,
	},
];

///////// Movements -------------------------------*************************
/*
 *
 *
 *
 *
 *
 */

const length = 32;
const octaveBend = -0.6;

export const initialMovements: BendablePatchProps[] = [
	{
		title: "Up",
		times: getRandomValues(length + 1, [["16n"]], [1.5, 1]),
		noteIndexes: [0],
		//transpositions: getUniqueRandomValues(8, [0]),
		transpositions: getUniqueRandomValues(8, [
			[0, 1],
			[0, -1, 1],
			[0, -1, -2],
			[0, -1],
			[0, 1, -1],
		]),
		harmonizations: [[0]],
		rootNotes: ["Eb4"],
		octaveShifts: [...getSlidingRange(length + 1, 0, octaveBend)],
		bpm: 120,
	},
	{
		title: "Up in various rythms",
		times: getRandomValues(
			length + 1,
			[
				["16n", "16n", "16n", "16n"],
				["8t", "8t", "8t"],
			],
			[1.5, 1]
		),
		noteIndexes: [0],
		//transpositions: getUniqueRandomValues(8, [0]),
		transpositions: getUniqueRandomValues(8, [
			[0, 1],
			[0, -1, 1],
			[0, -1, -2],
			[0, -1],
			[0, 1, -1],
		]),
		harmonizations: [[0]],
		rootNotes: ["Eb4"],
		octaveShifts: [...getSlidingRange(length + 1, 0, octaveBend)],
		bpm: 120,
	},
	{
		title: "Up and down",
		times: getRandomValues(length + 1, [["16n"]], [1.5, 1]),
		noteIndexes: [0],
		//transpositions: getUniqueRandomValues(8, [0]),
		transpositions: getUniqueRandomValues(8, [
			[0, 1],
			[0, -1, 1],
			[0, -1, -2],
			[0, -1],
			[0, 1, -1],
		]),
		harmonizations: [[0]],
		rootNotes: ["Eb4"],
		octaveShifts: [
			...getSlidingRange(length / 2, 0, octaveBend),
			...getSlidingRange(length / 2 + 1, octaveBend, 0),
		],
		bpm: 120,
	},
];

///////// Melodies -------------------------------*************************
/*
 *
 *
 *
 *
 *
 */

export const initialMelodyPatches: BendablePatchProps[] = [
	// Example initial setup for multiple BendablePatch instances
	{
		title: "Melody #1",
		times: getRandomValues(40, [["16n"], ["16n", "16n"]], [1.5, 1]),
		noteIndexes: [0],
		transpositions: getUniqueRandomValues(8, [
			[0, 1, 2, 3],
			[0, -1, -2, -3],
			[0, -1, -2],
			[0, -1],
			[0, 1, -1],
		]),
		harmonizations: [[0]],
		rootNotes: ["Eb4"],
		bpm: 120,
	},
	{
		title: "Melody #1.2",
		times: getRandomValues(40, [["16n"], ["16n", "16n"]], [1.5, 1]),
		noteIndexes: [0],
		transpositions: getUniqueRandomValues(8, [
			[0, 1],
			[0, -1],
			[0, -1, -2],
			[0, 1, -1],
		]),
		harmonizations: [[0]],
		rootNotes: ["Eb4"],
		bpm: 120,
	},
	{
		title: "Melody #2",
		times: getRandomValues(
			40,
			[["2n"], ["4n", "2n"], ["8n", "8n", "2n"]],
			[1.5, 1]
		),
		noteIndexes: [0],
		transpositions: getUniqueRandomValues(8, [
			[0, 2, 4],
			[0, -3, -6],
			[0, -1, -2],
		]),
		harmonizations: [[0]],
		rootNotes: ["Eb4"],
		bpm: 120,
	},
	{
		title: "Melody #3",
		times: getRandomValues(80, [["16n"]], [1.5, 1]),
		noteIndexes: [0, 1, 2],
		transpositions: getUniqueRandomValues(8, [
			[0, 1, 2, 3],
			[0, 1],
			[0, 1, 2],
		]),
		harmonizations: [[0]],
		octaveShifts: [
			...getSlidingRange(40, 0, -1.25),
			...getSlidingRange(40, -1.25, 0),
		],
		rootNotes: getChromaticScale(),
		bpm: 120,
	},
	{
		title: "Melody #4",
		times: getRandomValues(80, [["2n", "2n", "2n", "2n", "1m"]], [1.5, 1]),
		noteIndexes: getUniqueRandomValues(
			80,
			[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
		),
		transpositions: getUniqueRandomValues(8, [0]),
		harmonizations: [[0]],
		octaveShifts: [0],
		rootNotes: getChromaticScale(),
		bpm: 50,
	},
	{
		title: "Cello melody",
		times: [
			...repeatValues(6, ["2n"]),
			...["4n.r"],
			...repeatValues(10, ["4n"]),
			...repeatValues(9, ["2n"]),
			...["4n", "4n"],
			...["2nr", "2nr"],
			...repeatValues(12, ["4n"]),
			...["2n", "2n"],
			...["2m"],
		],
		noteIndexes: [
			0, 1, 2, 3, 4, 1, -1, 5, 6, 1, 5, 6, 1, 3, 4, 1, 1, 2, 3, 4, 1, 2, 3, 7,
			2, 4, 3, 8, -1, -1, 5, 6, 1, 5, 4, 1, 3, 4, 9, 8, 2, 3, 4, 0,
		],
		transpositions: [0],
		harmonizations: [
			[0, 7],
			[0, 8],
			[0, 4, 7],
		],
		octaveShifts: [
			0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0,
			0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
		],
		rootNotes: ["Eb2", "C2", "G2", "Ab2", "Bb2", "D3", "Eb3", "F2", "A2", "B2"],
		tonalkey: ["Eb2", "C2", "G2", "Ab2", "Bb2", "D3", "Eb3", "F2", "A2", "B2"],
		bpm: 56,
	},
	{
		title: "Random melody",
		times: [
			...repeatValues(2, ["2n"]),
			...["8n", "2n", "4n.r"],
			...["8n", "4n.", "8n", "4n."],
			...["4n", "4n", "8n", "4n."],
			...["4n.", "8n", "2n"],
		],
		noteIndexes: getUniqueRandomValues(40, [
			[0, 1],
			[2, 3],
			[3, 4, 5],
			[5, 6],
		]),
		transpositions: [0],
		harmonizations: [[0]],
		octaveShifts: [0],
		rootNotes: ["Eb2", "C2", "G2", "Ab2", "Bb2", "D3", "Eb3", "F2", "A2", "B2"],
		tonalkey: ["Eb2", "C2", "G2", "Ab2", "Bb2", "D3", "Eb3", "F2", "A2", "B2"],
		bpm: 56,
	},
	// Add more instances as needed
];

///////// Textures -------------------------------*************************
/*
 *
 *
 *
 *
 *
 */

export const initialTexturePatches: BendablePatchProps[] = [
	{
		title: "Moving around Eb4 in 16s",
		times: getRandomValues(length + 1, [["16n"]], [1.5, 1]),
		noteIndexes: [0],
		//transpositions: getUniqueRandomValues(8, [0]),
		transpositions: getUniqueRandomValues(8, [
			[0, 1],
			[0, -1, 1],
			[0, -1, -2],
			[0, -1],
			[0, 1, -1],
		]),
		harmonizations: [[0]],
		rootNotes: ["Eb4"],
		octaveShifts: repeatValues(17, [0]),
		bpm: 120,
	},
	{
		title: "Texture #1",
		times: getUniqueRandomValues(8, [
			["2n", "4n", "4n"],
			["2n", "2n"],
			["4nr"],
			["2nr"],
		]),
		noteIndexes: getUniqueRandomValues(8, [
			[0, 0, 0],
			[1, 1, 1],
			[2, 2, 2],
			[3, 3, 3],
		]),
		transpositions: getUniqueRandomValues(8, [[4, -1, 0]]),
		harmonizations: [
			[0, 7, 4, -11],
			[0, 4, -5, -7],
			[0, 4, -3, -8],
			[0, -6, -2, 9],
		],
		rootNotes: ["Eb4", "C4", "G4", "F#3"],
		bpm: 120,
	},
	{
		title: "Texture #3",
		times: getRandomValues(
			40,
			[["2nr"], ["16n", "16n", "4n", "4nr"], ["2nr"], ["4nr"]],
			[1.5, 1]
		),
		noteIndexes: [0],
		transpositions: getUniqueRandomValues(8, [
			[7, 3, 0],
			[7, -2, 0],
			[-4, -2, 0],
		]),
		harmonizations: [[0]],
		rootNotes: ["Eb5"],
		bpm: 120,
	},
];

///////// Irregular meters -------------------------------*************************
/*
 *
 *
 *
 *
 *
 */

export const initialIrregularRythms: BendablePatchProps[] = [
	{
		title: "5/8",
		times: repeatValues(4, ["8n", "8n", "8n", "8n", "8n"]),
		noteIndexes: [0],
		transpositions: getUniqueRandomValues(12, [0, 0]),
		harmonizations: [[0]],
		velocities: [1, 0.85, 0.85, 1, 0.8],
		octaveShifts: getSlidingRange(7, 0, -1),
		rootNotes: ["G3"],
		bpm: 108,
	},
];

///////// OTHER -------------------------------*************************
/*
 *
 *
 *
 *
 *
 */

export const initialotherPatches: BendablePatchProps[] = [
	{
		title: "String arpeggio up",
		times: repeatValues(4, ["16n", "16n", "16n", "2n"]),
		noteIndexes: getUniqueRandomValues(8, [
			[0, 0, 0, 0],
			[1, 1, 1, 1],
		]),
		transpositions: [0, 7, 16, 24],
		harmonizations: [[0]],
		rootNotes: ["G3", "D4"],
		bpm: 120,
	},
	{
		title: "Tremolo",
		times: getUniqueRandomValues(32, [["8n"]]),
		noteIndexes: getUniqueRandomValues(8, [
			[0, 0, 0, 0],
			[1, 1, 1, 1],
			[2, 2, 2, 2],
			[3, 3, 3, 3],
		]),
		transpositions: [0, 1],
		harmonizations: [[0]],
		rootNotes: ["Eb4", "C4", "G4", "F#3"],
		bpm: 120,
	},
	{
		title: "Backbeat",
		times: getUniqueRandomValues(32, [["8nr", "8n"]]),
		noteIndexes: getUniqueRandomValues(8, [
			[0, 0, 0, 0],
			[1, 1, 1, 1],
			[2, 2, 2, 2],
			[3, 3, 3, 3],
		]),
		transpositions: [0, 1, 2, 3],
		harmonizations: [[0]],
		rootNotes: ["C4", "Db4", "D4", "Eb4", "C4", "G4", "F#3"],
		bpm: 120,
	},
	{
		title: "Simple 2n",
		times: getUniqueRandomValues(32, [["2n", "2nr"]]),
		noteIndexes: getUniqueRandomValues(8, [
			[0, 0, 0, 0],
			[1, 1, 1, 1],
			[2, 2, 2, 2],
			[3, 3, 3, 3],
		]),
		transpositions: [0, 1, 2, 3],
		harmonizations: [[-12, -24]],
		rootNotes: ["C4", "Db4", "D4", "Eb4", "C4", "G4", "F#3"],
		bpm: 120,
	},
];
