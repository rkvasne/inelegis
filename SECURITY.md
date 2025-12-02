# Política de Segurança

## Versões Suportadas

Atualmente, oferecemos suporte de segurança para as seguintes versões:

| Versão | Suportada          |
| ------ | ------------------ |
| 0.0.8  | ✅ Sim             |
| 0.0.7  | ❌ Não             |
| < 0.0.7| ❌ Não             |

## Relatando uma Vulnerabilidade

A segurança do Inelegis é uma prioridade. Se você descobrir uma vulnerabilidade de segurança, por favor, siga estas diretrizes:

### 🔒 Relatório Privado

**NÃO** abra uma issue pública para vulnerabilidades de segurança.

Em vez disso:
1. Envie um e-mail para [security@inelegis.com] (se disponível)
2. Ou crie uma issue privada no GitHub (se disponível)
3. Ou entre em contato através dos canais oficiais do projeto

### 📋 Informações Necessárias

Incluir no relatório:
- Descrição detalhada da vulnerabilidade
- Passos para reproduzir
- Impacto potencial
- Versão afetada
- Sugestões de correção (se houver)

### ⏱️ Tempo de Resposta

- **Confirmação:** Dentro de 48 horas
- **Avaliação inicial:** Dentro de 7 dias
- **Correção:** Dependendo da severidade
  - Crítica: 24-48 horas
  - Alta: 1-2 semanas
  - Média: 2-4 semanas
  - Baixa: Próxima versão

## Medidas de Segurança Implementadas

### ✅ v0.0.8 (Atual)

- **XSS Prevention:** Sanitização completa de HTML
- **CSP:** Content Security Policy implementado
- **Secure Storage:** localStorage com validação e expiração
- **Input Validation:** Validação de todas as entradas
- **Safe DOM Manipulation:** Sem uso direto de innerHTML

### 🔍 Auditoria de Segurança

- Última auditoria: 01 de dezembro de 2025
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
- 📧 E-mail: [Adicionar e-mail de segurança]
- 🐛 Issues privadas: [Link se disponível]
- 📱 Contato direto: [Informações de contato]

---

**Última atualização:** 02 de dezembro de 2025  
**Versão:** 0.0.8
