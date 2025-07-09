// ==================================================
// Supabase এবং অন্যান্য লাইব্রেরি ইম্পোর্ট
// ==================================================
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// ==================================================
// Supabase ক্লায়েন্ট ইনিশিয়ালাইজেশন
// ==================================================
const supabaseUrl = "https://wurfwhijekfehgvsamsx.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1cmZ3aGlqZWtmZWhndnNhbXN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE5NTIxNjMsImV4cCI6MjA2NzUyODE2M30.WINhgSiyoWLjTeDuj1rHDt-BDzvsUT88ktKerIRfG_I";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ==================================================
// গ্লোবাল স্টেট (State) এবং চার্ট ভেরিয়েবল
// ==================================================
let currentUser = null;
let allTransactions = [], allCategories = [], allBudgets = [], allGoals = [], allDebts = [], allAccounts = [], allTags = [], allRecurring = [], allAssets = [], allTransactionTags = [], allTransfers = [];
let charts = {}; // সকল চার্ট অবজেক্ট এখানে থাকবে

// ==================================================
// DOM এলিমেন্ট নির্বাচন
// ==================================================
const htmlEl = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const addTransactionFab = document.getElementById('add-transaction-fab');
const toastContainer = document.getElementById('toast-container');
const tabs = document.querySelector('.tabs');
const tabContents = document.querySelectorAll('.tab-content');

// হেডার এবং প্রোফাইল
const profileDropdownContainer = document.getElementById('profile-dropdown-container');
const profileBtn = document.getElementById('profile-btn');
const profileDropdownContent = document.getElementById('profile-dropdown-content');
const userEmailDisplay = document.getElementById('user-email-display');
const loginHistoryBtn = document.getElementById('login-history-btn');
const deleteAccountBtn = document.getElementById('delete-account-btn');
const logoutBtn = document.getElementById('logout-btn');

// ড্যাশবোর্ড
const summaryIncomeEl = document.querySelector('#summary .income p');
const summaryExpenseEl = document.querySelector('#summary .expense p');
const summaryBalanceEl = document.querySelector('#summary .balance p');

// লেনদেন ট্যাব
const transactionsTableBody = document.getElementById('transactions-table-body');
const searchInput = document.getElementById('searchInput');
const typeFilter = document.getElementById('typeFilter');
const startDateFilter = document.getElementById('startDateFilter');
const endDateFilter = document.getElementById('endDateFilter');
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');

// অ্যাকাউন্ট ট্যাব
const accountGridEl = document.getElementById('account-grid');
const addAccountBtn = document.getElementById('add-account-btn');
const addTransferBtn = document.getElementById('add-transfer-btn');

// সম্পদ ট্যাব
const assetGridEl = document.getElementById('asset-grid');
const addAssetBtn = document.getElementById('add-asset-btn');

// দেনা-পাওনা ট্যাব
const debtsTableBody = document.getElementById('debts-table-body');
const addDebtBtn = document.getElementById('add-debt-btn');

// ক্যাটাগরি ও ট্যাগ ট্যাব
const categoriesTableBody = document.getElementById('categories-table-body');
const addCategoryBtn = document.getElementById('add-category-btn');
const tagsTableBody = document.getElementById('tags-table-body');
const addTagBtn = document.getElementById('add-tag-btn');

// বাজেট ট্যাব
const budgetListEl = document.getElementById('budget-list');
const addBudgetBtn = document.getElementById('add-budget-btn');

// সঞ্চয় লক্ষ্য ট্যাব
const goalListEl = document.getElementById('goal-list');
const addGoalBtn = document.getElementById('add-goal-btn');

// রিকারিং ট্যাব
const recurringTableBody = document.getElementById('recurring-table-body');
const addRecurringBtn = document.getElementById('add-recurring-btn');

// সেটিংস ট্যাব
const backupDataBtn = document.getElementById('backup-data-btn');
const restoreDataBtn = document.getElementById('restore-data-btn');
const finalDeleteAccountBtn = document.getElementById('final-delete-account-btn');

// ...আগের কোড...
const finalDeleteAccountBtn = document.getElementById('final-delete-account-btn');

const securityPinBtn = document.getElementById('security-pin-btn'); // <<-- নতুন কোড
const twoFactorBtn = document.getElementById('two-factor-btn');     // <<-- নতুন কোড

//
// সকল মডাল এবং ফর্ম
//
const transactionModal = document.getElementById('transaction-modal');
const transactionForm = document.getElementById('transaction-form');
// ... পরের কোড ...

// সকল মডাল এবং ফর্ম
const transactionModal = document.getElementById('transaction-modal');
const transactionForm = document.getElementById('transaction-form');
const accountModal = document.getElementById('account-modal');
const accountForm = document.getElementById('account-form');
const assetModal = document.getElementById('asset-modal');
const assetForm = document.getElementById('asset-form');
const transferModal = document.getElementById('transfer-modal');
const transferForm = document.getElementById('transfer-form');
const debtModal = document.getElementById('debt-modal');
const debtForm = document.getElementById('debt-form');
const categoryModal = document.getElementById('category-modal');
const categoryForm = document.getElementById('category-form');
const tagModal = document.getElementById('tag-modal');
const tagForm = document.getElementById('tag-form');
const budgetModal = document.getElementById('budget-modal');
const budgetForm = document.getElementById('budget-form');
const goalModal = document.getElementById('goal-modal');
const goalForm = document.getElementById('goal-form');
const recurringModal = document.getElementById('recurring-modal');
const recurringForm = document.getElementById('recurring-form');
const confirmDialog = document.getElementById('confirm-dialog');
const loginHistoryModal = document.getElementById('login-history-modal');
const loginHistoryTableBody = document.getElementById('login-history-table-body');


