# Expense Tracker - Deployment Guide

## Pre-Deployment Checklist

### 1. Environment Variables Setup

Before deploying, create a `.env` file in the project root with the following variables:

```bash
# Database Configuration
DB_HOST=your_database_host
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_secure_database_password
DB_PORT=3306

# Server Configuration
PORT=5000
NODE_ENV=production
APP_BASE_URL=https://your-domain.com

# JWT Configuration
JWT_SECRET=your_strong_jwt_secret_key

# Email Configuration (Brevo)
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=your_sender_email@example.com

# Gemini AI Configuration
GEMINI_API_KEY=your_gemini_api_key

# Logging Configuration
LOG_DIR=./logs
LOG_LEVEL=info
```

### 2. Security Recommendations

- **Never commit `.env` file to version control** - Use `.env.example` as a template
- **Use strong passwords** for database and JWT secrets
- **Use HTTPS** in production (update `APP_BASE_URL` accordingly)
- **Rotate API keys regularly** in production
- **Use environment-specific configurations** for different deployment stages

### 3. Database Setup

1. Create MySQL database:
```bash
CREATE DATABASE expense_tracker;
```

2. Run migrations:
```bash
npx sequelize-cli db:migrate
```

### 4. Installation & Deployment Steps

1. **Clone/Pull the repository**
```bash
git clone <repository-url>
cd ExpenseTracker
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.example .env
# Edit .env with your actual values
```

4. **Run database migrations**
```bash
npx sequelize-cli db:migrate
```

5. **Start the application**

   **Development:**
   ```bash
   npm run dev
   ```

   **Production:**
   ```bash
   NODE_ENV=production npm start
   ```

### 5. Logging

- All logs are automatically written to `./logs/` directory
- **combined.log** - Contains all logs (info, warn, error, debug)
- **warn.log** - Contains warning logs only
- **error.log** - Contains error logs only
- Log level can be configured via `LOG_LEVEL` environment variable (default: 'info')
- For debug logs, set `LOG_LEVEL=debug`

### 6. Error Handling

- All API errors are logged automatically
- In production, error details are hidden from API responses for security
- In development, full error messages are visible for debugging
- Check logs for detailed error information

### 7. Monitoring & Maintenance

- Regularly monitor log files for errors and warnings
- Implement log rotation for large log files
- Set up alerts for critical errors
- Keep dependencies updated: `npm update`

### 8. File Structure

```
ExpenseTracker/
├── app.js                 # Main application file
├── config/
│   ├── config.js         # Database configuration (uses env variables)
│   └── config.json       # Legacy config (deprecated)
├── controllers/          # Business logic
├── models/              # Database models
├── routes/              # API routes
├── middleware/          # Express middleware (auth, etc.)
├── utils/
│   ├── db-connection.js # Database connection
│   ├── logger.js        # Logging utility
│   ├── gemini.js        # Gemini AI configuration
│   └── token-generator.js # JWT token generation
├── views/               # HTML files
├── public/              # Static assets (CSS, JS)
├── logs/                # Application logs (auto-generated)
├── migrations/          # Database migrations
├── .env.example         # Environment variables template
├── .gitignore          # Git ignore rules
└── package.json        # Dependencies
```

### 9. Troubleshooting

**Database Connection Error:**
- Verify `DB_HOST`, `DB_USER`, `DB_PASSWORD` in `.env`
- Ensure MySQL service is running
- Check database exists and user has permissions

**Port Already in Use:**
- Change `PORT` in `.env` or
- Kill the process using the port

**API Keys Not Working:**
- Verify all API keys in `.env` are correct
- Check API key permissions and expiration
- Ensure API keys match the service domain

**Missing Logs:**
- Check if `logs/` directory exists
- Verify `LOG_DIR` path in `.env` is correct
- Ensure write permissions on the logs directory

### 10. Performance Tips

- Use a reverse proxy (Nginx) in production for better performance
- Enable compression in Nginx for API responses
- Use a process manager like PM2 for auto-restart on crashes
- Consider implementing rate limiting for API endpoints
- Use connection pooling for database connections (configured in Sequelize)

---

## Production Deployment Example (Using PM2)

```bash
# Install PM2 globally
npm install -g pm2

# Start application with PM2
pm2 start app.js --name "expense-tracker" --env production

# View logs
pm2 logs expense-tracker

# Restart on reboot
pm2 startup
pm2 save
```

---

For issues or questions, check the logs directory and refer to the error messages for debugging.
