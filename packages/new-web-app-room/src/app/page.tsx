'use client';

import { useState } from 'react';
import { ThemeToggle } from './components/ThemeToggle';

export default function CalendarApp() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events, setEvents] = useState<{[key: string]: string[]}>({});
  const [newEvent, setNewEvent] = useState('');
  const [showEventForm, setShowEventForm] = useState(false);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDateKey = (date: Date) => {
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  };

  const navigateMonth = (direction: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
  };

  const selectDate = (day: number) => {
    const selected = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(selected);
    setShowEventForm(true);
  };

  const addEvent = () => {
    if (selectedDate && newEvent.trim()) {
      const dateKey = formatDateKey(selectedDate);
      setEvents(prev => ({
        ...prev,
        [dateKey]: [...(prev[dateKey] || []), newEvent.trim()]
      }));
      setNewEvent('');
      setShowEventForm(false);
    }
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dateKey = formatDateKey(date);
      const dayEvents = events[dateKey] || [];
      const isToday = new Date().toDateString() === date.toDateString();

      days.push(
        <div
          key={day}
          className={`h-24 border border-gray-200 dark:border-gray-600 p-1 cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-900/20 bg-white dark:bg-gray-800 transition-colors ${
            isToday ? 'bg-blue-100 dark:bg-blue-900/40' : ''
          }`}
          onClick={() => selectDate(day)}
        >
          <div className={`font-semibold ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-900 dark:text-gray-100'}`}>
            {day}
          </div>
          <div className="text-xs mt-1">
            {dayEvents.slice(0, 2).map((event, index) => (
              <div key={index} className="bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200 px-1 rounded mb-1 truncate">
                {event}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-gray-500 dark:text-gray-400">+{dayEvents.length - 2} more</div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 transition-colors duration-200">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">Calendar App</h1>
          <ThemeToggle />
        </div>
        
        {/* Calendar Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 transition-colors duration-200">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => navigateMonth(-1)}
              className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
            >
              ← Previous
            </button>
            <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <button
              onClick={() => navigateMonth(1)}
              className="px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
            >
              Next →
            </button>
          </div>

          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-0 mb-2">
            {daysOfWeek.map(day => (
              <div key={day} className="p-2 text-center font-semibold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-0 border border-gray-200 dark:border-gray-600">
            {renderCalendarDays()}
          </div>
        </div>

        {/* Event Form Modal */}
        {showEventForm && selectedDate && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-96 max-w-90vw transition-colors duration-200">
              <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">
                Add Event for {selectedDate.toLocaleDateString()}
              </h3>
              <input
                type="text"
                value={newEvent}
                onChange={(e) => setNewEvent(e.target.value)}
                placeholder="Enter event description"
                className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                onKeyPress={(e) => e.key === 'Enter' && addEvent()}
              />
              <div className="flex gap-3">
                <button
                  onClick={addEvent}
                  className="flex-1 px-4 py-2 bg-blue-500 dark:bg-blue-600 text-white rounded hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors"
                >
                  Add Event
                </button>
                <button
                  onClick={() => {
                    setShowEventForm(false);
                    setNewEvent('');
                  }}
                  className="flex-1 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
              </div>

              {/* Show existing events for this date */}
              {events[formatDateKey(selectedDate)]?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                  <h4 className="font-semibold mb-2 text-gray-900 dark:text-gray-100">Existing Events:</h4>
                  {events[formatDateKey(selectedDate)].map((event, index) => (
                    <div key={index} className="bg-gray-100 dark:bg-gray-700 p-2 rounded mb-2 text-gray-900 dark:text-gray-100">
                      {event}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}













