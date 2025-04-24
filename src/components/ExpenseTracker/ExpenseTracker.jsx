import React, { useState, useEffect } from 'react';
import './ExpenseTracker.css';

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem('expenses');
    return saved ? JSON.parse(saved) : [];
  });
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [budget, setBudget] = useState(() => {
    const saved = localStorage.getItem('budget');
    return saved ? parseFloat(saved) : 50000; // Default 50,000 INR
  });
  const [isEditingBudget, setIsEditingBudget] = useState(false);
  const [newBudget, setNewBudget] = useState(budget);

  const categories = ['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Other'];

  // Save expenses to localStorage
  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  // Save budget to localStorage
  useEffect(() => {
    localStorage.setItem('budget', budget.toString());
  }, [budget]);

  const addExpense = (e) => {
    e.preventDefault();
    if (!description || !amount) return;
    
    const newExpense = {
      id: Date.now(),
      description,
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString()
    };
    
    setExpenses([newExpense, ...expenses]);
    setDescription('');
    setAmount('');
    setCategory('Food');
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  };

  const updateBudget = (e) => {
    e.preventDefault();
    setBudget(parseFloat(newBudget));
    setIsEditingBudget(false);
  };

  const cancelBudgetEdit = () => {
    setNewBudget(budget);
    setIsEditingBudget(false);
  };

  // Calculate total spent
  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calculate remaining budget
  const remaining = budget - totalSpent;

  // Calculate category totals
  const categoryTotals = {};
  expenses.forEach(expense => {
    if (!categoryTotals[expense.category]) {
      categoryTotals[expense.category] = 0;
    }
    categoryTotals[expense.category] += expense.amount;
  });

  // Sort categories by total amount
  const topCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  // Get recent expenses (last 3)
  const recentExpenses = expenses.slice(0, 3);

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  return (
    <div className="expense-tracker-container">
      <h2 className="expense-title">Expense Tracker</h2>
      
      <div className="expense-content">
        <div className="expense-summary-panel">
          {/* Budget Overview */}
          <div className="budget-overview">
            <div className="budget-header">
              <span>Budget Overview</span>
              {!isEditingBudget && (
                <button 
                  className="edit-budget-btn" 
                  onClick={() => setIsEditingBudget(true)}
                >
                  Edit
                </button>
              )}
            </div>

            {isEditingBudget ? (
              <form className="budget-form" onSubmit={updateBudget}>
                <input
                  type="number"
                  className="budget-input"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  min="0"
                  step="100"
                  required
                />
                <div className="budget-actions">
                  <button type="submit" className="save-budget-btn">Save</button>
                  <button type="button" className="cancel-budget-btn" onClick={cancelBudgetEdit}>Cancel</button>
                </div>
              </form>
            ) : (
              <div className="budget-stats">
                <div className="budget-stat">
                  <span className="stat-name">Total Budget:</span>
                  <span className="stat-value">{formatCurrency(budget)}</span>
                </div>
                <div className="budget-stat">
                  <span className="stat-name">Spent:</span>
                  <span className="stat-value spent">{formatCurrency(totalSpent)}</span>
                </div>
                <div className="budget-stat">
                  <span className="stat-name">Remaining:</span>
                  <span className={`stat-value ${remaining >= 0 ? 'positive' : 'negative'}`}>
                    {formatCurrency(remaining)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Expense Form */}
          <div className="expense-form-wrapper">
            <form className="expense-form" onSubmit={addExpense}>
              <div className="form-group">
                <input
                  type="text"
                  className="expense-input"
                  placeholder="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
                <input
                  type="number"
                  className="expense-input"
                  placeholder="Amount (₹)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  min="0"
                  step="1"
                  required
                />
              </div>
              <div className="form-actions">
                <select
                  className="category-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <button type="submit" className="expense-button">Add Expense</button>
              </div>
            </form>
          </div>
        </div>

        <div className="expense-data-panels">
          {/* Recent Expenses */}
          <div className="recent-expenses">
            <h3>Recent Expenses</h3>
            <div className="expense-items">
              {recentExpenses.length > 0 ? (
                recentExpenses.map(expense => (
                  <div className="expense-item" key={expense.id}>
                    <div className="expense-info">
                      <div className="expense-description">{expense.description}</div>
                      <div className="expense-meta">
                        <span className="expense-category">{expense.category}</span>
                      </div>
                    </div>
                    <span className="expense-amount">{formatCurrency(expense.amount)}</span>
                    <button
                      className="delete-expense-btn"
                      onClick={() => deleteExpense(expense.id)}
                    >
                      ×
                    </button>
                  </div>
                ))
              ) : (
                <div className="no-expenses">No expenses recorded yet</div>
              )}
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="expense-breakdown">
            <h3>Top Categories</h3>
            <div className="category-items">
              {topCategories.length > 0 ? (
                topCategories.map(([category, total]) => (
                  <div className="category-item" key={category}>
                    <span className="category-name">{category}</span>
                    <span className="category-total">{formatCurrency(total)}</span>
                  </div>
                ))
              ) : (
                <div className="no-data">No category data yet</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTracker; 