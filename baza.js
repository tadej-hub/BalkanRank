/* Balkan Rank - Supabase.
   Samo vstavljanje, nobenega branja. Klici so "pošlji in pozabi":
   če baza ni nastavljena ali klic pade, obiskovalec tega ne občuti. */

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
      jezik: jezik
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
    naslov: naslov
  };
})();
