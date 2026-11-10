import { describe, expect, test } from 'vitest';
import { countCompleted, filterTodos, type Todo } from '../src/todo';

const sample = (): Todo[] => [
  { id: 1, text: '学习TS', completed: false },
  { id: 2, text: '写作业', completed: true },
  { id: 3, text: '背单词', completed: false },
];

describe('filterTodos', () => {
  test('all：原样返回全部', () => {
    expect(filterTodos(sample(), 'all').length).toBe(3);
  });

  test('active：只留未完成', () => {
    const list = filterTodos(sample(), 'active');
    expect(list.map((t) => t.id)).toEqual([1, 3]);
  });

  test('done：只留已完成', () => {
    const list = filterTodos(sample(), 'done');
    expect(list.length).toBe(1);
    expect(list[0].id).toBe(2);
  });

  test('不改传进来的数组', () => {
    const todos = sample();
    const list = filterTodos(todos, 'done');
    expect(todos.length).toBe(3);
    expect(list).not.toBe(todos);
  });
});

describe('countCompleted', () => {
  test('数出已完成的条数', () => {
    expect(countCompleted(sample())).toBe(1);
  });

  test('空数组返回 0', () => {
    expect(countCompleted([])).toBe(0);
  });
});
