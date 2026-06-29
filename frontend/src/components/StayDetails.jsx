import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import api, { BACKEND_URL } from '../api/axios'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

const StayDetails = ({ user, onLogout }) => {
  const { id } = useParams()
  const [stay, setStay] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [checkIn, setCheckIn] = useState(new Date())
  const [checkOut, setCheckOut] = useState(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow
  })
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [isGuestOpen, setIsGuestOpen] = useState(false)
  const [reserving, setReserving] = useState(false)
  const [bookingStatus, setBookingStatus] = useState(null) // 'success', 'login', 'error'
  const [bookingMessage, setBookingMessage] = useState('')

  const calculateNights = () => {
    if (!checkIn || !checkOut) return 1
    const diff = checkOut - checkIn
    const nights = Math.ceil(diff / (1000 * 60 * 60 * 24))
    return nights > 0 ? nights : 1
  }

  const numNights = calculateNights()

  const handleCheckInChange = (date) => {
    setCheckIn(date)
    if (date >= checkOut) {
      const nextDay = new Date(date)
      nextDay.setDate(nextDay.getDate() + 1)
      setCheckOut(nextDay)
    }
  }

  const handleCheckOutChange = (date) => {
    if (date <= checkIn) {
      const nextDay = new Date(checkIn)
      nextDay.setDate(nextDay.getDate() + 1)
      setCheckOut(nextDay)
    } else {
      setCheckOut(date)
    }
  }

  const formatDateForAPI = (date) => {
    return date.toISOString().split('T')[0]
  }

  const handleBook = async () => {
    if (!user) {
      setBookingStatus('login')
      setBookingMessage('Please log in to book this stay.')
      return
    }

    const dbId = id.replace('db-', '')

    setReserving(true)
    setBookingStatus(null)

    try {
      // Step 1: Check availability
      const availRes = await api.post(`/stays/${dbId}/availability`, {
        check_in: formatDateForAPI(checkIn),
        check_out: formatDateForAPI(checkOut),
      })

      if (!availRes.data.available) {
        setBookingStatus('error')
        setBookingMessage('This stay is already booked for those dates. Please choose different dates.')
        setReserving(false)
        return
      }

      // Step 2: Create reservation
      const bookNights = numNights
      const bookCleaningFee = parseFloat(stay.cleaning_fee || 0)
      const bookSubtotal = parseFloat(stay.price_per_night) * bookNights
      const bookTotal = bookSubtotal + bookCleaningFee

      await api.post('/reservations', {
        stay_id: parseInt(dbId),
        check_in: formatDateForAPI(checkIn),
        check_out: formatDateForAPI(checkOut),
        adults,
        children,
        nightly_price: parseFloat(stay.price_per_night),
        service_fee: bookCleaningFee,
        total_amount: bookTotal,
        nights: bookNights,
      })

      setBookingStatus('success')
      setBookingMessage('Instant booking confirmed! Your stay has been successfully reserved.')
    } catch (err) {
      if (err.response?.status === 409) {
        setBookingStatus('error')
        setBookingMessage(err.response.data.message)
      } else {
        setBookingStatus('error')
        setBookingMessage('Something went wrong. Please try again.')
      }
    } finally {
      setReserving(false)
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    const fetchStay = async () => {
      if (id) {
        let dbId = id;
        if (id.startsWith('db-')) {
          dbId = id.replace('db-', '');
        }
        try {
          const response = await api.get(`/stays/${dbId}`)
          setStay(response.data)
        } catch (err) {
          console.error("Error fetching stay:", err)
          setError("Could not load property details.")
        } finally {
          setLoading(false)
        }
      }
    }
    fetchStay()
  }, [id])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f9ff]">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Loading Paradise...</p>
      </div>
    </div>
  )

  if (error || !stay) return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f9ff]">
      <div className="text-center space-y-6 max-w-md px-6">
        <span className="material-symbols-outlined text-6xl text-slate-300">error</span>
        <h2 className="text-2xl font-bold text-slate-900">{error || "Property not found"}</h2>
        <Link to="/stays" className="inline-block bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold text-sm shadow-lg shadow-indigo-100">Back to Stays</Link>
      </div>
    </div>
  )

  const mainImageObj = stay.images?.find(img => img.is_main) || stay.images?.[0]
  const mainImage = mainImageObj?.image?.startsWith('http') ? mainImageObj.image : `${BACKEND_URL}${mainImageObj?.image}`
  
  const nights = numNights
  const subtotal = parseFloat(stay.price_per_night) * nights
  const cleaningFee = parseFloat(stay.cleaning_fee || 0)
  const total = subtotal + cleaningFee

  return (
    <div className="bg-[#f9f9ff] min-h-screen font-['Inter'] antialiased">
      <style>{`
        .react-datepicker-wrapper { width: 100%; }
        .react-datepicker__input-container input { 
          background: transparent; 
          border: none; 
          padding: 0; 
          color: #0f172a; 
          font-weight: 700; 
          font-size: 0.875rem; 
          width: 100%; 
          outline: none;
        }
        .react-datepicker-popper {
          z-index: 100 !important;
        }
        .react-datepicker {
          border: 1px solid #f1f5f9 !important;
          border-radius: 1.5rem !important;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05) !important;
          font-family: 'Inter', sans-serif !important;
          overflow: hidden;
        }
        .react-datepicker__header {
          background-color: white !important;
          border-bottom: 1px solid #f1f5f9 !important;
          padding-top: 1rem !important;
        }
        .react-datepicker__navigation {
          top: 1rem !important;
        }
        .react-datepicker__current-month {
          font-weight: 800 !important;
          color: #0f172a !important;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-size: 0.75rem !important;
        }
        .highlight-checkin {
          background-color: #e0e7ff !important;
          color: #4f46e5 !important;
          border-radius: 50% !important;
        }
        .react-datepicker__day--in-range {
          background-color: #4f46e5 !important;
          color: white !important;
        }
        .react-datepicker__day--selected {
          background-color: #4f46e5 !important;
          border-radius: 50%;
        }
      `}</style>
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

          <div className="flex-1 flex items-center justify-end gap-4 font-['Plus_Jakarta_Sans'] text-sm font-medium">
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
        </nav>
      </header>

      <main className="max-w-[1536px] mx-auto px-6 md:px-12 pt-32 pb-20">
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[400px] md:h-[500px] mb-12">
          <div className="md:col-span-2 md:row-span-2 overflow-hidden rounded-[2.5rem] shadow-sm relative group cursor-pointer">
            <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src={mainImage} alt={stay.name} />
            <div className="absolute top-6 left-6 z-10 bg-white/90 backdrop-blur px-5 py-2 rounded-2xl shadow-xl text-indigo-600 font-black text-xs uppercase tracking-widest">{stay.property_type}</div>
          </div>
          {stay.images?.filter(img => !img.is_main || stay.images.length === 1).slice(0, 4).map((img, i) => (
            <div key={i} className="hidden md:block overflow-hidden rounded-[2rem] shadow-sm relative group">
              <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src={img.image.startsWith('http') ? img.image : `${BACKEND_URL}${img.image}`} alt={`Gallery ${i}`} />
              {i === 3 && stay.images.length > 5 && (
                <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center text-white font-bold text-lg">
                  +{stay.images.length - 5} photos
                </div>
              )}
            </div>
          ))}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-16">
            <div>
              <div className="flex items-center gap-3 mb-6">
                {stay.is_superhost && <span className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-2xl font-bold text-[10px] uppercase tracking-widest border border-emerald-100">Superhost</span>}
                {stay.is_highly_rated && <span className="bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-2xl font-bold text-[10px] uppercase tracking-widest border border-indigo-100">Highly Rated</span>}
              </div>
              <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-6">{stay.name}</h1>
              <p className="text-slate-400 font-bold text-sm uppercase tracking-widest flex items-center gap-2 mb-8">
                <span className="material-symbols-outlined text-indigo-600 text-[20px]">location_on</span>
                {stay.location}, {stay.city || ''}, {stay.country || ''}
              </p>
              
              <div className="flex flex-wrap items-center gap-10 py-8 border-y border-slate-100">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-indigo-400">group</span>
                  <span className="text-sm font-bold text-slate-600 uppercase tracking-widest">{stay.guests} Guests</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-indigo-400">bed</span>
                  <span className="text-sm font-bold text-slate-600 uppercase tracking-widest">{stay.bedrooms} Bedrooms</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-indigo-400">bathtub</span>
                  <span className="text-sm font-bold text-slate-600 uppercase tracking-widest">{stay.bathrooms} Baths</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-indigo-400">square_foot</span>
                  <span className="text-sm font-bold text-slate-600 uppercase tracking-widest">{stay.area} m²</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">The Space</h2>
              <p className="text-xl text-slate-500 leading-relaxed font-medium">{stay.description}</p>
              
              <div className="pt-10">
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-8">What this place offers</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {/* Updated to extract name from relational object */}
                  {stay.amenities?.map((a, i) => (
                    <div key={i} className="flex items-center gap-4 text-slate-600 font-bold text-xs uppercase tracking-widest">
                      <span className="material-symbols-outlined text-indigo-600 text-[20px]">check_circle</span>
                      {a.name}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-50 flex items-center gap-8">
              <div className="w-20 h-20 rounded-[2rem] bg-indigo-100 flex items-center justify-center text-indigo-600 text-3xl font-black shadow-inner">
                {stay.host?.name.charAt(0) || "H"}
              </div>
              <div>
                <h4 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Hosted by {stay.host?.name || "Premium Host"}</h4>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4">Member since 2024 • Verified Identity</p>
                <button className="bg-indigo-50 text-indigo-600 px-6 py-2.5 rounded-2xl font-bold text-xs hover:bg-indigo-600 hover:text-white transition-all">Contact Host</button>
              </div>
            </div>

            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">House Rules</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Updated to extract rule text from relational object */}
                {stay.rules?.map((rule, i) => (
                  <div key={i} className="flex items-center gap-4 text-slate-600 font-medium">
                    <span className="material-symbols-outlined text-indigo-400">info</span>
                    {rule.rule}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="sticky top-32 space-y-8">
              <div className="bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-50 p-10">
                <div className="flex items-baseline justify-between mb-10">
                  <div>
                    <span className="text-4xl font-black text-slate-900">${stay.price_per_night}</span>
                    <span className="text-slate-400 font-bold text-xs uppercase tracking-widest"> / night</span>
                  </div>
                  {stay.is_superhost && <div className="bg-indigo-50 px-3 py-1 rounded-xl text-indigo-600 font-bold text-xs">Rare Find</div>}
                </div>

                <div className="space-y-4">
                  {/* Dates Selection block */}
                  <div className="grid grid-cols-2 bg-slate-50 rounded-[1.5rem] border border-slate-100 overflow-hidden">
                    <div className="p-5 border-r border-slate-100">
                      <label className="block text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">Check-in</label>
                      <DatePicker
                        selected={checkIn}
                        onChange={handleCheckInChange}
                        selectsStart
                        startDate={checkIn}
                        endDate={checkOut}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Select Check-in"
                        minDate={new Date()}
                        showOutsideDays={false}
                        popperPlacement="bottom-start"
                        popperModifiers={[
                          {
                            name: "preventOverflow",
                            options: {
                              boundary: "viewport",
                            },
                          },
                        ]}
                      />
                    </div>
                    <div className="p-5">
                      <label className="block text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">Check-out</label>
                      <DatePicker
                        selected={checkOut}
                        onChange={handleCheckOutChange}
                        selectsEnd
                        startDate={checkIn}
                        endDate={checkOut}
                        minDate={checkIn}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="Select Check-out"
                        showOutsideDays={false}
                        popperPlacement="bottom-end"
                        popperModifiers={[
                          {
                            name: "preventOverflow",
                            options: {
                              boundary: "viewport",
                            },
                          },
                        ]}
                        dayClassName={date => 
                          date.getDate() === checkIn?.getDate() && 
                          date.getMonth() === checkIn?.getMonth() &&
                          date.getFullYear() === checkIn?.getFullYear() ? "highlight-checkin" : undefined
                        }
                      />
                    </div>
                  </div>

                  {/* Guest selection block */}
                  <div className="relative">
                    <div 
                      onClick={() => setIsGuestOpen(!isGuestOpen)}
                      className="bg-slate-50 rounded-[1.5rem] border border-slate-100 p-5 relative cursor-pointer hover:bg-slate-100/50 transition-colors group duration-200"
                    >
                      <label className="block text-[10px] uppercase tracking-widest font-black text-slate-400 mb-2">Guests</label>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-900 font-bold text-sm">
                          {adults} Adult{adults > 1 ? 's' : ''}{children > 0 ? `, ${children} Child${children > 1 ? 'ren' : ''}` : ''}
                        </span>
                        <span className={`material-symbols-outlined text-slate-400 group-hover:text-indigo-600 transition-transform ${isGuestOpen ? 'rotate-180' : ''}`}>expand_more</span>
                      </div>
                    </div>

                    {isGuestOpen && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute top-full left-0 right-0 mt-3 bg-white rounded-[2rem] shadow-2xl border border-slate-100 p-8 z-[110] space-y-6"
                      >
                        {/* Adults */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-bold text-slate-900 text-sm">Adults</p>
                            <p className="text-[10px] text-slate-400 font-medium">Age 13+</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setAdults(Math.max(1, adults - 1));
                              }}
                              className="w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:border-indigo-600 hover:text-indigo-600 transition-all active:scale-90"
                            >
                              <span className="material-symbols-outlined text-lg">remove</span>
                            </button>
                            <span className="text-sm font-bold text-slate-900 w-4 text-center">{adults}</span>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                if (adults + children < stay.guests) setAdults(adults + 1);
                              }}
                              disabled={adults + children >= stay.guests}
                              className="w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:border-indigo-600 hover:text-indigo-600 transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <span className="material-symbols-outlined text-lg">add</span>
                            </button>
                          </div>
                        </div>

                        {/* Children */}
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-bold text-slate-900 text-sm">Children</p>
                            <p className="text-[10px] text-slate-400 font-medium">Ages 2-12</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setChildren(Math.max(0, children - 1));
                              }}
                              className="w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:border-indigo-600 hover:text-indigo-600 transition-all active:scale-90"
                            >
                              <span className="material-symbols-outlined text-lg">remove</span>
                            </button>
                            <span className="text-sm font-bold text-slate-900 w-4 text-center">{children}</span>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                if (adults + children < stay.guests) setChildren(children + 1);
                              }}
                              disabled={adults + children >= stay.guests}
                              className="w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:border-indigo-600 hover:text-indigo-600 transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <span className="material-symbols-outlined text-lg">add</span>
                            </button>
                          </div>
                        </div>

                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsGuestOpen(false);
                          }}
                          className="w-full py-3 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all active:scale-95"
                        >
                          Done
                        </button>
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Booking Status Message */}
                {bookingStatus && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mt-6 p-5 rounded-2xl text-sm font-bold flex items-center gap-3 ${
                      bookingStatus === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                      bookingStatus === 'login' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                      'bg-rose-50 text-rose-700 border border-rose-100'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg shrink-0">
                      {bookingStatus === 'success' ? 'check_circle' :
                       bookingStatus === 'login' ? 'lock' : 'error'}
                    </span>
                    <span className="flex-1 leading-normal">{bookingMessage}</span>
                    {bookingStatus === 'login' && (
                      <Link to="/login" className="ml-2 underline font-black shrink-0">Log In</Link>
                    )}
                  </motion.div>
                )}

                {bookingStatus === 'success' ? (
                  <div className="w-full bg-emerald-500 py-6 text-white rounded-[2rem] font-bold text-sm text-center shadow-xl shadow-emerald-100 flex items-center justify-center gap-3 mt-10">
                    <span className="material-symbols-outlined">check_circle</span>
                    Booking Confirmed!
                  </div>
                ) : (
                  <button 
                    onClick={handleBook}
                    disabled={reserving}
                    className="w-full bg-indigo-600 py-6 text-white rounded-[2rem] font-bold text-sm shadow-xl shadow-indigo-100 active:scale-[0.97] transition-all hover:bg-indigo-700 mt-10 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    {reserving ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing booking...
                      </>
                    ) : (
                      'Instant Book'
                    )}
                  </button>
                )}
                
                <p className="text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-4">
                  {bookingStatus === 'success' ? 'Your booking is secured' : 'Safe & Secure Booking'}
                </p>

                <div className="mt-10 pt-10 border-t border-slate-50 space-y-4">
                  <div className="flex justify-between text-sm font-medium text-slate-500">
                    <span>${stay.price_per_night} x {nights} nights</span>
                    <span className="text-slate-900 font-bold">${subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-slate-500">
                    <span>Cleaning fee</span>
                    <span className="text-slate-900 font-bold">${cleaningFee}</span>
                  </div>
                  <div className="flex justify-between pt-4 border-t border-slate-50">
                    <span className="text-lg font-bold text-slate-900">Total</span>
                    <span className="text-2xl font-black text-indigo-600">${total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="bg-emerald-50/50 p-8 rounded-[2.5rem] border border-emerald-100 flex gap-5 items-start">
                <span className="material-symbols-outlined text-emerald-600">verified_user</span>
                <p className="text-emerald-900 text-sm font-bold leading-relaxed">
                  <span className="block mb-1 opacity-60 text-[10px] uppercase tracking-widest">VoyageSmart Protection</span>
                  This property is protected by our global guarantee.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-100 py-20 mt-20">
        <div className="max-w-[1536px] mx-auto px-12 text-center">
          <span className="text-3xl font-black text-indigo-600 mb-8 block">VoyageSmart</span>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Find your place, anywhere in the world.</p>
        </div>
      </footer>
    </div>
  )
}

export default StayDetails
