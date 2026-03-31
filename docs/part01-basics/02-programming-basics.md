# 第 2 课：编程基础——终端、命令行与开发环境

## 学习目标

完成本课后，你将能够：

1. 理解终端（Terminal）是什么，以及它与图形界面的区别
2. 掌握最常用的终端命令（ls、cd、pwd、mkdir、cat 等）
3. 理解文件系统和路径的概念（绝对路径 vs 相对路径）
4. 知道什么是环境变量，以及它在 Claude Code 中的作用
5. 了解包管理器（npm、pnpm）的基本概念
6. 理解 Git 版本控制的基本原理
7. 知道什么是 IDE，以及为什么开发者需要它

---

## 2.1 什么是终端（Terminal）？

### 图形界面 vs 命令行界面

你每天用电脑时，看到的是**图形用户界面**（GUI，Graphical User Interface）——桌面上有图标，点击鼠标就能打开文件夹、拖动窗口。这就像是在一家装修精美的餐厅里点菜，有图片菜单、服务员引导。

**命令行界面**（CLI，Command Line Interface）则完全不同。它是一个黑色（或白色）的文本窗口，你通过**打字输入命令**来操作电脑。这就像是在同一家餐厅里，你直接走进厨房，用专业术语告诉厨师你要什么。

```
┌─────────────────────────────────────────────┐
│  $  _                                       │
│                                             │
│  (这就是终端，光标在闪烁，等你输入命令)       │
│                                             │
└─────────────────────────────────────────────┘
```

### 为什么程序员要用终端？

| 原因 | 解释 |
|------|------|
| **更快** | 熟练后，打字比点鼠标快得多 |
| **更强大** | 很多操作只能在终端中完成 |
| **可自动化** | 命令可以写成脚本，自动执行 |
| **远程操作** | 可以通过终端连接远程服务器 |
| **Claude Code 运行在这里** | Claude Code 就是一个命令行工具！ |

### 如何打开终端？

- **macOS**：按 `Cmd + 空格`，输入 "Terminal"，回车
- **Windows**：按 `Win + R`，输入 "cmd" 或 "powershell"，回车
- **Linux**：按 `Ctrl + Alt + T`

---

## 2.2 基本终端命令

以下是你最需要掌握的命令。**`$` 符号**表示终端提示符，你不需要输入它。

### `pwd` — 显示当前位置

`pwd` = **P**rint **W**orking **D**irectory（打印工作目录）

```bash
$ pwd
/Users/zhangsan/Desktop
```

这告诉你："你现在在 `/Users/zhangsan/Desktop` 这个位置"。就像你在商场里看导航地图上的"您在此处"标记。

### `ls` — 列出文件和文件夹

`ls` = **L**i**s**t（列出）

```bash
$ ls
Documents  Downloads  Music  Pictures  Desktop

$ ls -la    # -la 表示列出详细信息，包括隐藏文件
total 24
drwxr-xr-x   6 zhangsan  staff   192  3 31 10:00 .
drwxr-xr-x  12 zhangsan  staff   384  3 31 09:00 ..
drwxr-xr-x   4 zhangsan  staff   128  3 31 10:00 Documents
drwxr-xr-x   2 zhangsan  staff    64  3 30 15:00 Downloads
```

### `cd` — 切换目录

`cd` = **C**hange **D**irectory（更改目录）

```bash
$ cd Documents          # 进入 Documents 文件夹
$ cd ..                 # 返回上一级目录
$ cd ~                  # 回到用户主目录
$ cd /Users/zhangsan    # 用绝对路径跳转到指定位置
```

### `mkdir` — 创建文件夹

`mkdir` = **M**a**k**e **Dir**ectory（创建目录）

```bash
$ mkdir my-project           # 创建一个名为 my-project 的文件夹
$ mkdir -p src/components    # -p 表示自动创建中间目录
```

### `cat` — 查看文件内容

`cat` = Con**cat**enate（连接/显示）

```bash
$ cat hello.txt
Hello, World!
这是文件里的内容。
```

### `touch` — 创建空文件

```bash
$ touch index.ts    # 创建一个空的 index.ts 文件
```

### `rm` — 删除文件

`rm` = **R**e**m**ove（删除）

