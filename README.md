# Balkan Rank

Ena stran: obiskovalec vpiše svoj maksimalni dvig in telesno težo, dobi rang,
odstotek in kartico za objavo na TikToku in Instagramu. Brez računov, brez
prijave, brez zgodovine. Cel obisk traja pod 30 sekund.

Brez ogrodij in brez odvisnosti: čist HTML, CSS in JavaScript. Kartica se riše
v `<canvas>` in prenese kot PNG. Edino zaledje je Supabase, klican neposredno
iz brskalnika.

## Datoteke

| Datoteka | Kaj je v njej |
|---|---|
| `index.html` | ogrodje strani, obrazec, SVG utežne plošče |
| `stil.css` | videz; barve so barve tekmovalnih plošč (25 rdeča, 20 modra, 15 rumena, 10 zelena) |
| `app.js` | obrazec, preverjanje vnosa, rezultat, prenos, preklop jezika |
| `izracun.js` | meje rangov, rang, odstotek, napredek — brez DOM |
| `kartica.js` | risanje pokončne (1080×1350) in ležeče (1600×900) kartice |
| `jeziki.js` | vsa besedila za sl / sr / hr / en |
| `baza.js` | vstavljanje v Supabase in branje lestvice |
| `config.js` | URL in javni ključ Supabase |
| `baza.sql` | tabeli in pravila dostopa za Supabase |
| `testi.html`, `testi.js` | testi izračuna, 173 primerov; odpri v brskalniku |
| `pregled.html` | razvojni pregled obeh oblik kartice v vseh petih rangih |

## Lokalni zagon

Dvoklik na `index.html`. Strežnika ne potrebuje; vse datoteke se naložijo z diska.

## Supabase

1. V Supabase odpri **SQL Editor** in zaženi vsebino `baza.sql`. Nastaneta
   tabeli `vnosi` in `naslovi` ter pravila dostopa. Datoteko se sme zagnati
   večkrat; na obstoječi bazi doda samo tisto, česar še ni.
2. V `config.js` vpiši **Project URL** in **anon / publishable** ključ
   (Settings → API). Ključ `service_role` ne sme sem.

Ključ je v gitu namenoma: zasnovan je kot javen in v brskalnik pride tako ali
tako, dostop pa omejuje RLS. Brez njega objavljena stran ne bi imela nastavitev.

### Kaj je iz brskalnika dosegljivo

| | `vnosi` | `naslovi` |
|---|---|---|
| vstavljanje | da | da |
| branje | samo vrstice z vzdevkom in samo stolpci `dvig`, `spol`, `vzdevek`, `telesna_teza`, `kolicina`, `razmerje`, `rang` | ne |
| spreminjanje, brisanje | ne | ne |

E-naslovi so v ločeni tabeli `naslovi`, ki nima pravila za branje, zato do njih
od zunaj ni poti. Branje tabele `vnosi` je omejeno dvakrat: pravilo RLS pokaže
samo vrstice z vzdevkom, pravica `grant select (…)` pa samo naštete stolpce —
trajanje treniranja, jezik in čas vnosa ostanejo skriti.

## Lestvica

Kdor v obrazec vpiše vzdevek, pride na lestvico; brez vzdevka dobi samo kartico.
Lestvica je ločena za vsak dvig in vsak spol, razvrščena po razmerju do telesne
teže (pri zgibih po številu ponovitev) in pokaže prvih dvajset. Dokler na njej
ni vsaj deset vnosov, je skrita — pri treh ljudeh ne pove ničesar.

Vnosi nad mejo verjetnega se zavrnejo: bench nad 3× telesne teže, počep nad 4×,
mrtvi dvig nad 5× in zgibi nad 60 ponovitev.

## Objava na GitHub Pages

Stran je statična in v korenu repozitorija, zato ne potrebuje gradnje.

1. Na GitHubu naredi nov repozitorij.
2. Naloži vse datoteke iz te mape v koren repozitorija.
3. **Settings → Pages → Build and deployment → Source: Deploy from a branch**,
   veja `main`, mapa `/ (root)`, **Save**.
4. Čez minuto ali dve je stran na
   `https://<uporabnisko-ime>.github.io/<ime-repozitorija>/`.

Datoteka `.nojekyll` je tam zato, da GitHub datotek ne predela skozi Jekyll.

## Dodajanje jezika

Postopek je opisan na vrhu `jeziki.js`. Na kratko: nov vnos v `BR_JEZIKI`
(razlicica lahko s `osnova` podeduje besedila in prepiše le razlike), koda v
`BR_SEZNAM_JEZIKOV` in popravek seznama `brskalnik` pri sorodnem jeziku.
HTML se ne spreminja — gumbi v glavi se izrišejo iz seznama.

## Meje rangov

Razmerje je dvignjena teža deljena s telesno težo; pri zgibih šteje število
ponovitev. Rang je najvišja stopnja, katere mejo je rezultat dosegel.
Mejam ustrezajo percentili 65 / 35 / 12 / 4 / 2, vmes se linearno interpolira,
rezultat je omejen na 1–99. Številke so ocena, ne uradni podatek.
