FROM php:8.3-fpm

# Install Nginx, system dependencies and PHP extensions
RUN apt-get update && apt-get install -y \
    nginx \
    git \
    curl \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    zip \
    unzip \
    && docker-php-ext-install pdo_mysql mysqli mbstring exif pcntl bcmath gd zip \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# Copy Nginx config
COPY nginx.conf /etc/nginx/sites-available/default

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Allow Composer to run as root (required in Docker)
ENV COMPOSER_ALLOW_SUPERUSER=1

# Set working directory
WORKDIR /var/www/html

# Copy project files
COPY . .

# Install PHP dependencies (verbose so build logs show any failures)
RUN composer install --no-dev --optimize-autoloader --no-interaction --verbose

# Install Sage theme dependencies (theme has its own composer.json)
RUN composer install --no-dev --optimize-autoloader --no-interaction \
    --working-dir=web/app/themes/studio_glimlach

# Set permissions
RUN chown -R www-data:www-data /var/www/html/web \
    && chmod -R 755 /var/www/html/web

# Copy entrypoint script
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
CMD []
