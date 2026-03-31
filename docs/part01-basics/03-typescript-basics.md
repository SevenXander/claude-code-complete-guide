# 第 3 课：TypeScript 快速入门

## 学习目标

完成本课后，你将能够：

1. 理解 JavaScript 和 TypeScript 的关系，以及为什么需要类型
2. 掌握 TypeScript 的基本类型（string、number、boolean、array、object）
3. 理解接口（interface）和类型别名（type）——能看懂 Claude Code 中的类型定义
4. 理解函数和箭头函数的写法
5. 理解模块系统（import/export）——能看懂 Claude Code 的导入语句
6. 理解 async/await 异步编程的基本概念
7. 了解泛型和条件导入的基本概念

---

## 3.1 JavaScript vs TypeScript

### JavaScript 是什么？

**JavaScript**（简称 JS）是世界上使用最广泛的编程语言之一。它最初是为网页浏览器设计的，现在也可以运行在服务器端（通过 Node.js 或 Bun）。

### TypeScript 是什么？

**TypeScript**（简称 TS）是 JavaScript 的"升级版"——由微软开发，它在 JavaScript 的基础上增加了**类型系统**。

### 为什么需要类型？

用一个生活场景来理解。假设你开了一家快递站：

**没有类型（JavaScript）的情况：**

```javascript
function sendPackage(destination, weight) {
  // destination 是地址？还是电话号码？还是人名？
  // weight 是数字？是字符串"5kg"？还是别的什么？
  // 谁知道呢！只有运行的时候才知道传错了没有
}

sendPackage(123, "很重")  // 没有任何报错，但明显是错的
```

**有类型（TypeScript）的情况：**

```typescript
function sendPackage(destination: string, weight: number): void {
  // destination 一定是字符串（地址）
  // weight 一定是数字（重量）
  // 类型帮你在写代码时就发现错误！
}

sendPackage(123, "很重")  // ❌ 编辑器立刻标红！数字不是字符串、字符串不是数字
sendPackage("北京市海淀区", 5.2)  // ✅ 类型正确
```

### 类型的好处

| 好处 | 解释 |
|------|------|
| **提前发现错误** | 写代码时就能发现参数传错等问题，不用等到运行时才报错 |
| **代码提示** | 编辑器知道每个变量的类型，能给你智能提示和自动补全 |
| **代码文档** | 类型本身就是一种文档，告诉你函数接受什么参数、返回什么结果 |
| **重构安全** | 修改类型定义后，所有不匹配的地方都会标红，不会遗漏 |

Claude Code 的 1900 个源码文件全部使用 TypeScript 编写——在大型项目中，类型系统几乎是必备的。

---

## 3.2 基本类型

TypeScript 中最基础的类型有以下几种：

### 原始类型

```typescript
// string：字符串（文本）
let name: string = "Claude Code"
let greeting: string = '你好'

// number：数字（整数和小数都用这个）
let fileCount: number = 1902
let version: number = 3.14

// boolean：布尔值（真/假）
let isEnabled: boolean = true
let isReadOnly: boolean = false

// null 和 undefined：空值
let nothing: null = null
let notDefined: undefined = undefined
```

### 数组

```typescript
// 字符串数组
let tools: string[] = ["BashTool", "FileReadTool", "GrepTool"]

// 数字数组
let scores: number[] = [95, 87, 100]

// 另一种写法（含义相同）
let tools2: Array<string> = ["BashTool", "FileReadTool", "GrepTool"]
```

### 对象

```typescript
// 用花括号 {} 表示对象
let user: { name: string; age: number } = {
  name: "张三",
  age: 25
}

// 可选属性用 ? 标记
let config: { debug: boolean; verbose?: boolean } = {
  debug: true
  // verbose 可以省略，因为它是可选的
}
```

### 联合类型

一个值可以是多种类型之一：

```typescript
// result 可以是 string 或 number
let result: string | number = "成功"
result = 42  // 也可以是数字

// 在 Claude Code 源码中的真实例子
type ValidationResult =
  | { result: true }                       // 验证通过
  | { result: false; message: string; errorCode: number }  // 验证失败
```

