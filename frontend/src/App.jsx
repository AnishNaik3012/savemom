import { useState } from 'react'
import Login from './Login'
import Dashboard from './Dashboard'
import ChatOverlay from './ChatOverlay'
import './App.css'

function App() {
  const [user, setUser] = useState(null); // { name: '...', role: '...' }
  const [currentApp, setCurrentApp] = useState(null); // Which "App" is open?

  const handleLogin = (userInfo) => {
    setUser(userInfo);
  };

  const handleOpenApp = (app) => {
    alert(`Opening ${app.name}... (This is a demo, so we stay on Dashboard, but the Chat is always here!)`);
    // In a real app, this would route to /savemom or /allodoc
    setCurrentApp(app);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentApp(null);
  };

  return (
    <div className="app-container">
      {/* 1. Login Screen */}
      {!user && <Login onLogin={handleLogin} />}

      {/* 2. Main Authenticated Area */}
      {user && (
        <>
          {/* Top Bar (simulating the phone/browser header) */}
          <nav className="top-nav">
            <span className="logo">UnifiedHealth</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </nav>

          {/* Dashboard (The "OS" or "Home Screen") */}
          <Dashboard user={user} onOpenApp={handleOpenApp} />

          {/* 3. The Meta AI Layer (Always present) */}
          <ChatOverlay user={user} />
        </>
      )}
    </div>
  )
}

export default App
