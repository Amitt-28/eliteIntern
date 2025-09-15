import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Send, Users, MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  username: string;
  message: string;
  timestamp: Date;
  type: 'message' | 'notification';
}

interface User {
  id: string;
  username: string;
}

function App() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentUser, setCurrentUser] = useState<string>('');
  const [roomId, setRoomId] = useState<string>('');
  const [isJoined, setIsJoined] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [newMessage, setNewMessage] = useState<string>('');
  const [showUsers, setShowUsers] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io('http://localhost:3001');
    setSocket(newSocket);

    // Socket event listeners
    newSocket.on('message', (message: Message) => {
      setMessages(prev => [...prev, message]);
    });

    newSocket.on('userJoined', (data: { username: string; users: User[] }) => {
      setUsers(data.users);
      if (data.username !== currentUser) {
        const notification: Message = {
          id: Date.now().toString(),
          username: 'System',
          message: `${data.username} joined the room`,
          timestamp: new Date(),
          type: 'notification'
        };
        setMessages(prev => [...prev, notification]);
      }
    });

    newSocket.on('userLeft', (data: { username: string; users: User[] }) => {
      setUsers(data.users);
      if (data.username !== currentUser) {
        const notification: Message = {
          id: Date.now().toString(),
          username: 'System',
          message: `${data.username} left the room`,
          timestamp: new Date(),
          type: 'notification'
        };
        setMessages(prev => [...prev, notification]);
      }
    });

    newSocket.on('roomUsers', (users: User[]) => {
      setUsers(users);
    });

    return () => {
      newSocket.close();
    };
  }, [currentUser]);

  const joinRoom = () => {
    if (currentUser.trim() && roomId.trim() && socket) {
      socket.emit('joinRoom', { username: currentUser, roomId });
      setIsJoined(true);
      setMessages([]);
    }
  };

  const leaveRoom = () => {
    if (socket) {
      socket.emit('leaveRoom', { username: currentUser, roomId });
      setIsJoined(false);
      setMessages([]);
      setUsers([]);
    }
  };

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && socket) {
      const messageData = {
        username: currentUser,
        message: newMessage,
        roomId: roomId,
        timestamp: new Date()
      };
      
      socket.emit('sendMessage', messageData);
      setNewMessage('');
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Home page - Join room
  if (!isJoined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md border border-gray-100">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <MessageCircle className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Chat Room</h1>
            <p className="text-gray-600">Enter your details to start chatting</p>
          </div>
          
          <form onSubmit={(e) => { e.preventDefault(); joinRoom(); }} className="space-y-6">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={currentUser}
                onChange={(e) => setCurrentUser(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter your username"
                required
              />
            </div>
            
            <div>
              <label htmlFor="roomId" className="block text-sm font-medium text-gray-700 mb-2">
                Room ID
              </label>
              <input
                type="text"
                id="roomId"
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Enter room ID"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Join Room
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Chat room interface
  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center space-x-4">
            <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
              <MessageCircle className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Room: {roomId}</h1>
              <p className="text-sm text-gray-500">Welcome, {currentUser}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowUsers(!showUsers)}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <Users className="w-4 h-4" />
              <span className="text-sm font-medium">{users.length}</span>
            </button>
            
            <button
              onClick={leaveRoom}
              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors text-sm font-medium"
            >
              Leave Room
            </button>
          </div>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex max-w-6xl mx-auto w-full">
        {/* Chat messages */}
        <div className="flex-1 flex flex-col">
          {/* Messages container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.type === 'notification' ? 'justify-center' : msg.username === currentUser ? 'justify-end' : 'justify-start'}`}>
                {msg.type === 'notification' ? (
                  <div className="bg-gray-200 text-gray-600 text-xs px-3 py-1 rounded-full">
                    {msg.message}
                  </div>
                ) : (
                  <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    msg.username === currentUser 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-white shadow-sm border border-gray-200'
                  }`}>
                    <div className={`text-xs font-medium mb-1 ${
                      msg.username === currentUser ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {msg.username}
                    </div>
                    <div className="text-sm leading-relaxed">{msg.message}</div>
                    <div className={`text-xs mt-1 ${
                      msg.username === currentUser ? 'text-blue-100' : 'text-gray-400'
                    }`}>
                      {formatTime(msg.timestamp)}
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message input */}
          <div className="border-t border-gray-200 bg-white p-4">
            <form onSubmit={sendMessage} className="flex items-center space-x-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-full transition-colors"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>

        {/* Users sidebar (mobile: overlay, desktop: sidebar) */}
        {showUsers && (
          <>
            <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowUsers(false)} />
            <div className={`${showUsers ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 fixed lg:relative top-0 right-0 h-full w-80 bg-white shadow-xl lg:shadow-none border-l border-gray-200 z-50 transition-transform duration-300 ease-in-out`}>
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Users in Room</h3>
                  <button
                    onClick={() => setShowUsers(false)}
                    className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                  >
                    ×
                  </button>
                </div>
                <p className="text-sm text-gray-500 mt-1">{users.length} online</p>
              </div>
              <div className="p-4 space-y-3">
                {users.map((user) => (
                  <div key={user.id} className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${user.username === currentUser ? 'bg-blue-500' : 'bg-green-500'}`} />
                    <span className={`text-sm ${user.username === currentUser ? 'font-medium text-blue-700' : 'text-gray-700'}`}>
                      {user.username} {user.username === currentUser && '(You)'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;