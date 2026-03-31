# 第 4 课：React 与 Ink——终端 UI 框架

## 学习目标

完成本课后，你将能够：

1. 理解 React 的核心概念——组件化思想
2. 看懂 JSX 语法
3. 理解组件的 Props（属性）和 State（状态）
4. 了解常用的 React Hooks（useState、useEffect、useMemo）
5. 知道 Ink 是什么——React 在终端中的渲染引擎
6. 理解 Claude Code 为什么选择 React + Ink 来构建终端 UI
7. 能看懂 Claude Code 中 `src/components/` 下的组件代码

---

## 4.1 什么是 React？

### 核心思想：组件化

**React** 是 Facebook（现 Meta）开发的 UI 构建库。它的核心思想是：**把界面拆分成独立的、可复用的"组件"（Component）**。

打个比方，想象你在搭建一个乐高模型：

- 整个模型 = 整个用户界面
- 每一块乐高积木 = 一个组件
- 你可以用同一种积木在不同位置重复使用（复用）
- 复杂的部分可以用多块积木组合而成（嵌套）

```
┌─────────────────── App 组件（整个应用） ──────────────────┐
│  ┌──── Header 组件 ────┐  ┌───── Spinner 组件 ─────┐    │
│  │  Claude Code v1.0   │  │  ⠋ 正在思考...          │    │
│  └─────────────────────┘  └─────────────────────────┘    │
│                                                           │
│  ┌──────────────── MessageList 组件 ────────────────┐    │
│  │  ┌─── Message 组件 ───┐ ┌─── Message 组件 ───┐  │    │
│  │  │  用户: 帮我写代码  │ │  AI: 好的，让我...  │  │    │
│  │  └────────────────────┘ └────────────────────┘   │    │
│  └──────────────────────────────────────────────────┘    │
│                                                           │
│  ┌──────────────── InputBox 组件 ───────────────────┐    │
│  │  > 请输入你的消息...                              │    │
│  └──────────────────────────────────────────────────┘    │
└───────────────────────────────────────────────────────────┘
```

### 传统思维 vs React 思维

| 传统思维 | React 思维 |
|----------|-----------|
| "页面上有一个按钮、一段文字、一个列表..." | "有一个 Button 组件、一个 Text 组件、一个 List 组件..." |
| 直接操作页面元素 | 描述"界面应该长什么样"，React 负责渲染 |
| 手动更新界面 | 数据变了，界面自动更新 |

---

## 4.2 JSX 语法

### 什么是 JSX？

JSX 是 React 使用的一种特殊语法——它让你**在 JavaScript/TypeScript 代码中直接写类似 HTML 的标签**。

```tsx
// 这就是 JSX —— 在 TypeScript 中写"标签"
const greeting = <Text>你好，世界！</Text>

// 它看起来像 HTML，但实际上是 TypeScript 代码
// 编译后会变成：
const greeting = React.createElement(Text, null, "你好，世界！")
```

### 基本规则

```tsx
// 1. 标签必须关闭
<Text>内容</Text>          // ✅ 有开始和结束标签
<Box />                     // ✅ 自关闭标签（没有子内容时）

// 2. 用花括号 {} 嵌入 JavaScript 表达式
const name = "Claude"
<Text>你好，{name}！</Text>  // 输出：你好，Claude！

// 3. 属性（Props）用等号赋值
<Box width={80} borderStyle="round">
  <Text color="green">成功！</Text>
</Box>

// 4. 条件渲染
<Box>
  {isLoading ? <Text>加载中...</Text> : <Text>完成！</Text>}
</Box>
```

### 为什么文件后缀是 .tsx？

- `.ts` 文件 = 纯 TypeScript 代码
- `.tsx` 文件 = TypeScript + JSX（包含 UI 标签的代码）

