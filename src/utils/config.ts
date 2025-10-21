/**
 * 获取配置项
 * @param {string} key 配置项名称
 * @param {any} defaultValue 默认值
 * @returns {any} 配置值
 */
export function getConfig<T>(key: string, defaultValue?: string): string {
  // 尝试从process.env中获取（PUBA_前缀的大写下划线格式）
  const envKey = `PUBA_${key.toUpperCase().replace(/([A-Z])/g, '_$1')}`;
  if (process.env[envKey]) {
    return process.env[envKey];
  }
  
  if (process.env[key]) {
    return process.env[key];
  }
  
  return defaultValue as string;
}

/**
 * 获取邮件相关配置
 * @returns {object} 邮件配置对象
 */
export function getEmailConfig() {
  return {
    user: getConfig('emailUser'),
    pass: getConfig('emailPass'),
    to: getConfig('emailTo')
  };
}

/**
 * 获取所有配置的对象
 * @returns {object} 包含所有配置的对象
 */
export function getAllConfig() {
  const config: Record<string, string | undefined> = {};
  
  for (const [key, value] of Object.entries(process.env)) {
    if (key.startsWith('PUBA_')) {
      const cleanKey = key.substring(5).toLowerCase().replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      config[cleanKey] = value;
    }
  }
  
  return config;
}

/**
 * 将配置对象挂载到process.env环境变量上
 * @param {Object} config 配置对象
 */
export function mountConfigToEnv(config: Record<string, any>): void {
  for (const [key, value] of Object.entries(config)) {
    if (value) {
      const envKey = `PUBA_${key.toUpperCase().replace(/([A-Z])/g, '_$1')}`;
      process.env[envKey] = value;
    }
  }
}

const config = {
  get: getConfig,
  email: getEmailConfig,
  all: getAllConfig,
  mountToEnv: mountConfigToEnv
};

export default config;