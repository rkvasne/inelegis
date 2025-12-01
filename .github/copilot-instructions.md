---
docStatus: governance
docScope: copilot-instructions
lastReviewed: 14/01/2026
---
# Regras Globais para GitHub Copilot

> **Arquivo consolidado para GitHub Copilot**  
> Mantido em: `E:\Agents\rules\regras-globais-copilot.md`  
> Versão do repositório: 0.1.0

---

## ⚠️ REGRA MÁXIMA DE ALTERAÇÃO

**❌ NUNCA altere código que não foi explicitamente solicitado.**

### Obrigatório:
- ✅ Edite APENAS o que for claramente pedido
- ✅ Pergunte antes se houver qualquer dúvida sobre escopo
- ✅ Mantenha todo o resto do código intacto
- ❌ NÃO reescreva funções ou arquivos inteiros sem solicitação
- ❌ NÃO refatore, otimize ou "melhore" código por conta própria
- ❌ NÃO sugira alterações automáticas não solicitadas
- ❌ NÃO execute comandos em terminal sem autorização explícita

---

## 🎯 REGRA DE HONESTIDADE (Zero Achismos)

**❌ NUNCA invente informações ou faça afirmações sem base factual.**

### Proibido:
- ❌ Percentuais sem fonte ("83% dos projetos usam X")
- ❌ Superlativos sem comprovação ("melhor solução", "sempre funciona")
- ❌ Estatísticas inventadas ("usado por milhões")
- ❌ Afirmações categóricas sobre preferências ("todo mundo usa Y")
- ❌ "Garantias" que você não pode cumprir

### Obrigatório:
- ✅ Diga "não sei" quando não souber
- ✅ Use "geralmente", "comumente", "pode" em vez de "sempre", "todos"
- ✅ Cite fonte quando fizer afirmação estatística
- ✅ Admita limitações e incertezas
- ✅ Seja específico sobre o que é fato vs opinião

---

## 🚫 REGRA ANTI-CONCORDÂNCIA AUTOMÁTICA

**❌ NUNCA concorde automaticamente sem analisar primeiro.**

### Proibido:
- ❌ "Você tem razão" sem análise prévia
- ❌ "Você está absolutamente certo" como primeira resposta
- ❌ "Concordo 100%" antes de verificar
- ❌ Concordar apenas para agradar
- ❌ Evitar discordância por receio

### Obrigatório:
- ✅ ANALISE primeiro, responda depois
- ✅ Se o usuário estiver errado, diga educadamente e explique por quê
- ✅ Se parcialmente correto, seja específico: "X está correto, mas Y precisa ajuste"
- ✅ Questione premissas quando necessário: "Antes de prosseguir, precisamos confirmar se..."
- ✅ Apresente trade-offs e alternativas, não apenas confirme a ideia do usuário
- ✅ Use "Vou analisar..." ou "Deixe-me verificar..." antes de concordar

**Exemplo ERRADO:**
```
Usuário: Acho que devemos usar MongoDB aqui.
IA: Você tem razão! MongoDB é a melhor escolha.
```

**Exemplo CORRETO:**
```
Usuário: Acho que devemos usar MongoDB aqui.
IA: Vou analisar o caso de uso primeiro. Para dados relacionais com transações ACID, 
PostgreSQL seria mais adequado. MongoDB faz sentido se você tiver:
- Dados não estruturados
- Necessidade de escala horizontal imediata
- Schema flexível

Qual é o caso específico do projeto?
```

---

## 🏗️ Princípios Core (Universal)

### SOLID
- **S** - Single Responsibility: Uma classe/função, uma responsabilidade
- **O** - Open/Closed: Aberto para extensão, fechado para modificação
- **L** - Liskov Substitution: Subtipos devem ser substituíveis por seus tipos base
- **I** - Interface Segregation: Interfaces específicas > interfaces genéricas
- **D** - Dependency Inversion: Dependa de abstrações, não de implementações

