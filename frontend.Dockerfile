# =====================================================
# Dockerfile para Frontend - FinTrack Web
# Multi-stage build para otimização de tamanho
# =====================================================

# ================= STAGE 1: BUILD ====================
FROM node:20-alpine AS builder

WORKDIR /app

# Copia apenas os arquivos de dependência primeiro (aproveita cache)
COPY frontend/package.json frontend/package-lock.json* ./

# Instala dependências
RUN npm ci --silent

# Copia o resto do código fonte
COPY frontend/ .

# Define a URL da API em tempo de build
# IMPORTANTE: Em produção, a API será acessada via nginx proxy
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL

# Build da aplicação para produção
RUN npm run build

# ================= STAGE 2: RUNTIME ==================
FROM nginx:alpine AS runtime

# Remove configuração padrão do nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia configuração customizada do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos estáticos do build
COPY --from=builder /app/dist /usr/share/nginx/html

# Cria usuário não-root (nginx já roda como www-data por padrão, mas vamos garantir)
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chown -R nginx:nginx /var/cache/nginx && \
    chown -R nginx:nginx /var/log/nginx && \
    touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid

# Expõe porta 80 (HTTP)
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:80/ || exit 1

# Comando de execução
CMD ["nginx", "-g", "daemon off;"]
