# 待办事项 V4.0

原生 HTML + TypeScript + React 写的待办列表，用 Vite 打包，用 Vitest 跑单测、用 ESLint 卡规范。

## 功能

- 添加待办（回车或点「添加」，空输入、重复内容、超长文本都会被拦掉）
- 点条目文字切换「已完成」
- 点「删除」删掉这一条
- 点「编辑」就地改文字，回车保存，Esc 或点别处放弃
- 「全部 / 未完成 / 已完成」三个筛选
- 「清除已完成」一次清掉所有已完成的
- 数据存在 localStorage，刷新后还在

## 数据流

状态只有一处：`todos` 数组。所有操作都走同一条路：

```
改数据（生成新数组） → save() → render()
```

添加用展开，删除用 `filter`，切换用 `map` + 展开，三个操作都不改原数组。

## 类型约束

- `strict: true`、`noEmit: true`（类型检查交给 `tsc --noEmit`，打包交给 Vite）；
- 数据结构只有 `interface Todo`（`id: number` / `text: string` / `completed: boolean`）；
- 脏数据只有两个入口：`dataset.id`（永远是字符串）和 localStorage 里解析出来的东西。
  前者走 `toTodoId()`（`Number()` + `Number.isSafeInteger`），后者走 `parseTodos()`（逐条校验，坏的丢弃）；
- 不用 `any`、不用非空断言 `!`、不用 `as` 硬转。

## 命令

```bash
npm install        # 装依赖
npm run dev        # 起开发服务器（Vite，默认 http://localhost:5173）
npm run build      # tsc --noEmit 先过类型检查，再 vite build 出 dist/
npm run preview    # 预览打包结果
npm run test       # 跑单测（vitest run）
npm run lint       # 跑 ESLint（eslint src/）
```

## 规范约束

`.eslintrc.cjs` 里三条规则：

| 规则 | 级别 | 说明 |
| --- | --- | --- |
| `complexity` | warn, 10 | 单个函数分支数不超过 10 |
| `max-depth` | warn, 3 | 代码块嵌套不超过 3 层 |
| `@typescript-eslint/no-explicit-any` | error | 不许写 `any` |

当前状态：`npx eslint src/` → **0 error、0 warning**。

## 文件

| 文件 | 说明 |
| --- | --- |
| `index.html` | 页面结构（Vite 的入口 HTML，只有一个 `#root`） |
| `src/main.tsx` | React 挂载入口：引入样式，把 `<TodoApp />` 挂到 `#root` |
| `src/style.css` | 样式 |
| `src/todo.ts` | 数据层（纯函数）：接口定义 + 增删改查 + 筛选 + 脏数据解析 |
| `src/components/TodoApp.tsx` | 唯一持有 `todos` / `filter` 状态，向下传数据、收上行事件 |
| `src/components/TodoForm.tsx` | 输入框 + 添加按钮，只负责收字和清空 |
| `src/components/TodoList.tsx` | 列表容器，空状态与 `TodoItem` 的映射 |
| `src/components/TodoItem.tsx` | 单条：切换、删除、就地编辑（编辑草稿是它自己的 state） |
| `tests/todo.test.ts` | 手写单测（正常 + 边界） |
| `tests/filter.test.ts` | 筛选与计数的单测 |
| `tests/ai-generated.fixed.test.ts` | 审查后修补的单测（覆盖 9 维度） |
| `vite.config.ts` | Vite 配置（含 React 插件） |
| `.eslintrc.cjs` | ESLint 配置 |
| `tsconfig.json` | 类型检查用，`strict: true` + `noEmit: true` |

