-- Balkan Rank - tabeli in pravila dostopa.
-- Zaženi v Supabase: SQL Editor → New query → Run.
-- Zažene se lahko večkrat; na obstoječi bazi doda samo tisto, česar še ni.
--
-- Iz brskalnika je mogoče vstavljanje v obe tabeli, brati pa se da samo
-- sedem stolpcev tabele "vnosi", in še to le vrstice z vzdevkom. Tabela
-- "naslovi" nima pravila za branje, zato e-naslovi od zunaj niso dosegljivi.

create table if not exists vnosi (
  id                  uuid primary key default gen_random_uuid(),
  ustvarjeno          timestamptz not null default now(),
  dvig                text not null check (dvig in ('bench', 'pocep', 'mrtvi', 'zgibi')),
  spol                text not null check (spol in ('m', 'z')),
  kolicina            numeric not null check (kolicina > 0 and kolicina <= 500),
  telesna_teza        numeric not null check (telesna_teza >= 30 and telesna_teza <= 250),
  trajanje_treniranja text,
  razmerje            numeric,          -- pri zgibih je prazno
  rang                text not null check (rang in ('BRON', 'SREBRO', 'ZLATO', 'PLATINA', 'DIAMANT')),
  odstotek            smallint not null check (odstotek between 1 and 99),
  jezik               text,
  -- neobvezen; kdor ga vpiše, pride na lestvico
  vzdevek             text check (vzdevek is null or char_length(btrim(vzdevek)) between 2 and 20)
);

-- če tabela že obstaja iz prejšnje različice
alter table vnosi add column if not exists vzdevek text;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'vnosi_vzdevek_check') then
    alter table vnosi add constraint vnosi_vzdevek_check
      check (vzdevek is null or char_length(btrim(vzdevek)) between 2 and 20);
  end if;
end $$;

create table if not exists naslovi (
  id         uuid primary key default gen_random_uuid(),
  ustvarjeno timestamptz not null default now(),
  email      text not null check (email ~* '^[^@\s]+@[^@\s]+\.[a-z]{2,}$'),
  rang       text,
  dvig       text
);

create index if not exists vnosi_ustvarjeno_idx on vnosi (ustvarjeno desc);
create index if not exists naslovi_ustvarjeno_idx on naslovi (ustvarjeno desc);

-- lestvica bere po dvigu in spolu, urejeno po razmerju; pri zgibih po ponovitvah
create index if not exists vnosi_lestvica_idx
  on vnosi (dvig, spol, razmerje desc) where vzdevek is not null;
create index if not exists vnosi_lestvica_zgibi_idx
  on vnosi (dvig, spol, kolicina desc) where vzdevek is not null;

-- RLS
alter table vnosi enable row level security;
alter table naslovi enable row level security;

drop policy if exists "vnosi: vstavljanje iz brskalnika" on vnosi;
create policy "vnosi: vstavljanje iz brskalnika"
  on vnosi for insert to anon with check (true);

drop policy if exists "naslovi: vstavljanje iz brskalnika" on naslovi;
create policy "naslovi: vstavljanje iz brskalnika"
  on naslovi for insert to anon with check (true);

-- Branje samo za lestvico: le vrstice z vzdevkom ...
drop policy if exists "vnosi: branje lestvice" on vnosi;
create policy "vnosi: branje lestvice"
  on vnosi for select to anon using (vzdevek is not null);

-- ... in le stolpci, ki jih lestvica potrebuje. Brez tega bi se dalo prebrati
-- tudi trajanje treniranja, jezik in čas vnosa.
revoke select on vnosi from anon;
grant select (dvig, spol, vzdevek, telesna_teza, kolicina, razmerje, rang)
  on vnosi to anon;

-- Tabela z e-naslovi nima pravila za branje. Pravilo za select je pogoj,
-- brez njega RLS zavrne vsako branje, zato je tu dovolj, da ga ni.
-- Za vsak primer odvzamemo še pravico select.
revoke select on naslovi from anon;

-- vse ostalo (update, delete) iz brskalnika ni mogoče, ker zanj ni pravila
