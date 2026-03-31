# 第3课：启动流程详解：从命令行到 REPL

## 学习目标

通过本课学习，你将能够：

1. 理解 `main.tsx` 入口文件的组织结构
2. 跟踪从用户输入 `claude` 到 REPL 启动的完整流程
3. 理解并行预取（Parallel Prefetch）的启动优化策略
4. 认识 CLI 参数解析的设计模式
5. 了解 AppState 初始化和 Store 创建过程

---

## 3.1 一切从 main.tsx 开始

### 生活类比：开一家餐厅

每天早上开店前，餐厅要做很多准备工作：

1. **开门前检查**（环境检查）
2. **打开灯和空调**（初始化基础设施）
3. **准备食材**（加载配置和数据）
4. **通知服务员就位**（启动服务）
5. **翻开"营业中"牌子**（显示 REPL 界面）

Claude Code 的启动流程也是这样——看似瞬间完成，实际上有精心编排的步骤。

---

## 3.2 启动流程全景

```mermaid
graph TB
    subgraph "启动流程时间线"
        E1["🚀 main.tsx 入口<br/>profileCheckpoint('main_tsx_entry')"]
        E2["⚡ 并行预取启动<br/>MDM + Keychain + GrowthBook"]
        E3["📋 CLI 参数解析<br/>Commander.js 解析命令行"]
        E4["🔧 环境初始化<br/>配置加载 + 权限设置"]
        E5["📦 状态创建<br/>AppState + Store"]
        E6["🔌 服务连接<br/>MCP 服务器 + LSP"]
        E7["🖥️ REPL 渲染<br/>React/Ink 启动"]

        E1 --> E2 --> E3 --> E4 --> E5 --> E6 --> E7
    end
```

---

## 3.3 入口文件的前几行：速度优化的极致

打开 `main.tsx`，前 20 行就体现了对启动速度的极致追求：

```typescript
// 源码：main.tsx（前20行）

// 这些副作用必须在所有其他 import 之前运行：
// 1. profileCheckpoint 在模块加载前标记时间点
// 2. startMdmRawRead 启动 MDM 子进程（plutil/reg query），
//    让它们和后续 ~135ms 的 import 并行运行
// 3. startKeychainPrefetch 启动 macOS 钥匙串读取
import { profileCheckpoint } from './utils/startupProfiler.js';
profileCheckpoint('main_tsx_entry');

import { startMdmRawRead } from './utils/settings/mdm/rawRead.js';
startMdmRawRead();

import { startKeychainPrefetch } from './utils/secureStorage/keychainPrefetch.js';
startKeychainPrefetch();
```

### 这里有什么巧妙的设计？

```mermaid
sequenceDiagram
    participant Main as main.tsx
    participant MDM as MDM子进程
    participant KC as Keychain读取
    participant Import as 模块加载

    Main->>Main: profileCheckpoint (记录时间)
    Main->>MDM: startMdmRawRead() 🚀
    Main->>KC: startKeychainPrefetch() 🚀
    Main->>Import: 继续加载 135ms 的其他模块

    Note over MDM,Import: 三者并行执行！

    Import->>Import: import React, Commander, chalk...
    MDM->>MDM: 读取 MDM 配置完成
    KC->>KC: 钥匙串读取完成

    Note over Main: 等所有模块加载完，预取结果已经准备好了
```

**类比**：就像你边等咖啡机加热（模块加载），边去信箱拿报纸（MDM 读取），边遛狗（钥匙串读取）——三件事同时做，总时间只取决于最慢的那个。

---

## 3.4 CLI 参数解析

`main.tsx` 使用 Commander.js 来解析命令行参数：

```typescript
// 源码：main.tsx（简化版 CLI 配置）
import { Command as CommanderCommand } from '@commander-js/extra-typings'

// 创建 CLI 程序
const program = new CommanderCommand()

// 各种选项：
// --model / -m     指定模型
// --permission-mode 权限模式
// --resume / -r    恢复会话
// --verbose        详细输出
// --max-turns      最大轮数
// --mcp-config     MCP 配置文件
```

### 常见 CLI 选项一览

```mermaid
graph LR
    subgraph "CLI 参数分类"
        subgraph "模型相关"
            M1["--model sonnet"]
            M2["--permission-mode plan"]
        end
        subgraph "会话相关"
            S1["--resume"]
            S2["--continue"]
        end
        subgraph "高级选项"
            A1["--mcp-config path"]
            A2["--max-turns 10"]
            A3["--verbose"]
        end
    end
```

