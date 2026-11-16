import { describe, expect, test } from 'vitest';
import { moveTodo, type Todo } from '../src/todo';

const sample = (): Todo[] => [
  { id: 1, text: '买牛奶', completed: false },
  { id: 2, text: '写作业', completed: false },
  { id: 3, text: '背单词', completed: false },
];

describe('moveTodo', () => {
  test('往后挪：第 1 条放到第 3 条位置', () => {
    const next = moveTodo(sample(), 1, 3);
    expect(next.map((t) => t.id)).toEqual([2, 3, 1]);
  });

  test('往前挪：第 3 条放到第 1 条位置', () => {
    const next = moveTodo(sample(), 3, 1);
    expect(next.map((t) => t.id)).toEqual([3, 1, 2]);
  });

  test('长度不变', () => {
    expect(moveTodo(sample(), 1, 3).length).toBe(3);
  });

  test('同一个 id：原样返回，不报错', () => {
    const todos = sample();
    const next = moveTodo(todos, 2, 2);
    expect(next.map((t) => t.id)).toEqual([1, 2, 3]);
  });

  test('找不到的 id：原样返回', () => {
    const next = moveTodo(sample(), 999, 1);
    expect(next.map((t) => t.id)).toEqual([1, 2, 3]);
  });

  test('不改传进来的数组', () => {
    const todos = sample();
    const next = moveTodo(todos, 1, 3);
    expect(todos.map((t) => t.id)).toEqual([1, 2, 3]); // 原数组顺序没动
    expect(next).not.toBe(todos);
  });
});
