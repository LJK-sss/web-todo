// 页面这一层：只负责取元素、绑事件、把数据渲染出来。
// 真正的业务逻辑都在 todo.ts 里。
import {
  addTodo,
  clearCompleted,
  editTodo,
  parseTodos,
  removeTodo,
  serializeTodos,
  toTodoId,
  toggleTodo,
  STORAGE_KEY,
  type Todo,
} from './todo';

const listRef = document.querySelector('#todoList');
if (!(listRef instanceof HTMLUListElement)) throw new Error('页面里找不到 #todoList');

const inputRef = document.querySelector('#todoInput');
if (!(inputRef instanceof HTMLInputElement)) throw new Error('页面里找不到 #todoInput');

const formRef = document.querySelector('#todoForm');
if (!(formRef instanceof HTMLFormElement)) throw new Error('页面里找不到 #todoForm');

const countRef = document.querySelector('#todoCount');
if (!(countRef instanceof HTMLParagraphElement)) throw new Error('页面里找不到 #todoCount');

const emptyRef = document.querySelector('#todoEmpty');
if (!(emptyRef instanceof HTMLParagraphElement)) throw new Error('页面里找不到 #todoEmpty');

const clearRef = document.querySelector('#clearBtn');
if (!(clearRef instanceof HTMLButtonElement)) throw new Error('页面里找不到 #clearBtn');

// 收窄之后另存一份常量，后面的函数里用的都是带类型的引用
const list: HTMLUListElement = listRef;
const input: HTMLInputElement = inputRef;
const form: HTMLFormElement = formRef;
const count: HTMLParagraphElement = countRef;
const empty: HTMLParagraphElement = emptyRef;
const clearBtn: HTMLButtonElement = clearRef;

const filterBtns = document.querySelectorAll<HTMLButtonElement>('.todo-filter');

type Filter = 'all' | 'active' | 'done';

let todos: Todo[] = parseTodos(localStorage.getItem(STORAGE_KEY));
let filter: Filter = 'all';

function save(): void {
  localStorage.setItem(STORAGE_KEY, serializeTodos(todos));
}

function readFilter(value: string | undefined): Filter {
  return value === 'active' || value === 'done' ? value : 'all';
}

function render(): void {
  list.innerHTML = '';

  const shown: Todo[] = todos.filter((t) =>
    filter === 'all' ? true : filter === 'done' ? t.completed : !t.completed);

  for (const t of shown) {
    const li = document.createElement('li');
    li.className = 'todo-item';
    li.dataset.id = String(t.id);
    if (t.completed) li.classList.add('done');

    const span = document.createElement('span');
    span.className = 'todo-text';
    span.textContent = t.text;

    const editBtn = document.createElement('button');
    editBtn.className = 'todo-edit-btn';
    editBtn.type = 'button';
    editBtn.dataset.action = 'edit';
    editBtn.textContent = '编辑';

    const delBtn = document.createElement('button');
    delBtn.className = 'todo-remove';
    delBtn.type = 'button';
    delBtn.dataset.action = 'delete';
    delBtn.textContent = '删除';

    li.append(span, editBtn, delBtn);
    list.append(li);
  }

  const done: number = todos.reduce((n, t) => n + (t.completed ? 1 : 0), 0);
  count.textContent = `共 ${todos.length} 条，已完成 ${done} 条`;
  empty.style.display = todos.length === 0 ? 'block' : 'none';
  clearBtn.disabled = done === 0;

  for (const btn of filterBtns) {
    btn.classList.toggle('active', readFilter(btn.dataset.filter) === filter);
  }
}

/** 把这一条的文字换成输入框，回车保存，Esc 或失焦放弃 */
function startEdit(id: number): void {
  const item = list.querySelector(`li[data-id="${id}"]`);
  if (!(item instanceof HTMLLIElement)) return;
  const span = item.querySelector('.todo-text');
  if (!(span instanceof HTMLSpanElement)) return;

  const box = document.createElement('input');
  box.className = 'todo-edit';
  box.type = 'text';
  box.value = span.textContent ?? '';
  item.replaceChild(box, span);
  box.focus();
  box.select();

  let settled = false;

  box.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      settled = true;
      const next: Todo[] = editTodo(todos, id, box.value);
      todos = next;
      if (box.value.trim() === '') {
        render(); // 空的不保存，恢复原样
      } else {
        save();
        render();
      }
    } else if (e.key === 'Escape') {
      settled = true;
      render();
    }
  });

  box.addEventListener('blur', () => {
    if (!settled) render(); // 点到别处就放弃修改
  });
}

// 事件委托：整个列表一个监听，条目重画也不用重新绑
type Action = 'edit' | 'delete' | 'toggle';

/** 从点击目标往上找 li；不是 li 就返回 null */
function findItem(target: Element): HTMLLIElement | null {
  const item = target.closest('li');
  return item instanceof HTMLLIElement ? item : null;
}

/** 判断这次点的是编辑、删除还是切换 */
function resolveAction(target: Element): Action {
  if (target.closest('[data-action="edit"]') instanceof HTMLElement) return 'edit';
  if (target.closest('[data-action="delete"]') instanceof HTMLElement) return 'delete';
  return 'toggle';
}

function runAction(action: Action, id: number): void {
  if (action === 'edit') {
    startEdit(id);
    return;
  }
  todos = action === 'delete' ? removeTodo(todos, id) : toggleTodo(todos, id);
  save();
  render();
}

list.addEventListener('click', (e: Event) => {
  const target = e.target;
  if (!(target instanceof Element)) return;
  if (target.classList.contains('todo-edit')) return; // 补回：编辑时点输入框不算点条目
  const item = findItem(target);
  if (item === null) return;
  if (!list.contains(item)) return; // 补回：只认列表里的条目
  const id = toTodoId(item.dataset.id);
  if (id === null) return;
  runAction(resolveAction(target), id);
});

form.addEventListener('submit', (e: SubmitEvent) => {
  e.preventDefault();
  todos = addTodo(todos, input.value);
  save();
  render();
  input.value = '';
  input.focus();
});

for (const btn of filterBtns) {
  btn.addEventListener('click', () => {
    filter = readFilter(btn.dataset.filter);
    render(); // 视图状态不落盘
  });
}

clearBtn.addEventListener('click', () => {
  todos = clearCompleted(todos);
  save();
  render();
});

render();

