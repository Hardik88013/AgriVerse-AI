import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import api from '../services/api';

const NotificationDropdown = () => {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/notifications/');
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications");
    }
  };

  // Poll for notifications every minute
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="relative p-2 text-gray-500 hover:text-primary transition-colors focus:outline-none">
        <Bell size={24} />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-3 w-3 bg-red-500 rounded-full border-2 border-white"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-100 overflow-hidden z-50">
          <div className="bg-gray-50 px-4 py-3 border-b flex justify-between items-center">
            <h3 className="text-sm font-bold text-gray-700">Notifications</h3>
            {unreadCount > 0 && <span className="text-xs bg-primary text-white px-2 py-1 rounded-full">{unreadCount} New</span>}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-center text-sm text-gray-500 py-6">No notifications</p>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif.id} 
                  onClick={() => markAsRead(notif.id)}
                  className={`p-4 border-b cursor-pointer transition-colors ${notif.isRead ? 'bg-white opacity-60' : 'bg-blue-50 hover:bg-blue-100'}`}
                >
                  <p className="text-sm font-semibold text-gray-800">{notif.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{notif.message}</p>
                  <p className="text-xs text-gray-400 mt-2">{new Date(notif.createdAt).toLocaleTimeString()}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
