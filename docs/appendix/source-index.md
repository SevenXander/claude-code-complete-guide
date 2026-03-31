# 源码文件索引

> Claude Code CLI 核心源码文件速查表，按功能模块分类。

---

## 入口与启动

| 文件 | 行数 | 作用 | 对应章节 |
|------|------|------|---------|
| `main.tsx` | ~4,684 | 应用主入口，CLI 参数解析，并行预取 | 2.3, 2.4 |
| `entrypoints/cli.tsx` | - | CLI 模式入口 | 2.3 |
| `entrypoints/mcp.ts` | - | MCP 模式入口 | 8.4 |
| `entrypoints/sdk.ts` | - | SDK 模式入口 | 2.3 |
| `setup.ts` | - | 初始化配置 | 2.3 |

## 核心引擎

| 文件 | 行数 | 作用 | 对应章节 |
|------|------|------|---------|
| `QueryEngine.ts` | ~1,300 | 查询引擎主类 | 4.1 |
| `query.ts` | ~1,700 | 核心查询循环 | 4.2, 4.4 |
| `context.ts` | - | 上下文构建 | 4.3 |
| `tools.ts` | - | 工具注册中心 | 3.2 |
| `Tool.ts` | - | 工具接口定义 | 3.3 |
| `commands.ts` | - | 命令注册中心 | 2.3 |

## 工具系统（tools/）

| 目录 | 作用 | 对应章节 |
|------|------|---------|
| `tools/BashTool/` | Shell 命令执行 | 3.4 |
| `tools/FileReadTool/` | 文件读取 | 3.5 |
| `tools/FileEditTool/` | 文件编辑（字符串替换） | 3.5 |
| `tools/FileWriteTool/` | 文件写入 | 3.5 |
| `tools/GrepTool/` | ripgrep 代码搜索 | 3.6 |
| `tools/GlobTool/` | 文件名匹配 | 3.6 |
| `tools/AgentTool/` | 子 Agent 生成 | 3.8, 10.2 |
| `tools/TeamCreateTool/` | 团队创建 | 10.5 |
| `tools/TeamDeleteTool/` | 团队解散 | 10.5 |
| `tools/SendMessageTool/` | Agent 间通信 | 10.6 |
| `tools/MCPTool/` | MCP 协议工具 | 3.9, 8.4 |
| `tools/WebFetchTool/` | 网页抓取 | 3.9 |
| `tools/WebSearchTool/` | 网络搜索 | 3.9 |
| `tools/NotebookEditTool/` | Jupyter 编辑 | 3.9 |
| `tools/TodoWriteTool/` | 待办事项 | 3.1 |
| `tools/TaskCreateTool/` | 任务创建 | 3.1 |

## UI 组件（components/）

| 文件 | 作用 | 对应章节 |
|------|------|---------|
| `components/App.tsx` | 主应用组件 | 6.3 |
| `components/Messages.tsx` | 消息列表 | 6.4 |
| `components/VirtualMessageList.tsx` | 虚拟滚动 | 6.4 |
| `components/TextInput.tsx` | 输入框 | 6.5 |
| `components/Spinner.tsx` | 加载动画 | 6.7 |
| `components/StructuredDiff.tsx` | Diff 展示 | 6.8 |
| `ink/components/App.tsx` | Ink 运行时 | 6.3 |

## 状态管理（state/）

| 文件 | 作用 | 对应章节 |
|------|------|---------|
| `state/store.ts` | 34 行极简 Store | 7.2 |
| `state/AppStateStore.ts` | 应用状态定义 | 7.3 |
| `state/onChangeAppState.ts` | 副作用同步 | 7.4 |

## 记忆系统（memdir/）

| 文件 | 作用 | 对应章节 |
|------|------|---------|
| `memdir/memdir.ts` | 记忆构建与加载 | 7.5 |
| `memdir/paths.ts` | 路径解析 | 7.5 |
| `memdir/memoryTypes.ts` | 四种记忆分类 | 7.6 |
| `memdir/memoryScan.ts` | 记忆扫描 | 7.5 |
| `memdir/findRelevantMemories.ts` | 记忆检索 | 7.5 |

## 服务层（services/）

| 目录 | 作用 | 对应章节 |
|------|------|---------|
| `services/api/` | API 客户端 | 8.2, 8.3 |
| `services/mcp/` | MCP 协议 | 8.4, 8.5 |
| `services/lsp/` | LSP 集成 | 8.6 |
| `services/oauth/` | OAuth 认证 | 8.7 |
| `services/compact/` | 上下文压缩 | 8.8 |
| `services/analytics/` | 遥测分析 | 8.9 |
| `services/extractMemories/` | 记忆提取 | 8.10 |

## 桥接系统（bridge/）

| 文件 | 作用 | 对应章节 |
|------|------|---------|
| `bridge/bridgeMain.ts` | 桥接主循环 | 9.3 |
| `bridge/bridgeMessaging.ts` | 消息协议 | 9.4 |
| `bridge/jwtUtils.ts` | JWT 认证 | 9.6 |
| `bridge/sessionRunner.ts` | 会话管理 | 9.7 |
| `bridge/replBridgeTransport.ts` | 传输层 | 9.8 |

## 协调器（coordinator/）

| 文件 | 作用 | 对应章节 |
|------|------|---------|
| `coordinator/coordinatorMode.ts` | 协调器模式 | 10.8 |

## 其他

| 文件/目录 | 作用 | 对应章节 |
|----------|------|---------|
| `keybindings/` | 键盘绑定 | 6.9 |
| `vim/` | Vim 模式 | 6.6 |
| `hooks/` | React Hooks | 6.x |
| `migrations/` | 版本迁移 | 7.8 |
| `history.ts` | 会话历史 | 7.7 |
| `skills/` | 技能系统 | 12.9 |
| `plugins/` | 插件系统 | 12.9 |