```bash
$ rm old-file.txt         # 删除文件
$ rm -r old-folder/       # 删除文件夹（-r 表示递归删除）
```

> ⚠️ **警告**：`rm` 命令删除的文件不会进入回收站，无法恢复！使用时要格外小心。

### `cp` 和 `mv` — 复制和移动

```bash
$ cp file.txt backup.txt         # 复制文件
$ mv old-name.txt new-name.txt   # 重命名（移动）文件
$ mv file.txt Documents/         # 把文件移动到 Documents 文件夹
```

### 命令速查表

| 命令 | 作用 | 示例 |
|------|------|------|
| `pwd` | 显示当前目录 | `pwd` |
| `ls` | 列出文件 | `ls -la` |
| `cd` | 切换目录 | `cd src/` |
| `mkdir` | 创建目录 | `mkdir new-folder` |
| `cat` | 查看文件 | `cat README.md` |
| `touch` | 创建空文件 | `touch index.ts` |
| `rm` | 删除文件 | `rm temp.txt` |
| `cp` | 复制 | `cp a.txt b.txt` |
| `mv` | 移动/重命名 | `mv old.txt new.txt` |
| `clear` | 清屏 | `clear` |
| `echo` | 输出文本 | `echo "hello"` |

---

## 2.3 文件系统和路径

### 什么是文件系统？

你电脑上的所有文件和文件夹，构成了一棵"树"。这棵树的结构就是**文件系统**。

```
/                          ← 根目录（树的"根"）
├── Users/
│   └── zhangsan/          ← 你的用户目录
│       ├── Desktop/
│       ├── Documents/
│       └── projects/
│           └── claude-code-main/
│               └── src/
│                   ├── main.tsx
│                   ├── Tool.ts
│                   └── tools.ts
├── Applications/
└── System/
```

### 绝对路径 vs 相对路径

**绝对路径**从根目录 `/` 开始，是一个文件的"完整地址"：

```
/Users/zhangsan/projects/claude-code-main/src/main.tsx
```

就像说"中国北京市海淀区XX路XX号"——无论你在哪里，这个地址都能唯一确定一个位置。

**相对路径**从你当前所在位置开始：

```bash
$ pwd
/Users/zhangsan/projects/claude-code-main

$ cat src/main.tsx    # 相对路径：从当前位置进入 src，再找 main.tsx
```

就像说"出门左转第二个路口"——只有在特定位置时，这个描述才有意义。

### 特殊路径符号

| 符号 | 含义 | 示例 |
|------|------|------|
| `.` | 当前目录 | `./src/main.tsx` |
| `..` | 上一级目录 | `cd ..` |
| `~` | 用户主目录 | `cd ~/Desktop` |
| `/` | 根目录 | `cd /` |

### 在 Claude Code 源码中看路径

当你看到这样的代码时：

```typescript
import { getTools } from './tools.js'
```

`'./tools.js'` 就是一个相对路径——表示"在当前文件所在的同一目录下，找到 `tools.js`"。

---

## 2.4 什么是环境变量？

### 概念

环境变量就像是电脑里的"全局设置"——所有程序都能读取的一些配置信息。

打个比方：你家里有一个公告板，上面写着"Wi-Fi 密码：12345678"。家里每个人（每个程序）都能看到这个公告板。环境变量就是这个公告板上的一条条信息。

### 查看环境变量

```bash
$ echo $HOME          # 查看 HOME 变量（你的主目录路径）
/Users/zhangsan

$ echo $PATH          # 查看 PATH 变量（系统查找命令的路径列表）
/usr/local/bin:/usr/bin:/bin

$ env                 # 查看所有环境变量
```

### 设置环境变量

```bash
$ export MY_NAME="zhangsan"    # 设置一个环境变量
$ echo $MY_NAME                # 读取它
zhangsan
```

### 环境变量在 Claude Code 中的作用

Claude Code 大量使用环境变量来控制行为。比如在 `tools.ts` 文件中：

```typescript
// 当 USER_TYPE 环境变量是 'ant' 时，才加载 REPL 工具
const REPLTool =
  process.env.USER_TYPE === 'ant'
    ? require('./tools/REPLTool/REPLTool.js').REPLTool
    : null
```

