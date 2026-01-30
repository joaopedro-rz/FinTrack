#!/bin/bash
# =====================================================
# FinTrack - Script de Setup Local (Linux/Mac)
# =====================================================

echo ""
echo "========================================"
echo "  FinTrack - Setup Local"
echo "========================================"
echo ""

# Verificar se o .env existe
if [ ! -f .env ]; then
    echo "[ERRO] Arquivo .env não encontrado!"
    echo ""
    echo "Crie o arquivo .env na raiz do projeto com:"
    echo ""
    echo "DB_HOST=db.seu-projeto.supabase.co"
    echo "DB_PORT=5432"
    echo "DB_NAME=postgres"
    echo "DB_USERNAME=postgres"
    echo "DB_PASSWORD=sua_senha"
    echo "DB_SSL_MODE=require"
    echo "JWT_SECRET=seu_jwt_secret"
    echo "JWT_EXPIRATION=3600000"
    echo "FRONTEND_PORT=3000"
    echo ""
    exit 1
fi

echo "[1/4] Verificando Docker..."
if ! command -v docker &> /dev/null; then
    echo "[ERRO] Docker não encontrado! Instale o Docker."
    exit 1
fi
echo "[OK] Docker instalado"

echo ""
echo "[2/4] Verificando Java..."
if ! command -v java &> /dev/null; then
    echo "[ERRO] Java não encontrado! Instale Java 17+"
    exit 1
fi
echo "[OK] Java instalado"

echo ""
echo "[3/4] Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "[ERRO] Node.js não encontrado! Instale Node.js 18+"
    exit 1
fi
echo "[OK] Node.js instalado"

echo ""
echo "[4/4] Instalando dependências do frontend..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "[ERRO] Falha ao instalar dependências"
    cd ..
    exit 1
fi
cd ..
echo "[OK] Dependências instaladas"

echo ""
echo "========================================"
echo "  Setup completo!"
echo "========================================"
echo ""
echo "Para iniciar o projeto:"
echo ""
echo "1. Backend (Spring Boot):"
echo "   ./mvnw spring-boot:run"
echo ""
echo "2. Frontend (React):"
echo "   cd frontend"
echo "   npm run dev"
echo ""
echo "3. Acesse: http://localhost:3000"
echo ""
