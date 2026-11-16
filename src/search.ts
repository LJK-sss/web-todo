import type { Todo } from './todo';

/** 按关键字过滤（第一轮：只满足功能要求） */
export function filterByKeyword(todos: readonly Todo[], keyword: string): Todo[] {
  if (keyword === '') return [...todos];
  return todos.filter((t) => t.text.includes(keyword));
}

/** 当前视图 X 条 / 总计 Y 条 */
export function statsText(view: readonly Todo[], all: readonly Todo[]): string {
  return `当前视图 ${view.length} 条 / 总计 ${all.length} 条`;
}
