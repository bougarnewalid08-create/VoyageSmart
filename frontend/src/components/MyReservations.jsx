import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import api, { BACKEND_URL } from '../api/axios'

const MyReservations = ({ user, onLogout }) => {
  const [reservations, setReservations] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancellingId, setCancellingId] = useState(null)
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [selectedReservation, setSelectedReservation] = useState(null)
  const [expandedPlans, setExpandedPlans] = useState({})

  const togglePlanExpand = (id) => {
    setExpandedPlans(prev => ({ ...prev, [id]: !prev[id] }))
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const res = await api.get('/my-reservations')
      setReservations(res.data)
    } catch (err) {
      console.error('Error fetching reservations:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleCancelConfirm = async () => {
    if (!selectedReservation) return
    const id = selectedReservation.id
    setCancellingId(id)
    try {
      await api.put(`/reservations/${id}/cancel`)
      setReservations(prev => prev.map(r => r.id === id ? { ...r, status: 'cancelled' } : r))
      setShowCancelModal(false)
      setSelectedReservation(null)
    } catch (err) {
      console.error('Error cancelling:', err)
    } finally {
      setCancellingId(null)
    }
  }

  const getStatusStyle = (status) => {
    switch (status) {
      case 'confirmed': return 'bg-emerald-50 text-emerald-700 border-emerald-100'
      case 'pending': return 'bg-amber-50 text-amber-700 border-amber-100'
      case 'cancelled': return 'bg-slate-50 text-slate-400 border-slate-100'
      default: return 'bg-slate-50 text-slate-500 border-slate-100'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed': return 'check_circle'
      case 'pending': return 'schedule'
      case 'cancelled': return 'cancel'
      default: return 'help'
    }
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    })
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const getSeatClass = (seatCode) => {
    if (!seatCode) return 'Economy Class'
    const row = parseInt(seatCode)
    if (row <= 3) return 'First Class'
    if (row <= 7) return 'Business Class'
    return 'Economy Class'
  }

  const renderFlightCard = (reservation, idx, isCancelled = false) => {
    const flight = reservation.flight
    if (!flight) return null

    const seatClass = getSeatClass(reservation.seat_number)

    return (
      <motion.div
        key={reservation.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: idx * 0.1 }}
        className={`bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-50 flex flex-col lg:flex-row gap-8 ${isCancelled ? 'opacity-60 bg-white/60' : ''}`}
      >
        <div className={`w-full lg:w-56 h-44 rounded-2xl bg-slate-50 flex flex-col items-center justify-center border border-slate-100/50 shrink-0 ${isCancelled ? 'grayscale' : ''}`}>
          <img src={flight.airline_logo} alt={flight.airline} className="h-12 object-contain mb-3" />
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{flight.airline}</span>
          <span className="text-xs font-black text-indigo-600 mt-1">{flight.flight_number}</span>
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border text-[10px] font-bold uppercase tracking-widest ${getStatusStyle(reservation.status)}`}>
                <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>{getStatusIcon(reservation.status)}</span>
                {reservation.status}
              </span>
              <span className="bg-indigo-600 text-white px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-widest">
                Flight Ticket
              </span>
              <span className="bg-amber-100 text-amber-800 border border-amber-200 px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-widest">
                {seatClass}
              </span>
            </div>
            
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter flex items-center gap-3">
              {flight.departure_city}
              <span className="material-symbols-outlined text-indigo-400 text-xl">arrow_forward</span>
              {flight.arrival_city}
            </h3>
            <p className="flex items-center gap-1 text-slate-400 font-bold text-xs uppercase tracking-wider mt-1">
              {flight.departure_airport} ➔ {flight.arrival_airport}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 mt-5">
            <div className="flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-2xl">
              <span className="material-symbols-outlined text-indigo-400 text-lg">flight_takeoff</span>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Departure</p>
                <p className="text-xs font-bold text-slate-900">
                  {formatDate(flight.departure_time)} at {formatTime(flight.departure_time)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-2xl">
              <span className="material-symbols-outlined text-indigo-400 text-lg">event_seat</span>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Seat</p>
                <p className="text-xs font-black text-indigo-600">{reservation.seat_number}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-2xl">
              <span className="material-symbols-outlined text-indigo-400 text-lg">schedule</span>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Duration</p>
                <p className="text-xs font-bold text-slate-900">
                  {Math.floor(flight.duration / 60)}h {flight.duration % 60}m
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end justify-between shrink-0 lg:min-w-[180px]">
          <div className="text-right">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Price</p>
            <p className="text-3xl font-black text-indigo-600">${Number(reservation.total_amount).toLocaleString()}</p>
            <p className="text-xs text-slate-400 font-medium">1 Passenger</p>
          </div>
          
          {!isCancelled && (
            <button
              onClick={() => {
                setSelectedReservation(reservation)
                setShowCancelModal(true)
              }}
              className="mt-4 px-6 py-3 bg-rose-50 text-rose-600 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all active:scale-95 border border-rose-100"
            >
              Cancel Booking
            </button>
          )}
        </div>
      </motion.div>
    )
  }

  const renderPlanCard = (reservation, idx, isCancelled = false) => {
    const plan = reservation.plan
    if (!plan) return null

    const isExpanded = !!expandedPlans[reservation.id]

    return (
      <motion.div
        key={reservation.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: idx * 0.1 }}
        className={`bg-white rounded-[2.5rem] p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-50 flex flex-col gap-6 ${isCancelled ? 'opacity-60 bg-white/60' : ''}`}
      >
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-56 h-44 rounded-2xl overflow-hidden shrink-0">
            <img
              className="w-full h-full object-cover"
              src={plan.image ? (plan.image.startsWith('http') ? plan.image : `${BACKEND_URL}${plan.image}`) : 'https://via.placeholder.com/600x400'}
              alt={plan.title}
            />
          </div>

          <div className="flex-grow flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border text-[10px] font-bold uppercase tracking-widest ${getStatusStyle(reservation.status)}`}>
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>{getStatusIcon(reservation.status)}</span>
                  {reservation.status}
                </span>
                <span className="bg-indigo-600 text-white px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-widest">
                  Travel Package
                </span>
                <span className="bg-amber-100 text-amber-800 border border-amber-200 px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-widest">
                  {plan.theme}
                </span>
              </div>
              
              <Link to={`/plan-details/${plan.id}`} className="hover:text-indigo-600 transition-colors">
                <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{plan.title}</h3>
              </Link>
              <p className="flex items-center gap-1.5 text-slate-400 font-medium text-sm mt-1">
                <span className="material-symbols-outlined text-[16px] text-indigo-400">map</span>
                Stops: {Array.isArray(plan.stops) ? plan.stops.join(" ➔ ") : ""}
              </p>
            </div>

            <div className="flex flex-wrap gap-4 mt-5">
              <div className="flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-2xl">
                <span className="material-symbols-outlined text-indigo-400 text-lg">calendar_today</span>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Start Date</p>
                  <p className="text-xs font-bold text-slate-900">{formatDate(reservation.check_in)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-2xl">
                <span className="material-symbols-outlined text-indigo-400 text-lg">calendar_today</span>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">End Date</p>
                  <p className="text-xs font-bold text-slate-900">{formatDate(reservation.check_out)}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-2xl">
                <span className="material-symbols-outlined text-indigo-400 text-lg">schedule</span>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Duration</p>
                  <p className="text-xs font-bold text-slate-900">{plan.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-2xl">
                <span className="material-symbols-outlined text-indigo-400 text-lg">group</span>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Travelers</p>
                  <p className="text-xs font-bold text-slate-900">
                    {reservation.adults} Adult{reservation.adults > 1 ? 's' : ''}
                    {reservation.children > 0 ? `, ${reservation.children} Child${reservation.children > 1 ? 'ren' : ''}` : ''}
                  </p>
                </div>
              </div>
            </div>

            {reservation.children && reservation.children.length > 0 && (
              <button 
                onClick={(e) => {
                  e.preventDefault()
                  togglePlanExpand(reservation.id)
                }}
                className="flex items-center gap-2 mt-4 text-xs font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-800 transition-colors w-fit"
              >
                <span className={`material-symbols-outlined transition-transform duration-300 text-base ${isExpanded ? 'rotate-180' : ''}`}>
                  expand_more
                </span>
                {isExpanded ? 'Hide Stays during Plan' : `View Stays during Plan (${reservation.children.length})`}
              </button>
            )}
          </div>

          <div className="flex flex-col items-end justify-between shrink-0 lg:min-w-[180px]">
            <div className="text-right">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Price</p>
              <p className="text-3xl font-black text-indigo-600">${Number(reservation.total_amount).toLocaleString()}</p>
              <p className="text-xs text-slate-400 font-medium">Full Itinerary Package</p>
            </div>
            
            {!isCancelled && (
              <button
                onClick={() => {
                  setSelectedReservation(reservation)
                  setShowCancelModal(true)
                }}
                className="mt-4 px-6 py-3 bg-rose-50 text-rose-600 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all active:scale-95 border border-rose-100"
              >
                Cancel Booking
              </button>
            )}
          </div>
        </div>

        {reservation.children && reservation.children.length > 0 && isExpanded && (
          <div className="mt-4 pt-6 border-t border-slate-100 pl-6 lg:pl-12 relative">
            <div className="absolute left-3 lg:left-6 top-6 bottom-12 w-[1.5px] bg-slate-100" />
            
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Stays booked during this journey</h4>
            
            <div className="space-y-6">
              {reservation.children.map((child, cIdx) => (
                <div key={child.id} className="flex flex-col md:flex-row gap-6 bg-slate-50/50 p-6 rounded-2xl border border-slate-100 relative">
                  <div className="absolute -left-[18px] lg:-left-[30px] top-12 w-3 lg:w-6 h-[1.5px] bg-slate-100" />
                  
                  <div className="w-24 h-16 rounded-xl overflow-hidden shrink-0">
                    <img 
                      className="w-full h-full object-cover"
                      src={
                        child.stay_id 
                          ? (
                              child.stay?.images?.find(img => img.is_main || img.is_primary)?.image?.startsWith('http')
                                ? child.stay.images.find(img => img.is_main || img.is_primary).image
                                : (child.stay?.images?.[0]?.image?.startsWith('http')
                                    ? child.stay.images[0].image
                                    : (child.stay?.images?.[0]?.image 
                                        ? `${BACKEND_URL}${child.stay.images[0].image}`
                                        : 'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=2070')
                                  )
                            )
                          : (child.hotel?.image?.startsWith('http') 
                              ? child.hotel.image 
                              : `${BACKEND_URL}${child.hotel?.image}`)
                      }
                      alt={child.stay_id ? child.stay?.name : child.hotel?.name}
                    />
                  </div>

                  <div className="flex-grow">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-widest border border-emerald-100">
                        {child.stay_id ? 'Private Stay' : 'Hotel'}
                      </span>
                      <span className="text-slate-400 text-[10px] font-bold">
                        Room: {child.room_number || 'TBD'}
                      </span>
                    </div>
                    
                    <h5 className="font-bold text-slate-800 text-base">
                      {child.stay_id ? child.stay?.name : child.hotel?.name}
                    </h5>
                    
                    <div className="flex flex-wrap gap-x-6 gap-y-1 text-slate-500 font-medium text-xs mt-2">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                        {formatDate(child.check_in)} ➔ {formatDate(child.check_out)} ({child.nights} night{child.nights > 1 ? 's' : ''})
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">group</span>
                        {child.adults} Ad{child.children > 0 ? `, ${child.children} Ch` : ''}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0 flex flex-col justify-center">
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Stay Price</p>
                    <p className="font-black text-slate-700 text-lg">${Number(child.total_amount).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    )
  }

  const active = reservations.filter(r => r.status !== 'cancelled')
  const cancelled = reservations.filter(r => r.status === 'cancelled')

  return (
    <div className="bg-[#f9f9ff] min-h-screen font-['Inter'] antialiased">
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
            <Link className="text-indigo-600 border-b-2 border-indigo-600 pb-1" to="/my-reservations">My Bookings</Link>
          </div>
          <div className="flex-1 flex items-center justify-end gap-4 font-['Plus_Jakarta_Sans'] text-sm font-medium">
            {user && (
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold text-gray-900">Welcome, {user.name}</span>
                  <div className="flex gap-2">
                    {user.role === 'Admin' && <Link to="/dashboard" className="text-[10px] text-indigo-600 font-bold hover:underline">Open Dashboard</Link>}
                    <button onClick={onLogout} className="text-[10px] text-red-500 font-bold hover:underline">Sign Out</button>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold">
                  {user.name.charAt(0)}
                </div>
              </div>
            )}
          </div>
        </nav>
      </header>

      <main className="max-w-[1536px] mx-auto px-6 md:px-12 pt-32 pb-20">
        <div className="mb-16">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <span className="material-symbols-outlined text-2xl">luggage</span>
            </div>
            <div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tighter">My Reservations</h1>
              <p className="text-slate-400 font-medium text-sm mt-1">
                {active.length} active booking{active.length !== 1 ? 's' : ''} 
                {cancelled.length > 0 && ` · ${cancelled.length} cancelled`}
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white rounded-[2rem] p-8 animate-pulse flex gap-8 border border-slate-50">
                <div className="w-48 h-36 bg-slate-200 rounded-2xl shrink-0" />
                <div className="flex-1 space-y-4">
                  <div className="h-6 bg-slate-200 rounded w-1/3" />
                  <div className="h-4 bg-slate-100 rounded w-1/2" />
                  <div className="h-4 bg-slate-100 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : reservations.length === 0 ? (
          <div className="text-center py-32">
            <div className="w-24 h-24 rounded-[2rem] bg-indigo-50 flex items-center justify-center mx-auto mb-8">
              <span className="material-symbols-outlined text-5xl text-indigo-300">hotel</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-3">No bookings yet</h2>
            <p className="text-slate-400 font-medium mb-8 max-w-md mx-auto">
              Discover our curated travels, hotel properties, stays and flights to book your next trip.
            </p>
            <Link 
              to="/hotels" 
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-sm shadow-xl shadow-indigo-100 hover:bg-indigo-700 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined">explore</span>
              Browse Hotels
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {active.length > 0 && (
              <>
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Upcoming & Active</h2>
                {active.map((reservation, idx) => {
                  if (reservation.flight_id) {
                    return renderFlightCard(reservation, idx, false)
                  }
                  if (reservation.plan_id) {
                    return renderPlanCard(reservation, idx, false)
                  }
                  
                  return (
                    <motion.div
                      key={reservation.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white rounded-[2rem] p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-50 flex flex-col lg:flex-row gap-8"
                    >
                      <div className="w-full lg:w-56 h-44 rounded-2xl overflow-hidden shrink-0">
                        <img
                          className="w-full h-full object-cover"
                          src={
                            reservation.stay_id 
                              ? (
                                  reservation.stay?.images?.find(img => img.is_main || img.is_primary)?.image?.startsWith('http')
                                    ? reservation.stay.images.find(img => img.is_main || img.is_primary).image
                                    : (reservation.stay?.images?.[0]?.image?.startsWith('http')
                                        ? reservation.stay.images[0].image
                                        : (reservation.stay?.images?.[0]?.image 
                                            ? `${BACKEND_URL}${reservation.stay.images[0].image}`
                                            : 'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=2070')
                                      )
                                )
                              : (reservation.hotel?.image?.startsWith('http') 
                                  ? reservation.hotel.image 
                                  : `${BACKEND_URL}${reservation.hotel?.image}`)
                          }
                          alt={reservation.stay_id ? reservation.stay?.name : reservation.hotel?.name}
                        />
                      </div>

                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border text-[10px] font-bold uppercase tracking-widest ${getStatusStyle(reservation.status)}`}>
                              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>{getStatusIcon(reservation.status)}</span>
                              {reservation.status}
                            </span>
                            {!reservation.stay_id && !!reservation.hotel?.is_premier && (
                              <span className="bg-indigo-600 text-white px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-widest">Premier</span>
                            )}
                            {reservation.stay_id && (
                              <span className="bg-emerald-600 text-white px-3 py-1 rounded-xl text-[10px] font-bold uppercase tracking-widest">Stay</span>
                            )}
                          </div>
                          {reservation.stay_id ? (
                            <Link to={`/stay-details/db-${reservation.stay_id}`} className="hover:text-indigo-600 transition-colors">
                              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{reservation.stay?.name}</h3>
                            </Link>
                          ) : (
                            <Link to={`/hotel-details/${reservation.hotel_id}`} className="hover:text-indigo-600 transition-colors">
                              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{reservation.hotel?.name}</h3>
                            </Link>
                          )}
                          <p className="flex items-center gap-1.5 text-slate-400 font-medium text-sm mt-1">
                            <span className="material-symbols-outlined text-[16px] text-indigo-400">location_on</span>
                            {reservation.stay_id 
                              ? `${reservation.stay?.city}, ${reservation.stay?.country}`
                              : `${reservation.hotel?.city}, ${reservation.hotel?.country}`}
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-6 mt-5">
                          <div className="flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-2xl">
                            <span className="material-symbols-outlined text-indigo-400 text-lg">calendar_today</span>
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Check-in</p>
                              <p className="text-sm font-bold text-slate-900">{formatDate(reservation.check_in)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-2xl">
                            <span className="material-symbols-outlined text-indigo-400 text-lg">calendar_today</span>
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Check-out</p>
                              <p className="text-sm font-bold text-slate-900">{formatDate(reservation.check_out)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-2xl">
                            <span className="material-symbols-outlined text-indigo-400 text-lg">group</span>
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Guests</p>
                              <p className="text-sm font-bold text-slate-900">
                                {reservation.adults} Adult{reservation.adults > 1 ? 's' : ''}
                                {reservation.children > 0 ? `, ${reservation.children} Child${reservation.children > 1 ? 'ren' : ''}` : ''}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-2xl">
                            <span className="material-symbols-outlined text-indigo-400 text-lg">meeting_room</span>
                            <div>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Room</p>
                              <p className="text-sm font-bold text-slate-900">{reservation.room_number || 'TBD'}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end justify-between shrink-0 lg:min-w-[180px]">
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total</p>
                          <p className="text-3xl font-black text-indigo-600">${Number(reservation.total_amount).toLocaleString()}</p>
                          <p className="text-xs text-slate-400 font-medium">{reservation.nights} night{reservation.nights > 1 ? 's' : ''}</p>
                        </div>
                        <button
                          onClick={() => {
                            setSelectedReservation(reservation)
                            setShowCancelModal(true)
                          }}
                          className="mt-4 px-6 py-3 bg-rose-50 text-rose-600 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-rose-600 hover:text-white transition-all active:scale-95 border border-rose-100"
                        >
                          Cancel Booking
                        </button>
                      </div>
                    </motion.div>
                  )
                })}
              </>
            )}

            {cancelled.length > 0 && (
              <>
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mt-16 mb-4">Cancelled</h2>
                {cancelled.map((reservation, idx) => {
                  if (reservation.flight_id) {
                    return renderFlightCard(reservation, idx, true)
                  }
                  if (reservation.plan_id) {
                    return renderPlanCard(reservation, idx, true)
                  }

                  return (
                    <motion.div
                      key={reservation.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-white/60 rounded-[2rem] p-8 border border-slate-50 flex flex-col lg:flex-row gap-8 opacity-60"
                    >
                      <div className="w-full lg:w-48 h-36 rounded-2xl overflow-hidden shrink-0 grayscale">
                        <img
                          className="w-full h-full object-cover"
                          src={
                            reservation.stay_id 
                              ? (
                                  reservation.stay?.images?.find(img => img.is_main || img.is_primary)?.image?.startsWith('http')
                                    ? reservation.stay.images.find(img => img.is_main || img.is_primary).image
                                    : (reservation.stay?.images?.[0]?.image?.startsWith('http')
                                        ? reservation.stay.images[0].image
                                        : (reservation.stay?.images?.[0]?.image 
                                            ? `${BACKEND_URL}${reservation.stay.images[0].image}`
                                            : 'https://images.unsplash.com/photo-1540518614846-7eded433c457?q=80&w=2070')
                                      )
                                )
                              : (reservation.hotel?.image?.startsWith('http') 
                                  ? reservation.hotel.image 
                                  : `${BACKEND_URL}${reservation.hotel?.image}`)
                          }
                          alt={reservation.stay_id ? reservation.stay?.name : reservation.hotel?.name}
                        />
                      </div>
                      <div className="flex-1">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl border text-[10px] font-bold uppercase tracking-widest mb-2 ${getStatusStyle(reservation.status)}`}>
                          <span className="material-symbols-outlined text-sm">cancel</span>
                          Cancelled
                        </span>
                        <h3 className="text-xl font-bold text-slate-400 tracking-tight line-through">
                          {reservation.stay_id ? reservation.stay?.name : reservation.hotel?.name}
                        </h3>
                        <p className="text-sm text-slate-300 font-medium mt-1">
                          {formatDate(reservation.check_in)} → {formatDate(reservation.check_out)} · {reservation.nights} nights
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-2xl font-black text-slate-300 line-through">${Number(reservation.total_amount).toLocaleString()}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </>
            )}
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-slate-100 mt-20">
        <div className="max-w-[1536px] mx-auto py-16 px-12 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="text-center md:text-left">
            <span className="text-2xl font-black tracking-tighter text-indigo-600 block mb-3">VoyageSmart</span>
            <p className="text-slate-500 text-sm max-w-sm leading-relaxed font-medium">© 2026 VoyageSmart Global. Effortless discovery for the modern traveler.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-x-10 gap-y-5">
            {['About', 'Destinations', 'Favorites', 'Privacy', 'Terms'].map(link => (
              <a key={link} className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-600 transition-colors duration-300" href="#">{link}</a>
            ))}
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {showCancelModal && selectedReservation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                if (cancellingId === null) {
                  setShowCancelModal(false)
                  setSelectedReservation(null)
                }
              }}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', duration: 0.4 }}
              className="bg-white rounded-[2rem] max-w-md w-full p-8 shadow-2xl border border-slate-100 relative overflow-hidden z-10"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-600 shrink-0">
                  <span className="material-symbols-outlined text-2xl">warning</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">Cancel Booking?</h3>
                  <p className="text-xs text-slate-400 font-medium mt-0.5">This action cannot be undone</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-2xl p-5 mb-6 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Reservation details</p>
                <h4 className="text-sm font-bold text-slate-800 leading-tight mb-2">
                  {selectedReservation.flight_id 
                    ? `${selectedReservation.flight?.airline} (Flight ${selectedReservation.flight?.flight_number})`
                    : (selectedReservation.plan_id 
                        ? selectedReservation.plan?.title
                        : (selectedReservation.stay_id ? selectedReservation.stay?.name : selectedReservation.hotel?.name))}
                </h4>
                <div className="space-y-1.5 text-xs text-slate-500 font-medium">
                  <div className="flex justify-between">
                    <span>{selectedReservation.flight_id ? 'Departure Date:' : 'Dates:'}</span>
                    <span className="text-slate-700 font-semibold">
                      {selectedReservation.flight_id 
                        ? formatDate(selectedReservation.check_in)
                        : `${formatDate(selectedReservation.check_in)} - ${formatDate(selectedReservation.check_out)}`}
                    </span>
                  </div>
                  {selectedReservation.flight_id && (
                    <div className="flex justify-between">
                      <span>Seat Selected:</span>
                      <span className="text-indigo-600 font-bold">{selectedReservation.seat_number}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Total Refundable:</span>
                    <span className="text-indigo-600 font-bold">
                      ${Number(selectedReservation.total_amount).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowCancelModal(false)
                    setSelectedReservation(null)
                  }}
                  disabled={cancellingId !== null}
                  className="flex-1 py-3.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all active:scale-98 disabled:opacity-50"
                >
                  Keep Booking
                </button>
                <button
                  onClick={handleCancelConfirm}
                  disabled={cancellingId !== null}
                  className="flex-1 py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-2xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-rose-100 transition-all active:scale-98 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {cancellingId !== null ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    'Cancel Booking'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default MyReservations
