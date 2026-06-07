#!/bin/bash

# Expense Tracker - Deployment Verification Script
# This script verifies that the application is properly configured for deployment

echo "==================================="
echo "Expense Tracker - Deployment Check"
echo "==================================="
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counters
PASSED=0
FAILED=0

# Function to check file exists
check_file() {
  if [ -f "$1" ]; then
    echo -e "${GREEN}✓${NC} File exists: $1"
    ((PASSED++))
    return 0
  else
    echo -e "${RED}✗${NC} File missing: $1"
    ((FAILED++))
    return 1
  fi
}

# Function to check directory exists
check_dir() {
  if [ -d "$1" ]; then
    echo -e "${GREEN}✓${NC} Directory exists: $1"
    ((PASSED++))
    return 0
  else
    echo -e "${RED}✗${NC} Directory missing: $1"
    ((FAILED++))
    return 1
  fi
}

# Function to check if env variable is configured
check_env() {
  if grep -q "$1" .env 2>/dev/null; then
    echo -e "${GREEN}✓${NC} .env variable configured: $1"
    ((PASSED++))
  else
    if [ -f ".env.example" ] && grep -q "$1" .env.example; then
      echo -e "${YELLOW}⚠${NC} .env variable needed (template exists): $1"
    else
      echo -e "${RED}✗${NC} Missing .env variable: $1"
      ((FAILED++))
    fi
  fi
}

echo "1. Checking Essential Files..."
echo "================================"
check_file "app.js"
check_file "package.json"
check_file ".env.example"
check_file "config/config.js"
check_file "utils/logger.js"
check_file ".sequelizerc"
check_file ".gitignore"
echo ""

echo "2. Checking Configuration Files..."
echo "===================================="
check_file "config/config.json"
check_file "ecosystem.config.js"
echo ""

echo "3. Checking Documentation..."
echo "============================"
check_file "DEPLOYMENT.md"
check_file "README-DEPLOYMENT.md"
check_file "DEPLOYMENT-CHECKLIST.md"
check_file "DEPLOYMENT-SUMMARY.md"
echo ""

echo "4. Checking Controllers with Logging..."
echo "========================================"
check_file "controllers/userController.js"
check_file "controllers/expenseController.js"
check_file "controllers/passwordController.js"
check_file "controllers/leaderboardController.js"
check_file "controllers/aiController.js"
check_file "middleware/auth.js"
check_file "utils/db-connection.js"
echo ""

echo "5. Checking Dependencies Installation..."
echo "=========================================="
if [ -d "node_modules" ]; then
  echo -e "${GREEN}✓${NC} Dependencies installed"
  ((PASSED++))
else
  echo -e "${YELLOW}⚠${NC} Run 'npm install' to install dependencies"
fi
echo ""

echo "6. Environment Variables Status..."
echo "=================================="
if [ -f ".env" ]; then
  echo -e "${GREEN}✓${NC} .env file exists"
  ((PASSED++))
  
  echo ""
  echo "Checking critical variables..."
  check_env "DB_HOST="
  check_env "DB_NAME="
  check_env "DB_USER="
  check_env "DB_PASSWORD="
  check_env "JWT_SECRET="
  check_env "BREVO_API_KEY="
  check_env "GEMINI_API_KEY="
else
  echo -e "${YELLOW}⚠${NC} .env file not found"
  echo "   Create .env from .env.example and configure values"
  echo "   Command: cp .env.example .env"
fi
echo ""

echo "7. Checking Git Configuration..."
echo "================================"
if grep -q "\.env" .gitignore 2>/dev/null; then
  echo -e "${GREEN}✓${NC} .env file properly ignored in git"
  ((PASSED++))
else
  echo -e "${RED}✗${NC} .env not in .gitignore - security risk!"
  ((FAILED++))
fi

if grep -q "node_modules" .gitignore 2>/dev/null; then
  echo -e "${GREEN}✓${NC} node_modules properly ignored"
  ((PASSED++))
else
  echo -e "${RED}✗${NC} node_modules not in .gitignore"
  ((FAILED++))
fi

if grep -q "logs/" .gitignore 2>/dev/null; then
  echo -e "${GREEN}✓${NC} logs directory properly ignored"
  ((PASSED++))
else
  echo -e "${RED}✗${NC} logs not in .gitignore"
  ((FAILED++))
fi
echo ""

echo "8. Checking Code Quality..."
echo "============================="
if grep -r "logger\." controllers/ > /dev/null 2>&1; then
  echo -e "${GREEN}✓${NC} Logging implemented in controllers"
  ((PASSED++))
else
  echo -e "${YELLOW}⚠${NC} Some controllers may lack logging"
fi

if grep -q "process.env.PORT" app.js; then
  echo -e "${GREEN}✓${NC} PORT configuration from environment"
  ((PASSED++))
else
  echo -e "${RED}✗${NC} PORT not configured from environment"
  ((FAILED++))
fi

if grep -q "process.env.APP_BASE_URL" controllers/passwordController.js; then
  echo -e "${GREEN}✓${NC} APP_BASE_URL configuration found"
  ((PASSED++))
else
  echo -e "${YELLOW}⚠${NC} APP_BASE_URL may not be configured"
fi
echo ""

echo "9. Package.json Scripts..."
echo "=========================="
if grep -q '"migrate"' package.json; then
  echo -e "${GREEN}✓${NC} Migration scripts added"
  ((PASSED++))
else
  echo -e "${YELLOW}⚠${NC} Migration scripts missing"
fi
echo ""

echo "=================================="
echo "Deployment Check Summary"
echo "=================================="
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
  echo -e "${GREEN}✓ Application is ready for deployment!${NC}"
  echo ""
  echo "Next steps:"
  echo "1. Create .env file: cp .env.example .env"
  echo "2. Configure all environment variables"
  echo "3. Create MySQL database"
  echo "4. Run migrations: npm run migrate"
  echo "5. Test locally: npm run dev"
  echo "6. Deploy to production"
  exit 0
else
  echo -e "${RED}✗ Please fix the issues above before deployment${NC}"
  exit 1
fi
