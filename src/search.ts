import type { Todo } from './todo';

/** 关键字最长 50 字，超出的部分直接截掉 */
export const MAX_KEYWORD_LENGTH = 50;

/** 搜索条件的存储键，和 todos 分开存 */
export const KEYWORD_KEY = 'todos.keyword';

/**
 * 关键字入口：非字符串、纯空格都当成"没有关键字"。
 * 搜索框里敲几个空格不等于搜"空格"，这一步必须在过滤之前。
 */
export function normalizeKeyword(raw: unknown): string {
  if (typeof raw !== 'string') return '';
  const value = raw.trim();
  if (value === '') return '';
  if (value.length > MAX_KEYWORD_LENGTH) {
    return value.slice(0, MAX_KEYWORD_LENGTH);
  }
  return value;
}

/** 按关键字过滤：不区分大小写，关键字为空时原样返回；不改原数组 */
export function filterByKeyword(
  todos: readonly Todo[],
  keyword: unknown,
): Todo[] {
  const key = normalizeKeyword(keyword);
  if (key === '') return [...todos];
  const lower = key.toLowerCase();
  return todos.filter((t) => t.text.toLowerCase().includes(lower));
}

export interface StatSummary {
  showing: number;
  total: number;
}

/** 统计当前视图和总数，两个数都来自同一份数据，便于核对 */
export function summarize(view: readonly Todo[], all: readonly Todo[]): StatSummary {
  return { showing: view.length, total: all.length };
}

/** 底部那行文案 */
export function statsText(summary: StatSummary): string {
  return `当前视图 ${summary.showing} 条 / 总计 ${summary.total} 条`;
}
