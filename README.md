# 待办事项 V2.0

原生 HTML + CSS + TypeScript 写的待办列表，没有使用任何框架。
业务逻辑和页面逻辑分开：`src/todo.ts` 只管数据，`src/app.ts` 只管 DOM。

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

- `strict: true`、`noEmit: true`，先让编译器把数据结构看明白；
- 数据结构只有 `interface Todo`（`id: number` / `text: string` / `completed: boolean`）；
- 脏数据只有两个入口：`dataset.id`（永远是字符串）和 `localStorage` 里解析出来的东西。
  前者走 `toTodoId()`（`Number()` + `Number.isSafeInteger`），后者走 `parseTodos()`（逐条校验，坏的丢弃）；
- 不用 `any`、不用非空断言 `!`、不用 `as` 硬转。

## 命令

```bash
npm install        # 装依赖
npm run typecheck  # 只做类型检查，不产出文件
npm run build      # 编译到 dist/，页面加载的是 dist/app.js
npm run test       # 跑单测（vitest run）
```

直接用浏览器打开 `index.html` 之前，先跑一次 `npm run build`。

## 文件

| 文件 | 说明 |
| --- | --- |
| `index.html` | 页面结构 |
| `style.css` | 样式 |
| `src/todo.ts` | 数据层：接口定义 + 增删改查 + 脏数据解析 |
| `src/app.ts` | 页面层：取元素、事件委托、渲染 |
| `tests/todo.test.ts` | 手写单测（正常 + 边界） |
| `tsconfig.json` | 类型检查用，`noEmit: true` |
| `tsconfig.build.json` | 编译到 `dist/` 用 |
