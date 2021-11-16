## 定时任务脚本

掘金自动签到 签到后会获得一次免费抽奖机会，自动触发免费抽奖。
执行结束发送邮件通知签到结果。

使用方法：fork 本仓库

打开浏览器，登陆掘金，F12 查看 Network 面板，复制 cookie

打开 github 仓库的 Setting，选择 Secrets，新建下列 4 个仓库 Secret
| key | value |
| --- | ---|
| COOKIE | 值为上面复制掘金的 cookie |
| COOKIE1 | 值为上面复制掘金的 cookie（可选） |
| COOKIE2 | 值为上面复制掘金的 cookie（可选） |
| COOKIE3 | 值为上面复制掘金的 cookie（可选） |
| COOKIE4 | 值为上面复制掘金的 cookie（可选） |
| COOKIE5 | 值为上面复制掘金的 cookie（可选） |
| USER | 发送邮件的邮箱地址，该邮箱需要开启 SMTP |
| PASS | 该邮箱的 SMTP 密码 |
| TO | 接收邮件的邮箱 |

### 特性
- 支持多个账号配置（最多支持配置6个掘金账号）
    依次配置 COOKIE COOKIE1 COOKIE2 COOKIE3 COOKIE4 COOKIE5 即可
- 支持配置多个邮箱
    TO 下配置多个收件邮件，使用英文逗号分隔，例如：`123@qq.com, 456@qq.com`

`注意：掘金的cookie大概有一个月的有效期，所以需要定期更新Secret`