// ==================================================
// হেল্পার ফাংশন (Helper Functions)
// ==================================================
const formatCurrency = (amount) => `৳ ${amount.toLocaleString('bn-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('bn-BD', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
};

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    toastContainer.appendChild(toast);
    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 3000);
    }, 4000);
}

function showConfirm(message) {
    return new Promise((resolve) => {
        document.getElementById('confirm-msg').textContent = message;
        confirmDialog.showModal();
        document.getElementById('confirm-ok-btn').onclick = () => {
            confirmDialog.close();
            resolve(true);
        };
        document.getElementById('confirm-cancel-btn').onclick = () => {
            confirmDialog.close();
            resolve(false);
        };
    });
}

// ==================================================
// থিম, ট্যাব এবং প্রোফাইল ড্রপডাউন ম্যানেজমেন্ট
// ==================================================
function applyTheme(theme) {
    htmlEl.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    themeToggle.checked = theme === 'light';
}

tabs.addEventListener('click', (e) => {
    const target = e.target.closest('.tab-link');
    if (!target) return;

    document.querySelectorAll('.tab-link').forEach(tab => tab.classList.remove('active'));
    target.classList.add('active');

    tabContents.forEach(content => content.classList.remove('active'));
    document.getElementById(target.dataset.tab).classList.add('active');
});

profileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    profileDropdownContainer.classList.toggle('active');
});

document.addEventListener('click', (e) => {
    if (!profileDropdownContainer.contains(e.target)) {
        profileDropdownContainer.classList.remove('active');
    }
});


// ==================================================
// ডেটা রেন্ডারিং ফাংশন (UI Update)
// ==================================================
function renderAll() {
    renderSummary();
    renderTransactions();
    renderAccounts();
    renderAssets();
    renderDebts();
    renderBudgets();
    renderGoals();
    renderRecurring();
    renderCategories();
    renderTags();

    // সকল চার্ট রেন্ডার
    renderIncomeExpenseChart();
    renderAccountBalanceChart();
    renderAssetAllocationChart();
    renderDebtStatusChart();
    renderBudgetVsSpentChart();
    renderGoalProgressChart();
}

// ড্যাশবোর্ড সারাংশ আপডেট
function renderSummary() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyIncome = allTransactions
        .filter(t => t.type === 'income' && new Date(t.transaction_date).getMonth() === currentMonth && new Date(t.transaction_date).getFullYear() === currentYear)
        .reduce((sum, t) => sum + t.amount, 0);

    const monthlyExpense = allTransactions
        .filter(t => t.type === 'expense' && new Date(t.transaction_date).getMonth() === currentMonth && new Date(t.transaction_date).getFullYear() === currentYear)
        .reduce((sum, t) => sum + t.amount, 0);
    
    const totalBalance = allAccounts.reduce((sum, acc) => sum + acc.balance, 0);

    summaryIncomeEl.textContent = formatCurrency(monthlyIncome);
    summaryExpenseEl.textContent = formatCurrency(monthlyExpense);
    summaryBalanceEl.textContent = formatCurrency(totalBalance);
}

// লেনদেনের তালিকা রেন্ডার
function renderTransactions() {
    transactionsTableBody.innerHTML = '';
    const searchTerm = searchInput.value.toLowerCase();
    const filterType = typeFilter.value;
    const startDate = startDateFilter.value ? new Date(startDateFilter.value) : null;
    const endDate = endDateFilter.value ? new Date(endDateFilter.value) : null;
    if(startDate) startDate.setHours(0,0,0,0);
    if(endDate) endDate.setHours(23,59,59,999);


    const filtered = allTransactions.filter(t => {
        const transactionDate = new Date(t.transaction_date);
        const descriptionMatch = t.description.toLowerCase().includes(searchTerm);
        const tagMatch = t.Tags.some(tag => tag.name.toLowerCase().includes(searchTerm));
        const typeMatch = filterType === 'all' || t.type === filterType;
        const startDateMatch = !startDate || transactionDate >= startDate;
        const endDateMatch = !endDate || transactionDate <= endDate;
        return (descriptionMatch || tagMatch) && typeMatch && startDateMatch && endDateMatch;
    });

    if (filtered.length === 0) {
        transactionsTableBody.innerHTML = `<tr><td colspan="7" class="placeholder-cell">কোনো হিসাব পাওয়া যায়নি।</td></tr>`;
        return;
    }

    filtered.sort((a, b) => new Date(b.transaction_date) - new Date(a.transaction_date));
    filtered.forEach(t => {
        const row = document.createElement('tr');
        row.dataset.id = t.id;
        
        const tagsHtml = t.Tags.map(tag => `<span class="tag-badge">${tag.name}</span>`).join('');

        row.innerHTML = `
            <td>
                ${t.description}
                ${t.receipt_url ? `<a href="${t.receipt_url}" target="_blank" class="receipt-link"><i class="fa-solid fa-receipt"></i></a>` : ''}
                <div class="tags-container">${tagsHtml}</div>
            </td>
            <td>${t.Accounts?.name || 'N/A'}</td>
            <td>${t.Categories?.name || 'N/A'}</td>
            <td class="${t.type}-text">${t.type === 'income' ? 'আয়' : 'ব্যয়'}</td>
            <td>${formatCurrency(t.amount)}</td>
            <td>${formatDate(t.transaction_date)}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit-btn" data-type="transaction" data-id="${t.id}"><i class="fa-solid fa-pencil"></i></button>
                    <button class="action-btn delete-btn" data-type="transaction" data-id="${t.id}"><i class="fa-solid fa-trash-can"></i></button>
                </div>
            </td>
        `;
        transactionsTableBody.appendChild(row);
    });
}

// অ্যাকাউন্ট তালিকা রেন্ডার
function renderAccounts() {
    accountGridEl.innerHTML = '';
    if (allAccounts.length === 0) {
        accountGridEl.innerHTML = `<p class="placeholder-cell">কোনো অ্যাকাউন্ট পাওয়া যায়নি।</p>`;
        return;
    }
    allAccounts.forEach(acc => {
        const card = document.createElement('div');
        card.className = 'account-card';
        let iconClass = 'fa-solid fa-wallet';
        if (acc.type === 'bank') iconClass = 'fa-solid fa-building-columns';
        if (acc.type === 'mobile_wallet') iconClass = 'fa-solid fa-mobile-screen-button';

        card.innerHTML = `
            <div class="account-card-header">
                <h3>${acc.name}</h3>
                <div class="action-buttons">
                     <button class="action-btn edit-btn" data-type="account" data-id="${acc.id}"><i class="fa-solid fa-pencil"></i></button>
                    <button class="action-btn delete-btn" data-type="account" data-id="${acc.id}"><i class="fa-solid fa-trash-can"></i></button>
                </div>
            </div>
            <div class="account-info">
                <p class="amount">${formatCurrency(acc.balance)}</p>
                <p>${acc.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
            </div>
            <i class="${iconClass} card-icon"></i>
        `;
        accountGridEl.appendChild(card);
    });
}

// সম্পদ তালিকা রেন্ডার
function renderAssets() {
    assetGridEl.innerHTML = '';
    if (allAssets.length === 0) {
        assetGridEl.innerHTML = `<p class="placeholder-cell">কোনো সম্পদ যোগ করা হয়নি।</p>`;
        return;
    }
    allAssets.forEach(asset => {
        const card = document.createElement('div');
        card.className = 'asset-card';
        card.innerHTML = `
            <div class="asset-card-header">
                <h3>${asset.asset_name}</h3>
                <div class="action-buttons">
                    <button class="action-btn edit-btn" data-type="asset" data-id="${asset.id}"><i class="fa-solid fa-pencil"></i></button>
                    <button class="action-btn delete-btn" data-type="asset" data-id="${asset.id}"><i class="fa-solid fa-trash-can"></i></button>
                </div>
            </div>
            <div class="asset-info">
                <p class="amount">${formatCurrency(asset.current_value)}</p>
                <p>${asset.asset_type}</p>
            </div>
            <i class="fa-solid fa-sack-dollar card-icon"></i>
        `;
        assetGridEl.appendChild(card);
    });
}


// দেনা-পাওনা তালিকা রেন্ডার
function renderDebts() {
    debtsTableBody.innerHTML = '';
    if(allDebts.length === 0) {
        debtsTableBody.innerHTML = `<tr><td colspan="7" class="placeholder-cell">কোনো দেনা-পাওনার হিসাব পাওয়া যায়নি।</td></tr>`;
        return;
    }
    allDebts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    allDebts.forEach(d => {
        const row = document.createElement('tr');
        row.dataset.id = d.id;
        row.innerHTML = `
            <td>${d.person_name}</td>
            <td>${d.description || 'N/A'}</td>
            <td class="${d.type === 'loan' ? 'income-text' : 'expense-text'}">${d.type === 'loan' ? 'পাওনা' : 'দেনা'}</td>
            <td>${formatCurrency(d.amount)}</td>
            <td>${formatDate(d.due_date)}</td>
            <td><span class="status-badge status-${d.status}">${d.status === 'paid' ? 'পরিশোধিত' : 'অপরিশোধিত'}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit-btn" data-type="debt" data-id="${d.id}"><i class="fa-solid fa-pencil"></i></button>
                    <button class="action-btn delete-btn" data-type="debt" data-id="${d.id}"><i class="fa-solid fa-trash-can"></i></button>
                </div>
            </td>
        `;
        debtsTableBody.appendChild(row);
    });
}

// বাজেট তালিকা রেন্ডার
function renderBudgets() {
    budgetListEl.innerHTML = '';
    if (allBudgets.length === 0) {
        budgetListEl.innerHTML = `<p class="placeholder-cell">কোনো বাজেট সেট করা হয়নি।</p>`;
        return;
    }
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    allBudgets.forEach(b => {
        const spent = allTransactions
            .filter(t => 
                t.category_id === b.category_id && 
                t.type === 'expense' && 
                new Date(t.transaction_date).getMonth() === currentMonth &&
                new Date(t.transaction_date).getFullYear() === currentYear
            )
            .reduce((sum, t) => sum + t.amount, 0);
        const percentage = (spent / b.amount) * 100;
        
        const card = document.createElement('div');
        card.className = 'budget-card';
        card.innerHTML = `
            <div class="budget-card-header">
                <h3>${b.Categories?.name || 'N/A'}</h3>
                <div class="action-buttons">
                     <button class="action-btn edit-btn" data-type="budget" data-id="${b.id}"><i class="fa-solid fa-pencil"></i></button>
                    <button class="action-btn delete-btn" data-type="budget" data-id="${b.id}"><i class="fa-solid fa-trash-can"></i></button>
                </div>
            </div>
            <div class="budget-info">
                <p>খরচ: <span class="amount">${formatCurrency(spent)}</span></p>
                <p>বাজেট: <span class="amount">${formatCurrency(b.amount)}</span></p>
            </div>
            <div class="progress-bar">
                <div class="progress ${percentage > 100 ? 'over-budget' : ''}" style="width: ${Math.min(percentage, 100)}%;"></div>
            </div>
            <p class="progress-text">${percentage.toFixed(0)}% খরচ হয়েছে</p>
        `;
        budgetListEl.appendChild(card);
    });
}

// সঞ্চয়ের লক্ষ্য তালিকা রেন্ডার
function renderGoals() {
    goalListEl.innerHTML = '';
    if (allGoals.length === 0) {
        goalListEl.innerHTML = `<p class="placeholder-cell">কোনো সঞ্চয়ের লক্ষ্য সেট করা হয়নি।</p>`;
        return;
    }
    allGoals.forEach(g => {
        const percentage = (g.current_amount / g.target_amount) * 100;
        const card = document.createElement('div');
        card.className = 'goal-card';
        card.innerHTML = `
             <div class="goal-card-header">
                <h3>${g.goal_name}</h3>
                <div class="action-buttons">
                     <button class="action-btn edit-btn" data-type="goal" data-id="${g.id}"><i class="fa-solid fa-pencil"></i></button>
                    <button class="action-btn delete-btn" data-type="goal" data-id="${g.id}"><i class="fa-solid fa-trash-can"></i></button>
                </div>
            </div>
            <div class="goal-info">
                <p>জমা হয়েছে: <span class="amount">${formatCurrency(g.current_amount)}</span></p>
                <p>লক্ষ্য: <span class="amount">${formatCurrency(g.target_amount)}</span></p>
            </div>
            <div class="progress-bar">
                <div class="progress" style="width: ${Math.min(percentage, 100)}%;"></div>
            </div>
            <p class="progress-text">${percentage.toFixed(0)}% পূর্ণ হয়েছে</p>
        `;
        goalListEl.appendChild(card);
    });
}

// রিকারিং তালিকা রেন্ডার
function renderRecurring() {
    recurringTableBody.innerHTML = '';
    if (allRecurring.length === 0) {
        recurringTableBody.innerHTML = `<tr><td colspan="7" class="placeholder-cell">কোনো রিকারিং হিসাব পাওয়া যায়নি।</td></tr>`;
        return;
    }
    allRecurring.forEach(r => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${r.description}</td>
            <td>${r.Accounts?.name || 'N/A'}</td>
            <td>${r.Categories?.name || 'N/A'}</td>
            <td class="${r.type}-text">${r.type === 'income' ? 'আয়' : 'ব্যয়'}</td>
            <td>${formatCurrency(r.amount)}</td>
            <td>${formatDate(r.next_due_date)}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit-btn" data-type="recurring" data-id="${r.id}"><i class="fa-solid fa-pencil"></i></button>
                    <button class="action-btn delete-btn" data-type="recurring" data-id="${r.id}"><i class="fa-solid fa-trash-can"></i></button>
                </div>
            </td>
        `;
        recurringTableBody.appendChild(row);
    });
}

