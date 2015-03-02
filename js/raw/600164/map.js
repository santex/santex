var po = org.polymaps;

var map = po.map()
    .container(document.getElementById("map").appendChild(po.svg("svg")));

/*
 * Load the "AerialWithLabels" metadata. "Aerial" and "Road" also work. For more
 * information about the Imagery Metadata service, see
 * http://msdn.microsoft.com/en-us/library/ff701716.aspx
 * You should register for your own key at https://www.bingmapsportal.com/.
 */
var script = document.createElement("script");
script.setAttribute("type", "text/javascript");
script.setAttribute("src", "http://dev.virtualearth.net"
    + "/REST/V1/Imagery/Metadata/AerialWithLabels"
    + "?key=AmT-ZC3HPevQq5IBJ7v8qiDUxrojNaqbW1zBsKF0oMNEs53p7Nk5RlAuAmwSG7bg"
    + "&jsonp=imageryCallback");
document.body.appendChild(script);

function imageryCallback(data) {

  /* Display each resource as an image layer. */
  var resourceSets = data.resourceSets;
  for (var i = 0; i < resourceSets.length; i++) {
    var resources = data.resourceSets[i].resources;
    for (var j = 0; j < resources.length; j++) {
      var resource = resources[j];
      map.add(po.image()
          .url(template(resource.imageUrl, resource.imageUrlSubdomains)))
          .tileSize({x: resource.imageWidth, y: resource.imageHeight});
    }
  }

  setUpSearch();
}

/** Returns a Bing URL template given a string and a list of subdomains. */
function template(url, subdomains) {
  var n = subdomains.length,
      salt = ~~(Math.random() * n); // per-session salt

  /** Returns the given coordinate formatted as a 'quadkey'. */
  function quad(column, row, zoom) {
    var key = "";
    for (var i = 1; i <= zoom; i++) {
      key += (((row >> zoom - i) & 1) << 1) | ((column >> zoom - i) & 1);
    }
    return key;
  }

  return function(c) {
    var quadKey = quad(c.column, c.row, c.zoom),
        server = Math.abs(salt + c.column + c.row + c.zoom) % n;
    return url
        .replace("{quadkey}", quadKey)
        .replace("{subdomain}", subdomains[server]);
  };
}

/////////////////////// search...

function setUpSearch() {
    var search = document.getElementById('search');
    search.q.disabled = null;
    search.submit.disabled = null;
    
    search.onsubmit = function() {
        if (search.q.value && search.q.value.length > 0) {        
            search.q.disabled = 'true';
            search.submit.disabled = 'true';   
            doSearch(search.q.value);
        }
        return false;
    }
}

function doSearch(q) {
    var script = document.createElement("script");
    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", "http://dev.virtualearth.net"
        + "/REST/V1/Locations"
        + "?key=AmT-ZC3HPevQq5IBJ7v8qiDUxrojNaqbW1zBsKF0oMNEs53p7Nk5RlAuAmwSG7bg"
        + "&query=" + encodeURIComponent(q)
        + "&jsonp=searchCallback");
    document.body.appendChild(script);
}

function searchCallback(rsp) {
    try {
        // console.log(rsp);
    
        var bbox = rsp.resourceSets[0].resources[0].bbox; // [s,w,n,e]

        // TODO: don't just use the first one, see if there's one nearby to where we're already looking

        // compute the extent in points, scale factor, and center
        // -- borrowed from map.extent(), thanks Mike
        var bl = map.locationPoint({ lat: bbox[0], lon: bbox[1] }),
            tr = map.locationPoint({ lat: bbox[2], lon: bbox[3] }),
            sizeActual = map.size(),
            k = Math.max((tr.x - bl.x) / sizeActual.x, (bl.y - tr.y) / sizeActual.y),
            l = map.pointLocation({x: (bl.x + tr.x) / 2, y: (bl.y + tr.y) / 2});
    
        // update the zoom level
        var z = map.zoom() - Math.log(k) / Math.log(2);
        
        animateCenterZoom(map, l, z);
    }
    catch(e) {    
        console.error(e);
        // TODO: what? reset map position/zoom, perhaps? show error?
    }
    var search = document.getElementById('search');    
    search.q.disabled = null;
    search.submit.disabled = null;
}