上面这个 `ValidationResult` 类型正是来自 Claude Code 的 `Tool.ts` 文件！它表示"验证结果要么是通过（只有 `result: true`），要么是不通过（带有错误信息和错误码）"。

---

## 3.3 接口（interface）和类型别名（type）

当对象的结构比较复杂时，我们会给它"起个名字"，方便反复使用。

### type（类型别名）

```typescript
// 定义一个类型别名
type ToolName = string

// 可以定义复杂的对象类型
type User = {
  name: string
  email: string
  age: number
}

// 使用这个类型
let admin: User = {
  name: "管理员",
  email: "admin@example.com",
  age: 30
}
```

### 来自 Claude Code 的真实示例

以下代码直接来自 `src/Tool.ts` 文件：

```typescript
// 定义工具输入的 JSON Schema 类型
export type ToolInputJSONSchema = {
  [x: string]: unknown    // 可以有任意名称的属性，值类型未知
  type: 'object'          // type 属性必须是字符串 'object'
  properties?: {          // properties 是可选的（注意 ? 号）
    [x: string]: unknown  // 里面也可以有任意属性
  }
}
```

让我们逐行拆解这段代码：

| 代码 | 含义 |
|------|------|
| `export type` | `export` 表示把这个类型"导出"，让别的文件可以使用；`type` 表示定义一个类型别名 |
| `ToolInputJSONSchema` | 类型的名字——工具输入的 JSON Schema |
| `[x: string]: unknown` | "索引签名"——表示可以有任意名称的属性（属性名是字符串），值的类型是 `unknown`（未知） |
| `type: 'object'` | 必须有一个 `type` 属性，其值必须是字面量字符串 `'object'` |
| `properties?:` | `?` 表示这个属性是可选的 |

### interface（接口）

`interface` 和 `type` 类似，也是用来描述对象的形状：

```typescript
interface Animal {
  name: string
  sound: string
  legs: number
}

let cat: Animal = {
  name: "小花",
  sound: "喵",
  legs: 4
}
```

### type 和 interface 的区别

| 特性 | type | interface |
|------|------|-----------|
| 描述对象 | ✅ | ✅ |
| 联合类型 | ✅ `type A = B \| C` | ❌ 不支持 |
| 继承/扩展 | `type B = A & { ... }` | `interface B extends A { ... }` |
| 在 Claude Code 中 | 大量使用 | 也有使用 |

在 Claude Code 的源码中，`type` 的使用频率远高于 `interface`。

---

## 3.4 函数和箭头函数

### 普通函数

```typescript
// 声明一个函数
function add(a: number, b: number): number {
  return a + b
}

// 参数类型在冒号后面，返回值类型在括号后面
// a: number  → 参数 a 是数字
// b: number  → 参数 b 是数字
// : number   → 返回值是数字

let sum = add(3, 5)  // sum = 8
```

### 箭头函数

箭头函数是更简洁的函数写法，在现代 JavaScript/TypeScript 中非常常见：

```typescript
// 普通写法
function add(a: number, b: number): number {
  return a + b
}

// 箭头函数写法（完全等价）
const add = (a: number, b: number): number => {
  return a + b
}

// 更简洁：如果只有一行 return，可以省略大括号和 return
const add = (a: number, b: number): number => a + b
```

### Claude Code 中的箭头函数示例

```typescript
// 来自 Tool.ts — 一个返回默认权限配置的箭头函数
export const getEmptyToolPermissionContext: () => ToolPermissionContext =
  () => ({
    mode: 'default',
    additionalWorkingDirectories: new Map(),
    alwaysAllowRules: {},
    alwaysDenyRules: {},
    alwaysAskRules: {},
    isBypassPermissionsModeAvailable: false,
  })
```