// ক্যাটাগরি এবং ট্যাগ তালিকা রেন্ডার
function renderCategories() {
    categoriesTableBody.innerHTML = '';
    if (allCategories.length === 0) {
        categoriesTableBody.innerHTML = `<tr><td colspan="3" class="placeholder-cell">কোনো ক্যাটাগরি পাওয়া যায়নি।</td></tr>`;
        return;
    }
    allCategories.forEach(c => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${c.name}</td>
            <td class="${c.type}-text">${c.type === 'income' ? 'আয়' : 'ব্যয়'}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit-btn" data-type="category" data-id="${c.id}"><i class="fa-solid fa-pencil"></i></button>
                    <button class="action-btn delete-btn" data-type="category" data-id="${c.id}"><i class="fa-solid fa-trash-can"></i></button>
                </div>
            </td>
        `;
        categoriesTableBody.appendChild(row);
    });
}

function renderTags() {
    tagsTableBody.innerHTML = '';
    if (allTags.length === 0) {
        tagsTableBody.innerHTML = `<tr><td colspan="2" class="placeholder-cell">কোনো ট্যাগ পাওয়া যায়নি।</td></tr>`;
        return;
    }
    allTags.forEach(t => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${t.name}</td>
            <td>
                <div class="action-buttons">
                    <button class="action-btn edit-btn" data-type="tag" data-id="${t.id}"><i class="fa-solid fa-pencil"></i></button>
                    <button class="action-btn delete-btn" data-type="tag" data-id="${t.id}"><i class="fa-solid fa-trash-can"></i></button>
                </div>
            </td>
        `;
        tagsTableBody.appendChild(row);
    });
}

// ==================================================
// চার্ট রেন্ডারিং ফাংশন
// ==================================================
function renderChart(canvasId, type, data, options) {
    if (charts[canvasId]) {
        charts[canvasId].destroy();
    }
    const ctx = document.getElementById(canvasId).getContext('2d');
    charts[canvasId] = new Chart(ctx, { type, data, options });
}

const commonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            labels: { color: 'var(--text-secondary)', font: { family: "'Kalpurush', sans-serif" } }
        }
    },
    scales: {
        x: {
            ticks: { color: 'var(--text-secondary)', font: { family: "'Kalpurush', sans-serif" } },
            grid: { color: 'var(--border-color)' }
        },
        y: {
            ticks: { color: 'var(--text-secondary)', font: { family: "'Kalpurush', sans-serif" } },
            grid: { color: 'var(--border-color)' }
        }
    }
};

function renderIncomeExpenseChart() {
    const labels = [];
    const incomeData = [];
    const expenseData = [];
    for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        labels.push(d.toLocaleDateString('bn-BD', { month: 'long' }));
        const month = d.getMonth();
        const year = d.getFullYear();

        const monthlyIncome = allTransactions
            .filter(t => t.type === 'income' && new Date(t.transaction_date).getMonth() === month && new Date(t.transaction_date).getFullYear() === year)
            .reduce((sum, t) => sum + t.amount, 0);
        incomeData.push(monthlyIncome);

        const monthlyExpense = allTransactions
            .filter(t => t.type === 'expense' && new Date(t.transaction_date).getMonth() === month && new Date(t.transaction_date).getFullYear() === year)
            .reduce((sum, t) => sum + t.amount, 0);
        expenseData.push(monthlyExpense);
    }

    renderChart('incomeExpenseChart', 'bar', {
        labels,
        datasets: [
            { label: 'আয়', data: incomeData, backgroundColor: 'rgba(34, 197, 94, 0.6)' },
            { label: 'ব্যয়', data: expenseData, backgroundColor: 'rgba(239, 68, 68, 0.6)' }
        ]
    }, commonChartOptions);
}

