param(
	[string]$Root = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path,
	[string]$ComfyUrl = "http://127.0.0.1:8188",
	[string]$Checkpoint = "sd_xl_base_1.0"
)

$ErrorActionPreference = "Stop"
Set-Location $Root

$logDir = Join-Path $Root "public/generated/rift-ascendant-candidates/logs"
New-Item -ItemType Directory -Force -Path $logDir | Out-Null

$outLog = Join-Path $logDir "rift-assets-comfy-background.out.log"
$errLog = Join-Path $logDir "rift-assets-comfy-background.err.log"
$statusFile = Join-Path $logDir "latest-full-comfy-run.json"
$node = "C:\Program Files\nodejs\node.exe"
if (-not (Test-Path $node)) {
	$node = "node"
}

function Write-Status {
	param(
		[string]$Status,
		[string]$Step,
		[int]$ExitCode = 0
	)
	$payload = [ordered]@{
		status = $Status
		step = $Step
		exitCode = $ExitCode
		updatedAt = (Get-Date).ToString("o")
		log = $outLog
		err = $errLog
		comfyUrl = $ComfyUrl
		checkpoint = $Checkpoint
	}
	$payload | ConvertTo-Json | Set-Content -Path $statusFile -Encoding UTF8
}

function Write-Log {
	param([string]$Message)
	Add-Content -Path $outLog -Value ("[{0}] {1}" -f (Get-Date), $Message)
}

function Run-Step {
	param(
		[string]$Name,
		[string[]]$Arguments
	)
	Write-Status -Status "running" -Step $Name
	Write-Log $Name
	& $node @Arguments 1>>$outLog 2>>$errLog
	$code = $LASTEXITCODE
	if ($code -ne 0) {
		Write-Status -Status "failed" -Step $Name -ExitCode $code
		Write-Log ("FAILED {0} with exit code {1}" -f $Name, $code)
		exit $code
	}
}

Write-Status -Status "starting" -Step "preflight"
Write-Log "Starting full ComfyUI Rift asset workflow"
Write-Log ("Root: {0}" -f $Root)
Write-Log ("Node: {0}" -f $node)
Write-Log ("ComfyUI: {0}" -f $ComfyUrl)
Write-Log ("Checkpoint: {0}" -f $Checkpoint)

try {
	Invoke-WebRequest -UseBasicParsing -Uri "$ComfyUrl/system_stats" -TimeoutSec 10 | Out-Null
} catch {
	Write-Status -Status "failed" -Step "preflight" -ExitCode 1
	Add-Content -Path $errLog -Value ("ComfyUI was not reachable at {0}: {1}" -f $ComfyUrl, $_.Exception.Message)
	exit 1
}

Run-Step "Step 1/5: audit assets and rebuild prompt pack" @("scripts/audit-assets.mjs")
Run-Step "Step 2/5: generate remaining typed candidates with ComfyUI" @(
	"scripts/generate-rift-assets.mjs",
	"--backend",
	"comfy",
	"--sd-url",
	$ComfyUrl,
	"--checkpoint",
	$Checkpoint,
	"--skip-existing",
	"--continue-on-error"
)
Run-Step "Step 3/5: approve current typed candidates for apply" @(
	"scripts/approve-rift-candidates.mjs",
	"--note",
	"Approved by explicit user instruction that every generated image should fit its app/compendium entry."
)
Run-Step "Step 4/5: apply approved candidates into app asset paths" @(
	"scripts/generate-rift-assets.mjs",
	"--apply"
)
Run-Step "Step 5/5: refresh review gallery" @(
	"scripts/generate-rift-assets.mjs",
	"--dry-run",
	"--limit",
	"25"
)

Write-Status -Status "complete" -Step "done"
Write-Log "Finished full workflow successfully"
