// Local Storage Key
const STORAGE_KEY = 'apex_expenses_data';

// Initial Data
let transactions = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [
  { id: 1, title: 'স্যালারি/আয়', amount: 2500, type: 'income', category: 'Salary' },
  { id: 2, title: 'বাজারের খরচ', amount: 150, type: 'expense', category: 'Food' }
];

// DOM Elements
const form = document.getElementById('transactionForm');
const titleInput = document.getElementById('title');
const amountInput = document.getElementById('amount');
const typeInput = document.getElementById('type');
const categoryInput = document.getElementById('category');

const totalIncomeEl = document.getElementById('totalIncome');
const totalExpenseEl = document.getElementById('totalExpense');
const netBalanceEl = document.getElementById('netBalance');
const transactionListEl = document.getElementById('transactionList');

const themeToggleBtn = document.getElementById('themeToggle');

// Initialize Icons
lucide.createIcons();

// Functions
function updateLocalStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
}

function calculateSummary() {
  const income = transactions
    .filter(item => item.type === 'income')
    .reduce((acc, item) => acc + item.amount, 0);

  const expense = transactions
    .filter(item => item.type === 'expense')
    .reduce((acc, item) => acc + item.amount, 0);

  const net = income - expense;

  totalIncomeEl.textContent = `$${income.toFixed(2)}`;
  totalExpenseEl.textContent = `$${expense.toFixed(2)}`;
  netBalanceEl.textContent = `$${net.toFixed(2)}`;
}

function renderList() {
  transactionListEl.innerHTML = '';

  if (transactions.length === 0) {
    transactionListEl.innerHTML = '<li style="color: var(--text-secondary); text-align: center; padding: 20px;">কোনো লেনদেন পাওয়া যায়নি।</li>';
    return;
  }

  transactions.forEach(item => {
    const li = document.createElement('li');
    li.className = 'transaction-item';

    const isIncome = item.type === 'income';
    
    li.innerHTML = `
      <div class="transaction-info">
        <h4>${item.title}</h4>
        <span>${item.category}</span>
      </div>
      <div style="display: flex; align-items: center;">
        <span class="transaction-amount ${isIncome ? 'amount-income' : 'amount-expense'}">
          ${isIncome ? '+' : '-'}$${item.amount.toFixed(2)}
        </span>
        <button class="btn-delete" onclick="deleteTransaction(${item.id})">
          <i data-lucide="trash-2"></i>
        </button>
      </div>
    `;

    transactionListEl.appendChild(li);
  });

  lucide.createIcons();
}

function addTransaction(e) {
  e.preventDefault();

  const newTransaction = {
    id: Date.now(),
    title: titleInput.value,
    amount: parseFloat(amountInput.value),
    type: typeInput.value,
    category: categoryInput.value
  };

  transactions.unshift(newTransaction);
  updateLocalStorage();
  updateUI();

  form.reset();
}

function deleteTransaction(id) {
  transactions = transactions.filter(item => item.id !== id);
  updateLocalStorage();
  updateUI();
}

function updateUI() {
  calculateSummary();
  renderList();
}

// Theme Toggle
themeToggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

// Event Listeners
form.addEventListener('submit', addTransaction);

// Initial App Render
updateUI();