function renderAccountBalanceChart() {
    renderChart('account-balance-chart', 'doughnut', {
        labels: allAccounts.map(a => a.name),
        datasets: [{
            data: allAccounts.map(a => a.balance),
            backgroundColor: ['#3b82f6', '#ef4444', '#22c55e', '#f97316', '#8b5cf6', '#ec4899'],
            borderColor: 'var(--bg-secondary)',
        }]
    }, { ...commonChartOptions, scales: {} });
}

function renderAssetAllocationChart() {
    const assetTypes = {};
    allAssets.forEach(asset => {
        if (assetTypes[asset.asset_type]) {
            assetTypes[asset.asset_type] += asset.current_value;
        } else {
            assetTypes[asset.asset_type] = asset.current_value;
        }
    });

    renderChart('asset-allocation-chart', 'pie', {
        labels: Object.keys(assetTypes),
        datasets: [{
            data: Object.values(assetTypes),
            backgroundColor: ['#8b5cf6', '#f97316', '#facc15', '#10b981', '#3b82f6'],
            borderColor: 'var(--bg-secondary)',
        }]
    }, { ...commonChartOptions, scales: {} });
}

function renderDebtStatusChart() {
    const paid = allDebts.filter(d => d.status === 'paid').reduce((s, d) => s + d.amount, 0);
    const unpaid = allDebts.filter(d => d.status === 'unpaid').reduce((s, d) => s + d.amount, 0);
    renderChart('debt-status-chart', 'pie', {
        labels: ['পরিশোধিত', 'অপরিশোধিত'],
        datasets: [{
            data: [paid, unpaid],
            backgroundColor: ['#22c55e', '#ef4444'],
            borderColor: 'var(--bg-secondary)',
        }]
    }, { ...commonChartOptions, scales: {} });
}

function renderBudgetVsSpentChart() {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const labels = allBudgets.map(b => b.Categories.name);
    const budgetData = allBudgets.map(b => b.amount);
    const spentData = allBudgets.map(b => 
        allTransactions
            .filter(t => t.category_id === b.category_id && t.type === 'expense' && new Date(t.transaction_date).getMonth() === currentMonth && new Date(t.transaction_date).getFullYear() === currentYear)
            .reduce((sum, t) => sum + t.amount, 0)
    );
    renderChart('budget-vs-spent-chart', 'bar', {
        labels,
        datasets: [
            { label: 'বাজেট', data: budgetData, backgroundColor: 'rgba(59, 130, 246, 0.6)' },
            { label: 'খরচ', data: spentData, backgroundColor: 'rgba(249, 115, 22, 0.6)' }
        ]
    }, commonChartOptions);
}

function renderGoalProgressChart() {
    const labels = allGoals.map(g => g.goal_name);
    const progressData = allGoals.map(g => (g.current_amount / g.target_amount) * 100);
    renderChart('goal-progress-chart', 'bar', {
        labels,
        datasets: [{
            label: 'অগ্রগতি (%)',
            data: progressData,
            backgroundColor: 'rgba(139, 92, 246, 0.6)'
        }]
    }, { ...commonChartOptions, scales: { ...commonChartOptions.scales, y: { ...commonChartOptions.scales.y, max: 100 } } });
}

// ==================================================
// ডেটা লোডিং ফাংশন
// ==================================================
async function loadAllDataAndRender() {
    try {
        const [
            catRes, tranRes, budRes, goalRes, debtRes, accRes, tagRes, recRes, tranTagRes, assetRes, transfersRes
        ] = await Promise.all([
            supabase.from('Categories').select('*'),
            supabase.from('Transactions').select('*'),
            supabase.from('Budgets').select('*'),
            supabase.from('Savings_Goals').select('*'),
            supabase.from('Debts').select('*'),
            supabase.from('Accounts').select('*'),
            supabase.from('Tags').select('*'),
            supabase.from('Recurring_Transactions').select('*'),
            supabase.from('Transaction_Tags').select('*'),
            supabase.from('Assets').select('*'),
            supabase.from('Transfers').select('*')
        ]);

        if (catRes.error) throw catRes.error;
        if (tranRes.error) throw tranRes.error;
        if (budRes.error) throw budRes.error;
        if (goalRes.error) throw goalRes.error;
        if (debtRes.error) throw debtRes.error;
        if (accRes.error) throw accRes.error;
        if (tagRes.error) throw tagRes.error;
        if (recRes.error) throw recRes.error;
        if (tranTagRes.error) throw tranTagRes.error;
        if (assetRes.error) throw assetRes.error;
        if (transfersRes.error) throw transfersRes.error;

        allCategories = catRes.data;
        allBudgets = budRes.data;
        allGoals = goalRes.data;
        allDebts = debtRes.data;
        allAccounts = accRes.data;
        allTags = tagRes.data;
        allRecurring = recRes.data;
        allAssets = assetRes.data;
        allTransactionTags = tranTagRes.data;
        allTransfers = transfersRes.data;
        
        const categoryMap = new Map(allCategories.map(c => [c.id, c]));
        const accountMap = new Map(allAccounts.map(a => [a.id, a]));
        const tagMap = new Map(allTags.map(t => [t.id, t]));

        allTransactions = tranRes.data.map(t => ({
            ...t,
            Categories: categoryMap.get(t.category_id),
            Accounts: accountMap.get(t.account_id),
            Tags: allTransactionTags
                .filter(tt => tt.transaction_id === t.id)
                .map(tt => tagMap.get(tt.tag_id))
                .filter(Boolean)
        }));

        allBudgets = allBudgets.map(b => ({ ...b, Categories: categoryMap.get(b.category_id) }));
        allRecurring = allRecurring.map(r => ({ ...r, Categories: categoryMap.get(r.category_id), Accounts: accountMap.get(r.account_id) }));

        renderAll();
        checkReminders();

    } catch (error) {
        console.error('Error loading data:', error.message);
        showToast('ডেটা লোড করতে সমস্যা হয়েছে।', 'error');
    }
}

// ==================================================
// মডাল হ্যান্ডলিং
// ==================================================
function populateSelect(selectEl, data, valueField, textField, prompt) {
    selectEl.innerHTML = `<option value="">${prompt}</option>`;
    data.forEach(item => {
        selectEl.innerHTML += `<option value="${item[valueField]}">${item[textField]}</option>`;
    });
}

