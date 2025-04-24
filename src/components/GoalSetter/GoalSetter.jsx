import { useState, useEffect } from 'react';
import './GoalSetter.css';

const GoalSetter = () => {
  const [goals, setGoals] = useState(() => {
    const savedGoals = localStorage.getItem('goals');
    return savedGoals ? JSON.parse(savedGoals) : [];
  });
  
  const [newGoal, setNewGoal] = useState('');
  const [deadline, setDeadline] = useState('');
  const [activeGoalId, setActiveGoalId] = useState(() => {
    const savedActiveGoalId = localStorage.getItem('activeGoalId');
    return savedActiveGoalId || null;
  });

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('activeGoalId', activeGoalId);
  }, [activeGoalId]);

  const addGoal = (e) => {
    e.preventDefault();
    if (newGoal.trim() === '' || !deadline) return;
    
    const goal = {
      id: Date.now(),
      text: newGoal,
      deadline: deadline,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    setGoals([...goals, goal]);
    setNewGoal('');
    setDeadline('');
    
    // If there's no active goal, set this one as active
    if (!activeGoalId) {
      setActiveGoalId(goal.id);
    }
  };

  const deleteGoal = (id) => {
    setGoals(goals.filter(goal => goal.id !== id));
    if (activeGoalId === id) {
      setActiveGoalId(goals.length > 1 ? goals[0].id : null);
    }
  };

  const toggleComplete = (id) => {
    setGoals(
      goals.map(goal => 
        goal.id === id ? { ...goal, completed: !goal.completed } : goal
      )
    );
  };

  const setAsActive = (id) => {
    setActiveGoalId(id);
  };

  const activeGoal = goals.find(goal => goal.id === parseInt(activeGoalId));

  return (
    <div className="goal-setter-container">
      <div className="goal-header">
        <h2 className="goal-title">Goal Setter</h2>
      </div>
      
      {activeGoal && (
        <div className="active-goal">
          <h3>Current Goal</h3>
          <div className="goal-card">
            <p className="goal-text">{activeGoal.text}</p>
            <p className="goal-deadline">
              Deadline: {new Date(activeGoal.deadline).toLocaleDateString()}
            </p>
            <div className="goal-actions">
              <button 
                className={`complete-btn ${activeGoal.completed ? 'completed' : ''}`}
                onClick={() => toggleComplete(activeGoal.id)}
              >
                {activeGoal.completed ? 'Completed' : 'Mark Complete'}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <form className="goal-form" onSubmit={addGoal}>
        <input
          type="text"
          className="goal-input"
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          placeholder="Enter your goal..."
        />
        <input
          type="date"
          className="deadline-input"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />
        <button type="submit" className="goal-button">Add Goal</button>
      </form>
      
      {goals.length > 0 && (
        <div className="goals-list">
          <h3>All Goals</h3>
          {goals.map(goal => (
            <div 
              key={goal.id} 
              className={`goal-item ${goal.completed ? 'completed' : ''} ${goal.id === parseInt(activeGoalId) ? 'active' : ''}`}
            >
              <div className="goal-content">
                <p className="goal-text">{goal.text}</p>
                <p className="goal-deadline">
                  Due: {new Date(goal.deadline).toLocaleDateString()}
                </p>
              </div>
              <div className="goal-item-actions">
                <button 
                  className="set-active-btn"
                  onClick={() => setAsActive(goal.id)}
                  disabled={goal.id === parseInt(activeGoalId)}
                >
                  {goal.id === parseInt(activeGoalId) ? 'Active' : 'Set Active'}
                </button>
                <button 
                  className="delete-goal-btn"
                  onClick={() => deleteGoal(goal.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default GoalSetter; 