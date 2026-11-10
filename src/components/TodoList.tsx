import type { Todo } from '../todo';
import TodoItem from './TodoItem';

export interface TodoListProps {
  todos: Todo[];
  onToggle: (id: number) => void;
  onRemove: (id: number) => void;
  onEdit: (id: number, text: string) => void;
}

export default function TodoList({ todos, onToggle, onRemove, onEdit }: TodoListProps) {
  if (todos.length === 0) {
    return <p className="todo-empty">还没有待办，先添加一条吧。</p>;
  }

  return (
    <ul className="todo-list" id="todoList">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onRemove={onRemove}
          onEdit={onEdit}
        />
      ))}
    </ul>
  );
}
