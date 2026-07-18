#!/bin/bash
set -e

# Write the .env file from Railway environment variables
cat > /var/www/html/.env <<EOF
DB_NAME=${DB_NAME}
DB_USER=${DB_USER}
DB_PASSWORD=${DB_PASSWORD}
DB_HOST=${DB_HOST:-localhost}

WP_ENV=${WP_ENV:-production}
WP_HOME=${WP_HOME}
WP_SITEURL=${WP_HOME}/wp

AUTH_KEY='${AUTH_KEY}'
SECURE_AUTH_KEY='${SECURE_AUTH_KEY}'
LOGGED_IN_KEY='${LOGGED_IN_KEY}'
NONCE_KEY='${NONCE_KEY}'
AUTH_SALT='${AUTH_SALT}'
SECURE_AUTH_SALT='${SECURE_AUTH_SALT}'
LOGGED_IN_SALT='${LOGGED_IN_SALT}'
NONCE_SALT='${NONCE_SALT}'
EOF

# Create uploads directory if it doesn't exist
mkdir -p /var/www/html/web/app/uploads
chown -R www-data:www-data /var/www/html/web/app/uploads

# Railway sets PORT env variable — update Nginx to use it
PORT=${PORT:-80}
sed -i "s/listen 80;/listen ${PORT};/" /etc/nginx/sites-available/default
sed -i "s/listen 80;/listen ${PORT};/" /etc/nginx/sites-enabled/default 2>/dev/null || true

echo "Starting PHP-FPM..."
php-fpm -D

echo "Starting Nginx on port ${PORT}..."
exec nginx -g 'daemon off;'
