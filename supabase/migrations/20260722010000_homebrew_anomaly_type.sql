-- ============================================================================
-- Expand homebrew_content.content_type to the full current authoring set.
--
-- The original CHECK only allowed ('job','path','relic','spell','item'), but
-- the app has since shipped 'power' and 'feat' authoring, and now adds
-- 'anomaly' (a homebrew creature the Warden can drop into an encounter — D&D
-- Beyond homebrew-monster parity). This reconciles the constraint with the
-- HomebrewContentType union in the client and unblocks the new type.
--
-- Idempotent: drops whatever content_type CHECK currently exists (name may be
-- the auto-generated inline one) and re-adds a named, complete constraint.
-- ============================================================================

DO $$
DECLARE
	conname_var TEXT;
BEGIN
	-- Drop any existing CHECK constraint that references content_type.
	FOR conname_var IN
		SELECT con.conname
		FROM pg_constraint con
		JOIN pg_class rel ON rel.oid = con.conrelid
		JOIN pg_namespace nsp ON nsp.oid = rel.relnamespace
		WHERE rel.relname = 'homebrew_content'
			AND nsp.nspname = 'public'
			AND con.contype = 'c'
			AND pg_get_constraintdef(con.oid) ILIKE '%content_type%'
	LOOP
		EXECUTE format(
			'ALTER TABLE public.homebrew_content DROP CONSTRAINT %I',
			conname_var
		);
	END LOOP;

	ALTER TABLE public.homebrew_content
		ADD CONSTRAINT homebrew_content_content_type_check
		CHECK (content_type IN (
			'job', 'path', 'relic', 'spell', 'item', 'power', 'feat', 'anomaly'
		));
END $$;
