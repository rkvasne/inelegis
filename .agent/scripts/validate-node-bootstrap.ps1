# validate-node-bootstrap.ps1
# Valida se o projeto está corretamente conectado como um Nó do Solo Dev Hub

$ErrorActionPreference = "Continue"

function Write-Success { param([string]$Msg) Write-Host "[OK] $Msg" -ForegroundColor Green }
function Write-Error-Custom { param([string]$Msg) Write-Host "[ERRO] $Msg" -ForegroundColor Red }
function Write-Warning { param([string]$Msg) Write-Host "[AVISO] $Msg" -ForegroundColor Yellow }

Write-Host "Verificando Status do Nó (Client Project)..." -ForegroundColor Cyan

# 1. Verificar Junction
if (Test-Path .agent/hub) {
    $item = Get-Item .agent/hub
    if ($item.LinkType -eq "Junction" -or $item.Attributes -match "ReparsePoint") {
        Write-Success "Junction .agent/hub ativa"
    } else {
        Write-Error-Custom ".agent/hub existe mas não parece ser uma Junction/Symlink"
    }
} else {
    Write-Error-Custom ".agent/hub não encontrado"
}

# 2. Verificar Estrutura Local
if (Test-Path .agent/memory/context/project-status.md) {
    Write-Success "Memória de projeto inicializada"
} else {
    Write-Error-Custom "Status do projeto inválido (.agent/memory/context/project-status.md ausente)"
}

# 3. Verificar Configurações
if (Test-Path AGENTS.md) {
    $agentsContent = Get-Content AGENTS.md -Raw
    if ($agentsContent -match "\.agent/hub/") {
        Write-Success "AGENTS.md configurado com referências ao Hub"
    } else {
        Write-Warning "AGENTS.md pode estar desatualizado (falta referência a .agent/hub/)"
    }
} else {
    Write-Error-Custom "AGENTS.md ausente"
}

if (Test-Path GEMINI.md) {
    $geminiContent = Get-Content GEMINI.md -Raw
    if ($geminiContent -match "\.agent/hub/") {
        Write-Success "GEMINI.md atualizado para apontar para o Hub"
    } else {
        Write-Warning "GEMINI.md pode estar usando caminhos antigos (local)"
    }
} else {
    Write-Error-Custom "GEMINI.md ausente"
}

# 4. Verificar Inteligência Sincronizada
$promptsDir = ".github/prompts"
if (Test-Path $promptsDir) {
    $count = (Get-ChildItem $promptsDir -Filter "*.prompt.md").Count
    if ($count -gt 5) {
        Write-Success "Prompts da IDE sincronizados ($count arquivos)"
    } else {
        Write-Warning "Poucos prompts encontrados em $promptsDir. Execute generator-prompt-manifests.ps1"
    }
} else {
    Write-Error-Custom "Pasta .github/prompts ausente"
}

# 5. Validação Cruzada (Opcional - chama validador do Hub APENAS para verificar se o Hub está saudável)
Write-Host "`nVerificando integridade básica do Hub..." -ForegroundColor Cyan
if (Test-Path .agent/hub/system/validators/validator-integrity-check.ps1) {
    # Suprimimos output excessivo, queremos apenas saber se o script roda
    Write-Success "Script validador do Hub acessível"
} else {
    Write-Error-Custom "Não foi possível acessar scripts do Hub"
}

Write-Host "`nDiagnóstico Final:" -ForegroundColor Cyan
