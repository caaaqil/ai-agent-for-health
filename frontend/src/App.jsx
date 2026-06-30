import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import MealAnalyzer from './pages/MealAnalyzer';
import WorkoutPlanner from './pages/WorkoutPlanner';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';

// Read the saved user, but only trust it if it has a real _id — an object
// without one is a broken/stale session and should be treated as logged out.
const loadStoredUser = () => {
  try {
    const stored = JSON.parse(localStorage.getItem('user'));
    return stored && stored._id ? stored : null;
  } catch {
    return null;
  }
};

function App() {
  const [user, setUser] = useState(loadStoredUser);

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <Router>
      <div className="min-h-screen pb-20">
        {user && <Navbar />}
        <main>
          <Routes>
            <Route path="/login" element={!user ? <Login setUser={setUser} /> : <Navigate to="/" />} />
            <Route path="/register" element={!user ? <Register setUser={setUser} /> : <Navigate to="/" />} />

            <Route path="/" element={user ? <Dashboard user={user} /> : <Navigate to="/login" />} />
            <Route path="/chat" element={user ? <Chat user={user} /> : <Navigate to="/login" />} />
            <Route path="/meal" element={user ? <MealAnalyzer user={user} /> : <Navigate to="/login" />} />
            <Route path="/workout" element={user ? <WorkoutPlanner user={user} /> : <Navigate to="/login" />} />
            <Route path="/profile" element={user ? <Profile user={user} setUser={setUser} onLogout={handleLogout} /> : <Navigate to="/login" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
