// 待办事项的数据层。
// 这里不碰 DOM、也不碰 localStorage，只处理 Todo 数组——单测才能直接 import。

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export const STORAGE_KEY = 'todos';

/** 正文最长 200 字，超了就当成非法输入 */
export const MAX_TEXT_LENGTH = 200;

/**
 * 把用户输入收窄成一段能入库的文本。
 * 返回 null 表示这次输入不合法，调用方原样返回即可。
 */
function normalizeText(input: unknown): string | null {
  if (typeof input !== 'string') return null; // null / undefined / 数字都在这里挡掉
  const value = input.trim();
  if (value === '') return null;
  if (value.length > MAX_TEXT_LENGTH) return null;
  return value;
}

/** 添加：生成新数组，不改传进来的那个 */
export function addTodo(todos: readonly Todo[], input: unknown): Todo[] {
  const text = normalizeText(input);
  if (text === null) return [...todos];
  if (todos.some((t) => t.text === text)) return [...todos]; // 同名的就不再加了
  return [...todos, { id: Date.now(), text, completed: false }];
}

/** 删除：留下 id 不等于这条的 */
export function removeTodo(todos: readonly Todo[], id: number): Todo[] {
  return todos.filter((t) => t.id !== id);
}

/** 切换：只换 id 对上的那一条 */
export function toggleTodo(todos: readonly Todo[], id: number): Todo[] {
  return todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
}

/** 编辑：同样只换匹配的那一条的文字 */
export function editTodo(todos: readonly Todo[], id: number, input: unknown): Todo[] {
  const text = normalizeText(input);
  if (text === null) return [...todos];
  return todos.map((t) => (t.id === id ? { ...t, text } : t));
}

/** 清除已完成 */
export function clearCompleted(todos: readonly Todo[]): Todo[] {
  return todos.filter((t) => !t.completed);
}

/**
 * dataset 里取出来的 id 永远是字符串，这里是唯一的转换入口。
 * Number('') 是 0、Number('123abc') 是 NaN、Number('1.5') 不是整数，
 * 所以要先排空串，再用 isSafeInteger 兜底。
 */
export function toTodoId(raw: string | undefined): number | null {
  if (raw === undefined) return null;
  if (raw.trim() === '') return null;
  const id = Number(raw);
  return Number.isSafeInteger(id) ? id : null;
}

/** 判断一条数据是不是合法的 Todo（localStorage 里的东西不受我们控制） */
function isTodo(value: unknown): value is Todo {
  if (typeof value !== 'object' || value === null) return false;
  if (!('id' in value) || !('text' in value) || !('completed' in value)) return false;
  const { id, text, completed } = value;
  return (
    typeof id === 'number' &&
    Number.isSafeInteger(id) &&
    typeof text === 'string' &&
    typeof completed === 'boolean'
  );
}

/** 把 localStorage 里取出的原文解析成 Todo[]，坏的整条丢弃 */
export function parseTodos(raw: string | null): Todo[] {
  if (raw === null || raw === '') return [];
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return []; // 不是合法 JSON，当没存过
  }
  if (!Array.isArray(data)) return [];
  const items: unknown[] = data;
  return items.filter(isTodo);
}

/** 存之前统一序列化 */
export function serializeTodos(todos: readonly Todo[]): string {
  return JSON.stringify(todos);
}
