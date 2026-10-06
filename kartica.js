/* Balkan Rank - risanje kartice v canvas.
   Prepis kartica2.py, umerjen po k2-zlato.png.

   Šest elementov, od vrha navzdol:
     1 logotip, širok 230
     2 ime dviga v razprtih velikih črkah
     3 velika številka s kovinskim prelivom in enoto ob njej
     4 TOP X %
     5 ploščica z napisom DO X KG
     6 okvir z imenom ranga v barvi ranga

   Navpične lege so izmerjene iz k2-zlato.png: besedilo se postavlja po
   sredini črkovnega okvirja, ne po črti pisave, zato se ujema ne glede na
   to, kako brskalnik meri pisavo. */

var BRKartica = (function () {
  'use strict';

  var W = 1080, H = 1350;
  var POKONCNA = { w: 1080, h: 1350 };
  var LEZECA = { w: 1600, h: 900 };

  /* palete iz kartica2.py */
  var RANGI = {
    BRON: {
      bg1: [26, 18, 12], bg2: [9, 7, 6], glow: [140, 80, 32],
      met: [[92, 54, 24], [214, 142, 74], [255, 212, 160], [168, 102, 48], [70, 40, 18]],
      acc: [216, 150, 86], rim: [140, 88, 44]
    },
    SREBRO: {
      bg1: [20, 24, 28], bg2: [7, 9, 11], glow: [110, 130, 150],
      met: [[78, 88, 98], [176, 190, 204], [255, 255, 255], [140, 152, 166], [60, 68, 78]],
      acc: [198, 212, 226], rim: [150, 166, 182]
    },
    ZLATO: {
      bg1: [30, 23, 8], bg2: [11, 8, 4], glow: [190, 145, 30],
      met: [[120, 82, 12], [230, 180, 60], [255, 244, 198], [198, 146, 36], [96, 64, 10]],
      acc: [255, 206, 92], rim: [214, 168, 62]
    },
    PLATINA: {
      bg1: [14, 26, 30], bg2: [5, 10, 12], glow: [90, 180, 200],
      met: [[96, 134, 146], [190, 226, 236], [255, 255, 255], [150, 192, 206], [72, 104, 116]],
      acc: [176, 228, 240], rim: [150, 206, 222]
    },
    DIAMANT: {
      bg1: [18, 16, 38], bg2: [6, 5, 14], glow: [120, 110, 240],
      met: [[96, 150, 220], [170, 220, 255], [255, 255, 255], [190, 160, 255], [110, 96, 210]],
      acc: [168, 214, 255], rim: [150, 180, 255]
    }
  };

  var PISAVA = 'Poppins';

  var DVIGI = {
    bench: 'BENCH PRESS',
    pocep: 'SQUAT',
    mrtvi: 'DEADLIFT',
    zgibi: 'PULL-UPS'
  };

  /* Lege in velikosti, izmerjene iz k2-zlato.png (1080 x 1350).
     "vrh" je zgornji rob črk, ne črta pisave - tako se izris ujame
     ne glede na to, kako brskalnik postavlja osnovnico. */
  var P = {
    logo_vrh: 108, logo_sirina: 230,
    dvig_vrh: 391, dvig_vel: 42,
    stevilka_vrh: 530, stevilka_vel: 340, globina: 12,
    enota_vrh: 684, enota_vel: 96, enota_razmik: 36,
    odstotek_vrh: 877, odstotek_vel: 130,
    ploscica_vrh: 1032, ploscica_vel: 36, ploscica_sredina: 1044,
    ploscica_h: 64, ploscica_rob: 25,
    okvir_vrh: 1160, okvir_vel: 58, okvir_sredina: 1180,
    okvir_h: 109, okvir_rob: 56, okvir_r: 20
  };

  var znakSlika = null;

  function barva(c, a) {
    return 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + (a === undefined ? 1 : a) + ')';
  }

  function pisava(teza, velikost) {
    return teza + ' ' + velikost + 'px ' + PISAVA + ', system-ui, sans-serif';
  }

  function razprto(s) {
    return String(s).split('').join(' ');
  }

  /* Merilo izrisa: 1 pomeni polno velikost (1080 x 1350), manj pa izris
     naravnost v velikosti prikaza krat devicePixelRatio. Vse koordinate v
     kodi ostanejo v merah kartice; platno je večje ali manjše, kontekst pa
     je ustrezno raztegnjen, zato se pisave, razmiki in obroba skalirajo
     sorazmerno in besedilo ostane ostro. */
  var M = 1;

  /* platno v merah kartice; zaledje je v pikah naprave */
  function platno(w, h) {
    var c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(w * M));
    c.height = Math.max(1, Math.round(h * M));
    var x = c.getContext('2d');
    x.scale(M, M);
    x.imageSmoothingEnabled = true;
    x.imageSmoothingQuality = 'high';
    return c;
  }

  /* platno v pikah naprave, brez raztega - za zabrisovanje */
  function surovoPlatno(w, h) {
    var c = document.createElement('canvas');
    c.width = Math.max(1, Math.round(w));
    c.height = Math.max(1, Math.round(h));
    var x = c.getContext('2d');
    x.imageSmoothingEnabled = true;
    x.imageSmoothingQuality = 'high';
    return c;
  }

  function pripraviCilj(canvas, merilo) {
    M = merilo || 1;
    canvas.width = Math.round(W * M);
    canvas.height = Math.round(H * M);
    var ctx = canvas.getContext('2d');
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.scale(M, M);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    return ctx;
  }

  /* zaobljen pravokotnik s pravimi krožnimi vogali (arcTo, ne Bezier) */
  function zaobljen(ctx, x, y, w, h, r, nadaljuj) {
    r = Math.min(r, w / 2, h / 2);
    if (!nadaljuj) ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function navpicniPreliv(ctx, y0, y1, barve) {
    var g = ctx.createLinearGradient(0, y0, 0, y1);
    barve.forEach(function (c, i) { g.addColorStop(i / (barve.length - 1), barva(c)); });
    return g;
  }

  /* izpis z zgornjim robom črk na dani višini */
  function izpisiOdVrha(ctx, besedilo, teza, velikost, x, vrh, poravnava) {
    ctx.font = pisava(teza, velikost);
    ctx.textAlign = poravnava || 'center';
    ctx.textBaseline = 'alphabetic';
    var m = ctx.measureText(besedilo);
    ctx.fillText(besedilo, x, vrh + m.actualBoundingBoxAscent);
    return m.width;
  }

  function sirinaBesedila(ctx, besedilo, teza, velikost) {
    ctx.font = pisava(teza, velikost);
    return ctx.measureText(besedilo).width;
  }

  /* ---------- ozadje ---------- */

  function ozadje(ctx, t) {
    ctx.fillStyle = navpicniPreliv(ctx, 0, H, [t.bg1, t.bg2, [0, 0, 0]]);
    ctx.fillRect(0, 0, W, H);

    var R = Math.max(W, H) * 0.58;
    ctx.save();
    ctx.globalCompositeOperation = 'screen';
    /* profil je umerjen po k2-zlato.png: v sredini mehko, z dolgim repom */
    var sij = ctx.createRadialGradient(W / 2, H * 0.42, 0, W / 2, H * 0.42, R);
    sij.addColorStop(0, barva(t.glow, 0.24));
    sij.addColorStop(0.26, barva(t.glow, 0.17));
    sij.addColorStop(0.5, barva(t.glow, 0.125));
    sij.addColorStop(0.75, barva(t.glow, 0.08));
    sij.addColorStop(1, barva(t.glow, 0.02));
    ctx.fillStyle = sij;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();

    /* vinjeta je eliptična in zagrabi šele proti robovom, kot v kartica2.py,
       kjer elipsa sega čez rob slike in je močno zabrisana */
    var Rv = W * 0.833;
    var navpicno = (H * 0.7) / Rv;
    ctx.save();
    ctx.translate(W / 2, H / 2);
    ctx.scale(1, navpicno);
    var vin = ctx.createRadialGradient(0, 0, 0, 0, 0, Rv);
    vin.addColorStop(0, 'rgba(0,0,0,0)');
    vin.addColorStop(0.6, 'rgba(0,0,0,0)');
    vin.addColorStop(0.85, 'rgba(0,0,0,0.15)');
    vin.addColorStop(1, 'rgba(0,0,0,0.45)');
    ctx.fillStyle = vin;
    ctx.fillRect(-W, -H, W * 2, H * 2);
    ctx.restore();

    zrno(ctx);
  }

  /* zrno v ločljivosti naprave; pri manjšem merilu je sorazmerno manjše */
  function zrno(ctx) {
    var t = surovoPlatno(W * M, H * M);
    var tc = t.getContext('2d');
    var img = tc.createImageData(t.width, t.height);
    var d = img.data;
    for (var i = 0; i < d.length; i += 4) {
      var v = 112 + Math.random() * 76;
      d[i] = d[i + 1] = d[i + 2] = v;
      d[i + 3] = 255;
    }
    tc.putImageData(img, 0, 0);
    ctx.save();
    ctx.globalCompositeOperation = 'overlay';
    ctx.globalAlpha = 0.4;
    ctx.drawImage(t, 0, 0, W, H);
    ctx.restore();
  }

  /* ---------- kovinsko besedilo ---------- */

  /* besedilo v kovinskem prelivu; preliv teče čez višino črk */
  function kovinskoPlatno(besedilo, velikost, met, crta, sirina, visina, samoSilhueta) {
    var c = platno(sirina, visina);
    var x = c.getContext('2d');
    x.font = pisava(700, velikost);
    x.textAlign = 'center';
    x.textBaseline = 'alphabetic';

    if (samoSilhueta) {
      x.fillStyle = '#000';
    } else {
      var m = x.measureText(besedilo);
      var g = x.createLinearGradient(0, crta - m.actualBoundingBoxAscent,
                                     0, crta + m.actualBoundingBoxDescent);
      met.forEach(function (c2, i) { g.addColorStop(i / (met.length - 1), barva(c2)); });
      x.fillStyle = g;
    }
    x.fillText(besedilo, sirina / 2, crta);
    return c;
  }

  /* kovinsko besedilo z zgornjim robom črk na dani višini;
     pri številki še ekstrudirana senca navzdol-desno */
  function kovinskoOdVrha(ctx, besedilo, velikost, met, vrh, globina) {
    ctx.font = pisava(700, velikost);
    var m = ctx.measureText(besedilo);
    var a = m.actualBoundingBoxAscent, d = m.actualBoundingBoxDescent;

    var visina = Math.ceil(a + d) + 8;
    var crta = a + 4;
    var y0 = vrh - 4;

    if (globina) {
      var sil = kovinskoPlatno(besedilo, velikost, met, crta, W, visina, true);
      ctx.save();
      ctx.globalAlpha = 190 / 255;
      for (var off = globina; off > 0; off--) {
        ctx.drawImage(sil, off, y0 + off, W, visina);
      }
      ctx.restore();
    }

    ctx.drawImage(kovinskoPlatno(besedilo, velikost, met, crta, W, visina, false),
                  0, y0, W, visina);
  }

  /* ---------- logotip v barvi ranga ----------
     Zlati deli prevzamejo barvo acc, črnina ostane črna.
     Maska je najvišji kanal izvirnika, raztegnjen tako, da najsvetlejši
     piksel znaka pomeni polno barvo; prosojnost izvirnika se ohrani.
     Tako se izris ujame s k2-*.png; množenje po kanalih da pretemen znak. */

  var barvaniZnaki = {};

  function logotipBarvan(t, velikost) {
    var kljuc = t.acc.join(',') + '@' + velikost + '@' + M;
    if (barvaniZnaki[kljuc]) return barvaniZnaki[kljuc];

    /* surovo platno v pikah naprave, ker po pikah hodimo sami */
    var c = surovoPlatno(velikost * M, velikost * M);
    var x = c.getContext('2d');
    x.drawImage(znakSlika, 0, 0, c.width, c.height);

    var slika = x.getImageData(0, 0, c.width, c.height);
    var d = slika.data;
    var i, naj = 1;

    for (i = 0; i < d.length; i += 4) {
      if (d[i + 3] < 250) continue;
      var v = Math.max(d[i], d[i + 1], d[i + 2]);
      if (v > naj) naj = v;
    }

    for (i = 0; i < d.length; i += 4) {
      var f = Math.min(1, Math.max(d[i], d[i + 1], d[i + 2]) / naj);
      d[i] = t.acc[0] * f;
      d[i + 1] = t.acc[1] * f;
      d[i + 2] = t.acc[2] * f;
    }
    x.putImageData(slika, 0, 0);

    barvaniZnaki[kljuc] = c;
    return c;
  }

  /* ---------- plaketna obroba ---------- */

  function obroba(ctx, t) {
    /* +1, ker so koordinate v kartica2.py vključujoče: [ROB, ROB, W-ROB, H-ROB] */
    var ROB = 8, B = 40, R = 52, R_NOT = R - B / 2;
    var zx = ROB, zy = ROB, zw = W - 2 * ROB + 1, zh = H - 2 * ROB + 1;
    var nx = zx + B, ny = zy + B, nw = zw - 2 * B, nh = zh - 2 * B;

    /* senca, ki jo obroba vrže na kartico: notranja ploskev minus ista,
       zamaknjena za 12 navzdol - torej pas tik pod zgornjim notranjim robom */
    var sencaPlatno = platno(W, H);
    var sc = sencaPlatno.getContext('2d');
    sc.fillStyle = '#000';
    zaobljen(sc, nx, ny, nw, nh, R_NOT);
    sc.fill();
    sc.globalCompositeOperation = 'destination-out';
    zaobljen(sc, nx, ny + 12, nw, nh, R_NOT);
    sc.fill();

    /* zabrisujemo v pikah naprave, da je polmer v pravem merilu */
    var sencaZabrisana = surovoPlatno(W * M, H * M);
    var sz = sencaZabrisana.getContext('2d');
    if (typeof sz.filter === 'string') sz.filter = 'blur(' + (10 * M) + 'px)';
    sz.drawImage(sencaPlatno, 0, 0);

    ctx.save();
    ctx.globalAlpha = 0.6;
    ctx.drawImage(sencaZabrisana, 0, 0, W, H);
    ctx.restore();

    /* pot obroča: zunanji zaobljen pravokotnik minus notranji */
    function potObroca(c, dx, dy) {
      c.beginPath();
      zaobljen(c, zx + dx, zy + dy, zw, zh, R, true);
      zaobljen(c, nx + dx, ny + dy, nw, nh, R_NOT, true);
    }

    /* rob obroča v dano smer - kot ImageChops.subtract(ring, offset(ring)) */
    function robObroca(odmik, barvaRoba) {
      var c = platno(W, H), x = c.getContext('2d');
      x.fillStyle = barvaRoba;
      potObroca(x, 0, 0);
      x.fill('evenodd');
      x.globalCompositeOperation = 'destination-out';
      potObroca(x, odmik, odmik);
      x.fill('evenodd');

      var zabrisan = surovoPlatno(W * M, H * M), zc = zabrisan.getContext('2d');
      if (typeof zc.filter === 'string') zc.filter = 'blur(' + (2 * M) + 'px)';
      zc.drawImage(c, 0, 0);
      return zabrisan;
    }

    /* kovinski obroč */
    var obrocPlatno = platno(W, H);
    var oc = obrocPlatno.getContext('2d');
    oc.save();
    potObroca(oc, 0, 0);
    oc.clip('evenodd');

    var kot = 32 * Math.PI / 180;
    var dolzina = Math.abs(W * Math.sin(kot)) + Math.abs(H * Math.cos(kot));
    var g = oc.createLinearGradient(
      W / 2 - Math.sin(kot) * dolzina / 2, H / 2 - Math.cos(kot) * dolzina / 2,
      W / 2 + Math.sin(kot) * dolzina / 2, H / 2 + Math.cos(kot) * dolzina / 2);
    [t.met[4], t.met[1], t.met[2], t.met[1], t.met[3], t.met[0]].forEach(function (c, i, a) {
      g.addColorStop(i / (a.length - 1), barva(c));
    });
    oc.fillStyle = g;
    oc.fillRect(0, 0, W, H);

    /* bevel: svetel rob zgoraj levo, temen spodaj desno */
    oc.globalAlpha = 0.8;
    oc.drawImage(robObroca(6, '#ffffff'), 0, 0, W, H);
    oc.globalAlpha = 0.78;
    oc.drawImage(robObroca(-6, '#000000'), 0, 0, W, H);
    oc.restore();

    ctx.drawImage(obrocPlatno, 0, 0, W, H);

    /* liniji ob robovih sta v kartica2.py narisani znotraj roba, ne čez njega:
       bela tik ob notranjem robu, črna tik ob zunanjem */
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ffffff';
    zaobljen(ctx, nx + 1, ny + 1, nw - 2, nh - 2, R_NOT - 1);
    ctx.stroke();

    ctx.lineWidth = 3;
    ctx.strokeStyle = '#000000';
    zaobljen(ctx, zx + 1.5, zy + 1.5, zw - 3, zh - 3, R - 1.5);
    ctx.stroke();
  }

  /* ---------- vsebina kartice ---------- */

  function stevilkaInEnota(ctx, t, p, m) {
    var stevilka = String(p.kolicina);
    kovinskoOdVrha(ctx, stevilka, m.stevilka_vel, t.met, m.stevilka_vrh, m.globina);

    var sirinaStevilke = sirinaBesedila(ctx, stevilka, 700, m.stevilka_vel);
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = barva(t.acc);
    izpisiOdVrha(ctx, p.enota, 700, m.enota_vel,
                 W / 2 + sirinaStevilke / 2 + m.enota_razmik, m.enota_vrh, 'left');
  }

  function vsebina(ctx, t, p, m) {
    /* 1 logotip, obarvan v barvo ranga */
    if (znakSlika) {
      ctx.drawImage(logotipBarvan(t, m.logo_sirina),
                    (W - m.logo_sirina) / 2, m.logo_vrh, m.logo_sirina, m.logo_sirina);
    }

    /* 2 ime dviga */
    ctx.fillStyle = 'rgb(226,232,240)';
    izpisiOdVrha(ctx, razprto(DVIGI[p.dvig] || String(p.dvig).toUpperCase()),
                 500, m.dvig_vel, W / 2, m.dvig_vrh);

    /* 3 velika številka in enota; pri animaciji štetja se rišeta posebej */
    if (!p.brez_stevilke) stevilkaInEnota(ctx, t, p, m);

    /* 4 odstotek */
    kovinskoOdVrha(ctx, 'TOP ' + p.odstotek + '%', m.odstotek_vel, t.met, m.odstotek_vrh, 0);

    /* 5 ploščica s kategorijo teže */
    var sirinaP = sirinaBesedila(ctx, p.teza_kategorija, 500, m.ploscica_vel) + 2 * m.ploscica_rob;
    zaobljen(ctx, (W - sirinaP) / 2, m.ploscica_sredina - m.ploscica_h / 2,
             sirinaP, m.ploscica_h, m.ploscica_h / 2);
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = barva(t.acc, 0.3);
    ctx.stroke();
    ctx.fillStyle = 'rgb(200,208,218)';
    izpisiOdVrha(ctx, p.teza_kategorija, 500, m.ploscica_vel, W / 2, m.ploscica_vrh);

    /* 6 okvir z imenom ranga */
    var rang = razprto(p.rang_ime || p.rang);
    var sirinaR = sirinaBesedila(ctx, rang, 700, m.okvir_vel) + 2 * m.okvir_rob;
    zaobljen(ctx, (W - sirinaR) / 2, m.okvir_sredina - m.okvir_h / 2,
             sirinaR, m.okvir_h, m.okvir_r);
    ctx.fillStyle = 'rgba(255,255,255,0.05)';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = barva(t.acc, 0.65);
    ctx.stroke();
    ctx.fillStyle = barva(t.acc);
    izpisiOdVrha(ctx, rang, 700, m.okvir_vel, W / 2, m.okvir_vrh);
  }

  /* ---------- kartica ----------
     p = { rang, rang_ime, dvig, kolicina, enota, odstotek, teza_kategorija } */

  /* merilo: 1 je polna velikost; manjše pomeni izris naravnost v
     velikosti prikaza krat devicePixelRatio */
  function narisiPokoncno(canvas, p, merilo) {
    var t = RANGI[p.rang] || RANGI.BRON;
    W = POKONCNA.w; H = POKONCNA.h;
    var ctx = pripraviCilj(canvas, merilo);

    ozadje(ctx, t);
    vsebina(ctx, t, p, P);
    obroba(ctx, t);
    return canvas;
  }

  /* merilo za dani prikaz: koliko pik naprave gre na 1080 px kartice */
  function meriloZaPrikaz(sirinaPrikaza) {
    var dpr = window.devicePixelRatio || 1;
    return Math.min(1, Math.max(0.2, (sirinaPrikaza * dpr) / POKONCNA.w));
  }

  /* ležeča: iste mere, pomanjšane in stisnjene v nižje platno */

  function narisiLezeco(canvas, p, merilo) {
    var t = RANGI[p.rang] || RANGI.BRON;
    W = LEZECA.w; H = LEZECA.h;
    var ctx = pripraviCilj(canvas, merilo);

    ozadje(ctx, t);
    vsebina(ctx, t, p, {
      logo_vrh: 48, logo_sirina: 150,
      dvig_vrh: 232, dvig_vel: 30,
      stevilka_vrh: 300, stevilka_vel: 250, globina: 10,
      enota_vrh: 413, enota_vel: 70, enota_razmik: 28,
      odstotek_vrh: 560, odstotek_vel: 96,
      ploscica_vrh: 676, ploscica_vel: 28, ploscica_sredina: 686,
      ploscica_h: 50, ploscica_rob: 22,
      okvir_vrh: 762, okvir_vel: 44, okvir_sredina: 777,
      okvir_h: 84, okvir_rob: 44, okvir_r: 18
    });
    obroba(ctx, t);
    return canvas;
  }

  /* pisave in logotip morajo biti naloženi, preden canvas kaj nariše */
  /* ---------- podlaga za štetje številke ----------
     Kartico narišemo enkrat brez številke; med štetjem se na vsako sličico
     samo prekopira podlaga in nariše trenutna številka. */

  function animacija(p) {
    var t = RANGI[p.rang] || RANGI.BRON;
    W = POKONCNA.w; H = POKONCNA.h;
    M = 1;                       /* kartica z rezultatom se prenese, zato polna velikost */

    var podlaga = platno(W, H);
    var ctx = podlaga.getContext('2d');
    var brez = {};
    Object.keys(p).forEach(function (k) { brez[k] = p[k]; });
    brez.brez_stevilke = true;

    ozadje(ctx, t);
    vsebina(ctx, t, brez, P);
    obroba(ctx, t);

    return {
      podlaga: podlaga,
      narisi: function (cilj, vrednost) {
        W = POKONCNA.w; H = POKONCNA.h;
        M = 1;
        if (cilj.width !== W) cilj.width = W;
        if (cilj.height !== H) cilj.height = H;
        var c = cilj.getContext('2d');
        c.setTransform(1, 0, 0, 1, 0, 0);
        c.clearRect(0, 0, W, H);
        c.imageSmoothingQuality = 'high';
        c.drawImage(podlaga, 0, 0, W, H);
        c.textAlign = 'center';
        c.textBaseline = 'alphabetic';
        stevilkaInEnota(c, t, { kolicina: vrednost, enota: p.enota }, P);
      }
    };
  }

  function pripravi() {
    var opravila = [];

    if (document.fonts) {
      opravila.push(
        document.fonts.load('700 340px ' + PISAVA)
          .then(function () { return document.fonts.load('500 42px ' + PISAVA); })
          .then(function () { return document.fonts.ready; })
      );
    }

    if (!znakSlika && typeof BR_ZNAK !== 'undefined') {
      opravila.push(new Promise(function (koncaj) {
        var slika = new Image();
        slika.onload = function () { znakSlika = slika; koncaj(); };
        slika.onerror = function () { koncaj(); };   /* brez logotipa, a kartica se nariše */
        slika.src = BR_ZNAK;
      }));
    }

    return Promise.all(opravila);
  }

  return {
    POKONCNA: POKONCNA,
    LEZECA: LEZECA,
    RANGI: RANGI,
    DVIGI: DVIGI,
    LEGE: P,
    pripravi: pripravi,
    pokoncna: narisiPokoncno,
    lezeca: narisiLezeco,
    animacija: animacija,
    meriloZaPrikaz: meriloZaPrikaz
  };
})();
