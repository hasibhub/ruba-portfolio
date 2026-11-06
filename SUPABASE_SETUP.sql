-- Run once in your Supabase SQL Editor.
create table if not exists public.portfolio_reviews (
 id bigint generated always as identity primary key,
 name text not null check (char_length(trim(name)) between 1 and 50),
 review text not null check (char_length(trim(review)) between 1 and 600),
 face smallint not null check (face between 1 and 3),
 approved boolean not null default false,
 created_at timestamptz not null default now()
);
alter table public.portfolio_reviews enable row level security;
revoke all on public.portfolio_reviews from anon, authenticated;
grant select (name, review, face, approved, created_at) on public.portfolio_reviews to anon, authenticated;
grant insert (name, review, face) on public.portfolio_reviews to anon, authenticated;
grant usage on sequence public.portfolio_reviews_id_seq to anon, authenticated;
drop policy if exists "Read approved portfolio reviews" on public.portfolio_reviews;
create policy "Read approved portfolio reviews" on public.portfolio_reviews for select to anon, authenticated using (approved = true);
drop policy if exists "Submit portfolio reviews" on public.portfolio_reviews;
create policy "Submit portfolio reviews" on public.portfolio_reviews for insert to anon, authenticated with check (approved = false);
-- To approve: use Table Editor as project owner and set approved=true.
