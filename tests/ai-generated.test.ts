// 这是按结构化 Prompt 让 AI 生成的测试，原样收下跑一遍，用来做审查。
// 审查意见和修补版见 tests/ai-generated.fixed.test.ts
import { describe, expect, test } from 'vitest';
import { addTodo, toggleTodo, type Todo } from '../src/todo.js';

const base: Todo[] = [{ id: 1, text: '学习TS', completed: false }];

describe('addTodo', () => {
  test('添加一条任务', () => {
    const next = addTodo(base, '写作业');
    expect(next[0]).toBeDefined();
  });

  // 维度2（格式）：纯空格
  test('纯空格应该被拦截', () => {
    const next = addTodo(base, '   ');
    expect(next.length).not.toBe(2);
  });

  // 维度2（格式拓展）：空字符串
  test('空字符串应该被拦截', () => {
    const next = addTodo(base, '');
    expect(next.length).toBe(2);
  });
});

describe('toggleTodo', () => {
  test('切换完成状态', () => {
    const next = toggleTodo(base, 1);
    expect(next).not.toBe(base);
  });
});
