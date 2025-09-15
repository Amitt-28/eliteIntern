import React from 'react';
import { Users, Circle } from 'lucide-react';
import type { User } from '../hooks/useSocket';

interface UserListProps {
  users: User[];
  currentUserId?: string;
  isConnected: boolean;
}

const UserList: React.FC<UserListProps> = ({ users, currentUserId, isConnected }) => {
  return (
    <div className="bg-white h-full flex flex-col border-l border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <Users className="w-5 h-5 text-gray-600" />
          <h3 className="font-semibold text-gray-900">Collaborators</h3>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {users.length}
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <Circle 
            className={`w-3 h-3 ${isConnected ? 'text-green-500 fill-current' : 'text-red-500 fill-current'}`} 
          />
          <span className={isConnected ? 'text-green-600' : 'text-red-600'}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-3">
          {users.map((user) => (
            <div
              key={user.id}
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                user.id === currentUserId
                  ? 'bg-blue-50 border border-blue-200'
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: user.color }}
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {user.username}
                  {user.id === currentUserId && (
                    <span className="text-blue-600 text-sm ml-1">(You)</span>
                  )}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Circle 
                    className={`w-2 h-2 ${user.isActive ? 'text-green-500 fill-current' : 'text-gray-400 fill-current'}`} 
                  />
                  <span className="text-xs text-gray-500">
                    {user.isActive ? 'Active' : 'Idle'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {users.length === 0 && (
          <div className="text-center py-8">
            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No collaborators yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;