function playNotes(
	notes = [],
	eventId = undefined,
	duration = 100,
	time = 0,
	channel = 1,
	velocity = 64
) {
	if (typeof notes === "object") {
		({ notes, time, channel, eventId, duration, velocity } = notes);
		if (channel === undefined) {
			channel = 1;
		}
		if (typeof notes !== "array") {
			notes = [notes];
		}
	}
	velocity = velocity > 1 ? map(velocity, 0, 127, 0, 1, true) : velocity;
	console.log(`Play notes - Note: ${notes}`);
	if (eventId === undefined && duration === undefined) {
		console.warn(
			"Remember to provide an eventID or a duration so that the right keys will be released later on."
		);
		return;
	} else if (duration !== undefined) {
		notes.forEach((note) => {
			/*console.log(
				`Play notes - Note: ${note}, Duration: ${duration}, Time: ${time}, Channel:${channel}`
			);*/
			if (note !== ".") {
				const inRangeNote = (note < 1 ? 1 : note) > 127 ? 127 : note;
				WebMidi.outputs[0].channels[channel].playNote(inRangeNote, {
					time: "+" + time * 1000,
					duration: duration * 1000,
					attack: velocity,
				});
			} else {
				console.log("Note represents a rest.");
			}
		});
	} else {
		notes.forEach((note, index) => {
			console.log(
				`Play notes without duration - Note: ${note}, Duration: ${duration}, Time: ${time}, Channel:${channel}, Velocity:${velocity}`
			);
			WebMidi.outputs[0].channels[channel].playNote(note, {
				time: "+" + index * 1,
				attack: velocity,
			});
		});
		notesToBeReleased.set(eventId, { notes: notes, channel: channel });
	}
}

function stopNotes(eventId) {
	const event = notesToBeReleased.get(eventId);
	console.log(event);
	if (event) {
		event.notes.forEach((note, index) => {
			WebMidi.outputs[0].channels[event.channel].stopNote(note, {
				time: "+" + index * 5,
			});
		});
		notesToBeReleased.delete(eventId);
	}
}
