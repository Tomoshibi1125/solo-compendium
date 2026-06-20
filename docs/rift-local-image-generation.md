# Rift Local Image Generation

This workflow audits Rift Ascendant image references, builds lore-grounded SDXL prompts, generates local candidates, and provides a review gallery before any production image is replaced.

It is designed to preserve existing assets by default.

## What It Does

- Audits static compendium data and runtime image references.
- Records image metadata, missing files, placeholder suspicion, mismatch suspicion, replacement priority, and prompt recommendations.
- Writes replacement planning data.
- Generates prompt packs from repo lore and usage context.
- Saves generated candidates under `public/generated/rift-ascendant-candidates/`.
- Writes a JSON sidecar for every generated candidate.
- Provides HTML and Markdown review galleries.
- Applies replacements only when explicitly requested and only for reviewed high-confidence candidates.

## Models

Required default:

```text
stabilityai/stable-diffusion-xl-base-1.0
```

Optional:

```text
stabilityai/stable-diffusion-xl-refiner-1.0
```

The refiner is documented but not required. The default workflow works with official SDXL Base 1.0 alone.

You can override the checkpoint with either:

```powershell
$env:RIFT_SD_CHECKPOINT = "my_local_sdxl_checkpoint"
```

or:

```powershell
node scripts/generate-rift-assets.mjs --checkpoint "my_local_sdxl_checkpoint"
```

## A1111 Setup

Start AUTOMATIC1111 with API enabled:

```powershell
webui-user.bat --api
```

Put checkpoints in:

```text
stable-diffusion-webui/models/Stable-diffusion/
```

Default URL:

```text
http://127.0.0.1:7860
```

The script checks:

```text
/sdapi/v1/options
/sdapi/v1/sd-models
```

Generation uses:

```text
/sdapi/v1/txt2img
```

The script uses `override_settings.sd_model_checkpoint` when possible.

## ComfyUI Setup

Put checkpoints in:

```text
ComfyUI/models/checkpoints/
```

Default URL:

```text
http://127.0.0.1:8188
```

For this local workspace, the repo includes a ComfyUI launcher that starts the known local install with stdout/stderr redirected to log files:

```powershell
scripts\start-comfyui-with-logs.cmd
```

Leave that window open while generating. This avoids hidden-process stderr issues that can make ComfyUI fail inside KSampler progress logging.

The script checks:

```text
/system_stats
/object_info
```

Use this workflow file for generation:

```text
config/comfy-rift-sdxl-workflow-api.json
```

If missing, start from:

```text
config/comfy-rift-sdxl-workflow-api.example.json
```

Export custom ComfyUI workflows in API format, then save them to `config/comfy-rift-sdxl-workflow-api.json`.

## Run the Audit

```powershell
node scripts/audit-assets.mjs
```

Outputs:

```text
audit/assets-report.json
audit/SUMMARY.md
docs/rift-image-replacement-plan.md
data/rift-image-replacement-plan.json
data/rift-image-prompts.json
docs/generated-image-review.html
docs/generated-image-review.md
```

## Dry Run

Dry-run mode does not require A1111 or ComfyUI.

```powershell
node scripts/generate-rift-assets.mjs --dry-run
```

Limit to the first 10 prompt records:

```powershell
node scripts/generate-rift-assets.mjs --dry-run --limit 10
```

Dry run writes a prompt-pack JSON under:

```text
public/generated/rift-ascendant-candidates/
```

and refreshes the review galleries.

## Generate First 10 Candidates

Auto-detect A1111 first, then ComfyUI:

```powershell
node scripts/generate-rift-assets.mjs --backend auto --limit 10
```

A1111 explicit:

```powershell
node scripts/generate-rift-assets.mjs --backend a1111 --sd-url http://127.0.0.1:7860 --limit 10
```

ComfyUI explicit:

```powershell
node scripts/generate-rift-assets.mjs --backend comfy --sd-url http://127.0.0.1:8188 --limit 10
```

Resume only missing high-priority candidates:

```powershell
node scripts/generate-rift-assets.mjs --backend comfy --sd-url http://127.0.0.1:8188 --checkpoint sd_xl_base_1.0 --only-high-priority --skip-existing --limit 25
```

Specific checkpoint:

```powershell
node scripts/generate-rift-assets.mjs --backend auto --checkpoint "sd_xl_base_1.0" --limit 10
```

More variants:

```powershell
node scripts/generate-rift-assets.mjs --backend auto --limit 10 --variants 4
```

High-priority only:

```powershell
node scripts/generate-rift-assets.mjs --backend auto --only-high-priority --limit 10
```

Filter by asset type:

```powershell
node scripts/generate-rift-assets.mjs --backend auto --type armor --limit 10
```

Regenerate one exact compendium/app prompt after a prompt fix:

```powershell
node scripts/generate-rift-assets.mjs --backend comfy --sd-url http://127.0.0.1:8188 --checkpoint sd_xl_base_1.0 --prompt-id "armor-armor-adept-s-patrol-bracer-ttscqv" --variants 4
```

