# 🧹 Limpar Cache e Forçar Atualização

## O tema está alternando corretamente nos logs, mas visualmente não muda?

Isso é um problema de **cache do navegador**. Os arquivos CSS antigos estão em cache.

## Solução Rápida

### Opção 1: Hard Refresh (Mais Rápido)
- **Windows/Linux:** `Ctrl + Shift + R` ou `Ctrl + F5`
- **Mac:** `Cmd + Shift + R`

### Opção 2: Limpar Cache Manualmente
1. Pressione `F12` (DevTools)
2. Clique com botão direito no ícone de reload
3. Selecione "Limpar cache e recarregar forçadamente"

### Opção 3: Via Console
```javascript
// Limpar tudo e recarregar
localStorage.clear();
sessionStorage.clear();
location.reload(true);
```

### Opção 4: Configurações do Navegador

**Chrome/Edge:**
1. `Ctrl + Shift + Delete`
2. Selecione "Imagens e arquivos em cache"
3. Clique em "Limpar dados"

**Firefox:**
1. `Ctrl + Shift + Delete`
2. Selecione "Cache"
3. Clique em "Limpar agora"

## Verificar se Funcionou

Após limpar o cache, abra o console (F12) e execute:
```javascript
// Verificar tema atual
console.log('Tema:', localStorage.getItem('inelegis_theme'));
console.log('Classe:', document.documentElement.className);

// Testar alternância
document.getElementById('themeToggle').click();
```

## Se Ainda Não Funcionar

Execute no console:
```javascript
// Forçar tema claro
localStorage.setItem('inelegis_theme', 'light');
document.documentElement.className = '';
location.reload(true);
```

## Versão dos Arquivos

Verifique se está carregando a versão correta:
- `styles.css?v=0.0.8`
- `js/theme-manager.js?v=0.0.8`

Se estiver com versão antiga, limpe o cache!
