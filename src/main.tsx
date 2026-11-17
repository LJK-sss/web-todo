import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './style.css';
import { ThemeProvider } from './theme';
import TodoApp from './components/TodoApp';

const container = document.getElementById('root');
if (!container) throw new Error('页面里找不到 #root');

createRoot(container).render(
  <StrictMode>
    <ThemeProvider>
      <TodoApp />
    </ThemeProvider>
  </StrictMode>,
);