function openModal(type, id = null) {
    const modal = document.getElementById(`${type}-modal`);
    if (!modal) return;
    const form = document.getElementById(`${type}-form`);
    const modalTitle = document.getElementById(`${type}-modal-title`);
    const submitBtn = form.querySelector('button[type="submit"]');
    form.reset();

    const hiddenInput = form.querySelector('input[type="hidden"]');
    if (hiddenInput) {
        hiddenInput.value = id || '';
    }

    let titlePrefix = 'নতুন';
    let btnText = 'যোগ করুন';
    if (id) {
        titlePrefix = 'এডিট করুন';
        btnText = 'আপডেট করুন';
    }
    
    switch (type) {
        case 'transaction':
            document.getElementById('receipt-preview').innerHTML = '';
            modalTitle.textContent = `${titlePrefix} হিসাব`;
            populateSelect(document.getElementById('tr-account'), allAccounts, 'id', 'name', 'অ্যাকাউন্ট নির্বাচন করুন');
            const trType = document.getElementById('tr-type').value;
            populateSelect(document.getElementById('tr-category'), allCategories.filter(c => c.type === trType), 'id', 'name', 'ক্যাটাগরি নির্বাচন করুন');
            if (id) {
                const t = allTransactions.find(tr => tr.id === id);
                document.getElementById('tr-date').value = t.transaction_date.slice(0,10);
                document.getElementById('tr-description').value = t.description;
                document.getElementById('tr-amount').value = t.amount;
                document.getElementById('tr-type').value = t.type;
                document.getElementById('tr-account').value = t.account_id;
                populateSelect(document.getElementById('tr-category'), allCategories.filter(c => c.type === t.type), 'id', 'name', 'ক্যাটাগরি নির্বাচন করুন');
                document.getElementById('tr-category').value = t.category_id;
                document.getElementById('tr-tags').value = t.Tags.map(tag => tag.name).join(', ');
                if (t.receipt_url) {
                    document.getElementById('receipt-preview').innerHTML = `<a href="${t.receipt_url}" target="_blank">বর্তমান রসিদ দেখুন</a>`;
                }
            } else {
                document.getElementById('tr-date').valueAsDate = new Date();
            }
            break;
        case 'account':
            modalTitle.textContent = `${titlePrefix} অ্যাকাউন্ট`;
            if (id) {
                const acc = allAccounts.find(a => a.id === id);
                document.getElementById('acc-name').value = acc.name;
                document.getElementById('acc-type').value = acc.type;
                document.getElementById('acc-balance').value = acc.balance;
                document.getElementById('acc-balance').disabled = true;
            } else {
                document.getElementById('acc-balance').disabled = false;
            }
            break;
        case 'asset':
            modalTitle.textContent = `${titlePrefix} সম্পদ`;
            if (id) {
                const asset = allAssets.find(a => a.id === id);
                document.getElementById('asset-name').value = asset.asset_name;
                document.getElementById('asset-type').value = asset.asset_type;
                document.getElementById('asset-purchase-price').value = asset.purchase_price;
                document.getElementById('asset-current-value').value = asset.current_value;
                document.getElementById('asset-purchase-date').value = asset.purchase_date;
                document.getElementById('asset-notes').value = asset.notes;
            }
            break;
        case 'debt':
            modalTitle.textContent = `${titlePrefix} দেনা-পাওনার হিসাব`;
            if (id) {
                const d = allDebts.find(item => item.id === id);
                document.getElementById('debt-person').value = d.person_name;
                document.getElementById('debt-amount').value = d.amount;
                document.getElementById('debt-type').value = d.type;
                document.getElementById('debt-status').value = d.status;
                document.getElementById('debt-due-date').value = d.due_date;
                document.getElementById('debt-description').value = d.description;
                document.getElementById('debt-reminder-enabled').checked = d.is_reminder_enabled;
                document.getElementById('debt-reminder-days').value = d.reminder_days;
                document.getElementById('debt-reminder-days').style.display = d.is_reminder_enabled ? 'block' : 'none';
            }
            break;
        case 'budget':
            modalTitle.textContent = `${titlePrefix} বাজেট`;
            populateSelect(document.getElementById('budget-category'), allCategories.filter(c => c.type === 'expense'), 'id', 'name', 'ক্যাটাগরি নির্বাচন করুন');
            if (id) {
                const b = allBudgets.find(item => item.id === id);
                document.getElementById('budget-category').value = b.category_id;
                document.getElementById('budget-amount').value = b.amount;
                document.getElementById('budget-month').value = b.month.slice(0, 7);
            } else {
                document.getElementById('budget-month').value = new Date().toISOString().slice(0, 7);
            }
            break;
        case 'goal':
            modalTitle.textContent = `${titlePrefix} সঞ্চয়ের লক্ষ্য`;
            if (id) {
                const g = allGoals.find(item => item.id === id);
                document.getElementById('goal-name').value = g.goal_name;
                document.getElementById('goal-target-amount').value = g.target_amount;
                document.getElementById('goal-current-amount').value = g.current_amount;
                document.getElementById('goal-target-date').value = g.target_date;
            }
            break;
        case 'category':
            modalTitle.textContent = `${titlePrefix} ক্যাটাগরি`;
            if (id) {
                const c = allCategories.find(item => item.id === id);
                document.getElementById('cat-name').value = c.name;
                document.getElementById('cat-type').value = c.type;
            }
            break;
        case 'tag':
            modalTitle.textContent = `${titlePrefix} ট্যাগ`;
            if (id) {
                const t = allTags.find(item => item.id === id);
                document.getElementById('tag-name').value = t.name;
            }
            break;
        case 'recurring':
            modalTitle.textContent = `${titlePrefix} রিকারিং হিসাব`;
            populateSelect(document.getElementById('rec-account'), allAccounts, 'id', 'name', 'অ্যাকাউন্ট নির্বাচন করুন');
            const recType = document.getElementById('rec-type').value;
            populateSelect(document.getElementById('rec-category'), allCategories.filter(c => c.type === recType), 'id', 'name', 'ক্যাটাগরি নির্বাচন করুন');
            if (id) {
                const r = allRecurring.find(item => item.id === id);
                document.getElementById('rec-description').value = r.description;
                document.getElementById('rec-amount').value = r.amount;
                document.getElementById('rec-type').value = r.type;
                document.getElementById('rec-account').value = r.account_id;
                populateSelect(document.getElementById('rec-category'), allCategories.filter(c => c.type === r.type), 'id', 'name', 'ক্যাটাগরি নির্বাচন করুন');
                document.getElementById('rec-category').value = r.category_id;
                document.getElementById('rec-rule').value = r.recurrence_rule;
                document.getElementById('rec-start-date').value = r.start_date;
                document.getElementById('rec-reminder-enabled').checked = r.is_reminder_enabled;
                document.getElementById('rec-reminder-days').value = r.reminder_days;
                document.getElementById('rec-reminder-days').style.display = r.is_reminder_enabled ? 'block' : 'none';
            } else {
                document.getElementById('rec-start-date').valueAsDate = new Date();
            }
            break;
        case 'transfer':
            modalTitle.textContent = `টাকা ট্রান্সফার`;
            populateSelect(document.getElementById('transfer-from'), allAccounts, 'id', 'name', 'অ্যাকাউন্ট নির্বাচন করুন');
            populateSelect(document.getElementById('transfer-to'), allAccounts, 'id', 'name', 'অ্যাকাউন্ট নির্বাচন করুন');
            document.getElementById('transfer-date').valueAsDate = new Date();
            btnText = 'ট্রান্সফার করুন';
            break;
    }

    if(submitBtn) submitBtn.textContent = btnText;
    modal.showModal();
}

