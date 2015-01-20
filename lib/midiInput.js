/* MIDI */
// via http://webaudio.github.io/web-midi-api
var midiAccess;

navigator.requestMIDIAccess().then(midiSuccess, midiError);

function midiSuccess(midiAccess) {
  var haveAtLeastOneDevice=false;
  var inputs=midiAccess.inputs.values();
  for ( var input = inputs.next(); input && !input.done; input = inputs.next()) {
    input.value.onmidimessage = MIDIMessageEventHandler;
    // console.log(input.value);
    haveAtLeastOneDevice = true;
  }
  if (!haveAtLeastOneDevice)
    midiError();
}

function midiError() {
  console.log('no midi, sorry!');
}

function MIDIMessageEventHandler(event) {
  // Mask off the lower nibble (MIDI channel, which we don't care about)
  switch (event.data[0] & 0xf0) {
    case 0x90:
      if (event.data[2]!=0) {  // if velocity != 0, this is a note-on message
        var velocity = map(event.data[2], 0, 127, 0, 1)
        synth.play(event.data[1], velocity);
        return;
      }
      // if velocity == 0, fall thru: it's a note-off.  MIDI's weird, y'all.
    case 0x80:
      // noteOff(event.data[1]);
      return;
  }
}