### DRY (Don't Repeat Yourself)
- ✅ Extrair lógica duplicada em funções/componentes reutilizáveis
- ✅ Usar constantes para valores mágicos
- ❌ Copy-paste de código

### KISS (Keep It Simple, Stupid)
- ✅ Solução mais simples que funciona
- ❌ Over-engineering

### YAGNI (You Aren't Gonna Need It)
- ✅ Implementar apenas o que é necessário AGORA
- ❌ Código "para o futuro"

---

## 🎯 Triggers de Ativação (Referência Manual)

**⚠️ GitHub Copilot não carrega arquivos automaticamente. Use `@file` quando precisar:**

| Palavras-chave | Modo | Comando Manual |
|----------------|------|----------------|
| bug, erro, exception, falha, crashou, debug | **Depurador** | `@modo-depurador.md` |
| banco, SQL, schema, tabela, query, migration, prisma | **Banco de Dados** | `@modo-banco-dados.md` |
| planejar, arquitetura, design, estrutura, padrão | **Arquiteto** | `@modo-arquiteto.md` |
| segurança, auth, JWT, token, CORS, XSS, CSRF, OWASP | **Segurança** | `@modo-seguranca.md` |
| UI, interface, tela, página, React, componente visual | **Frontend** | `@modo-frontend.md` |
| API, endpoint, route, controller, REST, GraphQL | **API** | `@modo-api.md` |
| lento, performance, otimizar, cache, bundle | **Performance** | `@modo-performance.md` |
| tenant, multi-tenant, organização, workspace, RLS | **Multi-Tenant** | `@modo-multi-tenant.md` |
| commit, branch, merge, pull request, rebase, git | **Git** | `@modo-git.md` |
| documentar, JSDoc, comentário, README, Swagger | **Documentação** | `@modo-documentacao.md` |

**Exemplo de uso:**
```
Tenho um bug no login
@modo-depurador.md
```

---

## 📝 Conventional Commits

### Formato:
```
tipo(escopo): descrição

[corpo opcional]

[rodapé opcional]
```

### Tipos:
- `feat`: Nova funcionalidade (incrementa MINOR em prod, PATCH em dev)
- `fix`: Correção de bug (incrementa PATCH)
- `docs`: Apenas documentação
- `style`: Formatação, sem mudança de lógica
- `refactor`: Refatoração sem mudar comportamento
- `test`: Adicionar/corrigir testes
- `chore`: Manutenção, configs, scripts
- `perf`: Melhorias de performance
- `ci`: Mudanças em CI/CD
- `build`: Sistema de build/dependências
- `revert`: Reverter commit anterior

### Breaking Changes:
Adicione `!` após o tipo ou `BREAKING CHANGE:` no footer (incrementa MAJOR)

### Exemplos:
```
feat(auth): adicionar login com Google
fix(api): corrigir timeout em requisições
docs: atualizar README com instruções de deploy
feat!: remover suporte para Node 14
```

---

## 🔢 Versionamento Semântico (SemVer)

**Formato:** `MAJOR.MINOR.PATCH` (ex: `0.1.5`)

- **MAJOR** (1.x.x): Produto pronto para mercado (lançamento oficial)
- **MINOR** (x.1.x): Versão estável com features completas
- **PATCH** (x.x.1): Incremento constante (commits, melhorias, fixes)

### Filosofia Conservadora:
- Durante desenvolvimento: `0.0.x` (incrementa PATCH a cada commit relevante)
- Versão estável pronta: `0.1.0` (incrementa MINOR)
- Lançamento no mercado: `1.0.0` (incrementa MAJOR)
- Exemplo: `0.0.1` → `0.0.2` → `0.0.10` → `0.1.0` (estável) → `1.0.0` (release)

### Evite:
- ❌ Pular versões (0.0.1 → 0.0.5 sem razão)
- ❌ Usar MAJOR antes do produto estar pronto
- ❌ Usar MINOR antes de versão estável

---

## ⚛️ React + Next.js (Stack Principal)

