import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api, { BACKEND_URL } from '../api/axios'
import FavoriteButton from './FavoriteButton';
import MobileNav from './MobileNav'
import { useFavorites } from '../hooks/useFavorites';

const FilterContent = ({ isMobile, filters, setFilters }) => {
  const handlePriceChange = (e) => {
    setFilters({ ...filters, priceRange: [0, Number(e.target.value)] });
  };

  const handleStarToggle = (star) => {
    setFilters(prev => ({
      ...prev,
      stars: prev.stars.includes(star) 
        ? prev.stars.filter(s => s !== star)
        : [...prev.stars, star]
    }));
  };

  const handleAmenityToggle = (amenity) => {
    setFilters(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity]
    }));
  };

  return (
    <div className={isMobile ? "grid grid-cols-1 md:grid-cols-2 gap-8" : "space-y-10"}>
      {/* Price Range */}
      <div className="space-y-6">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] block">Price Range</span>
        <div className="space-y-4">
          <input 
            className="w-full h-2 bg-indigo-50 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
            max="1000" min="0" step="10" type="range" 
            value={filters.priceRange[1]}
            onChange={handlePriceChange}
          />
          <div className="flex justify-between text-xs font-bold text-slate-500 uppercase tracking-widest">
            <span>$0</span>
            <span>${filters.priceRange[1] === 1000 ? '1,000+' : filters.priceRange[1]}</span>
          </div>
        </div>
      </div>

      {/* Rating */}
      <div className="space-y-6">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] block">Star Rating</span>
        <div className={isMobile ? "grid grid-cols-3 gap-3" : "space-y-3"}>
          {[5, 4, 3].map((star) => (
            <label key={star} className="flex items-center gap-3 cursor-pointer group">
              <input 
                className="peer h-5 w-5 rounded border-slate-200 text-indigo-600 focus:ring-indigo-600 transition-all cursor-pointer" 
                type="checkbox" 
                checked={filters.stars.includes(star)}
                onChange={() => handleStarToggle(star)}
              />
              <span className="flex items-center text-sm font-bold text-slate-600 peer-checked:text-indigo-600 group-hover:text-indigo-600 transition-colors">
                {star === 5 ? '5' : star + '+'} <span className="material-symbols-outlined text-amber-400 ml-1 scale-75" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div className={isMobile ? "md:col-span-2 space-y-6" : "space-y-6"}>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] block">Amenities</span>
        <div className={isMobile ? "grid grid-cols-2 md:grid-cols-4 gap-3" : "grid grid-cols-1 gap-3"}>
          {['pool', 'wifi', 'spa', 'fitness_center'].map((amenity) => {
            const isSelected = filters.amenities.includes(amenity);
            return (
              <label key={amenity} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer group ${isSelected ? 'border-indigo-600 bg-indigo-50/50' : 'border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/50'}`}>
                <input type="checkbox" className="hidden" checked={isSelected} onChange={() => handleAmenityToggle(amenity)} />
                <span className="material-symbols-outlined text-indigo-600 group-hover:scale-110 transition-transform">{amenity}</span>
                <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">{amenity.replace('_', ' ')}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const Hotels = ({ user, onLogout }) => {
  const [isFilterOpen, setIsFilterOpen] = React.useState(false)
  const [dbHotels, setDbHotels] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const { isFavorite } = useFavorites();
  const [error, setError] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const [filters, setFilters] = React.useState({
    priceRange: [0, 1000],
    stars: [],
    amenities: []
  });  React.useEffect(() => {
    fetchHotels()
  }, [])

  const fetchHotels = async () => {
    setLoading(true)
    try {
      const res = await api.get('/hotels')
      setDbHotels(res.data)
      setLoading(false)
    } catch (err) {
      console.error("Error fetching hotels:", err)
      setError("Failed to load hotel inventory.")
      setLoading(false)
    }
  }

  const hotelList = dbHotels.filter(hotel => {
    // Only filter out if maxPrice < 1000, since 1000 represents "1000+"
    if (filters.priceRange[1] < 1000 && hotel.price > filters.priceRange[1]) return false;
    
    if (filters.stars.length > 0) {
      // Use Math.floor to put ratings into buckets: 4.8 -> 4 ("4+"), 5.0 -> 5 ("5").
      const hotelBucket = Math.floor(hotel.stars || hotel.rating || 0);
      if (!filters.stars.includes(hotelBucket)) return false;
    }

    if (filters.amenities.length > 0 && hotel.amenities) {
      const hotelAmenityIds = hotel.amenities.map(a => a.name ? a.name.toLowerCase().replace(' ', '_') : a);
      for (let am of filters.amenities) {
        if (!hotelAmenityIds.includes(am)) return false;
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

      {/* ... header same ... */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm h-20">
        <nav className="w-full flex items-center px-12 h-full">
          {/* Left Column: Logo */}
          <div className="flex-1 flex items-center">
            <Link to="/" className="text-2xl font-bold tracking-tighter text-indigo-600">VoyageSmart</Link>
          </div>

          {/* Center Column: Navigation */}
          <div className="hidden md:flex flex-none items-center gap-8 font-['Plus_Jakarta_Sans'] text-sm font-medium tracking-tight">
            <Link className="text-indigo-600 border-b-2 border-indigo-600 pb-1" to="/hotels">Hotels</Link>
            <Link className="text-gray-500 hover:text-indigo-600 transition-colors" to="/stays">Stays</Link>
            <Link className="text-gray-500 hover:text-indigo-600 transition-colors" to="/flights">Flights</Link>
            <Link className="text-gray-500 hover:text-indigo-600 transition-colors" to="/plans">Plans</Link>
            <Link className="text-gray-500 hover:text-indigo-600 transition-colors" to="/favorites">Favorites</Link>
            {user && <Link className="text-gray-500 hover:text-indigo-600 transition-colors" to="/my-reservations">My Bookings</Link>}
          </div>

          {/* Right Column: Profile/Auth */}
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
          
          <MobileNav user={user} onLogout={onLogout} currentPath="/hotels" />
        </nav>
      </header>

      {/* Filter Sidebar Drawer - DESKTOP ONLY */}
      <motion.div
        initial={false}
        animate={{ x: isFilterOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="hidden lg:block fixed top-0 left-0 bottom-0 w-[400px] bg-white z-[60] shadow-2xl border-r border-gray-100 overflow-y-auto no-scrollbar px-12 py-32"
      >
        <button
          onClick={() => setIsFilterOpen(false)}
          className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center bg-gray-50 rounded-2xl text-gray-400 hover:text-indigo-600 transition-all hover:rotate-90"
        >
          <span className="material-symbols-outlined">close</span>
        </button>

        <FilterContent isMobile={false} filters={filters} setFilters={setFilters} />

        <button
          onClick={() => setIsFilterOpen(false)}
          className="w-full mt-10 py-5 bg-indigo-600 text-white rounded-[2rem] font-bold text-sm shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
        >
          Apply Filters
        </button>
      </motion.div>

      {/* Backdrop - DESKTOP ONLY */}
      {isFilterOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setIsFilterOpen(false)}
          className="hidden lg:block fixed inset-0 bg-slate-900/40 backdrop-blur-md z-50"
        />
      )}

      <main className="max-w-[1536px] mx-auto px-6 md:px-12 pt-32 pb-20">
        <div className="flex flex-col gap-10">

          {/* Mobile/Tablet Filters - "OLD" STYLE */}
          <div className="lg:hidden bg-white border border-slate-100 rounded-[2rem] p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-600">tune</span>
              Refine your search
            </h3>
            <FilterContent isMobile={true} filters={filters} setFilters={setFilters} />
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            {/* Search & Sort Bar */}
            <div className="bg-white border border-slate-100 p-5 rounded-[2rem] mb-10 flex flex-col md:flex-row gap-5 items-center justify-between shadow-sm">
              <div className="relative flex-1 w-full">
                <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                <input className="w-full pl-14 pr-6 py-4 bg-slate-50/50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 text-sm font-medium transition-all outline-none" placeholder="Search hotels, cities, or landmarks..." type="text" />
              </div>
              <div className="flex items-center gap-4 w-full md:w-auto">
                <select className="bg-slate-50/50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-600 focus:ring-2 focus:ring-indigo-600 cursor-pointer w-full md:w-56 outline-none appearance-none">
                  <option>Recommended</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Top Rated</option>
                </select>
                {/* Toggle Button - ONLY ON DESKTOP */}
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="hidden lg:flex bg-indigo-600 text-white p-4 rounded-2xl hover:shadow-lg hover:shadow-indigo-100 transition-all active:scale-95 items-center gap-2 px-6"
                >
                  <span className="material-symbols-outlined">tune</span>
                  <span className="text-sm font-bold">Filters</span>
                </button>
              </div>
            </div>

            {/* Grid of Hotel Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {loading ? (
                // Skeleton Loaders
                Array(8).fill(0).map((_, i) => (
                  <div key={i} className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-slate-50 animate-pulse">
                    <div className="h-64 bg-slate-200" />
                    <div className="p-7 space-y-4">
                      <div className="h-4 bg-slate-100 rounded w-3/4" />
                      <div className="h-6 bg-slate-200 rounded w-full" />
                      <div className="h-4 bg-slate-100 rounded w-1/2" />
                      <div className="h-12 bg-slate-100 rounded-2xl w-full" />
                    </div>
                  </div>
                ))
              ) : hotelList.map((hotel) => (
                <motion.div
                  key={hotel.id}
                  whileHover={{ y: -8 }}
                  className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-slate-50"
                >
                  <div className="relative h-64 overflow-hidden bg-slate-100">
                    <img
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      src={hotel.image?.startsWith('http') ? hotel.image : `${BACKEND_URL}${hotel.image}`}
                      alt={hotel.name}
                      loading="lazy"
                    />
                  <div className="absolute top-5 right-5 flex items-center z-10">
                    <div className="bg-indigo-600 text-white pl-4 pr-6 py-2 rounded-l-full text-xs font-bold shadow-lg -mr-4">
                      ${hotel.price}<span className="font-medium opacity-80 text-[10px]">/night</span>
                    </div>
                    <FavoriteButton className="relative z-20 shadow-xl border border-white" itemType="hotel" itemId={hotel.id} initialIsFavorite={isFavorite('hotel', hotel.id)} />
                  </div>
                  </div>
                  <div className="p-7">
                    <div className="flex items-center gap-1.5 text-amber-500 mb-3">
                      <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="text-xs font-bold text-slate-900">{hotel.stars ? hotel.stars.toFixed(1) : (hotel.rating || '4.8')}</span>
                      <span className="text-slate-400 font-medium text-[11px] ml-1">({hotel.reviews_count || hotel.reviews || '156'} reviews)</span>
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="material-symbols-outlined text-[14px] text-emerald-500">meeting_room</span>
                      <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">{hotel.available_rooms} rooms available</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-slate-900 group-hover:text-indigo-600 transition-colors tracking-tight">{hotel.name}</h3>
                    <div className="flex items-center gap-1.5 text-slate-500 mb-6">
                      <span className="material-symbols-outlined text-[18px] text-indigo-400">location_on</span>
                      <span className="text-xs font-medium">{hotel.location}</span>
                    </div>
                    <Link to={`/hotel-details/${hotel.id}`} className="block w-full">
                      <button className="w-full py-4 bg-indigo-50 text-indigo-600 rounded-2xl font-bold text-sm hover:bg-indigo-600 hover:text-white transition-all active:scale-95 shadow-sm">
                        View Details
                      </button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-100 mt-20">
        <div className="max-w-[1536px] mx-auto py-16 px-12 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-center md:text-left">
            <span className="text-2xl font-black tracking-tighter text-indigo-600 block mb-3">VoyageSmart</span>
            <p className="text-slate-500 text-sm max-w-sm leading-relaxed font-medium">© 2024 VoyageSmart Global. Effortless discovery for the modern traveler with premium intelligence.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-5">
            {['About', 'Destinations', 'Favorites', 'Privacy', 'Terms'].map(link => (
              <a key={link} className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-600 transition-colors duration-300" href="#">{link}</a>
            ))}
          </div>
          <div className="flex gap-4">
            <a className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-white transition-all shadow-sm" href="#">
              <span className="material-symbols-outlined">public</span>
            </a>
            <a className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-white transition-all shadow-sm" href="#">
              <span className="material-symbols-outlined">mail</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Hotels
