import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = createServer(app);

// Configure Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Vite dev server default port
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());

// Store rooms and users
const rooms = new Map();
const users = new Map();

// Utility functions
const getRoomUsers = (roomId) => {
  const room = rooms.get(roomId);
  return room ? Array.from(room.values()) : [];
};

const addUserToRoom = (roomId, user) => {
  if (!rooms.has(roomId)) {
    rooms.set(roomId, new Map());
  }
  rooms.get(roomId).set(user.id, user);
};

const removeUserFromRoom = (roomId, userId) => {
  if (rooms.has(roomId)) {
    const room = rooms.get(roomId);
    room.delete(userId);
    if (room.size === 0) {
      rooms.delete(roomId);
    }
  }
};

const getUserFromRoom = (roomId, userId) => {
  const room = rooms.get(roomId);
  return room ? room.get(userId) : null;
};

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Store user info
  socket.on('joinRoom', ({ username, roomId }) => {
    try {
      // Leave any existing room first
      if (users.has(socket.id)) {
        const oldUser = users.get(socket.id);
        socket.leave(oldUser.roomId);
        removeUserFromRoom(oldUser.roomId, socket.id);
        socket.to(oldUser.roomId).emit('userLeft', {
          username: oldUser.username,
          users: getRoomUsers(oldUser.roomId)
        });
      }

      // Join new room
      socket.join(roomId);
      
      const user = {
        id: socket.id,
        username: username.trim(),
        roomId: roomId.trim()
      };

      users.set(socket.id, user);
      addUserToRoom(roomId, user);

      // Notify others in the room
      socket.to(roomId).emit('userJoined', {
        username: user.username,
        users: getRoomUsers(roomId)
      });

      // Send current room users to the joining user
      socket.emit('roomUsers', getRoomUsers(roomId));

      console.log(`User ${username} joined room ${roomId}`);
    } catch (error) {
      console.error('Error in joinRoom:', error);
      socket.emit('error', { message: 'Failed to join room' });
    }
  });

  // Handle sending messages
  socket.on('sendMessage', ({ username, message, roomId, timestamp }) => {
    try {
      const user = users.get(socket.id);
      
      if (!user || user.roomId !== roomId) {
        socket.emit('error', { message: 'User not in specified room' });
        return;
      }

      const messageData = {
        id: `${socket.id}-${Date.now()}`,
        username: username.trim(),
        message: message.trim(),
        timestamp: new Date(timestamp),
        type: 'message'
      };

      // Broadcast message to all users in the room
      io.to(roomId).emit('message', messageData);
      
      console.log(`Message from ${username} in room ${roomId}: ${message}`);
    } catch (error) {
      console.error('Error in sendMessage:', error);
      socket.emit('error', { message: 'Failed to send message' });
    }
  });

  // Handle leaving room
  socket.on('leaveRoom', ({ username, roomId }) => {
    try {
      socket.leave(roomId);
      
      if (users.has(socket.id)) {
        const user = users.get(socket.id);
        users.delete(socket.id);
        removeUserFromRoom(roomId, socket.id);

        // Notify others in the room
        socket.to(roomId).emit('userLeft', {
          username: user.username,
          users: getRoomUsers(roomId)
        });

        console.log(`User ${username} left room ${roomId}`);
      }
    } catch (error) {
      console.error('Error in leaveRoom:', error);
    }
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    try {
      if (users.has(socket.id)) {
        const user = users.get(socket.id);
        const { username, roomId } = user;

        users.delete(socket.id);
        removeUserFromRoom(roomId, socket.id);

        // Notify others in the room
        socket.to(roomId).emit('userLeft', {
          username: username,
          users: getRoomUsers(roomId)
        });

        console.log(`User ${username} disconnected from room ${roomId}`);
      }
    } catch (error) {
      console.error('Error in disconnect:', error);
    }
  });

  // Handle connection errors
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    activeRooms: rooms.size,
    connectedUsers: users.size
  });
});

// Get room statistics
app.get('/api/rooms', (req, res) => {
  const roomStats = [];
  for (const [roomId, users] of rooms.entries()) {
    roomStats.push({
      roomId,
      userCount: users.size,
      users: Array.from(users.values()).map(u => ({ username: u.username, id: u.id }))
    });
  }
  res.json(roomStats);
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Express error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`🚀 Chat server running on port ${PORT}`);
  console.log(`📡 Socket.IO server ready for connections`);
  console.log(`🌐 Frontend should connect to: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
});