let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let lastPickedIndex = localStorage.getItem('lastIndex') ? parseInt(localStorage.getItem('lastIndex')) : null;

function saveAndRender() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    const list = document.getElementById('task-list');
    list.innerHTML = '';
    tasks.forEach((task, index) => {
        list.innerHTML += `
            <li>
                <span>${task}</span>
                <div class="actions">
                    <button class="btn-edit" onclick="editTask(${index})">Edit</button>
                    <button class="btn-delete" onclick="deleteTask(${index})">Delete</button>
                </div>
            </li>`;
    });
}

function addTask() {
    const input = document.getElementById('task-input');
    if (input.value.trim()) {
        tasks.unshift(input.value.trim());
        lastPickedIndex = null;
        localStorage.removeItem('lastIndex');
        input.value = '';
        saveAndRender();
    }
}

function deleteTask(index) {
    tasks.splice(index, 1);
    lastPickedIndex = null; // Reset so logic doesn't break if index is gone
    localStorage.removeItem('lastIndex');
    saveAndRender();
}

function editTask(index) {
    const newVal = prompt("Edit your task:", tasks[index]);
    if (newVal !== null && newVal.trim() !== "") {
        tasks[index] = newVal.trim();
        saveAndRender();
    }
}

function pickRandomTask() {
    const display = document.getElementById('chosen-task');

    if (tasks.length === 0) {
        display.innerText = "Your list is empty!";
        return;
    }

    if (tasks.length === 1) {
        display.innerText = "✨ " + tasks[0] + " ✨";
        return;
    }

    // Logic to prevent repeat
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * tasks.length);
    } while (randomIndex === lastPickedIndex);

    lastPickedIndex = randomIndex; // Update the record for next time
    localStorage.setItem('lastIndex', lastPickedIndex);
    const finalTask = tasks[randomIndex];


    // Visual animation shuffle
    let counter = 0;
    const interval = setInterval(() => {
        const shuffleTask = tasks[Math.floor(Math.random() * tasks.length)];
        display.innerText = shuffleTask;
        counter++;
        if (counter > 10) {
            clearInterval(interval);
            display.innerText = "✨ " + finalTask + " ✨";
        }
    }, 50);
}

function exportTasks() {
    if (tasks.length === 0) {
        alert("No tasks to export.");
        return;
    }
    const textContent = tasks.join('\n');
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'tasks.txt';
    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importTasks(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const content = e.target.result;
        const importedTasks = content.split(/\r?\n/)
            .map(task => task.trim())
            .filter(task => task.length > 0);

        // Merge existing tasks with imported tasks and remove duplicates
        tasks = [...new Set([...importedTasks, ...tasks])];
        lastPickedIndex = null;
        localStorage.removeItem('lastIndex');
        saveAndRender();
        event.target.value = ""; // Reset file input so the same file can be imported again if needed
    };
    reader.readAsText(file);
}




saveAndRender();