---
docStatus: active
docScope: security
lastReviewed: 14/01/2026
---
# Política de Segurança

## Versões Suportadas

Atualmente, oferecemos suporte de segurança para as seguintes versões:

| Versão | Suportada          |
| ------ | ------------------ |
| 0.2.0  | ✅ Sim             |
| 0.0.8  | ❌ Não             |
| < 0.0.8| ❌ Não             |

## Relatando uma Vulnerabilidade

A segurança do Inelegis é uma prioridade. Se você descobrir uma vulnerabilidade de segurança, por favor, siga estas diretrizes:

### Relatório Privado

**NÃO** abra uma issue pública para vulnerabilidades de segurança.

Em vez disso, use um canal privado:
- GitHub Security Advisories: https://github.com/rkvasne/inelegis/security/advisories/new

### Informações Necessárias

Incluir no relatório:
- Descrição detalhada da vulnerabilidade
- Passos para reproduzir
- Impacto potencial
- Versão afetada
- Sugestões de correção (se houver)

### Tempo de Resposta

- **Confirmação:** Dentro de 48 horas
- **Avaliação inicial:** Dentro de 7 dias
- **Correção:** Dependendo da severidade
  - Crítica: 24-48 horas
  - Alta: 1-2 semanas
  - Média: 2-4 semanas
  - Baixa: Próxima versão

## Medidas de Segurança Implementadas

### ✅ v0.1.0 (Atual)

- **XSS Prevention:** Sanitização completa de HTML
- **CSP:** Content Security Policy implementado
- **Secure Storage:** localStorage com validação e expiração
- **Input Validation:** Validação de todas as entradas
- **Safe DOM Manipulation:** Sem uso direto de innerHTML
- **Historico Admin Isolado:** Interface de auditoria acessível apenas por URL direta, sem links no menu público
- **CORS Restrito:** APIs `analytics`, `dashboard` e `search-history` aceitam apenas origens permitidas
- **Sugestões Sanitizadas:** Conteúdo de sugestões de artigos é inserido via `Sanitizer.safeInnerHTML`

### 🔐 Acesso Restrito ao Histórico Administrativo

- A tela `historico.html` serve exclusivamente para auditoria interna. Ela não aparece na navegação do sistema nem no menu de componentes.
- Compartilhe a URL apenas com equipes autorizadas. Evite divulgar o link em documentos públicos ou tickets.
- Sempre verifique o cabeçalho `Referer` quando o app estiver atrás de um proxy reverso e recuse acessos externos suspeitos.
- A auditoria de logs deve ser feita após autenticação federada (quando disponível) ou por meio de VPN corporativa.

### 🔍 Auditoria de Segurança
- Última auditoria: 01/12/2025
- Vulnerabilidades encontradas: 0
- Status: ✅ Seguro

## Boas Práticas para Contribuidores

### 🛡️ Desenvolvimento Seguro

1. **Nunca usar `innerHTML` diretamente**
   ```javascript
   // ❌ Inseguro
   element.innerHTML = userInput;
   
   // ✅ Seguro
   Sanitizer.safeInnerHTML(element, userInput);
   ```

2. **Sempre validar entradas**
   ```javascript
   // ✅ Validar antes de usar
   if (!input || typeof input !== 'string') {
     return null;
   }
   ```

3. **Usar SecureStorage para persistência**
   ```javascript
   // ✅ Seguro
   SecureStorage.setItem('key', value);
   ```

### 🧪 Testes de Segurança

- Execute `npm run lint` para verificar padrões
- Teste com dados maliciosos
- Verifique CSP headers
- Valide sanitização de HTML

## Dependências

### 📦 Auditoria de Dependências

```bash
# Verificar vulnerabilidades
npm audit

# Corrigir automaticamente
npm audit fix
```

### 🔄 Atualizações

- Dependências são auditadas mensalmente
- Atualizações de segurança são aplicadas imediatamente
- Versões são testadas antes do deploy

## Histórico de Segurança

### v0.0.6 (01/12/2025)
- ✅ Corrigidas 3 vulnerabilidades XSS
- ✅ Implementado CSP
- ✅ Adicionada sanitização de HTML
- ✅ Implementado localStorage seguro

### v0.0.5 e anteriores
- ⚠️ Vulnerabilidades XSS conhecidas
- ❌ Sem CSP
- ❌ localStorage inseguro

## Contato

Para questões de segurança:
- Canal privado: https://github.com/rkvasne/inelegis/security/advisories/new
- Assuntos não relacionados a segurança: https://github.com/rkvasne/inelegis/issues

---

**Versão:** 0.2.0
