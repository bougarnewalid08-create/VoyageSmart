import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, MapPin, Calendar, Wallet, Compass, CheckCircle2, X } from 'lucide-react'
import { Link } from 'react-router-dom'

const LandingPage = ({ user, onLogout }) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [showPlan, setShowPlan] = useState(false)

  const handleGenerate = () => {
    setIsGenerating(true)
    setTimeout(() => {
      setIsGenerating(false)
      setShowPlan(true)
    }, 2000)
  }

  return (
    <div className="bg-surface text-on-surface font-body-md w-full overflow-x-hidden">
      {/* Dynamic TopNavBar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm h-20">
        <nav className="w-full flex items-center px-12 h-full">
          {/* Left Column: Logo */}
          <div className="flex-1 flex items-center">
            <Link to="/" className="text-2xl font-bold tracking-tighter text-indigo-600">VoyageSmart</Link>
          </div>

          {/* Center Column: Navigation */}
          <div className="hidden md:flex flex-none items-center gap-8 font-['Plus_Jakarta_Sans'] text-sm font-medium tracking-tight">
            <Link className="text-gray-500 hover:text-indigo-600 transition-colors" to="/hotels">Hotels</Link>
            <Link className="text-gray-500 hover:text-indigo-600 transition-colors" to="/stays">Stays</Link>
            <Link className="text-gray-500 hover:text-indigo-600 transition-colors" to="/flights">Flights</Link>
            <Link className="text-gray-500 hover:text-indigo-600 transition-colors" to="/plans">Plans</Link>
            <a className="text-gray-500 hover:text-indigo-600 transition-colors" href="#">Smart Planner</a>
            {user && <Link className="text-gray-500 hover:text-indigo-600 transition-colors" to="/my-reservations">My Bookings</Link>}
          </div>

          {/* Right Column: Profile/Auth */}
          <div className="flex-1 flex items-center justify-end gap-4 font-['Plus_Jakarta_Sans'] text-sm font-medium">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-gray-900">Welcome, {user.name}</span>
                  <div className="flex gap-2">
                    {user.role === 'Admin' && (
                      <>
                        <Link to="/dashboard" className="text-[10px] text-indigo-600 font-bold hover:underline">Open Dashboard</Link>
                        <span className="text-[10px] text-gray-300">•</span>
                      </>
                    )}
                    <button onClick={onLogout} className="text-[10px] text-red-500 font-bold hover:underline">Sign Out</button>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {user.name.charAt(0)}
                </div>
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-5 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-all active:scale-95 duration-200"
                >
                  Log In
                </Link>
                <Link
                  to="/signup"
                  className="px-5 py-2 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 active:scale-95 duration-200"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </nav>
      </header>

      <main className="pt-20">
        {/* KEPT: Dynamic Hero Section */}
        <section className="relative h-[700px] flex items-center justify-center">
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
            className="absolute inset-0"
          >
            <img
              className="w-full h-full object-cover"
              src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop"
              alt="Paradise Background"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-surface"></div>
          </motion.div>

          <div className="relative z-10 text-center max-w-4xl px-8">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl lg:text-7xl font-h1 text-white mb-6 drop-shadow-lg font-bold"
            >
              Plan Your Trip Smartly
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg md:text-xl font-body-lg text-white/90 mb-12 max-w-2xl mx-auto drop-shadow-md"
            >
              Leverage AI-driven intelligence to curate your perfect itinerary. Discover hidden gems and effortless luxury in every corner of the world.
            </motion.p>
          </div>

          {/* KEPT: Dynamic Smart Planner Form Overlay */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-full max-w-[1100px] px-8 z-20"
          >
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 grid grid-cols-1 md:grid-cols-5 gap-6 items-end">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <span className="material-symbols-outlined text-indigo-600">location_on</span> Destination
                </label>
                <input className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-600 transition-all text-sm" placeholder="Where to?" type="text" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <span className="material-symbols-outlined text-indigo-600">payments</span> Budget
                </label>
                <input className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" type="range" />
                <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  <span>$500</span><span>$10k+</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <span className="material-symbols-outlined text-indigo-600">calendar_month</span> Duration
                </label>
                <input className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-600 transition-all text-sm" placeholder="Days" type="number" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  <span className="material-symbols-outlined text-indigo-600">category</span> Travel type
                </label>
                <select className="w-full bg-gray-50 border-none rounded-xl py-3 px-4 focus:ring-2 focus:ring-indigo-600 transition-all text-sm appearance-none">
                  <option>Leisure</option>
                  <option>Adventure</option>
                  <option>Business</option>
                  <option>Luxury</option>
                </select>
              </div>
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full bg-indigo-600 text-white rounded-xl py-4 font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all hover:translate-y-[-2px] active:scale-95 whitespace-nowrap flex items-center justify-center gap-2 disabled:opacity-70 disabled:translate-y-0"
              >
                {isGenerating ? (
                  <>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles size={20} />
                    </motion.div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Compass size={20} />
                    Generate Smart Trip
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </section>

        {/* New Services Section */}
        <section className="max-w-[1536px] mx-auto px-12 py-24 bg-white">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Everything You Need for Your Journey</h2>
            <p className="text-gray-500 text-lg">One platform to plan, book, and enjoy your dream escape.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { title: 'Boutique Stays', icon: <Compass className="text-indigo-600" size={32} />, desc: 'Unique villas and homes curated by our AI for comfort and style.' },
              { title: 'Luxury Hotels', icon: <MapPin className="text-indigo-600" size={32} />, desc: 'Five-star experiences at the best rates in the world\'s top cities.' },
              { title: 'Global Flights', icon: <Sparkles className="text-indigo-600" size={32} />, desc: 'Seamless booking for international and domestic routes.' },
              { title: 'Smart Plans', icon: <Calendar className="text-indigo-600" size={32} />, desc: 'Custom itineraries tailored to your budget and travel style.' }
            ].map((item, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -8 }}
                className="p-8 rounded-[32px] bg-[#f8faff] border border-gray-50 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-6">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                <button className="mt-6 text-indigo-600 font-bold text-sm flex items-center gap-2 group">
                  Book now <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </motion.div>
            ))}
          </div>
        </section>

        {/* REVERTED: Top Destinations (How it was) */}
        <section className="max-w-[1536px] mx-auto px-12 pt-32 pb-20">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Top Destinations</h2>
              <p className="text-gray-500">Our AI's most-recommended escapes for this season.</p>
            </div>
            <button className="text-indigo-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
              Explore all <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { city: 'London, UK', price: '$1,200+', img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?q=80&w=2070&auto=format&fit=crop', desc: 'Historic charm meets modern luxury.' },
              { city: 'Kyoto, Japan', price: '$2,400+', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=2070&auto=format&fit=crop', desc: 'Serene temples and vibrant traditions.' },
              { city: 'Bali, Indonesia', price: '$850+', img: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2076&auto=format&fit=crop', desc: 'Tropical paradise and spiritual wellness.' },
              { city: 'Paris, France', price: '$1,800+', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=2073&auto=format&fit=crop', desc: 'Artistic wonders and culinary excellence.' }
            ].map((dest, i) => (
              <div key={i} className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <img className="w-full h-64 object-cover" src={dest.img} alt={dest.city} />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-indigo-600 font-bold text-sm">
                  {dest.price}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{dest.city}</h3>
                  <p className="text-sm text-gray-500">{dest.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* REVERTED: Featured Stays (How it was) */}
        <section className="bg-[#f0f3ff] py-24">
          <div className="max-w-[1536px] mx-auto px-12">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Stays</h2>
              <p className="text-gray-500 max-w-2xl mx-auto">Hand-picked accommodations where smart design meets comfort.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {[
                { name: 'The Glass Pavilion', loc: 'Santorini, Greece', price: '$450', img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop', tags: ['Boutique Luxury'], features: ['Free WiFi', 'Infinity Pool'] },
                { name: 'Urban Oasis Suites', loc: 'Singapore', price: '$320', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop', tags: ['Eco-Smart'], features: ['Sustainable', 'Gym'] },
                { name: 'Alpine Retreat', loc: 'Zermatt, Switzerland', price: '$590', img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=2070&auto=format&fit=crop', tags: ['Hidden Gem'], features: ['Full Spa', 'Michelin Star'] }
              ].map((stay, i) => (
                <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <div className="relative h-72">
                    <img className="w-full h-full object-cover" src={stay.img} alt={stay.name} />
                    <span className="absolute top-4 left-4 bg-indigo-600 text-white text-xs font-bold px-3 py-1 rounded-lg">{stay.tags[0]}</span>
                  </div>
                  <div className="p-8">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="text-lg font-bold">{stay.name}</h4>
                        <p className="text-sm text-gray-500">{stay.loc}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-indigo-600">{stay.price}</span>
                        <span className="text-xs text-gray-500 block">/ night</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500 border-t border-gray-100 pt-4">
                      {stay.features.map((feat, j) => (
                        <span key={j} className="flex items-center gap-1">
                          <span className="material-symbols-outlined text-sm">{j === 0 ? 'wifi' : 'pool'}</span> {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* REVERTED: Testimonials (How it was) */}
        <section className="max-w-[1536px] mx-auto px-12 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Explorers</h2>
            <p className="text-gray-500">Real stories from travelers who planned with intelligence.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah Jenkins', role: 'Backpacker & Photographer', quote: '"The Smart Planner found a route through Tokyo that I never would have discovered. It felt like having a local guide in my pocket."' },
              { name: 'Mark Thompson', role: 'Business Traveler', quote: '"Booking our honeymoon was effortless. VoyageSmart took care of the details so we could focus on the experience. Highly recommend!"' },
              { name: 'Elena Rodriguez', role: 'Family Travel Planner', quote: '"I love the budget slider feature. It helped us plan a luxury-feeling trip to Portugal without breaking our savings goals."' }
            ].map((test, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-6">
                <div className="flex gap-1 text-orange-400">
                  {[...Array(5)].map((_, j) => (
                    <span key={j} className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
                <p className="text-base text-gray-700 italic">{test.quote}</p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden"></div>
                  <div>
                    <p className="font-bold">{test.name}</p>
                    <p className="text-xs text-gray-500">{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* REVERTED: Final CTA & Footer (How it was) */}
        <section className="max-w-[1536px] mx-auto px-12 pb-32">
          <div className="relative bg-indigo-600 rounded-[2rem] overflow-hidden p-16 md:p-24 text-center">
            <div className="absolute inset-0 opacity-10">
              <img className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop" alt="Mountain road" />
            </div>
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Ready for your next adventure?</h2>
              <p className="text-lg text-white/80 max-w-2xl mx-auto mb-12">
                Join over 500,000 smart travelers who explore the world with ease. Start your journey today.
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <Link to="/signup" className="px-10 py-5 bg-white text-indigo-600 rounded-2xl font-bold text-lg shadow-xl hover:bg-gray-50 active:scale-95 transition-all">
                  Start Planning Now
                </Link>
                <button className="px-10 py-5 border-2 border-white/30 text-white rounded-2xl font-bold text-lg hover:bg-white/10 active:scale-95 transition-all">
                  View All Deals
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-50 border-t border-gray-200 w-full py-16">
        <div className="max-w-[1536px] mx-auto px-12 grid grid-cols-2 md:grid-cols-4 gap-12">
          <div className="col-span-2 md:col-span-1">
            <div className="text-xl font-bold text-indigo-600 mb-4">VoyageSmart</div>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              Effortless travel discovery powered by intelligence. Discover the world's most breathtaking stays and itineraries.
            </p>
            <div className="flex gap-4">
              <a className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition-colors" href="#">
                <span className="material-symbols-outlined">public</span>
              </a>
              <a className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-indigo-50 text-gray-400 hover:text-indigo-600 transition-colors" href="#">
                <span className="material-symbols-outlined">share</span>
              </a>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><a className="hover:text-indigo-600 transition-colors" href="#">About Us</a></li>
              <li><a className="hover:text-indigo-600 transition-colors" href="#">Destinations</a></li>
              <li><a className="hover:text-indigo-600 transition-colors" href="#">Travel Guides</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-gray-500">
              <li><a className="hover:text-indigo-600 transition-colors" href="#">Support</a></li>
              <li><a className="hover:text-indigo-600 transition-colors" href="#">Privacy Policy</a></li>
              <li><a className="hover:text-indigo-600 transition-colors" href="#">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 mb-6">Newsletter</h4>
            <p className="text-xs text-gray-500 mb-4">Get the latest smart itineraries delivered to your inbox.</p>
            <div className="flex gap-2">
              <input className="bg-white border border-gray-200 rounded-lg px-4 py-2 text-sm w-full focus:ring-2 focus:ring-indigo-600 focus:outline-none" placeholder="Email" type="email" />
              <button className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700">
                <span className="material-symbols-outlined">send</span>
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-[1280px] mx-auto px-8 pt-12 mt-12 border-t border-gray-100 text-center text-sm text-gray-400">
          © 2024 VoyageSmart Inc. Effortless Discovery.
        </div>
      </footer>
      {/* Smart Itinerary Modal */}
      <AnimatePresence>
        {showPlan && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPlan(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="bg-indigo-600 p-8 text-white relative">
                <button
                  onClick={() => setShowPlan(false)}
                  className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
                <div className="flex items-center gap-3 mb-2">
                  <Sparkles className="text-indigo-200" />
                  <span className="text-xs font-bold uppercase tracking-widest text-indigo-200">AI Generated Itinerary</span>
                </div>
                <h2 className="text-3xl font-bold">Your Dream Escape to Bali</h2>
                <p className="text-indigo-100 mt-2">7 Days of Zen, Adventure & Luxury</p>
              </div>

              {/* Modal Body */}
              <div className="p-8 overflow-y-auto">
                <div className="space-y-8">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Daily Budget</p>
                      <p className="text-lg font-bold text-indigo-600">$250</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Pace</p>
                      <p className="text-lg font-bold text-indigo-600">Relaxed</p>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                      <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Vibe</p>
                      <p className="text-lg font-bold text-indigo-600">Spiritual</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="font-bold text-xl flex items-center gap-2">
                      <MapPin className="text-indigo-600" size={20} /> Highlight Stops
                    </h3>
                    <div className="space-y-4">
                      {[
                        { day: 'Day 1-2', title: 'Ubud Spiritual Awakening', desc: 'Private yoga session at the Hanging Gardens followed by a traditional purification ritual at Tirta Empul.' },
                        { day: 'Day 3-5', title: 'Coastal Luxury in Uluwatu', desc: 'Sunset dinner at a clifftop lounge and exploring the hidden white sand beaches of the southern coast.' },
                        { day: 'Day 6-7', title: 'Island Bliss in Nusa Penida', desc: 'Crystal clear snorkeling and a scenic helicopter tour over the iconic T-Rex bay.' }
                      ].map((item, i) => (
                        <div key={i} className="flex gap-4 group">
                          <div className="flex flex-col items-center">
                            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                              {i + 1}
                            </div>
                            {i < 2 && <div className="w-0.5 flex-grow bg-indigo-100 my-1" />}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-indigo-600 mb-0.5">{item.day}</p>
                            <h4 className="font-bold text-gray-900 mb-1">{item.title}</h4>
                            <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowPlan(false)}
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold mt-10 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 size={20} />
                  Save to My Trips
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default LandingPage
