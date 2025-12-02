# Instruções para Corrigir Problema do Tema

## Problema
O tema claro não está sendo aplicado nas páginas.

## Diagnóstico

### Passo 1: Verificar o tema atual
1. Abra o DevTools do navegador (F12)
2. Vá para a aba Console
3. Digite: `localStorage.getItem('inelegis_theme')`
4. Veja o valor retornado

### Passo 2: Verificar a classe CSS
1. No DevTools, vá para a aba Elements
2. Verifique se o elemento `<html>` tem a classe `dark-theme`
3. Se tiver, o tema escuro está ativo

## Soluções

### Solução 1: Limpar localStorage (Recomendado)
No console do navegador, execute:
```javascript
localStorage.removeItem('inelegis_theme');
location.reload();
```

### Solução 2: Forçar tema claro
No console do navegador, execute:
```javascript
localStorage.setItem('inelegis_theme', 'light');
location.reload();
```

### Solução 3: Usar a página de teste
1. Abra `test-theme.html` no navegador
2. Clique em "Limpar localStorage"
3. Ou clique em "Forçar Tema Claro"

## Verificação dos Logs

Com as mudanças de debug, você verá no console:
- `🚀 ThemeManager.init() called`
- `📋 Saved theme: [valor]`
- `🖥️ System theme: [valor]`
- `✅ Selected theme: [valor]`
- `🎨 Applying theme: [valor]`
- `💾 Theme saved to localStorage: [valor]`
- `✅ Theme toggle button attached` (ou warning se não encontrado)

## Causa Provável

O localStorage provavelmente está com o valor 'dark' salvo, e o sistema está respeitando essa preferência. O botão de alternância deve funcionar para mudar entre os temas.

## Teste do Botão

1. Abra qualquer página do sistema
2. Procure o botão de tema no header (ícone de sol/lua)
3. Clique no botão
4. Verifique se o tema alterna
5. Verifique os logs no console

## Se o Problema Persistir

1. Limpe todo o cache do navegador
2. Limpe o localStorage completamente:
   ```javascript
   localStorage.clear();
   location.reload();
   ```
3. Verifique se há erros no console
4. Verifique se o arquivo `js/theme-manager.js` está sendo carregado
