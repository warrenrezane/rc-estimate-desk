FROM composer:2 AS build

RUN apk add --no-cache nodejs npm

WORKDIR /app

COPY composer.json composer.lock ./
RUN composer install \
    --no-dev \
    --no-interaction \
    --no-progress \
    --prefer-dist \
    --no-scripts \
    --optimize-autoloader

COPY package.json package-lock.json .npmrc ./
RUN npm ci --ignore-scripts --no-audit --no-fund

COPY . .

RUN php artisan package:discover --ansi \
    && php artisan route:clear \
    && npm run build \
    && rm -rf node_modules

FROM php:8.4-cli-alpine AS runtime

RUN apk add --no-cache icu-libs libpq libzip oniguruma \
    && apk add --no-cache --virtual .php-build-deps $PHPIZE_DEPS icu-dev libpq-dev libzip-dev oniguruma-dev \
    && docker-php-ext-install -j$(nproc) bcmath intl mbstring opcache pdo_mysql pdo_pgsql zip \
    && apk del .php-build-deps

WORKDIR /var/www/html

COPY --from=build /app ./

RUN mkdir -p storage/framework/cache storage/framework/sessions storage/framework/views storage/logs bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache

ENV APP_ENV=production \
    APP_NAME=EstimateDesk \
    APP_DEBUG=false \
    LOG_CHANNEL=stderr \
    SESSION_DRIVER=cookie \
    CACHE_STORE=file \
    QUEUE_CONNECTION=sync

USER www-data

EXPOSE 8080

CMD ["sh", "-c", "if [ -z \"$APP_KEY\" ]; then export APP_KEY=$(php artisan key:generate --show --no-ansi); fi; exec php artisan serve --host=0.0.0.0 --port=${PORT:-8080}"]
