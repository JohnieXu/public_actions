#!/usr/bin/env node

import { program } from 'commander';
import packageJson from '../package.json' with { type: 'json' };
import { readdir, stat } from 'fs/promises';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import process from 'process';
import { mountConfigToEnv } from '../dist/utils/config.js';

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

/**
 * 验证公共配置参数
 * @param {Object} config 配置对象
 * @returns {String|null} 错误信息，如果没有错误则返回null
 */
function validateCommonConfig(config) {
  const requiredFields = [
    { key: 'emailUser', message: 'email account is required (--email-user)' },
    { key: 'emailPass', message: 'email password is required (--email-pass)' },
    { key: 'emailTo', message: 'email receiver is required (--email-to)' }
  ];
  
  for (const field of requiredFields) {
    if (!config[field.key]) {
      return field.message;
    }
  }
  
  return null;
}

/**
 * 获取当前action的配置选项帮助信息
 * @param {String} actionName action名称
 * @returns {String} 帮助信息
 */
function getActionHelp(actionName) {
  const actionHelpMap = {
    juejin: `\nJuejin specific options:\n  --domain: <DOMAIN> juejin domain\n  --username: <USERNAME> juejin username\n  --password: <PASSWORD> juejin password`,
    hifini: `\nHifini specific options:\n  --domain: <DOMAIN> hifini domain\n  --cookie: <COOKIE> hifini cookie`,
    ikuuu: `\nIkuuu specific options:\n  --username: <USERNAME> ikuuu username\n  --password: <PASSWORD> ikuuu password`,
    kengee: `\nKengee specific options:\n  --username: <USERNAME> kengee username\n  --password: <PASSWORD> kengee password`,
    luckincoffeshop: `\nLuckin Coffee Shop specific options:\n  --phone: <PHONE> phone number\n  --password: <PASSWORD> account password`
  };
  
  return actionHelpMap[actionName] || '';
}

/**
 * 获取action的简短描述信息
 * @param {String} actionName action名称
 * @returns {String} 简短描述
 */
function getActionDescription(actionName) {
  const descriptionMap = {
    '95504': '95504 action',
    juejin: '掘金签到和抽奖',
    hifini: 'HiFiNi论坛签到',
    ikuuu: 'IKuuu签到',
    kengee: 'Kengee签到',
    luckincoffeshop: '瑞幸咖啡签到'
  };
  
  return descriptionMap[actionName] || `${actionName} action`;
}

/**
 * 获取action支持的配置选项列表（用于list命令显示）
 * @param {String} actionName action名称
 * @returns {String[]} 配置选项列表
 */
function getActionOptions(actionName) {
  const optionsMap = {
    juejin: ['--domain', '--username', '--password'],
    hifini: ['--domain', '--cookie'],
    ikuuu: ['--username', '--password'],
    kengee: ['--username', '--password'],
    luckincoffeshop: ['--phone', '--password']
  };
  
  return optionsMap[actionName] || [];
}

program
  .version(packageJson.version, '-v, --version')
  .description('run public actions easily');

// Async function to handle CLI execution
async function main() {
  const runCommand = program.command('run <action>')
    .description('to run an action')
    .option('--email-user <USER>', 'email account, required')
    .option('--email-pass <PASS>', 'email password, required')
    .option('--email-to <TO>', 'email receiver, required')
    .allowUnknownOption(true)
    .allowExcessArguments(true)
    .action(async (name, options, command) => {
      console.log(`Running action: ${name}`);
      try {
        const validationError = validateCommonConfig(options);
        if (validationError) {
          console.error(`\nError: ${validationError}`);
          console.error(`\nUsage: puba run ${name} --email-user <USER> --email-pass <PASS> --email-to <TO> [options]`);
          console.error(getActionHelp(name));
          process.exit(1);
        }

        // 解析未知选项并添加到配置中
        const unknownOptions = (command.args || []).slice(1);
        const parsedUnknownOptions = {};
        
        if (unknownOptions.length > 0) {
          // 解析 --key value 格式的未知选项
          for (let i = 0; i < unknownOptions.length; i++) {
            const arg = unknownOptions[i];
            if (arg.startsWith('--')) {
              const key = arg.substring(2);
              // 如果下一个参数不是以 -- 开头，则作为当前选项的值
              if (i + 1 < unknownOptions.length && !unknownOptions[i + 1].startsWith('--')) {
                parsedUnknownOptions[key] = unknownOptions[i + 1];
                i++;
              } else {
                parsedUnknownOptions[key] = true; // 对于没有值的选项，设置为true
              }
            }
          }
        }

        const config = {
          ...options,
          ...(process.env.PUBA_CONFIG ? JSON.parse(process.env.PUBA_CONFIG) : {}),
          ...parsedUnknownOptions,
        };

        mountConfigToEnv(config);


        // Import and execute the action module
        const module = await import(`../dist/${name}/index.js`);
        if (module.default && typeof module.default === 'function') {
          await module.default(config);
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
          console.error(`\nUsage: puba run ${name} --email-user <USER> --email-pass <PASS> --email-to <TO> [options]`);
          console.error(getActionHelp(name));
        }
        process.exit(1);
      }
    });

  program
    .command('list')
    .description('to show all available actions')
    .option('--exclude <folders>', 'folders to exclude (comma-separated)', 'common,types,utils')
    .option('--details', 'show detailed information about each action', false)
    .action(async (options) => {
      try {
        const excludedFolders = options.exclude.split(',');
        const actionDirectories = await getAvailableActions(excludedFolders);
        
        console.log('Available actions:');
        if (actionDirectories.length > 0) {
          if (options.details) {
            console.log('');
            console.log('Public required options for all actions:');
            console.log('  --email-user <USER>  email account, required');
            console.log('  --email-pass <PASS>  email password, required');
            console.log('  --email-to <TO>      email receiver, required');
            console.log('');
            console.log('Action specific options:');
            console.log('------------------------');
            
            actionDirectories.forEach(action => {
              const description = getActionDescription(action);
              const optionsList = getActionOptions(action);
              
              console.log(`${action}: ${description}`);
              if (optionsList.length > 0) {
                console.log('  Required options:');
                optionsList.forEach(option => {
                  console.log(`    ${option}`);
                });
              } else {
                console.log('  No specific options required');
              }
              console.log('------------------------');
            });
          } else {
            actionDirectories.forEach(action => {
              const description = getActionDescription(action);
              console.log(`  ${action} - ${description}`);
            });
          }
          
          console.log('');
          console.log(`Total: ${actionDirectories.length} actions available`);
          if (!options.details) {
            console.log('Run "puba list --details" to see more information about each action');
          }
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