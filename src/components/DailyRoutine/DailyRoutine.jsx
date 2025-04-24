import { useState, useEffect } from 'react';
import './DailyRoutine.css';

const DailyRoutine = () => {
  const [routines, setRoutines] = useState(() => {
    const savedRoutines = localStorage.getItem('routines');
    return savedRoutines ? JSON.parse(savedRoutines) : [
      { id: 1, name: 'Morning Exercise', completed: false, time: '06:00' },
      { id: 2, name: 'Meditation', completed: false, time: '07:00' },
      { id: 3, name: 'Read Book', completed: false, time: '21:00' }
    ];
  });
  
  const [newRoutine, setNewRoutine] = useState('');
  const [routineTime, setRoutineTime] = useState('08:00');
  const [showForm, setShowForm] = useState(false);
  
  // Save routines to localStorage
  useEffect(() => {
    localStorage.setItem('routines', JSON.stringify(routines));
  }, [routines]);
  
  const addRoutine = (e) => {
    e.preventDefault();
    if (newRoutine.trim() === '') return;
    
    const routine = {
      id: Date.now(),
      name: newRoutine,
      completed: false,
      time: routineTime
    };
    
    setRoutines([...routines, routine]);
    setNewRoutine('');
    setRoutineTime('08:00');
    setShowForm(false);
  };
  
  const toggleRoutine = (id) => {
    setRoutines(
      routines.map(routine => 
        routine.id === id ? { ...routine, completed: !routine.completed } : routine
      )
    );
  };
  
  const deleteRoutine = (id) => {
    setRoutines(routines.filter(routine => routine.id !== id));
  };
  
  // Sort routines by time
  const sortedRoutines = [...routines].sort((a, b) => {
    return a.time.localeCompare(b.time);
  });
  
  // Get completion percentage
  const completionPercentage = routines.length 
    ? Math.round((routines.filter(routine => routine.completed).length / routines.length) * 100) 
    : 0;
  
  return (
    <div className="routine-container">
      <div className="routine-header">
        <h2 className="routine-title">Daily Routine</h2>
        <button 
          className="add-routine-toggle" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+'}
        </button>
      </div>
      
      {showForm ? (
        <form className="routine-form" onSubmit={addRoutine}>
          <input
            type="text"
            className="routine-input"
            placeholder="New routine..."
            value={newRoutine}
            onChange={(e) => setNewRoutine(e.target.value)}
          />
          <div className="form-actions">
            <input
              type="time"
              className="time-input"
              value={routineTime}
              onChange={(e) => setRoutineTime(e.target.value)}
            />
            <button type="submit" className="routine-button">Add</button>
          </div>
        </form>
      ) : (
        <div className="progress-container">
          <div className="progress-text">
            Today's Progress: <span className="percentage">{completionPercentage}%</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {/* Scroll indicator for when more than 2 routines exist */}
      {sortedRoutines.length > 2 && (
        <div className="scroll-indicator">
          <span>{sortedRoutines.length} routines</span>
          <span className="scroll-icon">↓</span>
        </div>
      )}
      
      <div className="routines-list">
        {sortedRoutines.length > 0 ? (
          sortedRoutines.map(routine => (
            <div 
              key={routine.id} 
              className={`routine-item ${routine.completed ? 'completed' : ''}`}
            >
              <div className="routine-left">
                <input
                  type="checkbox"
                  className="routine-checkbox"
                  checked={routine.completed}
                  onChange={() => toggleRoutine(routine.id)}
                />
                <div className="routine-details">
                  <span className="routine-name">{routine.name}</span>
                  <span className="routine-time">{routine.time}</span>
                </div>
              </div>
              <button 
                className="delete-routine-btn"
                onClick={() => deleteRoutine(routine.id)}
              >
                ×
              </button>
            </div>
          ))
        ) : (
          <div className="empty-routine">No routines added yet</div>
        )}
      </div>
    </div>
  );
};

export default DailyRoutine; 