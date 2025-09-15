import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage
let documentState = {
  content: 'Welcome to the Collaborative Document Editor!\n\nStart typing to see real-time collaboration in action. Your changes will be instantly visible to all connected users.\n\nFeatures:\n• Real-time synchronization\n• Live user list\n• Automatic saving\n• Mobile responsive design\n\nTry opening this in multiple browser tabs to test the collaboration!',
  users: new Map()
};

// Helper functions
const getUserColors = () => [
  '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
  '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'
];

const getRandomColor = (existingColors) => {
  const colors = getUserColors();
  const availableColors = colors.filter(color => !existingColors.includes(color));
  return availableColors.length > 0 
    ? availableColors[Math.floor(Math.random() * availableColors.length)]
    : colors[Math.floor(Math.random() * colors.length)];
};

const broadcastUserList = () => {
  const users = Array.from(documentState.users.values());
  io.emit('users:update', users);
};

const broadcastDocumentState = () => {
  const users = Array.from(documentState.users.values());
  io.emit('document:state', {
    content: documentState.content,
    users: users
  });
};

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Send initial document state
  socket.emit('document:state', {
    content: documentState.content,
    users: Array.from(documentState.users.values())
  });

  // Handle user joining
  socket.on('user:join', (username) => {
    const existingColors = Array.from(documentState.users.values()).map(user => user.color);
    const userColor = getRandomColor(existingColors);

    const user = {
      id: socket.id,
      username: username,
      color: userColor,
      isActive: true,
      lastActivity: Date.now(),
      cursorPosition: 0
    };

    documentState.users.set(socket.id, user);
    
    console.log(`User joined: ${username} (${socket.id})`);
    
    // Broadcast updated user list
    broadcastUserList();
    
    // Send welcome message to the new user
    socket.emit('document:state', {
      content: documentState.content,
      users: Array.from(documentState.users.values())
    });
  });

  // Handle document changes
  socket.on('document:change', (content) => {
    documentState.content = content;
    
    // Update user activity
    const user = documentState.users.get(socket.id);
    if (user) {
      user.isActive = true;
      user.lastActivity = Date.now();
      documentState.users.set(socket.id, user);
    }

    // Broadcast content change to all other users
    socket.broadcast.emit('document:update', content);
    
    // Broadcast updated user list with activity status
    broadcastUserList();
  });

  // Handle cursor position updates
  socket.on('user:cursor', (position) => {
    const user = documentState.users.get(socket.id);
    if (user) {
      user.cursorPosition = position;
      user.lastActivity = Date.now();
      user.isActive = true;
      documentState.users.set(socket.id, user);
      broadcastUserList();
    }
  });

  // Handle user disconnect
  socket.on('disconnect', () => {
    const user = documentState.users.get(socket.id);
    if (user) {
      console.log(`User disconnected: ${user.username} (${socket.id})`);
      documentState.users.delete(socket.id);
      broadcastUserList();
    }
  });

  // Handle connection errors
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// Mark users as idle after inactivity
setInterval(() => {
  const now = Date.now();
  let hasChanges = false;

  for (const [socketId, user] of documentState.users) {
    const timeSinceLastActivity = now - user.lastActivity;
    const shouldBeIdle = timeSinceLastActivity > 5000; // 5 seconds

    if (user.isActive && shouldBeIdle) {
      user.isActive = false;
      documentState.users.set(socketId, user);
      hasChanges = true;
    }
  }

  if (hasChanges) {
    broadcastUserList();
  }
}, 2000); // Check every 2 seconds

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    connectedUsers: documentState.users.size,
    documentLength: documentState.content.length,
    timestamp: new Date().toISOString()
  });
});

// Start server
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Collaborative Editor Server running on port ${PORT}`);
  console.log(`📝 Document initialized with ${documentState.content.length} characters`);
  console.log(`🔗 Frontend should connect to: http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});