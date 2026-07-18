#!/bin/bash
# =========================================
# Export local WordPress DB for Railway
# Usage: bash scripts/export-db.sh
# =========================================

set -e

# Load .env
source .env

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
EXPORT_FILE="db_export_${TIMESTAMP}.sql"

echo "📦 Exporting database '${DB_NAME}'..."

mysqldump \
  -u "${DB_USER}" \
  -p"${DB_PASSWORD}" \
  "${DB_NAME}" \
  > "${EXPORT_FILE}"

echo "✅ Done! File saved as: ${EXPORT_FILE}"
echo ""
echo "Next steps:"
echo "  1. Import this file into your Railway MySQL database"
echo "  2. Run: mysql -h HOST -u USER -p DATABASE < ${EXPORT_FILE}"
