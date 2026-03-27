# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Commands

```bash
# Install dependencies
pnpm install

# Build the project (TypeScript compilation + tsc-alias for path resolution)
pnpm run build

# Watch mode for development (incremental TypeScript compilation)
pnpm run dev

# Run the CLI globally (after build)
puba list
puba run <action> [options]
```

## Project Architecture

This is a Node.js CLI tool for automation scripts (daily check-ins, lucky draws, etc.) using TypeScript with ESM modules.

### Core Technologies
- **XState v5**: State machines for orchestrating async workflows (check-in → email notification)
- **Commander.js**: CLI interface (`puba list`, `puba run <action>`)
- **Nodemailer**: Email notifications with HTML templates
- **art-template**: Email templating

### Project Structure

```
src/
├── {action}/           # Each automation action (juejin, hifini, ikuuu, etc.)
│   ├── index.ts        # Main entry, exports default async function(config)
│   ├── api.ts          # API calls for the target platform
│   └── machine.ts      # XState state machine (optional, for complex flows)
├── common/actors/      # Reusable XState actors
│   └── email.ts        # Email notification actor
├── utils/
│   ├── config.ts       # Configuration management (PUBA_ env vars)
│   ├── sendMail.ts     # Email sending with MailSender class
│   └── machine.ts      # Machine runner utilities
└── types/              # TypeScript type definitions
```

### Action Pattern

Each action exports a default function:
```typescript
import config from '@@utils/config.js';

export default async function run(config: any) {
  const emailConfig = config.email();  // { user, pass, to }
  const myParam = config.get('myParam');
  // ... your logic
}
```

Actions use `@@utils/*`, `@@types/*`, and `@@common/*` path aliases configured in tsconfig.json.

### Configuration System

- Environment variables are accessed with `PUBA_` prefix (e.g., `PUBA_EMAIL_USER`)
- `config.get('emailUser')` handles camelCase → EMAIL_USER conversion automatically
- Three configuration sources: CLI args, PUBA_ env vars, `PUBA_CONFIG` JSON string
- `mountConfigToEnv()` merges configs to environment variables

### XState Machine Pattern

Complex actions use XState machines:
1. Define actors in `actors` object (e.g., `doCheckin`, `doSendEmail`)
2. State transitions: initial → checkin → success/error email → done
3. Use `runMachine(machine, input)` or `singletonRunner()` for execution
4. Email actor (`emailActor`) handles success/fail notifications

### Email System

- MailSender class: `makeMailSender(user, pass, domain, to, subject)`
- `sendSuccess(message)` / `sendFail(message)` use `config/mail.tpl` template
- SMTP configured for QQ Mail (smtp.qq.com:465)

## Development Notes

- **Node.js**: >=20.0.0 required
- **Package Manager**: pnpm (specified in package.json)
- **TypeScript**: ES2020 target, NodeNext module resolution
- **Commitlint**: Uses conventional commits format
- **Prettier**: single quotes, 100 char width, 2-space tabs, es5 trailing commas

## Code Conventions

### ESM (ES Module) Usage

This project uses ES modules (`"type": "module"` in package.json). **Always use `import` instead of `require`**.

**Do NOT use:**
```javascript
const { fn } = require('./module.js');
const lib = require('lib');
```

**Do use:**
```javascript
import { fn } from './module.js';
import { fn } from '@utils/module.js';
```

**For dynamic imports (rare):**
```javascript
const module = await import('./module.js');
```

**Why?** The project uses `"type": "module"` which disables CommonJS `require`. Using `require` causes `ReferenceError: require is not defined` at runtime.

### Error Handling in XState Machines

When using XState machines, always add error logging in `onError` handlers:

```typescript
"someState": {
  invoke: { src: "doAction", input: ... },
  onError: {
    target: "done",
    actions: (a) => {
      console.error('Action failed:', a.event.error);
    }
  },
}
```

This helps diagnose issues in GitHub Actions where errors might otherwise be silently swallowed.

### CLI Entry Point

`bin/puba.js` dynamically discovers actions from `dist/` directory (excluding `common`, `types`, `utils`) and imports them as ES modules.

### GitHub Actions

Workflow files in `.github/workflows/` define scheduled runs for each action. Default schedule: 00:01 AM Beijing time (UTC 16:01).
