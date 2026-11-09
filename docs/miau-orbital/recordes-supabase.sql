-- Mural de recordes do Miau Orbital
-- Cole tudo no Supabase em: SQL Editor -> New query -> Run

create table if not exists public.recordes (
  id         bigint generated always as identity primary key,
  run        text     not null check (char_length(run) between 4 and 40),
  name       text     not null check (char_length(btrim(name)) between 1 and 16),
  score      integer  not null check (score between 1 and 50000000),
  fase       smallint not null check (fase between 1 and 10),
  done       boolean  not null default false,
  cat        text     check (cat in ('neon', 'astro', 'zorp')),
  created_at timestamptz not null default now()
);

create index if not exists recordes_score_idx on public.recordes (score desc);

-- Segurança: qualquer visitante pode LER e ADICIONAR recordes,
-- mas ninguém consegue editar ou apagar pelo site (só você, pelo painel do Supabase).
alter table public.recordes enable row level security;

drop policy if exists "todos leem" on public.recordes;
create policy "todos leem" on public.recordes for select to anon using (true);

drop policy if exists "todos registram" on public.recordes;
create policy "todos registram" on public.recordes for insert to anon with check (true);

grant select, insert on public.recordes to anon;
