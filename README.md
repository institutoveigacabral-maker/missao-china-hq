# Missão China HQ

Sistema completo de gestão de importação China-Brasil. Inclui gestão de SKUs, fornecedores, logística, finanças, regulamentações, Canton Fair, Incoterms, análise de risco e sistema de mentorado com dashboard próprio.

## Tech Stack

- React 19 + TypeScript
- Vite + Cloudflare Workers (Hono)
- Tailwind CSS
- React Router
- Tanstack React Query
- Framer Motion
- Fuse.js (busca)
- Vitest + Testing Library
- Husky (git hooks)

## Como rodar

```bash
git clone https://github.com/institutoveigacabral-maker/missao-china-hq.git
cd missao-china-hq
npm install
npm run dev
```

## Variáveis de ambiente

```
NODE_ENV=development
ENABLE_PERFORMANCE_DEVTOOLS=true
ENABLE_PWA_FEATURES=true
ENABLE_OFFLINE_MODE=true
```

## Estrutura

```
src/
  react-app/       # Frontend React (páginas, componentes)
  components/      # Componentes compartilhados
  hooks/           # Hooks customizados
  pages/           # Páginas (Login, SKU, Suppliers, Finance, Mentorado...)
  schemas/         # Validações Zod
  types/           # Tipagem TypeScript
  shared/          # Utilitários compartilhados
  worker/          # Backend Hono (Cloudflare Workers)
docs/              # Documentação técnica
```