Claude Code 中的命名规律：
- `Tool.ts` — 纯类型定义，不包含 UI → 用 `.ts`
- `main.tsx` — 包含 React 组件和 JSX 语法 → 用 `.tsx`
- `Spinner.tsx` — UI 组件 → 用 `.tsx`

---

## 4.3 组件的 Props 和 State

### Props（属性）——从外部传入的数据

Props 就像函数的"参数"——父组件在使用子组件时传入的数据。

```tsx
// 定义一个组件，接受 Props
type GreetingProps = {
  name: string
  color?: string  // 可选属性
}

function Greeting({ name, color = "white" }: GreetingProps) {
  return <Text color={color}>你好，{name}！</Text>
}

// 使用这个组件（传入 Props）
<Greeting name="张三" />                // 输出：你好，张三！（白色）
<Greeting name="李四" color="green" />  // 输出：你好，李四！（绿色）
```

### Claude Code 中的真实 Props 示例

来自 `src/components/Spinner.tsx`：

```typescript
type Props = {
  mode: SpinnerMode
  loadingStartTimeRef: React.RefObject<number>
  totalPausedMsRef: React.RefObject<number>
  pauseStartTimeRef: React.RefObject<number | null>
  spinnerTip?: string
  responseLengthRef: React.RefObject<number>
  overrideColor?: keyof Theme | null
  verbose: boolean
  hasActiveTools?: boolean
}
```

这个 `Props` 类型定义了 `Spinner`（加载动画）组件需要的所有"配置项"：
- `mode` — 旋转器的模式（必填）
- `verbose` — 是否显示详细信息（必填）
- `spinnerTip?` — 提示文字（可选）
- `overrideColor?` — 自定义颜色（可选）

另一个更简洁的例子，来自 `src/components/SearchBox.tsx`：

```typescript
type Props = {
  query: string           // 搜索框中的文字
  placeholder?: string    // 占位提示文字
  isFocused: boolean      // 是否获得焦点
  isTerminalFocused: boolean  // 终端是否获得焦点
  prefix?: string         // 搜索图标
  width?: number | string // 宽度
  cursorOffset?: number   // 光标位置
  borderless?: boolean    // 是否无边框
}
```

### State（状态）——组件内部的可变数据

State 是组件"自己管理的数据"。当 State 改变时，组件会自动重新渲染。

```tsx
import { useState } from 'react'

function Counter() {
  // count 是状态值，setCount 是更新函数
  const [count, setCount] = useState(0)

  return (
    <Box>
      <Text>计数：{count}</Text>
      {/* 某个事件触发时调用 setCount 来更新状态 */}
    </Box>
  )
}
```

### Props vs State 的区别

| | Props | State |
|---|-------|-------|
| **来源** | 父组件传入 | 组件内部创建 |
| **能否修改** | 不能（只读） | 能（通过 setter 函数） |
| **变化时** | 父组件重新传入新值 | 组件调用 setter 函数 |
| **效果** | 组件用新的 Props 重新渲染 | 组件用新的 State 重新渲染 |
| **类比** | 你收到的任务说明书（不能改） | 你自己的笔记本（可以随时改） |

---

## 4.4 React Hooks

Hooks（钩子）是 React 提供的特殊函数，让你在组件中使用各种功能。所有 Hook 都以 `use` 开头。

### useState — 管理状态

```tsx
const [value, setValue] = useState(初始值)

// 示例
const [name, setName] = useState("Claude")
const [count, setCount] = useState(0)
const [isLoading, setIsLoading] = useState(true)
```

### useEffect — 处理副作用

"副作用"就是"除了渲染 UI 之外的事情"——比如请求数据、设置定时器、监听事件。

```tsx
import { useEffect } from 'react'

function Timer() {
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    // 组件挂载后执行（类似"开始"）
    const timer = setInterval(() => {
      setSeconds(s => s + 1)
    }, 1000)

    // 返回的函数在组件卸载时执行（类似"清理"）
    return () => clearInterval(timer)
  }, [])  // 空数组 [] 表示只在组件挂载时执行一次

  return <Text>已运行 {seconds} 秒</Text>
}
```

