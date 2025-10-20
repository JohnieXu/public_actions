#!/usr/bin/env node

import { program } from 'commander';
import packageJson from '../package.json' with { type: 'json' };

program
  .version(packageJson.version, '-v, --version')
  .description('run public actions easily');

// Async function to handle CLI execution
async function main() {
  program
    .command('run <action>')
    .description('to run an action')
    .option('--email-user <USER>', 'email account, required')
    .option('--email-pass <PASS>', 'email password, required')
    .option('--email-to <TO>', 'email receiver, required')
    .action(async (name, options) => {
      console.log(`Running action: ${name}`);
      try {
        // Import and execute the specified module
        const module = await import(`../dist/${name}/index.js`);
        if (module.default && typeof module.default === 'function') {
          await module.default(options);
        }
        console.log(`Running action: ${name} done`);
      } catch (error) {
        // Handle module not found error with friendly message
        if (error.code === 'ERR_MODULE_NOT_FOUND' && error.message.includes('Cannot find module')) {
          console.error(`\nError: Action "${name}" not found`);
          console.error('Available actions:');
          console.error('  95504, hifini, ikuuu, juejin, kengee, luckincoffeshop');
          console.error('\nExample: puba run juejin');
        } else {
          console.error('Error executing action:', error.message || error);
        }
        process.exit(1);
      }
    });

  program.parse(process.argv);
}

main().catch((error) => {
  console.error('Program execution error:', error);
  process.exit(1);
});