// ==================================================
// ফর্ম সাবমিশন হ্যান্ডলার
// ==================================================
async function handleFormSubmit(e, modal, tableName, idField, dataExtractor) {
    e.preventDefault();
    const id = modal.querySelector(idField).value;
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;

    try {
        const data = await dataExtractor();
        if (!id) {
            data.user_id = currentUser.id;
        }

        const { error } = id
            ? await supabase.from(tableName).update(data).eq('id', id)
            : await supabase.from(tableName).insert([data]);

        if (error) throw error;
        showToast(`সফলভাবে ${id ? 'আপডেট' : 'যোগ'} হয়েছে।`);
        modal.close();
        await loadAllDataAndRender();
    } catch (error) {
        console.error(`Error saving ${tableName}:`, error.message);
        showToast('সেভ করতে সমস্যা হয়েছে।', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = id ? 'আপডেট করুন' : 'যোগ করুন';
    }
}

// লেনদেন ফর্ম
transactionForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('transaction-id').value;
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;

    try {
        const receiptFile = document.getElementById('tr-receipt').files[0];
        let receiptUrl = id ? allTransactions.find(t => t.id == id).receipt_url : null;
        if (receiptFile) {
            const filePath = `public/${currentUser.id}/${Date.now()}-${receiptFile.name}`;
            const { error: uploadError } = await supabase.storage.from('receipts').upload(filePath, receiptFile);
            if (uploadError) throw uploadError;
            receiptUrl = supabase.storage.from('receipts').getPublicUrl(filePath).data.publicUrl;
        }

        const transactionData = {
            transaction_date: document.getElementById('tr-date').value,
            description: document.getElementById('tr-description').value,
            amount: parseFloat(document.getElementById('tr-amount').value),
            type: document.getElementById('tr-type').value,
            category_id: parseInt(document.getElementById('tr-category').value),
            account_id: parseInt(document.getElementById('tr-account').value),
            receipt_url: receiptUrl,
            user_id: currentUser.id
        };

        const { data: savedTransaction, error } = id
            ? await supabase.from('Transactions').update(transactionData).eq('id', id).select().single()
            : await supabase.from('Transactions').insert([transactionData]).select().single();
        if (error) throw error;
        
        const tagNames = document.getElementById('tr-tags').value.split(',').map(t => t.trim()).filter(Boolean);
        if (tagNames.length > 0) {
            const { data: existingTags, error: tagError } = await supabase.from('Tags').select('id, name').in('name', tagNames);
            if (tagError) throw tagError;

            const existingTagNames = existingTags.map(t => t.name);
            const newTagNames = tagNames.filter(t => !existingTagNames.includes(t));
            
            let newTags = [];
            if (newTagNames.length > 0) {
                const newTagObjects = newTagNames.map(name => ({ name, user_id: currentUser.id }));
                const { data: insertedTags, error: insertError } = await supabase.from('Tags').insert(newTagObjects).select();
                if (insertError) throw insertError;
                newTags = insertedTags;
            }
            
            const allTagIds = [...existingTags, ...newTags].map(t => t.id);

            await supabase.from('Transaction_Tags').delete().eq('transaction_id', savedTransaction.id);
            const transactionTagObjects = allTagIds.map(tag_id => ({
                transaction_id: savedTransaction.id,
                tag_id: tag_id,
                user_id: currentUser.id
            }));
            const { error: linkError } = await supabase.from('Transaction_Tags').insert(transactionTagObjects);
            if (linkError) throw linkError;
        } else {
             await supabase.from('Transaction_Tags').delete().eq('transaction_id', savedTransaction.id);
        }

        const amount = transactionData.amount;
        const type = transactionData.type;
        const accountId = transactionData.account_id;
        const originalTransaction = id ? allTransactions.find(t => t.id == id) : null;
        let amountChange = type === 'expense' ? -amount : amount;
        
        if(originalTransaction) {
            const originalAmount = originalTransaction.type === 'expense' ? -originalTransaction.amount : originalTransaction.amount;
            amountChange -= originalAmount;
        }

        const { data: account } = await supabase.from('Accounts').select('balance').eq('id', accountId).single();
        await supabase.from('Accounts').update({ balance: account.balance + amountChange }).eq('id', accountId);

        showToast(`হিসাব সফলভাবে ${id ? 'আপডেট' : 'যোগ'} হয়েছে।`);
        transactionModal.close();
        await loadAllDataAndRender();

    } catch (error) {
        console.error('Error saving transaction:', error.message);
        showToast('হিসাব সেভ করতে সমস্যা হয়েছে।', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = id ? 'আপডেট করুন' : 'যোগ করুন';
    }
});

// অন্যান্য ফর্ম সাবমিশন
accountForm.addEventListener('submit', (e) => handleFormSubmit(e, accountModal, 'Accounts', '#account-id', () => ({
    name: document.getElementById('acc-name').value,
    type: document.getElementById('acc-type').value,
    balance: parseFloat(document.getElementById('acc-balance').value)
})));

assetForm.addEventListener('submit', (e) => handleFormSubmit(e, assetModal, 'Assets', '#asset-id', () => ({
    asset_name: document.getElementById('asset-name').value,
    asset_type: document.getElementById('asset-type').value,
    purchase_price: parseFloat(document.getElementById('asset-purchase-price').value) || 0,
    current_value: parseFloat(document.getElementById('asset-current-value').value) || 0,
    purchase_date: document.getElementById('asset-purchase-date').value || null,
    notes: document.getElementById('asset-notes').value
})));

debtForm.addEventListener('submit', (e) => handleFormSubmit(e, debtModal, 'Debts', '#debt-id', () => ({
    person_name: document.getElementById('debt-person').value,
    amount: parseFloat(document.getElementById('debt-amount').value),
    type: document.getElementById('debt-type').value,
    status: document.getElementById('debt-status').value,
    due_date: document.getElementById('debt-due-date').value || null,
    description: document.getElementById('debt-description').value,
    is_reminder_enabled: document.getElementById('debt-reminder-enabled').checked,
    reminder_days: document.getElementById('debt-reminder-enabled').checked ? parseInt(document.getElementById('debt-reminder-days').value) : null
})));

categoryForm.addEventListener('submit', (e) => handleFormSubmit(e, categoryModal, 'Categories', '#category-id', () => ({
    name: document.getElementById('cat-name').value,
    type: document.getElementById('cat-type').value
})));

tagForm.addEventListener('submit', (e) => handleFormSubmit(e, tagModal, 'Tags', '#tag-id', () => ({
    name: document.getElementById('tag-name').value
})));

budgetForm.addEventListener('submit', (e) => handleFormSubmit(e, budgetModal, 'Budgets', '#budget-id', () => ({
    category_id: parseInt(document.getElementById('budget-category').value),
    amount: parseFloat(document.getElementById('budget-amount').value),
    month: `${document.getElementById('budget-month').value}-01`
})));

goalForm.addEventListener('submit', (e) => handleFormSubmit(e, goalModal, 'Savings_Goals', '#goal-id', () => ({
    goal_name: document.getElementById('goal-name').value,
    target_amount: parseFloat(document.getElementById('goal-target-amount').value),
    current_amount: parseFloat(document.getElementById('goal-current-amount').value),
    target_date: document.getElementById('goal-target-date').value || null
})));

recurringForm.addEventListener('submit', (e) => handleFormSubmit(e, recurringModal, 'Recurring_Transactions', '#recurring-id', () => ({
    description: document.getElementById('rec-description').value,
    amount: parseFloat(document.getElementById('rec-amount').value),
    type: document.getElementById('rec-type').value,
    account_id: parseInt(document.getElementById('rec-account').value),
    category_id: parseInt(document.getElementById('rec-category').value),
    recurrence_rule: document.getElementById('rec-rule').value,
    start_date: document.getElementById('rec-start-date').value,
    next_due_date: document.getElementById('rec-start-date').value,
    is_reminder_enabled: document.getElementById('rec-reminder-enabled').checked,
    reminder_days: document.getElementById('rec-reminder-enabled').checked ? parseInt(document.getElementById('rec-reminder-days').value) : null
})));

transferForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = e.target.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;
    try {
        const fromId = parseInt(document.getElementById('transfer-from').value);
        const toId = parseInt(document.getElementById('transfer-to').value);
        const amount = parseFloat(document.getElementById('transfer-amount').value);
        if (fromId === toId) throw new Error("একই অ্যাকাউন্টে টাকা ট্রান্সফার করা যাবে না।");

        const { data: fromAcc } = await supabase.from('Accounts').select('balance').eq('id', fromId).single();
        const { data: toAcc } = await supabase.from('Accounts').select('balance').eq('id', toId).single();

        await supabase.from('Accounts').update({ balance: fromAcc.balance - amount }).eq('id', fromId);
        await supabase.from('Accounts').update({ balance: toAcc.balance + amount }).eq('id', toId);

        await supabase.from('Transfers').insert([{
            from_account_id: fromId,
            to_account_id: toId,
            amount: amount,
            transfer_date: document.getElementById('transfer-date').value,
            description: document.getElementById('transfer-description').value,
            user_id: currentUser.id
        }]);

        showToast('টাকা সফলভাবে ট্রান্সফার হয়েছে।');
        transferModal.close();
        await loadAllDataAndRender();
    } catch (error) {
        console.error('Error transferring money:', error.message);
        showToast(error.message, 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'ট্রান্সফার করুন';
    }
});

// ==================================================
// ডিলিট এবং এডিট হ্যান্ডলার
// ==================================================
document.body.addEventListener('click', async (e) => {
    const target = e.target.closest('.action-btn.delete-btn');
    if (!target) return;

    const id = parseInt(target.dataset.id) || target.dataset.id;
    const type = target.dataset.type;
    const confirmed = await showConfirm('আপনি কি নিশ্চিতভাবে এটি মুছতে চান? এই কাজটি ফেরানো যাবে না।');
    if (confirmed) {
        let tableName;
        switch(type) {
            case 'transaction': tableName = 'Transactions'; break;
            case 'category': tableName = 'Categories'; break;
            case 'budget': tableName = 'Budgets'; break;
            case 'goal': tableName = 'Savings_Goals'; break;
            case 'debt': tableName = 'Debts'; break;
            case 'account': tableName = 'Accounts'; break;
            case 'tag': tableName = 'Tags'; break;
            case 'recurring': tableName = 'Recurring_Transactions'; break;
            case 'asset': tableName = 'Assets'; break;
        }
        try {
            if (type === 'transaction') {
                const t = allTransactions.find(tr => tr.id == id);
                if(t) {
                    const amountChange = t.type === 'expense' ? t.amount : -t.amount;
                    const { data: account } = await supabase.from('Accounts').select('balance').eq('id', t.account_id).single();
                    await supabase.from('Accounts').update({ balance: account.balance + amountChange }).eq('id', t.account_id);
                    await supabase.from('Transaction_Tags').delete().eq('transaction_id', id);
                }
            }
            const { error } = await supabase.from(tableName).delete().eq('id', id);
            if (error) throw error;
            showToast('সফলভাবে মুছে ফেলা হয়েছে।');
            await loadAllDataAndRender();
        } catch (error) {
            console.error(`Error deleting ${type}:`, error.message);
            showToast('মুছতে সমস্যা হয়েছে। সম্পর্কিত ডেটা থাকতে পারে।', 'error');
        }
    }
});

document.body.addEventListener('click', (e) => {
    const target = e.target.closest('.action-btn.edit-btn');
    if (!target) return;
    const id = parseInt(target.dataset.id) || target.dataset.id;
    const type = target.dataset.type;
    openModal(type, id);
});

// ==================================================
// বিশেষ ফিচার (CSV, Backup, Reminder, Account Deletion)
// ==================================================
function exportToCsv(filename, rows) {
    const processRow = row => Object.values(row).map(val => `"${(val || '').toString().replace(/"/g, '""')}"`).join(',');
    const csvContent = "data:text/csv;charset=utf-8," 
        + [Object.keys(rows[0])].concat(rows.map(row => Object.values(row))).map(processRow).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

exportBtn.addEventListener('click', () => {
    if (allTransactions.length === 0) {
        showToast("এক্সপোর্ট করার মতো কোনো ডেটা নেই।", "error");
        return;
    }
    const dataToExport = allTransactions.map(t => ({
        'তারিখ': formatDate(t.transaction_date),
        'বিবরণ': t.description,
        'ধরন': t.type === 'income' ? 'আয়' : 'ব্যয়',
        'পরিমাণ': t.amount,
        'ক্যাটাগরি': t.Categories?.name || '',
        'অ্যাকাউন্ট': t.Accounts?.name || '',
        'ট্যাগ': t.Tags.map(tag => tag.name).join(' | ')
    }));
    exportToCsv('transactions.csv', dataToExport);
});

function checkReminders() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const upcomingReminders = [];

    allDebts.forEach(debt => {
        if (debt.is_reminder_enabled && debt.status === 'unpaid' && debt.due_date) {
            const dueDate = new Date(debt.due_date);
            const diffTime = dueDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays >= 0 && diffDays <= debt.reminder_days) {
                upcomingReminders.push(`'${debt.person_name}' এর দেনা পরিশোধের তারিখ ${diffDays} দিন পর।`);
            }
        }
    });

    allRecurring.forEach(rec => {
        if (rec.is_reminder_enabled && rec.next_due_date) {
            const nextDueDate = new Date(rec.next_due_date);
            const diffTime = nextDueDate - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
             if (diffDays >= 0 && diffDays <= rec.reminder_days) {
                upcomingReminders.push(`'${rec.description}' বিলের তারিখ ${diffDays} দিন পর।`);
            }
        }
    });

    if (upcomingReminders.length > 0) {
        showToast(upcomingReminders.join('\n'), 'info');
    }
}