拆解这段代码：
- `getEmptyToolPermissionContext` 是一个常量（`const`）
- `: () => ToolPermissionContext` 是类型注解——说明这个常量是"一个不接受参数、返回 `ToolPermissionContext` 类型的函数"
- `= () => ({ ... })` 是函数实现——返回一个包含默认值的对象

---

## 3.5 模块系统（import / export）

大型项目的代码分散在成百上千个文件中。**模块系统**让不同文件之间可以互相引用。

### export（导出）

一个文件想把自己的东西"分享"给别人，就用 `export`：

```typescript
// 文件：src/utils/math.ts

// 方式 1：在声明前加 export
export function add(a: number, b: number): number {
  return a + b
}

export const PI = 3.14159

// 方式 2：统一在文件末尾导出
function subtract(a: number, b: number): number {
  return a - b
}
export { subtract }

// 方式 3：默认导出（一个文件只能有一个）
export default function multiply(a: number, b: number): number {
  return a * b
}
```

### import（导入）

另一个文件想使用别人"分享"的东西，就用 `import`：

```typescript
// 文件：src/app.ts

// 导入具名导出
import { add, PI } from './utils/math.js'

// 导入默认导出
import multiply from './utils/math.js'

// 导入并重命名
import { add as addition } from './utils/math.js'

// 导入类型（只用于 TypeScript 类型检查，不影响运行时）
import type { User } from './types/user.js'
```

### Claude Code 中的真实 import 示例

打开 `src/tools.ts`，文件开头密密麻麻的都是 import 语句：

```typescript
// 从 Tool.ts 导入类型和函数
import { toolMatchesName, type Tool, type Tools } from './Tool.js'

// 从各个工具文件导入具体工具
import { AgentTool } from './tools/AgentTool/AgentTool.js'
import { BashTool } from './tools/BashTool/BashTool.js'
import { FileEditTool } from './tools/FileEditTool/FileEditTool.js'
import { FileReadTool } from './tools/FileReadTool/FileReadTool.js'
import { GlobTool } from './tools/GlobTool/GlobTool.js'
import { GrepTool } from './tools/GrepTool/GrepTool.js'

// 从第三方包导入
import chalk from 'chalk'
import React from 'react'
```

注意路径的区别：
- **`'./Tool.js'`** — 以 `./` 开头，是**相对路径**，指向项目内的另一个文件
- **`'chalk'`** — 没有 `./`，是**包名称**，指向 `node_modules` 中的第三方包
- **`'bun:bundle'`** — 特殊的 Bun 运行时内置模块

### `import type` 的含义

注意 `import { toolMatchesName, type Tool, type Tools }` 中的 `type` 关键字。带 `type` 的导入**只在编写代码时存在**（帮助类型检查），编译成 JavaScript 后会被完全删除。而 `toolMatchesName`（不带 `type`）在运行时也存在，因为它是一个真正的函数。

---

## 3.6 async/await 异步编程

### 什么是异步？

想象你在一家餐厅：

- **同步**：你点了菜，然后**站在原地等**，直到菜做好端上来，你才能做其他事
- **异步**：你点了菜，服务员说"好的，做好了叫您"，然后你去看手机、聊天——菜做好了自然会通知你

在编程中，很多操作需要等待（读取文件、网络请求、数据库查询），如果每次都"站在原地等"，程序就会很慢。异步编程让程序在等待时可以做其他事。

### async/await 语法

```typescript
// async 标记这是一个异步函数
// await 表示"等待这个操作完成后再继续"
async function readFile(path: string): Promise<string> {
  const content = await fs.readFile(path, 'utf-8')  // 等待文件读取完成
  return content
}

// 调用异步函数
async function main() {
  const content = await readFile('./hello.txt')
  console.log(content)
}
```

### Promise 是什么？

`Promise` 就是"承诺"——一个**将来会有结果**的对象。

```typescript
// Promise<string> 意思是：这个函数返回一个"承诺"，将来会给你一个字符串
async function getGreeting(): Promise<string> {
  return "你好，世界！"
}
```

### Claude Code 中的异步示例

在 `Tool.ts` 中，几乎所有的工具方法都是异步的：

