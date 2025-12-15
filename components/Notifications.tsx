import React, { useState, useRef, useEffect } from 'react';
import { Bell, Calendar, Clock, AlertCircle, Trash2, X, Info } from 'lucide-react';

export interface Notification {
  id: string;
  type: 'CLASS' | 'DEADLINE' | 'ANNOUNCEMENT' | 'SYSTEM';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: '1',
    type: 'CLASS',
    title: 'Physics Class Starting',
    message: 'HSC Physics: Thermodynamics with Dr. Ahmed starts in 10 minutes.',
    time: 'Now',
    read: false
  },
  {
    id: '2',
    type: 'DEADLINE',
    title: 'Assignment Due Soon',
    message: 'Math: Calculus Integration Worksheet is due tonight at 11:59 PM.',
    time: '2h remaining',
    read: false
  },
  {
    id: '3',
    type: 'ANNOUNCEMENT',
    title: 'Exam Schedule Released',
    message: 'The schedule for the upcoming term finals has been published.',
    time: '2 hours ago',
    read: true
  },
  {
    id: '4',
    type: 'SYSTEM',
    title: 'Maintenance Update',
    message: 'Platform scheduled for brief maintenance on Saturday at 2 AM.',
    time: '1 day ago',
    read: true
  }
];

export const Notifications: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 relative transition-colors rounded-full hover:bg-slate-800 ${isOpen ? 'text-white bg-slate-800' : 'text-slate-400 hover:text-white'}`}
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center text-white border-2 border-[#0f172a] animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-14 w-80 md:w-96 bg-[#1e293b] border border-slate-700 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in origin-top-right backdrop-blur-xl">
          <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
            <h3 className="font-bold text-white flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-400" /> Notifications
              {unreadCount > 0 && <span className="bg-blue-600 text-xs px-2 py-0.5 rounded-full text-white">{unreadCount} New</span>}
            </h3>
            <div className="flex gap-2">
               {unreadCount > 0 && (
                   <button onClick={markAllAsRead} className="text-xs text-blue-400 hover:text-blue-300 font-medium" title="Mark all as read">
                     Mark all read
                   </button>
               )}
                <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-700 rounded-lg">
                  <X className="w-4 h-4" />
                </button>
            </div>
          </div>

          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {notifications.length > 0 ? (
              <div className="divide-y divide-slate-700/50">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    onClick={() => markAsRead(notif.id)}
                    className={`p-4 hover:bg-slate-800/50 transition-colors cursor-pointer group relative ${!notif.read ? 'bg-blue-500/5' : ''}`}
                  >
                    <div className="flex gap-3">
                      <div className={`mt-1 p-2 rounded-xl flex-shrink-0 h-fit ${
                        notif.type === 'CLASS' ? 'bg-blue-500/20 text-blue-400' :
                        notif.type === 'DEADLINE' ? 'bg-red-500/20 text-red-400' :
                        notif.type === 'ANNOUNCEMENT' ? 'bg-amber-500/20 text-amber-400' :
                        'bg-slate-700 text-slate-400'
                      }`}>
                        {notif.type === 'CLASS' && <Clock className="w-4 h-4" />}
                        {notif.type === 'DEADLINE' && <AlertCircle className="w-4 h-4" />}
                        {notif.type === 'ANNOUNCEMENT' && <Calendar className="w-4 h-4" />}
                        {notif.type === 'SYSTEM' && <Info className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1 gap-2">
                            <h4 className={`text-sm font-bold leading-tight truncate ${!notif.read ? 'text-white' : 'text-slate-300'}`}>{notif.title}</h4>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <span className="text-[10px] font-bold text-slate-500">{notif.time}</span>
                                {!notif.read && <span className="w-2 h-2 bg-blue-500 rounded-full"></span>}
                            </div>
                        </div>
                        <p className="text-xs text-slate-400 mb-2 leading-relaxed line-clamp-2">{notif.message}</p>
                        
                        <div className="flex justify-end opacity-0 group-hover:opacity-100 transition-opacity gap-2">
                           <button onClick={(e) => deleteNotification(notif.id, e)} className="p-1 text-slate-500 hover:text-red-400 rounded hover:bg-slate-700/50" title="Remove">
                               <Trash2 className="w-3 h-3" />
                           </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-slate-500">
                <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="text-sm">No new notifications</p>
              </div>
            )}
          </div>
          
          <div className="p-3 border-t border-slate-700 bg-slate-800/30 text-center flex justify-center items-center">
            <button className="text-xs font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-1">
                View All Notification History
            </button>
          </div>
        </div>
      )}
    </div>
  );
};