// 待办事项 V2.0 · 数据驱动重构 + 筛选 + 持久化
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
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch (e) {
    return [];
  }
}

// 添加：生成新数组，不改原数组
function addTodo(text) {
  const value = text.trim();
  if (value === '') return;
  if (todos.some(t => t.text === value)) return;

  todos = [...todos, { id: Date.now(), text: value, completed: false }];
  save();
  render();
}

// 删除：filter 留下不等于这条 id 的
function deleteTodo(id) {
  todos = todos.filter(t => t.id !== id);
  save();
  render();
}

// 切换：map + 展开，只换匹配的那一条
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
    span.textContent = t.text;

    const btn = document.createElement('button');
    btn.className = 'todo-remove';
    btn.type = 'button';
    btn.dataset.action = 'delete';
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

// 事件委托：整个列表只挂一个监听，条目每次重画也不用重新绑
list.addEventListener('click', (e) => {
  if (!(e.target instanceof Element)) return;
  const item = e.target.closest('li');
  if (!item || !list.contains(item)) return;
  const id = Number(item.dataset.id);   // dataset 取出来是字符串，转成数字再比
  if (!id) return;
  const delBtn = e.target.closest('[data-action="delete"]');
  if (delBtn && item.contains(delBtn)) {
    deleteTodo(id);
    return;                             // 删除后不要再往下走切换
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