### useMemo — 缓存计算结果

当某个计算很耗时，用 `useMemo` 缓存结果，避免重复计算：

```tsx
import { useMemo } from 'react'

function ExpensiveComponent({ items }) {
  // 只有 items 变化时才重新计算
  const sortedItems = useMemo(() => {
    return items.sort((a, b) => a.name.localeCompare(b.name))
  }, [items])

  return <Text>{sortedItems.join(', ')}</Text>
}
```

### Claude Code 的自定义 Hooks

Claude Code 在 `src/hooks/` 目录下定义了 **85 个自定义 Hook**！一些例子：

| Hook 名称 | 作用 |
|-----------|------|
| `useTerminalSize` | 获取终端窗口的宽高 |
| `useCanUseTool` | 检查当前是否有权限使用某个工具 |
| `useSettings` | 获取用户设置 |
| `useBlink` | 实现光标闪烁效果 |
| `useCancelRequest` | 处理取消请求的逻辑 |
| `useTasksV2` | 管理任务列表 |

---

## 4.5 什么是 Ink？

### React 原本是用来做什么的？

React 最初是为**浏览器**设计的——它在网页中渲染 HTML 元素：

```tsx
// 在浏览器中的 React
function WebApp() {
  return (
    <div style={{ padding: '20px' }}>
      <h1>标题</h1>
      <p>段落文字</p>
      <button>点击我</button>
    </div>
  )
}
```

### Ink：React 在终端中的渲染器

**Ink** 是一个特殊的库，让 React 组件能**在终端（命令行）中渲染**！

- 在浏览器中：React → `<div>` `<span>` `<button>` → 网页
- 在终端中：React + Ink → `<Box>` `<Text>` → 终端文字界面

```tsx
// 在终端中的 React（使用 Ink）
import { Box, Text } from '../ink.js'

function TerminalApp() {
  return (
    <Box flexDirection="column" padding={1}>
      <Text bold>Claude Code</Text>
      <Text color="green">✓ 操作成功</Text>
      <Box borderStyle="round" borderColor="blue" padding={1}>
        <Text>这是一个带边框的盒子</Text>
      </Box>
    </Box>
  )
}
```

终端中显示的效果类似：

```
 Claude Code
 ✓ 操作成功
 ╭──────────────────────╮
 │ 这是一个带边框的盒子 │
 ╰──────────────────────╯
```

### Ink 的核心组件

| Ink 组件 | 作用 | 类比 HTML |
|----------|------|----------|
| `<Box>` | 容器/布局 | `<div>` |
| `<Text>` | 文字 | `<span>` |
| `<Link>` | 可点击的链接 | `<a>` |
| `<Ansi>` | 渲染 ANSI 转义序列 | 无直接对应 |

### Box 组件的布局属性

Ink 的 `<Box>` 使用 **Flexbox 布局**（和 CSS 中的 Flexbox 相同的概念）：

```tsx
// 水平排列（默认）
<Box flexDirection="row">
  <Text>左</Text>
  <Text>右</Text>
</Box>
// 输出：左右

// 垂直排列
<Box flexDirection="column">
  <Text>上</Text>
  <Text>下</Text>
</Box>
// 输出：
// 上
// 下

// 带边框和内边距
<Box borderStyle="round" padding={1} width={30}>
  <Text>内容</Text>
</Box>
```

### Text 组件的样式属性

```tsx
<Text bold>粗体文字</Text>
<Text italic>斜体文字</Text>
<Text underline>下划线文字</Text>
<Text color="green">绿色文字</Text>
<Text color="red">红色文字</Text>
<Text dimColor>暗淡文字</Text>
<Text inverse>反色文字</Text>
<Text strikethrough>删除线文字</Text>
```

