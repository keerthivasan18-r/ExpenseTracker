// Simple in-memory store for a single user and expenses
const appState = {
  user: null,
  expenses: [],
};

// DOM helpers
const qs = (selector) => document.querySelector(selector);

// Sections
const authSection = qs("#auth-section");
const dashboardSection = qs("#dashboard-section");

// Auth elements
const loginTabBtn = qs("#login-tab-btn");
const signupTabBtn = qs("#signup-tab-btn");
const loginForm = qs("#login-form");
const signupForm = qs("#signup-form");
const goToSignupBtn = qs("#go-to-signup");
const goToLoginBtn = qs("#go-to-login");
const loginMsg = qs("#login-message");
const signupMsg = qs("#signup-message");

// Dashboard elements
const logoutBtn = qs("#logout-btn");
const userNameEl = qs("#user-name");
const userCollegeEl = qs("#user-college");
const userInitialEl = qs("#user-initial");

const summaryBudgetEl = qs("#summary-budget");
const summarySpentEl = qs("#summary-spent");
const summaryRemainingEl = qs("#summary-remaining");
const progressBarInner = qs("#progress-bar-inner");
const progressPercentEl = qs("#progress-percent");
const budgetAlertEl = qs("#budget-alert");

const expenseForm = qs("#expense-form");
const expenseTableBody = qs("#expense-table-body");
const expenseMsg = qs("#expense-message");

// Budget and stats elements
const budgetForm = qs("#budget-form");
const budgetInputEl = qs("#budget-input");
const budgetMsgEl = qs("#budget-message");
const statsContainer = qs("#category-stats");

// Pie chart canvas
const pieCanvas = document.getElementById("category-pie");
const pieCtx = pieCanvas ? pieCanvas.getContext("2d") : null;
const pieTooltip = qs("#pie-tooltip");

// AI helper elements
const aiDescriptionEl = qs("#ai-description");
const aiFillBtn = qs("#ai-fill-btn");

// Simple incremental id for expenses
let nextExpenseId = 1;
let pieSegments = [];

