import { describe, expect, test } from 'vitest';
import {
  MAX_KEYWORD_LENGTH,
  filterByKeyword,
  normalizeKeyword,
  statsText,
  summarize,
  type StatSummary,
} from '../src/search';
import type { Todo } from '../src/todo';

const sample = (): Todo[] => [
  { id: 1, text: '买牛奶', completed: false },
  { id: 2, text: '写作业', completed: true },
  { id: 3, text: '背单词 HTML', completed: false },
];

describe('normalizeKeyword', () => {
  test('纯空格等于没有关键字', () => {
    expect(normalizeKeyword('   ')).toBe('');
  });

  test('首尾空格被去掉', () => {
    expect(normalizeKeyword('  作业 ')).toBe('作业');
  });

  test('非字符串一律当空', () => {
    expect(normalizeKeyword(null)).toBe('');
    expect(normalizeKeyword(undefined)).toBe('');
    expect(normalizeKeyword(123)).toBe('');
  });

  test('超长截到上限', () => {
    expect(normalizeKeyword('a'.repeat(MAX_KEYWORD_LENGTH + 20)).length).toBe(MAX_KEYWORD_LENGTH);
  });
});

describe('filterByKeyword', () => {
  test('空关键字：原样返回全部，且是新数组', () => {
    const todos = sample();
    const view = filterByKeyword(todos, '');
    expect(view.length).toBe(3);
    expect(view).not.toBe(todos);
  });

  test('纯空格不误伤：仍然返回全部', () => {
    expect(filterByKeyword(sample(), '   ').length).toBe(3);
  });

  test('命中一条', () => {
    const view = filterByKeyword(sample(), '作业');
    expect(view.length).toBe(1);
    expect(view[0].id).toBe(2);
  });

  test('不区分大小写', () => {
    expect(filterByKeyword(sample(), 'html').length).toBe(1);
    expect(filterByKeyword(sample(), 'HTML').length).toBe(1);
  });

  test('搜不到时返回空数组', () => {
    expect(filterByKeyword(sample(), '不存在')).toEqual([]);
  });

  test('不改原数组', () => {
    const todos = sample();
    filterByKeyword(todos, '作业');
    expect(todos.length).toBe(3);
  });
});

describe('summarize / statsText', () => {
  test('视图数与总数分别统计', () => {
    const todos = sample();
    const view = filterByKeyword(todos, '作业');
    const s: StatSummary = summarize(view, todos);
    expect(s.showing).toBe(1);
    expect(s.total).toBe(3);
    expect(statsText(s)).toBe('当前视图 1 条 / 总计 3 条');
  });

  test('空列表时两个 0', () => {
    expect(statsText(summarize([], []))).toBe('当前视图 0 条 / 总计 0 条');
  });
});
