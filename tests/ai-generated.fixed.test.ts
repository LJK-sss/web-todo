// AI 生成的那一版，按审查意见修补之后的样子：
// 换掉弱断言、改正写反的期望值、把漏掉的维度补上（空值/类型/重复/超长/不改原数组/脏数据）。
import { describe, expect, test } from 'vitest';
import { addTodo, parseTodos, toggleTodo, type Todo } from '../src/todo.js';

// 每条用例自己造数据，不再共用一个顶层数组
const base = (): Todo[] => [{ id: 1, text: '学习TS', completed: false }];

describe('addTodo', () => {
  // 维度1（空值）：null 应被拦截
  test('null 被拦截，长度不变', () => {
    const todos = base();
    const next = addTodo(todos, null);
    expect(next.length).toBe(1);
  });

  // 维度1（空值）：undefined 应被拦截
  test('undefined 被拦截，长度不变', () => {
    const todos = base();
    const next = addTodo(todos, undefined);
    expect(next.length).toBe(1);
  });

  // 维度3（类型）：数字不是文本
  test('数字被拦截，长度不变', () => {
    const todos = base();
    const next = addTodo(todos, 123);
    expect(next.length).toBe(1);
  });

  // 维度2（格式）：纯空格
  test('纯空格被拦截，长度不变', () => {
    const todos = base();
    const next = addTodo(todos, '   ');
    expect(next.length).toBe(1);
  });

  // 维度2（格式拓展）：空字符串
  test('空字符串被拦截，长度不变', () => {
    const todos = base();
    const next = addTodo(todos, '');
    expect(next.length).toBe(1);
  });

  // 维度2（格式拓展）：超长文本
  test('超过 200 字被拦截', () => {
    const todos = base();
    const next = addTodo(todos, '啊'.repeat(201));
    expect(next.length).toBe(1);
  });

  // 维度6（重复）：同一文本加第二次不再入库
  test('重复文本只留一条', () => {
    const todos = base();
    const next = addTodo(todos, '学习TS');
    expect(next.length).toBe(1);
  });

  // 维度7（状态）：添加不改传进来的数组，且新条目内容正确
  test('添加后原数组不变，新条目内容是输入的文字', () => {
    const todos = base();
    const next = addTodo(todos, '写作业');
    expect(next.length).toBe(2);
    expect(todos.length).toBe(1);
    expect(next[1].text).toBe('写作业');
  });
});

describe('toggleTodo', () => {
  // 维度7（状态）：只翻命中的那一条
  test('切换只翻中目标，其他条目和原数组都不动', () => {
    const todos: Todo[] = [
      { id: 1, text: '学习TS', completed: false },
      { id: 2, text: '写作业', completed: false },
    ];
    const next = toggleTodo(todos, 1);
    expect(next[0].completed).toBe(true);
    expect(next[1].completed).toBe(false);
    expect(todos[0].completed).toBe(false);
  });

  // 维度4（越界）：不存在的 id
  test('不存在的 id 不崩溃、长度不变', () => {
    const todos = base();
    const next = toggleTodo(todos, 999);
    expect(next.length).toBe(1);
    expect(next[0].completed).toBe(false);
  });
});

describe('parseTodos（localStorage 这个依赖入口）', () => {
  // 维度8（依赖）：存的东西不受我们控制
  test('不是合法 JSON 时返回空数组', () => {
    expect(parseTodos('{坏数据')).toEqual([]);
  });

  test('解析出来不是数组时返回空数组', () => {
    expect(parseTodos('{"a":1}')).toEqual([]);
  });

  // 维度3（类型）：坏条目逐条丢弃，好的留下
  test('坏条目被丢弃，好的留下', () => {
    const raw = JSON.stringify([
      { id: 1, text: '学习TS', completed: false },
      { id: '2', text: '写作业', completed: false },
      null,
    ]);
    const list = parseTodos(raw);
    expect(list.length).toBe(1);
    expect(list[0].id).toBe(1);
  });
});
