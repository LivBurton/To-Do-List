//-------------------
// VARIABLES
// ------------------
const taskList = document.getElementById('task-list');
const taskInput = document.getElementById('task-input');
const btnAdd = document.getElementById('btn-add');
const form = document.getElementById('task-form');
const container = document.querySelector('.container');
const taskContainer = document.querySelector('.task-container');
const listContainer = document.getElementById('list-container');
const btnClear = document.getElementById('btn-clear');
const filterInput = document.getElementById('filter-input');

loadEvents();

// ------------------
// EVENT LISTENERS
// ------------------
function loadEvents() {
  document.addEventListener('DOMContentLoaded', getLocal);
  btnAdd.addEventListener('click', addTask);
  taskList.addEventListener('click', checkOff);
  taskList.addEventListener('click', requestDeleteTask);
  taskContainer.addEventListener('click', deleteResponse);
  btnClear.addEventListener('click', deleteAll);
  listContainer.addEventListener('click', deleteAllConfirm);
  filterInput.addEventListener('keyup', filterList);
}




// ------------------------------
// ADD ANY TASKS IN LOCAL STORAGE
// -------------------------------
function getLocal() {

  let tasks;
  if (localStorage.getItem('tasks') === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }

  tasks.forEach(function (item) {

    const li = document.createElement('li');
    li.appendChild(document.createTextNode(item.input));
    const aLink = document.createElement('a');
    aLink.className = 'float-right';
    aLink.innerHTML = '<i class="far fa-check-circle ticked mr-5"></i><i class="far fa-times-circle crossed"></i>';
    li.appendChild(aLink);
    taskList.appendChild(li);
    if (item.classBoolean === false) {
      li.classList = 'list-group-item text-break';
    }
    if (item.classBoolean === true) {
      li.classList = 'list-group-item text-break completed';
    }
  });
}


// -------------------
// ADD TASK
// -------------------
function addTask(e) {
  if (taskInput.value === '') {
    const div = document.createElement('div');
    div.className = 'bg-warning rounded text-white text-center py-2 mt-1';
    div.appendChild(document.createTextNode('Please enter your next task'));
    container.insertBefore(div, form);
    btnAdd.disabled = true;
    setTimeout(function () {
      document.querySelector('.bg-warning').remove();
      btnAdd.disabled = false;
    }, 2000);

  } else {
    const li = document.createElement('li');
    li.className = 'list-group-item text-break';
    li.appendChild(document.createTextNode(taskInput.value));
    const aLink = document.createElement('a');
    aLink.className = 'float-right';
    aLink.innerHTML = '<i class="far fa-check-circle ticked mr-5"></i><i class="far fa-times-circle crossed"></i>';
    li.appendChild(aLink);
    taskList.appendChild(li);

    addToLocal(taskInput.value, false);
    taskInput.value = '';
  }
  e.stopPropagation();
  e.preventDefault();
}

