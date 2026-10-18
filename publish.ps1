param(
    [string]$RepositoryName = 'earth-last-exam-website',
    [switch]$CheckOnly
)
$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath $PSScriptRoot
if ($RepositoryName -notmatch '^[A-Za-z0-9][A-Za-z0-9_.-]*$') { throw 'Use a repository name, without an owner or URL.' }

$nodeCandidates = @((Get-Command node -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source), (Join-Path $env:USERPROFILE '.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node.exe'))
$runtime = $null
foreach ($candidate in $nodeCandidates) {
    if ($candidate -and (Test-Path -LiteralPath $candidate)) {
        $version = & $candidate --version
        if ($version -match '^v(\d+)' -and [int]$Matches[1] -ge 22) { $runtime = $candidate; break }
    }
}
if (-not $runtime) { throw 'Node.js 22 or newer is required.' }
foreach ($script in @('scripts/build.mjs', 'scripts/check.mjs')) {
    & $runtime $script
    if ($LASTEXITCODE -ne 0) { throw "Check failed: $script" }
}
$testFiles = @(Get-ChildItem -LiteralPath 'tests' -Filter '*.test.mjs' | ForEach-Object { $_.FullName })
& $runtime --test @testFiles
if ($LASTEXITCODE -ne 0) { throw 'Proposal tests failed.' }
if ($CheckOnly) { Write-Host 'Local checks passed. No GitHub changes made.'; return }

$gh = (Get-Command gh -ErrorAction Stop).Source
$git = (Get-Command git -ErrorAction Stop).Source
& $gh auth status
if ($LASTEXITCODE -ne 0) { throw 'Sign in first: gh auth login --hostname github.com --web --git-protocol https' }
$login = & $gh api user --jq .login
if ($LASTEXITCODE -ne 0 -or -not $login) { throw 'Could not identify the authenticated GitHub account.' }
$repository = "$login/$RepositoryName"
& $gh repo view $repository --json name 2>$null
if ($LASTEXITCODE -eq 0) { throw "Repository already exists: $repository. Inspect it before updating; this script only creates new repositories." }

if (-not (Test-Path -LiteralPath '.git')) {
    & $git init -b main
    if ($LASTEXITCODE -ne 0) { throw 'Could not initialize this folder.' }
}
$repositoryRoot = & $git rev-parse --show-toplevel
if ($LASTEXITCODE -ne 0 -or [IO.Path]::GetFullPath($repositoryRoot) -ne [IO.Path]::GetFullPath($PSScriptRoot)) { throw 'The Git root must be this website folder.' }
$branch = & $git branch --show-current
if ($branch -ne 'main') { throw 'The initial publication must use the main branch.' }
$existingRemote = & $git remote get-url origin 2>$null
if ($LASTEXITCODE -eq 0) { throw "An origin is already configured: $existingRemote. Inspect it before publishing." }

$authorName = & $git config user.name
$authorEmail = & $git config user.email
if (-not $authorName -or -not $authorEmail -or $authorEmail -match '@example\.(com|org|net)$') {
    $accountId = & $gh api user --jq .id
    if ($LASTEXITCODE -ne 0) { throw 'Could not read GitHub author identity.' }
    & $git config user.name $login
    if ($LASTEXITCODE -ne 0) { throw 'Could not set repository author.' }
    & $git config user.email "$accountId+$login@users.noreply.github.com"
    if ($LASTEXITCODE -ne 0) { throw 'Could not set repository author email.' }
}
& $git add -- src brand figure-data scripts tests .github .gitignore .gitattributes package.json preview.ps1 publish.ps1 README.md CONTRIBUTING.md
if ($LASTEXITCODE -ne 0) { throw 'Could not stage the public website files.' }
$tracked = & $git ls-files
if ($tracked | Where-Object { $_ -match '^(outreach|research|docs|dist)/|(^|/)\.env' }) { throw 'Internal files are tracked; inspect the staging area.' }
& $git diff --cached --quiet
if ($LASTEXITCODE -eq 1) {
    & $git commit -m 'Build Earth Last Exam research and contribution website'
    if ($LASTEXITCODE -ne 0) { throw 'Could not commit the website.' }
} elseif ($LASTEXITCODE -ne 0) { throw 'Could not inspect the staging area.' }
& $gh repo create $repository --public --description 'Earth Last Exam: research agents in Earth science' --source . --remote origin
if ($LASTEXITCODE -ne 0) { throw 'Repository creation failed; local files are preserved.' }
& $gh api "repos/$repository/pages" --method POST -f build_type=workflow
if ($LASTEXITCODE -ne 0) { throw 'Repository created. Enable Pages with GitHub Actions in repository Settings, then push main.' }
& $git -c 'credential.helper=' -c 'credential.helper=!gh auth git-credential' push -u origin main
if ($LASTEXITCODE -ne 0) { throw 'Repository created and Pages enabled, but push failed. Run git push -u origin main after resolving authentication.' }
Write-Host "Repository: https://github.com/$repository"
Write-Host "Workflow: https://github.com/$repository/actions"
Write-Host "Expected site after deployment: https://$login.github.io/$RepositoryName/"
