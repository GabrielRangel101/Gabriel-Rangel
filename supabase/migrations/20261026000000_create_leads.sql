-- Contatos enviados pelo formulário do portfólio.
-- Escrita somente pela rota de servidor (service role); sem acesso público.
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (char_length(email) between 5 and 254),
  message text not null check (char_length(message) between 10 and 4000)
);

-- RLS ligado e nenhuma política: os papéis anon e authenticated não leem nem escrevem.
-- A service role ignora RLS e é usada apenas no servidor (variáveis de ambiente da Vercel).
alter table public.leads enable row level security;
