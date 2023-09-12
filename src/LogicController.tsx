// GenerateButton.tsx

import React, { useEffect, useRef } from "react";
import MidiHandler from "./midi-handling/MidiHandler";

const LogicController: React.FC = () => {
	const midiHandler = useRef<MidiHandler | null>(null);

	useEffect(() => {
		midiHandler.current = MidiHandler.getInstance();
		const enableMidi = async () => {
			if (midiHandler.current) {
				await midiHandler.current.enableMidi();
			}
		};
		enableMidi();
	}, []); // The empty dependency array [] ensures it only runs once on component mount

	const startPlayback = async () => {
		midiHandler.current?.startPlayback();
	};

	const stopPlayback = async () => {
		midiHandler.current?.stopPlayback();
	};

	const captureMidi = async () => {
		midiHandler.current?.captureMidi();
	};

	const startRecording = async () => {
		midiHandler.current?.startRecording();
	};

	return (
		<div>
			<button onClick={startPlayback}>Start playback</button>
			<button onClick={stopPlayback}>Stop playback</button>
			<button onClick={captureMidi}>Capture midi</button>
			<button onClick={startRecording}>Start recording</button>
		</div>
	);
};

export default LogicController;