// ---------------------------------
// ADD TASK TO LOCAL STORAGE
// ---------------------------------
function addToLocal(task, classB) {
  let tasks;
  if (localStorage.getItem('tasks') === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }
  tasks.push({ "input": task, "classBoolean": classB });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// -------------------
// CHECK OFF TASK
// -------------------
function checkOff(e) {
  const cList = e.target.parentElement.parentElement.classList;
  if (cList.contains('completed') && e.target.classList.contains('fa-check-circle')) {
    e.target.parentElement.parentElement.className = 'list-group-item';
    checkOffStorageRemove(e.target.parentElement.parentElement.textContent);
  } else if (e.target.classList.contains('fa-check-circle')) {

    e.target.parentElement.parentElement.className += ' completed';
    if (document.querySelector('.complete') === null) {
      taskAlert('Awesome, keep going!', 'complete');
    }
    checkOffStorage(e.target.parentElement.parentElement.textContent);
  }
  e.stopPropagation();
}

// -----------------------------------
// CHECK OF IN LOCAL STORAGE
// -----------------------------------

function checkOffStorage(task) {
  let tasks = JSON.parse(localStorage.getItem('tasks'));
  tasks.forEach(function (item) {
    if (item.input === task) {
      item.classBoolean = true;
    }
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// ----------------------------------
// UNCHECK IN LOCAL STORAGE
// ----------------------------------

function checkOffStorageRemove(task) {
  let tasks = JSON.parse(localStorage.getItem('tasks'));
  tasks.forEach(function (item) {
    if (item.input === task) {
      item.classBoolean = false;
    }
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// -------------------
// DELETE TASK
// -------------------
function requestDeleteTask(e) {

  if (e.target.classList.contains('fa-times-circle') && document.querySelector('.bg-danger') === null) {
    e.target.parentElement.parentElement.className += ' remove-it';

    taskAlert(`Are you sure you want to delete the task "${e.target.parentElement.parentElement.textContent}"?`, 'delete');
    e.target.disabled = true;
  }
}

// -------------------
// TASK ALERTS
// -------------------

function taskAlert(msg, request) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(msg));
  taskContainer.insertBefore(div, listContainer);
  if (request === 'complete') {
    div.className = 'complete text-white text-center bg-info rounded mt-3 py-2 text-break';
    setTimeout(function () {
      document.querySelector('.complete').remove();
    }, 2500);
  } else {
    const btnYes = document.createElement('button');
    const btnNo = document.createElement('button');
    btnYes.className = 'btn-yes mx-2 my-2 btn btn-outline-light';
    btnNo.className = 'btn-no mx-2 my-2 btn btn-outline-light';
    btnYes.innerHTML = 'YES';
    btnNo.innerHTML = 'NO';
    const br = document.createElement('br');
    div.appendChild(br);
    div.appendChild(btnYes);
    div.appendChild(btnNo);
    div.className = 'text-white text-center bg-danger rounded mt-3 py-2 px-2 text-break';
  }
}

// -----------------------
// CONFIRM DELETE THE TASK
// -----------------------

function deleteResponse(e) {
  const item = document.querySelector('.remove-it');
  if (e.target.classList.contains('btn-yes')) {
    deleteFromLocal(item);
    item.remove();

    e.target.parentElement.remove();
  } else if (e.target.classList.contains('btn-no')) {
    item.classList.remove('remove-it');

    e.target.parentElement.remove();
  }
}

// ----------------------------------
// DELETE FROM LOCAL STORAGE
// ----------------------------------
function deleteFromLocal(item) {
  let tasks;
  if (localStorage.getItem('tasks') === null) {
    tasks = [];
  } else {
    tasks = JSON.parse(localStorage.getItem('tasks'));
  }
  tasks.forEach(function (task, index) {
    if (item.textContent === task.input) {
      tasks.splice(index, 1);
    }
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// -------------------------------------
// REQUEST TO DELETE WHOLE LIST
// -------------------------------------

function deleteAll(e) {
  btnClear.disabled = true;
  const div = document.createElement('div');
  div.appendChild(document.createTextNode('!!  Are you sure you want to delete ALL tasks?  !!'));

  div.className = 'alert alert-danger delete-warning text-center';
  const btnYes = document.createElement('button');
  btnYes.innerHTML = 'YES';
  btnYes.className = 'btn-yes-delete-all btn btn-outline-dark mx-2 mt-2';
  const btnNo = document.createElement('button');
  btnNo.innerHTML = 'NO';
  btnNo.className = 'btn-no-delete-all btn btn-outline-dark mx-2 mt-2';

  div.appendChild(btnYes);
  div.appendChild(btnNo);
  listContainer.appendChild(div);
  e.stopPropagation();
}

// ------------------------------------
// DISABLE ADDITIONAL ALERTS
// ------------------------------------

document.onclick = function (e) {
  if (e.target.className !== 'alert-danger' && document.querySelector('.alert-danger')) {
    document.querySelector('.alert-danger').remove();
    btnClear.disabled = false;
  }
  if (e.target.className !== 'bg-danger' && document.querySelector('.bg-danger')) {
    document.querySelector('.bg-danger').remove();
  }
}

// -----------------------------------------
// CONFIRM DELETE ALL
// -----------------------------------------

function deleteAllConfirm(e) {
  if (e.target.classList.contains('btn-no-delete-all')) {
    e.target.parentElement.remove();
  } else if (e.target.classList.contains('btn-yes-delete-all')) {
    while (taskList.firstChild) {
      taskList.removeChild(taskList.firstChild);
    }
    localStorage.clear();
    e.target.parentElement.remove();
  }
  btnClear.disabled = false;
}

// ------------------------------------------------
// FILTER LIST
// ------------------------------------------------
function filterList(e) {
  const input = e.target.value.toLowerCase();
  document.querySelectorAll('.list-group-item').forEach(function (item) {
    const task = item.firstChild.textContent;
    if (task.toLowerCase().indexOf(input) !== -1) {
      item.style.display = 'block';
    } else {
      item.style.display = 'none';
    }
  });
}