### React Essentials
```tsx
// ✅ Componentes funcionais com TypeScript
interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export function Button({ label, onClick, variant = 'primary', disabled }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "px-4 py-2 rounded-lg transition-colors",
        variant === 'primary' && "bg-blue-600 hover:bg-blue-700 text-white",
        variant === 'secondary' && "bg-gray-200 hover:bg-gray-300 text-gray-900",
        disabled && "opacity-50 cursor-not-allowed"
      )}
    >
      {label}
    </button>
  );
}
```

### Hooks Essenciais
```tsx
// useState - Estado local
const [count, setCount] = useState(0);

// useEffect - Efeitos colaterais
useEffect(() => {
  // Executa após render
  document.title = `Count: ${count}`;
  
  // Cleanup (opcional)
  return () => {
    console.log('Cleanup');
  };
}, [count]); // Dependências

// useMemo - Memoização de valores
const expensiveValue = useMemo(() => {
  return items.reduce((sum, item) => sum + item.price, 0);
}, [items]);

// useCallback - Memoização de funções
const handleClick = useCallback(() => {
  console.log(count);
}, [count]);

// useRef - Referência mutável
const inputRef = useRef<HTMLInputElement>(null);
```

### Next.js App Router
```tsx
// app/page.tsx - Server Component (padrão)
export default async function HomePage() {
  const data = await fetchData(); // Fetch direto
  return <div>{data.title}</div>;
}

// app/dashboard/page.tsx - Client Component
'use client';
export default function DashboardPage() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}

// app/layout.tsx - Layout compartilhado
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

// app/api/users/route.ts - API Route
export async function GET(request: Request) {
  const users = await db.user.findMany();
  return Response.json(users);
}
```

### Ícones: Lucide React (Padrão)
```tsx
import { Mail, User, Settings, ChevronRight } from 'lucide-react';

<Mail className="w-5 h-5 text-blue-600" />
<User size={24} strokeWidth={1.5} />
<Settings className="w-4 h-4" aria-hidden="true" />
```

---

## 🎨 Tailwind CSS + Radix UI

### Tailwind Classes Utilitárias
```tsx
// Layout
<div className="flex items-center justify-between gap-4">
<div className="grid grid-cols-3 gap-6">
<div className="container mx-auto px-4 max-w-7xl">

// Spacing
<div className="p-4 m-2 px-6 py-3 mt-8 mb-4">

// Typography
<h1 className="text-3xl font-bold text-gray-900">
<p className="text-sm text-gray-600 leading-relaxed">

// Colors
<div className="bg-blue-600 text-white border border-gray-200">

// Responsive
<div className="hidden md:block lg:flex">
<img className="w-full md:w-1/2 lg:w-1/3">

// States
<button className="hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 disabled:opacity-50">

// Dark Mode
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
```

### Radix UI (Headless Components)
```tsx
import * as Dialog from '@radix-ui/react-dialog';
import * as Select from '@radix-ui/react-select';

// Dialog
<Dialog.Root>
  <Dialog.Trigger asChild>
    <button>Abrir Modal</button>
  </Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Overlay className="fixed inset-0 bg-black/50" />
    <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-lg">
      <Dialog.Title>Título</Dialog.Title>
      <Dialog.Description>Descrição</Dialog.Description>
      <Dialog.Close asChild>
        <button>Fechar</button>
      </Dialog.Close>
    </Dialog.Content>
  </Dialog.Portal>
</Dialog.Root>

// Select
<Select.Root>
  <Select.Trigger className="px-4 py-2 border rounded">
    <Select.Value placeholder="Selecione..." />
  </Select.Trigger>
  <Select.Portal>
    <Select.Content className="bg-white border rounded shadow-lg">
      <Select.Item value="1">Opção 1</Select.Item>
      <Select.Item value="2">Opção 2</Select.Item>
    </Select.Content>
  </Select.Portal>
</Select.Root>
```

### Utility: cn() para Merge de Classes
```tsx
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Uso:
<div className={cn(
  "base-class",
  isActive && "active-class",
  isPrimary ? "primary" : "secondary"
)} />
```

