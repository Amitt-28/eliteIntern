# Real-time Collaborative Document Editor

A beautiful, production-ready collaborative document editor built with React, Node.js, Express, and Socket.IO. Multiple users can edit the same document simultaneously with instant real-time synchronization.

## ✨ Features

- **Real-time Collaboration**: Multiple users can edit simultaneously with instant synchronization
- **Live User List**: See all connected collaborators with activity status
- **User Activity Tracking**: Visual indicators for active/idle users
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **No Database Required**: All data stored in memory for simplicity
- **Modern UI**: Clean, professional interface built with Tailwind CSS
- **Auto-save Indication**: Visual feedback for connection and save status

## 🛠 Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development
- Tailwind CSS for styling
- Socket.IO Client for real-time communication
- Lucide React for icons

### Backend
- Node.js with Express
- Socket.IO for real-time communication
- In-memory data storage
- CORS enabled for cross-origin requests

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ installed on your system
- npm or yarn package manager

### Installation & Setup

1. **Clone and setup the project**:
   ```bash
   # Install frontend dependencies (already done if using Bolt)
   npm install
   
   # Install backend dependencies
   cd backend
   npm install
   cd ..
   ```

2. **Start the backend server**:
   ```bash
   cd backend
   npm start
   ```
   The backend server will start on `http://localhost:3001`

3. **Start the frontend development server** (in a new terminal):
   ```bash
   npm run dev
   ```
   The frontend will start on `http://localhost:5173`

4. **Test collaboration**:
   - Open multiple browser tabs/windows to `http://localhost:5173`
   - Enter different usernames for each tab
   - Start typing in one tab and watch the changes appear in real-time in other tabs

## 🏗 Project Structure

```
collaborative-editor/
├── src/                          # Frontend React application
│   ├── components/
│   │   ├── Editor.tsx           # Main document editor component
│   │   ├── UserList.tsx         # Sidebar with connected users
│   │   └── UsernameModal.tsx    # Initial username input modal
│   ├── hooks/
│   │   └── useSocket.ts         # Socket.IO connection hook
│   └── App.tsx                  # Main application component
├── backend/                      # Backend Node.js server
│   ├── server.js               # Express + Socket.IO server
│   └── package.json            # Backend dependencies
└── README.md                   # This file
```

## 🔧 Configuration

### Backend Configuration
The backend server runs on port 3001 by default. You can change this by setting the `PORT` environment variable:

```bash
PORT=4000 npm start
```

### Frontend Configuration
The frontend connects to the backend at `http://localhost:3001`. If you change the backend port, update the socket connection URL in `src/hooks/useSocket.ts`:

```typescript
const newSocket = io('http://localhost:YOUR_PORT', {
  transports: ['websocket', 'polling']
});
```

## 🎨 UI Features

- **Split Layout**: Document editor on the left, user list on the right
- **Mobile Responsive**: Collapsible sidebar on mobile devices
- **User Colors**: Each user gets a unique color identifier
- **Activity Status**: Live indicators for active/idle users
- **Connection Status**: Visual feedback for online/offline status
- **Document Stats**: Real-time character and word count
- **Auto-save Indication**: Shows when changes are being synchronized

## 🔄 How Real-time Sync Works

1. **User Connection**: When a user joins, they receive the current document state
2. **Document Changes**: As users type, changes are broadcast to all other connected users
3. **Cursor Tracking**: User cursor positions are tracked and shared (for activity status)
4. **Activity Monitoring**: Users are marked as idle after 10 seconds of inactivity
5. **State Management**: All document state is maintained in server memory

## 🛡 Data Storage

- **In-Memory Only**: All document data is stored in server memory
- **Temporary**: Data is lost when the server restarts
- **No Database**: Designed for simplicity and demo purposes
- **Production Note**: For production use, consider adding database persistence

## 🚨 Important Notes

1. **Server Restart**: All document content and user data is lost when the backend server restarts
2. **Memory Usage**: Long documents or many simultaneous users will increase memory usage
3. **Network Requirements**: Requires stable internet connection for real-time features
4. **Browser Compatibility**: Works in all modern browsers with WebSocket support

## 🔮 Future Enhancements

- Document persistence with database integration
- User authentication and authorization
- Multiple document support
- Rich text editing capabilities
- Version history and change tracking
- File import/export functionality
- User permissions and roles

## 🤝 Contributing

This is a demonstration project. Feel free to fork and enhance it for your own use cases!

## 📝 License

This project is provided as-is for educational and demonstration purposes.