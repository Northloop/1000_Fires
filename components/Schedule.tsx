
import React, { useState } from 'react';
import { Calendar as CalendarIcon, MapPin, Clock, Filter, Star, Plus, Edit2, Trash2, X, Info } from 'lucide-react';
import { MOCK_EVENTS, MOCK_CAMPS } from '../constants';
import { EventItem, UserRole } from '../types';
import { useUser } from '../context/UserContext';

const Schedule: React.FC = () => {
  const { user, activeMembership, checkPermission } = useUser();
  const [events, setEvents] = useState<EventItem[]>(MOCK_EVENTS);
  const [filter, setFilter] = useState('ALL');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);
  
  // Permissions
  const isOrganizer = activeMembership?.role === UserRole.EVENT_ORGANIZER;
  const isCampLead = activeMembership?.role === UserRole.CAMP_LEAD;
  const canCreate = isOrganizer || isCampLead;
  
  // Helper: Can user edit THIS specific event?
  const canEditEvent = (evt: EventItem) => {
      if (isOrganizer) return true;
      if (isCampLead && evt.campId === activeMembership?.entityId) return true;
      return false;
  };

  const getEventColor = (type: string) => {
    switch(type) {
      case 'MUSIC': return 'border-l-purple-500';
      case 'WORKSHOP': return 'border-l-blue-500';
      case 'FOOD': return 'border-l-green-500';
      case 'PERFORMANCE': return 'border-l-red-500';
      default: return 'border-l-gray-500';
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleSaveEvent = (evt: EventItem) => {
      if (editingEvent) {
          // Update
          setEvents(events.map(e => e.id === evt.id ? evt : e));
      } else {
          // Create
          setEvents([...events, { ...evt, id: `new-${Date.now()}` }]);
      }
      setIsModalOpen(false);
      setEditingEvent(null);
  };

  const handleDeleteEvent = (id: string) => {
      if (confirm('Are you sure you want to delete this event?')) {
          setEvents(events.filter(e => e.id !== id));
      }
  };

  const openCreateModal = () => {
      setEditingEvent(null); // Clear editing state
      setIsModalOpen(true);
  };

  const openEditModal = (evt: EventItem) => {
      setEditingEvent(evt);
      setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Event Schedule</h1>
          <p className="text-gray-400">Discover what's happening on the event grounds.</p>
        </div>
        
        <div className="flex items-center gap-3">
            {canCreate && (
                <button 
                    onClick={openCreateModal}
                    className="bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-lg font-bold flex items-center shadow-lg shadow-brand-900/50"
                >
                    <Plus className="w-5 h-5 mr-2" /> Add Event
                </button>
            )}
            <div className="flex bg-night-800 rounded-lg p-1 border border-white/5">
            <button 
                onClick={() => setFilter('ALL')}
                className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${filter === 'ALL' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
            >
                All
            </button>
            <button 
                onClick={() => setFilter('FAVORITES')}
                className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${filter === 'FAVORITES' ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white'}`}
            >
                My Schedule
            </button>
            </div>
        </div>
      </div>

      {/* Days Scroller */}
      <div className="flex space-x-2 overflow-x-auto pb-2">
        {['Wed 2', 'Thu 3', 'Fri 4', 'Sat 5', 'Sun 6'].map((day, i) => (
          <button 
            key={i} 
            className={`
              flex-shrink-0 w-20 h-20 rounded-xl flex flex-col items-center justify-center border transition-all
              ${i === 0 
                ? 'bg-brand-600 border-brand-500 text-white shadow-lg shadow-brand-900/50' 
                : 'bg-night-800 border-white/5 text-gray-400 hover:border-white/20 hover:text-white'}
            `}
          >
            <span className="text-sm font-medium">{day.split(' ')[0]}</span>
            <span className="text-2xl font-bold">{day.split(' ')[1]}</span>
          </button>
        ))}
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {events.map((event) => (
          <div 
            key={event.id}
            className={`
              bg-night-800 rounded-xl p-5 border border-white/5 hover:border-white/10 transition-all group relative
              border-l-4 ${getEventColor(event.type)}
            `}
          >
            <div className="flex justify-between items-start">
              <div>
                <span className="inline-block px-2 py-0.5 rounded bg-white/5 text-xs text-gray-400 border border-white/10 mb-2">
                  {event.type}
                </span>
                <h3 className="text-xl font-bold text-white group-hover:text-brand-400 transition-colors">
                  {event.title}
                </h3>
                <p className="text-brand-200 text-sm mt-1">Hosted by {event.host}</p>
                {event.description && <p className="text-gray-500 text-sm mt-2 max-w-2xl">{event.description}</p>}
              </div>
              <div className="flex gap-2">
                 {canEditEvent(event) && (
                     <>
                        <button onClick={() => openEditModal(event)} className="p-2 text-gray-500 hover:text-white bg-white/5 rounded-lg">
                            <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDeleteEvent(event.id)} className="p-2 text-gray-500 hover:text-red-500 bg-white/5 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                        </button>
                     </>
                 )}
                 <button className="text-gray-600 hover:text-yellow-400 transition-colors p-2">
                    <Star className="w-6 h-6" />
                 </button>
              </div>
            </div>
            
            <div className="flex items-center mt-4 space-x-6 text-sm text-gray-400">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {formatDate(event.startTime)} {event.endTime ? `- ${formatDate(event.endTime)}` : ''}
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                {event.location}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CRUD Modal */}
      {isModalOpen && (
          <EventModal 
            isOpen={isModalOpen} 
            onClose={() => setIsModalOpen(false)} 
            onSave={handleSaveEvent} 
            initialData={editingEvent}
            currentUserRole={activeMembership?.role}
            currentUserEntityId={activeMembership?.entityId}
            currentUserEntityName={activeMembership?.entityName}
          />
      )}
    </div>
  );
};

// --- Sub-Component: Event Modal ---
interface EventModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (evt: EventItem) => void;
    initialData: EventItem | null;
    currentUserRole?: UserRole;
    currentUserEntityId?: string;
    currentUserEntityName?: string;
}

const EventModal: React.FC<EventModalProps> = ({ isOpen, onClose, onSave, initialData, currentUserRole, currentUserEntityId, currentUserEntityName }) => {
    const isCampLead = currentUserRole === UserRole.CAMP_LEAD;
    
    // Initial State Setup
    const [formData, setFormData] = useState<Partial<EventItem>>(initialData || {
        title: '',
        description: '',
        type: 'WORKSHOP',
        location: isCampLead ? 'My Camp' : '', // Default to Camp if lead
        startTime: '2026-10-02T12:00',
        endTime: '2026-10-02T13:00',
        host: isCampLead ? (currentUserEntityName || '') : '', // Lock host for camp leads
        campId: isCampLead ? currentUserEntityId : undefined
    });

    const handleChange = (field: keyof EventItem, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData as EventItem);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-night-800 rounded-xl border border-white/10 w-full max-w-lg shadow-2xl overflow-hidden">
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
                    <h2 className="text-xl font-bold text-white">{initialData ? 'Edit Event' : 'Create New Event'}</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
                    
                    <div>
                        <label className="block text-xs text-gray-400 uppercase font-bold mb-1">Event Title</label>
                        <input 
                            required
                            type="text" 
                            value={formData.title} 
                            onChange={(e) => handleChange('title', e.target.value)}
                            className="w-full bg-night-900 border border-white/10 rounded-lg p-3 text-white focus:border-brand-500 outline-none"
                            placeholder="e.g. Sunrise Yoga"
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-gray-400 uppercase font-bold mb-1">Description</label>
                        <textarea 
                            rows={3}
                            value={formData.description} 
                            onChange={(e) => handleChange('description', e.target.value)}
                            className="w-full bg-night-900 border border-white/10 rounded-lg p-3 text-white focus:border-brand-500 outline-none resize-none"
                            placeholder="What can participants expect?"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-gray-400 uppercase font-bold mb-1">Type</label>
                            <select 
                                value={formData.type} 
                                onChange={(e) => handleChange('type', e.target.value)}
                                className="w-full bg-night-900 border border-white/10 rounded-lg p-3 text-white focus:border-brand-500 outline-none"
                            >
                                <option value="WORKSHOP">Workshop</option>
                                <option value="MUSIC">Music</option>
                                <option value="FOOD">Food</option>
                                <option value="PERFORMANCE">Performance</option>
                            </select>
                        </div>
                        <div>
                             <label className="block text-xs text-gray-400 uppercase font-bold mb-1">Host</label>
                             <input 
                                type="text"
                                value={formData.host}
                                disabled={isCampLead} // Lock for camp leads
                                onChange={(e) => handleChange('host', e.target.value)}
                                className={`w-full bg-night-900 border border-white/10 rounded-lg p-3 text-white focus:border-brand-500 outline-none ${isCampLead ? 'opacity-50 cursor-not-allowed' : ''}`}
                             />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-gray-400 uppercase font-bold mb-1">Start Time</label>
                            <input 
                                type="datetime-local"
                                value={formData.startTime}
                                onChange={(e) => handleChange('startTime', e.target.value)}
                                className="w-full bg-night-900 border border-white/10 rounded-lg p-3 text-white focus:border-brand-500 outline-none text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs text-gray-400 uppercase font-bold mb-1">End Time</label>
                            <input 
                                type="datetime-local"
                                value={formData.endTime}
                                onChange={(e) => handleChange('endTime', e.target.value)}
                                className="w-full bg-night-900 border border-white/10 rounded-lg p-3 text-white focus:border-brand-500 outline-none text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs text-gray-400 uppercase font-bold mb-1">Location</label>
                        <input 
                            type="text" 
                            value={formData.location} 
                            onChange={(e) => handleChange('location', e.target.value)}
                            className="w-full bg-night-900 border border-white/10 rounded-lg p-3 text-white focus:border-brand-500 outline-none"
                            placeholder="e.g. 4:30 & C"
                        />
                    </div>

                    <div className="pt-4 flex gap-3">
                        <button type="button" onClick={onClose} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-lg border border-white/10 font-medium transition-colors">
                            Cancel
                        </button>
                        <button type="submit" className="flex-1 py-3 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-bold transition-colors">
                            {initialData ? 'Update Event' : 'Create Event'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default Schedule;