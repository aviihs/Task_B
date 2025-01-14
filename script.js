document.addEventListener("DOMContentLoaded", () => {
  const tasks = document.querySelectorAll(".kanban-task");
  const columns = document.querySelectorAll(".kanban-tasks");
  const addButtons = document.querySelectorAll(".add-task-btn");
  
  let draggedTask = null;

  // Add new task to column
  function addTask(inputField, column) {
    const taskText = inputField.value.trim();
    if (taskText) {
      const newTask = document.createElement("div");
      newTask.classList.add("kanban-task");
      newTask.setAttribute("draggable", "true");
      newTask.innerHTML = `${taskText} <span class="remove-task-btn">&#128465;</span>`;
      column.appendChild(newTask);
      inputField.value = "";
      bindRemoveButton(newTask);
    }
  }

  // Remove task when button clicked
  function bindRemoveButton(task) {
    task.querySelector(".remove-task-btn").addEventListener("click", () => task.remove());
  }

  // Dragging functionality (Desktop and Mobile)
  tasks.forEach((task) => {
    bindRemoveButton(task);

    task.addEventListener("dragstart", () => {
      draggedTask = task;
      task.classList.add("dragging");
    });

    task.addEventListener("dragend", () => {
      draggedTask = null;
      task.classList.remove("dragging");
    });
  });

  // Handle drop on columns (Desktop)
  columns.forEach((column) => {
    column.addEventListener("dragover", (e) => e.preventDefault());
    column.addEventListener("drop", () => {
      if (draggedTask) column.appendChild(draggedTask);
    });
  });

  // Touch events for dragging (Mobile/Tablet)
  tasks.forEach((task) => {
    task.addEventListener("touchstart", (e) => {
      draggedTask = task;
      task.classList.add("dragging");
      e.preventDefault();
    });

    task.addEventListener("touchend", (e) => {
      const touchedColumn = document.elementFromPoint(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
      if (touchedColumn && touchedColumn.classList.contains("kanban-tasks")) {
        touchedColumn.appendChild(draggedTask);
      }
      draggedTask.classList.remove("dragging");
      draggedTask = null;
    });
  });

  // Add task via button or Enter key
  addButtons.forEach((button) => {
    const inputField = button.previousElementSibling;
    const column = button.closest(".kanban-column").querySelector(".kanban-tasks");

    button.addEventListener("click", () => addTask(inputField, column));
    inputField.addEventListener("keypress", (e) => {
      if (e.key === "Enter") addTask(inputField, column);
    });
  });
});