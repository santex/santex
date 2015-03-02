var canvas = document.getElementById('vis');
var preview = document.getElementById('preview');
var w = 0;
var resetError = function() {
  $('span.error #imageurl').unwrap().next('span.reason').remove();
};
try {
  var c = canvas.getContext("2d");
  var iterations = 0, stopIteration = 0;
  var imageData, data, imgNext, originalImage;
  var play = false;
  function handleURL(url) {
    if (!url) return;
    var img = createImage();
    img.src = "http://www.jasondavies.com/xhr?url=" + encodeURIComponent(url);
  }
  $(function() {
    $(window).bind('hashchange', function(e) {
      resetError();
      var url = location.hash.substr(1);
      $('#imageurl').val(url);
      handleURL(url);
    });
    $(window).trigger('hashchange');
  });
  function handleFiles(files) {
    resetError();
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      var imageType = /image.*/;
      
      if (!file.type.match(imageType)) {
        continue;
      }
      var img = createImage();
      var reader = new FileReader();
      reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
      reader.readAsDataURL(file);
    }
  }
  var dragenterover = function(e) {
    e.stopPropagation();
    e.preventDefault();
  }
  var createImage = function() {
    var img = new Image();
    img.onload = function() {
      w = Math.min(img.width, img.height);
      $(canvas).attr('width', w);
      $(canvas).attr('height', w);
      c.width = w;
      c.height = w;
      c.drawImage(img, 0, 0, w, w);
      imageData = c.getImageData(0, 0, c.width, c.height);
      originalImage = c.getImageData(0, 0, c.width, c.height);
      imgNext = c.getImageData(0, 0, c.width, c.height);
      $('#iterations').slider('option', 'max', 3 * w);
    }
    return img;
  }
  var drop = function(e) {
    e.stopPropagation();
    e.preventDefault();

    var dt = e.dataTransfer;
    var files = dt.files;
    //var img = createImage();
    //img.src = dt.getData('URL');

    handleFiles(files);
  }
  canvas.addEventListener("dragenter", dragenterover, false);
  canvas.addEventListener("dragover", dragenterover, false);
  canvas.addEventListener("drop", drop, false);
  var resetData = function() {
    var img = createImage();
    img.src = 'catmap.jpg';
  }
  var iteration = function() {
    var i = stopIteration;
    var diff = Math.abs(iterations - i);
    if (diff == 0 && !play) return;
    if (!imageData) return;
    var data = imageData.data;
    var nextData = imgNext.data;
    var src = 0;
    var dataWidth = Math.sqrt(data.length >> 2);
    for (var y = 0; y < dataWidth; y++) {
      for (var x = 0; x < dataWidth; x++) {
        var xNew = (2 * x + y) % dataWidth;
        var yNew = (x + y) % dataWidth;
        var dst = (yNew * dataWidth + xNew) * 4;
        if (iterations < i) {
          for (var j=0; j<4; j++) nextData[dst++] = data[src++];
        } else {
          for (var j=0; j<4; j++) nextData[src++] = data[dst++];
        }
      }
    }
    var tmp = imageData;
    imageData = imgNext;
    imgNext = tmp;
    iterations += (iterations < i) ? 1 : -1;
    $('#iteration-count').text(iterations);
    if (play) {
      for (var j=0; j<20; j++) {
        if (imageData.data[j] !== originalImage.data[j]) break;
        if (j === 19 || iterations == stopIteration) {
          stopIteration = iterations;
          play = false;
          $('#iterations').slider('enable').focus();
          $('#step-back, #step-forward').removeAttr('disabled');
        }
      }
      $('#iterations').slider('value', iterations);
      $('#iteration-target').text(iterations);
    }
    var diff = Math.abs(iterations - stopIteration);
    if (diff < 10 || diff % 10 == 0) c.putImageData(imageData, 0, 0);
  }
  setInterval(iteration, 1);
  resetData();
  $('#iterations').slider({
    value: 0, min: 0, max: 100, slide: function(e, ui) {
      stopIteration = ui.value;
      $('#iteration-target').text(ui.value);
    }
  }).change();
  $('#play').click(function() {
    play = true;
    stopIteration = 3 * w;
    $('#iterations').slider('disable');
    $('#step-back, #step-forward').attr('disabled', 'disabled');
  });
  $('#step-back').click(function() {
    stopIteration--;
    $('#iterations').slider('value', stopIteration);
    $('#iteration-target').text(stopIteration);
  });
  $('#step-forward').click(function() {
    stopIteration++;
    $('#iterations').slider('value', stopIteration);
    $('#iteration-target').text(stopIteration);
  });
} catch (e) {
  $('#preview').show();
  $('#controls').html('<p><em>Sorry, HTML canvas support is needed to view this demo.  Please use a compatible browser such as <a href="http://www.google.com/chrome/">Google Chrome</a>.</em></p>');
}
