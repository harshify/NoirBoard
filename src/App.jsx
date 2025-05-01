import { useState, useEffect } from 'react'
import './App.css'
import Clock from './components/Clock/Clock'
import TodoList from './components/TodoList/TodoList'
import GoalSetter from './components/GoalSetter/GoalSetter'
import ExpenseTracker from './components/ExpenseTracker/ExpenseTracker'
import Weather from './components/Weather/Weather'
import DailyRoutine from './components/DailyRoutine/DailyRoutine'
import FutureEvents from './components/FutureEvents/FutureEvents'
import { getStorageItem, setStorageItem } from './utils/storage'

function App() {
  // State to track remaining expenses
  const [remainingAmount, setRemainingAmount] = useState(0);
  const [totalBudget, setTotalBudget] = useState(50000);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize data from storage
  useEffect(() => {
    const initializeData = async () => {
      // Get initial remaining amount from storage if available
      const budget = await getStorageItem('budget', 50000);
      const expenses = await getStorageItem('expenses', []);
      
      setTotalBudget(budget);
      const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
      setRemainingAmount(budget - totalSpent);
      setIsLoading(false);
    };

    initializeData();
  }, []);

  // Listen for changes in storage and update the remaining amount
  useEffect(() => {
    if (isLoading) return;

    const checkStorageChanges = async () => {
      const budget = await getStorageItem('budget', 50000);
      setTotalBudget(budget);
      
      const expenses = await getStorageItem('expenses', []);
      const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
      setRemainingAmount(budget - totalSpent);
    };

    // Set up interval to check for changes
    const interval = setInterval(checkStorageChanges, 1000);

    // Clean up interval on unmount
    return () => clearInterval(interval);
  }, [isLoading]);

  // Format currency display
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Determine color status based on percentage of budget remaining
  const getAmountColorStatus = () => {
    if (remainingAmount < 0) return 'negative';
    
    const percentRemaining = (remainingAmount / totalBudget) * 100;
    
    if (percentRemaining > 75) return 'positive'; // > 75% - Green
    if (percentRemaining > 50) return 'warning'; // 50-75% - Yellow
    if (percentRemaining > 25) return 'caution'; // 25-50% - Orange
    return 'danger'; // < 25% - Red
  };

  // Create floating particles on component mount
  useEffect(() => {
    const particleContainer = document.querySelector('.floating-particles');
    if (!particleContainer) return;

    // Generate random number of particles between 15 and 25
    const particleCount = Math.floor(Math.random() * 10) + 15;
    
    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      
      // Random size between 3px and 10px
      const size = Math.random() * 7 + 3;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      
      // Random starting position
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      particle.style.left = `${left}%`;
      particle.style.top = `${top}%`;
      
      // Random animation duration between 15s and 40s
      const duration = Math.random() * 25 + 15;
      particle.style.animationDuration = `${duration}s`;
      
      // Random animation delay
      const delay = Math.random() * 10;
      particle.style.animationDelay = `${delay}s`;
      
      particleContainer.appendChild(particle);
    }
    
    // Clean up particles on unmount
    return () => {
      if (particleContainer) {
        particleContainer.innerHTML = '';
      }
    };
  }, []);

  if (isLoading) {
    return (
      <div className="app-container loading">
        <div className="loading-spinner"></div>
        <p>Loading NoirBoard...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="floating-particles"></div>
      
      <header className="header">
        <div className="header-left">
          <h1>NoirBoard</h1>
          <p className="tagline">Your productivity dashboard</p>
        </div>
        <div className="header-center">
          <Clock />
        </div>
        <div className="header-right">
          <div className="remaining-amount">
            <span className="remaining-label">Remaining Amount left this month</span>
            <span className={`remaining-value ${getAmountColorStatus()}`}>
              {formatCurrency(remainingAmount)}
            </span>
          </div>
        </div>
      </header>
      
      <main className="bento-grid">
        {/* Top row - Weather and Daily Routine */}
        <div className="grid-item grid-item-weather">
          <Weather />
        </div>
        
        <div className="grid-item grid-item-daily-routine">
          <DailyRoutine />
        </div>
        
        {/* Middle row - Todo List, Events and Goal Setter (all same height) */}
        <div className="grid-item grid-item-todos">
          <TodoList />
        </div>
        
        <div className="grid-item grid-item-events">
          <FutureEvents />
        </div>
        
        <div className="grid-item grid-item-goals">
          <GoalSetter />
        </div>
        
        {/* Bottom row - Expense Tracker */}
        <div className="grid-item grid-item-expense-tracker">
          <ExpenseTracker />
        </div>
      </main>
      
      <footer className="footer">
        <p>© {new Date().getFullYear()} NoirBoard | <a href="https://github.com/harshify" target="_blank" rel="noopener noreferrer">harshify</a></p>
      </footer>
    </div>
  )
}

export default App


