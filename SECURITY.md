# 🔐 Política de Segurança — INELEGIS

> Navegação: [README do projeto](README.md) • [Documentação](docs/README.md) • [Política de Privacidade](PRIVACY.md)

Este documento descreve como reportar vulnerabilidades e quais controles de segurança são aplicados no **Inelegis**.

## 🚨 Relatando uma Vulnerabilidade

### 🔒 Relatório Privado

**NÃO** abra uma issue pública para temas de segurança.

Use o canal privado:
- https://github.com/rkvasne/inelegis/security/advisories/new

### 📋 Informações Necessárias

- Descrição do problema e impacto
- Passos para reproduzir (PoC, se possível)
- Versão/commit afetado
- Ambiente (navegador/OS) quando aplicável

### ⏱️ Tempo de Resposta

- **Confirmação:** até 48 horas
- **Triagem inicial:** até 7 dias

---

## 🛡️ Controles Implementados

- CSP restritiva em produção
- Sanitização de HTML e inserção segura no DOM
- Persistência local com validação/expiração quando usada
- Restrições de origem (CORS) nas APIs serverless
- Tela de auditoria (`historico.html`) não aparece na navegação pública

---

## 📦 Dependências

Para auditoria local:

```bash
npm audit
```

---

## 📫 Contato

- Segurança (privado): https://github.com/rkvasne/inelegis/security/advisories/new
- Outros assuntos: https://github.com/rkvasne/inelegis/issues

---

**Versão:** 0.2.0
