import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import api, { BACKEND_URL } from '../api/axios'
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

const HotelDetails = ({ user, onLogout }) => {
  const { id } = useParams()
  const [hotel, setHotel] = useState(null)
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
  const [reservationStatus, setReservationStatus] = useState(null) // 'success', 'conflict', 'error', 'login'
  const [reservationMessage, setReservationMessage] = useState('')

  useEffect(() => {
    fetchHotel()
  }, [id])

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

  const handleReserve = async () => {
    // Must be logged in
    if (!user) {
      setReservationStatus('login')
      setReservationMessage('Please log in to make a reservation.')
      return
    }

    // Only real hotels (not static demos)
    if (hotel.id?.toString().startsWith('s')) {
      setReservationStatus('error')
      setReservationMessage('Demo hotels cannot be reserved. Browse our real Casablanca inventory!')
      return
    }

    setReserving(true)
    setReservationStatus(null)

    try {
      // Step 1: Check availability
      const availRes = await api.post(`/hotels/${hotel.id}/availability`, {
        check_in: formatDateForAPI(checkIn),
        check_out: formatDateForAPI(checkOut),
      })

      if (!availRes.data.available) {
        setReservationStatus('conflict')
        setReservationMessage('This hotel is already booked for those dates. Please choose different dates.')
        setReserving(false)
        return
      }

      // Step 2: Create reservation
      const res = await api.post('/reservations', {
        hotel_id: hotel.id,
        check_in: formatDateForAPI(checkIn),
        check_out: formatDateForAPI(checkOut),
        adults,
        children,
        nightly_price: nightlyPrice,
        service_fee: serviceFee,
        total_amount: totalAmount,
        nights: numNights,
      })

      setReservationStatus('success')
      setReservationMessage(`Your reservation is confirmed! You've been assigned ${res.data.reservation.room_number}.`)
    } catch (err) {
      if (err.response?.status === 409) {
        setReservationStatus('conflict')
        setReservationMessage(err.response.data.message)
      } else {
        setReservationStatus('error')
        setReservationMessage('Something went wrong. Please try again.')
      }
    } finally {
      setReserving(false)
    }
  }

  const fetchHotel = async () => {
    if (!id) return
    


    setLoading(true)
    try {
      const res = await api.get(`/hotels/${id}`)
      setHotel(res.data)
      setLoading(false)
    } catch (err) {
      console.error("Error fetching hotel details:", err)
      setError("Unable to retrieve hotel information.")
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="bg-[#f9f9ff] min-h-screen font-['Inter'] antialiased pt-32 animate-pulse">
      <div className="max-w-[1536px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[500px]">
          <div className="md:col-span-2 md:row-span-2 bg-slate-200 rounded-[2.5rem]" />
          <div className="hidden md:block bg-slate-100 rounded-[2rem]" />
          <div className="hidden md:block bg-slate-100 rounded-[2rem]" />
          <div className="hidden md:block bg-slate-100 rounded-[2rem]" />
          <div className="hidden md:block bg-slate-100 rounded-[2rem]" />
        </div>
        <div className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-10">
            <div className="h-4 bg-slate-100 w-1/4 rounded" />
            <div className="h-16 bg-slate-200 w-3/4 rounded-2xl" />
            <div className="h-6 bg-slate-100 w-1/2 rounded" />
            <div className="space-y-4 pt-10">
               <div className="h-4 bg-slate-100 w-full rounded" />
               <div className="h-4 bg-slate-100 w-full rounded" />
               <div className="h-4 bg-slate-100 w-2/3 rounded" />
            </div>
          </div>
          <div className="h-[600px] bg-white rounded-[3rem] shadow-sm border border-slate-50" />
        </div>
      </div>
    </div>
  )

  if (error || !hotel) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f9f9ff] space-y-6">
      <span className="material-symbols-outlined text-6xl text-rose-300">error</span>
      <h2 className="text-2xl font-bold text-slate-900">{error || "Hotel not found"}</h2>
      <Link to="/hotels" className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold">Back to Hotels</Link>
    </div>
  )

  const hotelImage = hotel.image ? (hotel.image.startsWith('http') ? hotel.image : `${BACKEND_URL}${hotel.image}`) : "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070&auto=format&fit=crop"

  const getAmenityIcon = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes('wifi')) return 'wifi';
    if (lower.includes('pool')) return 'pool';
    if (lower.includes('spa')) return 'spa';
    if (lower.includes('fitness') || lower.includes('gym')) return 'fitness_center';
    if (lower.includes('restaurant') || lower.includes('dining')) return 'restaurant';
    if (lower.includes('parking')) return 'local_parking';
    if (lower.includes('room service')) return 'room_service';
    if (lower.includes('bar')) return 'local_bar';
    if (lower.includes('ac') || lower.includes('air conditioning')) return 'ac_unit';
    if (lower.includes('kitchen')) return 'kitchen';
    return 'check_circle';
  };

  const nightlyPrice = hotel ? (hotel.price || 850) : 850
  const serviceFee = numNights * 5
  const totalAmount = (nightlyPrice * numNights) + serviceFee

  return (
    <div className="bg-[#f9f9ff] min-h-screen font-['Inter'] antialiased">
      {/* Dynamic TopNavBar */}
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
        {/* Image Gallery Bento Grid */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[500px]">
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="md:col-span-2 md:row-span-2 overflow-hidden rounded-[2.5rem] shadow-sm relative group cursor-pointer"
          >
            <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" src={hotelImage} alt={hotel.name} />
          </motion.div>
          {hotel.images && hotel.images.length > 0 ? (
            hotel.images.slice(0, 4).map((img, idx) => (
              <div key={img.id} className={`hidden md:block overflow-hidden rounded-[2rem] shadow-sm group cursor-pointer relative ${idx === 3 ? 'relative' : ''}`}>
                <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src={img.image.startsWith('http') ? img.image : `${BACKEND_URL}${img.image}`} alt={`Gallery ${idx}`} />
                {idx === 3 && hotel.images.length > 4 && (
                  <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center group-hover:bg-slate-900/50 transition-colors">
                    <span className="text-white font-bold text-lg">+{hotel.images.length - 4} photos</span>
                  </div>
                )}
              </div>
            ))
          ) : (
            <>
              <div className="hidden md:block overflow-hidden rounded-[2rem] shadow-sm group cursor-pointer">
                <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop" alt="Bedroom" />
              </div>
              <div className="hidden md:block overflow-hidden rounded-[2rem] shadow-sm group cursor-pointer">
                <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://images.unsplash.com/photo-1537996194471-e657df975ab4?q=80&w=2076&auto=format&fit=crop" alt="Pool Area" />
              </div>
              <div className="hidden md:block overflow-hidden rounded-[2rem] shadow-sm group cursor-pointer">
                <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop" alt="Spa" />
              </div>
              <div className="hidden md:block overflow-hidden rounded-[2rem] shadow-sm relative group cursor-pointer">
                <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src="https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=2070&auto=format&fit=crop" alt="Restaurant" />
                <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center group-hover:bg-slate-900/50 transition-colors">
                  <span className="text-white font-bold text-lg">+12 photos</span>
                </div>
              </div>
            </>
          )}
        </section>

        <div className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-16">
            <div>
              <div className="flex items-center gap-3 mb-6">
                {(hotel.is_premier || hotel.id?.toString().startsWith('s')) && (
                  <span className="bg-indigo-600 text-white px-4 py-1.5 rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-indigo-100">Premier Partner</span>
                )}
                <div className="flex text-amber-500">
                  {Array.from({ length: hotel.stars || 5 }).map((_, i) => (
                    <span key={i} className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                  ))}
                </div>
              </div>
              <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">{hotel.name}</h1>
              <p className="flex items-center gap-2 text-slate-500 font-medium text-lg">
                <span className="material-symbols-outlined text-indigo-400">location_on</span>
                {hotel.city}, {hotel.country} • {hotel.location}
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight border-l-8 border-indigo-600 pl-6">About this hotel</h2>
              <p className="text-xl text-slate-600 leading-relaxed font-medium">
                {hotel.description}
              </p>
            </div>

            <div className="space-y-10">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Top Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                {(hotel.amenities && hotel.amenities.length > 0 ? hotel.amenities.map(a => ({ label: a.name, icon: getAmenityIcon(a.name) })) : [
                  { icon: 'wifi', label: 'High-Speed WiFi' },
                  { icon: 'pool', label: 'Infinity Pool' },
                  { icon: 'spa', label: 'Wellness Spa' },
                  { icon: 'fitness_center', label: '24/7 Fitness Hub' },
                  { icon: 'restaurant', label: 'Michelin Dining' },
                  { icon: 'local_parking', label: 'Valet Parking' }
                ]).map((amenity) => (
                  <div key={amenity.label} className="flex items-center gap-5 group">
                    <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                      <span className="material-symbols-outlined text-2xl">{amenity.icon}</span>
                    </div>
                    <span className="text-sm font-bold text-slate-700 uppercase tracking-wide">{amenity.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="space-y-10 pt-10 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Guest Reviews</h2>
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-black text-indigo-600">{hotel.rating || (hotel.stars ? hotel.stars.toFixed(1) : '4.8')}</span>
                  <div className="text-slate-400 font-bold text-xs uppercase tracking-widest">({hotel.reviews_count || '156'} reviews)</div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { name: 'Sarah Jenkins', date: 'May 2026', img: 'https://i.pravatar.cc/150?u=sarah', text: '"The most breathtaking view I\'ve ever experienced. The staff was incredibly attentive."' },
                  { name: 'Marcus Thorne', date: 'April 2026', img: 'https://i.pravatar.cc/150?u=marcus', text: '"Pure luxury. The attention to detail in the room design and the quality of the breakfast was outstanding."' }
                ].map((review) => (
                  <div key={review.name} className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-50 hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-4 mb-6">
                      <img className="w-14 h-14 rounded-2xl" src={review.img} alt={review.name} />
                      <div>
                        <h4 className="font-bold text-slate-900">{review.name}</h4>
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">{review.date}</p>
                      </div>
                    </div>
                    <p className="text-slate-600 leading-relaxed font-medium">{review.text}</p>
                  </div>
                ))}
              </div>
              <button className="w-full py-5 text-indigo-600 font-bold text-sm uppercase tracking-[0.2em] bg-white border border-slate-100 rounded-[2rem] hover:bg-indigo-50 transition-colors">Read all 124 reviews</button>
            </div>
          </div>

          {/* Right Column: Booking Card (Sticky) */}
          <div className="relative">
            <div className="sticky top-32 space-y-8">
              <div className="bg-white rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-slate-50 p-10 overflow-hidden">
                <div className="flex items-baseline justify-between mb-10">
                  <div>
                    <span className="text-4xl font-black text-slate-900">${nightlyPrice}</span>
                    <span className="text-slate-400 font-bold text-xs uppercase tracking-widest"> / night</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-sm text-slate-900 bg-amber-50 px-3 py-1 rounded-xl">
                    <span className="material-symbols-outlined text-amber-500 text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span> {hotel.rating || (hotel.stars ? hotel.stars.toFixed(1) : '4.8')}
                  </div>
                </div>

                <div className="space-y-5">
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
                  <div className="relative">
                    <div 
                      onClick={() => setIsGuestOpen(!isGuestOpen)}
                      className="bg-slate-50 rounded-[1.5rem] border border-slate-100 p-5 relative cursor-pointer hover:bg-slate-100/50 transition-colors group"
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
                              onClick={() => setAdults(Math.max(1, adults - 1))}
                              className="w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:border-indigo-600 hover:text-indigo-600 transition-all active:scale-90"
                            >
                              <span className="material-symbols-outlined text-lg">remove</span>
                            </button>
                            <span className="text-sm font-bold text-slate-900 w-4 text-center">{adults}</span>
                            <button 
                              onClick={() => {
                                if (adults + children < 4) setAdults(adults + 1)
                              }}
                              disabled={adults + children >= 4}
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
                              onClick={() => setChildren(Math.max(0, children - 1))}
                              className="w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:border-indigo-600 hover:text-indigo-600 transition-all active:scale-90"
                            >
                              <span className="material-symbols-outlined text-lg">remove</span>
                            </button>
                            <span className="text-sm font-bold text-slate-900 w-4 text-center">{children}</span>
                            <button 
                              onClick={() => {
                                if (adults + children < 4) setChildren(children + 1)
                              }}
                              disabled={adults + children >= 4}
                              className="w-10 h-10 rounded-xl border border-slate-100 flex items-center justify-center text-slate-400 hover:border-indigo-600 hover:text-indigo-600 transition-all active:scale-90 disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                              <span className="material-symbols-outlined text-lg">add</span>
                            </button>
                          </div>
                        </div>

                        <button 
                          onClick={() => setIsGuestOpen(false)}
                          className="w-full py-3 bg-indigo-50 text-indigo-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-indigo-600 hover:text-white transition-all active:scale-95"
                        >
                          Done
                        </button>
                      </motion.div>
                    )}
                  </div>
                </div>

                <div className="mt-10 space-y-4">
                  {/* Inventory Indicator */}
                  <div className="flex items-center justify-between p-5 bg-slate-50 rounded-[1.5rem] border border-slate-100">
                    <div className="flex items-center gap-3">
                      <span className="material-symbols-outlined text-indigo-400">inventory_2</span>
                      <span className="text-[10px] uppercase tracking-widest font-black text-slate-400">Inventory</span>
                    </div>
                    <span className={`text-xs font-bold ${hotel.available_rooms <= 2 ? 'text-rose-500' : 'text-slate-900'}`}>
                      {hotel.available_rooms} {hotel.available_rooms === 1 ? 'room' : 'rooms'} left
                    </span>
                  </div>

                  {reservationStatus && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-5 rounded-2xl text-sm font-bold flex items-center gap-3 ${
                        reservationStatus === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                        reservationStatus === 'conflict' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                        reservationStatus === 'login' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' :
                        'bg-rose-50 text-rose-700 border border-rose-100'
                      }`}
                    >
                      <span className="material-symbols-outlined text-lg">
                        {reservationStatus === 'success' ? 'check_circle' :
                         reservationStatus === 'conflict' ? 'event_busy' :
                         reservationStatus === 'login' ? 'lock' : 'error'}
                      </span>
                      <span className="flex-1">{reservationMessage}</span>
                      {reservationStatus === 'login' && (
                        <Link to="/login" className="ml-2 underline font-black">Log In</Link>
                      )}
                    </motion.div>
                  )}

                  {reservationStatus === 'success' ? (
                    <div className="w-full bg-emerald-500 py-6 text-white rounded-[2rem] font-bold text-sm text-center shadow-xl shadow-emerald-100 flex items-center justify-center gap-3">
                      <span className="material-symbols-outlined">check_circle</span>
                      Reservation Confirmed
                    </div>
                  ) : (
                    <button 
                      onClick={handleReserve}
                      disabled={reserving}
                      className="w-full bg-indigo-600 py-6 text-white rounded-[2rem] font-bold text-sm shadow-xl shadow-indigo-100 active:scale-[0.97] transition-all hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                    >
                      {reserving ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Checking Availability...
                        </>
                      ) : (
                        'Reserve Your Sanctuary'
                      )}
                    </button>
                  )}
                  <p className="text-center text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                    {reservationStatus === 'success' ? 'Your stay is secured' : "You won't be charged yet"}
                  </p>
                </div>

                <div className="mt-10 pt-10 border-t border-slate-50 space-y-4">
                  <div className="flex justify-between text-sm font-medium text-slate-500">
                    <span>${nightlyPrice} x {numNights} nights</span>
                    <span className="text-slate-900 font-bold">${(nightlyPrice * numNights).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-slate-500">
                    <span>Service fee ($5 x {numNights} nights)</span>
                    <span className="text-slate-900 font-bold">${serviceFee}</span>
                  </div>
                  <div className="flex justify-between pt-4 border-t border-slate-50">
                    <span className="text-lg font-bold text-slate-900">Total</span>
                    <span className="text-2xl font-black text-indigo-600">${totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Smart Tip */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                className="bg-indigo-50/50 p-8 rounded-[2.5rem] border border-indigo-100 flex gap-5 items-start"
              >
                <div className="bg-white p-3 rounded-2xl shadow-sm text-indigo-600">
                  <span className="material-symbols-outlined text-2xl">auto_awesome</span>
                </div>
                <div>
                  <p className="text-indigo-900 text-sm font-bold leading-relaxed">
                    <span className="block mb-1 opacity-60 text-[10px] uppercase tracking-widest">Smart Planner Insight</span>
                    This hotel has available slots for the <span className="text-indigo-600">Santorini Sunset Tour</span> on your dates.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-100 py-20 mt-20">
        <div className="max-w-[1536px] mx-auto px-12 grid grid-cols-1 md:grid-cols-4 gap-12 text-center md:text-left">
          <div className="md:col-span-1">
            <span className="text-2xl font-black text-indigo-600 mb-6 block">VoyageSmart</span>
            <p className="text-slate-400 text-xs font-bold leading-relaxed uppercase tracking-widest">Effortless Discovery. Handcrafted Journeys.</p>
          </div>
          {['Company', 'Community', 'Support'].map(title => (
            <div key={title}>
              <h5 className="text-slate-900 font-bold mb-6 text-sm uppercase tracking-[0.2em]">{title}</h5>
              <ul className="space-y-4">
                {[1, 2].map(i => (
                  <li key={i}><a className="text-slate-400 hover:text-indigo-600 text-xs font-bold transition-colors uppercase tracking-widest" href="#">Link {i}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </footer>
    </div>
  )
}

export default HotelDetails
