# Sistema de Consulta de Inelegibilidade

Sistema web para consulta de inelegibilidade baseado na legislação eleitoral brasileira.

## Stack de UI (Atualizado)
- Tailwind CSS (via CDN) para utilitários de estilo e responsividade.
- Padrões de design inspirados no shadcn/ui (tokens e classes utilitárias) — sem React.
- CSS próprio em `styles.css` (mantido para compatibilidade).

### Como o Tailwind está integrado
- Carregado no `index.html` via CDN:
  - `https://cdn.tailwindcss.com`
- Pequena configuração inline para tokens (cores e raio) baseada no padrão shadcn.
- Você pode aplicar classes Tailwind diretamente no HTML. As principais áreas já usam classes utilitárias ou foram migradas para classes CSS (sem `style="..."`).

### shadcn (sem React)
- Este projeto não usa React. Adotamos apenas os princípios (tokens e estilo) do shadcn/ui:
  - Variáveis CSS em `:root` (`styles.css`) como `--background`, `--foreground`, `--radius`.
  - Cartões ASE no modal usam classes utilitárias (sem inline style): `.ase-card`, `.ase-337-warning`, `.ase-337-success`, `.ase-370-info`.
- Caso deseje usar os componentes de shadcn/ui, será preciso migrar o app para React e Tailwind com build.

## Estrutura
- `index.html` — SPA, inclui Tailwind CDN e manifest.
- `styles.css` — estilos próprios + utilitários (`.hidden`, `.ase-card`, etc.).
- `data.js` — tabela e leis.
- `script.js` — lógica principal.
- `icons/apple-touch-icon.png` — ícone 180×180 para dispositivos Apple (gerado).

## Manutenção e tarefas
- Verificar consistência do `data.js`:
  - `node scripts/verify-data.js`
- Testes rápidos (sem UI principal):
  - Abrir `tests/quick-tests.html` e clicar nos cenários.

## Hints resolvidos
- Adicionado `apple-touch-icon` em `index.html`.
- Removidos estilos inline do HTML e dos templates do modal (classes utilitárias no lugar). 

## Smoke Test (121/122/163/33 §3º)
- CP 121
  - Resultado: INELEGÍVEL (❌)
  - Exceções: apenas do art. 121 (ex.: `Art. 121, § 3º`).
  - Card: ASE 337 – Motivo 7; Data: Trânsito em julgado.
- CP 122
  - Resultado: INELEGÍVEL (❌)
  - Exceções: `Art. 122, caput` (listada; só aplica se o caso for caput).
  - Card: ASE 337 – Motivo 7; Data: Trânsito em julgado.
- CP 163
  - Resultado: INELEGÍVEL (❌)
  - Exceções: caput e parágrafo único, IV (apenas do 163).
  - Card: ASE 337 – Motivo 7; Data: Trânsito em julgado.
- Lei 11.343/06, Art. 33, § 3º
  - Resultado: ELEGÍVEL (✅) — exceção aplicável.
  - Card (Condenação): ASE 337 – Motivo 2; Data: Trânsito em julgado.
  - Card (Extinção): ASE 370 – Extinção de Punibilidade; Data: Decisão judicial.

## Notas
- Para uma adoção completa de shadcn/ui, recomenda-se migrar para React + build com Tailwind, instalando os componentes e tokens via CLI do shadcn.
- O app atual permanece 100% funcional sem build, com Tailwind via CDN e tokens shadcn-like.

## Versão 0.0.1
- Nav sticky (top-0 z-50), breadcrumb “Início / Consulta”
- Tema “Candyland-like” (Tailwind inline), cores primary/secondary/accent
- Legenda e Data de Ocorrência padronizadas (cards, ícones, badges com borda)
- Inputs/selects com focus:ring primary, labels em text-accent
- Link “📘 Sobre/Documentação (Alt+D)” com accesskey e foco acessível
- Acentuação normalizada em index.html

## UI e Tema (v0.0.1)
- Nav sticky (top-0 z-50) com breadcrumb “Início / Consulta”.
- Página Sobre (sobre.html) linkada na barra, alternativa para usuários sem GitHub.
- Tema “Candyland-like” com Tailwind CDN (cores primary/secondary/accent/info/success/warning/danger).
- Legenda e Data de Ocorrência com cartões, chips/badges com borda e ícones padronizados (⚠️/📌/ℹ️/✅).
- Inputs/selects com foco institucional (focus:ring-2 focus:ring-primary e focus:border-primary).
- Labels em text-accent font-medium para melhor ênfase.
- Modal com barra de status (cor por tipo: inelegível/elegível/não encontrado).
- Paleta utilitária CSS (text-*, bg-*, border-*) em styles.css (fallback caso Tailwind config não carregue).
