-- Migration to add container support to equipment

alter table public.character_equipment 
add column if not exists container_id uuid references public.character_equipment(id) on delete set null,
add column if not exists is_container boolean not null default false,
add column if not exists capacity_weight numeric,
add column if not exists capacity_volume numeric;
