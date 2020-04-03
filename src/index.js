const form = document.querySelector('form');
const input = document.querySelector('input');
const noteList = document.querySelector('ul');

function renderTask(taskObject) {
    const taskItem = document.createElement('li');
    const taskItemContent = document.createElement('span');
    const taskItemBtnComplete = document.createElement('button');
    const taskItemBtnRemove = document.createElement('button');
    const taskItemBtnEdit = document.createElement('button');

    taskItem.classList.add('note-list__item');
    taskItemBtnComplete.classList.add('complete');
    taskItemBtnRemove.classList.add('remove');
    taskItemBtnEdit.classList.add('edit');

    taskItemBtnComplete.innerText = 'Complete';
    taskItemBtnRemove.innerText = 'Remove';
    taskItemBtnEdit.innerText = 'Edit';
    taskItemContent.innerText = taskObject.value;

    taskItem.appendChild(taskItemContent);
    taskItem.appendChild(taskItemBtnEdit);
    taskItem.appendChild(taskItemBtnComplete);
    taskItem.appendChild(taskItemBtnRemove);

    taskItem.setAttribute('data-id', taskObject.id);

    if(taskObject.completed) {
        taskItem.classList.add('note-list__item--completed');
    }

    return taskItem;
}

let taskList = [];

form.addEventListener('submit', e => {
    e.preventDefault();

    if (input.value.trim()) {
        const task = {
            value: input.value,
            completed: false,
            id: String(new Date).slice(16,24) // eslint-disable-line
        };

        taskList.unshift(task);
        noteList.prepend(renderTask(task));
    }

    input.value = '';
});

let rememberCurrentNote;

noteList.addEventListener('click', e => {
    const element = e.target;
    const targetClassName = element.className;
    let currentId;
    let currentTask;
    const currentLi = element.closest('li');

    const editNoteInput = document.createElement('input');
    const taskItemBtnSave = document.createElement('button');
    const taskItemBtnCancel = document.createElement('button');

    switch(targetClassName) {
    case 'complete':
    case 'remove':
    case 'edit':
    case 'save':
    case 'cancel':
        currentId = currentLi.getAttribute('data-id');
        currentTask = taskList.find(task => task.id === currentId);
        break;
    }

    switch(targetClassName) {
    case 'complete':
        currentTask.completed = true;

        noteList.innerHTML = '';

        taskList.forEach(task => {
            noteList.append(renderTask(task));
        });
        break;

    case 'remove':
        noteList.innerHTML = '';

        taskList = taskList.filter(task => task.id !== currentId);

        taskList.forEach(task => {
            noteList.append(renderTask(task));
        });
        break;

    case 'edit':
        rememberCurrentNote = currentLi.innerHTML;
        currentLi.innerHTML = '';

        editNoteInput.setAttribute('placeholder', currentTask.value);
        currentLi.append(editNoteInput);

        taskItemBtnSave.classList.add('save');
        taskItemBtnSave.innerText = 'Save';
        currentLi.append(taskItemBtnSave);

        taskItemBtnCancel.classList.add('cancel');
        taskItemBtnCancel.innerText = 'Cancel';
        currentLi.append(taskItemBtnCancel);
        break;

    case 'save':
        const editedInput = currentLi.querySelector('input'); // eslint-disable-line

        editedInput.value ? currentTask.value = editedInput.value // eslint-disable-line
                : currentTask.value; // eslint-disable-line

        noteList.innerHTML = '';

        taskList.forEach(task => {
            noteList.append(renderTask(task));
        });
        break;

    case 'cancel':
        currentLi.innerHTML = '';
        currentLi.innerHTML = rememberCurrentNote;
        break;
    }
});