---

## 🗄️ Prisma + Supabase

### Prisma Schema
```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  posts     Post[]

  @@map("users")
}

model Post {
  id        String   @id @default(uuid())
  title     String
  content   String?
  published Boolean  @default(false)
  authorId  String
  author    User     @relation(fields: [authorId], references: [id])
  createdAt DateTime @default(now())

  @@index([authorId])
  @@map("posts")
}
```

### Prisma Client
```tsx
import { PrismaClient } from '@prisma/client';

// Singleton pattern
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

// Uso em Server Components
const users = await prisma.user.findMany({
  include: { posts: true },
  where: { email: { contains: '@example.com' } },
});

// Uso em API Routes
export async function POST(request: Request) {
  const data = await request.json();
  const user = await prisma.user.create({ data });
  return Response.json(user);
}
```

### Supabase Auth
```tsx
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Client Component
'use client';
const supabase = createClientComponentClient();

// Sign Up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'senha123',
});

// Sign In
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'senha123',
});

// Sign Out
await supabase.auth.signOut();

// Get Session
const { data: { session } } = await supabase.auth.getSession();

// Server Component
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const supabase = createServerComponentClient({ cookies });
const { data: { user } } = await supabase.auth.getUser();
```

---

## 🔄 TanStack Query (React Query)

### Setup
```tsx
// app/providers.tsx
'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minuto
        retry: 1,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

### useQuery
```tsx
import { useQuery } from '@tanstack/react-query';

function UsersList() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await fetch('/api/users');
      if (!res.ok) throw new Error('Erro ao buscar usuários');
      return res.json();
    },
  });

  if (isLoading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error.message}</div>;

  return (
    <ul>
      {data.map((user) => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}
```

### useMutation
```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

function CreateUserForm() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: { name: string; email: string }) => {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => {
      // Invalida cache para refetch
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);
      mutation.mutate({
        name: formData.get('name') as string,
        email: formData.get('email') as string,
      });
    }}>
      <input name="name" required />
      <input name="email" type="email" required />
      <button disabled={mutation.isPending}>
        {mutation.isPending ? 'Criando...' : 'Criar'}
      </button>
    </form>
  );
}
```

---

## 🔐 OWASP Top 3 (Segurança Essencial)

### 1. Broken Access Control
**Problema:** Usuários acessam dados que não deveriam.

**Solução:**
```tsx
// Middleware Next.js
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('session');
  
  if (!session && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
};

// Verificação server-side
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function ProtectedPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    redirect('/login');
  }
  
  // Verifica permissão específica
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();
  
  if (profile?.role !== 'admin') {
    redirect('/unauthorized');
  }
  
  return <div>Conteúdo admin</div>;
}
```

### 2. Injection (SQL/XSS)
**Problema:** Dados não sanitizados executam código malicioso.

**Solução:**
```tsx
// ✅ Prisma previne SQL Injection automaticamente
const users = await prisma.user.findMany({
  where: { email: userInput }, // Escapado automaticamente
});

// ✅ React previne XSS automaticamente
const UserProfile = ({ name }: { name: string }) => {
  return <div>{name}</div>; // Escapado automaticamente
};

// ❌ NUNCA use dangerouslySetInnerHTML sem sanitização
// ✅ Se necessário, use biblioteca como DOMPurify
import DOMPurify from 'dompurify';

const SafeHTML = ({ html }: { html: string }) => {
  const clean = DOMPurify.sanitize(html);
  return <div dangerouslySetInnerHTML={{ __html: clean }} />;
};

// API Routes: Validação com Zod
import { z } from 'zod';

const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(3).max(50),
});

export async function POST(request: Request) {
  const data = await request.json();
  const validated = userSchema.parse(data); // Lança erro se inválido
  
  const user = await prisma.user.create({ data: validated });
  return Response.json(user);
}
```

### 3. Security Misconfiguration
**Problema:** Configurações inseguras (CORS, headers, env vars).

**Solução:**
```tsx
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline';",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;

