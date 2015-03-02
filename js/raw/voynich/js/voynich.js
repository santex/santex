$(function() {
  var po = org.polymaps;

  var map = po.map()
    .container(document.getElementById("map").appendChild(po.svg("svg")))
    .zoom(2.5)
    .tileSize({x: 256, y: 256})

  var startFolio = location.hash.substr(1).split('/').shift();
  if (!startFolio) location.hash = "f1r";

  var offsets = [],
      layers = [],
      folioLayers = {},
      folios = [];
  _.each(quires, function(quire, i) {
    if (!quire) return;
    var offset = 0;
    var quireMenu = $('<ul style="display: none"/>');
    var quireLink = $('<a href="#"/>').text(i ? 'Quire ' + i : 'Covers').click(function() {
      quireMenu.slideToggle();
      return false;
    });
    $('<li/>').append(quireLink).append(quireMenu).appendTo($('#menu'));
    _.each(quire, function(name) {
      var size = getSize(name),
          layer = po.image()
        .url(po.url("http://{S}voynich.jasondavies.com/" + name + "/{Z}/{Y}/{X}.jpg")
          .hosts(['a.', 'b.', 'c.', 'd.'])
          .repeat(false))
        .zoom(function(z) { return Math.max(0, Math.min(size[2], z)) })
        .visible(false);
      map.add(layer);
      layers.push(layer);
      folios.push(name);
      folioLayers[name] = layer;
      var menuLink = $('<a/>').attr('href', '#' + name).text(name);
      if (name === startFolio) {
        quireMenu.show();
      }
      $('<li/>').append(menuLink).appendTo(quireMenu);
    });
  });
  var currentLayer = layers[0].visible(true),
      currentHash = [.5, .5],
      h = po.hash(),
      defaultFormatter = h.formatter(),
      defaultParser = h.parser(),
      folio = folios[0],
      size = getSize(folio),
      l = po.map.coordinateLocation({
    column: .5 * size[0] / 256,
    row: .5 * size[1] / 256,
    zoom: 0
  });
  map
    .center(l)
    .zoomRange([.5, size[2]])
    .add(po.interact())
    .add(po.compass().pan("none").zoom("big"))
    .add(h.parser(function(m, s) {
      var args = s.split('/');
      if (folio !== args[0]) {
        folio = args[0];
        // Check Beinecke
        if (!folioLayers[folio])
          folio = beinecke[folio];
        $('#menu a')
            .removeClass('selected')
          .filter('[href="#' + folio + '"]')
            .addClass('selected');
        size = getSize(folio);
        if (folioLayers[folio]) {
          currentLayer.visible(false);
          currentLayer = folioLayers[folio].visible(true);
          map.zoomRange([.5, size[2]]);
        }
      }
      var zoom;
      if (args.length > 2) {
        zoom = args[3] != null ? args[3] : size[2];
        currentHash[0] = args[1];
        currentHash[1] = args[2];
      } else zoom = map.zoom();
      var l = po.map.coordinateLocation({
        column: parseFloat(currentHash[0]) * size[0] / 256,
        row: parseFloat(currentHash[1]) * size[1] / 256,
        zoom: 0
      });
      return defaultParser(m, [zoom, l.lat, l.lon].join('/'));
    }).formatter(function(map) {
      var size = getSize(folio),
          zyx = defaultFormatter(map).substring(1).split('/'),
          p = po.map.locationCoordinate({lat: +zyx[1], lon: +zyx[2]}),
          args = [
            format(256 * p.column / size[0]),
            format(256 * p.row / size[1]),
            zyx[0]
          ];
      return '#' + folio + '/' + args.join('/');
    }));

  $('a.prev, a.next').click(function() {
    var f = folios[_.indexOf(folios, folio) + ($(this).hasClass('next') ? 1 : -1)];
    if (f) {
      location.href = location.href.replace(folio, f);
    }
    return false;
  });

  $('#expand-collapse').click(function() {
    if ($('#menu :hidden').size())
      $('#menu ul').slideDown();
    else
      $('#menu ul').slideUp();
  });
});

function getSize(folio) {
  var size = sizes[folio];
  if (!size) return [100, 100];
  var levels = ~~Math.ceil(Math.log(Math.ceil(Math.max(size[0], size[1]) / 256)) / Math.LN2),
      n = 1 << levels;
  return [size[0] / n, size[1] / n, levels];
}

function format(n) {
  return n.toFixed(3).replace(/\.?0+$/, "");
}
