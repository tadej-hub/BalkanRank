/* Balkan Rank - obrazec, rezultat, prenos, jezik.
   Besedila so v jeziki.js, izracun v izracun.js, risanje v kartica.js. */

(function () {
  'use strict';

  /* pove CSS, da skript teče: šele takrat se razdelki skrijejo za razkrivanje */
  document.documentElement.classList.add('js');

  var obrazec = document.getElementById('obrazec');
  var poljeKolicina = document.getElementById('kolicina');
  var poljeTeza = document.getElementById('teza');
  var poljeVzdevek = document.getElementById('vzdevek');
  var plosca = document.getElementById('plosca');
  var oznakaKolicina = document.getElementById('oznaka-kolicina');
  var enotaKolicina = document.getElementById('enota-kolicina');
  var napis = document.getElementById('napaka');
  var izbiraJezika = document.getElementById('jezik-izbira');

  var trenutniJezik = BR_JEZIK.zacetni();
  var T = BR_JEZIKI[trenutniJezik];

  /* omejitve vnosa po dvigu */
  var MEJE = {
    kg: { min: 1, max: 500, korak: 0.5 },
    pon: { min: 1, max: 100, korak: 1 }
  };

  /* dokler na lestvici ni toliko vnosov, je skrita - pri treh ljudeh
     lestvica nicesar ne pove */
  var MIN_NA_LESTVICI = 10;
  var NA_LESTVICI = 20;
  var V_KRATKI = 5;

  /* kako dolgo traja preliv kratke lestvice ob zamenjavi dviga ali spola */
  var PRELIV = 170;

  /* zadnji izracun, da ga prenos in menjava jezika ne rabita racunati znova */
  var zadnji = null;

  function izbraniDvig() {
    var el = obrazec.querySelector('input[name="dvig"]:checked');
    return el ? el.value : 'bench';
  }

  function jeZgibi() {
    return izbraniDvig() === 'zgibi';
  }

  /* ---------- jezik ---------- */

  function prevediDrevo(koren) {
    koren.querySelectorAll('[data-t]').forEach(function (el) {
      var v = T[el.getAttribute('data-t')];
      if (v !== undefined) el.textContent = v;
    });
    koren.querySelectorAll('[data-t-namig]').forEach(function (el) {
      var v = T[el.getAttribute('data-t-namig')];
      if (v !== undefined) el.placeholder = v;
    });
  }

  /* gumbi v glavi pridejo iz seznama jezikov, ne iz HTML */
  function izrisiGumbeJezikov() {
    izbiraJezika.innerHTML = BR_SEZNAM_JEZIKOV.map(function (k) {
      return '<button type="button" class="jezik-gumb" data-jezik="' + k + '" aria-label="' +
             BR_JEZIKI[k].ime + '" title="' + BR_JEZIKI[k].ime + '">' +
             BR_JEZIKI[k].oznaka + '</button>';
    }).join('');
  }

  function uporabiJezik(k, zapomni) {
    if (!BR_JEZIKI[k]) return;
    trenutniJezik = k;
    T = BR_JEZIKI[k];
    document.documentElement.lang = T.html_lang;

    izbiraJezika.querySelectorAll('.jezik-gumb').forEach(function (g) {
      var mu = g.getAttribute('data-jezik');
      g.classList.toggle('aktiven', mu === k);
      g.setAttribute('aria-pressed', mu === k ? 'true' : 'false');
    });

    prevediDrevo(document);
    osveziDvig();
    izrisiLestvico();
    izrisiRazvrstitev();

    /* ce je rezultat ze na zaslonu, ga narisemo v novem jeziku */
    if (zadnji) pokaziIzid(zadnji.vnos, zadnji.izid, true);

    /* tudi lebdeče kartice nosijo besedilo */
    if (predogledNarisan) narisiPredogled();

    if (zapomni) BR_JEZIK.shrani(k);
  }

  /* ---------- obrazec ---------- */

  /* barva dviga (plosca 25/20/15/10 kg) se bere iz CSS prek data-dvig */
  function osveziDvig() {
    document.documentElement.setAttribute('data-dvig', izbraniDvig());

    var zgibi = jeZgibi();
    var m = zgibi ? MEJE.pon : MEJE.kg;

    oznakaKolicina.setAttribute('data-t', zgibi ? 'kolicina_pon' : 'kolicina_kg');
    oznakaKolicina.textContent = zgibi ? T.kolicina_pon : T.kolicina_kg;
    enotaKolicina.setAttribute('data-t', zgibi ? 'enota_pon' : 'enota_kg');
    enotaKolicina.textContent = zgibi ? T.enota_pon : T.enota_kg;
    poljeKolicina.placeholder = zgibi ? T.namig_pon : T.namig_kg;
    poljeKolicina.min = m.min;
    poljeKolicina.max = m.max;
    poljeKolicina.step = m.korak;
  }

  var manjGibanja = window.matchMedia('(prefers-reduced-motion: reduce)');
  var casMirovanja;

  /* dolg vnos dobi manjso stevilko, da na ozkem zaslonu ne zadene ob rob */
  function prilagodiVelikost() {
    plosca.setAttribute('data-dolgo', poljeKolicina.value.length >= 5 ? 'true' : 'false');
  }

  /* stevilka poskoci, plosca se vrti, dokler se vpisuje */
  function obVpisuStevilke() {
    pociscinapake();
    prilagodiVelikost();
    if (manjGibanja.matches) return;

    poljeKolicina.classList.remove('poskok');
    void poljeKolicina.offsetWidth;   /* da se animacija ob hitrem tipkanju ponovi */
    poljeKolicina.classList.add('poskok');

    plosca.classList.add('vpisuje');
    clearTimeout(casMirovanja);
    casMirovanja = setTimeout(function () {
      plosca.classList.remove('vpisuje');
    }, 1300);
  }

  function pociscinapake() {
    napis.hidden = true;
    napis.textContent = '';
    plosca.classList.remove('je-napaka');
    obrazec.querySelectorAll('.vrstica').forEach(function (v) {
      v.classList.remove('je-napaka');
    });
  }

  function pokaziNapako(sporocilo, polje) {
    pociscinapake();
    napis.textContent = sporocilo;
    napis.hidden = false;
    if (polje === poljeKolicina) plosca.classList.add('je-napaka');
    else if (polje) polje.closest('.vrstica').classList.add('je-napaka');
    if (polje) polje.focus();
  }

  /* prebere in preveri obrazec; vrne null, ce vnos ni veljaven */
  function preberiVnos() {
    var zgibi = jeZgibi();
    var m = zgibi ? MEJE.pon : MEJE.kg;

    var kolicina = parseFloat(String(poljeKolicina.value).replace(',', '.'));
    if (!isFinite(kolicina)) {
      pokaziNapako(zgibi ? T.e_kolicina_pon : T.e_kolicina_kg, poljeKolicina);
      return null;
    }
    if (kolicina < m.min || kolicina > m.max) {
      pokaziNapako(T.e_kolicina_meja, poljeKolicina);
      return null;
    }

    var teza = parseFloat(String(poljeTeza.value).replace(',', '.'));
    if (!isFinite(teza)) {
      pokaziNapako(T.e_teza, poljeTeza);
      return null;
    }
    if (teza < 30 || teza > 250) {
      pokaziNapako(T.e_teza_meja, poljeTeza);
      return null;
    }

    /* vzdevek je neobvezen; prazno polje pomeni "samo kartica, brez lestvice" */
    var vzdevek = poljeVzdevek ? ocistiVzdevek(poljeVzdevek.value) : '';
    if (vzdevek === null) {
      pokaziNapako(T.e_vzdevek, poljeVzdevek);
      return null;
    }

    var vnos = {
      dvig: izbraniDvig(),
      spol: obrazec.querySelector('input[name="spol"]:checked').value,
      kolicina: zgibi ? Math.round(kolicina) : kolicina,
      telesna_teza: teza,
      trajanje_treniranja: document.getElementById('trajanje').value,
      vzdevek: vzdevek
    };

    /* nemogoc rezultat zavrnemo: na lestvici bi bil samo smet */
    var cez = BR.nemogoc(vnos);
    if (cez) {
      pokaziNapako((cez.zgibi ? T.e_nemogoce_pon : T.e_nemogoce_kg)
                     .replace('{meja}', cez.meja), poljeKolicina);
      return null;
    }

    pociscinapake();
    return vnos;
  }

  /* Vrne ocisten vzdevek, '' ce ga ni, in null, ce ni veljaven.
     Odstranimo krmilne znake, znake nicelne sirine in znaka za prelom vrstice
     oziroma odstavka; tak vzdevek bi na lestvici podrl postavitev. Primerjamo
     kodne tocke, da teh znakov ni treba pisati v sam regexp. */
  function ocistiVzdevek(surov) {
    var s = String(surov || '');
    var v = '';
    for (var i = 0; i < s.length; i++) {
      var k = s.charCodeAt(i);
      if (k < 32) continue;                     /* krmilni znaki */
      if (k >= 127 && k <= 159) continue;       /* krmilni znaki, drugi del */
      if (k >= 8203 && k <= 8207) continue;     /* nicelna sirina, smer pisave */
      if (k === 8232 || k === 8233) continue;   /* locilnika vrstice in odstavka */
      v += s.charAt(i);
    }
    v = v.replace(/\s+/g, ' ').trim();
    if (!v) return '';
    if (v.length < 2 || v.length > 20) return null;
    return v;
  }

  /* ---------- rezultat ---------- */

  /* kategorija telesne teze: navzgor na najblizjih 5 kg */
  function kategorijaTeze(teza) {
    return T.k_do + ' ' + (Math.ceil(teza / 5) * 5) + ' ' + T.k_enota_kg;
  }

  /* kartica nosi šest elementov: logotip, dvig, številko z enoto,
     odstotek, ploščico s kategorijo teže in okvir z rangom */
  function podatkiZaKartico(vnos, izid) {
    return {
      rang: izid.rang,                      /* kljuc, po njem se izbere paleta */
      rang_ime: T.rangi[izid.rang],         /* izpis na kartici */
      dvig: vnos.dvig,                      /* ime dviga je na kartici vedno angleško */
      kolicina: vnos.kolicina,
      enota: vnos.dvig === 'zgibi' ? T.k_enota_pon : T.k_enota_kg,
      odstotek: izid.odstotek,
      teza_kategorija: kategorijaTeze(vnos.telesna_teza)
    };
  }

  /* takoj = brez animacije (menjava jezika, manj gibanja) */
  function pokaziIzid(vnos, izid, takoj) {
    var cilj = document.getElementById('rezultat');
    var prejsnjiEmail = document.getElementById('email');
    var email = prejsnjiEmail ? prejsnjiEmail.value : '';

    /* ob menjavi jezika se izid narise znova; ze znano mesto obdrzimo */
    var mesto = (zadnji && zadnji.vnos === vnos) ? zadnji.mesto : null;
    if (mestoCaka && mestoCaka.vnos === vnos) {
      mesto = mestoCaka.mesto;
      mestoCaka = null;
    }

    zadnji = { vnos: vnos, izid: izid, podatki: podatkiZaKartico(vnos, izid), mesto: mesto };

    cilj.innerHTML =
      '<canvas id="kartica" class="kartica" width="' + BRKartica.POKONCNA.w +
        '" height="' + BRKartica.POKONCNA.h + '" role="img" aria-label="' +
        zadnji.podatki.rang_ime + ', ' + izid.odstotek_besedilo + '"></canvas>' +
      '<p class="mesto" id="mesto" hidden></p>' +
      '<div class="prenos">' +
        '<label for="email">' + T.p_naslov + '</label>' +
        '<div class="prenos-vrstica">' +
          '<span class="polje-okvir sirok">' +
            '<input type="email" id="email" name="email" inputmode="email" ' +
              'autocomplete="email" spellcheck="false" placeholder="' + T.p_namig + '">' +
          '</span>' +
          '<button type="button" id="gumb-prenos" class="glavni-gumb">' + T.p_gumb + '</button>' +
        '</div>' +
        '<p class="napaka" id="napaka-email" role="alert" hidden></p>' +
        '<p class="prenos-opomba" id="prenos-opomba">' + T.p_opomba + '</p>' +
      '</div>';
    cilj.hidden = false;

    if (email) document.getElementById('email').value = email;

    var platno = document.getElementById('kartica');
    var prenos = cilj.querySelector('.prenos');

    if (takoj || manjGibanja.matches) {
      BRKartica.pripravi().then(function () {
        BRKartica.pokoncna(platno, zadnji.podatki);
      });
    } else {
      /* kartica prileti od spodaj, številka se prešteje, nato polje za e-naslov */
      platno.classList.add('prileti');
      prenos.classList.add('caka');
      BRKartica.pripravi().then(function () {
        var a = BRKartica.animacija(zadnji.podatki);
        presteviStevilko(a, platno, vnos.kolicina, function () {
          prenos.classList.remove('caka');
        });
      });
    }

    izpisiMesto();

    document.getElementById('gumb-prenos').addEventListener('click', obPrenosu);
    document.getElementById('email').addEventListener('input', function () {
      document.getElementById('napaka-email').hidden = true;
      this.closest('.polje-okvir').classList.remove('je-napaka');
    });
  }

  /* ---------- mesto na lestvici ---------- */

  /* vrednost, po kateri se razvrsca: pri zgibih ponovitve, sicer razmerje */
  function vrednostZaLestvico(vnos, izid) {
    return izid.razmerje === null ? vnos.kolicina : izid.razmerje;
  }

  /* baza odgovori hitreje, kot se odvrti animacija; mesto zato pocaka
     na izris rezultata, namesto da bi se izgubilo */
  var mestoCaka = null;

  function izpisiMesto() {
    var el = document.getElementById('mesto');
    if (!el || !zadnji || !zadnji.mesto) return;

    var m = zadnji.mesto;
    /* dokler je lestvica skrita, tudi mesta ne kazemo */
    if (m.skupaj < MIN_NA_LESTVICI) return;

    el.textContent = (m.zVzdevkom ? T.r_mesto : T.r_mesto_brez)
      .replace('{mesto}', m.mesto)
      .replace('{skupaj}', m.skupaj);
    el.hidden = false;
  }

  /* prebere, koliko vnosov je boljsih in koliko jih je skupaj */
  function poisciMesto(vnos, izid) {
    var v = vrednostZaLestvico(vnos, izid);

    return Promise.all([
      BRBaza.boljsih(vnos.dvig, vnos.spol, v),
      BRBaza.lestvica(vnos.dvig, vnos.spol, 1)
    ]).then(function (o) {
      var boljsih = o[0];
      var skupaj = o[1] ? o[1].skupaj : null;
      if (boljsih === null || skupaj === null) return;

      var zVzdevkom = !!vnos.vzdevek;
      var m = {
        mesto: boljsih + 1,
        /* brez vzdevka clovek na lestvici ni, zato ga v sestevek pristejemo */
        skupaj: zVzdevkom ? skupaj : skupaj + 1,
        zVzdevkom: zVzdevkom
      };

      if (zadnji && zadnji.vnos === vnos) {
        zadnji.mesto = m;
        izpisiMesto();
      } else {
        /* rezultat se ni izrisan; pokaziIzid mesto pobere, ko bo */
        mestoCaka = { vnos: vnos, mesto: m };
      }
    });
  }

  /* stevilka na kartici se hitro presteje od nic do koncne vrednosti */
  function presteviStevilko(a, platno, koncna, konec) {
    var trajanje = 700, zacetek = null, koncano = false;
    var celo = Math.round(koncna);

    function zakljuci() {
      if (koncano) return;
      koncano = true;
      a.narisi(platno, koncna);               /* na koncu tocna vrednost, tudi z decimalko */
      if (konec) konec();
    }

    a.narisi(platno, 0);

    function korak(cas) {
      if (koncano) return;
      if (zacetek === null) zacetek = cas;
      var t = Math.min(1, (cas - zacetek) / trajanje);
      var u = 1 - Math.pow(1 - t, 3);          /* hitro na zacetku, mehko na koncu */
      if (t < 1) {
        a.narisi(platno, Math.round(celo * u));
        requestAnimationFrame(korak);
      } else {
        zakljuci();
      }
    }
    requestAnimationFrame(korak);

    /* varovalo: v skritem zavihku requestAnimationFrame ne tece,
       zato rezultat po tem casu pokazemo tudi brez stetja */
    setTimeout(zakljuci, trajanje + 900);
  }

  /* premakne pogled tako, da je kartica cela v vidnem polju;
     odmik od vrha je v CSS (scroll-margin-top), da ga krčenje glave ne podre */
  function pomakniNaRezultat(mehko) {
    document.getElementById('rezultat').scrollIntoView({
      block: 'start',
      behavior: mehko ? 'smooth' : 'auto'
    });
  }

  function obdelajObrazec(e) {
    e.preventDefault();
    var vnos = preberiVnos();
    if (!vnos) return;

    var izid = BR.izracunaj(vnos);

    /* mesto pogledamo sele, ko je vnos zapisan, da je clovek v njem zajet */
    BRBaza.vnos(vnos, izid, trenutniJezik).then(function () {
      poisciMesto(vnos, izid);
      if (vnos.vzdevek) osveziRazvrstitev();
    });

    if (manjGibanja.matches) {
      pokaziIzid(vnos, izid, true);
      pomakniNaRezultat(false);
      return;
    }

    /* zaporedje: obrazec zbledi, kratko racunanje, nato kartica */
    obrazec.classList.add('zbledi');
    var cilj = document.getElementById('rezultat');
    cilj.innerHTML = '<div class="racunam"><span></span><span></span><span></span>' +
                     '<p>' + T.p_racunam + '</p></div>';
    cilj.hidden = false;
    pomakniNaRezultat(true);

    setTimeout(function () {
      pokaziIzid(vnos, izid);
      pomakniNaRezultat(true);
      obrazec.classList.remove('zbledi');
    }, 800);
  }

  /* ---------- prenos obeh oblik ---------- */

  function veljavenEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v);
  }

  function imeDatoteke(oblika) {
    return 'balkan-rank-' + zadnji.izid.rang.toLowerCase() + '-' +
           zadnji.vnos.dvig + '-' + oblika + '.png';
  }

  function prenesiPlatno(platno, ime) {
    return new Promise(function (koncaj) {
      platno.toBlob(function (blob) {
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = ime;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(function () {
          URL.revokeObjectURL(url);
          koncaj(blob);
        }, 600);
      }, 'image/png');
    });
  }

  function obPrenosu() {
    if (!zadnji) return;

    var polje = document.getElementById('email');
    var napakaEmail = document.getElementById('napaka-email');
    var gumb = document.getElementById('gumb-prenos');
    var email = polje.value.trim();

    if (!email || !veljavenEmail(email)) {
      napakaEmail.textContent = email ? T.e_email_oblika : T.e_email;
      napakaEmail.hidden = false;
      polje.closest('.polje-okvir').classList.add('je-napaka');
      polje.focus();
      return;
    }

    napakaEmail.hidden = true;
    gumb.disabled = true;
    gumb.textContent = T.p_tece;

    BRBaza.naslov(email, zadnji.izid.rang, zadnji.vnos.dvig);

    var pokoncna = document.getElementById('kartica');
    var lezeca = document.createElement('canvas');
    BRKartica.lezeca(lezeca, zadnji.podatki);

    prenesiPlatno(pokoncna, imeDatoteke('pokoncna'))
      .then(function () { return prenesiPlatno(lezeca, imeDatoteke('lezeca')); })
      .then(function () {
        document.getElementById('prenos-opomba').textContent = T.p_konec;
        gumb.disabled = false;
        gumb.textContent = T.p_gumb;
      });
  }

  /* ---------- glava, ki se ob drsenju skrci ---------- */

  function spremljajDrsenje() {
    var glava = document.getElementById('glava');
    var cta = document.getElementById('glava-cta');
    var tece = false;

    function preveri() {
      glava.classList.toggle('skrcena', window.scrollY > 90);
      tece = false;
    }

    window.addEventListener('scroll', function () {
      if (tece) return;
      tece = true;
      window.requestAnimationFrame(preveri);
    }, { passive: true });

    cta.addEventListener('click', function () {
      var cilj = zadnji ? document.getElementById('rezultat') : plosca;
      cilj.scrollIntoView({
        block: 'center',
        behavior: manjGibanja.matches ? 'auto' : 'smooth'
      });
      if (!zadnji) poljeKolicina.focus({ preventScroll: true });
    });

    preveri();
  }

  /* ---------- lestvica mej ---------- */

  var BARVE_RANGOV = {
    BRON: '#c08a4e', SREBRO: '#c6d4e2', ZLATO: '#f2c200',
    PLATINA: '#b0e4f0', DIAMANT: '#a8d6ff'
  };

  function izrisiLestvico() {
    var tabela = document.getElementById('lestvica-tabela');
    if (!tabela) return;

    var spol = obrazec.querySelector('input[name="spol"]:checked').value;
    var dvigi = ['bench', 'pocep', 'mrtvi'];

    var glava = '<thead><tr><th>' + T.l_stolpec_rang + '</th>' +
      dvigi.map(function (d) { return '<th>' + T['dvig_' + d] + '</th>'; }).join('') +
      '</tr></thead>';

    var telo = '<tbody>' + BR.RANGI.map(function (rang, i) {
      return '<tr style="--rang-barva:' + BARVE_RANGOV[rang] + '">' +
        '<th scope="row"><span class="pika-rang"></span>' + T.rangi[rang] + '</th>' +
        dvigi.map(function (d) {
          return '<td>' + BR.pragi(spol, d)[i].toFixed(2) + '×</td>';
        }).join('') +
        '</tr>';
    }).join('') + '</tbody>';

    tabela.innerHTML = glava + telo;

    document.getElementById('lestvica-spol').textContent =
      ' (' + (spol === 'm' ? T.l_za_moske : T.l_za_zenske) + ')';

    document.getElementById('lestvica-opomba').textContent =
      T.l_opomba_zgibi.replace('{zgibi}', BR.pragi(spol, 'zgibi').join(' / '));
  }

  /* ---------- lestvica ljudi ---------- */

  /* vzdevek vpise obiskovalec, zato gre v HTML samo prek tega */
  function varno(s) {
    return String(s).replace(/[&<>"']/g, function (z) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[z];
    });
  }

  /* navzdol, enako kot na kartici: 1.499 je se vedno 1.49x */
  function razmerjeBesedilo(v) {
    return (Math.floor(v * 100) / 100).toFixed(2) + '×';
  }

  /* zadnji prebrani podatki, da jih ob menjavi jezika ni treba brati znova */
  var razvrstitevPodatki = null;
  var razvrstitevTece = '';

  function izrisiRazvrstitev() {
    var sekcija = document.getElementById('razvrstitev');
    var tabela = document.getElementById('razvrstitev-tabela');
    if (!sekcija || !tabela) return;

    var p = razvrstitevPodatki;
    var zgibi = !!p && p.dvig === 'zgibi';

    /* kratka lestvica se skrije ali pokaze po istem pravilu */
    izrisiKratko(p, zgibi);

    if (!p || p.skupaj < MIN_NA_LESTVICI) {
      sekcija.hidden = true;
      return;
    }

    tabela.innerHTML =
      '<thead><tr>' +
        '<th>' + T.r_mesto_stolpec + '</th>' +
        '<th>' + T.r_vzdevek + '</th>' +
        '<th>' + T.r_teza + '</th>' +
        '<th>' + (zgibi ? T.r_ponovitve : T.r_razmerje) + '</th>' +
        '<th>' + T.r_rang + '</th>' +
      '</tr></thead>' +
      '<tbody>' + p.vrstice.map(function (v, i) {
        var vrednost = zgibi
          ? Number(v.kolicina) + '×'
          : razmerjeBesedilo(Number(v.razmerje));
        return '<tr style="--rang-barva:' + (BARVE_RANGOV[v.rang] || '#ffffff') + '">' +
          '<td class="mesto-st">' + (i + 1) + '</td>' +
          '<th scope="row" class="vzdevek-celica">' + varno(v.vzdevek) + '</th>' +
          '<td>' + Math.round(Number(v.telesna_teza)) + ' ' + T.enota_kg + '</td>' +
          '<td>' + vrednost + '</td>' +
          '<td class="rang-celica"><span class="pika-rang"></span>' +
            (T.rangi[v.rang] || v.rang) + '</td>' +
        '</tr>';
      }).join('') + '</tbody>';

    document.getElementById('razvrstitev-opis').textContent = zgibi ? T.r_opis_zgibi : T.r_opis;
    document.getElementById('razvrstitev-kaj').textContent =
      ' (' + T['dvig_' + p.dvig] + ', ' + (p.spol === 'm' ? T.l_za_moske : T.l_za_zenske) + ')';

    sekcija.hidden = false;
    /* razdelek se je pravkar pojavil; ce je ze v vidnem polju, ga pokazemo brez cakanja */
    if (sekcija.getBoundingClientRect().top < window.innerHeight) {
      sekcija.classList.add('vidno');
    }
  }

  /* strnjen izvlecek nad obrazcem: prvih pet mest */
  function izrisiKratko(p, zgibi) {
    var sekcija = document.getElementById('kratka');
    var seznam = document.getElementById('kratka-seznam');
    if (!sekcija || !seznam) return;

    if (!p || p.skupaj < MIN_NA_LESTVICI) {
      sekcija.hidden = true;
      return;
    }

    seznam.innerHTML = p.vrstice.slice(0, V_KRATKI).map(function (v) {
      /* izpostavljeno je tisto, po cemer se razvrsca: dvignjeni kilogrami,
         pri zgibih ponovitve; ob njem drobno razmerje oziroma telesna teza */
      var glavno = zgibi
        ? Number(v.kolicina) + '×'
        : Number(v.kolicina) + ' ' + T.enota_kg;
      var ob = zgibi
        ? Math.round(Number(v.telesna_teza)) + ' ' + T.enota_kg
        : razmerjeBesedilo(Number(v.razmerje));
      return '<li style="--rang-barva:' + (BARVE_RANGOV[v.rang] || '#ffffff') + '">' +
        '<span class="kratka-vzdevek">' + varno(v.vzdevek) + '</span>' +
        '<span class="kratka-glavno">' + glavno + '</span>' +
        '<span class="kratka-ob">' + ob + '</span>' +
      '</li>';
    }).join('');

    /* kateri dvig in spol sta prikazana */
    document.getElementById('kratka-kaj').textContent =
      T['dvig_' + p.dvig] + ', ' + (p.spol === 'm' ? T.spol_m : T.spol_z);

    sekcija.hidden = false;

    /* preliv nazaj v vidno; z zamikom, da brskalnik vmes nariše prazno stanje */
    var telo = document.getElementById('kratka-telo');
    if (telo) setTimeout(function () { telo.classList.remove('se-menja'); }, 20);
  }

  function osveziRazvrstitev() {
    var dvig = izbraniDvig();
    var spol = obrazec.querySelector('input[name="spol"]:checked').value;
    var kljuc = dvig + '/' + spol;
    razvrstitevTece = kljuc;

    /* kratka lestvica ne preskoci, ampak se prelije; ce je se ni na zaslonu,
       ni cesa prelivati */
    var sekcija = document.getElementById('kratka');
    var telo = document.getElementById('kratka-telo');
    var prelije = !!telo && !!sekcija && !sekcija.hidden && !manjGibanja.matches;
    var zacetek = Date.now();
    if (prelije) telo.classList.add('se-menja');

    return BRBaza.lestvica(dvig, spol, NA_LESTVICI).then(function (o) {
      if (razvrstitevTece !== kljuc) return;    /* medtem je izbral kaj drugega */
      razvrstitevPodatki = o ? { dvig: dvig, spol: spol, vrstice: o.vrstice, skupaj: o.skupaj } : null;

      /* baza lahko odgovori hitreje, kot traja preliv; takrat ga pustimo do konca,
         sicer bi se vsebina zamenjala, preden bi kdo karkoli opazil */
      var ostanek = prelije ? Math.max(0, PRELIV - (Date.now() - zacetek)) : 0;
      if (!ostanek) {
        izrisiRazvrstitev();
        return;
      }
      return new Promise(function (koncaj) {
        setTimeout(function () {
          if (razvrstitevTece === kljuc) izrisiRazvrstitev();
          koncaj();
        }, ostanek);
      });
    });
  }

  /* ---------- fotografiji se ob drsenju premikata počasneje od vsebine ---------- */

  function postaviPocasnoOzadje() {
    if (manjGibanja.matches) return;
    var slike = [
      { el: document.querySelector('.vrh-slika img'), moc: 0.14 },
      { el: document.querySelector('.pas img'), moc: 0.12 }
    ].filter(function (s) { return s.el; });
    if (!slike.length) return;

    var tece = false;

    function osvezi() {
      slike.forEach(function (s) {
        var r = s.el.parentNode.getBoundingClientRect();
        if (r.bottom < -200 || r.top > window.innerHeight + 200) return;
        var sredina = r.top + r.height / 2 - window.innerHeight / 2;
        s.el.style.transform = 'translate3d(0,' + (-sredina * s.moc).toFixed(1) + 'px,0)';
      });
      tece = false;
    }

    window.addEventListener('scroll', function () {
      if (tece) return;
      tece = true;
      requestAnimationFrame(osvezi);
    }, { passive: true });

    osvezi();
  }

  /* ---------- številke v lestvici se preštejejo navzgor ---------- */

  var lestvicaPresteta = false;

  function presteviLestvico() {
    if (lestvicaPresteta || manjGibanja.matches) return;
    lestvicaPresteta = true;

    var celice = [].slice.call(document.querySelectorAll('#lestvica-tabela tbody td'));
    if (!celice.length) return;

    var cilji = celice.map(function (c) { return parseFloat(c.textContent); });
    var trajanje = 900, zacetek = null;

    function korak(cas) {
      if (zacetek === null) zacetek = cas;
      var t = Math.min(1, (cas - zacetek) / trajanje);
      var u = 1 - Math.pow(1 - t, 3);
      celice.forEach(function (c, i) {
        c.textContent = (cilji[i] * u).toFixed(2) + '×';
      });
      if (t < 1) requestAnimationFrame(korak);
    }
    celice.forEach(function (c) { c.textContent = '0.00×'; });
    requestAnimationFrame(korak);

    /* varovalo, ce requestAnimationFrame ne tece */
    setTimeout(function () {
      celice.forEach(function (c, i) { c.textContent = cilji[i].toFixed(2) + '×'; });
    }, trajanje + 600);
  }

  /* ---------- lebdeče kartice v predogledu ----------
     Rišejo se v canvas, da so v izbranem jeziku. */

  var PREDOGLED = [
    { spol: 'm', dvig: 'bench', kolicina: 100, telesna_teza: 75 },
    { spol: 'm', dvig: 'mrtvi', kolicina: 220, telesna_teza: 88 },
    { spol: 'm', dvig: 'pocep', kolicina: 245, telesna_teza: 85 }
  ];
  var predogledNarisan = false;

  function narisiPredogled() {
    var platna = document.querySelectorAll('#kup canvas');
    if (!platna.length) return;
    predogledNarisan = true;

    BRKartica.pripravi().then(function () {
      PREDOGLED.forEach(function (vnos, i) {
        setTimeout(function () {
          var c = platna[i];
          /* rišemo naravnost v velikosti prikaza krat gostota zaslona,
             da se besedilo ne pomanjšuje iz 1080 px in ostane ostro */
          /* offsetWidth je postavitvena širina; getBoundingClientRect bi pri
             zavrteni kartici vrnil širši okvir */
          var sirina = c.offsetWidth || c.parentNode.offsetWidth || 200;
          BRKartica.pokoncna(c, podatkiZaKartico(vnos, BR.izracunaj(vnos)),
                             BRKartica.meriloZaPrikaz(sirina));
        }, i * 90);
      });
    });
  }

  /* ---------- razkrivanje razdelkov ob drsenju ---------- */

  function postaviRazkrivanje() {
    var razdelki = document.querySelectorAll('.razkrij');

    if (manjGibanja.matches || !('IntersectionObserver' in window)) {
      razdelki.forEach(function (r) { r.classList.add('vidno'); });
      return;
    }

    /* sprozi se, ko je razdelek 20 % v vidnem polju */
    var opazovalec = new IntersectionObserver(function (vnosi) {
      vnosi.forEach(function (v) {
        if (!v.isIntersecting) return;
        v.target.classList.add('vidno');
        if (v.target.id === 'lestvica') presteviLestvico();
        opazovalec.unobserve(v.target);
      });
    }, { threshold: 0.2 });

    razdelki.forEach(function (r) { opazovalec.observe(r); });

    /* Varovalo: v zavihku, ki ga brskalnik duši, se opazovalec lahko ne sprozi,
       razdelek pa bi ostal neviden. Ob drsenju zato se sami preverimo polozaj. */
    var zadnjic = 0;
    function preveri() {
      zadnjic = Date.now();
      var ostalo = 0;
      razdelki.forEach(function (r) {
        if (r.classList.contains('vidno')) return;
        if (r.getBoundingClientRect().top < window.innerHeight * 0.85) {
          r.classList.add('vidno');
          if (r.id === 'lestvica') presteviLestvico();
          opazovalec.unobserve(r);
        } else {
          ostalo++;
        }
      });
      if (!ostalo) {
        window.removeEventListener('scroll', obDrsenju);
        window.removeEventListener('resize', obDrsenju);
      }
    }
    function obDrsenju() {
      /* brez requestAnimationFrame, ker se ta v skritem zavihku ne izvaja */
      if (Date.now() - zadnjic < 120) return;
      preveri();
    }
    window.addEventListener('scroll', obDrsenju, { passive: true });
    window.addEventListener('resize', obDrsenju);
    preveri();
  }

  /* ---------- poslusalci ---------- */

  obrazec.addEventListener('change', function (e) {
    if (e.target.name === 'dvig') osveziDvig();
    if (e.target.name === 'spol') izrisiLestvico();
    /* lestvica je locena za vsak dvig in vsak spol */
    if (e.target.name === 'dvig' || e.target.name === 'spol') osveziRazvrstitev();
  });
  poljeKolicina.addEventListener('input', obVpisuStevilke);
  if (poljeVzdevek) poljeVzdevek.addEventListener('input', pociscinapake);
  poljeKolicina.addEventListener('animationend', function () {
    poljeKolicina.classList.remove('poskok');
  });
  poljeTeza.addEventListener('input', pociscinapake);
  obrazec.addEventListener('submit', obdelajObrazec);

  /* ob spremembi širine okna kartice prerišemo v novem merilu */
  var casRisanja;
  window.addEventListener('resize', function () {
    if (!predogledNarisan) return;
    clearTimeout(casRisanja);
    casRisanja = setTimeout(narisiPredogled, 300);
  });

  /* gumb pod kratko lestvico se pomakne na polno lestvico nizje na strani */
  var kratkaGumb = document.getElementById('kratka-gumb');
  if (kratkaGumb) {
    kratkaGumb.addEventListener('click', function () {
      var cilj = document.getElementById('razvrstitev');
      if (!cilj || cilj.hidden) return;
      cilj.classList.add('vidno');
      cilj.scrollIntoView({
        block: 'start',
        behavior: manjGibanja.matches ? 'auto' : 'smooth'
      });
    });
  }

  izbiraJezika.addEventListener('click', function (e) {
    var gumb = e.target.closest('.jezik-gumb');
    if (gumb) uporabiJezik(gumb.getAttribute('data-jezik'), true);
  });

  izrisiGumbeJezikov();
  uporabiJezik(trenutniJezik, false);
  spremljajDrsenje();
  postaviPocasnoOzadje();
  postaviRazkrivanje();

  /* kartice so zdaj nad obrazcem, torej takoj vidne - narišemo jih
     ob prvem zatišju, da ne zadržijo prvega izrisa strani */
  if (window.requestIdleCallback) {
    requestIdleCallback(function () { narisiPredogled(); }, { timeout: 2500 });
  } else {
    setTimeout(narisiPredogled, 400);
  }

  /* lestvica ne sme zadrzati prvega izrisa; ce branje ne uspe, ostane skrita */
  setTimeout(osveziRazvrstitev, 600);
})();
