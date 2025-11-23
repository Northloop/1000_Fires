import React, { useState } from 'react';
import { Calendar as CalendarIcon, MapPin, Clock, Filter, Star } from 'lucide-react';
import { MOCK_EVENTS } from '../constants';

const Schedule: React.FC = () => {
  const [filter, setFilter] = useState('ALL');

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

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Event Schedule</h1>
          <p className="text-gray-400">Discover what's happening on the event grounds.</p>
        </div>
        
        <div className="flex bg-night-800 rounded-lg p-1 border border-white/5">
          <button 
            onClick={() => setFilter('ALL')}
            className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${filter === 'ALL' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            All
          </button>
          <button 
            onClick={() => setFilter('FAVORITES')}
            className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${filter === 'FAVORITES' ? 'bg-brand-600 text-white' : 'text-gray-400 hover:text-white'}`}
          >
            My Schedule
          </button>
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
        {MOCK_EVENTS.map((event) => (
          <div 
            key={event.id}
            className={`
              bg-night-800 rounded-xl p-5 border border-white/5 hover:border-white/10 transition-all group
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
              </div>
              <button className="text-gray-600 hover:text-yellow-400 transition-colors">
                <Star className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex items-center mt-4 space-x-6 text-sm text-gray-400">
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                {formatDate(event.startTime)}
              </div>
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                {event.location}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Schedule;