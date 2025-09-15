# Real-time Chat Application

A modern, real-time chat application built with React, Express, and Socket.IO. Features room-based conversations, user presence tracking, and a responsive design.

## 🚀 Features

- **Room-based Chat**: Join specific chat rooms with unique Room IDs
- **Real-time Messaging**: Instant message delivery using Socket.IO
- **User Presence**: See who's online in your room
- **Responsive Design**: Works seamlessly on mobile and desktop
- **Modern UI**: Clean, professional interface with smooth animations
- **Message History**: See all messages from your current session
- **Join/Leave Notifications**: Get notified when users enter or leave

## 🛠️ Tech Stack

### Frontend
- **Vite** - Fast build tool and dev server
- **React 18** - UI library with hooks
- **TypeScript** - Type safety and better development experience
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Beautiful icon set
- **Socket.IO Client** - Real-time communication

### Backend
- **Node.js** - JavaScript runtime
- **Express** - Web framework
- **Socket.IO** - Real-time bidirectional communication
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
├── src/                    # Frontend React application
│   ├── App.tsx            # Main chat application component
│   ├── main.tsx           # React app entry point
│   ├── index.css          # Global styles with Tailwind
│   └── vite-env.d.ts      # Vite type definitions
├── server/                 # Backend Node.js server
│   ├── server.js          # Express + Socket.IO server
│   ├── package.json       # Server dependencies
│   └── node_modules/      # Server dependencies (after install)
├── package.json           # Frontend dependencies
└── README.md              # This file
```

## 🚦 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation & Setup

1. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

2. **Install Backend Dependencies**
   ```bash
   cd server
   npm install
   cd ..
   ```

3. **Start the Backend Server**
   ```bash
   cd server
   npm run dev
   # Or for production: npm start
   ```
   The server will run on `http://localhost:3001`

4. **Start the Frontend Development Server** (in a new terminal)
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`

5. **Open Your Browser**
   Navigate to `http://localhost:5173` to start using the chat application.

## 💻 Usage

1. **Join a Room**
   - Enter your desired username
   - Enter a Room ID (create a new one or join an existing room)
   - Click "Join Room"

2. **Start Chatting**
   - Type messages in the input field at the bottom
   - Press Enter or click the Send button
   - See messages from other users in real-time

3. **View Online Users**
   - Click the user count button in the header
   - See all users currently in your room
   - Users are color-coded (blue for you, green for others)

4. **Leave the Room**
   - Click "Leave Room" to return to the join screen
   - Other users will be notified you left

## 🔧 Development

### Frontend Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Backend Development
```bash
cd server
npm run dev          # Start with nodemon (auto-restart)
npm start            # Start production server
```

### Environment Configuration

The application uses these default ports:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:3001`

To change ports, update:
- Backend: `PORT` environment variable in `server/server.js`
- Frontend: Update the Socket.IO connection URL in `src/App.tsx`

## 🌐 API Endpoints

### REST Endpoints
- `GET /health` - Server health check
- `GET /api/rooms` - Get statistics about active rooms

### Socket.IO Events

#### Client to Server
- `joinRoom` - Join a chat room
- `sendMessage` - Send a message to the room
- `leaveRoom` - Leave the current room

#### Server to Client
- `message` - Receive a new message
- `userJoined` - User joined the room
- `userLeft` - User left the room
- `roomUsers` - Current users in the room
- `error` - Error occurred

## 🔐 Security Features

- Input validation and sanitization
- CORS protection
- Room isolation (users can only send messages to their current room)
- Error handling and graceful disconnection

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first design approach
- Touch-friendly interface
- Collapsible sidebar for user list on mobile
- Optimized message bubbles for different screen sizes

## 🚀 Production Deployment

1. **Build the Frontend**
   ```bash
   npm run build
   ```

2. **Deploy Backend**
   - Set environment variables
   - Install production dependencies
   - Start the server with `npm start`

3. **Deploy Frontend**
   - Upload the `dist` folder to your hosting service
   - Configure your web server to serve the static files

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.