#!/bin/sh
set -e

echo "[entrypoint] Running Prisma generate..."
npx prisma generate || true

MIGRATIONS_DIR="prisma/migrations"

# Count only directories inside prisma/migrations (ignore migration_lock.toml)
MIGRATIONS_COUNT=$(find "$MIGRATIONS_DIR" -mindepth 1 -maxdepth 1 -type d 2>/dev/null | wc -l | tr -d ' ')

if [ "$MIGRATIONS_COUNT" -gt 0 ]; then
  echo "[entrypoint] Detected $MIGRATIONS_COUNT migration(s). Applying with 'prisma migrate deploy'..."
  npx prisma migrate deploy
else
  echo "[entrypoint] No migrations detected. Creating initial migration 'init_products'..."
  npx prisma migrate dev --name init_products
fi

echo "[entrypoint] Starting application: $@"
exec "$@"

