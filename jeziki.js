/* Balkan Rank - vsa besedila.
   Nikjer drugje v kodi ni besedila, ki bi ga videl obiskovalec.

   Dodajanje novega jezika:
   1. dodaj vnos v BR_JEZIKI; ce je razlicica obstojecega, nastavi "osnova"
      in napisi samo tiste kljuce, ki se razlikujejo,
   2. dodaj kodo v BR_SEZNAM_JEZIKOV, v vrstnem redu gumbov v glavi,
   3. popravi "brskalnik" pri sorodnih jezikih, da si predpon ne kradejo.
   Gumbi v glavi se izrisejo iz seznama; v index.html je zaradi strani brez
   skripta se vedno staticna kopija gumbov, ki jo je treba uskladiti.

   Jeziki: sl (besedilo je hkrati v index.html), sr (ekavica, latinica),
   hr (ijekavica) in en. sr in hr sta samostojna prevoda in ne podedujeta nicesar.

   Imena dvigov na kartici so vedno angleska in so v kartica.js. */

var BR_JEZIKI = {

  sl: {
    oznaka: 'SL',
    ime: 'Slovenščina',
    html_lang: 'sl',
    brskalnik: ['sl'],

    /* pristanek */
    naslov: 'Kakšen je tvoj rang?',
    podnapis: 'Bron, srebro, zlato, platina ali diamant? Vpiši svoj dvig in izvedi, koliko dvigalcev premagaš.',

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

    vzdevek: 'Vzdevek',
    namig_vzdevek: 'neobvezno',
    vzdevek_opomba: 'Vzdevek potrebuješ, da se uvrstiš na lestvico.',

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
    e_nemogoce_kg: 'Pri tem dvigu sprejmemo največ {meja}-kratnik telesne teže. Preveri številko.',
    e_nemogoce_pon: 'Sprejmemo največ {meja} ponovitev. Preveri številko.',
    e_vzdevek: 'Vzdevek naj ima od 2 do 20 znakov.',
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
    l_naslov: 'Koliko moraš dvigniti',
    l_opis: 'Meja za vsak rang, kot večkratnik telesne teže.',
    l_stolpec_rang: 'Rang',
    l_opomba_zgibi: 'Pri zgibih štejejo ponovitve: {zgibi}.',
    l_za_moske: 'za moške',
    l_za_zenske: 'za ženske',

    /* kratka lestvica nad obrazcem */
    kr_naslov: 'Najmočnejši',
    kr_gumb: 'Prikaži celotno lestvico',

    /* lestvica ljudi */
    r_naslov: 'Lestvica',
    r_opis: 'Najboljših dvajset po razmerju do telesne teže.',
    r_opis_zgibi: 'Najboljših dvajset po številu ponovitev.',
    r_mesto_stolpec: '#',
    r_vzdevek: 'Vzdevek',
    r_teza: 'Teža',
    r_razmerje: 'Razmerje',
    r_ponovitve: 'Ponovitve',
    r_rang: 'Rang',
    r_opomba: 'Na lestvico prideš z vzdevkom v obrazcu. Prikazani so vzdevek, telesna teža, razmerje in rang — nič drugega.',
    r_mesto: 'Si {mesto}. od {skupaj} na lestvici.',
    r_mesto_brez: 'Z vzdevkom bi bil tvoj rezultat {mesto}. od {skupaj}.',

    /* pogosta vprašanja */
    v_naslov: 'Pogosta vprašanja',
    v1_q: 'Kako se izračuna rang?',
    v1_a: 'Dvignjeno težo delimo s tvojo telesno težo, pri zgibih štejemo ponovitve. Rang je najvišja stopnja, katere mejo rezultat doseže. Odstotek se med dvema mejama linearno interpolira in je omejen na 1–99.',
    v2_q: 'Od kod podatki?',
    v2_a: 'Meje so postavljene po javno dostopnih podatkih o standardih moči, ne po meritvah obiskovalcev te strani. So ocena, ne uradni podatek.',
    v3_q: 'Ali je brezplačno?',
    v3_a: 'Da. E-naslov vpišeš samo ob prenosu kartice in se shrani skupaj z rangom in dvigom. Vzdevek je neobvezen; kdor ga vpiše, je z njim viden na lestvici.',

    /* noga */
    opozorilo: 'Številke so ocena na podlagi javno dostopnih podatkov o dvigih, ne uradni podatek.',
    primerjava: 'Primerjava z obiskovalci fitnesa.',
    kontakt: 'Kontakt:',

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

  /* srbscina: ekavica, latinica */
  sr: {
    oznaka: 'SR',
    ime: 'Srpski',
    html_lang: 'sr',
    brskalnik: ['sr'],

    /* pristanek */
    naslov: 'Koji je tvoj rang?',
    podnapis: 'Bronza, srebro, zlato, platina ili dijamant? Upiši šta dižeš i saznaj koliko dizača ostavljaš iza sebe.',

    /* obrazec */
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

    vzdevek: 'Nadimak',
    namig_vzdevek: 'nije obavezno',
    vzdevek_opomba: 'Da uđeš na rang listu, treba ti nadimak.',

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

    /* napake */
    e_kolicina_kg: 'Upiši podignutu težinu.',
    e_kolicina_pon: 'Upiši koliko ponavljanja radiš.',
    e_kolicina_meja: 'Taj broj ne izgleda tačno. Proveri ga.',
    e_teza: 'Upiši svoju telesnu težinu.',
    e_teza_meja: 'Telesna težina mora biti između 30 i 250 kg.',
    e_nemogoce_kg: 'Za ovu vežbu primamo najviše {meja}× telesnu težinu. Proveri broj.',
    e_nemogoce_pon: 'Primamo najviše {meja} ponavljanja. Proveri broj.',
    e_vzdevek: 'Nadimak mora imati od 2 do 20 znakova.',
    e_email: 'Upiši svoj e-mail.',
    e_email_oblika: 'Taj e-mail ne izgleda tačno. Proveri ga.',

    /* prenos */
    p_naslov: 'Upiši e-mail i preuzmi karticu',
    p_namig: 'ti@primer.com',
    p_gumb: 'Preuzmi karticu',
    p_tece: 'Preuzimam…',
    p_racunam: 'Računam…',
    p_opomba: 'Preuzimaju se oba formata: uspravni 1080 × 1350 i vodoravni 1600 × 900.',
    p_konec: 'Kartice su preuzete. Pogledaj u folderu sa preuzimanjima.',

    /* glava ob drsenju */
    g_cta: 'Izračunaj',

    /* lestvica mej */
    l_naslov: 'Koliko moraš da digneš',
    l_opis: 'Granica za svaki rang, kao višekratnik telesne težine.',
    l_stolpec_rang: 'Rang',
    l_opomba_zgibi: 'Kod zgibova se broje ponavljanja: {zgibi}.',
    l_za_moske: 'za muškarce',
    l_za_zenske: 'za žene',

    /* kratka lestvica nad obrazcem */
    kr_naslov: 'Najjači',
    kr_gumb: 'Prikaži celu rang listu',

    /* lestvica ljudi */
    r_naslov: 'Rang lista',
    r_opis: 'Najboljih dvadeset po odnosu prema telesnoj težini.',
    r_opis_zgibi: 'Najboljih dvadeset po broju ponavljanja.',
    r_mesto_stolpec: '#',
    r_vzdevek: 'Nadimak',
    r_teza: 'Težina',
    r_razmerje: 'Odnos',
    r_ponovitve: 'Ponavljanja',
    r_rang: 'Rang',
    r_opomba: 'Na rang listu ulaziš sa nadimkom iz obrasca. Prikazani su nadimak, telesna težina, odnos i rang — ništa drugo.',
    r_mesto: 'Ti si {mesto}. od {skupaj} na rang listi.',
    r_mesto_brez: 'Sa nadimkom bi tvoj rezultat bio {mesto}. od {skupaj}.',

    /* pogosta vprasanja */
    v_naslov: 'Česta pitanja',
    v1_q: 'Kako se računa rang?',
    v1_a: 'Podignutu težinu delimo tvojom telesnom težinom, a kod zgibova brojimo ponavljanja. Rang je najviši nivo čiju granicu tvoj rezultat dostigne. Procenat se između dve granice linearno interpolira i ograničen je na 1–99.',
    v2_q: 'Odakle podaci?',
    v2_a: 'Granice su postavljene prema javno dostupnim podacima o standardima snage, a ne prema merenjima posetilaca ove stranice. To je procena, nije zvaničan podatak.',
    v3_q: 'Da li je besplatno?',
    v3_a: 'Jeste. E-mail upisuješ samo pri preuzimanju kartice i čuva se zajedno sa rangom i vežbom. Nadimak nije obavezan; ko ga upiše, vidi se sa njim na rang listi.',

    /* noga */
    opozorilo: 'Brojke su procena na osnovu javno dostupnih podataka o dizanju, nisu zvaničan podatak.',
    primerjava: 'Poređenje sa posetiocima teretane.',
    kontakt: 'Kontakt:',

    /* kartica */
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

  /* hrvascina: ijekavica, standardni jezik */
  hr: {
    oznaka: 'HR',
    ime: 'Hrvatski',
    html_lang: 'hr',
    brskalnik: ['hr'],

    /* pristanek */
    naslov: 'Koji je tvoj rang?',
    podnapis: 'Bronca, srebro, zlato, platina ili dijamant? Upiši što dižeš i saznaj koliko dizača ostavljaš iza sebe.',

    /* obrazec */
    dvig: 'Vježba',
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

    teza: 'Tjelesna težina',
    namig_teza: '75',

    vzdevek: 'Nadimak',
    namig_vzdevek: 'neobavezno',
    vzdevek_opomba: 'Da uđeš na ljestvicu, treba ti nadimak.',

    spol: 'Spol',
    spol_m: 'muški',
    spol_z: 'ženski',

    trajanje: 'Treniram',
    trajanje_pod6m: 'manje od 6 mjeseci',
    trajanje_6_12m: '6–12 mjeseci',
    trajanje_1_3l: '1–3 godine',
    trajanje_3_5l: '3–5 godina',
    trajanje_nad5l: 'više od 5 godina',

    izracunaj: 'Izračunaj rang',

    /* napake */
    e_kolicina_kg: 'Upiši podignutu težinu.',
    e_kolicina_pon: 'Upiši koliko ponavljanja radiš.',
    e_kolicina_meja: 'Taj broj ne izgleda točno. Provjeri ga.',
    e_teza: 'Upiši svoju tjelesnu težinu.',
    e_teza_meja: 'Tjelesna težina mora biti između 30 i 250 kg.',
    e_nemogoce_kg: 'Za ovu vježbu primamo najviše {meja}× tjelesnu težinu. Provjeri broj.',
    e_nemogoce_pon: 'Primamo najviše {meja} ponavljanja. Provjeri broj.',
    e_vzdevek: 'Nadimak mora imati od 2 do 20 znakova.',
    e_email: 'Upiši svoj e-mail.',
    e_email_oblika: 'Taj e-mail ne izgleda točno. Provjeri ga.',

    /* prenos */
    p_naslov: 'Upiši e-mail i preuzmi karticu',
    p_namig: 'ti@primjer.com',
    p_gumb: 'Preuzmi karticu',
    p_tece: 'Preuzimam…',
    p_racunam: 'Računam…',
    p_opomba: 'Preuzimaju se oba formata: uspravni 1080 × 1350 i vodoravni 1600 × 900.',
    p_konec: 'Kartice su preuzete. Pogledaj u mapi s preuzimanjima.',

    /* glava ob drsenju */
    g_cta: 'Izračunaj',

    /* lestvica mej */
    l_naslov: 'Koliko moraš dignuti',
    l_opis: 'Granica za svaki rang, kao višekratnik tjelesne težine.',
    l_stolpec_rang: 'Rang',
    l_opomba_zgibi: 'Kod zgibova se broje ponavljanja: {zgibi}.',
    l_za_moske: 'za muškarce',
    l_za_zenske: 'za žene',

    /* kratka lestvica nad obrazcem */
    kr_naslov: 'Najjači',
    kr_gumb: 'Prikaži cijelu ljestvicu',

    /* lestvica ljudi */
    r_naslov: 'Ljestvica',
    r_opis: 'Najboljih dvadeset po odnosu prema tjelesnoj težini.',
    r_opis_zgibi: 'Najboljih dvadeset po broju ponavljanja.',
    r_mesto_stolpec: '#',
    r_vzdevek: 'Nadimak',
    r_teza: 'Težina',
    r_razmerje: 'Omjer',
    r_ponovitve: 'Ponavljanja',
    r_rang: 'Rang',
    r_opomba: 'Na ljestvicu ulaziš s nadimkom iz obrasca. Prikazani su nadimak, tjelesna težina, omjer i rang — ništa drugo.',
    r_mesto: 'Ti si {mesto}. od {skupaj} na ljestvici.',
    r_mesto_brez: 'S nadimkom bi tvoj rezultat bio {mesto}. od {skupaj}.',

    /* pogosta vprasanja */
    v_naslov: 'Česta pitanja',
    v1_q: 'Kako se računa rang?',
    v1_a: 'Podignutu težinu dijelimo tvojom tjelesnom težinom, a kod zgibova brojimo ponavljanja. Rang je najviša razina čiju granicu tvoj rezultat dosegne. Postotak se između dvije granice linearno interpolira i ograničen je na 1–99.',
    v2_q: 'Odakle podaci?',
    v2_a: 'Granice su postavljene prema javno dostupnim podacima o standardima snage, a ne prema mjerenjima posjetitelja ove stranice. To je procjena, nije službeni podatak.',
    v3_q: 'Je li besplatno?',
    v3_a: 'Da. E-mail upisuješ samo pri preuzimanju kartice i sprema se zajedno s rangom i vježbom. Nadimak nije obavezan; tko ga upiše, vidi se s njim na ljestvici.',

    /* noga */
    opozorilo: 'Brojke su procjena na temelju javno dostupnih podataka o dizanju, nisu službeni podatak.',
    primerjava: 'Usporedba s posjetiteljima teretane.',
    kontakt: 'Kontakt:',

    /* kartica */
    znamka: 'BALKAN RANK',
    k_enota_kg: 'KG',
    k_enota_pon: '×',
    k_do: 'DO',
    k_ti: 'TI',
    k_vrh: 'VRH',
    k_telesna_teza: 'TJELESNA TEŽINA',
    k_ponovitve: 'PONAVLJANJA',
    k_rang: 'RANG',
    rangi: {
      BRON: 'BRONCA', SREBRO: 'SREBRO', ZLATO: 'ZLATO',
      PLATINA: 'PLATINA', DIAMANT: 'DIJAMANT'
    }
  },

  en: {
    oznaka: 'EN',
    ime: 'English',
    html_lang: 'en',
    brskalnik: ['en'],

    naslov: 'What is your rank?',
    podnapis: 'Bronze, silver, gold, platinum or diamond? Enter your lift and find out how many lifters you beat.',

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

    vzdevek: 'Nickname',
    namig_vzdevek: 'optional',
    vzdevek_opomba: 'You need a nickname to get on the leaderboard.',

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
    e_nemogoce_kg: 'For this lift we accept at most {meja}× body weight. Check the number.',
    e_nemogoce_pon: 'We accept at most {meja} reps. Check the number.',
    e_vzdevek: 'A nickname should be 2 to 20 characters.',
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

    l_naslov: 'How much you need to lift',
    l_opis: 'The threshold for each rank, as a multiple of body weight.',
    l_stolpec_rang: 'Rank',
    l_opomba_zgibi: 'Pull-ups count reps: {zgibi}.',
    l_za_moske: 'for men',
    l_za_zenske: 'for women',

    kr_naslov: 'Strongest',
    kr_gumb: 'Show the full leaderboard',

    r_naslov: 'Leaderboard',
    r_opis: 'The top twenty by ratio to body weight.',
    r_opis_zgibi: 'The top twenty by number of reps.',
    r_mesto_stolpec: '#',
    r_vzdevek: 'Nickname',
    r_teza: 'Weight',
    r_razmerje: 'Ratio',
    r_ponovitve: 'Reps',
    r_rang: 'Rank',
    r_opomba: 'You get on the leaderboard by entering a nickname in the form. It shows nickname, body weight, ratio and rank — nothing else.',
    r_mesto: 'You are #{mesto} of {skupaj} on the leaderboard.',
    r_mesto_brez: 'With a nickname your result would be #{mesto} of {skupaj}.',

    v_naslov: 'Common questions',
    v1_q: 'How is the rank calculated?',
    v1_a: 'We divide the weight you lift by your body weight, and for pull-ups we count reps. Your rank is the highest tier whose threshold you reach. The percentage is interpolated linearly between two thresholds and clamped to 1–99.',
    v2_q: 'Where does the data come from?',
    v2_a: 'The thresholds come from publicly available strength standards, not from measuring visitors to this site. They are an estimate, not an official figure.',
    v3_q: 'Is it free?',
    v3_a: 'Yes. You only enter your email when downloading the card, and it is stored together with your rank and lift. The nickname is optional; if you enter one, it is shown with you on the leaderboard.',

    opozorilo: 'These numbers are an estimate based on publicly available lifting data, not an official figure.',
    primerjava: 'Compared with gym-goers.',
    kontakt: 'Contact:',

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
var BR_SEZNAM_JEZIKOV = ['sl', 'sr', 'hr', 'en'];

var BR_JEZIK = (function () {
  'use strict';

  var KLJUC = 'balkan-rank-jezik-2';
  var PRIVZETI = 'en';

  /* Stari kljuc je hranil tudi regionalno izbiro (koda "sr", prej "bhs" ali
     "rs"). Kode "sr" ni mogoce locevati od nove srbscine, zato iz starega
     kljuca prenesemo samo "sl" in "en"; vse ostalo tiho zavrzemo in obiskovalec
     dobi navaden zacetni jezik. */
  var STARI_KLJUC = 'balkan-rank-jezik';
  var PRENESLJIVE = { sl: true, en: true };

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
      if (!k) {
        var staro = localStorage.getItem(STARI_KLJUC);
        if (staro !== null) {
          localStorage.removeItem(STARI_KLJUC);
          if (PRENESLJIVE[staro]) {
            localStorage.setItem(KLJUC, staro);
            k = staro;
          }
        }
      }
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
