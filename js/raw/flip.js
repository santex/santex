// Based on http://www.revfad.com/flip.html by David Faden.

var flipString = (function() {
  function flipString(aString) {
    var last = aString.length - 1;
    // Thanks to Brook Monroe for the
    // suggestion to use Array.join
    var result0 = new Array(aString.length);
    var result = new Array(aString.length);
    // First pass: combining diacritical marks in-place
    for (var i=0; i<aString.length; i++) {
      var c = aString.charAt(i);
      var r = combiningMarks[c];
      if (r) {
        result0[i] = result0[i-1];
        result0[i-1] = r;
      } else {
        result0[i] = c;
      }
    }
    for (var i = last; i >= 0; --i) {
      var c = result0[i];
      var r = flipTable[c];
      if (r == undefined) {
        r = flipTable[result0[i - 1] + c];
        if (r == undefined) {
          r = c;
        } else {
          i--;
        }
      }
      result[last - i] = r;
    }
    return result.join('');
  }

  var flipTable = {
    '\u0021': '\u00A1',
    '\u0022': '\u201E',
    '\u0026': '\u214B',
    '\u0027': '\u002C',
    '\u0028': '\u0029',
    '\u002E': '\u02D9',
    '\u0033': '\u0190',
    '\u0034': '\u152D',
    '\u0036': '\u0039',
    '\u0037': '\u2C62',
    '\u003B': '\u061B',
    '\u003C': '\u003E',
    '\u003F': '\u00BF',
    '\u0041': '\u2200',
    '\u0042': '\u15FA',
    '\u0043': '\u2183',
    '\u0044': '\u15E1',
    '\u0045': '\u018E',
    '\u0046': '\u2132',
    '\u0047': '\u2141',
    '\u004A': '\u017F',
    '\u004B': '\u22CA',
    '\u004C': '\u2142',
    '\u004D': '\u0057',
    '\u004E': '\u1D0E',
    '\u0050': '\u0500',
    '\u0051': '\u038C',
    '\u0052': '\u1D1A',
    '\u0054': '\u22A5',
    '\u0055': '\u2229',
    '\u0056': '\u1D27',
    '\u0059': '\u2144',
    '\u005B': '\u005D',
    '\u005F': '\u203E',
    '\u0061': '\u0250',
    '\u0062': '\u0071',
    '\u0063': '\u0254',
    '\u0064': '\u0070',
    '\u0065': '\u01DD',
    '\u0066': '\u025F',
    '\u0067': '\u0183',
    '\u0068': '\u0265',
    '\u0069': '\u0131',
    '\u006A': '\u027E',
    '\u006B': '\u029E',
    '\u006C': '\u2758',
    '\u006D': '\u026F',
    '\u006E': '\u0075',
    '\u0072': '\u0279',
    '\u0074': '\u0287',
    '\u0076': '\u028C',
    '\u0077': '\u028D',
    '\u0079': '\u028E',
    '\u007B': '\u007D',
    '\u203F': '\u2040',
    '\u2045': '\u2046',
    '\u2234': '\u2235',

    '\u00E9': '\u01DD'
  }

  // See http://en.wikipedia.org/wiki/Combining_character
  var combiningMarks = {
    '\u0308': '\u0324',
    '\u0331': '\u0304',
    ' ͡': ' ͜',
    ' ̆': ' ̯'
  };

  var fill = function(t) {
    for (var i in t) {
      var j = t[i];
      if (!t[j]) {
        t[j] = i;
      }
    }
  };
  fill(flipTable);
  fill(combiningMarks);
  return flipString;
})();
