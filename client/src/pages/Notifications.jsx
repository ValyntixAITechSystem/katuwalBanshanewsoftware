// // src/pages/Notifications.jsx
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { getNotifications, markAsRead, markAllAsRead, deleteNotification } from '../api/notifications';
// import Button from '../components/Button';
// import { formatDistanceToNow } from 'date-fns';
// import { CheckIcon, TrashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
// import { BellIcon } from '@heroicons/react/24/outline';

// const Notifications = () => {
//   const queryClient = useQueryClient();
//   const { data, isLoading } = useQuery({
//     queryKey: ['notifications'],
//     queryFn: () => getNotifications({ limit: 50 }),
//   });

//   const markAsReadMutation = useMutation({
//     mutationFn: markAsRead,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['notifications'] });
//     },
//   });

//   const markAllAsReadMutation = useMutation({
//     mutationFn: markAllAsRead,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['notifications'] });
//     },
//   });

//   const deleteMutation = useMutation({
//     mutationFn: deleteNotification,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['notifications'] });
//     },
//   });

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
//       </div>
//     );
//   }

//   const notifications = data?.data || [];

//   return (
//     <div className="space-y-6">
//       <div className="flex justify-between items-center">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
//           <p className="text-gray-600">Stay updated with latest activities</p>
//         </div>
//         <div className="flex space-x-2">
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => markAllAsReadMutation.mutate()}
//           >
//             <CheckCircleIcon className="h-4 w-4 mr-1" />
//             Mark All Read
//           </Button>
//         </div>
//       </div>

//       <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
//         {notifications.length === 0 ? (
//           <div className="text-center py-12 text-gray-500">
//             <BellIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
//             <p>No notifications</p>
//           </div>
//         ) : (
//           notifications.map((notification) => (
//             <div
//               key={notification._id}
//               className={`p-4 flex items-start justify-between hover:bg-gray-50 transition-colors ${
//                 !notification.isRead ? 'bg-blue-50' : ''
//               }`}
//             >
//               <div className="flex-1">
//                 <div className="flex items-center space-x-2">
//                   <h4 className="text-sm font-semibold text-gray-900">
//                     {notification.title}
//                   </h4>
//                   {!notification.isRead && (
//                     <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
//                       New
//                     </span>
//                   )}
//                 </div>
//                 <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
//                 <p className="text-xs text-gray-500 mt-2">
//                   {formatDistanceToNow(new Date(notification.createdAt), {
//                     addSuffix: true,
//                   })}
//                 </p>
//               </div>
//               <div className="flex items-center space-x-2 ml-4">
//                 {!notification.isRead && (
//                   <button
//                     onClick={() => markAsReadMutation.mutate(notification._id)}
//                     className="p-1 text-blue-600 hover:text-blue-800"
//                     title="Mark as read"
//                   >
//                     <CheckIcon className="h-5 w-5" />
//                   </button>
//                 )}
//                 <button
//                   onClick={() => deleteMutation.mutate(notification._id)}
//                   className="p-1 text-red-600 hover:text-red-800"
//                   title="Delete"
//                 >
//                   <TrashIcon className="h-5 w-5" />
//                 </button>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default Notifications;



import { useEffect, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getNotifications, markAsRead, markAllAsRead, deleteNotification } from '../api/notifications';
import Button from '../components/Button';
import { formatDistanceToNow } from 'date-fns';
import { CheckIcon, TrashIcon, CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { BellIcon, CurrencyDollarIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { io } from 'socket.io-client';

// Socket.IO connection
const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000');

const Notifications = () => {
  const queryClient = useQueryClient();
  const [notifications, setNotifications] = useState([]);

  // Fetch notifications
  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => getNotifications({ limit: 50 }),
  });

  // Update notifications when data changes
  useEffect(() => {
    if (data?.data) {
      setNotifications(data.data);
    }
  }, [data]);

  // Listen for real-time notifications
  useEffect(() => {
    socket.on('notification:new', (notification) => {
      setNotifications((prev) => [notification, ...prev]);
      // Show browser notification if permitted
      if (Notification.permission === 'granted') {
        new Notification(notification.title, {
          body: notification.message,
          icon: '/favicon.ico',
        });
      }
    });

    socket.on('notification:read', (notification) => {
      setNotifications((prev) =>
        prev.map((n) => (n._id === notification._id ? notification : n))
      );
    });

    socket.on('notification:deleted', ({ id }) => {
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    });

    return () => {
      socket.off('notification:new');
      socket.off('notification:read');
      socket.off('notification:deleted');
    };
  }, []);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  const markAsReadMutation = useMutation({
    mutationFn: markAsRead,
    onSuccess: (updated) => {
      setNotifications((prev) =>
        prev.map((n) => (n._id === updated._id ? updated : n))
      );
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, isRead: true, readAt: new Date() }))
      );
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteNotification,
    onSuccess: (_, id) => {
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    },
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'donation_added':
        return <CurrencyDollarIcon className="h-6 w-6 text-green-500" />;
      case 'member_added':
      case 'member_updated':
        return <UserGroupIcon className="h-6 w-6 text-blue-500" />;
      default:
        return <BellIcon className="h-6 w-6 text-gray-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600">
            Stay updated with latest activities
            {unreadCount > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                {unreadCount} unread
              </span>
            )}
          </p>
        </div>
        <div className="flex space-x-2">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => markAllAsReadMutation.mutate()}
              isLoading={markAllAsReadMutation.isPending}
            >
              <CheckCircleIcon className="h-4 w-4 mr-1" />
              Mark All Read
            </Button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 divide-y divide-gray-200">
        {notifications.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <BellIcon className="h-12 w-12 mx-auto text-gray-300 mb-4" />
            <p>No notifications</p>
            <p className="text-sm mt-1">All caught up!</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div
              key={notification._id}
              className={`p-4 flex items-start justify-between hover:bg-gray-50 transition-colors ${
                !notification.isRead ? 'bg-blue-50 border-l-4 border-blue-500' : ''
              }`}
            >
              <div className="flex items-start space-x-3 flex-1">
                <div className="flex-shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 flex-wrap">
                    <h4 className="text-sm font-semibold text-gray-900">
                      {notification.title}
                    </h4>
                    {!notification.isRead && (
                      <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mt-1 break-words">
                    {notification.message}
                  </p>
                  <div className="flex items-center space-x-4 mt-2">
                    <p className="text-xs text-gray-500">
                      {formatDistanceToNow(new Date(notification.createdAt), {
                        addSuffix: true,
                      })}
                    </p>
                    {notification.data?.donationId && (
                      <span className="text-xs text-gray-400">
                        Donation #{notification.data?.receiptNumber || 'N/A'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-1 ml-4">
                {!notification.isRead && (
                  <button
                    onClick={() => markAsReadMutation.mutate(notification._id)}
                    className="p-1.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Mark as read"
                  >
                    <CheckIcon className="h-4 w-4" />
                  </button>
                )}
                <button
                  onClick={() => deleteMutation.mutate(notification._id)}
                  className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete"
                >
                  <XMarkIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;