---

## 4.6 Claude Code 为什么选择 React + Ink？

### 传统终端 UI 方案的问题

在 Ink 出现之前，如果你想在终端中做复杂的 UI，通常需要：

| 方案 | 问题 |
|------|------|
| `ncurses`（C 库） | 需要写 C 语言，非常底层 |
| `blessed`（Node.js） | 已停止维护，API 复杂 |
| 手动输出字符 | 只适合简单的文字输出，布局困难 |

### React + Ink 的优势

| 优势 | 解释 |
|------|------|
| **声明式 UI** | 描述"界面应该是什么样子"，而不是"怎么一步步画出来" |
| **组件复用** | 一个组件写一次，到处使用 |
| **状态管理** | 数据变了，UI 自动更新 |
| **团队熟悉** | 大多数前端开发者都会 React |
| **强大的生态** | React 的 Hooks、Context 等功能都能用 |
| **TypeScript 友好** | 完美支持类型检查 |

### Claude Code 的 Ink 封装

Claude Code 并没有直接使用 Ink 库的原版，而是**在 `src/ink/` 目录下维护了一套深度定制的 Ink 实现**（96 个文件！）。这些定制包括：

- **自定义渲染器**（`reconciler.ts`）——控制 React 组件如何转换为终端输出
- **自定义布局引擎**（`layout/`）——处理终端中的复杂布局
- **光标和选择**（`selection.ts`）——终端中的文本选择
- **搜索高亮**（`searchHighlight.ts`）——搜索时高亮匹配文字
- **键盘输入**（`hooks/use-input.ts`）——处理用户按键
- **终端查询**（`terminal-querier.ts`）——查询终端能力（是否支持颜色等）

---

## 4.7 Claude Code 的组件结构

`src/components/` 目录包含 **144 个组件文件**，这里列举一些有代表性的：

### UI 基础组件

| 组件 | 作用 |
|------|------|
| `Spinner.tsx` | 加载动画（旋转图标 + 状态文字） |
| `SearchBox.tsx` | 搜索框 |
| `BaseTextInput.tsx` | 文本输入框 |
| `CompactSummary.tsx` | 紧凑摘要显示 |
| `HighlightedCode/` | 代码语法高亮 |

### 功能组件

| 组件 | 作用 |
|------|------|
| `App.tsx` | 顶层应用容器 |
| `MessageResponse.tsx` | AI 回复消息的显示 |
| `ContextVisualization.tsx` | 上下文可视化 |
| `CostThresholdDialog.tsx` | 费用超限提醒对话框 |
| `AutoUpdater.tsx` | 自动更新提示 |

### 对话框组件

| 组件 | 作用 |
|------|------|
| `AutoModeOptInDialog.tsx` | 自动模式确认对话框 |
| `BypassPermissionsModeDialog.tsx` | 绕过权限确认对话框 |
| `ClaudeMdExternalIncludesDialog.tsx` | 外部文件引用确认 |
| `ManagedSettingsSecurityDialog/` | 安全设置对话框 |

### 设计系统

Claude Code 还在 `src/components/design-system/` 下建立了一套设计系统组件：

| 组件 | 作用 |
|------|------|
| `ThemedBox` | 带主题的容器 |
| `ThemedText` | 带主题的文字 |
| `ThemeProvider` | 主题提供者 |

---

## 4.8 一个完整的组件示例

让我们看一个简化版的终端组件，帮助理解 Claude Code 中组件是如何工作的：

