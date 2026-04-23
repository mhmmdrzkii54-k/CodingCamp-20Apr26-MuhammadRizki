// ── State ────────────────────────────────────────────────────────────────────
let timerSeconds = 1500;
let timerInterval = null;
let savedName = localStorage.getItem("username");

// ── Greeting & Clock ─────────────────────────────────────────────────────────
function updateGreeting() {
  const hour = new Date().getHours();
  let greet = "";

  if (hour >= 5 && hour < 12)       greet = "Good Morning";
  else if (hour >= 12 && hour < 15) greet = "Good Afternoon";
  else if (hour >= 15 && hour < 19) greet = "Good Evening";
  else                               greet = "Good Night";

  document.getElementById("greeting").textContent = greet;

  const customGreeting = document.getElementById("customGreeting");
  customGreeting.textContent = savedName ? `${greet}, ${savedName} ` : "";
}

function updateDateTime() {
  const now = new Date();

  document.getElementById("time").textContent =
    now.toLocaleTimeString("en-US", { hour12: false });

  document.getElementById("date").textContent =
    now.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric"
    });

  updateGreeting();
}

setInterval(updateDateTime, 1000);
updateDateTime();

// ── Focus Timer ───────────────────────────────────────────────────────────────
function renderTimer() {
  const min = Math.floor(timerSeconds / 60);
  const sec = timerSeconds % 60;
  document.getElementById("timer").textContent =
    `${min}:${sec < 10 ? "0" : ""}${sec}`;
}

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (timerSeconds > 0) {
      timerSeconds--;
      renderTimer();
    } else {
      clearInterval(timerInterval);
    }
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
}

function resetTimer() {
  clearInterval(timerInterval);
  timerSeconds = 1500;
  renderTimer();
}

function setCustomTimer() {
  const input = document.getElementById("customMinutes");
  const minutes = parseInt(input.value);
  if (!minutes || minutes < 1) return;
  clearInterval(timerInterval);
  timerSeconds = minutes * 60;
  renderTimer();
  input.value = "";
}

renderTimer();

// ── Tasks ─────────────────────────────────────────────────────────────────────
function addTask() {
  const input = document.getElementById("taskInput");
  const task = input.value.trim();
  if (!task) return;

  const li = document.createElement("li");
  li.innerHTML = `
    <div class="task-left">
      <input type="checkbox" onclick="toggleDone(this)">
      <span onclick="editTask(this)">${task}</span>
    </div>
    <button class="delete-task" onclick="deleteTask(this)">Delete</button>
  `;

  document.getElementById("taskList").appendChild(li);
  input.value = "";
}

function editTask(span) {
  const newTask = prompt("Edit task:", span.textContent);
  if (newTask !== null && newTask.trim() !== "") {
    span.textContent = newTask.trim();
  }
}

function deleteTask(button) {
  button.parentElement.remove();
}

function toggleDone(checkbox) {
  checkbox.closest("li").classList.toggle("done");
}

// ── Quick Links ───────────────────────────────────────────────────────────────
function addLink() {
  const name = document.getElementById("linkName").value.trim();
  const url  = document.getElementById("linkURL").value.trim();
  if (!name || !url) return;

  const linkBox = document.createElement("div");
  linkBox.className = "link-box";
  linkBox.innerHTML = `
    <a href="${url}" target="_blank">${name}</a>
    <span class="delete-link" onclick="this.parentElement.remove()">×</span>
  `;

  document.getElementById("links").appendChild(linkBox);
  document.getElementById("linkName").value = "";
  document.getElementById("linkURL").value  = "";
}

// ── Dark Mode ─────────────────────────────────────────────────────────────────
const toggle = document.getElementById("theme-toggle");

if (localStorage.getItem("theme") === "dark") {
  document.body.classList.add("dark");
  toggle.textContent = "Light Mode";
}

toggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
  toggle.textContent = isDark ? "Light Mode" : "Dark Mode";
});

// ── Save Name ─────────────────────────────────────────────────────────────────
document.getElementById("saveNameBtn").addEventListener("click", () => {
  const input = document.getElementById("nameInput");
  const name  = input.value.trim();
  if (!name) return;

  localStorage.setItem("username", name);
  savedName = name;
  updateGreeting();
  input.value = "";
});
