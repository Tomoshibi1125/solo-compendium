-- Rift Ascendant rebrand: rename system_favor_* → rift_favor_*
-- Characters table and any dependent views.
--
-- The application code was renamed to rift_favor_* as part of the
-- Rift Ascendant branding pass, but the database schema still carried
-- the original system_favor_* columns. This migration aligns DB with code.

do $$
begin
	if exists (
		select 1
		from information_schema.columns
		where table_schema = 'public'
		  and table_name = 'characters'
		  and column_name = 'system_favor_current'
	) then
		alter table public.characters rename column system_favor_current to rift_favor_current;
	end if;

	if exists (
		select 1
		from information_schema.columns
		where table_schema = 'public'
		  and table_name = 'characters'
		  and column_name = 'system_favor_max'
	) then
		alter table public.characters rename column system_favor_max to rift_favor_max;
	end if;

	if exists (
		select 1
		from information_schema.columns
		where table_schema = 'public'
		  and table_name = 'characters'
		  and column_name = 'system_favor_die'
	) then
		alter table public.characters rename column system_favor_die to rift_favor_die;
	end if;
end$$;
