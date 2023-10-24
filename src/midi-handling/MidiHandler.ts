import { Transport } from "tone";

//import WebMidi from "webmidi";
const { WebMidi } = require("webmidi");

type MidiInfo = {
	notes: Array<number | string>;
	time: number;
	duration: number;
	velocity: number;
};

class MidiHandler {
	private static instance: MidiHandler | null = null;
	private _channel: number;
	private _output: number;

	constructor() {
		this._channel = 1;
		this._output = 0;
	}
	public async enableMidi(): Promise<string> {
		try {
			await WebMidi.enable();
			console.log("WebMidi enabled!");
			return "WebMidi enabled!";
		} catch (err) {
			console.error(err);
			return "There was an error enabling webmidi";
		}
	}

	set output(output: number) {
		this._output = output;
	}

	set channel(channel: number) {
		this._channel = channel;
	}

	public playNotes(midiInfo: MidiInfo) {
		midiInfo.notes.forEach((note: number | string) => {
			if (typeof note === "number") {
				// It's a number representing a note
				const inRangeNote = note < 1 ? 1 : note > 127 ? 127 : note;
				WebMidi.outputs[this._output].channels[1].playNote(inRangeNote, {
					time: "+" + midiInfo.time * 1000,
					duration: midiInfo.duration * 990,
					attack: midiInfo.velocity,
				});
			} else if (typeof note === "string" && note === ".") {
				// It's a string representing a rest
				console.log("Note represents a rest.");
			} else {
				// Handle other cases if needed
			}
		});
	}

	public startPlayback() {
		// WebMidi.outputs[this._output].send([0x90, 0x45, 0x7f]); // MIDI note-on message
		WebMidi.outputs[0].channels[1].sendControlChange(16, 126);
	}

	public stopPlayback() {
		// WebMidi.outputs[this._output].send([0x90, 0x45, 0x7f]); // MIDI note-on message
		WebMidi.outputs[0].channels[1].sendControlChange(16, 123);
	}

	public startRecording() {
		// WebMidi.outputs[this._output].send([0x90, 0x45, 0x7f]); // MIDI note-on message
		WebMidi.outputs[0].channels[1].sendControlChange(16, 121);
	}

	public captureMidi() {
		// WebMidi.outputs[this._output].send([0x90, 0x45, 0x7f]); // MIDI note-on message
		WebMidi.outputs[0].channels[1].sendControlChange(16, 122);
	}

	public static getInstance(): MidiHandler {
		if (!MidiHandler.instance) {
			MidiHandler.instance = new MidiHandler();
		}
		return MidiHandler.instance;
	}
}

export default MidiHandler;
