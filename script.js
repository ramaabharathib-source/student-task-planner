const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priorityInput");
const taskList = document.getElementById("taskList");
const totalCount = document.getElementById("totalCount");
const doneCount = document.getElementById("doneCount");
const leftCount = document.getElementById("leftCount");
const filterButtons = document.querySelectorAll(".filter");

let tasks = JSON.parse(localStorage.getItem("studentTasks") || "[]");
let currentFilter = "all";

function saveTasks() {
  localStorage.setItem("studentTasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";
  const completed = tasks.filter(task => task.done).length;
  totalCount.textContent = tasks.length;
  doneCount.textContent = completed;
  leftCount.textContent = tasks.length - completed;

  const visibleTasks = tasks.filter(task => {
    if (currentFilter === "active") return !task.done;
    if (currentFilter === "done") return task.done;
    return true;
  });

  if (visibleTasks.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty";
    empty.textContent = tasks.length ? "No tasks in this filter." : "No tasks yet. Add your first task above!";
    taskList.appendChild(empty);
    return;
  }

  visibleTasks.forEach(task => {
    const row = document.createElement("article");
    row.className = `task ${task.done ? "completed" : ""}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.done;
    checkbox.setAttribute("aria-label", `Mark ${task.title} as complete`);
    checkbox.addEventListener("change", () => {
      task.done = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const title = document.createElement("span");
    title.className = "task-title";
    title.textContent = task.title;

    const priority = document.createElement("span");
    priority.className = `priority ${task.priority}`;
    priority.textContent = task.priority;

    const remove = document.createElement("button");
    remove.className = "delete";
    remove.textContent = "Delete";
    remove.addEventListener("click", () => {
      tasks = tasks.filter(item => item.id !== task.id);
      saveTasks();
      renderTasks();
    });

    row.append(checkbox, title, priority, remove);
    taskList.appendChild(row);
  });
}

taskForm.addEventListener("submit", event => {
  event.preventDefault();
  const title = taskInput.value.trim();
  if (!title) return;

  tasks.unshift({
    id: Date.now(),
    title,
    priority: priorityInput.value,
    done: false
  });
  saveTasks();
  taskForm.reset();
  taskInput.focus();
  renderTasks();
});

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach(item => item.classList.toggle("active", item === button));
    renderTasks();
  });
});

renderTasks();
