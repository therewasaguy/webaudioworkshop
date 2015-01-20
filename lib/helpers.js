/* HELPER FUNCTIONS */

function midiToFreq(midiValue) {
  return 440 * Math.pow(2, (midiValue-69)/12.0);
}

function map(n, start1, stop1, start2, stop2) {
  return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
}

function loadBuffer(path, callback) {
  var request = new XMLHttpRequest();
  request.open('GET', path, true);
  request.responseType = 'arraybuffer';

  // decode asyncrohonously
  request.onload = function() {
    ac.decodeAudioData(request.response, function(audioBuffer) {
      callback(audioBuffer);
    });
  };
  request.send();
}