import { useEffect, useMemo, useState } from 'react';
import TodoForm from './TodoForm';
import TodoList from './TodoList';
import {
  addTodo,
  clearCompleted,
  countCompleted,
  editTodo,
  filterTodos,
  parseTodos,
  removeTodo,
  serializeTodos,
  toggleTodo,
  STORAGE_KEY,
  type Filter,
  type Todo,
} from '../todo';

const FILTERS: ReadonlyArray<{ value: Filter; label: string }> = [
  { value: 'all', label: '全部' },
  { value: 'active', label: '未完成' },
  { value: 'done', label: '已完成' },
];

export default function TodoApp() {
  // 状态只有这一份，DOM 完全由它渲染出来
  const [todos, setTodos] = useState<Todo[]>(() => parseTodos(localStorage.getItem(STORAGE_KEY)));
  const [filter, setFilter] = useState<Filter>('all');

  // 数据变了就往 localStorage 写一份
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, serializeTodos(todos));
  }, [todos]);

  // 只在开发环境挂一个只读调试口子，方便在控制台核对 State 和页面是否一致
  useEffect(() => {
    if (import.meta.env.DEV) {
      (window as Window & { __todos?: Todo[] }).__todos = todos;
    }
  }, [todos]);

  const visible: Todo[] = useMemo(() => filterTodos(todos, filter), [todos, filter]);
  const done: number = countCompleted(todos);

  return (
    <div className="todo-app">
      <h1>待办事项</h1>

      <TodoForm onAdd={(text) => setTodos((prev) => addTodo(prev, text))} />

      <TodoList
        todos={visible}
        onToggle={(id) => setTodos((prev) => toggleTodo(prev, id))}
        onRemove={(id) => setTodos((prev) => removeTodo(prev, id))}
        onEdit={(id, text) => setTodos((prev) => editTodo(prev, id, text))}
      />

      <p className="todo-count">共 {todos.length} 条，已完成 {done} 条</p>

      <div className="todo-bar">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            className={f.value === filter ? 'todo-filter active' : 'todo-filter'}
            type="button"
            data-filter={f.value}
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </button>
        ))}
        <button
          className="todo-clear"
          type="button"
          disabled={done === 0}
          onClick={() => setTodos((prev) => clearCompleted(prev))}
        >
          清除已完成
        </button>
      </div>
    </div>
  );
}
