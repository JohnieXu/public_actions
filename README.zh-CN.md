# Public Actions

✨ 一个自动化脚本集合，用于每日签到、抽奖等日常任务。

[中文版本](README.zh-CN.md) | [English Version](README.md)

## 🚀 功能特性

- **多平台支持**
  - 95504
  - [掘金](https://juejin.cn/) - 每日签到和抽奖
  - [HiFiNi](https://www.hifini.com/) - 论坛每日签到
  - [IKuuu](https://ikuuu.eu/) - 每日签到
  - [Kengee](https://kengee.com/) - 每日签到
  - [瑞幸咖啡](https://www.luckincoffee.com/) - 每日签到

- **邮件通知** - 通过邮件获取执行结果
- **命令行界面** - 易于使用和集成
- **可配置性** - 支持环境变量和命令行参数

## 📋 前置要求

- Node.js >= 20.0.0
- npm 或 pnpm

## 🚀 安装

```bash
# 全局安装
npm install -g public_actions

# 或本地安装
npm install public_actions
```

## 💻 使用方法

### 列出可用的任务

```bash
puba list
puba list --details  # 显示详细信息
```

### 运行任务

```bash
puba run <任务名称> --email-user <用户名> --email-pass <密码> --email-to <收件人> [选项]
```

#### 通用选项
- `--email-user <用户名>`: 邮箱账号（必需）
- `--email-pass <密码>`: 邮箱密码（必需）
- `--email-to <收件人>`: 邮件接收人（必需）

#### 任务特定选项

- **juejin**: `--domain <域名>`, `--username <用户名>`, `--password <密码>`
- **hifini**: `--domain <域名>`, `--cookie <Cookie>`
- **ikuuu**: `--username <用户名>`, `--password <密码>`
- **kengee**: `--username <用户名>`, `--password <密码>`
- **luckincoffeshop**: `--phone <手机号>`, `--password <密码>`

## ⚙️ 配置

您可以通过三种方式配置工具：

1. **命令行参数** - 运行命令时直接传递选项
2. **环境变量** - 设置以 `PUBA_` 为前缀的变量
3. **JSON配置** - 设置 `PUBA_CONFIG` 环境变量，值为JSON内容

## 🤖 使用GitHub Actions自动定时执行

您可以使用GitHub Actions设置自动定时执行任务。方法如下：

1. Fork这个仓库到您的GitHub账号
2. 进入您仓库的 **Settings** > **Secrets and variables** > **Actions**
3. 添加以下 secrets：
   - `USER` - 用于通知的邮箱账号
   - `PASS` - 邮箱密码
   - `TO` - 邮件接收人
   - 任务特定的 secrets（例如，Juejin的`COOKIE`，HiFiNi的`DOMAIN`）

4. 工作流已经配置为每天运行。您可以在 `.github/workflows/` 目录中修改 `cron` 表达式来调整执行时间。

每个任务都有自己的工作流文件（例如，Juejin的`juejin_helper.yml`）。默认执行时间设置为北京时间凌晨00:01（UTC 16:01）。

## 🧩 添加自定义任务脚本

要添加自己的自动化脚本，请按照以下步骤操作：

1. 在 `src/` 目录下为您的任务创建一个新目录（例如 `src/myaction/`）
2. 创建以下文件：
   - `index.ts` - 任务的主入口点
   - `api.ts` - 特定于您任务的API调用
3. 在 `index.ts` 中实现主要逻辑，并导出一个接受config对象的默认函数
4. 使用 `config.get('<param>')` 访问配置参数
5. 使用 `config.email()` 获取邮件配置
6. 使用 `pnpm run build` 构建项目

`src/myaction/index.ts` 的示例结构：

```typescript
import * as api from './api.js';
import config from '@@utils/config.js';

const emailConfig = config.email();
const myParam = config.get('myParam');

// 您的实现代码

export default async function run(config: any) {
  try {
    // 主要逻辑
    console.log('运行我的自定义任务');
    // 如有需要，发送邮件通知
  } catch (error) {
    console.error('我的任务执行错误:', error);
  }
}
```

## 🛠️ 开发

```bash
# 克隆仓库
git clone https://github.com/JohnieXu/public_actions.git
cd public_actions

# 安装依赖
pnpm install

# 构建项目
pnpm run build

# 开发模式运行
pnpm run dev

# 测试您的自定义任务
npx puba run myaction --email-user <用户名> --email-pass <密码> --email-to <收件人> --my-param <值>
```

## 🤝 贡献

欢迎贡献！随时提交问题和拉取请求。

## 📄 许可证

[ISC](LICENSE)

## ⚠️ 免责声明

**1. 本仓库发布的脚本及其中涉及的任何解锁和解密分析脚本，仅用于测试和学习研究，禁止用于商业用途，不能保证其合法性，准确性，完整性和有效性，请根据情况自行判断。**

**2. 本人对任何脚本问题概不负责，包括但不限于由任何脚本错误导致的任何损失或损害。**

**3. 间接使用脚本的任何用户，建立 VPS 或在某些行为违反国家/地区法律或相关法规的情况下进行传播，本人对于由此引起的任何隐私泄漏或其他后果概不负责。**

**4. 请勿将本仓库的任何内容用于商业或非法目的，否则后果自负。**

**5. 如果任何单位或个人认为该项目的脚本可能涉嫌侵犯其权利，则应及时通知并提供身份证明、所有权证明，我们将在收到认证文件后删除相关脚本。**

**6. 任何以任何方式查看此项目的人或直接或间接使用该项目的任何脚本的使用者都应仔细阅读此声明。本人保留随时更改或补充此免责声明的权利。一旦使用并复制了任何相关脚本或 Script 项目的规则，则视为您已接受此免责声明。**