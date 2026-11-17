// 仅用于复现任务 3 的"双 Effect 覆盖"问题，不参与产品构建
import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

function BuggyApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [log, setLog] = useState<string[]>([]);

  // 读取 Effect：只在挂载时跑一次
  useEffect(() => {
    const saved = localStorage.getItem('todos');
    if (saved) setTodos(JSON.parse(saved));
    setLog((prev) => [...prev, '读：' + (saved ?? 'null')]);
  }, []);

  // 写入 Effect：todos 一变就写
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
    setLog((prev) => [...prev, '写：' + JSON.stringify(todos)]);
  }, [todos]);

  useEffect(() => {
    const box = document.getElementById('storage');
    if (box) {
      box.textContent = 'localStorage.todos = ' + (localStorage.getItem('todos') ?? 'null');
    }
  });

  return (
    <div>
      <ul className="list">
        {todos.map((t) => (
          <li key={t.id}>{t.text}</li>
        ))}
      </ul>
      <ol style={{ marginTop: 12, fontSize: 12, color: '#6b7280' }}>
        {log.map((line, i) => (
          <li key={i}>{line}</li>
        ))}
      </ol>
    </div>
  );
}

createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <BuggyApp />
  </StrictMode>,
);
