// src/components/RecentActivity.jsx
import { Link } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';

const RecentActivity = ({ title, items, type }) => {
  if (!items || items.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
        <p className="text-gray-500 text-center py-8">No recent {type}s</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item._id} className="flex items-center space-x-3">
            {item.photo && (
              <img
                src={item.photo}
                alt={item.name}
                className="h-10 w-10 rounded-full object-cover"
              />
            )}
            <div className="flex-1 min-w-0">
              <Link
                to={type === 'member' ? `/members/${item._id}` : `/donations/${item._id}`}
                className="text-sm font-medium text-gray-900 hover:text-primary truncate"
              >
                {item.name || item.donor?.name || 'Anonymous'}
              </Link>
              <p className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(item.createdAt || item.date), {
                  addSuffix: true,
                })}
              </p>
            </div>
            {type === 'donation' && (
              <span className="text-sm font-semibold text-primary">
                Rs. {item.amount?.toLocaleString()}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;