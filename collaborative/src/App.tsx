import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import UsernameModal from './components/UsernameModal';
import Editor from './components/Editor';
import UserList from './components/UserList';
import { useSocket } from './hooks/useSocket';

function App() {
  const [username, setUsername] = useState<string>('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  const {
    documentContent,
    users,
    isConnected,
    updateDocument,
    updateCursorPosition
  } = useSocket(username);

  if (!username) {
    return <UsernameModal onSubmit={setUsername} />;
  }

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main editor area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile header */}
        <div className="lg:hidden bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-semibold text-gray-900">Document Editor</h1>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          <Editor
            content={documentContent}
            onChange={updateDocument}
            onCursorChange={updateCursorPosition}
            isConnected={isConnected}
          />
        </div>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 right-0 z-50 w-80 transform transition-transform duration-300 ease-in-out lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      `}>
        <UserList
          users={users}
          currentUserId={users.find(u => u.username === username)?.id}
          isConnected={isConnected}
        />
      </div>
    </div>
  );
}

export default App;