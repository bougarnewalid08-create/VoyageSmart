import { useState } from 'react'
import api from '../api/axios'
import { Link, useNavigate } from 'react-router-dom'

const Login = ({ onLoginSuccess }) => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      const response = await api.post('/login', { email, password })
      console.log('Login successful:', response.data)
      
      // Store token and notify parent
      if (response.data.access_token) {
        localStorage.setItem('token', response.data.access_token)
        onLoginSuccess(response.data.user)
        navigate('/dashboard')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative z-10 flex w-full max-w-[1100px] bg-white rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(73,75,214,0.12)] h-[700px] animate-in fade-in zoom-in-95 duration-300">
      {/* Hero Section */}
      <div className="hidden lg:flex lg:w-[45%] bg-login-hero relative flex-col justify-end p-12">
        <div className="absolute inset-0 bg-gradient-to-t from-[#4648d4]/60 to-transparent"></div>
        <div className="relative z-10 text-white">
          <h2 className="font-h1 text-[40px] leading-tight mb-6 font-extrabold">Explore the world with intelligence.</h2>
          <p className="text-base text-white/90 font-medium max-w-[300px]">Your smart travel companion for seamless discovery and curated experiences.</p>
        </div>
      </div>

      {/* Login Form Section */}
      <div className="w-full lg:w-[55%] flex flex-col justify-center items-center px-12 py-10">
        <div className="w-full max-w-[380px]">
          <div className="flex flex-col items-center mb-8 text-center">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined text-primary text-[36px] font-bold">travel_explore</span>
              <span className="text-[28px] font-extrabold tracking-tighter text-primary">VoyageSmart</span>
            </div>
            <h1 className="text-xl font-bold text-[#111c2d] mb-1">Welcome Back</h1>
            <p className="text-xs text-gray-500">Log in to continue your journey</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-xl text-xs border border-red-100">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-700 block ml-1" htmlFor="email">Email Address</label>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors text-[18px]">mail</span>
                <input 
                  className="w-full bg-[#f0f3ff] pl-11 pr-4 py-3.5 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all text-sm text-[#111c2d] outline-none" 
                  id="email" 
                  placeholder="name@example.com" 
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center px-1">
                <label className="text-xs font-bold text-gray-700" htmlFor="password">Password</label>
                <a className="text-[10px] font-bold text-primary hover:underline" href="#">Forgot Password?</a>
              </div>
              <div className="relative group">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors text-[18px]">lock</span>
                <input 
                  className="w-full bg-[#f0f3ff] pl-11 pr-4 py-3.5 rounded-2xl border-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all text-sm text-[#111c2d] outline-none" 
                  id="password" 
                  placeholder="••••••••" 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button 
              className="w-full bg-primary text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-primary/20 hover:bg-[#393bb8] active:scale-[0.98] transition-all disabled:opacity-70 mt-2 text-sm" 
              type="submit"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Log In'}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-bold">
              <span className="px-4 bg-white text-gray-400">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 bg-white border border-gray-100 py-2.5 rounded-xl hover:bg-gray-50 active:scale-[0.98] transition-all">
              <img className="w-4 h-4" src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" alt="Google" />
              <span className="text-xs font-bold text-gray-600">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 bg-white border border-gray-100 py-2.5 rounded-xl hover:bg-gray-50 active:scale-[0.98] transition-all">
              <span className="material-symbols-outlined text-[18px]">ios</span>
              <span className="text-xs font-bold text-gray-600">Apple</span>
            </button>
          </div>

          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500 font-medium">
              Don't have an account? 
              <Link to="/signup" className="text-primary font-bold ml-1.5 hover:underline">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
