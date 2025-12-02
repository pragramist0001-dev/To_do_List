let todos = [
    { 
        id: 1, 
        text: 'NOTE #1', 
        completed: false 
    },
    { id: 2, 
        text: 'NOTE #2', 
        completed: true 
    },
    { 
        id: 3, 
        text: 'NOTE #3', 
        completed: false 
    }
];

let filter = 'ALL';
let nextId = 4;

function renderTodos() {
    const todoList = document.getElementById('todoList');
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    let filteredTodos = todos.filter(todo => {
        const matchesSearch = todo.text.toLowerCase().includes(searchTerm);
        if (filter === 'ALL') return matchesSearch;
        if (filter === 'ACTIVE') return matchesSearch && !todo.completed;
        if (filter === 'COMPLETED') return matchesSearch && todo.completed;
        return matchesSearch;
    });

    if (filteredTodos.length === 0) {
        todoList.innerHTML = '<div class="empty-state">No notes found</div>';
        return;
    }

    todoList.innerHTML = filteredTodos.map(todo => `
        <li class="todo-item">
            <div class="checkbox ${todo.completed ? 'checked' : ''}" data-id="${todo.id}"></div>
            <span class="todo-text ${todo.completed ? 'completed' : ''}">${todo.text}</span>
            <div class="todo-actions">
                <button class="action-btn edit-btn" data-id="${todo.id}">✏️</button>
                <button class="action-btn delete-btn" data-id="${todo.id}">🗑️</button>
            </div>
        </li>
    `).join('');

    attachEventListeners();
}

function attachEventListeners() {
    document.querySelectorAll('.checkbox').forEach(cb => {
        cb.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            const todo = todos.find(t => t.id === id);
            if (todo) {
                todo.completed = !todo.completed;
                renderTodos();
            }
        });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            todos = todos.filter(t => t.id !== id);
            renderTodos();
        });
    });

    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            const todo = todos.find(t => t.id === id);
            if (todo) {
                const newText = prompt('Edit note:', todo.text);
                if (newText && newText.trim()) {
                    todo.text = newText.trim();
                    renderTodos();
                }
            }
        });
    });
}

document.getElementById('addBtn').addEventListener('click', function() {
    const input = document.getElementById('addInput');
    const text = input.value.trim();
    if (text) {
        todos.push({ id: nextId++, text: text, completed: false });
        input.value = '';
        renderTodos();
    }
});

document.getElementById('addInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        document.getElementById('addBtn').click();
    }
});

document.getElementById('searchInput').addEventListener('input', renderTodos);

document.getElementById('filterBtn').addEventListener('click', function() {
    const filters = ['ALL', 'ACTIVE', 'COMPLETED'];
    const currentIndex = filters.indexOf(filter);
    filter = filters[(currentIndex + 1) % filters.length];
    this.textContent = filter;
    renderTodos();
});

renderTodos();