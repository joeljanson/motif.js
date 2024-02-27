import { Transport } from "tone";

//import WebMidi from "webmidi";
const { WebMidi } = require("webmidi");

type MidiInfo = {
	notes: Array<number | string>;
	time: number;
	duration: number;
	velocity: number;
	channel?: number;
};

class MidiHandler {
	private static instance: MidiHandler | null = null;
	private _channel: number;
	private _output: number;
	public velocityFactor: number;

	constructor() {
		this._channel = 1;
		this._output = 0;
		this.velocityFactor = 1;
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
		//console.log("midiInfo: ", midiInfo);
		midiInfo.notes.forEach((note: number | string) => {
			if (typeof note === "number") {
				// It's a number representing a note
				if (note === 0) {
					console.log("Note represents a rest.");
				} else {
					const inRangeNote = note < 1 ? 1 : note > 127 ? 127 : note;
					const channel = midiInfo.channel ? midiInfo.channel : this._channel;
					WebMidi.outputs[this._output].channels[channel].playNote(
						inRangeNote,
						{
							time: "+" + midiInfo.time * 1000,
							duration: midiInfo.duration * 900,
							attack: midiInfo.velocity * this.velocityFactor,
						}
					);
				}
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
