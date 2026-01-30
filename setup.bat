@echo off
REM =====================================================
REM FinTrack - Script de Setup Local (Windows)
REM =====================================================

echo.
echo ========================================
echo   FinTrack - Setup Local
echo ========================================
echo.

REM Verificar se o .env existe
if not exist .env (
    echo [ERRO] Arquivo .env nao encontrado!
    echo.
    echo Crie o arquivo .env na raiz do projeto com:
    echo.
    echo DB_HOST=db.seu-projeto.supabase.co
    echo DB_PORT=5432
    echo DB_NAME=postgres
    echo DB_USERNAME=postgres
    echo DB_PASSWORD=sua_senha
    echo DB_SSL_MODE=require
    echo JWT_SECRET=seu_jwt_secret
    echo JWT_EXPIRATION=3600000
    echo FRONTEND_PORT=3000
    echo.
    pause
    exit /b 1
)

echo [1/4] Verificando Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Docker nao encontrado! Instale o Docker Desktop.
    pause
    exit /b 1
)
echo [OK] Docker instalado

echo.
echo [2/4] Verificando Java...
java -version >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Java nao encontrado! Instale Java 17+
    pause
    exit /b 1
)
echo [OK] Java instalado

echo.
echo [3/4] Verificando Node.js...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERRO] Node.js nao encontrado! Instale Node.js 18+
    pause
    exit /b 1
)
echo [OK] Node.js instalado

echo.
echo [4/4] Instalando dependencias do frontend...
cd frontend
call npm install
if errorlevel 1 (
    echo [ERRO] Falha ao instalar dependencias
    cd ..
    pause
    exit /b 1
)
cd ..
echo [OK] Dependencias instaladas

echo.
echo ========================================
echo   Setup completo!
echo ========================================
echo.
echo Para iniciar o projeto:
echo.
echo 1. Backend (Spring Boot):
echo    mvnw.cmd spring-boot:run
echo.
echo 2. Frontend (React):
echo    cd frontend
echo    npm run dev
echo.
echo 3. Acesse: http://localhost:3000
echo.
pause
