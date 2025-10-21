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
            display: inline-block;
            font-size: 16px;
            max-width: 100%;
            overflow: hidden;
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
              <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAEhElEQVR4AeyZi1HcMBCGlUcfOSoJVBKohKMSSCWQSiB9JEO+T7F9lmzJOp8vTGa4kdB79/93V7ItPob//PdO4K0duKUHdp9DuP0Uwj3lI+Uz5aulmbp9jt1Sv9yK+KkEetCCfQbU/kMI1yGES8pd4GdppmqfY3vqknmG2D31OI9yVVpLIALHkj3oo0FIinwNCcmsJnI0AUAbAhH4KpNliyCxI0ciys6GF5vHENDqj0g0BCi2TZDQi3s8onGsNyloJbBDsOA323wldBLpdDWRaCGg5Z8VXFK6db+6WkksEiAu3WBbY1yU10qiSgDwpbB5eg3hJWz062Q95eIkAYaqAYsEWHiLwEnMo+zhVwhXv0O4oLxgzqpNjRwNsEfGh07WFbImJOi7JJyKJIoEWFgC9oOxPr0A4I4ciQDqgYE95Q2lgIZsX5fjnA70HfPGaY6A4xpyZyXPswRqjHMBXTsSAdQNZO4o9dIT9SHb1+U4p1vXVBhKYDIiJvMnBAid/pE/mXzuDjz0s6LjUmz5+IQAQr7lk8ZtrPFl3N64/rUkD72G0GR8QgABxhvFfIKgguYHz9yLbl8GEy05Ad9LqgCJ43zjJQJPaSzJ1gt5GCUE2ChV6wPOk8njj+pZ0gtW9gSrCU/CKCHAqmSQdpI4Vc5m/V4RXigdpf2UxMgJAV3Uz8rL1xDOafkw+qlnicQwPSGA+2rx3yx0kH6GSo4xIVDzAGNa5gyQZkU2GyshMCvq0JnE3qF7+1pu5bEGDJlESUKAhf/SymNceb1orBxjQgB2RQIsTJjnGrdsg6Ooi7EEY0KgBoKFfpkVLVNbe8wYz6LJ03a8HkNWCVQ3D4uL7+VjJafUMdSSjvHrfMg9kAzmQBCuF2Zfa/O5a9q8JizKzh90CQGetIl75kDghesWRXNra32Ejpb3VaU2zbEEY0KAUd9F/GKiOp/0AiN7SPi9XNxszGlNevURudXYVxjGm2DLCQRclLzvsEjGV5Q3ZOvKMvutGq8Fsd6icheMsqD7i2AvspoOhxyb8iYE6BRkvpm/sviB7DfuMIbVfP2+pryHhBe8izGM54arSdY1E8d4Wl9sQDykOQKBvTC80qLEMDFkBOe37zB2EBNCN696CIS/v5Y5f2eO/iL/+6g5VGcJMCrTfENJQldLwlsIph2SFoL44J3DSFrr5izOS1cFr19m15QI6AUZJ4sA2X8vRxK09YZE94RXsncyAHkzkZsPZm1vNoqyiwQQIsjJxiWG9QLD4QXQXp94L6QCvWZ/S24KIwwkBvddUWaNgIsEOQggDncIjf8mcnBtJoyayKJPD1fVLBFwsVa4AHhUitB+U8f/f+ERj1KPQudukjtdVxBdDLUWAoKKnugE2465I+NFmKRi36l/1EFoeu+6CF5drQScG0lQcdNSnCV5GExOuJqmYwgox3By0xpSPljsm+bjezxptLqHwVGrjyXQC9cbXtJqLT3S5O5+cVe6xvNd4B4UcY91Y83FWgK9gt4jAuj7WkrXuUm1+CrgvZJTCfRy3qx8J/Bmpu8U/wEAAP//kAXMtQAAAAZJREFUAwBOUhlwaZRmmgAAAABJRU5ErkJggg==" alt="GitHub" class="github-icon" />
                JohnieXu/public_actions
            </a>
        </div>
    </div>
</body>
</html>