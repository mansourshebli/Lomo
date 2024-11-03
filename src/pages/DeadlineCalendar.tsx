import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Calendar as CalendarIcon, Plus, X, Check, Clock, Tag, Edit2 } from 'lucide-react';
import { format } from 'date-fns';

interface DeadlineEvent {
  id: string;
  title: string;
  date: string;
  type: 'essay' | 'application' | 'recommendation' | 'test' | 'other';
  status: 'pending' | 'in-progress' | 'completed';
  notes?: string;
}

const eventColors = {
  essay: 'bg-blue-500',
  application: 'bg-purple-500',
  recommendation: 'bg-green-500',
  test: 'bg-yellow-500',
  other: 'bg-gray-500'
};

const statusColors = {
  pending: 'bg-red-500',
  'in-progress': 'bg-yellow-500',
  completed: 'bg-green-500'
};

const DeadlineCalendar: React.FC = () => {
  const [events, setEvents] = useState<DeadlineEvent[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [editingEvent, setEditingEvent] = useState<DeadlineEvent | null>(null);
  const [newEvent, setNewEvent] = useState<Partial<DeadlineEvent>>({
    title: '',
    type: 'essay',
    status: 'pending',
    notes: ''
  });

  useEffect(() => {
    const savedEvents = localStorage.getItem('calendarEvents');
    if (savedEvents) {
      setEvents(JSON.parse(savedEvents));
    }
  }, []);

  const handleDateClick = (arg: { dateStr: string }) => {
    setSelectedDate(arg.dateStr);
    setNewEvent(prev => ({ ...prev, date: arg.dateStr }));
    setEditingEvent(null);
    setShowModal(true);
  };

  const handleEditEvent = (event: DeadlineEvent) => {
    setEditingEvent(event);
    setSelectedDate(event.date);
    setNewEvent({
      title: event.title,
      type: event.type,
      status: event.status,
      notes: event.notes,
      date: event.date
    });
    setShowModal(true);
  };

  const handleSaveEvent = () => {
    if (!newEvent.title || !newEvent.date) return;

    const eventToSave: DeadlineEvent = {
      id: editingEvent ? editingEvent.id : Date.now().toString(),
      title: newEvent.title,
      date: newEvent.date,
      type: newEvent.type as DeadlineEvent['type'],
      status: newEvent.status as DeadlineEvent['status'],
      notes: newEvent.notes
    };

    const updatedEvents = editingEvent
      ? events.map(event => (event.id === editingEvent.id ? eventToSave : event))
      : [...events, eventToSave];

    setEvents(updatedEvents);
    localStorage.setItem('calendarEvents', JSON.stringify(updatedEvents));
    
    setShowModal(false);
    setEditingEvent(null);
    setNewEvent({
      title: '',
      type: 'essay',
      status: 'pending',
      notes: ''
    });
  };

  const handleDeleteEvent = (id: string) => {
    const updatedEvents = events.filter(event => event.id !== id);
    setEvents(updatedEvents);
    localStorage.setItem('calendarEvents', JSON.stringify(updatedEvents));
  };

  const handleUpdateStatus = (id: string, newStatus: DeadlineEvent['status']) => {
    const updatedEvents = events.map(event =>
      event.id === id ? { ...event, status: newStatus } : event
    );
    setEvents(updatedEvents);
    localStorage.setItem('calendarEvents', JSON.stringify(updatedEvents));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold dark:text-white flex items-center">
            <CalendarIcon className="mr-2 text-blue-600 dark:text-blue-400" />
            Application Calendar
          </h1>
          <div className="flex gap-2">
            {Object.entries(eventColors).map(([type, color]) => (
              <div key={type} className="flex items-center">
                <div className={`w-3 h-3 rounded-full ${color} mr-1`}></div>
                <span className="text-sm capitalize dark:text-white">{type}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-3">
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              dateClick={handleDateClick}
              events={events.map(event => ({
                title: event.title,
                date: event.date,
                className: `${eventColors[event.type]} text-white rounded px-2`
              }))}
              headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth'
              }}
              height="auto"
            />
          </div>

          {/* Upcoming Deadlines */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold dark:text-white">Upcoming Deadlines</h2>
            {events
              .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
              .map(event => (
                <div
                  key={event.id}
                  className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold dark:text-white">{event.title}</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditEvent(event)}
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Clock size={14} className="mr-1" />
                    {format(new Date(event.date), 'MMM dd, yyyy')}
                  </div>
                  <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                    <Tag size={14} className="mr-1" />
                    <span className="capitalize">{event.type}</span>
                  </div>
                  <div className="flex gap-2">
                    {(['pending', 'in-progress', 'completed'] as const).map(status => (
                      <button
                        key={status}
                        onClick={() => handleUpdateStatus(event.id, status)}
                        className={`px-2 py-1 rounded text-xs ${
                          event.status === status
                            ? `${statusColors[status]} text-white`
                            : 'bg-gray-200 dark:bg-gray-600'
                        }`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                  {event.notes && (
                    <p className="text-sm text-gray-600 dark:text-gray-300">{event.notes}</p>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Add/Edit Event Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold dark:text-white">
                {editingEvent ? 'Edit Deadline' : 'Add New Deadline'}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingEvent(null);
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-white">Title</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="e.g., Submit Stanford Application"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-white">Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => {
                    setSelectedDate(e.target.value);
                    setNewEvent(prev => ({ ...prev, date: e.target.value }));
                  }}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-white">Type</label>
                <select
                  value={newEvent.type}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, type: e.target.value as DeadlineEvent['type'] }))}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="essay">Essay</option>
                  <option value="application">Application</option>
                  <option value="recommendation">Recommendation</option>
                  <option value="test">Test</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-white">Status</label>
                <select
                  value={newEvent.status}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, status: e.target.value as DeadlineEvent['status'] }))}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 dark:text-white">Notes</label>
                <textarea
                  value={newEvent.notes}
                  onChange={(e) => setNewEvent(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  rows={3}
                  placeholder="Add any additional notes..."
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setEditingEvent(null);
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 dark:text-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEvent}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
                >
                  <Check size={16} className="inline mr-1" />
                  {editingEvent ? 'Update' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeadlineCalendar;