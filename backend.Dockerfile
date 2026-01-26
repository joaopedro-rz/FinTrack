# =====================================================
# Dockerfile para Backend - FinTrack API
# Multi-stage build para otimização de tamanho
# =====================================================

# ================= STAGE 1: BUILD ====================
FROM eclipse-temurin:17-jdk-alpine AS builder

WORKDIR /app

# Copia apenas os arquivos necessários para download de dependências
# Isso aproveita o cache do Docker (se pom.xml não mudar, não baixa deps de novo)
COPY pom.xml .
COPY mvnw .
COPY .mvn .mvn

# Dá permissão de execução ao Maven wrapper
RUN chmod +x mvnw

# Baixa as dependências (fica em cache se pom.xml não mudar)
RUN ./mvnw dependency:go-offline -B

# Copia o código fonte
COPY src src

# Compila o projeto (sem rodar testes para build mais rápido)
# Para rodar com testes, remova -DskipTests
RUN ./mvnw clean package -DskipTests -B

# ================= STAGE 2: RUNTIME ==================
FROM eclipse-temurin:17-jre-alpine AS runtime

WORKDIR /app

# Cria usuário não-root por segurança (nunca rode containers como root em produção)
RUN addgroup -g 1001 -S fintrack && \
    adduser -u 1001 -S fintrack -G fintrack

# Copia o JAR do stage de build
COPY --from=builder /app/target/*.jar app.jar

# Muda ownership do arquivo para o usuário não-root
RUN chown fintrack:fintrack app.jar

# Usa o usuário não-root
USER fintrack

# Expõe a porta da aplicação
EXPOSE 8080

# Variáveis de ambiente com valores padrão seguros
# IMPORTANTE: Em produção, SEMPRE sobrescreva via docker-compose ou variáveis de ambiente
ENV JAVA_OPTS="-Xms256m -Xmx512m" \
    SPRING_PROFILES_ACTIVE="docker"

# Health check para monitoramento
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/health || exit 1

# Comando de execução
# Usando exec form para que sinais sejam propagados corretamente
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
