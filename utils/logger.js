const fs = require('fs');
const path = require('path');

const logsDir = process.env.LOG_DIR || './logs';
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const getTimestamp = () => {
  return new Date().toISOString();
};

const formatLog = (level, message, error = null) => {
  const timestamp = getTimestamp();
  let logMessage = `[${timestamp}] [${level}] ${message}`;
  
  if (error) {
    logMessage += `\nError Details: ${error.message}\nStack: ${error.stack}`;
  }
  
  return logMessage;
};

const writeToFile = (filename, content) => {
  const filepath = path.join(logsDir, filename);
  fs.appendFileSync(filepath, content + '\n\n');
};

const logger = {
  info: (message) => {
    const log = formatLog('INFO', message);
    console.log(log);
    writeToFile('combined.log', log);
  },

  warn: (message) => {
    const log = formatLog('WARN', message);
    console.warn(log);
    writeToFile('combined.log', log);
    writeToFile('warn.log', log);
  },

  error: (message, error = null) => {
    const log = formatLog('ERROR', message, error);
    console.error(log);
    writeToFile('combined.log', log);
    writeToFile('error.log', log);
  },

  debug: (message) => {
    if (process.env.LOG_LEVEL === 'debug') {
      const log = formatLog('DEBUG', message);
      console.log(log);
      writeToFile('combined.log', log);
    }
  },
};

module.exports = logger;