```tsx
import React, { useState, useEffect } from 'react'
import { Box, Text } from '../ink.js'

// Step 1：定义 Props 类型
type Props = {
  query: string           // 搜索关键词
  placeholder?: string    // 占位文字（可选）
  isFocused: boolean      // 是否获得焦点
}

// Step 2：定义组件
export function SearchBox({ query, placeholder = "搜索...", isFocused }: Props) {

  // Step 3：使用 Ink 组件构建 UI
  return (
    <Box
      borderStyle="round"                              // 圆角边框
      borderColor={isFocused ? "blue" : undefined}    // 聚焦时蓝色边框
      paddingX={1}                                     // 水平内边距
    >
      <Text dimColor={!isFocused}>
        {"⌕ "}                                        {/* 搜索图标 */}
        {query                                         /* 有输入就显示输入 */
          ? <Text>{query}</Text>
          : <Text dimColor>{placeholder}</Text>        /* 没输入就显示占位符 */
        }
      </Text>
    </Box>
  )
}
```

终端中的效果：

```
╭─────────────────────╮
│ ⌕ 搜索...           │   ← 未聚焦，暗淡显示
╰─────────────────────╯

╭─────────────────────╮
│ ⌕ TypeScript        │   ← 聚焦，蓝色边框，显示输入内容
╰─────────────────────╯
```

---

## 小结

| 要点 | 内容 |
|------|------|
| **React** | UI 构建库，核心思想是"组件化" |
| **JSX** | 在 TypeScript 中写类似 HTML 的标签语法 |
| **Props** | 从父组件传入的只读数据 |
| **State** | 组件内部的可变数据，变化时触发重新渲染 |
| **Hooks** | `useState`、`useEffect`、`useMemo` 等特殊函数 |
| **Ink** | React 的终端渲染器，用 `<Box>` 和 `<Text>` 替代 HTML 元素 |
| **为什么 React+Ink** | 声明式、组件化、TypeScript 友好、团队熟悉 |
| **Claude Code 组件** | 144 个组件文件，覆盖 UI 基础、功能、对话框等 |

---

## 动手练习

### 练习 1：识别组件结构

打开 `src/components/` 目录，浏览文件名列表。回答以下问题：

```bash
ls src/components/ | head -30
```

1. 哪些文件名看起来像是"对话框"（Dialog）组件？
2. 哪些文件名看起来像是"显示/展示"组件？
3. 为什么有些组件是单个 `.tsx` 文件，有些是一个文件夹（如 `HighlightedCode/`）？

### 练习 2：阅读 Props 定义

打开 `src/components/Spinner.tsx`，找到文件中的 `type Props` 定义。

1. `Spinner` 组件接受哪些属性？
2. 哪些属性是必填的？哪些是可选的？
3. `SpinnerMode` 这个类型是从哪里导入的？

### 练习 3：理解 JSX

看下面这段简化的 JSX 代码，用自己的话描述它会在终端中显示什么：

```tsx
<Box flexDirection="column" padding={1}>
  <Text bold color="blue">Claude Code</Text>
  <Box borderStyle="round" marginTop={1}>
    <Text color="green">✓ </Text>
    <Text>文件保存成功</Text>
  </Box>
  <Text dimColor>按 Enter 继续...</Text>
</Box>
```

### 练习 4：探索 Ink 封装

```bash
# 查看 Claude Code 的 Ink 封装目录
ls src/ink/

# 查看有多少个文件
ls src/ink/ | wc -l
```

1. 这个目录里有多少个文件？
2. 你能从文件名猜到哪些文件是做什么的吗？（比如 `reconciler.ts`、`render-border.ts`）
3. 为什么 Claude Code 要自己维护一套 Ink 实现，而不是直接用原版 Ink？

### 练习 5：在 `ink.ts` 中追踪导出

打开 `src/ink.ts`（注意不是 `src/ink/` 目录），它是一个简短的文件。

1. 它从 `./ink/root.js` 导入了什么？
2. `withTheme` 函数做了什么？
3. 这个文件的作用是什么？（提示：它是其他组件 import Ink 功能的入口点）

---

**下一课预告**：在第 5 课中，我们将全面浏览 Claude Code 的项目结构，了解每个目录的作用，认识核心文件。这将为后续深入学习各个模块打下基础。
