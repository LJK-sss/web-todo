// 待办事项 V2.0 · 数据驱动重构 + 筛选 + 持久化（第二轮）
// 口诀：改数据 → 保存 → 重渲染，三个操作都走同一条路

const KEY = 'todos';

const list = document.querySelector('#todoList');
const input = document.querySelector('#todoInput');
const form = document.querySelector('#todoForm');
const count = document.querySelector('#todoCount');
const empty = document.querySelector('#todoEmpty');
const filterBtns = document.querySelectorAll('.todo-filter');
const clearBtn = document.querySelector('#clearBtn');

let todos = load();
let filter = 'all';                 // 视图状态，不进 localStorage

function save() {
  localStorage.setItem(KEY, JSON.stringify(todos));
}

function load() {
  const raw = localStorage.getItem(KEY);
  if (raw === null) return [];
  try {
    const data = JSON.parse(raw);   // 存过 → 解析
    return Array.isArray(data) ? data : [];   // 解析出来不是数组就丢弃
  } catch (e) {
    return [];                      // 内容坏了 → 当没存过
  }
}

function addTodo(text) {
  const value = text.trim();
  if (value === '') return;                              // 空输入/纯空格不添加
  if (todos.some(t => t.text === value)) return;         // 重复内容不添加

  todos = [...todos, { id: Date.now(), text: value, completed: false }];
  save();
  render();
}

function removeTodo(id) {
  todos = todos.filter(t => t.id !== id);
  save();
  render();
}

function toggleTodo(id) {
  todos = todos.map(t =>
    t.id === id ? { ...t, completed: !t.completed } : t);
  save();
  render();
}

function setFilter(f) {
  filter = f;
  render();                        // 视图状态不落盘，刷新回到 all
}

function clearCompleted() {
  todos = todos.filter(t => !t.completed);
  save();
  render();
}

function render() {
  list.innerHTML = '';

  const shown = todos.filter(t =>
    filter === 'all' ? true :
    filter === 'done' ? t.completed : !t.completed);

  shown.forEach(t => {
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.dataset.id = String(t.id);
    if (t.completed) li.classList.add('done');

    const span = document.createElement('span');
    span.className = 'todo-text';
    span.textContent = t.text;      // 走文本通道，输入里的标签不会被解析

    const btn = document.createElement('button');
    btn.className = 'todo-remove';
    btn.type = 'button';
    btn.textContent = '删除';

    li.appendChild(span);
    li.appendChild(btn);
    list.appendChild(li);
  });

  const done = todos.reduce((n, t) => n + (t.completed ? 1 : 0), 0);
  count.textContent = '共 ' + todos.length + ' 条，已完成 ' + done + ' 条';
  empty.style.display = todos.length === 0 ? 'block' : 'none';
  clearBtn.disabled = done === 0;

  filterBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.filter === filter);
  });
}

list.addEventListener('click', e => {
  const li = e.target.closest('.todo-item');
  if (!li) return;
  const id = Number(li.dataset.id);

  if (e.target.closest('.todo-remove')) {
    e.stopPropagation();            // 点删除不要顺带切换完成态
    removeTodo(id);
    return;
  }
  toggleTodo(id);
});

form.addEventListener('submit', e => {
  e.preventDefault();
  addTodo(input.value);
  input.value = '';
  input.focus();
});

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => setFilter(btn.dataset.filter));
});

clearBtn.addEventListener('click', clearCompleted);

render();
