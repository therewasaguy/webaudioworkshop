var ac = new AudioContext();

/* CONVOLVER */
var convolver = ac.createConvolver();
// load the buffer
loadBuffer('audio/concrete-tunnel.mp3', function(audioBuffer) {
  convolver.buffer = audioBuffer;
});


/* SYNTH CLASS */
var Synth = function() {
  var osc, filter, output;

  osc = ac.createOscillator();
  filter = ac.createBiquadFilter();
  output = ac.createGain();

  osc.connect(filter);
  filter.connect(output);
  // output.connect(ac.destination);

  osc.start();
  osc.type = 'sawtooth';
  output.gain.value = 0;

  // attach osc, filter and output to Synth so we can access them later
  this.osc = osc;
  this.filter = filter;
  this.output = output;


  // Play a note
  this.play = function(note, velocity, futureTime) {
    // we'll use futureTime to schedule playback
    if (!futureTime) {
      futureTime = ac.currentTime;
    } else {
      futureTime +=ac.currentTime;
    }


    // set the note and velocity if these parameters are provided
    if (note) {
      // use midiToFreq funciton from helper.js to convert MIDI notes to frequency
      var freq = midiToFreq(note);
      this.osc.frequency.setValueAtTime(freq, futureTime);
    }
    if (!velocity) {
      velocity = 1;
    }

    // envelope for the filters
    this.filter.frequency.cancelScheduledValues(futureTime);
    this.filter.frequency.linearRampToValueAtTime(3500, futureTime + 0.01);
    this.filter.frequency.linearRampToValueAtTime(0, futureTime + 0.8);

    // envelope for the gain
    this.output.gain.cancelScheduledValues(futureTime);
    this.output.gain.linearRampToValueAtTime(velocity, futureTime + 0.01);
    this.output.gain.linearRampToValueAtTime(velocity/2, futureTime + 0.2);
    this.output.gain.linearRampToValueAtTime(0, futureTime + 0.8);
  }
}

// create new Synth, connect it to convolver, connect convolver to output
var mySynth = new Synth();
mySynth.output.connect(convolver);
convolver.connect(ac.destination);

// Play a pattern with a new note every second.
// We'll use MIDI values for notes
// and convert to frequency as part of the .play() method
mySynth.play(60, 1, 0);
mySynth.play(62, 1, 0.5);
mySynth.play(64, 1, 1);
mySynth.play(65, 1, 1.5);
mySynth.play(67, 1, 2);
mySynth.play(69, 1, 2.5);
mySynth.play(71, 1, 3);
mySynth.play(72, 1, 3.5);