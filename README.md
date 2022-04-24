# Mariupol Bot

# Local Development

### Pre-requirements

-   Install NodeJS >=14.13.1
-   Install Yarn

1. Clone this repo: `git clone https://github.com/askel4dd/mariupol-bot`
2. Run `mv .env.sample .env` in the root directory to create `.env` file with the environment variables listed below
3. Run `yarn` in the root directory
4. Run `yarn develop`

# Environment variables

-   `TOKEN` (required) — [Telegram bot token](https://core.telegram.org/bots#6-botfather)
-   `SENTRY_DSN` (optional) — [Sentry DSN](https://docs.sentry.io/product/sentry-basics/dsn-explainer/)

Also, please, consider looking at `.env.sample`.

# Deploy production

Bot is hosted on Heroku. Follow [these steps](https://dashboard.heroku.com/apps/mariupol-bot/deploy/heroku-git) to deploy production:

### 1. Install the Heroku CLI

Download and install the [Heroku CLI](https://devcenter.heroku.com/articles/heroku-command-line).

If you haven't already, log in to your Heroku account and follow the prompts to create a new SSH public key.

```bash
heroku login
```

### 2. Clone the repository

Use Git to clone mariupol-bot's source code to your local machine.

```bash
heroku git:clone -a mariupol-bot
cd mariupol-bot
```

### 3. Deploy your changes

Make some changes to the code you just cloned and deploy them to Heroku using Git.

```bash
git add .
git commit -am "make it better"
git push heroku main
```

# License

MIT — use for any purpose. Would be great if you could leave a note about the original developers. Thanks!
