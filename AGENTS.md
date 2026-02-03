# AGENTS.md - Instruções de Zeladoria

## 🚫 READ-ONLY ZONE
Este projeto está conectado ao Hub de Inteligência. Referências obrigatórias:
- **Personas:** `.agent/hub/brain/personas/`
- **Capacidades:** `.agent/hub/capabilities/`
- **Workflows:** `.agent/hub/system/workflows/`

---

> **Note**: This project is a node of the Solo Dev Hub.
> **Hub Location**: `.agent/hub/` (Junction to `E:\Agents`)

## 🧠 Brain & Capabilities

The intelligence for this project is centralized in the Hub.

- **Brain**: `.agent/hub/brain/`
- **Skills**: `.agent/hub/capabilities/`

## ⚠️ READ-ONLY ZONE

**DO NOT EDIT files inside `.agent/hub/`.**
These are shared resources. Architecture changes must be done in the Hub project (`E:\Agents`).

## 📍 Local Context

- **Memory**: `.agent/memory/context/`
- **Project Status**: `.agent/memory/context/project-status.md`
