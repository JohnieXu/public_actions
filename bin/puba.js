#!/usr/bin/env node

import { program } from 'commander';
import packageJson from '../package.json' with { type: 'json' };
import { readdir, stat } from 'fs/promises';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * get all available actions in dist folder
 * @param {String[]} excludeFolders folders to exclude
 * @returns {String[]} available actions
 */
async function getAvailableActions(excludeFolders = ['common', 'types', 'utils']) {
  const distDir = resolve(__dirname, '..', 'dist');
  const excludedSet = new Set(excludeFolders.map(f => f.trim()));
  const actionDirectories = [];
  
  try {
    const entries = await readdir(distDir, { withFileTypes: true });
    
    for (const entry of entries) {
      if (!entry.isDirectory() || excludedSet.has(entry.name)) {
        continue;
      }
      
      const indexFilePath = join(distDir, entry.name, 'index.js');
      try {
        const indexFileStat = await stat(indexFilePath);
        if (indexFileStat.isFile()) {
          actionDirectories.push(entry.name);
        }
      } catch {
        continue;
      }
    }
  } catch (error) {
    console.error('Error reading dist directory:', error.message || error);
  }
  
  return actionDirectories.sort();
}

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
          
          const availableActions = await getAvailableActions();
          if (availableActions.length > 0) {
            availableActions.forEach(action => {
              console.error(`  ${action}`);
            });
          } else {
            console.error('  No actions found');
          }
          
          console.error('\nExample: puba run juejin');
        } else {
          console.error('Error executing action:', error.message || error);
        }
        process.exit(1);
      }
    });

  program
    .command('list')
    .description('to show all available actions')
    .option('--exclude <folders>', 'folders to exclude (comma-separated)', 'common,types,utils')
    .action(async (options) => {
      try {
        const excludedFolders = options.exclude.split(',');
        const actionDirectories = await getAvailableActions(excludedFolders);
        
        console.log('Available actions:');
        if (actionDirectories.length > 0) {
          actionDirectories.forEach(action => {
            console.log('  ' + action);
          });
          console.log('');
          console.log(`Total: ${actionDirectories.length} actions available`);
        } else {
          console.log('  No actions found');
        }
      } catch (error) {
        console.error('Error listing actions:', error.message || error);
        process.exit(1);
      }
    });

  program.parse(process.argv);
}

main().catch((error) => {
  console.error('Program execution error:', error);
  process.exit(1);
});