#!/bin/bash
# =========================================
# Export local WordPress DB
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
echo "  1. Import this file into your remote MySQL database:"
echo "     mysql -h HOST -u USER -p DATABASE < ${EXPORT_FILE}"
echo "  2. Update URLs in the database for the new domain:"
echo "     wp search-replace 'http://studio-glimlach.test' 'https://your-new-domain.com'"
