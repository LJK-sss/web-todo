import { describe, expect, test } from 'vitest';
import { addTodo, toggleTodo, type Todo } from '../src/todo.js';

describe('addTodo', () => {
  test('正常添加：长度 +1，存进去的就是输入的文字', () => {
    const todos: Todo[] = [];
    const next = addTodo(todos, '学习TS');
    expect(next.length).toBe(1);
    expect(next[0].text).toBe('学习TS'); // 断言到具体内容，不写 toBeDefined
    expect(next[0].completed).toBe(false);
  });

  test('纯空格：拦截，长度不变', () => {
    const todos: Todo[] = [];
    const next = addTodo(todos, '   ');
    expect(next.length).toBe(0);
  });

  test('空字符串：拦截，长度不变', () => {
    const todos: Todo[] = [];
    const next = addTodo(todos, '');
    expect(next.length).toBe(0);
  });
});

describe('toggleTodo', () => {
  test('正常切换：目标翻转，另一条不受影响', () => {
    const todos: Todo[] = [
      { id: 1, text: '学习TS', completed: false },
      { id: 2, text: '写作业', completed: false },
    ];
    const next = toggleTodo(todos, 1);
    expect(next[0].completed).toBe(true);
    expect(next[1].completed).toBe(false); // 别的条目不能被带着翻
  });

  test('不存在的 ID：不崩溃，长度不变', () => {
    const todos: Todo[] = [{ id: 1, text: '学习TS', completed: false }];
    const next = toggleTodo(todos, 999);
    expect(next.length).toBe(1);
    expect(next[0].completed).toBe(false);
  });
});
