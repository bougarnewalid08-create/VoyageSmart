import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import FavoriteButton from './FavoriteButton';
import MobileNav from './MobileNav';
import { useFavorites } from '../hooks/useFavorites';
import api, { BACKEND_URL } from '../api/axios';
import { HeartCrack } from 'lucide-react';

const Favorites = ({ user, onLogout }) => {
  const { favorites, loading: favoritesLoading, isFavorite, refreshFavorites } = useFavorites();
  const [activeTab, setActiveTab] = useState('hotels');
  
  // Data states
  const [items, setItems] = useState({
    stays: [],
    hotels: [],
    flights: [],
    plans: []
  });
  const [loadingItems, setLoadingItems] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const fetchAllItems = async () => {
      try {
        setLoadingItems(true);
        const [staysRes, hotelsRes, flightsRes, plansRes] = await Promise.all([
          api.get('/stays'),
          api.get('/hotels'),
          api.get('/flights'),
          api.get('/plans')
        ]);

        setItems({
          stays: staysRes.data,
          hotels: hotelsRes.data,
          flights: flightsRes.data,
          plans: plansRes.data
        });
      } catch (err) {
        console.error("Failed to load items for favorites mapping", err);
      } finally {
        setLoadingItems(false);
      }
    };
    fetchAllItems();
  }, []);

  const getFavoritedItems = (type) => {
    if (!favorites || favorites.length === 0) return [];
    
    // Get array of item_ids for this type
    const favoriteIds = favorites
      .filter(f => f.item_type === type)
      .map(f => Number(f.item_id));

    // Filter the items state
    return items[type + (type === 'stay' || type === 'hotel' || type === 'flight' || type === 'plan' ? 's' : '')] 
      ?.filter(item => favoriteIds.includes(Number(item.id))) || [];
  };

  const currentItems = getFavoritedItems(activeTab.slice(0, -1)); // stays -> stay

  const handleFavoriteToggle = () => {
    refreshFavorites();
  };

  return (
    <div className="bg-[#f8fafc] min-h-screen font-['Plus_Jakarta_Sans'] text-slate-800">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm h-20">
        <nav className="w-full flex items-center px-12 h-full">
          <div className="flex-1 flex items-center">
            <Link to="/" className="text-2xl font-bold tracking-tighter text-indigo-600">VoyageSmart</Link>
          </div>

          <div className="hidden md:flex flex-none items-center gap-8 font-['Plus_Jakarta_Sans'] text-sm font-medium tracking-tight">
            <Link className="text-gray-500 hover:text-indigo-600 transition-colors" to="/hotels">Hotels</Link>
            <Link className="text-gray-500 hover:text-indigo-600 transition-colors" to="/stays">Stays</Link>
            <Link className="text-gray-500 hover:text-indigo-600 transition-colors" to="/flights">Flights</Link>
            <Link className="text-gray-500 hover:text-indigo-600 transition-colors" to="/plans">Plans</Link>
            <Link className="text-indigo-600 border-b-2 border-indigo-600 pb-1" to="/favorites">Favorites</Link>
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
          
          <MobileNav user={user} onLogout={onLogout} currentPath="/favorites" />
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-6 md:px-12 pt-32 pb-20">
        <div className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-4">Your Favorites</h1>
          <p className="text-slate-500 font-medium">Manage all your saved properties, flights, and plans in one place.</p>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto no-scrollbar gap-4 mb-8 pb-2">
          {['hotels', 'stays', 'flights', 'plans'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 rounded-2xl text-sm font-bold capitalize transition-all whitespace-nowrap ${
                activeTab === tab 
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' 
                  : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-100'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {loadingItems || favoritesLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : currentItems.length === 0 ? (
          <div className="bg-white rounded-[2rem] border border-slate-100 p-16 text-center shadow-sm flex flex-col items-center justify-center">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <HeartCrack className="text-slate-300" size={40} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">No saved {activeTab}</h3>
            <p className="text-slate-500 max-w-sm mb-8">You haven't added any {activeTab} to your favorites yet. Start exploring to build your dream itinerary!</p>
            <Link to={`/${activeTab}`} className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all active:scale-95">
              Explore {activeTab}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentItems.map(item => {
              let imageSrc = item.image || item.airline_logo;
              let itemPrice = item.price;
              
              if (activeTab === 'stays') {
                imageSrc = item.images?.find(img => img.is_main)?.image || item.images?.[0]?.image || 'https://via.placeholder.com/600x400';
                itemPrice = item.price_per_night;
              }

              return (
                <div key={item.id} className="bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 relative group">
                  <FavoriteButton 
                    itemType={activeTab.slice(0, -1)} 
                    itemId={item.id} 
                    initialIsFavorite={true} 
                    onToggle={handleFavoriteToggle} 
                  />
                  
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={imageSrc?.startsWith('http') ? imageSrc : `${BACKEND_URL}${imageSrc}`} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      alt={item.name || item.title || item.airline}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-bold text-lg text-slate-900 mb-2 truncate">{item.name || item.title || `${item.airline} Flight`}</h3>
                    {item.location && <p className="text-sm text-slate-500 truncate mb-4">{item.location}</p>}
                    {item.departure_city && <p className="text-sm text-slate-500 truncate mb-4">{item.departure_city} to {item.arrival_city}</p>}
                    
                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100">
                      <div className="font-bold text-indigo-600">
                        ${Math.round(itemPrice)} <span className="text-xs text-slate-400 font-medium">/ {activeTab === 'flights' ? 'ticket' : 'night'}</span>
                      </div>
                      <Link to={activeTab === 'flights' ? `/flights` : `/${activeTab.slice(0, -1)}-details/${item.id}`} className="text-xs font-bold text-slate-900 hover:text-indigo-600 transition-colors">
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default Favorites;
