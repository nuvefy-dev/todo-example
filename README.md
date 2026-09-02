# Todo Example — NestJS + Nuxt + PostgreSQL

Sistema simples de listas to-do (globais, sem autenticação).

## Stack

- **API:** NestJS + TypeORM + PostgreSQL
- **Web:** Nuxt 3 (3.15)
- **Banco:** PostgreSQL via Docker Compose

## Pré-requisitos

- Node.js 20+
- Docker e Docker Compose
- npm

## Setup

### 1. Subir o PostgreSQL

```bash
docker compose up -d
```

### 2. Configurar variáveis de ambiente

```bash
cp api/.env.example api/.env
cp web/.env.example web/.env
```

### 3. Instalar dependências

```bash
cd api && npm install
cd ../web && npm install
```

### 4. Rodar a API

```bash
cd api && npm run start:dev
```

API em `http://localhost:3001`

### 5. Rodar o frontend

```bash
cd web && npm run dev
```

App em `http://localhost:3000`

## API

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/todos` | Lista todos |
| `POST` | `/todos` | Cria `{ "title": "..." }` |
| `PATCH` | `/todos/:id` | Atualiza `{ "title"?, "completed"? }` |
| `DELETE` | `/todos/:id` | Remove |

## Observação

Em desenvolvimento a API usa `synchronize: true` do TypeORM. Em produção, use migrations.
