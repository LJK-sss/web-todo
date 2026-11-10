import { useState } from 'react';
import type { Todo } from '../todo';

export interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onRemove: (id: number) => void;
  onEdit: (id: number, text: string) => void;
}

export default function TodoItem({ todo, onToggle, onRemove, onEdit }: TodoItemProps) {
  // 这两个是"这一条正在编辑"的局部状态，没必要放到 TodoApp
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(todo.text);

  function startEdit(): void {
    setDraft(todo.text);
    setEditing(true);
  }

  function commit(): void {
    onEdit(todo.id, draft);
    setEditing(false);
  }

  function cancel(): void {
    setEditing(false);
  }

  return (
    <li className={todo.completed ? 'todo-item done' : 'todo-item'} data-id={todo.id}>
      {editing ? (
        <input
          className="todo-edit"
          type="text"
          value={draft}
          autoFocus
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit();
            if (e.key === 'Escape') cancel();
          }}
          onBlur={cancel}
        />
      ) : (
        <>
          <span className="todo-text" onClick={() => onToggle(todo.id)}>{todo.text}</span>
          <button className="todo-edit-btn" type="button" onClick={startEdit}>编辑</button>
          <button className="todo-remove" type="button" onClick={() => onRemove(todo.id)}>删除</button>
        </>
      )}
    </li>
  );
}
