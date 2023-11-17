import React, { useEffect } from "react";
import "./App.css";
import LogicController from "./LogicController";
import FirstTestPatch from "./Patches/FirstTestPatch";
import XYPad from "./Patches/XYPad";
import XYPadTwo from "./Patches/XYPadTwo";
import XYPadThree from "./Patches/XYPadThree";
import { Transport } from "tone";
import RythmicPatch from "./Patches/RythmicPatch";
import RythmicPatchTwo from "./Patches/RythmicPatchTwo";
import RythmicPatchThree from "./Patches/RythmicPatchThree";
import XYPadFour from "./Patches/XYPadFour";
import RythmicPatchFour from "./Patches/RythmicPatchFour";
import BerlinProgression from "./Patches/BerlinProgression";

function App() {
	useEffect(() => {
		//Transport.bpm.value = 120;
	});
	return (
		<div className="App">
			<header className="App-header">
				{/* <FirstTestPatch></FirstTestPatch> */}
				{/* <XYPadThree></XYPadThree> */}
				{/* <XYPadFour></XYPadFour> */}
				{/* <XYPadTwo></XYPadTwo> */}
				{/* <RythmicPatch></RythmicPatch> */}
				{/* <RythmicPatchTwo></RythmicPatchTwo> */}
				{/* <RythmicPatchThree></RythmicPatchThree> */}
				{/* <RythmicPatchFour></RythmicPatchFour> */}
				<BerlinProgression />
				<LogicController />
			</header>
		</div>
	);
}

export default App;
