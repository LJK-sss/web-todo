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

// 编辑：map 出新的数组，只换这一条的文字
function editTodo(id, text) {
  todos = todos.map(t =>
    t.id === id ? { ...t, text: text } : t);
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

    const editBtn = document.createElement('button');
    editBtn.className = 'todo-edit-btn';
    editBtn.type = 'button';
    editBtn.dataset.action = 'edit';
    editBtn.textContent = '编辑';

    li.appendChild(span);
    li.appendChild(editBtn);
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

// 进入编辑：把这一条的文字换成输入框，回车保存，Esc 或点别处放弃
function startEdit(id) {
  const item = list.querySelector('li[data-id="' + id + '"]');
  if (!item) return;
  const span = item.querySelector('.todo-text');
  if (!span) return;

  const box = document.createElement('input');
  box.className = 'todo-edit';
  box.type = 'text';
  box.value = span.textContent;
  item.replaceChild(box, span);
  box.focus();
  box.select();

  let done = false;

  box.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      done = true;
      const value = box.value.trim();
      if (value === '') {
        render();             // 空的不保存，恢复原样
      } else {
        editTodo(id, value);
      }
    } else if (e.key === 'Escape') {
      done = true;
      render();
    }
  });

  box.addEventListener('blur', () => {
    if (!done) render();      // 点到别处就放弃修改
  });
}

// 事件委托：整个列表只挂一个监听，条目每次重画也不用重新绑
list.addEventListener('click', (e) => {
  if (!(e.target instanceof Element)) return;
  if (e.target.classList.contains('todo-edit')) return;   // 正在编辑，点输入框不算点条目
  const item = e.target.closest('li');
  if (!item || !list.contains(item)) return;
  const id = Number(item.dataset.id);   // dataset 取出来是字符串，转成数字再比
  if (!id) return;

  const editBtn = e.target.closest('[data-action="edit"]');
  if (editBtn && item.contains(editBtn)) {
    startEdit(id);
    return;
  }

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
