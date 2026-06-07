module.exports = {
  apps: [
    {
      name: "expense-tracker",
      script: "./app.js",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "development",
        PORT: 5000
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 5000
      },
      error_file: "./logs/error.log",
      out_file: "./logs/out.log",
      log_file: "./logs/combined.log",
      time: true,
      args: "",
      watch: false,
      ignore_watch: ["node_modules", "logs"],
      merge_logs: true,
      autorestart: true,
      max_memory_restart: "1G",
      max_restarts: 10,
      min_uptime: "10s"
    }
  ],
  deploy: {
    production: {
      user: "node",
      host: "your-server-ip",
      ref: "origin/main",
      repo: "your-repo-url",
      path: "/var/www/expense-tracker",
      "post-deploy": "npm install && npm run migrate && pm2 reload ecosystem.config.js --env production"
    }
  }
};
