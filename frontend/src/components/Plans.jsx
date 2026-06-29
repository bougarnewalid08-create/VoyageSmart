import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api, { BACKEND_URL } from '../api/axios'
import FavoriteButton from './FavoriteButton'
import MobileNav from './MobileNav'
import { useFavorites } from '../hooks/useFavorites'

const PlanFilterContent = ({ isMobile, filters, setFilters }) => (
  <div className={isMobile ? "grid grid-cols-1 md:grid-cols-2 gap-8" : "space-y-10"}>
    <div className="space-y-6">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] block">Trip Duration</span>
      <div className="grid grid-cols-3 gap-2">
        {['1-3', '4-7', '8-14'].map((days) => (
          <button 
            key={days} 
            onClick={() => setFilters({ ...filters, duration: filters.duration === days ? null : days })}
            className={`py-3 rounded-xl border text-xs font-bold transition-all ${
              filters.duration === days 
                ? 'border-indigo-600 text-indigo-600 bg-indigo-50' 
                : 'border-slate-100 text-slate-600 hover:border-indigo-600 hover:text-indigo-600'
            }`}
          >
            {days} Days
          </button>
        ))}
      </div>
    </div>

    <div className="space-y-6">
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] block">Budget Level</span>
      <div className="space-y-3">
        {[
          { label: 'Essential', desc: 'Budget-friendly basics' },
          { label: 'Premium', desc: 'High-end comfort' },
          { label: 'Luxe', desc: 'Ultimate indulgence' }
        ].map((tier) => (
          <label key={tier.label} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all cursor-pointer group">
            <div className="flex-1">
              <p className="text-xs font-bold text-slate-900">{tier.label}</p>
              <p className="text-[10px] text-slate-400">{tier.desc}</p>
            </div>
            <input 
              name="budget" 
              type="radio"
              checked={filters.budget === tier.label}
              onChange={() => setFilters({ ...filters, budget: filters.budget === tier.label ? null : tier.label })}
              onClick={(e) => {
                if (filters.budget === tier.label) {
                  e.preventDefault();
                  setFilters({ ...filters, budget: null });
                }
              }}
              className="h-5 w-5 rounded-full border-slate-200 text-indigo-600 focus:ring-indigo-600 transition-all" 
            />
          </label>
        ))}
      </div>
    </div>

    <div className={isMobile ? "md:col-span-2 space-y-6" : "space-y-6"}>
      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] block">Travel Style</span>
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: 'terrain', label: 'Adventure' },
          { icon: 'favorite', label: 'Romantic' },
          { icon: 'museum', label: 'Cultural' },
          { icon: 'spa', label: 'Wellness' }
        ].map((theme) => (
          <label 
            key={theme.label} 
            onClick={() => setFilters({ ...filters, theme: filters.theme === theme.label ? null : theme.label })}
            className={`flex items-center gap-3 p-4 rounded-2xl border transition-all cursor-pointer group ${
              filters.theme === theme.label
                ? 'border-indigo-600 bg-indigo-50'
                : 'border-slate-100 hover:bg-indigo-50/50'
            }`}
          >
            <span className="material-symbols-outlined text-indigo-600 text-xl">{theme.icon}</span>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${filters.theme === theme.label ? 'text-indigo-600' : 'text-slate-600'}`}>
              {theme.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  </div>
);

const Plans = ({ user, onLogout }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [itineraries, setItineraries] = useState([]);
  const [loading, setLoading] = useState(true)
  const { isFavorite } = useFavorites();
  const [error, setError] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ duration: null, budget: null, theme: null });

  const fetchPlans = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/plans');
      setItineraries(response.data || []);
    } catch (err) {
      console.error("Error fetching plans:", err);
      setError("Unable to connect to the plans database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const filteredItineraries = itineraries.filter(plan => {
    let match = true;

    // Search Query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      match = match && (
        plan.title.toLowerCase().includes(query) ||
        plan.theme.toLowerCase().includes(query) ||
        (Array.isArray(plan.stops) && plan.stops.some(stop => stop.toLowerCase().includes(query)))
      );
    }

    // Theme
    if (filters.theme) {
      match = match && (plan.theme.toLowerCase() === filters.theme.toLowerCase());
    }

    // Budget
    if (filters.budget) {
      const price = Number(plan.price);
      if (filters.budget === 'Essential') match = match && (price < 1000);
      else if (filters.budget === 'Premium') match = match && (price >= 1000 && price <= 3000);
      else if (filters.budget === 'Luxe') match = match && (price > 3000);
    }

    // Duration
    if (filters.duration) {
      const numDays = parseInt(plan.duration.split(' ')[0], 10);
      if (filters.duration === '1-3') match = match && (numDays >= 1 && numDays <= 3);
      else if (filters.duration === '4-7') match = match && (numDays >= 4 && numDays <= 7);
      else if (filters.duration === '8-14') match = match && (numDays >= 8 && numDays <= 14);
    }

    return match;
  });

  return (
    <div className="bg-[#f9f9ff] min-h-screen font-['Inter'] relative overflow-hidden">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm h-20">
        <nav className="w-full flex items-center px-12 h-full">
          <div className="flex-1 flex items-center">
            <Link to="/" className="text-2xl font-bold tracking-tighter text-indigo-600">VoyageSmart</Link>
          </div>
          <div className="hidden md:flex flex-none items-center gap-8 font-['Plus_Jakarta_Sans'] text-sm font-medium tracking-tight">
            <Link className="text-gray-500 hover:text-indigo-600 transition-colors" to="/hotels">Hotels</Link>
            <Link className="text-gray-500 hover:text-indigo-600 transition-colors" to="/stays">Stays</Link>
            <Link className="text-gray-500 hover:text-indigo-600 transition-colors" to="/flights">Flights</Link>
            <Link className="text-indigo-600 border-b-2 border-indigo-600 pb-1" to="/plans">Plans</Link>
            <Link className="text-gray-500 hover:text-indigo-600 transition-colors" to="/favorites">Favorites</Link>
            {user && <Link className="text-gray-500 hover:text-indigo-600 transition-colors" to="/my-reservations">My Bookings</Link>}
          </div>
          <div className="hidden md:flex flex-1 items-center justify-end gap-4 font-['Plus_Jakarta_Sans'] text-sm font-medium">
            {user ? (
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-gray-900">Welcome, {user.name}</span>
                  <div className="flex gap-2">
                    {user.role === 'Admin' && <Link to="/dashboard" className="text-[10px] text-indigo-600 font-bold hover:underline">Open Dashboard</Link>}
                    <button onClick={onLogout} className="text-[10px] text-red-500 font-bold hover:underline">Sign Out</button>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {user.name.charAt(0)}
                </div>
              </div>
            ) : (
              <>
                <Link to="/login" className="px-5 py-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-all active:scale-95 duration-200">Log In</Link>
                <Link to="/signup" className="px-5 py-2 bg-indigo-600 text-white rounded-xl shadow-md hover:bg-indigo-700 active:scale-95 duration-200">Sign Up</Link>
              </>
            )}
          </div>
          
          <MobileNav user={user} onLogout={onLogout} currentPath="/plans" />
        </nav>
      </header>

      <motion.div 
        initial={false}
        animate={{ x: isFilterOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="hidden lg:block fixed top-0 left-0 bottom-0 w-[400px] bg-white z-[60] shadow-2xl border-r border-gray-100 overflow-y-auto no-scrollbar px-12 py-32"
      >
        <button onClick={() => setIsFilterOpen(false)} className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center bg-gray-50 rounded-2xl text-gray-400 hover:text-indigo-600 transition-all hover:rotate-90">
          <span className="material-symbols-outlined">close</span>
        </button>
        <div className="mb-10">
          <h3 className="text-3xl font-bold text-slate-900 tracking-tight mb-4">Journey Filters</h3>
          <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Tailored Itineraries</p>
        </div>
        <PlanFilterContent isMobile={false} filters={filters} setFilters={setFilters} />
        <button onClick={() => setIsFilterOpen(false)} className="w-full mt-10 py-5 bg-indigo-600 text-white rounded-[2rem] font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95">Show Plans</button>
      </motion.div>

      {isFilterOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setIsFilterOpen(false)} className="hidden lg:block fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50" />
      )}

      <main className="max-w-7xl mx-auto px-6 py-10 pt-32">
        <section className="mb-16">
          <h1 className="text-6xl font-black text-slate-900 tracking-tighter mb-4">Handcrafted Journeys</h1>
          <p className="text-slate-500 font-medium text-xl max-w-2xl">Skip the planning and start exploring. Choose from our collection of expert-curated travel experiences.</p>
        </section>

        <div className="lg:hidden bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm mb-12">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-600">map</span> Find your vibe
          </h3>
          <PlanFilterContent isMobile={true} filters={filters} setFilters={setFilters} />
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-center mb-16">
          <div className="relative w-full">
            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input 
              className="w-full pl-14 pr-6 py-5 bg-white border border-slate-100 rounded-3xl focus:ring-2 focus:ring-indigo-600 text-sm font-medium transition-all outline-none shadow-sm" 
              placeholder="Search by region, activity or theme..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button onClick={() => setIsFilterOpen(true)} className="hidden lg:flex items-center justify-center gap-3 bg-white border border-slate-100 text-slate-600 px-10 py-5 rounded-3xl font-bold text-sm hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-sm">
            <span className="material-symbols-outlined">tune</span> Filters
          </button>
        </div>

        {loading ? (
          <div className="p-20 text-center space-y-4">
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Curating your customized journeys...</p>
          </div>
        ) : error ? (
          <div className="p-20 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
            <span className="material-symbols-outlined text-5xl text-rose-300">cloud_off</span>
            <p className="text-slate-500 font-medium">{error}</p>
            <button onClick={fetchPlans} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-indigo-100 active:scale-95 transition-all">
              Try Again
            </button>
          </div>
        ) : filteredItineraries.length === 0 ? (
          <div className="p-20 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm space-y-4">
            <span className="material-symbols-outlined text-5xl text-slate-300">explore_off</span>
            <p className="text-slate-500 font-medium">No journeys matching your search terms.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItineraries.map((plan) => (
              <motion.div 
                key={plan.id}
                whileHover={{ y: -8 }}
                className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group border border-slate-100 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-56 overflow-hidden">
                    <img src={plan.image ? (plan.image.startsWith('http') ? plan.image : `${BACKEND_URL}${plan.image}`) : 'https://via.placeholder.com/600x400'} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={plan.title} />
                    <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-xl text-white text-[10px] font-bold border border-white/30">
                      {plan.duration}
                    </div>
                    <div className="absolute top-4 right-4 bg-indigo-600 text-white px-4 py-1.5 rounded-xl text-[10px] font-bold shadow-lg">
                      From ${Math.round(plan.price)}
                    </div>
                    <FavoriteButton className="absolute bottom-4 right-4 z-10" itemType="plan" itemId={plan.id} initialIsFavorite={isFavorite('plan', plan.id)} />
                  </div>
                  <div className="p-6 pb-2">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-indigo-50 text-indigo-600 px-2.5 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-widest">{plan.theme}</span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-1">{plan.title}</h3>
                    
                    <div className="flex items-center gap-3 mb-6 overflow-x-auto no-scrollbar pb-1">
                      {Array.isArray(plan.stops) && plan.stops.map((stop, idx) => (
                        <React.Fragment key={stop}>
                          <div className="flex flex-col items-center flex-none">
                            <div className="w-2 h-2 rounded-full bg-indigo-600 mb-1"></div>
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{stop}</span>
                          </div>
                          {idx !== plan.stops.length - 1 && (
                            <div className="h-[1.5px] w-6 bg-slate-100 flex-none mb-3"></div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                      <span className="material-symbols-outlined text-sm">group</span>
                      Max {plan.max_travelers || 4} guests
                    </div>
                    <Link to={`/plan-details/${plan.id}`}>
                      <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-indigo-100 hover:bg-indigo-700 hover:scale-102 transition-all">
                        View Journey
                      </button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-100 py-20 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <span className="text-3xl font-black text-indigo-600 mb-8 block">VoyageSmart</span>
          <div className="flex flex-wrap justify-center gap-10 mb-12">
            {['Destinations', 'Hotels', 'Stays', 'Privacy', 'Support'].map(link => (
              <a key={link} className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-indigo-600" href="#">{link}</a>
            ))}
          </div>
          <p className="text-slate-400 text-xs font-medium">© 2024 VoyageSmart Global. Crafted for the modern explorer.</p>
        </div>
      </footer>
    </div>
  )
}

export default Plans
