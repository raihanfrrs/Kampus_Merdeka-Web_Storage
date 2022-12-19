const buku = [];
const RENDER_EVENT = 'render-todo';
const SAVED_EVENT = 'saved-todo';
const UNDO_EVENT = 'undo-todo';
const DONE_EVENT = 'done-todo';
const REMOVE_EVENT = 'remove-todo';
const STORAGE_KEY = 'TODO_APPS';

function generateId() {
    return +new Date();
}

function generateTodoObject(id, task, isCompleted) {
    return {
        id,
        task,
        isCompleted
    }
}

function findTodo(todoId) {
for (const todoItem of buku) {
    if (todoItem.id === todoId) {
        return todoItem;
    }
}
return null;
}

function findTodoIndex(todoId) {
for (const index in buku) {
    if (buku[index].id === todoId) {
        return index;
    }
}
return -1;
}


/**
 * Fungsi ini digunakan untuk memeriksa apakah localStorage didukung oleh browser atau tidak
 *
 * @returns boolean
 */
function isStorageExist() /* boolean */ {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

/**
 * Fungsi ini digunakan untuk menyimpan data ke localStorage
 * berdasarkan KEY yang sudah ditetapkan sebelumnya.
 */
function saveData(type) {
    if (isStorageExist()) {
        const parsed /* string */ = JSON.stringify(buku);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(type));
    }
}

/**
 * Fungsi ini digunakan untuk memuat data dari localStorage
 * Dan memasukkan data hasil parsing ke variabel {@see buku}
 */
function loadDataFromStorage() {
    const serializedData /* string */ = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const todo of data) {
            buku.push(todo);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}


function makeTodo(todoObject) {
    const {id, task, isCompleted} = todoObject;

    const textTitle = document.createElement('h4');
    textTitle.innerText = task;

    const textContainer = document.createElement('td');
    textContainer.classList.add('inner');
    textContainer.append(textTitle);

    const actionContainer = document.createElement('td');
    actionContainer.classList.add('inner');

    const container = document.createElement('tr');
    container.classList.add('item')
    container.append(textContainer, actionContainer);
    container.setAttribute('id', `todo-${id}`);

    if (isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');
        undoButton.addEventListener('click', function () {
            undoTaskFromCompleted(id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');
        trashButton.addEventListener('click', function () {
            removeTaskFromCompleted(id);
        });

        actionContainer.append(undoButton, trashButton);
    } else {

        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');
        checkButton.addEventListener('click', function () {
            addTaskToCompleted(id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');
        trashButton.addEventListener('click', function () {
            removeTaskFromCompleted(id);
        });

        actionContainer.append(checkButton, trashButton);
    }

    return container;
}

function addTodo() {
    const textTodo = document.getElementById('judul').value;

    const generatedID = generateId();
    const todoObject = generateTodoObject(generatedID, textTodo, false);
    buku.push(todoObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData(SAVED_EVENT);
}

function addTaskToCompleted(todoId /* HTMLELement */) {
    const todoTarget = findTodo(todoId);

    if (todoTarget == null) return;

    todoTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData(DONE_EVENT);
}

function removeTaskFromCompleted(todoId /* HTMLELement */) {
    const todoTarget = findTodoIndex(todoId);

    if (todoTarget === -1) return;

    buku.splice(todoTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData(REMOVE_EVENT);
}

function undoTaskFromCompleted(todoId /* HTMLELement */) {
    const todoTarget = findTodo(todoId);
    if (todoTarget == null) return;

    todoTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData(UNDO_EVENT);
}

document.addEventListener('DOMContentLoaded', function () {
    const submitForm /* HTMLFormElement */ = document.getElementById('form');

    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addTodo();
        submitForm.reset();
    });

    if (isStorageExist()) {
        loadDataFromStorage();
    }
});

document.addEventListener(SAVED_EVENT, () => {
    alert('Buku Disimpan.');
});

document.addEventListener(DONE_EVENT, () => {
    alert('Buku Dipindahkan ke Rak Selesai Dibaca!');
});

document.addEventListener(UNDO_EVENT, () => {
    alert('Buku Dipindahkan ke Rak Belum Selesai Dibaca!');
});

document.addEventListener(REMOVE_EVENT, () => {
    alert('Buku Dihapus Dari Rak!');
});

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedTODOList = document.getElementById('buku');
    const listCompleted = document.getElementById('completed-todos');

    // clearing list item
    uncompletedTODOList.innerHTML = '';
    listCompleted.innerHTML = '';

    for (const todoItem of buku) {
        const todoElement = makeTodo(todoItem);
        if (todoItem.isCompleted) {
        listCompleted.append(todoElement);
        } else {
        uncompletedTODOList.append(todoElement);
        }
    }
});