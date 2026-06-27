import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Users, 
  LayoutDashboard, 
  LogOut, 
  Search, 
  Bell, 
  TrendingUp,
  Calendar,
  Home,
  Plus,
  Trash2,
  Edit2,
  Image as ImageIcon,
  Plane
} from 'lucide-react'
import { Link } from 'react-router-dom'
import api, { BACKEND_URL } from '../api/axios'
import { AIRLINES } from '../constants/airlines'
import { calculateSeatDistribution } from '../utils/seatCalculator'

const Dashboard = ({ user, onLogout }) => {
  const [users, setUsers] = useState([])
  const [stays, setStays] = useState([])
  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('selector')
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingStayId, setEditingStayId] = useState(null)
  
  const initialFormState = {
    name: '',
    property_type: 'Villa',
    location: '',
    city: '',
    country: '',
    price_per_night: '',
    guests: 1,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    area: '',
    description: '',
    image: null,
    galleryFiles: null,
    amenities: ['WiFi', 'Kitchen', 'Pool', 'Parking'],
    rules: [],
    user_id: user?.id
  };

  const [formData, setFormData] = useState(initialFormState)

  const [newRule, setNewRule] = useState('')
  const [newAmenity, setNewAmenity] = useState('')

  const [hotelFormData, setHotelFormData] = useState({
    name: '',
    location: '',
    city: '',
    country: '',
    price: '',
    description: '',
    image: null,
    galleryFiles: null,
    amenities: [],
    stars: 5,
    is_premier: false,
    user_id: user?.id
  })

  const [showHotelForm, setShowHotelForm] = useState(false)
  const [editingHotelId, setEditingHotelId] = useState(null)

  const [showFlightForm, setShowFlightForm] = useState(false)
  const [editingFlightId, setEditingFlightId] = useState(null)

  const initialFlightFormState = {
    airline: '',
    airline_logo: '',
    flight_number: '',
    departure_airport: '',
    arrival_airport: '',
    departure_city: '',
    arrival_city: '',
    departure_time: '',
    arrival_time: '',
    duration: '',
    price: '',
    total_seats: 70,
    available_seats: 70,
    is_active: true
  }
  const [flightFormData, setFlightFormData] = useState(initialFlightFormState)

  const [plans, setPlans] = useState([])
  const [flights, setFlights] = useState([])
  const [showPlanForm, setShowPlanForm] = useState(false)
  const [editingPlanId, setEditingPlanId] = useState(null)
  const [activeItineraryDay, setActiveItineraryDay] = useState(1)
  
  const initialPlanFormState = {
    title: '',
    duration: '',
    stops: '', 
    price: '',
    image: null,
    theme: 'Adventure',
    budget_level: 'Premium',
    activities: [],
    hotel_id: '',
    stay_id: '',
    flight_id: '',
    is_active: true,
    max_travelers: 4
  }

  const [planFormData, setPlanFormData] = useState(initialPlanFormState)

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null
  })

  const showConfirm = (title, message, onConfirm) => {
    setConfirmModal({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirmModal(prev => ({ ...prev, isOpen: false }));
      }
    });
  }

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      try {
        const staysRes = await api.get('/stays');
        setStays(staysRes.data);
      } catch (err) { console.error("Error stays:", err); }

      try {
        const usersRes = await api.get('/users');
        setUsers(usersRes.data);
      } catch (err) { console.error("Error users:", err); }

      try {
        const hotelsRes = await api.get('/hotels');
        setHotels(hotelsRes.data);
      } catch (err) { console.error("Error hotels:", err); }

      try {
        const plansRes = await api.get('/plans');
        setPlans(plansRes.data);
      } catch (err) { console.error("Error plans:", err); }

      try {
        const flightsRes = await api.get('/flights');
        setFlights(flightsRes.data);
      } catch (err) { console.error("Error flights:", err); }

      setLoading(false);
    } catch (err) {
      setError("Failed to load dashboard data.");
      setLoading(false);
    }
  };

  const getTodayDatetimeLocal = () => {
    const now = new Date();
    const pad = (num) => String(num).padStart(2, '0');
    return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`;
  };

  useEffect(() => {
    if (flightFormData.departure_time && flightFormData.arrival_time) {
      const dep = new Date(flightFormData.departure_time);
      const arr = new Date(flightFormData.arrival_time);
      const diffMs = arr - dep;
      if (diffMs > 0) {
        const diffMins = Math.round(diffMs / 60000);
        setFlightFormData(prev => ({ ...prev, duration: diffMins }));
      } else {
        setFlightFormData(prev => ({ ...prev, duration: 0 }));
      }
    }
  }, [flightFormData.departure_time, flightFormData.arrival_time]);

  const handleSubmitFlight = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        ...flightFormData,
        available_seats: editingFlightId ? flightFormData.available_seats : flightFormData.total_seats
      }
      
      let res;
      if (editingFlightId) {
        res = await api.put(`/flights/${editingFlightId}`, payload)
        setFlights(flights.map(f => f.id === editingFlightId ? res.data : f))
      } else {
        res = await api.post('/flights', payload)
        setFlights([res.data, ...flights])
      }
      
      setShowFlightForm(false)
      setEditingFlightId(null)
      setFlightFormData(initialFlightFormState)
      setLoading(false)
    } catch (err) {
      console.error("Error saving flight:", err)
      setError("Failed to save flight.")
      setLoading(false)
    }
  }

  const handleDeleteFlight = (id) => {
    showConfirm(
      "Delete Flight Route",
      "Are you sure you want to delete this flight route? This action cannot be undone.",
      async () => {
        try {
          await api.delete(`/flights/${id}`)
          setFlights(flights.filter(f => f.id !== id))
        } catch (err) {
          console.error("Error deleting flight:", err)
        }
      }
    );
  }

  const handleSubmitHotel = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = new FormData()
      Object.keys(hotelFormData).forEach(key => {
        if (key === 'image') {
          if (hotelFormData[key] instanceof File) {
            data.append('image', hotelFormData[key])
          }
        } else if (key === 'galleryFiles' && hotelFormData[key]) {
          Array.from(hotelFormData[key]).forEach(file => data.append('images[]', file))
        } else if (key === 'amenities') {
          data.append('amenities', JSON.stringify(hotelFormData[key]))
        } else if (key !== 'galleryFiles') {
          data.append(key, hotelFormData[key])
        }
      })

      if (editingHotelId) {
        data.append('_method', 'PUT')
        const res = await api.post(`/hotels/${editingHotelId}`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
        setHotels(hotels.map(h => h.id === editingHotelId ? res.data : h))
      } else {
        const res = await api.post('/hotels', data, { headers: { 'Content-Type': 'multipart/form-data' } })
        setHotels([res.data, ...hotels])
      }

      setShowHotelForm(false)
      setEditingHotelId(null)
      setHotelFormData({ 
        name: '', location: '', city: '', country: '', price: '', description: '', 
        image: null, galleryFiles: null, amenities: [], stars: 5, is_premier: false, 
        total_rooms: 10, user_id: user?.id 
      })
      setLoading(false)
    } catch (err) {
      console.error("Error saving hotel:", err)
      setError("Failed to save hotel.")
      setLoading(false)
    }
  }

  const handleDeleteHotel = async (id) => {
    showConfirm(
      "Delete Hotel",
      "Are you sure you want to delete this hotel? This action cannot be undone.",
      async () => {
        try {
          await api.delete(`/hotels/${id}`)
          setHotels(hotels.filter(h => h.id !== id))
        } catch (err) {
          console.error("Error deleting hotel:", err)
        }
      }
    );
  }

  
  const handleAddDay = () => {
    const nextDay = planFormData.activities.length + 1;
    setPlanFormData({
      ...planFormData,
      activities: [...planFormData.activities, { day: nextDay, activities: [] }]
    });
    setActiveItineraryDay(nextDay);
  }

  const handleRemoveDay = (dayIndex) => {
    const newActivities = planFormData.activities
      .filter((_, idx) => idx !== dayIndex)
      .map((dayData, idx) => ({ ...dayData, day: idx + 1 }));
    setPlanFormData({ ...planFormData, activities: newActivities });
    setActiveItineraryDay(prev => {
      const newLen = newActivities.length;
      if (newLen === 0) return 1;
      if (prev > newLen) return newLen;
      return prev;
    });
  }

  const handleAddActivity = (dayIndex) => {
    const updatedActivities = [...planFormData.activities];
    updatedActivities[dayIndex].activities.push({
      time: '09:00 AM',
      type: 'explore',
      title: '',
      description: '',
      meta: ''
    });
    setPlanFormData({ ...planFormData, activities: updatedActivities });
  }

  const handleRemoveActivity = (dayIndex, activityIndex) => {
    const updatedActivities = [...planFormData.activities];
    updatedActivities[dayIndex].activities = updatedActivities[dayIndex].activities.filter((_, idx) => idx !== activityIndex);
    setPlanFormData({ ...planFormData, activities: updatedActivities });
  }

  const handleActivityChange = (dayIndex, activityIndex, field, value) => {
    const updatedActivities = [...planFormData.activities];
    updatedActivities[dayIndex].activities[activityIndex][field] = value;
    setPlanFormData({ ...planFormData, activities: updatedActivities });
  }

  const handleHotelSelect = (dayIndex, activityIndex, selectedValue) => {
    const updatedActivities = [...planFormData.activities];
    const activity = updatedActivities[dayIndex].activities[activityIndex];
    
    if (!selectedValue) {
      activity.hotel_name = '';
      activity.hotel_price = '';
      activity.hotel_stars = '';
      activity.hotel_image = '';
      activity.hotel_db_id = null;
      activity.stay_db_id = null;
      setPlanFormData({ ...planFormData, activities: updatedActivities });
      return;
    }

    const [type, idStr] = selectedValue.split('-');
    const id = parseInt(idStr);

    if (type === 'hotel') {
      const selectedHotel = hotels.find(h => h.id === id);
      if (selectedHotel) {
        activity.hotel_name = selectedHotel.name;
        activity.hotel_price = selectedHotel.price;
        activity.hotel_stars = selectedHotel.stars || 5;
        activity.hotel_image = selectedHotel.image;
        activity.hotel_db_id = selectedHotel.id;
        activity.stay_db_id = null;
        activity.title = `Check-in at ${selectedHotel.name}`;
        activity.description = selectedHotel.description;
      }
    } else if (type === 'stay') {
      const selectedStay = stays.find(s => s.id === id);
      if (selectedStay) {
        const firstImg = selectedStay.images?.find(img => img.is_main)?.image || selectedStay.images?.[0]?.image || selectedStay.image;
        activity.hotel_name = selectedStay.name;
        activity.hotel_price = selectedStay.price_per_night;
        activity.hotel_stars = 5;
        activity.hotel_image = firstImg;
        activity.stay_db_id = selectedStay.id;
        activity.hotel_db_id = null;
        activity.title = `Check-in at ${selectedStay.name}`;
        activity.description = selectedStay.description;
      }
    }

    setPlanFormData({ ...planFormData, activities: updatedActivities });
  }

  const handleSubmitPlan = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = new FormData()
      
      let stopsArr = [];
      if (typeof planFormData.stops === 'string') {
        stopsArr = planFormData.stops.split(',').map(s => s.trim()).filter(Boolean);
      } else {
        stopsArr = planFormData.stops || [];
      }

      Object.keys(planFormData).forEach(key => {
        if (key === 'image') {
          if (planFormData[key] instanceof File) {
            data.append('image', planFormData[key])
          } else if (planFormData[key]) {
            data.append('image', planFormData[key])
          }
        } else if (key === 'stops') {
          data.append('stops', JSON.stringify(stopsArr))
        } else if (key === 'activities') {
          data.append('activities', JSON.stringify(planFormData.activities))
        } else {
          data.append(key, planFormData[key] ?? '')
        }
      })

      if (editingPlanId) {
        data.append('_method', 'PUT')
        const res = await api.post(`/plans/${editingPlanId}`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
        setPlans(plans.map(p => p.id === editingPlanId ? res.data : p))
      } else {
        const res = await api.post('/plans', data, { headers: { 'Content-Type': 'multipart/form-data' } })
        setPlans([res.data, ...plans])
      }

      setShowPlanForm(false)
      setEditingPlanId(null)
      setPlanFormData(initialPlanFormState)
      setLoading(false)
    } catch (err) {
      console.error("Error saving plan:", err)
      setError("Failed to save plan.")
      setLoading(false)
    }
  }

  const handleDeletePlan = async (id) => {
    console.log("Starting delete flow for plan ID:", id);
    showConfirm(
      "Delete Travel Plan",
      "Are you sure you want to delete this travel plan? This action cannot be undone.",
      async () => {
        try {
          console.log("Sending delete request to API for plan ID:", id);
          const res = await api.delete(`/plans/${id}`)
          console.log("API response for delete:", res.data);
          setPlans(plans.filter(p => Number(p.id) !== Number(id)))
          alert("Travel plan deleted successfully!");
        } catch (err) {
          console.error("Error deleting plan:", err)
          alert("Failed to delete plan: " + (err.response?.data?.message || err.message))
        }
      }
    );
  }

  const handleAmenityToggle = (amenity) => {
    const current = formData.amenities;
    if (current.includes(amenity)) {
      setFormData({ ...formData, amenities: current.filter(a => a !== amenity) });
    } else {
      setFormData({ ...formData, amenities: [...current, amenity] });
    }
  };

  const handleAddCustomAmenity = (e) => {
    e.preventDefault();
    if (newAmenity.trim()) {
      setFormData({ ...formData, amenities: [...formData.amenities, newAmenity.trim()] });
      setNewAmenity('');
    }
  };

  const handleAddRule = (e) => {
    e.preventDefault();
    if (newRule.trim()) {
      setFormData({ ...formData, rules: [...formData.rules, newRule.trim()] });
      setNewRule('');
    }
  };

  const removeRule = (index) => {
    setFormData({ ...formData, rules: formData.rules.filter((_, i) => i !== index) });
  };

  const handleEditClick = (stay) => {
    setEditingStayId(stay.id);
    setFormData({
      name: stay.name,
      property_type: stay.property_type,
      location: stay.location,
      city: stay.city || '',
      country: stay.country || '',
      price_per_night: stay.price_per_night,
      guests: stay.guests,
      bedrooms: stay.bedrooms,
      beds: stay.beds,
      bathrooms: stay.bathrooms,
      area: stay.area || '',
      description: stay.description,
      image: null,
      galleryFiles: null, 
      amenities: stay.amenities?.map(a => a.name) || [],
      rules: stay.rules?.map(r => r.rule) || [],
      user_id: stay.user_id
    });
    setShowAddForm(true);
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmitStay = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = new FormData()
      
      
      Object.keys(formData).forEach(key => {
        if (key === 'image') {
          if (formData[key] instanceof File) {
            data.append('image', formData[key])
          }
        } else if (key === 'galleryFiles' && formData[key]) {
          Array.from(formData[key]).forEach(file => data.append('images[]', file))
        } else if (key === 'amenities' || key === 'rules') {
          data.append(key, JSON.stringify(formData[key]))
        } else if (key !== 'galleryFiles') {
          data.append(key, formData[key])
        }
      })

      let response;
      if (editingStayId) {
        
        data.append('_method', 'PUT');
        response = await api.post(`/stays/${editingStayId}`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setStays(stays.map(s => s.id === editingStayId ? response.data : s));
      } else {
        response = await api.post('/stays', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setStays([...stays, response.data]);
      }
      
      setShowAddForm(false)
      setEditingStayId(null)
      setFormData(initialFormState)
      setLoading(false)
    } catch (err) {
      console.error("Error creating/updating stay:", err)
      setError("Failed to save property.")
      setLoading(false)
    }
  }


  const handleDeleteStay = async (id) => {
    showConfirm(
      "Delete Stay Property",
      "Are you sure you want to delete this stay property? This action cannot be undone.",
      async () => {
        try {
          await api.delete(`/stays/${id}`)
          setStays(stays.filter(s => s.id !== id))
        } catch (err) {
          console.error("Error deleting stay:", err)
        }
      }
    );
  }

  const filteredStays = stays.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         s.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         s.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         s.country?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const myStays = filteredStays.filter(s => s.user_id === user?.id);
  const [propertyView, setPropertyView] = useState('all'); // 'all' or 'mine'
  const displayStays = propertyView === 'mine' ? myStays : filteredStays;

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <aside className="w-80 bg-white border-r border-slate-100 flex flex-col p-8 fixed h-full z-20">
        <button 
          onClick={() => setActiveTab('selector')}
          className="flex items-center gap-3 mb-12 hover:opacity-80 transition-opacity"
        >
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-100">V</div>
          <span className="text-xl font-black text-slate-900 tracking-tighter">VoyageSmart</span>
        </button>

        <nav className="flex-1 space-y-2">
          {[
            { id: 'selector', label: 'Console Home', icon: LayoutDashboard },
            { id: 'properties', label: 'Stays', icon: Home },
            { id: 'hotels', label: 'Hotels', icon: LayoutDashboard },
            { id: 'flights', label: 'Flights', icon: Plane },
            { id: 'plans', label: 'Travel Plans', icon: Calendar },
            { id: 'users', label: 'Users', icon: Users },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${activeTab === item.id ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <button onClick={onLogout} className="mt-auto flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold text-rose-500 hover:bg-rose-50 transition-all">
          <LogOut size={20} />
          Sign Out
        </button>
      </aside>

      <main className="flex-1 ml-80 p-12 overflow-y-auto">
        <header className="flex items-center justify-between mb-12">
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-slate-400 font-medium mt-1">Welcome back, {user?.name}</p>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Search listings..." 
                className="pl-12 pr-6 py-3.5 bg-white border border-slate-100 rounded-2xl text-sm font-medium w-80 focus:ring-2 focus:ring-indigo-600 outline-none transition-all shadow-sm"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 relative hover:bg-slate-50 transition-all">
              <Bell size={20} />
              <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-slate-100">
              <div className="text-right">
                <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest">{user?.role}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 font-black">
                {user?.name?.charAt(0)}
              </div>
            </div>
          </div>
        </header>

        {activeTab === 'selector' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-black text-slate-900 tracking-tight">What would you like to manage today?</h2>
              <p className="text-slate-400 font-medium text-lg">Select a module to begin managing your platform assets.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
              {[
                { 
                  id: 'properties', 
                  label: 'Stay Management', 
                  desc: 'Manage villa listings, individual properties, and private rentals.',
                  icon: Home, 
                  color: 'bg-indigo-600',
                  stats: `${stays.length} Active Stays`
                },
                { 
                  id: 'hotels', 
                  label: 'Hotel Inventory', 
                  desc: 'Configure large hotel inventory, rooms, and resort partnerships.',
                  icon: LayoutDashboard, 
                  color: 'bg-blue-600',
                  stats: 'Global Network'
                },
                { 
                  id: 'flights', 
                  label: 'Flight Management', 
                  desc: 'Manage flight routes, airlines, departure times, pricing, and seat layouts.',
                  icon: Plane, 
                  color: 'bg-sky-600',
                  stats: `${flights.length} Scheduled`
                },
                { 
                  id: 'plans', 
                  label: 'Travel Plans', 
                  desc: 'Curate itinerary templates, travel packages, and destination plans.',
                  icon: Calendar, 
                  color: 'bg-rose-500',
                  stats: `${plans.length} Active Plans`
                },
                { 
                  id: 'users', 
                  label: 'User Directory', 
                  desc: 'Control user access, roles, and community profiles.',
                  icon: Users, 
                  color: 'bg-emerald-500',
                  stats: `${users.length} Users`
                },
                { 
                  id: 'dashboard', 
                  label: 'Business Insights', 
                  desc: 'Track revenue, bookings, and platform performance analytics.',
                  icon: TrendingUp, 
                  color: 'bg-rose-600',
                  stats: 'Live Stats'
                }
              ].map((card) => (
                <motion.button
                  key={card.id}
                  whileHover={{ y: -10, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(card.id)}
                  className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-100 transition-all text-left group flex flex-col h-full"
                >
                  <div className={`${card.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-8 shadow-lg shadow-gray-100 group-hover:rotate-6 transition-transform`}>
                    <card.icon size={28} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">{card.label}</h3>
                    <p className="text-slate-400 text-sm font-medium leading-relaxed mb-6">{card.desc}</p>
                  </div>
                  <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">{card.stats}</span>
                    <span className="material-symbols-outlined text-slate-300 group-hover:text-indigo-600 transition-colors">arrow_forward</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { label: 'Total Users', value: users.length, icon: Users, color: 'bg-indigo-50 text-indigo-600' },
              { label: 'Active Listings', value: stays.length, icon: Home, color: 'bg-emerald-50 text-emerald-600' },
              { label: 'Bookings', value: '142', icon: Calendar, color: 'bg-amber-50 text-amber-600' },
              { label: 'Revenue', value: '$12k', icon: TrendingUp, color: 'bg-rose-50 text-rose-600' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm">
                <div className={`${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6`}>
                  <stat.icon size={24} />
                </div>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                <p className="text-3xl font-black text-slate-900">{stat.value}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'properties' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm gap-6">
              <div className="flex flex-col md:flex-row md:items-center gap-8">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Property Management</h2>
                  <p className="text-slate-400 text-sm font-medium mt-1">{displayStays.length} listings showing</p>
                </div>
                <div className="flex bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                  <button 
                    onClick={() => setPropertyView('all')}
                    className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${propertyView === 'all' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    All Properties
                  </button>
                  <button 
                    onClick={() => setPropertyView('mine')}
                    className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${propertyView === 'mine' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                  >
                    My Listings
                  </button>
                </div>
              </div>
              <button 
                onClick={() => {
                  setEditingStayId(null);
                  setFormData(initialFormState);
                  setShowAddForm(!showAddForm);
                }}
                className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-indigo-100 flex items-center gap-3 transition-all active:scale-95 whitespace-nowrap"
              >
                <span className="material-symbols-outlined text-[20px]">{showAddForm ? 'close' : 'add'}</span>
                {showAddForm ? 'Cancel' : 'Register New Stay'}
              </button>
            </div>

            {showAddForm && (
              <motion.form 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmitStay}
                className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-xl space-y-12"
              >
                
                <div className="space-y-8">
                  <div className="flex items-center justify-between border-b border-indigo-50 pb-4">
                    <h3 className="text-sm font-black text-indigo-600 uppercase tracking-widest">{editingStayId ? 'Editing Property' : '1. Basic Information'}</h3>
                    {editingStayId && <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest">Update Mode</span>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Property Name</label>
                      <input required className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-indigo-600 transition-all" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Azure Sands Villa" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Property Type</label>
                      <select className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none" value={formData.property_type} onChange={e => setFormData({...formData, property_type: e.target.value})}>
                        <option>Villa</option><option>Apartment</option><option>Cabin</option><option>House</option><option>Cottage</option>
                      </select>
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Full Address / Location</label>
                      <input required className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} placeholder="Full address string" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">City</label>
                      <input required className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} placeholder="e.g. Oia" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Country</label>
                      <input required className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none" value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} placeholder="e.g. Greece" />
                    </div>
                  </div>
                </div>

                
                <div className="space-y-8">
                  <h3 className="text-sm font-black text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-4">2. Property Details & Pricing</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Price / Night</label>
                      <input required type="number" className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none" value={formData.price_per_night} onChange={e => setFormData({...formData, price_per_night: e.target.value})} placeholder="$" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Area (m²)</label>
                      <input required type="number" className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} placeholder="Size" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Guests</label>
                      <input type="number" className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none" value={formData.guests} onChange={e => setFormData({...formData, guests: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Bedrooms</label>
                      <input type="number" className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none" value={formData.bedrooms} onChange={e => setFormData({...formData, bedrooms: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Beds</label>
                      <input type="number" className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none" value={formData.beds} onChange={e => setFormData({...formData, beds: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Bathrooms</label>
                      <input type="number" className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none" value={formData.bathrooms} onChange={e => setFormData({...formData, bathrooms: e.target.value})} />
                    </div>
                  </div>
                </div>

               
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <h3 className="text-sm font-black text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-4">3. Amenities</h3>
                    <div className="flex flex-wrap gap-2">
                      {['WiFi', 'Kitchen', 'Pool', 'Parking', 'AC', 'Gym', 'TV'].map(amenity => (
                        <button 
                          key={amenity}
                          type="button"
                          onClick={() => handleAmenityToggle(amenity)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${formData.amenities.includes(amenity) ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-100 text-slate-400'}`}
                        >
                          {amenity}
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input className="flex-1 p-3 rounded-xl bg-gray-50 border border-gray-100 outline-none text-xs" placeholder="Add custom amenity..." value={newAmenity} onChange={e => setNewAmenity(e.target.value)} />
                      <button onClick={handleAddCustomAmenity} className="bg-indigo-50 text-indigo-600 p-3 rounded-xl"><Plus size={18}/></button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-sm font-black text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-4">4. House Rules</h3>
                    <div className="space-y-2">
                      {formData.rules.map((rule, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                          <span className="text-xs font-bold text-slate-600">{rule}</span>
                          <button type="button" onClick={() => removeRule(idx)} className="text-rose-400 hover:text-rose-600"><Trash2 size={16}/></button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input className="flex-1 p-3 rounded-xl bg-gray-50 border border-gray-100 outline-none text-xs" placeholder="e.g. No smoking..." value={newRule} onChange={e => setNewRule(e.target.value)} />
                      <button onClick={handleAddRule} className="bg-indigo-50 text-indigo-600 p-3 rounded-xl"><Plus size={18}/></button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-sm font-black text-indigo-600 uppercase tracking-widest border-b border-indigo-50 pb-4">5. Media & Description</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Main Photo</label>
                      <input type="file" accept="image/*" onChange={e => setFormData({...formData, image: e.target.files[0]})} className="w-full p-8 rounded-3xl bg-blue-50/30 border-2 border-dashed border-blue-100 text-center text-sm font-bold text-blue-400" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Gallery Photos (Multiple)</label>
                      <input type="file" multiple accept="image/*" onChange={e => setFormData({...formData, galleryFiles: e.target.files})} className="w-full p-8 rounded-3xl bg-indigo-50/30 border-2 border-dashed border-indigo-100 text-center text-sm font-bold text-indigo-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Description</label>
                    <textarea required className="w-full p-6 rounded-3xl bg-gray-50 border border-gray-100 h-40 outline-none focus:ring-2 focus:ring-indigo-600 transition-all text-sm leading-relaxed" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} placeholder="Tell guests about your place..." />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-4 pt-8">
                  <button type="button" onClick={() => { setShowAddForm(false); setEditingStayId(null); setFormData(initialFormState); }} className="px-8 py-4 rounded-2xl font-bold text-sm text-slate-400 hover:bg-slate-50 transition-all">Discard</button>
                  <button type="submit" className="bg-indigo-600 text-white px-12 py-5 rounded-[2rem] font-bold text-sm shadow-xl shadow-indigo-100 active:scale-95 transition-all hover:bg-indigo-700">
                    {editingStayId ? 'Update Property' : 'Save Property Listing'}
                  </button>
                </div>
              </motion.form>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {displayStays.map(stay => (
                <div key={stay.id} className="bg-white p-6 rounded-[32px] border border-gray-100 flex gap-6 items-center shadow-sm hover:shadow-md transition-all group">
                  <div className="relative w-24 h-24 overflow-hidden rounded-2xl bg-slate-50">
                    {(() => {
                      const mainImg = stay.images?.find(img => img.is_main)?.image || stay.images?.[0]?.image;
                      const imgSrc = mainImg 
                        ? (mainImg.startsWith('http') ? mainImg : `${BACKEND_URL}${mainImg}`)
                        : 'https://via.placeholder.com/150';
                      return (
                        <img 
                          src={imgSrc} 
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                          alt={stay.name} 
                        />
                      );
                    })()}
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold text-[#111c2d] tracking-tight">{stay.name}</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-2 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">location_on</span>
                      {stay.city || stay.location}, {stay.country || ''}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-indigo-600">${stay.price_per_night}</span>
                      <span className="px-3 py-1 rounded-lg bg-slate-50 text-[9px] font-bold text-slate-500 uppercase tracking-widest">{stay.property_type}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => handleEditClick(stay)} className="w-10 h-10 flex items-center justify-center bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-600 hover:text-white transition-all">
                      <Edit2 size={18} />
                    </button>

                    <button onClick={() => handleDeleteStay(stay.id)} className="w-10 h-10 flex items-center justify-center text-rose-300 hover:text-rose-600 transition-all">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === 'users' && (
          <div className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-sm text-center space-y-6">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto">
              <Users size={40} />
            </div>
            <h2 className="text-2xl font-black text-slate-900">User Directory</h2>
            <p className="text-slate-400 max-w-md mx-auto">Manage your community members, assigned roles, and access permissions. Currently showing {users.length} registered users.</p>
            <div className="grid grid-cols-1 gap-4 mt-8">
              {users.map(u => (
                <div key={u.id} className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-bold">{u.name.charAt(0)}</div>
                    <div className="text-left">
                      <p className="font-bold text-slate-900">{u.name}</p>
                      <p className="text-xs text-slate-400">{u.email}</p>
                    </div>
                  </div>
                  <span className="px-4 py-2 rounded-lg bg-white border border-slate-100 text-[10px] font-bold uppercase tracking-widest text-indigo-600">{u.role}</span>
                </div>
              ))}
            </div>
          </div>
        )}


        {activeTab === 'flights' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Flight Route Management</h2>
                <p className="text-slate-400 text-sm font-medium mt-1">{flights.length} flights scheduled</p>
              </div>
              <button 
                onClick={() => {
                  setEditingFlightId(null);
                  setFlightFormData(initialFlightFormState);
                  setShowFlightForm(!showFlightForm);
                }}
                className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-indigo-100 flex items-center gap-3 transition-all active:scale-95"
              >
                <Plus size={20} />
                {showFlightForm ? 'Cancel' : 'Register New Flight'}
              </button>
            </div>

            {showFlightForm && (
              <motion.form 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmitFlight}
                className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-xl space-y-12"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Airline</label>
                    <select 
                      required 
                      className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none text-sm font-semibold"
                      value={AIRLINES.some(a => a.name === flightFormData.airline) ? flightFormData.airline : (flightFormData.airline ? 'custom' : '')}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === 'custom') {
                          setFlightFormData({
                            ...flightFormData,
                            airline: '',
                            airline_logo: '',
                            flight_number: ''
                          });
                        } else {
                          const selected = AIRLINES.find(a => a.name === val);
                          if (selected) {
                            const newFlightNumber = selected.code + Math.floor(1000 + Math.random() * 9000);
                            setFlightFormData({
                              ...flightFormData,
                              airline: selected.name,
                              airline_logo: selected.logo,
                              flight_number: newFlightNumber
                            });
                          }
                        }
                      }}
                    >
                      <option value="" disabled>Select Airline...</option>
                      {AIRLINES.map(a => (
                        <option key={a.name} value={a.name}>{a.name}</option>
                      ))}
                      <option value="custom">Custom Airline...</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Flight Number</label>
                    <input required className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none" value={flightFormData.flight_number} onChange={e => setFlightFormData({...flightFormData, flight_number: e.target.value})} placeholder="e.g. AT1402" />
                  </div>

                  {!flightFormData.airline && !flightFormData.airline_logo || 
                   (flightFormData.airline || flightFormData.airline_logo) && 
                   !AIRLINES.some(a => a.name === flightFormData.airline && a.logo === flightFormData.airline_logo) ? (
                    <>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Custom Airline Name</label>
                        <input required className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none" value={flightFormData.airline} onChange={e => setFlightFormData({...flightFormData, airline: e.target.value})} placeholder="e.g. Air Transat" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Custom Airline Logo URL</label>
                        <input required className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none" value={flightFormData.airline_logo} onChange={e => setFlightFormData({...flightFormData, airline_logo: e.target.value})} placeholder="https://..." />
                      </div>
                    </>
                  ) : (
                    <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100/50">
                      <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center p-2 border border-slate-100 shrink-0">
                        {flightFormData.airline_logo && (
                          <img src={flightFormData.airline_logo} className="max-h-full max-w-full object-contain" alt={flightFormData.airline} />
                        )}
                      </div>
                      <div className="overflow-hidden">
                        <p className="text-xs font-bold text-slate-800 truncate">{flightFormData.airline}</p>
                        <p className="text-[10px] text-slate-400 font-semibold truncate max-w-[200px]">{flightFormData.airline_logo}</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Departure Airport Code</label>
                    <input required className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none" value={flightFormData.departure_airport} onChange={e => setFlightFormData({...flightFormData, departure_airport: e.target.value.toUpperCase()})} placeholder="e.g. CMN" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Departure City</label>
                    <input required className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none" value={flightFormData.departure_city} onChange={e => setFlightFormData({...flightFormData, departure_city: e.target.value})} placeholder="e.g. Casablanca" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Departure Time</label>
                    <input 
                      required 
                      type="datetime-local" 
                      min={editingFlightId ? (flightFormData.departure_time && flightFormData.departure_time < getTodayDatetimeLocal() ? flightFormData.departure_time : getTodayDatetimeLocal()) : getTodayDatetimeLocal()} 
                      className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none" 
                      value={flightFormData.departure_time} 
                      onChange={e => setFlightFormData({...flightFormData, departure_time: e.target.value})} 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Arrival Airport Code</label>
                    <input required className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none" value={flightFormData.arrival_airport} onChange={e => setFlightFormData({...flightFormData, arrival_airport: e.target.value.toUpperCase()})} placeholder="e.g. CDG" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Arrival City</label>
                    <input required className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none" value={flightFormData.arrival_city} onChange={e => setFlightFormData({...flightFormData, arrival_city: e.target.value})} placeholder="e.g. Paris" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Arrival Time</label>
                    <input 
                      required 
                      type="datetime-local" 
                      min={flightFormData.departure_time || getTodayDatetimeLocal()} 
                      className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none" 
                      value={flightFormData.arrival_time} 
                      onChange={e => setFlightFormData({...flightFormData, arrival_time: e.target.value})} 
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Duration (Minutes) <span className="text-[9px] text-indigo-500 font-bold lowercase tracking-normal">(Auto-calculated)</span></label>
                    <input readOnly required type="number" className="w-full p-4 rounded-2xl bg-slate-100/50 border border-gray-100 outline-none text-slate-500 cursor-not-allowed font-semibold" value={flightFormData.duration} placeholder="Awaiting times..." />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Ticket Price (Economy Class) ($)</label>
                    <input required type="number" step="0.01" className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none" value={flightFormData.price} onChange={e => setFlightFormData({...flightFormData, price: e.target.value})} placeholder="e.g. 299.99" />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Total Seats</label>
                    <input required type="number" className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none" value={flightFormData.total_seats} onChange={e => setFlightFormData({...flightFormData, total_seats: e.target.value})} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Active Status</label>
                    <button type="button" onClick={() => setFlightFormData({...flightFormData, is_active: !flightFormData.is_active})} className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between font-bold text-sm ${flightFormData.is_active ? 'bg-sky-50 border-sky-200 text-sky-600' : 'bg-gray-50 border-gray-100 text-slate-400'}`}>
                      <span>Active Scheduled Route</span>
                      <span className="material-symbols-outlined">{flightFormData.is_active ? 'toggle_on' : 'toggle_off'}</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-4">
                  <button type="button" onClick={() => setShowFlightForm(false)} className="px-8 py-4 text-slate-400 font-bold">Discard</button>
                  <button type="submit" className="bg-indigo-600 text-white px-12 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-indigo-100">
                    {editingFlightId ? 'Update Flight Route' : 'Save Flight Route'}
                  </button>
                </div>
              </motion.form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {flights.map(flight => {
                const seats = calculateSeatDistribution(flight.total_seats);
                return (
                  <div key={flight.id} className="bg-white p-6 rounded-[32px] border border-gray-100 flex gap-6 items-center shadow-sm hover:shadow-md transition-all">
                    <div className="w-24 h-24 rounded-2xl bg-slate-50 flex items-center justify-center p-4 border border-slate-100/50 shrink-0">
                      {flight.airline_logo ? (
                        <img src={flight.airline_logo} className="max-h-full max-w-full object-contain" alt={flight.airline} />
                      ) : (
                        <span className="text-2xl font-black text-sky-600">{flight.airline?.substring(0, 2).toUpperCase()}</span>
                      )}
                    </div>
                    <div className="flex-grow overflow-hidden">
                      <h4 className="font-bold text-slate-900 flex items-center gap-2 truncate">
                        {flight.airline}
                        <span className="text-xs text-sky-600 font-bold bg-sky-50 px-2 py-0.5 rounded-lg border border-sky-100">{flight.flight_number}</span>
                      </h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 truncate">
                        {flight.departure_city} ({flight.departure_airport}) ➔ {flight.arrival_city} ({flight.arrival_airport})
                      </p>
                      <p className="text-xs text-slate-500 font-semibold mt-1">
                        {new Date(flight.departure_time).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 mt-2">
                        <span className="text-indigo-600 font-black text-xs">${flight.price} (Economy)</span>
                        <span className="text-indigo-600 font-bold text-[10px] bg-indigo-50 px-2 py-0.5 rounded-md">${Math.round(flight.price * 3)} (Biz)</span>
                        <span className="text-amber-600 font-bold text-[10px] bg-amber-50 px-2 py-0.5 rounded-md">${Math.round(flight.price * 7)} (1st)</span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                        <span>Y: {seats.economy} | C: {seats.business} | F: {seats.first}</span>
                        <span>{flight.available_seats}/{flight.total_seats} free</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <button 
                        onClick={() => { 
                          setEditingFlightId(flight.id); 
                          const depDate = new Date(flight.departure_time);
                          const arrDate = new Date(flight.arrival_time);
                          const formatDatetimeLocal = (d) => {
                            const pad = (n) => n.toString().padStart(2, '0');
                            return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
                          };
                          setFlightFormData({
                            ...flight,
                            departure_time: formatDatetimeLocal(depDate),
                            arrival_time: formatDatetimeLocal(arrDate)
                          }); 
                          setShowFlightForm(true); 
                        }} 
                        className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteFlight(flight.id)} 
                        className="w-10 h-10 text-rose-300 hover:text-rose-600 flex items-center justify-center transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}


        {activeTab === 'hotels' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Hotel Inventory</h2>
                <p className="text-slate-400 text-sm font-medium mt-1">{hotels.length} hotels registered</p>
              </div>
              <button 
                onClick={() => {
                  setEditingHotelId(null);
                  setHotelFormData({ 
                    name: '', location: '', city: '', country: '', price: '', description: '', 
                    image: null, galleryFiles: null, amenities: [], stars: 5, is_premier: false, 
                    total_rooms: 10, user_id: user?.id 
                  });
                  setShowHotelForm(!showHotelForm);
                }}
                className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-indigo-100 flex items-center gap-3 transition-all active:scale-95"
              >
                <Plus size={20} />
                {showHotelForm ? 'Cancel' : 'Register New Hotel'}
              </button>
            </div>

            {showHotelForm && (
              <motion.form 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmitHotel}
                className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-xl space-y-12"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Hotel Name</label>
                    <input required className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none" value={hotelFormData.name} onChange={e => setHotelFormData({...hotelFormData, name: e.target.value})} placeholder="e.g. Grand Luxury Resort" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Nightly Price</label>
                    <input required type="number" className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none" value={hotelFormData.price} onChange={e => setHotelFormData({...hotelFormData, price: e.target.value})} placeholder="$" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Star Rating</label>
                    <div className="flex gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button key={star} type="button" onClick={() => setHotelFormData({...hotelFormData, stars: star})} className={`w-10 h-10 rounded-xl font-bold transition-all ${hotelFormData.stars === star ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-400 hover:bg-slate-100'}`}>
                          {star}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Premier Status</label>
                    <button type="button" onClick={() => setHotelFormData({...hotelFormData, is_premier: !hotelFormData.is_premier})} className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between font-bold text-sm ${hotelFormData.is_premier ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-gray-50 border-gray-100 text-slate-400'}`}>
                      <span>Premier Partner Badge</span>
                      <span className="material-symbols-outlined">{hotelFormData.is_premier ? 'toggle_on' : 'toggle_off'}</span>
                    </button>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Address / Location</label>
                    <input required className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none" value={hotelFormData.location} onChange={e => setHotelFormData({...hotelFormData, location: e.target.value})} placeholder="Full address" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">City</label>
                    <input required className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none" value={hotelFormData.city} onChange={e => setHotelFormData({...hotelFormData, city: e.target.value})} placeholder="City" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Country</label>
                    <input required className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none" value={hotelFormData.country} onChange={e => setHotelFormData({...hotelFormData, country: e.target.value})} placeholder="Country" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Total Rooms (Capacity)</label>
                    <input required type="number" className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none" value={hotelFormData.total_rooms} onChange={e => setHotelFormData({...hotelFormData, total_rooms: e.target.value})} placeholder="e.g. 20" />
                  </div>
                </div>

                <div className="space-y-6">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Hotel Amenities</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['WiFi', 'Pool', 'Spa', 'Fitness Center', 'Restaurant', 'Parking', 'Room Service', 'Bar'].map(amenity => (
                      <button 
                        key={amenity}
                        type="button"
                        onClick={() => {
                          const current = hotelFormData.amenities;
                          setHotelFormData({
                            ...hotelFormData,
                            amenities: current.includes(amenity) ? current.filter(a => a !== amenity) : [...current, amenity]
                          })
                        }}
                        className={`p-4 rounded-2xl border text-xs font-bold transition-all text-center ${hotelFormData.amenities.includes(amenity) ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-gray-50 border-gray-100 text-slate-400'}`}
                      >
                        {amenity}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Main Photo</label>
                      <input type="file" accept="image/*" onChange={e => setHotelFormData({...hotelFormData, image: e.target.files[0]})} className="w-full p-8 rounded-3xl bg-blue-50/30 border-2 border-dashed border-blue-100 text-center text-sm font-bold text-blue-400" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Gallery Photos (Multiple)</label>
                      <input type="file" multiple accept="image/*" onChange={e => setHotelFormData({...hotelFormData, galleryFiles: e.target.files})} className="w-full p-8 rounded-3xl bg-indigo-50/30 border-2 border-dashed border-indigo-100 text-center text-sm font-bold text-indigo-400" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Hotel Description</label>
                    <textarea required className="w-full p-6 rounded-3xl bg-gray-50 border border-gray-100 h-40 outline-none text-sm" value={hotelFormData.description} onChange={e => setHotelFormData({...hotelFormData, description: e.target.value})} placeholder="Describe the hotel amenities and services..." />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-4">
                  <button type="button" onClick={() => setShowHotelForm(false)} className="px-8 py-4 text-slate-400 font-bold">Discard</button>
                  <button type="submit" className="bg-indigo-600 text-white px-12 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-indigo-100">
                    {editingHotelId ? 'Update Hotel' : 'Save Hotel'}
                  </button>
                </div>
              </motion.form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {hotels.map(hotel => (
                <div key={hotel.id} className="bg-white p-6 rounded-[32px] border border-gray-100 flex gap-6 items-center shadow-sm">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 flex-shrink-0">
                    <img src={hotel.image ? (hotel.image.startsWith('http') ? hotel.image : `${BACKEND_URL}${hotel.image}`) : 'https://via.placeholder.com/150'} className="w-full h-full object-cover" alt={hotel.name} />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold text-slate-900">{hotel.name}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{hotel.city}, {hotel.country}</p>
                    <p className="text-indigo-600 font-black mt-1">${hotel.price}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => { 
                      setEditingHotelId(hotel.id); 
                      setHotelFormData({
                        ...hotel,
                        amenities: hotel.amenities?.map(a => a.name || a) || [],
                        total_rooms: hotel.total_rooms || 10,
                        galleryFiles: null
                      }); 
                      setShowHotelForm(true); 
                    }} className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all"><Edit2 size={18} /></button>
                    <button onClick={() => handleDeleteHotel(hotel.id)} className="w-10 h-10 text-rose-300 hover:text-rose-600 flex items-center justify-center transition-all"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'plans' && (
          <div className="space-y-8">
            <div className="flex items-center justify-between bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-sm">
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Travel Plans</h2>
                <p className="text-slate-400 text-sm font-medium mt-1">{plans.length} travel plans registered</p>
              </div>
              <button 
                onClick={() => {
                  setEditingPlanId(null);
                  setPlanFormData(initialPlanFormState);
                  setActiveItineraryDay(1);
                  setShowPlanForm(!showPlanForm);
                }}
                className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-indigo-100 flex items-center gap-3 transition-all active:scale-95"
              >
                <Plus size={20} />
                {showPlanForm ? 'Cancel' : 'Create Travel Plan'}
              </button>
            </div>

            {showPlanForm && (
              <motion.form 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onSubmit={handleSubmitPlan}
                className="bg-white p-12 rounded-[3rem] border border-slate-100 shadow-xl space-y-12"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Plan Title</label>
                    <input required className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none" value={planFormData.title} onChange={e => setPlanFormData({...planFormData, title: e.target.value})} placeholder="e.g. The Grecian Odyssey" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Duration</label>
                    <input required className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none" value={planFormData.duration} onChange={e => setPlanFormData({...planFormData, duration: e.target.value})} placeholder="e.g. 10 Days" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Stops (Comma separated)</label>
                    <input required className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none" value={typeof planFormData.stops === 'string' ? planFormData.stops : (planFormData.stops || []).join(', ')} onChange={e => setPlanFormData({...planFormData, stops: e.target.value})} placeholder="e.g. Athens, Mykonos, Santorini" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Price ($)</label>
                    <input required type="number" className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none" value={planFormData.price} onChange={e => setPlanFormData({...planFormData, price: e.target.value})} placeholder="e.g. 2400" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Theme</label>
                    <select className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none" value={planFormData.theme} onChange={e => setPlanFormData({...planFormData, theme: e.target.value})}>
                      <option>Adventure</option>
                      <option>Romantic</option>
                      <option>Cultural</option>
                      <option>Wellness</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Budget Level</label>
                    <select className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none" value={planFormData.budget_level} onChange={e => setPlanFormData({...planFormData, budget_level: e.target.value})}>
                      <option>Essential</option>
                      <option>Premium</option>
                      <option>Luxe</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Associate Hotel</label>
                    <select className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none" value={planFormData.hotel_id} onChange={e => setPlanFormData({...planFormData, hotel_id: e.target.value})}>
                      <option value="">None</option>
                      {hotels.map(h => <option key={h.id} value={h.id}>{h.name} (${h.price}/night)</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Associate Stay</label>
                    <select className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none" value={planFormData.stay_id} onChange={e => setPlanFormData({...planFormData, stay_id: e.target.value})}>
                      <option value="">None</option>
                      {stays.map(s => <option key={s.id} value={s.id}>{s.name} (${s.price_per_night}/night)</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Associate Flight</label>
                    <select className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none" value={planFormData.flight_id} onChange={e => setPlanFormData({...planFormData, flight_id: e.target.value})}>
                      <option value="">None</option>
                      {flights.map(f => <option key={f.id} value={f.id}>{f.airline} - {f.flight_number} ({f.departure_city} to {f.arrival_city})</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Active Status</label>
                    <button type="button" onClick={() => setPlanFormData({...planFormData, is_active: !planFormData.is_active})} className={`w-full p-4 rounded-2xl border transition-all flex items-center justify-between font-bold text-sm ${planFormData.is_active ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-gray-50 border-gray-100 text-slate-400'}`}>
                      <span>Active on Platform</span>
                      <span className="material-symbols-outlined">{planFormData.is_active ? 'toggle_on' : 'toggle_off'}</span>
                    </button>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Max Travelers</label>
                    <input type="number" min="1" required className="w-full p-4 rounded-2xl bg-gray-50 border border-gray-100 outline-none focus:ring-2 focus:ring-indigo-600 transition-all text-sm font-bold" value={planFormData.max_travelers ?? 4} onChange={e => setPlanFormData({...planFormData, max_travelers: parseInt(e.target.value) || 1})} />
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Cover Image</label>
                  {planFormData.image && (
                    <div className="relative w-48 h-32 rounded-2xl overflow-hidden border border-slate-100 shadow-sm bg-slate-50">
                      <img 
                        src={
                          typeof planFormData.image === 'string'
                            ? (planFormData.image.startsWith('http') ? planFormData.image : `${BACKEND_URL}${planFormData.image}`)
                            : URL.createObjectURL(planFormData.image)
                        } 
                        className="w-full h-full object-cover" 
                        alt="Plan cover preview" 
                      />
                      <button 
                        type="button" 
                        onClick={() => setPlanFormData({ ...planFormData, image: null })}
                        className="absolute top-2 right-2 bg-rose-600 text-white rounded-full p-1.5 shadow-md hover:bg-rose-700 transition-all active:scale-90 flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined text-xs">close</span>
                      </button>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={e => setPlanFormData({...planFormData, image: e.target.files[0]})} className="w-full p-8 rounded-3xl bg-rose-50/30 border-2 border-dashed border-rose-100 text-center text-sm font-bold text-rose-400" />
                </div>
                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                    <h3 className="text-lg font-black text-slate-900">Daily Activities Plan</h3>
                    <button 
                      type="button" 
                      onClick={handleAddDay}
                      className="bg-indigo-650 text-indigo-600 hover:bg-indigo-600 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all border border-indigo-100"
                    >
                      + Add Day
                    </button>
                  </div>

                  {planFormData.activities && planFormData.activities.length > 0 && (
                    <div className="flex flex-wrap gap-2 pb-2 overflow-x-auto no-scrollbar border-b border-slate-100">
                      {planFormData.activities.map((dayData) => (
                        <button
                          key={dayData.day}
                          type="button"
                          onClick={() => setActiveItineraryDay(dayData.day)}
                          className={`px-5 py-3 rounded-2xl text-xs font-bold transition-all border ${
                            activeItineraryDay === dayData.day
                              ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100'
                              : 'bg-white border-slate-100 text-slate-500 hover:bg-slate-50'
                          }`}
                        >
                          Day {dayData.day}
                        </button>
                      ))}
                    </div>
                  )}

                  {planFormData.activities && planFormData.activities
                    .filter(dayData => dayData.day === activeItineraryDay)
                    .map((dayData, dayIdx) => {
                      const originalIdx = planFormData.activities.findIndex(d => d.day === dayData.day);
                      return (
                        <div key={dayData.day} className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-6">
                          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                            <h4 className="font-bold text-slate-900">Day {dayData.day} Activities</h4>
                            <button 
                              type="button" 
                              onClick={() => handleRemoveDay(originalIdx)}
                              className="text-rose-500 hover:text-rose-700 text-xs font-bold"
                            >
                              Remove Day {dayData.day}
                            </button>
                          </div>

                          <div className="space-y-4">
                            {dayData.activities && dayData.activities.map((activity, actIdx) => (
                              <div key={actIdx} className="bg-white p-6 rounded-2xl border border-slate-100 space-y-4 relative">
                                <button 
                                  type="button" 
                                  onClick={() => handleRemoveActivity(originalIdx, actIdx)}
                                  className="absolute top-4 right-4 text-rose-400 hover:text-rose-600"
                                >
                                  <Trash2 size={16} />
                                </button>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                  <div>
                                    <label className="text-[9px] uppercase tracking-widest font-bold text-gray-400">Time</label>
                                    <input 
                                      required 
                                      className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-100 outline-none text-xs" 
                                      value={activity.time} 
                                      onChange={e => handleActivityChange(originalIdx, actIdx, 'time', e.target.value)} 
                                      placeholder="e.g. 09:00 AM" 
                                    />
                                  </div>
                                  <div>
                                    <label className="text-[9px] uppercase tracking-widest font-bold text-gray-400">Type</label>
                                    <select 
                                      className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-100 outline-none text-xs" 
                                      value={activity.type} 
                                      onChange={e => handleActivityChange(originalIdx, actIdx, 'type', e.target.value)}
                                    >
                                      <option value="explore">Explore</option>
                                      <option value="restaurant">Restaurant</option>
                                      <option value="hotel">Hotel Stay</option>
                                      <option value="boat">Boat Ferry</option>
                                      <option value="flight_land">Flight Land</option>
                                      <option value="directions_car">Car Drive</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="text-[9px] uppercase tracking-widest font-bold text-gray-400">Meta / Subtext</label>
                                    <input 
                                      className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-100 outline-none text-xs" 
                                      value={activity.meta || ''} 
                                      onChange={e => handleActivityChange(originalIdx, actIdx, 'meta', e.target.value)} 
                                      placeholder="e.g. Skip-the-line ticket included" 
                                    />
                                  </div>
                                </div>
                                
                                {activity.type === 'hotel' && (
                                  <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100/50 space-y-2">
                                    <label className="text-[9px] uppercase tracking-widest font-bold text-indigo-600 block">Select Hotel or Stay from Inventory</label>
                                    <select 
                                      className="w-full p-2.5 rounded-xl bg-white border border-indigo-100 outline-none text-xs text-slate-800 font-medium"
                                      value={activity.hotel_db_id ? `hotel-${activity.hotel_db_id}` : (activity.stay_db_id ? `stay-${activity.stay_db_id}` : '')}
                                      onChange={e => handleHotelSelect(originalIdx, actIdx, e.target.value)}
                                    >
                                      <option value="">-- Choose Hotel or Stay --</option>
                                      <optgroup label="Hotels">
                                        {hotels.map(h => (
                                          <option key={h.id} value={`hotel-${h.id}`}>{h.name} (${h.price}/night)</option>
                                        ))}
                                      </optgroup>
                                      <optgroup label="Stays">
                                        {stays.map(s => (
                                          <option key={s.id} value={`stay-${s.id}`}>{s.name} (${s.price_per_night}/night)</option>
                                        ))}
                                      </optgroup>
                                    </select>
                                    {activity.hotel_name && (
                                      <div className="flex items-center gap-2 text-[10px] text-indigo-600 font-bold mt-1">
                                        <span className="material-symbols-outlined text-sm">check_circle</span>
                                        Linked: {activity.hotel_name} (${activity.hotel_price}/night)
                                      </div>
                                    )}
                                  </div>
                                )}
                                
                                <div>
                                  <label className="text-[9px] uppercase tracking-widest font-bold text-gray-400">Activity Title</label>
                                  <input 
                                    required 
                                    className="w-full p-2.5 rounded-xl bg-gray-50 border border-gray-100 outline-none text-xs" 
                                    value={activity.title} 
                                    onChange={e => handleActivityChange(originalIdx, actIdx, 'title', e.target.value)} 
                                    placeholder="e.g. Acropolis Tour" 
                                  />
                                </div>

                                <div>
                                  <label className="text-[9px] uppercase tracking-widest font-bold text-gray-400">Description</label>
                                  <textarea 
                                    required 
                                    className="w-full p-3 rounded-xl bg-gray-50 border border-gray-100 outline-none text-xs h-20" 
                                    value={activity.description} 
                                    onChange={e => handleActivityChange(originalIdx, actIdx, 'description', e.target.value)} 
                                    placeholder="Describe the activity..." 
                                  />
                                </div>
                              </div>
                            ))}

                            <button 
                              type="button" 
                              onClick={() => handleAddActivity(originalIdx)}
                              className="w-full py-3 bg-white border border-dashed border-slate-200 text-slate-500 rounded-2xl text-xs font-bold hover:bg-slate-50 hover:text-indigo-600 transition-all"
                            >
                              + Add Activity to Day {dayData.day}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>

                <div className="flex items-center justify-end gap-4">
                  <button type="button" onClick={() => { setShowPlanForm(false); setEditingPlanId(null); setPlanFormData(initialPlanFormState); }} className="px-8 py-4 text-slate-400 font-bold">Discard</button>
                  <button type="submit" className="bg-indigo-600 text-white px-12 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-indigo-100">
                    {editingPlanId ? 'Update Plan' : 'Save Plan'}
                  </button>
                </div>
              </motion.form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {plans.map(plan => (
                <div key={plan.id} className="bg-white p-6 rounded-[32px] border border-gray-100 flex gap-6 items-center shadow-sm">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden bg-slate-50 flex-shrink-0">
                    <img src={plan.image ? (plan.image.startsWith('http') ? plan.image : `${BACKEND_URL}${plan.image}`) : 'https://via.placeholder.com/150'} className="w-full h-full object-cover" alt={plan.title} />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold text-slate-900">{plan.title}</h4>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{plan.duration} • {plan.theme}</p>
                    <p className="text-indigo-600 font-black mt-1">${Math.round(plan.price)}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <button onClick={() => { 
                      setEditingPlanId(plan.id); 
                      setPlanFormData({
                        title: plan.title,
                        duration: plan.duration,
                        stops: Array.isArray(plan.stops) ? plan.stops.join(', ') : plan.stops,
                        price: plan.price,
                        image: plan.image,
                        theme: plan.theme || 'Adventure',
                        budget_level: plan.budget_level || 'Premium',
                        activities: plan.activities || [],
                        hotel_id: plan.hotel_id || '',
                        stay_id: plan.stay_id || '',
                        flight_id: plan.flight_id || '',
                        is_active: plan.is_active ?? true,
                        max_travelers: plan.max_travelers || 4
                      }); 
                      setActiveItineraryDay(1);
                      setShowPlanForm(true); 
                    }} className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-all"><Edit2 size={18} /></button>
                    <button onClick={() => handleDeletePlan(plan.id)} className="w-10 h-10 text-rose-300 hover:text-rose-600 flex items-center justify-center transition-all"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
          />
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full border border-slate-100 shadow-2xl relative z-10 text-center space-y-6 transform transition-all duration-300">
            <div className="w-16 h-16 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center mx-auto">
              <span className="material-symbols-outlined text-3xl">warning</span>
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-black text-slate-900 tracking-tight">{confirmModal.title}</h3>
              <p className="text-slate-400 text-sm font-medium leading-relaxed">{confirmModal.message}</p>
            </div>
            <div className="flex items-center gap-4 pt-2">
              <button 
                type="button" 
                onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))} 
                className="flex-grow py-4 bg-slate-50 text-slate-500 rounded-2xl font-bold text-sm hover:bg-slate-100 transition-all"
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={confirmModal.onConfirm} 
                className="flex-grow py-4 bg-rose-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-rose-100 hover:bg-rose-700 transition-all"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard
