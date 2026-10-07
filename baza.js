/* Balkan Rank - Supabase.
   Vstavljanje je "pošlji in pozabi": če baza ni nastavljena ali klic pade,
   obiskovalec tega ne občuti. Bere se samo lestvica, in še ta le stolpce,
   ki jih pravilo v bazi dovoli; e-naslovi so v drugi tabeli, ki je ni mogoče
   brati. Kadar branje ne uspe, vrnemo null in lestvica preprosto ostane skrita. */

var BRBaza = (function () {
  'use strict';

  var N = (typeof BR_NASTAVITVE !== 'undefined') ? BR_NASTAVITVE : {};

  function nastavljeno() {
    return !!(N.supabase_url && N.supabase_anon);
  }

  function vstavi(tabela, vrstica) {
    if (!nastavljeno()) return Promise.resolve(false);

    var naslov = String(N.supabase_url).replace(/\/+$/, '') + '/rest/v1/' + tabela;

    return fetch(naslov, {
      method: 'POST',
      headers: {
        'apikey': N.supabase_anon,
        'Authorization': 'Bearer ' + N.supabase_anon,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(vrstica)
    }).then(function (odgovor) {
      if (!odgovor.ok) console.warn('Supabase ' + tabela + ': ' + odgovor.status);
      return odgovor.ok;
    }).catch(function (e) {
      console.warn('Supabase ' + tabela + ':', e);
      return false;
    });
  }

  /* ob izracunu */
  function vnos(v, izid, jezik) {
    return vstavi('vnosi', {
      dvig: v.dvig,
      spol: v.spol,
      kolicina: v.kolicina,
      telesna_teza: v.telesna_teza,
      trajanje_treniranja: v.trajanje_treniranja,
      razmerje: izid.razmerje,          /* pri zgibih null */
      rang: izid.rang,
      odstotek: izid.odstotek,
      jezik: jezik,
      vzdevek: v.vzdevek || null        /* brez njega vnos ni na lestvici */
    });
  }

  /* ---------- lestvica ---------- */

  /* pri zgibih se razvrsca po ponovitvah, sicer po razmerju do telesne teze */
  function stolpecRazvrstitve(dvig) {
    return dvig === 'zgibi' ? 'kolicina' : 'razmerje';
  }

  function osnova(dvig, spol) {
    return '/rest/v1/vnosi?select=vzdevek,telesna_teza,kolicina,razmerje,rang' +
           '&dvig=eq.' + encodeURIComponent(dvig) +
           '&spol=eq.' + encodeURIComponent(spol) +
           '&vzdevek=not.is.null';
  }

  function beri(pot, obseg) {
    if (!nastavljeno()) return Promise.resolve(null);

    return fetch(String(N.supabase_url).replace(/\/+$/, '') + pot, {
      method: 'GET',
      headers: {
        'apikey': N.supabase_anon,
        'Authorization': 'Bearer ' + N.supabase_anon,
        'Accept': 'application/json',
        'Range-Unit': 'items',
        'Range': obseg,
        'Prefer': 'count=exact'
      }
    }).then(function (odgovor) {
      /* 206 je obicajen odgovor, kadar je vrstic vec, kot smo jih zahtevali */
      if (!odgovor.ok && odgovor.status !== 206) {
        console.warn('Supabase lestvica: ' + odgovor.status);
        return null;
      }
      /* glava je oblike "0-19/47"; za nas je zanimiv samo skupni seštevek */
      var obsegGlava = odgovor.headers.get('content-range') || '';
      var skupaj = parseInt(obsegGlava.split('/')[1], 10);
      return odgovor.json().then(function (vrstice) {
        return { vrstice: vrstice || [], skupaj: isFinite(skupaj) ? skupaj : (vrstice || []).length };
      });
    }).catch(function (e) {
      console.warn('Supabase lestvica:', e);
      return null;
    });
  }

  /* prvih "koliko" na lestvici za izbrani dvig in spol, s skupnim stevilom */
  function lestvica(dvig, spol, koliko) {
    var n = koliko || 20;
    /* razvrscamo samo po stolpcu, ki ga pravilo v bazi dovoli brati;
       po casu vnosa namenoma ne, ker ta stolpec od zunaj ni viden */
    var pot = osnova(dvig, spol) +
              '&order=' + stolpecRazvrstitve(dvig) + '.desc' +
              '&limit=' + n;
    return beri(pot, '0-' + (n - 1));
  }

  /* koliko vnosov je strogo boljsih od dane vrednosti */
  function boljsih(dvig, spol, vrednost) {
    var pot = osnova(dvig, spol) +
              '&' + stolpecRazvrstitve(dvig) + '=gt.' + encodeURIComponent(vrednost) +
              '&limit=1';
    return beri(pot, '0-0').then(function (o) {
      return o ? o.skupaj : null;
    });
  }

  /* ob prenosu kartice */
  function naslov(email, rang, dvig) {
    return vstavi('naslovi', {
      email: email,
      rang: rang,
      dvig: dvig
    });
  }

  return {
    nastavljeno: nastavljeno,
    vstavi: vstavi,
    vnos: vnos,
    naslov: naslov,
    lestvica: lestvica,
    boljsih: boljsih
  };
})();
