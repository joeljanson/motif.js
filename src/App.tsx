import React, { useEffect, useState } from "react";
import "./App.css";
import LogicController from "./LogicController";
import {
	getRandomValues,
	getSlidingRange,
	getUniqueRandomValues,
	repeatValues,
} from "./Patches/Utils";
import BendablePatch, { BendablePatchProps } from "./Patches/BendablePatch";
import TranspositionsOverride from "./TranspositionsOverride";
import RootNotesOverride from "./RootNotesOverride";
import RythmsOverride from "./RythmsOverride";
import {
	initialHarmonyPatches,
	initialMelodyPatches,
	initialTexturePatches,
	initialotherPatches,
} from "./Patches";

interface OverrideState {
	bpm: { isActive: boolean; value: number };
	rootNotes: { isActive: boolean; value: string[] };
	times: { isActive: boolean; value: string[] };
	noteIndexes: { isActive: boolean; value: number[] };
	transpositions: { isActive: boolean; value: number[] };
	harmonizations: { isActive: boolean; value: number[][] };
}

export interface PatchCategories {
	title: string;
	patches: BendablePatchProps[];
}

const patchCategories: PatchCategories[] = [
	{
		title: "Harmonies",
		patches: initialHarmonyPatches,
	},
	{
		title: "Melodies",
		patches: initialMelodyPatches,
	},
	{
		title: "Textures",
		patches: initialTexturePatches,
	},
	{
		title: "Other",
		patches: initialotherPatches,
	},
];

function App() {
	/* const [bendablePatches, setBendablePatches] =
		useState<BendablePatchProps[]>(initialPatches); */
	const [rootNotesOverride, setRootNotesOverride] = useState<{
		isActive: boolean;
		value: string[];
	}>({ isActive: false, value: [] });
	const [transpositionsOverride, setTranspositionsOverride] = useState<{
		isActive: boolean;
		value: string[];
	}>({ isActive: false, value: [] });
	const [rythmsOverride, setRythmsOverride] = useState<{
		isActive: boolean;
		value: string[];
	}>({ isActive: false, value: [] });

	return (
		<div className="App">
			<header className="App-header">
				<div className="override-controls">
					<RootNotesOverride
						isActive={rootNotesOverride.isActive}
						value={rootNotesOverride.value}
						label="Override Root Notes"
						setActive={(isActive) =>
							setRootNotesOverride((prev) => ({ ...prev, isActive }))
						}
						setValue={(value) =>
							setRootNotesOverride((prev) => ({
								...prev,
								value: value,
							}))
						}
					/>
					<TranspositionsOverride
						isActive={transpositionsOverride.isActive}
						value={transpositionsOverride.value}
						label="Override transpositions"
						setActive={(isActive) =>
							setTranspositionsOverride((prev) => ({ ...prev, isActive }))
						}
						setValue={(value) =>
							setTranspositionsOverride((prev) => ({
								...prev,
								value: value,
							}))
						}
					/>
					<RythmsOverride
						isActive={rythmsOverride.isActive}
						value={rythmsOverride.value}
						label="Override rythms"
						setActive={(isActive) =>
							setRythmsOverride((prev) => ({ ...prev, isActive }))
						}
						setValue={(value) =>
							setRythmsOverride((prev) => ({
								...prev,
								value: value,
							}))
						}
					/>
				</div>
				<div className="patch-buttons">
					{patchCategories.map((category, index) => (
						<div className="category">
							<div>{category.title}</div>
							{category.patches.map((patch, index) => (
								<BendablePatch
									key={index}
									title={patch.title}
									times={
										rythmsOverride.isActive ? rythmsOverride.value : patch.times
									}
									noteIndexes={patch.noteIndexes}
									octaveShifts={patch.octaveShifts}
									transpositions={
										transpositionsOverride.isActive
											? transpositionsOverride.value
													.map((item) => parseFloat(item.trim()))
													.filter((item) => !isNaN(item))
											: patch.transpositions
									}
									harmonizations={patch.harmonizations}
									rootNotes={
										rootNotesOverride.isActive
											? rootNotesOverride.value
											: patch.rootNotes
									}
									bpm={patch.bpm}
									// Optionally, pass updatePatchProperty as a prop if you want to allow BendablePatch itself to update its properties
								/>
							))}
						</div>
					))}
					{/* {bendablePatches.map((patch, index) => (
						<BendablePatch
							key={index}
							title={patch.title}
							times={
								rythmsOverride.isActive ? rythmsOverride.value : patch.times
							}
							noteIndexes={patch.noteIndexes}
							octaveShifts={patch.octaveShifts}
							transpositions={
								transpositionsOverride.isActive
									? transpositionsOverride.value
											.map((item) => parseFloat(item.trim()))
											.filter((item) => !isNaN(item))
									: patch.transpositions
							}
							harmonizations={patch.harmonizations}
							rootNotes={
								rootNotesOverride.isActive
									? rootNotesOverride.value
									: patch.rootNotes
							}
							bpm={patch.bpm}
							// Optionally, pass updatePatchProperty as a prop if you want to allow BendablePatch itself to update its properties
						/>
					))} */}
				</div>
				<h1>Logic controls</h1>
				<LogicController />
			</header>
		</div>
	);
}

export default App;
