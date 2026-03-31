# 术语表

> 按字母顺序排列，快速查阅技术术语的含义。

---

## A

**Agent（代理）**：能够自主执行多步骤任务的 AI 系统。Claude Code 就是一个编程 Agent，它能自己规划、执行、验证任务。

**Agent Loop（代理循环）**：AI 反复 "思考 → 调用工具 → 获取结果 → 再思考" 的核心循环，直到任务完成。

**Agent Swarm（代理群）**：多个 Agent 协作完成复杂任务的机制。包含 Coordinator（协调者）和 Worker（工作者）两种角色。

**API（应用程序接口）**：软件之间通信的约定接口。Claude Code 通过 API 与 Anthropic 的 Claude 模型通信。

**AppState（应用状态）**：Claude Code 中管理 500+ 字段的全局状态对象。

**AST（抽象语法树）**：将代码解析为树形结构，便于分析。BashTool 用 AST 分析 Shell 命令的安全性。

## B

**Bash**：Unix/macOS 系统的命令行 Shell。BashTool 让 Claude Code 能执行 Shell 命令。

**Bridge（桥接）**：Claude Code 中连接 CLI 和 IDE（VS Code、JetBrains）的通信系统。

**Bun**：超快的 JavaScript/TypeScript 运行时，Claude Code 使用它替代 Node.js。

## C

**CLI（命令行界面）**：通过文本命令与计算机交互的界面，如终端。

**Claude**：Anthropic 公司开发的 AI 大语言模型，Claude Code 的核心智能来源。

**Commander.js**：Node.js 的命令行参数解析库，Claude Code 用它处理命令行选项。

**Compact（压缩）**：当对话上下文太长时，自动将旧消息压缩为摘要的机制。

**Coordinator（协调者）**：多 Agent 系统中负责任务分配和调度的主 Agent。

## D

**Dead Code Elimination（死代码消除）**：构建时移除不会执行的代码分支，减小包体积。

**Docsify**：基于 Markdown 的文档网站生成器，本书就是用它构建的。

## F

**Feature Flag（特性标志）**：通过配置开关控制功能是否启用，无需修改代码。

**Fork（分叉）**：创建子进程或子 Agent 来并行执行任务。

## G

**GrowthBook**：特性标志管理平台，Claude Code 用它控制功能的灰度发布。

## H

**Hook（钩子）**：React 中管理组件状态和副作用的函数，如 useState、useEffect。

## I

**Ink**：React 的终端渲染器，让你用 React 组件构建终端 UI。

## J

**JSON Schema**：描述 JSON 数据格式的标准，用于工具的输入参数验证。

**JWT（JSON Web Token）**：基于 JSON 的安全令牌，Bridge 系统用它做身份认证。

**JSONL**：每行一个 JSON 对象的文件格式，用于存储会话历史。

## L

**Lazy Loading（懒加载）**：延迟加载模块，只在需要时才加载，加快启动速度。

**LSP（Language Server Protocol）**：语言服务器协议，提供代码智能感知（自动补全、跳转定义等）。

## M

**MCP（Model Context Protocol）**：模型上下文协议，AI 调用外部工具的行业标准协议。

**Memdir（记忆目录）**：Claude Code 基于文件系统的长期记忆存储机制。

**Mermaid**：用文本描述生成图表的工具，本书大量使用。

**Migration（迁移）**：配置文件版本升级的机制，确保旧配置自动适配新版本。

## O

**OAuth 2.0**：开放授权标准，Claude Code 用它实现安全登录。

**OpenTelemetry（OTel）**：可观测性标准框架，用于收集应用的指标、日志和追踪数据。

## P

**PKCE（Proof Key for Code Exchange）**：OAuth 2.0 的安全扩展，防止授权码被截获。

**Prefetch（预取）**：提前加载可能需要的数据，Claude Code 启动时并行预取配置。

**Prompt（提示词）**：发送给 AI 模型的文本指令，系统提示词决定了 AI 的行为方式。

**Pub/Sub（发布/订阅）**：一种消息传递模式，发布者发送消息，订阅者接收通知。

## Q

**QueryEngine（查询引擎）**：Claude Code 的核心引擎，管理对话生命周期和工具调用循环。

## R

**React**：Facebook 开发的 UI 库，用于声明式构建用户界面。Claude Code 用它（通过 Ink）渲染终端 UI。

**REPL（Read-Eval-Print Loop）**：读取-执行-打印循环，交互式命令行环境。

**ripgrep（rg）**：超快的代码搜索工具，GrepTool 基于它实现。

## S

**SSE（Server-Sent Events）**：服务器向客户端推送事件的 Web 技术。

**Stream（流）**：数据分块传输的方式，Claude Code 用流式响应实现打字机效果。

**Store**：状态容器，Claude Code 的 createStore 只有 34 行代码。

## T

**Token**：AI 模型处理文本的基本单位，约 4 个字符 = 1 个 token。

**Tool（工具）**：Claude Code 中执行特定操作的模块，如 BashTool、FileReadTool。

**Tool Use（工具调用）**：AI 模型通过结构化请求调用外部工具的机制。

**TypeScript**：JavaScript 的超集，添加了类型系统，Claude Code 的主编程语言。

## V

**Virtual Scroll（虚拟滚动）**：只渲染视口内的元素，优化长列表性能。

## W

**WebSocket**：全双工通信协议，Bridge 系统的 v1 传输层使用。

**Worker**：多 Agent 系统中执行具体任务的子 Agent。

## Y

**Yoga**：Facebook 的 Flexbox 布局引擎，Ink 用它计算终端中的组件布局。

## Z

**Zod**：TypeScript 的运行时数据验证库，Claude Code 用它定义工具的输入 Schema。

---

> 回到 [学习路线图](part00-preface/roadmap.md) 开始你的学习之旅。