`process.env.USER_TYPE` 就是在读取名为 `USER_TYPE` 的环境变量。这种模式叫做**条件加载**——根据不同的环境配置，加载不同的功能模块。

常见的环境变量用途：
- 区分开发环境和生产环境（`NODE_ENV`）
- 存储 API 密钥（`ANTHROPIC_API_KEY`）
- 控制功能开关（`USER_TYPE`、`CLAUDE_CODE_SIMPLE`）

---

## 2.5 什么是包管理器？

### 概念

写代码时，你不需要从零开始造一切。别人已经写好了很多有用的代码"包"（package），你可以直接拿来用。

**包管理器**就是帮你下载、安装和管理这些"包"的工具。

打个比方：
- **代码包** = 乐高积木套装（别人做好的零件）
- **包管理器** = 乐高商店（帮你购买、配送、管理积木）
- **package.json** = 购物清单（记录你需要哪些积木）

### 常见的包管理器

| 包管理器 | 用于 | 安装命令示例 |
|----------|------|-------------|
| **npm** | JavaScript/TypeScript | `npm install react` |
| **pnpm** | JavaScript/TypeScript（更快） | `pnpm install react` |
| **yarn** | JavaScript/TypeScript | `yarn add react` |
| **pip** | Python | `pip install numpy` |

### 示例：安装一个包

```bash
# 初始化一个新项目
$ npm init -y

# 安装 React 包
$ npm install react

# 安装开发时才需要的包
$ npm install --save-dev typescript
```

安装后，这些包会被放在 `node_modules/` 文件夹中，并记录在 `package.json` 文件里。

### Claude Code 使用的关键包

在 Claude Code 的源码中，你会看到它依赖了许多第三方包：

```typescript
import chalk from 'chalk'                    // 终端文字颜色
import React from 'react'                    // UI 框架
import { Command } from '@commander-js/extra-typings'  // 命令行解析
```

每一行 `import ... from '...'` 中，如果来源不是以 `./` 或 `../` 开头，就说明它来自一个第三方包。

---

## 2.6 什么是 Git？

### 概念

**Git** 是一个**版本控制系统**。它帮你记录代码的每一次修改历史。

想象你在写一篇毕业论文：
- 没有 Git：`论文_v1.doc`、`论文_v2.doc`、`论文_最终版.doc`、`论文_最终版_真的最终.doc` 😵
- 有了 Git：只有一个文件，但 Git 记录了每一次修改，你随时可以回到任意一个历史版本

### 核心概念

| 概念 | 解释 | 类比 |
|------|------|------|
| **仓库 (Repository)** | 一个被 Git 管理的项目文件夹 | 一本带有修订记录的笔记本 |
| **提交 (Commit)** | 一次代码修改的"快照" | 笔记本中的一页记录 |
| **分支 (Branch)** | 代码的一条独立发展线 | 故事的一条平行时间线 |
| **合并 (Merge)** | 把两条分支合在一起 | 两条时间线汇合 |
| **远程仓库 (Remote)** | 代码在云端的备份（如 GitHub） | 笔记本的云端备份 |

### 最常用的 Git 命令

```bash
# 查看当前状态（有哪些文件被修改了？）
$ git status

# 查看修改内容
$ git diff

# 把修改添加到暂存区
$ git add .

# 提交修改（附上说明）
$ git commit -m "修复了登录页面的 bug"

# 查看提交历史
$ git log --oneline

# 创建新分支
$ git checkout -b feature/new-login

# 切换到已有分支
$ git checkout main
```

### Git 与 Claude Code 的关系

Claude Code 自身的源码就托管在 Git 仓库中。并且 Claude Code 能够**操作 Git**——帮你创建分支、提交代码、甚至创建 Pull Request。在源码中：

```typescript
import { getBranch, getDefaultBranch, getIsGit, gitExe } from './utils/git.js'
```

这些工具函数让 Claude Code 能够与 Git 交互。

---

## 2.7 什么是 IDE？

### 概念

**IDE**（Integrated Development Environment，集成开发环境）是程序员写代码的专用编辑器。它不只是一个文本编辑器，还集成了很多开发工具。

