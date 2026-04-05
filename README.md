# Telegram Movie Bot

A production-ready Telegram Movie Bot built with NestJS, TypeORM, Telegraf, and PostgreSQL.

## Features
- **User Side:** Requires users to join specific channels before using the bot. Users can download movies/files by entering a unique code.
- **Admin Side:** Admins can manage movies, add/remove required channels, view statistics, and get specific user information.

## Tech Stack
- **Framework:** NestJS (TypeScript)
- **Database:** PostgreSQL with TypeORM
- **Telegram Bot API:** Telegraf (`nestjs-telegraf`)
- **Validation:** `class-validator`

## Local Setup

### 1. Prerequisites
- Node.js (v18+)
- PostgreSQL installed and running
- A Telegram Bot Token from [@BotFather](https://t.me/BotFather)

### 2. Installation
```bash
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env` and fill in your actual credentials:
```bash
cp .env.example .env
```
Edit `.env`:
```env
BOT_TOKEN=your_telegram_bot_token_here
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=kino_bot
```

### 4. Running the App
```bash
# Development mode
npm run start:dev

# Production build
npm run build
npm run start:prod
```

### 5. Making yourself an Admin
By default, no user is an admin. To access the admin panel in the bot:
1. Open your `.env` file.
2. Add your Telegram ID to `ADMIN_IDS` (example: `ADMIN_IDS=123456789,987654321`).
3. Send `/admin` to the bot to open the Admin Panel!

Alternatively, you can manually set the `isAdmin` column to `true` in the `users` database table.

## Deployment Instructions

### Option 1: Render / Heroku / Railway
1. Push this repository to GitHub.
2. Connect your GitHub repository to your chosen platform.
3. Add the Environment Variables (from `.env`) to the platform's settings.
4. Set the build command to `npm install && npm run build`.
5. Set the start command to `npm run start:prod`.

### Option 2: VPS (Ubuntu) with PM2
1. Clone the project to your VPS.
2. Install Node.js, PostgreSQL, and PM2 (`npm i -g pm2`).
3. Setup the database and fill the `.env` file.
4. Run `npm install` and `npm run build`.
5. Start the bot with PM2:
   ```bash
   pm2 start dist/main.js --name "kino-bot"
   pm2 save
   ```
# kino
