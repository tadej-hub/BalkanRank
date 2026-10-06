/* Balkan Rank - vsa besedila.
   Nikjer drugje v kodi ni besedila, ki bi ga videl obiskovalec.

   Dodajanje novega jezika:
   1. dodaj vnos v BR_JEZIKI; ce je razlicica obstojecega, nastavi "osnova"
      in napisi samo tiste kljuce, ki se razlikujejo,
   2. dodaj kodo v BR_SEZNAM_JEZIKOV, v vrstnem redu gumbov v glavi,
   3. popravi "brskalnik" pri sorodnih jezikih, da si predpon ne kradejo.
   Gumbi v glavi se izrisejo iz seznama, HTML se ne spreminja.

   Primer, ko bo prisla locena hrvaska razlicica:
     hr: { osnova: 'sr', oznaka: 'hr', html_lang: 'hr', brskalnik: ['hr'],
           teza: 'Tjelesna težina', trajanje_pod6m: 'manje od 6 mjeseci', ... }
   in iz sr.brskalnik odstranis 'hr'.

   Imena dvigov na kartici so vedno angleska in so v kartica.js. */

var BR_JEZIKI = {

  sl: {
    oznaka: 'slo',
    html_lang: 'sl',
    brskalnik: ['sl'],

    /* pristanek */
    naslov: 'Kakšen je tvoj rang?',
    podnapis: 'V petnajstih sekundah izveš, kje si med ljudmi svoje teže, in dobiš kartico za objavo.',

    /* obrazec */
    dvig: 'Dvig',
    dvig_bench: 'Bench press',
    dvig_pocep: 'Počep',
    dvig_mrtvi: 'Mrtvi dvig',
    dvig_zgibi: 'Zgibi',

    kolicina_kg: 'Dvignjena teža',
    kolicina_pon: 'Koliko ponovitev',
    enota_kg: 'kg',
    enota_pon: '×',
    namig_kg: '0',
    namig_pon: '0',

    teza: 'Telesna teža',
    namig_teza: '75',

    spol: 'Spol',
    spol_m: 'moški',
    spol_z: 'ženska',

    trajanje: 'Treniram',
    trajanje_pod6m: 'manj kot 6 mesecev',
    trajanje_6_12m: '6–12 mesecev',
    trajanje_1_3l: '1–3 leta',
    trajanje_3_5l: '3–5 let',
    trajanje_nad5l: 'več kot 5 let',

    izracunaj: 'Izračunaj rang',

    /* napake */
    e_kolicina_kg: 'Vpiši dvignjeno težo.',
    e_kolicina_pon: 'Vpiši, koliko ponovitev narediš.',
    e_kolicina_meja: 'Ta številka ni videti prava. Preveri jo.',
    e_teza: 'Vpiši svojo telesno težo.',
    e_teza_meja: 'Telesna teža naj bo med 30 in 250 kg.',
    e_email: 'Vpiši svoj e-naslov.',
    e_email_oblika: 'Ta e-naslov ni videti pravi. Preveri ga.',

    /* prenos */
    p_naslov: 'Vpiši e-naslov in prenesi kartico',
    p_namig: 'ti@primer.com',
    p_gumb: 'Prenesi kartico',
    p_tece: 'Prenašam…',
    p_racunam: 'Računam…',
    p_opomba: 'Preneseta se obe obliki: pokončna 1080 × 1350 in ležeča 1600 × 900.',
    p_konec: 'Kartici sta preneseni. Poglej v mapo s prenosi.',

    /* glava ob drsenju */
    g_cta: 'Izračunaj',

    /* lestvica mej */
    l_naslov: 'Kaj moraš dvigniti',
    l_opis: 'Meja za vsak rang, kot večkratnik telesne teže.',
    l_stolpec_rang: 'Rang',
    l_opomba_zgibi: 'Pri zgibih štejejo ponovitve: {zgibi}.',
    l_za_moske: 'za moške',
    l_za_zenske: 'za ženske',

    /* pogosta vprašanja */
    v_naslov: 'Pogosta vprašanja',
    v1_q: 'Kako se izračuna rang?',
    v1_a: 'Dvignjeno težo delimo s tvojo telesno težo, pri zgibih štejemo ponovitve. Rang je najvišja stopnja, katere mejo rezultat doseže. Odstotek se med dvema mejama linearno interpolira in je omejen na 1–99.',
    v2_q: 'Od kod podatki?',
    v2_a: 'Meje so postavljene po javno dostopnih podatkih o standardih moči, ne po meritvah obiskovalcev te strani. So ocena, ne uradni podatek.',
    v3_q: 'Ali je brezplačno?',
    v3_a: 'Da. E-naslov vpišeš samo ob prenosu kartice in se shrani skupaj z rangom in dvigom.',

    /* noga */
    opozorilo: 'Številke so ocena na podlagi javno dostopnih podatkov o dvigih, ne uradni podatek.',
    primerjava: 'Primerjava z obiskovalci fitnesa.',

    /* kartica */
    znamka: 'BALKAN RANK',
    k_enota_kg: 'KG',
    k_enota_pon: '×',
    k_do: 'DO',
    k_ti: 'TI',
    k_vrh: 'VRH',
    k_telesna_teza: 'TELESNA TEŽA',
    k_ponovitve: 'PONOVITVE',
    k_rang: 'RANG',
    rangi: {
      BRON: 'BRON', SREBRO: 'SREBRO', ZLATO: 'ZLATO',
      PLATINA: 'PLATINA', DIAMANT: 'DIAMANT'
    }
  },

  /* ekavica; dokler ni locene hrvaske razlicice, pokriva vso regijo,
     zato je oznaka na gumbu se vedno "bhs" */
  sr: {
    oznaka: 'bhs',
    html_lang: 'sr-Latn',
    brskalnik: ['sr', 'bs', 'sh', 'hr'],

    naslov: 'Koji je tvoj rang?',
    podnapis: 'Za petnaest sekundi saznaš gde si među ljudima svoje težine i dobiješ karticu za objavu.',

    dvig: 'Vežba',
    dvig_bench: 'Bench press',
    dvig_pocep: 'Čučanj',
    dvig_mrtvi: 'Mrtvo dizanje',
    dvig_zgibi: 'Zgibovi',

    kolicina_kg: 'Podignuta težina',
    kolicina_pon: 'Koliko ponavljanja',
    enota_kg: 'kg',
    enota_pon: '×',
    namig_kg: '0',
    namig_pon: '0',

    teza: 'Telesna težina',
    namig_teza: '75',

    spol: 'Pol',
    spol_m: 'muški',
    spol_z: 'ženski',

    trajanje: 'Treniram',
    trajanje_pod6m: 'manje od 6 meseci',
    trajanje_6_12m: '6–12 meseci',
    trajanje_1_3l: '1–3 godine',
    trajanje_3_5l: '3–5 godina',
    trajanje_nad5l: 'više od 5 godina',

    izracunaj: 'Izračunaj rang',

    e_kolicina_kg: 'Upiši podignutu težinu.',
    e_kolicina_pon: 'Upiši koliko ponavljanja radiš.',
    e_kolicina_meja: 'Taj broj ne izgleda tačno. Proveri ga.',
    e_teza: 'Upiši svoju telesnu težinu.',
    e_teza_meja: 'Telesna težina treba da bude između 30 i 250 kg.',
    e_email: 'Upiši svoj e-mail.',
    e_email_oblika: 'Taj e-mail ne izgleda tačno. Proveri ga.',

    p_naslov: 'Upiši e-mail i preuzmi karticu',
    p_namig: 'ti@primer.com',
    p_gumb: 'Preuzmi karticu',
    p_tece: 'Preuzimam…',
    p_racunam: 'Računam…',
    p_opomba: 'Preuzimaju se oba formata: uspravni 1080 × 1350 i vodoravni 1600 × 900.',
    p_konec: 'Kartice su preuzete. Pogledaj u folder sa preuzimanjima.',

    g_cta: 'Izračunaj',

    l_naslov: 'Šta moraš da digneš',
    l_opis: 'Granica za svaki rang, kao umnožak telesne težine.',
    l_stolpec_rang: 'Rang',
    l_opomba_zgibi: 'Kod zgibova se broje ponavljanja: {zgibi}.',
    l_za_moske: 'za muškarce',
    l_za_zenske: 'za žene',

    v_naslov: 'Česta pitanja',
    v1_q: 'Kako se računa rang?',
    v1_a: 'Podignutu težinu delimo tvojom telesnom težinom, a kod zgibova brojimo ponavljanja. Rang je najviši stepen čiju granicu rezultat dostigne. Procenat se između dve granice linearno interpolira i ograničen je na 1–99.',
    v2_q: 'Odakle podaci?',
    v2_a: 'Granice su postavljene po javno dostupnim podacima o standardima snage, ne po merenju posetilaca ove stranice. To je procena, nije zvaničan podatak.',
    v3_q: 'Da li je besplatno?',
    v3_a: 'Jeste. E-mail upisuješ samo pri preuzimanju kartice i čuva se zajedno sa rangom i vežbom.',

    opozorilo: 'Brojke su procena na osnovu javno dostupnih podataka o dizanju, nisu zvaničan podatak.',
    primerjava: 'Poređenje sa posetiocima teretane.',

    znamka: 'BALKAN RANK',
    k_enota_kg: 'KG',
    k_enota_pon: '×',
    k_do: 'DO',
    k_ti: 'TI',
    k_vrh: 'VRH',
    k_telesna_teza: 'TELESNA TEŽINA',
    k_ponovitve: 'PONAVLJANJA',
    k_rang: 'RANG',
    rangi: {
      BRON: 'BRONZA', SREBRO: 'SREBRO', ZLATO: 'ZLATO',
      PLATINA: 'PLATINA', DIAMANT: 'DIJAMANT'
    }
  },

  en: {
    oznaka: 'en',
    html_lang: 'en',
    brskalnik: ['en'],

    naslov: 'What is your rank?',
    podnapis: 'In fifteen seconds you find out where you stand among people your weight, and you get a card to post.',

    dvig: 'Lift',
    dvig_bench: 'Bench press',
    dvig_pocep: 'Squat',
    dvig_mrtvi: 'Deadlift',
    dvig_zgibi: 'Pull-ups',

    kolicina_kg: 'Weight lifted',
    kolicina_pon: 'How many reps',
    enota_kg: 'kg',
    enota_pon: '×',
    namig_kg: '0',
    namig_pon: '0',

    teza: 'Body weight',
    namig_teza: '75',

    spol: 'Sex',
    spol_m: 'male',
    spol_z: 'female',

    trajanje: 'Training for',
    trajanje_pod6m: 'less than 6 months',
    trajanje_6_12m: '6–12 months',
    trajanje_1_3l: '1–3 years',
    trajanje_3_5l: '3–5 years',
    trajanje_nad5l: 'more than 5 years',

    izracunaj: 'Get my rank',

    e_kolicina_kg: 'Enter the weight you lift.',
    e_kolicina_pon: 'Enter how many reps you do.',
    e_kolicina_meja: 'That number does not look right. Check it.',
    e_teza: 'Enter your body weight.',
    e_teza_meja: 'Body weight should be between 30 and 250 kg.',
    e_email: 'Enter your email.',
    e_email_oblika: 'That email does not look right. Check it.',

    p_naslov: 'Enter your email and download the card',
    p_namig: 'you@example.com',
    p_gumb: 'Download card',
    p_tece: 'Downloading…',
    p_racunam: 'Calculating…',
    p_opomba: 'Both formats download: portrait 1080 × 1350 and landscape 1600 × 900.',
    p_konec: 'Both cards downloaded. Check your downloads folder.',

    g_cta: 'Get rank',

    l_naslov: 'What you need to lift',
    l_opis: 'The threshold for each rank, as a multiple of body weight.',
    l_stolpec_rang: 'Rank',
    l_opomba_zgibi: 'Pull-ups count reps: {zgibi}.',
    l_za_moske: 'for men',
    l_za_zenske: 'for women',

    v_naslov: 'Common questions',
    v1_q: 'How is the rank calculated?',
    v1_a: 'We divide the weight you lift by your body weight, and for pull-ups we count reps. Your rank is the highest tier whose threshold you reach. The percentage is interpolated linearly between two thresholds and clamped to 1–99.',
    v2_q: 'Where does the data come from?',
    v2_a: 'The thresholds come from publicly available strength standards, not from measuring visitors to this site. They are an estimate, not an official figure.',
    v3_q: 'Is it free?',
    v3_a: 'Yes. You only enter your email when downloading the card, and it is stored together with your rank and lift.',

    opozorilo: 'These numbers are an estimate based on publicly available lifting data, not an official figure.',
    primerjava: 'Compared with gym-goers.',

    znamka: 'BALKAN RANK',
    k_enota_kg: 'KG',
    k_enota_pon: '×',
    k_do: 'UP TO',
    k_ti: 'YOU',
    k_vrh: 'TOP',
    k_telesna_teza: 'BODY WEIGHT',
    k_ponovitve: 'REPS',
    k_rang: 'RANK',
    rangi: {
      BRON: 'BRONZE', SREBRO: 'SILVER', ZLATO: 'GOLD',
      PLATINA: 'PLATINUM', DIAMANT: 'DIAMOND'
    }
  }
};

