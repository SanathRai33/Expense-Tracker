# Quick Reference - Deployment Guide

## 🚀 30-Second Quick Start

```bash
# 1. Create environment file
cp .env.example .env

# 2. Configure your .env with actual values
nano .env

# 3. Install dependencies
npm install

# 4. Setup database
npm run migrate

# 5. Run locally
npm run dev

# 6. Check logs
tail -f logs/combined.log
```

---

## 📋 Critical Environment Variables

Set these in your `.env` file before deployment:

```env
# Database (CRITICAL)
DB_HOST=your-db-host
DB_NAME=expense_tracker
DB_USER=your-db-user
DB_PASSWORD=STRONG_PASSWORD_HERE  # DO NOT share

# Security (CRITICAL)
JWT_SECRET=STRONG_SECRET_32_CHARS_MINIMUM

# Email API (CRITICAL for password reset)
BREVO_API_KEY=your_api_key
BREVO_SENDER_EMAIL=noreply@yourdomain.com

# AI Service (CRITICAL for category suggestions)
GEMINI_API_KEY=your_api_key

# Optional with defaults
PORT=5000
NODE_ENV=development
APP_BASE_URL=http://localhost:5000
DB_PORT=3306
LOG_LEVEL=info
LOG_DIR=./logs
```

---

## 📁 File Structure After Setup

```
ExpenseTracker/
├── app.js
├── package.json
├── .env                    ← YOUR CONFIG (add to .gitignore)
├── .env.example           ← TEMPLATE (commit to git)
├── .sequelizerc           ← Sequelize configuration
├── .gitignore             ← Prevents .env from being committed
├── ecosystem.config.js    ← PM2 production config
├── verify-deployment.sh   ← Verification script
│
├── config/
│   ├── config.js          ← Database config (env-based)
│   └── config.json        ← Legacy (deprecated)
│
├── controllers/           ← All have logging now
│   ├── userController.js
│   ├── expenseController.js
│   ├── passwordController.js
│   ├── leaderboardController.js
│   └── aiController.js
│
├── utils/
│   ├── logger.js          ← NEW: Logging system
│   ├── db-connection.js
│   ├── gemini.js
│   └── token-generator.js
│
├── middleware/
│   └── auth.js            ← Has logging now
│
├── routes/
├── models/
├── migrations/
├── views/
├── public/
│
├── logs/                  ← AUTO-CREATED
│   ├── combined.log       ← All logs
│   ├── warn.log          ← Warnings
│   └── error.log         ← Errors
│
└── Documentation/
    ├── DEPLOYMENT.md
    ├── README-DEPLOYMENT.md
    ├── DEPLOYMENT-CHECKLIST.md
    └── DEPLOYMENT-SUMMARY.md
```

---

## 🔧 Common Commands

```bash
# Development
npm run dev                 # Start with nodemon (hot reload)

# Production
npm start                  # Run application
NODE_ENV=production npm start

# Database
npm run migrate            # Run pending migrations
npm run migrate:undo       # Undo last migration
npm run migrate:undo:all   # Undo all migrations

# With PM2
pm2 start ecosystem.config.js --env production
pm2 logs expense-tracker
pm2 restart expense-tracker
pm2 stop expense-tracker
pm2 delete expense-tracker
```

---

## 🔍 Monitoring

### View Logs
```bash
# All logs
tail -f logs/combined.log

# Only errors
tail -f logs/error.log

# Only warnings
tail -f logs/warn.log

# Search for specific user
grep "john@example.com" logs/combined.log

# Count errors
grep -c "ERROR" logs/error.log
```

### Check Application Status
```bash
# If using PM2
pm2 status

# Check specific port
lsof -i :5000

# Check running processes
ps aux | grep node
```

---

## 🛡️ Security Checklist

