// Based on http://zhangjw.bai-hua.org/audio_test6.html

var sampleRate = 44100,
    bufferSize = 1024 * 32,
    bitDepth = 16,
    channels = 1,
    bytesPerSample = bitDepth >> 3,
    bytesPerSecond = sampleRate * bytesPerSample;;

var array = typeof Float32Array !== "undefined"
    ? function(n) { return new Float32Array(n); }
    : function(n) {
      var a = [],
          i = -1;
      while (++i < n) a[i] = 0;
      return a;
    };

function generate(notes) {
  var wave = [];
  var presample = array(bufferSize);
  var max = notes.length;
  notes.forEach(function(frequency) {
    amplitude = 1;
    var signal = sine(frequency, amplitude);
    for (var i = 0; i < signal.length; i++) {
      presample[i] += signal[i];
    }
  });
  for (var n = 0; n < presample.length; n++) {
    wave.push(Math.floor(presample[n] * 10000 / max))
  }
  return wave;
}

function sine(frequency, amplitude) {
  var samples = array(bufferSize),
      k = 2 * Math.PI * frequency / sampleRate,
      currentSoundSample = 0;
  
  for (var i = 0; i < samples.length; i++){
    samples[i] = Math.sin(k * currentSoundSample++) * amplitude;
  }
  return samples;
}

var btoa = window.btoa || function(input) {
  /* Base 64 encoding function originally written by Tyler Akins (http://rumkin.com), available in the public domain */
  var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
  var output = "";
  var chr1, chr2, chr3;
  var enc1, enc2, enc3, enc4;
  var i = 0;
  
  do {
    chr1 = input.charCodeAt(i++);
    chr2 = input.charCodeAt(i++);
    chr3 = input.charCodeAt(i++);

    enc1 = chr1 >> 2;
    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
    enc4 = chr3 & 63;

    if (isNaN(chr2)) {
      enc3 = enc4 = 64;
    } else if (isNaN(chr3)) {
      enc4 = 64;
    };
    
    output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
  } while (i < input.length);
  
  return output;
};

function getWaveURI(wave) {
  /* codes below originally written by David Humphrey & Yury Delendik available on http://audioscene.org/scene-files/humph/sfxr/
     Licensed under the Apache License, Version 2.0 - http://www.apache.org/licenses/LICENSE-2.0 */
  
  function packUInt16(value) {
    var i0 = (value & 255), i1 = (value >> 8) & 255;
    return String.fromCharCode(i0, i1);
  }

  function packUInt32(value) {
    var i0 = (value & 255), i1 = (value >> 8) & 255, i2 = (value >> 16) & 255, i3 = (value >>> 24) & 255;
    return String.fromCharCode(i0, i1, i2, i3);
  }

  function packInt16Array(value) {
    var dataItems = [], dataItem = "";
    for (var i=0, length = value.length; i < length; ++i) {
      if (dataItem.length >= 1024) {
        dataItems.push(dataItem); dataItem = "";
      };
      dataItem += packUInt16(value[i] & 0xFFFF);
    };
    dataItems.push(dataItem);
    return dataItems.join('');
  };

  var data = packInt16Array(wave);

  var waveFileChunks = [];
  waveFileChunks.push("RIFF");
  waveFileChunks.push(packUInt32(36 + data.length));
  waveFileChunks.push("WAVE");
  waveFileChunks.push("fmt ");
  waveFileChunks.push(packUInt32(16));
  waveFileChunks.push(packUInt16(1));
  waveFileChunks.push(packUInt16(channels));
  waveFileChunks.push(packUInt32(sampleRate));
  waveFileChunks.push(packUInt32(bytesPerSecond));
  waveFileChunks.push(packUInt16(bytesPerSample));
  waveFileChunks.push(packUInt16(bitDepth));
  waveFileChunks.push("data");
  waveFileChunks.push(packUInt32(data.length));
  waveFileChunks.push(data);
    
  var out = waveFileChunks.join('');
  return "data:audio/wav;base64," + btoa(out);
}
