import { useState } from 'react'
import api from '../api/axios'
import { Link, useNavigate } from 'react-router-dom'

const SignUp = () => {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await api.post('/register', {
        name: fullName,
        email,
        password,
        password_confirmation: password
      })
      console.log('Registration successful:', response.data)
      alert('Registration successful! You can now log in.')
      navigate('/login')
    } catch (err) {
      console.error('Registration error:', err)
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-7xl px-4 lg:px-8 py-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_450px] gap-12 lg:gap-24 items-center w-full">
        {/* Left Section - Content (Achieving Image 2 Status) */}
        <section className="flex flex-col space-y-8 w-full order-2 lg:order-1 min-w-0 lg:min-w-[500px] items-center lg:items-start text-center lg:text-left">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-[40px] font-bold shrink-0">travel_explore</span>
            <span className="text-[32px] font-extrabold tracking-tighter text-primary">VoyageSmart</span>
          </div>

          <div className="space-y-6 w-full">
            <h1 className="text-[36px] md:text-[52px] lg:text-[60px] leading-[1.1] text-[#111c2d] font-extrabold tracking-tight break-words">
              Your intelligent companion for <span className="text-primary">effortless discovery.</span>
            </h1>
            <p className="text-base md:text-lg text-gray-500 font-medium leading-relaxed w-full whitespace-normal">
              Experience personalized travel planning powered by smart insights. Join thousands of travelers exploring the world with boutique luxury at their fingertips.
            </p>
          </div>

          <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-2">
            <div className="bg-[#f0f3ff] px-5 py-2.5 rounded-2xl flex items-center gap-2.5 shadow-sm border border-primary/5 shrink-0">
              <span className="material-symbols-outlined text-primary text-[20px]">verified</span>
              <span className="text-xs font-bold text-[#111c2d]">Curated Stays</span>
            </div>
            <div className="bg-[#f0f3ff] px-5 py-2.5 rounded-2xl flex items-center gap-2.5 shadow-sm border border-primary/5 shrink-0">
              <span className="material-symbols-outlined text-primary text-[20px]">auto_awesome</span>
              <span className="text-xs font-bold text-[#111c2d]">Smart Itineraries</span>
            </div>
          </div>
        </section>

        {/* Right Section - Form Card */}
        <section className="flex justify-center lg:justify-end order-1 lg:order-2 w-full shrink-0">
          <div className="bg-white w-full max-w-[450px] p-8 md:p-10 lg:p-12 rounded-[32px] shadow-[0_30px_60px_-12px_rgba(73,75,214,0.15)] border border-gray-50 shrink-0">
            <div className="text-center lg:text-left mb-8 w-full">
              <h2 className="text-[28px] lg:text-[32px] font-extrabold text-[#111c2d] mb-2 tracking-tight">Create Your Account</h2>
              <p className="text-sm text-gray-400 font-medium">Start your journey with us today.</p>
            </div>

            <div className="space-y-6 w-full">
              <div className="grid grid-cols-2 gap-4">
                <button className="active-scale flex items-center justify-center gap-2 py-3 border border-gray-100 rounded-2xl font-bold text-[11px] text-gray-600 hover:bg-gray-50 transition-all">
                  <img alt="Google" className="w-4 h-4" src="https://www.gstatic.com/images/branding/product/1x/gsa_512dp.png" />
                  <span>Google</span>
                </button>
                <button className="active-scale flex items-center justify-center gap-2 py-3 border border-gray-100 rounded-2xl font-bold text-[11px] text-gray-600 hover:bg-gray-50 transition-all">
                  <span className="material-symbols-outlined text-[18px]">ios</span>
                  <span>Apple</span>
                </button>
              </div>

              <div className="relative flex items-center py-1">
                <div className="flex-grow border-t border-gray-100"></div>
                <span className="flex-shrink mx-3 text-[9px] text-gray-300 uppercase tracking-[0.2em] font-bold">or continue with email</span>
                <div className="flex-grow border-t border-gray-100"></div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 rounded-2xl text-[11px] border border-red-100">
                  {error}
                </div>
              )}

              <form className="space-y-4" onSubmit={handleSignUp}>
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-700 px-1" htmlFor="fullname">Full Name</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors text-[18px]">person</span>
                    <input
                      className="w-full bg-[#f0f3ff] border-transparent focus:border-primary/20 focus:ring-0 focus:bg-white rounded-2xl py-3.5 pl-11 pr-4 text-sm text-[#111c2d] transition-all outline-none"
                      id="fullname"
                      placeholder="Enter your full name"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-700 px-1" htmlFor="email">Email</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors text-[18px]">mail</span>
                    <input
                      className="w-full bg-[#f0f3ff] border-transparent focus:border-primary/20 focus:ring-0 focus:bg-white rounded-2xl py-3.5 pl-11 pr-4 text-sm text-[#111c2d] transition-all outline-none"
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
                  <label className="text-[11px] font-bold text-gray-700 px-1" htmlFor="password">Password</label>
                  <div className="relative group">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors text-[18px]">lock</span>
                    <input
                      className="w-full bg-[#f0f3ff] border-transparent focus:border-primary/20 focus:ring-0 focus:bg-white rounded-2xl py-3.5 pl-11 pr-4 text-sm text-[#111c2d] transition-all outline-none"
                      id="password"
                      placeholder="••••••••"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="flex items-start gap-2.5 pt-1">
                  <input className="mt-0.5 w-3.5 h-3.5 text-primary border-gray-200 rounded focus:ring-primary/20 focus:ring-offset-0 bg-[#f0f3ff]" id="terms" type="checkbox" required />
                  <label className="text-[10px] text-gray-400 leading-tight font-medium" htmlFor="terms">
                    I agree to the <a className="text-primary font-bold hover:underline" href="#">Terms & Conditions</a> and <a className="text-primary font-bold hover:underline" href="#">Privacy Policy</a>
                  </label>
                </div>

                <button
                  className="active-scale w-full bg-primary text-white py-3.5 rounded-2xl font-bold text-sm shadow-xl shadow-primary/20 hover:bg-[#393bb8] transition-all mt-4 disabled:opacity-70"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>
              </form>

              <div className="text-center pt-2">
                <p className="text-[11px] text-gray-400 font-semibold">
                  Already have an account? <Link to="/login" className="text-primary font-extrabold hover:underline ml-1">Log In</Link>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default SignUp
