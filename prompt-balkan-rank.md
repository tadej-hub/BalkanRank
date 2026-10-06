# Balkan Rank — navodila za izdelavo

## Kaj gradimo

Spletna stran, kjer obiskovalec vpiše svoj maksimalni dvig in telesno težo,
izračuna se mu rang in odstotek, in prenese si kartico s svojim rezultatom.
Kartica je narejena za objavo na TikToku in Instagramu.

To **ni** aplikacija za beleženje treningov. Nima računov, prijave in
zgodovine. Obiskovalec pride, vpiše dve številki, dobi sliko, odide.
Cel obisk mora trajati pod 30 sekund.

## Tehnične zahteve

- Ena HTML stran, brez ogrodij (brez React, Vue, Next)
- CSS in JavaScript vdelana v isto datoteko ali v dve ločeni poleg nje
- Kartica se riše v `<canvas>` v brskalniku in prenese kot PNG
- Edino zaledje je Supabase (baza), klican neposredno iz brskalnika
- Gostovanje: GitHub Pages
- Mobilni zaslon je glavni; namizni mora delovati, ni pa prioriteta

## Potek uporabe

1. Pristanek: naslov, kratek podnapis, obrazec
2. Obrazec:
   - **Dvig** (izbira): Bench press / Počep / Mrtvi dvig / Zgibi
   - **Spol** (izbira): moški / ženska
   - **Koliko** (število): kilogrami — pri zgibih ponovitve, oznaka polja
     se mora samodejno spremeniti
   - **Telesna teža** (število, kg)
   - **Koliko časa treniraš** (izbira): manj kot 6 mesecev / 6–12 mesecev /
     1–3 leta / 3–5 let / več kot 5 let
3. Gumb → izračun → kartica se prikaže na zaslonu
4. Pod kartico polje za e-naslov. Kartica se prenese šele, ko je vpisan
   veljaven e-naslov. Prenesejo se obe obliki (pokončna in ležeča).
5. Vnos se shrani v Supabase ob izračunu, e-naslov ob prenosu

## Izračun ranga

Razmerje = dvignjeni kilogrami / telesna teža.
Pri zgibih se namesto razmerja uporabi število ponovitev.

### Moški (razmerje do telesne teže)

| Dvig | BRON | SREBRO | ZLATO | PLATINA | DIAMANT |
|---|---|---|---|---|---|
| Bench press | 0.50 | 0.75 | 1.25 | 1.75 | 2.00 |
| Počep | 0.75 | 1.25 | 1.75 | 2.25 | 2.75 |
| Mrtvi dvig | 1.00 | 1.50 | 2.00 | 2.50 | 3.00 |
| Zgibi (ponovitve) | 1 | 5 | 10 | 15 | 20 |

### Ženske

| Dvig | BRON | SREBRO | ZLATO | PLATINA | DIAMANT |
|---|---|---|---|---|---|
| Bench press | 0.30 | 0.50 | 0.75 | 1.00 | 1.35 |
| Počep | 0.50 | 0.85 | 1.25 | 1.75 | 2.25 |
| Mrtvi dvig | 0.60 | 1.00 | 1.50 | 2.00 | 2.50 |
| Zgibi (ponovitve) | 1 | 2 | 5 | 9 | 13 |

Rang = najvišja stopnja, katere mejo je rezultat dosegel.
Pod prvo mejo je rang še vedno BRON.

### Odstotek

Vsaki meji ustreza percentil: BRON 95, SREBRO 80, ZLATO 50, PLATINA 20,
DIAMANT 5. Med dvema mejama se linearno interpolira.
Prikaže se kot "TOP X %". Omeji na razpon 1–99.

Te številke so ocena, ne uradni podatek — to naj piše v nogi strani.

### Napredek do naslednje stopnje

Delež poti med trenutno in naslednjo mejo, 0 do 1. Pri DIAMANT je 1.

## Kartica

Dve obliki, obe se prenese: **1080×1350** (pokončna) in **1600×900** (ležeča).

Postavitev pokončne, od vrha navzdol:
1. Šesterokotna značka z imenom ranga
2. Ime dviga, razprte črke
3. Velika številka s kovinskim prelivom in izrazito senco (glavni element)
4. Enota: "KG" ali "X" pri zgibih
5. Plošča z "TOP X %" in pod njo kategorija telesne teže
6. Vrstica napredka do naslednjega ranga, levo "TI", desno ime naslednjega
7. Spodaj levo razmerje (npr. "1.37x") in napis "TELESNA TEŽA",
   spodaj desno ime ranga
8. **"BALKAN RANK" mora biti vidno na kartici** — v nogi ali pod značko
9. Debela kovinska obroba z 3D učinkom (bevel): svetloba zgoraj levo,
   senca spodaj desno, vijaki v kotih — videti mora kot plaketa

Ležeča: številka levo, odstotek in napredek desno, navpična ločnica vmes.

### Barve po rangih

Vsak rang ima svojo paleto (ozadje, kovinski preliv številke, poudarek,
barva obrobe). Od zlata naprej dodaj žarke v ozadju in iskre.

| Rang | Smer barve |
|---|---|
| BRON | topli rjavi in bakreni toni |
| SREBRO | hladni sivi in beli |
| ZLATO | temno zlata do svetlo rumena |
| PLATINA | svetlo modro-zelena, skoraj bela |
| DIAMANT | modra v vijolično, prelivajoče |

Ozadje kartice je temno. Pisava: Poppins Bold za številke in naslove.

Priložena je Python skripta `kartice.py`, ki te kartice že riše — uporabi
jo kot predlogo za barve, razmike in postavitev. Prepiši jo v canvas,
ne izumljaj novega videza.

## Supabase

Dve tabeli:

**vnosi** — vsak izračun
- id, ustvarjeno (časovna značka)
- dvig, spol, kolicina, telesna_teza, trajanje_treniranja
- razmerje, rang, odstotek
- jezik

**naslovi** — e-naslovi
- id, ustvarjeno, email, rang, dvig

Pišeta se samo vstavljanja, nič branja. Nastavi RLS tako, da je iz
brskalnika mogoče samo vstavljati, ne brati. Ključa naj bosta v
ločeni konfiguracijski datoteki, ne sredi kode.

## Jeziki

Tri različice: **slovenščina**, **regionalno (hrvaško/srbsko/bosansko)**,
**angleščina**.

Vsa besedila v enem slovarju v ločeni datoteki, nikjer drugje v kodi.
Jezik se izbere samodejno po nastavitvi brskalnika, z možnostjo ročne
zamenjave v glavi strani. Izbira se zapomni v brskalniku.

Besedilo na kartici naj ostane v jeziku, ki je izbran.

## Česa ne gradi

- Brez prijave, računov in gesel
- Brez lestvice (pride kasneje)
- Brez beleženja treningov
- Brez React, Vue, Next, Tailwind in drugih odvisnosti
- Brez dolgega uvodnega vprašalnika — obrazec je en zaslon

## Vrstni red dela

1. Ogrodje strani in obrazec
2. Izračun ranga in odstotka, s testi za mejne primere
3. Risanje pokončne kartice v canvas
4. Ležeča kartica
5. Prenos obeh
6. Supabase
7. Jeziki
8. Mobilni pregled

Po vsakem koraku pokaži rezultat, preden greš naprej.
