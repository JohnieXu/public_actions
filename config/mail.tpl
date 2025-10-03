<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <title>{{title}}</title>
    <style type="text/css">
        body {
            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
            color: #333;
            margin: 0;
            padding: 20px;
            background-color: #f7f7f7;
        }
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #fff;
            border-radius: 6px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 24px;
        }
        .email-header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 1px solid #eee;
            padding-bottom: 16px;
        }
        .email-header h1 {
            font-size: 24px;
            color: #2c3e50;
            margin: 0;
        }
        .status-block {
            padding: 16px;
            border-radius: 4px;
            margin-bottom: 20px;
        }
        .status-success {
            background-color: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
        }
        .status-failure {
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            color: #721c24;
        }
        .status-block h2 {
            margin-top: 0;
            font-size: 18px;
        }
        .json-preview {
            background-color: #f8f9fa;
            border: 1px solid #e2e6ea;
            border-radius: 4px;
            padding: 16px;
            overflow-x: auto;
            white-space: pre-wrap;
            font-family: Consolas, monospace;
            font-size: 14px;
            line-height: 1.6;
            margin-bottom: 20px;
        }
        .email-footer {
            margin-top: 20px;
            text-align: center;
            color: #6c757d;
            font-size: 14px;
        }
        .project-link {
            color: #0066cc;
            text-decoration: underline;
            margin-top: 10px;
            display: inline-flex;
            align-items: center;
            gap: 6px;
        }
        .github-icon {
            width: 16px;
            height: 16px;
            vertical-align: middle;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="email-header">
            <h1>{{title}}</h1>
        </div>

        <div class="status-block {{if _status === "success"}}status-success{{else}}status-failure{{/if}}">
            <h2>{{status}}</h2>
            <p>{{description}}</p>
        </div>

        <div class="json-preview">{{jsonData}}</div>

        <div class="email-footer">
            <p>通知生成时间：{{createdAt}}</p>
            <a href="https://github.com/JohnieXu/public_actions" class="project-link" target="_blank">
                <img src="https://github.githubassets.com/images/icons/emoji/octocat.png" 
                     class="github-icon" 
                     alt="GitHub" 
                     loading="lazy">
                JohnieXu/public_actions
            </a>
        </div>
    </div>
</body>
</html>