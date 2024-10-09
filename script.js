const table = document.querySelector('table');
const todo = document.getElementById('todo');
const priority = document.querySelector('select');
const deadline = document.querySelector('input[type="date"]');
const submit = document.getElementById('submit');

const storage = localStorage;
let list = [];


document.addEventListener('DOMContentLoaded', () => {
    const json = storage.todolist;
    if (json == undefined) {
        return;
    }
    list = JSON.parse(json);   
    for (const item of list) {
        addItem(item);
    };
});


const addItem = (item) => {

    const tr = document.createElement('tr');
    for (const prop in item) {
        const td = document.createElement('td');
        if(prop == 'done'){
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = item[prop];
            td.appendChild(checkbox);
            checkbox.addEventListener('change', checkboxListener);
        }else{
            td.textContent = item[prop];
        }
        tr.appendChild(td);
    };
    table.append(tr);

}

const checkboxListener = (ev) => {
    const trList = Array.from(document.getElementsByTagName('tr'));
    const currentTr = ev.currentTarget.parentElement.parentElement;
    const idx = trList.indexOf(currentTr) -1;
    list[idx].done = ev.currentTarget.checked;
    storage.todolist = JSON.stringify(list);
}

submit.addEventListener('click', () => {
    const item = {};
    if (todo.value != '') {
        item.todo = todo.value;
    }else {
        window.alert('Enter todo list');
        return;
    }
        
    item.priority = priority.value;

    if (deadline.value != ''){
        item.deadline = deadline.value;
    }else{
        item.deadline = new Date().toISOString().split('T')[0];
    }
    item.done = false;
    todo.value = '';
    priority.value = '普';
    deadline.value = '';

    addItem(item);
    
    /*const td1 = document.createElement('td');
    td1.textContent = item.todo;
    tr.appendChild(td1);*/
   

    list.push(item);
    storage.todolist = JSON.stringify(list);

});

const filterButton = document.createElement('button');
filterButton.textContent = '優先度（高）で絞り込み';
filterButton.id = 'proprity';
const main = document.querySelector('main');
main.appendChild(filterButton);

filterButton.addEventListener('click', () => {
    clearTable();
    for (const item of list) {
        if (item.priority == '高'){
            addItem(item);
        }
    }
});

const clearTable = () => {
    const trList = Array.from(document.getElementsByTagName('tr'));
    trList.shift();
    for (const tr of trList) {
        tr.remove();
    }
};

const remove = document.createElement('button');
remove.id = 'remove';
remove.textContent = '完了したTODOを削除する';
const br = document.createElement('br');
main.appendChild(br);
main.appendChild(remove);

remove.addEventListener('click', () => {
    clearTable();
    list = list.filter((item) => item.done == false);
    for (const item of list) {
        addItem(item);
    }
    storage.todolist = JSON.stringify(list);
});