# PDF 导出脚本

将本书所有章节导出为单个 PDF 文件。

> 感谢 [@yuwen773](https://github.com/yuwen773) 贡献此脚本 ([PR #2](https://github.com/bcefghj/claude-code-complete-guide/pull/2))

## 使用方法

```bash
# 1. 安装依赖
npm install

# 2. 启动 docsify 本地服务（新开一个终端）
docsify serve docs

# 3. 运行导出脚本
node scripts/export-pdf.js
```

导出完成后会在项目根目录生成 `claude-code-complete-guide.pdf`。

## 配置

在 `scripts/export-pdf.js` 顶部的 `CONFIG` 对象中可以修改：

| 配置项 | 默认值 | 说明 |
|--------|--------|------|
| `baseUrl` | `http://localhost:3000` | docsify 服务地址 |
| `outputPath` | `./claude-code-complete-guide.pdf` | 输出文件路径 |
| `waitTime` | `2000` | 页面渲染等待时间(ms) |
| `pageTimeout` | `30000` | 单页超时时间(ms) |

## 依赖

- [puppeteer](https://pptr.dev/) — 无头浏览器，用于渲染页面
- [pdf-lib](https://pdf-lib.js.org/) — PDF 合并与页码处理
