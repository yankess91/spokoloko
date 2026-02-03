# Spokoloko infrastructure

This repo contains the Docker setup for local development and easy deployment later.

## Services
- **PostgreSQL** for the primary database.
- **Redis** for optional caching.

## Quick start
1. Copy environment defaults (optional):
   ```bash
   cp .env.example .env
   ```
2. Start the stack:
   ```bash
   docker compose up -d
   ```

## Configuration
Environment variables can be set in `.env` or provided inline:

| Variable | Default | Description |
| --- | --- | --- |
| `POSTGRES_DB` | `spokoloko` | Database name |
| `POSTGRES_USER` | `spokoloko` | Database user |
| `POSTGRES_PASSWORD` | `spokoloko` | Database password |
| `POSTGRES_PORT` | `5432` | Host port for PostgreSQL |
| `REDIS_PORT` | `6379` | Host port for Redis |

Data is persisted in Docker volumes: `postgres_data` and `redis_data`.
