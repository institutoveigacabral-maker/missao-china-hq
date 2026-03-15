# Missao China HQ

Plataforma de gestao de operacoes de importacao China-Brasil com backend serverless e frontend React.

![CI](https://github.com/institutoveigacabral-maker/missao-china-hq/actions/workflows/ci.yml/badge.svg)
![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)

---

## Sobre

Missao China HQ e um sistema completo para gerenciar todas as etapas de uma operacao de sourcing e importacao da China. Abrange desde a gestao de SKUs e fornecedores ate compliance regulatorio, logistica, financas, analise de risco e um modulo de mentorado com dashboard dedicado.

O backend roda em Cloudflare Workers com Hono e banco D1, enquanto o frontend e construido com React 19, Vite e Tailwind CSS.

---

## Tech Stack

| Camada | Tecnologias |
|--------|-------------|
| **Backend** | Hono, Cloudflare Workers, D1 (SQLite), R2 (Storage) |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS |
| **Roteamento** | React Router v7 |
| **State/Data** | TanStack React Query, Zod (validacao) |
| **Animacoes** | Framer Motion |
| **Busca** | Fuse.js |
| **Testes** | Vitest, Testing Library |
| **Qualidade** | ESLint, Prettier, Husky |

---

## Funcionalidades

- **Gestao de SKUs** -- CRUD completo, analise de SKU, operacoes em lote (batch)
- **Fornecedores** -- Cadastro, avaliacao e acompanhamento de suppliers chineses
- **Compliance e Regulacoes** -- Consulta e gestao de regulamentacoes de importacao
- **Logistica** -- Controle de embarques e rastreamento
- **Financas** -- Controle financeiro e cash-out de operacoes
- **Canton Fair** -- Modulo dedicado para feiras de Canton
- **Incoterms** -- Referencia e calculo de termos de comercio internacional
- **Analise de Risco** -- Risk register para operacoes de importacao
- **Mentorado** -- Sistema completo com autenticacao propria, dashboard, deals, documentos, relatorios, analytics e gestao de fornecedores
- **Web Vitals** -- Monitoramento de performance do frontend
- **PWA** -- Suporte a Progressive Web App e modo offline

---

## Estrutura do Projeto

```
src/
  worker/              # Backend -- Cloudflare Workers + Hono
    index.ts           # Entry point da API
    routes/            # Rotas: SKUs, suppliers, regulations, mentorado, etc.
    lib/               # Logica de negocio
  react-app/           # Frontend React
    pages/             # Paginas da aplicacao
    components/        # Componentes de UI
    hooks/             # Hooks customizados
    schemas/           # Validacoes Zod
    contexts/          # Context API
    providers/         # Providers React
    utils/             # Utilitarios
  shared/              # Tipos e utilitarios compartilhados entre front e back
  components/          # Componentes compartilhados (Forms)
  types/               # Tipagem TypeScript global
docs/                  # Documentacao tecnica
```

---

## Primeiros Passos

### Pre-requisitos

- Node.js 18+
- npm

### Instalacao

```bash
git clone https://github.com/institutoveigacabral-maker/missao-china-hq.git
cd missao-china-hq
npm install
```

### Desenvolvimento

```bash
npm run dev
```

O servidor de desenvolvimento sobe com Vite + Cloudflare Workers localmente.

### Build

```bash
npm run build
```

### Deploy

O deploy e feito via Wrangler para Cloudflare Workers:

```bash
npx wrangler deploy
```

### Variaveis de Ambiente

```
NODE_ENV=development
ENABLE_PERFORMANCE_DEVTOOLS=true
ENABLE_PWA_FEATURES=true
ENABLE_OFFLINE_MODE=true
```

---

## Testes

O projeto possui 89 testes cobrindo schemas, tipos compartilhados, logica de negocio e rotas da API.

```bash
# Executar todos os testes
npm test

# Modo watch
npm run test:watch

# Interface visual
npm run test:ui
```

---

## Scripts Uteis

| Comando | Descricao |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de producao |
| `npm run lint` | Verificar lint (ESLint) |
| `npm run lint:fix` | Corrigir lint automaticamente |
| `npm run format` | Formatar codigo (Prettier) |
| `npm run type-check` | Verificar tipos TypeScript |
| `npm run quality:gates` | Rodar type-check + lint + build + health-check |
| `npm run health-check` | Analise de saude do codigo |
| `npm run build:analyze` | Build com analise de bundle |

---

## Arquitetura

A aplicacao segue uma arquitetura full-stack serverless:

1. **API (Hono + Cloudflare Workers)** -- Backend leve e performatico rodando no edge. Banco de dados D1 (SQLite distribuido) e storage R2 para arquivos.

2. **Frontend (React 19 + Vite)** -- SPA com code splitting, lazy loading e otimizacoes de performance. TanStack Query gerencia cache e sincronizacao de dados com a API.

3. **Deploy** -- Cloudflare Workers serve tanto a API quanto os assets estaticos do frontend como SPA.

### Rotas da API

- `/api/skus` -- Gestao de SKUs
- `/api/suppliers` -- Fornecedores
- `/api/regulations` -- Regulamentacoes
- `/api/sku-analysis` -- Analise de SKUs
- `/api/batch` -- Operacoes em lote
- `/api/mentorado` -- Sistema de mentorado (auth, deals, suppliers, documents, reports)
- `/api/ping` -- Health check
- `/api/stats` -- Estatisticas do sistema
- `/api/web-vitals` -- Metricas de performance

---

## Contribuindo

Consulte o arquivo [CONTRIBUTING.md](./CONTRIBUTING.md) para diretrizes de contribuicao.

---

## Licenca

Este projeto esta licenciado sob a licenca MIT. Consulte o arquivo [LICENSE](./LICENSE) para mais detalhes.
