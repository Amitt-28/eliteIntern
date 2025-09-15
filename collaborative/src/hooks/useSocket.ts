import { useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

export interface User {
  id: string;
  username: string;
  color: string;
  isActive: boolean;
  lastActivity: number;
}

export interface DocumentState {
  content: string;
  users: User[];
}

export const useSocket = (username: string) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [documentContent, setDocumentContent] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!username) return;

    const newSocket = io('http://localhost:3001', {
      transports: ['websocket', 'polling'],
      upgrade: true,
      rememberUpgrade: true
    });

    newSocket.on('connect', () => {
      setIsConnected(true);
      newSocket.emit('user:join', username);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('document:state', (state: DocumentState) => {
      setDocumentContent(state.content);
      setUsers(state.users);
    });

    newSocket.on('document:update', (content: string) => {
      setDocumentContent(content);
    });

    newSocket.on('users:update', (updatedUsers: User[]) => {
      setUsers(updatedUsers);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [username]);

  const updateDocument = (content: string) => {
    if (socket) {
      // Update local state immediately for instant feedback
      setDocumentContent(content);
      socket.emit('document:change', content);
    }
  };

  const updateCursorPosition = (position: number) => {
    if (socket) {
      socket.emit('user:cursor', position);
    }
  };

  return {
    socket,
    documentContent,
    users,
    isConnected,
    updateDocument,
    updateCursorPosition
  };
};