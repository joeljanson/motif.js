# About motif:

So I have this class called "Motif". This class has these options in its constructor.
Times = an array of rythmical values based on Tone.js Time class, this is Tone.js definition:
'Represents a subdivision of a measure.
The number represents the subdivision. "t" represents a triplet. A "." add a half.
e.g. "4n" is a quarter note, "4t" is a quarter note triplet, and "4n." is a dotted quarter note.
export type Subdivision = "1m" | "1n" | "1n." | "2n" | "2n." | "2t" | "4n" | "4n." | "4t" | "8n" | "8n." | "8t" |
"16n" | "16n." | "16t" | "32n" | "32n." | "32t" | "64n" | "64n." | "64t" | "128n" | "128n." | "128t" |
"256n" | "256n." | "256t" | "0";'

So basically an array of four "16n" would equal one bar, three "8t" would also equal a bar and so on.

noteIndexes is an array containing integers that point to a value of the notes array, so if the notes array is
[C4, E4, G4] then noteIndex 0 would point to C4, 1 to E4 and 2 to G4. Thus decoupling a musical motif with it's notes
giving this class flexibility to change notes but keeping its structure.

transpositions is an array that transposes this note at a later stage so if noteIndex is 0 and transposition is -1 we would get the note B3
unless there is a key for the class and B is not a part of the key.

Octaveshifts is an array that switches the octave for the current noteindex, so again if noteindex is 0, we get the note C4 and if octaveshifts for
that index is 1 it would be transposed up one octave to C5.

harmonizations is an array containing voicings for chords so again, if noteIndex is 0 and harmonizations is [[0,4,7]] we would get a C major chord.

Velocities is a value between 0 and 1, represents the velocity.

MotifOptions = {
times: Array<number | string>;
noteIndexes: Array<number>;
transpositions: Array<number>;
octaveShifts: Array<number>;
harmonizations: Array<Array<number>>;
velocities: Array<number>;
notesToPlayAtIndex: Array<Array<number>>;
length: number | undefined;
notes?: Notes;
midi?: {
channel: number;
};
};

With this in mind could you create four one bar motifs? No need to stick with C E G, add more notes and indexes and please just reply with the code like this:
const motif = new Motif({
times: //Times array,
noteIndexes: //Note index aray,
transpositions: //transposition,
//... and so on
});
