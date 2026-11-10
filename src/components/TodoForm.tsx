import { useState, type FormEvent } from 'react';

export interface TodoFormProps {
  /** 提交时把输入的文字交给父组件，清空输入框是表单自己的事 */
  onAdd: (text: string) => void;
}

export default function TodoForm({ onAdd }: TodoFormProps) {
  const [text, setText] = useState('');

  function handleSubmit(e: FormEvent<HTMLFormElement>): void {
    e.preventDefault();
    onAdd(text); // 校验交给 addTodo，这里只负责收和清
    setText('');
  }

  return (
    <form className="todo-form" id="todoForm" onSubmit={handleSubmit}>
      <input
        className="todo-input"
        id="todoInput"
        type="text"
        value={text}
        placeholder="输入待办事项，回车添加"
        autoComplete="off"
        onChange={(e) => setText(e.target.value)}
      />
      <button className="todo-add" type="submit">添加</button>
    </form>
  );
}
