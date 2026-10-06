-- Balkan Rank - tabeli in pravila dostopa.
-- Zaženi v Supabase: SQL Editor → New query → Run.
-- Iz brskalnika je mogoče samo vstavljanje, branja ni.

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
  jezik               text
);

create table if not exists naslovi (
  id         uuid primary key default gen_random_uuid(),
  ustvarjeno timestamptz not null default now(),
  email      text not null check (email ~* '^[^@\s]+@[^@\s]+\.[a-z]{2,}$'),
  rang       text,
  dvig       text
);

create index if not exists vnosi_ustvarjeno_idx on vnosi (ustvarjeno desc);
create index if not exists naslovi_ustvarjeno_idx on naslovi (ustvarjeno desc);

-- RLS: brskalnik sme samo vstavljati
alter table vnosi enable row level security;
alter table naslovi enable row level security;

drop policy if exists "vnosi: vstavljanje iz brskalnika" on vnosi;
create policy "vnosi: vstavljanje iz brskalnika"
  on vnosi for insert to anon with check (true);

drop policy if exists "naslovi: vstavljanje iz brskalnika" on naslovi;
create policy "naslovi: vstavljanje iz brskalnika"
  on naslovi for insert to anon with check (true);

-- branja namenoma ne dovolimo nikomur razen service_role,
-- ki RLS obide; podatke gledaš v Supabase nadzorni plošči.
