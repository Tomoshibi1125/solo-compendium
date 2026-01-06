## Base Compendium Bundles

Place **hand-authored** JSON bundles here.

- These files are intended to be the long-term **source-of-truth** for homebrew content.
- Do **not** include copyrighted book text. Use original phrasing and Solo Leveling-themed naming.
- Use provenance fields (`source_kind`, `source_name`, `license_note`, `generated_reason`) where supported.

Validate bundles:

```bash
node scripts/compendium/validate.js
```

Dry-run import (no DB writes):

```bash
npm run import:content
```


