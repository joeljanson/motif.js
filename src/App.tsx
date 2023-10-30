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

function App() {
	useEffect(() => {
		//Transport.bpm.value = 120;
	});
	return (
		<div className="App">
			<header className="App-header">
				{/* <FirstTestPatch></FirstTestPatch> */}
				<XYPadThree></XYPadThree>
				{/* <XYPadTwo></XYPadTwo> */}
				{/* <RythmicPatch></RythmicPatch> */}
				{/* <RythmicPatchTwo></RythmicPatchTwo> */}
				{/* <RythmicPatchThree></RythmicPatchThree> */}
				<LogicController />
			</header>
		</div>
	);
}

export default App;