---

## 3.5 AppState 初始化

启动时，系统创建一个巨大的 AppState 来管理全局状态：

```typescript
// 源码：state/AppStateStore.ts
export function getDefaultAppState(): AppState {
  return {
    settings: getInitialSettings(),
    tasks: {},
    agentNameRegistry: new Map(),
    verbose: false,
    mainLoopModel: null,
    toolPermissionContext: {
      ...getEmptyToolPermissionContext(),
      mode: initialMode,
    },
    mcp: {
      clients: [],
      tools: [],
      commands: [],
      resources: {},
      pluginReconnectKey: 0,
    },
    plugins: {
      enabled: [],
      disabled: [],
      commands: [],
      errors: [],
    },
    todos: {},
    thinkingEnabled: shouldEnableThinkingByDefault(),
    // ...更多字段
  }
}
```

### AppState 的结构图

```mermaid
graph TB
    subgraph "AppState 全景"
        AS["AppState"]
        AS --> S["settings<br/>用户配置"]
        AS --> T["tasks<br/>后台任务"]
        AS --> TPC["toolPermissionContext<br/>权限上下文"]
        AS --> MCP["mcp<br/>MCP 连接"]
        AS --> PLG["plugins<br/>插件系统"]
        AS --> TODO["todos<br/>待办列表"]
        AS --> MODEL["mainLoopModel<br/>当前模型"]
        AS --> BRIDGE["replBridge*<br/>桥接状态"]
    end
```

然后用 Store 包装：

```typescript
// 源码：main.tsx
import { createStore } from './state/store.js'

const appStateStore = createStore<AppState>(
  getDefaultAppState(),
  onChangeAppState  // 状态变化时的回调
)
```

**类比**：AppState 就像餐厅的**中央控制面板**——灯光状态、空调温度、客人数量、点单列表……所有信息集中管理。

---

## 3.6 命令系统加载

启动时加载所有可用命令：

```typescript
// 源码：commands.ts
export async function getCommands(cwd: string): Promise<Command[]> {
  const allCommands = await loadAllCommands(cwd)
  const dynamicSkills = getDynamicSkills()

  const baseCommands = allCommands.filter(
    _ => meetsAvailabilityRequirement(_) && isCommandEnabled(_),
  )

  // 动态技能插入
  if (dynamicSkills.length === 0) {
    return baseCommands
  }

  const baseCommandNames = new Set(baseCommands.map(c => c.name))
  const uniqueDynamicSkills = dynamicSkills.filter(
    s => !baseCommandNames.has(s.name) &&
         meetsAvailabilityRequirement(s) &&
         isCommandEnabled(s),
  )

  return [...baseCommands, ...uniqueDynamicSkills]
}
```

命令的加载是**分层**的：

```mermaid
graph TB
    subgraph "命令加载层次"
        L1["内置命令<br/>/help, /clear, /compact..."]
        L2["插件命令<br/>用户安装的插件"]
        L3["技能命令<br/>/skills 目录下的技能"]
        L4["动态技能<br/>运行时发现的技能"]
        L5["工作流命令<br/>workflow 脚本"]

        L1 --> MERGE["合并去重"]
        L2 --> MERGE
        L3 --> MERGE
        L4 --> MERGE
        L5 --> MERGE
        MERGE --> FINAL["最终命令列表"]
    end
```

---

## 3.7 工具注册

所有工具在启动时注册：

```typescript
// 源码：tools.ts
export const getTools = (permissionContext: ToolPermissionContext): Tools => {
  // 简单模式：只有 Bash、Read 和 Edit
  if (isEnvTruthy(process.env.CLAUDE_CODE_SIMPLE)) {
    const simpleTools: Tool[] = [BashTool, FileReadTool, FileEditTool]
    return filterToolsByDenyRules(simpleTools, permissionContext)
  }

  // 完整模式：获取所有工具并过滤
  const tools = getAllBaseTools().filter(tool => !specialTools.has(tool.name))
  let allowedTools = filterToolsByDenyRules(tools, permissionContext)
  const isEnabled = allowedTools.map(_ => _.isEnabled())
  return allowedTools.filter((_, i) => isEnabled[i])
}
```