/* vrstni red gumbov v glavi */
var BR_SEZNAM_JEZIKOV = ['sl', 'sr', 'en'];

var BR_JEZIK = (function () {
  'use strict';

  var KLJUC = 'balkan-rank-jezik';
  var PRIVZETI = 'en';

  /* kode, ki so se v brskalnikih obiskovalcev ze shranile pod starim imenom */
  var STARE_KODE = { bhs: 'sr', rs: 'sr' };

  /* razlicica podeduje besedila osnove in prepise samo svoja */
  function razresiOsnove() {
    Object.keys(BR_JEZIKI).forEach(function (k) {
      var j = BR_JEZIKI[k];
      if (!j.osnova || !BR_JEZIKI[j.osnova]) return;
      var osnova = BR_JEZIKI[j.osnova];
      Object.keys(osnova).forEach(function (kljuc) {
        if (j[kljuc] === undefined) {
          j[kljuc] = osnova[kljuc];
        } else if (kljuc === 'rangi') {
          var zdruzeni = {};
          Object.keys(osnova.rangi).forEach(function (r) { zdruzeni[r] = osnova.rangi[r]; });
          Object.keys(j.rangi).forEach(function (r) { zdruzeni[r] = j.rangi[r]; });
          j.rangi = zdruzeni;
        }
      });
    });
  }
  razresiOsnove();

  function izBrskalnika() {
    var seznam = navigator.languages || [navigator.language || ''];
    for (var i = 0; i < seznam.length; i++) {
      var oznaka = String(seznam[i]).toLowerCase();
      for (var j = 0; j < BR_SEZNAM_JEZIKOV.length; j++) {
        var koda = BR_SEZNAM_JEZIKOV[j];
        var predpone = BR_JEZIKI[koda].brskalnik || [koda];
        for (var p = 0; p < predpone.length; p++) {
          if (oznaka.indexOf(predpone[p]) === 0) return koda;
        }
      }
    }
    return PRIVZETI;
  }

  function shranjen() {
    try {
      var k = localStorage.getItem(KLJUC);
      if (k && STARE_KODE[k]) k = STARE_KODE[k];
      return BR_JEZIKI[k] ? k : null;
    } catch (e) {
      return null;   /* zasebno okno ali blokiran pomnilnik */
    }
  }

  function shrani(k) {
    try { localStorage.setItem(KLJUC, k); } catch (e) { /* ni usodno */ }
  }

  return {
    zacetni: function () { return shranjen() || izBrskalnika(); },
    shrani: shrani
  };
})();
