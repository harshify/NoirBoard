import React, { useState, useEffect } from 'react';
import './FutureEvents.css';

const FutureEvents = () => {
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('futureEvents');
    return saved ? JSON.parse(saved) : [];
  });
  const [newEvent, setNewEvent] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  
  // Save events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('futureEvents', JSON.stringify(events));
  }, [events]);

  // Check for events that have passed and remove them
  useEffect(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const filteredEvents = events.filter(event => {
      const eventDay = new Date(event.date);
      return eventDay >= today;
    });
    
    if (filteredEvents.length !== events.length) {
      setEvents(filteredEvents);
    }
  }, [events]);

  // Calculate days remaining for each event
  const calculateDaysRemaining = (dateString) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const eventDate = new Date(dateString);
    eventDate.setHours(0, 0, 0, 0);
    
    const timeDiff = eventDate - today;
    const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
    
    return daysDiff;
  };

  // Add new event
  const addEvent = (e) => {
    e.preventDefault();
    
    if (!newEvent.trim() || !eventDate) return;
    
    const newEventObj = {
      id: Date.now(),
      title: newEvent,
      date: eventDate
    };
    
    setEvents([...events, newEventObj]);
    setNewEvent('');
    setEventDate('');
    setIsFormVisible(false);
  };

  // Complete/delete event
  const completeEvent = (id) => {
    setEvents(events.filter(event => event.id !== id));
  };

  // Toggle form visibility
  const toggleForm = () => {
    setIsFormVisible(!isFormVisible);
  };

  // Sort events by date (closest first)
  const sortedEvents = [...events].sort((a, b) => 
    new Date(a.date) - new Date(b.date)
  );

  return (
    <div className="future-events-container">
      <div className="future-events-header">
        <h2 className="future-events-title">Important Upcoming Events</h2>
        <button 
          className="add-event-toggle"
          onClick={toggleForm}
        >
          {isFormVisible ? '×' : '+'}
        </button>
      </div>
      
      <div className="events-list-container">
        {isFormVisible && (
          <div className="event-form-overlay">
            <form className="event-form" onSubmit={addEvent}>
              <input
                type="text"
                className="event-input"
                placeholder="Event title"
                value={newEvent}
                onChange={(e) => setNewEvent(e.target.value)}
                required
              />
              <input
                type="date"
                className="event-date-input"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                required
              />
              <div className="form-actions">
                <button type="submit" className="add-event-btn">Add Event</button>
                <button type="button" className="cancel-btn" onClick={toggleForm}>Cancel</button>
              </div>
            </form>
          </div>
        )}
        
        <div className="events-list">
          {sortedEvents.length > 0 ? (
            sortedEvents.map(event => {
              const daysRemaining = calculateDaysRemaining(event.date);
              const isUrgent = daysRemaining <= 1;
              
              return (
                <div 
                  key={event.id} 
                  className={`event-item ${isUrgent ? 'urgent' : ''}`}
                  onClick={() => completeEvent(event.id)}
                >
                  <div className="event-details">
                    <div className="event-title">{event.title}</div>
                    <div className="event-date">
                      {new Date(event.date).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                  <div className={`days-remaining ${isUrgent ? 'urgent' : ''}`}>
                    {daysRemaining === 0 
                      ? 'Today!' 
                      : daysRemaining === 1 
                        ? 'Tomorrow!' 
                        : `${daysRemaining} days left`}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="empty-events">No upcoming events</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FutureEvents; 