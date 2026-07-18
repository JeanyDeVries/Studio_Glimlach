#!/bin/bash
set -e

echo "Generating .env file..."

# Use PHP to safely write .env — avoids bash heredoc mangling
# special characters ($, !, backticks) that appear in WordPress salt keys
php -r "
\$vars = [
    'DB_NAME', 'DB_USER', 'DB_PASSWORD', 'DB_HOST',
    'WP_ENV', 'WP_HOME',
    'AUTH_KEY', 'SECURE_AUTH_KEY', 'LOGGED_IN_KEY', 'NONCE_KEY',
    'AUTH_SALT', 'SECURE_AUTH_SALT', 'LOGGED_IN_SALT', 'NONCE_SALT',
];

\$lines = [];
foreach (\$vars as \$var) {
    \$value = getenv(\$var);
    if (\$value !== false) {
        \$lines[] = \$var . '=' . \$value;
    }
}

// DB_HOST default
if (!getenv('DB_HOST')) {
    \$lines[] = 'DB_HOST=mysql.railway.internal';
}

// WP_SITEURL derived from WP_HOME
\$wpHome = getenv('WP_HOME');
if (\$wpHome) {
    \$lines[] = 'WP_SITEURL=' . \$wpHome . '/wp';
}

// Enable debug logging (errors go to /var/www/html/web/app/debug.log)
\$lines[] = 'WP_DEBUG=true';
\$lines[] = 'WP_DEBUG_LOG=true';
\$lines[] = 'WP_DEBUG_DISPLAY=false';

file_put_contents('/var/www/html/.env', implode(PHP_EOL, \$lines) . PHP_EOL);
echo 'Done.' . PHP_EOL;
"

# Create required directories
mkdir -p /var/www/html/web/app/uploads
mkdir -p /var/www/html/web/app/cache
chown -R www-data:www-data /var/www/html/web/app/uploads
chown -R www-data:www-data /var/www/html/web/app/cache

# Railway assigns a dynamic port via $PORT env variable
PORT=${PORT:-80}
sed -i "s/listen 80;/listen ${PORT};/" /etc/nginx/sites-available/default

echo "Starting PHP-FPM..."
php-fpm -D

echo "Starting Nginx on port ${PORT}..."
exec nginx -g 'daemon off;'
