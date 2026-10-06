/* Balkan Rank - izracun ranga, odstotka in napredka.
   Cisto racunanje, brez DOM. Uporablja se iz app.js in iz testi.html. */

var BR = (function () {
  'use strict';

  var RANGI = ['BRON', 'SREBRO', 'ZLATO', 'PLATINA', 'DIAMANT'];

  /* percentil, ki pripada vsaki meji.
     Primerjalna skupina so vsi obiskovalci fitnesa, ne le resni vadeci,
     zato so stevilke nizje od tistih iz aplikacij za belezenje treningov. */
  var PERCENTILI = [65, 35, 12, 4, 2];

  /* meje: razmerje do telesne teze, pri zgibih stevilo ponovitev */
  var PRAGI = {
    m: {
      bench: [0.50, 0.75, 1.25, 1.75, 2.00],
      pocep: [0.75, 1.25, 1.75, 2.25, 2.75],
      mrtvi: [1.00, 1.50, 2.00, 2.50, 3.00],
      zgibi: [1, 5, 10, 15, 20]
    },
    z: {
      bench: [0.30, 0.50, 0.75, 1.00, 1.35],
      pocep: [0.50, 0.85, 1.25, 1.75, 2.25],
      mrtvi: [0.60, 1.00, 1.50, 2.00, 2.50],
      zgibi: [1, 2, 5, 9, 13]
    }
  };

  /* dve dopolnitvi, ki ju navodila ne dolocajo:
     - pod prvo mejo vlecemo crto od vrednosti 0 (percentil 90) do BRON (65)
     - nad zadnjo mejo od DIAMANT (2) do dvakratnika DIAMANT (1); zaradi
       zaokrozevanja na celo stevilo pade na 1 pri 1.5-kratniku zadnje meje
     Obojestransko je rezultat omejen na 1-99. */
  var NAD_DIAMANTOM = 2;
  var PERC_SPODAJ = 90;
  var PERC_ZGORAJ = 1;

  /* meja se steje za doseženo tudi ob zaokrozitveni napaki deljenja */
  var EPS = 1e-9;

  function omeji(x, naj_min, naj_max) {
    return Math.min(naj_max, Math.max(naj_min, x));
  }

  function pragi(spol, dvig) {
    var zaSpol = PRAGI[spol];
    if (!zaSpol || !zaSpol[dvig]) throw new Error('neznan dvig ali spol: ' + spol + '/' + dvig);
    return zaSpol[dvig];
  }

  /* pri zgibih steje stevilo ponovitev, sicer razmerje do telesne teze */
  function vrednost(dvig, kolicina, telesna_teza) {
    if (dvig === 'zgibi') return kolicina;
    return kolicina / telesna_teza;
  }

  /* najvisja stopnja, katere mejo je rezultat dosegel; pod prvo mejo ostane BRON */
  function indeksRanga(v, p) {
    var i = 0;
    for (var k = 0; k < p.length; k++) {
      if (v >= p[k] - EPS) i = k;
    }
    return i;
  }

  function percentil(v, p) {
    var zadnja = p.length - 1;

    if (v <= p[0]) {
      var delez = p[0] > 0 ? omeji(v / p[0], 0, 1) : 1;
      return omeji(PERC_SPODAJ + (PERCENTILI[0] - PERC_SPODAJ) * delez, 1, 99);
    }

    for (var k = 0; k < zadnja; k++) {
      if (v <= p[k + 1]) {
        var t = (v - p[k]) / (p[k + 1] - p[k]);
        return omeji(PERCENTILI[k] + (PERCENTILI[k + 1] - PERCENTILI[k]) * t, 1, 99);
      }
    }

    var zgornja = p[zadnja] * NAD_DIAMANTOM;
    var t2 = omeji((v - p[zadnja]) / (zgornja - p[zadnja]), 0, 1);
    return omeji(PERCENTILI[zadnja] + (PERC_ZGORAJ - PERCENTILI[zadnja]) * t2, 1, 99);
  }

  /* delez poti med trenutno in naslednjo mejo; pri DIAMANT je 1 */
  function napredek(v, p, i) {
    if (i >= p.length - 1) return 1;
    return omeji((v - p[i]) / (p[i + 1] - p[i]), 0, 1);
  }

  /* vnos: { dvig, spol, kolicina, telesna_teza } */
  function izracunaj(vnos) {
    var p = pragi(vnos.spol, vnos.dvig);
    var zgibi = vnos.dvig === 'zgibi';
    var v = vrednost(vnos.dvig, vnos.kolicina, vnos.telesna_teza);
    var i = indeksRanga(v, p);
    var odstotek = omeji(Math.round(percentil(v, p)), 1, 99);
    var nap = napredek(v, p, i);

    return {
      vrednost: v,
      razmerje: zgibi ? null : v,
      /* navzdol, ne navzgor: sicer bi 0.7467 pisalo 0.75x ob rangu BRON,
         torej natanko mejo, ki ni dosežena */
      razmerje_besedilo: zgibi ? String(vnos.kolicina) + '×' : (Math.floor(v * 100) / 100).toFixed(2) + 'x',
      rang: RANGI[i],
      rang_indeks: i,
      odstotek: odstotek,
      odstotek_besedilo: 'TOP ' + odstotek + ' %',
      napredek: nap,
      naslednji: i < RANGI.length - 1 ? RANGI[i + 1] : null,
      pragi: p
    };
  }

  return {
    RANGI: RANGI,
    PERCENTILI: PERCENTILI,
    PRAGI: PRAGI,
    pragi: pragi,
    vrednost: vrednost,
    indeksRanga: indeksRanga,
    percentil: percentil,
    napredek: napredek,
    izracunaj: izracunaj
  };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = BR;
