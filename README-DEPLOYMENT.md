# Expense Tracker - Setup & Deployment Guide

## Overview

The Expense Tracker app has been prepared for production deployment with the following improvements:

✅ **Environment Variables** - All sensitive data moved to `.env`  
✅ **Error Logging** - Comprehensive file-based logging system  
✅ **Security** - Hardcoded values removed  
✅ **Configuration Management** - Environment-specific settings  

---

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Environment Variables

Copy `.env.example` to `.env` and fill in your actual values:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database Configuration
DB_HOST=127.0.0.1
DB_NAME=expense_tracker
DB_USER=root
DB_PASSWORD=your_secure_password
DB_PORT=3306

# Server
PORT=5000
NODE_ENV=development
APP_BASE_URL=http://localhost:5000

# JWT
JWT_SECRET=your_strong_secret_key

# Email (Brevo)
BREVO_API_KEY=your_api_key
BREVO_SENDER_EMAIL=noreply@yourdomain.com

# AI (Gemini)
GEMINI_API_KEY=your_gemini_key

# Logging
LOG_DIR=./logs
LOG_LEVEL=info
```

### 3. Setup Database

```bash
# Create MySQL database
mysql -u root -p -e "CREATE DATABASE expense_tracker;"

# Run migrations
npm run migrate
```

### 4. Start Application

**Development:**
```bash
npm run dev
```

**Production:**
```bash
NODE_ENV=production npm start
```

---

## Key Changes Made

### 1. Environment Variables (.env)

All sensitive data is now managed through environment variables:

| Variable | Purpose | Required |
|----------|---------|----------|
| `DB_HOST` | MySQL host | Yes |
| `DB_NAME` | Database name | Yes |
| `DB_USER` | Database user | Yes |
| `DB_PASSWORD` | Database password | Yes |
| `DB_PORT` | Database port | No (default: 3306) |
| `PORT` | Server port | No (default: 5000) |
| `NODE_ENV` | Environment (development/production) | No |
| `APP_BASE_URL` | Application base URL | No (for email links) |
| `JWT_SECRET` | JWT signing key | Yes |
| `BREVO_API_KEY` | Email service API key | Yes |
| `BREVO_SENDER_EMAIL` | Email sender address | Yes |
| `GEMINI_API_KEY` | AI service API key | Yes |
| `LOG_DIR` | Logs directory | No (default: ./logs) |
| `LOG_LEVEL` | Log level (info/warn/error/debug) | No |

### 2. Configuration Files

**config/config.js** - Database configuration using environment variables
- Supports development, test, and production environments
- Fallback values provided for optional settings

**config/config.json** - Legacy JSON config (can be removed)

**.sequelizerc** - Sequelize CLI configuration pointing to config.js

### 3. Logging System (utils/logger.js)

Three types of log files are created in `./logs/`:

- **combined.log** - All logs (info, warn, error)
- **warn.log** - Warning logs only
- **error.log** - Error logs only

Each log entry includes:
- Timestamp (ISO format)
- Log level
- Message
- Stack trace (for errors)

```javascript
// Usage in controllers
const logger = require('../utils/logger');

logger.info('User logged in: email@example.com');
logger.warn('Failed login attempt');
logger.error('Database connection failed', error);
logger.debug('Debugging info'); // Only if LOG_LEVEL=debug
```

### 4. Files Updated with Logging

- **controllers/userController.js** - User registration/login tracking
- **controllers/expenseController.js** - Expense operations logging
- **controllers/passwordController.js** - Password reset tracking
- **controllers/leaderboardController.js** - Leaderboard access logging
- **controllers/aiController.js** - AI category suggestions logging
- **middleware/auth.js** - Authentication attempt logging
- **utils/db-connection.js** - Database connection logging

### 5. Error Handling

Global error handler in `app.js`:
- Logs all errors to file
- Returns safe error messages in production
- Returns detailed errors in development

---

## Production Deployment

### Using PM2 (Recommended)

```bash
# Install PM2
npm install -g pm2

# Start with ecosystem config
pm2 start ecosystem.config.js --env production

# View logs
pm2 logs expense-tracker

# Setup auto-restart on reboot
pm2 startup
pm2 save
```

### Using Docker (Optional)

Create a `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 5000

CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t expense-tracker .
docker run -d --name expense-tracker \
  --env-file .env \
  -p 5000:5000 \
  -v $(pwd)/logs:/app/logs \
  expense-tracker
```

### Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

---

## Security Best Practices

### 1. Environment Variables

❌ **Never commit `.env` to git**
✅ **Use `.env.example` as template**
✅ **Add `.env` to `.gitignore`** (already done)

### 2. API Keys

- Generate strong, unique keys for each service
- Rotate keys regularly in production
- Use different keys for dev/staging/production
- Never share API keys in code or documentation

### 3. Database

- Use strong passwords (mix of uppercase, lowercase, numbers, symbols)
- Restrict database user permissions
- Use HTTPS for remote database connections
- Regular backups

### 4. JWT Secret

- Use a cryptographically secure random string (32+ characters)
- Generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
- Change if compromised

### 5. SSL/TLS

- Use HTTPS in production
- Update `APP_BASE_URL` to use https://
- Use Let's Encrypt for free SSL certificates

---

## Monitoring & Maintenance

### Log Analysis

```bash
# View recent errors
tail -f logs/error.log

# Count errors by type
grep -i "error" logs/combined.log | wc -l

# Find slow operations
grep -i "timeout\|slow" logs/combined.log
```

### Performance Monitoring

- Monitor disk space (logs can grow large)
- Implement log rotation (using tools like logrotate)
- Monitor memory usage with PM2: `pm2 monit`

### Database Optimization

- Add indexes for frequently queried columns
- Regular database backups
- Monitor slow queries

---

## Troubleshooting

### Database Connection Issues

```bash
# Check connection string
echo "Host: $DB_HOST, User: $DB_USER, Database: $DB_NAME"

# Verify MySQL is running
mysql -u $DB_USER -p$DB_PASSWORD -h $DB_HOST

# Check logs
tail logs/error.log
```

### Port Already in Use

```bash
# Find process using port 5000
lsof -i :5000

# Kill process
kill -9 <PID>

# Or change PORT in .env
```

### Missing API Keys

```bash
# Verify all required env vars are set
node -e "console.log(process.env)" | grep BREVO
node -e "console.log(process.env)" | grep GEMINI
```

### Log File Issues

```bash
# Check disk space
df -h

# Check log directory permissions
ls -la logs/

# Rotate large log files
gzip logs/combined.log
```

---

## Scripts Available

```bash
npm start           # Start production server
npm run dev        # Start development with nodemon
npm run migrate    # Run database migrations
npm run migrate:undo  # Undo last migration
npm run migrate:undo:all  # Undo all migrations
```

---

## Additional Resources

- **DEPLOYMENT.md** - Detailed deployment guide
- **.env.example** - Environment variables template
- **ecosystem.config.js** - PM2 configuration
- **logs/** - Application logs directory (auto-created)

---

## Support

For issues:
1. Check logs in `./logs/error.log`
2. Verify `.env` configuration
3. Ensure all dependencies are installed
4. Check database connectivity
5. Verify API keys are valid

---

**Ready for production!** 🚀