- [ ] `.env` file created and configured
- [ ] `.env` file added to `.gitignore`
- [ ] Strong passwords (16+ chars with special characters)
- [ ] JWT_SECRET is unique and strong
- [ ] API keys are valid and have appropriate permissions
- [ ] `NODE_ENV=production` set for production
- [ ] `APP_BASE_URL` uses HTTPS (production)
- [ ] Database user has minimal required permissions
- [ ] Backups configured
- [ ] SSL/TLS certificate installed

---

## 🐛 Troubleshooting

### "Cannot find module 'dotenv'"
```bash
npm install
```

### "Database connection refused"
- Check DB_HOST, DB_USER, DB_PASSWORD in .env
- Verify MySQL is running
- Ensure database user has permissions
```bash
mysql -u $DB_USER -p$DB_PASSWORD -h $DB_HOST -e "SELECT 1;"
```

### "Port 5000 already in use"
```bash
# Change PORT in .env or kill process
lsof -i :5000
kill -9 <PID>
```

### "Logs not being created"
- Check write permissions: `ls -la logs/`
- Verify LOG_DIR path in .env
- Create logs manually: `mkdir -p logs`

### "Invalid API key error"
- Verify API keys in .env are correct
- Check API key hasn't expired
- Verify API key has correct permissions for the domain

---

## 📊 Log Examples

### Info (Successful Operations)
```
[2024-06-07T10:30:45.123Z] [INFO] New user registered: john@example.com
[2024-06-07T10:30:46.456Z] [INFO] User logged in: john@example.com
[2024-06-07T10:30:47.789Z] [INFO] Expense added by user 1: Amount 500
```

### Warn (Potential Issues)
```
[2024-06-07T10:35:12.345Z] [WARN] Failed login attempt for: hack@example.com
[2024-06-07T10:35:13.678Z] [WARN] Invalid token attempted: jwt malformed
```

### Error (System Issues)
```
[2024-06-07T10:40:20.111Z] [ERROR] Unable to connect to database: ECONNREFUSED
[2024-06-07T10:40:21.222Z] [ERROR] API key invalid: GEMINI_API_KEY
```

---

## 🚀 Production Deployment Steps

### Option 1: PM2 (Recommended)

```bash
# Install PM2
npm install -g pm2

# Start application
pm2 start ecosystem.config.js --env production

# Save and restart on reboot
pm2 startup
pm2 save

# Monitor
pm2 monit
pm2 logs
```

### Option 2: Direct Node

```bash
NODE_ENV=production PORT=5000 npm start
```

### Option 3: Docker

```bash
docker build -t expense-tracker .
docker run -d --env-file .env -p 5000:5000 expense-tracker
```

---

## 📞 Getting Help

1. **Check Logs First**
   ```bash
   tail -f logs/error.log
   ```

2. **Verify Configuration**
   ```bash
   bash verify-deployment.sh
   ```

3. **Read Documentation**
   - DEPLOYMENT.md - Detailed guide
   - DEPLOYMENT-CHECKLIST.md - Pre-deployment checklist
   - README-DEPLOYMENT.md - Quick start

---

## ✅ Pre-Deployment Verification

Run this script to verify everything:

```bash
bash verify-deployment.sh
```

Should see all checkmarks (✓) before deploying.

---

## 🔗 File References

| File | Purpose |
|------|---------|
| `.env.example` | Template for environment variables |
| `.env` | Your actual configuration (DO NOT COMMIT) |
| `config/config.js` | Database configuration |
| `utils/logger.js` | Logging system |
| `ecosystem.config.js` | PM2 production config |
| `.sequelizerc` | Sequelize CLI config |
| `verify-deployment.sh` | Deployment verification |

---

## 💡 Tips

1. **Use PM2 for production** - Auto-restart, clustering, monitoring
2. **Setup log rotation** - Logs can grow large
3. **Monitor error.log regularly** - Catches production issues early
4. **Use strong passwords** - At least 16 characters
5. **Rotate API keys** - Quarterly or if compromised
6. **Backup database regularly** - Critical for data safety
7. **Setup SSL/TLS** - Use Let's Encrypt for free certificates

---

**Your application is ready for production!** 🎉