The current prompt pack includes `item`, `weapon`, `armor`, `vehicle`, `map`, `token`, and `regent`. The generator can also filter any future prompt type written by the audit, such as `character`, `anomaly`, `location`, `relic`, `power`, `technique`, or `background`.

The helper script named `scripts\run-rift-assets-generate-apply.cmd` is intentionally review-only despite the historical filename. It starts ComfyUI generation for missing typed candidates, refreshes status logs, and stops before approval or apply. This keeps SDXL Base 1.0 outputs from being placed in the app until a human has confirmed that each image fits the exact compendium/app entry.

## Review Candidates

Open:

```text
docs/generated-image-review.html
```

or read:

```text
docs/generated-image-review.md
```

Each generated candidate also has a sidecar JSON. Default review status is:

```json
{
  "recommendedReplacement": "pending",
  "confidence": "pending"
}
```

To allow apply, edit a sidecar or corresponding replacement-plan entry to:

```json
{
  "recommendedReplacement": "yes",
  "confidence": "high"
}
```

Use this only after reviewing the original, candidate, prompt, lore context, and usage references.

For normal review, approve exact candidate files instead of entire categories:

```powershell
node scripts/approve-rift-candidates.mjs --candidate "/generated/rift-ascendant-candidates/weapon-weapon-abyssal-spear-1xcekd-v3-3026280053.png"
```

If every current candidate for a specific prompt has been reviewed and is acceptable, approve by prompt id:

```powershell
node scripts/approve-rift-candidates.mjs --prompt-id "weapon-weapon-abyssal-spear-1xcekd"
```

The approval script also supports broader scopes such as `--type`, `--only-high-priority`, and `--all`, but those are not recommended for SDXL Base-only bulk equipment unless the matching candidates have already been visually reviewed. Official SDXL Base 1.0 is reproducible and good enough for local candidate generation, but it can still produce design sheets, people, or multiple objects for inventory prompts.

## Apply Replacements Safely

Default behavior never overwrites production images.

Apply mode without a scope is a safety check and refuses to place candidates:

```powershell
node scripts/generate-rift-assets.mjs --apply
```

Use an explicit scope for actual placement:

```powershell
node scripts/generate-rift-assets.mjs --apply --candidate "/generated/rift-ascendant-candidates/weapon-weapon-obsidian-revolver-1o1uen-v2-4287137776.png"
```

or:

```powershell
node scripts/generate-rift-assets.mjs --apply --prompt-id "weapon-weapon-obsidian-revolver-1o1uen"
```

Use broad scopes only after visual review:

```powershell
node scripts/generate-rift-assets.mjs --apply --type weapon
node scripts/generate-rift-assets.mjs --apply --all-reviewed
```

Apply mode only uses candidates marked:

```text
recommendedReplacement: "yes"
confidence: "high"
```

Apply mode also rejects stale sidecars whose prompt text, negative prompt, type, dimensions, or step count no longer match the current prompt pack. After prompt fixes, regenerate and review new candidates rather than approving older mismatched files.

When applying, the script:

- Backs up originals under `public/generated/original-backups/`.
- Preserves the target path and filename.
- Uses `sharp` to preserve target dimensions and format where possible.
- Reruns `node scripts/audit-assets.mjs`.
- Runs available package scripts after a successful apply: `npm run lint`, `npm run build`, and `npm test`.

Note: this repo's `npm run lint` currently uses Biome with `--write`, so inspect diffs after apply.

## Troubleshooting

Backend not running:

- Start A1111 with `--api`, or start ComfyUI.
- Use `--dry-run` when you only need prompts and review files.

Checkpoint missing:

- Install SDXL Base 1.0 locally.
- A1111 path: `stable-diffusion-webui/models/Stable-diffusion/`
- ComfyUI path: `ComfyUI/models/checkpoints/`
- Pass `--allow-current-model` only when you knowingly accept the currently loaded model.

Bad dimensions:

- The audit preserves existing aspect ratio when replacing an existing asset.
- New candidates use defaults by type: portrait, square icon/token, background, or map.
- Apply mode resizes to target dimensions when an existing target image has dimensions.

Low VRAM:

- Use `--limit 1 --variants 1`.
- Prefer 1024 square or portrait targets before larger backgrounds.
- Use A1111 or ComfyUI low-VRAM options outside this repo.
- Avoid refiner workflows until base generation is stable.

A1111 API not enabled:

- Relaunch with `--api`.
- Confirm `http://127.0.0.1:7860/sdapi/v1/sd-models` responds in a browser.

ComfyUI workflow missing:

- Copy `config/comfy-rift-sdxl-workflow-api.example.json` to `config/comfy-rift-sdxl-workflow-api.json`.
- Or export your graph in API format and save it to that path.

No candidates applied:

- This is expected until a sidecar or plan entry is marked `recommendedReplacement: "yes"` and `confidence: "high"`.