```typescript
// 工具的 call 方法是异步的，返回 Promise<ToolResult<Output>>
call(
  args: z.infer<Input>,
  context: ToolUseContext,
  canUseTool: CanUseToolFn,
  parentMessage: AssistantMessage,
  onProgress?: ToolCallProgress<P>,
): Promise<ToolResult<Output>>

// 工具的 description 方法也是异步的
description(
  input: z.infer<Input>,
  options: { ... },
): Promise<string>

// checkPermissions 也是异步的
checkPermissions(
  input: z.infer<Input>,
  context: ToolUseContext,
): Promise<PermissionResult>
```

为什么这些方法是异步的？因为：
- `call` 可能需要读写文件、执行命令——这些都是耗时操作
- `description` 可能需要查询配置信息
- `checkPermissions` 可能需要检查文件权限或网络状态

---

## 3.7 泛型基础

### 什么是泛型？

泛型（Generics）就像是一个**占位符**——"我现在不确定这里是什么类型，用的时候再指定"。

打个比方：一个快递盒子可以装任何东西——装书、装衣服、装食物。盒子的形状（功能）不变，但里面装的东西（类型）可以不同。

```typescript
// 没有泛型：只能装字符串的盒子
function boxString(item: string): { content: string } {
  return { content: item }
}

// 没有泛型：只能装数字的盒子
function boxNumber(item: number): { content: number } {
  return { content: item }
}

// 有泛型：万能盒子！<T> 就是占位符
function box<T>(item: T): { content: T } {
  return { content: item }
}

// 使用时指定 T 是什么
box<string>("hello")   // T = string → { content: "hello" }
box<number>(42)        // T = number → { content: 42 }
box("hello")           // TypeScript 自动推断 T = string
```

### Claude Code 中的泛型示例

`Tool.ts` 中的核心类型 `Tool` 就使用了泛型：

```typescript
export type Tool<
  Input extends AnyObject = AnyObject,    // 输入类型，默认为 AnyObject
  Output = unknown,                        // 输出类型，默认为 unknown
  P extends ToolProgressData = ToolProgressData,  // 进度数据类型
> = {
  name: string
  call(args: z.infer<Input>, ...): Promise<ToolResult<Output>>
  // ...
}
```

这里有三个泛型参数：
- **`Input`**：工具接受什么样的输入？（比如 BashTool 的输入是 `{ command: string }`）
- **`Output`**：工具返回什么样的输出？（比如文件内容、命令执行结果）
- **`P`**：进度通知的格式是什么？（比如 Bash 命令的执行进度）

每个具体的工具在定义时会"填入"这些泛型参数，就像在通用模板中填入具体内容。

---

## 3.8 条件导入和动态导入

### 什么是条件导入？

普通的 `import` 是**无条件的**——不管什么情况，都会加载那个模块。但有时候我们只在**特定条件下**才需要加载某个模块。

### Claude Code 中的条件导入

`src/tools.ts` 中大量使用了这种模式：

```typescript
import { feature } from 'bun:bundle'

// 只有当 'PROACTIVE' 或 'KAIROS' 特性开关打开时，才加载 SleepTool
const SleepTool =
  feature('PROACTIVE') || feature('KAIROS')
    ? require('./tools/SleepTool/SleepTool.js').SleepTool
    : null

// 只有当 USER_TYPE 是 'ant' 时，才加载 REPLTool
const REPLTool =
  process.env.USER_TYPE === 'ant'
    ? require('./tools/REPLTool/REPLTool.js').REPLTool
    : null
```

让我们拆解这段代码：

1. **`feature('PROACTIVE')`** — 检查名为 `PROACTIVE` 的特性开关是否打开
2. **`?`** 和 **`:`** — 这是三元运算符（条件表达式）：`条件 ? 真时的值 : 假时的值`
3. **`require('./tools/SleepTool/SleepTool.js')`** — 动态加载模块（`require` 是另一种导入方式）
4. **`.SleepTool`** — 从加载的模块中取出 `SleepTool`
5. **`null`** — 如果条件不满足，就设为 `null`（空值）

