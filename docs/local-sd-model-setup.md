# Local SDXL Model Setup

This project uses official SDXL Base 1.0 as the reproducible default for Rift Ascendant asset candidates.

Required checkpoint:

- `stabilityai/stable-diffusion-xl-base-1.0`
- Expected local identity: SDXL Base 1.0

Optional checkpoint:

- `stabilityai/stable-diffusion-xl-refiner-1.0`
- Use only with a backend workflow that supports a clean base-to-refiner pass.

You may need a Hugging Face account and token if Hugging Face prompts for model access acceptance.

## AUTOMATIC1111

Launch the web UI with API support:

```powershell
webui-user.bat --api
```

Place Stable Diffusion checkpoints here:

```text
stable-diffusion-webui/models/Stable-diffusion/
```

Install:

- Required: SDXL Base 1.0 from Hugging Face, `stabilityai/stable-diffusion-xl-base-1.0`
- Optional: SDXL Refiner 1.0 from Hugging Face, `stabilityai/stable-diffusion-xl-refiner-1.0`

Default API URL:

```text
http://127.0.0.1:7860
```

The generator detects installed A1111 models with:

```http
GET /sdapi/v1/sd-models
```

It also checks:

```http
GET /sdapi/v1/options
```

If SDXL Base 1.0 is not installed, the script will not crash during audit or dry-run prompt-pack generation. For real generation it prints exact setup instructions and stops unless you explicitly pass `--allow-current-model`.

Example:

```powershell
node scripts/generate-rift-assets.mjs --backend a1111 --sd-url http://127.0.0.1:7860 --limit 10
```

To use a local custom SDXL checkpoint:

```powershell
node scripts/generate-rift-assets.mjs --backend a1111 --checkpoint "my_local_sdxl_checkpoint" --limit 10
```

or:

```powershell
$env:RIFT_SD_CHECKPOINT = "my_local_sdxl_checkpoint"
node scripts/generate-rift-assets.mjs --backend a1111 --limit 10
```

Custom checkpoints are optional. The repo does not require anime, celebrity, copyrighted, CivitAI-only, paid, or cloud-only models.

## ComfyUI

Place checkpoints here:

```text
ComfyUI/models/checkpoints/
```

Install:

- Required: SDXL Base 1.0
- Optional: SDXL Refiner 1.0

Default API URL:

```text
http://127.0.0.1:8188
```

For this workspace, use the checked-in launcher if you want the known local ComfyUI install to run with stable log streams:

```powershell
scripts\start-comfyui-with-logs.cmd
```

The launcher uses:

```text
C:\Users\jjcal\OneDrive\Desktop\ComfyUI
```

and writes logs under:

```text
public/generated/rift-ascendant-candidates/logs/
```

Leave the launcher window open while generating. If ComfyUI is started as a hidden process without valid stderr, generation can fail inside KSampler progress logging.

The generator detects ComfyUI with:

```http
GET /system_stats
GET /object_info
```

The script uses this workflow when present:

```text
config/comfy-rift-sdxl-workflow-api.json
```

If that file is missing, the repo provides:

```text
config/comfy-rift-sdxl-workflow-api.example.json
```

The example is a simple SDXL Base text-to-image API workflow. It contains patchable nodes for checkpoint, positive prompt, negative prompt, seed, size, steps, CFG, sampler, scheduler, and output filename.

## Exporting a ComfyUI API Workflow

1. Open ComfyUI.
2. Build or load an SDXL Base workflow.
3. Enable developer mode in ComfyUI settings if needed.
4. Use "Save (API Format)" or the API-format export option.
5. Save the exported JSON as:

```text
config/comfy-rift-sdxl-workflow-api.json
```

6. Keep node class types recognizable where possible:

- `CheckpointLoaderSimple`
- `CLIPTextEncode`
- `EmptyLatentImage`
- `KSampler`
- `SaveImage`

The generator patches common fields by class type, so custom node titles are fine as long as the standard fields remain present.

## Refiner Workflows

The optional SDXL Refiner should only be used when the ComfyUI graph or backend workflow cleanly hands the base latent/image into a refiner pass. If no such graph exists, continue with SDXL Base only.

The default workflow is intentionally base-only for portability.
