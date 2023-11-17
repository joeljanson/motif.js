import React, { useEffect } from "react";
import Motif from "../motif/Motif";
import { Transport } from "tone";
import { getRandomValues, interpolateWeights } from "./Utils";

const BerlinProgression: React.FC = () => {
	useEffect(() => {
		Transport.bpm.value = 10;
	});

	const handleClick = () => {
		const motif = new Motif({
			times: getRandomValues(5, ["4n", "1m"], [1, 0.1]),
		});
		motif.setNoteNames(["C4", "D4", "E4", "F4", "G4", "A4", "B4"]);
		motif.loop = false;
		motif.noteIndexes = getRandomValues(24, [0, 1, 2, 3, 4, 5, 6, 7], [1, 0.5]);
		motif.octaveShifts = interpolateWeights([0, -2], 6);
		//motif.octaveShifts = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7];
		motif.harmonizations = [
			[-12, 0, 2 - 12, 4, 7 - 12, 11],
			[-12, 0, 3 - 12, 6, 7 - 12, 10],
			[-12, 0, 3 - 12, 6, 8 - 12, 11],
		];
		motif.start();
		console.log(motif);
	};

	return (
		<div>
			<button onClick={handleClick}>Create Motif</button>
		</div>
	);
};

export default BerlinProgression;