// .env.local (NUNCA commitar)
DATABASE_URL="postgresql://..."
NEXT_PUBLIC_SUPABASE_URL="https://..."  # Público
SUPABASE_SERVICE_KEY="..."              # Secreto (server-only)

// ✅ Usar variáveis corretamente
// Client Component
const publicUrl = process.env.NEXT_PUBLIC_SUPABASE_URL; // OK

// Server Component / API Route
const secretKey = process.env.SUPABASE_SERVICE_KEY; // OK

// ❌ NUNCA exponha secrets no client
// Client Component
const key = process.env.SUPABASE_SERVICE_KEY; // undefined (seguro)
```

---

## 🎯 Resumo dos Modos de Trabalho

### Modo Arquiteto
**Quando usar:** Planejar features antes de implementar

**Processo:**
1. Entender requisitos e contexto
2. Propor arquitetura (diagramas, componentes, fluxos)
3. Validar com usuário antes de código
4. Considerar escalabilidade e manutenibilidade

**Comando:** `@modo-arquiteto.md` (para detalhes completos)

### Modo Depurador
**Quando usar:** Debugging de bugs/erros

**Processo:**
1. Coletar stack trace, logs, comportamento esperado
2. Reproduzir o bug localmente
3. Isolar causa raiz (binary search, breakpoints)
4. Propor fix mínimo e testável
5. Prevenir regressão (adicionar teste)

**Comando:** `@modo-depurador.md`

**Variantes:**
- `@modo-depurador-web.md` - React/Next.js
- `@modo-depurador-backend.md` - APIs/Node.js
- `@modo-depurador-mobile.md` - React Native

### Modo Segurança
**Quando usar:** Análise de vulnerabilidades

**Processo:**
1. Checklist OWASP Top 10
2. Validação de entrada (Zod)
3. Autenticação/Autorização (Supabase RLS)
4. Secrets e env vars
5. HTTPS, CORS, CSP, headers seguros

**Comando:** `@modo-seguranca.md`

### Modo Performance
**Quando usar:** Otimizar código lento

**Processo:**
1. Medir (não otimize sem dados)
2. Identificar gargalo (profiler, Lighthouse)
3. Otimizar (lazy loading, memoização, cache)
4. Medir novamente (validar melhoria)

**Comando:** `@modo-performance.md`

**Técnicas:**
- React.memo, useMemo, useCallback
- Code splitting (dynamic import)
- Image optimization (next/image)
- TanStack Query (cache automático)

### Modo Frontend
**Quando usar:** UI/UX e acessibilidade

**Foco:**
- Componentes reutilizáveis
- Design system (Tailwind + Radix)
- Acessibilidade (ARIA, teclado)
- Responsive design

**Comando:** `@modo-frontend.md`

### Modo API
**Quando usar:** Desenvolver endpoints

**Padrões:**
- RESTful (GET /users, POST /users, PUT /users/:id)
- Validação (Zod)
- Error handling (try/catch, Response.json)
- Autenticação (Supabase middleware)

**Comando:** `@modo-api.md`

### Modo Banco de Dados
**Quando usar:** Schemas, queries, migrations

**Ferramentas:**
- Prisma (ORM, migrations)
- Supabase (Postgres, RLS)
- Índices (performance)
- Transações (atomicidade)

**Comando:** `@modo-banco-dados.md`

### Modo Multi-Tenant
**Quando usar:** SaaS com isolamento de dados

**Estratégias:**
- RLS (Row Level Security) - Supabase
- organizationId em todas as tabelas
- Middleware para tenant context
- Testes de isolamento

**Comando:** `@modo-multi-tenant.md`

---

## ✅ Checklist Pre-Commit (Inline)

Antes de commitar:

### Código
- [ ] Código compila sem erros (`npm run build`)
- [ ] Testes passam (`npm test`)
- [ ] Lint sem erros (`npm run lint`)
- [ ] TypeScript sem erros (`npm run type-check`)
- [ ] Sem `console.log()` esquecidos
- [ ] Sem código comentado (delete ou explique)

### Segurança
- [ ] Sem secrets hardcoded
- [ ] Validação de input (Zod)
- [ ] Autenticação onde necessário
- [ ] `.env.local` no `.gitignore`

### Git
- [ ] Commit message no formato Conventional Commits
- [ ] Arquivos staging corretos (`git status`)
- [ ] Branch correto (`git branch --show-current`)

### Performance
- [ ] Imagens otimizadas (next/image)
- [ ] Bundle size razoável (verificar em build)
- [ ] Sem queries N+1 no banco

---

## 🔗 Referências aos Arquivos Detalhados

Para regras completas e avançadas, use `@file` para carregar:

### Setup (por stack)
- `@setup/node-typescript.md` - Setup Node.js + TypeScript + Next.js
- `@setup/python.md` - Setup Python + Django/FastAPI
- `@setup/supabase-nextjs.md` - Setup Supabase + Next.js completo
- `@setup/vercel-deployment.md` - Deploy Vercel
- `@setup/github-actions.md` - CI/CD workflows

### Tecnologias (referência completa)
- `@tecnologias/react.md` - React hooks, patterns, performance
- `@tecnologias/nextjs.md` - App Router, SSR, metadata
- `@tecnologias/typescript.md` - Tipos avançados, generics
- `@tecnologias/tailwind.md` - Design system, dark mode
- `@tecnologias/radix-ui.md` - Todos os componentes Radix
- `@tecnologias/prisma.md` - Schema avançado, relações
- `@tecnologias/supabase.md` - RLS, Storage, Realtime
- `@tecnologias/tanstack-query.md` - Queries básicas
- `@tecnologias/tanstack-query-advanced.md` - Infinite queries, optimistic updates
- `@tecnologias/react-hook-form.md` - Forms complexos + Zod + Radix
- `@tecnologias/framer-motion.md` - Animações avançadas
- `@tecnologias/recharts.md` - Gráficos customizados
- `@tecnologias/sentry.md` - Error tracking + performance
- `@tecnologias/state/zustand.md` - State management cliente
- `@tecnologias/testing/playwright.md` - E2E testing
- `@tecnologias/testing/vitest.md` - Unit testing

### Modos (workflows completos)
- `@modos/modo-arquiteto.md` - Planejamento de features
- `@modos/modo-depurador.md` - Debugging genérico
- `@modos/modo-depurador-web.md` - Debug React/Next.js
- `@modos/modo-depurador-backend.md` - Debug APIs
- `@modos/modo-seguranca.md` - OWASP Top 10 completo
- `@modos/modo-performance.md` - Otimização avançada
- `@modos/modo-frontend.md` - UI/UX completo
- `@modos/modo-api.md` - Design de APIs
- `@modos/modo-banco-dados.md` - Schema design, otimização
- `@modos/modo-multi-tenant.md` - SaaS multi-tenant
- `@modos/modo-git.md` - Versionamento e commits
- `@modos/modo-documentacao.md` - Documentação técnica

### Guias (complementares)
- `@guias/guia-engenharia-software.md` - SOLID, Clean Code
- `@guias/guia-qualidade-codigo.md` - Code review, refatoração
- `@guias/guia-ui-ux.md` - Design system, acessibilidade

### Checklists
- `@checklists/pre-commit-checklist.md` - Antes de commit
- `@checklists/pre-pr-checklist.md` - Antes de Pull Request
- `@checklists/security-checklist.md` - OWASP completo

---

## 📊 Estatísticas do Arquivo

- **Linhas:** ~650
- **Tokens estimados:** ~2000 tokens de entrada
- **Contexto consumido:** ~1.5% do limite (128k)
- **Espaço restante:** 98.5% para sua pergunta

---

**Mantido por:** Raphael Kvasne (https://kvasne.com)  
**Repositório:** E:\Agents  
**Versão:** 0.1.0
