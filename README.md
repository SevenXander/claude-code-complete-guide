# 图解 Claude Code 完全指南

> 哆啦A梦风格漫画 + 详细源码解析 | 零基础友好 | 12 篇 114 节课

**[📖 在线阅读](https://bcefghj.github.io/claude-code-complete-guide)** | **[⬇️ 下载 PDF](https://github.com/bcefghj/claude-code-complete-guide/releases/download/pdf-20260402/claude-code-complete-guide.pdf)**

## 在线阅读

**[点击这里在线阅读](https://bcefghj.github.io/claude-code-complete-guide)**

## 项目简介

本书将 Anthropic 的 AI 编程助手 **Claude Code** 的 51 万行 TypeScript 源码，整理成一本零基础也能看懂的完全学习指南。

### 特色

- 哆啦A梦风格 **漫画图解**，轻松有趣
- **120+ 节详细课程**，每节配有源码解析
- **生活类比** 解释技术概念（做饭、装修、快递...）
- **Mermaid 架构图**，一图胜千言
- **动手练习**，学以致用
- 支持 **网页在线阅读** + **PDF 导出**

### 内容覆盖

| 篇章 | 主题 | 章节数 |
|------|------|--------|
| 第一篇 | 基础入门 | 4 节 |
| 第二篇 | 架构全景 | 10 节 |
| 第三篇 | 工具系统 | 10 节 |
| 第四篇 | 查询引擎 | 10 节 |
| 第五篇 | 权限系统 | 10 节 |
| 第六篇 | 终端 UI | 10 节 |
| 第七篇 | 状态管理 | 10 节 |
| 第八篇 | 服务与集成 | 10 节 |
| 第九篇 | Bridge 桥接 | 10 节 |
| 第十篇 | 多 Agent 协作 | 10 节 |
| 第十一篇 | 性能优化 | 10 节 |
| 第十二篇 | 亮点总结 | 10 节 |

## 本地运行

```bash
# 克隆仓库
git clone https://github.com/bcefghj/claude-code-complete-guide.git
cd claude-code-complete-guide

# 安装 docsify（需要 Node.js）
npm i docsify-cli -g

# 启动本地服务
docsify serve docs

# 浏览器访问 http://localhost:3000
```

## 下载 PDF

**[⬇️ 直接下载 PDF（最新版）](https://github.com/bcefghj/claude-code-complete-guide/releases/download/pdf-20260402/claude-code-complete-guide.pdf)**

或前往 [Releases 页面](https://github.com/bcefghj/claude-code-complete-guide/releases) 查看所有历史版本。

也可以本地导出：

```bash
# 安装依赖
npm install

# 启动 docsify（新开终端）
docsify serve docs

# 运行导出脚本
node scripts/export-pdf.js
```

详见 [scripts/README.md](scripts/README.md)。

## 源码来源

- [Claude Code CLI](https://github.com/huangserva/claude-code-cli) - TypeScript 源码
- 漫画系列 - [bcefghj GitHub](https://github.com/bcefghj?tab=repositories)

## 声明

本项目仅用于教育学习目的。Claude Code 源码版权归 Anthropic, PBC 所有。
漫画由 AI 生成，仅供学习交流使用。

## 致谢

感谢以下贡献者的建议和代码：

- [@yuwen773](https://github.com/yuwen773) — 贡献了 PDF 批量导出脚本 ([PR #2](https://github.com/bcefghj/claude-code-complete-guide/pull/2))
- [@FnExpress](https://github.com/FnExpress) — 反馈了 Mermaid 图表渲染问题 ([Issue #1](https://github.com/bcefghj/claude-code-complete-guide/issues/1))

## License

MIT
