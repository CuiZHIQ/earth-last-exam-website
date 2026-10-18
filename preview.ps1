$ErrorActionPreference = 'Stop'
$eleNodeCandidates = @()
$eleSystemNode = Get-Command node -ErrorAction SilentlyContinue
if ($eleSystemNode) { $eleNodeCandidates += $eleSystemNode.Source }
$eleNodeCandidates += (Join-Path $env:USERPROFILE '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe')
$eleNode = $null
foreach ($eleCandidate in $eleNodeCandidates) {
    if (Test-Path -LiteralPath $eleCandidate) {
        $eleVersion = & $eleCandidate --version
        if ($eleVersion -match '^v(\d+)' -and [int]$Matches[1] -ge 22) {
            $eleNode = $eleCandidate
            break
        }
    }
}
if (-not $eleNode) { throw 'Node.js 22 or newer is required.' }
Push-Location -LiteralPath $PSScriptRoot
try {
    & $eleNode scripts/build.mjs
    if ($LASTEXITCODE -ne 0) { throw 'Build failed.' }
    & $eleNode scripts/check.mjs
    if ($LASTEXITCODE -ne 0) { throw 'Checks failed.' }
    & $eleNode scripts/serve.mjs
} finally {
    Pop-Location
}
