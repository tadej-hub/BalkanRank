/* Testi za izracun.js - predvsem mejni primeri.
   Zazene jih testi.html; rezultati se izpisejo na strani in v konzoli. */

var TESTI = (function () {
  'use strict';

  var izidi = [];

  function enako(ime, dobil, pricakoval) {
    var ok = dobil === pricakoval;
    izidi.push({ ime: ime, ok: ok, dobil: String(dobil), pricakoval: String(pricakoval) });
    return ok;
  }

  function blizu(ime, dobil, pricakoval, dopust) {
    var d = dopust === undefined ? 1e-9 : dopust;
    var ok = Math.abs(dobil - pricakoval) <= d;
    izidi.push({
      ime: ime, ok: ok,
      dobil: String(Math.round(dobil * 1e6) / 1e6),
      pricakoval: '≈ ' + pricakoval
    });
    return ok;
  }

  function vrni(ime, pogoj, opis, dobil) {
    izidi.push({ ime: ime, ok: !!pogoj, dobil: String(dobil), pricakoval: opis });
    return !!pogoj;
  }

  function r(spol, dvig, kolicina, teza) {
    return BR.izracunaj({ spol: spol, dvig: dvig, kolicina: kolicina, telesna_teza: teza });
  }

  /* iz razmerja nazaj v kilograme, da testiramo pot skozi celoten izracun */
  function kg(razmerje, teza) { return razmerje * teza; }

  function pozeni() {
    izidi = [];
    var spoli = ['m', 'z'];
    var dvigi = ['bench', 'pocep', 'mrtvi', 'zgibi'];
    var teza = 80;

    /* 1. vsaka meja natanko zadene svojo stopnjo in svoj percentil */
    spoli.forEach(function (spol) {
      dvigi.forEach(function (dvig) {
        var p = BR.pragi(spol, dvig);
        p.forEach(function (meja, i) {
          var kolicina = dvig === 'zgibi' ? meja : kg(meja, teza);
          var x = r(spol, dvig, kolicina, teza);
          enako('meja ' + spol + '/' + dvig + ' ' + BR.RANGI[i] + ' (' + meja + ') → rang',
                x.rang, BR.RANGI[i]);
          enako('meja ' + spol + '/' + dvig + ' ' + BR.RANGI[i] + ' → odstotek',
                x.odstotek, BR.PERCENTILI[i]);
        });
      });
    });

    /* 2. tik pod mejo pade na prejsnjo stopnjo */
    spoli.forEach(function (spol) {
      dvigi.forEach(function (dvig) {
        var p = BR.pragi(spol, dvig);
        for (var i = 1; i < p.length; i++) {
          var tik = dvig === 'zgibi' ? p[i] - 1 : kg(p[i], teza) - 0.01;
          var x = r(spol, dvig, tik, teza);
          enako('tik pod ' + spol + '/' + dvig + ' ' + BR.RANGI[i] + ' → rang',
                x.rang, BR.RANGI[i - 1]);
        }
      });
    });

    /* 3. pod prvo mejo je rang se vedno BRON, odstotek med 95 in 99 */
    var podBronom = r('m', 'bench', kg(0.25, teza), teza);
    enako('polovica bronaste meje → rang', podBronom.rang, 'BRON');
    enako('polovica bronaste meje → odstotek', podBronom.odstotek, 78);   /* (90+65)/2 = 77.5 */
    enako('polovica bronaste meje → napredek', podBronom.napredek, 0);

    var skoraj_nic = r('m', 'bench', 1, teza);
    enako('1 kg pri 80 kg → rang', skoraj_nic.rang, 'BRON');
    enako('1 kg pri 80 kg → odstotek', skoraj_nic.odstotek, 89);

    var nic = r('m', 'zgibi', 0, teza);
    enako('0 ponovitev → rang', nic.rang, 'BRON');
    enako('0 ponovitev → odstotek', nic.odstotek, 90);

    /* 4. sredina med dvema mejama je sredina med percentiloma */
    var sredinaZS = r('m', 'bench', kg((0.50 + 0.75) / 2, teza), teza);  /* BRON 65, SREBRO 35 */
    enako('sredina BRON-SREBRO → rang', sredinaZS.rang, 'BRON');
    enako('sredina BRON-SREBRO → odstotek', sredinaZS.odstotek, 50);
    blizu('sredina BRON-SREBRO → napredek', sredinaZS.napredek, 0.5);

    var sredinaZP = r('m', 'bench', kg((1.25 + 1.75) / 2, teza), teza);  /* ZLATO 12, PLATINA 4 */
    enako('sredina ZLATO-PLATINA → odstotek', sredinaZP.odstotek, 8);

    /* 5. nad diamantom: 1.25-kratnik meje da 1, vmes se interpolira, se vec ostane 1 */
    var tocnoDiamant = r('m', 'bench', kg(2.00, teza), teza);
    enako('diamantna meja → odstotek', tocnoDiamant.odstotek, 2);
    enako('diamantna meja → napredek', tocnoDiamant.napredek, 1);
    enako('diamantna meja → ni naslednjega', String(tocnoDiamant.naslednji), 'null');

    /* nad diamantno mejo (2) pada proti 1; po zaokrozitvi pade pri 1.5-kratniku meje */
    var malceNad = r('m', 'bench', kg(2.50, teza), teza);
    enako('2.50x → odstotek', malceNad.odstotek, 2);                     /* 1.75 → 2 */

    var tricetrt = r('m', 'bench', kg(3.50, teza), teza);
    enako('3.50x → odstotek', tricetrt.odstotek, 1);                     /* 1.25 → 1 */

    var robZgoraj = r('m', 'bench', kg(4.00, teza), teza);
    enako('dvakratnik diamanta → odstotek', robZgoraj.odstotek, 1);
    enako('dvakratnik diamanta → rang', robZgoraj.rang, 'DIAMANT');

    var dalecNad = r('m', 'bench', kg(6.00, teza), teza);
    enako('trikratnik diamanta → odstotek', dalecNad.odstotek, 1);

    /* 6. odstotek nikoli ne pade iz obmocja 1-99 */
    var vsiVObmocju = true;
    spoli.forEach(function (spol) {
      dvigi.forEach(function (dvig) {
        for (var k = 0; k <= 60; k++) {
          var kolicina = dvig === 'zgibi' ? k : k * 10;
          var x = r(spol, dvig, kolicina, teza);
          if (x.odstotek < 1 || x.odstotek > 99) vsiVObmocju = false;
        }
      });
    });
    vrni('odstotek ostane med 1 in 99 pri 488 vzorcih', vsiVObmocju, '1-99', vsiVObmocju ? 'da' : 'ne');

    /* 7. napredek je vedno med 0 in 1 in je 0 natanko na meji */
    var naMeji = r('m', 'pocep', kg(1.75, teza), teza);                  /* ZLATO */
    enako('natanko na zlati meji → rang', naMeji.rang, 'ZLATO');
    enako('natanko na zlati meji → napredek', naMeji.napredek, 0);

    /* 8. zgibi ne upostevajo telesne teze */
    var lahek = r('m', 'zgibi', 12, 60);
    var tezak = r('m', 'zgibi', 12, 120);
    enako('zgibi: teza ne vpliva na rang', lahek.rang, tezak.rang);
    enako('zgibi: teza ne vpliva na odstotek', lahek.odstotek, tezak.odstotek);
    enako('zgibi: 12 ponovitev → rang', lahek.rang, 'ZLATO');
    enako('zgibi: razmerje je prazno', String(lahek.razmerje), 'null');
    enako('zgibi: besedilo razmerja', lahek.razmerje_besedilo, '12×');

    /* 9. zenske meje so drugacne od moskih pri isti vrednosti */
    var mosk = r('m', 'bench', 60, 60);                                  /* razmerje 1.00 */
    var zens = r('z', 'bench', 60, 60);
    enako('moski, bench 1.00x → rang', mosk.rang, 'SREBRO');
    enako('zenska, bench 1.00x → rang', zens.rang, 'PLATINA');

    /* 10. deljenje ne sme zgresiti meje zaradi zaokrozitve */
    var tocno125 = r('m', 'bench', 112.5, 90);                           /* 1.25 */
    enako('112.5 kg pri 90 kg → rang', tocno125.rang, 'ZLATO');
    enako('112.5 kg pri 90 kg → odstotek', tocno125.odstotek, 12);

    var tocno03 = r('z', 'bench', 24, 80);                               /* 0.30 */
    enako('24 kg pri 80 kg (zenska) → rang', tocno03.rang, 'BRON');
    enako('24 kg pri 80 kg (zenska) → odstotek', tocno03.odstotek, 65);

    /* 11. besedilo razmerja in odstotka */
    var besedila = r('m', 'bench', 100, 73);                             /* 1.369863... */
    enako('besedilo razmerja se odreže navzdol', besedila.razmerje_besedilo, '1.36x');

    /* prikaz ne sme pokazati meje, ki ni dosezena */
    var tikPod = r('m', 'bench', 56, 75);                                /* 0.74666... */
    enako('tik pod srebrno mejo → besedilo razmerja', tikPod.razmerje_besedilo, '0.74x');
    enako('tik pod srebrno mejo → rang', tikPod.rang, 'BRON');

    var naMejiBesedilo = r('m', 'bench', 56.25, 75);                     /* natanko 0.75 */
    enako('natanko na srebrni meji → besedilo razmerja', naMejiBesedilo.razmerje_besedilo, '0.75x');
    enako('natanko na srebrni meji → rang', naMejiBesedilo.rang, 'SREBRO');
    enako('besedilo odstotka', besedila.odstotek_besedilo, 'TOP ' + besedila.odstotek + ' %');

    /* 12. desetinke telesne teze delujejo */
    var decimalke = r('m', 'mrtvi', 142.5, 95);                          /* 1.50 */
    enako('142.5 kg pri 95 kg → rang', decimalke.rang, 'SREBRO');
    enako('142.5 kg pri 95 kg → odstotek', decimalke.odstotek, 35);

    /* 13. nemogoci vnosi: meja je se sprejeta, karkoli nad njo ne */
    function nem(dvig, kolicina, teza) {
      return BR.nemogoc({ dvig: dvig, kolicina: kolicina, telesna_teza: teza || 80 });
    }

    [['bench', 3], ['pocep', 4], ['mrtvi', 5]].forEach(function (par) {
      var dvig = par[0], k = par[1], t = 80;
      enako(dvig + ': natanko ' + k + '× telesne teže je sprejeto',
            nem(dvig, k * t, t), null);
      vrni(dvig + ': malo čez ' + k + '× je zavrnjeno',
           nem(dvig, k * t + 0.5, t) !== null, 'zavrnjeno', 'zavrnjeno: ' + (nem(dvig, k * t + 0.5, t) !== null));
      enako(dvig + ': zavrnitev pove mejo',
            (nem(dvig, k * t + 0.5, t) || {}).meja, k);
      enako(dvig + ': polovica meje je sprejeta',
            nem(dvig, k * t / 2, t), null);
    });

    /* meja se mora premikati s telesno tezo, ne biti fiksna */
    enako('bench: 151 kg pri 50 kg je zavrnjeno', nem('bench', 151, 50) !== null, true);
    enako('bench: 150 kg pri 120 kg je sprejeto', nem('bench', 150, 120), null);

    enako('zgibi: natanko 60 ponovitev je sprejeto', nem('zgibi', 60), null);
    enako('zgibi: 61 ponovitev je zavrnjeno', nem('zgibi', 61) !== null, true);
    enako('zgibi: zavrnitev pove mejo', (nem('zgibi', 61) || {}).meja, 60);
    enako('zgibi: zavrnitev je označena kot ponovitve', (nem('zgibi', 61) || {}).zgibi, true);
    /* pri zgibih telesna teza na mejo ne vpliva */
    enako('zgibi: 40 ponovitev pri 50 kg je sprejeto', nem('zgibi', 40, 50), null);

    /* zaokrozitev pri deljenju ne sme zavrniti vnosa natanko na meji */
    enako('bench: 3× pri 73.3 kg je sprejeto', nem('bench', 3 * 73.3, 73.3), null);

    return izidi;
  }

  return { pozeni: pozeni };
})();
