import fs from 'node:fs';
import path from 'node:path';
import { cwd } from 'node:process';

/**
 * Action instructions interface
 */
export interface ActionInstructions {
  actionName: string;
  failureInstructions: string[];
  helpUrl?: string;
  enabled: boolean;
}

/**
 * Instructions configuration interface
 */
interface InstructionsConfig {
  instructions: Record<string, ActionInstructions>;
}

// Cache for instructions configuration
let configCache: InstructionsConfig | null = null;

/**
 * Load instructions configuration from config file
 * @returns {InstructionsConfig} Instructions configuration
 */
export function loadInstructionsConfig(): InstructionsConfig {
  // Return cached config if available
  if (configCache) {
    return configCache;
  }

  const configPath = path.join(cwd(), 'config/email-instructions.json');
  try {
    const content = fs.readFileSync(configPath, { encoding: 'utf-8' });
    configCache = JSON.parse(content);
  } catch {
    // Return empty config if file doesn't exist or fails to parse
    configCache = { instructions: {} };
  }
  return configCache;
}

/**
 * Get failure instructions for a specific action
 * @param {string} actionName - Action name (e.g., 'ikuuu', 'hifini')
 * @returns {ActionInstructions | null} Action instructions if enabled, null otherwise
 */
export function getFailureInstructions(actionName: string): ActionInstructions | null {
  const config = loadInstructionsConfig();
  const actionConfig = config.instructions[actionName];
  return actionConfig?.enabled ? actionConfig : null;
}

/**
 * Format instructions for email template rendering
 * @param {ActionInstructions} actionConfig - Action instructions configuration
 * @returns {{title: string, items: string[], helpUrl?: string}} Formatted instructions
 */
export function formatInstructions(
  actionConfig: ActionInstructions
): { title: string; items: string[]; helpUrl?: string } {
  return {
    title: '故障排查指南',
    items: actionConfig.failureInstructions,
    helpUrl: actionConfig.helpUrl,
  };
}