async function openLoginHistoryModal() {
    loginHistoryTableBody.innerHTML = `<tr><td colspan="3" class="placeholder-cell"><i class="fa-solid fa-spinner fa-spin"></i> লোড হচ্ছে...</td></tr>`;
    loginHistoryModal.showModal();
    try {
        const { data, error } = await supabase
            .from('login_activity')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('login_time', { ascending: false })
            .limit(20);

        if (error) throw error;

        if (data.length === 0) {
            loginHistoryTableBody.innerHTML = `<tr><td colspan="3" class="placeholder-cell">কোনো লগইন হিস্টোরি পাওয়া যায়নি।</td></tr>`;
            return;
        }

        loginHistoryTableBody.innerHTML = '';
        data.forEach(activity => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${formatDate(activity.login_time)}</td>
                <td>${activity.ip_address}</td>
                <td>${activity.user_agent}</td>
            `;
            loginHistoryTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching login history:', error.message);
        loginHistoryTableBody.innerHTML = `<tr><td colspan="3" class="placeholder-cell">হিস্টোরি লোড করা যায়নি।</td></tr>`;
        showToast('লগইন হিস্টোরি আনতে সমস্যা হয়েছে।', 'error');
    }
}

async function handleDeleteAccount() {
    const confirmed = await showConfirm("আপনি কি নিশ্চিতভাবে আপনার অ্যাকাউন্ট মুছে ফেলতে চান? এই কাজটি ফেরানো যাবে না। আপনার সকল ডেটা স্থায়ীভাবে মুছে যাবে।");
    if (confirmed) {
        try {
            const { error } = await supabase.rpc('delete_current_user');
            if (error) throw error;
            
            showToast("আপনার অ্যাকাউন্ট সফলভাবে মুছে ফেলা হয়েছে।", "success");
            await supabase.auth.signOut();
            window.location.href = 'login.html';

        } catch (error) {
            console.error('Error deleting account:', error.message);
            showToast('অ্যাকাউন্ট মুছতে সমস্যা হয়েছে।', 'error');
        }
    }
}

// ==================================================
// সেটিংস এবং ডেটা ম্যানেজমেন্ট
// ==================================================
backupDataBtn.addEventListener('click', async () => {
    const confirmed = await showConfirm("আপনি কি সকল ডেটার ব্যাকআপ নিতে চান? এটি একটি JSON ফাইল ডাউনলোড করবে।");
    if (!confirmed) return;

    showToast("ব্যাকআপ প্রস্তুত করা হচ্ছে...", "info");
    const dataToBackup = {
        Accounts: allAccounts,
        Assets: allAssets,
        Budgets: allBudgets,
        Categories: allCategories,
        Debts: allDebts,
        Recurring_Transactions: allRecurring,
        Savings_Goals: allGoals,
        Tags: allTags,
        Transactions: allTransactions.map(t => ({...t, Tags: undefined, Accounts: undefined, Categories: undefined})),
        Transaction_Tags: allTransactionTags,
        Transfers: allTransfers
    };
    
    const jsonString = JSON.stringify(dataToBackup, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const date = new Date().toISOString().slice(0, 10);
    link.download = `amar-hishab-backup-${date}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    showToast("ব্যাকআপ সফলভাবে ডাউনলোড হয়েছে।");
});

restoreDataBtn.addEventListener('click', () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.onchange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const backupData = JSON.parse(event.target.result);
                const confirmed = await showConfirm("আপনি কি নিশ্চিতভাবে ডেটা রিস্টোর করতে চান? এটি আপনার বর্তমান সকল ডেটা মুছে ফেলবে এবং ব্যাকআপ থেকে নতুন ডেটা যোগ করবে। এই কাজটি ফেরানো যাবে না।");
                if (!confirmed) return;

                showToast("ডেটা রিস্টোর করা হচ্ছে... অনুগ্রহ করে অপেক্ষা করুন।", "info");

                // Delete existing data
                await supabase.from('Transaction_Tags').delete().eq('user_id', currentUser.id);
                await supabase.from('Transfers').delete().eq('user_id', currentUser.id);
                await supabase.from('Transactions').delete().eq('user_id', currentUser.id);
                await supabase.from('Recurring_Transactions').delete().eq('user_id', currentUser.id);
                await supabase.from('Budgets').delete().eq('user_id', currentUser.id);
                await supabase.from('Savings_Goals').delete().eq('user_id', currentUser.id);
                await supabase.from('Debts').delete().eq('user_id', currentUser.id);
                await supabase.from('Assets').delete().eq('user_id', currentUser.id);
                await supabase.from('Accounts').delete().eq('user_id', currentUser.id);
                await supabase.from('Categories').delete().eq('user_id', currentUser.id);
                await supabase.from('Tags').delete().eq('user_id', currentUser.id);

                // Insert new data with current user's ID
                const stampWithUser = (data) => data.map(item => ({...item, user_id: currentUser.id, id: undefined}));
                
                await supabase.from('Tags').insert(stampWithUser(backupData.Tags || []));
                await supabase.from('Categories').insert(stampWithUser(backupData.Categories || []));
                await supabase.from('Accounts').insert(stampWithUser(backupData.Accounts || []));
                await supabase.from('Assets').insert(stampWithUser(backupData.Assets || []));
                await supabase.from('Debts').insert(stampWithUser(backupData.Debts || []));
                await supabase.from('Savings_Goals').insert(stampWithUser(backupData.Savings_Goals || []));
                await supabase.from('Budgets').insert(stampWithUser(backupData.Budgets || []));
                await supabase.from('Recurring_Transactions').insert(stampWithUser(backupData.Recurring_Transactions || []));
                await supabase.from('Transactions').insert(stampWithUser(backupData.Transactions || []));
                await supabase.from('Transfers').insert(stampWithUser(backupData.Transfers || []));
                // Transaction_Tags need special handling if IDs change. A more robust restore would map old IDs to new IDs.
                // For now, this simple restore might fail on foreign keys.

                showToast("ডেটা সফলভাবে রিস্টোর হয়েছে।", "success");
                await loadAllDataAndRender();

            } catch (error) {
                console.error("Restore error:", error);
                showToast("রিস্টোর করতে সমস্যা হয়েছে। ফাইলটি সঠিক ফরম্যাটে আছে কিনা দেখুন।", "error");
            }
        };
        reader.readAsText(file);
    };
    fileInput.click();
});

// ==================================================
// ইভেন্ট লিসেনার (Event Listeners)
// ==================================================
document.addEventListener('DOMContentLoaded', async () => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    applyTheme(savedTheme);
    
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error || !session) {
        window.location.href = 'login.html';
        return;
    }
    
    currentUser = session.user;
    userEmailDisplay.textContent = currentUser.email;
    loadAllDataAndRender();
});

themeToggle.addEventListener('change', () => applyTheme(themeToggle.checked ? 'light' : 'dark'));

logoutBtn.addEventListener('click', async () => {
    await supabase.auth.signOut();
    window.location.href = 'login.html';
});

// ...আগের কোড...

loginHistoryBtn.addEventListener('click', openLoginHistoryModal);
deleteAccountBtn.addEventListener('click', handleDeleteAccount);
finalDeleteAccountBtn.addEventListener('click', handleDeleteAccount);

// =========================================================
// অনুগ্রহ করে শুধু নিচের অংশটুকু এখানে যোগ করুন
// =========================================================
securityPinBtn.addEventListener('click', () => {
    showToast('অ্যাপ পিন সেট করার ফিচারটি শীঘ্রই আসছে।', 'info');
});

twoFactorBtn.addEventListener('click', () => {
    showToast('2FA সেট করার ফিচারটি শীঘ্রই আসছে।', 'info');
});
// =========================================================


// ফিল্টার ইভেন্ট (এই অংশটিও আগে থেকে আছে)
[searchInput, typeFilter, startDateFilter, endDateFilter].forEach(el => {
    el.addEventListener('input', renderTransactions);
//... পরের কোড...


// ফিল্টার ইভেন্ট
[searchInput, typeFilter, startDateFilter, endDateFilter].forEach(el => {
    el.addEventListener('input', renderTransactions);
    el.addEventListener('change', renderTransactions);
});

// মডাল খোলার বাটন
addTransactionFab.addEventListener('click', () => openModal('transaction'));
addAccountBtn.addEventListener('click', () => openModal('account'));
addAssetBtn.addEventListener('click', () => openModal('asset'));
addTransferBtn.addEventListener('click', () => openModal('transfer'));
addDebtBtn.addEventListener('click', () => openModal('debt'));
addCategoryBtn.addEventListener('click', () => openModal('category'));
addTagBtn.addEventListener('click', () => openModal('tag'));
addBudgetBtn.addEventListener('click', () => openModal('budget'));
addGoalBtn.addEventListener('click', () => openModal('goal'));
addRecurringBtn.addEventListener('click', () => openModal('recurring'));

// মডাল বন্ধ করার বাটন
document.querySelectorAll('[data-close-modal]').forEach(btn => {
    btn.addEventListener('click', () => btn.closest('dialog').close());
});

// লেনদেন মডালে ক্যাটাগরি পরিবর্তনের ইভেন্ট
document.getElementById('tr-type').addEventListener('change', (e) => {
    populateSelect(document.getElementById('tr-category'), allCategories.filter(c => c.type === e.target.value), 'id', 'name', 'ক্যাটাগরি নির্বাচন করুন');
});
document.getElementById('rec-type').addEventListener('change', (e) => {
    populateSelect(document.getElementById('rec-category'), allCategories.filter(c => c.type === e.target.value), 'id', 'name', 'ক্যাটাগরি নির্বাচন করুন');
});

// রিমাইন্ডার ইনপুট ফিল্ড দেখানো/লুকানো
document.getElementById('debt-reminder-enabled').addEventListener('change', (e) => {
    document.getElementById('debt-reminder-days').style.display = e.target.checked ? 'block' : 'none';
});
document.getElementById('rec-reminder-enabled').addEventListener('change', (e) => {
    document.getElementById('rec-reminder-days').style.display = e.target.checked ? 'block' : 'none';
});
