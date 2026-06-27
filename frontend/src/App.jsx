import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom'
import Login from './components/Login'
import SignUp from './components/SignUp'
import LandingPage from './components/LandingPage'
import Dashboard from './components/Dashboard'
import Stays from './components/Stays'
import Hotels from './components/Hotels'
import Plans from './components/Plans'
import PlanDetails from './components/PlanDetails'
import HotelDetails from './components/HotelDetails'
import StayDetails from './components/StayDetails'
import MyReservations from './components/MyReservations'
import Flights from './components/Flights'

// Protected Route Component
const ProtectedRoute = ({ user, children, adminOnly = false }) => {
  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (adminOnly && user.role !== 'Admin') {
    return <Navigate to="/" replace />
  }

  return children
}

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const handleLoginSuccess = (userData) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  if (loading) return null

  return (
    <Router>
      <div className="w-full min-h-screen">
        <Routes>
          {/* Public Routes */}
          <Route 
            path="/" 
            element={
              <LandingPage 
                user={user}
                onLogout={handleLogout}
              />
            } 
          />
          
          <Route 
            path="/login" 
            element={
              <div className="h-screen w-full flex items-center justify-center p-4 md:p-6 relative overflow-hidden bg-[#f9f9ff]">
                <div className="fixed inset-0 z-0">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=2560&auto=format&fit=crop')] bg-cover bg-center opacity-5 grayscale-[0.5]"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white via-[#f9f9ff]/80 to-[#f0f3ff]"></div>
                </div>
                <div className="relative z-10 w-full max-w-7xl h-full flex items-center justify-center">
                  <Login onLoginSuccess={handleLoginSuccess} />
                  <Link 
                    to="/"
                    className="fixed top-8 left-8 bg-white/80 backdrop-blur px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2 text-sm font-bold text-gray-600 hover:bg-white transition-all active:scale-95"
                  >
                    <span className="material-symbols-outlined">arrow_back</span> Back to Home
                  </Link>
                </div>
              </div>
            } 
          />

          <Route 
            path="/signup" 
            element={
              <div className="h-screen w-full flex items-center justify-center p-4 md:p-6 relative overflow-hidden bg-[#f9f9ff]">
                <div className="fixed inset-0 z-0">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1488085061387-422e29b40080?q=80&w=2560&auto=format&fit=crop')] bg-cover bg-center opacity-5 grayscale-[0.5]"></div>
                  <div className="absolute inset-0 bg-gradient-to-br from-white via-[#f9f9ff]/80 to-[#f0f3ff]"></div>
                </div>
                <div className="relative z-10 w-full max-w-7xl h-full flex items-center justify-center">
                  <SignUp />
                  <Link 
                    to="/"
                    className="fixed top-8 left-8 bg-white/80 backdrop-blur px-4 py-2 rounded-xl shadow-sm border border-gray-100 flex items-center gap-2 text-sm font-bold text-gray-600 hover:bg-white transition-all active:scale-95"
                  >
                    <span className="material-symbols-outlined">arrow_back</span> Back to Home
                  </Link>
                </div>
              </div>
            } 
          />

          <Route 
            path="/stays" 
            element={
              <Stays 
                user={user}
                onLogout={handleLogout}
              />
            } 
          />

          <Route 
            path="/hotels" 
            element={
              <Hotels 
                user={user}
                onLogout={handleLogout}
              />
            } 
          />

          <Route 
            path="/flights" 
            element={
              <Flights 
                user={user}
                onLogout={handleLogout}
              />
            } 
          />

          <Route 
            path="/plans"  
            element={
              <Plans 
                user={user}
                onLogout={handleLogout}
              />
            } 
          />

          <Route 
            path="/hotel-details/:id" 
            element={
              <HotelDetails 
                user={user}
                onLogout={handleLogout}
              />
            } 
          />

          <Route 
            path="/plan-details/:id" 
            element={
              <PlanDetails 
                user={user}
                onLogout={handleLogout}
              />
            } 
          />

          <Route 
            path="/stay-details/:id" 
            element={
              <StayDetails 
                user={user}
                onLogout={handleLogout}
              />
            } 
          />

          {/* Protected My Reservations Route */}
          <Route 
            path="/my-reservations" 
            element={
              <ProtectedRoute user={user}>
                <MyReservations user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />

          {/* Protected Dashboard Route */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute user={user} adminOnly={true}>
                <Dashboard user={user} onLogout={handleLogout} />
              </ProtectedRoute>
            } 
          />

          {/* Redirect any other route to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
