import React, { useEffect } from "react";
import Motif from "../motif/Motif";
import { Transport } from "tone";
import { getRandomValues, interpolateWeights } from "./Utils";

const Ebm: React.FC = () => {
	useEffect(() => {
		Transport.bpm.value = 30;
	});

	const handleClick = () => {
		//motif.octaveShifts = interpolateWeights([0, -2], 6);
		//motif.octaveShifts = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7];
		const motifOne = createMotif(["Eb4", "Gb4", "Bb4", "Db5"], 1);
		const motifTwo = createMotif(["Eb4", "Gb4", "Bb4", "Db5"], 2);
		const motifThree = createMotif(["Eb3", "Gb3", "Bb3", "Db4"], 3);
		const motifFour = createMotif(["Eb2", "Gb2", "Bb2", "Db3"], 4);
		motifOne.start();
		motifTwo.start();
		motifThree.start();
		motifFour.start();
	};

	const createMotif = (notes: string[], channel: number) => {
		const motif = new Motif({
			times: getRandomValues(25, ["4n", "8n", "2n", "1m"], [1, 0.1]),
			midi: { channel: channel },
		});
		const concatNotes = [...notes, ".", ".", "."];
		console.log(concatNotes);
		motif.setNoteNames(getRandomValues(24, concatNotes, [0.75, 1]));
		motif.transposition = 14;
		motif.loop = false;
		//motif.octaveShifts = getRandomValues(24, [0, 1, 2], [1, 0.5]);
		/* motif.octaveShifts = [
			0, 0, -0.1, -0.15, -0.2, -0.25, -0.3, -0.35, -0.4, -0.45, -0.5, -0.55,
			-0.6, -0.65, -0.7,
		]; */
		motif.noteIndexes = getRandomValues(24, [0, 1, 2], [1, 0.5]);
		return motif;
	};

	return (
		<div>
			<button onClick={handleClick}>Create Motif</button>
		</div>
	);
};

export default Ebm;
