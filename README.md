# Public Actions

✨ A collection of automation scripts for daily tasks like check-ins, lucky draws, and more.

[中文版本](README.zh-CN.md) | [English Version](README.md)

## 🚀 Features

- **Multiple Platform Support**
  - 95504
  - [Juejin](https://juejin.cn/) - Daily check-in and lucky draw
  - [HiFiNi](https://www.hifini.com/) - Forum daily check-in
  - [IKuuu](https://ikuuu.eu/) - Daily check-in
  - [Kengee](https://kengee.com/) - Daily check-in
  - [Luckin Coffee Shop](https://www.luckincoffee.com/) - Daily check-in

- **Email Notifications** - Get results via email
- **Command Line Interface** - Easy to use and integrate
- **Configurable** - Supports environment variables and command-line parameters

## 📋 Prerequisites

- Node.js >= 20.0.0
- npm or pnpm

## 🚀 Installation

```bash
# Install globally
npm install -g public_actions

# Or install locally
npm install public_actions
```

## 💻 Usage

### List Available Actions

```bash
puba list
puba list --details  # Show detailed information
```

### Run an Action

```bash
puba run <action> --email-user <USER> --email-pass <PASS> --email-to <TO> [options]
```

#### Common Options
- `--email-user <USER>`: Email account (required)
- `--email-pass <PASS>`: Email password (required)
- `--email-to <TO>`: Email receiver (required)

#### Action Specific Options

- **juejin**: `--domain <DOMAIN>`, `--username <USERNAME>`, `--password <PASSWORD>`
- **hifini**: `--domain <DOMAIN>`, `--cookie <COOKIE>`
- **ikuuu**: `--username <USERNAME>`, `--password <PASSWORD>`
- **kengee**: `--username <USERNAME>`, `--password <PASSWORD>`
- **luckincoffeshop**: `--phone <PHONE>`, `--password <PASSWORD>`

## ⚙️ Configuration

You can configure the tool in three ways:

1. **Command Line Arguments** - Pass options directly when running the command
2. **Environment Variables** - Set variables with `PUBA_` prefix
3. **JSON Configuration** - Set `PUBA_CONFIG` environment variable with JSON content

## 🤖 Automatic Execution with GitHub Actions

You can set up automatic scheduled execution of actions using GitHub Actions. Here's how:

1. Fork this repository to your GitHub account
2. Go to your repository's **Settings** > **Secrets and variables** > **Actions**
3. Add the following secrets:
   - `USER` - Email account for notifications
   - `PASS` - Email password
   - `TO` - Email receiver
   - Action-specific secrets (e.g., `COOKIE` for Juejin, `DOMAIN` for HiFiNi)

4. The workflows are already configured to run daily. You can adjust the schedule in the `.github/workflows/` directory by modifying the `cron` expression.

Each action has its own workflow file (e.g., `juejin_helper.yml` for Juejin). The default schedule is set to run at 00:01 AM Beijing time (UTC 16:01).

## 🧩 Extending with Your Own Actions

To add your own automation script, follow these steps:

1. Create a new directory under `src/` for your action (e.g., `src/myaction/`)
2. Create the following files:
   - `index.ts` - Main entry point for your action
   - `api.ts` - API calls specific to your action
3. In `index.ts`, implement your main logic and export a default function that accepts a config object
4. Use `config.get('<param>')` to access configuration parameters
5. Use `config.email()` to get email configuration
6. Build the project with `pnpm run build`

Example structure for `src/myaction/index.ts`:

```typescript
import * as api from './api.js';
import config from '@@utils/config.js';

const emailConfig = config.email();
const myParam = config.get('myParam');

// Your implementation here

export default async function run(config: any) {
  try {
    // Your main logic
    console.log('Running my custom action');
    // Send email notification if needed
  } catch (error) {
    console.error('Error in my action:', error);
  }
}
```

## 🛠️ Development

```bash
# Clone the repository
git clone https://github.com/JohnieXu/public_actions.git
cd public_actions

# Install dependencies
pnpm install

# Build the project
pnpm run build

# Run in development mode
pnpm run dev

# Test your custom action
npx puba run myaction --email-user <USER> --email-pass <PASS> --email-to <TO> --my-param <VALUE>
```

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## 📄 License

[ISC](LICENSE)