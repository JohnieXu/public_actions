# ikuuu 自动签到

支持两种认证方式的 ikuuu 自动签到脚本：

## 认证方式

### 1. 用户名密码认证（默认）

通过用户名和密码登录，获取 cookie 后进行签到。

**配置：**
```bash
# 必填
PUBA_DOMAIN=ikuuu.nl
PUBA_USERNAME=your_email
PUBA_PASSWORD=your_password

# 可选
PUBA_EMAIL_USER=your_email@qq.com
PUBA_EMAIL_PASS=your_email_password
PUBA_EMAIL_TO=receive_email@qq.com
```

### 2. Token 认证（推荐）

直接使用 cookie（token）进行签到，无需密码。

**配置方式：**

#### 方式一：GitHub Secrets
```bash
# 在 GitHub Actions 中设置 Secrets
IKUUU_COOKIE=your_cookie_here
```

#### 方式二：环境变量
```bash
# 必填
PUBA_DOMAIN=ikuuu.nl
PUBA_IKUUU_COOKIE=your_cookie_here

# 可选
PUBA_EMAIL_USER=your_email@qq.com
PUBA_EMAIL_PASS=your_email_password
PUBA_EMAIL_TO=receive_email@qq.com
```

#### 方式三：配置文件
```json
{
  "domain": "ikuuu.nl",
  "cookie": "your_cookie_here",
  "emailUser": "your_email@qq.com",
  "emailPass": "your_email_password",
  "emailTo": "receive_email@qq.com"
}
```

## 如何获取 Cookie

1. 打开浏览器访问 ikuu.nl
2. 登录你的账号
3. 打开开发者工具（F12）
4. 切换到 "Application" 或 "存储" 标签页
5. 在 "Storage" → "Cookies" 下选择 ikuu.nl
6. 复制所有 cookie 值（通常是一段很长的字符串）

## 切换认证方式

通过设置 `PUBA_AUTH_METHOD` 环境变量来选择认证方式：

```bash
# 使用 Token 认证（推荐）
PUBA_AUTH_METHOD=token

# 使用用户名密码认证（默认）
PUBA_AUTH_METHOD=username_password
```

## 注意事项

1. **Token 认证更安全**：不需要存储密码
2. **Token 认证更快**：跳过了登录步骤
3. **Token 有有效期**：如果 cookie 失效，需要重新获取
4. **建议优先使用 Token 认证**：更可靠且更安全