| 功能 | 普通文本编辑器 | IDE |
|------|---------------|-----|
| 写文字 | ✅ | ✅ |
| 语法高亮 | ❌ | ✅ 不同类型的代码用不同颜色 |
| 自动补全 | ❌ | ✅ 输入代码时给你提示 |
| 错误检测 | ❌ | ✅ 写错了立刻标红提醒 |
| 内置终端 | ❌ | ✅ 在编辑器里直接运行命令 |
| 文件管理 | ❌ | ✅ 侧边栏展示项目目录树 |
| Git 集成 | ❌ | ✅ 可视化查看代码修改 |
| 调试工具 | ❌ | ✅ 一步步跟踪代码执行 |

### 推荐的 IDE

| IDE | 特点 | 适合 |
|-----|------|------|
| **VS Code** | 微软出品，免费，插件丰富 | 通用开发，最流行的选择 |
| **Cursor** | 基于 VS Code，深度集成 AI | AI 辅助开发，我们推荐使用 |
| **WebStorm** | JetBrains 出品，功能强大 | 专业前端/Node.js 开发 |

### 在 IDE 中打开 Claude Code 源码

```bash
# 用 VS Code 打开
$ code /path/to/claude-code-main

# 用 Cursor 打开
$ cursor /path/to/claude-code-main
```

打开后你会看到：
- **左侧**：文件目录树，展示项目的所有文件和文件夹
- **中间**：代码编辑区域，带语法高亮
- **下方**：集成终端，可以直接在这里输入命令
- **右侧**：可能有 AI 助手面板（Cursor 特有）

---

## 小结

| 要点 | 内容 |
|------|------|
| **终端** | 通过文字命令操作电脑的界面，Claude Code 运行于此 |
| **基本命令** | pwd、ls、cd、mkdir、cat、rm、cp、mv |
| **文件路径** | 绝对路径从 `/` 开始；相对路径从当前位置开始 |
| **环境变量** | 全局配置信息，Claude Code 用它控制功能开关 |
| **包管理器** | 管理第三方代码依赖（npm、pnpm） |
| **Git** | 版本控制系统，记录代码修改历史 |
| **IDE** | 集成开发环境，推荐 VS Code 或 Cursor |

---

## 动手练习

### 练习 1：终端基础操作

打开终端，依次执行以下命令，观察每条命令的输出：

```bash
# 1. 查看你当前在哪个目录
pwd

# 2. 列出当前目录的文件
ls

# 3. 进入桌面
cd ~/Desktop

# 4. 创建一个练习目录
mkdir terminal-practice

# 5. 进入练习目录
cd terminal-practice

# 6. 创建一个文件
echo "我的第一个终端文件" > hello.txt

# 7. 查看文件内容
cat hello.txt

# 8. 查看当前完整路径
pwd
```

### 练习 2：浏览 Claude Code 项目结构

```bash
# 1. 进入 Claude Code 源码目录
cd /path/to/claude-code-main

# 2. 列出 src 目录下的所有子目录
ls src/

# 3. 查看 tools 目录下有哪些工具
ls src/tools/

# 4. 查看 components 目录下有哪些组件
ls src/components/ | head -20

# 5. 统计 tools 目录下有多少个工具目录
ls src/tools/ | wc -l
```

### 练习 3：理解路径

回答以下问题（用纸笔或文本文件记录答案）：

1. `/Users/zhangsan/projects/claude-code-main/src/main.tsx` 是绝对路径还是相对路径？
2. 如果你当前在 `/Users/zhangsan/projects/claude-code-main/` 目录下，怎样用相对路径访问 `main.tsx`？
3. `../` 在路径中表示什么？
4. 在 TypeScript 代码 `import { getTools } from './tools.js'` 中，`./` 表示什么？

### 练习 4：查看环境变量

```bash
# 查看你的用户主目录
echo $HOME

# 查看系统的 PATH 变量
echo $PATH

# 设置一个临时环境变量
export GREETING="你好，世界"
echo $GREETING

# 查看 Node.js 相关的环境变量（如果安装了的话）
echo $NODE_ENV
```

---

**下一课预告**：在第 3 课中，我们将学习 TypeScript——Claude Code 使用的主要编程语言。我们会结合 Claude Code 源码中的真实代码来讲解。