// Utility: format number as rupees string
function formatRupees(value) {
  const num = Number(value) || 0;
  return `₹${num.toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;
}

// Toggle between login and signup tabs
function switchAuthTab(tab) {
  if (tab === "login") {
    loginTabBtn.classList.add("auth-tab-active");
    signupTabBtn.classList.remove("auth-tab-active");
    loginForm.classList.add("auth-form-active");
    signupForm.classList.remove("auth-form-active");
    loginMsg.textContent = "";
  } else {
    signupTabBtn.classList.add("auth-tab-active");
    loginTabBtn.classList.remove("auth-tab-active");
    signupForm.classList.add("auth-form-active");
    loginForm.classList.remove("auth-form-active");
    signupMsg.textContent = "";
  }
}

// Navigate to dashboard
function goToDashboard() {
  authSection.classList.add("hidden");
  dashboardSection.classList.remove("hidden");
  updateUserHeader();
  updateSummary();
  renderExpenses();
}

// Navigate back to auth
function goToAuth() {
  dashboardSection.classList.add("hidden");
  authSection.classList.remove("hidden");
  appState.user = null;
  appState.expenses = [];
  loginForm.reset();
  signupForm.reset();
  expenseForm.reset();
  expenseMsg.textContent = "";
  loginMsg.textContent = "";
  signupMsg.textContent = "";
}

// Update header with user info
function updateUserHeader() {
  if (!appState.user) return;
  userNameEl.textContent = appState.user.name;
  userCollegeEl.textContent = appState.user.college;
  userInitialEl.textContent = (appState.user.name || "?").charAt(0).toUpperCase();
}

// Update summary cards & progress bar
function updateSummary() {
  if (!appState.user) return;
  const budget = Number(appState.user.monthlyBudget) || 0;
  const spent = appState.expenses.reduce((sum, e) => sum + e.amount, 0);
  const remaining = Math.max(budget - spent, 0);

  summaryBudgetEl.textContent = formatRupees(budget);
  summarySpentEl.textContent = formatRupees(spent);
  summaryRemainingEl.textContent = formatRupees(remaining);

  const percent = budget > 0 ? Math.min(Math.round((spent / budget) * 100), 200) : 0;
  progressPercentEl.textContent =
    budget === 0 ? "Set a budget to get started" : `${percent}% used`;
  progressBarInner.style.width = `${Math.min(percent, 100)}%`;

  if (budgetAlertEl) {
    if (budget > 0 && spent > budget) {
      const over = spent - budget;
      budgetAlertEl.textContent = `You have crossed your monthly budget by ${formatRupees(
        over
      )}. Try to slow down a bit this week.`;
    } else {
      budgetAlertEl.textContent = "";
    }
  }
}

// Build simple category-wise statistics
function updateCategoryStats() {
  if (!statsContainer) return;
  statsContainer.innerHTML = "";

  if (appState.expenses.length === 0) {
    clearPie();
    const p = document.createElement("p");
    p.className = "small-text text-muted";
    p.textContent = "Add a few expenses to see a visual breakdown here.";
    statsContainer.appendChild(p);
    return;
  }

  const totals = {};
  appState.expenses.forEach((e) => {
    totals[e.category] = (totals[e.category] || 0) + e.amount;
  });

  const max = Math.max(...Object.values(totals));

  Object.entries(totals).forEach(([category, total]) => {
    const row = document.createElement("div");
    row.className = "stat-row";

    const header = document.createElement("div");
    header.className = "stat-header";
    const label = document.createElement("span");
    label.textContent = category;
    const value = document.createElement("span");
    value.textContent = formatRupees(total);
    header.appendChild(label);
    header.appendChild(value);

    const barOuter = document.createElement("div");
    barOuter.className = "stat-bar-outer";
    const barInner = document.createElement("div");
    barInner.className = "stat-bar-inner";
    const widthPercent = max > 0 ? Math.round((total / max) * 100) : 0;
    barInner.style.width = `${widthPercent}%`;
    barOuter.appendChild(barInner);

    row.appendChild(header);
    row.appendChild(barOuter);
    statsContainer.appendChild(row);
  });

  // Draw pie chart near budget progress
  drawCategoryPie(totals);
}

function clearPie() {
  if (!pieCtx || !pieCanvas) return;
  pieCtx.clearRect(0, 0, pieCanvas.width, pieCanvas.height);
  pieSegments = [];
}

function drawCategoryPie(totals) {
  if (!pieCtx || !pieCanvas) return;
  clearPie();

  const totalAmount = Object.values(totals).reduce((sum, v) => sum + v, 0);
  if (totalAmount <= 0) return;

  const colors = {
    Food: "#facc15",
    Travel: "#60a5fa",
    Fees: "#a5b4fc",
    Fun: "#f472b6",
    Others: "#22d3ee",
  };

  const centerX = pieCanvas.width / 2;
  const centerY = pieCanvas.height / 2;
  const radius = Math.min(centerX, centerY) - 10;

  let startAngle = -Math.PI / 2;

  Object.entries(totals).forEach(([category, value]) => {
    const sliceAngle = (value / totalAmount) * Math.PI * 2;
    const endAngle = startAngle + sliceAngle;

    pieCtx.beginPath();
    pieCtx.moveTo(centerX, centerY);
    pieCtx.arc(centerX, centerY, radius, startAngle, endAngle);
    pieCtx.closePath();
    pieCtx.fillStyle = colors[category] || "#6b7280";
    pieCtx.fill();

    pieSegments.push({
      category,
      value,
      startAngle,
      endAngle,
      centerX,
      centerY,
      radius,
    });

    startAngle = endAngle;
  });
}

function handlePieHover(event) {
  if (!pieCanvas || !pieTooltip || pieSegments.length === 0) return;

  const rect = pieCanvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const { centerX, centerY, radius } = pieSegments[0];
  const dx = x - centerX;
  const dy = y - centerY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  if (distance > radius) {
    pieTooltip.classList.add("hidden");
    return;
  }

  let angle = Math.atan2(dy, dx);
  if (angle < -Math.PI / 2) {
    angle += Math.PI * 2;
  }

  const segment = pieSegments.find(
    (s) => angle >= s.startAngle && angle <= s.endAngle
  );

  if (!segment) {
    pieTooltip.classList.add("hidden");
    return;
  }

  const totalAmount = pieSegments.reduce((sum, s) => sum + s.value, 0);
  const percent =
    totalAmount > 0 ? Math.round((segment.value / totalAmount) * 100) : 0;

  pieTooltip.textContent = `${segment.category}: ${formatRupees(
    segment.value
  )} (${percent}%)`;
  pieTooltip.style.left = `${x + rect.left - pieCanvas.getBoundingClientRect().left}px`;
  pieTooltip.style.top = `${y + rect.top - pieCanvas.getBoundingClientRect().top}px`;
  pieTooltip.classList.remove("hidden");
}

if (pieCanvas) {
  pieCanvas.addEventListener("mousemove", handlePieHover);
  pieCanvas.addEventListener("mouseleave", () => {
    if (pieTooltip) {
      pieTooltip.classList.add("hidden");
    }
  });
}

// Render expenses in table
function renderExpenses() {
  expenseTableBody.innerHTML = "";
  if (appState.expenses.length === 0) {
    const row = document.createElement("tr");
    row.className = "empty-row";
    const cell = document.createElement("td");
    cell.colSpan = 5;
    cell.textContent =
      "No expenses yet. Start by logging your first chai or bus ride.";
    row.appendChild(cell);
    expenseTableBody.appendChild(row);
    return;
  }

  appState.expenses
    .slice()
    .reverse()
    .forEach((expense) => {
      const row = document.createElement("tr");
      row.dataset.expenseId = String(expense.id);

      const titleTd = document.createElement("td");
      titleTd.textContent = expense.title;

      const categoryTd = document.createElement("td");
      const catSpan = document.createElement("span");
      catSpan.className = `category-pill category-${expense.category}`;
      catSpan.textContent = expense.category;
      categoryTd.appendChild(catSpan);

      const amountTd = document.createElement("td");
      amountTd.textContent = formatRupees(expense.amount);

      const dateTd = document.createElement("td");
      dateTd.textContent = expense.date;

      const actionTd = document.createElement("td");
      const delBtn = document.createElement("button");
      delBtn.textContent = "Delete";
      delBtn.className = "delete-btn";
      delBtn.setAttribute("type", "button");
      delBtn.dataset.expenseId = String(expense.id);
      actionTd.appendChild(delBtn);

      row.appendChild(titleTd);
      row.appendChild(categoryTd);
      row.appendChild(amountTd);
      row.appendChild(dateTd);
      row.appendChild(actionTd);

      expenseTableBody.appendChild(row);
    });

  updateCategoryStats();
}

// Handle sign up
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();
  signupMsg.textContent = "";
  signupMsg.className = "form-message";

  const name = qs("#signup-name").value.trim();
  const college = qs("#signup-college").value.trim();
  const email = qs("#signup-email").value.trim().toLowerCase();
  const password = qs("#signup-password").value;
  const confirmPassword = qs("#signup-confirm-password").value;

  if (password !== confirmPassword) {
    signupMsg.textContent = "Passwords do not match. Please re-check.";
    signupMsg.classList.add("error");
    return;
  }

  if (!email || !password || !name || !college) {
    signupMsg.textContent = "Please fill in all required details.";
    signupMsg.classList.add("error");
    return;
  }

  // For this student project, we keep just one user in memory
  appState.user = {
    name,
    college,
    email,
    password,
    monthlyBudget: 0,
  };
  appState.expenses = [];

  signupMsg.textContent = "Account created! Redirecting to your dashboard...";
  signupMsg.classList.add("success");

  setTimeout(() => {
    goToDashboard();
  }, 600);
});

// Handle login
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  loginMsg.textContent = "";
  loginMsg.className = "form-message";

  const email = qs("#login-email").value.trim().toLowerCase();
  const password = qs("#login-password").value;

  if (!appState.user || appState.user.email !== email) {
    loginMsg.textContent = "No account found. Please sign up first.";
    loginMsg.classList.add("error");
    return;
  }

  if (appState.user.password !== password) {
    loginMsg.textContent = "Incorrect password. Please try again.";
    loginMsg.classList.add("error");
    return;
  }

  loginMsg.textContent = "Login successful! Taking you to your dashboard...";
  loginMsg.classList.add("success");

  setTimeout(() => {
    goToDashboard();
  }, 500);
});

// Handle logout
logoutBtn.addEventListener("click", () => {
  goToAuth();
});

// Handle expense addition
expenseForm.addEventListener("submit", (e) => {
  e.preventDefault();
  expenseMsg.textContent = "";
  expenseMsg.className = "form-message";

  if (!appState.user) {
    expenseMsg.textContent = "Please log in again to add expenses.";
    expenseMsg.classList.add("error");
    return;
  }

  const title = qs("#expense-title").value.trim();
  const category = qs("#expense-category").value;
  const amountValue = qs("#expense-amount").value;
  const dateValue = qs("#expense-date").value;

  const amount = Number(amountValue);
  if (!title || !category || !amountValue || !dateValue || Number.isNaN(amount)) {
    expenseMsg.textContent = "Please fill in all fields with valid values.";
    expenseMsg.classList.add("error");
    return;
  }

  appState.expenses.push({
    id: nextExpenseId++,
    title,
    category,
    amount,
    date: dateValue,
  });

  expenseForm.reset();
  expenseMsg.textContent = "Expense added!";
  expenseMsg.classList.add("success");

  updateSummary();
  renderExpenses();
});

// Delete expense from table (event delegation)
expenseTableBody.addEventListener("click", (e) => {
  const target = e.target;
  if (!(target instanceof HTMLElement)) return;
  const btn = target.closest(".delete-btn");
  if (!btn) return;

  const idStr = btn.dataset.expenseId;
  if (!idStr) return;
  const idNum = Number(idStr);

  appState.expenses = appState.expenses.filter((exp) => exp.id !== idNum);
  updateSummary();
  renderExpenses();
});

// Handle budget changes on dashboard
if (budgetForm) {
  budgetForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!appState.user) {
      budgetMsgEl.textContent = "Login or sign up to set your monthly budget.";
      budgetMsgEl.className = "form-message small-text error";
      return;
    }

    budgetMsgEl.textContent = "";
    budgetMsgEl.className = "form-message small-text";

    const value = budgetInputEl.value;
    const num = Number(value);
    if (!value || Number.isNaN(num) || num < 0) {
      budgetMsgEl.textContent = "Please enter a valid budget in ₹ (0 or more).";
      budgetMsgEl.classList.add("error");
      return;
    }

    appState.user.monthlyBudget = num;
    updateSummary();
    budgetMsgEl.textContent = "Monthly budget updated!";
    budgetMsgEl.classList.add("success");
  });
}

// Basic AI-style helper: parse description and pre-fill expense form
function guessCategoryFromText(text) {
  const t = text.toLowerCase();
  if (t.includes("chai") || t.includes("snack") || t.includes("food") || t.includes("lunch") || t.includes("dinner")) {
    return "Food";
  }
  if (
    t.includes("bus") ||
    t.includes("auto") ||
    t.includes("train") ||
    t.includes("cab") ||
    t.includes("uber") ||
    t.includes("ola") ||
    t.includes("travel")
  ) {
    return "Travel";
  }
  if (t.includes("fee") || t.includes("tuition") || t.includes("exam") || t.includes("college fee")) {
    return "Fees";
  }
  if (
    t.includes("movie") ||
    t.includes("netflix") ||
    t.includes("party") ||
    t.includes("game") ||
    t.includes("games") ||
    t.includes("hangout")
  ) {
    return "Fun";
  }
  return "Others";
}

function extractFirstAmount(text) {
  const matches = text.match(/(\d+(\.\d+)?)/g);
  if (!matches || matches.length === 0) return null;
  return Number(matches[0]);
}

function buildTitleFromText(text) {
  const clean = text.trim();
  if (!clean) return "";
  const words = clean.split(/\s+/).slice(0, 6);
  let title = words.join(" ");
  if (title.length > 40) {
    title = `${title.slice(0, 37)}...`;
  }
  return title.charAt(0).toUpperCase() + title.slice(1);
}

if (aiFillBtn && aiDescriptionEl) {
  aiFillBtn.addEventListener("click", () => {
    const description = aiDescriptionEl.value.trim();
    expenseMsg.textContent = "";
    expenseMsg.className = "form-message";

    if (!description) {
      expenseMsg.textContent = "Type a short description of your expense first.";
      expenseMsg.classList.add("error");
      return;
    }

    const amount = extractFirstAmount(description);
    const category = guessCategoryFromText(description);
    const title = buildTitleFromText(description);

    if (title) {
      qs("#expense-title").value = title;
    }
    if (category) {
      qs("#expense-category").value = category;
    }
    if (amount !== null && !Number.isNaN(amount)) {
      qs("#expense-amount").value = amount;
    }
    const dateInput = qs("#expense-date");
    if (dateInput && !dateInput.value) {
      const today = new Date().toISOString().slice(0, 10);
      dateInput.value = today;
    }

    expenseMsg.textContent =
      "We guessed the title, category and amount for you. Review once and click Add Expense.";
    expenseMsg.classList.add("success");
  });
}

// Tab switching events
loginTabBtn.addEventListener("click", () => switchAuthTab("login"));
signupTabBtn.addEventListener("click", () => switchAuthTab("signup"));
goToSignupBtn.addEventListener("click", () => switchAuthTab("signup"));
goToLoginBtn.addEventListener("click", () => switchAuthTab("login"));

// Initial state
switchAuthTab("signup");


