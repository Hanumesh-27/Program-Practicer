// ------------------------
// Local Storage Functions
// ------------------------
function getProblems() {
  return JSON.parse(localStorage.getItem('problems') || '[]');
}

function saveProblems(problems) {
  localStorage.setItem('problems', JSON.stringify(problems));
}

// ------------------------
// DOM Elements
// ------------------------
const titleField = document.getElementById('title');
const topicField = document.getElementById('topic');
const diffField = document.getElementById('difficulty');
const codeArea = document.getElementById('codeSnippet');
const outputArea = document.getElementById('outputArea');
const searchField = document.getElementById('search');
const addBtn = document.getElementById('addBtn');

let editId = null;

// ------------------------
// Render Problems
// ------------------------
function renderProblems(list) {
  if (!list.length) {
    outputArea.innerHTML = "<p>No problems found!</p>";
    return;
  }

  outputArea.innerHTML = list.map(p => `
    <div class="problem-item">
      <p><b>Title:</b> ${p.title}</p>
      <p><b>Topic:</b> ${p.topic}</p>
      <p><b>Difficulty:</b> ${p.difficulty}</p>
      <p><b>Date:</b> ${new Date(p.date).toLocaleString()}</p>
      <pre>${p.code}</pre>
      <button class="editBtn" data-id="${p.id}">✏ Edit</button>
      <button class="deleteBtn" data-id="${p.id}">🗑 Delete</button>
    </div>
  `).join('');

  document.querySelectorAll('.deleteBtn').forEach(btn =>
    btn.addEventListener('click', () => deleteProblem(btn.dataset.id))
  );

  document.querySelectorAll('.editBtn').forEach(btn =>
    btn.addEventListener('click', () => startEdit(btn.dataset.id))
  );
}

// ------------------------
// Add / Update Problem
// ------------------------
addBtn.addEventListener('click', () => {
  const title = titleField.value.trim();
  const topic = topicField.value.trim();
  const difficulty = diffField.value.trim();
  const code = codeArea.value.trim();

  if (!title || !topic || !difficulty || !code) {
    alert('⚠ Please fill all fields!');
    return;
  }

  const problems = getProblems();

  if (editId) {
    // Update
    const index = problems.findIndex(p => p.id === editId);
    if (index !== -1) {
      problems[index] = { ...problems[index], title, topic, difficulty, code };
      saveProblems(problems);
      alert('✅ Problem updated!');
      editId = null;
      addBtn.textContent = "Add Problem";
    }
  } else {
    // Add new
    const newProblem = {
      id: Date.now().toString(),
      title,
      topic,
      difficulty,
      code,
      date: new Date().toISOString()
    };
    problems.push(newProblem);
    saveProblems(problems);
    alert('✅ Problem added successfully!');
  }

  titleField.value = topicField.value = diffField.value = codeArea.value = '';
  renderProblems(getProblems());
});

// ------------------------
// Delete Problem
// ------------------------
function deleteProblem(id) {
  if (!confirm('Are you sure you want to delete this problem?')) return;
  const problems = getProblems().filter(p => p.id !== id);
  saveProblems(problems);
  renderProblems(problems);
  alert('🗑 Problem deleted.');
}

// ------------------------
// Edit Problem
// ------------------------
function startEdit(id) {
  const problem = getProblems().find(p => p.id === id);
  if (!problem) return;
  titleField.value = problem.title;
  topicField.value = problem.topic;
  diffField.value = problem.difficulty;
  codeArea.value = problem.code;
  editId = id;
  addBtn.textContent = "Update Problem";
}

// ------------------------
// Search Problems
// ------------------------
document.getElementById('searchTopicBtn').addEventListener('click', () => {
  const keyword = searchField.value.trim().toLowerCase();
  if (!keyword) return alert('Enter a topic');
  const filtered = getProblems().filter(p => p.topic.toLowerCase().includes(keyword));
  renderProblems(filtered);
});

document.getElementById('searchDiffBtn').addEventListener('click', () => {
  const keyword = searchField.value.trim().toLowerCase();
  if (!keyword) return alert('Enter a difficulty');
  const filtered = getProblems().filter(p => p.difficulty.toLowerCase().includes(keyword));
  renderProblems(filtered);
});

document.getElementById('viewAllBtn').addEventListener('click', () => renderProblems(getProblems()));

// ------------------------
// Sort Problems
// ------------------------
document.getElementById('sortDateBtn').addEventListener('click', () => {
  const sorted = getProblems().sort((a, b) => new Date(b.date) - new Date(a.date));
  renderProblems(sorted);
});

document.getElementById('sortDiffBtn').addEventListener('click', () => {
  const order = { easy: 1, medium: 2, hard: 3 };
  const sorted = getProblems().sort((a, b) =>
    (order[a.difficulty.toLowerCase()] || 4) - (order[b.difficulty.toLowerCase()] || 4)
  );
  renderProblems(sorted);
});

// ------------------------
// Initial Load
// ------------------------
renderProblems(getProblems());
