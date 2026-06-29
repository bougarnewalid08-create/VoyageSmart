import React, { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import FavoriteButton from './FavoriteButton'
import MobileNav from './MobileNav'
import { useFavorites } from '../hooks/useFavorites'
import { BACKEND_URL } from '../api/axios'
import api from '../api/axios'

import StayFilterPanel from './StayFilterPanel';

const Stays = ({ user, onLogout }) => {
  const [dbStays, setDbStays] = useState([]);
  const [loading, setLoading] = useState(true)
  const { isFavorite } = useFavorites();
  const [error, setError] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, []);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    propertyType: 'All',
    priceRange: [100, 2500],
    features: []
  });
  const [searchInput, setSearchInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const fetchStays = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get('/stays');
      setDbStays(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error("Error fetching stays:", err);
      setError("Unable to connect to the travel database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStays();
  }, []);

  const allStays = [
    ...dbStays.map(s => ({
      id: s.id,
      name: s.name,
      location: s.location,
      price: s.price_per_night,
      rating: s.rating || 0,
      reviews: s.reviews_count || 0,
      image: s.images?.find(img => img.is_main)?.image || s.images?.[0]?.image || 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=2070&auto=format&fit=crop',
      type: s.property_type,
      desc: s.description || 'Experience luxury in this unique property.',
      available_rooms: s.available_rooms || Math.floor(Math.random() * 40) + 10,
      // Updated to extract amenity names from object array
      amenities: s.amenities?.map(a => a.name) || []
    }))
  ].filter(stay => {
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      if (!stay.name.toLowerCase().includes(term) && !stay.location.toLowerCase().includes(term)) {
        return false;
      }
    }
    if (filters.propertyType !== 'All' && stay.type !== filters.propertyType) return false;
    if (stay.price < filters.priceRange[0] || stay.price > filters.priceRange[1]) return false;
    if (filters.features.length > 0) {
      for (let feature of filters.features) {
        if (!stay.amenities.includes(feature)) return false;
      }
    }
    return true;
  });

  return (
    <div className="bg-[#f9f9ff] min-h-screen font-['Inter'] relative overflow-hidden">
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Dynamic TopNavBar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm h-20">
        <nav className="w-full flex items-center px-12 h-full">
          <div className="flex-1 flex items-center">
            <Link to="/" className="text-2xl font-bold tracking-tighter text-indigo-600">VoyageSmart</Link>
          </div>

          <div className="hidden md:flex flex-none items-center gap-8 font-['Plus_Jakarta_Sans'] text-sm font-medium tracking-tight">
            <Link className="text-gray-500 hover:text-indigo-600 transition-colors" to="/hotels">Hotels</Link>
            <Link className="text-indigo-600 border-b-2 border-indigo-600 pb-1" to="/stays">Stays</Link>
            <Link className="text-gray-500 hover:text-indigo-600 transition-colors" to="/flights">Flights</Link>
            <Link className="text-gray-500 hover:text-indigo-600 transition-colors" to="/plans">Plans</Link>
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
          
          <MobileNav user={user} onLogout={onLogout} currentPath="/stays" />
        </nav>
      </header>

      {/* Filter Sidebar */}
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: isFilterOpen ? 0 : '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 w-full md:w-[450px] h-screen bg-white shadow-2xl z-[60] p-10 overflow-y-auto"
      >
        <StayFilterPanel 
          isMobile={true} 
          onClose={() => setIsFilterOpen(false)}
          onApplyFilters={(newFilters) => setFilters(newFilters)}
          currentFilters={filters}
        />
      </motion.div>

      {/* Backdrop */}
      {isFilterOpen && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => setIsFilterOpen(false)} className="hidden lg:block fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50" />
      )}

      <main className="max-w-[1536px] mx-auto px-6 md:px-12 pt-32 pb-20">
        <section className="mb-12">
          <h1 className="text-5xl font-black text-slate-900 tracking-tight mb-4">Discover Unique Stays</h1>
          <p className="text-slate-500 font-medium text-lg">Hand-picked properties for your next extraordinary journey.</p>
        </section>

        <section className="mb-10">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">search</span>
              <input 
                className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-600 text-sm font-medium transition-all outline-none shadow-sm" 
                placeholder="Where would you like to stay?" 
                type="text" 
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && setSearchTerm(searchInput)}
              />
            </div>
            <div className="flex gap-3 w-full md:w-auto">
              <button onClick={() => setIsFilterOpen(true)} className="hidden lg:flex items-center justify-center gap-2 bg-white border border-slate-100 text-slate-600 px-8 py-4 rounded-2xl font-bold text-sm hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-sm">
                <span className="material-symbols-outlined text-[20px]">tune</span>
                Preferences
              </button>
              <button 
                onClick={() => setSearchTerm(searchInput)}
                className="w-full md:w-auto bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
              >
                Search
              </button>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {loading ? (
            <div className="col-span-full p-20 text-center space-y-4">
              <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Scanning the globe for your stays...</p>
            </div>
          ) : error ? (
            <div className="col-span-full p-20 text-center bg-white rounded-[3rem] border border-slate-100 shadow-sm space-y-6">
              <span className="material-symbols-outlined text-5xl text-rose-300">cloud_off</span>
              <p className="text-slate-500 font-medium">{error}</p>
              <button onClick={fetchStays} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-indigo-100 active:scale-95 transition-all">
                Try Again
              </button>
            </div>
          ) : allStays.map((stay) => (
            <motion.div 
              key={stay.id} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-slate-50"
            >
              <div className="relative h-64 overflow-hidden bg-slate-100">
                <img 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  src={stay.image.startsWith('http') ? stay.image : `${BACKEND_URL}${stay.image}`} 
                  alt={stay.name} 
                  loading="lazy"
                />
                <div className="absolute top-5 right-5 flex items-center z-10">
                  <div className="bg-indigo-600 text-white pl-4 pr-6 py-2 rounded-l-full text-xs font-bold shadow-lg -mr-4">
                    ${stay.price}<span className="font-medium opacity-80 text-[10px]">/night</span>
                  </div>
                  <FavoriteButton className="relative z-20 shadow-xl border border-white" itemType="stay" itemId={stay.id} initialIsFavorite={isFavorite('stay', stay.id)} />
                </div>
              </div>

              <div className="p-7">
                <div className="flex items-center gap-1.5 text-amber-500 mb-3">
                  <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  <span className="text-xs font-bold text-slate-900">{stay.rating ? Number(stay.rating).toFixed(1) : '4.0'}</span>
                  <span className="text-slate-400 font-medium text-[11px] ml-1">({stay.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-[14px] text-emerald-500">meeting_room</span>
                  <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{stay.available_rooms} rooms available</span>
                </div>
                <h3 className="text-xl font-bold mb-2 text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight truncate">{stay.name}</h3>
                <div className="flex items-center gap-1.5 text-slate-500 mb-6">
                  <span className="material-symbols-outlined text-[18px] text-indigo-400">location_on</span>
                  <span className="text-xs font-medium truncate">{stay.location}</span>
                </div>
                <Link to={`/stay-details/${stay.id}`} className="block w-full">
                  <button className="w-full py-4 bg-indigo-50 text-indigo-600 rounded-2xl font-bold text-sm hover:bg-indigo-600 hover:text-white transition-all active:scale-95 shadow-sm">
                    View Details
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </main>

      <footer className="bg-white border-t border-gray-100 w-full py-12 px-6 mt-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl font-bold text-indigo-600 mb-4">VoyageSmart</h3>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm mx-auto md:mx-0">Effortless Discovery at your fingertips.</p>
          </div>
          <div className="col-span-1">
            <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-widest">Platform</h4>
            <ul className="space-y-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <li><Link to="/hotels" className="hover:text-indigo-600 transition-colors">Hotels</Link></li>
              <li><Link to="/stays" className="hover:text-indigo-600 transition-colors">Stays</Link></li>
            </ul>
          </div>
          <div className="col-span-1">
            <h4 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-widest">Support</h4>
            <ul className="space-y-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-indigo-600 transition-colors">Safety</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Stays
