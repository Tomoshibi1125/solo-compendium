-- Fix security lint: function_search_path_mutable
-- Addressing search path hijacking vulnerability for update_character_xp

ALTER FUNCTION public.update_character_xp(uuid, integer, uuid, text) SET search_path = public;
