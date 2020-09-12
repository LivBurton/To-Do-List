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
// let z = 0;

loadEvents();

// ------------------
// EVENT LISTENERS
// ------------------
function loadEvents() {
  btnAdd.addEventListener('click', addTask);
  taskList.addEventListener('click', checkOff);
  taskList.addEventListener('click', requestDeleteTask);
  taskContainer.addEventListener('click', deleteResponse);
  btnClear.addEventListener('click', deleteAll);
  listContainer.addEventListener('click', deleteAllConfirm);
  filterInput.addEventListener('keyup', filterList);
}



// -------------------
// ADD TASK
// -------------------
function addTask(e) {
  // alert div appears if empty input
  if (taskInput.value === '') {
    const div = document.createElement('div');
    div.className = 'bg-warning rounded text-white text-center py-2 mt-1';
    div.appendChild(document.createTextNode('Please enter your next task'));
    container.insertBefore(div, form);

    setTimeout(function () {
      document.querySelector('.bg-warning').remove();
    }, 3500);

  } else {

    const li = document.createElement('li');
    li.className = 'list-group-item text-break';
    li.appendChild(document.createTextNode(taskInput.value));
    const aLink = document.createElement('a');
    aLink.className = 'float-right';
    aLink.innerHTML = '<i class="far fa-check-circle ticked mr-5"></i><i class="far fa-times-circle crossed"></i>';
    // 
    li.appendChild(aLink);
    taskList.appendChild(li);

    taskInput.value = '';
  }

  e.preventDefault();
}

// -------------------
// CHECK OFF TASK
// -------------------
function checkOff(e) {
  const cList = e.target.parentElement.parentElement.classList;
  if (cList.contains('completed') && e.target.classList.contains('fa-check-circle')) {
    e.target.parentElement.parentElement.className = 'list-group-item';
  }

  else if (e.target.classList.contains('fa-check-circle')) {

    e.target.parentElement.parentElement.className += ' completed';
 
    taskAlert('Awesome, keep going!', 'complete');
    console.log(e.target.parentElement.parentElement);
  }

}

// -------------------
// DELETE TASK
// -------------------
function requestDeleteTask(e) {
  console.log(e.target.parentElement.parentElement);
  console.log(document.querySelectorAll('.list-group-item'));

  if (e.target.classList.contains('fa-times-circle')) {
    e.target.parentElement.parentElement.className += ' remove-it';
    console.log(document.querySelectorAll('.list-group-item'));
   
    taskAlert(`Are you sure you want to delete the task ${e.target.parentElement.parentElement.textContent}?`, 'delete');

    // console.log(e.target.parentElement.parentElement);
   
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
    // console.log(document.querySelector('.complete'));
  } else {
    const btnYes = document.createElement('button');
    const btnNo = document.createElement('button');
    btnYes.className = 'btn-yes';
    btnNo.className = 'btn-no';
    btnYes.innerHTML = 'YES';
    btnNo.innerHTML = 'NO';
    div.appendChild(btnYes);
    div.appendChild(btnNo);
    div.className = 'text-white text-center bg-danger rounded mt-3 py-2 text-break';
  }

}

// -----------------------
// CONFIRM DELETE THE TASK
// -----------------------

function deleteResponse(e) {
  const item = document.querySelector('.remove-it');
  if (e.target.classList.contains('btn-yes')) {
    item.remove();
    e.target.parentElement.remove();
  } else if (e.target.classList.contains('btn-no')) {
    item.classList.remove('remove-it');
    // console.log(item);

    e.target.parentElement.remove();
  }
}

// -------------------------------------
// REQUEST TO DELETE WHOLE LIST
// -------------------------------------

function deleteAll(e) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode('!!  Are you sure you want to delete ALL tasks?  !!'));
  div.className = 'alert alert-danger delete-warning';
  const btnYes = document.createElement('button');
  btnYes.innerHTML = 'YES';
  btnYes.className = 'btn-yes-delete-all btn btn-default border border-dark bg-primary mx-2';
  const btnNo = document.createElement('button');
  btnNo.innerHTML = 'NO';
  btnNo.className = 'btn-no-delete-all btn btn-default border border-dark bg-secondary';

  div.appendChild(btnYes);
  div.appendChild(btnNo);
  listContainer.appendChild(div);

}

// -----------------------------------------
// CONFIRM DELTE ALL
// -----------------------------------------

function deleteAllConfirm(e) {
  if (e.target.classList.contains('btn-no-delete-all')) {
    e.target.parentElement.remove();
  } else if (e.target.classList.contains('btn-yes-delete-all')) {
    while(taskList.firstChild){
      taskList.removeChild(taskList.firstChild);
    }
    e.target.parentElement.remove();
  }
}
// ------------------------------------------------
// FILTER LIST
// ------------------------------------------------
function filterList(e){
  const input = e.target.value.toLowerCase();
  document.querySelectorAll('.list-group-item').forEach(function(item){
    const task = item.firstChild.textContent;
    if(task.toLowerCase().indexOf(input) !==-1){
      item.style.display = 'block';
      console.log(input);
    }else{
      item.style.display = 'none';
    }
  });

}