### 为什么要条件导入？

这是一种叫做**死代码消除**（Dead Code Elimination）的优化技术：

- 普通用户不需要 `SleepTool`，所以不加载它 → 程序启动更快、体积更小
- 只有 Anthropic 内部员工（`USER_TYPE === 'ant'`）才需要 `REPLTool`
- 不同的部署环境需要不同的功能组合

---

## 小结

| 概念 | 要点 |
|------|------|
| **TypeScript** | JavaScript + 类型系统，在写代码时就能发现错误 |
| **基本类型** | `string`、`number`、`boolean`、`array`、`object`、联合类型 |
| **type / interface** | 给复杂类型"起名字"，方便重复使用 |
| **箭头函数** | `const fn = (x: number) => x * 2`，简洁的函数写法 |
| **import / export** | 文件之间互相引用代码的方式 |
| **async / await** | 异步编程，让程序在等待时不阻塞 |
| **泛型** | 类型的"占位符"，使用时再填入具体类型 |
| **条件导入** | 根据条件决定是否加载模块，用于优化和功能开关 |

---

## 动手练习

### 练习 1：基本类型

在你的编辑器中创建一个文件 `practice.ts`，练习以下内容：

```typescript
// 1. 声明不同类型的变量
let projectName: string = "Claude Code"
let fileCount: number = 1902
let isOpenSource: boolean = true
let tools: string[] = ["BashTool", "FileReadTool", "GrepTool"]

// 2. 定义一个类型
type ProjectInfo = {
  name: string
  files: number
  language: string
  isOpenSource: boolean
}

// 3. 使用这个类型
let claudeCode: ProjectInfo = {
  name: "Claude Code",
  files: 1902,
  language: "TypeScript",
  isOpenSource: true
}

// 4. 写一个函数
function describe(project: ProjectInfo): string {
  return `${project.name} 有 ${project.files} 个文件，使用 ${project.language} 编写`
}

console.log(describe(claudeCode))
```

### 练习 2：阅读 Claude Code 的类型定义

打开 `src/Tool.ts` 文件，找到以下类型定义，尝试理解它们：

1. `ToolInputJSONSchema`（第 15-21 行）——工具输入的 Schema 定义
2. `ValidationResult`（第 95-101 行）——验证结果的联合类型
3. `Tool<Input, Output, P>`（第 362 行开始）——核心工具类型

对于每个类型，回答：
- 它有哪些属性？
- 哪些属性是必填的？哪些是可选的（有 `?`）？
- 你能用自己的话描述这个类型"是什么"吗？

### 练习 3：分析 import 语句

打开 `src/tools.ts` 文件，看前 15 行的 import 语句：

```typescript
import { toolMatchesName, type Tool, type Tools } from './Tool.js'
import { AgentTool } from './tools/AgentTool/AgentTool.js'
import { BashTool } from './tools/BashTool/BashTool.js'
```

回答以下问题：
1. `'./Tool.js'` 中的 `./` 表示什么？
2. `type Tool` 前面为什么有 `type` 关键字？
3. `toolMatchesName` 没有 `type` 关键字，这意味着什么？
4. 这些导入的文件分布在哪些目录中？

### 练习 4：理解条件导入

看 `src/tools.ts` 中的这段代码：

```typescript
const SleepTool =
  feature('PROACTIVE') || feature('KAIROS')
    ? require('./tools/SleepTool/SleepTool.js').SleepTool
    : null
```

用自己的话回答：
1. `feature('PROACTIVE')` 在检查什么？
2. `||` 运算符的含义是什么？
3. 如果两个 feature 都关闭，`SleepTool` 的值是什么？
4. 为什么要这样做，而不是直接 `import { SleepTool } from ...`？

---

**下一课预告**：在第 4 课中，我们将学习 React 和 Ink——Claude Code 用来构建终端 UI 的框架。你会发现，React 不仅能做网页，还能在黑黑的终端里画出漂亮的界面！