注意这里的**两种模式**：

| 模式 | 工具数量 | 适用场景 |
|------|---------|---------|
| 简单模式 (`--bare`) | 3个 | 脚本化调用 |
| 完整模式 | 40+个 | 交互式使用 |

---

## 3.8 启动到 REPL 的完整流水线

```mermaid
sequenceDiagram
    participant User as 用户
    participant CLI as CLI 解析
    participant Init as 初始化
    participant State as 状态创建
    participant MCP as MCP 连接
    participant REPL as REPL 渲染

    User->>CLI: $ claude "你好"
    CLI->>CLI: 解析参数 (Commander.js)
    CLI->>Init: 环境初始化
    Init->>Init: 加载配置文件
    Init->>Init: 检查认证状态
    Init->>Init: 加载 GrowthBook 配置
    Init->>State: 创建 AppState + Store
    State->>State: getDefaultAppState()
    State->>State: createStore(defaultState)
    State->>MCP: 连接 MCP 服务器
    MCP->>MCP: 初始化工具列表
    MCP->>REPL: 启动 React/Ink UI
    REPL->>REPL: 渲染终端界面
    REPL->>User: 显示 REPL 或执行单次查询
```

---

## 3.9 两种运行模式

Claude Code 支持两种运行模式：

### 交互模式（REPL）

```bash
$ claude          # 进入交互式 REPL
$ claude          # 在 REPL 中持续对话
```

### 非交互模式（Print/Headless）

```bash
$ claude -p "解释这段代码"    # 单次查询，输出后退出
$ echo "你好" | claude        # 管道输入
```

```mermaid
graph TB
    subgraph "运行模式选择"
        INPUT["用户输入"]
        INPUT -->|"有 -p 参数<br/>或管道输入"| PRINT["Print 模式<br/>（非交互）"]
        INPUT -->|"无参数<br/>直接运行"| REPL["REPL 模式<br/>（交互式）"]

        PRINT --> QE["QueryEngine<br/>单次查询"]
        QE --> OUTPUT["输出结果并退出"]

        REPL --> UI["React/Ink UI<br/>持续交互"]
        UI --> LOOP["查询循环<br/>等待用户输入"]
    end
```

---

## 动手练习

### 练习1：追踪启动日志

在你的终端运行 Claude Code 时加上 `--verbose` 参数，观察启动过程中的日志输出。

### 练习2：理解 AppState

打开 `state/AppStateStore.ts`，列出 `AppState` 中你能理解的前 10 个字段，用自己的话解释它们的用途。

### 练习3：命令探索

阅读 `commands.ts` 中的 `COMMANDS` 数组，回答：

- [ ] 总共有多少个内置命令？
- [ ] 哪些命令只对内部用户可用？（看 `INTERNAL_ONLY_COMMANDS`）
- [ ] `REMOTE_SAFE_COMMANDS` 包含哪些命令？为什么？

### 思考题

1. 为什么要在模块加载之前就启动 MDM 读取和钥匙串预取？
2. AppState 为什么要用 `DeepImmutable` 类型包装？
3. 如果启动时 MCP 服务器连接失败，系统会怎么处理？

---

## 本课小结

| 启动阶段 | 关键操作 | 文件 |
|---------|---------|------|
| 入口 | profileCheckpoint + 并行预取 | `main.tsx` 前20行 |
| 解析 | CLI 参数解析 | `main.tsx` Commander |
| 初始化 | 配置加载，环境设置 | `entrypoints/init.js` |
| 状态 | AppState + Store 创建 | `state/AppStateStore.ts` |
| 命令 | 加载所有命令和技能 | `commands.ts` |
| 工具 | 注册工具集 | `tools.ts` |
| 渲染 | REPL 或 Print 模式 | `ink/` + REPL |

### 关键设计模式

- **并行预取**：利用 import 时间并行执行 I/O 操作
- **延迟加载**：`feature()` 门控 + 条件 require
- **两种模式**：交互式 REPL vs 非交互式 Print

---

## 下节预告

**第4课：并行预取机制** — 我们将深入了解 Claude Code 如何在启动时同时做多件事情。MDM 配置读取、Keychain 密钥获取、GrowthBook 特性标志加载——这些操作如何精心编排，让启动速度快到感觉不到延迟？
