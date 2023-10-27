import React, { useEffect } from "react";
import "./App.css";
import LogicController from "./LogicController";
import FirstTestPatch from "./Patches/FirstTestPatch";
import XYPad from "./Patches/XYPad";
import XYPadTwo from "./Patches/XYPadTwo";
import { Transport } from "tone";
import RythmicPatch from "./Patches/RythmicPatch";

function App() {
	useEffect(() => {
		Transport.bpm.value = 60;
	});
	return (
		<div className="App">
			<header className="App-header">
				{/* <FirstTestPatch></FirstTestPatch> */}
				{/* <XYPadTwo></XYPadTwo> */}
				<RythmicPatch></RythmicPatch>
				<LogicController />
			</header>
		</div>
	);
}

export default App;
